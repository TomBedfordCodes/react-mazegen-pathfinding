import React from 'react'
import { MainContext } from '../Main'
import { prims } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'


export default function Prims() {

    const {
        specialNodes, 
        options, 
        mazegenIsRunning, 
        stopMazegen,
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


    React.useEffect(() => {
        if (!mazegenIsRunning || options.mazegenAlso != prims) { 
            return
        }

        // ALGORITHM (USING COORDS TO REPRESENT NODES)
        
        // WHEN COMPLETE I'LL NEED TO ADD RANDOM START/ENDNODE POSITIONS

    



        // TRIGGER A RERENDER TO CONTINUE AFTER A CERTAIN AMOUNT OF TIME
        const timeBetweenRenders = 10
        if (options.isSlowMo) {
            setTimeout(localUpdate, timeBetweenRenders)
        } else {setTimeout(localUpdate, 0)}

        // DRAW AFTER X UPDATE CYCLES HAVE PASSED
        let skipFrames = 1
        count.current++
        if (count.current % skipFrames === 0 && options.isSlowMo) {
            forceMazeUpdate()
        }
    }, [depsLocalUpdate, mazegenIsRunning])



    return (
        <>
        </>
    )
}
