#!/usr/bin/env node
/**
 * @aisp/convert CLI
 *
 * Tiered prose-to-AISP conversion
 *
 * Commands:
 *   minimal <prose>   - Direct Rosetta mapping (0.5-1x tokens)
 *   standard <prose>  - + Header + evidence block (1.5-2x tokens)
 *   full <prose>      - + All blocks + proofs (4-8x tokens)
 *   auto <prose>      - Auto-detect appropriate tier
 *
 * License: Fair Use (see LICENSE)
 */

// ═══════════════════════════════════════════════════════════════════
// ROSETTA MAPPINGS (Embedded)
// ═══════════════════════════════════════════════════════════════════

const ROSETTA = [
  { symbol: '∀', patterns: ['for all', 'for every', 'every', 'all'] },
  { symbol: '∃', patterns: ['exists', 'there exists', 'some'] },
  { symbol: '∃!', patterns: ['exists unique', 'exactly one', 'unique'] },
  { symbol: '∧', patterns: ['and', 'both'] },
  { symbol: '∨', patterns: ['or', 'either'] },
  { symbol: '¬', patterns: ['not', 'negation'] },
  { symbol: '⇒', patterns: ['implies', 'if then', 'therefore', 'then'] },
  { symbol: '⇔', patterns: ['iff', 'if and only if'] },
  { symbol: '≜', patterns: ['defined as', 'is defined as', 'equals by definition', 'is a'] },
  { symbol: '≔', patterns: ['assigned', 'set to', 'becomes'] },
  { symbol: 'λ', patterns: ['lambda', 'function', 'anonymous function'] },
  { symbol: '→', patterns: ['to', 'returns', 'maps to'] },
  { symbol: '∈', patterns: ['in', 'element of', 'member of'] },
  { symbol: '⊆', patterns: ['subset', 'subset of'] },
  { symbol: '∪', patterns: ['union'] },
  { symbol: '∩', patterns: ['intersection'] },
  { symbol: '∅', patterns: ['empty', 'null'] },
  { symbol: 'ℕ', patterns: ['natural', 'natural number'] },
  { symbol: 'ℤ', patterns: ['integer', 'int'] },
  { symbol: 'ℝ', patterns: ['real', 'real number', 'float'] },
  { symbol: '𝔹', patterns: ['boolean', 'bool'] },
  { symbol: '𝕊', patterns: ['string', 'str', 'text'] },
  { symbol: '⊤', patterns: ['true', 'top'] },
  { symbol: '⊥', patterns: ['false', 'bottom'] },
];

// ═══════════════════════════════════════════════════════════════════
// CONVERTER IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════

function proseToMinimal(prose) {
  let result = prose;

  // Apply Rosetta mappings (longest patterns first)
  const sortedRosetta = [...ROSETTA].sort((a, b) =>
    Math.max(...b.patterns.map(p => p.length)) - Math.max(...a.patterns.map(p => p.length))
  );

  for (const entry of sortedRosetta) {
    for (const pattern of entry.patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      result = result.replace(regex, entry.symbol);
    }
  }

  // Clean up: "x ≜ 5" -> "x≜5"
  result = result.replace(/\s*(≜|≔|⇒|∈|→)\s*/g, '$1');

  // Convert "const x = 5" to "x≜5"
  result = result.replace(/const\s+(\w+)\s*=\s*(\w+)/gi, '$1≜$2');

  // Convert function definitions
  result = result.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{?\s*return\s+([^}]+)}?/gi,
    (_, name, params, body) => `${name}≜λ${params.replace(/,\s*/g, '.λ')}.${body.trim()}`
  );

  return result.trim();
}

function proseToStandard(prose) {
  const minimal = proseToMinimal(prose);
  const date = new Date().toISOString().split('T')[0];
  const domain = extractDomain(prose);

  return `𝔸5.1.${domain}@${date}
γ≔${domain}

⟦Λ:Funcs⟧{
  ${minimal}
}

⟦Ε⟧⟨δ≜0.70;τ≜◊⁺⟩`;
}

function proseToFull(prose) {
  const minimal = proseToMinimal(prose);
  const date = new Date().toISOString().split('T')[0];
  const domain = extractDomain(prose);
  const types = inferTypes(prose);
  const rules = inferRules(prose);

  return `𝔸5.1.${domain}@${date}
γ≔${domain}.definitions
ρ≔⟨${domain},types,rules⟩

⟦Ω:Meta⟧{
  domain≜${domain}
  version≜1.0.0
  ∀D∈AISP:Ambig(D)<0.02
}

⟦Σ:Types⟧{
${types}
}

⟦Γ:Rules⟧{
${rules}
}

⟦Λ:Funcs⟧{
  ${minimal}
}

⟦Ε⟧⟨δ≜0.82;φ≜100;τ≜◊⁺⁺;⊢valid;∎⟩`;
}

