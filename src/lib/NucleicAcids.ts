import { Coordinate, DNAResidues, Polymer, PolymerKind, Residue, RNAResidues } from "./types/atoms";
import { Vector } from "./Math";

/**
 * A value that is used to check watson-crick pairs distance
 */
export const WATSON_CRICK_PAIR_CALCULATION_THRESHOLD = 1.42;

/**
 * Calculates and populates vectors v and o which define the plane of
 * single nucleotide.
 */
export const calculateNucleotidePlaneVectors: (p: Polymer) => Polymer = (p) => {
	// Only DNA or RNA have nucleotides
	if ([PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind) != -1) {
		// Dna/Rna residue atoms containing these names will be selected as c2, c4, c6
		// C's with single quote ' are of ribose so we only want specifically these.
		let cNames = ["C2", "C4", "C6"];

		p.residues.forEach((residue) => {
			// Find C2, C4, C6 coordinates
			let cAtoms: Coordinate[] = [];

			const atoms = residue.findAtomsByNames(cNames);
			atoms.forEach((a, i) => {
				cAtoms[i] = a.coords;
			});

			// Calculate plane vector v and point o
			if (cAtoms.length === 3) {
				const c2 = Vector.fromArray(cAtoms[0].toArray());
				const c4 = Vector.fromArray(cAtoms[1].toArray());
				const c6 = Vector.fromArray(cAtoms[2].toArray());
				const v = c4.subtract(c2).cross(c6.subtract(c2)).normalize();

				const o = c2.add(c4).add(c6).divide(3);
				residue.v = v;
				residue.o = o;
			}
		});
	}
	return p;
};

/**
 *  Check if given residues can be treated as watson-crick pairs. Works on
 *  both RNA and DNA residues.
 */
export function isWatsonCrickPair(r1: Residue, r2: Residue): boolean {
	// All possible pairs
	const pairs = [
		[DNAResidues.DA, DNAResidues.DT],
		[DNAResidues.DA, RNAResidues.U],
		[DNAResidues.DT, RNAResidues.A],

		[DNAResidues.DC, DNAResidues.DG],
		[DNAResidues.DC, RNAResidues.G],

		[DNAResidues.DG, DNAResidues.DC],
		[DNAResidues.DG, RNAResidues.C],

		[RNAResidues.C, RNAResidues.G],
		[RNAResidues.A, RNAResidues.U],
	];

	// Check if given residues can be w-c pairs
	for (let i = 0; i < pairs.length; i++) {
		if (
			(r1.name === pairs[i][0] && r2.name === pairs[i][1]) ||
			(r1.name === pairs[i][1] && r2.name === pairs[i][0])
		) {
			return true;
		}
	}

	return false;
}
