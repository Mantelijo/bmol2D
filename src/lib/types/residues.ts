import { Residue } from "./atoms";

// Generare residue id
export const resToId: (r: Residue) => string = (r) => {
	return `${r.polymerChainIdentifier}:${r.name}${r.sequenceNumber}`;
};
