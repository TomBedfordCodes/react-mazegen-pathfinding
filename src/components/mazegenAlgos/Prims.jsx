import React from 'react'
import { MainContext } from '../Main'
import { prims } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'


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

    const count = React.useRef(0)


    return (
        <>
        </>
    )
}
