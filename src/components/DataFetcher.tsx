import React, { useState, ChangeEventHandler, ChangeEvent } from "react";
import { PDBHandler } from "../lib/PDBHandler";
import { PDBFile } from "../lib/format/atoms";

export function DataFetcher(){

    const [pdb, setPDB] = useState<PDBFile |undefined>(undefined);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event: ChangeEvent)=>{
        console.log(event)
        let f = (event.target as HTMLInputElement).files?.item(0);

        if(f !== null){
            setPDB(
                await new PDBHandler(f as File).readData()
            )
        }
    }

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
        </div>
    );
}