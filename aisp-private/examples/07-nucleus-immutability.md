# Rosetta Stone Example 07: Medium Complexity - Nucleus Immutability

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.83 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~35 | 38 | ✓ |

**Embedding Similarity Score:** 0.91 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input (from AI_GUIDE.md)

```text
If the nucleus changes, the header ID changes (where ID equals SHA256 of nucleus).
This ensures content-addressable storage with tamper detection.
```

## Step 2: Reference AISP (from AI_GUIDE.md ⟦Σ:Rosetta⟧)

```aisp
;; Medium: Nucleus immutability
;; "If nucleus changes, header ID changes (ID=SHA256(nucleus))"
∀p:∂𝒩(p)⇒∂ℋ.id(p); ∀p:ℋ.id(p)≡SHA256(𝒩(p))
```

## Step 3: Rosetta Stone Lookup

```bash
# Lookup key symbols
npx @aisp/reference rosetta lookup "for all"
# Result: { symbol: "∀", usage: "∀x∈S:P(x)" }

npx @aisp/reference rosetta lookup "implies"
# Result: { symbol: "⇒", usage: "P⇒Q" }

npx @aisp/reference rosetta lookup "identical"
# Result: { symbol: "≡", usage: "a≡b" }

# Custom symbols from AISP notation
# ∂ = change/differential operator
# 𝒩 = Nucleus
# ℋ = Header
# 𝒫 = Pocket
```

## Step 4: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
If the nucleus changes, the header ID changes (where ID equals SHA256 of nucleus).
This ensures content-addressable storage with tamper detection.

ROSETTA MAPPINGS:
- "for all" / "every" → ∀
- "if...then" / "implies" → ⇒
- "equals" / "identical" → ≡
- "changes" → ∂ (differential/change operator)

DOMAIN NOTATION (from AISP reference):
- Pocket architecture: 𝒫 = ⟨ℋ:Header, ℳ:Membrane, 𝒩:Nucleus⟩
- ℋ = Header (immutable)
- 𝒩 = Nucleus (immutable content)
- ℳ = Membrane (mutable metadata)

REFERENCE PATTERN:
∀p:∂𝒩(p)⇒∂ℋ.id(p); ∀p:ℋ.id(p)≡SHA256(𝒩(p))

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧

Generate AISP document:
```

## Step 5: Generated AISP Output

```aisp
𝔸5.1.pocket-integrity@2025-01-14
γ≔pocket.cas
ρ≔⟨integrity,immutability,tamper-detection⟩

⟦Ω:Meta⟧{
  domain≜pocket.architecture
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02

  ;; Content-Addressable Storage (CAS)
  ⊢CAS:∀content:id≡hash(content)
}

⟦Σ:Types⟧{
  ;; Pocket architecture types
  𝒫≜⟨ℋ:Header,ℳ:Membrane,𝒩:Nucleus⟩

  ;; Header (immutable)
  ℋ≜⟨id:SHA256,V:Signal,f:𝔹⁶⁴⟩:immutable

  ;; Nucleus (immutable content)
  𝒩≜⟨def:AISP,ir:LLVM,wa:WASM,σ:Sig⟩:immutable

  ;; Membrane (mutable metadata)
  ℳ≜⟨aff:Hash→ℝ,conf:ℝ,tags:𝒫(𝕊),use:ℕ⟩:mutable

  ;; Hash type
  SHA256≜𝔹²⁵⁶
}

⟦Γ:Rules⟧{
  ;; Core immutability rule
  ;; "If nucleus changes, header ID changes"
  ∀p∈𝒫:∂𝒩(p)⇒∂ℋ.id(p)

  ;; CAS identity rule
  ;; "ID equals SHA256 of nucleus"
  ∀p∈𝒫:ℋ.id(p)≡SHA256(𝒩(p))

  ;; Tamper detection
  ∀p∈𝒫:ℋ.id(p)≠SHA256(𝒩(p))⇒tampered(p)

  ;; Membrane changes don't affect ID
  ∀p∈𝒫:∂ℳ(p)⇏∂ℋ.id(p)

  ;; Immutability constraints
  ∀p∈𝒫:created(p)⇒∀t>t₀:𝒩(p,t)≡𝒩(p,t₀)
}

⟦Λ:Funcs⟧{
  ;; Hash computation
  computeId≜λp.SHA256(𝒩(p))

  ;; Integrity verification
  verify≜λp.ℋ.id(p)≡computeId(p)

  ;; Tamper detection
  tampered≜λp.¬verify(p)

  ;; Change detection
  ∂≜λf.λx.f(x,t₁)≠f(x,t₀)

  ;; Quarantine tampered pockets
  quarantine≜λp.tampered(p)⇒isolate(p)
}

⟦Ε⟧⟨δ≜0.83;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 6: Validation

```bash
# Validate
npx @aisp/validator validate examples/07-nucleus-immutability.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.83,
  "ambiguity": 0.01,
  "errors": []
}
```

## Step 7: Comparison with Reference

**Original Rosetta Stone Entry (from AI_GUIDE.md):**
```aisp
∀p:∂𝒩(p)⇒∂ℋ.id(p); ∀p:ℋ.id(p)≡SHA256(𝒩(p))
```

**Generated Core Rules:**
```aisp
∀p∈𝒫:∂𝒩(p)⇒∂ℋ.id(p)
∀p∈𝒫:ℋ.id(p)≡SHA256(𝒩(p))
```

**Pattern Match:**
| Reference Pattern | Generated Pattern | Match |
|-------------------|-------------------|-------|
| ∀p:∂𝒩(p)⇒∂ℋ.id(p) | ∀p∈𝒫:∂𝒩(p)⇒∂ℋ.id(p) | ✓ |
| ∀p:ℋ.id(p)≡SHA256(𝒩(p)) | ∀p∈𝒫:ℋ.id(p)≡SHA256(𝒩(p)) | ✓ |

**Additions (enhanced specification):**
- Tamper detection rule: ∀p:ℋ.id(p)≠SHA256(𝒩(p))⇒tampered(p)
- Membrane independence: ∀p:∂ℳ(p)⇏∂ℋ.id(p)
- Time-invariant immutability: ∀t>t₀:𝒩(p,t)≡𝒩(p,t₀)

---

## Key Concepts Translated

| Prose Concept | AISP Symbol | Meaning |
|---------------|-------------|---------|
| "If X changes" | ∂X | Change/differential operator |
| "implies" | ⇒ | Logical implication |
| "equals" | ≡ | Identity/equivalence |
| "for all pockets" | ∀p∈𝒫 | Universal quantification |
| "header ID" | ℋ.id(p) | Field access on Header |
| "SHA256 of nucleus" | SHA256(𝒩(p)) | Hash function application |

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference anti-drift` | Get CAS architecture reference |
| 2 | `npx @aisp/reference rosetta lookup "implies"` | Map to ⇒ |
| 3 | `npx @aisp/reference blocks` | Get block definitions |
| 4 | `npx @aisp/validator validate <file>` | Validate output |
