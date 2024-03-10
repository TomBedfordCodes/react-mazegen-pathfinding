import React from 'react'
import { MainContext } from '../Main'
import { 
    dijkstras, terrainWeights // , pathNode, forestNode, mountainNode,
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
    

    React.useEffect(() => {
        priorityQueue.current = new PriorityQueue((a, b) => {
            if (a.pathfinding.g === b.pathfinding.g) {
                return a.pathfinding.orderAdded < b.pathfinding.orderAdded
            }
            return a.pathfinding.g < b.pathfinding.g
        })
    }, [])


    // console.log("Rerendered Dijkstras")


    React.useEffect(() => {
        if (!pathfindingIsRunning || options.pathfindingAlgo != dijkstras || 
            !specialNodes.current.startNode || !specialNodes.current.endNode) { 
            return
        }
        // EDGE CASES (START AND END) - NODES ARE REPRESENTED BY COORDS
        if (priorityQueue.current.isEmpty() && !isNodeSearched(specialNodes.current.startNode)) {
            // IF PRIORITYQUEUE IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
            const firstNodeCoords = specialNodes.current.startNode
            const firstNode = getNodeFromCoords(firstNodeCoords)
            firstNode.pathfinding.g = 0
            priorityQueue.current.enqueue(firstNode)
            if (options.isSlowMo) forceMazeUpdate()
        } 
        else if (priorityQueue.current.isEmpty()) {
            // EMPTY PRIORITYQUEUE WITHOUT A PATH MEANS PATHFIND FAILED - WE EXIT HERE
            stopPathfinding()
            specialNodes.current.currentNode = null
            return
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
        for (let adjPsg of getAdjPassages(currNode.coords)) {
            orderCount.current++
            // if (_.isEqual(adjPsg, specialNodes.current.endNode)) {
            //     // IF WE FIND ENDNODE, ADD CURRNODE AS ITS PARENT, THEN DRAW PATH
            //     updatePathfindingParentNode(adjPsg, currNode.coords)
            //     setIsDrawingPath(true)
            //     return
            // }
            if (isNodeSearched(adjPsg)) {
                continue
            }
            makeNodeFrontier(adjPsg)
            // COMPARE CURRENT DISTANCE FROM ADJPSG TO ENTRANCE VS DISTANCE VIA CURRNODE
            const adjPsgNode = getNodeFromCoords(adjPsg)
            const adjPsgG = adjPsgNode.pathfinding.g
            const edgeWeight = terrainWeights[adjPsgNode.clickChoiceType]
            const newG = currNode.pathfinding.g + edgeWeight
            if (newG < adjPsgG) {
                // UPDATE ADJPSGG TO NEWG, ASSIGN NEW PARENT, AND ENQUEUE ADJPSG
                adjPsgNode.pathfinding.g = newG
                adjPsgNode.pathfinding.orderAdded = orderCount.current
                priorityQueue.current.enqueue(adjPsgNode)
                updatePathfindingParentNode(adjPsg, currNode.coords)
            }
        }
        // IF WE HAVEN'T FINISHED THE ALGO YET, TRIGGER A RE-RENDER TO CONTINUE (AND GET UPDATED STATE)
        if (options.isSlowMo) {
            // GOES FASTER THE MORE NODES THERE ARE IN PRIORITYQUEUE
            let timeBetweenRenders = (1 / (priorityQueue.current.size() * (priorityQueue.current.size() / 5))) * 450   // 10
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


// PYTHON
// def Dijkstras() -> None:
//     # set up priorityQueue and first nodes
//     priority_q = PriorityQueue()
//     first_node = (mz.maze_entry[0] + 1, mz.maze_entry[1])
//     prep_pathfind(first_node)
//     update_pathfind_g_value(first_node, 0)
//     priority_q.put((0, first_node))
//     # begin repeating section of algo
//     while not priority_q.empty():
//         stop = quit_event_loop()
//         if stop:
//             return
//         curr_g, curr = priority_q.get()
//         if is_searched_node(curr):
//             continue
//         # flag curr (and the passage to its parent) as searched
//         make_node_searched(curr)
//         parent = get_pathfind_parent(curr)
//         psg = get_passage_node(curr, parent)
//         make_node_searched(psg)
//         # loop through the neighbouring passages
//         for adj_psg in get_adj_passages(curr, ordered=True):
//             if adj_psg == mz.maze_exit:
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
//                 # if the new distance is smaller, update adj_g to new_g, and assign parents, then put adj into pq
//                 update_pathfind_g_value(adj, new_g)
//                 priority_q.put((new_g, adj))
//                 update_pathfind_parent_node(adj, adj_psg)
//                 update_pathfind_parent_node(adj_psg, curr)
//                 # make_node_searched(adj_psg)
//                 make_node_frontier(adj_psg)
//                 signal_maze_updated(curr_node=curr, pathfind=True)

