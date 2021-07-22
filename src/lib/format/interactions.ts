import { Residue } from "./atoms";

export enum InteractionType{
    // Threshold based interaction. Distance is the only factos
    Threshold,

    // Hydrogen bond interactions
    HBond,

    // Watson crick pair interactions
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

