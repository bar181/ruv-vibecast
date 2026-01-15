//! Rosetta Stone - Prose ↔ AISP Symbol mappings
//!
//! Bidirectional lookup between natural language and AISP symbols.

/// Rosetta entry: maps prose terms to AISP symbols
#[derive(Clone, Copy)]
pub struct RosettaEntry {
    pub id: u16,
    pub symbol: &'static str,
    pub prose: &'static [&'static str],
    pub category: &'static str,
    pub usage: &'static str,
}

/// Complete Rosetta Stone mappings
pub static ROSETTA_ENTRIES: &[RosettaEntry] = &[
    // ═══════════════════════════════════════════════════════════════
    // QUANTIFIERS
    // ═══════════════════════════════════════════════════════════════
    RosettaEntry {
        id: 0,
        symbol: "∀",
        prose: &["for all", "for every", "for each", "all", "every", "universal"],
        category: "quantifier",
        usage: "∀x:Type:condition",
    },
    RosettaEntry {
        id: 1,
        symbol: "∃",
        prose: &["exists", "there exists", "there is", "some", "existential"],
        category: "quantifier",
        usage: "∃x:Type:condition",
    },
    RosettaEntry {
        id: 2,
        symbol: "∃!",
        prose: &["exists unique", "exactly one", "unique", "there exists exactly one"],
        category: "quantifier",
        usage: "∃!x:Type:condition",
    },

    // ═══════════════════════════════════════════════════════════════
    // LOGIC
    // ═══════════════════════════════════════════════════════════════
    RosettaEntry {
        id: 10,
        symbol: "∧",
        prose: &["and", "both", "conjunction", "also"],
        category: "logic",
        usage: "A∧B",
    },
    RosettaEntry {
        id: 11,
        symbol: "∨",
        prose: &["or", "either", "disjunction"],
        category: "logic",
        usage: "A∨B",
    },
    RosettaEntry {
        id: 12,
        symbol: "¬",
        prose: &["not", "negation", "false that", "isn't"],
        category: "logic",
        usage: "¬A",
    },
    RosettaEntry {
        id: 13,
        symbol: "⇒",
        prose: &["implies", "if then", "therefore", "means that", "entails"],
        category: "logic",
        usage: "A⇒B",
    },
    RosettaEntry {
        id: 14,
        symbol: "⇔",
        prose: &["iff", "if and only if", "equivalent", "biconditional"],
        category: "logic",
        usage: "A⇔B",
    },
    RosettaEntry {
        id: 15,
        symbol: "⊢",
        prose: &["proves", "derives", "entails", "yields"],
        category: "logic",
        usage: "Γ⊢A",
    },
    RosettaEntry {
        id: 16,
        symbol: "⊨",
        prose: &["models", "satisfies", "validates"],
        category: "logic",
        usage: "M⊨A",
    },
    RosettaEntry {
        id: 17,
        symbol: "⊤",
        prose: &["true", "top", "tautology"],
        category: "logic",
        usage: "⊤",
    },
    RosettaEntry {
        id: 18,
        symbol: "⊥",
        prose: &["false", "bottom", "contradiction", "absurd"],
        category: "logic",
        usage: "⊥",
    },

    // ═══════════════════════════════════════════════════════════════
    // DEFINITION
    // ═══════════════════════════════════════════════════════════════
    RosettaEntry {
        id: 20,
        symbol: "≜",
        prose: &["defined as", "equals by definition", "is defined as", "definitionally equal"],
        category: "definition",
        usage: "name≜value",
    },
    RosettaEntry {
        id: 21,
        symbol: "≔",
        prose: &["assigned", "bound to", "set to", "becomes"],
        category: "definition",
        usage: "x≔5",
    },
    RosettaEntry {
        id: 22,
        symbol: "↦",
        prose: &["maps to", "sends to", "goes to"],
        category: "definition",
        usage: "x↦x+1",
    },
    RosettaEntry {
        id: 23,
        symbol: "λ",
        prose: &["lambda", "function", "anonymous function"],
        category: "definition",
        usage: "λx.body",
    },
    RosettaEntry {
        id: 24,
        symbol: "→",
        prose: &["to", "arrow", "function type", "returns"],
        category: "definition",
        usage: "A→B",
    },

    // ═══════════════════════════════════════════════════════════════
    // SETS
    // ═══════════════════════════════════════════════════════════════
    RosettaEntry {
        id: 30,
        symbol: "∈",
        prose: &["in", "element of", "belongs to", "member of"],
        category: "sets",
        usage: "x∈S",
    },
    RosettaEntry {
        id: 31,
        symbol: "∉",
        prose: &["not in", "not element of", "not member of"],
        category: "sets",
        usage: "x∉S",
    },
    RosettaEntry {
        id: 32,
        symbol: "⊂",
        prose: &["subset", "proper subset", "contained in"],
        category: "sets",
        usage: "A⊂B",
    },
    RosettaEntry {
        id: 33,
        symbol: "⊆",
        prose: &["subset or equal", "subset of", "included in"],
        category: "sets",
        usage: "A⊆B",
    },
    RosettaEntry {
        id: 34,
        symbol: "∪",
        prose: &["union", "or", "combined with"],
        category: "sets",
        usage: "A∪B",
    },
    RosettaEntry {
        id: 35,
        symbol: "∩",
        prose: &["intersection", "and", "overlap"],
        category: "sets",
        usage: "A∩B",
    },
    RosettaEntry {
        id: 36,
        symbol: "∅",
        prose: &["empty", "empty set", "null", "nothing"],
        category: "sets",
        usage: "∅",
    },

    // ═══════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════
    RosettaEntry {
        id: 40,
        symbol: "𝔹",
        prose: &["boolean", "bool", "true false", "binary"],
        category: "type",
        usage: "x:𝔹",
    },
    RosettaEntry {
        id: 41,
        symbol: "ℕ",
        prose: &["natural", "natural number", "positive integer", "counting number"],
        category: "type",
        usage: "n:ℕ",
    },
    RosettaEntry {
        id: 42,
        symbol: "ℤ",
        prose: &["integer", "int", "whole number"],
        category: "type",
        usage: "z:ℤ",
    },
    RosettaEntry {
        id: 43,
        symbol: "ℝ",
        prose: &["real", "real number", "decimal", "float"],
        category: "type",
        usage: "r:ℝ",
    },
    RosettaEntry {
        id: 44,
        symbol: "ℚ",
        prose: &["rational", "fraction", "ratio"],
        category: "type",
        usage: "q:ℚ",
    },
    RosettaEntry {
        id: 45,
        symbol: "𝕊",
        prose: &["string", "text", "str"],
        category: "type",
        usage: "s:𝕊",
    },

    // ═══════════════════════════════════════════════════════════════
    // SPECIAL
    // ═══════════════════════════════════════════════════════════════
    RosettaEntry {
        id: 50,
        symbol: "∎",
        prose: &["qed", "end proof", "proven", "done"],
        category: "special",
        usage: "∎",
    },
    RosettaEntry {
        id: 51,
        symbol: "◊",
        prose: &["tier", "quality", "diamond"],
        category: "special",
        usage: "◊⁺⁺",
    },
    RosettaEntry {
        id: 52,
        symbol: "𝔸",
        prose: &["aisp", "header", "document start"],
        category: "special",
        usage: "𝔸1.0.name@context",
    },
];

