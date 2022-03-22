import { State } from "@/Store";
import { Polymer, PolymerKind } from "./types/atoms";

interface params {
	pdbId?: string;
	pdbText?: string;
}

// Response/Calculation structure
export interface SecondaryStructureData {
	coords: Array<[number, number]>;
	chain_id: string;
	dot_braket: string;
}

// Calculate the secondary structure coordinates and dot-braket
export const getSecondaryStructure: (o: params) => Promise<SecondaryStructureData[]> = async ({
	pdbId,
	pdbText,
}) => {
	const data = (await (
		await fetch(`http://localhost:8001?id=${pdbId}`)
	).json()) as SecondaryStructureData[];

	// TODO implement this for pdbText

	return data;
};

// Fills in the given secondary structure initial coordinates for RNA
export const fillSecondaryStructureInitialCoordinates: (
	p: Polymer[],
	c: SecondaryStructureData[],
) => Polymer[] = (polymers, coords) => {
	polymers.filter((p) => {
		if (p.kind === PolymerKind.RNA) {
			const coordDataArr = coords.filter((c) => c.chain_id === p.chainIdentifier);
			if (coordDataArr.length === 0) {
				throw new Error("Could not retrieve secondary structure for chain " + p.chainIdentifier);
			}
			const coordData = coordDataArr[0] as SecondaryStructureData;

			for (let i = 0; i < p.residues.length; i++) {
				// coordinates for this seqno residue is the nth element in
				// coords array. We can not trust the
				// residue.sequenceNumber, since we don't know exactly at
				// which number it will starts, so we assume that we
				// always have residues in sequence, and take residue seq
				// number from iteration
				const [x, y]: [number, number] = coordData.coords[i];
				p.residues[i].initial_x = x;
				p.residues[i].initial_y = y;
			}
		}
	});

	return polymers;
};
