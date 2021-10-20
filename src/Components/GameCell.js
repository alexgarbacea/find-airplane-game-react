import { useState } from "react";

const GameCell = (props) => {
    const { value, onClick: click } = props;
    const [classNameValue, setClassNameValue] = useState(`cell${value.isVisible ? '' : ' hidden'}`);
    
    const getData = () => {
        if (!value.isVisible) return null;
        if (value.hasPlane) return '✈️';
    }

    const handleClick = () => {
        setClassNameValue('cell')
        click()
    }

    return (
        <div onClick={() => handleClick()} className={classNameValue}>
            {getData()}
        </div>
    )
}

export default GameCell
