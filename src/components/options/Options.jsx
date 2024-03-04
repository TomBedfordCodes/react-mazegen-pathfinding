import React from 'react'
import ClickChoicePanel from './ClickChoicePanel'
import { MainContext } from '../Main.jsx'
import {
    startNode, endNode, wallNode, pathNode, forestNode, mountainNode, 
    bfs, algoNames, dijkstras, prims, kruskals,
} from '../../namedConstants.js'



const OptionsContext = React.createContext()


export default function Options() {

    const { 
        specialNodes,
        resetMaze, 
        pathfindingIsRunning,
        runPathfinding,
        stopPathfinding,
        resetPathfinding,
        options,
        setOptions,
    } = React.useContext(MainContext)


    // console.log("options re-rendered")

    
    function updateClickChoice(clickChoiceType) {
        setOptions(prev => {
            return {
                ...prev,
                clickChoices: prev.clickChoices.map(choice => {
                    if (clickChoiceType === choice.clickChoiceType) {
                        return {
                            ...choice,
                            isSelected: true
                        }
                    } else {
                        return {
                            ...choice,
                            isSelected: false
                        }
                    }
                })
            }
        })
    }

    
    function toggleIsSlow() {
        setOptions(prev => {
            return {
                ...prev,
                isSlowMo: !prev.isSlowMo
            }
        })
    }

    function changePathfindingAlgo(newAlgo) {
        setOptions(prev => {
            return {
                ...prev,
                pathfindingAlgo: newAlgo
            }
        })
    }

    function changeMazegenAlgo(newAlgo) {
        setOptions(prev => {
            return {
                ...prev,
                mazegenAlgo: newAlgo
            }
        })
    }

    
    return (
        <OptionsContext.Provider value={{
            updateClickChoice,
        }}>
        <div className='options--container'>
            <h2>Options</h2>
            <hr />
            <h3>Algorithms</h3>

            <div className='options--algos-container'>
                {/* MAZE GENERATION PLACEHOLDER INPUTS
                    WE NEED BOOLS TO CHECK IF MAZEGEN IS RUNNING AS WELL*/}
                {/* <select disabled={pathfindingIsRunning}> */}
                <select 
                    disabled 
                    onChange={(e) => changeMazegenAlgo(e.target.value)}
                    defaultValue={options.mazegenAlgo}
                >
                    {/* <option value="" disabled>Choose maze generation...</option> */}
                    <option value={prims}>{algoNames.prims}</option>
                    <option value={kruskals}>{algoNames.kruskals}</option>
                </select>
                {!pathfindingIsRunning && <button 
                    disabled 
                    // disabled={pathfindingIsRunning} 
                    // onClick=""  // ADD RUNMAZEGEN FUNCTION
                >
                    Run maze generation
                </button>}
                {pathfindingIsRunning && 
                    <button 
                        disabled 
                        // disabled={!pathfindingIsRunning} 
                        onClick={stopPathfinding}
                    >
                    Stop maze generation
                </button>}


                {/* PATHFINDING */}
                <select 
                    disabled={pathfindingIsRunning} 
                    onChange={(e) => changePathfindingAlgo(e.target.value)}
                    defaultValue={options.pathfindingAlgo}
                >
                    {/* <option value="" disabled>Choose pathfinding...</option> */}
                    <option value={bfs}>{algoNames.bfs}</option>
                    <option value={dijkstras}>{algoNames.dijkstras}</option>
                </select>
                {!pathfindingIsRunning && <button 
                    disabled={!specialNodes.current.startNode || 
                        !specialNodes.current.endNode || 
                        pathfindingIsRunning
                    } 
                    onClick={runPathfinding}
                >
                    Run pathfinding
                </button>}
                {pathfindingIsRunning && <button disabled={!pathfindingIsRunning} onClick={stopPathfinding}>
                    Stop pathfinding
                </button>}

                <button onClick={resetMaze}>
                    Reset Maze
                </button>
                <button onClick={resetPathfinding}>
                    Reset Pathfinding
                </button>
            </div>

            <br />
            <input 
                type='checkbox' 
                aria-label='Toggle slow-mo' 
                onChange={toggleIsSlow}
                id="slow-mo-checkbox"
                checked={options.isSlowMo}
            />
            <label htmlFor='slow-mo-checkbox'>Slow-Mo</label>
            <br />
            <br />

            <hr />
            <h3>Create your own</h3>
            <ClickChoicePanel choices={[startNode, endNode]} />
            <ClickChoicePanel choices={[wallNode, pathNode]} />
            <ClickChoicePanel choices={[forestNode, mountainNode]} />

            <input 
                
                type='checkbox' 
                aria-label='Toggle whether walls can be painted over' 
                // onChange={toggleWallsEditable}
                id="walls-editable-checkbox"
                // checked={options.areWallsEditable}
            />
            <label htmlFor='walls-editable-checkbox'>Walls editable</label>

            <div className='options--infobox-container'>Info box</div>

        </div>
        </OptionsContext.Provider>
    )
}

export { OptionsContext }

