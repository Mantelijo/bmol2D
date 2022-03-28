import { Polymer, Residue } from "@/lib/types/atoms";
import React, { useContext, MouseEvent, useMemo, useRef, useState, useEffect } from "react";
import { context } from "@/Store";
import { instanceOf } from "prop-types";
import { Modal } from "./Modal";

interface props {
	residue: Residue;
}
export const ResidueModal = ({ residue }: props) => {
	const [state, dispatch] = useContext(context);

	const polymer = state.getPolymer(residue.polymerChainIdentifier);

	const intramolecularPair = useMemo<undefined | Residue>(() => {
		const i = residue.watsonCrickPairResidueIndex;
		if (i > 0 && polymer) {
			return polymer.residues[i];
		}
		return undefined;
	}, [residue]);

	const changeResidue = (r: Residue) => {
		dispatch({
			type: "selectedResidueHash",
			payload: r.hash,
		});
	};

	// Modal state mgmnt
	const [show, setShow] = useState(true);
	useEffect(() => {
		if (!show) {
			dispatch({
				type: "selectedResidueHash",
				payload: undefined,
			});
		}
	}, [show]);

	return (
		<Modal show={show} setShow={setShow}>
			<div className="flex flex-col items-start justify-center gap-2">
				<div className="text-2xl font-bold">Residue information</div>
				<div className="flex flex-col gap-1">
					<div>
						Polymer chain name &nbsp;
						<b>
							{residue.polymerChainIdentifier} ({polymer?.kind})
						</b>
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
					{intramolecularPair && (
						<div>
							Intramolecular Watson-Crick pair:{" "}
							<b
								className="cursor-pointer hover:underline hover:text-indigo-800"
								onClick={() => changeResidue(intramolecularPair)}
							>
								{intramolecularPair.name}-{intramolecularPair.sequenceNumber}
							</b>
						</div>
					)}
				</div>
				<div className="mt-8 text-2xl font-bold">Interactions</div>
				<div className="max-w-full overflow-auto">
					<table className="border border-collapse border-gray-300">
						<thead>
							<tr>
								<th className="p-2 font-bold text-center border border-gray-300">
									Interaction type
								</th>
								<th className="p-2 font-bold text-center border border-gray-300">
									Distance between interacting atoms (&#197;)
								</th>
								<th className="p-2 font-bold text-center border border-gray-300">
									Polymer chain name
								</th>
								<th className="p-2 font-bold text-center border border-gray-300">Residue name</th>
								<th className="p-2 font-bold text-center border border-gray-300">Atom</th>
								<th className="p-2 font-bold text-center border border-gray-300">
									Interacting atom (of this residue)
								</th>
							</tr>
						</thead>
						<tbody>
							{residue.interactions.map((i, k) => (
								<tr key={k} className="odd:bg-gray-100">
									<td className="p-1 border border-gray-300">
										{i.type} - {i.polymerKind}
									</td>
									<td className="p-1 text-center border border-gray-300">
										{Math.round(i.distance * 1000) / 1000}
									</td>
									<td className="p-1 text-center border border-gray-300">
										{i.polymerChainIdentifier}
									</td>
									<td className="p-1 text-center border border-gray-300">
										{i.atom.residueName}-{i.atom.residueSequenceNumber}
									</td>
									<td className="p-1 text-center border border-gray-300">
										{i.atom.name} ({i.atom.element})
									</td>
									<td className="p-1 text-center border border-gray-300">
										{i.residueAtom.name} ({i.residueAtom.element})
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Modal>
	);
};
