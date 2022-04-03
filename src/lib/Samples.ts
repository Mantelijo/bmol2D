import SampleFile from "@/data/samples.json";
import { Action, SamplesAction } from "@/Store";
export interface SampleChains {
	chain_id: string;
	dot_braket: string;
}
export interface Sample {
	pdbId: string;
	chains: SampleChains[];
}

// Load sample dot braket structures to store
export const loadSamples: (dispatch: React.Dispatch<SamplesAction>) => void = (dispatch) => {
	const samplesStructure: Map<string, Sample> = new Map<string, Sample>();
	Object.keys(SampleFile).forEach((pdbId) => {
		samplesStructure.set(pdbId.toUpperCase(), {
			pdbId,
			chains: SampleFile[pdbId as keyof typeof SampleFile] as SampleChains[],
		});
	});
	dispatch({
		type: "sampleStructures",
		payload: samplesStructure,
	});
};
