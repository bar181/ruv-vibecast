//! AISP Symbol definitions (Σ_512 subset)
//!
//! Core symbols for AISP 5.1 specification.

/// Symbol count
pub const SYMBOL_COUNT: usize = 64;

/// Symbol entry
#[derive(Clone, Copy)]
pub struct SymbolEntry {
    pub id: u16,
    pub glyph: &'static str,
    pub name: &'static str,
    pub category: SymbolCategory,
    pub ascii_alias: &'static str,
}

/// Symbol categories (AISP Σ_512 ranges)
#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum SymbolCategory {
    /// Ω: Transmuters [0-63]
    Omega = 0,
    /// Γ: Topologics [64-127]
    Gamma = 1,
    /// ∀: Quantifiers [128-191]
    Forall = 2,
    /// Δ: Contractors [192-255]
    Delta = 3,
    /// 𝔻: Domaines [256-319]
    Domain = 4,
    /// Ψ: Intents [320-383]
    Psi = 5,
    /// ⟦⟧: Delimiters [384-447]
    Block = 6,
    /// ∅: Reserved [448-511]
    Reserved = 7,
}

impl SymbolCategory {
    pub fn name(&self) -> &'static str {
        match self {
            Self::Omega => "Transmuters",
            Self::Gamma => "Topologics",
            Self::Forall => "Quantifiers",
            Self::Delta => "Contractors",
            Self::Domain => "Domaines",
            Self::Psi => "Intents",
            Self::Block => "Delimiters",
            Self::Reserved => "Reserved",
        }
    }
}

