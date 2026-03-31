import "../style/Visualizer.css";

type props = {
    ratio: number
}

const ArrayElement = (props : props) => {
    return(
        <>
            <span 
                className="array-element" 
                style={{
                    height: `${props.ratio * 100}%`
                }}
            />
        </>
    );
}

export default ArrayElement;