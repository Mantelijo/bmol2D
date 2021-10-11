import React, { useState, ChangeEventHandler, ChangeEvent, useEffect, useContext } from "react";
import { InteractionsFinder } from "../lib/InteractionsFinder";
import { PDBHandler } from "../lib/PDBHandler";
import { PDBFile, Polymer } from "../lib/types/atoms";
import {context, Action} from '../Store';



// Fetch PDB text for given id (if valid)
const fetchPDBFile = async (id:string):Promise<string>=>{
    const response = await fetch(`https://files.rcsb.org/download/${id}.pdb`);
    const pdbText = await response.text();
    return pdbText;
}

export function DataFetcher(){
    const [state, dispatch] = useContext(context)

    const startLoading = ()=>{
        dispatch({
            type: 'isLoading',
            payload: true,
        });
    };
    const stopLoading = ()=>{
        dispatch({
            type: 'isLoading',
            payload: false,
        });
    }
    const updatePDBState = (pdb:PDBFile)=>{
        dispatch({
            type:'pdb',
            payload:pdb,
        });
    }
    // Update polymers in store, generate visualization data structure
    const updatePolymers = (polymers: Polymer[])=>{
        dispatch({
            type:'polymers',
            payload: polymers
        });

        const iFinder = new InteractionsFinder(polymers, dispatch);
        
        // Load all needed interactions
        iFinder.thresholdInteractions()

        // Generate visualization data structure
        dispatch({
            type:'viz',
            payload: iFinder.generateVisualizationScaffold()
        })
    };


    // Fetch PDB file by given id parameter. Must run only once
    useEffect(()=>{
        const url = new URLSearchParams(window.location.search);
        const id = url.get('id');
        console.log("ID", id)
        if (id !== null){
             (async()=>{
                startLoading();
                const pdb = new PDBHandler().format(
                    await fetchPDBFile(id)
                );
                updatePDBState(pdb);
                updatePolymers(pdb.polymers);
                stopLoading();
            })()
        }    
    }, []);

    // Updates pbd file information from uploaded file, parses pdb data and performs interaction calculations
    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event: ChangeEvent)=>{
        let f = (event.target as HTMLInputElement).files?.item(0);
        if(f !== null){
            // Show spinner while loading
            startLoading();

            // Read and parse the file
            console.time("TIME_TO_PARSE_EVERYTHING");
            console.time("TIME_TO_PARSE_PDB");
            const pdb = await new PDBHandler(f as File).readData()
            console.timeEnd("TIME_TO_PARSE_PDB");
            
            // Update state with parsed values
            updatePDBState(pdb);
            updatePolymers(pdb.polymers);

            // Some fake loading time, so we get to see the spinner :)
            console.timeEnd("TIME_TO_PARSE_EVERYTHING");
            setTimeout(stopLoading, 2000)
        }
    }

    let pdbText: JSX.Element|undefined;
    if(state.polymers.length > 0){
        pdbText = (
            <div className="mt-5">
                <div className="mb-1">Provided input file</div>
                <textarea className="text-sm w-full border h-96 border-blue-100" value={state.pdb?.raw} readOnly/>
            </div>
        )
    }

    // Render data fetcher box
    return (
        <div className="p-5 max-h-screen overflow-auto break-words">
            {!state.isLoading &&
                <div>
                    { state.pdb === undefined &&
                        <div className="text-sm text-gray-600 mb-4 bg-red-200 p-2">
                            Choose a PDB file which contains DNA/RNA with Proteins
                        </div>
                    }
                    <div>
                        <input type="file" onChange={handleFileChange}/> 
                    </div>
                </div>
            }
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