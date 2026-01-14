# Rosetta Stone Example 06: Code to AISP Translation

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.80 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~30 | 32 | ✓ |

**Embedding Similarity Score:** 0.98 (cosine similarity between code intent and final AISP)

---

## Step 1: Code Input (JavaScript)

```javascript
const x = 5;
const y = 10;
const items = [1, 2, 3, 4, 5];

// Check all items are positive
const allPositive = items.every(item => item > 0);

// Filter even numbers
const evens = items.filter(x => x % 2 === 0);

// Conditional logic
if (x > 0) {
  console.log("positive");
}

// Arrow function
const double = (n) => n * 2;
```

## Step 2: Rosetta Stone Lookup (Code→AISP)

```bash
# From AI_GUIDE.md Code→AISP section:
# "const x=5" ↦ x≜5
# "S.every(x=>P(x))" ↦ ∀x∈S:P(x)
# "if(A){B}" ↦ A⇒B
# "(x)=>y" ↦ λx.y

npx @aisp/reference rosetta lookup "every"
# Maps to: ∀ (universal quantifier)

npx @aisp/reference rosetta lookup "filter"
# Maps to: set comprehension {x∈S | P(x)}

npx @aisp/reference rosetta lookup "const"
# Maps to: ≜ (definition binding)
```

## Step 3: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following JavaScript code to valid AISP format.

CODE INPUT:
```javascript
const x = 5;
const y = 10;
const items = [1, 2, 3, 4, 5];
const allPositive = items.every(item => item > 0);
const evens = items.filter(x => x % 2 === 0);
if (x > 0) { console.log("positive"); }
const double = (n) => n * 2;
```

CODE→AISP MAPPINGS (from AI_GUIDE.md):
- "const x=5" → x≜5
- "S.every(x=>P(x))" → ∀x∈S:P(x)
- "S.filter(x=>P(x))" → {x∈S | P(x)}
- "if(A){B}" → A⇒B
- "(x)=>y" → λx.y

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧

Generate AISP document:
```

## Step 4: Generated AISP Output

```aisp
𝔸5.1.code-transform@2025-01-14
γ≔js.to.aisp
ρ≔⟨constants,arrays,predicates,functions⟩

⟦Ω:Meta⟧{
  domain≜code.transform
  version≜1.0.0
  source≜JavaScript
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  ;; Primitive types
  ℕ≜natural_numbers
  𝔹≜{⊤,⊥}

  ;; Array type
  Array⟨T⟩≜𝒫(T)

  ;; Item set (from code)
  Items≜Array⟨ℕ⟩
}

⟦Γ:Rules⟧{
  ;; "items.every(item => item > 0)" → ∀x∈items:x>0
  allPositive⇔∀i∈items:i>0

  ;; Array filter constraint
  evens⇔{x∈items|x mod 2≡0}

  ;; "if(x > 0){...}" → x>0⇒action
  x>0⇒log("positive")

  ;; Type constraints
  ∀n∈ℕ:double(n)∈ℕ
}

⟦Λ:Funcs⟧{
  ;; "const x = 5" → x≜5
  x≜5
  y≜10

  ;; "const items = [1,2,3,4,5]" → items≜{1,2,3,4,5}
  items≜{1,2,3,4,5}

  ;; "items.every(item => item > 0)" → allPositive check
  allPositive≜∀i∈items:i>0

  ;; "items.filter(x => x % 2 === 0)" → set comprehension
  evens≜{x∈items|x mod 2≡0}

  ;; "(n) => n * 2" → λn.n×2
  double≜λn.n×2

  ;; Additional utilities
  isPositive≜λn.n>0
  isEven≜λn.n mod 2≡0
  map≜λf.λs.{f(x)|x∈s}
  filter≜λp.λs.{x∈s|p(x)}
}

⟦Ε⟧⟨δ≜0.80;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 5: Validation

```bash
# Validate
npx @aisp/validator validate examples/06-code-translation.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.80,
  "ambiguity": 0.01,
  "errors": []
}
```

## Step 6: Comparison with Reference

**Original Rosetta Stone Code→AISP (from AI_GUIDE.md):**
```
"const x=5" ↦ x≜5
"S.every(x=>P(x))" ↦ ∀x∈S:P(x)
"if(A){B}" ↦ A⇒B
"(x)=>y" ↦ λx.y
```

**Generated Results:**
| JavaScript | Expected AISP | Generated AISP | Match |
|------------|---------------|----------------|-------|
| `const x = 5` | x≜5 | x≜5 | ✓ |
| `items.every(i => i > 0)` | ∀i∈items:i>0 | ∀i∈items:i>0 | ✓ |
| `items.filter(x => x%2===0)` | {x∈S\|P(x)} | {x∈items\|x mod 2≡0} | ✓ |
| `if(x > 0)` | x>0⇒action | x>0⇒log("positive") | ✓ |
| `(n) => n * 2` | λn.y | λn.n×2 | ✓ |

---

## Code Translation Reference

| JavaScript | AISP | Notes |
|------------|------|-------|
| `const x = 5` | x≜5 | Immutable binding |
| `let x = 5` | x≔5 | Mutable assignment |
| `x === y` | x≡y | Strict equality |
| `x == y` | x≈y | Approximate equality |
| `x && y` | x∧y | Logical AND |
| `x \|\| y` | x∨y | Logical OR |
| `!x` | ¬x | Logical NOT |
| `x ? y : z` | x⇒y | Conditional (partial) |
| `() => x` | λ().x | Thunk/nullary lambda |
| `(a) => b` | λa.b | Unary lambda |
| `(a,b) => c` | λa.λb.c | Binary (curried) |
| `[1,2,3]` | {1,2,3} | Set/collection |
| `arr.map(f)` | {f(x)\|x∈arr} | Map comprehension |
| `arr.filter(p)` | {x∈arr\|p(x)} | Filter comprehension |
| `arr.every(p)` | ∀x∈arr:p(x) | Universal quantifier |
| `arr.some(p)` | ∃x∈arr:p(x) | Existential quantifier |
| `arr.find(p)` | first({x∈arr\|p(x)}) | Find first match |

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "const"` | Map to ≜ |
| 2 | `npx @aisp/reference rosetta lookup "every"` | Map to ∀ |
| 3 | `npx @aisp/reference ascii` | Get ASCII aliases |
| 4 | `npx @aisp/validator validate <file>` | Validate |
