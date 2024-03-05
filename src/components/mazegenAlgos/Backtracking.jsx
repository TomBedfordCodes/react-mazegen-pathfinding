import React from 'react'
import { MainContext } from '../Main'
import { backtracking } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import useMazegen from '../../hooks/useMazegen'


export default function Backtracking() {

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
        makeNodeCurrent,
        makeNodePath,
        isPassable,
        isNodeWall,
    } = React.useContext(MazeContext)

    const [
        stack, depsLocalUpdate, localUpdate, mazegenStartingPoint
    ] = useMazegen(getMazegenAlgoStartingPoint)

    const timeBetweenRenders = 30


    // console.log("Prim's rerendered")
    

    React.useEffect(() => {
        if (!mazegenIsRunning || options.mazegenAlgo != backtracking) { 
            return
        }
        // EDGE CASES: FIRST / LAST PASS
        if (stack.current.length <= 0 && isNodeWall(mazegenStartingPoint)) {
            makeNodePath(mazegenStartingPoint)
            stack.current.push(mazegenStartingPoint)
            if (options.isSlowMo) {
                forceMazeUpdate()
            }
        } else if (stack.current.length <= 0) {
            // EMPTY STACK MEANS MAZEGEN COMPLETE - REMOVE CURRENT, ADD START AND END NODES
            specialNodes.current.currentNode = null
            addMazegenStartAndEndNodes()
            stopMazegen()
            return
        }

        // ALGORITHM (USING COORDS TO REPRESENT NODES)

        let currNode = stack.current[stack.current.length - 1]
        // GET LIST OF POSSIBLE UNVISITED NEIGHBOURS TO VISIT NEXT
        const adjCells = []
        for (let cell of getAdjCells(currNode)) {
            if (isPassable(cell)) {
                continue
            }
            adjCells.push(cell)
        }
        // IF THERE'S NO WAY FORWARD, POP CURRENT AND CONTINUE WITH NEXT ITERATION
        if (adjCells.length <= 0) {
            stack.current.pop()
            if (stack.current.length > 0 && options.isSlowMo) {
                makeNodeCurrent(stack.current[stack.current.length - 1])
                forceMazeUpdate()
            }
            if (options.isSlowMo) {
                setTimeout(localUpdate, timeBetweenRenders)
            } else {setTimeout(localUpdate, 0)}
            return
        }
        // MAKE CURRENT AND CHOSEN ADJCELL INTO PATHS AND ADD PASSAGE BETWEEN THEM
        const adjCell = adjCells[0]
        makeNodePath(adjCell)
        createPassage(currNode, adjCell)
        
        // ADD ADJ TO STACK
        stack.current.push(adjCell)
        if (options.isSlowMo) {
            makeNodeCurrent(adjCell)
            forceMazeUpdate()
        } 

        // TRIGGER A RERENDER TO CONTINUE AFTER A CERTAIN AMOUNT OF TIME
        if (options.isSlowMo) {
            setTimeout(localUpdate, timeBetweenRenders)
        } else {setTimeout(localUpdate, 0)}
        
    }, [depsLocalUpdate, mazegenIsRunning])

    return (
        <>
        </>
    )
}

// PYTHON
// def Backtracking() -> None:
//     stack = [startnode]
//     make_node_cell(startnode)
//     while stack:
//         stop = quit_event_loop()
//         if stop:
//             return
//         curr_node = stack[-1]
//         # get list of possible unvisited neighbours to visit next
//         adjs = []
//         for n in get_adj_cells(curr_node):
//             if is_passable(n):
//                 continue
//             adjs.append(n)
//         # if no way forward pop the current node from stack and send signal with current node as the next in the stack
//         if not adjs:
//             stack.pop()
//             if stack: signal_maze_updated(curr_node=stack[-1])
//             continue
//         # skip the backtracking for nodes with only one way forward (but show it if SHOW_CURRENT for visual effect)
//         if len(adjs) == 1 and not settings.SHOW_CURRENT:
//             stack.pop()
//         # make curr and chosen adj into cells and add passage between them; add adj to stack, and signal maze updated
//         adj = adjs[0]
//         make_node_cell(adj)
//         create_passage(curr_node, adj)
//         stack.append(adj)
//         if stack: signal_maze_updated(curr_node=stack[-1])
//     create_entry_exit()
