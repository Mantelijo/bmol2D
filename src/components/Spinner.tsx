import "./../css/spinner.css";
import React from "react";

const Spinner = () => {
	return (
		<div className="flex flex-col items-center gap-1">
			<div className="text-white font-bold">Loading</div>
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
