import './style/App.css'

import Visualizer from './components/Visualizer';
import { useEffect, useRef, useState } from 'react';
import { populateArray, shuffle, runDiagnostic, reconstructFromProcess, stopReconstruction, Diagnostic, stepArray } from './Sorter';
import { AlgorithmType } from './Algorithm';
import type { Step } from './Step';

export function App() {
  const [algorithm, setAlgorithm] = useState(AlgorithmType.bogo);

  const [arr, setArr] = useState<number[]>([]);
  const [length, setLength] = useState<number>(50);

  const diagnosticRef = useRef<Diagnostic>(new Diagnostic());
  const speedRef = useRef<number>(10);

  useEffect(() => {
    const newArr = populateArray(length, setArr);
    diagnosticRef.current = runDiagnostic(newArr, algorithm.func);
  }, [length, algorithm]);

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(e.target.value);
    if (!isNaN(newLength) && newLength > 0) {
      stopReconstruction();
      setLength(newLength);
      populateArray(newLength, setArr);
    }
  }

  const suffleArray = () => {
    stopReconstruction();
    const newArr = shuffle(arr);
    setArr(newArr);
  }

  const sortArray = async () => {
    stopReconstruction();
    
    await reconstructFromProcess(arr, diagnosticRef.current.process, setArr, speedRef.current);
  }

  const stepForward = async () => {
    stopReconstruction();

    const step = diagnosticRef.current.process.steps.shift() as Step;
    diagnosticRef.current.process.done.push(step);
    
    setArr(stepArray(arr, step));
  }

  const stepBackward = async () => {
    stopReconstruction();
    const step = diagnosticRef.current.process.done.pop() as Step;
    if (!step) return;
    diagnosticRef.current.process.steps.unshift(step);
    setArr(stepArray(arr, {moveTo: step.moving, moving: step.moveTo}));
  }

  return (
    <>
      <Visualizer elements={arr}/>
      <span id='button-row'>
        <button 
          id='sort-button'
          onClick={sortArray}
        >
          Sort
        </button>
        <button 
          id='shuffle-button'
          onClick={suffleArray}
        >
          Shuffle
        </button>
        <button 
          id='new-button'
          onClick={() => populateArray(length, setArr)}
        >
          New
        </button>
        <button 
          id='step-button'
          onClick={stepBackward}
        >
          Step Backward
        </button>
        <button 
          id='step-button'
          onClick={stepForward}
        >
          Step Forward
        </button>
        <select onChange={(e) => setAlgorithm(AlgorithmType[e.target.value as keyof typeof AlgorithmType])}>
          {Object.keys(AlgorithmType).map((key: string) => (
            <option value={key} key={key}>{AlgorithmType[key as keyof typeof AlgorithmType].name}</option>
          ))}
        </select>
        <input 
          type="number" 
          id="length-input" 
          min="10" max="1000" 
          value={length} onChange={handleLengthChange}
        />
      </span>
    </>
  )
}

export default App;
