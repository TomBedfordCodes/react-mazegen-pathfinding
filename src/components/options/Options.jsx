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
        mazegenIsRunning,
        pathfindingIsRunning,
        runMazegen,
        runPathfinding,
        stopMazegen,
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
                {/* MAZE GENERATION */}
                {/* <label htmlFor='pathfinding-select'>Maze generation */}
                <select 
                    disabled={mazegenIsRunning} 
                    onChange={(e) => changeMazegenAlgo(e.target.value)}
                    defaultValue={options.mazegenAlgo}
                >
                    {/* <option value="" disabled>Choose maze generation...</option> */}
                    <option value={prims}>{algoNames.prims}</option>
                    <option value={kruskals}>{algoNames.kruskals}</option>
                </select>
                {/* </label> */}

                {!mazegenIsRunning && <button 
                    disabled={
                        mazegenIsRunning ||
                        pathfindingIsRunning
                    } 
                    onClick={runMazegen}
                    className='options--btn'
                >
                    Run maze generation
                </button>}

                {mazegenIsRunning && 
                    <button 
                        onClick={stopMazegen}
                        className='options--btn'
                    >
                    Stop maze generation
                </button>}


                {/* PATHFINDING */}
                {/* <label htmlFor='pathfinding-select'>Pathfinding */}
                <select 
                    // id='pathfinding-select'
                    disabled={pathfindingIsRunning} 
                    onChange={(e) => changePathfindingAlgo(e.target.value)}
                    defaultValue={options.pathfindingAlgo}
                >
                    <option value={bfs}>{algoNames.bfs}</option>
                    <option value={dijkstras}>{algoNames.dijkstras}</option>
                </select>
                {/* </label> */}

                {!pathfindingIsRunning && <button 
                    disabled={
                        !specialNodes.current.startNode || 
                        !specialNodes.current.endNode || 
                        mazegenIsRunning ||
                        pathfindingIsRunning
                    } 
                    onClick={runPathfinding}
                    className='options--btn'
                >
                    Run pathfinding
                </button>}

                {pathfindingIsRunning && <button 
                    onClick={stopPathfinding}
                    className='options--btn'
                >
                    Stop pathfinding
                </button>}

                <button 
                    onClick={() => resetMaze(false)}
                    className='options--btn'
                >
                    Clear grid
                </button>

                <button 
                    disabled={mazegenIsRunning}
                    onClick={resetPathfinding}
                    className='options--btn'
                >
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

