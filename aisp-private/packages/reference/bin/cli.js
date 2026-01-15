#!/usr/bin/env node
/**
 * AISP Reference CLI
 *
 * Commands:
 *   anti-drift [--compact|--json]
 *   rosetta lookup <query>
 *   rosetta explain <symbol>
 *   rosetta suggest <prose>
 *   template list
 *   template get <block> <name>
 *   symbols [--category <cat>]
 *   blocks
 */

const fs = require('fs');
const path = require('path');

// Anti-drift documents (embedded for zero-dependency CLI)
const ANTI_DRIFT_COMPACT = `𝔸5.1.ref@compact
;; AISP 5.1 Anti-Drift Quick Reference
;; ─────────────────────────────────────
;; SYMBOLS
;; Quantifiers: ∀(forall) ∃(exists) ∃!(unique)
;; Logic: ∧(and) ∨(or) ¬(not) ⇒(implies) ⇔(iff) ⊢(proves) ⊨(models)
;; Define: ≜(defeq) ≔(assign) ↦(mapsto) λ(lambda)
;; Sets: ∈(in) ⊂(subset) ⊆(subseteq) ∪(union) ∩(intersect) ∅(empty)
;; Types: 𝔹(Bool) ℕ(Nat) ℤ(Int) ℝ(Real) 𝕊(String)
;; ─────────────────────────────────────
;; BLOCKS
;; Ω(Meta) Σ(Types) Γ(Rules) Λ(Funcs) Ε(Evidence) - REQUIRED
;; Θ(Task) Φ(Function) Δ(Contract) Χ(Errors) ℭ(Categories) - OPTIONAL
;; ─────────────────────────────────────
;; BINDINGS: ψ(intent) ρ(resources) τ(type) φ(body) δ(density) ◊(tier)
;; TIERS: ◊⁺⁺≥0.75 ◊⁺≥0.60 ◊≥0.40 ◊⁻≥0.20 ⊘<0.20
;; ─────────────────────────────────────
;; SYNTAX
;; Header: 𝔸version.name@context
;; Block: ⟦Type:Name⟧{ bindings }
;; Tuple: ⟨a,b,c⟩ | List: [a,b,c] | Comment: ;; text
;; ─────────────────────────────────────
;; PATTERNS
;; Universal: ∀x:Type:condition
;; Implication: A⇒B
;; Definition: name≜value
;; Function: λx.body or f:A→B
;; Constraint: ∀x:T:P(x)⇒Q(x)
;; ─────────────────────────────────────
;; VALIDATION
;; Required blocks: ⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧
;; Ambiguity: Ambig(D)<0.02
;; Header must start with 𝔸`;

