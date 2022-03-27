import { Atom, PolymerKind } from "./atoms";

// Defines the distance threshold value for Threshold interaction type
export const THRESHOLD_DISTANCE = 5;

export enum InteractionType {
	// Threshold based interaction. Distance is the only factor
	Threshold = "Distance",

	// Hydrogen bond interactions
	HBond = "H Bond",

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

	// Current residue atom that interacts with target atom
	residueAtom: Atom;

	// Residues atom that interacts with current residue. Atom contains
	// residue info, so we don't need to store it twice
	// This is also referred to as target atom
	atom: Atom;

	polymerKind: PolymerKind;
	type: InteractionType;

	// Distance between residueAtom and atom in angstroms
	distance: number;

	// Any additional data
	meta?: any;
}

// Interaction string id for visualization nodes
export const interactionToId: (i: Interaction) => string = (i) => {
	return `${i.atom.name}-${i.residueHash}@${i.polymerKind}:${i.polymerChainIdentifier}`;
};
