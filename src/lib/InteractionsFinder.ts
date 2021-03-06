import { atomToId, Polymer, PolymerKind, Residue } from "./types/atoms";
import { calculateCenters } from "./AtomsFunctions";
import { Interaction, InteractionType } from "./types/interactions";
import { Visualization } from "./types/visualization";
import { isWatsonCrickPair, WATSON_CRICK_PAIR_CALCULATION_THRESHOLD } from "./NucleicAcids";
import { resToId } from "./types/residues";
import { fillSecondaryStructureInitialCoordinates } from "./SecondaryStructure";

export class InteractionsFinder {
	nucleicAcids: Polymer[] = [];
	proteins: Polymer[] = [];

	public hasValidDNA: boolean = false;
	public hasValidRNA: boolean = false;

	// Residues keyed by their uuids. Populated in prepareObjects. Used
	// for fast access
	public residues: Map<string, Residue> = new Map();

	// This will be used to generate visualization
	visualization: Visualization = { chain1: null, chain2: null };

	constructor(public polymers: Polymer[]) {
		this.prepareObjects();
	}

	// Generates complete list of watson-crick pairs for chain1-chain2.
	// Returned result is very likely to be unordered according to
	// original DNA/RNA sequences
	generateWatsonCrickPairs(
		chain1: Polymer,
		chain2: Polymer,
		isSameMolecule = false,
	): Array<Residue[]> {
		// Chain lengths can differ, so we calculate and diff on each
		// chain pairs. Pairs2 will have chain2 as first chain, so this
		// has to be reordered when generating complete pairs
		let pairs1 = this.calculateWatsonCrickPairs(chain1, chain2);

		// pairs2 has chain2 as main chain, also it should be noted that
		// the chain2 residues most often must be in reverse order as they
		// are 3'->5' and chain1 is 5'->3'
		let pairs2 = this.calculateWatsonCrickPairs(chain2, chain1);
		pairs2.reverse();

		// Result is an array of residue pairs that are unordered. Second
		// chain pairs are double checked for correctness and lone
		// residues are added too as pairs1 will not have any lone
		// residues of chain2
		let completePairs: Array<Residue[]> = pairs1;
		pairs2.forEach((pair) => {
			// pairs2 pairs have chain2 residues first, so we have to use
			// chain1 first
			if (pair.length === 1) {
				completePairs.push(pair);
			} else if (pair.length === 2) {
				// Double check if calculations were done correctly on
				// first chain and such pair from pairs2 exists in pair1
				let pairFoundIn1 = false;
				for (let i = 0; i < pairs1.length; i++) {
					let p1 = pairs1[i];
					if (p1.length === 2) {
						if (p1[0].hash === pair[1].hash && p1[1].hash === pair[0].hash) {
							pairFoundIn1 = true;
							break;
						}
					}
				}

				// Currently we only log this info, but in future
				// something should be done about this, because pair
				// discrepancies should not happen.
				if (!pairFoundIn1) {
					// console.log(
					// 	`watsonCrickPairs: matching pair was not found ${pair[1].polymerChainIdentifier}:${pair[1].sequenceNumber}${pair[1].name}---${pair[0].polymerChainIdentifier}:${pair[0].sequenceNumber}${pair[0].name}`,
					// 	pair,
					// );
				}
			}
		});

		return completePairs;
	}

	// Returns unordered array of residue pairs for all nucleic acids.
	// Each nucleic acid is compared with all other nucleic acids, because
	// for example 5B2R contains DNA-RNA-DNA complex and we want to make
	// sure that everything is calculated correctly.
	watsonCrickPairs(): Array<Residue[]> {
		if (this.nucleicAcids.length <= 0) {
			throw Error("No nucleic acids are present in given PDB structure");
		}

		const allPairs: Residue[][] = [];
		// Each chain should be compared one time with all other available
		// chains except itself.
		for (let i = 0; i < this.nucleicAcids.length; i++) {
			for (let j = i + 1; j < this.nucleicAcids.length; j++) {
				const generatePairs = this.generateWatsonCrickPairs(
					this.nucleicAcids[i],
					this.nucleicAcids[j],
				);
				allPairs.push(...generatePairs);
			}

			// RNA molecules might have secondary structure - here we run
			// generateWatsonCrickPairs on same RNA molecule to check
			// UPDATE: this applies not only for RNA, but also for DNA structures
			const generatePairs = this.generateWatsonCrickPairs(
				this.nucleicAcids[i],
				this.nucleicAcids[i],
			);
			if (generatePairs.length > 0) {
				// console.log("SIMILAR PAIRS", generatePairs);
				allPairs.push(...generatePairs);
			}
		}
		return allPairs;
	}

