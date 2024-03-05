import React from 'react'
import Maze from './maze/Maze.jsx'
import Options from './options/Options.jsx'

import {
    wallNode, pathNode, forestNode, mountainNode,
    startNode, endNode, currentNode,
    prims, kruskals,
    bfs, dijkstras, 
} from '../namedConstants.js'



// NEXT - IMPLEMENT MORE ALGOS.
//      SELECT ELEMENTS SHOULD AUTOMATICALLY GENERATE THE OPTIONS BASED ON NAMEDCONSTANTS
//      DISABLE MOST BTNS WHEN ALGOS ARE RUNNING (TERRAIN ETC.)
//      REDESIGN OPTIONS MENU UI (import components; put options in scrollable container)
//          It needs to be a lot more informative. How to do hover text?
//      HAVE REF BOOL FOR WHEN PATHFINDING IS DONE (AND NOT RESET); IF TERRAIN/START/END CHANGE,
//          RE-RUN PATHFINDING (WITHOUT SLOW-MO ON). RESET BOOL IF MAZE RESET OR PATHFINDING RESET.
//          Just implement the basics of this at first with test console.logs()

// OPTIONS:
//      TERRAIN FOR CLICKING (track state so only one can be selected:
//          WALL; PATH (normal speed); FOREST (x2 slower); MOUNTAIN (x5 slower)
//      SPECIAL NODES FOR CLICKING -
//          START; END (get react-icons for start/end)
//      WHICH MAZEGEN ALGO (dropdown selection component for these two):
//          KRUSKAL'S, PRIM'S, BACKTRACKING, HUNT AND KILL
//      WHICH PATHFINDING ALGO:
//          BFS, DFS (TURN LEFT), DIJKSTRA'S, A-STAR

// COLOURS:
//      PURPLE = (128, 0, 128)        - current
//      VIOLET = (171, 63, 220)       - hunt and kill starting row/column
//      FORESTGREEN = (0, 90, 0)
//      FORESTSEARCHGREEN = (0, 140, 0)

//      MIGHT BE BETTER TO HAVE LITTLE ICONS FOR FOREST/MOUNTAIN TILES, WHICH WOULDN'T AFFECT THE 
//          SEARCH COLOURS.

// FOR FOUND PATH - HAVE AN ARROW ICON AT THE START NODE AND ALSO HAVE AN ARROW ICON AT THE
//      END NODE. REVERSE THE DRAW PATH BY STORING VALUES IN AN ARRAY IN A REF THEN WORKING BACKWARDS.

// STRETCH GOALS:
//      I'D LIKE MOST OF THE SCREEN TO BE THE GRID, WITH AN OPTIONS MENU TO SLIDE FROM THE RIGHT
//          (WITH SOME BASIC OPTIONS ALWAYS VISIBLE?)
//      TOGGLE WALLS UNEDITABLE (I have the checkbox ready - it should be checked by default)
//      MOBILE FIRST:
//          - Use burger for menu in top-left which slides out.
//          - Not enough width for navbar (causing footer issues).
//          - Have settings at the top, then maze below. 'Generate maze' button 
// 	            just above maze. Possible to snap view to maze?
//      ADD 'VIA' SPECIAL NODE. DRAW PATH SHOULD ACCEPT PROPS FOR START, END, VIA NODES.
//      TUTORIAL (MAYBE A MODAL) SHOWING HOW TO USE IT.
//      DRAG AND DROP START AND END NODES - DRAG AND DROP EITHER AFTER PATHFINDING TO READJUST PATH
//          (WITHOUT REDRAWING IN SLOW-MO). SEPARATE FROM TERRAIN CLICK STUFF.
//          This will need to take priority over terrain drawing if hovering over start/endnode.
//          Also cant drop start/endnode on a wall, and dragging it around shouldn't be destructive.
//          Only update on mouserelease.
//      REF FLAG FOR PATHFIND COMPLETE. CHECK THIS FLAG WHEN MAZE CLICKED. DONT ALLOW START/END TO BE
//          REMOVED, BUT THEY CAN BE MOVED, OR TERRAIN ADDED/REMOVED. THEN RUN PATHFIND COMPONENT,
//          WITH NO RERENDERS UNTIL ALGO+DRAWNPATH COMPLETE. CLICK IN MAZE DOESNT RERENDER, SO FIGURE
//          OUT HOW TO RENDER THE ALGO COMPONENT AGAIN, AND CHECK THE REF FLAG IN A 
//          USEEFFECT, RUN THE ALGO AGAIN (MAY NEED A SEPARATE USEEFFECT WHICH JUST CHECKS THE FLAG)
//      RESIZE NODE SIZE (MIN MAYBE 7PX, MAX 25PX) - WILL NEED TO RECALC MAZE SIZE ETC.
//      POSSIBLE TO PAUSE AND RESUME ALGOS? WOULD BE IMPOSSIBLE WITH MY SETUP
//      HAVE FLAG FOR WHEN PATHFINDING BEGINS SO RESET PATHFINDING BTN ISN'T CLICKABLE AT ALL TIMES
//      GIVE FEEDBACK WHEN NO POSSIBLE PATH IS FOUND



