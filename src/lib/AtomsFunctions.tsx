/**
 * This file defines some helper functions which are used to 
 * process atoms, residues, polymers and related functionality.
 */

import { Coordinate, DNAResidues, Polymer, Residue, ResidueMeta } from "./types/atoms";

// Calculate centers for residues and returns same polymer with
// calculated center coordinates
export function calculateCenters(p: Polymer): Polymer{
    p.residues.forEach((residue, i)=>{
        const coordinate: Coordinate = {
            x:0,y:0,z:0
        };
        residue.atoms.forEach(atom=>{
            coordinate.x += atom.coords.x;
            coordinate.y += atom.coords.y;
            coordinate.z += atom.coords.z;
        });
        coordinate.x = coordinate.x / residue.atoms.length;  
        coordinate.y = coordinate.y / residue.atoms.length;  
        coordinate.z = coordinate.z / residue.atoms.length;  

        p.residues[i].center = coordinate;
    });
    return p;
};

// Calculates arithmetic distance between 2 coordinates
export function distanceBetween2Points(p1: Coordinate, p2: Coordinate): number{
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + 
        Math.pow(p1.y - p2.y, 2) + 
        Math.pow(p1.z - p2.z, 2) 
    );
}

// Helper function, since I could not find a Typescript'y way to do this
export function ResidueMetaFromResidue(r: Residue): ResidueMeta{
    const {sequenceNumber, hash, name, polymerChainIdentifier}: ResidueMeta = r
    return {sequenceNumber, hash, name, polymerChainIdentifier}
}

// Only for DNA
export function isWatsonCrickPair(r1: Residue, r2: Residue): boolean{
    return (
        (r1.name === DNAResidues[DNAResidues.DA] && r2.name === DNAResidues[DNAResidues.DT]) || 
        (r1.name === DNAResidues[DNAResidues.DT] && r2.name === DNAResidues[DNAResidues.DA]) || 
        (r1.name === DNAResidues[DNAResidues.DC] && r2.name === DNAResidues[DNAResidues.DG]) || 
        (r1.name === DNAResidues[DNAResidues.DG] && r2.name === DNAResidues[DNAResidues.DC])
    );
}