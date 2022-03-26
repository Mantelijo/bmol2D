# BMol2D

Schematic RNA/DNA secondary structure visualization tool working entirely in your browser.

# Building project

Install `npm_modules`

```bash
yarn install
```

Compile wasm module

```bash
cd wasm/vienna-rna/ && ./compile_wasm.sh
```

To compile js assets

```
yarn build
```

# Secondary structures

RNR secondary structures information generation currently requires globally available
[MC-Annotate](https://github.com/major-lab/MC-Annotate) executable with python3. To start the
secondary structure generator, run the following command:

```bash
python3 ./wasm/coordinates_server.py
```

# Project structure

```
├── build - build directory
├── public - web assets
├── src -
└── wasm
```

# Acknowledgments

- [ViennaRNA](https://github.com/ViennaRNA/ViennaRNA)
- [MC-Annotate](https://github.com/major-lab/MC-Annotate)
- [Forgi](https://github.com/ViennaRNA/forgi)
- [VU Department of Bioinformatics](http://www.bti.vu.lt/en/departments/department-of-bioinformatics)
