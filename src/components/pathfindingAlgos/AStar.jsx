import React from 'react'
import { MainContext } from '../Main'
import { 
    astar, terrainWeights // , pathNode, forestNode, mountainNode,
} from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import DrawPath from './DrawPath'
import usePathfinding from '../../hooks/usePathfinding'
import PriorityQueue from '../../helperFunctions/priorityQueue'


export default function Dijkstras() {

    const {
        specialNodes, 
        options, 
        pathfindingIsRunning, 
        stopPathfinding,
    } = React.useContext(MainContext)

    const {
        forceMazeUpdate,
        isNodeSearched,
        getAdjPassages,
        makeNodeFrontier,
        makeNodeCurrent,
        updatePathfindingParentNode,
        getNodeFromCoords,
    } = React.useContext(MazeContext)

    
    const [
        priorityQueue, depsLocalUpdate, localUpdate, isDrawingPath, setIsDrawingPath, count
    ] = usePathfinding()

    const orderCount = React.useRef(0)
    

    // G = DISTANCE FROM START TO CURRENT NODE
    // H = ESTIMATED DISTANCE FROM CURRENT NODE TO END
    // F = G + H
    React.useEffect(() => {
        priorityQueue.current = new PriorityQueue((a, b) => {
            if (a.pathfinding.f === b.pathfinding.f) {
                return a.pathfinding.orderAdded < b.pathfinding.orderAdded
            }
            return a.pathfinding.f < b.pathfinding.f
        })
    }, [])
    

    // console.log("Rerendered A-Star")


    React.useEffect(() => {
        if (!pathfindingIsRunning || options.pathfindingAlgo != astar || 
            !specialNodes.current.startNode || !specialNodes.current.endNode) { 
            return
        }
        // EDGE CASES (START AND END) - NODES ARE REPRESENTED BY COORDS
        if (priorityQueue.current.isEmpty() && !isNodeSearched(specialNodes.current.startNode)) {
            // IF QUEUE IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
            const firstNodeCoords = specialNodes.current.startNode
            const firstNode = getNodeFromCoords(firstNodeCoords)
            firstNode.pathfinding.g = 0
            const firstNodeH = getHVal(firstNodeCoords)
            firstNode.pathfinding.f = firstNode.pathfinding.g + firstNodeH
            firstNode.pathfinding.orderAdded = orderCount.current
            priorityQueue.current.enqueue(firstNode)
            if (options.isSlowMo) forceMazeUpdate()
        } 
        else if (priorityQueue.current.isEmpty()) {
            // EMPTY QUEUE WITHOUT A PATH MEANS PATHFIND FAILED - WE EXIT HERE
            stopPathfinding()
            specialNodes.current.currentNode = null
            return
        }
        function getHVal(coords) {
            const xDiff = Math.abs(coords[1] - specialNodes.current.endNode[1])
            const yDiff = Math.abs(coords[0] - specialNodes.current.endNode[0])
            return xDiff + yDiff
        }      

        // REPEATING PART OF ALGORITHM
        const currNode = priorityQueue.current.dequeue()
        if (_.isEqual(currNode.coords, specialNodes.current.endNode)) {
            // IF CURRNODE IS THE ENDNODE, END AND DRAW PATH
            specialNodes.current.currentNode = null
            setIsDrawingPath(true)
            return
        }
        if (currNode.pathfinding.isSearched) {
            // CONTINUE TO NEXT PASS
            setTimeout(localUpdate, 0)
            return
        }
        // MAKE CURR SEARCHED
        currNode.pathfinding.isSearched = true
        makeNodeCurrent(currNode.coords)
        // LOOP THROUGH NEIGHBOURING PASSAGES
        for (let adjPsgCoords of getAdjPassages(currNode.coords)) {
            orderCount.current++
            if (isNodeSearched(adjPsgCoords)) {
                continue
            }
            makeNodeFrontier(adjPsgCoords)
            const adjPsgNode = getNodeFromCoords(adjPsgCoords)
            // COMPARE CURRENT DISTANCE FROM ADJ TO ENTRANCE VS DISTANCE VIA CURRENT
            const adjPsgG = adjPsgNode.pathfinding.g
            const edgeWeight = terrainWeights[adjPsgNode.clickChoiceType]
            const newG = currNode.pathfinding.g + edgeWeight
            if (newG < adjPsgG) {
                // IF NEW DISTANCE IS LESS, UPDATE ADJPSGG TO NEWG/NEWF AND ADD TO PRIORITYQUEUE
                adjPsgNode.pathfinding.g = newG
                adjPsgNode.pathfinding.f = newG + getHVal(adjPsgCoords)
                adjPsgNode.pathfinding.orderAdded = orderCount.current
                updatePathfindingParentNode(adjPsgCoords, currNode.coords)
                priorityQueue.current.enqueue(adjPsgNode)
            }
        }
        // IF WE HAVEN'T FINISHED THE ALGO YET, TRIGGER A RE-RENDER TO CONTINUE (AND GET UPDATED STATE)
        if (options.isSlowMo) {
            // GOES FASTER THE MORE NODES THERE ARE IN QUEUE
            let timeBetweenRenders = (
                1 / (priorityQueue.current.size() * (priorityQueue.current.size() / 5))
                ) * 450
            timeBetweenRenders = Math.max(2, timeBetweenRenders)
            timeBetweenRenders = Math.min(10, timeBetweenRenders)
            setTimeout(localUpdate, timeBetweenRenders)
        } else {setTimeout(localUpdate, 0)}
        
        // DRAW AFTER X UPDATE CYCLES HAVE PASSED
        let skipFrames = 1
        if (priorityQueue.current.size() > 45) {
            skipFrames = 4
        } else if (priorityQueue.current.size() > 30) {
            skipFrames = 3
        } else if (priorityQueue.current.size() > 15) { 
            skipFrames = 2
        } 
        count.current++
        if (count.current % skipFrames === 0 && options.isSlowMo) {
            forceMazeUpdate()
        }
    }, [depsLocalUpdate, pathfindingIsRunning])


    return (
        <>
            {isDrawingPath && 
                <DrawPath isDrawingPath={isDrawingPath} setIsDrawingPath={setIsDrawingPath} />}
        </>
    )
}

