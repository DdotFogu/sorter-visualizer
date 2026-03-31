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
    ),
    quick: new Algorithm(
        "Quick",
        "Quicksort is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.",
        "log(n)",
        "n log(n)",
        (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
            const sorted = [...arr];

            function partition(low: number, high: number): number {
                const pivot = sorted[high];
                let i = low - 1;

                for (let j = low; j < high; j++) {
                    if (sorted[j] <= pivot) {
                        i++;
                        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
                        recordCallback(i, j); // real swap at real indices
                    }
                }
                [sorted[i + 1], sorted[high]] = [sorted[high], sorted[i + 1]];
                recordCallback(i + 1, high);
                return i + 1;
            }

            function quickSort(low: number, high: number): void {
                if (low < high) {
                    const pi = partition(low, high);
                    quickSort(low, pi - 1);
                    quickSort(pi + 1, high);
                }
            }

            quickSort(0, sorted.length - 1);
            return sorted;
        }    
    ),
    merge: new Algorithm(
    "Merge",
    "Merge sort is a divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges them back together in order.",
    "n",
    "n log(n)",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        function merge(left: number, mid: number, right: number): void {
            let i = left;
            let j = mid + 1;

            while (i <= mid && j <= right) {
                if (sorted[i] <= sorted[j]) {
                    i++;
                } else {
                    let temp = j;
                    while (temp > i) {
                        swap(temp, temp - 1);
                        temp--;
                    }
                    i++; mid++; j++;
                }
            }
        }

        function mergeSort(left: number, right: number): void {
            if (left >= right) return;
            const mid = Math.floor((left + right) / 2);
            mergeSort(left, mid);
            mergeSort(mid + 1, right);
            merge(left, mid, right);
        }

        mergeSort(0, sorted.length - 1);
        return sorted;
    }
    ),
    heap: new Algorithm(
    "Heap",
    "Heap sort works by building a max heap from the array, then repeatedly extracting the maximum element and placing it at the end. This gives a sorted array in ascending order.",
    "1",
    "n log(n)",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        function heapify(n: number, i: number): void {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && sorted[left] > sorted[largest]) largest = left;
            if (right < n && sorted[right] > sorted[largest]) largest = right;

            if (largest !== i) {
                swap(i, largest);
                heapify(n, largest);
            }
        }

        for (let i = Math.floor(sorted.length / 2) - 1; i >= 0; i--) {
            heapify(sorted.length, i);
        }

        for (let i = sorted.length - 1; i > 0; i--) {
            swap(0, i);
            heapify(i, 0);
        }

        return sorted;
    }
    ),
    shell: new Algorithm(
    "Shell",
    "Shell sort is a generalization of insertion sort that allows the exchange of items that are far apart. It starts by sorting elements far apart from each other and progressively reduces the gap between elements to be sorted.",
    "1",
    "n log(n)",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        let gap = Math.floor(sorted.length / 2);

        while (gap > 0) {
            for (let i = gap; i < sorted.length; i++) {
                let j = i;
                while (j >= gap && sorted[j - gap] > sorted[j]) {
                    swap(j, j - gap);
                    j -= gap;
                }
            }
            gap = Math.floor(gap / 2);
        }

        return sorted;
    }
    ),
    selection: new Algorithm(
    "Selection",
    "Selection sort works by repeatedly finding the minimum element from the unsorted portion of the array and placing it at the beginning. The array is divided into a sorted portion on the left and unsorted portion on the right.",
    "1",
    "n^2",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        for (let i = 0; i < sorted.length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < sorted.length; j++) {
                if (sorted[j] < sorted[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) swap(i, minIdx);
        }

        return sorted;
    }
    ),
    insertion: new Algorithm(
    "Insertion",
    "Insertion sort builds the sorted array one element at a time by taking each element and inserting it into its correct position among the previously sorted elements.",
    "1",
    "n^2",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        for (let i = 1; i < sorted.length; i++) {
            let j = i;
            while (j > 0 && sorted[j - 1] > sorted[j]) {
                swap(j, j - 1);
                j--;
            }
        }

        return sorted;
    }
    ),
    gnome: new Algorithm(
    "Gnome",
    "Gnome sort works like a gnome sorting a line of flower pots. The gnome moves forward if the pots are in order, otherwise swaps them and moves back. Simple but charmingly inefficient.",
    "1",
    "n^2",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        let i = 0;
        while (i < sorted.length) {
            if (i === 0 || sorted[i] >= sorted[i - 1]) {
                i++;
            } else {
                swap(i, i - 1);
                i--;
            }
        }

        return sorted;
    }
    ),
    cocktail: new Algorithm(
    "Cocktail",
    "Cocktail shaker sort is a bidirectional bubble sort. It alternates between bubbling the largest element to the right and the smallest element to the left, like liquid sloshing back and forth in a shaker.",
    "1",
    "n^2",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        let left = 0;
        let right = sorted.length - 1;

        while (left < right) {
            for (let i = left; i < right; i++) {
                if (sorted[i] > sorted[i + 1]) swap(i, i + 1);
            }
            right--;

            for (let i = right; i > left; i--) {
                if (sorted[i] < sorted[i - 1]) swap(i, i - 1);
            }
            left++;
        }

        return sorted;
    }
    ),
    oddEven: new Algorithm(
    "Odd-Even",
    "Odd-even sort alternates between comparing odd-indexed and even-indexed adjacent pairs. It looks like a zipper closing across the array repeatedly until everything is in order.",
    "1",
    "n^2",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        let isSorted = false;
        while (!isSorted) {
            isSorted = true;

            for (let i = 1; i < sorted.length - 1; i += 2) {
                if (sorted[i] > sorted[i + 1]) {
                    swap(i, i + 1);
                    isSorted = false;
                }
            }

            for (let i = 0; i < sorted.length - 1; i += 2) {
                if (sorted[i] > sorted[i + 1]) {
                    swap(i, i + 1);
                    isSorted = false;
                }
            }
        }

        return sorted;
    }
    ),
    stooge: new Algorithm(
    "Stooge",
    "Stooge sort recursively sorts the first 2/3, then the last 2/3, then the first 2/3 again. It is comically inefficient at O(n^2.7) and serves mostly as an example of how not to write a sorting algorithm.",
    "n",
    "n^2.7",
    (arr: Array<number>, recordCallback: (moving: number, moveTo: number) => void) => {
        const sorted = [...arr];

        function swap(i: number, j: number): void {
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            recordCallback(i, j);
        }

        function stoogeSort(l: number, r: number): void {
            if (l >= r) return;

            if (sorted[l] > sorted[r]) {
                swap(l, r);
            }

            if (r - l + 1 > 2) {
                const t = Math.floor((r - l + 1) / 3);
                stoogeSort(l, r - t);
                stoogeSort(l + t, r);
                stoogeSort(l, r - t);
            }
        }

        stoogeSort(0, sorted.length - 1);
        return sorted;
    }
    ),
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

    getTotalSteps(): number {
        return this.steps.length + this.done.length;
    }
}

export function runDemo() {
  const arr: Array<number> = [3, 1, 6, 7, 2, 9];
  const dia: Diagnostic = runDiagnostic(arr, AlgorithmType.bogo.func);
  console.log(dia);
}

export default AlgorithmType;