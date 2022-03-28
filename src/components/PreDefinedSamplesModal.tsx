import React, { useContext, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { context, samplesContext } from "@/Store";
import { Sample } from "@/lib/Samples";

export const PreDefinedSamplesModal = () => {
	const [state, dispatch] = useContext(samplesContext);
	const [showModal, setShowModal] = useState(false);

	const hide = () => {
		dispatch({
			type: "showSamplesModal",
			payload: false,
		});
	};

	useEffect(() => {
		setShowModal(state.showSamplesModal);
	}, [state.showSamplesModal]);
	useEffect(() => {
		if (!showModal) {
			hide();
		}
	}, [showModal]);

	const selectSample: (sample: Sample) => void = (sample) => {
		dispatch({
			type: "currentlySelectedSamplePDBID",
			payload: sample.pdbId,
		});
		hide();
	};

	const content = [];
	for (const [_, sample] of state.sampleStructures.entries()) {
		content.push(
			<div
				key={sample.pdbId}
				onClick={() => selectSample(sample)}
				className="font-bold text-indigo-400 cursor-pointer hover:underline hover:text-indigo-700"
			>
				{sample.pdbId}
			</div>,
		);
	}

	return (
		<Modal show={showModal} setShow={setShowModal}>
			<div className="max-w-[600px]">
				<div className="mb-6">
					<div className="text-xl font-bold text-gray-700">
						Load pre-computed secondary structures
					</div>
					<div className="mt-2 text-sm">
						Here you can select some example structures to explore. These sample structures have
						dot-braket information pre-loaded, so you will not need to run the{" "}
						<code>secondary_structure.py</code> script locally in order to see the secondary
						structure. Click on one of the PDB ID codes displayed below to load that structure.
					</div>
				</div>
				<div className="flex flex-row flex-wrap gap-4">{content}</div>
			</div>
		</Modal>
	);
};
