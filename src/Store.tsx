import React, { createContext, useReducer, ReactElement } from "react";
import { InteractionsFinder } from "./lib/InteractionsFinder";
import { DotBraket } from "./lib/SecondaryStructure";
import { Polymer, Residue } from "./lib/types/atoms";
import { PDBFile } from "./lib/types/atoms";
import { Visualization } from "./lib/types/visualization";

/**
 * Initial State object structure
 */
const initialState: State = {
	polymers: [],
	pdb: undefined,

	isLoading: false,
	isWasmModuleLoading: true,

	simpleStuffy: "",
	hashedNucleicAcidResidues: {},
	viz: { chain1: null, chain2: null },
	currentPDBId: "",
	// selectedResidue: undefined,
	error: "",

	selectedResidueHash: undefined,
	secondaryStructures: [],

	iFinderInstance: undefined,

	getResidue: function (chainIdentifier, hash) {
		if (this.polymers.length === 0) {
			return null;
		}

		const polymer = this.polymers.filter((p) => p.chainIdentifier === chainIdentifier);

		if (polymer.length > 0) {
			const residue = polymer[0].residues.filter((r) => r.hash === hash);
			if (residue.length > 0) {
				return residue[0];
			}
		}
		return null;
	},

	getResidueByHashOnly: function (hash) {
		for (let i = 0; i < this.polymers.length; i++) {
			const p = this.polymers[i];
			for (let j = 0; j < p.residues.length; j++) {
				if (p.residues[j].hash === hash) {
					return p.residues[j];
				}
			}
		}
		return null;
	},

	getPolymer: function (chainIdentifier) {
		if (this.polymers) {
			const ps = this.polymers.filter((p) => p.chainIdentifier === chainIdentifier);
			if (ps.length > 0) {
				return ps[0];
			}
		}
		return null;
	},
};

export type HashedResidue = {
	[key: string]: Residue;
};

// State structure
export interface State {
	polymers: Polymer[];
	pdb: PDBFile | undefined;

	// Determine if any calculation process is currently loading or not
	isLoading: boolean;

	// Initially, wasm module must be set to loading
	isWasmModuleLoading: boolean;

	simpleStuffy: string;

	// This is used for faster lookups of nucleic acid residues. Since
	// nucleic acids are the central parts of visualization, we might need
	// to do many lookups, when searching for interactions.
	hashedNucleicAcidResidues: HashedResidue;

	// Data to be visualized
	viz: Visualization;

	// Currently displayed pdb id or file name
	currentPDBId: string;

	// Currently displayed residue information selectedResidue?: Residue;
	selectedResidueHash?: string;

	// Error text to display
	error: string;

	// Here we store secondary structure information in dot braket
	// notation. This information comes from secondary_structure.py file
	secondaryStructures: DotBraket[];

	iFinderInstance?: InteractionsFinder;

	// Residue, Polymer getters
	getResidue: (chainIdentifier: string, residueHash: string) => Residue | null;
	getResidueByHashOnly: (residueHash: string) => Residue | null;
	getPolymer: (chainIdentifier: string) => Polymer | null;
}

/**
 * Actions structure
 */
export interface Action {
	type: keyof State | "resetState";
	payload: any;
}

const context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {}]);

// Reducer mutates the state
const reducer = (state: State, { type, payload }: Action): State => {
	switch (type) {
		case "resetState":
			return { ...initialState };
		// Default case works when type is equal state property name
		default:
			if (type in state) {
				(state as any)[type] = payload;
			} else {
				throw new Error(`${type} not found in state`);
			}
	}

	// We must return new object, otherwise update won't be triggered
	return { ...state };
};

interface Props {
	children: ReactElement;
}

const StoreComponent = ({ children }: Props) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return <context.Provider value={[state, dispatch]}>{children}</context.Provider>;
};

export { context, StoreComponent };
