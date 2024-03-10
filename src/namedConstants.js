// NODE CHOICE TYPES
const wallNode = "wallNode"
const pathNode = "pathNode"
const forestNode = "forestNode"
const mountainNode = "mountainNode"
const searchedForestNode = "searchedForestNode"
const frontierForestNode = "frontierForestNode"
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

// TERRAIN WEIGHTS
const terrainWeights = {
    [startNode]: 1,
    [endNode]: 1,
    [pathNode]: 1,
    [forestNode]: 5,
    [mountainNode]: 15,
}


// MAZEGEN ALGOS
const prims = "prims"
const backtracking = "backtracking"
const kruskals = "kruskals"


// PATHFINDING ALGOS
const bfs = "bfs"
const dfs = "dfs"
const dijkstras = "dijkstras"
const astar = "astar"


// DISPLAY NAMES
const mazegenAlgoNames = {
    [prims]: "Prim's",
    [backtracking]: "Backtracking",
    [kruskals]: "Kruskal's",
}

const pathfindingAlgoNames = {
    [bfs]: "BFS",
    [dfs]: "DFS",
    [dijkstras]: "Dijkstra's",
    [astar]: "A-Star"
}


export { 
    wallNode, pathNode, forestNode, mountainNode, 
    searchedForestNode, frontierForestNode, searchedMountainNode, frontierMountainNode,
    startNode, endNode, currentNode, 
    drawnPathNode, searchedNode, frontierNode,
    choiceNames,
    terrainWeights,
    prims, backtracking, kruskals,
    bfs, dfs, dijkstras, astar,
    mazegenAlgoNames, pathfindingAlgoNames
}
