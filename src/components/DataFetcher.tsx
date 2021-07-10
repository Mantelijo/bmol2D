import React, { useState, ChangeEventHandler, ChangeEvent, useEffect } from "react";
import { PDBHandler } from "../lib/PDBHandler";
import { PDBFile, Polymer } from "../lib/format/atoms";

type Props = {
    setPolymers: React.Dispatch<React.SetStateAction<Polymer[]>>
}

export function DataFetcher({setPolymers}: Props){
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
        if(pdb?.polymers){
            setPolymers((pdb as PDBFile).polymers)
        }
    })

    let pdbText: JSX.Element|undefined;
    if(pdb !== undefined && pdb.polymers.length > 0){
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
            {(pdb !== undefined && pdb.polymers.length > 0)&&
                <div>
                   Polymers: 
                   {pdb.polymers.map(({residues, chainIdentifier}, k)=>
                       <div className="ml-2" key={k}>
                            Chain: <b>{chainIdentifier}</b>
                            <div className="ml-2">
                                {residues.map(
                                    (residue, key)=>{
                                        return <span key={key}>{residue.name} &nbsp;</span> 
                                    })
                                }
                            </div>
                       </div>
                   )}
                </div>
            }
        </div>
    );
}