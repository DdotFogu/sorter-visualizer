import '../style/AlgorithmInfo.css';
import { type Algorithm } from "../Algorithm";
import type { Diagnostic } from '../Sorter';

type Props = {
    algorithm: Algorithm;
    diagnostic: Diagnostic;
}

const AlgorithmInfo = ({ algorithm, diagnostic }: Props) => {
    return (
        <div className="algorithm-info">
            <p>{algorithm.name}</p>
            <p>{diagnostic.process.done.length}/{diagnostic.process.getTotalSteps()}</p>
            <p
            style={{color: diagnostic.isSuccess() ? "greenyellow" : "red"}}
            >{diagnostic.isSuccess() ? "Success" : "Failed"}</p>
            <p>.01s delay</p>
            <p>Space: {algorithm.space}</p>
            <p>Time: {algorithm.time}</p>
        </div>
    );
}

export default AlgorithmInfo;
