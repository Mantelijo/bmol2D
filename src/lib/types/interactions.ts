import { PolymerKind, Residue, ResidueMeta } from "./atoms";

// Defines the distance threshold value for Threshold interaction type
export const THRESHOLD_DISTANCE: number = 5;

export enum InteractionType{
    // Threshold based interaction. Distance is the only factor
    Threshold,

    // Hydrogen bond interactions
    HBond,

    // Watson crick pair interactions, primarily between DNA, RNA
    // nucleotides (Defined by VisualizationResidue.index)
    // WatsonCrickPair,
}

// Interaction interface defines an interaction that the residue
// containing the interaction object has.
export interface Interaction{
    // The residue that Interaction holder interacts with
    residue: ResidueMeta,
    polymerKind: PolymerKind,
    type: InteractionType,

    // Any additional data
    meta: any
}

