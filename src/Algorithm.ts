import { isSorted, shuffle, runDiagnostic, type Diagnostic } from "../src/Sorter.ts";
import type { Step } from "./Step.ts";

const MAX : number = 99999;

export class Algorithm {
    public name: string
    public description: string
    public space: string
    public time: string
    public func: Function

    constructor(
        name: string = "Algorithm Name",
        description: string = "Algorithm Description",
        space: string = "1",
        time: string = "n * n!",
        func: Function = () => {}
    ){
        this.name = name;
        this.description = description;
        this.space = space;
        this.time = time;
        this.func = func;
    }
}

export const Type = {
    bogo: new Algorithm(
        "Bogo",
        "bogosort (also known as permutation sort and stupid sort) is a sorting algorithm based on the generate and test paradigm. The function successively generates permutations of its input until it finds one that is sorted.",
        "1",
        "n * n!",
        (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
            let sorted = [...arr];
            let count : number = 0

            while (!isSorted(sorted)){
                if (count === MAX) break;

                sorted = shuffle(sorted, recordCallback);
                count++;
            }

            return sorted;
        }
    ),

}

// can maybe make process an object again so I can store current step idx and complete time for diagnostics, but for now this is fine.
export type Process = Array<Step>;

export function runDemo() {
  const arr: Array<number> = [3, 1, 6, 7, 2, 9];
  const dia: Diagnostic = runDiagnostic(arr, Type.bogo.func);
  console.log(dia);
}