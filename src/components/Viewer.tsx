import React, { useContext, useEffect } from "react";
import * as d3 from 'd3'
import { Atom, Polymer, Residue, PolymerKind } from "../lib/format/atoms";
import {context} from '../Store';
import { InteractionsFinder } from "../lib/InteractionsFinder";

export function Viewer() {
    const [state, dispatch] = useContext(context)
    const polymers = state.polymers;

    let ref = React.createRef<SVGSVGElement>()
    let tooltip = React.createRef<HTMLDivElement>()

    // Construct atoms from polymers that are either DNA or RNA, as we only visualize these
    const atoms: Atom[] = [];
    polymers.filter((p)=>[PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind)!==-1)
        .map(({residues})=>{
            residues.map((r)=>atoms.push(...r.atoms))
        })

    function initD3(){
        if(!ref || polymers.length <= 0){
            return;
        }

        // Clean up svg initially
        d3.select(ref.current).selectAll('*').remove();

        // Start generating new chart

        // Width and height of svg
        const [w, h] = [900,500];
        // Margins x and y
        const [mX, mY] = [200, 40];

        const iFinder = new InteractionsFinder(polymers, dispatch);
        let nucleoAcids = iFinder.nucleicAcids;
        let nucleoAcidsData:any = []; 
        nucleoAcids.map((n, index)=>{
            n.residues.map((r, index2)=>{
                nucleoAcidsData.push({ x: index, y: index2, data: r})
            });
        });

        let maxResidues = nucleoAcids.map(a=>a.residues.length)
            .reduce((a, b)=>{
                return a > b?a:b;
            })
        let numAcids = nucleoAcids.length;

        let yScale = d3.scaleLinear()
            .domain([0, maxResidues])
            .range([0+mY, h-mY]);

        let xScale = d3.scaleLinear()
            .domain([0, numAcids])
            .range([0+mX, w-mX]);

        const rSize = 10;
    
        const tooltipEl = d3.select(tooltip.current)
        const chart =  d3.select(ref.current)
            .attr('width', w)
            .attr('height', h)
            .selectAll()
            .data(nucleoAcidsData)
                .enter()
                .append('circle')
                .attr('cx', (a:any)=>xScale(a.x))
                .attr('cy', (a:any)=>yScale(a.y))
                .style('fill', '#867')
                .attr('r', rSize)
                .on('mouseover', async function( event:MouseEvent, a:any){
                    d3.select(this).attr('r', 15)
                        .style('fill', '#5ef');
                    
                    let b = a.data as Residue

                    try{
                        await tooltipEl
                        .html(`Residue: ${b.name} seqno: ${b.sequenceNumber}`)
                        .transition()
                        .duration(50)
                        .style('left', event.pageX+"px")
                        .style('top', event.pageY+"px")
                        .end();
                    }catch(e){
                        console.log("Something went wrong: ",e);
                    }

                    tooltipEl.style('opacity', 1)
                })
                .on('mouseout', function(d:Atom){
                    tooltipEl.style('opacity', 0)
                    d3.select(this).attr('r', rSize)
                    .style('fill', '#867')
                });
                

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

    useEffect(initD3, [polymers])

    return (
        <>
            <div>
                {state.simpleStuffy}
            </div>
            <div className="p-5 flex items-center flex-col">
                <div>Total number of atoms: {atoms.length}</div>
                <svg ref={ref}></svg>
                <div ref={tooltip} style={{position:"absolute", opacity:0, background:"#fff"}}></div>
            </div>
        </>
    );  
}