//! Text extraction from various document formats

use log::{info, warn};
use once_cell::sync::Lazy;
use regex::Regex;
use std::io::{Cursor, Read};
use thiserror::Error;

// Pre-compiled regexes to avoid runtime panics
static RE_HTML_TAGS: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"<[^>]+>").expect("Invalid HTML tag regex")
});
static RE_WHITESPACE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"\s+").expect("Invalid whitespace regex")
});
static RE_NEWLINES: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"\n{3,}").expect("Invalid newlines regex")
});

#[derive(Error, Debug)]
pub enum TextExtractorError {
    #[error("Unsupported file type: {0}")]
    UnsupportedType(String),

    #[error("PDF extraction failed: {0}")]
    PdfError(String),

    #[error("DOCX extraction failed: {0}")]
    DocxError(String),

    #[error("Text decoding failed: {0}")]
    DecodingError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

/// Extract text from document based on MIME type
pub fn extract_text(mime_type: &str, data: &[u8]) -> Result<String, TextExtractorError> {
    let mime = mime_type.to_lowercase();
    
    info!("Extracting text from document with MIME type: {}", mime);
    
    match mime.as_str() {
        // PDF
        "application/pdf" => extract_pdf(data),
        
        // Plain text
        "text/plain" | "text/markdown" | "text/csv" => extract_plain_text(data),
        
        // HTML (strip tags)
        "text/html" => extract_html(data),
        
        // JSON (pretty print)
        "application/json" => extract_json(data),
        
        // Office documents - DOCX
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => extract_docx(data),

        // RTF (basic support)
        "application/rtf" | "text/rtf" => extract_rtf(data),
        
        // Unknown - try as text
        _ => {
            warn!("Unknown MIME type: {}, attempting text extraction", mime);
            extract_plain_text(data).or_else(|_| {
                Err(TextExtractorError::UnsupportedType(mime.to_string()))
            })
        }
    }
}

/// Extract text from PDF documents
fn extract_pdf(data: &[u8]) -> Result<String, TextExtractorError> {
    use pdf_extract::extract_text_from_mem;
    
    match extract_text_from_mem(data) {
        Ok(text) => {
            // Clean up extracted text
            let cleaned = clean_text(&text);
            info!("Extracted {} characters from PDF", cleaned.len());
            Ok(cleaned)
        }
        Err(e) => {
            Err(TextExtractorError::PdfError(e.to_string()))
        }
    }
}

/// Extract plain text with encoding detection
fn extract_plain_text(data: &[u8]) -> Result<String, TextExtractorError> {
    // Try UTF-8 first
    if let Ok(text) = std::str::from_utf8(data) {
        return Ok(clean_text(text));
    }
    
    // Try UTF-16 LE (Windows)
    if data.len() >= 2 && data[0] == 0xFF && data[1] == 0xFE {
        let chars: Vec<u16> = data[2..]
            .chunks_exact(2)
            .map(|chunk| u16::from_le_bytes([chunk[0], chunk[1]]))
            .collect();
        if let Ok(text) = String::from_utf16(&chars) {
            return Ok(clean_text(&text));
        }
    }
    
    // Try Latin-1 as fallback
    let text: String = data.iter().map(|&b| b as char).collect();
    Ok(clean_text(&text))
}

/// Extract text from HTML by stripping tags
fn extract_html(data: &[u8]) -> Result<String, TextExtractorError> {
    let html = std::str::from_utf8(data)
        .map_err(|e| TextExtractorError::DecodingError(e.to_string()))?;

    // Use pre-compiled regex for tag stripping
    let text = RE_HTML_TAGS.replace_all(html, " ");
    
    // Decode HTML entities
    let text = text
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#39;", "'");
    
    Ok(clean_text(&text))
}

/// Extract and format JSON
fn extract_json(data: &[u8]) -> Result<String, TextExtractorError> {
    let text = std::str::from_utf8(data)
        .map_err(|e| TextExtractorError::DecodingError(e.to_string()))?;
    
    // Try to parse and pretty-print
    if let Ok(value) = serde_json::from_str::<serde_json::Value>(text) {
        if let Ok(pretty) = serde_json::to_string_pretty(&value) {
            return Ok(pretty);
        }
    }
    
    // Return as-is if parsing fails
    Ok(text.to_string())
}

/// Clean and normalize extracted text
fn clean_text(text: &str) -> String {
    // Replace multiple whitespace with single space (using pre-compiled regex)
    let cleaned = RE_WHITESPACE.replace_all(text, " ");

    // Remove control characters except newlines and tabs
    let cleaned: String = cleaned
        .chars()
        .filter(|c| !c.is_control() || *c == '\n' || *c == '\t')
        .collect();

    // Normalize line endings
    let cleaned = cleaned.replace("\r\n", "\n").replace('\r', "\n");

    // Remove excessive newlines (using pre-compiled regex)
    let cleaned = RE_NEWLINES.replace_all(&cleaned, "\n\n");

    cleaned.trim().to_string()
}

/// Extract text from DOCX documents
///
/// DOCX files are ZIP archives containing XML files.
/// The main content is in word/document.xml.
fn extract_docx(data: &[u8]) -> Result<String, TextExtractorError> {
    use quick_xml::events::Event;
    use quick_xml::Reader;
    use zip::ZipArchive;

    let cursor = Cursor::new(data);
    let mut archive =
        ZipArchive::new(cursor).map_err(|e| TextExtractorError::DocxError(e.to_string()))?;

    // Read the main document content
    let mut document_xml = String::new();

    // Try to find and read word/document.xml
    if let Ok(mut file) = archive.by_name("word/document.xml") {
        file.read_to_string(&mut document_xml)
            .map_err(|e| TextExtractorError::DocxError(format!("Failed to read document.xml: {}", e)))?;
    } else {
        return Err(TextExtractorError::DocxError(
            "No document.xml found in DOCX".to_string(),
        ));
    }

    // Parse XML and extract text content
    let mut reader = Reader::from_str(&document_xml);
    reader.config_mut().trim_text(true);

    let mut text_content = Vec::new();
    let mut in_paragraph = false;
    let mut current_paragraph = String::new();

    loop {
        match reader.read_event() {
            Ok(Event::Start(ref e)) => {
                match e.name().as_ref() {
                    b"w:p" => {
                        // Start of paragraph
                        in_paragraph = true;
                        current_paragraph.clear();
                    }
                    b"w:br" | b"w:tab" => {
                        // Line break or tab
                        if in_paragraph {
                            current_paragraph.push(' ');
                        }
                    }
                    _ => {}
                }
            }
            Ok(Event::End(ref e)) => {
                if e.name().as_ref() == b"w:p" {
                    // End of paragraph
                    if !current_paragraph.trim().is_empty() {
                        text_content.push(current_paragraph.trim().to_string());
                    }
                    in_paragraph = false;
                }
            }
            Ok(Event::Text(e)) => {
                if in_paragraph {
                    if let Ok(text) = e.unescape() {
                        current_paragraph.push_str(&text);
                    }
                }
            }
            Ok(Event::Eof) => break,
            Err(e) => {
                warn!("XML parsing error in DOCX: {}", e);
                break;
            }
            _ => {}
        }
    }

    let result = text_content.join("\n\n");
    info!("Extracted {} characters from DOCX", result.len());
    Ok(clean_text(&result))
}

/// Extract text from RTF documents (basic support)
fn extract_rtf(data: &[u8]) -> Result<String, TextExtractorError> {
    // RTF is a complex format; do basic extraction
    let content = std::str::from_utf8(data)
        .map_err(|e| TextExtractorError::DecodingError(e.to_string()))?;

    // Very basic RTF stripping - remove control words and groups
    let mut result = String::new();
    let mut in_group: i32 = 0;
    let mut skip_next = false;

    let chars: Vec<char> = content.chars().collect();
    let mut i = 0;

    while i < chars.len() {
        let c = chars[i];

        if skip_next {
            skip_next = false;
            i += 1;
            continue;
        }

        match c {
            '\\' => {
                // Control word or symbol
                if i + 1 < chars.len() {
                    let next = chars[i + 1];
                    match next {
                        '\'' => {
                            // Hex character - skip for now
                            i += 4;
                            continue;
                        }
                        '{' | '}' | '\\' => {
                            // Escaped character
                            if in_group == 0 {
                                result.push(next);
                            }
                            i += 2;
                            continue;
                        }
                        'n' | 'r' => {
                            // Could be \n or \par - add newline
                            result.push('\n');
                        }
                        _ => {
                            // Skip control word until space or non-alpha
                            while i < chars.len() && chars[i].is_alphanumeric() {
                                i += 1;
                            }
                            continue;
                        }
                    }
                }
            }
            '{' => {
                in_group += 1;
            }
            '}' => {
                in_group = in_group.saturating_sub(1);
            }
            _ => {
                // Regular character - only add if not in special group
                if in_group <= 1 && !c.is_control() {
                    result.push(c);
                }
            }
        }
        i += 1;
    }

    info!("Extracted {} characters from RTF", result.len());
    Ok(clean_text(&result))
}

// ============================================================================
// Paged Text Extraction
// ============================================================================

static RE_PAGE_MARKER: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"<!--\s*Page\s+(\d+)\s*-->").expect("Invalid page marker regex")
});

