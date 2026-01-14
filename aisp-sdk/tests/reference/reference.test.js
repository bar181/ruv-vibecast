#!/usr/bin/env node
/**
 * @aisp/reference Test Suite
 *
 * Tests for AISP reference data: anti-drift, Rosetta Stone, templates, symbols, blocks.
 * Run: node tests/reference/reference.test.js
 */

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
  if (typeof haystack === 'string') {
    if (!haystack.includes(needle)) {
      throw new Error(message || `Expected to contain "${needle}"`);
    }
  } else if (Array.isArray(haystack)) {
    if (!haystack.includes(needle)) {
      throw new Error(message || `Expected array to include "${needle}"`);
    }
  }
}

function assertGreaterThanOrEqual(a, b, message) {
  if (!(a >= b)) {
    throw new Error(message || `Expected ${a} >= ${b}`);
  }
}

function assertLessThanOrEqual(a, b, message) {
  if (!(a <= b)) {
    throw new Error(message || `Expected ${a} <= ${b}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// REFERENCE DATA (Embedded for testing)
// ═══════════════════════════════════════════════════════════════════

// Anti-Drift Documents
const ANTI_DRIFT_FULL = `AISP 5.1 Platinum — Quick-Inject Reference (Anti-Drift)

Σ_512 Glossary (Core Subset):
  ∀ (forall), ∃ (exists), ⇒ (implies), ⇔ (iff)
  ∧ (and), ∨ (or), ¬ (not), ⊕ (xor)
  ≜ (defined-as), ≡ (equivalent), ≢ (not-equivalent)
  ∈ (element-of), ∉ (not-element-of)
  ⊂ (proper-subset), ⊆ (subset), ⊃ (proper-superset), ⊇ (superset)
  ∪ (union), ∩ (intersection), ∅ (empty-set)
  ⟨⟩ (tuple), ⟦⟧ (block), {} (set/record)
  → (function-arrow), λ (lambda), Λ (type-lambda)
  ℕ (natural), ℤ (integer), ℚ (rational), ℝ (real), ℂ (complex)
  𝔹 (boolean), 𝕊 (string), 𝒫 (powerset)

Tiers (δ = |AISP symbols| / |non-whitespace|):
  ◊⁺⁺ Platinum: δ ≥ 0.75
  ◊⁺  Gold:     δ ≥ 0.60
  ◊   Silver:   δ ≥ 0.40
  ◊⁻  Bronze:   δ ≥ 0.20
  ⊘   Rejected: δ < 0.20

Blocks (Required: Ω Σ Γ Λ Ε):
  ⟦Ω:Meta⟧     — Domain, version, constraints
  ⟦Σ:Types⟧    — Type definitions
  ⟦Γ:Rules⟧    — Business rules, invariants
  ⟦Λ:Funcs⟧    — Function definitions
  ⟦Ε:Evidence⟧ — Quality metrics ⟨δ≜...;φ≜...;τ≜...;⊢valid;∎⟩

Optional Blocks:
  ⟦Θ:Tasks⟧, ⟦Χ:Errors⟧, ⟦Δ:Contracts⟧, ⟦Φ:Functions⟧, ⟦Π:Proofs⟧, ⟦ℭ:Categories⟧

Bindings:
  Type: T≜⟨field:Type,...⟩
  Enum: E≜a|b|c
  Function: f≜λx.body
  Rule: ∀x∈T:P(x)⇒Q(x)

Validation:
  Ambig(D) < 0.02
  Header: 𝔸5.1.domain@date`;

const ANTI_DRIFT_COMPACT = `AISP 5.1 Quick Reference

Symbols: ∀∃⇒⇔∧∨¬⊕≜≡∈∉⊂⊆→λℕℤℝ𝔹𝕊𝒫⟨⟩⟦⟧

Tiers: ◊⁺⁺(≥0.75) ◊⁺(≥0.60) ◊(≥0.40) ◊⁻(≥0.20) ⊘(<0.20)

Required: ⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧

Patterns:
  Type: T≜⟨f:τ⟩
  Rule: ∀x:P(x)⇒Q(x)
  Func: f≜λx.e
  Evidence: ⟦Ε⟧⟨δ≜v;τ≜t;⊢valid;∎⟩`;

// Rosetta Stone
const ROSETTA = [
  { id: 0, symbol: '∀', prose: ['for all', 'for every', 'universal'], category: 'quantifier', usage: '∀x∈S:P(x)' },
  { id: 1, symbol: '∃', prose: ['exists', 'there exists', 'some'], category: 'quantifier', usage: '∃x∈S:P(x)' },
  { id: 2, symbol: '⇒', prose: ['implies', 'if then', 'entails'], category: 'logic', usage: 'P⇒Q' },
  { id: 3, symbol: '⇔', prose: ['if and only if', 'iff', 'equivalent'], category: 'logic', usage: 'P⇔Q' },
  { id: 4, symbol: '∧', prose: ['and', 'conjunction'], category: 'logic', usage: 'P∧Q' },
  { id: 5, symbol: '∨', prose: ['or', 'disjunction'], category: 'logic', usage: 'P∨Q' },
  { id: 6, symbol: '¬', prose: ['not', 'negation'], category: 'logic', usage: '¬P' },
  { id: 7, symbol: '⊕', prose: ['xor', 'exclusive or'], category: 'logic', usage: 'P⊕Q' },
  { id: 8, symbol: '≜', prose: ['defined as', 'definition', 'is defined as'], category: 'definition', usage: 'T≜⟨...⟩' },
  { id: 9, symbol: '≡', prose: ['equivalent', 'identical', 'same as'], category: 'definition', usage: 'a≡b' },
  { id: 10, symbol: '∈', prose: ['element of', 'in', 'member of'], category: 'set', usage: 'x∈S' },
  { id: 11, symbol: '∉', prose: ['not element of', 'not in'], category: 'set', usage: 'x∉S' },
  { id: 12, symbol: '⊂', prose: ['proper subset', 'strict subset'], category: 'set', usage: 'A⊂B' },
  { id: 13, symbol: '⊆', prose: ['subset', 'subset or equal'], category: 'set', usage: 'A⊆B' },
  { id: 14, symbol: '∪', prose: ['union'], category: 'set', usage: 'A∪B' },
  { id: 15, symbol: '∩', prose: ['intersection'], category: 'set', usage: 'A∩B' },
  { id: 16, symbol: '∅', prose: ['empty set', 'null set'], category: 'set', usage: 'S=∅' },
  { id: 17, symbol: 'λ', prose: ['lambda', 'anonymous function', 'function'], category: 'type', usage: 'λx.x+1' },
  { id: 18, symbol: 'Λ', prose: ['type lambda', 'type abstraction', 'functions block'], category: 'block', usage: '⟦Λ⟧' },
  { id: 19, symbol: '→', prose: ['arrow', 'maps to', 'function type'], category: 'type', usage: 'A→B' },
  { id: 20, symbol: 'ℕ', prose: ['natural numbers', 'naturals', 'non-negative integers'], category: 'type', usage: 'x:ℕ' },
  { id: 21, symbol: 'ℤ', prose: ['integers'], category: 'type', usage: 'x:ℤ' },
  { id: 22, symbol: 'ℝ', prose: ['real numbers', 'reals'], category: 'type', usage: 'x:ℝ' },
  { id: 23, symbol: '𝔹', prose: ['boolean', 'bool', 'true or false'], category: 'type', usage: 'flag:𝔹' },
  { id: 24, symbol: '𝕊', prose: ['string', 'text'], category: 'type', usage: 'name:𝕊' },
  { id: 25, symbol: '𝒫', prose: ['powerset', 'set of subsets'], category: 'type', usage: '𝒫(S)' },
  { id: 26, symbol: 'Ω', prose: ['omega', 'meta block', 'metadata'], category: 'block', usage: '⟦Ω⟧' },
  { id: 27, symbol: 'Σ', prose: ['sigma', 'types block', 'type definitions'], category: 'block', usage: '⟦Σ⟧' },
  { id: 28, symbol: 'Γ', prose: ['gamma', 'rules block', 'constraints'], category: 'block', usage: '⟦Γ⟧' },
  { id: 29, symbol: 'Ε', prose: ['epsilon', 'evidence block', 'quality metrics'], category: 'block', usage: '⟦Ε⟧' },
];

// Templates
const TEMPLATES = {
  'Ω:meta': '⟦Ω:Meta⟧{\n  domain≜{domain}\n  version≜{version}\n  ∀D∈AISP:Ambig(D)<0.02\n}',
  'Σ:type': '⟦Σ:Types⟧{\n  {TypeName}≜⟨{field}:{Type}⟩\n}',
  'Σ:record': '⟦Σ⟧{\n  {RecordName}≜⟨\n    {field1}:{Type1},\n    {field2}:{Type2}\n  ⟩\n}',
  'Γ:rule': '⟦Γ:Rules⟧{\n  ∀x∈{Type}:{predicate}\n}',
  'Γ:implication': '⟦Γ⟧{\n  {condition}⇒{consequence}\n}',
  'Λ:func': '⟦Λ:Funcs⟧{\n  {name}≜λ{params}.{body}\n}',
  'Ε:evidence': '⟦Ε⟧⟨δ≜{delta};φ≜{phi};τ≜{tier};⊢valid;∎⟩',
  'Θ:task': '⟦Θ:Tasks⟧{\n  {task_name}≜⟨name≔"{name}",status≔{status}⟩\n}',
  'Δ:contract': '⟦Δ:Contracts⟧{\n  {name}_contract≜⟨\n    pre≔{precondition},\n    post≔{postcondition},\n    inv≔{invariant}\n  ⟩\n}',
  'minimal': '𝔸5.1.{domain}@{date}\nγ≔{domain}\nρ≔⟨{tags}⟩\n\n⟦Ω:Meta⟧{\n  domain≜{domain}\n  version≜1.0.0\n}\n\n⟦Σ:Types⟧{\n  ;; Type definitions\n}\n\n⟦Γ:Rules⟧{\n  ;; Business rules\n}\n\n⟦Λ:Funcs⟧{\n  ;; Functions\n}\n\n⟦Ε⟧⟨δ≜0.60;φ≜100;τ≜◊⁺;⊢valid;∎⟩'
};

// Symbols
const SYMBOLS = [
  { symbol: '∀', name: 'for all', ascii: 'forall', category: 'quantifier' },
  { symbol: '∃', name: 'exists', ascii: 'exists', category: 'quantifier' },
  { symbol: '⇒', name: 'implies', ascii: '=>', category: 'logic' },
  { symbol: '⇔', name: 'iff', ascii: '<=>', category: 'logic' },
  { symbol: '∧', name: 'and', ascii: '&&', category: 'logic' },
  { symbol: '∨', name: 'or', ascii: '||', category: 'logic' },
  { symbol: '¬', name: 'not', ascii: '!', category: 'logic' },
  { symbol: '⊕', name: 'xor', ascii: '^', category: 'logic' },
  { symbol: '≜', name: 'defined as', ascii: ':=', category: 'definition' },
  { symbol: '≡', name: 'equivalent', ascii: '==', category: 'definition' },
  { symbol: '≢', name: 'not equivalent', ascii: '!=', category: 'definition' },
  { symbol: '∈', name: 'element of', ascii: 'in', category: 'set' },
  { symbol: '∉', name: 'not in', ascii: 'notin', category: 'set' },
  { symbol: '⊂', name: 'proper subset', ascii: 'psubset', category: 'set' },
  { symbol: '⊆', name: 'subset', ascii: 'subset', category: 'set' },
  { symbol: '⊃', name: 'proper superset', ascii: 'psuperset', category: 'set' },
  { symbol: '⊇', name: 'superset', ascii: 'superset', category: 'set' },
  { symbol: '∪', name: 'union', ascii: 'union', category: 'set' },
  { symbol: '∩', name: 'intersection', ascii: 'intersect', category: 'set' },
  { symbol: '∅', name: 'empty set', ascii: 'empty', category: 'set' },
  { symbol: '⟨', name: 'left tuple', ascii: '<', category: 'structure' },
  { symbol: '⟩', name: 'right tuple', ascii: '>', category: 'structure' },
  { symbol: '⟦', name: 'left block', ascii: '[[', category: 'structure' },
  { symbol: '⟧', name: 'right block', ascii: ']]', category: 'structure' },
  { symbol: '⊤', name: 'true', ascii: 'true', category: 'logic' },
  { symbol: '⊥', name: 'false', ascii: 'false', category: 'logic' },
  { symbol: '→', name: 'arrow', ascii: '->', category: 'type' },
  { symbol: '←', name: 'left arrow', ascii: '<-', category: 'type' },
  { symbol: '↔', name: 'bidirectional', ascii: '<->', category: 'type' },
  { symbol: 'λ', name: 'lambda', ascii: 'lambda', category: 'type' },
  { symbol: 'Λ', name: 'type lambda', ascii: 'Lambda', category: 'block' },
  { symbol: 'Σ', name: 'sigma', ascii: 'Sigma', category: 'block' },
  { symbol: 'Π', name: 'pi', ascii: 'Pi', category: 'block' },
  { symbol: 'Ω', name: 'omega', ascii: 'Omega', category: 'block' },
  { symbol: 'Γ', name: 'gamma', ascii: 'Gamma', category: 'block' },
  { symbol: 'Δ', name: 'delta', ascii: 'Delta', category: 'block' },
  { symbol: 'Θ', name: 'theta', ascii: 'Theta', category: 'block' },
  { symbol: 'Φ', name: 'phi', ascii: 'Phi', category: 'block' },
  { symbol: 'Ψ', name: 'psi', ascii: 'Psi', category: 'block' },
  { symbol: 'Χ', name: 'chi', ascii: 'Chi', category: 'block' },
  { symbol: 'Ε', name: 'epsilon', ascii: 'Epsilon', category: 'block' },
  { symbol: 'ℭ', name: 'categories', ascii: 'Cat', category: 'block' },
  { symbol: 'ℕ', name: 'naturals', ascii: 'Nat', category: 'type' },
  { symbol: 'ℤ', name: 'integers', ascii: 'Int', category: 'type' },
  { symbol: 'ℚ', name: 'rationals', ascii: 'Rat', category: 'type' },
  { symbol: 'ℝ', name: 'reals', ascii: 'Real', category: 'type' },
  { symbol: 'ℂ', name: 'complex', ascii: 'Complex', category: 'type' },
  { symbol: '𝔹', name: 'boolean', ascii: 'Bool', category: 'type' },
  { symbol: '𝕊', name: 'string', ascii: 'String', category: 'type' },
  { symbol: '𝒫', name: 'powerset', ascii: 'Powerset', category: 'type' },
  { symbol: '◊', name: 'quality tier', ascii: 'tier', category: 'quality' },
  { symbol: '⁺', name: 'plus', ascii: '+', category: 'modifier' },
  { symbol: '⁻', name: 'minus', ascii: '-', category: 'modifier' },
  { symbol: '⊘', name: 'rejected', ascii: 'rejected', category: 'quality' },
  { symbol: '∎', name: 'end proof', ascii: 'QED', category: 'proof' },
  { symbol: '⊢', name: 'proves', ascii: '|-', category: 'proof' },
  { symbol: '⊣', name: 'proved by', ascii: '-|', category: 'proof' },
  { symbol: '⊎', name: 'disjoint union', ascii: '+|', category: 'set' },
  { symbol: '×', name: 'product', ascii: '*', category: 'type' },
  { symbol: '≤', name: 'less or equal', ascii: '<=', category: 'comparison' },
  { symbol: '≥', name: 'greater or equal', ascii: '>=', category: 'comparison' },
  { symbol: '≠', name: 'not equal', ascii: '!=', category: 'comparison' },
  { symbol: '≈', name: 'approximately', ascii: '~=', category: 'comparison' },
  { symbol: '∞', name: 'infinity', ascii: 'inf', category: 'special' },
];

// Blocks
const BLOCKS = [
  { symbol: 'Ω', name: 'Meta', purpose: 'Domain metadata, version, constraints', required: true },
  { symbol: 'Σ', name: 'Types', purpose: 'Type definitions', required: true },
  { symbol: 'Γ', name: 'Rules', purpose: 'Business rules, invariants', required: true },
  { symbol: 'Λ', name: 'Funcs', purpose: 'Function definitions', required: true },
  { symbol: 'Ε', name: 'Evidence', purpose: 'Quality metrics, validation status', required: true },
  { symbol: 'Θ', name: 'Tasks', purpose: 'Task definitions', required: false },
  { symbol: 'Χ', name: 'Errors', purpose: 'Error definitions', required: false },
  { symbol: 'Δ', name: 'Contracts', purpose: 'Pre/post conditions, invariants', required: false },
  { symbol: 'Φ', name: 'Functions', purpose: 'Extended function definitions', required: false },
  { symbol: 'Π', name: 'Proofs', purpose: 'Formal proofs', required: false },
  { symbol: 'ℭ', name: 'Categories', purpose: 'Category theory structures', required: false },
];

// ═══════════════════════════════════════════════════════════════════
// REFERENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function antiDrift(mode = 'full') {
  return mode === 'compact' ? ANTI_DRIFT_COMPACT : ANTI_DRIFT_FULL;
}

function rosettaLookup(query) {
  const lowerQuery = query.toLowerCase();
  return ROSETTA.find(r =>
    r.prose.some(p => p.toLowerCase() === lowerQuery) ||
    r.prose.some(p => p.toLowerCase().includes(lowerQuery))
  ) || null;
}

function rosettaExplain(symbol) {
  return ROSETTA.find(r => r.symbol === symbol) || null;
}

function rosettaSuggest(prose) {
  const lowerProse = prose.toLowerCase();
  return ROSETTA
    .filter(r => r.prose.some(p => p.toLowerCase().includes(lowerProse)))
    .map(r => ({ symbol: r.symbol, confidence: 0.8 }));
}

function templateList() {
  return Object.keys(TEMPLATES);
}

function templateGet(name) {
  return TEMPLATES[name] || null;
}

function symbolsList(category = null) {
  if (category) {
    return SYMBOLS.filter(s => s.category === category);
  }
  return SYMBOLS;
}

function symbolsAscii() {
  return SYMBOLS.map(s => [s.ascii, s.symbol]);
}

function blocksList() {
  return BLOCKS;
}

function blocksRequired() {
  return BLOCKS.filter(b => b.required);
}

function blocksOptional() {
  return BLOCKS.filter(b => !b.required);
}

// ═══════════════════════════════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('@aisp/reference Test Suite');
console.log('═══════════════════════════════════════════════════════════════\n');

// Anti-Drift Tests
console.log('Anti-Drift Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('AD001: Anti-drift full document exists', () => {
  const result = antiDrift('full');
  assert(result.length > 0, 'Full document should not be empty');
  assertContains(result, 'AISP 5.1', 'Should contain AISP 5.1');
});

test('AD002: Anti-drift full contains all sections', () => {
  const result = antiDrift('full');
  assertContains(result, 'Σ_512', 'Should contain Σ_512');
  assertContains(result, 'Tiers', 'Should contain Tiers');
  assertContains(result, 'Blocks', 'Should contain Blocks');
  assertContains(result, 'Bindings', 'Should contain Bindings');
});

test('AD003: Anti-drift compact document exists', () => {
  const result = antiDrift('compact');
  assert(result.length > 0, 'Compact document should not be empty');
});

test('AD004: Anti-drift compact under 2KB', () => {
  const result = antiDrift('compact');
  assertLessThanOrEqual(result.length, 2048, 'Compact should be under 2KB');
});

// Rosetta Stone Tests
console.log('\nRosetta Stone Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('R001: Lookup "for all" returns ∀', () => {
  const result = rosettaLookup('for all');
  assert(result !== null, 'Should find result');
  assertEquals(result.symbol, '∀', 'Symbol should be ∀');
  assertEquals(result.category, 'quantifier', 'Category should be quantifier');
});

test('R002: Lookup "exists" returns ∃', () => {
  const result = rosettaLookup('exists');
  assert(result !== null, 'Should find result');
  assertEquals(result.symbol, '∃', 'Symbol should be ∃');
});

test('R003: Lookup "implies" returns ⇒', () => {
  const result = rosettaLookup('implies');
  assert(result !== null, 'Should find result');
  assertEquals(result.symbol, '⇒', 'Symbol should be ⇒');
});

test('R004: Lookup "defined as" returns ≜', () => {
  const result = rosettaLookup('defined as');
  assert(result !== null, 'Should find result');
  assertEquals(result.symbol, '≜', 'Symbol should be ≜');
});

test('R005: Lookup unknown term returns null', () => {
  const result = rosettaLookup('xyzzy_not_a_term');
  assert(result === null, 'Should return null for unknown term');
});

test('R006: Explain ∀ symbol', () => {
  const result = rosettaExplain('∀');
  assert(result !== null, 'Should find result');
  assert(result.prose.includes('for all'), 'Prose should include "for all"');
  assertEquals(result.category, 'quantifier', 'Category should be quantifier');
});

test('R007: Explain λ symbol', () => {
  const result = rosettaExplain('λ');
  assert(result !== null, 'Should find result');
  assert(result.prose.some(p => p.includes('lambda')), 'Prose should include "lambda"');
});

test('R008: Suggest symbols for "universal"', () => {
  const results = rosettaSuggest('universal');
  assert(results.length > 0, 'Should have suggestions');
  assert(results.some(r => r.symbol === '∀'), 'Should suggest ∀');
});

test('R009: Suggest symbols for "function"', () => {
  const results = rosettaSuggest('function');
  assert(results.length > 0, 'Should have suggestions');
  assert(results.some(r => r.symbol === 'λ' || r.symbol === 'Λ'), 'Should suggest λ or Λ');
});

// Template Tests
console.log('\nTemplate Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('TL001: Template list is not empty', () => {
  const list = templateList();
  assertGreaterThanOrEqual(list.length, 8, 'Should have at least 8 templates');
});

test('TL002: Template list contains required templates', () => {
  const list = templateList();
  assertContains(list, 'Ω:meta', 'Should have Ω:meta');
  assertContains(list, 'Σ:type', 'Should have Σ:type');
  assertContains(list, 'Γ:rule', 'Should have Γ:rule');
  assertContains(list, 'Λ:func', 'Should have Λ:func');
  assertContains(list, 'Ε:evidence', 'Should have Ε:evidence');
});

test('TG001: Get Ω:meta template', () => {
  const result = templateGet('Ω:meta');
  assert(result !== null, 'Should find template');
  assertContains(result, '⟦Ω:Meta⟧', 'Should contain Ω:Meta block');
});

test('TG002: Get Σ:type template', () => {
  const result = templateGet('Σ:type');
  assert(result !== null, 'Should find template');
  assertContains(result, '⟦Σ', 'Should contain Σ block');
});

test('TG003: Get minimal template', () => {
  const result = templateGet('minimal');
  assert(result !== null, 'Should find template');
  assertContains(result, '⟦Ω', 'Should contain Ω');
  assertContains(result, '⟦Σ', 'Should contain Σ');
  assertContains(result, '⟦Γ', 'Should contain Γ');
  assertContains(result, '⟦Λ', 'Should contain Λ');
  assertContains(result, '⟦Ε', 'Should contain Ε');
});

test('TG004: Get unknown template returns null', () => {
  const result = templateGet('unknown_template');
  assert(result === null, 'Should return null for unknown template');
});

// Symbol Tests
console.log('\nSymbol Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('S001: Symbols list has 64+ entries', () => {
  const list = symbolsList();
  assertGreaterThanOrEqual(list.length, 64, 'Should have at least 64 symbols');
});

test('S002: All symbols have ASCII aliases', () => {
  const list = symbolsList();
  const allHaveAscii = list.every(s => s.ascii && s.ascii.length > 0);
  assert(allHaveAscii, 'All symbols should have ASCII aliases');
});

test('S003: ASCII aliases return correct table', () => {
  const table = symbolsAscii();
  assert(Array.isArray(table), 'Should return array');
  const forall = table.find(([ascii]) => ascii === 'forall');
  assert(forall !== undefined, 'Should have forall alias');
  assertEquals(forall[1], '∀', 'forall should map to ∀');
});

test('S004: Filter symbols by category', () => {
  const quantifiers = symbolsList('quantifier');
  assert(quantifiers.every(s => s.category === 'quantifier'), 'All should be quantifiers');
  assert(quantifiers.some(s => s.symbol === '∀'), 'Should include ∀');
});

// Block Tests
console.log('\nBlock Tests:');
console.log('─────────────────────────────────────────────────────────────────');

test('B001: Blocks list returns all blocks', () => {
  const list = blocksList();
  assertGreaterThanOrEqual(list.length, 10, 'Should have at least 10 blocks');
});

test('B002: Five required blocks', () => {
  const required = blocksRequired();
  assertEquals(required.length, 5, 'Should have exactly 5 required blocks');
  const symbols = required.map(b => b.symbol);
  assertContains(symbols, 'Ω', 'Should include Ω');
  assertContains(symbols, 'Σ', 'Should include Σ');
  assertContains(symbols, 'Γ', 'Should include Γ');
  assertContains(symbols, 'Λ', 'Should include Λ');
  assertContains(symbols, 'Ε', 'Should include Ε');
});

test('B003: Optional blocks exist', () => {
  const optional = blocksOptional();
  assertGreaterThanOrEqual(optional.length, 5, 'Should have at least 5 optional blocks');
  const symbols = optional.map(b => b.symbol);
  assertContains(symbols, 'Θ', 'Should include Θ');
  assertContains(symbols, 'Χ', 'Should include Χ');
  assertContains(symbols, 'Δ', 'Should include Δ');
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
