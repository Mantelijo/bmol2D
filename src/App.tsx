import React, { useContext, ReactElement } from "react";
import { Viewer } from "./components/Viewer";
import { DataFetcher } from "./components/DataFetcher";
import Spinner from "./components/Spinner";
import { StoreComponent, context } from "./Store";
// import naview from "./naview.wasm";

import Naview from "./wasm/naview.js";

(async () => {
	Naview.onRuntimeInitialized = async (_) => {
		Naview.cwrap("secondaryStruct");
	};
})();

export function App() {
	const state = useContext(context)[0];

	return (
		<div className="flex flex-row w-full">
			{state.isLoading === true && (
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
