//! AISP Block Templates
//!
//! Reusable templates for common AISP patterns.

/// Template entry
#[derive(Clone, Copy)]
pub struct Template {
    pub id: u8,
    pub block_type: u8,
    pub name: &'static str,
    pub template: &'static str,
    pub description: &'static str,
}

/// Block type constants
pub mod block_types {
    pub const OMEGA: u8 = 0;    // Ω - Meta
    pub const SIGMA: u8 = 1;    // Σ - Types
    pub const GAMMA: u8 = 2;    // Γ - Rules
    pub const LAMBDA: u8 = 3;   // Λ - Functions
    pub const EVIDENCE: u8 = 4; // Ε - Evidence
    pub const THETA: u8 = 5;    // Θ - Task
    pub const CHI: u8 = 6;      // Χ - Errors
    pub const DELTA: u8 = 7;    // Δ - Contract
    pub const PHI: u8 = 8;      // Φ - Function
    pub const CATEGORY: u8 = 9; // ℭ - Category
}

/// Template library
pub static TEMPLATES: &[Template] = &[
    // ═══════════════════════════════════════════════════════════════
    // DOCUMENT TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 0,
        block_type: 255, // Special: full document
        name: "minimal",
        template: r#"𝔸1.0.{{name}}@{{date}}
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
  {{functions}}
}

⟦Ε⟧⟨δ≜{{delta}};φ≜{{phi}};τ≜{{tier}}⟩"#,
        description: "Minimal valid AISP document with required blocks",
    },

    // ═══════════════════════════════════════════════════════════════
    // Ω META TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 10,
        block_type: block_types::OMEGA,
        name: "meta_basic",
        template: r#"⟦Ω:Meta⟧{
  domain≜{{domain}}
  ∀D∈AISP:Ambig(D)<0.02
}"#,
        description: "Basic meta block with domain",
    },

    // ═══════════════════════════════════════════════════════════════
    // Σ TYPE TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 20,
        block_type: block_types::SIGMA,
        name: "type_alias",
        template: "{{name}}≜{{base_type}}",
        description: "Simple type alias",
    },
    Template {
        id: 21,
        block_type: block_types::SIGMA,
        name: "type_record",
        template: "{{name}}≜⟨{{fields}}⟩",
        description: "Record type with fields",
    },
    Template {
        id: 22,
        block_type: block_types::SIGMA,
        name: "type_function",
        template: "{{name}}:{{input}}→{{output}}",
        description: "Function type signature",
    },
    Template {
        id: 23,
        block_type: block_types::SIGMA,
        name: "types_block",
        template: r#"⟦Σ:Types⟧{
  {{#each types}}
  {{name}}≜{{definition}}
  {{/each}}
}"#,
        description: "Complete types block",
    },

    // ═══════════════════════════════════════════════════════════════
    // Γ RULE TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 30,
        block_type: block_types::GAMMA,
        name: "rule_universal",
        template: "∀{{var}}:{{type}}:{{condition}}",
        description: "Universal quantification rule",
    },
    Template {
        id: 31,
        block_type: block_types::GAMMA,
        name: "rule_implication",
        template: "∀{{var}}:{{type}}:{{antecedent}}⇒{{consequent}}",
        description: "Implication rule with quantifier",
    },
    Template {
        id: 32,
        block_type: block_types::GAMMA,
        name: "rule_constraint",
        template: "{{name}}:{{constraint}}",
        description: "Named constraint",
    },
    Template {
        id: 33,
        block_type: block_types::GAMMA,
        name: "rules_block",
        template: r#"⟦Γ:Rules⟧{
  {{#each rules}}
  ∀{{var}}:{{type}}:{{condition}}
  {{/each}}
}"#,
        description: "Complete rules block",
    },

    // ═══════════════════════════════════════════════════════════════
    // Λ FUNCTION TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 40,
        block_type: block_types::LAMBDA,
        name: "func_lambda",
        template: "{{name}}≜λ{{params}}.{{body}}",
        description: "Lambda function definition",
    },
    Template {
        id: 41,
        block_type: block_types::LAMBDA,
        name: "func_typed",
        template: "{{name}}:{{input}}→{{output}}≜λ{{param}}.{{body}}",
        description: "Typed function definition",
    },
    Template {
        id: 42,
        block_type: block_types::LAMBDA,
        name: "funcs_block",
        template: r#"⟦Λ:Funcs⟧{
  {{#each functions}}
  {{name}}≜λ{{params}}.{{body}}
  {{/each}}
}"#,
        description: "Complete functions block",
    },

    // ═══════════════════════════════════════════════════════════════
    // Ε EVIDENCE TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 50,
        block_type: block_types::EVIDENCE,
        name: "evidence_basic",
        template: "⟦Ε⟧⟨δ≜{{delta}};φ≜{{phi}};τ≜{{tier}}⟩",
        description: "Basic evidence block",
    },
    Template {
        id: 51,
        block_type: block_types::EVIDENCE,
        name: "evidence_full",
        template: "⟦Ε⟧⟨δ≜{{delta}};φ≜{{phi}};τ≜{{tier}};⊢{{proofs}}⟩",
        description: "Evidence block with proof references",
    },

    // ═══════════════════════════════════════════════════════════════
    // Θ TASK TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 60,
        block_type: block_types::THETA,
        name: "task_basic",
        template: r#"⟦Θ:{{name}}⟧{
  ψ≔"{{intent}}"
  ρ≔⟨{{resources}}⟩
  τ≔{{type}}
}"#,
        description: "Basic task block with intent",
    },

    // ═══════════════════════════════════════════════════════════════
    // Δ CONTRACT TEMPLATES
    // ═══════════════════════════════════════════════════════════════
    Template {
        id: 70,
        block_type: block_types::DELTA,
        name: "contract_basic",
        template: r#"⟦Δ:{{name}}⟧{
  Pre≔{{preconditions}}
  Post≔{{postconditions}}
}"#,
        description: "Basic contract with pre/post conditions",
    },
];

/// Get template by block type and ID
pub fn get_template_by_id(block_type: u8, template_id: u8) -> Option<&'static str> {
    TEMPLATES.iter()
        .find(|t| t.block_type == block_type && t.id == template_id)
        .map(|t| t.template)
}

/// Get template by name
pub fn get_template(name: &str) -> Option<&'static Template> {
    TEMPLATES.iter().find(|t| t.name == name)
}

/// List all templates
pub fn list_templates() -> &'static [Template] {
    TEMPLATES
}

/// List templates for a block type
pub fn list_templates_for_block(block_type: u8) -> impl Iterator<Item = &'static Template> {
    TEMPLATES.iter().filter(move |t| t.block_type == block_type)
}
