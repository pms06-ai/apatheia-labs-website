//! S.A.M. (Systematic Adversarial Methodology) Module
//!
//! Four-phase cascade analysis:
//! 1. ANCHOR - Identify false premise origin points
//! 2. INHERIT - Track claim propagation without verification
//! 3. COMPOUND - Document authority accumulation
//! 4. ARRIVE - Map catastrophic outcomes to false premises

pub mod executor;

pub use executor::{SAMExecutor, SAMPhase, SAMConfig};
