import React, { useState, ChangeEventHandler, ChangeEvent, useEffect, useContext } from "react";
import { PDBHandler } from "../lib/PDBHandler";
import {context} from '../Store';

export function DataFetcher(){
    const [state, dispatch] = useContext(context)

    // Updates pbd file information from uploaded file
    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event: ChangeEvent)=>{
        let f = (event.target as HTMLInputElement).files?.item(0);
        if(f !== null){
            const pdb = await new PDBHandler(f as File).readData()
            dispatch({
                type:'pdb',
                payload:pdb,
            });
        }
    }

    useEffect(()=>{
        if(state.pdb?.polymers){
            dispatch({
                type:'polymers',
                payload: state.pdb.polymers
         
            });
        }
    }, [state.pdb])

    let pdbText: JSX.Element|undefined;
    if(state.polymers.length > 0){
        pdbText = (
            <div className="mt-5">
                <div className="mb-1">Provided input file</div>
                <textarea className="text-sm w-full border h-96 border-blue-100" value={state.pdb?.raw} readOnly/>
            </div>
        )
    }

    return (
        <div className="p-5 max-h-screen overflow-auto break-words">
            <div>
                <input type="file" onChange={handleFileChange}/> 
            </div>
            {pdbText}
            {(state.pdb)&&
                <div>
                   Polymers from input: 
                   {state.polymers.map(({residues, chainIdentifier, kind}, k)=>
                       <div className="ml-2" key={k}>
                            Chain: <b>{chainIdentifier} ({kind})</b>
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