import '../style/AlgorithmInfo.css';
import { type Algorithm } from "../Algorithm";

type Props = {
    algorithm: Algorithm;
}

const AlgorithmInfo = ({ algorithm }: Props) => {
    return (
        <div className="algorithm-info">
            <p>Description: {algorithm.description}</p>
            <p>Space: 0({algorithm.space})</p>
            <p>Time: 0({algorithm.time})</p>
        </div>
    );
}

export default AlgorithmInfo;
