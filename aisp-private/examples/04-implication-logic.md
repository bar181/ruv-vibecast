# Rosetta Stone Example 04: Implication Logic

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.81 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~25 | 28 | ✓ |

**Embedding Similarity Score:** 0.95 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input

```text
If the user is authenticated, then they can access the dashboard.
A implies B.
If payment is successful and items are available, then the order is confirmed.
```

## Step 2: Rosetta Stone Lookup

```bash
# Lookup implication
npx @aisp/reference rosetta lookup "implies"
# Result: { symbol: "⇒", prose: ["implies", "if then", "entails"], category: "logic" }

npx @aisp/reference rosetta lookup "and"
# Result: { symbol: "∧", prose: ["and", "conjunction"], category: "logic" }

npx @aisp/reference rosetta lookup "or"
# Result: { symbol: "∨", prose: ["or", "disjunction"], category: "logic" }
```

**Code Translation Pattern:**
```bash
# From AI_GUIDE.md Code→AISP section
# "if(A){B}" ↦ A⇒B
```

## Step 3: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
If the user is authenticated, then they can access the dashboard.
A implies B.
If payment is successful and items are available, then the order is confirmed.

ROSETTA MAPPINGS (from @aisp/reference):
- "if...then" / "implies" → ⇒
- "and" → ∧ (conjunction)
- "or" → ∨ (disjunction)
- "not" → ¬ (negation)

PATTERNS:
- "A implies B" ↦ A⇒B
- "if(A){B}" ↦ A⇒B
- "A and B" ↦ A∧B

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧

Generate AISP document:
```

## Step 4: Generated AISP Output

```aisp
𝔸5.1.logic@2025-01-14
γ≔auth.logic
ρ≔⟨implication,authentication,orders⟩

⟦Ω:Meta⟧{
  domain≜logic.rules
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  User≜⟨id:ℕ,auth:𝔹,perms:𝒫(Perm)⟩
  Perm≜dashboard|admin|read|write
  Payment≜⟨id:ℕ,success:𝔹,amount:ℝ⟩
  Order≜⟨id:ℕ,items:𝒫(Item),confirmed:𝔹⟩
  Item≜⟨id:ℕ,available:𝔹⟩
}

⟦Γ:Rules⟧{
  ;; "If authenticated, then can access dashboard"
  ∀u∈Users:u.auth⇒dashboard∈u.perms

  ;; "A implies B" (generic rule)
  A⇒B

  ;; "If payment successful and items available, then order confirmed"
  ∀o∈Orders:∀p∈Payments:(p.success∧allAvailable(o.items))⇒o.confirmed

  ;; Logical properties
  (A⇒B)⇔(¬A∨B)  ;; Implication equivalence
  (A∧B)⇒A       ;; Conjunction elimination
  A⇒(A∨B)       ;; Disjunction introduction
}

⟦Λ:Funcs⟧{
  canAccess≜λu.u.auth⇒dashboard∈u.perms
  allAvailable≜λitems.∀i∈items:i.available
  confirmOrder≜λ(o,p).p.success∧allAvailable(o.items)⇒o.confirmed≔⊤
  implies≜λ(a,b).¬a∨b
}

⟦Ε⟧⟨δ≜0.81;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 5: Validation

```bash
# Validate
npx @aisp/validator validate examples/04-implication-logic.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.81,
  "ambiguity": 0.01,
  "errors": []
}
```

## Step 6: Comparison with Reference

**Original Rosetta Stone Entries (from AI_GUIDE.md):**
```
"A implies B" ↦ A⇒B
"if(A){B}" ↦ A⇒B
```

**Generated Results:**
```
u.auth⇒dashboard∈u.perms
A⇒B
(p.success∧allAvailable(o.items))⇒o.confirmed
```

**Pattern Match:**
| Prose Pattern | Expected AISP | Generated AISP | Match |
|---------------|---------------|----------------|-------|
| "if authenticated then access" | auth⇒access | u.auth⇒dashboard∈u.perms | ✓ |
| "A implies B" | A⇒B | A⇒B | ✓ |
| "if A and B then C" | A∧B⇒C | (p.success∧allAvailable)⇒confirmed | ✓ |

---

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "implies"` | Map to ⇒ |
| 2 | `npx @aisp/reference rosetta lookup "and"` | Map to ∧ |
| 3 | `npx @aisp/reference template get "Γ:implication"` | Get rule template |
| 4 | `npx @aisp/validator validate <file>` | Validate output |

## Key Symbol Mappings

| Prose | Code | AISP |
|-------|------|------|
| "if...then" | `if(A){B}` | A⇒B |
| "implies" | `A ? B : null` | A⇒B |
| "and" | `A && B` | A∧B |
| "or" | `A || B` | A∨B |
| "not" | `!A` | ¬A |
| "if and only if" | `A === B` | A⇔B |

## Logical Equivalences

```aisp
;; Material implication
(A⇒B)⇔(¬A∨B)

;; Contrapositive
(A⇒B)⇔(¬B⇒¬A)

;; De Morgan's Laws
¬(A∧B)⇔(¬A∨¬B)
¬(A∨B)⇔(¬A∧¬B)
```
