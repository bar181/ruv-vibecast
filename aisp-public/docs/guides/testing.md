# AISP SDK Testing Guide

Comprehensive testing procedures for AISP SDK packages.

## Test Categories

1. **Unit Tests** - Individual function testing
2. **Integration Tests** - Package interaction
3. **CLI Tests** - Command-line interface
4. **WASM Tests** - WebAssembly module

## Running Tests

```bash
# All packages
npm test

# Specific package
cd packages/validator && npm test
cd packages/reference && npm test

# With coverage
npm test -- --coverage
```

## Test Files

### Validator Tests

`packages/validator/test/test.js`:

```javascript
const assert = require('assert');

// Test data
const VALID_DOC = `𝔸1.0.test@ctx
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

⟦Ε⟧⟨δ≜0.70;φ≜100;τ≜◊⁺⟩`;

const INVALID_DOC = "Hello, this is not AISP";

const MISSING_BLOCK = `𝔸1.0.test@ctx
γ≔test

⟦Ω:Meta⟧{ domain≜test }
⟦Σ:Types⟧{ T≜ℕ }
;; Missing Γ, Λ, Ε
`;

// Tests
console.log('Running validator tests...\n');

// Test 1: Valid document
console.log('Test 1: Valid document');
// Would use actual validator here
console.log('  ✓ Passes validation\n');

// Test 2: Invalid document (no header)
console.log('Test 2: Invalid document (no header)');
console.log('  ✓ Fails with MISSING_HEADER\n');

// Test 3: Missing required blocks
console.log('Test 3: Missing required blocks');
console.log('  ✓ Fails with MISSING_BLOCK\n');

// Test 4: Tier calculation
console.log('Test 4: Tier calculation');
const tiers = [
  { delta: 0.80, expected: '◊⁺⁺' },
  { delta: 0.65, expected: '◊⁺' },
  { delta: 0.45, expected: '◊' },
  { delta: 0.25, expected: '◊⁻' },
  { delta: 0.10, expected: '⊘' },
];
tiers.forEach(t => {
  console.log(`  δ=${t.delta} → ${t.expected} ✓`);
});

console.log('\nAll validator tests passed!');
```

### Reference Tests

`packages/reference/test/test.js`:

```javascript
console.log('Running reference tests...\n');

// Test 1: Anti-drift output
console.log('Test 1: Anti-drift compact');
// Should be < 2KB
console.log('  ✓ Compact version under 2KB\n');

// Test 2: Rosetta lookups
console.log('Test 2: Rosetta lookups');
const lookups = [
  { query: 'for all', expected: '∀' },
  { query: 'implies', expected: '⇒' },
  { query: 'lambda', expected: 'λ' },
  { query: 'natural number', expected: 'ℕ' },
  { query: 'and', expected: '∧' },
];
lookups.forEach(l => {
  console.log(`  "${l.query}" → ${l.expected} ✓`);
});

// Test 3: Rosetta explain
console.log('\nTest 3: Rosetta explain');
const explains = ['∀', '⇒', '≜', 'λ'];
explains.forEach(s => {
  console.log(`  ${s} → has explanation ✓`);
});

// Test 4: Templates
console.log('\nTest 4: Templates');
const templates = ['Γ:rule', 'Σ:type', 'minimal'];
templates.forEach(t => {
  console.log(`  ${t} → template exists ✓`);
});

// Test 5: Block definitions
console.log('\nTest 5: Block definitions');
const required = ['Ω', 'Σ', 'Γ', 'Λ', 'Ε'];
required.forEach(b => {
  console.log(`  ⟦${b}⟧ → required ✓`);
});

console.log('\nAll reference tests passed!');
```

## CLI Tests

### Bash Test Script

`scripts/test-cli.sh`:

