import naview from "../wasm/naview.wasm?url";
import Module from "../wasm/naview.js";

// Example of 3q1q B chain
const dotBraketExample =
	"((((((((((..(((((..((((((((((....))))).))))).............((((......((((((((((.....)))))(((((....)))))((...(((((.............(((((((((((....)))))))))..)).......((((((.......))))))..(((((((....)))))))....)))..)))))))))))))...((((.....((((...(((........)))....)))).....))))......((((((((....))))))))...........))))).....................))))))))))....";

// Based on provided dotBraket string in dot-braket format, attempts to
// calculate secondary structure coordinates for RNA/DNA
export const calculateSecondaryStructureCoordinates: (d: string) => Array<[number, number]> = (
	dotBraket: string,
) => {
	const len = dotBraket.length;
	const secondaryStructure = Module.cwrap("secondaryStructure", "number", ["string"]);

	// This will be the pointer for coordinates float array. Note that
	// the array must be of size 2*len, otherwise something went wrong.
	let ptrLocation = -1;
	try {
		ptrLocation = secondaryStructure(dotBraket) as number;
	} catch (e) {
		throw new Error(`Error encountered while processing secondary structure: ${e}`);
	}

	if (ptrLocation != -1) {
		const floatSize = 4;
		const secondaryStructureCoords: Array<[number, number]> = [];
		let i = 0;
		while (i < len * 2) {
			// @see /wasm/vienna-rna/main.c:secondaryStructure, struct
			// layout is float(x), float(y)
			const x = Module.getValue(ptrLocation + i * floatSize, "float");
			i++;
			const y = Module.getValue(ptrLocation + i * floatSize, "float");
			i++;
			const tuple: [number, number] = [x, y];
			secondaryStructureCoords.push(tuple);
		}
		return secondaryStructureCoords;
	}
	return [];
};
