// NODE CHOICE TYPES
const wallNode = "wallNode"
const pathNode = "pathNode"
const forestNode = "forestNode"
const searchedForestNode = "searchedForestNode"
const frontierForestNode = "frontierForestNode"
const mountainNode = "mountainNode"
const searchedMountainNode = "searchedMountainNode"
const frontierMountainNode = "frontierMountainNode"

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
    [forestNode]: "Forest",
    [mountainNode]: "Mountain",

    // TODO - REMOVE START/ENDNODES FROM THIS DICT?
    [startNode]: "Start Node",
    [endNode]: "End Node",
}


// MAZEGEN ALGOS
const prims = "prims"
const backtracking = "backtracking"
const kruskals = "kruskals"


// PATHFINDING ALGOS
const bfs = "bfs"
const dijkstras = "dijkstras"


// DISPLAY NAMES
const mazegenAlgoNames = {
    [prims]: "Prim's",
    [backtracking]: "Backtracking",
    [kruskals]: "Kruskal's",
}

const pathfindingAlgoNames = {
    [bfs]: "BFS",
    [dijkstras]: "Dijkstra's"
}


export { 
    wallNode, pathNode, forestNode, mountainNode, 
    searchedForestNode, frontierForestNode, searchedMountainNode, frontierMountainNode,
    startNode, endNode, currentNode, 
    drawnPathNode, searchedNode, frontierNode,
    choiceNames,
    prims, backtracking, kruskals,
    bfs, dijkstras,
    mazegenAlgoNames, pathfindingAlgoNames
}
