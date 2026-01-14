# Rosetta Stone Example 09: Core Concept - Pipeline Accuracy

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.85 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~25 | 28 | ✓ |

**Embedding Similarity Score:** 0.96 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input (from reference.md Core Concept)

```text
Natural language has 40-65% ambiguity (interpretation required).
A 10-step pipeline with 62% per-step accuracy equals 0.84% total success.
AISP has less than 2% ambiguity by design.
A 10-step pipeline with 98% per-step accuracy equals 81.7% total success.
This is a 97x improvement.
```

## Step 2: Reference AISP (from reference.md)

```aisp
⟦Ω:Core⟧{
  ∀D∈AISP:Ambig(D)<0.02
  Ambig≜λD.1-|Parse_u(D)|/|Parse_t(D)|

  ;; Pipeline success probability
  P_prose(n)≜(0.62)ⁿ
  P_aisp(n)≜(0.98)ⁿ

  ;; At n=10 steps
  P_prose(10)≡0.0084
  P_aisp(10)≡0.817
  Improvement≜P_aisp/P_prose≡97×
}
```

## Step 3: Rosetta Stone Lookup

```bash
# Key concepts
npx @aisp/reference rosetta lookup "for all"
# Result: { symbol: "∀", usage: "∀x∈S:P(x)" }

npx @aisp/reference rosetta lookup "defined as"
# Result: { symbol: "≜", usage: "T≜⟨...⟩" }

npx @aisp/reference rosetta lookup "identical"
# Result: { symbol: "≡", usage: "a≡b" }

npx @aisp/reference rosetta lookup "function"
# Result: { symbol: "λ", usage: "λx.x+1" }
```

## Step 4: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
Natural language has 40-65% ambiguity (interpretation required).
A 10-step pipeline with 62% per-step accuracy equals 0.84% total success.
AISP has less than 2% ambiguity by design.
A 10-step pipeline with 98% per-step accuracy equals 81.7% total success.
This is a 97x improvement.

ROSETTA MAPPINGS:
- "for all" → ∀
- "defined as" → ≜
- "equals" / "identical" → ≡
- "less than" → <
- "function" → λ
- exponentiation → superscript (e.g., ⁿ)

REFERENCE PATTERN (from reference.md):
∀D∈AISP:Ambig(D)<0.02
P_prose(n)≜(0.62)ⁿ
P_aisp(n)≜(0.98)ⁿ

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧

Generate AISP document:
```

## Step 5: Generated AISP Output

```aisp
𝔸5.1.pipeline-accuracy@2025-01-14
γ≔ambiguity.analysis
ρ≔⟨pipeline,accuracy,improvement⟩

⟦Ω:Meta⟧{
  domain≜pipeline.accuracy
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02

  ;; Core claim: AISP reduces ambiguity dramatically
  ⊢LowAmbiguity:∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  ;; Document type
  Doc≜⟨content:𝕊,ambiguity:ℝ⟩

  ;; Ambiguity ranges
  ProseAmbig≜[0.40,0.65]
  CodeAmbig≜[0.05,0.15]
  AISPAmbig≜[0,0.02]

  ;; Pipeline type
  Pipeline⟨n⟩≜⟨steps:ℕ,accuracy:ℝ⟩
}

⟦Γ:Rules⟧{
  ;; Ambiguity constraint for AISP
  ∀D∈AISP:Ambig(D)<0.02

  ;; Pipeline success probability (compound)
  ∀P∈Pipeline:P.success≡(P.accuracy)^P.steps

  ;; Comparison at n=10
  P_prose(10)≡0.0084
  P_aisp(10)≡0.817

  ;; Improvement factor
  Improvement≡P_aisp(10)/P_prose(10)≡97
}

⟦Λ:Funcs⟧{
  ;; Ambiguity calculation
  ;; "proportion of unique interpretations to total possible"
  Ambig≜λD.1-|Parse_u(D)|/|Parse_t(D)|

  ;; Pipeline success probability
  ;; "per-step accuracy raised to number of steps"
  P_prose≜λn.(0.62)^n
  P_aisp≜λn.(0.98)^n

  ;; Improvement ratio
  improvement≜λn.P_aisp(n)/P_prose(n)

  ;; Concrete calculations
  prose_10≜P_prose(10)≡0.0084
  aisp_10≜P_aisp(10)≡0.817
  ratio≜improvement(10)≡97
}

⟦Ε⟧⟨δ≜0.85;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 6: Validation

```bash
# Validate
npx @aisp/validator validate examples/09-pipeline-accuracy.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.85,
  "ambiguity": 0.01,
  "errors": []
}
```

## Step 7: Comparison with Reference

**Original AISP (from reference.md):**
```aisp
⟦Ω:Core⟧{
  ∀D∈AISP:Ambig(D)<0.02
  Ambig≜λD.1-|Parse_u(D)|/|Parse_t(D)|
  P_prose(n)≜(0.62)ⁿ
  P_aisp(n)≜(0.98)ⁿ
  P_prose(10)≡0.0084
  P_aisp(10)≡0.817
  Improvement≜P_aisp/P_prose≡97×
}
```

**Generated Core Elements:**
```aisp
∀D∈AISP:Ambig(D)<0.02
Ambig≜λD.1-|Parse_u(D)|/|Parse_t(D)|
P_prose≜λn.(0.62)^n
P_aisp≜λn.(0.98)^n
```

**Pattern Match:**
| Reference | Generated | Match |
|-----------|-----------|-------|
| ∀D∈AISP:Ambig(D)<0.02 | ∀D∈AISP:Ambig(D)<0.02 | ✓ |
| P_prose(n)≜(0.62)ⁿ | P_prose≜λn.(0.62)^n | ✓ |
| P_aisp(n)≜(0.98)ⁿ | P_aisp≜λn.(0.98)^n | ✓ |
| Improvement≡97× | ratio≜improvement(10)≡97 | ✓ |

---

## Mathematical Analysis

```
Pipeline Success Probability
════════════════════════════

Given:
- Per-step accuracy for prose: 62% (0.62)
- Per-step accuracy for AISP: 98% (0.98)
- Pipeline length: n steps

Formula:
P(n) = accuracy^n

Results at n=10:
┌─────────────────────────────────────────────┐
│ Method │ Accuracy │ P(10)    │ Success Rate │
├────────┼──────────┼──────────┼──────────────┤
│ Prose  │ 62%      │ 0.62^10  │ 0.84%        │
│ AISP   │ 98%      │ 0.98^10  │ 81.7%        │
└────────┴──────────┴──────────┴──────────────┘

Improvement: 81.7% / 0.84% ≈ 97× better
```

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "for all"` | Map to ∀ |
| 2 | `npx @aisp/reference rosetta lookup "defined as"` | Map to ≜ |
| 3 | `npx @aisp/reference anti-drift --compact` | Get LLM reference |
| 4 | `npx @aisp/validator validate <file>` | Validate output |
