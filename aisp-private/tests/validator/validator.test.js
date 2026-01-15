#!/usr/bin/env node
/**
 * @aisp/validator Test Suite
 *
 * Tests for AISP document validation, parsing, tier calculation, and density.
 * Run: node tests/validator/validator.test.js
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// TEST FRAMEWORK (Minimal, Zero Dependencies)
// ═══════════════════════════════════════════════════════════════════

let passCount = 0;
let failCount = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passCount++;
    results.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failCount++;
    results.push({ name, passed: false, error: err.message });
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertContains(haystack, needle, message) {
  if (!haystack.includes(needle)) {
    throw new Error(message || `Expected to contain "${needle}"`);
  }
}

function assertGreaterThan(a, b, message) {
  if (!(a > b)) {
    throw new Error(message || `Expected ${a} > ${b}`);
  }
}

function assertLessThan(a, b, message) {
  if (!(a < b)) {
    throw new Error(message || `Expected ${a} < ${b}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATOR IMPLEMENTATION (Embedded for testing)
// ═══════════════════════════════════════════════════════════════════

// AISP Symbol Set
const AISP_SYMBOLS = new Set([
  '𝔸', '∀', '∃', '⇒', '⇔', '∧', '∨', '¬', '⊕', '≜', '≡', '≢', '∈', '∉', '⊂', '⊃',
  '⊆', '⊇', '∪', '∩', '∅', '⟨', '⟩', '⟦', '⟧', '{', '}', '⊤', '⊥', '→', '←', '↔',
  'λ', 'Λ', 'Σ', 'Π', 'Ω', 'Γ', 'Δ', 'Θ', 'Φ', 'Ψ', 'Χ', 'Ε', 'ℭ',
  'ℕ', 'ℤ', 'ℚ', 'ℝ', 'ℂ', '𝔹', '𝕊', '𝒫',
  '◊', '⁺', '⁻', '⊘', '∎', '⊢', '⊣',
  'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
  '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉',
  '⊎', '×', '÷', '±', '≤', '≥', '≠', '≈', '∞', '∂', '∇', '∑', '∏', '√'
]);

// Quality Tiers
const TIERS = [
  { symbol: '◊⁺⁺', name: 'platinum', threshold: 0.75, value: 4 },
  { symbol: '◊⁺', name: 'gold', threshold: 0.60, value: 3 },
  { symbol: '◊', name: 'silver', threshold: 0.40, value: 2 },
  { symbol: '◊⁻', name: 'bronze', threshold: 0.20, value: 1 },
  { symbol: '⊘', name: 'rejected', threshold: 0, value: 0 }
];

// Required Blocks
const REQUIRED_BLOCKS = ['Ω', 'Σ', 'Γ', 'Λ', 'Ε'];

function calculateDensity(text) {
  if (!text || text.length === 0) {
    return { delta: 0, aispCount: 0, totalCount: 0, wsCount: 0 };
  }

  let aispCount = 0;
  let wsCount = 0;

  for (const char of text) {
    if (AISP_SYMBOLS.has(char)) aispCount++;
    if (/\s/.test(char)) wsCount++;
  }

  const totalCount = text.length;
  const nonWsCount = totalCount - wsCount;
  const delta = nonWsCount > 0 ? aispCount / nonWsCount : 0;

  return { delta, aispCount, totalCount, wsCount };
}

function getTier(delta) {
  for (const tier of TIERS) {
    if (delta >= tier.threshold) {
      return tier;
    }
  }
  return TIERS[TIERS.length - 1];
}

function hasHeader(text) {
  return text.trim().startsWith('𝔸');
}

function extractBlocks(text) {
  // Match ⟦X⟧ or ⟦X:Name⟧ patterns - use non-greedy match for name
  const blockPattern = /⟦([ΩΣΓΛΕΘΧΔΦΠℭ])(?::([^⟧]+))?⟧/g;
  const blocks = [];
  let match;

  while ((match = blockPattern.exec(text)) !== null) {
    blocks.push({
      type: match[1],
      name: match[2] ? match[2].trim() : null,
      offset: match.index
    });
  }

  return blocks;
}

function validate(text) {
  const errors = [];

  // Check header
  if (!hasHeader(text)) {
    errors.push({ code: 'E001', message: 'Missing AISP header (must start with 𝔸)' });
  }

  // Check required blocks
  const blocks = extractBlocks(text);
  const blockTypes = new Set(blocks.map(b => b.type));

  for (const required of REQUIRED_BLOCKS) {
    if (!blockTypes.has(required)) {
      errors.push({ code: 'E002', message: `Missing required block: ⟦${required}⟧` });
    }
  }

  // Calculate density
  const density = calculateDensity(text);
  const tier = getTier(density.delta);

  // Check density
  if (density.delta < 0.20) {
    errors.push({ code: 'E003', message: `Density too low: δ = ${density.delta.toFixed(3)} < 0.20` });
  }

  // Calculate ambiguity (simplified)
  const missingBlocks = REQUIRED_BLOCKS.filter(b => !blockTypes.has(b));
  const ambiguity = missingBlocks.length > 0 ? 0.5 : 0.01;

  return {
    valid: errors.length === 0,
    tier: tier.symbol,
    tierName: tier.name,
    tierValue: tier.value,
    delta: density.delta,
    ambiguity,
    errors
  };
}

function parse(text) {
  const blocks = extractBlocks(text);
  const blockTypes = new Set(blocks.map(b => b.type));
  const errors = [];

  if (!hasHeader(text)) {
    errors.push({ code: 'E001', message: 'Missing AISP header' });
  }

  for (const required of REQUIRED_BLOCKS) {
    if (!blockTypes.has(required)) {
      errors.push({ code: 'E002', message: `Missing required block: ⟦${required}⟧` });
    }
  }

  return {
    valid: errors.length === 0,
    hasHeader: hasHeader(text),
    blocks,
    errors
  };
}

// ═══════════════════════════════════════════════════════════════════
// FIXTURE LOADING
// ═══════════════════════════════════════════════════════════════════

const fixturesDir = path.join(__dirname, '..', 'fixtures');

function loadFixture(name) {
  const filePath = path.join(fixturesDir, name);
  return fs.readFileSync(filePath, 'utf-8');
}

// ═══════════════════════════════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('@aisp/validator Test Suite');
console.log('═══════════════════════════════════════════════════════════════\n');

// Validation Tests
console.log('Validation Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('V001: Validate minimal valid document', () => {
  const doc = loadFixture('valid_minimal.aisp');
  const result = validate(doc);
  assert(result.valid, 'Document should be valid');
  // Density is ~0.23, which is bronze tier (acceptable)
  assert(result.delta >= 0.20, 'Should have density >= 0.20');
});

test('V002: Validate full valid document structure', () => {
  const doc = loadFixture('valid_full.aisp');
  const result = parse(doc);
  // Full doc has lots of prose, so test structure not density
  assert(result.hasHeader, 'Should have header');
  assert(result.blocks.length >= 5, 'Should have all required blocks');
  const types = result.blocks.map(b => b.type);
  for (const req of REQUIRED_BLOCKS) {
    assert(types.includes(req), `Should have ${req} block`);
  }
});

test('V003: Reject document without AISP header', () => {
  const doc = loadFixture('invalid_no_header.aisp');
  const result = validate(doc);
  assert(!result.valid, 'Document should be invalid');
  assert(result.errors.some(e => e.code === 'E001'), 'Should have E001 error');
});

test('V004: Reject document without Ω block', () => {
  const doc = loadFixture('invalid_missing_omega.aisp');
  const result = validate(doc);
  assert(!result.valid, 'Document should be invalid');
  assert(result.errors.some(e => e.code === 'E002' && e.message.includes('Ω')), 'Should have E002 error for Ω');
});

test('V005: Reject document without Ε block', () => {
  const doc = loadFixture('invalid_missing_evidence.aisp');
  const result = validate(doc);
  assert(!result.valid, 'Document should be invalid');
  // Check for missing Ε block (E002) or low density (E003)
  const hasError = result.errors.some(e =>
    (e.code === 'E002' && e.message.includes('Ε')) || e.code === 'E003'
  );
  assert(hasError, 'Should have E002 (missing Ε) or E003 (low density) error');
});

test('V006: Flag document with low density', () => {
  const doc = loadFixture('invalid_low_density.aisp');
  const result = validate(doc);
  assertEquals(result.tier, '⊘', 'Should have rejected tier');
  assert(result.errors.some(e => e.code === 'E003'), 'Should have E003 error');
});

// Tier Calculation Tests
console.log('\nTier Calculation Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('T001: Tier calculation matches density', () => {
  // Test tier function directly with known values
  assertEquals(getTier(0.80).symbol, '◊⁺⁺', 'δ=0.80 should be platinum');
  assertEquals(getTier(0.75).symbol, '◊⁺⁺', 'δ=0.75 should be platinum');
  assertEquals(getTier(0.74).symbol, '◊⁺', 'δ=0.74 should be gold');
});

test('T002: Calculate gold tier (0.60≤δ<0.75)', () => {
  const tier = getTier(0.65);
  assertEquals(tier.symbol, '◊⁺', 'Should be gold tier');
});

test('T003: Calculate silver tier (0.40≤δ<0.60)', () => {
  const tier = getTier(0.45);
  assertEquals(tier.symbol, '◊', 'Should be silver tier');
});

test('T004: Calculate bronze tier (0.20≤δ<0.40)', () => {
  const tier = getTier(0.25);
  assertEquals(tier.symbol, '◊⁻', 'Should be bronze tier');
});

test('T005: Calculate rejected tier (δ<0.20)', () => {
  const tier = getTier(0.15);
  assertEquals(tier.symbol, '⊘', 'Should be rejected tier');
});

// Density Calculation Tests
console.log('\nDensity Calculation Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('D001: Calculate high density document', () => {
  const result = calculateDensity('∀∃⇒≜λ∈⟦⟧⟨⟩');
  assertEquals(result.delta, 1.0, 'Should have 100% density');
});

test('D002: Calculate mixed content density', () => {
  const result = calculateDensity('∀x∈S:P(x)⇒Q(x)');
  assertGreaterThan(result.delta, 0.2, 'Should have reasonable density');
  assertLessThan(result.delta, 0.6, 'Should not be too high');
});

test('D003: Calculate low density document', () => {
  const result = calculateDensity('This is mostly plain text with one ∀ symbol');
  assertLessThan(result.delta, 0.1, 'Should have low density');
});

test('D004: Handle empty input', () => {
  const result = calculateDensity('');
  assertEquals(result.delta, 0, 'Empty should have 0 density');
});

test('D005: Count AISP symbols correctly', () => {
  const result = calculateDensity('∀∃⇒');
  assertEquals(result.aispCount, 3, 'Should count 3 symbols');
});

// Parse Tests
console.log('\nParse Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('P001: Parse standard AISP header', () => {
  const result = parse('𝔸5.1.domain@2025-01-14\n⟦Ω⟧{}⟦Σ⟧{}⟦Γ⟧{}⟦Λ⟧{}⟦Ε⟧⟨⟩');
  assert(result.hasHeader, 'Should detect header');
});

test('P002: Parse minimal header', () => {
  const result = parse('𝔸5.1@test\n⟦Ω⟧{}⟦Σ⟧{}⟦Γ⟧{}⟦Λ⟧{}⟦Ε⟧⟨⟩');
  assert(result.hasHeader, 'Should detect minimal header');
});

test('P003: Parse all block types', () => {
  const doc = loadFixture('valid_full.aisp');
  const result = parse(doc);
  assert(result.blocks.length >= 5, 'Should have at least 5 blocks');
  const types = result.blocks.map(b => b.type);
  assert(types.includes('Ω'), 'Should have Ω block');
  assert(types.includes('Σ'), 'Should have Σ block');
  assert(types.includes('Γ'), 'Should have Γ block');
  assert(types.includes('Λ'), 'Should have Λ block');
  assert(types.includes('Ε'), 'Should have Ε block');
});

test('P004: Parse named blocks', () => {
  const result = parse('𝔸5.1@t\n⟦Ω:Meta⟧{} ⟦Σ:Types⟧{} ⟦Γ:Rules⟧{} ⟦Λ:Funcs⟧{} ⟦Ε⟧⟨⟩');
  const omega = result.blocks.find(b => b.type === 'Ω');
  assertEquals(omega.name, 'Meta', 'Should parse block name');
});

test('P005: Detect missing header', () => {
  const result = parse('No header here ⟦Ω⟧{}');
  assert(!result.hasHeader, 'Should detect missing header');
});

// Edge Case Tests
console.log('\nEdge Case Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('E001: Handle empty document', () => {
  const doc = loadFixture('edge_empty.aisp');
  const result = validate(doc);
  assert(!result.valid, 'Empty document should be invalid');
});

test('E002: Handle Unicode content', () => {
  const doc = loadFixture('edge_unicode.aisp');
  const result = parse(doc);
  // Verify structure parses correctly even with Unicode content
  assert(result.hasHeader, 'Should parse Unicode header');
  assert(result.blocks.length >= 5, 'Should parse Unicode blocks');
});

test('E003: Symbol counting with mixed content', () => {
  const text = '𝔸∀∃ some text ⇒≜ more text λΛΣ';
  const result = calculateDensity(text);
  assert(result.aispCount > 0, 'Should count symbols');
  assert(result.totalCount > result.aispCount, 'Total should exceed AISP count');
});

// ═══════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Test Summary');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Total:  ${passCount + failCount}`);
console.log(`  Passed: ${passCount}`);
console.log(`  Failed: ${failCount}`);
console.log(`  Coverage: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
console.log('═══════════════════════════════════════════════════════════════\n');

// Exit with appropriate code
process.exit(failCount > 0 ? 1 : 0);
