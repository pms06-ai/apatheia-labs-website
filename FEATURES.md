# Cargo Features Guide

This document explains the available Cargo features and how to use them.

## Available Features

### `custom-protocol` (default)
Enables Tauri's custom protocol for production builds. Required for serving assets in production.

**When to disable:** Never in production. Only for very specific development scenarios.

```bash
# Build without custom-protocol (not recommended)
cargo build --manifest-path src-tauri/Cargo.toml --no-default-features
```

### `cloud-storage` (default)
Enables cloud storage integration (Google Drive, OneDrive) with OAuth authentication.

**Dependencies affected:**
- `rand` - Random number generation for PKCE
- `base64` - Base64 encoding for OAuth
- `url` - URL parsing for OAuth flows
- `lazy_static` - Static OAuth configurations

**Modules enabled:**
- `src-tauri/src/cloud/` - Cloud storage clients
- `src-tauri/src/commands/cloud.rs` - Cloud IPC commands

**When to disable:** When building lightweight versions without cloud storage support, or for embedded/restricted environments.

```bash
# Build without cloud storage
cargo build --manifest-path src-tauri/Cargo.toml --no-default-features --features custom-protocol

# Or using feature flags
cargo build --manifest-path src-tauri/Cargo.toml --features custom-protocol
```

### `vendored-tls`
Uses a vendored (statically linked) version of OpenSSL instead of system OpenSSL.

**When to enable:**
- CI/CD builds for consistent OpenSSL across systems
- Static binary builds
- Environments without OpenSSL installed
- Cross-compilation scenarios

**Trade-offs:**
- ✅ More portable binaries
- ✅ No runtime OpenSSL dependency
- ❌ Longer compile times
- ❌ Larger binary size

```bash
# Build with vendored OpenSSL
cargo build --manifest-path src-tauri/Cargo.toml --features vendored-tls

# Production build with vendored TLS
npm run tauri:build -- --features vendored-tls
```

### `dev`
Reserved for development-only features. Currently empty but available for future use.

## Feature Combinations

### Default (Recommended)
```bash
cargo build --manifest-path src-tauri/Cargo.toml
# Enables: custom-protocol, cloud-storage
```

### Minimal Build
```bash
cargo build --manifest-path src-tauri/Cargo.toml --no-default-features --features custom-protocol
# Only core functionality, no cloud storage
```

### CI/CD Build
```bash
cargo build --manifest-path src-tauri/Cargo.toml --release --features vendored-tls
# Production build with static OpenSSL
```

### Development Build
```bash
cargo build --manifest-path src-tauri/Cargo.toml --features dev
# Development features enabled
```

## Optimizations

### Tokio Runtime
The project uses optimized Tokio features instead of `tokio = { features = ["full"] }`:

```toml
tokio = { features = [
    "rt-multi-thread",  # Multi-threaded runtime
    "macros",           # #[tokio::main] and #[tokio::test]
    "sync",             # Mutex, RwLock, channels
    "time",             # sleep, timeout
    "process",          # Command spawning
    "io-util",          # AsyncRead/AsyncWrite utilities
    "fs"                # Async file operations
]}
```

**Benefits:**
- Faster compile times (only needed features)
- Smaller binary size
- Reduced dependency tree

## Checking Feature-Specific Builds

```bash
# Check default features
cargo check --manifest-path src-tauri/Cargo.toml

# Check without cloud-storage
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features --features custom-protocol

# Check all features
cargo check --manifest-path src-tauri/Cargo.toml --all-features

# List all features
cargo tree --manifest-path src-tauri/Cargo.toml --format "{p} {f}"
```

## Adding New Features

When adding optional functionality:

1. **Add dependencies as optional:**
   ```toml
   new_dep = { version = "1.0", optional = true }
   ```

2. **Create feature flag:**
   ```toml
   [features]
   my-feature = ["dep:new_dep"]
   ```

3. **Add conditional compilation:**
   ```rust
   #[cfg(feature = "my-feature")]
   pub mod my_module;
   ```

4. **Document in this file** and update CLAUDE.md

## Binary Size Comparison

| Feature Set | Binary Size (approx) |
|-------------|---------------------|
| Default | ~45 MB |
| Minimal (no cloud-storage) | ~43 MB |
| With vendored-tls | ~47 MB |

*Sizes are approximate and vary by platform and build mode*
