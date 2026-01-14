# Rosetta Stone Example 01: Definition Binding

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.82 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~15 | 18 | ✓ |

**Embedding Similarity Score:** 0.94 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input

```text
Define a constant x with value 5.
Define a constant y with value 10.
Define a sum function that adds two numbers.
```

## Step 2: Rosetta Stone Lookup

Using the SDK reference package to find symbol mappings:

```bash
# NPX command to lookup prose patterns
npx @aisp/reference rosetta lookup "defined as"
# Result: { symbol: "≜", category: "definition", usage: "T≜⟨...⟩" }

npx @aisp/reference rosetta lookup "function"
# Result: { symbol: "λ", category: "type", usage: "λx.x+1" }
```

**Rust WASM Function (internal):**
```rust
// From rosetta.rs
pub fn lookup_symbol_id(query: &str) -> i32 {
    for entry in ROSETTA_ENTRIES.iter() {
        for prose in entry.prose.iter() {
            if prose.to_lowercase().contains(&query.to_lowercase()) {
                return entry.id as i32;
            }
        }
    }
    -1
}
```

## Step 3: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
Define a constant x with value 5.
Define a constant y with value 10.
Define a sum function that adds two numbers.

ROSETTA MAPPINGS:
- "defined as" → ≜
- "function" → λ
- "constant" → immutable binding with ≜

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧
- Density target: δ ≥ 0.40

Generate AISP document:
```

## Step 4: Generated AISP Output

```aisp
𝔸5.1.constants@2025-01-14
γ≔math.definitions
ρ≔⟨constants,functions,binding⟩

⟦Ω:Meta⟧{
  domain≜constants
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  ℕ≜natural_numbers
  Const⟨T⟩≜⟨value:T,immutable:⊤⟩
}

⟦Γ:Rules⟧{
  ∀c∈Const:c.immutable≡⊤
  ∀x,y∈ℕ:sum(x,y)≡x+y
}

⟦Λ:Funcs⟧{
  x≜5
  y≜10
  sum≜λa.λb.a+b
}

⟦Ε⟧⟨δ≜0.82;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 5: Validation

```bash
# NPX validation command
npx @aisp/validator validate examples/01-definition-binding.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.82,
  "ambiguity": 0.01,
  "errors": []
}
```

**JavaScript Validation (embedded):**
```javascript
const result = validate(aispDocument);
// result.valid = true
// result.tier = '◊⁺⁺'
// result.delta = 0.82
```

## Step 6: Comparison with Reference

**Original Rosetta Stone Entry (from AI_GUIDE.md):**
```
"x defined as 5" ↦ x≜5
```

**Generated Result:**
```
x≜5
y≜10
sum≜λa.λb.a+b
```

**Match Analysis:**
- Direct symbol mapping: ✓ (≜ used correctly)
- Function syntax: ✓ (λ used for anonymous function)
- Type annotations: ✓ (added for completeness)

---

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "..."` | Find symbol mappings |
| 2 | `npx @aisp/reference template get "Λ:func"` | Get function template |
| 3 | `npx @aisp/reference anti-drift --compact` | Get reference for LLM |
| 4 | `npx @aisp/validator validate <file>` | Validate output |
| 5 | `npx @aisp/validator density <file>` | Calculate density |

## Rust Kernel Functions Invoked

```rust
// C-ABI exports used in this example:
aisp_ref_init()           // Initialize reference system
aisp_ref_rosetta_lookup() // Prose → symbol lookup
aisp_ref_template()       // Get block templates
aisp_ref_anti_drift()     // Get anti-drift reference
```
