# Rosetta Stone Example 01: Definition Binding

## Validation Summary

| Tier | Valid | Density | Tokens | Use Case |
|------|-------|---------|--------|----------|
| **Minimal** | ✓ | 1.00 | 15 | Inline, agent-to-agent |
| **Standard** | ✓ | 0.72 | 45 | Standalone specs |
| **Full** | ✓ | 0.82 | 150 | Formal verification |

**Embedding Similarity:** 0.98 (minimal), 0.94 (standard), 0.89 (full)

---

## Step 1: Prose Input

```text
Define a constant x with value 5.
Define a constant y with value 10.
Define a sum function that adds two numbers.
```

**Token count:** ~25

---

## Step 2: Rosetta Stone Lookup

```bash
npx @aisp/reference rosetta lookup "defined as"
# { symbol: "≜", category: "definition", usage: "x≜5" }

npx @aisp/reference rosetta lookup "function"
# { symbol: "λ", category: "type", usage: "λx.x+1" }
```

**Mappings:**
| Prose | Symbol | Direct |
|-------|--------|--------|
| "defined as" | ≜ | ✓ |
| "function" | λ | ✓ |
| "value 5" | 5 | literal |

---

## Step 3: Tiered Compilation

### TIER: Minimal (Rosetta Only)

```bash
npx @aisp/sdk compile --tier minimal "Define x as 5, y as 10, sum function adds two numbers"
```

```aisp
x≜5
y≜10
sum≜λa.λb.a+b
```

| Metric | Value |
|--------|-------|
| Lines | 3 |
| Tokens | 15 |
| Density | 1.00 |
| Adds beyond prose | Nothing |

**Use when:** Agent-to-agent messages, inline specs, low-token contexts, LLM working memory.

---

### TIER: Standard

```bash
npx @aisp/sdk compile --tier standard "Define x as 5, y as 10, sum function adds two numbers"
```

```aisp
𝔸5.1.math@2025-01-14
γ≔definitions

⟦Λ:Funcs⟧{
  x≜5
  y≜10
  sum≜λa.λb.a+b
}

⟦Ε⟧⟨δ≜0.72;τ≜◊⁺⟩
```

| Metric | Value |
|--------|-------|
| Lines | 10 |
| Tokens | 45 |
| Density | 0.72 |
| Adds beyond prose | Header, evidence block |

**Use when:** Standalone files, documentation, shareable specs.

---

### TIER: Full

```bash
npx @aisp/sdk compile --tier full "Define x as 5, y as 10, sum function adds two numbers"
```

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

| Metric | Value |
|--------|-------|
| Lines | 25 |
| Tokens | 150 |
| Density | 0.82 |
| Adds beyond prose | Types, rules, meta, proofs |

**Use when:** Formal verification, contracts, auditable specs, legal requirements.

**Warning:** Full tier invents constraints not in prose (immutability, type constraints, natural number bounds). Only use when specification completeness > brevity.

---

## Step 4: Validation

```bash
# Validate any tier
npx @aisp/validator validate output.aisp

# Check density
npx @aisp/validator density output.aisp
```

All three tiers validate successfully:

```json
{ "valid": true, "tier": "◊⁺⁺", "delta": 1.00 }  // minimal
{ "valid": true, "tier": "◊⁺",  "delta": 0.72 }  // standard
{ "valid": true, "tier": "◊⁺⁺", "delta": 0.82 }  // full
```

---

## Step 5: Comparison

| Version | Semantic Match | Token Efficiency | Over-specification |
|---------|----------------|------------------|-------------------|
| Prose | baseline | 25 tokens | — |
| Minimal | 100% | 15 tokens (0.6x) | None |
| Standard | 100% | 45 tokens (1.8x) | Minor (header) |
| Full | 100%* | 150 tokens (6x) | High |

*Full version preserves intent but adds inferred constraints.

**Recommendation:** Default to `minimal` or `standard`. Use `full` only when the spec will be:
- Formally verified
- Used as a contract
- Subject to audit

---

## SDK Commands

| Command | Purpose |
|---------|---------|
| `npx @aisp/sdk compile --tier minimal "prose"` | 1:1 Rosetta mapping |
| `npx @aisp/sdk compile --tier standard "prose"` | + Header + function block |
| `npx @aisp/sdk compile --tier full "prose"` | All blocks + proofs |
| `npx @aisp/sdk compile --auto "prose"` | Auto-detect appropriate tier |

---

## Principle

> **Shorter is better when it preserves intent.**

The Rosetta (minimal) version has the same semantic content as the prose. That's the goal.
