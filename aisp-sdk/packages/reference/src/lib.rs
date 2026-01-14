//! AISP Reference System
//!
//! Provides anti-drift reference, Rosetta Stone lookups, and templates
//! for AISP 5.1 specification compliance.

#![no_std]
#![allow(dead_code)]

mod anti_drift;
mod rosetta;
mod symbols;
mod templates;
mod blocks;

pub use anti_drift::{get_anti_drift, get_anti_drift_compact, get_anti_drift_json_len};
pub use rosetta::{rosetta_lookup, rosetta_explain, rosetta_suggest};
pub use symbols::{get_symbol, get_symbols_by_category, SYMBOL_COUNT};
pub use templates::{get_template, list_templates};
pub use blocks::{get_block_info, list_blocks};

// ============================================================================
// Global State
// ============================================================================

/// Output buffer for string results (4KB)
static mut OUTPUT_BUF: [u8; 4096] = [0; 4096];

/// Last output length
static mut OUTPUT_LEN: u32 = 0;

/// Last error code
static mut LAST_ERROR: i32 = 0;

// ============================================================================
// C-ABI Exports
// ============================================================================

/// Initialize reference system
#[no_mangle]
pub extern "C" fn aisp_ref_init() -> i32 {
    unsafe {
        OUTPUT_LEN = 0;
        LAST_ERROR = 0;
    }
    0
}

/// Get anti-drift reference document
/// mode: 0=full, 1=compact, 2=json
#[no_mangle]
pub extern "C" fn aisp_ref_anti_drift(mode: i32) -> i32 {
    let content = match mode {
        0 => anti_drift::ANTI_DRIFT_FULL,
        1 => anti_drift::ANTI_DRIFT_COMPACT,
        _ => anti_drift::ANTI_DRIFT_FULL,
    };

    unsafe {
        let bytes = content.as_bytes();
        let len = bytes.len().min(OUTPUT_BUF.len());
        OUTPUT_BUF[..len].copy_from_slice(&bytes[..len]);
        OUTPUT_LEN = len as u32;
    }

    0
}

/// Get output buffer pointer
#[no_mangle]
pub extern "C" fn aisp_ref_output_ptr() -> *const u8 {
    unsafe { OUTPUT_BUF.as_ptr() }
}

/// Get output length
#[no_mangle]
pub extern "C" fn aisp_ref_output_len() -> u32 {
    unsafe { OUTPUT_LEN }
}

/// Rosetta lookup: prose → symbol
/// Returns symbol ID or -1 if not found
#[no_mangle]
pub extern "C" fn aisp_ref_rosetta_lookup(ptr: *const u8, len: u32) -> i32 {
    if ptr.is_null() || len == 0 {
        return -1;
    }

    let input = unsafe { core::slice::from_raw_parts(ptr, len as usize) };
    let query = match core::str::from_utf8(input) {
        Ok(s) => s,
        Err(_) => return -1,
    };

    rosetta::lookup_symbol_id(query)
}

/// Rosetta explain: symbol → prose
/// Writes explanation to output buffer
#[no_mangle]
pub extern "C" fn aisp_ref_rosetta_explain(ptr: *const u8, len: u32) -> i32 {
    if ptr.is_null() || len == 0 {
        return -1;
    }

    let input = unsafe { core::slice::from_raw_parts(ptr, len as usize) };
    let symbol = match core::str::from_utf8(input) {
        Ok(s) => s,
        Err(_) => return -1,
    };

    if let Some(explanation) = rosetta::explain_symbol(symbol) {
        unsafe {
            let bytes = explanation.as_bytes();
            let out_len = bytes.len().min(OUTPUT_BUF.len());
            OUTPUT_BUF[..out_len].copy_from_slice(&bytes[..out_len]);
            OUTPUT_LEN = out_len as u32;
        }
        0
    } else {
        -1
    }
}

/// Get template by block type and name
#[no_mangle]
pub extern "C" fn aisp_ref_template(block_type: u8, template_id: u8) -> i32 {
    if let Some(template) = templates::get_template_by_id(block_type, template_id) {
        unsafe {
            let bytes = template.as_bytes();
            let len = bytes.len().min(OUTPUT_BUF.len());
            OUTPUT_BUF[..len].copy_from_slice(&bytes[..len]);
            OUTPUT_LEN = len as u32;
        }
        0
    } else {
        -1
    }
}

/// Get symbol info by ID
#[no_mangle]
pub extern "C" fn aisp_ref_symbol(id: u16) -> i32 {
    if let Some(info) = symbols::get_symbol_info(id) {
        unsafe {
            let bytes = info.as_bytes();
            let len = bytes.len().min(OUTPUT_BUF.len());
            OUTPUT_BUF[..len].copy_from_slice(&bytes[..len]);
            OUTPUT_LEN = len as u32;
        }
        0
    } else {
        -1
    }
}

/// Get block info by type
#[no_mangle]
pub extern "C" fn aisp_ref_block(block_type: u8) -> i32 {
    if let Some(info) = blocks::get_block_info_by_type(block_type) {
        unsafe {
            let bytes = info.as_bytes();
            let len = bytes.len().min(OUTPUT_BUF.len());
            OUTPUT_BUF[..len].copy_from_slice(&bytes[..len]);
            OUTPUT_LEN = len as u32;
        }
        0
    } else {
        -1
    }
}

/// Get last error
#[no_mangle]
pub extern "C" fn aisp_ref_error() -> i32 {
    unsafe { LAST_ERROR }
}

// ============================================================================
// Panic Handler
// ============================================================================

#[cfg(not(feature = "std"))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
