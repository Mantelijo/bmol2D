import React, { useState, ChangeEventHandler, ChangeEvent, useEffect } from "react";
import { PDBHandler } from "../lib/PDBHandler";
import { Atom, PDBFile } from "../lib/format/atoms";

type AtomsArray = Atom[]

type Props = {
    atoms: Atom[]
    setAtoms: any
}

export function DataFetcher({atoms, setAtoms}: Props){
    const [pdb, setPDB] = useState<PDBFile |undefined>(undefined);

    useEffect(()=>{
        console.log("I have been started!");

        return ()=>{
            console.log("I have been deleted")
        }
    }, [])

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event: ChangeEvent)=>{
        console.log(event)
        let f = (event.target as HTMLInputElement).files?.item(0);

        if(f !== null){
            setPDB(
                await new PDBHandler(f as File).readData()
            )
          
        }
    }
    useEffect(()=>{
        if(pdb?.atoms){
            setAtoms((pdb as PDBFile).atoms)
        }
    })

    let pdbText: JSX.Element|undefined;
    if(pdb !== undefined && pdb.atoms.length > 0){
        pdbText = (
            <div className="mt-5">
                <div className="mb-1">Provided input file</div>
                <textarea className="text-sm w-full border h-96 border-blue-100" value={pdb.raw} readOnly/>
            </div>
        )
    }

    return (
        <div className="p-5 max-h-screen overflow-auto break-words">
            <div>
                <input type="file" onChange={handleFileChange}/> 
            </div>
            {pdbText}
            {(pdb !== undefined && pdb.atoms.length > 0)&&
                <div>
                    Number of atoms: {pdb.atoms.length}
                </div>
            }
        </div>
    );
}