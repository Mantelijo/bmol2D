/**
 * Interfaces and types defined in this file are for visualizations only.
 * Interactions or other calculations should not happen with objects which
 * implement these interfaces.
 */

import { PolymerKind, Residue, ResidueMeta } from "./atoms";
import { Interaction } from "./interactions";



// Single chain residue to visualize, includes residue information along
// with all the interactions info. Usually this will be a DNA or RNA,
// since all visualizations are based on nucleic acids.
export interface VisualizationResidue {
    residue: ResidueMeta,

    // Explicit index that is used for building nucleic acid chains.
    // Residue from sister chain with exact same index means a
    // Watson-Crick pair (AT,GC). If this residue does not have a pair,
    // that means that it is either RNA (and chain2 will be null in
    // Visualization), or data contains DNA protrusions and simply this
    // residue is a lonely protrusion in the chain. (Example 1zaa ends)
    index: number,

    // A list of interactions for this residue
    interactions: Interaction[]
}

// Visualization is the final product, that our Viewer.tsx can use to
// build the visualizations. There can be a single stranded RNA/DNA in
// chain1 and additionally, if provided polymer is DNA, chain2 can be
// another DNA strand.
export interface Visualization{
    // Only one case is possible where chain1 is null: data is not yet
    // initialized
    chain1: null | VisualizationResidue[], 
    
    // No chain2 means molecule is single stranded
    chain2: null | VisualizationResidue[]
}