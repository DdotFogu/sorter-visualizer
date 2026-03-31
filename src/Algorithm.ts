import { isSorted, shuffle, runDiagnostic, type Diagnostic } from "../src/Sorter.ts";
import type { Step } from "./Step.ts";

const MAX : number = 9999;

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

export const AlgorithmType = {
    bogo: new Algorithm(
        "Bogo",
        "bogosort is a sorting algorithm based on the generate and test paradigm. The function successively generates permutations of its input until it finds one that is sorted.",
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
    bubble: new Algorithm(
        "Bubble",
        "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
        "1",
        "n^2",
        (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
            let sorted = [...arr];
            let n = sorted.length;

            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (sorted[j] > sorted[j + 1]) {
                        // Swap
                        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
                        recordCallback(j, j + 1);
                    }
                }
            }

            return sorted;
        }
    )

}

export class Process {
    public steps: Array<Step>;
    public done: Array<Step>;
    public start: Array<number>;
    
    constructor(steps: Array<Step> = [], start: Array<number> = []){
        this.steps = steps;
        this.done = [];
        this.start = start;
    }
}

export function runDemo() {
  const arr: Array<number> = [3, 1, 6, 7, 2, 9];
  const dia: Diagnostic = runDiagnostic(arr, AlgorithmType.bogo.func);
  console.log(dia);
}

export default AlgorithmType;