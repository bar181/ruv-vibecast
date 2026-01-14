//! Anti-drift reference documents
//!
//! Canonical quick reference to prevent agent drift from AISP 5.1 specification.

/// Full anti-drift reference in AISP format
pub static ANTI_DRIFT_FULL: &str = r#"𝔸5.1.reference@anti-drift
γ≔aisp.agent.reference
ρ≔⟨symbols,blocks,tiers,patterns⟩
⊢compact∧canonical

⟦Ω:Purpose⟧{
  ψ≔"Prevent agent drift from AISP 5.1 specification"
  τ≔Reference
  usage≔"Include in system prompt OR call npx @aisp/reference anti-drift"
}

⟦Σ:CoreSymbols⟧{
  ;; ─── Quantifiers ───
  ∀≜"for all, every, universal"
  ∃≜"exists, some, there is"
  ∃!≜"exists unique, exactly one"

  ;; ─── Logic ───
  ∧≜"and, conjunction"
  ∨≜"or, disjunction"
  ¬≜"not, negation"
  ⇒≜"implies, if-then"
  ⇔≜"iff, if and only if"
  ⊢≜"proves, derives, entails"
  ⊨≜"models, satisfies"

  ;; ─── Definition ───
  ≜≜"defined as, equals by definition"
  ≔≜"assigned, bound to"
  ↦≜"maps to, sends to"
  λ≜"lambda, function"

  ;; ─── Sets/Types ───
  ∈≜"element of, in"
  ⊂≜"subset of"
  ⊆≜"subset or equal"
  ∪≜"union"
  ∩≜"intersection"
  ∅≜"empty set"

  ;; ─── Primitives ───
  𝔹≜"Boolean"
  ℕ≜"Natural numbers"
  ℤ≜"Integers"
  ℝ≜"Reals"
  ℚ≜"Rationals"
  𝕊≜"String"
}

⟦Σ:BlockTypes⟧{
  Θ≜"Task: executable intent with ψ (purpose)"
  Ε≜"Entity/Evidence: data or proof"
  Φ≜"Function: computation with φ (body)"
  Γ≜"Graph/Rules: relations and constraints"
  Δ≜"Contract: Pre/Post conditions"
  Λ≜"Lambda: pure computation"
  Π≜"Proof: verification artifact"
  Σ≜"Schema/Types: type definitions"
  Ω≜"Meta: metaprogramming, foundation"
  Χ≜"Errors: error algebra"
  ℭ≜"Categories: category theory"
}

⟦Σ:Tiers⟧{
  ◊⁺⁺≜"Platinum: δ≥0.75"
  ◊⁺≜"Gold: δ≥0.60"
  ◊≜"Silver: δ≥0.40"
  ◊⁻≜"Bronze: δ≥0.20"
  ⊘≜"Invalid: δ<0.20"
}

⟦Σ:Bindings⟧{
  ψ≜"intent, purpose (required for Θ)"
  ρ≜"resources, inputs (tuple)"
  τ≜"type annotation"
  σ≜"schema, structure"
  φ≜"function body"
  δ≜"density score"
  γ≜"context identifier"
  ◊≜"tier declaration"
}

⟦Γ:Syntax⟧{
  header≜"𝔸version.name@context"
  context≜"γ≔identifier"
  refs≜"ρ≔⟨tags⟩"
  block≜"⟦Type:Name⟧{ bindings }"
  binding≜"symbol≔value"
  tuple≜"⟨a, b, c⟩"
  list≜"[a, b, c]"
  record≜"⟨field:Type, ...⟩"
  comment≜";; text"
}

⟦Γ:Patterns⟧{
  universal≜"∀x:Type:condition"
  existential≜"∃x:Type:condition"
  unique_exists≜"∃!x:Type:condition"
  implication≜"A⇒B"
  biconditional≜"A⇔B"
  definition≜"name≜value"
  assignment≜"name≔value"
  function≜"λx.body"
  typed_func≜"f:A→B"
  constraint≜"∀x:T:P(x)⇒Q(x)"
  membership≜"x∈S"
}

⟦Γ:Validation⟧{
  required_blocks≜"⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧"
  density_formula≜"δ=|AISP_symbols|÷|non_ws_tokens|"
  ambiguity_threshold≜"Ambig(D)<0.02"
  header_required≜"Document must start with 𝔸"
}

⟦Λ:ASCII_Aliases⟧{
  ;; Use when Unicode unavailable
  forall≜∀; exists≜∃; exists_unique≜∃!
  and≜∧; or≜∨; not≜¬
  implies≜⇒; iff≜⇔; proves≜⊢; models≜⊨
  defeq≜≜; assign≜≔; mapsto≜↦
  lambda≜λ; in≜∈; subset≜⊂; subseteq≜⊆
  union≜∪; intersect≜∩; empty≜∅
  Bool≜𝔹; Nat≜ℕ; Int≜ℤ; Real≜ℝ; Rat≜ℚ; Str≜𝕊
  lbracket≜⟦; rbracket≜⟧; langle≜⟨; rangle≜⟩
  diamond≜◊; qed≜∎; top≜⊤; bot≜⊥
}

⟦Ε⟧⟨δ≜0.82;φ≜100;τ≜◊⁺⁺;ver≜5.1⟩
"#;

/// Compact anti-drift reference (~1.5KB for prompt injection)
pub static ANTI_DRIFT_COMPACT: &str = r#"𝔸5.1.ref@compact
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
;; Header must start with 𝔸
"#;

/// Get anti-drift reference by mode
pub fn get_anti_drift(mode: i32) -> &'static str {
    match mode {
        0 => ANTI_DRIFT_FULL,
        1 => ANTI_DRIFT_COMPACT,
        _ => ANTI_DRIFT_FULL,
    }
}

/// Get compact version
pub fn get_anti_drift_compact() -> &'static str {
    ANTI_DRIFT_COMPACT
}

/// Get JSON length (for buffer allocation)
pub fn get_anti_drift_json_len() -> usize {
    // Approximate JSON size
    ANTI_DRIFT_FULL.len() + 200
}
