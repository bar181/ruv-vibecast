# Complete Prose-to-AISP System: Architecture & Implementation Plan

**Version:** 1.0.0
**Target AISP Specification:** 5.1 Platinum
**Status:** Proposal

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Component Breakdown](#component-breakdown)
4. [Processing Pipeline](#processing-pipeline)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [LLM Integration](#llm-integration)
8. [Validation Integration](#validation-integration)
9. [Implementation Phases](#implementation-phases)
10. [Deployment Architecture](#deployment-architecture)
11. [Security Considerations](#security-considerations)
12. [Cost Optimization](#cost-optimization)

---

## Executive Summary

### Problem Statement

AISP (AI Symbolic Protocol) provides a mathematically precise language for AI-to-AI communication, but:
- Humans write in natural language (prose)
- AI agents need AISP for unambiguous coordination
- Manual translation is error-prone and time-consuming
- No automated pipeline exists to convert prose → verified AISP

### Proposed Solution

A complete system that:
1. Accepts prose/natural language requirements
2. Analyzes intent and extracts formal specifications
3. Generates AISP 5.1 compliant documents
4. Validates output using the existing WASM kernel
5. Returns verified, tier-rated AISP specifications

### Key Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| API Gateway | FastAPI/Express | Request routing, auth, rate limiting |
| Intent Analyzer | LLM (Claude/GPT-4) | Extract formal requirements from prose |
| AISP Generator | LLM + Templates | Produce AISP document structure |
| Symbol Mapper | Lookup Service | Map concepts to Σ_512 glossary |
| WASM Validator | Existing Kernel | Validate generated AISP |
| Refinement Loop | LLM + Validator | Iteratively improve until valid |

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PROSE-TO-AISP SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │  Client  │───▶│  API Gateway │───▶│  Orchestrator│───▶│ Response │  │
│  │  (Prose) │    │              │    │              │    │  (AISP)  │  │
│  └──────────┘    └──────────────┘    └──────────────┘    └──────────┘  │
│                         │                   │                           │
│                         ▼                   ▼                           │
│                  ┌──────────────┐    ┌──────────────┐                   │
│                  │   Auth/Rate  │    │   Pipeline   │                   │
│                  │   Limiting   │    │   Manager    │                   │
│                  └──────────────┘    └──────────────┘                   │
│                                            │                            │
│         ┌──────────────────────────────────┼────────────────────────┐   │
│         │                                  │                        │   │
│         ▼                                  ▼                        ▼   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │    Intent    │───▶│    AISP      │───▶│    WASM      │              │
│  │   Analyzer   │    │   Generator  │    │   Validator  │              │
│  │    (LLM)     │    │  (LLM+Tmpl)  │    │   (<8KB)     │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                   │                   │                       │
│         ▼                   ▼                   ▼                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Symbol     │    │   Template   │    │  Refinement  │              │
│  │   Mapper     │    │   Library    │    │    Loop      │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
                    ┌─────────────────────────────────────────┐
                    │           PROCESSING PIPELINE            │
                    └─────────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     │                                 │                                 │
     ▼                                 ▼                                 ▼
┌─────────┐                      ┌─────────┐                       ┌─────────┐
│ STAGE 1 │                      │ STAGE 2 │                       │ STAGE 3 │
│ ANALYZE │                      │GENERATE │                       │VALIDATE │
├─────────┤                      ├─────────┤                       ├─────────┤
│ - Parse │                      │ - Build │                       │ - Parse │
│   prose │                      │   blocks│                       │ - Check │
│ - Extract                      │ - Map   │                       │   struct│
│   intent│                      │   symbols                       │ - Compute
│ - Identify                     │ - Format│                       │   δ, τ  │
│   types │                      │   output│                       │ - Verify│
└────┬────┘                      └────┬────┘                       └────┬────┘
     │                                │                                 │
     │         ┌──────────────────────┘                                 │
     │         │                                                        │
     ▼         ▼                                                        ▼
┌─────────────────┐                                          ┌─────────────────┐
│  Intermediate   │                                          │  Final Output   │
│  Representation │                                          │  (Verified AISP)│
│  (Structured)   │                                          │                 │
└─────────────────┘                                          └─────────────────┘
                                       ▲
                                       │
                              ┌────────┴────────┐
                              │  REFINEMENT     │
                              │  LOOP (if fail) │
                              └─────────────────┘
```

---

## Component Breakdown

### 1. API Gateway

**Purpose:** Entry point for all requests, handles auth and routing.

**Technology Options:**
- FastAPI (Python) - Recommended for ML/LLM integration
- Express.js (Node) - If JavaScript ecosystem preferred
- Rust Axum - For maximum performance

**Responsibilities:**
- API key validation
- Rate limiting (per-user, per-tier)
- Request validation
- Response formatting
- Metrics collection

### 2. Intent Analyzer

**Purpose:** Extract formal specifications from natural language.

**Technology:** LLM (Claude 3.5 Sonnet or GPT-4)

**Input:** Raw prose text
**Output:** Structured intent representation

```json
{
  "domain": "authentication",
  "entities": [
    {"name": "User", "type": "record", "fields": ["id", "email", "role"]},
    {"name": "Session", "type": "record", "fields": ["token", "expiry"]}
  ],
  "invariants": [
    "All sessions must have valid user",
    "Token expiry must be future timestamp"
  ],
  "functions": [
    {"name": "login", "input": "credentials", "output": "session"},
    {"name": "validate", "input": "token", "output": "bool"}
  ],
  "constraints": [
    "Max 3 failed attempts before lockout"
  ]
}
```

### 3. Symbol Mapper

**Purpose:** Map natural language concepts to AISP Σ_512 symbols.

**Technology:** Lookup table + semantic similarity

**Mapping Examples:**

| Prose Concept | AISP Symbol | Category |
|---------------|-------------|----------|
| "for all" / "every" | ∀ | Quantifier |
| "there exists" | ∃ | Quantifier |
| "implies" / "if...then" | ⇒ | Logic |
| "and" / "both" | ∧ | Logic |
| "or" / "either" | ∨ | Logic |
| "not" / "negation" | ¬ | Logic |
| "defined as" | ≜ | Definition |
| "assigned to" | ≔ | Assignment |
| "natural number" | ℕ | Domain |
| "boolean" | 𝔹 | Domain |
| "function" / "lambda" | λ | Transmuter |
| "proves" | ⊢ | Logic |
| "models" / "satisfies" | ⊨ | Logic |

### 4. AISP Generator

**Purpose:** Produce syntactically correct AISP documents.

**Technology:** LLM + Template Engine

**Process:**
1. Receive structured intent from analyzer
2. Select appropriate templates for each block
3. Populate templates with mapped symbols
4. Assemble complete document
5. Inject evidence block with computed metrics

### 5. Template Library

**Purpose:** Provide reusable AISP block templates.

**Example Templates:**

```
# Template: Type Definition
⟦Σ:Types⟧{
  {{#each types}}
  {{name}}≜{{definition}}
  {{/each}}
}

# Template: Function Block
⟦Λ:Funcs⟧{
  {{#each functions}}
  {{name}}≜λ{{params}}.{{body}}
  {{/each}}
}

# Template: Rule Block
⟦Γ:Rules⟧{
  {{#each rules}}
  ∀{{vars}}:{{condition}}⇒{{consequent}}
  {{/each}}
}
```

### 6. WASM Validator

**Purpose:** Validate generated AISP documents.

**Technology:** Existing aisp-wasm kernel (<8KB)

**Integration:**
- Load WASM module at service startup
- Call validation for each generated document
- Return detailed validation results

### 7. Refinement Loop

**Purpose:** Iteratively improve AISP until validation passes.

**Process:**
1. If validation fails, analyze error
2. Identify problematic section
3. Re-prompt LLM with error context
4. Regenerate affected block
5. Re-validate
6. Repeat (max 3 iterations)

---

## Processing Pipeline

### Stage 1: Intent Analysis

```
INPUT: "Create a user authentication system where users can log in
        with email and password. Sessions expire after 24 hours.
        Lock account after 3 failed attempts."

PROCESS:
  1. Send to LLM with analysis prompt
  2. Extract entities, relationships, constraints
  3. Identify required AISP blocks
  4. Determine appropriate tier target

OUTPUT: Structured Intent (JSON)
```

### Stage 2: AISP Generation

```
INPUT: Structured Intent

PROCESS:
  1. Map entities to AISP types (⟦Σ⟧)
  2. Convert constraints to rules (⟦Γ⟧)
  3. Transform functions to lambdas (⟦Λ⟧)
  4. Generate meta block (⟦Ω⟧)
  5. Compute evidence metrics (⟦Ε⟧)
  6. Assemble complete document

OUTPUT: Raw AISP Document
```

### Stage 3: Validation

```
INPUT: Raw AISP Document

PROCESS:
  1. Load into WASM validator
  2. Parse and check structure
  3. Compute density (δ)
  4. Check ambiguity (<0.02)
  5. Assign tier (◊⁻ to ◊⁺⁺)

OUTPUT: Validation Result
  - valid: boolean
  - tier: string
  - delta: float
  - ambiguity: float
  - errors: array (if invalid)
```

### Stage 4: Refinement (if needed)

```
INPUT: Validation Errors + Original Intent

PROCESS:
  1. Parse error type and location
  2. Generate targeted fix prompt
  3. Regenerate specific block
  4. Re-validate
  5. Repeat until valid or max iterations

OUTPUT: Refined AISP Document
```

### Complete Pipeline Example

```
PROSE INPUT:
"Define a simple counter that starts at zero and can be incremented.
The counter value must always be non-negative."

STAGE 1 OUTPUT (Intent):
{
  "domain": "counter",
  "types": [{"name": "Counter", "base": "ℕ"}],
  "invariants": ["counter ≥ 0"],
  "functions": [
    {"name": "init", "body": "0"},
    {"name": "inc", "params": "x", "body": "x + 1"}
  ]
}

STAGE 2 OUTPUT (AISP):
𝔸1.0.counter@2026-01-14
γ≔counter.specification

⟦Ω:Meta⟧{
  ∀D∈AISP:Ambig(D)<0.02
  domain≜counter
}

⟦Σ:Types⟧{
  Counter≜ℕ
  State≜⟨val:Counter⟩
}

⟦Γ:Rules⟧{
  ∀s:State:s.val≥0
  ∀x:Counter:inc(x)≡x+1⇒inc(x)≥x
}

⟦Λ:Funcs⟧{
  init≜λ_.0
  inc≜λx.x+1
  get≜λs.s.val
}

⟦Ε⟧⟨δ≜0.72;φ≜100;τ≜◊⁺⟩

STAGE 3 OUTPUT (Validation):
{
  "valid": true,
  "tier": "◊⁺",
  "delta": 0.72,
  "ambiguity": 0.01
}

FINAL OUTPUT: Verified AISP Document (◊⁺ Gold tier)
```

---

## API Endpoints

### Base URL Structure

```
https://api.aisp.dev/v1/
```

### Authentication

All endpoints require API key in header:
```
Authorization: Bearer <api_key>
```

### Endpoint Reference

#### 1. Convert Prose to AISP

**Endpoint:** `POST /convert`

**Purpose:** Complete prose-to-AISP conversion with validation.

**Request:**
```json
{
  "prose": "string (required) - Natural language specification",
  "options": {
    "target_tier": "string (optional) - Minimum tier: bronze|silver|gold|platinum",
    "domain": "string (optional) - Domain hint for better mapping",
    "max_refinements": "integer (optional, default: 3) - Max refinement iterations",
    "include_proofs": "boolean (optional, default: false) - Include ⟦Θ⟧ block",
    "strict_mode": "boolean (optional, default: false) - Fail if target tier not met"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "aisp": "string - Complete AISP document",
  "validation": {
    "valid": true,
    "tier": "◊⁺",
    "tier_value": 3,
    "delta": 0.72,
    "ambiguity": 0.01,
    "completeness": 100
  },
  "metadata": {
    "processing_time_ms": 1250,
    "refinement_iterations": 0,
    "tokens_used": 2840,
    "model": "claude-3-5-sonnet"
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Could not achieve target tier after max refinements",
    "details": {
      "achieved_tier": "◊⁻",
      "target_tier": "◊⁺",
      "validation_errors": ["Missing required block: ⟦Γ⟧"]
    }
  },
  "partial_result": "string - Best attempt AISP (if available)"
}
```

---

#### 2. Analyze Prose

**Endpoint:** `POST /analyze`

**Purpose:** Extract structured intent without generating AISP.

**Request:**
```json
{
  "prose": "string (required) - Natural language specification",
  "options": {
    "detail_level": "string (optional) - basic|detailed|comprehensive"
  }
}
```

**Response:**
```json
{
  "success": true,
  "intent": {
    "domain": "string",
    "summary": "string - One-line summary",
    "entities": [
      {
        "name": "string",
        "type": "string - record|enum|alias|primitive",
        "fields": ["array of field definitions"],
        "constraints": ["array of constraints"]
      }
    ],
    "relationships": [
      {
        "from": "string - entity name",
        "to": "string - entity name",
        "type": "string - has|contains|references|extends",
        "cardinality": "string - 1:1|1:n|n:n"
      }
    ],
    "invariants": ["array of global invariants"],
    "functions": [
      {
        "name": "string",
        "params": ["array of param definitions"],
        "returns": "string - return type",
        "preconditions": ["array"],
        "postconditions": ["array"]
      }
    ],
    "suggested_blocks": ["Ω", "Σ", "Γ", "Λ", "Ε"]
  },
  "confidence": 0.85,
  "ambiguities": [
    {
      "text": "string - ambiguous phrase",
      "interpretations": ["possible interpretation 1", "possible interpretation 2"],
      "recommendation": "string - suggested clarification"
    }
  ]
}
```

---

#### 3. Generate AISP

**Endpoint:** `POST /generate`

**Purpose:** Generate AISP from structured intent (skip analysis).

**Request:**
```json
{
  "intent": {
    "domain": "string (required)",
    "types": [{"name": "string", "definition": "string"}],
    "rules": [{"condition": "string", "consequent": "string"}],
    "functions": [{"name": "string", "params": "string", "body": "string"}],
    "meta": {"key": "value"}
  },
  "options": {
    "template_style": "string (optional) - minimal|standard|comprehensive",
    "include_comments": "boolean (optional, default: false)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "aisp": "string - Generated AISP document",
  "blocks_generated": ["Ω", "Σ", "Γ", "Λ", "Ε"],
  "symbol_mapping": {
    "User": "User≜⟨id:ℕ,email:𝕊⟩",
    "validate": "validate≜λx...."
  }
}
```

---

#### 4. Validate AISP

**Endpoint:** `POST /validate`

**Purpose:** Validate existing AISP document (wrapper for WASM kernel).

**Request:**
```json
{
  "aisp": "string (required) - AISP document to validate",
  "options": {
    "detailed_errors": "boolean (optional, default: false)",
    "suggest_fixes": "boolean (optional, default: false)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "validation": {
    "valid": true,
    "tier": "◊⁺⁺",
    "tier_value": 4,
    "delta": 0.78,
    "ambiguity": 0.01,
    "completeness": 100,
    "blocks_found": ["Ω", "Σ", "Γ", "Λ", "Ε"],
    "blocks_missing": []
  }
}
```

**Response (Invalid):**
```json
{
  "success": true,
  "validation": {
    "valid": false,
    "tier": "⊘",
    "tier_value": 0,
    "delta": 0.15,
    "ambiguity": 0.5,
    "errors": [
      {
        "code": "MISSING_BLOCK",
        "message": "Required block ⟦Γ⟧ not found",
        "offset": null
      },
      {
        "code": "LOW_DENSITY",
        "message": "Density 0.15 below minimum 0.20",
        "suggestion": "Add more AISP symbols, reduce prose"
      }
    ],
    "suggested_fixes": [
      "Add ⟦Γ:Rules⟧ block with at least one rule",
      "Replace 'for all x' with '∀x'"
    ]
  }
}
```

---

#### 5. Refine AISP

**Endpoint:** `POST /refine`

**Purpose:** Improve existing AISP to meet target tier.

**Request:**
```json
{
  "aisp": "string (required) - Current AISP document",
  "target_tier": "string (required) - bronze|silver|gold|platinum",
  "options": {
    "max_iterations": "integer (optional, default: 3)",
    "preserve_structure": "boolean (optional, default: true)",
    "add_proofs": "boolean (optional, default: false)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "original_tier": "◊⁻",
  "final_tier": "◊⁺",
  "aisp": "string - Refined AISP document",
  "changes": [
    {
      "block": "⟦Γ⟧",
      "action": "added",
      "description": "Added inference rules for type safety"
    },
    {
      "block": "⟦Λ⟧",
      "action": "modified",
      "description": "Converted prose functions to λ notation"
    }
  ],
  "iterations": 2
}
```

---

#### 6. Symbol Lookup

**Endpoint:** `GET /symbols`

**Purpose:** Search AISP Σ_512 symbol glossary.

**Request:**
```
GET /symbols?query=implies&category=logic&limit=10
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "symbol": "⇒",
      "name": "implies",
      "category": "Ω:Transmuters",
      "id": 7,
      "aliases": ["if-then", "entails", "arrow"],
      "usage": "A⇒B (A implies B)",
      "unicode": "U+21D2"
    },
    {
      "symbol": "→",
      "name": "function arrow",
      "category": "Ω:Transmuters",
      "id": 5,
      "aliases": ["maps to", "function type"],
      "usage": "A→B (function from A to B)",
      "unicode": "U+2192"
    }
  ],
  "total": 2
}
```

---

#### 7. Batch Convert

**Endpoint:** `POST /batch/convert`

**Purpose:** Convert multiple prose specifications in one request.

**Request:**
```json
{
  "items": [
    {"id": "spec-1", "prose": "..."},
    {"id": "spec-2", "prose": "..."},
    {"id": "spec-3", "prose": "..."}
  ],
  "options": {
    "parallel": true,
    "stop_on_error": false,
    "target_tier": "silver"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {"id": "spec-1", "success": true, "aisp": "...", "tier": "◊⁺"},
    {"id": "spec-2", "success": true, "aisp": "...", "tier": "◊"},
    {"id": "spec-3", "success": false, "error": "..."}
  ],
  "summary": {
    "total": 3,
    "succeeded": 2,
    "failed": 1,
    "processing_time_ms": 3200
  }
}
```

---

#### 8. Health & Status

**Endpoint:** `GET /health`

**Purpose:** Check system health and component status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "components": {
    "api_gateway": "healthy",
    "llm_service": "healthy",
    "wasm_validator": "healthy",
    "symbol_mapper": "healthy"
  },
  "wasm_kernel": {
    "version": "0.1.0",
    "size_bytes": 6892,
    "loaded": true
  },
  "rate_limits": {
    "requests_remaining": 95,
    "reset_at": "2026-01-14T12:00:00Z"
  }
}
```

---

## Data Models

### Core Types

```typescript
// Prose Input
interface ProseInput {
  text: string;
  domain?: string;
  context?: string;
  examples?: string[];
}

// Structured Intent
interface Intent {
  domain: string;
  entities: Entity[];
  relationships: Relationship[];
  invariants: string[];
  functions: FunctionDef[];
  constraints: Constraint[];
}

interface Entity {
  name: string;
  type: 'record' | 'enum' | 'alias' | 'primitive';
  fields?: Field[];
  variants?: string[];
  base?: string;
}

interface FunctionDef {
  name: string;
  params: Param[];
  returns: string;
  body?: string;
  preconditions?: string[];
  postconditions?: string[];
}

// AISP Document
interface AISPDocument {
  header: AISPHeader;
  context: string;
  blocks: AISPBlock[];
  evidence: Evidence;
}

interface AISPHeader {
  version: string;
  name: string;
  date: string;
}

interface AISPBlock {
  type: 'Ω' | 'Σ' | 'Γ' | 'Λ' | 'Χ' | 'Ε' | 'ℭ' | 'Θ';
  name: string;
  content: string;
}

interface Evidence {
  delta: number;      // Density score
  phi: number;        // Completeness (0-100)
  tau: Tier;          // Quality tier
  proofs?: string[];  // Optional proof references
}

// Validation Result
interface ValidationResult {
  valid: boolean;
  tier: Tier;
  tierValue: number;
  delta: number;
  ambiguity: number;
  completeness: number;
  errors?: ValidationError[];
}

type Tier = '⊘' | '◊⁻' | '◊' | '◊⁺' | '◊⁺⁺';
```

---

## LLM Integration

### Recommended Models

| Use Case | Model | Rationale |
|----------|-------|-----------|
| Intent Analysis | Claude 3.5 Sonnet | Best reasoning for extraction |
| AISP Generation | Claude 3.5 Sonnet | Handles symbols well |
| Refinement | Claude 3.5 Haiku | Fast, cost-effective |
| Fallback | GPT-4 Turbo | Alternative provider |

### Prompt Templates

#### Intent Analysis Prompt

```
You are an expert at extracting formal specifications from natural language.

Given the following prose description, extract:
1. Domain/context
2. Entities (types, records, enums)
3. Relationships between entities
4. Invariants (things that must always be true)
5. Functions/operations
6. Constraints

Prose:
"""
{prose_input}
"""

Return a JSON object with the extracted information.
Be precise and formal. Identify ambiguities.
```

#### AISP Generation Prompt

```
You are an AISP (AI Symbolic Protocol) expert. Generate a valid AISP 5.1
document from the following structured intent.

Use these symbol mappings:
- Universal quantifier: ∀
- Existential quantifier: ∃
- Lambda: λ
- Definition: ≜
- Assignment: ≔
- Implies: ⇒
- And: ∧
- Or: ∨
- Not: ¬
- Element of: ∈
- Subset: ⊆
- Natural numbers: ℕ
- Integers: ℤ
- Booleans: 𝔹
- Strings: 𝕊

Intent:
{intent_json}

Generate a complete AISP document with:
- Header: 𝔸1.0.{domain}@{date}
- Context: γ≔{domain}
- Required blocks: ⟦Ω⟧, ⟦Σ⟧, ⟦Γ⟧, ⟦Λ⟧, ⟦Ε⟧

Maximize AISP symbol density (target δ ≥ 0.60).
Minimize prose/comments.
```

#### Refinement Prompt

```
The following AISP document failed validation:

Document:
"""
{aisp_document}
"""

Validation errors:
{errors}

Current metrics:
- Tier: {current_tier}
- Density: {delta}
- Target tier: {target_tier}

Improve the document to fix errors and increase density.
Preserve the semantic meaning while using more AISP symbols.
Return only the improved AISP document.
```

### API Key Configuration

```yaml
# config/llm.yaml
providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    default_model: claude-3-5-sonnet-20241022
    fallback_model: claude-3-5-haiku-20241022
    max_tokens: 4096
    temperature: 0.3

  openai:
    api_key: ${OPENAI_API_KEY}
    default_model: gpt-4-turbo
    fallback_model: gpt-4o-mini
    max_tokens: 4096
    temperature: 0.3

routing:
  intent_analysis: anthropic
  generation: anthropic
  refinement: anthropic
  fallback_provider: openai
```

---

## Validation Integration

### WASM Kernel Loading

```javascript
// Server-side WASM loading (Node.js)
const fs = require('fs');
const path = require('path');

class AISPValidator {
  constructor() {
    this.instance = null;
    this.memory = null;
  }

  async init() {
    const wasmPath = path.join(__dirname, 'aisp.wasm');
    const wasmBytes = fs.readFileSync(wasmPath);

    const { instance } = await WebAssembly.instantiate(wasmBytes, {
      env: {
        host_alloc: (size, align) => {
          // Simple bump allocator
          const aligned = (this.allocPtr + align - 1) & ~(align - 1);
          this.allocPtr = aligned + size;
          return aligned;
        }
      }
    });

    this.instance = instance.exports;
    this.memory = new Uint8Array(instance.exports.memory.buffer);
    this.allocPtr = 0x1000;

    return this.instance.aisp_init();
  }

  validate(aisp) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(aisp);

    if (bytes.length > 1024) {
      return { valid: false, error: 'Document exceeds 1KB limit' };
    }

    // Refresh memory view
    this.memory = new Uint8Array(this.instance.memory.buffer);

    const ptr = 0x1000;
    this.memory.set(bytes, ptr);

    const docId = this.instance.aisp_parse(ptr, bytes.length);
    if (docId < 0) {
      return {
        valid: false,
        error: `Parse error at offset ${this.instance.aisp_error_offset()}`,
        errorCode: this.instance.aisp_error_code()
      };
    }

    const result = this.instance.aisp_validate(docId);

    return {
      valid: result === 0,
      tier: this.getTierSymbol(this.instance.aisp_tier(docId)),
      tierValue: this.instance.aisp_tier(docId),
      delta: this.instance.aisp_density(docId),
      ambiguity: this.instance.aisp_ambig(docId)
    };
  }

  getTierSymbol(value) {
    return ['⊘', '◊⁻', '◊', '◊⁺', '◊⁺⁺'][value] || '⊘';
  }
}

module.exports = AISPValidator;
```

### Validation Service

```python
# Python wrapper using wasmer
from wasmer import engine, Store, Module, Instance, Memory
from wasmer_compiler_cranelift import Compiler

class AISPValidator:
    def __init__(self, wasm_path: str):
        self.store = Store(engine.Universal(Compiler))

        with open(wasm_path, 'rb') as f:
            wasm_bytes = f.read()

        self.module = Module(self.store, wasm_bytes)
        self.instance = Instance(self.module)

        # Initialize kernel
        self.instance.exports.aisp_init()

    def validate(self, aisp: str) -> dict:
        # Encode to UTF-8
        data = aisp.encode('utf-8')

        if len(data) > 1024:
            return {'valid': False, 'error': 'Document exceeds 1KB limit'}

        # Write to WASM memory
        memory = self.instance.exports.memory
        ptr = 0x1000
        memory_view = memory.uint8_view(ptr)

        for i, byte in enumerate(data):
            memory_view[i] = byte

        # Parse
        doc_id = self.instance.exports.aisp_parse(ptr, len(data))
        if doc_id < 0:
            return {
                'valid': False,
                'error': f'Parse error at offset {self.instance.exports.aisp_error_offset()}',
                'errorCode': self.instance.exports.aisp_error_code()
            }

        # Validate
        result = self.instance.exports.aisp_validate(doc_id)

        tier_symbols = ['⊘', '◊⁻', '◊', '◊⁺', '◊⁺⁺']
        tier_value = self.instance.exports.aisp_tier(doc_id)

        return {
            'valid': result == 0,
            'tier': tier_symbols[tier_value],
            'tierValue': tier_value,
            'delta': self.instance.exports.aisp_density(doc_id),
            'ambiguity': self.instance.exports.aisp_ambig(doc_id)
        }
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Deliverables:**
- [ ] API Gateway setup with FastAPI
- [ ] Authentication & rate limiting
- [ ] WASM validator integration
- [ ] `/validate` endpoint
- [ ] `/symbols` endpoint
- [ ] Basic health checks

**Dependencies:**
- Existing WASM kernel
- API infrastructure

### Phase 2: Analysis Engine (Weeks 3-4)

**Deliverables:**
- [ ] LLM integration (Claude API)
- [ ] Intent analysis prompts
- [ ] `/analyze` endpoint
- [ ] Ambiguity detection
- [ ] Confidence scoring

**Dependencies:**
- Anthropic API key
- Prompt engineering

### Phase 3: Generation Pipeline (Weeks 5-6)

**Deliverables:**
- [ ] Template library (10+ templates)
- [ ] Symbol mapper service
- [ ] AISP generator
- [ ] `/generate` endpoint
- [ ] `/convert` endpoint (full pipeline)

**Dependencies:**
- Phase 2 complete
- Template designs

### Phase 4: Refinement Loop (Weeks 7-8)

**Deliverables:**
- [ ] Error analysis logic
- [ ] Targeted regeneration
- [ ] `/refine` endpoint
- [ ] Iteration limits & safeguards
- [ ] Quality metrics tracking

**Dependencies:**
- Phase 3 complete
- Error taxonomy

### Phase 5: Production Hardening (Weeks 9-10)

**Deliverables:**
- [ ] Batch processing (`/batch/convert`)
- [ ] Caching layer
- [ ] Comprehensive error handling
- [ ] Usage analytics
- [ ] Documentation & SDK

**Dependencies:**
- All phases complete
- Load testing results

---

## Deployment Architecture

### Recommended Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUD PROVIDER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   CloudFlare │     │   AWS ALB    │     │   GCP LB     │    │
│  │   (CDN/WAF)  │     │  (optional)  │     │  (optional)  │    │
│  └──────┬───────┘     └──────────────┘     └──────────────┘    │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API GATEWAY CLUSTER                    │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │   │
│  │  │ API-1   │  │ API-2   │  │ API-3   │  │ API-N   │     │   │
│  │  │ (FastAPI)│ │(FastAPI)│  │(FastAPI)│  │(FastAPI)│     │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   SERVICE MESH                            │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐            │   │
│  │  │  Intent   │  │   AISP    │  │  Symbol   │            │   │
│  │  │ Analyzer  │  │ Generator │  │  Mapper   │            │   │
│  │  └───────────┘  └───────────┘  └───────────┘            │   │
│  │                                                          │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐            │   │
│  │  │   WASM    │  │ Refinement│  │   Cache   │            │   │
│  │  │ Validator │  │   Loop    │  │  (Redis)  │            │   │
│  │  └───────────┘  └───────────┘  └───────────┘            │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   EXTERNAL SERVICES                       │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐            │   │
│  │  │ Anthropic │  │  OpenAI   │  │ PostgreSQL│            │   │
│  │  │  (Claude) │  │ (Fallback)│  │  (Logs)   │            │   │
│  │  └───────────┘  └───────────┘  └───────────┘            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Container Configuration

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy WASM kernel
COPY aisp.wasm /app/

# Copy application
COPY src/ /app/src/

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    deploy:
      replicas: 3

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

---

## Security Considerations

### Input Validation

```python
from pydantic import BaseModel, Field, validator
import re

class ProseInput(BaseModel):
    prose: str = Field(..., min_length=10, max_length=10000)
    domain: str | None = Field(None, max_length=100)

    @validator('prose')
    def sanitize_prose(cls, v):
        # Remove potential injection patterns
        v = re.sub(r'<script[^>]*>.*?</script>', '', v, flags=re.IGNORECASE)
        v = re.sub(r'javascript:', '', v, flags=re.IGNORECASE)
        return v.strip()

class AISPInput(BaseModel):
    aisp: str = Field(..., min_length=50, max_length=1024)

    @validator('aisp')
    def validate_header(cls, v):
        if not v.strip().startswith('𝔸'):
            raise ValueError('AISP document must start with 𝔸 header')
        return v
```

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Tier-based limits
RATE_LIMITS = {
    'free': '10/hour',
    'basic': '100/hour',
    'pro': '1000/hour',
    'enterprise': '10000/hour'
}
```

### API Key Management

```python
import secrets
from datetime import datetime, timedelta

def generate_api_key():
    return f"aisp_{secrets.token_urlsafe(32)}"

def validate_api_key(key: str) -> dict:
    # Lookup in database
    # Check expiration
    # Return permissions
    pass
```

---

## Cost Optimization

### LLM Cost Estimates

| Operation | Tokens (avg) | Cost per 1K ops |
|-----------|--------------|-----------------|
| Intent Analysis | 2,000 | $6.00 |
| AISP Generation | 1,500 | $4.50 |
| Refinement (per iter) | 1,000 | $3.00 |
| **Full Pipeline** | 4,500 | $13.50 |

*Based on Claude 3.5 Sonnet pricing ($3/1M input, $15/1M output)*

### Optimization Strategies

1. **Caching**
   - Cache intent analysis for similar inputs
   - Cache symbol mappings
   - Cache successful AISP templates

2. **Model Selection**
   - Use Haiku for refinement (5x cheaper)
   - Use Sonnet only for complex analysis

3. **Batch Processing**
   - Group similar requests
   - Parallelize validation

4. **Early Termination**
   - Skip refinement if first attempt passes
   - Validate structure before full analysis

### Estimated Pricing Tiers

| Tier | Price/month | Conversions | Cost/conversion |
|------|-------------|-------------|-----------------|
| Free | $0 | 50 | - |
| Basic | $29 | 500 | $0.058 |
| Pro | $99 | 2,500 | $0.040 |
| Enterprise | Custom | Unlimited | Negotiated |

---

## Summary

### System Capabilities

| Feature | Description |
|---------|-------------|
| Prose → AISP | Full conversion pipeline |
| Validation | WASM-based (<8KB) verification |
| Refinement | Iterative improvement to target tier |
| Batch Processing | Multiple documents in one request |
| Symbol Lookup | Search Σ_512 glossary |

### Key Metrics

| Metric | Target |
|--------|--------|
| Conversion Success Rate | >90% |
| Average Tier Achieved | ◊⁺ (Gold) |
| Processing Time | <3 seconds |
| Validation Time | <10ms |
| API Availability | 99.9% |

### Next Steps

1. **Review this proposal** with stakeholders
2. **Finalize technology choices** (FastAPI vs Express, etc.)
3. **Set up development environment**
4. **Begin Phase 1 implementation**
5. **Iterate based on early testing**

---

*This document outlines the complete prose-to-AISP system architecture. For implementation details, refer to the phase-specific documentation as development progresses.*
