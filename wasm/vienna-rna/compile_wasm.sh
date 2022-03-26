#!/bin/bash
rm naview.js naview.wasm

# Compile wasm module with Emscripten
emcc -DNDEBUG -lm --no-entry \
-s EXPORTED_FUNCTIONS=_secondaryStructureFromPairTable,_secondaryStructureFromDotBraket \
-s EXPORTED_RUNTIME_METHODS=cwrap,ccall,getValue \
--pre-js pre.js \
main.c naview.c utils/{basic,structure_utils}.c  -o naview.js $@
# -s MODULARIZE \
# -s EXPORT_ES6 \

# Make module
echo "export default Module;" >> naview.js

# Cp to web app src
cp naview.wasm naview.js ../../src/wasm/

