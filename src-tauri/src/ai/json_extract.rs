//! JSON extraction from AI responses
//!
//! Handles various formats that AI models might return JSON in, including:
//! - Direct JSON (starts with { or [)
//! - Markdown code blocks (```json ... ```)
//! - Embedded JSON in surrounding text

use once_cell::sync::Lazy;
use regex::Regex;

// Pre-compiled regexes for JSON extraction
static RE_JSON_CODE_BLOCK: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"```(?:json)?\s*\n?([\s\S]*?)\n?```").expect("Invalid JSON code block regex")
});

/// Extract JSON from AI response, handling various formats
///
/// Tries multiple strategies in order:
/// 1. Direct JSON (content starts with { or [)
/// 2. Markdown code block (```json ... ```)
/// 3. First balanced JSON object/array in text
pub fn extract_json(content: &str) -> Result<&str, String> {
    let trimmed = content.trim();

    // Strategy 1: Direct JSON (most common for well-behaved models)
    if trimmed.starts_with('{') || trimmed.starts_with('[') {
        // Find the end of the JSON (balanced braces)
        if let Some(end) = find_json_end(trimmed) {
            return Ok(&trimmed[..end]);
        }
        // If we can't find balanced end, return whole thing and let serde fail
        return Ok(trimmed);
    }

    // Strategy 2: Extract from ```json ... ``` code block
    if let Some(caps) = RE_JSON_CODE_BLOCK.captures(content) {
        if let Some(json_match) = caps.get(1) {
            let extracted = json_match.as_str().trim();
            if !extracted.is_empty() {
                return Ok(extracted);
            }
        }
    }

    // Strategy 3: Find first JSON object/array in text
    if let Some(start) = content.find('{') {
        if let Some(end) = find_json_end(&content[start..]) {
            let candidate = &content[start..start + end];
            if is_likely_json(candidate) {
                return Ok(candidate);
            }
        }
    }

    if let Some(start) = content.find('[') {
        if let Some(end) = find_json_end(&content[start..]) {
            let candidate = &content[start..start + end];
            if is_likely_json(candidate) {
                return Ok(candidate);
            }
        }
    }

    Err(format!(
        "Could not extract JSON from response. First 200 chars: {}",
        &content[..content.len().min(200)]
    ))
}

/// Find the end index of a balanced JSON structure
fn find_json_end(s: &str) -> Option<usize> {
    let mut depth = 0i32;
    let mut in_string = false;
    let mut escape_next = false;

    let chars: Vec<char> = s.chars().collect();
    let mut byte_pos = 0;

    for (idx, &c) in chars.iter().enumerate() {
        if escape_next {
            escape_next = false;
            byte_pos += c.len_utf8();
            continue;
        }

        match c {
            '\\' if in_string => {
                escape_next = true;
            }
            '"' => {
                in_string = !in_string;
            }
            '{' | '[' if !in_string => {
                depth += 1;
            }
            '}' | ']' if !in_string => {
                depth -= 1;
                if depth == 0 {
                    // Return byte position after this character
                    return Some(byte_pos + c.len_utf8());
                }
            }
            _ => {}
        }

        byte_pos += c.len_utf8();

        // Safety check - if we've gone negative, something's wrong
        if depth < 0 {
            return None;
        }

        // Don't search forever
        if idx > 100_000 {
            return None;
        }
    }

    None
}

/// Check if a string looks like valid JSON (basic heuristic)
fn is_likely_json(s: &str) -> bool {
    let trimmed = s.trim();

    // Must start with { or [
    if !trimmed.starts_with('{') && !trimmed.starts_with('[') {
        return false;
    }

    // Must end with } or ]
    if !trimmed.ends_with('}') && !trimmed.ends_with(']') {
        return false;
    }

    // Try to parse it - this is the definitive check
    serde_json::from_str::<serde_json::Value>(trimmed).is_ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_direct_json_object() {
        let input = r#"{"key": "value"}"#;
        assert_eq!(extract_json(input).unwrap(), input);
    }

    #[test]
    fn test_direct_json_array() {
        let input = r#"[1, 2, 3]"#;
        assert_eq!(extract_json(input).unwrap(), input);
    }

    #[test]
    fn test_json_with_whitespace() {
        let input = "  \n  {\"key\": \"value\"}  \n  ";
        let result = extract_json(input).unwrap();
        assert!(result.contains("\"key\""));
    }

    #[test]
    fn test_markdown_code_block() {
        let input = r#"Here's the result:

```json
{"findings": [1, 2, 3]}
```

Hope that helps!"#;
        let result = extract_json(input).unwrap();
        assert!(result.contains("findings"));
    }

    #[test]
    fn test_markdown_code_block_no_lang() {
        let input = r#"Result:

```
{"data": "test"}
```
"#;
        let result = extract_json(input).unwrap();
        assert!(result.contains("data"));
    }

    #[test]
    fn test_embedded_json() {
        let input = r#"Based on analysis, {"result": "success", "count": 5} is the output."#;
        let result = extract_json(input).unwrap();
        assert!(result.contains("result"));
        assert!(result.contains("success"));
    }

    #[test]
    fn test_nested_json() {
        let input = r#"{"outer": {"inner": {"deep": true}}}"#;
        assert_eq!(extract_json(input).unwrap(), input);
    }

    #[test]
    fn test_json_with_escaped_quotes() {
        let input = r#"{"message": "He said \"hello\""}"#;
        assert_eq!(extract_json(input).unwrap(), input);
    }

    #[test]
    fn test_no_json() {
        let input = "This is just plain text with no JSON.";
        assert!(extract_json(input).is_err());
    }

    #[test]
    fn test_complex_json() {
        let input = r#"
{
    "contradictions": [
        {
            "type": "direct",
            "severity": "high",
            "claim1": "Event at 9am",
            "claim2": "Event at 2pm"
        }
    ],
    "summary": {
        "total": 1,
        "critical": 0
    }
}
"#;
        let result = extract_json(input).unwrap();
        assert!(result.contains("contradictions"));
        assert!(result.contains("summary"));
    }
}
