# AISP SDK Implementation Guide

Complete guide for implementing and using the AISP SDK packages.

## Package Overview

| Package | Purpose | Size | Status |
|---------|---------|------|--------|
| `@aisp/validator` | Validate AISP documents | ~50KB | Ready |
| `@aisp/reference` | Anti-drift, Rosetta, templates | ~200KB | Ready |
| `@aisp/embeddings` | Intent matching | ~1.5MB | Planned |

## Installation

```bash
# Install from npm
npm install @aisp/validator @aisp/reference

# Or use via npx (no install needed)
npx @aisp/validator validate ./spec.aisp
npx @aisp/reference anti-drift --compact
```

## Architecture

```
aisp-sdk/
├── packages/
│   ├── validator/          # WASM-based validation
│   │   ├── bin/cli.js     # CLI entry point
│   │   ├── dist/          # Built JavaScript
│   │   └── wasm/          # WASM binary (from aisp-wasm)
│   ├── reference/          # Reference data + Rosetta
│   │   ├── src/           # Rust source
│   │   ├── bin/cli.js     # CLI entry point
│   │   └── dist/          # Built output
│   └── embeddings/         # Intent matching (future)
└── docs/
    ├── guides/            # This documentation
    └── aisp-specs/        # Plans in AISP 5.1 format
```

## Building from Source

### Prerequisites

```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# WASM target
rustup target add wasm32-unknown-unknown

# Node.js 18+
node --version

# Optional: Binaryen for WASM optimization
npm install -g binaryen
```

### Build @aisp/reference

```bash
cd packages/reference

# Build WASM (optional, JS-only mode works without it)
./scripts/build.sh

# Test CLI
node bin/cli.js --help
```

### Build @aisp/validator

```bash
cd packages/validator

# Copy WASM from aisp-wasm or build fresh
./scripts/build.sh

# Test CLI
node bin/cli.js --help
```

## CLI Usage

### Validator Commands

```bash
# Validate a document
npx @aisp/validator validate spec.aisp
npx @aisp/validator validate "𝔸1.0.test@ctx..."

# Parse structure only
npx @aisp/validator parse spec.aisp

# Get tier
npx @aisp/validator tier spec.aisp

# Get density
npx @aisp/validator density spec.aisp

# JSON output
npx @aisp/validator validate spec.aisp --json
```

### Reference Commands

```bash
# Anti-drift reference (for prompt injection)
npx @aisp/reference anti-drift           # Full AISP format
npx @aisp/reference anti-drift --compact # Minimal version
npx @aisp/reference anti-drift --json    # Structured data

# Rosetta Stone lookups
npx @aisp/reference rosetta lookup "for all"
npx @aisp/reference rosetta explain "∀"
npx @aisp/reference rosetta suggest "if admin then allow"

# Templates
npx @aisp/reference template list
npx @aisp/reference template get Γ:rule
npx @aisp/reference template get minimal

# Symbol reference
npx @aisp/reference symbols
npx @aisp/reference symbols --category logic
npx @aisp/reference blocks
npx @aisp/reference ascii
```

## JavaScript API

### @aisp/validator

```javascript
const AISP = require('@aisp/validator');

// Initialize (loads WASM)
await AISP.init();

// Validate
const result = AISP.validate(aispDocument);
console.log(result);
// {
//   valid: true,
//   tier: '◊⁺',
//   tierValue: 3,
//   delta: 0.68,
//   ambiguity: 0.01
// }

// Quick checks
AISP.isValid(doc);    // boolean
AISP.getTier(doc);    // '◊⁺'
AISP.getDensity(doc); // 0.68
```

### @aisp/reference

```javascript
const { rosetta, templates, blocks, antiDrift } = require('@aisp/reference');

// Anti-drift
const ref = antiDrift();           // Full
const compact = antiDrift.compact(); // ~1.5KB
const json = antiDrift.json();     // Structured

// Rosetta lookups
rosetta.lookup("for all");
// { symbol: '∀', confidence: 0.98, category: 'quantifier' }

rosetta.explain("∀");
// { prose: ['for all', 'every'], usage: '∀x:Type:condition' }

rosetta.suggest("if x is admin then allow access");
// [{ pattern: '∀x:User:admin(x)⇒allow(x)', confidence: 0.89 }]

// Templates
templates.list();
templates.get('Γ:rule');
templates.get('minimal');

// Blocks
blocks.list();
blocks.required();
blocks.optional();
```