// Rosetta Stone mappings
const ROSETTA = [
  { symbol: '∀', prose: ['for all', 'every', 'universal'], category: 'quantifier', usage: '∀x:Type:condition' },
  { symbol: '∃', prose: ['exists', 'there exists', 'some'], category: 'quantifier', usage: '∃x:Type:condition' },
  { symbol: '∃!', prose: ['exists unique', 'exactly one'], category: 'quantifier', usage: '∃!x:Type:condition' },
  { symbol: '∧', prose: ['and', 'both', 'conjunction'], category: 'logic', usage: 'A∧B' },
  { symbol: '∨', prose: ['or', 'either', 'disjunction'], category: 'logic', usage: 'A∨B' },
  { symbol: '¬', prose: ['not', 'negation'], category: 'logic', usage: '¬A' },
  { symbol: '⇒', prose: ['implies', 'if then', 'therefore'], category: 'logic', usage: 'A⇒B' },
  { symbol: '⇔', prose: ['iff', 'if and only if'], category: 'logic', usage: 'A⇔B' },
  { symbol: '⊢', prose: ['proves', 'derives'], category: 'logic', usage: 'Γ⊢A' },
  { symbol: '⊨', prose: ['models', 'satisfies'], category: 'logic', usage: 'M⊨A' },
  { symbol: '≜', prose: ['defined as', 'equals by definition'], category: 'definition', usage: 'name≜value' },
  { symbol: '≔', prose: ['assigned', 'set to'], category: 'definition', usage: 'x≔5' },
  { symbol: '↦', prose: ['maps to', 'sends to'], category: 'definition', usage: 'x↦x+1' },
  { symbol: 'λ', prose: ['lambda', 'function'], category: 'definition', usage: 'λx.body' },
  { symbol: '→', prose: ['to', 'arrow', 'returns'], category: 'definition', usage: 'A→B' },
  { symbol: '∈', prose: ['in', 'element of', 'member of'], category: 'sets', usage: 'x∈S' },
  { symbol: '⊂', prose: ['subset', 'contained in'], category: 'sets', usage: 'A⊂B' },
  { symbol: '⊆', prose: ['subset or equal'], category: 'sets', usage: 'A⊆B' },
  { symbol: '∪', prose: ['union', 'combined'], category: 'sets', usage: 'A∪B' },
  { symbol: '∩', prose: ['intersection', 'overlap'], category: 'sets', usage: 'A∩B' },
  { symbol: '∅', prose: ['empty', 'null', 'nothing'], category: 'sets', usage: '∅' },
  { symbol: '𝔹', prose: ['boolean', 'bool'], category: 'type', usage: 'x:𝔹' },
  { symbol: 'ℕ', prose: ['natural', 'natural number'], category: 'type', usage: 'n:ℕ' },
  { symbol: 'ℤ', prose: ['integer', 'int'], category: 'type', usage: 'z:ℤ' },
  { symbol: 'ℝ', prose: ['real', 'real number', 'float'], category: 'type', usage: 'r:ℝ' },
  { symbol: '𝕊', prose: ['string', 'str', 'text'], category: 'type', usage: 's:𝕊' },
  { symbol: '⊤', prose: ['true', 'top'], category: 'logic', usage: '⊤' },
  { symbol: '⊥', prose: ['false', 'bottom'], category: 'logic', usage: '⊥' },
  { symbol: '∎', prose: ['qed', 'proven', 'end proof'], category: 'special', usage: '∎' },
  { symbol: '◊', prose: ['tier', 'quality', 'diamond'], category: 'special', usage: '◊⁺⁺' },
  { symbol: '𝔸', prose: ['aisp', 'header'], category: 'special', usage: '𝔸1.0.name@ctx' },
];

// Block definitions
const BLOCKS = [
  { symbol: 'Ω', name: 'Meta', purpose: 'Foundation, meta-logic', required: true },
  { symbol: 'Σ', name: 'Types', purpose: 'Type definitions', required: true },
  { symbol: 'Γ', name: 'Rules', purpose: 'Inference rules', required: true },
  { symbol: 'Λ', name: 'Functions', purpose: 'Function definitions', required: true },
  { symbol: 'Ε', name: 'Evidence', purpose: 'Validation metrics', required: true },
  { symbol: 'Θ', name: 'Task', purpose: 'Executable intent', required: false },
  { symbol: 'Χ', name: 'Errors', purpose: 'Error algebra', required: false },
  { symbol: 'Δ', name: 'Contract', purpose: 'Pre/Post conditions', required: false },
  { symbol: 'Φ', name: 'Function', purpose: 'Computation', required: false },
  { symbol: 'Π', name: 'Proof', purpose: 'Verification', required: false },
  { symbol: 'ℭ', name: 'Categories', purpose: 'Category theory', required: false },
];

