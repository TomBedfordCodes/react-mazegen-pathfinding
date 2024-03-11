import React from 'react'
import { MainContext } from '../Main'
import { kruskals } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import useMazegen from '../../hooks/useMazegen'


export default function Kruskals() {

    const {
        specialNodes,
        options,
        mazegenIsRunning,
        stopMazegen,
        nodesInRow,
        rowsInCol,
    } = React.useContext(MainContext)

    const {
        getMazegenAlgoStartingPoint,
        addMazegenStartAndEndNodes,
        forceMazeUpdate,
        getAdjCells,
        createPassage,
        makeNodePath,
        isPassable,
        isNodeWall,
        isPossibleCell,
    } = React.useContext(MazeContext)


    const [
        edgesQueue, depsLocalUpdate, localUpdate, mazegenStartingPoint
    ] = useMazegen(getMazegenAlgoStartingPoint)


    const parentMap = React.useRef([])  // 2D ARRAY WITH THE ROOTNODES OF EACH SUBTREE FOR EVERY CELL



    React.useEffect(() => {
        // INITIALIZE PARENTMAP
        for (let i = 0; i < rowsInCol; i++) {
            const row = []
            for (let j = 0; j < nodesInRow; j++) {
                if (isPossibleCell([i, j])) {
                    row.push(1)
                } else {
                    row.push(null)
                }
            }
            parentMap.current.push(row)
        }
        // INITIALIZE EDGES QUEUE
        for (let i = 1; i < rowsInCol; i += 2) {
            for (let j = 1; j < nodesInRow; j += 2) {
                const cell = [i, j]
                if (i >= rowsInCol - 2 && j >= nodesInRow - 2) {
                    continue
                } else if (i >= rowsInCol - 2) {
                    edgesQueue.current.push([cell, [i, j + 2]])
                } else if (j >= nodesInRow - 2) {
                    edgesQueue.current.push([cell, [i + 2, j]])
                } else {
                    edgesQueue.current.push([cell, [i, j + 2]])
                    edgesQueue.current.push([cell, [i + 2, j]])
                }
            }
        }
    }, [])



    // console.log("Kruskal's rerendered")



    React.useEffect(() => {
        if (!mazegenIsRunning || options.mazegenAlgo != kruskals) {
            return
        }
        // ALGORITHM (USING COORDS TO REPRESENT NODES)
        if (edgesQueue.current.length <= 0) {
            // EMPTY EDGESQUEUE MEANS MAZEGEN COMPLETE - ADD START AND END NODES AND EXIT
            addMazegenStartAndEndNodes()
            stopMazegen()
            return
        }
        // FUNCTIONS TO CLEAN UP ALGO
        function popRandomEdge() {
            const index = _.random(0, edgesQueue.current.length - 1)
            const edgeSpliceArr = edgesQueue.current.splice(index, 1)
            return edgeSpliceArr[0]
        }
        function findSubtreeRoot(coords) {
            // RECURSIVELY WORKS UP THROUGH PARENTS UNTIL IT REACHES THE ROOT OF THE NODE'S SUBTREE
            if (typeof (parentMap.current[coords[0]][coords[1]]) === "number") {
                return coords
            }
            const rootNodeCoords = findSubtreeRoot(parentMap.current[coords[0]][coords[1]])
            // PATH COMPRESSION: MAKE ROOTNODE THE PARENT OF EVERY NODE IN TREE IN THE PARENT_MAP
            parentMap.current[coords[0]][coords[1]] = rootNodeCoords
            return rootNodeCoords
        }
        function unionSubtrees(root1, root2) {
            // DEPTH OF SUBTREE TRACKED IN THE ROOT'S PARENT IN PARENT_MAP
            const root1Depth = parentMap.current[root1[0]][root1[1]]
            const root2Depth = parentMap.current[root2[0]][root2[1]]
            let addOne = false
            // MODIFY DEPTH OF SUBTREE IF THE TWO TREE'S DEPTHS ARE THE SAME
            if (root1Depth === root2Depth) { addOne = true }
            // ROOT OF THE SHALLOWER TREE BECOMES A CHILD OF THE ROOT OF THE DEEPER TREE
            if (root1Depth >= root2Depth) {
                parentMap.current[root2[0]][root2[1]] = root1
                if (addOne) { parentMap.current[root1[0]][root1[1]] += 1 }
            } else {
                parentMap.current[root1[0]][root1[1]] = root2
            }
        }
        // REPEATING PART OF ALGORITHM
        const [currNode, adjNode] = popRandomEdge()
        // FIND ROOT OF EACH SUBTREE - IF THEY'RE THE SAME, CONTINUE TO NEXT EDGE
        const currRoot = findSubtreeRoot(currNode)
        const adjRoot = findSubtreeRoot(adjNode)
        if (_.isEqual(currRoot, adjRoot)) {
            setTimeout(localUpdate, 0)
            return
        }
        // OTHERWISE, MAKE BOTH CURR AND ADJ NODES PATHS, ADD PASSAGE BETWEEN THEM, AND UNION SUBTREES
        makeNodePath(currNode)
        makeNodePath(adjNode)
        createPassage(currNode, adjNode)
        unionSubtrees(currRoot, adjRoot)

        // RERENDER MAZE IF ISLOWMO
        if (options.isSlowMo) { forceMazeUpdate() }

        // TRIGGER A RERENDER TO CONTINUE AFTER A CERTAIN AMOUNT OF TIME
        const timeBetweenRenders = 20
        if (options.isSlowMo) {
            setTimeout(localUpdate, timeBetweenRenders)
        } else { setTimeout(localUpdate, 0) }

    }, [depsLocalUpdate, mazegenIsRunning])

    return (
        <>
        </>
    )
}


