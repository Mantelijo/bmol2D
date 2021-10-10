# BMol2D
Schematic 2D biomolecule interactions visualizer.

## Source structure
- **src** project source code 
    - **components** react components
    - **lib**
        -  **types** interfaces and type definitions for atoms, polymers, visualization data structure etc.

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