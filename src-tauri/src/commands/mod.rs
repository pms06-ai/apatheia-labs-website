//! Tauri command handlers for Phronesis FCIP
//!
//! All IPC commands exposed to the frontend.

pub mod analysis;
pub mod cases;
pub mod cloud;
pub mod complaint;
pub mod documents;
pub mod export;
pub mod investigate;
pub mod settings;

pub use analysis::*;
pub use cases::*;
pub use cloud::*;
pub use complaint::*;
pub use documents::*;
pub use export::*;
pub use investigate::*;
pub use settings::*;