/// Core symbol definitions
pub static SYMBOLS: &[SymbolEntry] = &[
    // ═══════════════════════════════════════════════════════════════
    // Ω: TRANSMUTERS (logic, proof)
    // ═══════════════════════════════════════════════════════════════
    SymbolEntry { id: 0, glyph: "⊤", name: "top", category: SymbolCategory::Omega, ascii_alias: "top" },
    SymbolEntry { id: 1, glyph: "⊥", name: "bottom", category: SymbolCategory::Omega, ascii_alias: "bot" },
    SymbolEntry { id: 2, glyph: "∧", name: "and", category: SymbolCategory::Omega, ascii_alias: "and" },
    SymbolEntry { id: 3, glyph: "∨", name: "or", category: SymbolCategory::Omega, ascii_alias: "or" },
    SymbolEntry { id: 4, glyph: "¬", name: "not", category: SymbolCategory::Omega, ascii_alias: "not" },
    SymbolEntry { id: 5, glyph: "→", name: "arrow", category: SymbolCategory::Omega, ascii_alias: "->" },
    SymbolEntry { id: 6, glyph: "↔", name: "biarrow", category: SymbolCategory::Omega, ascii_alias: "<->" },
    SymbolEntry { id: 7, glyph: "⇒", name: "implies", category: SymbolCategory::Omega, ascii_alias: "=>" },
    SymbolEntry { id: 8, glyph: "⇔", name: "iff", category: SymbolCategory::Omega, ascii_alias: "<=>" },
    SymbolEntry { id: 9, glyph: "⊢", name: "proves", category: SymbolCategory::Omega, ascii_alias: "|-" },
    SymbolEntry { id: 10, glyph: "⊨", name: "models", category: SymbolCategory::Omega, ascii_alias: "|=" },
    SymbolEntry { id: 11, glyph: "≜", name: "defeq", category: SymbolCategory::Omega, ascii_alias: ":=" },
    SymbolEntry { id: 12, glyph: "≔", name: "assign", category: SymbolCategory::Omega, ascii_alias: ":=" },
    SymbolEntry { id: 13, glyph: "↦", name: "mapsto", category: SymbolCategory::Omega, ascii_alias: "|->" },
    SymbolEntry { id: 14, glyph: "λ", name: "lambda", category: SymbolCategory::Omega, ascii_alias: "fn" },
    SymbolEntry { id: 15, glyph: "∎", name: "qed", category: SymbolCategory::Omega, ascii_alias: "QED" },

    // ═══════════════════════════════════════════════════════════════
    // Γ: TOPOLOGICS (sets, structure)
    // ═══════════════════════════════════════════════════════════════
    SymbolEntry { id: 64, glyph: "∈", name: "element", category: SymbolCategory::Gamma, ascii_alias: "in" },
    SymbolEntry { id: 65, glyph: "∉", name: "not_element", category: SymbolCategory::Gamma, ascii_alias: "notin" },
    SymbolEntry { id: 66, glyph: "⊂", name: "subset", category: SymbolCategory::Gamma, ascii_alias: "subset" },
    SymbolEntry { id: 67, glyph: "⊆", name: "subseteq", category: SymbolCategory::Gamma, ascii_alias: "subseteq" },
    SymbolEntry { id: 68, glyph: "∩", name: "intersect", category: SymbolCategory::Gamma, ascii_alias: "inter" },
    SymbolEntry { id: 69, glyph: "∪", name: "union", category: SymbolCategory::Gamma, ascii_alias: "union" },
    SymbolEntry { id: 70, glyph: "∅", name: "empty", category: SymbolCategory::Gamma, ascii_alias: "empty" },
    SymbolEntry { id: 71, glyph: "𝒫", name: "powerset", category: SymbolCategory::Gamma, ascii_alias: "P" },

    // ═══════════════════════════════════════════════════════════════
    // ∀: QUANTIFIERS
    // ═══════════════════════════════════════════════════════════════
    SymbolEntry { id: 128, glyph: "∀", name: "forall", category: SymbolCategory::Forall, ascii_alias: "forall" },
    SymbolEntry { id: 129, glyph: "∃", name: "exists", category: SymbolCategory::Forall, ascii_alias: "exists" },
    SymbolEntry { id: 130, glyph: "∃!", name: "unique", category: SymbolCategory::Forall, ascii_alias: "exists!" },
    SymbolEntry { id: 131, glyph: "Π", name: "pi", category: SymbolCategory::Forall, ascii_alias: "Pi" },
    SymbolEntry { id: 132, glyph: "Σ", name: "sigma", category: SymbolCategory::Forall, ascii_alias: "Sigma" },
    SymbolEntry { id: 133, glyph: "⊕", name: "oplus", category: SymbolCategory::Forall, ascii_alias: "(+)" },
    SymbolEntry { id: 134, glyph: "⊖", name: "ominus", category: SymbolCategory::Forall, ascii_alias: "(-)" },
    SymbolEntry { id: 135, glyph: "⊗", name: "otimes", category: SymbolCategory::Forall, ascii_alias: "(x)" },
    SymbolEntry { id: 136, glyph: "◊", name: "diamond", category: SymbolCategory::Forall, ascii_alias: "<>" },

    // ═══════════════════════════════════════════════════════════════
    // 𝔻: DOMAINES (types)
    // ═══════════════════════════════════════════════════════════════
    SymbolEntry { id: 256, glyph: "ℕ", name: "nat", category: SymbolCategory::Domain, ascii_alias: "Nat" },
    SymbolEntry { id: 257, glyph: "ℤ", name: "int", category: SymbolCategory::Domain, ascii_alias: "Int" },
    SymbolEntry { id: 258, glyph: "ℝ", name: "real", category: SymbolCategory::Domain, ascii_alias: "Real" },
    SymbolEntry { id: 259, glyph: "ℚ", name: "rat", category: SymbolCategory::Domain, ascii_alias: "Rat" },
    SymbolEntry { id: 260, glyph: "𝔹", name: "bool", category: SymbolCategory::Domain, ascii_alias: "Bool" },
    SymbolEntry { id: 261, glyph: "𝕊", name: "string", category: SymbolCategory::Domain, ascii_alias: "Str" },

    // ═══════════════════════════════════════════════════════════════
    // ⟦⟧: DELIMITERS (blocks)
    // ═══════════════════════════════════════════════════════════════
    SymbolEntry { id: 384, glyph: "⟦", name: "lbracket", category: SymbolCategory::Block, ascii_alias: "[[" },
    SymbolEntry { id: 385, glyph: "⟧", name: "rbracket", category: SymbolCategory::Block, ascii_alias: "]]" },
    SymbolEntry { id: 386, glyph: "⟨", name: "langle", category: SymbolCategory::Block, ascii_alias: "<" },
    SymbolEntry { id: 387, glyph: "⟩", name: "rangle", category: SymbolCategory::Block, ascii_alias: ">" },
    SymbolEntry { id: 388, glyph: "𝔸", name: "aisp", category: SymbolCategory::Block, ascii_alias: "A" },

    // ═══════════════════════════════════════════════════════════════
    // Greek letters (for blocks)
    // ═══════════════════════════════════════════════════════════════
    SymbolEntry { id: 389, glyph: "Ω", name: "Omega", category: SymbolCategory::Block, ascii_alias: "Omega" },
    SymbolEntry { id: 390, glyph: "Γ", name: "Gamma", category: SymbolCategory::Block, ascii_alias: "Gamma" },
    SymbolEntry { id: 391, glyph: "Λ", name: "Lambda", category: SymbolCategory::Block, ascii_alias: "Lambda" },
    SymbolEntry { id: 392, glyph: "Σ", name: "Sigma_block", category: SymbolCategory::Block, ascii_alias: "Sigma" },
    SymbolEntry { id: 393, glyph: "Χ", name: "Chi", category: SymbolCategory::Block, ascii_alias: "Chi" },
    SymbolEntry { id: 394, glyph: "Ε", name: "Epsilon", category: SymbolCategory::Block, ascii_alias: "E" },
    SymbolEntry { id: 395, glyph: "Θ", name: "Theta", category: SymbolCategory::Block, ascii_alias: "Theta" },
    SymbolEntry { id: 396, glyph: "Δ", name: "Delta", category: SymbolCategory::Block, ascii_alias: "Delta" },
    SymbolEntry { id: 397, glyph: "Φ", name: "Phi", category: SymbolCategory::Block, ascii_alias: "Phi" },
    SymbolEntry { id: 398, glyph: "Π", name: "Pi_block", category: SymbolCategory::Block, ascii_alias: "Pi" },
    SymbolEntry { id: 399, glyph: "ℭ", name: "Category", category: SymbolCategory::Block, ascii_alias: "C" },
];

