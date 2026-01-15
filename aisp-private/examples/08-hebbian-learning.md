# Rosetta Stone Example 08: Medium Complexity - Hebbian Learning

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.79 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~30 | 33 | ✓ |

**Embedding Similarity Score:** 0.92 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input (from AI_GUIDE.md)

```text
Success increases affinity by 1, failure decreases it by 10, below threshold skip.
This implements Hebbian-like learning for agent memory affinities.
```

## Step 2: Reference AISP (from AI_GUIDE.md ⟦Σ:Rosetta⟧)

```aisp
;; Medium: Hebbian learning
;; "Success+1, failure-10, below threshold skip"
⊕(A,B)⇒ℳ.aff[A,B]+=1; ⊖(A,B)⇒ℳ.aff[A,B]-=10; ℳ.aff[A,B]<τ_v⇒skip(B)
```

## Step 3: Rosetta Stone Lookup

```bash
# Key operators
npx @aisp/reference rosetta lookup "success"
# Custom: ⊕ represents positive outcome/success

npx @aisp/reference rosetta lookup "failure"
# Custom: ⊖ represents negative outcome/failure

npx @aisp/reference rosetta lookup "implies"
# Result: { symbol: "⇒", usage: "A⇒B" }

# Domain notation
# ℳ = Membrane (mutable metadata in Pocket)
# aff = affinity scores
# τ_v = visit threshold
```

## Step 4: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
Success increases affinity by 1, failure decreases it by 10, below threshold skip.
This implements Hebbian-like learning for agent memory affinities.

ROSETTA MAPPINGS:
- "success" → ⊕ (positive outcome)
- "failure" → ⊖ (negative outcome)
- "implies" / "then" → ⇒
- "increases by" → +=
- "decreases by" → -=
- "below threshold" → < τ

DOMAIN NOTATION:
- ℳ = Membrane (mutable pocket metadata)
- ℳ.aff[A,B] = affinity score between pockets A and B
- τ_v = visit threshold
- skip(B) = skip pocket B in search

REFERENCE PATTERN:
⊕(A,B)⇒ℳ.aff[A,B]+=1; ⊖(A,B)⇒ℳ.aff[A,B]-=10; ℳ.aff[A,B]<τ_v⇒skip(B)

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧

Generate AISP document:
```

## Step 5: Generated AISP Output

```aisp
𝔸5.1.hebbian-learning@2025-01-14
γ≔learning.affinity
ρ≔⟨hebbian,affinity,reinforcement⟩

⟦Ω:Meta⟧{
  domain≜learning.hebbian
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02

  ;; Hebbian principle: "Neurons that fire together wire together"
  ⊢Hebbian:∀A,B:coactivate(A,B)⇒strengthen(A,B)
}

⟦Σ:Types⟧{
  ;; Pocket and Membrane types
  𝒫≜⟨ℋ:Header,ℳ:Membrane,𝒩:Nucleus⟩
  ℳ≜⟨aff:𝒫×𝒫→ℝ,conf:ℝ,tags:𝒫(𝕊),use:ℕ⟩

  ;; Outcome types
  Outcome≜⊕|⊖
  ⊕≜success
  ⊖≜failure

  ;; Learning parameters
  Params≜⟨
    δ_success:ℝ,  ;; increment on success
    δ_failure:ℝ,  ;; decrement on failure
    τ_v:ℝ         ;; visit threshold
  ⟩

  ;; Default parameters
  defaults≜⟨δ_success≔1,δ_failure≔-10,τ_v≔0⟩
}

⟦Γ:Rules⟧{
  ;; Core Hebbian rules
  ;; "Success increases affinity by 1"
  ⊕(A,B)⇒ℳ.aff[A,B]+=1

  ;; "Failure decreases affinity by 10"
  ⊖(A,B)⇒ℳ.aff[A,B]-=10

  ;; "Below threshold skip"
  ℳ.aff[A,B]<τ_v⇒skip(B)

  ;; Affinity bounds
  ∀A,B:ℳ.aff[A,B]∈[-100,100]

  ;; Symmetry (optional - Hebbian is symmetric)
  ∀A,B:ℳ.aff[A,B]≡ℳ.aff[B,A]

  ;; Decay rule (optional)
  ∀A,B:t-last_use(A,B)>τ_decay⇒ℳ.aff[A,B]×=0.99
}

