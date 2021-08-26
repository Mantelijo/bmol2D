import { Residue } from "./atoms";

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
        
    nucleoAcid: {
        residue: Residue,
    },
    protein: {
        residue: Residue,
    },
    type: InteractionType,
    meta: any
}

