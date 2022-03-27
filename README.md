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

# Run locally

To run project locally, start the vite dev server with the following command:

```bash
yarn dev
```

If you wish to generate secondary structures for RNA molecules, see
[Seoncdary Structures](#secondary-structures).

# Secondary structures

RNR secondary structures information generation currently uses
[Forgi Library v1.0](https://github.com/ViennaRNA/forgi/tree/v1.0) and requires globally available
[MC-Annotate](https://github.com/major-lab/MC-Annotate) executable with python3. Make sure you have
these dependencies installed on your system. To start the secondary structure generator, run the
following command:

```bash
python3 ./wasm/coordinates_server.py
```

This command will start a minimal python `http.server` on `localhost:8001`. This endpoint is queried
for
[dot-braket](https://www.tbi.univie.ac.at/RNA/ViennaRNA/doc/html/rna_structure_notations.html#sec_structure_representations)
structures which are later provided to the wasm module, which generates the secondary structure
coordinates that are required to display RNA secondary structures.

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
