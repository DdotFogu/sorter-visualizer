import "../style/Visualizer.css";

import ArrayElement from "./ArrayElement";

type Props = {
    elements: number[];
}

const Visualizer = ({ elements }: Props) => {

    return(
        <div className="visualizer-display">
            {elements.map((ratio: number, idx: number) => (
                <ArrayElement ratio={ratio} key={idx}/>
            ))}
        </div>
    );
}

export default Visualizer;