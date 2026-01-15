#!/usr/bin/env node
/**
 * AISP Validator CLI
 *
 * Commands:
 *   validate <file|string>  - Full validation with tier
 *   parse <file|string>     - Parse only (structure check)
 *   tier <file|string>      - Get quality tier
 *   density <file|string>   - Get density score
 */

const fs = require('fs');
const path = require('path');

// Tier thresholds and symbols
const TIERS = [
  { name: 'Reject', symbol: '⊘', threshold: 0, value: 0 },
  { name: 'Bronze', symbol: '◊⁻', threshold: 0.20, value: 1 },
  { name: 'Silver', symbol: '◊', threshold: 0.40, value: 2 },
  { name: 'Gold', symbol: '◊⁺', threshold: 0.60, value: 3 },
  { name: 'Platinum', symbol: '◊⁺⁺', threshold: 0.75, value: 4 },
];

// AISP symbols for density calculation
const AISP_SYMBOLS = new Set([
  '≜', '≔', '≡', '⇒', '↔', '⊢', '⊨', '∎',
  '∀', '∃', 'λ', 'Π', 'Σ',
  '∈', '⊆', '∩', '∪', '∅',
  '⊕', '⊖', '⊗', '∘', '→', '↦',
  '⟨', '⟩', '⟦', '⟧', '◊', '𝔸',
  '⊤', '⊥', '¬', '∧', '∨',
  'ℕ', 'ℤ', 'ℝ', 'ℚ', '𝔹', '𝕊',
  '𝒫', 'ψ', 'δ', 'φ', 'τ', 'ε',
  'Ω', 'Γ', 'Λ', 'Χ', 'Ε', 'Θ', 'ℭ',
  '⇔', '∃!'
]);

// Required blocks
const REQUIRED_BLOCKS = ['⟦Ω', '⟦Σ', '⟦Γ', '⟦Λ', '⟦Ε'];

function getInput(arg) {
  if (!arg) {
    console.error('Error: No input provided');
    process.exit(1);
  }

  // Check if it's a file
  if (fs.existsSync(arg)) {
    return fs.readFileSync(arg, 'utf8');
  }

  // Otherwise treat as string
  return arg;
}

function countTokens(input) {
  let aispCount = 0;
  let totalCount = 0;
  let wsCount = 0;

  for (const char of input) {
    totalCount++;
    if (AISP_SYMBOLS.has(char)) {
      aispCount++;
    }
    if (/\s/.test(char)) {
      wsCount++;
    }
  }

  return { aispCount, totalCount, wsCount };
}

function hasRequiredBlocks(input) {
  return REQUIRED_BLOCKS.every(block => input.includes(block));
}

function getTier(delta) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (delta >= TIERS[i].threshold) {
      return TIERS[i];
    }
  }
  return TIERS[0];
}

function validate(input) {
  const result = {
    valid: false,
    tier: '⊘',
    tierName: 'Reject',
    tierValue: 0,
    delta: 0,
    ambiguity: 1.0,
    errors: [],
  };

  // Check header
  if (!input.trim().startsWith('𝔸')) {
    result.errors.push('Missing AISP header (must start with 𝔸)');
    return result;
  }

  // Check required blocks
  const missingBlocks = REQUIRED_BLOCKS.filter(b => !input.includes(b));
  if (missingBlocks.length > 0) {
    result.errors.push(`Missing required blocks: ${missingBlocks.join(', ')}`);
  }

  // Calculate density
  const { aispCount, totalCount, wsCount } = countTokens(input);
  const nonWs = totalCount - wsCount;
  result.delta = nonWs > 0 ? aispCount / nonWs : 0;

  // Calculate ambiguity (simplified)
  result.ambiguity = missingBlocks.length === 0 ? 0.01 : 0.5;

  // Get tier
  const tier = getTier(result.delta);
  result.tier = tier.symbol;
  result.tierName = tier.name;
  result.tierValue = tier.value;

  // Determine validity
  result.valid = result.errors.length === 0 && result.ambiguity < 0.02;

  return result;
}

