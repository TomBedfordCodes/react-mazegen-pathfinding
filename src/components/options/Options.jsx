import React from 'react'
import ClickChoicePanel from './ClickChoicePanel'
import { MainContext } from '../Main.jsx'
import {
    wallNode, pathNode, startNode, endNode,
} from '../../namedConstants.js'


export default function Options() {

    const { 
        specialNodes,
        resetMaze, 
        pathfindingIsRunning,
        runPathfinding,
        stopPathfinding,
        resetPathfinding,
    } = React.useContext(MainContext)

    // console.log("options re-rendered")
    
    return (
        <div className='options--container'>
            <h2>Options</h2>
            <ClickChoicePanel choices={[wallNode, pathNode]} />
            <ClickChoicePanel choices={[startNode, endNode]} />
            {/* REPLACE WITH PROPER BUTTONS */}
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
        </div>
    )
}