	/**
	 * Calculates watson crick pairs for DNA/RNA chain1 and chain2 must be DNA/RNA
	 * polymers. Calculations are based on chain1 (chain1 is used as
	 * template strand) and not all chain2
	 * residues might be included. Most often, lone pairs of chain2 won't
	 * be included in the result.
	 *
	 * This also calculates intrastrand pairs for both RNA and DNA when
	 * chain1 and chain2 is the same polymer.
	 */
	calculateWatsonCrickPairs(chain1: Polymer, chain2: Polymer): Array<Residue[]> {
		const pairs: Array<Residue[]> = [];
		chain1.residues.forEach((r1) => {
			let smallestDistance = Infinity;
			let bestR2: Residue | undefined;

			chain2.residues.forEach((r2) => {
				let max = Infinity;
				let r1DistToR2VO = [Infinity];
				let r2DistToR1VO = [Infinity];

				// r1 C2/C4/C6 atoms distance to r2 o,v vectors
				const r1Cs = r1.findAtomsByNames(["C2", "C4", "C6"]);
				if (r1Cs.length == 3) {
					r1DistToR2VO = [
						Math.abs(r1Cs[0].coords.toVec().subtract(r2.o).dot(r2.v)),
						Math.abs(r1Cs[1].coords.toVec().subtract(r2.o).dot(r2.v)),
						Math.abs(r1Cs[2].coords.toVec().subtract(r2.o).dot(r2.v)),
					];
				}
				// r1 C2/C4/C6 atoms distance to r2 o,v vectors
				const r2Cs = r2.findAtomsByNames(["C2", "C4", "C6"]);
				if (r2Cs.length == 3) {
					r2DistToR1VO = [
						Math.abs(r2Cs[0].coords.toVec().subtract(r1.o).dot(r1.v)),
						Math.abs(r2Cs[1].coords.toVec().subtract(r1.o).dot(r1.v)),
						Math.abs(r2Cs[2].coords.toVec().subtract(r1.o).dot(r1.v)),
					];
				}

				max = Math.max(...r2DistToR1VO, ...r1DistToR2VO);

				// Best residue is **another** (not same) residue with
				// smaller than current smallestDistance
				if (max < smallestDistance && r1.hash !== r2.hash) {
					smallestDistance = max;
					bestR2 = r2;
				}
			});

			if (
				bestR2 !== undefined &&
				// Allow tiny bit of random error
				smallestDistance <= WATSON_CRICK_PAIR_CALCULATION_THRESHOLD + Math.random() &&
				isWatsonCrickPair(bestR2, r1) &&
				// It looks like sometimes smallestDistance can be
				// calculated incorrectly if the orientation of two very
				// distant residues is similar. It looks like usually
				// distance between residue centers is around 10-11, if
				// this threshold is exceeded - most likely these two
				// residues can not be pairs. B-DNA Diameter is ~20A and
				// distance between bases (not their centers) is ~3.4A
				r1.center.toVec().distanceTo(bestR2.center.toVec()) < 15
			) {
				// If we are checking for internal watson crick-pairs, set
				// the indexes of pairs.
				if (chain1 === chain2) {
					r1.watsonCrickPairResidueIndex = bestR2.indexInPolymer;
					bestR2.watsonCrickPairResidueIndex = r1.indexInPolymer;
				}

				pairs.push([r1, bestR2]);
				const r2 = bestR2;
				// console.log(
				// 	"Smallest distance: ",
				// 	`${chain1.kind}-${r1.polymerChainIdentifier}:${r1.sequenceNumber}${r1.name}`,
				// 	`${chain2.kind}-${r2.polymerChainIdentifier}:${r2.sequenceNumber}${r2.name}`,
				// 	smallestDistance,
				// 	isWatsonCrickPair(bestR2, r1),
				// );

				// Fill in the
			} else {
				pairs.push([r1]);
				// console.log(
				// 	`No pair for: ${chain1.kind} ${r1.polymerChainIdentifier}:${r1.sequenceNumber}${r1.name}, smallest distance: ${smallestDistance}`,
				// 	bestR2,
				// );
			}
		});
		return pairs;
	}

