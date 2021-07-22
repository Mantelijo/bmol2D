import { Polymer, PolymerKind } from "./format/atoms";

const THRESHOLD_DISTANCE = 5;

export class InteractionsFinder{

    nucleoAcids: Polymer[] = [];
    proteins: Polymer[] = [];

    constructor(public polymers: Polymer[]){}

    calculateInteractions(){
        this.nucleoAcids = this.findNucleoAcids();
        this.proteins = this.findProteins();
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
}