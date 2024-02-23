import React from 'react'
import { MainContext } from '../Main'
import { bfs } from '../../namedConstants'
import useEffectOnUpdate from '../../hooks/useEffectOnUpdate'
import { MazeContext } from '../maze/Maze'
import DrawPath from './DrawPath'


export default function Bfs() {

    const {
        specialNodes, 
        options, 
        pathfindingIsRunning, 
        stopPathfinding,
    } = React.useContext(MainContext)

    const {
        forceMazeUpdate,
        makeNodeSearched,
        isNodeSearched,
        getAdjPassages,
        makeNodeFrontier,
        makeNodeCurrent,
        updatePathfindingParentNode,
    } = React.useContext(MazeContext)


    const queue = React.useRef([])
    const [depsLocalUpdate, localUpdate] = React.useReducer(x => x + 1, 0)
    const [isDrawingPath, setIsDrawingPath] = React.useState(false)

    const count = React.useRef(0)

    
    // console.log("Rerendered BFS")


    React.useEffect(() => {
        if (!pathfindingIsRunning && isDrawingPath) {
            setIsDrawingPath(false)
        }
    })

    React.useEffect(() => {
        // if (!options.isSlowMo) {
        //     return
        // }
    // useEffectOnUpdate(() => {
        // This useEffect function gets a closure with the current state values; any changes in
        //      state will not be reflected until the function is run again.
        if (!pathfindingIsRunning || options.pathfindingAlgo != bfs || 
            !specialNodes.current.startNode || !specialNodes.current.endNode) { 
            return
        }
        // ALGORITHM (USING COORDS TO REPRESENT NODES)
        if (queue.current.length <= 0 && !isNodeSearched(specialNodes.current.startNode)) {
            // IF QUEUE IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
            const firstNodeCoords = specialNodes.current.startNode
            makeNodeSearched(firstNodeCoords)
            queue.current.push(firstNodeCoords)
            // USE FORCEMAZEUPDATE TO RE-RENDER THE MAZE MID-ALGO IF SLOW-MO IS TOGGLED ON
            if (options.isSlowMo) forceMazeUpdate()
        } 
        else if (queue.current.length <= 0) {
            // EMPTY QUEUE WITHOUT A PATH MEANS PATHFIND FAILED - WE EXIT HERE
            forceMazeUpdate()
            stopPathfinding()
            return
        }
        const curr = queue.current.shift()
        makeNodeSearched(curr)
        makeNodeCurrent(curr)
        for (let adjPsg of getAdjPassages(curr)) {
            if (isNodeSearched(adjPsg)) {
                continue
            }
            if (_.isEqual(adjPsg, specialNodes.current.endNode)) {
                // IF WE FIND THE END, ADD THE CURRENT NODE AS ITS PARENT, DRAW THE PATH FROM THE EXIT
                updatePathfindingParentNode(adjPsg, curr)
                setIsDrawingPath(true)
                return
            }
            // OTHERWISE ADD ADJ CELL TO FRONTIER, AND CHANGE ADJ PASSAGE TO SEARCHED
            makeNodeFrontier(adjPsg)
            queue.current.push(adjPsg)
            // if (options.isSlowMo) forceMazeUpdate()  // in case we want to update every frame
            // UPDATE PARENT OF ADJ_PSG
            updatePathfindingParentNode(adjPsg, curr)
        }
        // IF WE HAVEN'T FINISHED THE ALGO YET, TRIGGER A RE-RENDER TO CONTINUE (AND GET UPDATED STATE)
        if (options.isSlowMo) {setTimeout(localUpdate, 10)}
        else {setTimeout(localUpdate, 0)}
        
        // DRAW EVERY FOUR UPDATES
        count.current++
        if (count.current % 1 === 0 && options.isSlowMo) {
            forceMazeUpdate()
        }

    }, [depsLocalUpdate, pathfindingIsRunning])




    // // WHILE LOOP VERSION
    // React.useEffect(() => {
    //     if (options.isSlowMo) {
    //         return
    //     }
    //     if (!pathfindingIsRunning || options.pathfindingAlgo != bfs || 
    //         !specialNodes.current.startNode || !specialNodes.current.endNode) { 
    //         return
    //     }
    //     // ALGORITHM (USING COORDS TO REPRESENT NODES)
    //     if (queue.current.length <= 0 && !isNodeSearched(specialNodes.current.startNode)) {
    //         // IF QUEUE IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
    //         const firstNodeCoords = specialNodes.current.startNode
    //         makeNodeSearched(firstNodeCoords)
    //         queue.current.push(firstNodeCoords)
    //         // USE FORCEMAZEUPDATE TO RE-RENDER THE MAZE MID-ALGO IF SLOW-MO IS TOGGLED ON
    //         // if (options.isSlowMo) forceMazeUpdate()
    //     } 
    //     while (queue.current.length > 0) {
    //         const curr = queue.current.shift()
    //         makeNodeSearched(curr)
    //         for (let adjPsg of getAdjPassages(curr)) {
    //             if (isNodeSearched(adjPsg)) {
    //                 continue
    //             }
    //             // if (_.isEqual(adjPsg, specialNodes.current.endNode)) {
    //             if (adjPsg[0] === specialNodes.current.endNode[0] &&
    //                 adjPsg[1] === specialNodes.current.endNode[1]) {
    //                 // if we find the end, add the current node as its parent, draw the path from the exit
    //                 updatePathfindingParentNode(adjPsg, curr)
    //                 setIsDrawingPath(true)
    //                 queue.length = 0
    //                 return
    //             }
    //             // otherwise add adjpsg to frontier, and change adj passage to searched
    //             makeNodeFrontier(adjPsg)
    //             queue.current.push(adjPsg)
    //             // if (options.isSlowMo) forceMazeUpdate()
    //             updatePathfindingParentNode(adjPsg, curr)
    //         }
    //     }
        
    //     forceMazeUpdate()
    //     stopPathfinding()

    // }, [depsLocalUpdate, pathfindingIsRunning])


    return (
        <>
            {isDrawingPath && <DrawPath isDrawingPath={isDrawingPath} />}
        </>
    )
}
