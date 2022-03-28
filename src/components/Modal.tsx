import React, { MouseEvent, useRef } from "react";

export interface props {
	children: React.ReactNode;
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal = ({ children, show, setShow }: props) => {
	const modalRef = useRef(null);
	const close = () => setShow(false);

	return (
		<>
			{show && (
				<div>
					<div className="fixed top-0 left-0 z-[999]">
						<div
							className="absolute top-0 left-0 z-10 w-screen h-screen bg-gray-800/50"
							onClick={close}
						></div>
						<div
							ref={modalRef}
							className="absolute z-[1000] w-screen flex h-screen justify-center items-center"
							onClick={(event: MouseEvent) => {
								if (modalRef.current === event.target) {
									close();
								}
							}}
						>
							<div className="p-12 bg-white rounded-xl max-w-7xl max-h-[80%] overflow-auto relative shadow-xl border-gray-100 border">
								<div
									className="absolute text-2xl font-bold text-gray-400 cursor-pointer hover:text-gray-800 right-4 top-4"
									onClick={close}
								>
									&#10005;
								</div>
								{children}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
