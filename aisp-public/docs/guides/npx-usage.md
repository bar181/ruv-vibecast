# NPX Usage Guide

Complete reference for using AISP SDK packages via npx.

## Quick Reference

```bash
# Validation
npx @aisp/validator validate <file|string>
npx @aisp/validator parse <file|string>
npx @aisp/validator tier <file|string>
npx @aisp/validator density <file|string>

# Reference
npx @aisp/reference anti-drift [--compact|--json]
npx @aisp/reference rosetta lookup <query>
npx @aisp/reference rosetta explain <symbol>
npx @aisp/reference rosetta suggest <prose>
npx @aisp/reference template list
npx @aisp/reference template get <name>
npx @aisp/reference symbols [--category <cat>]
npx @aisp/reference blocks
npx @aisp/reference ascii
```

## @aisp/validator

### validate

Full validation with tier, density, and error checking.

```bash
# From file
npx @aisp/validator validate ./my-spec.aisp

# From string
npx @aisp/validator validate "𝔸1.0.test@ctx
γ≔test
⟦Ω:Meta⟧{ domain≜test }
⟦Σ:Types⟧{ T≜ℕ }
⟦Γ:Rules⟧{ ∀x:T:x≥0 }
⟦Λ:Funcs⟧{ f≜λx.x }
⟦Ε⟧⟨δ≜0.70;φ≜100;τ≜◊⁺⟩"

# JSON output
npx @aisp/validator validate spec.aisp --json
```

**Output:**
```
✓ Valid AISP Document
  Tier: ◊⁺ (Gold)
  Density: 0.682
  Ambiguity: 0.010
```

**JSON Output:**
```json
{
  "valid": true,
  "tier": "◊⁺",
  "tierName": "Gold",
  "tierValue": 3,
  "delta": 0.682,
  "ambiguity": 0.01,
  "errors": []
}
```

### parse

Structure check only (faster, no density calculation).

```bash
npx @aisp/validator parse spec.aisp
```

**Output:**
```
✓ Valid structure
  Blocks found: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧
```

### tier

Get quality tier only.

```bash
npx @aisp/validator tier spec.aisp
# Output: ◊⁺ (Gold)

npx @aisp/validator tier spec.aisp --json
# Output: {"tier":"◊⁺","name":"Gold","value":3}
```

### density

Calculate density score.

```bash
npx @aisp/validator density spec.aisp
```

**Output:**
```
δ = 0.6823
  AISP symbols: 47
  Total tokens: 156
  Non-whitespace: 69
```

## @aisp/reference

### anti-drift

Get anti-drift reference document.

```bash
# Full AISP format (default)
npx @aisp/reference anti-drift

# Compact version (~1.5KB, for prompt injection)
npx @aisp/reference anti-drift --compact

# JSON format (structured data)
npx @aisp/reference anti-drift --json
```

**Compact Output (excerpt):**
```
𝔸5.1.ref@compact
;; AISP 5.1 Anti-Drift Quick Reference
;; Quantifiers: ∀(forall) ∃(exists) ∃!(unique)
;; Logic: ∧(and) ∨(or) ¬(not) ⇒(implies) ⇔(iff)
...
```

### rosetta lookup

Look up AISP symbol from prose.

```bash
npx @aisp/reference rosetta lookup "for all"
npx @aisp/reference rosetta lookup "implies"
npx @aisp/reference rosetta lookup "natural number"
```

**Output:**
```json
{
  "symbol": "∀",
  "prose": ["for all", "every", "universal"],
  "category": "quantifier",
  "usage": "∀x:Type:condition",
  "confidence": 0.98
}
```

### rosetta explain

Explain AISP symbol in prose.

```bash
npx @aisp/reference rosetta explain "∀"
npx @aisp/reference rosetta explain "⇒"
npx @aisp/reference rosetta explain "≜"
```

**Output:**
```json
{
  "symbol": "⇒",
  "prose": ["implies", "if then", "therefore"],
  "category": "logic",
  "usage": "A⇒B"
}
```

### rosetta suggest

Get AISP pattern suggestions for prose.

