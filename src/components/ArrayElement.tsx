import "../style/Visualizer.css";

export const State = {
    unselected: 0,
    sorted: 1,
    swapping: 3,
}

type props = {
    ratio: number
    state?: number
}

const ArrayElement = (props : props) => {
    return(
        <>
            <span 
                className="array-element" 
                style={{
                    height: `${props.ratio * 100}%`,
                    backgroundColor: props.state === State.sorted ? "#00ff00" : props.state === State.swapping ? "blue" : "white"
                }}
            />
        </>
    );
}

export default ArrayElement;