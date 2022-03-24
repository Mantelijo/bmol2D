import { calculateSecondaryStructureCoordinates } from "./Wasm";
import * as d3 from "d3";
import { Polymer, PolymerKind } from "./types/atoms";
import { NodeRadius } from "./viz/ForceGraph";

interface params {
	pdbId?: string;
	pdbText?: string;
}

interface ChainDotBraket {
	chain_id: string;
	dot_braket: string;
}

export interface SecondaryStructureData extends ChainDotBraket {
	coords: Array<[number, number]>;
}

// Calculate the secondary structure coordinates and dot-braket
export const getSecondaryStructure: (o: params) => Promise<SecondaryStructureData[]> = async ({
	pdbId,
	pdbText,
}) => {
	const data = (await (
		await fetch(`http://localhost:8001?id=${pdbId}`)
	).json()) as ChainDotBraket[];

	// Attempt to generate coordinates
	const result: SecondaryStructureData[] = [];
	data.forEach((_, key) => {
		const coords = calculateSecondaryStructureCoordinates(data[key].dot_braket);
		console.log(coords);

		result[key] = {
			chain_id: data[key].chain_id,
			dot_braket: data[key].dot_braket,
			coords,
		};
	});

	return result;
};

// Fills in the given secondary structure initial coordinates for RNA
export const fillSecondaryStructureInitialCoordinates: (
	p: Polymer[],
	c: SecondaryStructureData[],
) => Polymer[] = (polymers, coords) => {
	// lastMaxXCoordinate is used for calculating the position for models
	// with multiple RNA structures
	let lastMaxXCoordinate = 0;

	polymers.filter((p) => {
		if (p.kind === PolymerKind.RNA) {
			const coordDataArr = coords.filter((c) => c.chain_id === p.chainIdentifier);
			if (coordDataArr.length === 0) {
				throw new Error("Could not retrieve secondary structure for chain " + p.chainIdentifier);
			}
			const coordData = coordDataArr[0] as SecondaryStructureData;

			// Here we make sure that molecules do not overlap
			let currentMaxX = 0;
			const currentMinX = d3.min(coordData.coords.map((c) => c[0])) as number;
			const plusX = lastMaxXCoordinate != 0 ? lastMaxXCoordinate - currentMinX + NodeRadius * 3 : 0;

			// If we got less coords than there are residues - ignore non
			// available coords
			for (let i = 0; i < Math.min(p.residues.length, coordData.coords.length); i++) {
				// coordinates for this seqno residue is the nth element
				// in coords array. We can not trust the
				// residue.sequenceNumber, since it's taken directly from
				// pdb file and we don't know exactly at which number it
				// will starts, so we assume that we always have residues
				// in sequence, and take residue seq number from iteration
				// console.log(coordData, p.residues.length, i,
				// p.residues[i], p.residues);
				const [x, y]: [number, number] = coordData.coords[i];
				const currentX = x + plusX;
				currentMaxX = Math.max(currentMaxX, currentX);

				p.residues[i].initial_x = currentX;
				p.residues[i].initial_y = y;
			}

			lastMaxXCoordinate = Math.max(lastMaxXCoordinate, currentMaxX);
		}
	});

	return polymers;
};