/// Get symbol by ID
pub fn get_symbol(id: u16) -> Option<&'static SymbolEntry> {
    SYMBOLS.iter().find(|s| s.id == id)
}

/// Get symbol info as string
pub fn get_symbol_info(id: u16) -> Option<&'static str> {
    // Return static string for common symbols
    match id {
        0 => Some("⊤ (top): true, tautology"),
        1 => Some("⊥ (bottom): false, contradiction"),
        2 => Some("∧ (and): conjunction"),
        3 => Some("∨ (or): disjunction"),
        4 => Some("¬ (not): negation"),
        7 => Some("⇒ (implies): implication"),
        11 => Some("≜ (defeq): defined as"),
        14 => Some("λ (lambda): function"),
        64 => Some("∈ (element): member of"),
        128 => Some("∀ (forall): universal quantifier"),
        129 => Some("∃ (exists): existential quantifier"),
        256 => Some("ℕ (nat): natural numbers"),
        260 => Some("𝔹 (bool): boolean"),
        388 => Some("𝔸 (aisp): document header"),
        _ => None,
    }
}

/// Get symbols by category
pub fn get_symbols_by_category(cat: SymbolCategory) -> impl Iterator<Item = &'static SymbolEntry> {
    SYMBOLS.iter().filter(move |s| s.category == cat)
}

/// Lookup symbol by glyph
pub fn lookup_by_glyph(glyph: &str) -> Option<&'static SymbolEntry> {
    SYMBOLS.iter().find(|s| s.glyph == glyph)
}

/// Lookup symbol by ASCII alias
pub fn lookup_by_ascii(alias: &str) -> Option<&'static SymbolEntry> {
    SYMBOLS.iter().find(|s| s.ascii_alias.eq_ignore_ascii_case(alias))
}
