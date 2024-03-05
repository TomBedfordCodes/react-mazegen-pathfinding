import React from 'react'

// RETURNS ALL NEEDED REFS/STATE FOR PATHFINDING ALGORITHMS
export default function useMazegen() {
    
    const stackOrQueue = React.useRef([])
    const [depsLocalUpdate, localUpdate] = React.useReducer(x => x + 1, 0)
    const [isDrawingPath, setIsDrawingPath] = React.useState(false)
    const count = React.useRef(0)
    
    return [stackOrQueue, depsLocalUpdate, localUpdate, isDrawingPath, setIsDrawingPath, count]
}
