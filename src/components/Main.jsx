import React from 'react'
import Maze from './maze/Maze.jsx'
import Options from './options/Options.jsx'

import {
    wallNode, pathNode,
    startNode, endNode, currentNode,
    primms,
    bfs, dijkstras, 
} from '../namedConstants.js'


// NEXT - REDESIGN OPTIONS MENU - ADD SLOW-MO TOGGLE (ANY OTHER TOGGLES?)

// COLOURS:
//      PURPLE = (128, 0, 128)        - current
//      VIOLET = (171, 63, 220)       - hunt and kill starting row/column
//      FORESTGREEN = (0, 90, 0)
//      FORESTSEARCHGREEN = (0, 140, 0)

// OPTIONS:
//      TERRAIN FOR CLICKING (track state so only one can be selected - can be null):
//          WALL; PATH (normal speed); FOREST (x2 slower); MOUNTAIN (x5 slower)
//      SPECIAL NODES FOR CLICKING (same state as terrain):
//          START; END (get react-icons for start/end)
//      WHICH MAZEGEN ALGO (some kind of dropdown selection component for these two):
//          KRUSKALS, PRIMMS, BACKTRACKING, HUNT AND KILL
//      WHICH PATHFINDING ALGO:
//          BFS, DFS (TURN LEFT), DIJKSTRA'S, A-STAR
//      TOGGLES (create custom useToggle hook if there are multiple):
//          SHOW GENERATION/PATHFINDING (SLOW-MO) OR JUST INSTA DO IT

// STRETCH GOALS:
//      RESIZE MAZE TO FILL MOST OF THE SCREEN
//      I'D LIKE MOST OF THE SCREEN TO BE THE GRID, WITH AN OPTIONS MENU TO SLIDE FROM THE RIGHT
//          (WITH SOME BASIC OPTIONS ALWAYS VISIBLE?)
//      TOGGLE WALLS UNEDITABLE
//      MOBILE FIRST:
//          - Use burger for menu in top-left which slides out.
//          - Not enough width for navbar (causing footer issues).
//          - Have settings at the top, then maze below. 'Generate maze' button 
// 	            just above maze. Possible to snap view to maze?
//      SEPARATE OUT MAZE AND OPTIONS STATES INTO THEIR RESPECTIVE COMPONENTS AND EXPOSE TO MAIN
//      ADD 'VIA' SPECIAL NODE
//      TUTORIAL (MAYBE A MODAL) SHOWING HOW TO USE IT



const MainContext = React.createContext()


const nodeWidth = 11
const nodeHeight = 11
const nodesInRow = 53
const rowsInCol = 39


function getTemplatePathfinding() {
    return {
        parentNode: null,
        isSearched: false,
        isFrontier: false,
        isDrawnPath: false,
    }
}

function getTemplateNode() {
    return {
        nodeWidth,
        nodeHeight,
        coords: [],  // TWO VALUES IN ARRAY FOR POSITION IN 2D MAZE ARRAY
        id: ``,
    
        // UPDATE THIS OBJECT WITH ALL ALGO VARS (LIKE F, G ETC.)
    
        // CHOSEN NODE TYPE
        clickChoiceType: pathNode,
    
        // MAZEGEN
        [primms]: {},
    
        // PATHFINDING
        pathfinding: getTemplatePathfinding()
    }
}




// ON STARTUP CREATE MAZE - 2D ARRAY OF NODE OBJECTS

const initialArr = getResetMaze()

function getResetMaze() {
    const starterArr = []
    for (let i = 0; i < rowsInCol; i++) {
        const row = []
        for (let j = 0; j < nodesInRow; j++) {
            const node = getTemplateNode()
            node.coords = [i, j]
            node.id = `${i}, ${j}`
            row.push(node)
        }
        starterArr.push(row)
    }
    return starterArr
}


const templateSpecialNodes = {
        [startNode]: null,  // UPDATED WITH THE COORDS 
        [endNode]: null,
        [currentNode]: null
    }




// COMPONENT


