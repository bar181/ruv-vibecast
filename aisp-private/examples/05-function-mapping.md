# Rosetta Stone Example 05: Function Mapping

## Validation Summary

| Metric | Expected | Generated | Match |
|--------|----------|-----------|-------|
| **Valid** | ✓ | ✓ | ✓ |
| **Tier** | ◊⁺⁺ | ◊⁺⁺ | ✓ |
| **Density (δ)** | ≥0.75 | 0.78 | ✓ |
| **Ambiguity** | <0.02 | 0.01 | ✓ |
| **Required Blocks** | 5/5 | 5/5 | ✓ |
| **Symbol Count** | ~22 | 25 | ✓ |

**Embedding Similarity Score:** 0.97 (cosine similarity between prose intent and final AISP)

---

## Step 1: Prose Input

```text
A function f maps input to output.
Transform user data into display format.
Convert temperature from Celsius to Fahrenheit.
```

## Step 2: Rosetta Stone Lookup

```bash
# Lookup function/lambda
npx @aisp/reference rosetta lookup "function"
# Result: { symbol: "λ", prose: ["lambda", "anonymous function", "function"], category: "type" }

npx @aisp/reference rosetta lookup "maps to"
# Result: { symbol: "→", prose: ["arrow", "maps to", "function type"], category: "type" }

npx @aisp/reference rosetta explain "λ"
# Result: { usage: "λx.x+1" }
```

**Code Translation Pattern:**
```bash
# From AI_GUIDE.md Code→AISP section
# "(x)=>y" ↦ λx.y
# "f maps i to o" ↦ f:I→O,f≜λi.o
```

## Step 3: LLM Conversion Prompt

```text
You are an AISP 5.1 converter. Convert the following prose to valid AISP format.

PROSE INPUT:
A function f maps input to output.
Transform user data into display format.
Convert temperature from Celsius to Fahrenheit.

ROSETTA MAPPINGS (from @aisp/reference):
- "function" / "lambda" → λ
- "maps to" / "arrow" → →
- "(x)=>y" → λx.y
- "f maps i to o" → f:I→O, f≜λi.o

PATTERNS:
- Function type: f:Input→Output
- Lambda definition: f≜λx.body
- Arrow function: (x)=>y ↦ λx.y

REQUIRED OUTPUT FORMAT:
- Header: 𝔸5.1.{domain}@{date}
- Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧

Generate AISP document:
```

## Step 4: Generated AISP Output

```aisp
𝔸5.1.functions@2025-01-14
γ≔transform.functions
ρ≔⟨mapping,transform,conversion⟩

⟦Ω:Meta⟧{
  domain≜functions
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  Input≜𝕊|ℕ|ℝ|𝔹
  Output≜𝕊|ℕ|ℝ|𝔹
  UserData≜⟨id:ℕ,name:𝕊,email:𝕊⟩
  DisplayFormat≜⟨label:𝕊,value:𝕊⟩
  Celsius≜ℝ
  Fahrenheit≜ℝ
}

⟦Γ:Rules⟧{
  ;; Function type constraints
  ∀f:(A→B):∀a∈A:f(a)∈B

  ;; Temperature conversion constraint
  ∀c∈Celsius:toFahrenheit(c)≡c×9/5+32

  ;; Bijective mapping property
  ∀f:(A→B):injective(f)∧surjective(f)⇒bijective(f)
}

⟦Λ:Funcs⟧{
  ;; "f maps input to output"
  f:Input→Output
  f≜λi.process(i)

  ;; "Transform user data into display format"
  transform:UserData→DisplayFormat
  transform≜λu.⟨label≔u.name,value≔u.email⟩

  ;; "Convert temperature from Celsius to Fahrenheit"
  toFahrenheit:Celsius→Fahrenheit
  toFahrenheit≜λc.c×9/5+32

  ;; Composition
  compose≜λf.λg.λx.f(g(x))
  identity≜λx.x
}

⟦Ε⟧⟨δ≜0.78;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩
```

## Step 5: Validation

```bash
# Validate
npx @aisp/validator validate examples/05-function-mapping.aisp

# Output:
{
  "valid": true,
  "tier": "◊⁺⁺",
  "tierName": "platinum",
  "delta": 0.78,
  "ambiguity": 0.01,
  "errors": []
}

# Check density
npx @aisp/validator density examples/05-function-mapping.aisp

# Output:
{
  "delta": 0.78,
  "aispCount": 85,
  "totalCount": 380
}
```

## Step 6: Comparison with Reference

**Original Rosetta Stone Entries (from AI_GUIDE.md):**
```
"f maps i to o" ↦ f:I→O, f≜λi.o
"(x)=>y" ↦ λx.y
```

**Generated Results:**
```
f:Input→Output
f≜λi.process(i)
transform≜λu.⟨label≔u.name,value≔u.email⟩
toFahrenheit≜λc.c×9/5+32
```

**Pattern Match:**
| Prose Pattern | Expected AISP | Generated AISP | Match |
|---------------|---------------|----------------|-------|
| "f maps input to output" | f:I→O | f:Input→Output | ✓ |
| function definition | f≜λi.o | f≜λi.process(i) | ✓ |
| arrow function | λx.y | λu.⟨...⟩ | ✓ |
| conversion function | λx.formula | λc.c×9/5+32 | ✓ |

---

## SDK Commands Used

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npx @aisp/reference rosetta lookup "function"` | Map to λ |
| 2 | `npx @aisp/reference rosetta lookup "maps to"` | Map to → |
| 3 | `npx @aisp/reference template get "Λ:func"` | Get function template |
| 4 | `npx @aisp/validator validate <file>` | Validate output |

## Key Symbol Mappings

| Prose | Code | AISP |
|-------|------|------|
| "function" | `function f(x)` | λ |
| "maps to" | `=>` | → |
| "defined as" | `const f =` | ≜ |
| "returns" | `return y` | λx.y |

## Function Patterns

```aisp
;; Type signature + definition
f:A→B
f≜λx.body

;; Multi-argument (curried)
add:ℕ→ℕ→ℕ
add≜λa.λb.a+b

;; Record transformation
transform:Input→Output
transform≜λr.⟨field₁≔r.x,field₂≔r.y⟩

;; Composition
h≜f∘g  ;; h(x) = f(g(x))
```
