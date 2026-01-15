# AISP SDK (Private)

Complete SDK for AISP (AI Symbolic Protocol) 5.1 - validation, reference, and conversion.

## Packages

| Package | Purpose | License |
|---------|---------|---------|
| `@aisp/validator` | Parse, validate, tier, density | **MIT** (free) |
| `@aisp/reference` | Anti-drift, Rosetta Stone, templates | **MIT** (free) |
| `@aisp/convert` | Prose-to-AISP tiered compilation | **Fair Use** |
| `@aisp/embeddings` | Intent matching, similarity | **Fair Use** |

## Quick Start

```bash
# Always free - validation
npx @aisp/validator validate spec.aisp
npx @aisp/validator tier spec.aisp

# Always free - reference
npx @aisp/reference rosetta lookup "for all"
npx @aisp/reference anti-drift --compact

# Fair use - conversion (free for 99.9% of users)
npx @aisp/convert minimal "Define x as 5"
npx @aisp/convert standard "Define a sum function"
npx @aisp/convert full "For all users, if admin then allow"
npx @aisp/convert auto "..."
```

## @aisp/convert

Tiered prose-to-AISP conversion.

### Compilation Tiers

| Tier | Tokens | Use Case | Command |
|------|--------|----------|---------|
| **Minimal** | 0.5-1x | Agent-to-agent, inline | `convert minimal "..."` |
| **Standard** | 1.5-2x | Standalone specs, docs | `convert standard "..."` |
| **Full** | 4-8x | Formal verification | `convert full "..."` |
| **Auto** | varies | Auto-detect | `convert auto "..."` |

### Example

```bash
$ npx @aisp/convert minimal "Define x as 5, y as 10, sum adds two numbers"
# Tier: minimal

x≜5
y≜10
sum≜λa.λb.a+b
```

```bash
$ npx @aisp/convert standard "Define x as 5"
# Tier: standard

𝔸5.1.math@2026-01-15
γ≔math

⟦Λ:Funcs⟧{
  x≜5
}

⟦Ε⟧⟨δ≜0.70;τ≜◊⁺⟩
```

### License

**Fair Use** - Free for:
- Individuals, academics, non-profits
- Organizations under $1B annual revenue
- Any organization: up to 100 conversions/month

Commercial license required only if:
- Revenue ≥ $1B/year **AND**
- Usage ≥ 100 conversions/month

**99.9% of users will never need a commercial license.**

## Licensing Summary

| Package | License | Free Forever? |
|---------|---------|---------------|
| `@aisp/validator` | MIT | **Yes** - always |
| `@aisp/reference` | MIT | **Yes** - always |
| `@aisp/convert` | Fair Use | Yes for 99.9% |
| `@aisp/embeddings` | Fair Use | Yes for 99.9% |

### Why This Model?

```
Validator = "Can I read this?"     → Commodity, free
Reference = "What does ∀ mean?"    → Commodity, free
Convert   = "Write this for me"    → Hard problem, fair use
```

## Full Command Reference

### @aisp/validator (MIT - Always Free)

```bash
npx @aisp/validator validate <file>   # Full validation
npx @aisp/validator parse <file>      # Structure check
npx @aisp/validator tier <file>       # Get tier
npx @aisp/validator density <file>    # Get δ score
```

### @aisp/reference (MIT - Always Free)

```bash
npx @aisp/reference anti-drift        # Full reference
npx @aisp/reference anti-drift --compact
npx @aisp/reference rosetta lookup "..."
npx @aisp/reference rosetta explain "∀"
npx @aisp/reference rosetta suggest "..."
npx @aisp/reference template list
npx @aisp/reference symbols
npx @aisp/reference blocks
```

### @aisp/convert (Fair Use)

```bash
npx @aisp/convert minimal <prose>     # Direct Rosetta
npx @aisp/convert standard <prose>    # + Header + evidence
npx @aisp/convert full <prose>        # + All blocks
npx @aisp/convert auto <prose>        # Auto-detect tier
```

## Installation

```bash
# Free packages
npm install @aisp/validator @aisp/reference

# All packages
npm install @aisp/validator @aisp/reference @aisp/convert
```

## Structure

```
aisp-private/
├── packages/
│   ├── validator/     # MIT - always free
│   ├── reference/     # MIT - always free
│   ├── convert/       # Fair Use
│   └── embeddings/    # Fair Use (planned)
├── docs/              # Documentation
├── tests/             # Test suites
├── examples/          # Rosetta Stone examples
└── specs/             # AISP specifications
```

## Links

- Public SDK (MIT): github.com/aisp/aisp-sdk
- Commercial: https://aisp.dev/enterprise
- Documentation: `docs/`