// PYTHON - HAS ERROR IN WHERE TO CHECK FOR ENDNODE
// def Astar() -> None:
//     # set up prio_queue and first nodes
//     priority_q = PriorityQueue()
//     first_node = (mz.maze_entry[0] + 1, mz.maze_entry[1])
//     prep_pathfind(first_node)
//     first_node_g = 0
//     update_pathfind_g_value(first_node, first_node_g)
//     first_node_h = get_h_val(first_node)
//     first_node_f = first_node_g + first_node_h
//     # used to sort by order of nodes inserted after f score
//     count = 0
//     priority_q.put((first_node_f, count, first_node))
//     # begin repeating section of algo
//     while not priority_q.empty():
//         stop = quit_event_loop()
//         if stop:
//             return
//         _curr_f, _count, curr = priority_q.get()
//         curr_g = get_pathfind_g_value(curr)
//         if is_searched_node(curr):
//             continue
//         # flag curr (and the passage to its parent) as searched
//         make_node_searched(curr)
//         parent = get_pathfind_parent(curr)
//         psg = get_passage_node(curr, parent)
//         make_node_searched(psg)
//         # loop through the neighbouring passages
//         for adj_psg in get_adj_passages(curr, ordered=True):
//             if adj_psg == mz.maze_exit:  // THIS SHOULD CHECK IF CURRNODE IS THE END, NOT AN ADJPSG
//                 # if we find the exit, add the current node as its parent, then draw the path from the exit
//                 update_pathfind_parent_node(adj_psg, curr)
//                 draw_path(adj_psg)
//                 return
//             adj = get_adj_cell_from_passage(curr, adj_psg)
//             if is_searched_node(adj):
//                 continue
//             make_node_frontier(adj)
//             # compare current distance from adj to entrance vs distance via current
//             adj_g = get_pathfind_g_value(adj)
//             edge_weight = get_edge_weight(curr, adj)  # at the moment all edge weights are 1
//             new_g = curr_g + edge_weight
//             if new_g < adj_g:
//                 # if new distance is less, update adj_g to new_g, assign parents, then put adj into pq with f score and count
//                 count += 1
//                 update_pathfind_g_value(adj, new_g)
//                 new_f = get_h_val(adj) + new_g
//                 priority_q.put((new_f, count, adj))
//                 update_pathfind_parent_node(adj, adj_psg)
//                 update_pathfind_parent_node(adj_psg, curr)
//                 make_node_frontier(adj_psg)
//                 signal_maze_updated(curr_node=curr, pathfind=True)


// def get_h_val(curr: (int, int)) -> int:
//     x_diff = abs(curr[1] - mz.maze_exit[1])
//     y_diff = abs(curr[0] - (mz.maze_exit[0] - 1))
//     return int((x_diff + y_diff) / 2)