## Integration with Claude Code

### Option 1: CLAUDE.md Configuration

Add to your project's `CLAUDE.md`:

```markdown
## AISP Validation Protocol

When generating AISP specifications:

1. Use anti-drift reference:
   \`\`\`bash
   npx @aisp/reference anti-drift --compact
   \`\`\`

2. Generate AISP using symbols from Rosetta:
   \`\`\`bash
   npx @aisp/reference rosetta suggest "your prose"
   \`\`\`

3. Validate output:
   \`\`\`bash
   npx @aisp/validator validate "generated aisp"
   \`\`\`

4. Ensure tier ≥ ◊ (Silver) and ambiguity < 0.02
```

### Option 2: Slash Command

Create `.claude/commands/aisp.md`:

```markdown
Convert the following to AISP 5.1:

$ARGUMENTS

Process:
1. Get anti-drift reference: `npx @aisp/reference anti-drift --compact`
2. Get symbol suggestions: `npx @aisp/reference rosetta suggest "$ARGUMENTS"`
3. Generate AISP using symbols and templates
4. Validate: `npx @aisp/validator validate "generated aisp" --json`
5. Iterate until valid with tier ≥ ◊

Output the validated AISP document.
```

Usage: `/aisp Create a user authentication system with sessions`

### Option 3: Custom Skill

Create `.claude/skills/aisp-convert.yaml`:

```yaml
name: aisp-convert
description: Convert prose to AISP 5.1
triggers:
  - "convert to aisp"
  - "aisp for"

steps:
  - bash: npx @aisp/reference anti-drift --json > /tmp/aisp-ref.json
  - bash: npx @aisp/reference rosetta suggest "${input}" > /tmp/suggestions.json
  - prompt: |
      Using the anti-drift reference and Rosetta suggestions,
      generate an AISP 5.1 document for: ${input}
  - bash: npx @aisp/validator validate "${output}" --json
  - validate: result.valid == true && result.tierValue >= 2
```

## Testing

### Unit Tests

```bash
cd packages/validator
npm test

cd packages/reference
npm test
```

### Manual Testing

```bash
# Test anti-drift output
npx @aisp/reference anti-drift | head -20

# Test Rosetta
npx @aisp/reference rosetta lookup "implies"

# Test validation with sample document
cat > /tmp/test.aisp << 'EOF'
𝔸1.0.test@example
γ≔test

⟦Ω:Meta⟧{
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  T≜ℕ
}

⟦Γ:Rules⟧{
  ∀x:T:x≥0
}

⟦Λ:Funcs⟧{
  f≜λx.x
}

⟦Ε⟧⟨δ≜0.70;φ≜100;τ≜◊⁺⟩
EOF

npx @aisp/validator validate /tmp/test.aisp
```

## Error Handling

### Validation Errors

| Code | Meaning | Fix |
|------|---------|-----|
| `MISSING_HEADER` | No 𝔸 at start | Add `𝔸version.name@context` |
| `MISSING_BLOCK` | Required block absent | Add missing ⟦X⟧ block |
| `LOW_DENSITY` | δ < 0.20 | Add more AISP symbols |
| `HIGH_AMBIGUITY` | Ambig ≥ 0.02 | Ensure all required blocks present |

### Common Issues

1. **Document too large**: Max 1KB for WASM validator
2. **Invalid UTF-8**: Ensure proper encoding
3. **Missing evidence**: ⟦Ε⟧ block is required

## Best Practices

1. **Start with anti-drift reference** - Include in prompts
2. **Use Rosetta for symbol lookup** - Don't guess symbols
3. **Target ◊⁺ (Gold) tier** - δ ≥ 0.60
4. **Validate before output** - Catch errors early
5. **Use templates** - Consistent structure

## Next Steps

- [NPX Usage Guide](./npx-usage.md) - Detailed CLI examples
- [Crate Development](./crate-development.md) - Rust development guide
- [Testing Guide](./testing.md) - Comprehensive testing
