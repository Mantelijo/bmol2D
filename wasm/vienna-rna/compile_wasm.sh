#!/bin/bash

# Compile wasm module with Emscripten
emcc -DNDEBUG -lm --no-entry -sEXPORTED_FUNCTIONS=_secondaryStruct main.c naview.c utils/{basic,structure_utils}.c -o naview.html

# Make module
echo "export default Module;" >> naview.js

# Cp to web app src
cp naview.wasm naview.js ../../src/wasm/
