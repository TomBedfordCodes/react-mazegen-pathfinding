import React from 'react'
import { MainContext } from '../Main'
import { huntAndKill } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import useMazegen from '../../hooks/useMazegen'


const timeBetweenRenders = 25


export default function HuntAndKill() {

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
        makeNodeCurrent,
        isPassable,
    } = React.useContext(MazeContext)


    const [
        _queue, depsLocalUpdate, localUpdate, _mazegenStartingPoint
    ] = useMazegen(getMazegenAlgoStartingPoint)

    const startRowIndex = React.useRef(1)
    const startColIndex = React.useRef(1)
    const killNodeCoords = React.useRef([])

    const doHunt = React.useRef(false)
    const doKill = React.useRef(false)

    function switchToHunt() {
        doHunt.current = true
        doKill.current = false
    }

    function switchToKill() {
        doHunt.current = false
        doKill.current = true
    }


    // console.log("Hunt and Kill rerendered")



    React.useEffect(() => {
        // FIRST PASS TO SET UP
        if (!mazegenIsRunning || options.mazegenAlgo != huntAndKill) {
            return
        }
        const startCoords = [1, 1]
        makeNodePath(startCoords)
        killNodeCoords.current = startCoords
        specialNodes.current.hnkCurrentRow = startRowIndex.current
        specialNodes.current.hnkCurrentCol = startColIndex.current
        switchToKill()
        if (options.isSlowMo) { forceMazeUpdate() }
    }, [])



    React.useEffect(() => {
        // HUNT
        if (
            !mazegenIsRunning ||
            options.mazegenAlgo != huntAndKill ||
            !doHunt.current
        ) {
            return
        }
        // WE LOOK ROW BY ROW FOR A VALID NEXT CURRENT NODE
        const searchNode = [startRowIndex.current, startColIndex.current]
        makeNodeCurrent(searchNode)
        // IF CURRENT IS PASSABLE WE SKIP TO THE NEXT CELL READY FOR NEXT RENDER CYCLE
        if (isPassable(searchNode)) {
            startColIndex.current += 2
            // MOVE TO NEXT ROW IF WE'VE REACHED END OF ROW, OR FINISH ALGO IF FINAL ROW
            if (startColIndex.current >= nodesInRow) {
                startColIndex.current = 1
                startRowIndex.current += 2
                if (startRowIndex.current >= rowsInCol) {
                    specialNodes.current.currentNode = null
                    specialNodes.current.hnkCurrentRow = null
                    specialNodes.current.hnkCurrentCol = null
                    addMazegenStartAndEndNodes()
                    stopMazegen()
                    return
                }
            }
            specialNodes.current.hnkCurrentRow = startRowIndex.current
            specialNodes.current.hnkCurrentCol = startColIndex.current
            if (options.isSlowMo) {
                forceMazeUpdate()
                setTimeout(localUpdate, timeBetweenRenders)
            } else { setTimeout(localUpdate, 0) }
            return
        }
        const adjCells = getAdjCells(searchNode).filter(cell => isPassable(cell))
        if (adjCells.length <= 0) {
            throw Error("How can we be at an unvisited cell without an explored neighbour?")
        }
        const adjCell = adjCells[0]
        killNodeCoords.current = searchNode
        makeNodePath(killNodeCoords.current)
        createPassage(killNodeCoords.current, adjCell)
        switchToKill()

        // TRIGGER A RERENDER TO CONTINUE AFTER A CERTAIN AMOUNT OF TIME
        if (options.isSlowMo) {
            forceMazeUpdate()
            setTimeout(localUpdate, timeBetweenRenders)
        } else { setTimeout(localUpdate, 0) }

    }, [depsLocalUpdate, mazegenIsRunning])



    React.useEffect(() => {
        // KILL
        if (
            !mazegenIsRunning ||
            options.mazegenAlgo != huntAndKill ||
            !doKill.current
        ) {
            return
        }
        // DO A WALK WITH THE CHOSEN NODE UNTIL CURR HAS NO UNVISITED NEIGHBOURS
        const currNode = killNodeCoords.current
        makeNodeCurrent(currNode)
        if (options.isSlowMo) { forceMazeUpdate() }
        const unvisitedAdjCells = getAdjCells(currNode).filter((cell) => {
            return !isPassable(cell)
        })
        // IF NO UNVISITED NEIGHBOURS LEFT, SWITCH BACK TO HUNT
        if (unvisitedAdjCells.length <= 0) {
            switchToHunt()
            if (options.isSlowMo) {
                forceMazeUpdate()
                setTimeout(localUpdate, timeBetweenRenders)
            } else { setTimeout(localUpdate, 0) }
            return
        }
        // OTHERWISE, MAKE ADJCELL A PATH AND CREATE PASSAGE TO CURRNODE, AND MOVE TO ADJCELL NEXT
        const adjCell = unvisitedAdjCells[0]
        makeNodePath(adjCell)
        createPassage(currNode, adjCell)
        killNodeCoords.current = adjCell

        // TRIGGER A RERENDER TO CONTINUE AFTER A CERTAIN AMOUNT OF TIME
        if (options.isSlowMo) {
            forceMazeUpdate()
            setTimeout(localUpdate, timeBetweenRenders)
        } else { setTimeout(localUpdate, 0) }

    }, [depsLocalUpdate, mazegenIsRunning])



    return (
        <>
        </>
    )
}



