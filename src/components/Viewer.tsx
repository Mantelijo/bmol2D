import React, { useContext, useEffect } from 'react';
import * as d3 from 'd3';
import {
	Atom,
	Residue,
	PolymerKind,
	ResidueMeta,
	DNAResidues,
} from '../lib/types/atoms';
import { context } from '../Store';
import { InteractionsFinder } from '../lib/InteractionsFinder';
import { VisualizationResidue } from '../lib/types/visualization';
import { ForceGraph } from './../lib/viz/ForceGraph';
import { useRef } from 'react';

interface D3Element {
	x: number;
	y: number;
	data: ResidueMeta;
	chainId: string;
	visualizationResidue: VisualizationResidue;
}

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

	function initD3() {
		if (!ref || polymers.length <= 0) {
			return;
		}
		const iFinder = new InteractionsFinder(polymers, dispatch);
		const pairs = iFinder.watsonCrickPairs();
		const dna = iFinder.nucleicAcids;

		interface Node {
			id: string;
			group: number;
		}

		interface Link {
			source: string;
			target: string;
			value: number;
		}

		let nodes: Node[] = [];
		let links: Link[] = [];

		const chain1 = dna[0];
		const chain2 = dna[1];

		const resToId: (r: Residue) => string = (r) => {
			return `${r.polymerChainIdentifier}:${r.name}${r.sequenceNumber}`;
		};

		// Collect nodes
		const DNAResidueIndexes = Object.values(DNAResidues);
		chain1.residues.forEach((r, index) => {
			nodes.push({
				id: resToId(r),
				group: DNAResidueIndexes.indexOf(r.name as DNAResidues) + 1,
			});

			// Collect links for same chain residues
			let residues = chain1.residues;
			if (index > 0 && index < residues.length) {
				links.push({
					source: resToId(residues[index - 1]),
					target: resToId(r),
					value: 1,
				});
			}
		});
		chain2.residues.forEach((r, index) => {
			nodes.push({
				id: resToId(r),
				group: DNAResidueIndexes.indexOf(r.name as DNAResidues) + 1,
			});

			// Collect links for same chain residues
			let residues = chain2.residues;
			if (index > 0 && index < residues.length) {
				links.push({
					source: resToId(residues[index - 1]),
					target: resToId(r),
					value: 1,
				});
			}
		});

		// Collect links for watson-crick pairs
		pairs.forEach((p) => {
			const r1 = p[0];
			if (p.length === 2) {
				const r2 = p[1];

				links.push({
					source: resToId(r2),
					target: resToId(r1),
					value: 1,
				});
			}
		});

		console.log('Vizualization data:', nodes, links);

		// svg dimensions should fit the container
		let [w, h] = [
			(containerRef.current as HTMLDivElement).offsetWidth,
			(containerRef.current as HTMLDivElement).offsetHeight,
		];

		ForceGraph(
			{
				nodes,
				links,
				svgRef: ref.current,
			},
			{
				width: w,
				height: h,
			}
		);

		// TODO Add RNA colors
		// type cmap = {
		// 	[key in DNAResidues]: string;
		// };
		// const ColorMap: cmap = {
		// 	[DNAResidues.DA]: '#00897b',
		// 	[DNAResidues.DT]: '#c2185b',
		// 	[DNAResidues.DG]: '#3949ab',
		// 	[DNAResidues.DC]: '#ffa000',
		// };
		// const GetColor = (r: ResidueMeta): string => {
		// 	if (r.name in DNAResidues) {
		// 		return ColorMap[r.name as DNAResidues];
		// 	}
		// 	return GetHoverColor(r);
		// };
		// const GetHoverColor = (r: ResidueMeta): string => {
		// 	return '#95fe44';
		// };

		// // Clean up svg initially
		// d3.select(ref.current).selectAll('*').remove();

		// // Start generating new chart

		// // Width and height of svg
		// const [w, h] = [900, 500];
		// // Margins x and y
		// const [mX, mY] = [200, 40];

		// const iFinder = new InteractionsFinder(polymers, dispatch);

		// const pairs = iFinder.watsonCrickPairs();

		// const visualizationData = iFinder.generateVisualizationScaffold();
		// let nucleoAcidsData: D3Element[] = [];

		// // Visualization not initialized
		// if (visualizationData.chain1 === null) {
		// 	return;
		// }

		// visualizationData?.chain1.forEach((r) => {
		// 	nucleoAcidsData.push({
		// 		x: 0,
		// 		y: r.index,
		// 		data: r.residue,
		// 		chainId: r.residue.polymerChainIdentifier,
		// 		visualizationResidue: r,
		// 	});
		// });

		// if (visualizationData.chain2 !== null) {
		// 	visualizationData.chain2.forEach((r) => {
		// 		nucleoAcidsData.push({
		// 			x: 1,
		// 			y: r.index,
		// 			data: r.residue,
		// 			chainId: r.residue.polymerChainIdentifier,
		// 			visualizationResidue: r,
		// 		});
		// 	});
		// }

		// let maxResidues = Math.max(
		// 	visualizationData.chain1.length,
		// 	visualizationData.chain2 !== null ? visualizationData.chain2.length : 0
		// );
		// let numAcids = visualizationData.chain2 !== null ? 2 : 1;

		// let yScale = d3
		// 	.scaleLinear()
		// 	.domain([0, maxResidues])
		// 	.range([0 + mY, h - mY]);

		// let xScale = d3
		// 	.scaleLinear()
		// 	.domain([0, numAcids])
		// 	.range([0 + mX, w - mX]);

		// const rSize = 10;

		// const tooltipEl = d3.select(tooltip.current);
		// const svg = ref.current;
		// const chart = d3
		// 	.select(svg)
		// 	.attr('width', w)
		// 	.attr('height', h)
		// 	.selectAll()
		// 	.data(nucleoAcidsData)
		// 	.enter()
		// 	.append('circle')
		// 	.attr('cx', (a: any) => xScale(a.x))
		// 	.attr('cy', (a: any) => yScale(a.y))
		// 	.style('fill', function (residue: D3Element) {
		// 		return GetColor(residue.data);
		// 	})
		// 	.attr('r', rSize)
		// 	.on('mouseover', async function (event: MouseEvent, residue: D3Element) {
		// 		d3.select(this)
		// 			.attr('r', 15)
		// 			.style('fill', function () {
		// 				return GetHoverColor(residue.data);
		// 			});

		// 		let b = residue.data as Residue;

		// 		try {
		// 			let interactionsHtml =
		// 				'<div><b>Interactions are currently disabled</b></div>';
		// 			// residue.visualizationResidue.interactions.forEach((i:Interaction)=>{
		// 			//     interactionsHtml += `<div>${i.polymerKind}:${i.residue.name+":"+i.residue.sequenceNumber} ${i.meta?.distance}</div>`;
		// 			// });

		// 			await tooltipEl
		// 				.html(
		// 					`<div>Residue: ${b.name} seqno: ${b.sequenceNumber} ChainID: ${residue.chainId}</div>${interactionsHtml}`
		// 				)
		// 				.transition()
		// 				.duration(50)
		// 				.style('left', event.pageX + 'px')
		// 				.style('top', event.pageY + 'px')
		// 				.end();
		// 		} catch (e) {
		// 			console.log('Something went wrong: ', e);
		// 		}

		// 		tooltipEl.style('opacity', 1);
		// 	})
		// 	.on('mouseout', function (event: MouseEvent, residue: D3Element) {
		// 		tooltipEl.style('opacity', 0);
		// 		d3.select(this)
		// 			.attr('r', rSize)
		// 			.style('fill', function () {
		// 				return GetColor(residue.data);
		// 			});
		// 	});

		// const x = atoms.map(a=>a.coords.x)
		// const y = atoms.map(a=>a.coords.y)
		// const z = atoms.map(a=>a.coords.z)

		// const tooltipEl = d3.select(tooltip.current)

		// const rSize = 3;
		// const chart = d3.select(ref.current)
		//     .attr('width', w)
		//     .attr('height', h)
		//     .selectAll('circle')
		//     .data(atoms)
		//     .enter()
		//         .append('circle')
		//         .attr('cx', (a:Atom)=>xScale(a.coords.x))
		//         .attr('cy', (a:Atom)=>yScale(a.coords.y))
		//         .style('fill', '#867')
		//         .on('mouseover', async function( event:MouseEvent, atom:Atom){
		//             d3.select(this).attr('r', 15)
		//                 .style('fill', '#5ef');

		//             try{
		//                 await tooltipEl
		//                 .html(`Residue: ${atom.residueName} Atom name: ${atom.name} Atom element: ${atom.element}`)
		//                 .transition()
		//                 .duration(50)
		//                 .style('left', event.pageX+"px")
		//                 .style('top', event.pageY+"px")
		//                 .end();
		//             }catch(e){
		//                 console.log("Something went wrong: ",e);
		//             }

		//             tooltipEl.style('opacity', 1)
		//         })
		//         .on('mouseout', function(d:Atom){
		//             tooltipEl.style('opacity', 0)
		//             d3.select(this).attr('r', rSize)
		//             .style('fill', '#867')
		//         });

		// chart.transition()
		//     .attr('r', rSize)
		//     .delay(function(a: Atom, i){
		//         return i * 5
		//     })
		//     .duration(500)
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
