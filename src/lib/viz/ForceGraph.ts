import { Link } from "./ForceGraph";
import * as d3 from "d3";
import { Action } from "../../Store";
import { Residue } from "../types/atoms";

const aminoAcidColors = {
	orange: "orange",
	green: "green",
	magenta: "magenta",
	red: "red",
	blue: "blue",

	nonStandard: "gray",
};
export const LeskCodesForAminoAcids = new Map<string, string>(
	Object.entries({
		ALA: aminoAcidColors.orange,
		ARG: aminoAcidColors.blue,
		ASN: aminoAcidColors.magenta,
		ASP: aminoAcidColors.red,
		CYS: aminoAcidColors.green,
		GLN: aminoAcidColors.magenta,
		GLU: aminoAcidColors.red,
		GLY: aminoAcidColors.orange,
		HIS: aminoAcidColors.magenta,
		ILE: aminoAcidColors.green,
		LEU: aminoAcidColors.magenta,
		LYS: aminoAcidColors.blue,
		MET: aminoAcidColors.magenta,
		PHE: aminoAcidColors.magenta,
		PRO: aminoAcidColors.magenta,
		PYL: aminoAcidColors.nonStandard,
		SEC: aminoAcidColors.nonStandard,
		SER: aminoAcidColors.orange,
		THR: aminoAcidColors.orange,
		TRP: aminoAcidColors.magenta,
		TYR: aminoAcidColors.magenta,
		VAL: aminoAcidColors.magenta,
	}),
);

// Initial opacity for AminoAcid nodes
const AAOpacity = 0.3;

export interface NodeAminoAcidInteractionData {
	aminoAcid: string;
	aminoAcidSeqNo: number;
	numberOfInteractions: number;
	polymerChainId: string;

	// Residue hash of DNA/RNA which interacts with this AA
	interactingResidueHash: string;
}
export interface Node {
	id: string;
	color: string;
	group: number;
	name: string;
	// The hash of residue
	hash: string;
	type?: NodeType;

	// Initial RNA secondary structure coordinates
	initial_x?: number;
	initial_y?: number;

	// Nodes which represent amino acid interaction (squares) will have
	// this information set
	aminoAcidInteraction?: NodeAminoAcidInteractionData;

	// d3-force specific values
	x?: number;
	y?: number;

	vx?: number;
	vy?: number;

	fx?: number;
	fy?: number;
}

export enum NodeType {
	Residue = "residue",
	InteractionsNumber = "interactions_number",
	InteractionAminoAcid = "interaction_aminoacid",
}

export enum LinkType {
	Pair = "pair",
	Backbone = "backbone",
	Interaction = "interaction",
}

export interface Link {
	source: string | Node;
	target: string | Node;
	value: number;
	color: string;
	linkType: LinkType;
}

