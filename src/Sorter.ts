import { Process } from "./Algorithm";
import { type Step } from "./Step";

export let stop: boolean = false;

export class Diagnostic {
    public process: Process;
    public result: Array<number>;
    public success: boolean;

    constructor(
        process: Process = new Process(),
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

export const shuffle = (array: Array<number>, recordCallback: (moving: number, moveTo: number) => void = () => {}) => {
    const a = [...array];
    let currentIndex = a.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        if (recordCallback) recordCallback(currentIndex, randomIndex);
        [a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]];
    }

    return a;
}

const getProcess = (array: Array<number>, fc: Function =()=>{}): Process => {
    const process: Process = new Process([], array);

    const record = (moving: number, moveTo: number) => {
        process.steps.push({ moving, moveTo });
    };

    fc(array, record);

    return process;
}

export const stepArray = (arr: Array<number>, step: Step): Array<number> => {
    let steppedArray = [...arr];

    [steppedArray[step.moveTo], steppedArray[step.moving]] = [steppedArray[step.moving], steppedArray[step.moveTo]];

    return steppedArray;
}

export const reconstructFromProcessSync = (array: Array<number>, process: Process): Array<number> => {
    for (let step of process.steps) {
        array = stepArray(array, step);
    }

    return array;
}

export const reconstructFromProcess = async (
    array: Array<number>,
    process: Process,
    setArr: React.Dispatch<React.SetStateAction<number[]>> = () => {},
    speed: number = 10
): Promise<Array<number>> => {
    stop = false;

    while (process.steps.length > 0) {
        if (stop) { stop = false; break; };

        const step = process.steps.shift() as Step;
        process.done.push(step);
        console.log(process.done);

        array = stepArray(array, step);

        setArr(array);

        await new Promise(resolve => setTimeout(resolve, speed));
    }

    return array;
}

export const stopReconstruction = () => { stop = true; }

export const runDiagnostic = (array: Array<number>, fc: Function =()=>{}): Diagnostic => {
    const process = getProcess(array, fc);
    const diagnostic = new Diagnostic(
        process,
        reconstructFromProcessSync(array, process)
    );

    return diagnostic;
}

export const populateArray = (length: number, setArr: React.Dispatch<React.SetStateAction<number[]>>) => {
    stopReconstruction();
    
    const newArr = Array.from({ length: length }, () => Math.random());
    setArr(newArr);
    return newArr;
};