import * as d3 from 'd3';

// Example taken from
// https://observablehq.com/@d3/force-directed-graph
export function ForceGraph(
	{
		nodes, // an iterable of node objects (typically [{id}, …])
		links, // an iterable of link objects (typically [{source, target}, …])
		svgRef, // d3 svg object
	},
	opts
) {
	let {
		nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
		nodeGroup, // given d in nodes, returns an (ordinal) value for color
		nodeGroups, // an array of ordinal values representing the node groups
		nodeTitle, // given d in nodes, a title string
		nodeFill = (d) => {
			return d.color !== undefined ? d.color : 'currentColor';
		}, // node stroke fill (if not using a group color encoding)
		nodeStroke = '#fff', // node stroke color
		nodeStrokeWidth = 1.5, // node stroke width, in pixels
		nodeStrokeOpacity = 1, // node stroke opacity
		nodeRadius = 10, // node radius, in pixels
		nodeStrength,
		linkSource = ({ source }) => source, // given d in links, returns a node identifier string
		linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
		linkStroke = '#999', // link stroke color
		linkStrokeOpacity = 0.6, // link stroke opacity
		linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
		linkStrokeLinecap = 'round', // link stroke linecap
		linkStrength,
		colors = d3.schemeTableau10, // an array of color strings, for the node groups
		width = 640, // outer width, in pixels
		height = 400, // outer height, in pixels
		invalidation, // when this promise resolves, stop the simulation
	} = opts;

	// Save initial nodes for later usage
	const initialNodes = nodes;

	// Compute values.
	const N = d3.map(nodes, nodeId).map(intern);
	console.log(nodes, N);
	const LS = d3.map(links, linkSource).map(intern);
	const LT = d3.map(links, linkTarget).map(intern);
	if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
	const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
	const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
	const W =
		typeof linkStrokeWidth !== 'function'
			? null
			: d3.map(links, linkStrokeWidth);

	// Replace the input nodes and links with mutable objects for the simulation.
	nodes = d3.map(nodes, (_, i) => ({ id: N[i], color: initialNodes[i].color }));
	links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

	// Compute default domains.
	if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

	// Construct the scales.
	const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

	// Construct the forces.
	const forceNode = d3.forceManyBody();
	const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
	if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
	if (linkStrength !== undefined) forceLink.strength(linkStrength);

	const simulation = d3
		.forceSimulation(nodes)
		.force('link', forceLink)
		.force('charge', forceNode)
		.force('center', d3.forceCenter())
		.on('tick', ticked);

	const svg = d3
		.select(svgRef)
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [-width / 2, -height / 2, width, height])
		.attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
	const g = svg.append('g');

	const link = g
		.append('g')
		.attr('stroke', linkStroke)
		.attr('stroke-opacity', linkStrokeOpacity)
		.attr(
			'stroke-width',
			typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null
		)
		.attr('stroke-linecap', linkStrokeLinecap)
		.selectAll('line')
		.data(links)
		.join('line');

	const node = g
		.append('g')
		.attr('stroke', nodeStroke)
		.attr('stroke-opacity', nodeStrokeOpacity)
		.attr('stroke-width', nodeStrokeWidth)
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.attr('fill', nodeFill)
		.attr('r', nodeRadius)
		.join('text')
		.text((d) => 'A')
		.call(drag(simulation));

	if (W) link.attr('stroke-width', ({ index: i }) => W[i]);
	if (G) node.attr('fill', ({ index: i }) => color(G[i]));
	if (T) node.append('title').text(({ index: i }) => T[i]);
	if (invalidation != null) invalidation.then(() => simulation.stop());

	function intern(value) {
		return value !== null && typeof value === 'object'
			? value.valueOf()
			: value;
	}

	function ticked() {
		link
			.attr('x1', (d) => d.source.x)
			.attr('y1', (d) => d.source.y)
			.attr('x2', (d) => d.target.x)
			.attr('y2', (d) => d.target.y);

		node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
	}

	function drag(simulation) {
		function dragstarted(event) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		return d3
			.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	}

	let transform;
	const zoom = d3.zoom().on('zoom', (e) => {
		g.attr('transform', (transform = e.transform));
		g.style('stroke-width', 3 / Math.sqrt(transform.k));
		node.attr('r', nodeRadius / Math.sqrt(transform.k));
	});

	svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

	return Object.assign(svg.node(), { scales: { color } });
}