/// Text with page boundary information for accurate chunk-to-page mapping
#[derive(Debug, Clone)]
pub struct PagedText {
    /// Full concatenated text (page markers removed)
    pub text: String,
    /// Page boundaries: (start_offset, end_offset, page_number)
    pub page_boundaries: Vec<(usize, usize, u32)>,
}

impl PagedText {
    /// Get page number for a given character offset
    pub fn page_for_offset(&self, offset: usize) -> Option<u32> {
        for (start, end, page) in &self.page_boundaries {
            if offset >= *start && offset < *end {
                return Some(*page);
            }
        }
        // If past all boundaries, return last page
        self.page_boundaries.last().map(|(_, _, p)| *p)
    }
}

/// Parse Python OCR output with `<!-- Page N -->` markers
///
/// The Python OCR script inserts HTML comments like `<!-- Page 1 -->` to mark
/// page boundaries. This function extracts those boundaries and removes the markers
/// from the text.
pub fn parse_ocr_with_pages(ocr_output: &str) -> PagedText {
    let mut text = String::new();
    let mut page_boundaries = Vec::new();
    let mut current_page = 1u32;
    let mut current_start = 0usize;

    for line in ocr_output.lines() {
        // Check for page marker
        if let Some(caps) = RE_PAGE_MARKER.captures(line) {
            // Record end of previous page (if we have content)
            if !text.is_empty() && current_start < text.len() {
                page_boundaries.push((current_start, text.len(), current_page));
                current_start = text.len();
            }
            // Update current page from marker
            if let Ok(page_num) = caps[1].parse::<u32>() {
                current_page = page_num;
            }
            // Skip this line (don't include marker in output)
            continue;
        }

        // Skip other HTML comments (e.g., <!-- Source: file.pdf -->)
        if line.trim().starts_with("<!--") && line.trim().ends_with("-->") {
            continue;
        }

        // Append content line
        if !text.is_empty() {
            text.push('\n');
        }
        text.push_str(line);
    }

    // Record final page
    if current_start < text.len() {
        page_boundaries.push((current_start, text.len(), current_page));
    }

    // Ensure at least one page boundary exists
    if page_boundaries.is_empty() && !text.is_empty() {
        page_boundaries.push((0, text.len(), 1));
    }

    PagedText { text, page_boundaries }
}

