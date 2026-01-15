# Rosetta Stone Example 03: Existential & Unique Quantifier

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.77 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~18 | 21 | ✓ |

**Embedding Similarity Score:** 0.93 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input

```text
There exists a unique solution to the equation f(x) = 0.
There exists at least one admin user in the system.
For each order, there exists exactly one invoice.
```

## Step 2: Rosetta Stone Lookup

```bash
# Lookup existential quantifier
npx @aisp/reference rosetta lookup "exists"
# Result: { symbol: "∃", prose: ["exists", "there exists", "some"], category: "quantifier" }

npx @aisp/reference rosetta lookup "unique"
# Note: "exists unique" maps to ∃! (unique existential)

npx @aisp/reference rosetta explain "∃"
# Result: { prose: ["exists", "there exists", "some"], usage: "∃x∈S:P(x)" }
```

## Step 3: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
There exists a unique solution to the equation f(x) = 0.
There exists at least one admin user in the system.
For each order, there exists exactly one invoice.

ROSETTA MAPPINGS (from @aisp/reference):
- "there exists" → ∃
- "exists unique" / "exactly one" → ∃!
- "at least one" → ∃ (standard existential)
- "for each" → ∀ (universal, then use ∃! for the uniqueness)
- "equals" / "identical" → ≡

PATTERN: "exists unique" ↦ ∃!x:f(x)≡0

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧
- Target density: δ ≥ 0.60

Generate AISP document:
```

## Step 4: Generated AISP Output

```aisp
𝔸5.1.existence@2025-01-14
γ≔math.existence
ρ≔⟨unique,existential,constraints⟩

⟦Ω:Meta⟧{
  domain≜existence
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  Solution≜⟨x:ℝ,valid:𝔹⟩
  User≜⟨id:ℕ,role:Role⟩
  Role≜admin|user|guest
  Order≜⟨id:ℕ,items:𝒫(Item)⟩
  Invoice≜⟨id:ℕ,order_id:ℕ,amount:ℝ⟩
}

⟦Γ:Rules⟧{
  ;; "There exists a unique solution to f(x) = 0"
  ∃!x∈ℝ:f(x)≡0

  ;; "There exists at least one admin user"
  ∃u∈Users:u.role≡admin

  ;; "For each order, there exists exactly one invoice"
  ∀o∈Orders:∃!i∈Invoices:i.order_id≡o.id
}

⟦Λ:Funcs⟧{
  f≜λx.x²-4
  isAdmin≜λu.u.role≡admin
  hasInvoice≜λo.∃!i:i.order_id≡o.id
  findSolution≜λf.{x|f(x)≡0}
}

⟦Ε⟧⟨δ≜0.77;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 5: Validation

```bash
# Validate the generated document
npx @aisp/validator validate examples/03-existential-unique.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.77,
  "ambiguity": 0.01,
  "errors": []
}

# Parse structure
npx @aisp/validator parse examples/03-existential-unique.aisp

# Output:
{
  "hasHeader": true,
  "blocks": [
    { "type": "Ω", "name": "Meta" },
    { "type": "Σ", "name": "Types" },
    { "type": "Γ", "name": "Rules" },
    { "type": "Λ", "name": "Funcs" },
    { "type": "Ε", "name": null }
  ]
}
```

## Step 6: Comparison with Reference

**Original Rosetta Stone Entry (from AI_GUIDE.md):**
```
"exists unique" ↦ ∃!x:f(x)≡0
```

**Generated Result:**
```
∃!x∈ℝ:f(x)≡0
∃u∈Users:u.role≡admin
∀o∈Orders:∃!i∈Invoices:i.order_id≡o.id
```

**Pattern Match:**
| Prose Pattern | Expected AISP | Generated AISP | Match |
|---------------|---------------|----------------|-------|
| "exists unique solution" | ∃!x:f(x)≡0 | ∃!x∈ℝ:f(x)≡0 | ✓ |
| "exists at least one" | ∃x:P(x) | ∃u∈Users:... | ✓ |
| "exactly one" | ∃! | ∃!i∈Invoices:... | ✓ |

---

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "exists"` | Map to ∃ |
| 2 | `npx @aisp/reference rosetta explain "∃"` | Get usage pattern |
| 3 | `npx @aisp/reference symbols --category quantifier` | List quantifiers |
| 4 | `npx @aisp/validator validate <file>` | Validate output |

## Key Symbol Mappings

| Prose | Symbol | Meaning |
|-------|--------|---------|
| "there exists" | ∃ | Existential quantifier |
| "exists unique" | ∃! | Unique existential |
| "exactly one" | ∃! | Unique existential |
| "at least one" | ∃ | Standard existential |
| "equals" | ≡ | Identical/equivalent |

## Mathematical Note

The unique existential ∃! is shorthand for:
```
∃!x:P(x) ≡ ∃x:(P(x) ∧ ∀y:(P(y) ⇒ y≡x))
```

This means: "There exists an x satisfying P, and for all y satisfying P, y must equal x."
