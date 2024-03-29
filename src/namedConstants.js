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

// SPECIAL NODES
const currentNode = "currentNode"
const hnkCurrentRow = "hnkCurrentRow"
const hnkCurrentCol = "hnkCurrentCol"


// TERRAIN WEIGHTS
const terrainWeights = {
    [startNode]: 1,
    [endNode]: 1,
    [pathNode]: 1,
    [forestNode]: 5,
    [mountainNode]: 15,
}

// NODE DISPLAY NAMES
const choiceNames = {
    [wallNode]: "Wall ∞",
    [pathNode]: `Path x${terrainWeights[pathNode]}`,
    [forestNode]: `Forest x${terrainWeights[forestNode]}`,
    [mountainNode]: `Mountain x${terrainWeights[mountainNode]}`,

    // TODO - REMOVE START/ENDNODES FROM THIS DICT?
    [startNode]: "Start Node",
    [endNode]: "End Node",
}


// MAZEGEN ALGOS
const prims = "prims"
const backtracking = "backtracking"
const kruskals = "kruskals"
const huntAndKill = "huntAndKill"


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
    [huntAndKill]: "Hunt and Kill",
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
    startNode, endNode, 
    currentNode, hnkCurrentRow, hnkCurrentCol,
    drawnPathNode, searchedNode, frontierNode,
    choiceNames,
    terrainWeights,
    prims, backtracking, kruskals, huntAndKill,
    bfs, dfs, dijkstras, astar,
    mazegenAlgoNames, pathfindingAlgoNames
}
