import React, {createContext, useReducer, ReactElement} from "react";
import { Polymer } from "./lib/format/atoms";
import {PDBFile} from './lib/format/atoms'

/**
 * Initial State object structure 
 */
const initialState: State = {
    polymers:[],
    pdb: undefined,
    isLoading: false,
};

/**
 * State structure
 */
interface State{
    [key:string]:any
    polymers: Polymer[],
    pdb: PDBFile | undefined

    // Determine if process is currently loading or not
    isLoading: boolean
}

/**
 * Actions structure
 */
interface Action{
    type: string,
    payload:any,
}

const context = createContext<[State, React.Dispatch<Action>]>([initialState, ()=>{}]);

const reducer = (state: State, {type, payload}:Action): State => {

    switch(type) {
        // Default case works when type is equal state property name
        default:
            if (type in state){
                state[type] = payload;
            }else{
                throw new Error(`${type} not found in state`);
            }
    };

    // We must return new object, otherwise update won't be triggered
    return {...state};
}


interface Props{
    children: ReactElement,
}

const StoreComponent =  ({ children }:Props ) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return <context.Provider value={[state, dispatch]}>{children}</context.Provider>;
};

export {context, StoreComponent}