function extractDomain(prose) {
  const lower = prose.toLowerCase();
  if (lower.includes('user') || lower.includes('auth')) return 'auth';
  if (lower.includes('math') || lower.includes('number') || lower.includes('sum')) return 'math';
  if (lower.includes('api') || lower.includes('endpoint')) return 'api';
  if (lower.includes('data') || lower.includes('store')) return 'data';
  return 'domain';
}

function inferTypes(prose) {
  const types = [];
  const lower = prose.toLowerCase();

  if (lower.includes('number') || lower.includes('integer') || lower.includes('count')) {
    types.push('  ℕ≜natural_numbers');
  }
  if (lower.includes('string') || lower.includes('text') || lower.includes('name')) {
    types.push('  𝕊≜strings');
  }
  if (lower.includes('bool') || lower.includes('flag') || lower.includes('true') || lower.includes('false')) {
    types.push('  𝔹≜booleans');
  }
  if (lower.includes('function') || lower.includes('lambda')) {
    types.push('  Fn⟨A,B⟩≜A→B');
  }

  return types.length > 0 ? types.join('\n') : '  T≜⟨value:Any⟩';
}

function inferRules(prose) {
  const rules = [];
  const lower = prose.toLowerCase();

  if (lower.includes('constant') || lower.includes('immutable')) {
    rules.push('  ∀c∈Const:c.immutable≡⊤');
  }
  if (lower.includes('valid') || lower.includes('check')) {
    rules.push('  ∀x:T:valid(x)⇒accept(x)');
  }
  if (lower.includes('all') || lower.includes('every')) {
    rules.push('  ∀x∈S:P(x)');
  }

  return rules.length > 0 ? rules.join('\n') : '  ∀x:T:⊤';
}

function autoDetectTier(prose) {
  const words = prose.split(/\s+/).length;
  const hasTypes = /type|class|struct|interface/i.test(prose);
  const hasRules = /must|should|always|never|require/i.test(prose);
  const hasProof = /prove|verify|ensure|guarantee/i.test(prose);

  if (hasProof || (hasTypes && hasRules)) return 'full';
  if (words > 20 || hasTypes || hasRules) return 'standard';
  return 'minimal';
}

// ═══════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const cmd = args[0];
const prose = args.slice(1).join(' ');

function printHelp() {
  console.log(`
@aisp/convert - Prose to AISP Converter

Usage:
  aisp-convert minimal <prose>   Direct Rosetta mapping (0.5-1x tokens)
  aisp-convert standard <prose>  + Header + evidence (1.5-2x tokens)
  aisp-convert full <prose>      + All blocks + proofs (4-8x tokens)
  aisp-convert auto <prose>      Auto-detect tier

Options:
  --json    Output as JSON
  --help    Show this help

Examples:
  aisp-convert minimal "Define x as 5"
  aisp-convert standard "Define a sum function that adds two numbers"
  aisp-convert auto "For all users, if admin then allow access"

License: Fair Use (see LICENSE)
  Free for: individuals, academics, non-profits, orgs <$1B
  Commercial: $1B+ revenue AND 100+ conversions/month
`);
}

const jsonOutput = args.includes('--json');

if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
  printHelp();
  process.exit(0);
}

if (!prose) {
  console.error('Error: No prose input provided');
  printHelp();
  process.exit(1);
}

let result;
let tier;

switch (cmd) {
  case 'minimal':
    result = proseToMinimal(prose);
    tier = 'minimal';
    break;

  case 'standard':
    result = proseToStandard(prose);
    tier = 'standard';
    break;

  case 'full':
    result = proseToFull(prose);
    tier = 'full';
    break;

  case 'auto':
    tier = autoDetectTier(prose);
    switch (tier) {
      case 'minimal': result = proseToMinimal(prose); break;
      case 'standard': result = proseToStandard(prose); break;
      case 'full': result = proseToFull(prose); break;
    }
    break;

  default:
    console.error(`Unknown command: ${cmd}`);
    printHelp();
    process.exit(1);
}

if (jsonOutput) {
  console.log(JSON.stringify({
    tier,
    input: prose,
    output: result,
    tokens: {
      input: prose.length,
      output: result.length,
      ratio: (result.length / prose.length).toFixed(2)
    }
  }, null, 2));
} else {
  console.log(`# Tier: ${tier}\n`);
  console.log(result);
}
