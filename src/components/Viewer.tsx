import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
import { Interaction } from "@/lib/types/interactions";
import { group } from "d3-array";

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

	interaction: "#fbf8cc",
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

	interaction: "#bbb",
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

	// Shows some small residue information when residue bubble is hovered
	// over in visualization
	const [hoverResidueHash, setHoverResidueHash] = useState<string | undefined>();
	const hoverResidue = useMemo<Residue | null>(() => {
		if (hoverResidueHash) {
			return state.getResidueByHashOnly(hoverResidueHash);
		}
		return null;
	}, [hoverResidueHash]);

	function initD3() {
		console.log("initD3 called");
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

				// Collect backbone links to previous residue in same chain
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

				// Show interactions with unique amino acid for each residue if any
				if (r.interactions.length > 0) {
					// Group the interactions based on amino acid
					type groupVal = { aminoAcidResidue: Residue; interactions: Interaction[] };
					const groups = new Map<string, groupVal>();
					r.interactions.forEach((i) => {
						if (i.polymerKind === PolymerKind.Protein) {
							const residue = state.getResidue(i.polymerChainIdentifier, i.residueHash);
							if (residue) {
								const aminoAcidNameWithChainAnSeqno = `${residue.polymerChainIdentifier}:${residue.name}-${residue.sequenceNumber}`;
								if (!groups.has(aminoAcidNameWithChainAnSeqno)) {
									groups.set(aminoAcidNameWithChainAnSeqno, {
										aminoAcidResidue: residue,
										interactions: [],
									});
								}
								(
									(groups.get(aminoAcidNameWithChainAnSeqno) as groupVal)
										.interactions as Interaction[]
								).push(i);
							}
						}
					});

					for (const [
						aminoAcidNameWithChainAnSeqno,
						{ interactions, aminoAcidResidue },
					] of groups) {
						const interactionsId = resToId(r) + "-interactions-" + aminoAcidNameWithChainAnSeqno;
						nodes.push({
							// This node still has it's residue's hash as we want to display residues information on click
							hash: r.hash,
							// Name format:
							// ChainID:AminoAcid3Letters-SeqNo (NumberOfInteractions)
							name: `${aminoAcidNameWithChainAnSeqno} (${interactions.length})`,
							id: interactionsId,
							color: ColorMap.interaction,
							group: 5,
							type: NodeType.InteractionAminoAcid,
							aminoAcidInteraction: {
								aminoAcid: aminoAcidResidue.name.toString(),
								aminoAcidSeqNo: aminoAcidResidue.sequenceNumber,
								numberOfInteractions: interactions.length,
								polymerChainId: aminoAcidResidue.polymerChainIdentifier,
								interactingResidueHash: r.hash,
							},
						});
						links.push({
							source: interactionsId,
							target: resToId(r),
							value: 1,
							color: LinkColorMap.interaction,
							linkType: LinkType.Interaction,
						});
					}
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

		// Draw the visualization. ForceGrah returns function to control
		// AABlocks and links
		hideAminoAcidBlocks.current = ForceGraph(
			{
				nodes,
				links,
				svgRef: ref.current as SVGSVGElement,
				dispatch,
				setHoverResidueHash,
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

		dispatch({
			type: "vizLoaded",
			payload: true,
		});
	}

	const hideAminoAcidBlocks = useRef<((hide: boolean) => void) | undefined>(undefined);
	useEffect(() => {
		if (hideAminoAcidBlocks.current) {
			hideAminoAcidBlocks.current(!state.showAABlocks);
		}
	}, [state.showAABlocks]);

	useEffect(initD3, [state.polymers]);

	return (
		<>
			<div>{state.simpleStuffy}</div>
			<div className="flex flex-col items-center h-full p-5" ref={containerRef}>
				<div className="relative h-full min-w-full">
					<svg ref={ref}></svg>

					{hoverResidue && (
						<div className="absolute bottom-0 p-4 text-sm text-gray-800 bg-white/50 right-4 rounded-xl">
							Chain {hoverResidue.polymerChainIdentifier}
							<br /> Residue {hoverResidue.name}-{hoverResidue.sequenceNumber}
						</div>
					)}
				</div>
				<div ref={tooltip} style={{ position: "absolute", opacity: 0, background: "#fff" }}></div>
			</div>
		</>
	);
}
