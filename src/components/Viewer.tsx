import React, { useContext, useEffect } from 'react';
import {
	Atom,
	Polymer,
	Residue,
	PolymerKind,
	DNAResidues,
} from '../lib/types/atoms';
import { context } from '../Store';
import { InteractionsFinder } from '../lib/InteractionsFinder';
import { ForceGraph } from './../lib/viz/ForceGraph';
import { useRef } from 'react';
import { Node, Link, LinkType } from './../lib/viz/ForceGraph';

// Color map for DNA residues
type cmap = {
	[key in DNAResidues]: string;
};
const ColorMap: cmap = {
	[DNAResidues.DA]: '#fcb331',
	[DNAResidues.DT]: '#5670fb',
	[DNAResidues.DG]: '#f63c37',
	[DNAResidues.DC]: '#03c907',
};
const AT_LINK = 'red';
const GC_LINK = 'blue';
const LinkColorMap: cmap = {
	[DNAResidues.DA]: AT_LINK,
	[DNAResidues.DT]: AT_LINK,
	[DNAResidues.DG]: GC_LINK,
	[DNAResidues.DC]: GC_LINK,
};

// For chain backbone
const DefaultLinkColor = '#494949';

export function Viewer() {
	const [state, dispatch] = useContext(context);
	const polymers = state.polymers;

	let ref = React.createRef<SVGSVGElement>();
	let tooltip = React.createRef<HTMLDivElement>();

	let containerRef = useRef<HTMLDivElement>(null);

	// Construct atoms from polymers that are either DNA or RNA, as we only visualize these
	const atoms: Atom[] = [];
	polymers
		.filter((p) => [PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind) !== -1)
		.map(({ residues }) => {
			residues.map((r) => atoms.push(...r.atoms));
		});

	// Currently visualization works only for DNA residues
	function initD3() {
		if (!ref || polymers.length <= 0) {
			return;
		}
		console.time('DNA_VIZ');
		const iFinder = new InteractionsFinder(polymers);
		const pairs = iFinder.watsonCrickPairs();
		const dna = iFinder.nucleicAcids;

		let nodes: Node[] = [];
		let links: Link[] = [];

		const chain1 = dna[0];
		const chain2 = dna[1];

		const resToId: (r: Residue) => string = (r) => {
			return `${r.polymerChainIdentifier}:${r.name}${r.sequenceNumber}`;
		};
		const CollectNodes = (chain: Polymer) => {
			chain.residues.forEach((r, index) => {
				nodes.push({
					...r,
					hash: r.hash,
					name: r.name.toString().slice(-1), // remove D from name
					id: resToId(r),
					color: ColorMap[r.name as DNAResidues],
					group: DNAResidueIndexes.indexOf(r.name as DNAResidues) + 1,
				});

				// Collect links to previous residue in same chain
				let residues = chain.residues;
				if (index > 0 && index < residues.length) {
					links.push({
						source: resToId(residues[index - 1]),
						target: resToId(r),
						value: 1,
						color: DefaultLinkColor,
						linkType: LinkType.Backbone,
					});
				}
			});
		};

		// Collect nodes
		const DNAResidueIndexes = Object.values(DNAResidues);
		CollectNodes(chain1);
		CollectNodes(chain2);

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

		console.log('Vizualization data:', nodes, links);

		// svg dimensions should fit the container
		let [w, h] = [
			(containerRef.current as HTMLDivElement).offsetWidth,
			(containerRef.current as HTMLDivElement).offsetHeight,
		];

		// Draw the visualization
		ForceGraph(
			{
				nodes,
				links,
				svgRef: ref.current as SVGSVGElement,
			},
			{
				width: w,
				height: h,
			} as any
		);

		console.timeEnd('DNA_VIZ');
	}

	useEffect(initD3, [polymers]);

	return (
		<>
			<div>{state.simpleStuffy}</div>
			<div className="p-5 flex items-center flex-col h-full" ref={containerRef}>
				<div className="min-w-full h-full">
					<svg ref={ref}></svg>
				</div>
				<div
					ref={tooltip}
					style={{ position: 'absolute', opacity: 0, background: '#fff' }}
				></div>
			</div>
		</>
	);
}
