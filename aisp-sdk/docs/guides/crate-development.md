# Crate Development Guide

Guide for developing and publishing AISP SDK Rust crates.

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Optional: wasm-pack for easier builds
cargo install wasm-pack

# Optional: Binaryen for optimization
npm install -g binaryen
```

## Project Structure

```
packages/reference/
├── Cargo.toml        # Rust package manifest
├── src/
│   ├── lib.rs        # Main entry + C-ABI exports
│   ├── anti_drift.rs # Anti-drift documents
│   ├── rosetta.rs    # Rosetta Stone lookups
│   ├── symbols.rs    # Symbol glossary
│   ├── templates.rs  # Block templates
│   └── blocks.rs     # Block definitions
├── bin/
│   └── cli.js        # Node.js CLI wrapper
├── scripts/
│   └── build.sh      # Build script
└── package.json      # NPM package manifest
```

## Cargo.toml Configuration

```toml
[package]
name = "aisp-reference"
version = "0.1.0"
edition = "2021"
description = "AISP 5.1 reference data - anti-drift, Rosetta, templates"
license = "MIT OR Apache-2.0"
repository = "https://github.com/ruvnet/vibecast"

[lib]
crate-type = ["cdylib", "rlib"]

[features]
default = ["std"]
std = []

[profile.release]
opt-level = "z"      # Optimize for size
lto = true           # Link-time optimization
codegen-units = 1    # Single codegen unit
panic = "abort"      # Smaller panic handling
strip = true         # Strip symbols

[profile.release.package."*"]
opt-level = "z"
```

## Writing no_std Compatible Code

### Basic Structure

```rust
#![no_std]

#[cfg(feature = "std")]
extern crate std;

// Panic handler for no_std
#[cfg(not(feature = "std"))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
```

### Static Data Only

```rust
// Use static strings, not heap allocation
pub static SYMBOLS: &[(&str, &str)] = &[
    ("∀", "for all"),
    ("∃", "exists"),
    ("⇒", "implies"),
];

// Use arrays, not Vec
pub static ROSETTA: &[RosettaEntry] = &[
    RosettaEntry { id: 0, symbol: "∀", prose: &["for all", "every"] },
];
```

### C-ABI Exports

```rust
use core::ffi::c_char;

// Output buffer for string results
static mut OUTPUT: [u8; 4096] = [0u8; 4096];

/// Initialize the module
#[no_mangle]
pub extern "C" fn aisp_ref_init() -> i32 {
    // Initialization code
    1 // Success
}

/// Get anti-drift document
/// mode: 0 = full, 1 = compact, 2 = json
#[no_mangle]
pub extern "C" fn aisp_ref_anti_drift(mode: u8) -> *const c_char {
    let result = match mode {
        0 => anti_drift::FULL,
        1 => anti_drift::COMPACT,
        _ => anti_drift::FULL,
    };

    unsafe {
        let bytes = result.as_bytes();
        let len = bytes.len().min(OUTPUT.len() - 1);
        OUTPUT[..len].copy_from_slice(&bytes[..len]);
        OUTPUT[len] = 0;
        OUTPUT.as_ptr() as *const c_char
    }
}
```

## Building WASM

### Using cargo directly

```bash
cd packages/reference

# Build for WASM
cargo build --target wasm32-unknown-unknown --release

# Output: target/wasm32-unknown-unknown/release/aisp_reference.wasm
```

### Build Script

```bash
#!/bin/bash
# scripts/build.sh

set -e

echo "Building AISP Reference WASM..."

# Build
cargo build --target wasm32-unknown-unknown --release --no-default-features

# Copy output
mkdir -p wasm
cp target/wasm32-unknown-unknown/release/aisp_reference.wasm wasm/

# Optimize with wasm-opt (if available)
if command -v wasm-opt &> /dev/null; then
    wasm-opt -Oz wasm/aisp_reference.wasm -o wasm/aisp_reference.wasm
fi

# Show size
ls -lh wasm/aisp_reference.wasm
echo "Build complete!"
```

### Using wasm-pack

```bash
# For NPM package
wasm-pack build --target nodejs --release

# For browser
wasm-pack build --target web --release

# For bundlers
wasm-pack build --target bundler --release
```

## Loading WASM in JavaScript

### Node.js Loader

```javascript
const fs = require('fs');
const path = require('path');

let wasmModule = null;
let wasmMemory = null;

