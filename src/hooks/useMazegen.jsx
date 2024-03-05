import React from 'react'

// RETURNS ALL NEEDED REFS/STATE FOR MAZEGEN ALGORITHMS
export default function useMazegen(getAlgoStartingPoint) {
    
    const stackOrQueue = React.useRef([])
    const [depsLocalUpdate, localUpdate] = React.useReducer(x => x + 1, 0)

    // CHOOSE A RANDOM STARTING POINT (KEEP IN STATE TO CHECK IF THIS IS THE FIRST PASS)
    const [
        mazegenStartingPoint, 
        _setMazegenStartingPoint
    ] = React.useState(getAlgoStartingPoint)    
    
    return [stackOrQueue, depsLocalUpdate, localUpdate, mazegenStartingPoint]
}
