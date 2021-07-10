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
    element: string
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

export type PolymerKind = string;

/**
 * Polymer contains all residues until a TER in PDB is found
 */
export interface Polymer{
    residues: Residue[],
    kind?: PolymerKind,
    chainIdentifier: string, // Name of the chain (A,B,C, ... <etc>)
}

/**
 * File formats below
 */
export interface PDBFile{
    polymers: Polymer[],
    raw: string,
}