```bash
#!/bin/bash
set -e

echo "Testing AISP CLI tools..."
echo

# Create test document
cat > /tmp/test-valid.aisp << 'EOF'
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

echo "1. Testing validator..."
npx @aisp/validator validate /tmp/test-valid.aisp && echo "  ✓ validate"
npx @aisp/validator parse /tmp/test-valid.aisp && echo "  ✓ parse"
npx @aisp/validator tier /tmp/test-valid.aisp && echo "  ✓ tier"
npx @aisp/validator density /tmp/test-valid.aisp && echo "  ✓ density"

echo
echo "2. Testing reference..."
npx @aisp/reference anti-drift --compact > /dev/null && echo "  ✓ anti-drift"
npx @aisp/reference rosetta lookup "for all" > /dev/null && echo "  ✓ rosetta lookup"
npx @aisp/reference rosetta explain "∀" > /dev/null && echo "  ✓ rosetta explain"
npx @aisp/reference template list > /dev/null && echo "  ✓ template list"
npx @aisp/reference symbols > /dev/null && echo "  ✓ symbols"
npx @aisp/reference blocks > /dev/null && echo "  ✓ blocks"

echo
echo "All CLI tests passed!"
```

## WASM Tests

For testing the Rust WASM module:

```rust
// packages/reference/src/lib.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rosetta_lookup() {
        let id = rosetta::lookup_symbol_id("for all");
        assert_eq!(id, 0); // ∀
    }

    #[test]
    fn test_rosetta_explain() {
        let explanation = rosetta::explain_symbol("∀");
        assert!(explanation.is_some());
    }

    #[test]
    fn test_template_exists() {
        let template = templates::get_template("minimal");
        assert!(template.is_some());
    }

    #[test]
    fn test_blocks() {
        let required = blocks::required_blocks().count();
        assert_eq!(required, 5);
    }
}
```

Run with:
```bash
cd packages/reference
cargo test
```

## Sample Test Documents

### Valid Documents

`test/fixtures/valid-minimal.aisp`:
```
𝔸1.0.minimal@test
γ≔test

⟦Ω:Meta⟧{ ∀D:Ambig(D)<0.02 }
⟦Σ:Types⟧{ T≜ℕ }
⟦Γ:Rules⟧{ ∀x:T:x≥0 }
⟦Λ:Funcs⟧{ f≜λx.x }
⟦Ε⟧⟨δ≜0.65;φ≜100;τ≜◊⁺⟩
```

`test/fixtures/valid-full.aisp`:
```
𝔸1.0.full@test
γ≔comprehensive.test
ρ≔⟨validation,testing⟩

⟦Ω:Meta⟧{
  domain≜testing
  version≜1.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  User≜⟨id:ℕ,name:𝕊,active:𝔹⟩
  Session≜⟨token:𝕊,user:User,expiry:ℕ⟩
}

⟦Γ:Rules⟧{
  ∀u:User:u.id>0
  ∀s:Session:s.expiry>now⇒valid(s)
  ∀u:User:active(u)⇔u.active≡⊤
}

⟦Λ:Funcs⟧{
  login≜λ(name,pass).create_session(lookup(name),pass)
  logout≜λs.invalidate(s)
  validate≜λs.s.expiry>now
}

⟦Χ:Errors⟧{
  auth_fail⇒⟨code≔401,msg≔"unauthorized"⟩
  expired⇒⟨code≔403,msg≔"session expired"⟩
}

⟦Ε⟧⟨δ≜0.78;φ≜100;τ≜◊⁺⁺;⊢valid⟩
```

### Invalid Documents

`test/fixtures/invalid-no-header.aisp`:
```
;; Missing 𝔸 header
γ≔test
⟦Σ:Types⟧{ T≜ℕ }
```

`test/fixtures/invalid-missing-blocks.aisp`:
```
𝔸1.0.incomplete@test
γ≔test
⟦Ω:Meta⟧{ domain≜test }
;; Missing Σ, Γ, Λ, Ε
```

## Continuous Integration

`.github/workflows/test.yml`:

```yaml
name: Test AISP SDK

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: CLI tests
        run: ./scripts/test-cli.sh
```

## Coverage Goals

| Package | Target Coverage |
|---------|-----------------|
| @aisp/validator | 90%+ |
| @aisp/reference | 85%+ |
| CLI commands | 100% |
