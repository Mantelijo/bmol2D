import { Link } from "./ForceGraph";
import * as d3 from "d3";
import { Action } from "../../Store";
import { Residue } from "../types/atoms";

export interface Node {
	id: string;
	color: string;
	group: number;
	name: string;
	// The hash of residue
	hash: string;
}
export enum LinkType {
	Pair = "pair",
	Backbone = "backbone",
	Interaction = "interaction",
}

export interface Link {
	source: string;
	target: string;
	value: number;
	color: string;
	linkType: LinkType;
}

type ForceGraphParam = {
	nodes: Node[];
	links: Link[];
	svgRef: SVGSVGElement;
	dispatch: React.Dispatch<Action>;
};

type ForceGraphOpts = {
	nodeId: any | never | undefined;
	nodeGroups: any | never | undefined;
	nodeTitle: any | never | undefined;
	nodeFill: any | never | undefined;
	nodeStroke: any | never | undefined;
	nodeStrokeWidth: any | never | undefined;
	nodeStrokeOpacity: any | never | undefined;
	nodeRadius: any | never | undefined;
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

// 100 ms seems the most reasonable based on performance profile
const POPUP_TIMEOUT = 100;

// Example taken from https://observablehq.com/@d3/force-directed-graph
export function ForceGraph(
	{
		nodes, // an iterable of node objects (typically [{id}, …])
		links, // an iterable of link objects (typically [{source, target}, …])
		svgRef, // d3 svg object
		dispatch,
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
		nodeRadius = 10, // node radius, in pixels
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

	// Replace the input nodes and links with mutable objects for the
	// simulation.
	nodes = initialNodes;
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
					return 1;
				default:
					return 1.2;
			}
		});

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
		.append("circle")
		.attr("stroke", nodeStroke)
		.attr("stroke-opacity", nodeStrokeOpacity)
		.attr("stroke-width", nodeStrokeWidth)
		.attr("fill", nodeFill)
		.style("cursor", "pointer")
		.attr("r", nodeRadius);

	// Tooltip information
	let lastEvent = new Date();
	nodeGs
		.on("mouseover", function (event, d: Node) {
			d3.select(this)
				.select("circle")
				.attr("r", transformAdjusted(nodeRadius * 2));
			if (new Date().getTime() - lastEvent.getTime() > POPUP_TIMEOUT) {
				// dispatch({
				// 	type: "selectedResidue",
				// 	payload: d,
				// });
				lastEvent = new Date();
			}
		})
		.on("mouseout", function (event, d: Node) {
			// transform adjusted radius if needed
			d3.select(this).select("circle").attr("r", transformAdjusted(nodeRadius));

			// dispatch({
			// 	type: "selectedResidue",
			// 	payload: undefined,
			// });
		});

	// Append names
	const letters = nodeGs
		.append("text")
		.text((d) => d.name)
		.attr("text-anchor", "middle")
		.attr("font-size", Letters.size)
		.attr("y", Letters.y) // more centered text
		.attr("class", "svg-graph-text");

	if (W) link.attr("stroke-width", (d: any) => W[d.index] as any);
	// if (T) node.append("title").text((d: any) => T[d.index] as any);
	if (invalidation != null) invalidation.then(() => simulation.stop());

	function intern(value: any) {
		return value !== null && typeof value === "object" ? value.valueOf() : value;
	}

	function ticked() {
		link
			.attr("x1", (d: any) => d.source.x)
			.attr("y1", (d: any) => d.source.y)
			.attr("x2", (d: any) => d.target.x)
			.attr("y2", (d: any) => d.target.y);

		nodeGs.attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
	}

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
			event.subject.fx = null;
			event.subject.fy = null;
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
	let transform = undefined;
	let transformK: undefined | number = undefined;
	const zoom = d3.zoom().on("zoom", (e) => {
		g.attr("transform", (transform = e.transform));
		if (transform) {
			transformK = Math.sqrt(transform.k);
			g.style("stroke-width", 3 / transformK);
			node.attr("r", nodeRadius / transformK).attr("stroke-width", nodeStrokeWidth / transformK);
			letters.attr("font-size", Letters.size / transformK).attr("y", Letters.y / transformK);
		}
	});

	svg.call(zoom as any).call(zoom.transform as any, d3.zoomIdentity);

	return Object.assign(svg.node(), { scales: { color: null } });
}
