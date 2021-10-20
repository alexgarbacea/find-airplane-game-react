import { useState } from 'react'
import GameCell from './GameCell';
import Timer, { formatTime } from './Timer';

const GameBoard = () => {
    const [gameState, setGameState] = useState('Ready?');
    const [size, setSize] = useState(5);
    const [planes, setPlanes] = useState(1);
    const [clicks, setClicks] = useState(0);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [clickHistory, setClickHistory] = useState([])
    const [time, setTime] = useState(0);
    const [gameWidth, setGameWidth] = useState(50);
    const [planeCount, setPlaneCount] = useState(0);

    const endRunHistory = () => {
        const today = new Date();
        const run = [
            {
                date : `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 
                ${today.getHours()}:${today.getMinutes()}`,
                totalClicks : clicks+1,
                duration: formatTime(time)
            }
        ]
        setClickHistory(prevClick => [...prevClick, run[0]])
    }

    const setTimeNow = (t) => {
        setTime(t);
    }
    
    //create the empty nested array
    const createNestedArray = (size) => {
        let data = [];

        for (let i = 0; i < size; i++){
            data.push([]);
            for (let j = 0; j < size; j++) {
                data[i][j] = {
                    x : i,
                    y : j,
                    hasPlane : false,
                    isVisible : false
                };
            };
        };
        return data;
    }

    //set plane random
    const setPlane = (data) => {
        let randX, randY, totalPlanes = 0;

        while (totalPlanes < planes){
            randX = Math.floor((Math.random() * 1000) + 1) % size;
            randY = Math.floor((Math.random() * 1000) + 1) % size;

            if(!data[randX][randY].hasPlane){
                data[randX][randY].hasPlane = true;
                totalPlanes++;
            }
        }

        return (data);
    }

    //prepare data for display
    const createBoardData = () => {
        let data = createNestedArray(size);
        data = setPlane(data);
        return data;
    }

    //nested array for game data
    const [gameData, setGameData] = useState(createBoardData());

    //handle cell click
    const cellClick = (x, y) => {
        if(gameData[x][y].isVisible) return null;

        let updateData = gameData;

        updateData[x][y].isVisible = true;

        setGameData(updateData);

        setClicks(clicks + 1)

        if (gameData[x][y].hasPlane) {
            setPlaneCount(planeCount + 1)
            // eslint-disable-next-line eqeqeq
            if(planeCount + 1 == planes){
                setGameState('Found it!')
                endRunHistory();
            }
        }

    }

    //display the game board
    const displayBoardData = (data) => {
        return data.map(row => {
            return row.map(item => {
                return(
                    <div key={item.x * row.length + item.y}>
                        <GameCell value={item} onClick={() => cellClick(item.x, item.y)} />
                        {(row[row.length - 1] === item) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        })
    }

    //start or restart the game. reset values
    const startGame = () => {
        size < 10 ? setGameWidth(size) : setGameWidth(10)
        setPlaneCount(0);
        setShowHistory(false)
        setTime(0);
        setClicks(0);
        setGameData(createBoardData());
        gameState === 'Found it!' ? setGameState('Ready?') : setGameState('Find the plane')
        
    }

    //check size of game board change
    const changeSize = (e) => {
        if(e === '' || e < 5) return setSize(5);
        if(e > 10) return setSize(10);
        setSize(e)
    }

    const changePlanes = (e) => {
        if (e < 1) return setPlanes(1);
        setPlanes(e)
    }

    //display the previous runs
    const displayHistory = () => {
        const sorted = clickHistory.sort((a, b) => { return a.totalClicks - b.totalClicks });
        return (
            <div>
                {!sorted.length > 0 ? <p>No data recorded..</p> : sorted.map(
                    (click, i) => {
                        return (
                            <div key={i}>
                                < hr />
                                Date: {click.date} |
                                Clicks: {click.totalClicks} |
                                Duration: {click.duration}
                                <p></p>
                            </div>
                        )
                    }
                )}
            </div>
        )
    }

    return (
        <div className='game'>
            <div className='title'>
                <h1>PLANE GAME</h1>
                <h3>{gameState}</h3>
            </div>
            {gameState === 'Ready?' && //main screen
                <div style={{textAlign:'center'}}>
                    <h3>Find the plane by clicking the cells.</h3>
                    <h3>Try to find it in as few clicks as possible.</h3>
                    <div onClick={startGame} className='btn'>Start</div>
                    <p className='btn-link' onClick={() => setShowAdvanced(!showAdvanced)}>
                        {!showAdvanced ? 'open advanced settings' : 'close advanced settings'}
                    </p>
                    {showAdvanced && 
                        <div>
                            <div>
                                <label>Columns X Rows: </label>
                                <input type='number' value={size} onChange={(e) => changeSize(e.target.value)} />
                            </div>
                            <div>
                                <label>Planes: </label>
                                <input type='number' value={planes} onChange={(e) => changePlanes(e.target.value)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {gameState === 'Find the plane' && //game screen
                <div style={{ width: `${gameWidth}0%` }} className='cell-view' >
                    <Timer timeNow = {setTimeNow} startTime={time}/>
                    <p>Clicks: {clicks}</p>
                    {displayBoardData(gameData)}
                </div>
            }
            {gameState === 'Found it!' && //end screen
                <div style={{ textAlign: 'center' }}>
                    <h2>Congratulations!</h2><hr />
                    You found the plane in {clicks} clicks.<hr />
                    <div onClick={startGame} className='btn'>Retry</div>
                </div>
            }
            {gameState !== 'Find the plane' && //button for history
            <>
                <div className='history'>
                    <div onClick={() => setShowHistory(!showHistory)} className='btn'>History</div>
                    {showHistory && displayHistory()}
                </div>
            </>
            }
            
        </div>
    )
}

export default GameBoard
