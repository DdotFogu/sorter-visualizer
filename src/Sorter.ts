import { type Process } from "./Algorithm";
import { type Step } from "./Step";

export class Diagnostic {
    public process: Process;
    public result: Array<number>;
    public success: boolean;

    constructor(
        process: Process = [],
        result: Array<number> = [],
    ){
        this.process = process;
        this.result = result;
        this.success = this.isSuccess();
    }

    isSuccess(): boolean {
        return isSorted(this.result);
    }
}

export const isSorted = (arr: Array<number>): boolean => {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

export const shuffle = (array: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    if (recordCallback) recordCallback(currentIndex, randomIndex);
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  
  return array;
}

const getProcess = (array: Array<number>, fc: Function =()=>{}): Process => {
    const steps: Process = [];

    const record = (moving: number, moveTo: number) => {
        steps.push({ moving, moveTo });
    };

    fc(array, record);

    return steps;
}

export const stepArray = (arr: Array<number>, step: Step): Array<number> => {
    let steppedArray = [...arr];

    [steppedArray[step.moveTo], steppedArray[step.moving]] = [steppedArray[step.moving], steppedArray[step.moveTo]];

    return steppedArray;
}

const reconstructFromProcess = (array: Array<number>, process: Process): Array<number> => {
    for (let step of process) {
        array = stepArray(array, step);
    }

    return array;
}

export const runDiagnostic = (array: Array<number>, fc: Function =()=>{}): Diagnostic => {
    const diagnostic = new Diagnostic(
        getProcess(array, fc),
        reconstructFromProcess(array, getProcess(array, fc))
    );

    return diagnostic;
}