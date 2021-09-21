import { Polymer, PolymerKind } from "./format/atoms";
import {Action} from "../Store";
import { calculateCenters, distanceBetween2Points } from "./AtomsFunctions";
import { InteractionType, THRESHOLD_DISTANCE } from "./format/interactions";



export class InteractionsFinder{

    nucleicAcids: Polymer[] = [];
    proteins: Polymer[] = [];

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
                        // amount apart
                        if(distanceResidues <= THRESHOLD_DISTANCE*2){
                            nacidResidue.atoms.forEach(nacidAtom=>{
                                pResidue.atoms.forEach(pAtom=>{
                                    const distanceAtoms = distanceBetween2Points(nacidAtom.coords, pAtom.coords);
                                    if(distanceAtoms <= THRESHOLD_DISTANCE){

                                        // Here we have a possible interaction 
                                        console.log("INTERACTION WAS FOUND", distanceAtoms, nacidAtom, pAtom);
                                        this.nucleicAcids[nacidI].residues[nacidResidueI].interactions.push({
                                            residue1:nacidResidue,
                                            residue2:pResidue,
                                            type: InteractionType.Threshold,
                                            meta: {distance:distanceAtoms},
                                            nucleoAcidChainIdentifier: nacid.chainIdentifier,
                                            nucleoAcidResidueSequenceNumber: nacidResidue.sequenceNumber,
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