// PYTHON
// start_row_i = 1
// start_col_i = 1

// @time_taken
// def HuntAndKill() -> None:
//     global start_row_i
//     global start_col_i
//     start_row_i = 1
//     start_col_i = 1
//     start = (1, 1)
//     make_node_cell(start)
//     stop = kill(start)
//     if stop:
//         return
//     while True:
//         stop = quit_event_loop()
//         if stop:
//             return
//         curr_node, visited_adj = hunt()
//         if curr_node is None:
//             break
//         elif curr_node is True:
//             return
//         if start_row_i > MAZE_SIZE:
//             break
//         make_node_cell(curr_node)
//         create_passage(curr_node, visited_adj)
//         stop = kill(curr_node)
//         if stop:
//             return
//     create_entry_exit()

// def hunt() -> (int, int):
//     global start_row_i
//     global start_col_i
//     curr_row_i = start_row_i
//     curr_col_i = start_col_i
//     # we look row by row for a valid next current node
//     while curr_row_i < MAZE_SIZE:
//         stop = quit_event_loop()
//         if stop:
//             return True, True
//         for j in range(curr_col_i, MAZE_SIZE, 2):
//             node = (curr_row_i, j)
//             if is_passable(node):
//                 if settings.SHOW_CURRENT:
//                     start_col_i = j
//                     signal_maze_updated(curr_node=node, start_row_i=start_row_i, start_col_i=start_col_i)
//                 continue
//             adj = get_adj_visited_node(node)
//             if adj is None:
//                 continue
//             # if node is found, we update the starting column to this
//             start_col_i = j + 2
//             if start_col_i >= MAZE_SIZE:
//                 start_col_i = 1
//             return node, adj
//         # if we reach the end of the row without finding a valid next curr node, update the starting row
//         if curr_row_i == start_row_i:
//             start_row_i += 2
//         if start_row_i > MAZE_SIZE:
//             return None, None
//         curr_row_i += 2
//         # reset starting column to 1 as we go on to next row
//         curr_col_i = 1
//         start_col_i = 1
//     return None, None

// def kill(curr) -> None or bool:
//     signal_maze_updated(curr, start_row_i=start_row_i, start_col_i=start_col_i)
//     # do a walk with the chosen node until curr_node has no unvisited neighbours
//     while True:
//         stop = quit_event_loop()
//         if stop:
//             return True
//         for n in get_adj_cells(curr):
//             if is_passable(n):
//                 continue
//             adj = n
//             break
//         else:
//             return
//         make_node_cell(adj)
//         create_passage(curr, adj)
//         curr = adj
//         signal_maze_updated(curr, start_row_i=start_row_i, start_col_i=start_col_i)

// def get_adj_visited_node(node) -> (int, int) or None:
//     # check node is adjacent to a visited node, and return the visited node
//     for n in get_adj_cells(node):
//         if is_passable(n):
//             return n
//     return None

