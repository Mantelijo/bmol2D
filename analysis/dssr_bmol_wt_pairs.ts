import { InteractionsFinder } from "./../src/lib/InteractionsFinder";
import { PDBHandler } from "./../src/lib/PDBHandler";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import fetch from "node-fetch";
import { pairs } from "d3";

// @ts-ignore
global.window = {};

const dataFilePath = path.join(__dirname, "data.csv");

const pdbList = path.join(__dirname, "../wasm/pdbids_list");
const pdbIDs = fs.readFileSync(pdbList);
const pdbIDSText = pdbIDs.toString();
const pdbFilesDir = path.join(__dirname, "pdb");
const dssrFilesDir = path.join(__dirname, "dssr_pairs");

console.log("pdb files dir:", pdbFilesDir);

pdbIDSText.split("\n").forEach((line) => {
	processLine(line);
});
// processLine(pdbIDSText.split("\n")[2]);

interface dssrPair {
	nt1: string;
	nt2: string;
}

// processLine(pdbIDSText.split("\n")[2]);

async function processLine(pdbID) {
	const dssrCmd = (file: string) =>
		`dssr --input=${file} --json | jq '[.pairs[] | select(.name=="WC") | {nt1, nt2}]'`;

	// Check if we have pdb file or download it
	if (pdbID.match(/[0-9][a-zA-Z_0-9]{3}/)) {
		let pdbFileContent = "";
		const file = path.join(pdbFilesDir, pdbID + ".pdb");
		if (fs.statSync(file, { throwIfNoEntry: false })) {
			const buf = fs.readFileSync(file);
			pdbFileContent = buf.toString();
		} else {
			// Download the file and store it
			const url = `https://files.rcsb.org/download/${pdbID.toUpperCase()}.pdb`;
			const resp = await fetch(url);
			if (resp.status === 200) {
				pdbFileContent = await resp.text();
				// Save pdb id
				fs.writeFileSync(file, pdbFileContent);
			}
		}

		if (pdbFileContent.length === 0) {
			console.log(`PDB ID: ${pdbID} not found`);
			return;
		}
		console.log(`Processing PDB ID: ${pdbID}`);
		console.log("pdb file", file);

		// dssr pairs
		const dssrPairsFile = path.join(dssrFilesDir, pdbID + ".json");
		let dssrPairs: dssrPair[] = [];
		if (fs.statSync(dssrPairsFile, { throwIfNoEntry: false })) {
			const buf = fs.readFileSync(dssrPairsFile);
			dssrPairs = JSON.parse(buf.toString());
		} else {
			let out = "";
			try {
				out = child_process.execSync(dssrCmd(file)).toString();
			} catch (err) {
				console.log("Error while processing ", pdbID, err);
			}
			dssrPairs = JSON.parse(out);
			fs.writeFileSync(dssrPairsFile, out);
		}

		// let ddsrPairs = "";
		// const dssrFile = path.join(dssrFilesDir, pdbID + ".json");
		// if (fs.statSync(dssrFile, { throwIfNoEntry: false })) {
		// }

		// Generate bmol2d pairs

		let BmolPairs: dssrPair[] = [];

		const bmolPairsDir = path.join(__dirname, "bmol_pairs");
		const bmolPairFile = path.join(bmolPairsDir, pdbID + ".json");
		if (fs.statSync(bmolPairFile, { throwIfNoEntry: false })) {
			BmolPairs = JSON.parse(fs.readFileSync(bmolPairFile).toString());
		} else {
			const polymers = new PDBHandler().formatPolymers(pdbFileContent);
			console.log(polymers);
			const iFinder = new InteractionsFinder(polymers);
			const bmolpairs = iFinder.watsonCrickPairs();
			// Make sure to push only 1 time, since bmol returns the same
			// pair 2 times
			const pushed = new Set<string>();
			bmolpairs.forEach((pair) => {
				if (pair.length === 2) {
					const [nt1, nt2] = [
						`${pair[0].polymerChainIdentifier}.${pair[0].name}${pair[0].sequenceNumber}`,
						`${pair[1].polymerChainIdentifier}.${pair[1].name}${pair[1].sequenceNumber}`,
					];
					const pairArrString = nt1 + nt2;
					const pairArrString2 = nt2 + nt1;
					if (!pushed.has(pairArrString)) {
						BmolPairs.push({ nt1, nt2 });
						pushed.add(pairArrString);
						pushed.add(pairArrString2);
					}
				}
			});
			fs.writeFileSync(bmolPairFile, JSON.stringify(BmolPairs, null, 2));
		}

		// Analysis between dssr and bmol pairs
		let pairsMatched = 0;
		const pairsTotalDSSR = dssrPairs.length;
		const pairsTotalBMOL = BmolPairs.length;
		BmolPairs.forEach(({ nt1, nt2 }) => {
			dssrPairs.forEach(({ nt1: Dnt1, nt2: Dnt2 }) => {
				if ((nt1 === Dnt1 && nt2 === Dnt2) || (nt2 === Dnt1 && nt1 === Dnt2)) {
					pairsMatched++;
				}
			});
		});

		fs.appendFileSync(
			dataFilePath,
			`${pdbID}, ${pairsMatched}, ${pairsTotalBMOL}, ${pairsTotalDSSR} \n`,
		);
		console.log("Processed", pdbID);

		// console.log(dssrPairs, BmolPairs, pairsMatched, pairsTotalDSSR, pairsTotalBMOL);
	}
}
