import React from 'react'
import Maze from './maze/Maze.jsx'
import Options from './options/Options.jsx'

import {
    wallNode, pathNode,
    primms,
    dijkstras
} from '../namedConstants.js'


// NEXT:
//      - ADD OPTIONS FOR CHOOSING TERRAIN - JUST WALL AND PATH FOR NOW
//      - IMPLEMENT MAZEGEN SELECT AND BTN TO GENERATE, AND FIRST MAZEGEN ALGO
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


// ON STARTUP CREATE MAZE - 2D ARRAY OF NODE OBJECTS
const initialArr = []
for (let i = 0; i < rowsInCol; i++) {
    const row = []
    for (let j = 0; j < nodesInRow; j++) {
        row.push({
            nodeWidth,
            nodeHeight,
            coords: [i, j],
            id: `${i}, ${j}`,

            // isWall: false,  // THIS WILL BE REPLACED BY TERRAINTYPE

            // UPDATE THIS OBJECT WITH ALL ALGO VARS (LIKE F, G ETC.) - USING CONSTS FROM NAMES FILE

            // TERRAIN
            terrainType: pathNode,

            // MAZEGEN
            [primms]: {},

            // PATHFINDING
            [dijkstras]: {},

        })
    }
    initialArr.push(row)
}





// COMPONENT

export default function Main() {

    // const [mazeArr, setMazeArr] = React.useState(initialArr)
    // const [specialNodes, setSpecialNodes] = React.useState({
    //     start: null,
    //     end: null,
    //     current: null
    // })

    const mazeArr = React.useRef(initialArr)

    const specialNodes = React.useRef({
        start: null,
        end: null,
        current: null
    })


    const terrainTypeNames = [wallNode, pathNode]

    const [options, setOptions] = React.useState({
        clickChoices: terrainTypeNames.map(name => {
            if (name === pathNode) {
                return {
                    terrainType: name,
                    isSelected: true
                }
            }
            return {
                terrainType: name,
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
        // setMazeArr(prevArr => {
        //     const newArr = prevArr.map((row, i) => {
        //         if (i != coords[0]) {
        //             return row
        //         }
        //         const newRow = row.map((node, j) => {
        //             if (j === coords[1]) {
        //                 return {
        //                     ...node,
        //                     isWall: !node.isWall
        //                 }
        //             } else {
        //                 return node
        //             }
        //         })
        //         return newRow
        //     })
        //     return newArr
        // })
        let node = mazeArr.current[coords[0]][coords[1]]
        node = { 
            ...node, 
            terrainType: getClickChoiceTerrainType()
        }
        mazeArr.current[coords[0]][coords[1]] = node
        forceUpdate()
    }


    function updateClickChoice(terrainType) {
        setOptions(prev => {
            return {
                ...prev,
                clickChoices: prev.clickChoices.map(choice => {
                    if (terrainType === choice.terrainType) {
                        return {
                            terrainType: choice.terrainType,
                            isSelected: !choice.isSelected
                        }
                    } else {
                        return choice
                    }
                })
            }
        })
    }

    
    function getClickChoiceTerrainType() {
        const newArr = options.clickChoices.filter(choice => {
            return choice.isSelected
        })
        return newArr[0].terrainType
    }


    return (
        <MazeContext.Provider value={{
            updateMazeOnClick,
            forceUpdate,
            mazeArr,
            specialNodes,
            options,
            updateClickChoice,
        }}>
            <main>
                <div className='main--maze-container'>
                    <Maze />
                </div>
                <div className='main--options-container'>
                    <Options />
                </div>
            </main>
        </MazeContext.Provider>
    )
}

export { MazeContext }
