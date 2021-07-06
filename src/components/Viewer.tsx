import React, { useEffect } from "react";
import * as d3 from 'd3'
import { Atom } from "../lib/format/atoms";

type Props = {
    atoms: Atom[]
}

export function Viewer({atoms}: Props) {

    let ref = React.createRef<SVGSVGElement>()

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

        let scale = d3.scaleLinear([d3.min(x), d3.max(x)])

        let barWidth = w/x.length;
        d3.select(ref.current)
            .attr('width', w)
            .attr('height', h)
            .selectAll('rect')
            .data(x)
            .enter()
                .append('rect')
                .attr('y', (d:number)=>w-d)
                .attr('height', (d)=>d)
                .attr('width', barWidth)
                .attr('x', (d, nth)=>barWidth*nth)
    }

    useEffect(initD3, [atoms])

    return (
        <div className="p-5 flex items-center flex-col">
            <div>Total number of atoms: {atoms.length}</div>
            <svg ref={ref}></svg>
        </div>
    );  
}