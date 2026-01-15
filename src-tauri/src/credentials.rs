//! Secure credential storage using OS keyring.
//!
//! Stores API keys and other sensitive credentials in the system's
//! secure credential storage (Windows Credential Manager, macOS Keychain,
//! Linux Secret Service).

use keyring::Entry;

const SERVICE_NAME: &str = "phronesis";

/// Store an API key securely in the system keyring.
pub fn store_api_key(key_name: &str, value: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, key_name)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    entry
        .set_password(value)
        .map_err(|e| format!("Failed to store credential: {}", e))
}

/// Retrieve an API key from the system keyring.
/// Returns Ok(None) if the key doesn't exist.
pub fn get_api_key(key_name: &str) -> Result<Option<String>, String> {
    let entry = Entry::new(SERVICE_NAME, key_name)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    match entry.get_password() {
        Ok(password) => Ok(Some(password)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(format!("Failed to retrieve credential: {}", e)),
    }
}

/// Delete an API key from the system keyring.
/// Returns Ok(()) if the key was deleted or didn't exist.
pub fn delete_api_key(key_name: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, key_name)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    match entry.delete_credential() {
        Ok(()) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()), // Already deleted
        Err(e) => Err(format!("Failed to delete credential: {}", e)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_store_and_retrieve_key() {
        let test_key_name = "test_anthropic_api_key_phronesis";
        let test_value = "sk-ant-test-key-12345";

        // Store
        let store_result = store_api_key(test_key_name, test_value);
        // Skip test if keyring not available (CI environments)
        if store_result.is_err() {
            eprintln!("Skipping keyring test - keyring not available");
            return;
        }

        // Retrieve
        let retrieved = get_api_key(test_key_name).expect("Failed to get key");
        assert_eq!(retrieved, Some(test_value.to_string()));

        // Delete
        delete_api_key(test_key_name).expect("Failed to delete key");

        // Verify deleted
        let after_delete = get_api_key(test_key_name).expect("Failed to check key");
        assert_eq!(after_delete, None);
    }
}
