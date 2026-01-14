# Rosetta Stone Example 02: Universal Quantifier

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.79 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~20 | 22 | ✓ |

**Embedding Similarity Score:** 0.96 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input

```text
For all users in the system, if the user is active, then the user has permissions.
For every item in the cart, the price must be positive.
```

## Step 2: Rosetta Stone Lookup

```bash
# NPX commands for symbol lookup
npx @aisp/reference rosetta lookup "for all"
# Result: { symbol: "∀", prose: ["for all", "for every", "universal"], category: "quantifier" }

npx @aisp/reference rosetta lookup "implies"
# Result: { symbol: "⇒", prose: ["implies", "if then", "entails"], category: "logic" }

npx @aisp/reference rosetta lookup "element of"
# Result: { symbol: "∈", prose: ["element of", "in", "member of"], category: "set" }
```

## Step 3: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
For all users in the system, if the user is active, then the user has permissions.
For every item in the cart, the price must be positive.

ROSETTA MAPPINGS (from @aisp/reference):
- "for all" / "for every" → ∀
- "in" / "element of" → ∈
- "if...then" / "implies" → ⇒
- "must be" → constraint (use in ⟦Γ⟧ rules block)

PATTERN: "for all x in S, P" ↦ ∀x∈S:P(x)

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧
- Target density: δ ≥ 0.60

Generate AISP document:
```

## Step 4: Generated AISP Output

```aisp
𝔸5.1.permissions@2025-01-14
γ≔user.permissions
ρ≔⟨users,cart,validation⟩

⟦Ω:Meta⟧{
  domain≜permissions
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  User≜⟨id:ℕ,active:𝔹,perms:𝒫(Permission)⟩
  Item≜⟨id:ℕ,name:𝕊,price:ℝ⟩
  Cart≜𝒫(Item)
  System≜⟨users:𝒫(User),carts:User→Cart⟩
}

⟦Γ:Rules⟧{
  ;; "For all users in system, if active then has permissions"
  ∀u∈System.users:u.active⇒|u.perms|>0

  ;; "For every item in cart, price must be positive"
  ∀i∈Cart:i.price>0

  ;; Derived constraint
  ∀u∈System.users:∀i∈carts(u):i.price>0
}

⟦Λ:Funcs⟧{
  hasPerms≜λu.u.active⇒|u.perms|>0
  validPrice≜λi.i.price>0
  validCart≜λc.∀i∈c:validPrice(i)
}

⟦Ε⟧⟨δ≜0.79;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 5: Validation

```bash
# Validate the generated document
npx @aisp/validator validate examples/02-universal-quantifier.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.79,
  "ambiguity": 0.01,
  "blocks": ["Ω", "Σ", "Γ", "Λ", "Ε"],
  "errors": []
}

# Check density breakdown
npx @aisp/validator density examples/02-universal-quantifier.aisp

# Output:
{
  "delta": 0.79,
  "aispCount": 95,
  "totalCount": 420,
  "wsCount": 90
}
```

## Step 6: Comparison with Reference

**Original Rosetta Stone Entry (from AI_GUIDE.md):**
```
"for all x in S, P" ↦ ∀x∈S:P(x)
```

**Generated Result:**
```
∀u∈System.users:u.active⇒|u.perms|>0
∀i∈Cart:i.price>0
```

**Pattern Match:**
| Prose Pattern | Expected AISP | Generated AISP | Match |
|---------------|---------------|----------------|-------|
| "for all users in system" | ∀u∈System | ∀u∈System.users | ✓ |
| "if active then has perms" | active⇒perms | u.active⇒\|u.perms\|>0 | ✓ |
| "for every item in cart" | ∀i∈Cart | ∀i∈Cart | ✓ |
| "price must be positive" | price>0 | i.price>0 | ✓ |

---

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "for all"` | Map prose to ∀ |
| 2 | `npx @aisp/reference rosetta lookup "implies"` | Map prose to ⇒ |
| 3 | `npx @aisp/reference rosetta lookup "element of"` | Map prose to ∈ |
| 4 | `npx @aisp/reference template get "Γ:rule"` | Get rules template |
| 5 | `npx @aisp/validator validate <file>` | Validate output |

## Key Symbol Mappings

| Prose | Symbol | Category |
|-------|--------|----------|
| "for all" | ∀ | quantifier |
| "for every" | ∀ | quantifier |
| "in" | ∈ | set |
| "implies" | ⇒ | logic |
| "if...then" | ⇒ | logic |
| "must be" | constraint | rule |