// PYTHON
// def get_parent_map() -> list:
//     parent_map = []
//     for i in range(MAZE_SIZE):
//         row = []
//         for j in range(MAZE_SIZE):
//             if is_possible_cell((i, j)):
//                 row.append(1)
//             else:
//                 row.append(None)
//         parent_map.append(row)
//     return parent_map


// def get_edges_queue() -> list:
//     edges_queue = []
//     for i in range(1, MAZE_SIZE, 2):
//         for j in range(1, MAZE_SIZE, 2):
//             node = (i, j)
//             if i >= MAZE_SIZE - 2 and j >= MAZE_SIZE - 2:
//                 continue
//             elif i >= MAZE_SIZE - 2:
//                 edges_queue.append((node, (i, j + 2)))
//             elif j >= MAZE_SIZE - 2:
//                 edges_queue.append((node, (i + 2, j)))
//             else:
//                 edges_queue.append((node, (i, j + 2)))
//                 edges_queue.append((node, (i + 2, j)))
//     return edges_queue


// def Kruskals() -> None:
//     edges_queue = get_edges_queue()
//     parent_map = get_parent_map()
//     while edges_queue:
//         stop = quit_event_loop()
//         if stop:
//             return
//         # pop edge from queue, pop from queue, and get cellnodes from edge
//         edge = pop_random_edge(edges_queue)
//         curr_node, adj_node = edge
//         # find root of each subtree - if they're the same, continue to next edge
//         curr_root = find_subtree_root(curr_node, parent_map)
//         adj_root = find_subtree_root(adj_node, parent_map)
//         if curr_root == adj_root:
//             continue
//         # otherwise, make both curr and adj nodes cells, add passage in maze, and union subtrees
//         make_node_cell(curr_node)
//         make_node_cell(adj_node)
//         create_passage(curr_node, adj_node)
//         union_subtrees(curr_root, adj_root, parent_map)
//         # send signal maze is updated for rendering
//         signal_maze_updated()
//     create_entry_exit()


// def pop_random_edge(edges_queue) -> ((int, int), (int, int)):
//     index: int = random.randint(0, len(edges_queue) - 1)
//     edge: ((int, int), (int, int)) = edges_queue.pop(index)
//     return edge


// def find_subtree_root(node: (int, int), parent_map: list) -> (int, int):
//     # recursively works up through parents until it reaches the root of the node's subtree
//     if type(parent_map[node[0]][node[1]]) is int:
//         return node
//     root_node = find_subtree_root(parent_map[node[0]][node[1]], parent_map)
//     # path compression: makes the root node the parent for every node we've explored in the parent_map
//     parent_map[node[0]][node[1]] = root_node
//     return root_node


// def union_subtrees(root1: (int, int), root2: (int, int), parent_map) -> None:
//     # depth of subtree tracked in the root's parent in parent_map - only updated if the two tree's depths are the same
//     root1_depth = parent_map[root1[0]][root1[1]]
//     root2_depth = parent_map[root2[0]][root2[1]]
//     add_one: bool = False
//     if root1_depth == root2_depth:
//         add_one = True
//     # root of the shallower tree becomes a child of the root of the deeper tree.
//     if root1_depth >= root2_depth:
//         parent_map[root2[0]][root2[1]] = root1
//         if add_one:
//             parent_map[root1[0]][root1[1]] += 1
//     else:
//         parent_map[root1[0]][root1[1]] = root2