export default function Main() {

    const mazeArr = React.useRef(initialArr)

    const specialNodes = React.useRef({ ...templateSpecialNodes })

    const clickChoiceNames = [wallNode, pathNode, startNode, endNode]

    const [options, setOptions] = React.useState({
        clickChoices: clickChoiceNames.map(name => {
            if (name === wallNode) {
                return {
                    clickChoiceType: name,
                    isSelected: true
                }
            }
            return {
                clickChoiceType: name,
                isSelected: false
            }
        }),
        // FILL OUT OPTIONS
        mazegenAlgo: "",
        pathfindingAlgo: bfs,
        
        isSlowMo: false,
    })


    const [pathfindingIsRunning, setPathfindingIsRunning] = React.useState(false)
    const [mazegenIsRunning, setMazegenIsRunning] = React.useState(false)


    // ALLOWS US TO MANUALLY RENDER (SINCE WE'RE USING REFS TO CHOOSE WHEN TO RENDER)
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)


    function updateMazeOnClick(coords) {
        const choiceType = getClickChoiceType()
        // IF CLICK CHOICE IS START OR END NODE - EITHER UPDATE SPECIAL NODES REF WITH COORDS
        //      OR, IF ALREADY EXISTS, RETURN FROM FUNCTION (SAFETY CHECK)
        if (choiceType === startNode || choiceType === endNode) {
            if (choiceType === startNode && specialNodes.current.startNode) {
                return
            } else if (choiceType === endNode && specialNodes.current.endNode) {
                return
            } else if (choiceType === startNode && !specialNodes.current.startNode) {
                specialNodes.current.startNode = coords
                // HANDLES CASE WHERE START REPLACES END AND VICE VERSA
                if (specialNodes.current.endNode &&
                    coords[0] === specialNodes.current.endNode[0] &&
                    coords[1] === specialNodes.current.endNode[1]) {
                    // _.isEqual(coords, specialNodes.current.endNode)) {
                    specialNodes.current.endNode = null
                }
            } else if (choiceType === endNode && !specialNodes.current.endNode) {
                specialNodes.current.endNode = coords

                if (specialNodes.current.startNode &&
                    coords[0] === specialNodes.current.startNode[0] &&
                    coords[1] === specialNodes.current.startNode[1]) {
                    // _.isEqual(coords, specialNodes.current.startNode)) {
                    specialNodes.current.startNode = null
                }
            }
        }
        // IF CHANGING A START/END NODE TO SOMETHING ELSE, REMOVE COORDS FROM SPECIAL NODES REF
        // else if (_.isEqual(coords, specialNodes.current.startNode)) {
        else if (specialNodes.current.startNode &&
            coords[0] === specialNodes.current.startNode[0] &&
            coords[1] === specialNodes.current.startNode[1]) {
            specialNodes.current.startNode = null
        // } else if (_.isEqual(coords, specialNodes.current.endNode)) {
        } else if (specialNodes.current.endNode &&
            coords[0] === specialNodes.current.endNode[0] &&
            coords[1] === specialNodes.current.endNode[1]) {
            specialNodes.current.endNode = null
        }
        // UPDATE NODE WITH THE CHOSEN NODE TYPE
        let node = mazeArr.current[coords[0]][coords[1]]
        node = {
            ...node,
            clickChoiceType: choiceType
        }
        mazeArr.current[coords[0]][coords[1]] = node
        forceUpdate()
    }



    
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


    function getClickChoiceType() {
        const newArr = options.clickChoices.filter(choice => {
            return choice.isSelected
        })
        return newArr[0].clickChoiceType
    }

    function runPathfinding() {
        setPathfindingIsRunning(true)
        setMazegenIsRunning(false)
    }

    function runMazegen() {
        setMazegenIsRunning(true)
        setPathfindingIsRunning(false)
    }

    function stopPathfinding() {
        setPathfindingIsRunning(false)
    }

    function stopMazegen() {
        setMazegenIsRunning(false)
    }

    function resetMaze() {
        mazeArr.current = getResetMaze()
        specialNodes.current = { ...templateSpecialNodes }
        forceUpdate()
    }

    function resetPathfinding() {
        for (let row of mazeArr.current) {
            for (let node of row) {
                node.pathfinding = getTemplatePathfinding()
            }
        }
        specialNodes.current.currentNode = null
        forceUpdate()
    }


    // console.log("Rerendered main")


    return (
        <MainContext.Provider value={{
            updateMazeOnClick,
            forceUpdate,
            mazeArr,
            resetMaze,
            resetPathfinding,
            specialNodes,
            options,
            updateClickChoice,
            getClickChoiceType,
            runPathfinding,
            runMazegen,
            pathfindingIsRunning,
            mazegenIsRunning,
            stopPathfinding,
            stopMazegen,
            nodesInRow,
            rowsInCol,
        }}>
            <main>
                <div className='main--maze-container'>
                    <Maze />
                </div>
                <div className='main--options-container'>
                    <Options />
                </div>
            </main>
        </MainContext.Provider>
    )
}

export { MainContext }
