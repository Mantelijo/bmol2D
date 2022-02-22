import { Atom, PolymerKind } from "./atoms";

// Defines the distance threshold value for Threshold interaction type
export const THRESHOLD_DISTANCE: number = 5;

export enum InteractionType {
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
export interface Interaction {
	// Residue and polymer identifiers
	residueHash: string;
	polymerChainIdentifier: string;
	// Residues atom that interacts with current residue. Atom contains
	// residue info, so we don't need to store it twice
	atom: Atom;

	polymerKind: PolymerKind;
	type: InteractionType;

	// Any additional data
	meta?: any;
}

// Interaction string id for visualization nodes
export const interactionToId: (i: Interaction) => string = (i) => {
	return `${i.atom.name}-${i.residueHash}@${i.polymerKind}:${i.polymerChainIdentifier}`;
};
