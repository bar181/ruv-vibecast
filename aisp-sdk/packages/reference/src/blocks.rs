//! AISP Block Type definitions
//!
//! Information about each AISP block type.

/// Block type information
#[derive(Clone, Copy)]
pub struct BlockInfo {
    pub type_id: u8,
    pub symbol: &'static str,
    pub name: &'static str,
    pub purpose: &'static str,
    pub required: bool,
    pub bindings: &'static [&'static str],
}

/// All block types
pub static BLOCKS: &[BlockInfo] = &[
    // ═══════════════════════════════════════════════════════════════
    // REQUIRED BLOCKS
    // ═══════════════════════════════════════════════════════════════
    BlockInfo {
        type_id: 0,
        symbol: "Ω",
        name: "Meta",
        purpose: "Foundation, meta-logic, invariants",
        required: true,
        bindings: &["domain", "invariants"],
    },
    BlockInfo {
        type_id: 1,
        symbol: "Σ",
        name: "Types",
        purpose: "Type definitions, schemas",
        required: true,
        bindings: &["type definitions using ≜"],
    },
    BlockInfo {
        type_id: 2,
        symbol: "Γ",
        name: "Rules",
        purpose: "Inference rules, constraints",
        required: true,
        bindings: &["rules using ∀, ⇒"],
    },
    BlockInfo {
        type_id: 3,
        symbol: "Λ",
        name: "Functions",
        purpose: "Function definitions",
        required: true,
        bindings: &["functions using λ"],
    },
    BlockInfo {
        type_id: 4,
        symbol: "Ε",
        name: "Evidence",
        purpose: "Validation metrics, proofs",
        required: true,
        bindings: &["δ (density)", "φ (completeness)", "τ (tier)"],
    },

    // ═══════════════════════════════════════════════════════════════
    // OPTIONAL BLOCKS
    // ═══════════════════════════════════════════════════════════════
    BlockInfo {
        type_id: 5,
        symbol: "Θ",
        name: "Task",
        purpose: "Executable intent with purpose",
        required: false,
        bindings: &["ψ (intent)", "ρ (resources)", "τ (type)"],
    },
    BlockInfo {
        type_id: 6,
        symbol: "Χ",
        name: "Errors",
        purpose: "Error algebra, recovery",
        required: false,
        bindings: &["error conditions", "recovery actions"],
    },
    BlockInfo {
        type_id: 7,
        symbol: "Δ",
        name: "Contract",
        purpose: "Pre/Post conditions",
        required: false,
        bindings: &["Pre", "Post", "Invariant"],
    },
    BlockInfo {
        type_id: 8,
        symbol: "Φ",
        name: "Function",
        purpose: "Computation with body",
        required: false,
        bindings: &["φ (body)", "σ (signature)"],
    },
    BlockInfo {
        type_id: 9,
        symbol: "Π",
        name: "Proof",
        purpose: "Verification artifacts",
        required: false,
        bindings: &["proof steps", "∎ (qed)"],
    },
    BlockInfo {
        type_id: 10,
        symbol: "ℭ",
        name: "Categories",
        purpose: "Category theory constructs",
        required: false,
        bindings: &["functors", "natural transformations"],
    },
    BlockInfo {
        type_id: 11,
        symbol: "ℜ",
        name: "Registry",
        purpose: "External references",
        required: false,
        bindings: &["refs", "imports"],
    },
];

/// Get block info by type ID
pub fn get_block_info(type_id: u8) -> Option<&'static BlockInfo> {
    BLOCKS.iter().find(|b| b.type_id == type_id)
}

/// Get block info by symbol
pub fn get_block_by_symbol(symbol: &str) -> Option<&'static BlockInfo> {
    BLOCKS.iter().find(|b| b.symbol == symbol)
}

/// Get block info as string
pub fn get_block_info_by_type(type_id: u8) -> Option<&'static str> {
    match type_id {
        0 => Some("Ω (Meta): Foundation, meta-logic. Required. Bindings: domain, invariants"),
        1 => Some("Σ (Types): Type definitions. Required. Use ≜ for definitions"),
        2 => Some("Γ (Rules): Inference rules. Required. Use ∀, ⇒ for constraints"),
        3 => Some("Λ (Functions): Function definitions. Required. Use λ for lambdas"),
        4 => Some("Ε (Evidence): Validation metrics. Required. Bindings: δ, φ, τ"),
        5 => Some("Θ (Task): Executable intent. Optional. Bindings: ψ (intent), ρ (resources)"),
        6 => Some("Χ (Errors): Error algebra. Optional."),
        7 => Some("Δ (Contract): Pre/Post conditions. Optional."),
        8 => Some("Φ (Function): Computation. Optional. Binding: φ (body)"),
        9 => Some("Π (Proof): Verification. Optional."),
        10 => Some("ℭ (Categories): Category theory. Optional."),
        _ => None,
    }
}

/// List all blocks
pub fn list_blocks() -> &'static [BlockInfo] {
    BLOCKS
}

/// List required blocks
pub fn required_blocks() -> impl Iterator<Item = &'static BlockInfo> {
    BLOCKS.iter().filter(|b| b.required)
}

/// List optional blocks
pub fn optional_blocks() -> impl Iterator<Item = &'static BlockInfo> {
    BLOCKS.iter().filter(|b| !b.required)
}
