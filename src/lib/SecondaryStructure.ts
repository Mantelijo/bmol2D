// import {
// 	calculateSecondaryStructureCoordinates,
// 	calculateSecondaryStructureCoordinatesFromDotBraket,
// } from "./Wasm";
import * as d3 from "d3";
import { PDBFile, Polymer, PolymerKind } from "./types/atoms";
import { NodeRadius } from "./viz/ForceGraph";

export interface DotBraket {
	chain_id: string;
	dot_braket: string;
}

interface params {
	pdbId?: string;
	pdbText?: string;
}

export interface SecondaryStructureData {
	coords: Array<[number, number]>;
	chain_id: string;
}

// Fetches dot braket notation for RNA (if available) in given PDB file
export const fetchDotBraket: (f: PDBFile) => Promise<DotBraket[]> = async (f: PDBFile) => {
	// @ts-ignore
	const url = import.meta.env.VITE_SECONDARY_STRUCTURE_URL;
	const response = await fetch(url, {
		body: f.originalText,
		mode: "cors",
		method: "POST",
	});
	return response.json();
};

// Calculates pair table
export const calculatePairTable: (p: Polymer) => number[] = (p) => {
	const pairTable: number[] = [];
	if ([PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind) != -1) {
		p.residues.forEach((r) => {
			const i = r.indexInPolymer;
			const j = r.watsonCrickPairResidueIndex;
			// vrna_pairtable starts with leng
			pairTable[i] = j + 1;
			// @see
			// https://github.com/ViennaRNA/forgi/blob/v1.0/forgi/utilities/stuff.py#L110
			// switch (true) { case j === -1: str += "."; break; case i >
			// j: str += ")"; break; case i < j: str += "("; break;
			// }
		});
	}

	// Insert length at 0th index
	pairTable.splice(0, 0, pairTable.length);
	return pairTable;
};

// Calculate the secondary structure coordinates and dot-braket
export const getSecondaryStructure: (p: Polymer) => SecondaryStructureData | undefined = (p) => {
	// const data = (await ( await
	//  fetch(`http://localhost:8001?id=${pdbId}`) ).json()) as
	//  ChainDotBraket[];

	// Attempt to generate coordinates
	if (p.dotBraket && p.dotBraket.length > 0) {
		// const coords = calculateSecondaryStructureCoordinatesFromDotBraket(p.dotBraket);
		const coords: [number, number][] = [];

		return {
			chain_id: p.chainIdentifier,
			coords,
		};
	}
	return undefined;
};

// lastMaxXCoordinate is used for calculating the position for models
// with multiple RNA structures
// Should be reset for new structures
export let lastMaxXCoordinate = 0;
export const resetLastMaxX = () => (lastMaxXCoordinate = 0);

// Fills in the given secondary structure initial coordinates for RNA (if
// dot braket string is available)
export const fillSecondaryStructureInitialCoordinates: (p: Polymer) => void = (p) => {
	const coordData = getSecondaryStructure(p);
	if (!coordData) {
		// FOR DNA, attempt to fill double-helix coordinates
		if (p.kind === PolymerKind.DNA) {
			DNAChainSecondaryStructureCoordinates(p);
		}
		return;
	}

	if ([PolymerKind.RNA, PolymerKind.DNA].indexOf(p.kind) != -1) {
		// Here we make sure that molecules do not overlap
		let currentMaxX = 0;
		const currentMinX = d3.min(coordData.coords.map((c) => c[0])) as number;
		const plusX = lastMaxXCoordinate != 0 ? lastMaxXCoordinate - currentMinX + NodeRadius * 3 : 0;

		// If we got less coords than there are residues - ignore non
		// available coords
		for (let i = 0; i < Math.min(p.residues.length, coordData.coords.length); i++) {
			// coordinates for this seqno residue is the nth element in
			// coords array. We can not trust the residue.sequenceNumber,
			// since it's taken directly from pdb file and we don't know
			// exactly at which number it will starts, so we assume that
			// we always have residues in sequence, and take residue seq
			// number from iteration console.log(coordData,
			// p.residues.length, i, p.residues[i], p.residues);
			const [x, y]: [number, number] = coordData.coords[i];
			const currentX = x + plusX;
			currentMaxX = Math.max(currentMaxX, currentX);

			p.residues[i].initial_x = currentX;
			p.residues[i].initial_y = y;
		}

		lastMaxXCoordinate = Math.max(lastMaxXCoordinate, currentMaxX);
	}
};

export const DNAChainSecondaryStructureCoordinates: (p: Polymer) => void = (p) => {
	// const UNIT_DISTANCE = 20;
	// for (let i = 0; i < p.residues.length; i++) {
	// 	// If coordinates info was already set for this residue - don't
	// 	// recalculate it, as it was set from pair chain
	// 	if (p.residues[i].initial_x !== undefined) {
	// 		continue;
	// 	}
	// 	p.residues[i].initial_x = 0;
	// 	p.residues[i].initial_y = UNIT_DISTANCE * p.residues[i].indexInPolymer;
	// 	if (p.residues[i].dnaPairResidue !== undefined) {
	// 		p.residues[i].dnaPairResidue.initial_x = UNIT_DISTANCE;
	// 		p.residues[i].dnaPairResidue.initial_y = UNIT_DISTANCE * p.residues[i].indexInPolymer;
	// 	}
	// }
};
