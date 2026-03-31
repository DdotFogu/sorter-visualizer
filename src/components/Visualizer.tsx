import "../style/Visualizer.css";

import ArrayElement from "./ArrayElement";
import { State } from "./ArrayElement";
import { Process } from "../Algorithm";

type Props = {
    elements: number[];
    process?: Process;
}

const Visualizer = ({ elements, process }: Props) => {
    const getStateForIndex = (idx: number): number => {
        if (!process) {
            return State.unselected;
        }

        const nextStep = process.steps[0];
        if (nextStep && (idx === nextStep.moving || idx === nextStep.moveTo)) {
            return State.swapping;
        }

        const sortedArray = [...process.start].sort((a, b) => a - b);
        if (elements[idx] === sortedArray[idx]) {
            return State.sorted;
        }

        return State.unselected;
    }

    return(
        <div className="visualizer-display">
            {elements.map((ratio: number, idx: number) => (
                <ArrayElement ratio={ratio} key={idx} state={getStateForIndex(idx)}/>
            ))}
        </div>
    );
}

export default Visualizer;