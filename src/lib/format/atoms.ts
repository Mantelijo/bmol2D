/**
 * Formats of spatial data for visualization
 */

export type Coordinate = {
    x: number,
    y: number,
    z: number, 
}

export type AtomKind =  "O" | "C" | "N" | "P" | "S" | string

export interface Atom{
    coords: Coordinate,
    kind: AtomKind
}


/**
 * File formats 
 */

export interface PDBFile{
    atoms: Atom[],
    raw: string,
}