// Templates
const TEMPLATES = {
  'Ω:meta': '⟦Ω:Meta⟧{\n  domain≜{{domain}}\n  ∀D∈AISP:Ambig(D)<0.02\n}',
  'Σ:type': '{{name}}≜{{definition}}',
  'Σ:record': '{{name}}≜⟨{{fields}}⟩',
  'Γ:rule': '∀{{var}}:{{type}}:{{condition}}',
  'Γ:implication': '∀{{var}}:{{type}}:{{ante}}⇒{{cons}}',
  'Λ:func': '{{name}}≜λ{{params}}.{{body}}',
  'Ε:evidence': '⟦Ε⟧⟨δ≜{{delta}};φ≜{{phi}};τ≜{{tier}}⟩',
  'Θ:task': '⟦Θ:{{name}}⟧{\n  ψ≔"{{intent}}"\n  ρ≔⟨{{resources}}⟩\n}',
  'Δ:contract': '⟦Δ:{{name}}⟧{\n  Pre≔{{pre}}\n  Post≔{{post}}\n}',
  'minimal': `𝔸1.0.{{name}}@{{date}}
γ≔{{context}}

⟦Ω:Meta⟧{
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
  {{types}}
}

⟦Γ:Rules⟧{
  {{rules}}
}

⟦Λ:Funcs⟧{
  {{funcs}}
}

⟦Ε⟧⟨δ≜0.60;φ≜100;τ≜◊⁺⟩`,
};

// CLI
const args = process.argv.slice(2);
const cmd = args[0];
const subcmd = args[1];

function printHelp() {
  console.log(`
AISP Reference CLI

Usage:
  aisp-reference anti-drift [--compact|--json]
  aisp-reference rosetta lookup <query>
  aisp-reference rosetta explain <symbol>
  aisp-reference rosetta suggest <prose>
  aisp-reference template list
  aisp-reference template get <block:name>
  aisp-reference symbols [--category <cat>]
  aisp-reference blocks
  aisp-reference ascii

Examples:
  aisp-reference anti-drift --compact
  aisp-reference rosetta lookup "for all"
  aisp-reference rosetta explain "∀"
  aisp-reference template get Γ:rule
`);
}

function rosettaLookup(query) {
  const q = query.toLowerCase();
  for (const entry of ROSETTA) {
    for (const prose of entry.prose) {
      if (prose.toLowerCase().includes(q) || q.includes(prose.toLowerCase())) {
        return { ...entry, confidence: prose.toLowerCase() === q ? 0.98 : 0.85 };
      }
    }
  }
  return null;
}

function rosettaExplain(symbol) {
  return ROSETTA.find(e => e.symbol === symbol);
}

function rosettaSuggest(prose) {
  const lower = prose.toLowerCase();
  const suggestions = [];

  if (lower.includes('for all') || lower.includes('every')) {
    if (lower.includes('if') || lower.includes('then')) {
      suggestions.push({ pattern: '∀x:Type:condition⇒result', confidence: 0.92 });
    } else {
      suggestions.push({ pattern: '∀x:Type:property', confidence: 0.90 });
    }
  }

  if (lower.includes('exists')) {
    if (lower.includes('unique')) {
      suggestions.push({ pattern: '∃!x:Type:condition', confidence: 0.91 });
    } else {
      suggestions.push({ pattern: '∃x:Type:condition', confidence: 0.89 });
    }
  }

  if (lower.includes('if') && lower.includes('then')) {
    suggestions.push({ pattern: 'condition⇒result', confidence: 0.88 });
  }

  if (lower.includes('defined as') || lower.includes('is a')) {
    suggestions.push({ pattern: 'name≜definition', confidence: 0.87 });
  }

  if (lower.includes('function') || lower.includes('lambda')) {
    suggestions.push({ pattern: 'f≜λx.body', confidence: 0.86 });
  }

  return suggestions.length > 0 ? suggestions : [{ pattern: '∀x:T:P(x)', confidence: 0.50 }];
}

