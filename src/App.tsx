import React, { useContext, ReactElement, useEffect, useMemo } from "react";
import { Viewer } from "./components/Viewer";
import { DataFetcher } from "./components/DataFetcher";
import Spinner from "./components/Spinner";
import { StoreComponent, context, samplesContext } from "./Store";

// @ts-ignore
import Module from "./wasm/naview.js";
import { Residue } from "./lib/types/atoms";
import { ResidueModal } from "./components/ResidueModal";
import { loadSamples } from "./lib/Samples";
import { PreDefinedSamplesModal } from "./components/PreDefinedSamplesModal";

export function App() {
	const [state, dispatch] = useContext(context);
	const samplesDispatch = useContext(samplesContext)[1];

	// Load some deps
	useEffect(() => {
		loadSamples(samplesDispatch);
		// Wait until wasm module for secondary structure is initialized
		Module.onRuntimeInitialized = async () => {
			dispatch({ type: "isWasmModuleLoading", payload: false });
		};
	}, []);

	const selectedResidue = useMemo<Residue | undefined>(() => {
		if (state.iFinderInstance && state.selectedResidueHash) {
			return state.iFinderInstance.findResidueByHash(state.selectedResidueHash);
		}
	}, [state.selectedResidueHash]);

	return (
		<div className="flex flex-row w-full">
			{!state.isWasmModuleLoading && (
				<>
					{state.isLoading && (
						<div
							className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-full min-h-screen"
							style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
						>
							<Spinner />
						</div>
					)}
					<div className="z-10 w-9/12 h-screen min-h-full bg-indigo-200">
						<Viewer />
					</div>
					<div className="z-10 w-3/12">
						<DataFetcher />
					</div>
					{selectedResidue && <ResidueModal residue={selectedResidue} />}
					<PreDefinedSamplesModal />
				</>
			)}
			{state.isWasmModuleLoading && (
				<div className="flex flex-col align-center justify-center absolute top-0, left-0 w-full h-screen bg-gray-900/50">
					<Spinner text="Application modules are loading" />
				</div>
			)}
		</div>
	);
}

interface Props {
	children: ReactElement;
}

// We want to provide nice loading animation at the top level.
// So this wrapper simply allows App to use context state.
export function AppWrapper({ children }: Props) {
	return <StoreComponent>{children}</StoreComponent>;
}
