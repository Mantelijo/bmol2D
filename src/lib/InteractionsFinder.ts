import { Polymer } from "./format/atoms";

const THRESHOLD_DISTANCE = 5;

export class InteractionsFinder{

    constructor(public polymers: Polymer[]){}

    calculateInteractions(){
        for(let i=0;i<this.polymers.length;i++){
            for(let j=0;j<this.polymers.length;j++){
                if (j === i){
                    continue;
                }
            }
        }
    }
}