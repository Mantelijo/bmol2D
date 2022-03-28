import React, { useContext, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { context } from "@/Store";

export const PreDefinedSamplesModal = () => {
	const [state, dispatch] = useContext(context);
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		setShowModal(state.showSamplesModal);
	}, [state.showSamplesModal]);
	useEffect(() => {
		if (!showModal) {
			dispatch({
				type: "showSamplesModal",
				payload: false,
			});
		}
	}, [showModal]);
	return (
		<Modal show={showModal} setShow={setShowModal}>
			<div className="flex flex-col items-start justify-center gap-2">
                <div></div>

            </div>
		</Modal>
	);
};
