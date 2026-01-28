//! Schema Generation Binary
//!
//! Generates JSON schemas for all engine result types.
//! Used for type contract validation between Rust and TypeScript.
//!
//! Usage: cargo run --manifest-path src-tauri/Cargo.toml --features schema-gen --bin schema-gen

use phronesis_lib::schema::engine_schemas;
use std::fs;
use std::path::PathBuf;

fn main() {
    println!("Generating JSON schemas for engine result types...\n");

    let collection = engine_schemas::generate_all_schemas();
    let json = collection.to_json();

    // Determine output path
    let output_path = get_output_path();

    // Write to file
    fs::write(&output_path, &json).expect("Failed to write schemas file");

    println!(
        "Generated {} schemas to: {}",
        collection.schemas.len(),
        output_path.display()
    );

    // Also print schema names
    println!("\nSchemas generated:");
    let mut names: Vec<_> = collection.schemas.keys().collect();
    names.sort();
    for name in names {
        println!("  - {}", name);
    }
}

fn get_output_path() -> PathBuf {
    // Try to find the project root
    let candidates = vec![
        PathBuf::from("schemas/rust-schemas.json"),
        PathBuf::from("src-tauri/schemas/rust-schemas.json"),
        PathBuf::from("../schemas/rust-schemas.json"),
    ];

    for candidate in &candidates {
        if let Some(parent) = candidate.parent() {
            if parent.exists() || parent == PathBuf::from("") {
                // Create parent if it doesn't exist
                if !parent.exists() && parent != PathBuf::from("") {
                    fs::create_dir_all(parent).expect("Failed to create schemas directory");
                }
                return candidate.clone();
            }
        }
    }

    // Default: create in current directory
    let default_path = PathBuf::from("schemas");
    fs::create_dir_all(&default_path).expect("Failed to create schemas directory");
    default_path.join("rust-schemas.json")
}
