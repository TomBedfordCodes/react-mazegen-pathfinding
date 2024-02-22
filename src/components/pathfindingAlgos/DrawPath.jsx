import React from 'react'
import { MazeContext } from '../maze/Maze'
import { MainContext } from '../Main'
import { currentNode } from '../../namedConstants'


export default function DrawPath({ isDrawingPath }) {

    const { 
        options,
        specialNodes,
        stopPathfinding,
    } = React.useContext(MainContext)

    const {
        forceMazeUpdate,
        makeNodeDrawnPath,
        getPathfindingParentCoords,
    } = React.useContext(MazeContext)

    const currNodeCoords = React.useRef(specialNodes.current.endNode)
    const [depsLocalPathUpdate, localPathUpdate] = React.useReducer(x => x + 1, 0)


    // THIS COMPONENT IS CREATED WHEN WE'RE READY TO DRAW A PATH, AND WILL KEEP RE-RENDERING
    //      IN A LOOP UNTIL STARTNODE IS FOUND, THEN WILL STOP ALL PATHFINDING
    React.useEffect(() => {
        if (!isDrawingPath) {
            return
        }
        makeNodeDrawnPath(currNodeCoords.current)
        // if (options.isSlowMo) {
        //     forceMazeUpdate()
        // }
        if (_.isEqual(currNodeCoords.current, specialNodes.current.startNode)) {
            stopPathfinding()
            forceMazeUpdate()
            return
        }
        if (!getPathfindingParentCoords(currNodeCoords.current)) {
            console.log(currNodeCoords.current)
            console.log(specialNodes.current.startNode)
        }
        currNodeCoords.current = getPathfindingParentCoords(currNodeCoords.current)

        setTimeout(localPathUpdate, 20)

    }, [isDrawingPath, depsLocalPathUpdate])


    return (
        <>
        </>
    )
}
