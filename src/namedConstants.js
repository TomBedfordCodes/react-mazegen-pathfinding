// NODE CHOICE TYPES
const wallNode = "wallNode"
const pathNode = "pathNode"

const startNode = "startNode"
const endNode = "endNode"


// NODE CHOICE NAMES
const choiceNames = {
    [wallNode]: "Wall",
    [pathNode]: "Path",

    [startNode]: "Start",
    [endNode]: "End"
}


// MAZEGEN ALGOS
const primms = "primms"


// PATHFINDING ALGOS
const dijkstras = "dijkstras"



export { 
    wallNode, pathNode, 
    startNode, endNode,
    choiceNames,
    primms, 
    dijkstras, 
}
