#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

#*****************************************************************************
# CONFIG
#*****************************************************************************

GRAMMAR="grammar.js"
PARSER="src/parser.c"
WASM="tree-sitter-runt.wasm"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

step() { echo -e "${CYAN}:: $1${NC}"; }
ok()   { echo -e "${GREEN}   ok${NC}"; }
fail() { echo -e "${RED}   FAILED${NC}"; exit 1; }

#*****************************************************************************
# DEPS
#*****************************************************************************

if ! command -v tree-sitter &>/dev/null; then
    if [ -x "./node_modules/.bin/tree-sitter" ]; then
        export PATH="./node_modules/.bin:$PATH"
    else
        echo -e "${RED}tree-sitter-cli not found. Run: npm install${NC}"
        exit 1
    fi
fi

#*****************************************************************************
# GENERATE (grammar.js -> parser.c)
#*****************************************************************************

step "Generating parser from grammar.js"
tree-sitter generate && ok || fail

#*****************************************************************************
# BUILD NATIVE
#*****************************************************************************

step "Building native parser"
tree-sitter build && ok || fail

#*****************************************************************************
# BUILD WASM
#*****************************************************************************

step "Building WASM"
tree-sitter build --wasm && ok || fail

#*****************************************************************************
# TEST
#*****************************************************************************

if [ -d "test" ] || [ -d "corpus" ]; then
    step "Running tests"
    tree-sitter test && ok || fail
else
    step "No test corpus found, skipping tests"
fi

#*****************************************************************************
# DONE
#*****************************************************************************

echo ""
echo -e "${GREEN}Build complete.${NC}"
echo "  parser:  $PARSER"
echo "  wasm:    $WASM"
