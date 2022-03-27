import clone from "clone";
import {
	Atom,
	PDBFile,
	Polymer,
	PolymerKind,
	polymerKindFromAtom,
	Residue,
	ResidueImplementation,
	Coord,
	Remark350Transformations,
} from "./types/atoms";
import hash from "object-hash";
import { calculateNucleotidePlaneVectors } from "./NucleicAcids";
import { Vector } from "./Math";
import { uuid } from "./Uuid";

export class PDBHandler {
	file?: File;

	constructor(file?: File) {
		if (file !== undefined) {
			this.file = file;
		}
	}

	async readData(): Promise<PDBFile> {
		if (this.file == undefined) {
			throw Error("file not provided");
		}
		const text = await this.file.text();
		return this.format(text);
	}

	format(text: string): PDBFile {
		return {
			originalText: text,
			raw: this.formatText(text),
			polymers: this.formatPolymers(text),
		};
	}

	formatText(text: string): string {
		return text
			.split("\n")
			.map((line, index) => index.toString() + ". " + line)
			.join("\n");
	}

	/**
	 * formatAtoms parses PDB strting into Polymer[] data structure
	 *
	 * PDB File keywords: ATOM - atom information TER - terminates
	 * sequence of previously provided ATOMs
	 *
	 * @param text
	 * @returns
	 */
	formatPolymers(text: string): Polymer[] {
		let result: Polymer[] = [];

		// Helper functions to quickly create objects
		const newPolymer = (): Polymer => {
			return {
				chainIdentifier: "",
				residues: [],
				kind: PolymerKind.Unknown,
			};
		};
		const newResidue = (): Residue => {
			return new ResidueImplementation(currentPolymer.residues.length);
		};
		// Helper to push currentResidue to currentPolymer
		const pushResidue = (): void => {
			// Let's hope these uuid are generated in a unique manner
			currentResidue.hash = uuid();
			currentPolymer.residues.push(currentResidue);
		};

		let currentPolymer = newPolymer();
		let currentResidue = newResidue();

		// Polymer kind determination functionality
		type currentPolymerKind = {
			[key in PolymerKind | number | string]: number;
		};
		// Realistically - there should be only 1 PolymerKind for given
		// polymer, but in case it is not, we can check which kind appears
		// more often than others to determine true PolymerKind.
		const determinePolymerKindAndReset = (
			c?: currentPolymerKind,
		): [currentPolymerKind, PolymerKind] | currentPolymerKind => {
			let obj = {
				[PolymerKind.DNA]: 0,
				[PolymerKind.RNA]: 0,
				[PolymerKind.Protein]: 0,
			};
			if (c === undefined) {
				return obj;
			}
			return [
				obj, // reset obj
				// Get the PolymerKind that has the largest number of
				// occurrences
				Object.keys(c).reduce((a: any, b: any) => (c[a] > c[b] ? a : b)) as unknown as PolymerKind,
			];
		};
		let currentPolymerKindCounter = determinePolymerKindAndReset() as currentPolymerKind;

		// REMARK 350 transformations information
		const transformations: Remark350Transformations[] = [];
		// There might be multiple different groups of transformations for
		// different chains, so we keep track of current one Note: setting
		// this to empty value so TS does not complain.
		let currentTransformation: Remark350Transformations = {
			chains: [],
			rotations: [],
			translations: [Vector.infinity()],
		};
		// Indicates that we are currently processing rotation/translation
		// lines preceded by REMARK 350: APPLY THE FOLLOWING <...>
		let remark350TransformLines = false;
		// Helper
		const resetTransformation = () => {
			currentTransformation = {
				chains: [],
				rotations: [],
				translations: [Vector.infinity()],
			};
		};

		// NMR ensembles usually have models. @see
		// https://www.wwpdb.org/documentation/file-format-content/format33/sect9.html#MODEL
		let hasModels = false;
		let numberOfModels = 0;
		// If file contains models, we only want to take the first model.
		let currentModel = 0;

		// Here we will process the pdb text line by line
		const lines = text.split("\n");
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			// Exclude non first model for NMR ensembles
			if (hasModels && currentModel > 1) {
				continue;
			}

			// Check if current pdb file has models
			if (line.startsWith("NUMMDL")) {
				hasModels = true;
				numberOfModels = parseInt(line.slice(10, 14).trim());
				console.log("NUMBER OF MODELS:", numberOfModels);
			}

			// Check current model. ENDMDL does not really matter here
			if (line.startsWith("MODEL")) {
				currentModel = parseInt(line.slice(11, 14).trim());
			}

			// Parse ATOM lines
			if (line.startsWith("ATOM") || line.startsWith("HETATM")) {
				// https://www.cgl.ucsf.edu/chimera/docs/UsersGuide/tutorials/pdbintro.html
				const x = parseFloat(line.slice(30, 38).trim());
				const y = parseFloat(line.slice(38, 46).trim());
				const z = parseFloat(line.slice(46, 54).trim());

				const name = line.slice(12, 16).trim();
				const residueName = line.slice(17, 20).trim();
				const element = line.slice(76, 78).trim();
				const residueSequenceNumber = parseInt(line.slice(22, 26).trim());

				// Chain identifier for current polymer is 1 letter
				const chainIdentifier = line.slice(21, 22);
				currentPolymer.chainIdentifier = chainIdentifier;

				// Construct new atom entry
				const atom: Atom = {
					coords: new Coord(x, y, z),
					name,
					element,
					residueName,
					residueSequenceNumber,
				};

				// Increment probable polymer kind from residue
				currentPolymerKindCounter[polymerKindFromAtom(atom)]++;

				// Set residue sequence number and residue name for first
				// time
				if (currentResidue.sequenceNumber === -1) {
					currentResidue.name = atom.residueName;
					currentResidue.sequenceNumber = residueSequenceNumber;
					currentResidue.polymerChainIdentifier = chainIdentifier;
				}

				// If residue sequence number does not match with current
				// atom's - add residue to polymer and reset
				// currentResidue to a new one
				if (residueSequenceNumber !== currentResidue.sequenceNumber) {
					pushResidue();
					currentResidue = newResidue();
					currentResidue.name = atom.residueName;
					currentResidue.sequenceNumber = residueSequenceNumber;
					currentResidue.polymerChainIdentifier = chainIdentifier;
				}

				currentResidue.atoms.push(atom);
			}
			// TER indicates the end of current polymer (chain of
			// residues). Or if we are on the last line there might be no
			// TER
			if (line.startsWith("TER") || i === lines.length - 1) {
				// Don't forget to push residue
				pushResidue();

				// Get polymer kind and reset counter
				const [c, kind] = determinePolymerKindAndReset(currentPolymerKindCounter) as [
					currentPolymerKind,
					PolymerKind,
				];
				currentPolymerKindCounter = c;
				currentPolymer.kind = kind;

				// This must be calculated beforehand. As these values
				// will be used in watson-crick pairs calculations later.
				currentPolymer = calculateNucleotidePlaneVectors(currentPolymer);

				// Save polymer
				result.push(currentPolymer);

				// Reset current polymer and residue
				currentPolymer = newPolymer();
				currentResidue = newResidue();
			}

			// Asymetric unit transformations & Biological assemblies
			if (line.startsWith("REMARK 350")) {
				remark350TransformLines = true;

				// Collect information which chains should be transformed
				const transformPrefixes = [
					"REMARK 350 APPLY THE FOLLOWING TO CHAINS: ", // First line - we should reset currentTransform when this occurs
					"REMARK 350                    AND CHAINS:",
				];
				transformPrefixes.forEach((transformPrefix, i) => {
					if (line.startsWith(transformPrefix)) {
						let chains = line
							.trim()
							.slice(transformPrefix.length - 1, line.length)
							.toString()
							.replaceAll(" ", "")
							.split(",");

						// Reset currentTransformation
						if (i === 0) {
							resetTransformation();

							// Push to transformations if there was
							// anything previously
							if (currentTransformation.chains.length > 0) {
								transformations.push(currentTransformation);
							}
						}

						// Must be after the 0 index reset
						if (chains.length > 0) {
							currentTransformation.chains.push(...chains);
						}
					}
				});

				// Collect transformation matrices (array of 3x3 matrices)
				if (line.startsWith("REMARK 350   BIOMT")) {
					let woPrefix = line.replace("REMARK 350   BIOMT", "");
					let matchArray = woPrefix.match(
						new RegExp(
							// 1   1  1.000000  0.000000  0.000000 0.00000
							/(\d{1})\s*(\d{1})\s*([+-]?[0-9]*[.]?[0-9]+)\s*([+-]?[0-9]*[.]?[0-9]+)\s*([+-]?[0-9]*[.]?[0-9]+)\s*([+-]?[0-9]*[.]?[0-9]+)/,
						),
					);
					if (matchArray != null && matchArray.length === 6 + 1) {
						matchArray = matchArray.slice(1);
						let nthTransformation = parseInt(matchArray[1]) - 1;
						let nthRow = parseInt(matchArray[0]) - 1;
						let rotationRow = [
							parseFloat(matchArray[2]),
							parseFloat(matchArray[3]),
							parseFloat(matchArray[4]),
						];
						let translation = parseFloat(matchArray[5]);

						// Set translations
						if (typeof currentTransformation.translations[nthTransformation] === "undefined") {
							currentTransformation.translations[nthTransformation] = Vector.infinity();
						}

						currentTransformation.translations[nthTransformation].setIndex(nthRow, translation);

						// Set rotations
						if (!Array.isArray(currentTransformation.rotations[nthTransformation])) {
							currentTransformation.rotations[nthTransformation] = [];
						}
						currentTransformation.rotations[nthTransformation][nthRow] = rotationRow;
					}
				}
			} else {
				// Push transformations to array
				if (remark350TransformLines) {
					transformations.push(currentTransformation);
					resetTransformation();
				}
				// Cleanup in-memory values
				remark350TransformLines = false;
			}
		}

