//! File storage module for Phronesis FCIP
//! 
//! Handles local file storage for documents.

use sha2::{Sha256, Digest};
use std::path::PathBuf;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum StorageError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("File not found: {0}")]
    NotFound(String),
}

pub type StorageResult<T> = Result<T, StorageError>;

/// File storage manager
pub struct Storage {
    base_path: PathBuf,
}

impl Storage {
    /// Create a new storage manager
    pub fn new(base_path: PathBuf) -> Self {
        // Ensure base directory exists
        std::fs::create_dir_all(&base_path).ok();
        Self { base_path }
    }

    /// Get the documents directory path
    pub fn documents_dir(&self) -> PathBuf {
        let path = self.base_path.join("documents");
        std::fs::create_dir_all(&path).ok();
        path
    }

    /// Store a file and return its hash and storage path
    pub fn store_file(&self, case_id: &str, filename: &str, data: &[u8]) -> StorageResult<(String, PathBuf)> {
        // Calculate SHA256 hash
        let hash = Self::calculate_hash(data);
        
        // Create case directory
        let case_dir = self.documents_dir().join(case_id);
        std::fs::create_dir_all(&case_dir)?;
        
        // Store file
        let file_path = case_dir.join(filename);
        std::fs::write(&file_path, data)?;
        
        log::info!("Stored file: {} ({})", file_path.display(), hash);
        
        Ok((hash, file_path))
    }

    /// Read a file from storage
    pub fn read_file(&self, storage_path: &std::path::Path) -> StorageResult<Vec<u8>> {
        if !storage_path.exists() {
            return Err(StorageError::NotFound(storage_path.to_string_lossy().to_string()));
        }
        Ok(std::fs::read(storage_path)?)
    }

    /// Delete a file from storage
    pub fn delete_file(&self, storage_path: &str) -> StorageResult<()> {
        let path = PathBuf::from(storage_path);
        if path.exists() {
            std::fs::remove_file(path)?;
        }
        Ok(())
    }

    /// Calculate SHA256 hash of data
    pub fn calculate_hash(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}

