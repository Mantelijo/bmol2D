import { DNAResidues, Polymer, PolymerKind, ResidueMeta } from "./types/atoms";
import {Action} from "../Store";
import { calculateCenters, distanceBetween2Points, isWatsonCrickPair, ResidueMetaFromResidue } from "./AtomsFunctions";
import { InteractionType, THRESHOLD_DISTANCE } from "./types/interactions";
import { Visualization } from "./types/visualization";

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

    // Calculates watson crick pairs for DNA
    // Chain1 and Chain2 must be DNA polymers
    watsonCrickPairs(chain1: Polymer, chain2: Polymer){
        chain1.residues.forEach(r1=>{
            chain2.residues.forEach(r2=>{
                const r1C2DistToR2VO = "";
            });
        });
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
    // This should be called once all required interactions are calculated
    generateVisualizationScaffold(): Visualization{
        if(this.nucleicAcids.length <= 0){
            throw Error("Nucleic acids are not initialized");
        }

        // DNA We assume that chains in source files (PDB, etc) appear in
        // order i.e. first and second chains are from the same DNA
        // strand.
        if(this.nucleicAcids.length >= 2 && this.nucleicAcids[0].kind === PolymerKind.DNA){
            this.visualization.chain1 = [];
            this.visualization.chain2 = [];
            const first = this.nucleicAcids[0];
            const second = this.nucleicAcids[1];

            this.watsonCrickPairs(first, second);

            // Smallest distances for first chain. Each item is for each
            // residue.
            const distancesFirst = new Array(first.residues.length).fill(+Infinity)
            first.residues.forEach((r1, i1)=>{
                second.residues.forEach((r2, i2)=>{
                    if(isWatsonCrickPair(r1, r2)){
                        distancesFirst[i2] = Math.min(distancesFirst[i2], distanceBetween2Points(r1.center, r2.center));
                    }
                })
            });

            // It looks like that usually the PDB files can contain up to
            // 1 nucleotide protrusion in DNA helix. Also, it seems that DNA's
            // second strand must be reversed (5'-3' -> 3'->5') when matching 
            // with the first strand.
            
            // Tracks the next index for visualization residue index property 
            let currentIndex = 0;

            // Tracks the number of added residues from chain2, since we
            // don't want to include already included chain2 residues, as
            // this can happen in the inner loop
            let secondChainIncludedAmount = 0

            for(let i=0;i<first.residues.length;i++){
                let res1 = first.residues[i];
                // Second chain is reversed to 3'->5' to match first one
                // We assume that chain lengths are identical (hence -1-i)
                for(let j=second.residues.length-1-secondChainIncludedAmount;j>0;--j){
                    let res2 = second.residues[j]

                    // First residue from first chain might be a
                    // protrusion, so check if j-1 might match with i
                    // (Which would mean j is protrusion)
                    if(!isWatsonCrickPair(res1, res2) && j-1 > 0 && i === 0){
                        let newRes2 =  second.residues[j-1]
                        if(isWatsonCrickPair(res1, newRes2)){
                            // This case means that j is protrusion, so we
                            // add it as a lonely nucleotide to chain2 
                            this.visualization.chain2.push({
                                index: currentIndex,
                                residue: ResidueMetaFromResidue(newRes2),
                                interactions: newRes2.interactions,
                            });
                            secondChainIncludedAmount++;
                        }else{
                            // i is protrusion
                            this.visualization.chain1.push({
                                index: currentIndex,
                                residue: ResidueMetaFromResidue(res1),
                                interactions: res1.interactions,
                            });
                        }
                        
                        currentIndex++;
                        break;
                    }

                    // Valid watson crick pair
                    if(isWatsonCrickPair(res1, res2)){
                        this.visualization.chain1.push({
                            index: currentIndex,
                            residue: ResidueMetaFromResidue(res1),
                            interactions: res1.interactions,
                        });
                        if(secondChainIncludedAmount <= second.residues.length){
                            this.visualization.chain2.push({
                                index: currentIndex,
                                residue: ResidueMetaFromResidue(res2),
                                interactions: res2.interactions,
                            });
                            secondChainIncludedAmount++;
                        }
                        currentIndex++;
                        break;
                    }
                }
                
                // If chain1 is longer than chain2 - fill in the
                // leftover chain1 residues
                if(secondChainIncludedAmount > second.residues.length){
                    this.visualization.chain1.push({
                        index: currentIndex,
                        residue: ResidueMetaFromResidue(res1),
                        interactions: res1.interactions,
                    });
                    currentIndex++;
                    break;
                }
            }

            // If chain1 is done, but chain2 is still not completely
            // included, then we need to include it.
            console.log("secondChainIncludedAmount", secondChainIncludedAmount, second.residues.length)
            if(secondChainIncludedAmount< second.residues.length){
                for(let i=second.residues.length-secondChainIncludedAmount-1; i>=0; --i){
                    this.visualization.chain2.push({
                        index: currentIndex,
                        residue: ResidueMetaFromResidue(second.residues[i]),
                        interactions: second.residues[i].interactions,
                    });
                    currentIndex++;
                    secondChainIncludedAmount++;
                }
            }

        }
        // RNA
        else{
            this.visualization.chain1 = [];
            this.visualization.chain2 = null;
            // TODO
        }

        return this.visualization;
    }

    // Compares residue centers of nucleic acid and proteins If distance
    // between centers is smaller than defined THRESHOLD_DISTANCE times 2,
    // we can try to search for THRESHOLD_DISTANCE distance between
    // nucleic acid and protein residue atoms
    thresholdInteractions(){
        this.nucleicAcids.forEach((nacid, nacidI)=>{
            nacid.residues.forEach((nacidResidue, nacidResidueI)=>{
                this.proteins.forEach(p=>{
                    p.residues.forEach(pResidue=>{
                        const distanceResidues = distanceBetween2Points(nacidResidue.center, pResidue.center);

                        // Residues might contain atoms that are less than
                        // THRESHOLD_DISTANCE amount apart even if
                        // residues themselves are 2 times further.
                        if(distanceResidues <= THRESHOLD_DISTANCE*2){
                            nacidResidue.atoms.forEach(nacidAtom=>{
                                pResidue.atoms.forEach(pAtom=>{
                                    const distanceAtoms = distanceBetween2Points(nacidAtom.coords, pAtom.coords);
                                    if(distanceAtoms <= THRESHOLD_DISTANCE){

                                        this.nucleicAcids[nacidI].residues[nacidResidueI].interactions.push({
                                            residue:ResidueMetaFromResidue(pResidue),
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