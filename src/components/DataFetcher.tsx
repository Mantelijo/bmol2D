import { Sample } from "@/lib/Samples";
import { DotBraket, fetchDotBraket, resetLastMaxX } from "@/lib/SecondaryStructure";
import React, {
	ChangeEventHandler,
	ChangeEvent,
	useEffect,
	useContext,
	useRef,
	useMemo,
	useState,
} from "react";
import { PDBHandler } from "../lib/PDBHandler";
import { PDBFile, Polymer, PolymerKind } from "../lib/types/atoms";
import { context, samplesContext } from "../Store";
import GithubIcon from "@/github.svg?url";
import { Switch } from "@headlessui/react";

// Fetch PDB text for given id (if valid)
const fetchPDBFile = async (id: string): Promise<string> => {
	const response = await fetch(`https://files.rcsb.org/download/${id}.pdb`);
	const pdbText = await response.text();
	return pdbText;
};

export function DataFetcher() {
	const [state, dispatch] = useContext(context);
	const [samplesState, samplesDispatch] = useContext(samplesContext);

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
		updateCurrentPDBId(id);
	};

	// Fetch PDB file by given id parameter. Must run only once
	useEffect(() => {
		const url = new URLSearchParams(window.location.search);
		const id = url.get("id");
		if (id !== null) {
			// For id parameters, let's try to check if given pdb is
			// available in samples in order to immediately provide
			// secondary structures
			const pdbID = id.toUpperCase();
			if (samplesState.sampleStructures.get(pdbID)) {
				samplesDispatch({
					type: "currentlySelectedSamplePDBID",
					payload: pdbID,
				});
			} else {
				loadPDBID(pdbID);
			}
		}
	}, []);

	// Updates pbd file information from uploaded file, parses pdb data
	// and performs interaction calculations
	const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event: ChangeEvent) => {
		const f = (event.target as HTMLInputElement).files?.item(0) as File;
		if (f !== null) {
			resetState();
			// Show spinner while loading
			startLoading();

			// Read and parse the file
			console.time("TIME_TO_PARSE_EVERYTHING");
			console.time("TIME_TO_PARSE_PDB");
			const pdb = await new PDBHandler(f).readData();
			console.timeEnd("TIME_TO_PARSE_PDB");

			// Update state with parsed values
			updatePDBState(pdb);
			updateCurrentPDBId(f.name);

			console.timeEnd("TIME_TO_PARSE_EVERYTHING");
		}
	};

	let pdbText: JSX.Element | undefined;
	if (state.polymers.length > 0) {
		pdbText = (
			<div className="mt-5">
				<div className="mb-1">Provided input file</div>
				<textarea
					className="w-full text-sm border border-blue-100 h-96"
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
			loadPDBID(pdbId.toString().trim());
		}
	};

	// Fetch the dot braket information and update the polymers for
	// freshly added pdb file. This effect should run on every pdb id/file
	// change
	useEffect(() => {
		resetLastMaxX();
		(async () => {
			if (state.pdb) {
				let dotBraket: undefined | DotBraket[];
				try {
					// If we are currently viewing a sample - grab it's
					// dot braket from samplesState
					if (samplesState.currentlySelectedSamplePDBID) {
						const sample = samplesState.sampleStructures.get(
							samplesState.currentlySelectedSamplePDBID,
						) as Sample;
						dotBraket = sample.chains;
					} else {
						dotBraket = await fetchDotBraket(state.pdb);
					}
				} catch (e) {
					dispatch({
						type: "error",
						payload: e,
					});
				}

				if (dotBraket) {
					dispatch({
						payload: dotBraket,
						type: "secondaryStructures",
					});

					// Fill in the dot braket strings
					state.pdb.polymers.forEach((p) => {
						dotBraket?.forEach((d) => {
							if (d.chain_id === p.chainIdentifier) {
								p.dotBraket = d.dot_braket;
							}
						});
					});
				}

				updatePolymers(state.pdb.polymers);
				stopLoading();

				// Make sure we clean up sample information so later
				// request don't take old information from
				// currentlySelectedSamplePDBID
				samplesDispatch({
					type: "currentlySelectedSamplePDBID",
					payload: undefined,
				});
			}
		})();
	}, [state.pdb]);

	// Start sample loading process
	useEffect(() => {
		if (samplesState.currentlySelectedSamplePDBID) {
			loadPDBID(samplesState.currentlySelectedSamplePDBID);
		}
	}, [samplesState.currentlySelectedSamplePDBID]);

	// Check if currently added polymers contain dot-braket string
	const hasDotBraket = useMemo<boolean>(() => {
		for (let i = 0; i < state.polymers.length; i++) {
			const p = state.polymers[i];
			if ([PolymerKind.RNA, PolymerKind.DNA].indexOf(p.kind) !== -1) {
				if (!p.dotBraket) {
					return false;
				}
			}
		}
		return true;
	}, [state.polymers]);

	const showManualDotBraketModal = () => {
		dispatch({
			type: "showManualDotBraketModal",
			payload: true,
		});
	};

	// Toggle visibility of AABlock
	const [enabled, setEnabled] = useState(false);
	const switchBtn = (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={`${
				enabled ? "bg-blue-600" : "bg-gray-200"
			} relative inline-flex items-center h-6 rounded-full w-11`}
		>
			<span className="sr-only">Toggle visibility of amino acid blocks</span>
			<span
				className={`${
					enabled ? "translate-x-6" : "translate-x-1"
				} inline-block w-4 h-4 transform bg-white rounded-full`}
			/>
		</Switch>
	);
	// Weird fix for making showAABlocks value work as useFfect dep in
	// Viewer.tsx
	useEffect(() => setEnabled(true), []);
	useEffect(() => {
		dispatch({
			type: "showAABlocks",
			payload: enabled,
		});
	}, [enabled]);

	// Update pdbIdRef value whenever pdb id changes Render data fetcher
	// box
	return (
		<div className="max-h-screen p-5 overflow-auto break-words">
			<div className="flex flex-row items-center justify-between pb-5">
				<div className="text-2xl font-bold text-indigo-500">Bmol2D</div>
				<a href="https://github.com/Mantelijo/bmol2D" target="_blank">
					<img src={GithubIcon} style={{ width: "32px" }} />
				</a>
			</div>

			{!state.isLoading && (
				<div>
					{state.error.length > 0 && (
						<div className="mb-4">
							<div className="text-lg font-bold text-red-700">
								Something went wrong: {state.error}
							</div>
						</div>
					)}
					{state.pdb === undefined && (
						<div className="p-2 mb-4 text-sm text-gray-600 bg-red-200">
							Choose a PDB file which contains DNA/RNA with Proteins
						</div>
					)}
					<div className="mb-4">
						<div className="mb-2 font-bold text-gray-600 text-normal">
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
								className="block px-2 py-1 transition-all border border-r-0 border-indigo-300 rounded rounded-tr-none rounded-br-none outline-none ring-indigo-200 focus:ring-2 outline-0"
							/>
							<button
								onClick={handlePDBIdChange}
								className="bg-indigo-400 border-l-0 text-white font-bold text-sm ring-indigo-200 focus:ring-2 hover:bg-indigo-600 transition-all w-[100px]  block rounded rounded-tl-none rounded-bl-none border border-indigo-300"
							>
								GO
							</button>
						</div>
					</div>
					<div className="mb-2 font-bold text-gray-600 text-normal">
						Or choose a PDB id/file/sample to display:
						<div className="text-xs font-normal">
							PDB file should contain <b>DNA/RNA</b> structures
						</div>
					</div>
					<input type="file" onChange={handleFileChange} className="max-w-full" />
					<div className="flex flex-row gap-1 mt-6 font-bold">
						<div className="text-gray-600 text-normal">Or choose</div>
						<div
							className="text-indigo-600 cursor-pointer text-normal hover:underline hover:text-indigo-800"
							onClick={() =>
								samplesDispatch({
									type: "showSamplesModal",
									payload: true,
								})
							}
						>
							one of pre-defined samples
						</div>
					</div>
					<div className="mb-8 text-xs font-normal">
						Which will also contain secondary structures, if you cannot run secondary structure
						generator script.
					</div>

					{/* Selected PDB file info below */}
					{state.currentPDBId.length > 0 && (
						<div className="mb-4">
							<div className="mb-4 text-xl font-bold text-primary-700">
								Currently selected PDB ID:
								<b>{state.currentPDBId.toUpperCase()}</b>
							</div>
							<div className="flex flex-row items-center justify-start gap-2">
								<div>{switchBtn}</div>
								<div>Toggle visibility of amino acid interaction nodes</div>
							</div>
						</div>
					)}
					{hasDotBraket === false && (
						<div className="p-2 mb-4 text-sm text-gray-600 bg-red-200">
							Dot-braket strings are not available for all chains in current structure. Not all
							secondary structures will be displayed. You can manually add dot-braket strings{" "}
							<span
								className="font-bold cursor-pointer hover:underline"
								onClick={showManualDotBraketModal}
							>
								here
							</span>
						</div>
					)}
					{state.pdb !== undefined && hasDotBraket === true && (
						<div className="p-2 mb-4 text-sm text-gray-600 bg-green-200">
							Edit dot-braket secondary structure strings{" "}
							<span
								className="font-bold cursor-pointer hover:underline"
								onClick={showManualDotBraketModal}
							>
								here
							</span>
						</div>
					)}
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
