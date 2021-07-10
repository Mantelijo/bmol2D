import { polygonArea } from "d3"
import { Atom, AtomRemoteness, PDBFile, Polymer, Residue } from "./format/atoms"

export class PDBHandler{
    file: File

    constructor(file: File){
        this.file = file
    }

    async readData(): Promise<PDBFile>{
        let text = await this.file.text()
        return this.format(text)
    }

    format(text: string): PDBFile{
        return {
            raw: this.formatText(text),
            polymers: this.formatPolymers(text)
        }
    }

    formatText(text: string): string{
        return text.split('\n')
            .map((line, index)=>index.toString()+". "+line)
            .join("\n")
    }

    /**
     * formatAtoms parses PDB strting into data structure
     * 
     * PDB File keywords:
     * ATOM - atom information
     * TER - terminates sequence of previously provided ATOMs
     * 
     * @param text 
     * @returns 
     */
    formatPolymers(text: string): Polymer[]{
        let result: Polymer[] = [];

        // Helper functions 
        const newPolymer = ():Polymer=>{
            return {
                chainIdentifier: '',
                residues: []
            }
        }
        const newResidue = ():Residue=>{
            return {
                atoms: [],
                name: '',
                sequenceNumber: -1,
            }
        }
        
        let currentPolymer = newPolymer()
        let currentResidue = newResidue()

        text.split("\n").forEach(line=>{
            // Parse ATOM lines
            if(line.startsWith("ATOM")){
                // https://www.cgl.ucsf.edu/chimera/docs/UsersGuide/tutorials/pdbintro.html
                let x = parseFloat(line.slice(30, 38).trim());
                let y = parseFloat(line.slice(38, 46).trim());
                let z = parseFloat(line.slice(46, 54).trim());

                let name = line.slice(12,16).trim();
                let residueName = line.slice(17, 20).trim()
                let element = line.slice(76,78).trim();
                let residueSequenceNumber = parseInt(line.slice(22,26).trim());

                // Chain identifier for current polymer
                let chainIdentifier = line.slice(21,22);
                currentPolymer.chainIdentifier = chainIdentifier;

                const atom: Atom = {
                    coords:{
                        x,y,z
                    },
                    name,
                    element,
                    residueName,
                }

                // Set residue sequence number for first time
                if (currentResidue.sequenceNumber === -1){
                    currentResidue.name = atom.residueName;
                    currentResidue.sequenceNumber = residueSequenceNumber;
                }

                // If residue name or sequence number does not match with current atom's - add residue to polymer and reset residue
                if (residueName !== currentResidue.name && residueSequenceNumber !== currentResidue.sequenceNumber){
                    currentPolymer.residues.push(currentResidue);
                    currentResidue = newResidue();
                    currentResidue.name = atom.residueName;
                }

                currentResidue.atoms.push(atom)
            }   
            // TER indicates the end of current polymer (chain of residues)
            if(line.startsWith("TER")){
                // Save polymer
                result.push(currentPolymer);

                // Reset current polymer and residue
                currentPolymer = newPolymer();
                currentResidue = newResidue();
            }
        });
        
        return result;
    }
}