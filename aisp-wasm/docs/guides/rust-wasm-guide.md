# AISP Rust WASM Kernel: Comprehensive Guide

**Version:** 0.1.0
**AISP Specification:** 5.1 Platinum
**Target Size:** <8KB binary

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [How It Works](#how-it-works)
4. [Building the Kernel](#building-the-kernel)
5. [Integration Guide](#integration-guide)
6. [API Reference](#api-reference)
7. [AISP Document Format](#aisp-document-format)
8. [Deployment Scenarios](#deployment-scenarios)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What is AISP?

**AISP (AI Symbolic Protocol)** is a self-validating, proof-carrying protocol designed for high-density, low-ambiguity AI-to-AI communication. Think of it as the "assembly language for AI cognition" - providing a formal specification language that AI agents can use to communicate with mathematical precision.

Key properties:
- **Ambiguity < 0.02**: AISP documents have near-zero ambiguity by design
- **Proof-Carrying**: Every document includes evidence blocks (⟦Ε⟧) certifying its validity
- **Category Theory Foundation**: Uses Natural Deduction and Category Theory for formal semantics
- **Quality Tiers**: Documents are graded from ⊘ (reject) to ◊⁺⁺ (platinum)

### What is the Rust WASM Kernel?

The AISP WASM Kernel is an **ultra-condensed implementation** of the AISP 5.1 type-checking specification:

| Feature | Description |
|---------|-------------|
| **Size** | <8KB compiled WASM binary |
| **Runtime** | No heap allocation (`no_std`) |
| **Type Theory** | Based on [lean-agentic](https://crates.io/crates/lean-agentic) |
| **Deployment** | Browser (JavaScript) + Embedded chips (C-ABI) |
| **Validation** | Full AISP 5.1 document validation |

### Use Cases

1. **Browser-Based AI Agents**: Validate AISP documents client-side without server roundtrips
2. **Embedded Systems**: Run on ESP32, RP2040, and other microcontrollers
3. **Edge Computing**: Validate agent communications at the edge with minimal footprint
4. **Zero-Trust Validation**: Cryptographically verify AISP document integrity

---

## Architecture

### Module Structure

```
aisp-wasm/
├── Cargo.toml           # Rust package configuration
├── src/
│   ├── lib.rs          # Main entry point, C-ABI exports
│   ├── arena.rs        # Zero-allocation memory management
│   ├── term.rs         # Dependent type term representation
│   ├── level.rs        # Universe levels (predicativity)
│   ├── symbol.rs       # AISP Σ_512 symbol interning
│   ├── parser.rs       # AISP document parser
│   ├── checker.rs      # Type checking kernel
│   └── validate.rs     # AISP validation rules
├── scripts/
│   ├── build.sh        # Build script
│   ├── aisp-loader.js  # JavaScript loader (<1KB)
│   └── aisp.h          # C/C++ header for chips
└── docs/
    ├── adr/            # Architecture Decision Records
    ├── ddd/            # Domain-Driven Design docs
    └── guides/         # This guide
```

### Memory Layout (8KB Budget)

| Component | Budget | Purpose |
|-----------|--------|---------|
| Type kernel | 3KB | Core type checking (lean-agentic) |
| Term arena | 2KB | Hash-consed term storage |
| Symbol table | 1KB | AISP Σ_512 glossary |
| Validation | 1KB | AISP-specific rules |
| WASM overhead | 1KB | Section headers, exports |

### Type Theory Foundation

The kernel implements dependent type theory from lean-agentic:

```
Terms ::=
  | Sort(Level)           -- Type universes (𝕌₀, 𝕌₁, ...)
  | Var(DeBruijn)         -- Local variables
  | Const(Name, [Level])  -- Global constants
  | App(Term, Term)       -- Application (f x)
  | Lam(Binder, Term)     -- Lambda abstraction (λx.b)
  | Pi(Binder, Term)      -- Dependent function type (Πx:A.B)
  | Let(Binder, Term, Term) -- Let binding
```

---

## How It Works

### 1. Document Parsing

AISP documents follow a strict structure:

```
𝔸1.0.example@2026-01-14    <- Header (required)
γ≔context                  <- Context identifier
ρ≔⟨tags⟩                   <- Reference tags (optional)

⟦Ω:Meta⟧{...}              <- Meta block (required)
⟦Σ:Types⟧{...}             <- Types block (required)
⟦Γ:Rules⟧{...}             <- Rules block (required)
⟦Λ:Funcs⟧{...}             <- Functions block (required)
⟦Ε⟧⟨δ≜...;φ≜...;τ≜...⟩    <- Evidence block (required)
```

### 2. Symbol Recognition

The parser identifies AISP symbols from the Σ_512 glossary:

| Category | Range | Examples |
|----------|-------|----------|
| Ω: Transmuters | 0-63 | ⊤ ⊥ ∧ ∨ ¬ → ↔ ⇒ ⊢ ⊨ ≜ ≔ λ ∎ |
| Γ: Topologics | 64-127 | ∈ ⊆ ∩ ∪ ∅ 𝒫 ψ δ φ τ ε |
| ∀: Quantifiers | 128-191 | ∀ ∃ Π Σ ⊕ ⊖ ⊗ ◊ |
| 𝔻: Domaines | 256-319 | ℕ ℤ ℝ ℚ 𝔹 𝕊 |
| ⟦⟧: Delimiters | 384-447 | ⟦ ⟧ ⟨ ⟩ 𝔸 Ω Γ Λ Χ Ε Θ |

### 3. Density Computation

The kernel computes the **density score** (δ):

```
δ = |AISP symbols| / |non-whitespace tokens|
```

This measures how much of the document uses formal AISP notation vs. prose.

### 4. Tier Assignment

Based on density, documents are assigned quality tiers:

| Tier | Symbol | Threshold | Meaning |
|------|--------|-----------|---------|
| Platinum | ◊⁺⁺ | δ ≥ 0.75 | Highest density |
| Gold | ◊⁺ | δ ≥ 0.60 | High density |
| Silver | ◊ | δ ≥ 0.40 | Moderate density |
| Bronze | ◊⁻ | δ ≥ 0.20 | Low density |
| Reject | ⊘ | δ < 0.20 | Insufficient AISP |

### 5. Ambiguity Check

AISP requires: **Ambig(D) < 0.02**

The ambiguity formula measures parse uniqueness:
```
Ambig(D) = 1 - |unique_parses| / |total_parses|
```

Valid AISP documents with all required blocks achieve near-zero ambiguity.

---

## Building the Kernel

### Prerequisites

1. **Rust Toolchain** (1.70+)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **WASM Target**
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

3. **Binaryen** (for optimization)
   ```bash
   # npm
   npm install -g binaryen

   # or homebrew
   brew install binaryen

   # or apt
   sudo apt install binaryen
   ```

### Build Steps

```bash
# Navigate to the aisp-wasm directory
cd aisp-wasm

# Make build script executable
chmod +x scripts/build.sh

# Build the kernel
./scripts/build.sh
```

### Build Output

```
Building AISP WASM Kernel
================================
Step 1: Cargo build (release)
Step 2: wasm-opt optimization
Step 3: wasm-strip
================================
Final size: 6892 bytes
✓ Under 8KB limit!

WASM Exports:
  - aisp_init
  - aisp_parse
  - aisp_validate
  - aisp_tier
  - aisp_ambig
  - aisp_density
  - aisp_error_code
  - aisp_error_offset
  - memory

Build complete: target/aisp.wasm
```

### Manual Build (Without Script)

```bash
# Build release
cargo build --release --target wasm32-unknown-unknown

# Optimize for size
wasm-opt -Oz -o target/aisp.wasm \
  target/wasm32-unknown-unknown/release/aisp_wasm.wasm

# Strip debug info
wasm-strip target/aisp.wasm
```

---

## Integration Guide

### Browser Integration (JavaScript)

#### Step 1: Copy Assets

Copy these files to your web project:
- `target/aisp.wasm` → `/public/aisp.wasm` (or similar)
- `scripts/aisp-loader.js` → `/src/aisp-loader.js`

#### Step 2: Initialize AISP

```javascript
import AISP from './aisp-loader.js';

// Initialize with path to WASM file
await AISP.init('/aisp.wasm');
```

#### Step 3: Validate Documents

```javascript
const document = `
𝔸1.0.example@2026-01-14
γ≔test

⟦Ω:Meta⟧{
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  T≜ℕ
}

⟦Γ:Rules⟧{
  ∀x:T:x≥0
}

⟦Λ:Funcs⟧{
  f≜λx.x
}

⟦Ε⟧⟨δ≜0.75;φ≜100;τ≜◊⁺⁺⟩
`;

const result = AISP.validate(document);

console.log(result);
// {
//   valid: true,
//   tier: '◊⁺⁺',
//   tierValue: 4,
//   delta: 0.78,
//   ambiguity: 0.01,
//   errorCode: 0
// }

// Quick helpers
console.log(AISP.isValid(document));   // true
console.log(AISP.getTier(document));   // '◊⁺⁺'
console.log(AISP.getDensity(document)); // 0.78
```

#### Step 4: Error Handling

```javascript
const invalid = "Hello, this is not AISP";

const result = AISP.validate(invalid);
// {
//   valid: false,
//   error: 'Parse error at offset 0',
//   errorCode: -1
// }
```

### Embedded Chip Integration (C/C++)

#### Step 1: Include Header

```c
#include "aisp.h"
```

#### Step 2: Load WASM Module

For chips with WASM runtime (e.g., WASM3, Wasmer embedded):

```c
// Load the WASM binary
uint8_t* wasm_bytes = load_file("/aisp.wasm");
size_t wasm_size = get_file_size("/aisp.wasm");

// Initialize WASM runtime
wasm_runtime_init();
wasm_module_t module = wasm_module_load(wasm_bytes, wasm_size);
wasm_instance_t instance = wasm_instance_create(module);

// Get exports
aisp_init = wasm_get_export(instance, "aisp_init");
aisp_parse = wasm_get_export(instance, "aisp_parse");
aisp_validate = wasm_get_export(instance, "aisp_validate");
// ... etc
```

#### Step 3: Validate Documents

```c
const char* spec = "𝔸1.0.agent@2026-01-14...";

// Initialize kernel
int32_t init_result = aisp_init();
if (init_result != AISP_OK) {
    printf("Init failed: %d\n", init_result);
    return;
}

// Parse document
int32_t doc = aisp_parse((uint8_t*)spec, strlen(spec));
if (doc < 0) {
    printf("Parse error at offset %u\n", aisp_error_offset());
    return;
}

// Validate
if (aisp_validate(doc) == AISP_OK) {
    printf("Valid AISP document!\n");
    printf("  Tier: %d\n", aisp_tier(doc));      // 0-4
    printf("  Delta: %.2f\n", aisp_density(doc)); // 0.0-1.0
    printf("  Ambig: %.2f\n", aisp_ambig(doc));   // Should be <0.02
} else {
    printf("Invalid document: %d\n", aisp_error_code());
}
```

#### Step 4: Platform-Specific Setup

**ESP32 (with WASM3):**
```c
#include "wasm3.h"
#include "m3_env.h"

// Load WASM from flash
extern const uint8_t aisp_wasm_start[] asm("_binary_aisp_wasm_start");
extern const uint8_t aisp_wasm_end[] asm("_binary_aisp_wasm_end");

void setup() {
    IM3Environment env = m3_NewEnvironment();
    IM3Runtime runtime = m3_NewRuntime(env, 8192, NULL);
    IM3Module module;

    m3_ParseModule(env, &module, aisp_wasm_start,
                   aisp_wasm_end - aisp_wasm_start);
    m3_LoadModule(runtime, module);

    // Now use m3_FindFunction() to get AISP exports
}
```

**RP2040 (Raspberry Pi Pico):**
```c
// WASM3 configuration for RP2040
#define WASM_STACK_SIZE 4096
#define WASM_MEMORY_LIMIT 32768

// Include WASM binary in flash
const uint8_t aisp_wasm[] = {
    #include "aisp_wasm.h"  // Generated with xxd -i
};
```

---

## API Reference

### Core Functions

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `aisp_init` | `() -> i32` | 0=success | Initialize kernel state |
| `aisp_parse` | `(*u8, u32) -> i32` | docId or error | Parse AISP document |
| `aisp_validate` | `(i32) -> i32` | 0=valid | Validate parsed document |
| `aisp_tier` | `(i32) -> i32` | 0-4 | Get quality tier |
| `aisp_ambig` | `(i32) -> f32` | 0.0-1.0 | Get ambiguity score |
| `aisp_density` | `(i32) -> f32` | 0.0-1.0 | Get density (δ) |

### Error Functions

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `aisp_error_code` | `() -> i32` | Error code | Last error |
| `aisp_error_offset` | `() -> u32` | Byte offset | Error location |

### Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| 0 | `AISP_OK` | Success |
| -1 | `AISP_ERR_PARSE` | Parse error |
| -2 | `AISP_ERR_TYPE` | Type error |
| -3 | `AISP_ERR_AMBIG` | Ambiguity too high |
| -4 | `AISP_ERR_MEMORY` | Memory error |
| -5 | `AISP_ERR_OVERFLOW` | Buffer overflow |

### Tier Values

| Value | Constant | Symbol | Threshold |
|-------|----------|--------|-----------|
| 0 | `AISP_TIER_REJECT` | ⊘ | δ < 0.20 |
| 1 | `AISP_TIER_BRONZE` | ◊⁻ | δ ≥ 0.20 |
| 2 | `AISP_TIER_SILVER` | ◊ | δ ≥ 0.40 |
| 3 | `AISP_TIER_GOLD` | ◊⁺ | δ ≥ 0.60 |
| 4 | `AISP_TIER_PLATINUM` | ◊⁺⁺ | δ ≥ 0.75 |

### Limits

| Constant | Value | Description |
|----------|-------|-------------|
| `AISP_MAX_DOC_SIZE` | 1024 | Maximum document size (bytes) |
| `AISP_MAX_TERMS` | 128 | Maximum unique terms |
| `AISP_MAX_DEPTH` | 32 | Maximum context depth |

---

## AISP Document Format

### Minimal Template

```
𝔸1.0.name@YYYY-MM-DD
γ≔context

⟦Ω:Meta⟧{
  ;; Meta-level invariants
}

⟦Σ:Types⟧{
  ;; Type definitions
}

⟦Γ:Rules⟧{
  ;; Inference rules
}

⟦Λ:Funcs⟧{
  ;; Function definitions
}

⟦Ε⟧⟨δ≜0.75;φ≜100;τ≜◊⁺⁺⟩
```

### Required Blocks

| Block | Purpose | Example Content |
|-------|---------|-----------------|
| `⟦Ω⟧` | Foundation/meta-logic | `∀D∈AISP:Ambig(D)<0.02` |
| `⟦Σ⟧` | Type definitions | `T≜ℕ; S≜𝕊` |
| `⟦Γ⟧` | Inference rules | `∀x:T:P(x)⇒Q(x)` |
| `⟦Λ⟧` | Core functions | `f≜λx.x; g≜λx.x+1` |
| `⟦Ε⟧` | Evidence/proof | `δ≜0.75;φ≜100;τ≜◊⁺⁺` |

### Optional Blocks

| Block | Purpose |
|-------|---------|
| `⟦Χ⟧` | Error algebra |
| `⟦ℭ⟧` | Category theory |
| `⟦Θ⟧` | Theorems/proofs |
| `⟦ℜ⟧` | Registry |

### Symbol Quick Reference

```
Logic:     ⊤(true) ⊥(false) ∧(and) ∨(or) ¬(not) →(implies) ↔(iff)
Proofs:    ⊢(proves) ⊨(models) ∎(QED)
Defs:      ≜(defas) ≔(assign) ≡(identical)
Quants:    ∀(forall) ∃(exists) λ(lambda) Π(pi) Σ(sigma)
Sets:      ∈(elem) ⊆(subset) ∩(inter) ∪(union) ∅(empty)
Ops:       ⊕(plus) ⊖(minus) ⊗(tensor) ∘(compose)
Domains:   ℕ(nat) ℤ(int) ℝ(real) ℚ(rat) 𝔹(bool) 𝕊(string)
Delims:    ⟦⟧(blocks) ⟨⟩(tuples) ◊(tier)
```

---

## Deployment Scenarios

### Scenario 1: Browser AI Agent

```
┌─────────────────┐    ┌─────────────────┐
│  AI Agent UI    │───▶│  AISP Kernel    │
│  (React/Vue)    │    │  (WASM <8KB)    │
└─────────────────┘    └─────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Agent-to-Agent │    │  Validation     │
│  Communication  │◀──▶│  Results        │
└─────────────────┘    └─────────────────┘
```

**Benefits:**
- Client-side validation (no server roundtrip)
- Works offline
- Reduces backend load

### Scenario 2: Edge IoT Validation

```
┌─────────────────┐    ┌─────────────────┐
│  IoT Device     │───▶│  AISP Kernel    │
│  (ESP32/RP2040) │    │  (WASM <8KB)    │
└─────────────────┘    └─────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Agent Command  │    │  Valid? Execute │
│  Protocol       │───▶│  Invalid? Reject│
└─────────────────┘    └─────────────────┘
```

**Benefits:**
- Validate commands before execution
- Zero-trust agent communication
- Minimal memory footprint

### Scenario 3: API Gateway Validation

```
┌─────────────────┐    ┌─────────────────┐
│  Client         │───▶│  API Gateway    │
│                 │    │  + AISP Kernel  │
└─────────────────┘    └─────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  AISP Spec      │    │  Backend        │
│  Request Body   │───▶│  Service        │
└─────────────────┘    └─────────────────┘
```

**Benefits:**
- Validate request contracts at gateway
- Reject malformed specifications early
- Enforce AISP compliance

---

## Troubleshooting

### Build Issues

**Error: `wasm32-unknown-unknown` target not found**
```bash
rustup target add wasm32-unknown-unknown
```

**Error: `wasm-opt` not found**
```bash
npm install -g binaryen
# or
brew install binaryen
```

**Error: Binary size exceeds 8KB**
- Check for unnecessary dependencies in `Cargo.toml`
- Ensure `opt-level = "z"` is set
- Run `wasm-opt -Oz` on the output
- Use `wasm-strip` to remove debug info

### Runtime Issues

**Parse error at offset 0**
- Document must start with `𝔸` (the AISP header marker)
- Check UTF-8 encoding

**Ambiguity too high (error -3)**
- Missing required blocks (⟦Ω⟧, ⟦Σ⟧, ⟦Γ⟧, ⟦Λ⟧, ⟦Ε⟧)
- Increase AISP symbol density

**Document too large**
- Maximum document size is 1024 bytes
- Split into multiple documents if needed

### JavaScript Issues

**AISP not initialized**
```javascript
// Always await init() before validate()
await AISP.init('/path/to/aisp.wasm');
```

**Memory buffer changed**
```javascript
// The loader handles this automatically, but if accessing
// memory directly, refresh after any call:
const memory = new Uint8Array(AISP._instance.memory.buffer);
```

### Embedded Issues

**WASM3 stack overflow**
```c
// Increase stack size for WASM3
#define WASM_STACK_SIZE 8192
```

**Memory alignment errors**
```c
// Ensure 8-byte alignment for arena
alignas(8) static uint8_t wasm_memory[32768];
```

---

## Additional Resources

### References

- [AISP 5.1 Specification](../../../aisp-open-core-upstream/AI_GUIDE.md) - Full specification
- [lean-agentic Documentation](https://docs.rs/lean-agentic) - Type theory foundation
- [Rust WASM Book](https://rustwasm.github.io/docs/book/) - WASM development guide
- [WASM3](https://github.com/vshymanskyy/wasm3) - Embedded WASM runtime

### Architecture Decision Records

- [ADR-001: WASM Target Selection](../adr/ADR-001-wasm-target-selection.md)
- [ADR-002: Size Optimization Strategy](../adr/ADR-002-size-optimization-strategy.md)
- [ADR-003: Type Kernel Design](../adr/ADR-003-type-kernel-design.md)
- [ADR-004: Memory Management](../adr/ADR-004-memory-management.md)
- [ADR-005: Browser/Chip Integration](../adr/ADR-005-browser-chip-integration.md)

### Community

- [GitHub Issues](https://github.com/ruvnet/vibecast/issues) - Report bugs
- [AISP Open Core](https://github.com/bar181/aisp-open-core) - Upstream specification

---

*This guide is part of the AISP WASM Kernel project. For updates, check the repository.*
