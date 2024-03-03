import React from 'react'
import Maze from './maze/Maze.jsx'
import Options from './options/Options.jsx'

import {
    wallNode, pathNode, forestNode, mountainNode,
    startNode, endNode, currentNode,
    prims, kruskals,
    bfs, dijkstras, 
} from '../namedConstants.js'


// NEXT - MOVE AS MANY OPTIONS FUNCTIONS DOWN TO OPTIONS COMPONENTS AS POSS
//      IMPLEMENT FIRST MAZE GEN ALGO AND GET ALL RELEVANT BTNS WORKING
//      REDESIGN OPTIONS MENU UI (import components? put options in scrollable container?)
//      DISABLE MOST BTNS WHEN ALGOS ARE RUNNING
//      HAVE REF BOOL FOR WHEN PATHFINDING IS DONE (AND NOT RESET); IF TERRAIN/START/END CHANGE,
//          RE-RUN PATHFINDING (WITHOUT SLOW-MO ON). RESET BOOL IF MAZE RESET OR PATHFINDING RESET.

// OPTIONS:
//      TERRAIN FOR CLICKING (track state so only one can be selected - can be null):
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

// FOR FOUND PATH - HAVE AN ARROW ICON AT THE START NODE AND ALSO HAVE AN ARROW ICON AT THE
//      END NODE. REVERSE THE DRAW PATH BY STORING VALUES IN AN ARRAY IN A REF THEN WORKING BACKWARDS.

// STRETCH GOALS:
//      RESIZE MAZE TO FILL MOST OF THE SCREEN DYNAMICALLY
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
//      DRAG AND DROP START AND END NODES - DRAG AND DROP EITHER AFTER PATHFINDING TO READJUST PATH
//          (WITHOUT REDRAWING IN SLOW-MO). SEPARATE FROM TERRAIN CLICK STUFF.
//          This will need to take priority over terrain drawing if hovering over start/endnode.
//          STUCK ON THE PROBLEM OF HOW TO AVOID RE-RENDERING UNTIL ALGO IS COMPLETE AFTER CLICKING,
//              because the flag to get the algo running is in state, so triggers a re-render.
//              Maybe within the onClick function; check if pathfindingComplete flag (ref) is true;
//              if so, run func that while-loops whatever current algo is - I just need to
//              update the mazeArr, then at the end forceUpdate. I've moved clickUpdate func into 
//              maze component so we will have access to the maze helper funcs.
//      RESIZE NODE SIZE (MIN MAYBE 7PX, MAX 25PX) - WILL NEED TO RECALC MAZE SIZE ETC.





const MainContext = React.createContext()


const nodeWidth = 11  // 10 to 30
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
    
        // UPDATE THIS OBJECT WITH ALL ALGO VARS (LIKE F, G ETC.)
    
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

    // const mouseLastEnteredNode = React.useRef(Date.now())


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



    // // WHEN USER CLICKS ON THE MAZE (CHANGES TERRAIN ETC.)
    // function updateMazeOnClick(coords) {
    //     if (Date.now() - mouseLastEnteredNode.current < 30) {
    //         return
    //     }
    //     mouseLastEnteredNode.current = Date.now()
    //     const choiceType = getClickChoiceType()
    //     // IF CLICK CHOICE IS START OR END NODE, UPDATE SPECIAL NODES REF WITH COORDS
    //     if (choiceType === startNode || choiceType === endNode) {
    //         if (choiceType === startNode && specialNodes.current.startNode) {
    //             changeNodeClickChoice(specialNodes.current.startNode, pathNode)
    //             specialNodes.current.startNode = null
    //         } else if (choiceType === endNode && specialNodes.current.endNode) {
    //             changeNodeClickChoice(specialNodes.current.endNode, pathNode)
    //             specialNodes.current.endNode = null
    //         } 
    //         if (choiceType === startNode && !specialNodes.current.startNode) {
    //             specialNodes.current.startNode = coords
    //             // HANDLES CASE WHERE START REPLACES END AND VICE VERSA
    //             if (_.isEqual(coords, specialNodes.current.endNode)) {
    //                 specialNodes.current.endNode = null
    //             }
    //         } else if (choiceType === endNode && !specialNodes.current.endNode) {
    //             specialNodes.current.endNode = coords
    //             if (_.isEqual(coords, specialNodes.current.startNode)) {
    //                 specialNodes.current.startNode = null
    //             }
    //         }
    //     }
    //     // IF CHANGING A START/END NODE TO SOMETHING ELSE, REMOVE COORDS FROM SPECIAL NODES REF
    //     else if (_.isEqual(coords, specialNodes.current.startNode)) {
    //         specialNodes.current.startNode = null
    //     } else if (_.isEqual(coords, specialNodes.current.endNode)) {
    //         specialNodes.current.endNode = null
    //     }
    //     // UPDATE NODE WITH THE CHOSEN NODE TYPE
    //     changeNodeClickChoice(coords, choiceType)
    //     forceUpdate()
    // }


    // function changeNodeClickChoice(coords, choiceType) {
    //     let node = mazeArr.current[coords[0]][coords[1]]
    //     node = {
    //         ...node,
    //         clickChoiceType: choiceType
    //     }
    //     mazeArr.current[coords[0]][coords[1]] = node
    // }

    function getClickChoiceType() {
        const newArr = options.clickChoices.filter(choice => {
            return choice.isSelected
        })
        return newArr[0].clickChoiceType
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

    
    function toggleIsSlow() {
        setOptions(prev => {
            return {
                ...prev,
                isSlowMo: !prev.isSlowMo
            }
        })
    }

    function runPathfinding() {
        resetPathfinding()
        // resetPathfinding(false)
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

    // function resetPathfinding(update=true) {
    function resetPathfinding() {
        stopPathfinding()
        for (let row of mazeArr.current) {
            for (let node of row) {
                node.pathfinding = getTemplatePathfinding()
            }
        }
        specialNodes.current.currentNode = null
        // if (update) {forceUpdate()}
        forceUpdate()
    }


    // console.log("Rerendered main")


    return (
        <MainContext.Provider value={{
            // updateMazeOnClick,
            forceUpdate,
            mazeArr,
            resetMaze,
            resetPathfinding,
            specialNodes,
            options,
            setOptions,
            toggleIsSlow,
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