⟦Λ:Funcs⟧{
  ;; Update affinity on success
  onSuccess≜λ(A,B).ℳ.aff[A,B]+=δ_success

  ;; Update affinity on failure
  onFailure≜λ(A,B).ℳ.aff[A,B]+=δ_failure

  ;; Check if should skip
  shouldSkip≜λB.ℳ.aff[current,B]<τ_v

  ;; Learn from outcome
  learn≜λ(A,B,outcome).match outcome {
    ⊕⇒onSuccess(A,B),
    ⊖⇒onFailure(A,B)
  }

  ;; Filter candidates by affinity
  filterByAffinity≜λcandidates.{B∈candidates|¬shouldSkip(B)}

  ;; Get top K by affinity
  topK≜λ(candidates,k).take(k,sortBy(candidates,λB.ℳ.aff[current,B]))
}

⟦Ε⟧⟨δ≜0.79;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 6: Validation

```bash
# Validate
npx @aisp/validator validate examples/08-hebbian-learning.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.79,
  "ambiguity": 0.01,
  "errors": []
}
```

## Step 7: Comparison with Reference

**Original Rosetta Stone Entry (from AI_GUIDE.md):**
```aisp
⊕(A,B)⇒ℳ.aff[A,B]+=1; ⊖(A,B)⇒ℳ.aff[A,B]-=10; ℳ.aff[A,B]<τ_v⇒skip(B)
```

**Generated Core Rules:**
```aisp
⊕(A,B)⇒ℳ.aff[A,B]+=1
⊖(A,B)⇒ℳ.aff[A,B]-=10
ℳ.aff[A,B]<τ_v⇒skip(B)
```

**Pattern Match:**
| Reference Pattern | Generated Pattern | Match |
|-------------------|-------------------|-------|
| ⊕(A,B)⇒ℳ.aff[A,B]+=1 | ⊕(A,B)⇒ℳ.aff[A,B]+=1 | ✓ |
| ⊖(A,B)⇒ℳ.aff[A,B]-=10 | ⊖(A,B)⇒ℳ.aff[A,B]-=10 | ✓ |
| ℳ.aff[A,B]<τ_v⇒skip(B) | ℳ.aff[A,B]<τ_v⇒skip(B) | ✓ |

---

## Key Concepts Translated

| Prose Concept | AISP Symbol | Meaning |
|---------------|-------------|---------|
| "success" | ⊕ | Positive outcome operator |
| "failure" | ⊖ | Negative outcome operator |
| "increases by 1" | +=1 | Increment operation |
| "decreases by 10" | -=10 | Decrement operation |
| "affinity between A and B" | ℳ.aff[A,B] | Membrane affinity lookup |
| "below threshold" | <τ_v | Comparison with threshold |
| "skip" | skip(B) | Exclude from search |

## Learning Algorithm Summary

```
Algorithm: Hebbian Affinity Learning
─────────────────────────────────────
1. Initialize: ∀A,B: ℳ.aff[A,B] ← 0
2. On interaction outcome:
   - If success (⊕): affinity += 1
   - If failure (⊖): affinity -= 10
3. During search:
   - If affinity < threshold: skip candidate
4. Asymmetric penalty:
   - Failures penalized 10× more than successes reward
   - Rapidly filters out poor matches
```

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference anti-drift` | Get Membrane architecture |
| 2 | `npx @aisp/reference rosetta lookup "implies"` | Map to ⇒ |
| 3 | `npx @aisp/reference symbols` | Get operator symbols |
| 4 | `npx @aisp/validator validate <file>` | Validate output |
