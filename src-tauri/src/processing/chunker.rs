//! Text chunking for semantic search
//!
//! Splits documents into overlapping chunks suitable for embedding
//! and retrieval-augmented generation (RAG).

use serde::{Deserialize, Serialize};

/// A chunk of text with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Chunk {
    /// Unique chunk identifier
    pub id: usize,

    /// The text content
    pub text: String,

    /// Start character offset in original document
    pub start_offset: usize,

    /// End character offset in original document
    pub end_offset: usize,

    /// Approximate token count (simple word split)
    pub token_count: usize,

    /// Embedding vector (optional, populated later)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub embedding: Option<Vec<f32>>,

    /// Page number in source document (1-indexed, None if unknown)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page_number: Option<u32>,
}

/// Split text into overlapping chunks
///
/// # Arguments
/// * `text` - The text to chunk
/// * `chunk_size` - Target size in tokens (approximate)
/// * `overlap` - Number of tokens to overlap between chunks
///
/// # Returns
/// Vector of Chunk structs with accurate character offsets
pub fn chunk_text(text: &str, chunk_size: usize, overlap: usize) -> Vec<Chunk> {
    if text.is_empty() {
        return vec![];
    }

    // Build word positions during split - track (word, start_byte_pos)
    // This fixes the bug where text.find() would return the FIRST occurrence
    let mut words_with_positions: Vec<(&str, usize)> = Vec::new();
    let mut pos = 0;

    for word in text.split_whitespace() {
        // Find where this word starts in the original text
        // Starting from current position to handle duplicates correctly
        if let Some(found_pos) = text[pos..].find(word) {
            let actual_pos = pos + found_pos;
            words_with_positions.push((word, actual_pos));
            pos = actual_pos + word.len();
        }
    }

    if words_with_positions.is_empty() {
        return vec![];
    }

    if words_with_positions.len() <= chunk_size {
        // Single chunk for short documents
        return vec![Chunk {
            id: 0,
            text: text.to_string(),
            start_offset: 0,
            end_offset: text.len(),
            token_count: words_with_positions.len(),
            embedding: None,
            page_number: None,
        }];
    }

    let step = chunk_size.saturating_sub(overlap).max(1);
    let mut chunks = Vec::new();
    let mut chunk_id = 0;
    let mut word_idx = 0;

    while word_idx < words_with_positions.len() {
        let end_idx = (word_idx + chunk_size).min(words_with_positions.len());
        let chunk_words = &words_with_positions[word_idx..end_idx];

        // Build chunk text from tracked words
        let chunk_text: String = chunk_words
            .iter()
            .map(|(word, _)| *word)
            .collect::<Vec<_>>()
            .join(" ");

        // Use tracked positions instead of searching
        let start_offset = chunk_words[0].1;
        let last_word = chunk_words.last().unwrap();
        let end_offset = last_word.1 + last_word.0.len();

        chunks.push(Chunk {
            id: chunk_id,
            text: chunk_text,
            start_offset,
            end_offset,
            token_count: chunk_words.len(),
            embedding: None,
            page_number: None,
        });

        chunk_id += 1;
        word_idx += step;

        // Break if we've processed all words
        if end_idx >= words_with_positions.len() {
            break;
        }
    }

    chunks
}

/// Split text into chunks with page number assignment
///
/// # Arguments
/// * `text` - The text to chunk
/// * `chunk_size` - Target size in tokens (approximate)
/// * `overlap` - Number of tokens to overlap between chunks
/// * `page_boundaries` - Page boundaries: (start_offset, end_offset, page_number)
///
/// # Returns
/// Vector of Chunk structs with page numbers assigned
pub fn chunk_text_with_pages(
    text: &str,
    chunk_size: usize,
    overlap: usize,
    page_boundaries: &[(usize, usize, u32)],
) -> Vec<Chunk> {
    let mut chunks = chunk_text(text, chunk_size, overlap);

    // Assign page numbers based on start offset
    for chunk in &mut chunks {
        chunk.page_number = page_boundaries
            .iter()
            .find(|(start, end, _)| chunk.start_offset >= *start && chunk.start_offset < *end)
            .map(|(_, _, page)| *page);
    }

    chunks
}

