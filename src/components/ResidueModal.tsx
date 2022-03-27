import { Residue } from "@/lib/types/atoms";
import React, { useContext, MouseEvent, useMemo } from "react";
import { context } from "@/Store";

interface props {
	residue: Residue;
}
export const ResidueModal = ({ residue }: props) => {
	const [state, dispatch] = useContext(context);

	const close = (event: MouseEvent) => {
		dispatch({
			type: "selectedResidueHash",
			payload: undefined,
		});
	};

	const intramolecularPair = useMemo<undefined | Residue>(() => {
		let i = residue.watsonCrickPairResidueIndex;
		if (i === 0) {
			return;
		}
	}, []);

	return (
		<div>
			<div className="fixed top-0 left-0 z-[999]">
				<div
					className="absolute top-0 left-0 z-10 w-screen h-screen bg-gray-800/50"
					onClick={close}
				></div>
				<div className="absolute z-[1000] w-screen flex h-screen justify-center items-center">
					<div className="p-12 bg-white rounded-xl max-w-7xl max-h-[80%] overflow-auto relative shadow-xl border-gray-100 border">
						<div
							className="absolute text-2xl font-bold text-gray-400 cursor-pointer hover:text-gray-800 right-4 top-4"
							onClick={close}
						>
							&#10005;
						</div>
						<div className="flex flex-col items-start justify-center gap-2">
							<div className="text-2xl font-bold">Residue information</div>
							<div className="flex flex-col gap-1">
								<div>
									Polymer chain name <b>{residue.polymerChainIdentifier}</b>
								</div>
								<div>
									Residue type <b>{residue.name}</b>
								</div>
								<div>
									Residue sequence number <b>{residue.sequenceNumber}</b>
								</div>
								<div>
									Number of interactions <b>{residue.interactions.length}</b>
								</div>
								<div>Intramolecular Watson-Crick pair: {}</div>
							</div>
							<div className="text-2xl font-bold">Interactions</div>
							<div>
								Interactions:{" "}
								{residue.interactions.map((i) => (
									<div>{JSON.stringify(i)}</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
