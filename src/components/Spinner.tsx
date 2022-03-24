import "./../css/spinner.css";
import React from "react";

export interface props {
	text?: string;
}
const Spinner = ({ text }: props) => {
	return (
		<div className="flex flex-col items-center gap-1">
			<div className="font-bold text-white">{text ?? "Loading"}</div>
			<div className="lds-roller">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Spinner;
