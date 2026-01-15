//! Complaint Generation Module
//!
//! Generates regulatory complaints from analysis findings.
//! Supports multiple regulatory bodies with specific templates.

pub mod generator;
pub mod templates;

pub use generator::{
    ComplaintGenerator, ComplaintRequest, ComplaintOutput, ComplaintFormat,
    RegulatoryBody, ComplaintSection, EvidenceItem,
};

pub use templates::{
    OfcomTemplate, IcoTemplate, HcpcTemplate, LgoTemplate,
    ComplaintTemplate,
};