function parse(input) {
  const result = {
    valid: false,
    hasHeader: input.trim().startsWith('𝔸'),
    blocks: [],
    errors: [],
  };

  if (!result.hasHeader) {
    result.errors.push('Missing AISP header');
  }

  // Find blocks
  const blockPattern = /⟦([ΩΣΓΛΕΘΧΔΦΠℭ]):?([^\]]*)?⟧/g;
  let match;
  while ((match = blockPattern.exec(input)) !== null) {
    result.blocks.push({
      type: match[1],
      name: match[2] || null,
      offset: match.index,
    });
  }

  // Check for required blocks
  const foundTypes = new Set(result.blocks.map(b => b.type));
  const requiredTypes = ['Ω', 'Σ', 'Γ', 'Λ', 'Ε'];
  const missing = requiredTypes.filter(t => !foundTypes.has(t));

  if (missing.length > 0) {
    result.errors.push(`Missing required blocks: ${missing.map(t => `⟦${t}⟧`).join(', ')}`);
  }

  result.valid = result.errors.length === 0;
  return result;
}

// CLI
const args = process.argv.slice(2);
const cmd = args[0];

function printHelp() {
  console.log(`
AISP Validator CLI

Usage:
  aisp-validator validate <file|string>
  aisp-validator parse <file|string>
  aisp-validator tier <file|string>
  aisp-validator density <file|string>

Options:
  --json    Output as JSON
  --help    Show this help

Examples:
  aisp-validator validate spec.aisp
  aisp-validator tier "𝔸1.0.test@ctx..."
  aisp-validator validate spec.aisp --json
`);
}

const jsonOutput = args.includes('--json');

switch (cmd) {
  case 'validate': {
    const input = getInput(args[1]);
    const result = validate(input);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result.valid) {
        console.log(`✓ Valid AISP Document`);
        console.log(`  Tier: ${result.tier} (${result.tierName})`);
        console.log(`  Density: ${result.delta.toFixed(3)}`);
        console.log(`  Ambiguity: ${result.ambiguity.toFixed(3)}`);
      } else {
        console.log(`✗ Invalid AISP Document`);
        result.errors.forEach(e => console.log(`  Error: ${e}`));
        console.log(`  Density: ${result.delta.toFixed(3)}`);
      }
    }
    process.exit(result.valid ? 0 : 1);
    break;
  }

  case 'parse': {
    const input = getInput(args[1]);
    const result = parse(input);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result.valid) {
        console.log(`✓ Valid structure`);
        console.log(`  Blocks found: ${result.blocks.map(b => `⟦${b.type}⟧`).join(' ')}`);
      } else {
        console.log(`✗ Invalid structure`);
        result.errors.forEach(e => console.log(`  Error: ${e}`));
        if (result.blocks.length > 0) {
          console.log(`  Blocks found: ${result.blocks.map(b => `⟦${b.type}⟧`).join(' ')}`);
        }
      }
    }
    process.exit(result.valid ? 0 : 1);
    break;
  }

  case 'tier': {
    const input = getInput(args[1]);
    const result = validate(input);

    if (jsonOutput) {
      console.log(JSON.stringify({ tier: result.tier, name: result.tierName, value: result.tierValue }));
    } else {
      console.log(`${result.tier} (${result.tierName})`);
    }
    break;
  }

  case 'density': {
    const input = getInput(args[1]);
    const { aispCount, totalCount, wsCount } = countTokens(input);
    const nonWs = totalCount - wsCount;
    const delta = nonWs > 0 ? aispCount / nonWs : 0;

    if (jsonOutput) {
      console.log(JSON.stringify({ delta, aispCount, totalCount, wsCount }));
    } else {
      console.log(`δ = ${delta.toFixed(4)}`);
      console.log(`  AISP symbols: ${aispCount}`);
      console.log(`  Total tokens: ${totalCount}`);
      console.log(`  Non-whitespace: ${nonWs}`);
    }
    break;
  }

  case '--help':
  case '-h':
  case 'help':
    printHelp();
    break;

  default:
    printHelp();
    process.exit(1);
}
