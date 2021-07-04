import { Atom, PDBFile } from "./format/atoms"

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
            raw: text,
            atoms: this.formatAtoms(text)
        }
    }

    formatAtoms(text: string): Atom[]{
        let result: Atom[] = [];
        text.split("\n").forEach(line=>{
            if(line.startsWith("ATOM")){

                // https://www.cgl.ucsf.edu/chimera/docs/UsersGuide/tutorials/pdbintro.html
                let x = parseFloat(line.slice(30, 38).trim());
                let y = parseFloat(line.slice(38, 46).trim());
                let z = parseFloat(line.slice(46, 54).trim());

                let elementSymbol = line.slice(76,78).trim();

                result.push({
                    coords:{
                        x,y,z
                    },
                    kind:elementSymbol
                })
            }   
        });
        
        return result;
    }
}