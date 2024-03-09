import React from 'react'
import { MainContext } from '../Main'
import { astar } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import DrawPath from './DrawPath'
import usePathfinding from '../../hooks/usePathfinding'


export default function AStar() {

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

    
    const [
        queue, depsLocalUpdate, localUpdate, isDrawingPath, setIsDrawingPath, count
    ] = usePathfinding()
    

    // console.log("Rerendered A-Star")


    React.useEffect(() => {
        if (!pathfindingIsRunning || options.pathfindingAlgo != astar || 
            !specialNodes.current.startNode || !specialNodes.current.endNode) { 
            return
        }
        // EDGE CASES (START AND END) - NODES ARE REPRESENTED BY COORDS
        if (queue.current.length <= 0 && !isNodeSearched(specialNodes.current.startNode)) {
            // IF QUEUE IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
            const firstNodeCoords = specialNodes.current.startNode
            makeNodeSearched(firstNodeCoords)
            queue.current.push(firstNodeCoords)
            if (options.isSlowMo) forceMazeUpdate()
        } 
        else if (queue.current.length <= 0) {
            // EMPTY QUEUE WITHOUT A PATH MEANS PATHFIND FAILED - WE EXIT HERE
            stopPathfinding()
            specialNodes.current.currentNode = null
            return
        }

        // REPEATING PART OF ALGORITHM

        

        
        // IF WE HAVEN'T FINISHED THE ALGO YET, TRIGGER A RE-RENDER TO CONTINUE (AND GET UPDATED STATE)
        if (options.isSlowMo) {
            // GOES FASTER THE MORE NODES THERE ARE IN QUEUE
            let timeBetweenRenders = (1 / (queue.current.length * (queue.current.length / 5))) * 450   // 10
            timeBetweenRenders = Math.max(2, timeBetweenRenders)
            timeBetweenRenders = Math.min(10, timeBetweenRenders)
            setTimeout(localUpdate, timeBetweenRenders)
        } else {setTimeout(localUpdate, 0)}
        
        // DRAW AFTER X UPDATE CYCLES HAVE PASSED
        let skipFrames = 1
        if (queue.current.length > 45) {
            skipFrames = 4
        } else if (queue.current.length > 30) {
            skipFrames = 3
        } else if (queue.current.length > 15) { 
            skipFrames = 2
        } 
        count.current++
        if (count.current % skipFrames === 0 && options.isSlowMo) {
            forceMazeUpdate()
        }
    }, [depsLocalUpdate, pathfindingIsRunning])


    return (
        <>
            {isDrawingPath && 
                <DrawPath isDrawingPath={isDrawingPath} setIsDrawingPath={setIsDrawingPath} />}
        </>
    )
}
