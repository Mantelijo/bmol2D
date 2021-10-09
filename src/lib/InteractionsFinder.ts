import { Polymer, PolymerKind, ResidueMeta } from "./format/atoms";
import {Action} from "../Store";
import { calculateCenters, distanceBetween2Points } from "./AtomsFunctions";
import { InteractionType, THRESHOLD_DISTANCE } from "./format/interactions";
import { Visualization } from "./format/visualization";

export class InteractionsFinder{

    nucleicAcids: Polymer[] = [];
    proteins: Polymer[] = [];

    // This will be used to generate visualization
    visualization: Visualization = {chain1:null, chain2:null};

    constructor(
        public polymers: Polymer[],
        public dispatch: React.Dispatch<Action>
    ){
        this.prepareObjects();
    }

    // Finds polymers to work with, calculates centers for residues.
    prepareObjects(){
        this.nucleicAcids = this.findNucleoAcids();
        this.proteins = this.findProteins();

        this.nucleicAcids.forEach(polymer=>calculateCenters(polymer));
        this.proteins.forEach(polymer=>calculateCenters(polymer));
    }

    findProteins(): Polymer[]{
        return this.polymers.filter(p=>{
            return [PolymerKind.Protein].indexOf(p.kind) !== -1
        })
    }

    findNucleoAcids(): Polymer[]{
        return this.polymers.filter(p=>{
            return [PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind) !== -1
        })
    }

    // Generates visualization.chain1 and if possible visualization.chain2
    generateVisualizationScaffold(){
        let currentIndex = 0;
        this.nucleicAcids.forEach(a=>{
            a.residues.forEach(resA=>{

                // const dist = distanceBetween2Points(resA.center,)
            })
        });
    }

    // Compares residue centers of nucleic acid and proteins
    // If distance between centers is smaller than defined THRESHOLD_DISTANCE times 2,
    // we can try to search for THRESHOLD_DISTANCE distance between nucleic acid 
    // and protein residue atoms
    thresholdInteractions(){
        this.nucleicAcids.forEach((nacid, nacidI)=>{
            nacid.residues.forEach((nacidResidue, nacidResidueI)=>{
                this.proteins.forEach(p=>{
                    p.residues.forEach(pResidue=>{
                        const distanceResidues = distanceBetween2Points(nacidResidue.center, pResidue.center);

                        // Residues might contain atoms that are less than THRESHOLD_DISTANCE 
                        // amount apart even if residues themselves are 2 times further.
                        if(distanceResidues <= THRESHOLD_DISTANCE*2){
                            nacidResidue.atoms.forEach(nacidAtom=>{
                                pResidue.atoms.forEach(pAtom=>{
                                    const distanceAtoms = distanceBetween2Points(nacidAtom.coords, pAtom.coords);
                                    if(distanceAtoms <= THRESHOLD_DISTANCE){

                                        //  Remove non ResidueMeta properties for performance
                                        let {hash, name, sequenceNumber} = pResidue;
                                        this.nucleicAcids[nacidI].residues[nacidResidueI].interactions.push({
                                            residue:{hash, name, sequenceNumber},
                                            type: InteractionType.Threshold,
                                            polymerKind: p.kind,
                                            meta: {distance:distanceAtoms},
                                        })
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });
    }
}