const MainContext = React.createContext()

// INITIAL NODE/MAZE SIZE
const nodeWidth = 11  // Can range from 10 to 30
const nodeHeight = 11
let nodesInRow = 53
let rowsInCol = 39


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
        // CHOSEN NODE TYPE
        clickChoiceType: pathNode,
        // MAZEGEN
        [prims]: {},
        // PATHFINDING
        pathfinding: getTemplatePathfinding()
    }
}

// ON STARTUP CREATE MAZE - 2D ARRAY OF NODE OBJECTS
const initialArr = getResetMaze()

function getResetMaze(forMazegen=false) {
    const starterArr = []
    for (let i = 0; i < rowsInCol; i++) {
        const row = []
        for (let j = 0; j < nodesInRow; j++) {
            const node = getTemplateNode()
            node.coords = [i, j]
            node.id = `${i}, ${j}`
            node.clickChoiceType = forMazegen ? wallNode : pathNode
            row.push(node)
        }
        starterArr.push(row)
    }
    return starterArr
}


// TEMPLATE FOR SPECIAL NODES
const templateSpecialNodes = {
        [startNode]: null,  // UPDATES WITH THE COORDS 
        [endNode]: null,
        [currentNode]: null
    }




// COMPONENT
export default function Main() {

    // STATE AND REFS
    const mazeArr = React.useRef(initialArr)
    const specialNodes = React.useRef({ ...templateSpecialNodes })

    // TODO - REWORK CLICK CHOICES
    const clickChoiceNames = [
        startNode, endNode, wallNode, pathNode, forestNode, mountainNode
    ]

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
        mazegenAlgo: prims,
        pathfindingAlgo: bfs,
        
        isSlowMo: true,
    })

    const [pathfindingIsRunning, setPathfindingIsRunning] = React.useState(false)
    const [mazegenIsRunning, setMazegenIsRunning] = React.useState(false)


    // ALLOWS US TO MANUALLY RENDER (SINCE WE'RE USING REFS TO CHOOSE WHEN TO RENDER)
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)


    // RESIZE MAZE ON WINDOW RESIZE
    const [resizeToggle, setResizeToggle] = React.useState(false)

    React.useEffect(() => {
        if (pathfindingIsRunning || mazegenIsRunning) {
            return
        }
        const mazeContainer = document.getElementById("maze-container-rect")
        mazeContainer.style.width = "100%"
        mazeContainer.style.height = "100%"
        const width = mazeContainer.getBoundingClientRect().width
        const height = mazeContainer.getBoundingClientRect().height
        nodesInRow = Math.floor(width/nodeWidth) // width
        if (nodesInRow % 2 === 0) {
            nodesInRow--
        }
        rowsInCol = Math.floor(height/nodeHeight) // height
        if (rowsInCol % 2 === 0) {
            rowsInCol--
        }
        mazeContainer.style.width = `${nodesInRow * (nodeWidth)}px`
        mazeContainer.style.height = `${rowsInCol * (nodeHeight)}px`
        resetMaze()
    }, [resizeToggle])

    React.useEffect(() => {
        function resizeMaze() {
            setResizeToggle(prev => !prev)
        }
        window.addEventListener("resize", resizeMaze)
        return () => window.removeEventListener("resize", resizeMaze)
    }, [])


    // GET CURRENT CHOSEN NODE TYPE FOR CLICKING IN THE MAZE
    function getClickChoiceType() {
        const newArr = options.clickChoices.filter(choice => {
            return choice.isSelected
        })
        return newArr[0].clickChoiceType
    }


    // FUNCTIONS TO CONTROL ALGOS AND MAZE
    function resetMaze(forMazegen=false) {
        stopMazegen()
        stopPathfinding()
        mazeArr.current = getResetMaze(forMazegen)
        specialNodes.current = { ...templateSpecialNodes }
        forceUpdate()
    }

    function runPathfinding() {
        resetPathfinding()
        setPathfindingIsRunning(true)
        setMazegenIsRunning(false)
    }

    function runMazegen() {
        resetMaze(true)
        setMazegenIsRunning(true)
        setPathfindingIsRunning(false)
    }

    function stopPathfinding() {
        setPathfindingIsRunning(false)
    }

    function stopMazegen() {
        setMazegenIsRunning(false)
    }

    function resetPathfinding(rerender=true) {
        stopPathfinding()
        for (let row of mazeArr.current) {
            for (let node of row) {
                node.pathfinding = getTemplatePathfinding()
            }
        }
        specialNodes.current.currentNode = null
        if (rerender) {forceUpdate()}
    }


    // console.log("Rerendered main")


    return (
        <MainContext.Provider value={{
            forceUpdate,
            mazeArr,
            resetMaze,
            resetPathfinding,
            specialNodes,
            options,
            setOptions,
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
