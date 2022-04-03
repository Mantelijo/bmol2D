import React, { useContext, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { context } from "@/Store";
import { PolymerKind } from "@/lib/types/atoms";
export const ManualDotBraketModal = () => {
	const [show, setShow] = useState<boolean>(true);

	const [state, dispatch] = useContext(context);

	useEffect(() => {
		if (!show) {
			dispatch({
				type: "showManualDotBraketModal",
				payload: false,
			});
		}
	}, [show]);

	const updatePolymers = () => {
		const p = state.polymers;
		dispatch({
			type: "polymers",
			payload: [...p],
		});
		setTimeout(() => {
			setShow(false);
		}, 1500);
	};

	return (
		<Modal setShow={setShow} show={show}>
			<div></div>
			{state.polymers.map(
				(p, i) =>
					[PolymerKind.RNA, PolymerKind.DNA].indexOf(p.kind) !== -1 && (
						<div key={i} className="flex flex-col gap-3 mb-10 last:!mb-0">
							<div>
								Polymer chain:{" "}
								<b>
									{p.chainIdentifier} ({p.kind})
								</b>
							</div>
							<div>
								<div className="mb-1 text-sm font-bold">Dot braket string</div>
								<input
									value={p.dotBraket}
									onInput={(e: React.SyntheticEvent) => {
										p.dotBraket = (e.target as HTMLInputElement).value;
									}}
									style={{ width: "500px" }}
									placeholder="(((....)))"
									className="p-2 px-4 bg-white border border-indigo-300 rounded-md shadow-sm outline-none ring-indigo-200 focus:ring-2"
								/>
							</div>
						</div>
					),
			)}
			<button
				onClick={updatePolymers}
				className="block px-4 py-3 font-bold text-white transition-all bg-indigo-400 rounded ring-indigo-200 focus:ring-4 hover:bg-indigo-600"
			>
				Update dot-braket strings
			</button>
		</Modal>
	);
};
