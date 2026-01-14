# AISP WASM Quick Start Guide

Get up and running with the AISP WASM Kernel in 5 minutes.

---

## Prerequisites

```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# WASM target
rustup target add wasm32-unknown-unknown

# Binaryen (for optimization)
npm install -g binaryen
```

---

## Build

```bash
cd aisp-wasm
chmod +x scripts/build.sh
./scripts/build.sh

# Output: target/aisp.wasm (<8KB)
```

---

## Browser Usage

### 1. Copy files

```
target/aisp.wasm       → your-project/public/aisp.wasm
scripts/aisp-loader.js → your-project/src/aisp-loader.js
```

### 2. Use in JavaScript

```javascript
import AISP from './aisp-loader.js';

// Initialize once
await AISP.init('/aisp.wasm');

// Validate AISP documents
const result = AISP.validate(`
𝔸1.0.test@2026-01-14
γ≔example

⟦Ω:Meta⟧{ ∀D:Ambig(D)<0.02 }
⟦Σ:Types⟧{ T≜ℕ }
⟦Γ:Rules⟧{ ∀x:T:x≥0 }
⟦Λ:Funcs⟧{ f≜λx.x }
⟦Ε⟧⟨δ≜0.75;φ≜100;τ≜◊⁺⁺⟩
`);

console.log(result.valid);  // true
console.log(result.tier);   // '◊⁺⁺'
console.log(result.delta);  // 0.78
```

---

## Embedded Usage (C/C++)

### 1. Include header

```c
#include "aisp.h"
```

### 2. Validate documents

```c
const char* spec = "𝔸1.0.agent@2026-01-14...";

aisp_init();

int32_t doc = aisp_parse((uint8_t*)spec, strlen(spec));
if (doc >= 0 && aisp_validate(doc) == AISP_OK) {
    printf("Tier: %d, Delta: %.2f\n",
           aisp_tier(doc),
           aisp_density(doc));
}
```

---

## API Summary

| Function | Description | Returns |
|----------|-------------|---------|
| `aisp_init()` | Initialize kernel | 0 = success |
| `aisp_parse(ptr, len)` | Parse document | docId or error |
| `aisp_validate(doc)` | Validate document | 0 = valid |
| `aisp_tier(doc)` | Get quality tier | 0-4 |
| `aisp_density(doc)` | Get density (δ) | 0.0-1.0 |
| `aisp_ambig(doc)` | Get ambiguity | 0.0-1.0 |

---

## Quality Tiers

| Tier | Symbol | Threshold |
|------|--------|-----------|
| Platinum | ◊⁺⁺ | δ ≥ 0.75 |
| Gold | ◊⁺ | δ ≥ 0.60 |
| Silver | ◊ | δ ≥ 0.40 |
| Bronze | ◊⁻ | δ ≥ 0.20 |
| Reject | ⊘ | δ < 0.20 |

---

## Required AISP Blocks

Every valid AISP document needs:
- `⟦Ω⟧` - Meta/foundation
- `⟦Σ⟧` - Type definitions
- `⟦Γ⟧` - Inference rules
- `⟦Λ⟧` - Functions
- `⟦Ε⟧` - Evidence

---

## Next Steps

- [Full Guide](./rust-wasm-guide.md) - Comprehensive documentation
- [AISP Specification](../../../aisp-open-core-upstream/AI_GUIDE.md) - Protocol details
- [ADR Documents](../adr/) - Architecture decisions
