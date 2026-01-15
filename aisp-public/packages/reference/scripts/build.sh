#!/bin/bash
# Build script for AISP Reference WASM module

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Building AISP Reference WASM${NC}"

# Check for wasm32 target
if ! rustup target list --installed | grep -q wasm32-unknown-unknown; then
    echo -e "${YELLOW}Installing wasm32-unknown-unknown target...${NC}"
    rustup target add wasm32-unknown-unknown
fi

# Build
cargo build --release --target wasm32-unknown-unknown

# Copy output
mkdir -p dist
WASM_IN="target/wasm32-unknown-unknown/release/aisp_reference.wasm"
WASM_OUT="dist/aisp-reference.wasm"

if [ -f "$WASM_IN" ]; then
    cp "$WASM_IN" "$WASM_OUT"

    # Optimize if wasm-opt available
    if command -v wasm-opt &> /dev/null; then
        wasm-opt -Oz -o "$WASM_OUT" "$WASM_OUT"
    fi

    SIZE=$(stat -f%z "$WASM_OUT" 2>/dev/null || stat -c%s "$WASM_OUT")
    echo -e "${GREEN}Built: $WASM_OUT ($SIZE bytes)${NC}"
else
    echo "Warning: WASM file not found, using JS-only mode"
fi

echo -e "${GREEN}Build complete${NC}"