```bash
npx @aisp/reference rosetta suggest "for all users if admin then allow"
npx @aisp/reference rosetta suggest "exists a unique session"
npx @aisp/reference rosetta suggest "timeout is defined as 30 seconds"
```

**Output:**
```json
[
  { "pattern": "∀x:Type:condition⇒result", "confidence": 0.92 },
  { "pattern": "condition⇒result", "confidence": 0.88 }
]
```

### template list

List all available templates.

```bash
npx @aisp/reference template list
```

**Output:**
```
Available templates:
  Ω:meta
  Σ:type
  Σ:record
  Γ:rule
  Γ:implication
  Λ:func
  Ε:evidence
  Θ:task
  Δ:contract
  minimal
```

### template get

Get a specific template.

```bash
npx @aisp/reference template get Γ:rule
npx @aisp/reference template get minimal
```

**Output (Γ:rule):**
```
∀{{var}}:{{type}}:{{condition}}
```

**Output (minimal):**
```
𝔸1.0.{{name}}@{{date}}
γ≔{{context}}

⟦Ω:Meta⟧{
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  {{types}}
}
...
```

### symbols

List AISP symbols.

```bash
# All symbols
npx @aisp/reference symbols

# By category
npx @aisp/reference symbols --category logic
npx @aisp/reference symbols --category quantifier
npx @aisp/reference symbols --category type
```

**Output:**
```
∀  for all              [quantifier]  ∀x:Type:condition
∃  exists               [quantifier]  ∃x:Type:condition
∧  and                  [logic]       A∧B
∨  or                   [logic]       A∨B
⇒  implies              [logic]       A⇒B
≜  defined as           [definition]  name≜value
λ  lambda               [definition]  λx.body
ℕ  natural              [type]        n:ℕ
...
```

### blocks

List AISP block types.

```bash
npx @aisp/reference blocks
```

**Output:**
```
AISP Block Types:

REQUIRED:
  ⟦Ω⟧ Meta         - Foundation, meta-logic
  ⟦Σ⟧ Types        - Type definitions
  ⟦Γ⟧ Rules        - Inference rules
  ⟦Λ⟧ Functions    - Function definitions
  ⟦Ε⟧ Evidence     - Validation metrics

OPTIONAL:
  ⟦Θ⟧ Task         - Executable intent
  ⟦Χ⟧ Errors       - Error algebra
  ⟦Δ⟧ Contract     - Pre/Post conditions
  ...
```

### ascii

Show ASCII aliases for AISP symbols.

```bash
npx @aisp/reference ascii
```

**Output:**
```
ASCII Aliases for AISP Symbols:

  forall     → ∀
  exists     → ∃
  and        → ∧
  or         → ∨
  not        → ¬
  =>         → ⇒
  :=         → ≜
  fn         → λ
  ->         → →
  in         → ∈
  Bool       → 𝔹
  Nat        → ℕ
  ...
```

## Scripting Examples

### Validate Multiple Files

```bash
for f in specs/*.aisp; do
  echo "Checking $f..."
  npx @aisp/validator validate "$f" --json
done
```

### Generate AISP with Rosetta

```bash
# Get suggestions for your requirements
SUGGESTIONS=$(npx @aisp/reference rosetta suggest "for all users require auth")

# Get template
TEMPLATE=$(npx @aisp/reference template get minimal)

# Use in LLM prompt
echo "Using suggestions: $SUGGESTIONS"
echo "Template: $TEMPLATE"
```

### CI/CD Integration

```bash
#!/bin/bash
# validate-aisp.sh

set -e

for spec in "$@"; do
  echo "Validating: $spec"

  result=$(npx @aisp/validator validate "$spec" --json)
  valid=$(echo "$result" | jq -r '.valid')
  tier=$(echo "$result" | jq -r '.tierValue')

  if [ "$valid" != "true" ]; then
    echo "FAIL: $spec is invalid"
    exit 1
  fi

  if [ "$tier" -lt 2 ]; then
    echo "FAIL: $spec tier too low (need Silver or better)"
    exit 1
  fi

  echo "PASS: $spec"
done

echo "All specifications valid!"
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation failed or invalid input |
| 2 | File not found |
