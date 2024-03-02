import React from 'react'
import ClickChoicePanel from './ClickChoicePanel'
import { MainContext } from '../Main.jsx'
import {
    startNode, endNode, wallNode, pathNode, forestNode, mountainNode,
} from '../../namedConstants.js'


export default function Options() {

    const { 
        specialNodes,
        resetMaze, 
        pathfindingIsRunning,
        runPathfinding,
        stopPathfinding,
        resetPathfinding,
        toggleIsSlow,
        options,
    } = React.useContext(MainContext)

    // console.log("options re-rendered")
    
    return (
        <div className='options--container'>
            <h2>Options</h2>
            <hr />
            <h3>Algorithms</h3>
            <button 
                disabled={!specialNodes.current.startNode || 
                    !specialNodes.current.endNode || 
                    pathfindingIsRunning
                } 
                onClick={runPathfinding}
            >
                Run pathfinding
            </button>
            <button disabled={!pathfindingIsRunning} onClick={stopPathfinding}>
                Stop pathfinding
            </button>
            <button onClick={resetMaze}>
                Reset Maze
            </button>
            <button onClick={resetPathfinding}>
                Reset Pathfinding
            </button>
            <br />
            <label htmlFor='slow-mo-checkbox'>Slow-Mo</label>
            <input 
                type='checkbox' 
                aria-label='Toggle slow-mo' 
                onChange={toggleIsSlow}
                id="slow-mo-checkbox"
                checked={options.isSlowMo}
            />
            <hr />
            <h3>Create your own</h3>
            <ClickChoicePanel choices={[startNode, endNode]} />
            <ClickChoicePanel choices={[wallNode, pathNode]} />
            <ClickChoicePanel choices={[forestNode, mountainNode]} />
        </div>
    )
}

