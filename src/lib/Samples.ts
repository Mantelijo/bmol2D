import SampleFile from "@/data/samples.json";
import { Action } from "@/Store";

export interface Sample {
	pbdId: string;
	chains: {
		chain_id: string;
		dot_braket: string;
	};
	description?: string;
}

// Load sample dot braket structures to store
export const loadSamples: (dispatch: React.Dispatch<Action>) => void = () => {
	console.log(SampleFile);
};
