# AISP SDK

Complete SDK for AISP (AI Symbolic Protocol) 5.1 - validation, reference, and intent matching.

## Packages

| Package | Purpose | Size |
|---------|---------|------|
| `@aisp/validator` | Parse, validate, tier, density | ~50KB |
| `@aisp/reference` | Anti-drift, Rosetta Stone, templates | ~200KB |
| `@aisp/embeddings` | Intent matching, similarity | ~1.5MB |

## Quick Start

```bash
# Install all packages
npm install @aisp/validator @aisp/reference

# Or use via npx
npx @aisp/validator validate ./spec.aisp
npx @aisp/reference anti-drift
npx @aisp/reference rosetta lookup "for all"
```

## NPX Commands

### @aisp/validator

```bash
npx @aisp/validator validate <file|string>  # Full validation
npx @aisp/validator parse <file|string>     # Parse only
npx @aisp/validator tier <file|string>      # Get tier
npx @aisp/validator density <file|string>   # Get density score
```

### @aisp/reference

```bash
npx @aisp/reference anti-drift              # Full anti-drift reference
npx @aisp/reference anti-drift --compact    # Compact version (~1.5KB)
npx @aisp/reference anti-drift --json       # JSON format

npx @aisp/reference rosetta lookup "for all"
npx @aisp/reference rosetta explain "∀"
npx @aisp/reference rosetta suggest "if admin then allow"

npx @aisp/reference template list
npx @aisp/reference template get Γ rule

npx @aisp/reference symbols
npx @aisp/reference blocks
```

### @aisp/embeddings

```bash
npx @aisp/embeddings match --prose "..." --aisp "..."
npx @aisp/embeddings match --threshold 0.75 --prose "..." --aisp "..."
```

## Documentation

- [Implementation Guide](docs/guides/implementation-guide.md)
- [NPX Usage Guide](docs/guides/npx-usage.md)
- [Crate Development](docs/guides/crate-development.md)
- [Testing Guide](docs/guides/testing.md)

## Architecture

```
aisp-sdk/
├── packages/
│   ├── validator/      # WASM validation kernel wrapper
│   ├── reference/      # Anti-drift + Rosetta + Templates
│   └── embeddings/     # Intent matching (Rust WASM)
├── docs/
│   ├── guides/         # Implementation guides
│   └── aisp-specs/     # Plans in AISP 5.1 format
└── scripts/            # Build and test scripts
```

## License

MIT OR Apache-2.0
