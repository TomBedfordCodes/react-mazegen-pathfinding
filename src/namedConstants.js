// NODE CHOICE TYPES
const wallNode = "wallNode"
const pathNode = "pathNode"

const startNode = "startNode"
const endNode = "endNode"

const drawnPathNode = "drawnPathNode"
const searchedNode = "searchedNode"
const frontierNode = "frontierNode"
const currentNode = "currentNode"


// NODE CHOICE NAMES
const choiceNames = {
    [wallNode]: "Wall",
    [pathNode]: "Path",

    [startNode]: "Start",
    [endNode]: "End",
}


// MAZEGEN ALGOS
const primms = "primms"


// PATHFINDING ALGOS
const bfs = "bfs"
const dijkstras = "dijkstras"



export { 
    wallNode, pathNode, 
    startNode, endNode, currentNode, drawnPathNode, searchedNode, frontierNode,
    choiceNames,
    primms, 
    bfs, dijkstras,
}
