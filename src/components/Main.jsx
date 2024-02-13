import React from 'react'
import Maze from './maze/Maze.jsx'


// NEXT:
//      - KEEPING THE MAZE IN A REF (USE .CURRENT) AND MANUALLY TRIGGERING RE-RENDERS.
//      - ADD OPTIONS FOR WHAT TO PAINT ONSCREEN - JUST WALL AND PATH FOR NOW
//      - IMPLEMENT MAZEGEN SELECT AND BTN TO GENERATE, AND FIRST MAZEGEN ALGO
//      - CSS ANIMATIONS FOR EVERYTHING? MIGHT CAUSE LAG

// MAZE:
//      EACH NODE TO BE AN OBJECT WITHIN THE 2D ARRAY - SEPARATE OUT ATTRS RELEVANT TO EACH ALGO.
//      CREATE A SEPARATE FILE WITH ALL THE ALGO NAMES AS CONSTS AND USE THESE TO AVOID MISSPELLING.
//      PUT A 'SPECIAL NODES' OBJECT IN STATE AS WELL:
//          THIS WILL TRACK THE LOCATION OF THE START/END/CURRENT NODES (AND ANY OTHERS TO BE ADDED)
//          ON MAZE ARRAY UPDATE ALSO SET THE OBJECT IF ONE OF THE SPECIAL NODES CHANGES

// OPTIONS:
//      TRACK - IS MAZE GENERATION / PATHFINDING HAPPENING RIGHT NOW?
//      CLICKING (selectable radiobtn type thing):
//          WALL; PATH (normal speed); FOREST (x2 slower); MOUNTAIN (x5 slower); START; END 
//              (get react-icons for start/end)
//          KEEP IN STATE THE CURRENTLY SELECTED TYPE (use an enum or something similar)
//      WHICH MAZEGEN ALGO (some kind of dropdown selection component for these two):
//          KRUSKALS, PRIMMS, BACKTRACKING, HUNT AND KILL
//      WHICH PATHFINDING ALGO:
//          BFS, DFS (TURN LEFT), DIJKSTRA'S, A-STAR
//      TOGGLES (create custom useToggle hook for this):
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
const rowsInCol = 38

// CREATE INITIAL MAZE 2D ARRAY
const initialArr = []
for (let i = 0; i < rowsInCol; i++) {
    const row = []
    for (let j = 0; j < nodesInRow; j++) {
        row.push({
            nodeWidth,
            nodeHeight,
            coords: [i, j],
            id: `${i}, ${j}`,
            isWall: false  // UPDATE THIS OBJECT WITH ALL ALGO STUFF
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
    const [options, setOptions] = React.useState({})


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
        node = { ...node, isWall: !node.isWall }
        mazeArr.current[coords[0]][coords[1]] = node
        forceUpdate()
    }


    return (
        <MazeContext.Provider value={{
            updateMazeOnClick,
            forceUpdate,
            mazeArr,
            specialNodes,
            options,
        }}>
            <main>
                <div className='main--maze-container'>
                    <Maze />
                </div>
                <div className='main--options-container'>
                    <h2>Options</h2>
                    <div className='options--container'></div>
                </div>
            </main>
        </MazeContext.Provider>
    )
}

export { MazeContext }