// Main command handling
switch (cmd) {
  case 'anti-drift':
    if (subcmd === '--compact' || args.includes('--compact')) {
      console.log(ANTI_DRIFT_COMPACT);
    } else if (subcmd === '--json' || args.includes('--json')) {
      console.log(JSON.stringify({
        version: '5.1',
        symbols: ROSETTA,
        blocks: BLOCKS,
        tiers: ['⊘', '◊⁻', '◊', '◊⁺', '◊⁺⁺'],
      }, null, 2));
    } else {
      // Full version - read from data file or use compact
      console.log(ANTI_DRIFT_COMPACT);
      console.log('\n;; Use --json for structured data');
    }
    break;

  case 'rosetta':
    switch (subcmd) {
      case 'lookup':
        const query = args.slice(2).join(' ');
        const result = rosettaLookup(query);
        if (result) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(`No match for: "${query}"`);
          process.exit(1);
        }
        break;
      case 'explain':
        const symbol = args[2];
        const explanation = rosettaExplain(symbol);
        if (explanation) {
          console.log(JSON.stringify(explanation, null, 2));
        } else {
          console.log(`Unknown symbol: "${symbol}"`);
          process.exit(1);
        }
        break;
      case 'suggest':
        const prose = args.slice(2).join(' ');
        const suggestions = rosettaSuggest(prose);
        console.log(JSON.stringify(suggestions, null, 2));
        break;
      default:
        console.log('Usage: rosetta [lookup|explain|suggest] <arg>');
    }
    break;

  case 'template':
    switch (subcmd) {
      case 'list':
        console.log('Available templates:');
        Object.keys(TEMPLATES).forEach(k => console.log(`  ${k}`));
        break;
      case 'get':
        const name = args[2];
        if (TEMPLATES[name]) {
          console.log(TEMPLATES[name]);
        } else {
          console.log(`Unknown template: "${name}"`);
          console.log('Use "template list" to see available templates');
          process.exit(1);
        }
        break;
      default:
        console.log('Usage: template [list|get <name>]');
    }
    break;

  case 'symbols':
    const catFilter = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;
    const filtered = catFilter
      ? ROSETTA.filter(r => r.category === catFilter)
      : ROSETTA;
    filtered.forEach(r => {
      console.log(`${r.symbol}  ${r.prose[0].padEnd(20)} [${r.category}]  ${r.usage}`);
    });
    break;

  case 'blocks':
    console.log('AISP Block Types:\n');
    console.log('REQUIRED:');
    BLOCKS.filter(b => b.required).forEach(b => {
      console.log(`  ⟦${b.symbol}⟧ ${b.name.padEnd(12)} - ${b.purpose}`);
    });
    console.log('\nOPTIONAL:');
    BLOCKS.filter(b => !b.required).forEach(b => {
      console.log(`  ⟦${b.symbol}⟧ ${b.name.padEnd(12)} - ${b.purpose}`);
    });
    break;

  case 'ascii':
    console.log('ASCII Aliases for AISP Symbols:\n');
    const ASCII = {
      'forall': '∀', 'exists': '∃', 'exists!': '∃!',
      'and': '∧', 'or': '∨', 'not': '¬',
      '=>': '⇒', '<=>': '⇔', '|-': '⊢', '|=': '⊨',
      ':=': '≜', '=': '≔', '|->': '↦',
      'fn': 'λ', '->': '→',
      'in': '∈', 'subset': '⊂', 'union': '∪', 'inter': '∩', 'empty': '∅',
      'Bool': '𝔹', 'Nat': 'ℕ', 'Int': 'ℤ', 'Real': 'ℝ', 'Str': '𝕊',
      'top': '⊤', 'bot': '⊥', 'QED': '∎',
      '[[': '⟦', ']]': '⟧', '<': '⟨', '>': '⟩',
    };
    Object.entries(ASCII).forEach(([k, v]) => {
      console.log(`  ${k.padEnd(10)} → ${v}`);
    });
    break;

  case '--help':
  case '-h':
  case 'help':
    printHelp();
    break;

  default:
    printHelp();
    process.exit(1);
}
