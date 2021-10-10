import { Atom, DNAResidues, PDBFile, Polymer, PolymerKind, polymerKindFromAtom, Residue, RNAResidues } from "./types/atoms"
import hash from 'object-hash';

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
     * formatAtoms parses PDB strting into Polymer[] data structure
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

        // Helper functions to quickly create objects
        const newPolymer = ():Polymer=>{
            return {
                chainIdentifier: '',
                residues: [],
                kind:PolymerKind.Unknown,
            }
        }
        const newResidue = ():Residue=>{
            return {
                atoms: [],
                name: '',
                sequenceNumber: -1,
                center: {
                    x:-1,y:-1,z:-1
                },
                hash:"",
                interactions:[],
                polymerChainIdentifier:"",
            }
        }
        // Helper to push currentResidue to currentPolymer
        const pushResidue = ():void=>{
            currentResidue.hash = hash(currentResidue);
            currentPolymer.residues.push(currentResidue);
        }
        
        let currentPolymer = newPolymer()
        let currentResidue = newResidue()

        // Polymer kind determination functionality
        type currentPolymerKind = {
            [key in PolymerKind|number|string]:number
        };
        // Realistically - there should be only 1 PolymerKind for given polymer, but in case it is not, we can
        // check which kind appears more often than others to determine true PolymerKind.
        const determinePolymerKindAndReset = (c?:currentPolymerKind): [currentPolymerKind, PolymerKind] | currentPolymerKind=>{
            let obj = {
                [PolymerKind.DNA]:0,
                [PolymerKind.RNA]:0,
                [PolymerKind.Protein]:0           
            }
            if(c===undefined){
                return obj;
            }
            return [
                obj, // reset obj
                // Get the PolymerKind that has the largest number of occurrences
                Object.keys(c).reduce((a:any,b:any)=>c[a]>c[b]?a:b) as unknown as PolymerKind
            ]
        }
        let currentPolymerKindCounter = determinePolymerKindAndReset() as currentPolymerKind;

        // Here we will process the pdb text
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

                // Chain identifier for current polymer is 1 letter
                let chainIdentifier = line.slice(21,22);
                currentPolymer.chainIdentifier = chainIdentifier;

                // Construct new atom entry
                const atom: Atom = {
                    coords:{
                        x,y,z
                    },
                    name,
                    element,
                    residueName,
                    residueSequenceNumber,
                }
                
                // Increment probable polymer kind from residue
                currentPolymerKindCounter[polymerKindFromAtom(atom)]++

                // Set residue sequence number and residue name for first time
                if (currentResidue.sequenceNumber === -1){
                    currentResidue.name = atom.residueName;
                    currentResidue.sequenceNumber = residueSequenceNumber;
                    currentResidue.polymerChainIdentifier = chainIdentifier;
                }

                // If residue sequence number does not match with current atom's - add residue to polymer and reset currentResidue to a new one
                if (residueSequenceNumber !== currentResidue.sequenceNumber){
                    pushResidue();
                    currentResidue = newResidue();
                    currentResidue.name = atom.residueName;
                    currentResidue.sequenceNumber = residueSequenceNumber;
                    currentResidue.polymerChainIdentifier = chainIdentifier;
                }

                currentResidue.atoms.push(atom)
            }   
            // TER indicates the end of current polymer (chain of residues)
            if(line.startsWith("TER")){
                // Don't forget to push residue
                pushResidue();

                // Get polymer kind and reset counter
                let [c, kind] = determinePolymerKindAndReset(currentPolymerKindCounter) as [currentPolymerKind, PolymerKind]
                currentPolymerKindCounter = c;
                currentPolymer.kind = kind;

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