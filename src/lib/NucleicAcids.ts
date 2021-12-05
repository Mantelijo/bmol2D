import { Atom, Coordinate, coordinateToArray, DNAResidues, Polymer, PolymerKind, Residue } from "./types/atoms"
import { Vector } from "./Vector";

/**
 * A value that is used to check if watson crick pair is
 */
export const WATSON_CRICK_PAIR_CALCULATION_THRESHOLD = 1.42

/**
 * Calculates and populates vectors v and o which define the plane of
 * single nucleotide.
 */
export const calculateNucleotidePlaneVectors:(p:Polymer)=> Polymer = (p) =>{
    // Only DNA or RNA have nucleotides
    if([PolymerKind.DNA, PolymerKind.RNA].indexOf(p.kind) != -1){
        // Dna/Rna residue atoms containing these names will be selected as c2, c4, c6
        // C's with single quote ' are of ribose so we only want specifically these.
        let cNames = ["C2", "C4", "C6"];

        p.residues.forEach(residue=>{
            // Find C2, C4, C6 coordinates
            let cAtoms: Coordinate[] = [];

            const atoms = residue.findAtomsByNames(cNames);
            atoms.forEach((a, i)=>{cAtoms[i] = a.coords});

            // Calculate plane vector v and point o
            if(cAtoms.length === 3){
                const c2 = Vector.fromArray(coordinateToArray(cAtoms[0]));
                const c4 = Vector.fromArray(coordinateToArray(cAtoms[1]));
                const c6 = Vector.fromArray(coordinateToArray(cAtoms[2]));
                const v = c4.subtract(c2).cross(
                    c6.subtract(c2)
                ).normalize();

        
                const o = c2.add(c4).add(c6).divide(3);
                residue.v = v;
                residue.o = o;
            }
        })
    }
    return p;
}

/**
 *  Only for DNA
 */
export function isWatsonCrickPair(r1: Residue, r2: Residue): boolean{
    return (
        (r1.name === DNAResidues[DNAResidues.DA] && r2.name === DNAResidues[DNAResidues.DT]) || 
        (r1.name === DNAResidues[DNAResidues.DT] && r2.name === DNAResidues[DNAResidues.DA]) || 
        (r1.name === DNAResidues[DNAResidues.DC] && r2.name === DNAResidues[DNAResidues.DG]) || 
        (r1.name === DNAResidues[DNAResidues.DG] && r2.name === DNAResidues[DNAResidues.DC])
    );
}