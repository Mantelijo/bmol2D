import { Residue } from "./atoms";

// Defines the distance threshold value for Threshold interaction type
export const THRESHOLD_DISTANCE: number = 5;

export enum InteractionType{
    // Threshold based interaction. Distance is the only factor
    Threshold,

    // Hydrogen bond interactions
    HBond,

    // Watson crick pair interactions, primarily between DNA, RNA nucleotides
    WatsonCrickPairs,
}

/**
 * Interaction definition
 */
export interface Interaction{
    // Helpful for quick lookup when performing visualizations
    nucleoAcidResidueSequenceNumber: number,
    nucleoAcidChainIdentifier: string,
        
    // Two residues that interact. These might be a 
    // Nucleotide-AminoAcid; Nucleotide-Nucleotide
    residue1: Residue,
    residue2: Residue,

    type: InteractionType,
    meta: any
}

