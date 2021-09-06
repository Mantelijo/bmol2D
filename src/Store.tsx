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
    simpleStuffy:'',
};

/**
 * State structure
 */
interface State{
    polymers: Polymer[],
    pdb: PDBFile | undefined,

    // Determine if process is currently loading or not
    isLoading: boolean,

    simpleStuffy: string,
}

/**
 * Actions structure
 */
interface Action{
    type: keyof State,
    payload:any,
}

const context = createContext<[State, React.Dispatch<Action>]>([initialState, ()=>{}]);

// Reducer mutates the state
const reducer = (state: State, {type, payload}:Action): State => {

    switch(type) {
        // Default case works when type is equal state property name
        default:
            if (type in state){
                (state as any)[type] = payload;
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