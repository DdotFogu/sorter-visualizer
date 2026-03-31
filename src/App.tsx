import './style/App.css'

import Visualizer from './components/Visualizer';
import { useEffect, useRef, useState } from 'react';
import { populateArray, shuffle, runDiagnostic, reconstructFromProcess, stopReconstruction, Diagnostic, stepArray } from './Sorter';
import { AlgorithmType } from './Algorithm';
import type { Step } from './Step';
import AlgorithmInfo from './components/AlgorithmInfo';

export function App() {
  const [algorithm, setAlgorithm] = useState(AlgorithmType.quick);

  const [arr, setArr] = useState<number[]>([]);
  const [length] = useState<number>(250);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const diagnosticRef = useRef<Diagnostic>(new Diagnostic());
  const speedRef = useRef<number>(10);

  useEffect(() => {
    const newArr = populateArray(length, setArr);
    diagnosticRef.current = runDiagnostic(newArr, algorithm.func);
  }, [length, algorithm]);

  const suffleArray = () => {
    stopReconstruction();
    const newArr = shuffle(arr);
    setArr(newArr);
    diagnosticRef.current = runDiagnostic(newArr, algorithm.func);
  }

  const sortArray = async () => {
    stopReconstruction();
    
    await reconstructFromProcess(arr, diagnosticRef.current.process, setArr, speedRef.current);
    setRefreshTrigger(prev => prev + 1);
  }

  const stepForward = async () => {
    stopReconstruction();

    const step = diagnosticRef.current.process.steps.shift() as Step;
    diagnosticRef.current.process.done.push(step);
    
    setArr(stepArray(arr, step));
    setRefreshTrigger(prev => prev + 1);
  }

  const stepBackward = async () => {
    stopReconstruction();
    const step = diagnosticRef.current.process.done.pop() as Step;
    if (!step) return;
    diagnosticRef.current.process.steps.unshift(step);
    setArr(stepArray(arr, {moveTo: step.moving, moving: step.moveTo}));
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <>
      <AlgorithmInfo algorithm={algorithm} diagnostic={diagnosticRef.current}/>
      <Visualizer elements={arr} process={diagnosticRef.current.process} key={refreshTrigger}/>
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
          onClick={() => {
            const newArr = populateArray(length, setArr);
            diagnosticRef.current = runDiagnostic(newArr, algorithm.func);
          }}
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
        {/*
          <input 
            type="number" 
            id="length-input" 
            min="0" max="1000" 
            value={length} onChange={handleLengthChange}
          />
        */}
      </span>
    </>
  )
}

export default App;