/// Lookup symbol ID by prose query
pub fn lookup_symbol_id(query: &str) -> i32 {
    let query_lower = query.to_ascii_lowercase();
    let query_lower = query_lower.trim();

    for entry in ROSETTA_ENTRIES {
        for prose in entry.prose {
            if prose.eq_ignore_ascii_case(query_lower) {
                return entry.id as i32;
            }
        }
    }

    // Partial match
    for entry in ROSETTA_ENTRIES {
        for prose in entry.prose {
            if prose.to_ascii_lowercase().contains(query_lower) ||
               query_lower.contains(&prose.to_ascii_lowercase()) {
                return entry.id as i32;
            }
        }
    }

    -1
}

/// Get symbol by ID
pub fn get_symbol_by_id(id: u16) -> Option<&'static str> {
    ROSETTA_ENTRIES.iter()
        .find(|e| e.id == id)
        .map(|e| e.symbol)
}

/// Explain symbol (returns prose description)
pub fn explain_symbol(symbol: &str) -> Option<&'static str> {
    for entry in ROSETTA_ENTRIES {
        if entry.symbol == symbol {
            // Return first prose term as explanation
            return entry.prose.first().copied();
        }
    }
    None
}

/// Get full explanation with usage
pub fn explain_symbol_full(symbol: &str) -> Option<(&'static [&'static str], &'static str, &'static str)> {
    for entry in ROSETTA_ENTRIES {
        if entry.symbol == symbol {
            return Some((entry.prose, entry.category, entry.usage));
        }
    }
    None
}

/// Lookup prose → symbol with confidence
pub fn rosetta_lookup(query: &str) -> Option<(&'static str, f32)> {
    let query_lower = query.to_ascii_lowercase();
    let query_lower = query_lower.trim();

    // Exact match
    for entry in ROSETTA_ENTRIES {
        for prose in entry.prose {
            if prose.eq_ignore_ascii_case(query_lower) {
                return Some((entry.symbol, 0.98));
            }
        }
    }

    // Partial match
    for entry in ROSETTA_ENTRIES {
        for prose in entry.prose {
            if prose.to_ascii_lowercase().contains(query_lower) {
                return Some((entry.symbol, 0.85));
            }
            if query_lower.contains(&prose.to_ascii_lowercase()) {
                return Some((entry.symbol, 0.80));
            }
        }
    }

    None
}

/// Explain symbol → prose
pub fn rosetta_explain(symbol: &str) -> Option<&'static RosettaEntry> {
    ROSETTA_ENTRIES.iter().find(|e| e.symbol == symbol)
}

/// Suggest AISP patterns for prose (basic implementation)
pub fn rosetta_suggest(prose: &str) -> &'static str {
    let lower = prose.to_ascii_lowercase();

    if lower.contains("for all") || lower.contains("every") {
        if lower.contains("if") || lower.contains("then") {
            return "∀x:Type:condition⇒result";
        }
        return "∀x:Type:property";
    }

    if lower.contains("exists") {
        if lower.contains("unique") {
            return "∃!x:Type:condition";
        }
        return "∃x:Type:condition";
    }

    if lower.contains("if") && lower.contains("then") {
        return "condition⇒result";
    }

    if lower.contains("defined as") || lower.contains("is a") {
        return "name≜definition";
    }

    if lower.contains("function") || lower.contains("returns") {
        return "f≜λx.body";
    }

    "∀x:T:P(x)"
}
