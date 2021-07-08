import React, { useEffect } from "react";
import * as d3 from 'd3'
import { Atom } from "../lib/format/atoms";

type Props = {
    atoms: Atom[]
}

export function Viewer({atoms}: Props) {

    let ref = React.createRef<SVGSVGElement>()
    let tooltip = React.createRef<HTMLDivElement>()

    function initD3(){
        if(!ref){
            return;
        }

        console.log("Atoms were recalculated: ", atoms.length)

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
                .attr('style', 'fill:#867;')
                .on('mouseover', async function( event:MouseEvent, atom:Atom){
                    d3.select(this).attr('r', 15)
                    await tooltipEl
                        .html(atom.kind)
                        .transition()
                        .delay(500)
                        .style('left', event.pageX+"px")
                        .style('top', event.pageY+"px")
                        .end();

                    tooltipEl.style('opacity', 1)
                })
                .on('mouseout', function(d:Atom){
                    tooltipEl.style('opacity', 0)
                    d3.select(this).attr('r', 7)
                });

        chart.transition()
            .attr('r', 7)
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