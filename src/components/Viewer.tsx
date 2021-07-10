import React, { useEffect } from "react";
import * as d3 from 'd3'
import { Atom, Polymer } from "../lib/format/atoms";

type Props = {
    polymers: Polymer[]
}

export function Viewer({polymers}: Props) {

    let ref = React.createRef<SVGSVGElement>()
    let tooltip = React.createRef<HTMLDivElement>()

    // Construct atoms from polymer
    const atoms: Atom[] = [];
    polymers.map(({residues})=>{
        residues.map((r)=>atoms.push(...r.atoms))
    })

    function initD3(){
        if(!ref){
            return;
        }

        // Clean up svg initially
        d3.select(ref.current).selectAll('*').remove();

        // Start generating new chart
        console.log("Polymenrs were recalculated: ", polymers.length)

        // Width and height of svg
        const [w, h] = [500,500];

        const x = atoms.map(a=>a.coords.x)
        const y = atoms.map(a=>a.coords.y)
        const z = atoms.map(a=>a.coords.z)

        let yScale = d3.scaleLinear()
            .domain([Math.min(...y), Math.max(...y)])
            .range([0, h])

        let xScale = d3.scaleLinear()
            .domain([Math.min(...x), Math.max(...x)])
            .range([0, w])
        
        const tooltipEl = d3.select(tooltip.current)

        const rSize = 3;
        let barWidth = w/x.length;
        const chart = d3.select(ref.current)
            .attr('width', w)
            .attr('height', h)
            .selectAll('circle')
            .data(atoms)
            .enter()
                .append('circle')
                .attr('cx', (a:Atom)=>xScale(a.coords.x))
                .attr('cy', (a:Atom)=>yScale(a.coords.y))
                .style('fill', '#867')
                .on('mouseover', async function( event:MouseEvent, atom:Atom){
                    d3.select(this).attr('r', 15)
                        .style('fill', '#5ef');

                    try{
                        await tooltipEl
                        .html(`Residue: ${atom.residueName} Atom name: ${atom.name} Atom element: ${atom.element}`)
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

        chart.transition()
            .attr('r', rSize)
            .delay(function(a: Atom, i){
                return i * 5
            })
            .duration(500)
    }

    useEffect(initD3, [atoms])

    return (
        <div className="p-5 flex items-center flex-col">
            <div>Total number of atoms: {atoms.length}</div>
            <svg ref={ref}></svg>
            <div ref={tooltip} style={{position:"absolute", opacity:0, background:"#fff"}}></div>
        </div>
    );  
}