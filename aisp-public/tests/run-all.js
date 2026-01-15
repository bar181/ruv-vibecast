#!/usr/bin/env node
/**
 * AISP SDK Test Runner
 *
 * Runs all test suites and generates a combined report.
 * Run: node tests/run-all.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║             AISP SDK - Complete Test Suite                    ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const testsDir = __dirname;
const suites = [
  { name: 'Validator Tests', path: 'validator/validator.test.js' },
  { name: 'Reference Tests', path: 'reference/reference.test.js' },
];

let totalPassed = 0;
let totalFailed = 0;
const suiteResults = [];

for (const suite of suites) {
  console.log(`\n┌─────────────────────────────────────────────────────────────────┐`);
  console.log(`│ Running: ${suite.name.padEnd(54)}│`);
  console.log(`└─────────────────────────────────────────────────────────────────┘\n`);

  const testPath = path.join(testsDir, suite.path);

  try {
    const output = execSync(`node "${testPath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(output);

    // Parse results from output
    const passMatch = output.match(/Passed:\s*(\d+)/);
    const failMatch = output.match(/Failed:\s*(\d+)/);

    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;

    totalPassed += passed;
    totalFailed += failed;

    suiteResults.push({ name: suite.name, passed, failed, status: 'completed' });
  } catch (err) {
    console.log(err.stdout || '');
    console.log(err.stderr || '');

    // Parse results even from failed execution
    const output = err.stdout || '';
    const passMatch = output.match(/Passed:\s*(\d+)/);
    const failMatch = output.match(/Failed:\s*(\d+)/);

    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;

    totalPassed += passed;
    totalFailed += failed;

    suiteResults.push({ name: suite.name, passed, failed, status: 'failed' });
  }
}

// Final Summary
console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                    COMPLETE TEST SUMMARY                      ║');
console.log('╠═══════════════════════════════════════════════════════════════╣');

for (const result of suiteResults) {
  const status = result.failed > 0 ? '✗' : '✓';
  const line = `  ${status} ${result.name}: ${result.passed} passed, ${result.failed} failed`;
  console.log(`║${line.padEnd(63)}║`);
}

console.log('╠═══════════════════════════════════════════════════════════════╣');
const totalLine = `  Total: ${totalPassed + totalFailed} tests, ${totalPassed} passed, ${totalFailed} failed`;
const coverageLine = `  Coverage: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`;
console.log(`║${totalLine.padEnd(63)}║`);
console.log(`║${coverageLine.padEnd(63)}║`);
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Exit with appropriate code
process.exit(totalFailed > 0 ? 1 : 0);
