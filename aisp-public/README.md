# AISP SDK (Public)

**MIT Licensed** - Free forever, no limits.

Complete SDK for AISP (AI Symbolic Protocol) 5.1 validation and reference.

## Packages

| Package | Purpose | License |
|---------|---------|---------|
| `@aisp/validator` | Parse, validate, tier, density | **MIT** |
| `@aisp/reference` | Anti-drift, Rosetta Stone, templates | **MIT** |

## Quick Start

```bash
# Validate an AISP document
npx @aisp/validator validate spec.aisp

# Get quality tier
npx @aisp/validator tier spec.aisp

# Get density score
npx @aisp/validator density spec.aisp

# Get anti-drift reference for LLM prompts
npx @aisp/reference anti-drift --compact

# Lookup prose → symbol
npx @aisp/reference rosetta lookup "for all"

# Explain symbol → prose
npx @aisp/reference rosetta explain "∀"
```

## @aisp/validator

**Always free. No limits. No messages.**

```bash
npx @aisp/validator validate <file|string>  # Full validation
npx @aisp/validator parse <file|string>     # Structure check
npx @aisp/validator tier <file|string>      # Quality tier
npx @aisp/validator density <file|string>   # Density score
```

### Quality Tiers

| Tier | Symbol | Density (δ) |
|------|--------|-------------|
| Platinum | ◊⁺⁺ | ≥ 0.75 |
| Gold | ◊⁺ | ≥ 0.60 |
| Silver | ◊ | ≥ 0.40 |
| Bronze | ◊⁻ | ≥ 0.20 |
| Rejected | ⊘ | < 0.20 |

## @aisp/reference

**Always free. No limits.**

```bash
npx @aisp/reference anti-drift              # Full reference
npx @aisp/reference anti-drift --compact    # ~1.5KB for prompts
npx @aisp/reference anti-drift --json       # Structured JSON

npx @aisp/reference rosetta lookup "..."    # Prose → Symbol
npx @aisp/reference rosetta explain "∀"     # Symbol → Prose
npx @aisp/reference rosetta suggest "..."   # Pattern suggestion

npx @aisp/reference template list           # List templates
npx @aisp/reference template get Γ:rule     # Get template

npx @aisp/reference symbols                 # Full glossary
npx @aisp/reference blocks                  # Block types
```

## Installation

```bash
npm install @aisp/validator @aisp/reference
```

Or use directly via npx (no installation needed):

```bash
npx @aisp/validator validate ./my-spec.aisp
```

## Programmatic Usage

```javascript
const { validate, parse, density } = require('@aisp/validator');

const result = validate(aispDocument);
// { valid: true, tier: '◊⁺⁺', delta: 0.82, errors: [] }

const structure = parse(aispDocument);
// { hasHeader: true, blocks: [...], errors: [] }
```

## Examples

See the `examples/` folder for 9 complete Rosetta Stone examples demonstrating:

- Prose → AISP conversion
- Tiered compilation (minimal/standard/full)
- Validation and density calculation

## License

**MIT** - Free forever, for everyone, with no restrictions.

```
Validator = "Can I read this?"  → Free
Reference = "What does ∀ mean?" → Free
```

## Links

- Documentation: `docs/`
- Examples: `examples/`
- Tests: `tests/`
