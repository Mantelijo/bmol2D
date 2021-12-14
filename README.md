# BMol2D

Schematic 2D biomolecule interactions visualizer.

## Source structure

- **src** project source code
  - **components** react components
  - **lib**
    - **viz** visualization specific functionality
    - **types** interfaces and type definitions for atoms, polymers, visualization data structure etc.

## TODO List

- Universal data structure to accommodate data for visualizations.
- Correct double stranded DNA interactions between sister strands.
- Universal Visualization system, that can adapted for multiple types of visualizations.
  - Visualization types:
    - Double Stranded DNA - protein interactions
    - Single Stranded RNA - protein interactions
    - Double stranded RNA (TBD)
- Ignore engineered chains DNA/RNA (examples: 5x11)
- Searching for PDB files via API
  - Example: https://files.rcsb.org/download/3L1P.pdb (No CORS restrictions, so can be fetched)

## Done list

## Questions

- 2dgc - only 1 strand in PDB file (too old format maybe?)
- Do we always need to reverse the second DNA strand?
- 1zs4 - long protrusions, is there any generic way to implement correctly?

## TODO

- HETATM pasiziureti (gali buti grandines viduj)
- 2dgc - biological assemblies MODEL keywordai
- Pasiziureti su DSSR RNA kaip jie daro (http://wdssr.x3dna.org/index.php/doc/citation)

# Aprasymas

- Literaturos apzvalgai - saveikos, amino r, nukleotidu strukturos, viskas kuo daugiau apie chemija o ne software developmentas.
- Praktikos aprasymas - chemijos ziniu pritaikymas sprendziant ir vizualizuojant
- Prie rezultatu - pavyzdziai kazokie tyrinejant saveikas

# Sample structures

- 5BK4 - very large structure, takes few minutes to load
