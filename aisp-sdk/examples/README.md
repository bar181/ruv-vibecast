# AISP SDK Examples - Rosetta Stone Pipeline

## Overview

This folder contains 9 comprehensive examples demonstrating the complete prose-to-AISP pipeline using the AISP SDK. Each example shows:

1. **Prose Input** - Natural language specification
2. **Rosetta Stone Lookup** - SDK commands for symbol mapping
3. **LLM Conversion Prompt** - Prompt template with anti-drift reference
4. **Generated AISP Output** - The converted formal specification
5. **Validation Results** - SDK validation with metrics
6. **Comparison** - Side-by-side with reference patterns

---

## Validation Summary

| # | Example | Tier | Density (δ) | Valid | Similarity |
|---|---------|------|-------------|-------|------------|
| 01 | Definition Binding | ◊⁺⁺ | 0.82 | ✓ | 0.94 |
| 02 | Universal Quantifier | ◊⁺⁺ | 0.79 | ✓ | 0.96 |
| 03 | Existential & Unique | ◊⁺⁺ | 0.77 | ✓ | 0.93 |
| 04 | Implication Logic | ◊⁺⁺ | 0.81 | ✓ | 0.95 |
| 05 | Function Mapping | ◊⁺⁺ | 0.78 | ✓ | 0.97 |
| 06 | Code Translation | ◊⁺⁺ | 0.80 | ✓ | 0.98 |
| 07 | Nucleus Immutability | ◊⁺⁺ | 0.83 | ✓ | 0.91 |
| 08 | Hebbian Learning | ◊⁺⁺ | 0.79 | ✓ | 0.92 |
| 09 | Pipeline Accuracy | ◊⁺⁺ | 0.85 | ✓ | 0.96 |

**Aggregate Statistics:**
- Total Examples: 9
- All Valid: 9/9 (100%)
- Average Density: 0.80
- Average Tier: ◊⁺⁺ (Platinum)
- Average Similarity: 0.95

---

## Example Categories

### Simple Translations (01-05)

Basic prose-to-AISP patterns from the Rosetta Stone:

| Example | Prose Pattern | AISP Pattern |
|---------|--------------|--------------|
| 01 | "x defined as 5" | x≜5 |
| 02 | "for all x in S, P" | ∀x∈S:P(x) |
| 03 | "exists unique" | ∃!x:f(x)≡0 |
| 04 | "A implies B" | A⇒B |
| 05 | "f maps i to o" | f:I→O, f≜λi.o |

### Code Translations (06)

JavaScript to AISP transformations:

| JavaScript | AISP |
|------------|------|
| `const x = 5` | x≜5 |
| `S.every(x => P(x))` | ∀x∈S:P(x) |
| `if(A){B}` | A⇒B |
| `(x) => y` | λx.y |

### Medium Complexity (07-08)

Domain-specific patterns from AI_GUIDE.md:

| Example | Domain | Key Pattern |
|---------|--------|-------------|
| 07 | Pocket Architecture | ∀p:∂𝒩(p)⇒∂ℋ.id(p) |
| 08 | Hebbian Learning | ⊕(A,B)⇒ℳ.aff[A,B]+=1 |

### Core Concepts (09)

AISP fundamentals with mathematical proofs:

| Concept | Formula |
|---------|---------|
| Ambiguity | Ambig≜λD.1-\|Parse_u\|/\|Parse_t\| |
| Pipeline Accuracy | P(n)≜accuracy^n |
| Improvement | 97× over prose |

---

## SDK Commands Reference

### Symbol Lookup (Rosetta Stone)

```bash
# Lookup prose → symbol
npx @aisp/reference rosetta lookup "for all"
npx @aisp/reference rosetta lookup "implies"
npx @aisp/reference rosetta lookup "defined as"

# Explain symbol → prose
npx @aisp/reference rosetta explain "∀"
npx @aisp/reference rosetta explain "⇒"

# Suggest symbols for prose
npx @aisp/reference rosetta suggest "universal"
```

### Templates

```bash
# List available templates
npx @aisp/reference template list

# Get specific template
npx @aisp/reference template get "Λ:func"
npx @aisp/reference template get "Γ:rule"
npx @aisp/reference template get "minimal"
```

### Anti-Drift Reference

```bash
# Full reference for LLM context
npx @aisp/reference anti-drift

# Compact version (<2KB for prompt injection)
npx @aisp/reference anti-drift --compact
```

### Validation

```bash
# Validate AISP document
npx @aisp/validator validate <file>

# Get density metrics
npx @aisp/validator density <file>

# Calculate tier
npx @aisp/validator tier <file>

# Parse structure
npx @aisp/validator parse <file>
```

---

## Pipeline Steps

### 1. Prose Input
- Capture natural language specification
- Identify key concepts and relationships

### 2. Rosetta Lookup
```bash
npx @aisp/reference rosetta lookup "<key term>"
```

### 3. Get Anti-Drift Reference
```bash
npx @aisp/reference anti-drift --compact
```

### 4. LLM Conversion
- Include anti-drift reference in prompt
- Provide Rosetta mappings
- Specify required output format

### 5. Validation
```bash
npx @aisp/validator validate <output.aisp>
```

### 6. Comparison
- Check pattern match with reference
- Calculate embedding similarity
- Verify density meets tier target

---

## Key Rosetta Mappings

| Prose | Symbol | Category |
|-------|--------|----------|
| "for all" | ∀ | quantifier |
| "exists" | ∃ | quantifier |
| "exists unique" | ∃! | quantifier |
| "implies" | ⇒ | logic |
| "and" | ∧ | logic |
| "or" | ∨ | logic |
| "not" | ¬ | logic |
| "defined as" | ≜ | definition |
| "equals" | ≡ | definition |
| "element of" | ∈ | set |
| "subset" | ⊆ | set |
| "function" | λ | type |
| "maps to" | → | type |

---

## Files

```
examples/
├── README.md                    # This file
├── 01-definition-binding.md     # x≜5
├── 02-universal-quantifier.md   # ∀x∈S:P(x)
├── 03-existential-unique.md     # ∃!x:f(x)≡0
├── 04-implication-logic.md      # A⇒B
├── 05-function-mapping.md       # f≜λi.o
├── 06-code-translation.md       # JS→AISP
├── 07-nucleus-immutability.md   # CAS integrity
├── 08-hebbian-learning.md       # Affinity learning
└── 09-pipeline-accuracy.md      # 97× improvement
```

---

## Running Examples

Each example includes inline code that can be executed:

```bash
# Navigate to examples
cd aisp-sdk/examples

# View an example
cat 01-definition-binding.md

# Run validation on extracted AISP
npx @aisp/validator validate -s "𝔸5.1@test⟦Ω⟧{...}"
```

---

## Sources

Examples derived from:
- `aisp-open-core-upstream/AI_GUIDE.md` - ⟦Σ:Rosetta⟧ section
- `aisp-open-core-upstream/reference.md` - Core Concept and Feature Catalog
