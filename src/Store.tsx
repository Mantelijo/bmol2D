import React, { createContext, useReducer, ReactElement } from "react";
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
	simpleStuffy: "",
	hashedNucleicAcidResidues: {},
	viz: { chain1: null, chain2: null },
	currentPDBId: "",
	selectedResidue: undefined,
	error: "",
};

export type HashedResidue = {
	[key: string]: Residue;
};

// State structure
export interface State {
	polymers: Polymer[];
	pdb: PDBFile | undefined;

	// Determine if process is currently loading or not
	isLoading: boolean;

	simpleStuffy: string;

	// This is used for faster lookups of nucleic acid residues.
	// Since nucleic acids are the central parts of visualization,
	// we might need to do many lookups, when searching for interactions.
	hashedNucleicAcidResidues: HashedResidue;

	// Data to be visualized
	viz: Visualization;

	// Currently displayed pdb id
	currentPDBId: string;

	// Currently displayed residue information
	selectedResidue?: Residue;

	// Error text to display
	error: string;
}

/**
 * Actions structure
 */
export interface Action {
	type: keyof State | "resetState";
	payload: any;
}

const context = createContext<[State, React.Dispatch<Action>]>([
	initialState,
	() => {},
]);

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
	return (
		<context.Provider value={[state, dispatch]}>{children}</context.Provider>
	);
};

export { context, StoreComponent };
