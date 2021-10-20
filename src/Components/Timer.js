import {useState, useEffect} from 'react'

export const formatTime = sec => {
    if (sec > 59) {
        const minutes = Math.floor(sec / 60);
        const seconds = sec - minutes * 60;
        return (seconds > 9) ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
    }
    else if (sec > 0 && sec < 59) {
        return (sec > 9) ? `0:${sec}` : `0:0${sec}`;
    }
    else {
        return '0:00'
    }
}

const Timer = ({timeNow, startTime}) => {
    const [counter, setCounter] = useState(startTime);

    useEffect(() => {
        const timer = setTimeout(() => setCounter(counter + 1), 1000);
        timeNow(counter);
        return () => {
            clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    return (
        <div>
            <h3>{formatTime(counter)}</h3>
        </div>
    )
}

export default Timer
