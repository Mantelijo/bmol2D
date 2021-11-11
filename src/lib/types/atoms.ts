/**
 * Formats of spatial data for visualization
 */

import { Vector } from "../Vector";
import { Interaction } from "./interactions";

// Coordinate represents a 3-dimensional coordinate set
export interface Coordinate {
    x: number,
    y: number,
    z: number,

    // Converts coordinate to vector
    toVec: () => Vector,
}

export class Coord implements Coordinate {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) { }
    toVec(): Vector {
        return Vector.fromArray(coordinateToArray(this))
    }
}

// Helper
export function coordinateToArray(c: Coordinate): number[] {
    return [c.x, c.y, c.z];
}

// Structure for ATOM records in pdb file
export interface Atom {
    coords: Coordinate,
    name: string,
    residueName: ResidueName,
    element: string,
    residueSequenceNumber: number,
}

export type Atoms = Atom[];

/**
 * Atom names might contain remoteness symbols. Here is a small mapping up
 * to H
 *
 * @example AtomRemoteness["A"]
 */
export enum AtomRemoteness {
    A = 'α',
    B = 'β',
    G = 'γ',
    D = 'δ',
    E = 'ε',
    Z = 'ζ',
    H = 'η',
}

export type ResidueName = string | DNAResidues | RNAResidues | ProteinResidues;

// Met information about residue, not helpful for calculations
export interface ResidueMeta {
    hash: string,
    name: ResidueName,
    sequenceNumber: number,
    polymerChainIdentifier: string,
    // polymerKind: PolymerKind,
}

/**
 *  @see https://proteopedia.org/wiki/index.php/Standard_Residues
 */
export interface Residue extends ResidueMeta {
    // Center defines the arithmetic average of all atoms coordinates in
    // residue All coordinates are set to -1 if center is not calculated
    center: Coordinate,

    // List of interactions with this residue
    interactions: Interaction[],

    // Residue atoms
    atoms: Atom[],

    // For non nucleotides these values will be empty. v and o vectors
    // that define the plane of DNA/RNA nucleotide v is normalized (v =
    // v/|v|) v is calculated as following: v=(C4-C2)x(C6-C2), where Cx is
    // the xth C atom in nucleotide o is simply the average of C2, C4, C6:
    // o=(C2+C4+C6)/3
    v: Vector,
    o: Vector,

    /**
     * Finds all atoms of this residue which match the given names. Atoms
     * are returned as array in the order the names were provided. Only
     * exact name matches are compared.
     */
    findAtomsByNames: (names: string[]) => Atom[]
}

// Generic residue implementation
export class ResidueImplementation implements Residue {
    public center: Coordinate;
    public interactions: Interaction[];
    public atoms: Atom[];
    public v: Vector;
    public o: Vector;
    public hash: string;
    public name: ResidueName;
    public sequenceNumber: number;
    public polymerChainIdentifier: string;

    constructor() {
        this.atoms = [];
        this.name = '';
        this.sequenceNumber = -1;
        this.center = new Coord(-1,-1,-1);
        this.hash = "";
        this.interactions = [];
        this.polymerChainIdentifier = "";
        this.v = Vector.infinity();
        this.o = Vector.infinity();
    }

    findAtomsByNames(names: string[]): Atom[] {
        let ret: Atoms = [];

        this.atoms.forEach(a => {
            if (names.indexOf(a.name) !== -1) {
                ret.push(a);
            }
        });

        // Reorder based on names
        ret.sort((a, b) => {
            return names.indexOf(a.name) - names.indexOf(b.name);
        })

        return ret;
    }
}

/**
 * Residue types for DNA, RNA and Proteins DNA - deoxynucleotides RNA -
 * nucleotides PROTEIN - standard amino acids
 */
export enum DNAResidues {
    DA = "DA",
    DG = "DG",
    DC = "DC",
    DT = "DT",
}

export enum RNAResidues {
    A, C, G, I, U
}
export enum ProteinResidues {
    Ala, Arg, Asn, Asp, Cys, Glu, Gln, Gly, His, Ile, Leu, Lys, Met, Phe, Pro, Ser, Thr, Trp, Tyr, Val,
}

/**
 * Type of polymer
 */
export enum PolymerKind {
    DNA = "DNA",
    RNA = "RNA",
    Protein = "Protein",

    // Undefined polymer kind 
    Unknown = "Unknown",
}

/**
 * Polymer contains all residues until a TER in PDB is found
 */
export interface Polymer {
    residues: Residue[],
    kind: PolymerKind,
    chainIdentifier: string, // Name of the chain (A,B,C, ... <etc>)
}

/**
 * File formats below
 */
export interface PDBFile {
    polymers: Polymer[],
    raw: string,
}


/**
 * Determines polymer kind from atom's residue name
 *
 * @param atom 
 * @returns
 */
export function polymerKindFromAtom(atom: Atom): PolymerKind {
    switch (true) {
        case atom.residueName in DNAResidues:
            return PolymerKind.DNA;
        case atom.residueName in RNAResidues:
            return PolymerKind.RNA;
        default:
            return PolymerKind.Protein;
    }
}