async function loadWasm() {
  if (wasmModule) return wasmModule;

  const wasmPath = path.join(__dirname, '../wasm/aisp_reference.wasm');
  const wasmBuffer = fs.readFileSync(wasmPath);

  wasmMemory = new WebAssembly.Memory({ initial: 1 });

  const imports = {
    env: {
      memory: wasmMemory,
    },
  };

  const { instance } = await WebAssembly.instantiate(wasmBuffer, imports);
  wasmModule = instance.exports;

  // Initialize
  wasmModule.aisp_ref_init();

  return wasmModule;
}

function readString(ptr) {
  const memory = new Uint8Array(wasmMemory.buffer);
  let end = ptr;
  while (memory[end] !== 0) end++;
  return new TextDecoder().decode(memory.slice(ptr, end));
}

// Export functions
module.exports = {
  async antiDrift(mode = 0) {
    const wasm = await loadWasm();
    const ptr = wasm.aisp_ref_anti_drift(mode);
    return readString(ptr);
  },
};
```

### Browser Loader

```javascript
let wasmModule = null;

export async function loadWasm() {
  if (wasmModule) return wasmModule;

  const response = await fetch('./aisp_reference.wasm');
  const wasmBuffer = await response.arrayBuffer();

  const { instance } = await WebAssembly.instantiate(wasmBuffer);
  wasmModule = instance.exports;
  wasmModule.aisp_ref_init();

  return wasmModule;
}
```

## Testing

### Rust Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rosetta_lookup() {
        let result = rosetta::lookup("for all");
        assert!(result.is_some());
        assert_eq!(result.unwrap().symbol, "∀");
    }

    #[test]
    fn test_anti_drift_size() {
        assert!(anti_drift::COMPACT.len() < 2048);
    }

    #[test]
    fn test_required_blocks() {
        let required: Vec<_> = blocks::BLOCKS
            .iter()
            .filter(|b| b.required)
            .collect();
        assert_eq!(required.len(), 5);
    }
}
```

Run tests:
```bash
cargo test
```

### JavaScript Tests

```javascript
const assert = require('assert');
const { antiDrift, rosettaLookup } = require('../dist');

async function runTests() {
  console.log('Test 1: Anti-drift compact size');
  const compact = await antiDrift(1);
  assert(compact.length < 2048, 'Compact should be < 2KB');
  console.log('  ✓ Pass\n');

  console.log('Test 2: Rosetta lookup');
  const result = await rosettaLookup('for all');
  assert.strictEqual(result.symbol, '∀');
  console.log('  ✓ Pass\n');

  console.log('All tests passed!');
}

runTests().catch(console.error);
```

## Publishing

### To crates.io

```bash
# Login
cargo login <your-token>

# Publish
cargo publish

# Or dry-run first
cargo publish --dry-run
```

### To NPM

```bash
# Login
npm login

# Publish
npm publish --access public
```

## Size Optimization

### Current Targets

| Package | Target Size |
|---------|-------------|
| @aisp/reference | < 200KB |
| @aisp/validator | < 50KB |
| @aisp/embeddings | < 1.5MB |

### Optimization Techniques

1. **no_std** - Avoid standard library
2. **Static data** - Use `&'static str` not `String`
3. **LTO** - Link-time optimization
4. **opt-level = "z"** - Optimize for size
5. **wasm-opt** - Post-build optimization
6. **strip** - Remove debug symbols

### Checking Size

```bash
# Check WASM size
ls -lh wasm/*.wasm

# Detailed size analysis
cargo bloat --release --target wasm32-unknown-unknown

# Or with twiggy
twiggy top target/wasm32-unknown-unknown/release/aisp_reference.wasm
```

## Troubleshooting

### Common Issues

**WASM too large**
- Enable LTO in Cargo.toml
- Use `opt-level = "z"`
- Run wasm-opt
- Remove unused dependencies

**Panic in no_std**
- Add panic handler
- Use `panic = "abort"` in profile

**Memory issues**
- Use static buffers
- Avoid heap allocation
- Check memory limits

**Import errors**
- Verify export names match
- Check C-ABI conventions
- Use `#[no_mangle]`

## Resources

- [Rust WASM Book](https://rustwasm.github.io/docs/book/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)
- [no_std Guide](https://docs.rust-embedded.org/book/)
- [wasm-opt](https://github.com/WebAssembly/binaryen)