/// Split text by sentences first, then chunk
pub fn chunk_by_sentences(text: &str, max_chunk_size: usize) -> Vec<Chunk> {
    // Simple sentence boundary detection
    let sentence_endings = regex::Regex::new(r"[.!?]\s+").unwrap();
    let sentences: Vec<&str> = sentence_endings.split(text).collect();

    let mut chunks = Vec::new();
    let mut current_chunk = String::new();
    let mut current_tokens = 0;
    let mut chunk_id = 0;
    let mut start_offset = 0;

    for sentence in sentences {
        let sentence_tokens = sentence.split_whitespace().count();

        if current_tokens + sentence_tokens > max_chunk_size && !current_chunk.is_empty() {
            // Save current chunk
            chunks.push(Chunk {
                id: chunk_id,
                text: current_chunk.trim().to_string(),
                start_offset,
                end_offset: start_offset + current_chunk.len(),
                token_count: current_tokens,
                embedding: None,
                page_number: None,
            });

            chunk_id += 1;
            start_offset += current_chunk.len();
            current_chunk = String::new();
            current_tokens = 0;
        }

        if !current_chunk.is_empty() {
            current_chunk.push(' ');
        }
        current_chunk.push_str(sentence);
        current_tokens += sentence_tokens;
    }

    // Don't forget the last chunk
    if !current_chunk.is_empty() {
        chunks.push(Chunk {
            id: chunk_id,
            text: current_chunk.trim().to_string(),
            start_offset,
            end_offset: start_offset + current_chunk.len(),
            token_count: current_tokens,
            embedding: None,
            page_number: None,
        });
    }

    chunks
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_chunk_text() {
        let text = "one two three four five six seven eight nine ten";
        let chunks = chunk_text(text, 3, 1);

        assert!(!chunks.is_empty());
        assert!(chunks.len() >= 3);

        // First chunk should start with "one"
        assert!(chunks[0].text.starts_with("one"));
    }

    #[test]
    fn test_empty_text() {
        let chunks = chunk_text("", 10, 2);
        assert!(chunks.is_empty());
    }

    #[test]
    fn test_short_text() {
        let text = "short text";
        let chunks = chunk_text(text, 100, 10);

        assert_eq!(chunks.len(), 1);
        assert_eq!(chunks[0].text, "short text");
    }

    #[test]
    fn test_chunk_offset_with_duplicate_words() {
        // This is the critical test case that would fail with the old implementation
        let text = "apple banana apple cherry";
        let chunks = chunk_text(text, 2, 1);

        // chunk 0: "apple banana" starting at 0
        assert_eq!(chunks[0].start_offset, 0);
        assert_eq!(chunks[0].text, "apple banana");

        // chunk 1: "banana apple" starting at 6
        assert_eq!(chunks[1].start_offset, 6);
        assert_eq!(chunks[1].text, "banana apple");

        // chunk 2: "apple cherry" starting at 13 (2nd "apple", NOT 0!)
        assert_eq!(chunks[2].start_offset, 13);
        assert_eq!(chunks[2].text, "apple cherry");
    }

    #[test]
    fn test_chunk_offset_accurate() {
        let text = "The quick brown fox jumps over the lazy dog";
        let chunks = chunk_text(text, 3, 1);

        // Verify each chunk's offset points to correct position in original
        for chunk in &chunks {
            let first_word = chunk.text.split_whitespace().next().unwrap();
            // The text at start_offset should begin with the first word
            assert!(
                text[chunk.start_offset..].starts_with(first_word),
                "Chunk '{}' with start_offset {} does not align with text",
                chunk.text,
                chunk.start_offset
            );
        }
    }

    #[test]
    fn test_chunk_text_with_pages() {
        let text = "Page one content here. Page two content here.";
        // Simulate page boundaries: page 1 from 0-22, page 2 from 22-45
        let boundaries = vec![(0, 22, 1), (22, 45, 2)];

        let chunks = chunk_text_with_pages(text, 3, 1, &boundaries);

        // First chunks should be on page 1
        assert_eq!(chunks[0].page_number, Some(1));

        // Later chunks should be on page 2
        let last_chunk = chunks.last().unwrap();
        assert_eq!(last_chunk.page_number, Some(2));
    }
}