type ForceGraphParam = {
	nodes: Node[];
	links: Link[];
	svgRef: SVGSVGElement;
	dispatch: React.Dispatch<Action>;
	setHoverResidueHash: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type ForceGraphOpts = {
	nodeId: any | never | undefined;
	nodeGroups: any | never | undefined;
	nodeTitle: any | never | undefined;
	nodeFill: any | never | undefined;
	nodeStroke: any | never | undefined;
	nodeStrokeWidth: any | never | undefined;
	nodeStrokeOpacity: any | never | undefined;
	NodeRadius: any | never | undefined;
	linkSource: any | never | undefined;
	linkTarget: any | never | undefined;
	linkStroke: any | never | undefined;
	linkStrokeOpacity: any | never | undefined;
	linkStrokeWidth: any | never | undefined;
	linkStrokeLinecap: any | never | undefined;
	colors: any | never | undefined;
	width: any | never | undefined;
	height: any | never | undefined;
	invalidation: any | never | undefined;
};

// letter sizings in px
const Letters = {
	size: 10,
	y: 4,
};

// Dimensions for amino acid interaction rects
const AminoAcidBoxDims = {
	x: 90,
	y: 20,
	// Border radius
	rx: 5,
};

// filter datum for given type array
const d3FilterFn = (type: NodeType[]) => {
	return (d: Node) => d.type !== undefined && type.indexOf(d.type) !== -1;
};

// Single residue circle radius in px
export const NodeRadius = 9;

// Sizing functions used in zooming/ticked/etc
const sizingFns = {
	lettersY: (d: Node, transformK = 1) => {
		// if (d.type === NodeType.InteractionAminoAcid) {
		// 	return (AminoAcidBoxDims.y + Letters.size * 0.75) / 2 / transformK;
		// }
		// more centered text
		return Letters.y / transformK;
	},
	lettersX: (d: Node, transformK = 1) => {
		// if (d.type === NodeType.InteractionAminoAcid) {
		// 	return AminoAcidBoxDims.x / 2 / transformK;
		// }
		// more centered text
		return 0;
	},
};

// Example taken from https://observablehq.com/@d3/force-directed-graph
export function ForceGraph(
	{
		nodes, // an iterable of node objects (typically [{id}, …])
		links, // an iterable of link objects (typically [{source, target}, …])
		svgRef, // d3 svg object
		dispatch,
		setHoverResidueHash,
	}: ForceGraphParam,
	opts: ForceGraphOpts,
) {
	let {
		nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
		nodeGroups, // an array of ordinal values representing the node groups
		nodeTitle, // given d in nodes, a title string
		nodeFill = (d: any) => {
			return d.color !== undefined ? d.color : "currentColor";
		}, // node stroke fill (if not using a group color encoding)
		nodeStroke = "#fff", // node stroke color
		nodeStrokeWidth = 1.5, // node stroke width, in pixels
		nodeStrokeOpacity = 1, // node stroke opacity
		// NodeRadius = 10, // node radius, in pixels
		linkStroke = (d: any) => {
			return d.color !== undefined ? d.color : "#444";
		}, // link stroke color
		linkStrokeOpacity = 0.6, // link stroke opacity
		linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
		linkStrokeLinecap = "round", // link stroke linecap
		width = 640, // outer width, in pixels
		height = 400, // outer height, in pixels
		invalidation, // when this promise resolves, stop the simulation
	} = opts;

	// Save initial objects for later usage
	const initialNodes = nodes;
	const initialLinks = links;

	// Compute values.
	const N = d3.map(nodes, nodeId).map(intern);
	if (nodeTitle === undefined) nodeTitle = (_: never, i: number) => N[i];
	const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);

	nodes = initialNodes.map((n: Node) => {
		// Fill in fixed coordinates if initial coordinates are present
		if (n.initial_x && n.initial_y) {
			n.fx = n.initial_x;
			n.fy = n.initial_y;
		}
		return n;
	});
	links = initialLinks;

	// Construct the forces.
	const forceNode = d3.forceManyBody();

	const forceLink = d3
		.forceLink(links)
		.id(({ index: i }) => N[i as any])
		.distance((d, i) => {
			switch (initialLinks[i].linkType) {
				// Smaller distance values for backbone provide a better
				// structure with better separation between chains
				case LinkType.Backbone:
					return 4;
				case LinkType.Interaction:
					return 10;
				default:
					// LinktType.Pair
					return 30;
			}
		})
		.strength((d, i) => {
			switch (initialLinks[i].linkType) {
				// Larger values for backbone provide a better
				// structure with better separation between chains
				case LinkType.Backbone:
					return 1.8;
				case LinkType.Interaction:
					return 1.5;
				default:
					return 1.2;
			}
		});

	const ticked = () => {
		// Interaction (Amino acid nodes) are always source nodes, (see
		// Viewer.tsx where interaction nodes are generated)
		link
			.attr("x1", (d: any) => {
				return d.source.x;
			})
			.attr("y1", (d: any) => {
				return d.source.y;
			})
			.attr("x2", (d: any) => {
				return d.target.x;
			})
			.attr("y2", (d: any) => {
				return d.target.y;
			});

		nodeGs.attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
	};

	const simulation = d3
		.forceSimulation(nodes as any)
		.force("link", forceLink)
		.force("nodes", forceNode)
		.on("tick", ticked);

	const svg = d3
		.select(svgRef)
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [-width / 2, -height / 2, width, height] as any)
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	// Clear any previously available graphs
	svg.html("");

	const g = svg.append("g");

	const link = g
		.append("g")
		.attr("stroke-opacity", linkStrokeOpacity)
		.attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
		.attr("stroke-linecap", linkStrokeLinecap)
		.selectAll("line")
		.data(links)
		.join("line")
		.attr("stroke-dasharray", (d) => {
			if (d.linkType === "pair") {
				return "4";
			}
			return null;
		})
		.attr("stroke", linkStroke);

	const nodeGs = g
		.append("g")
		.selectAll("g")
		.data(nodes)
		.enter()
		.append("g")
		.call(drag(simulation) as any);

	const node = nodeGs
		.filter((d: Node) => d.type === NodeType.Residue)
		.append("circle")
		.attr("stroke", nodeStroke)
		.attr("stroke-opacity", nodeStrokeOpacity)
		.attr("stroke-width", nodeStrokeWidth)
		.attr("fill", nodeFill)
		.style("cursor", "pointer")
		.attr("r", NodeRadius);

	const aminoAcids = nodeGs
		.filter((d: Node) => d.type === NodeType.InteractionAminoAcid)
		.append("rect")
		.attr("width", AminoAcidBoxDims.x)
		.attr("height", AminoAcidBoxDims.y)
		.attr("rx", AminoAcidBoxDims.rx)
		.attr("x", -AminoAcidBoxDims.x / 2)
		.attr("y", -AminoAcidBoxDims.y / 2)
		.attr("fill", (d: Node) => {
			if (d.aminoAcidInteraction) {
				const color = LeskCodesForAminoAcids.get(d.aminoAcidInteraction.aminoAcid);
				if (color) {
					return color;
				}
			}
			return aminoAcidColors.nonStandard;
		})
		.attr("opacity", AAOpacity);

	// Tooltip information
	nodeGs
		.on("click", function (event, d: Node) {
			if (
				d.type &&
				-1 !==
					[NodeType.InteractionsNumber, NodeType.InteractionAminoAcid, NodeType.Residue].indexOf(
						d.type,
					)
			) {
				dispatch({
					type: "selectedResidueHash",
					payload: d.hash,
				});
			}
		})
		.on("mouseover", function (event, d: Node) {
			const t = d3.select(this);
			// @ts-ignore
			t.filter(d3FilterFn([NodeType.Residue]))
				.select("circle")
				.attr("r", transformAdjusted(NodeRadius * 2));

			// Increase opacity for AA blocks on hover
			// @ts-ignore
			t.filter(d3FilterFn([NodeType.InteractionAminoAcid]))
				.select("rect")
				.attr("opacity", 1);

			setHoverResidueHash(d.hash);
		})
		.on("mouseout", function (event, d: Node) {
			const t = d3.select(this);
			// @ts-ignore
			t.filter(d3FilterFn([NodeType.Residue]))
				.select("circle")
				.attr("r", transformAdjusted(NodeRadius));
			// Decrease opacity back for AA block
			// @ts-ignore
			t.filter(d3FilterFn([NodeType.InteractionAminoAcid]))
				.select("rect")

				.attr("opacity", AAOpacity);
			setHoverResidueHash(undefined);
		});

	// Append node titles
	const letters = nodeGs
		// .filter((n: Node) => n.type === NodeType.Residue)
		.append("text")
		.text((d) => d.name)
		.attr("text-anchor", "middle")
		.attr("font-size", Letters.size)
		.attr("y", (n: Node) => sizingFns.lettersY(n))
		.attr("x", (n: Node) => sizingFns.lettersX(n))
		.attr("class", (d: Node) => {
			const classes = ["svg-graph-text"];
			if (d.type === NodeType.InteractionsNumber) {
				classes.push("svg-graph-text-black");
			} else {
				classes.push("svg-graph-text-white");
			}
			return classes.join(" ");
		});

	if (W) link.attr("stroke-width", (d: any) => W[d.index] as any);
	// if (T) node.append("title").text((d: any) => T[d.index] as any);
	if (invalidation != null) invalidation.then(() => simulation.stop());

	function intern(value: any) {
		return value !== null && typeof value === "object" ? value.valueOf() : value;
	}

	// Drag functionality
	function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
		function dragstarted(event: any) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event: any) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event: any) {
			if (!event.active) simulation.alphaTarget(0);
			// event.subject.fx = event.subject.initial_x;
			// event.subject.fy = event.subject.initial_y;
		}

		return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
	}

	// Zoom-in functionality
	const transformAdjusted: (val: number) => number = (val) => {
		if (transformK) {
			return val / transformK;
		}
		return val;
	};

	let transformK = 1;
	let [x, y] = [0, 0];
	const coordThreshold = 5;
	const zoom = d3
		.zoom()
		.scaleExtent([0.001, 100])
		.on("zoom", ({ transform }) => {
			const xDiff = Math.abs(transform.x - x);
			const yDiff = Math.abs(transform.y - y);
			if (xDiff > coordThreshold || yDiff > coordThreshold) {
				x = transform.x;
				y = transform.y;
				g.attr("transform", transform);
			}
			const newK = Math.sqrt(transform.k);

			// Resize nodes
			if (Math.abs(newK - transformK) > 0.1) {
				transformK = newK;
				g.style("stroke-width", 3 / transformK);
				node.attr("r", NodeRadius / transformK).attr("stroke-width", nodeStrokeWidth / transformK);
				letters
					.attr("font-size", Letters.size / transformK)
					.attr("y", (n: Node) => sizingFns.lettersY(n, transformK))
					.attr("x", (n: Node) => sizingFns.lettersX(n, transformK));
				aminoAcids
					.attr("rx", AminoAcidBoxDims.rx / transformK)
					.attr("width", AminoAcidBoxDims.x / transformK)
					.attr("height", AminoAcidBoxDims.y / transformK)
					.attr("x", -(AminoAcidBoxDims.x / transformK) / 2)
					.attr("y", -(AminoAcidBoxDims.y / transformK) / 2);
			}
		});
	svg.call(zoom as any);

	// Function to hide/show nodes
	const hideAminoAcidBlocks = (hide: boolean) => {
		const AABlocks = nodeGs.filter(d3FilterFn([NodeType.InteractionAminoAcid]));
		const AABlockLinks = link.filter((l: Link) => l.linkType === LinkType.Interaction);
		if (hide) {
			AABlocks.attr("display", "none");
			AABlockLinks.attr("display", "none");
		} else {
			AABlocks.attr("display", "initial");
			AABlockLinks.attr("display", "initial");
		}
	};
	window.hideAminoAcidBlocks = hideAminoAcidBlocks;

	return hideAminoAcidBlocks;
}
