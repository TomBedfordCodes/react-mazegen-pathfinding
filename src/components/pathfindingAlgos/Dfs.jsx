import React from 'react'
import { MainContext } from '../Main'
import { dfs } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import DrawPath from './DrawPath'
import usePathfinding from '../../hooks/usePathfinding'


export default function Dfs() {

    const {
        specialNodes, 
        options, 
        pathfindingIsRunning, 
        stopPathfinding,
    } = React.useContext(MainContext)

    const {
        forceMazeUpdate,
        makeNodeSearched,
        isNodeSearched,
        getAdjPassages,
        getAdjCellFromPassage,
        getPathfindingParentCoords,
        makeNodeCurrent,
        updatePathfindingParentNode,
    } = React.useContext(MazeContext)

    
    const [
        stack, depsLocalUpdate, localUpdate, isDrawingPath, setIsDrawingPath, count
    ] = usePathfinding()
    

    // console.log("Rerendered DFS")


    React.useEffect(() => {
        if (!pathfindingIsRunning || options.pathfindingAlgo != dfs || 
            !specialNodes.current.startNode || !specialNodes.current.endNode) { 
            return
        }
        // EDGE CASES
        if (stack.current.length <= 0 && !isNodeSearched(specialNodes.current.startNode)) {
            // IF STACK IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
            const firstNode = specialNodes.current.startNode
            makeNodeSearched(firstNode)
            const secondNode = [firstNode[0] + 1, firstNode[1]]
            stack.current.push(secondNode)
            updatePathfindingParentNode(secondNode, firstNode)
            // if (options.isSlowMo) forceMazeUpdate()
        } 
        else if (stack.current.length <= 0) {
            // EMPTY STACK WITHOUT A PATH MEANS PATHFIND FAILED - EXIT HERE
            stopPathfinding()
            specialNodes.current.currentNode = null
            return
        }
        // REPEATING PART OF ALGORITHM
        const currNode = stack.current[stack.current.length - 1]
        if (options.isSlowMo) {
            makeNodeCurrent(currNode)
            // forceMazeUpdate()
        }
        makeNodeSearched(currNode)
        // GET LIST OF OPEN PASSAGES TO TRAVEL THROUGH - IF ANY ARE THE ENDNODE, WE'RE DONE
        const adjPsgs = []
        for (let adjPsg of getAdjPassages(currNode, getPathfindingParentCoords(currNode))) {
            if (isNodeSearched(adjPsg)) {
                continue
            }
            if (_.isEqual(adjPsg, specialNodes.current.endNode)) {
                // ON FINDING ENDNODE, ADD CURRNODE AS ITS PARENT, THEN DRAW PATH
                updatePathfindingParentNode(adjPsg, currNode)
                setIsDrawingPath(true)
                return
            }
            const testAdj = getAdjCellFromPassage(currNode, adjPsg)
            // IF ADJ CELL IS ALREADY SEARCHED, IT'S EITHER IN THE STACK OR FULLY EXPLORED
            if (isNodeSearched(testAdj)) {
                continue
            }
            // IF ADJPSG PASSES ALL TESTS, ADD TO LIST
            adjPsgs.push(adjPsg)
        }
        // IF NO FURTHER PASSABLE PASSAGES AVAILABLE, POP CURRNODE OFF STACK AND BACKTRACK
        if (adjPsgs.length <= 0) {
            stack.current.pop()
            if (stack.current.length > 0 && options.isSlowMo) {
            }
            // CONTINUE TO NEXT CYCLE OF ALGO
        } else {
            // GET ADJCELL (AND ADD TO STACK), MAKE ADJ_PSG SEARCHED, ADD PARENT NODES
            const adjCell = getAdjCellFromPassage(currNode, adjPsgs[0])
            makeNodeSearched(adjPsgs[0])
            updatePathfindingParentNode(adjPsgs[0], currNode)
            updatePathfindingParentNode(adjCell, adjPsgs[0])
            stack.current.push(adjCell)
        }
        // IF WE HAVEN'T FINISHED THE ALGO YET, TRIGGER A RE-RENDER TO CONTINUE (AND REDRAW IF SLOWMO)
        if (options.isSlowMo) {
            setTimeout(localUpdate, 80)
            forceMazeUpdate()
        } else {setTimeout(localUpdate, 0)}
        
    }, [depsLocalUpdate, pathfindingIsRunning])


    return (
        <>
            {isDrawingPath && 
                <DrawPath isDrawingPath={isDrawingPath} setIsDrawingPath={setIsDrawingPath} />}
        </>
    )
}


// PYTHON
// def DFS_turn_left() -> None:
//     # set up entrance and first node within the maze; make entrance the parent of first node
//     first_node = (mz.maze_entry[0] + 1, mz.maze_entry[1])
//     prep_pathfind(first_node)
//     stack = [first_node]
//     while stack:
//         stop = quit_event_loop()
//         if stop:
//             return
//         curr = stack[-1]
//         make_node_searched(curr)
//         # get list of possible open passages to travel through next - if any of them are the exit, we're done
//         adj_psgs = []
//         for adj_psg in get_adj_passages(curr, ordered=True, turn_left_parent=get_pathfind_parent(curr)):
//             if is_searched_node(adj_psg):
//                 continue
//             if adj_psg == mz.maze_exit:
//                 # if we find the exit, add the current node as its parent, then draw the path from the exit
//                 update_pathfind_parent_node(adj_psg, curr)
//                 draw_path(adj_psg)
//                 return
//             # if we've already searched the adj node then it will either be in the stack or be fully explored already
//             testadj = get_adj_cell_from_passage(curr, adj_psg)
//             if is_searched_node(testadj):
//                 continue
//             # if passes all tests, add to list
//             adj_psgs.append(adj_psg)
//         # if no further passable passages available, pop curr off stack and backtrack
//         if not adj_psgs:
//             stack.pop()
//             if stack: signal_maze_updated(curr_node=stack[-1], pathfind=True)
//             continue
//         # skip backtracking (unless we flag to show it for the visuals) by removing nodes with only only path forward
//         if len(adj_psgs) == 1 and not settings.DFS_SHOW_BACKTRACKING:
//             stack.pop()
//         # make adj_psg searched (adj will be updated when it becomes curr); add adj to stack, signal maze updated
//         adj = get_adj_cell_from_passage(curr, adj_psgs[0])
//         make_node_searched(adj_psgs[0])
//         # add parents to map and append next cell to stack
//         update_pathfind_parent_node(adj_psgs[0], curr)
//         update_pathfind_parent_node(adj, adj_psgs[0])
//         stack.append(adj)
//         if stack: signal_maze_updated(curr_node=stack[-1], pathfind=True)
