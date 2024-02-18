import React from 'react'
import Maze from './maze/Maze.jsx'
import Options from './options/Options.jsx'

import {
    wallNode, pathNode,
    startNode, endNode, currentNode,
    primms,
    dijkstras
} from '../namedConstants.js'


// NEXT:
//      - IMPLEMENT BFS PATHFINDING
//      - CSS ANIMATIONS FOR EVERYTHING? JUST TWO BASIC STATES, AND MANUAL RERENDERING TO AVOID LAG

// MAZE:
//      EACH NODE TO BE AN OBJECT WITHIN THE 2D ARRAY - SEPARATE OUT ATTRS RELEVANT TO EACH ALGO.
//      CREATE A SEPARATE FILE WITH ALL THE ALGO/TERRAIN/PATHFINDING NAMES AS CONSTS AND USE 
//            THESE TO AVOID MISSPELLINGS.
//      PUT A 'SPECIAL NODES' OBJECT IN STATE AS WELL:
//          THIS WILL TRACK THE LOCATION OF THE START/END/CURRENT NODES (AND ANY OTHERS TO BE ADDED).
//          ON MAZE ARRAY UPDATE ALSO SET THE OBJECT IF ONE OF THE SPECIAL NODES CHANGES.

// OPTIONS:
//      KEEP TRACK - IS MAZE GENERATION / PATHFINDING HAPPENING RIGHT NOW?
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





const MazeContext = React.createContext()


const nodeWidth = 11
const nodeHeight = 11
const nodesInRow = 53
const rowsInCol = 39

const templateNode = {
    nodeWidth,
    nodeHeight,
    coords: [],
    id: ``,

    // UPDATE THIS OBJECT WITH ALL ALGO VARS (LIKE F, G ETC.) - USING CONSTS FROM NAMES FILE

    // CHOSEN NODE TYPE
    clickChoiceType: pathNode,

    // MAZEGEN
    [primms]: {},

    // PATHFINDING
    [dijkstras]: {},
}



// ON STARTUP CREATE MAZE - 2D ARRAY OF NODE OBJECTS

const initialArr = getResetMaze()

function getResetMaze() {
    const starterArr = []
    for (let i = 0; i < rowsInCol; i++) {
        const row = []
        for (let j = 0; j < nodesInRow; j++) {
            row.push({
                ...templateNode,
                coords: [i, j],
                id: `${i}, ${j}`,
            })
        }
        starterArr.push(row)
    }
    return starterArr
}


// for (let i = 0; i < rowsInCol; i++) {
//     const row = []
//     for (let j = 0; j < nodesInRow; j++) {
//         row.push({
//             ...templateNode,
//             coords: [i, j],
//             id: `${i}, ${j}`,
            // nodeWidth,
            // nodeHeight,

            // isWall: false,  // THIS WILL BE REPLACED BY TERRAINTYPE

            // UPDATE THIS OBJECT WITH ALL ALGO VARS (LIKE F, G ETC.) - USING CONSTS FROM NAMES FILE

            // TERRAIN
            // clickChoiceType: pathNode,

            // MAZEGEN
            // [primms]: {},

            // PATHFINDING
            // [dijkstras]: {},
//
//         })
//     }
// initialArr.push(row)
// }





// COMPONENT


export default function Main() {

    const mazeArr = React.useRef(initialArr)

    const specialNodes = React.useRef({
        [startNode]: null,  // THESE WILL BE UPDATED WITH THE COORDS 
        [endNode]: null,
        [currentNode]: null
    })


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
        pathfindingAlgo: "",
    })


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
                    specialNodes.current.endNode = null
                }
            } else if (choiceType === endNode && !specialNodes.current.endNode) {
                specialNodes.current.endNode = coords

                if (specialNodes.current.startNode &&
                        coords[0] === specialNodes.current.startNode[0] && 
                        coords[1] === specialNodes.current.startNode[1]) {
                    specialNodes.current.startNode = null
                }
            }
        }
        // IF CHANGING A START/END NODE TO SOMETHING ELSE, REMOVE COORDS FROM SPECIAL NODES REF
        else if (specialNodes.current.startNode &&
                coords[0] === specialNodes.current.startNode[0] && 
                coords[1] === specialNodes.current.startNode[1]) {
            specialNodes.current.startNode = null
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


    function resetMaze() {
        mazeArr.current = getResetMaze()
        forceUpdate()
    }


    return (
        <MazeContext.Provider value={{
            updateMazeOnClick,
            forceUpdate,
            mazeArr,
            specialNodes,
            options,
            updateClickChoice,
            getClickChoiceType,
        }}>
            <main>
                <div className='main--maze-container'>
                    <Maze />
                </div>
                <div className='main--options-container'>
                    <Options />
                    {/* REPLACE WITH A PROPER ONE IN OPTIONS */}
                    <button onClick={resetMaze}>Reset Maze</button>
                </div>
            </main>
        </MazeContext.Provider>
    )
}

export { MazeContext }
