/**
 * Formats of spatial data for visualization
 */

export type Coordinate = {
    x: number,
    y: number,
    z: number, 
}

/**
 * Structure for ATOM records in pdb file
 */
export interface Atom{
    coords: Coordinate,
    name: string,
    residueName: string,
    element: string,
    residueSequenceNumber: number,
}

/**
 * Atom names might contain remoteness symbols. Here is a small mapping up to H
 * 
 * @example AtomRemoteness["A"]
 */
export enum AtomRemoteness {
    A='α',	
    B='β',	
    G='γ',	
    D='δ',	
    E='ε',	
    Z='ζ',	
    H='η',	
}

/**
 *  @see https://proteopedia.org/wiki/index.php/Standard_Residues
 */
export interface Residue{
    name: string,
    atoms: Atom[],
    sequenceNumber: number,
}

/**
 * Residue types for DNA, RNA and Proteins
 * DNA - deoxynucleotides
 * RNA - nucleotides
 * PROTEIN - standard amino acids
 */
export enum DNAResidues{
    DA, DG, DC, DT,
}
export enum RNAResidues{
    A, C, G, I, U
}
export enum ProteinResidues{
    Ala, Arg, Asn, Asp, Cys, Glu, Gln, Gly, His, Ile, Leu, Lys, Met, Phe, Pro, Ser, Thr, Trp, Tyr, Val,
}

/**
 * Type of polymer
 */
export enum PolymerKind {
    DNA ="DNA",
    RNA = "RNA",
    Protein = "Protein",

    // Undefined polymer kind 
    Unknown = "Unknown",
}

/**
 * Polymer contains all residues until a TER in PDB is found
 */
export interface Polymer{
    residues: Residue[],
    kind: PolymerKind,
    chainIdentifier: string, // Name of the chain (A,B,C, ... <etc>)
}

/**
 * File formats below
 */
export interface PDBFile{
    polymers: Polymer[],
    raw: string,
}


/**
 * Determines polymer kind from atom's residue name
 * 
 * @param atom 
 * @returns
 */
export function polymerKindFromAtom(atom: Atom): PolymerKind{
    switch (true){
        case atom.residueName in DNAResidues:
            return PolymerKind.DNA;
        case atom.residueName in RNAResidues:
            return PolymerKind.RNA;
        default:
            return PolymerKind.Protein;
    }
}   