		// Generate biological assembly
		transformations.forEach((transformation) => {
			const chainsToTransform = result.filter((p) => {
				return transformation.chains.indexOf(p.chainIdentifier) !== -1;
			});

			// Always skip identity matrix which is first rotation element
			const rs = transformation.rotations.slice(1);
			const ts = transformation.translations.slice(1);

			// Perform transformations and clone objects
			rs.forEach((rotation, rotationIndex) => {
				chainsToTransform.forEach((chain) => {
					let chainClone = clone(chain, { includeNonEnumerable: true });
					chainClone.chainIdentifier = chainClone.chainIdentifier + (rotationIndex + 1).toString();
					chainClone.generatedFromTransform = true;
					chainClone.residues.forEach((newResidue, rindex) => {
						newResidue.polymerChainIdentifier = chainClone.chainIdentifier;
						newResidue.atoms.forEach((newAtom, aindex) => {
							let oldCoords = newAtom.coords.toVec();
							let newCoords = Vector.infinity();

							// Matrix and vector multiplication for
							// rotation
							console.log("Coorinates before:", oldCoords);
							newCoords.x =
								oldCoords.x * rotation[0][0] +
								oldCoords.y * rotation[0][1] +
								oldCoords.z * rotation[0][2];
							newCoords.y =
								oldCoords.x * rotation[1][0] +
								oldCoords.y * rotation[1][1] +
								oldCoords.z * rotation[1][2];
							newCoords.z =
								oldCoords.x * rotation[2][0] +
								oldCoords.y * rotation[2][1] +
								oldCoords.z * rotation[2][2];

							// TODO translations Each rotation must have a
							// translation
							const t = ts[rotationIndex];
							newCoords = newCoords.add(t);

							console.log("Coords after:", newCoords);
							console.log("Distance between atoms: ", newCoords.distanceTo(oldCoords));

							// Update coords
							newAtom.coords = newCoords.toCoord();
							newResidue.atoms[aindex] = newAtom;
						});

						newResidue.hash = uuid();
						chainClone.residues[rindex] = newResidue;
					});

					// Since we have new coordinates for transformed
					// chains, plane vectors must be recalculated
					chainClone = calculateNucleotidePlaneVectors(chainClone);
					result.push(chainClone);
				});
			});
		});

		console.log("Transformations:", transformations);
		console.log("Result after translation", result);

		return result;
	}
}