/// Parse native PDF output where form feed characters (`\x0c`) mark page boundaries
///
/// The pdf-extract crate inserts form feed (0x0C) characters between pages.
/// This function splits on those and tracks page boundaries.
pub fn parse_pdf_with_pages(pdf_text: &str) -> PagedText {
    let mut text = String::new();
    let mut page_boundaries = Vec::new();
    let mut current_page = 1u32;
    let mut current_start = 0usize;

    for (idx, segment) in pdf_text.split('\x0c').enumerate() {
        if segment.is_empty() {
            continue;
        }

        // If not the first page, record previous page boundary
        if idx > 0 && !text.is_empty() {
            page_boundaries.push((current_start, text.len(), current_page));
            current_start = text.len();
            current_page += 1;
            text.push('\n'); // Add separator between pages
        }

        text.push_str(segment);
    }

    // Record final page
    if current_start < text.len() || page_boundaries.is_empty() {
        page_boundaries.push((current_start, text.len().max(1), current_page));
    }

    PagedText { text, page_boundaries }
}

/// Parse any text as a single page (for non-PDF documents)
pub fn parse_single_page(text: &str) -> PagedText {
    PagedText {
        text: text.to_string(),
        page_boundaries: vec![(0, text.len().max(1), 1)],
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_plain_text() {
        let data = b"Hello, world!";
        let result = extract_text("text/plain", data).unwrap();
        assert_eq!(result, "Hello, world!");
    }

    #[test]
    fn test_clean_text() {
        // clean_text replaces all whitespace (including newlines) with single space
        let input = "  Hello   World  \n\n\n\n  Test  ";
        let result = clean_text(input);
        assert_eq!(result, "Hello World Test");
    }

    #[test]
    fn test_parse_ocr_with_pages() {
        let ocr_output = r#"<!-- Source: test.pdf -->

<!-- Page 1 -->
First page content here.
More first page text.

<!-- Page 2 -->
Second page begins.
And continues."#;

        let paged = parse_ocr_with_pages(ocr_output);

        // Should have 2 page boundaries
        assert_eq!(paged.page_boundaries.len(), 2);

        // First boundary should be page 1
        assert_eq!(paged.page_boundaries[0].2, 1);

        // Second boundary should be page 2
        assert_eq!(paged.page_boundaries[1].2, 2);

        // Text should not contain markers
        assert!(!paged.text.contains("<!-- Page"));

        // Page lookup should work
        assert_eq!(paged.page_for_offset(0), Some(1));
        assert_eq!(paged.page_for_offset(paged.text.len() - 1), Some(2));
    }

    #[test]
    fn test_parse_pdf_with_pages() {
        let pdf_text = "Page one content\x0cPage two content\x0cPage three";
        let paged = parse_pdf_with_pages(pdf_text);

        // Should have 3 page boundaries
        assert_eq!(paged.page_boundaries.len(), 3);

        // Pages should be numbered 1, 2, 3
        assert_eq!(paged.page_boundaries[0].2, 1);
        assert_eq!(paged.page_boundaries[1].2, 2);
        assert_eq!(paged.page_boundaries[2].2, 3);

        // Text should not contain form feeds
        assert!(!paged.text.contains('\x0c'));
    }

    #[test]
    fn test_page_for_offset() {
        let paged = PagedText {
            text: "0123456789".to_string(),
            page_boundaries: vec![(0, 5, 1), (5, 10, 2)],
        };

        assert_eq!(paged.page_for_offset(0), Some(1));
        assert_eq!(paged.page_for_offset(4), Some(1));
        assert_eq!(paged.page_for_offset(5), Some(2));
        assert_eq!(paged.page_for_offset(9), Some(2));
        assert_eq!(paged.page_for_offset(100), Some(2)); // Past end returns last
    }
}

