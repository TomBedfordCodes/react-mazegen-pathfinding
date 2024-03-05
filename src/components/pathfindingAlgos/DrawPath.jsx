import React from 'react'
import { MazeContext } from '../maze/Maze'
import { MainContext } from '../Main'


export default function DrawPath({ isDrawingPath, setIsDrawingPath }) {
    // COMPONENT INSTANTIATED WHEN WE'RE READY TO DRAW A PATH

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


    // console.log("drawpath rerendered")


    // WILL KEEP RE-RENDERING IN A LOOP UNTIL STARTNODE IS FOUND, THEN STOP ALL PATHFINDING
    React.useEffect(() => {
        if (!isDrawingPath ) { // || !options.isSlowMo
            return
        }
        makeNodeDrawnPath(currNodeCoords.current)
        if (options.isSlowMo) {
            forceMazeUpdate()
        }
        if (_.isEqual(currNodeCoords.current, specialNodes.current.startNode)) {
            stopPathfinding()
            setIsDrawingPath(false)
            forceMazeUpdate()
            return
        }
        currNodeCoords.current = getPathfindingParentCoords(currNodeCoords.current)
        
        if (options.isSlowMo) {
            setTimeout(localPathUpdate, 18)
        } else {setTimeout(localPathUpdate, 0)}

    }, [isDrawingPath, depsLocalPathUpdate])


    // WHILE LOOP VERSION (IF SLOW-MO NOT SELECTED) - ERROR IS NO LONGER BEING THROWN...
    // React.useEffect(() => {
    //     if (!isDrawingPath || options.isSlowMo) {
    //         return
    //     }
    //     while (true) {
    //         makeNodeDrawnPath(currNodeCoords.current)
    //         if (_.isEqual(currNodeCoords.current, specialNodes.current.startNode)) {
    //             stopPathfinding()
    //             setIsDrawingPath(false)
    //             forceMazeUpdate()
    //             return
    //         }
    //         currNodeCoords.current = getPathfindingParentCoords(currNodeCoords.current)
    //     }
    // }, [isDrawingPath, options])


    return (
        <>
        </>
    )
}
