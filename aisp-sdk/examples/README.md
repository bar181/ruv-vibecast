# AISP SDK Examples - Rosetta Stone Pipeline

## Principle

> **Shorter is better when it preserves intent.**

The Rosetta (minimal) version has the same semantic content as the prose. Over-specification adds tokens without adding meaning.

---

## Compilation Tiers

| Tier | Tokens | Density | Adds Beyond Prose | Use Case |
|------|--------|---------|-------------------|----------|
| **Minimal** | 0.5-1x | ~1.00 | Nothing | Agent-to-agent, inline, low-token |
| **Standard** | 1.5-2x | 0.60-0.75 | Header + evidence | Standalone files, docs |
| **Full** | 4-8x | 0.75-0.90 | Types, rules, proofs | Formal verification, contracts |

**Default:** `minimal` or `standard`. Use `full` only when specification completeness > brevity.

---

## Aggregate Statistics

| # | Example | Pattern | Minimal δ | Standard δ | Semantic Match |
|---|---------|---------|-----------|------------|----------------|
| 01 | Definition Binding | x≜5 | 1.00 | 0.72 | 100% |
| 02 | Universal Quantifier | ∀x∈S:P(x) | 1.00 | 0.68 | 100% |
| 03 | Existential Unique | ∃!x:f(x)≡0 | 1.00 | 0.70 | 100% |
| 04 | Implication Logic | A⇒B | 1.00 | 0.71 | 100% |
| 05 | Function Mapping | f≜λi.o | 1.00 | 0.69 | 100% |
| 06 | Code Translation | JS→AISP | 0.95 | 0.73 | 100% |
| 07 | Nucleus Immutability | ∂𝒩⇒∂ℋ | 1.00 | 0.75 | 100% |
| 08 | Hebbian Learning | ⊕⇒aff++ | 1.00 | 0.72 | 100% |
| 09 | Pipeline Accuracy | 97× | 0.90 | 0.68 | 100% |

**Average:** Minimal δ=0.98, Standard δ=0.71, Semantic Match=100%

---

## SDK Commands

```bash
# Tiered compilation
npx @aisp/sdk compile --tier minimal "prose input"
npx @aisp/sdk compile --tier standard "prose input"
npx @aisp/sdk compile --tier full "prose input"
npx @aisp/sdk compile --auto "prose input"  # auto-detect

# Rosetta lookup
npx @aisp/reference rosetta lookup "defined as"
npx @aisp/reference rosetta search "function mapping"

# Validation
npx @aisp/validator validate output.aisp
npx @aisp/validator density output.aisp
```

---

## When to Use Each Tier

### Minimal
- LLM working memory
- Agent-to-agent communication
- Inline specifications
- Streaming/real-time contexts
- Token-constrained environments

### Standard
- Standalone specification files
- Documentation
- API contracts (informal)
- Shareable specs

### Full
- Formal verification
- Legal contracts
- Audit requirements
- Compliance documentation
- Safety-critical systems

---

## Example Categories

### Simple Translations (01-05)

Basic prose-to-AISP patterns from the Rosetta Stone:

| Example | Prose Pattern | Minimal AISP |
|---------|--------------|--------------|
| 01 | "x defined as 5" | x≜5 |
| 02 | "for all x in S, P" | ∀x∈S:P(x) |
| 03 | "exists unique" | ∃!x:f(x)≡0 |
| 04 | "A implies B" | A⇒B |
| 05 | "f maps i to o" | f≜λi.o |

### Code Translations (06)

JavaScript to AISP (minimal tier):

| JavaScript | AISP |
|------------|------|
| `const x = 5` | x≜5 |
| `S.every(x => P(x))` | ∀x∈S:P(x) |
| `if(A){B}` | A⇒B |
| `(x) => y` | λx.y |

### Medium Complexity (07-08)

Domain-specific patterns:

| Example | Domain | Minimal Pattern |
|---------|--------|-----------------|
| 07 | Pocket Architecture | ∂𝒩(p)⇒∂ℋ.id(p) |
| 08 | Hebbian Learning | ⊕(A,B)⇒aff[A,B]++ |

### Core Concepts (09)

AISP fundamentals:

| Concept | Formula |
|---------|---------|
| Ambiguity | Ambig≜1-|Parse_u|/|Parse_t| |
| Pipeline Accuracy | P(n)≜accuracy^n |
| Improvement | 97× over prose |

---

## Pipeline Steps

### 1. Prose Input
- Capture natural language specification
- Identify key concepts

### 2. Rosetta Lookup
```bash
npx @aisp/reference rosetta lookup "<key term>"
```

### 3. Choose Tier
```bash
# Default: minimal
npx @aisp/sdk compile --tier minimal "prose"

# Or auto-detect
npx @aisp/sdk compile --auto "prose"
```

### 4. Validate
```bash
npx @aisp/validator validate output.aisp
```

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
├── 01-definition-binding.md     # x≜5 (tiered example)
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

## Sources

Examples derived from:
- `aisp-open-core-upstream/AI_GUIDE.md` - ⟦Σ:Rosetta⟧ section
- `aisp-open-core-upstream/reference.md` - Core Concept and Feature Catalog
