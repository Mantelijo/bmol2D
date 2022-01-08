import { ChangeEventHandler, ChangeEvent, useEffect, useContext, useRef } from "react";
import { PDBHandler } from "../lib/PDBHandler";
import { PDBFile, Polymer } from "../lib/types/atoms";
import { context } from "../Store";

// Fetch PDB text for given id (if valid)
const fetchPDBFile = async (id: string): Promise<string> => {
	const response = await fetch(`https://files.rcsb.org/download/${id}.pdb`);
	const pdbText = await response.text();
	return pdbText;
};

export function DataFetcher() {
	const [state, dispatch] = useContext(context);

	const startLoading = () => {
		dispatch({
			type: "isLoading",
			payload: true,
		});
	};
	const stopLoading = () => {
		dispatch({
			type: "isLoading",
			payload: false,
		});
	};
	const updatePDBState = (pdb: PDBFile) => {
		dispatch({
			type: "pdb",
			payload: pdb,
		});
	};
	const updateCurrentPDBId = (id: string) => {
		dispatch({
			type: "currentPDBId",
			payload: id,
		});
	};
	// Update polymers in store, generate visualization data structure
	const updatePolymers = (polymers: Polymer[]) => {
		dispatch({
			type: "polymers",
			payload: polymers,
		});
	};
	const resetState = () => {
		dispatch({
			type: "resetState",
			payload: null,
		});
	};

	// Process fetching and loading PDB file from rcsb
	const loadPDBID = async (id: string) => {
		resetState();
		startLoading();
		const pdb = new PDBHandler().format(await fetchPDBFile(id));
		updatePDBState(pdb);
		updatePolymers(pdb.polymers);
		updateCurrentPDBId(id);
		stopLoading();
	};

	// Fetch PDB file by given id parameter. Must run only once
	useEffect(() => {
		const url = new URLSearchParams(window.location.search);
		const id = url.get("id");
		console.log("ID", id);
		if (id !== null) {
			loadPDBID(id);
		}
	}, []);

	// Updates pbd file information from uploaded file, parses pdb data and performs interaction calculations
	const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event: ChangeEvent) => {
		let f = (event.target as HTMLInputElement).files?.item(0);
		if (f !== null) {
			resetState();
			// Show spinner while loading
			startLoading();

			// Read and parse the file
			console.time("TIME_TO_PARSE_EVERYTHING");
			console.time("TIME_TO_PARSE_PDB");
			const pdb = await new PDBHandler(f as File).readData();
			console.timeEnd("TIME_TO_PARSE_PDB");

			// Update state with parsed values
			updatePDBState(pdb);
			updatePolymers(pdb.polymers);

			// Some fake loading time, so we get to see the spinner :)
			console.timeEnd("TIME_TO_PARSE_EVERYTHING");
			setTimeout(stopLoading, 2000);
		}
	};

	let pdbText: JSX.Element | undefined;
	if (state.polymers.length > 0) {
		pdbText = (
			<div className="mt-5">
				<div className="mb-1">Provided input file</div>
				<textarea
					className="text-sm w-full border h-96 border-blue-100"
					value={state.pdb?.raw}
					readOnly
				/>
			</div>
		);
	}

	const pdbIdRef = useRef<HTMLInputElement>(null);
	const handlePDBIdChange = () => {
		const pdbId = pdbIdRef.current?.value;
		if (pdbId) {
			loadPDBID(pdbId);
		}
	};
	// Update pdbIdRef value whenever pdb id changes
	// Render data fetcher box
	return (
		<div className="p-5 max-h-screen overflow-auto break-words">
			{!state.isLoading && (
				<div>
					{state.error.length > 0 && (
						<div className="mb-4">
							<div className="text-red-700 font-bold text-lg">
								Something went wrong: {state.error}
							</div>
						</div>
					)}
					{state.pdb === undefined && (
						<div className="text-sm text-gray-600 mb-4 bg-red-200 p-2">
							Choose a PDB file which contains DNA/RNA with Proteins
						</div>
					)}
					<div>
						{state.currentPDBId.length > 0 && (
							<div className="mb-4">
								Currently selected PDB ID:
								<b>{state.currentPDBId.toUpperCase()}</b>
							</div>
						)}
						<div className="mb-4">
							<div className="text-normal font-bold text-gray-600 mb-2">
								Enter PDB file ID:
								<div className="text-xs font-normal">
									PDB file should contain <b>DNA/RNA</b> structures
								</div>
							</div>
							<div className="flex flex-row max-w-full">
								<input
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handlePDBIdChange();
										}
									}}
									ref={pdbIdRef}
									placeholder="1ZS4"
									className="border-r-0 outline-none ring-indigo-200 focus:ring-2 transition-all block py-1 px-2 outline-0 border border-indigo-300 rounded rounded-tr-none rounded-br-none"
								/>
								<button
									onClick={handlePDBIdChange}
									className="bg-indigo-400 border-l-0 text-white font-bold text-sm ring-indigo-200 focus:ring-2 hover:bg-indigo-600 transition-all w-[100px]  block rounded rounded-tl-none rounded-bl-none border border-indigo-300"
								>
									GO
								</button>
							</div>
						</div>
						<div className="text-normal font-bold text-gray-600 mb-2">
							Or choose a PDB file to display:
							<div className="text-xs font-normal">
								PDB file should contain <b>DNA/RNA</b> structures
							</div>
						</div>
						<input type="file" onChange={handleFileChange} className="max-w-full" />
					</div>
				</div>
			)}
			{pdbText}
			{state.pdb && (
				<div>
					Polymers from input:
					{state.polymers.map(({ residues, chainIdentifier, kind }, k) => (
						<div className="ml-2" key={k}>
							Chain:{" "}
							<b>
								{chainIdentifier} ({kind})
							</b>
							<div className="ml-2">
								{residues.map((residue, key) => {
									return <span key={key}>{residue.name} &nbsp;</span>;
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
