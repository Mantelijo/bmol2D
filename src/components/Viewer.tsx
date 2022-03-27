import React, { useCallback, useContext, useEffect, useMemo } from "react";
import {
	Atom,
	Polymer,
	Residue,
	PolymerKind,
	DNAResidues,
	ResidueName,
	RNAResidues,
} from "../lib/types/atoms";
import { context } from "../Store";
import { InteractionsFinder } from "../lib/InteractionsFinder";
import { ForceGraph, NodeType } from "./../lib/viz/ForceGraph";
import { useRef } from "react";
import { Node, Link, LinkType } from "./../lib/viz/ForceGraph";
import { resToId } from "../lib/types/residues";

declare global {
	interface Window {
		iFinder: InteractionsFinder;
	}
}

// Color map for DNA residues
type cmap = {
	[key in DNAResidues | RNAResidues | "interaction"]: string;
};
const ColorMap: cmap = {
	[DNAResidues.DA]: "#fcb331",
	[DNAResidues.DT]: "#5670fb",
	[DNAResidues.DG]: "#f63c37",
	[DNAResidues.DC]: "#03c907",
	[DNAResidues.CM]: "#03c907",

	[RNAResidues.A]: "#acb331",
	[RNAResidues.U]: "#a670fb",
	[RNAResidues.G]: "#a63c37",
	[RNAResidues.C]: "#a3c907",
	[RNAResidues.I]: "#a3c907",

	interaction: "#333",
};

const AT_LINK = "red";
const GC_LINK = "blue";
const LinkColorMap: cmap = {
	[DNAResidues.DA]: AT_LINK,
	[DNAResidues.DT]: AT_LINK,
	[DNAResidues.DG]: GC_LINK,
	[DNAResidues.DC]: GC_LINK,
	[DNAResidues.CM]: GC_LINK,

	[RNAResidues.A]: AT_LINK,
	[RNAResidues.U]: AT_LINK,
	[RNAResidues.G]: GC_LINK,
	[RNAResidues.C]: GC_LINK,
	[RNAResidues.I]: GC_LINK,

	interaction: "#718355",
};

// Chain backbone color
const DefaultLinkColor = "#494949";

export function Viewer() {
	const [state, dispatch] = useContext(context);
	const polymers = state.polymers;

	const ref = React.createRef<SVGSVGElement>();
	const tooltip = React.createRef<HTMLDivElement>();

	const containerRef = useRef<HTMLDivElement>(null);

	// Construct interactions finder
	const iFinder = useMemo<InteractionsFinder | undefined>(() => {
		if (polymers.length > 0) {
			const iFinder = new InteractionsFinder(polymers);
			// make it accessible globally
			window.iFinder = iFinder;
			return iFinder;
		}
	}, [polymers]);

	useEffect(() => {
		dispatch({
			payload: iFinder,
			type: "iFinderInstance",
		});
	}, [iFinder]);

	function initD3() {
		if (!ref || polymers.length <= 0 || !iFinder) {
			return;
		}
		console.time("Nucleic_acid_VIZ");

		let pairs: Residue[][];
		try {
			pairs = iFinder.watsonCrickPairs();
		} catch (e) {
			console.log(e);
			dispatch({
				type: "error",
				payload: (e as any).toString() as string,
			});
			return;
		}

		// Find if we have any RNA molecules and fill in their secondary
		// structure if possible
		iFinder.fillInSecondaryStructure();

		// Console log the pairs that we have
		iFinder.nucleicAcids;

		// Calculate interactions
		iFinder.simpleInteractions();

		const nodes: Node[] = [];
		const links: Link[] = [];

		const CollectNodes = (chain: Polymer) => {
			const DNAResidueIndexes = Object.values(DNAResidues);
			chain.residues.forEach((r, index) => {
				nodes.push({
					hash: r.hash,
					name: r.name.toString().slice(-1), // remove first character from name
					id: resToId(r),
					color: ColorMap[r.name as DNAResidues],
					group: DNAResidueIndexes.indexOf(r.name as DNAResidues) + 1,
					type: NodeType.Residue,

					initial_x: r.initial_x,
					initial_y: r.initial_y,
				});

				// Collect links to previous residue in same chain
				const residues = chain.residues;
				if (index > 0 && index < residues.length) {
					links.push({
						source: resToId(residues[index - 1]),
						target: resToId(r),
						value: 1,
						color: DefaultLinkColor,
						linkType: LinkType.Backbone,
					});
				}

				// Show number of interactions for each residue if any
				if (r.interactions.length > 0) {
					const interactionsId = resToId(r) + "-interactions";
					nodes.push({
						hash: r.hash, // This node still has it's residue's hash
						name: r.interactions.length.toString(),
						id: interactionsId,
						color: ColorMap.interaction,
						group: 5,
						type: NodeType.InteractionsNumber,
					});
					links.push({
						source: interactionsId,
						target: resToId(r),
						value: 1,
						color: LinkColorMap.interaction,
						linkType: LinkType.Interaction,
					});
				}
			});
		};

		// Collect nodes for all available nucleic acids
		iFinder.nucleicAcids.forEach((chain) => CollectNodes(chain));

		// Collect links for watson-crick pairs
		pairs.forEach((p) => {
			const r1 = p[0];
			if (p.length === 2) {
				const r2 = p[1];
				links.push({
					source: resToId(r2),
					target: resToId(r1),
					value: 1,
					color: LinkColorMap[r1.name as DNAResidues],
					linkType: LinkType.Pair,
				});
			}
		});

		// svg dimensions should fit the container
		const [w, h] = [
			(containerRef.current as HTMLDivElement).offsetWidth,
			(containerRef.current as HTMLDivElement).offsetHeight,
		];

		// Draw the visualization
		ForceGraph(
			{
				nodes,
				links,
				svgRef: ref.current as SVGSVGElement,
				dispatch,
			},
			{
				width: w,
				height: h,
			} as any,
		);

		// console.log("Visualization nodes");
		// console.table(nodes);

		// console.log("Visualization links");
		// console.table(links);

		console.timeEnd("Nucleic_acid_VIZ");
	}

	useEffect(initD3, [polymers]);

	return (
		<>
			<div>{state.simpleStuffy}</div>
			<div className="flex flex-col items-center h-full p-5" ref={containerRef}>
				<div className="relative h-full min-w-full">
					<svg ref={ref}></svg>
				</div>
				<div ref={tooltip} style={{ position: "absolute", opacity: 0, background: "#fff" }}></div>
			</div>
		</>
	);
}
