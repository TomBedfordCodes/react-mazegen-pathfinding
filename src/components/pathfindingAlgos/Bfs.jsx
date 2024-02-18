import React from 'react'
import { MazeContext } from '../Main'
import { bfs } from '../../namedConstants'
import useEffectOnUpdate from '../../hooks/useEffectonUpdate'


function Bfs() {

    const { 
        mazeArr, specialNodes, options, forceUpdate, isRunningInfo, setIsRunningInfo, 
    } = React.useContext(MazeContext)

    
    useEffectOnUpdate(() => {
        if (!isRunningInfo.isRunning || isRunningInfo.algorithm != bfs) return

        // IF IT'S RUNNING AND THE RELEVANT ALGO IS SELECTED, RUN ALGO HERE

    }, [isRunningInfo])


    return (
        <>
        </>
    )
}