	// Finds polymers to work with, calculates centers for residues.
	prepareObjects() {
		this.nucleicAcids = this.findNucleicAcids();
		this.proteins = this.findProteins();

		this.nucleicAcids.forEach((polymer) => {
			calculateCenters(polymer);
			this.populateResiduesMap(polymer);
		});
		this.proteins.forEach((polymer) => {
			calculateCenters(polymer);
			this.populateResiduesMap(polymer);
		});
	}

	findProteins(): Polymer[] {
		return this.polymers.filter((p) => {
			return [PolymerKind.Protein].indexOf(p.kind) !== -1;
		});
	}

	findNucleicAcids(): Polymer[] {
		return this.polymers.filter((p) => {
			return [PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind) !== -1;
		});
	}

	populateResiduesMap(polymer: Polymer) {
		polymer.residues.forEach((r) => this.residues.set(r.hash, r));
	}

	findResidueByHash(hash: string): Residue | undefined {
		return this.residues.get(hash);
	}

	// After watsonCrick
	fillInSecondaryStructure() {
		this.nucleicAcids.forEach((nacid) => {
			fillSecondaryStructureInitialCoordinates(nacid);
		});
	}

	/**
	 * Finds all simple interactions based on distance threshold.
	 */
	simpleInteractions() {
		// This is the distance between 2 atoms that is considered an interaction
		const THRESHOLD = 4;

		// Distance between nucleic acid residue and cAlpha
		const THRESHOLD_CALPHA = 10;

		this.nucleicAcids.forEach((nucleicAcid) => {
			nucleicAcid.residues.forEach((nucleicAcidResidue) => {
				this.proteins.forEach((protein) => {
					protein.residues.forEach((proteinResidue) => {
						// Find alpha carbon
						let cAlpha = proteinResidue.findAtomsByNames(["CA"]);
						if (cAlpha.length > 0) {
							const c = cAlpha[0];
							const d = nucleicAcidResidue.center.toVec().distanceTo(c.coords.toVec());
							if (d <= THRESHOLD_CALPHA) {
								// console.log(
								// 	`Possible interaction between: ${resToId(proteinResidue)} and ${resToId(
								// 		nucleicAcidResidue,
								// 	)} (${d})`,
								// );
								// Check each atom of both resiudes
								nucleicAcidResidue.atoms.forEach((nucleicAcidAtom) => {
									proteinResidue.atoms.forEach((proteinAtom) => {
										const distanceBetween2Atoms = nucleicAcidAtom.coords
											.toVec()
											.distanceTo(proteinAtom.coords.toVec());

										// Here we have an interaction
										if (distanceBetween2Atoms <= THRESHOLD) {
											// console.log(
											// 	`	Interaction between: ${atomToId(proteinAtom)} and ${atomToId(
											// 		nucleicAcidAtom,
											// 	)} (${distanceBetween2Atoms})`,
											// );
											const interaction: Interaction = {
												residueAtom: nucleicAcidAtom,
												distance: distanceBetween2Atoms,
												polymerKind: PolymerKind.Protein,
												type: InteractionType.Threshold,
												polymerChainIdentifier: proteinResidue.polymerChainIdentifier,
												residueHash: proteinResidue.hash,
												atom: proteinAtom,
											};
											nucleicAcidResidue.interactions.push(interaction);
										}
									});
								});
							}
						}
					});
				});
			});
		});
	}
}
