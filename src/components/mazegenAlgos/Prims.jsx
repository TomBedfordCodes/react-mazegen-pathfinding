import React from 'react'
import { MainContext } from '../Main'
import { prims } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'
import useMazegen from '../../hooks/useMazegen'


export default function Prims() {

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
        // makeNodeCurrent,
        makeNodePath,
        isPassable,
        isNodeWall,
    } = React.useContext(MazeContext)


    const [
        stack, depsLocalUpdate, localUpdate, mazegenStartingPoint
    ] = useMazegen(getMazegenAlgoStartingPoint)


    // console.log("Prim's rerendered")
    

    React.useEffect(() => {
        if (!mazegenIsRunning || options.mazegenAlgo != prims) { 
            return
        }
        // LIKELIHOOD OF GOING BACK TO A RANDOM NODE TO CREATE A NEW BRANCH (HIGHER = LESS LIKELY)
        const branchOdds = (nodesInRow + rowsInCol) / 2

        // ALGORITHM (USING COORDS TO REPRESENT NODES)
        
        // EDGE CASES: FIRST / LAST PASS
        if (stack.current.length <= 0 && isNodeWall(mazegenStartingPoint)) {
            makeNodePath(mazegenStartingPoint)
            const nextCells = getAdjCells(mazegenStartingPoint).filter(cell => {
                return !isPassable(cell)
            })
            stack.current.push(...nextCells)
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

        // FUNCTIONS TO CLEAN UP ALGO
        function chooseCellForPassage(coords) {
            const adjCells = getAdjCells(coords).filter(cell => {
                return isPassable(cell)
            })
            const index = _.random(0, adjCells.length - 1)
            return adjCells[index]
        }

        function chooseNextCurr() {
            const roll = _.random(0, branchOdds)
            if (roll === 0) {
                const index = _.random(0, stack.current.length - 1)
                return [stack.current[index], index]
            }
            return [stack.current[stack.current.length - 1], stack.current.length - 1]
        }

        // REPEATING PART OF ALGORITHM
        const currNodeInfo = chooseNextCurr()
        const currNode = currNodeInfo[0]
        const currNodeIndex = currNodeInfo[1]

        if (isPassable(currNode)) {
            stack.current.pop(currNodeIndex)
            // QUICKLY SKIP TO THE NEXT WALL NODE TO AVOID VISUALISING NOTHING HAPPENING
            setTimeout(localUpdate, 0)
            return
        }
        // ADD CURR TO TREE; POP IT FROM STACK; ADD ITS UNVISITED NEIGHBOURS TO STACK
        makeNodePath(currNode)
        // makeNodeCurrent(currNode)
        stack.current.pop(currNodeIndex)
        const nextCells = getAdjCells(currNode).filter(cell => {
            return !isPassable(cell)
        })
        stack.current.push(...nextCells)

        // MAKE PASSAGE FROM CURR TO AN ADJ VISITED NODE
        const adjCell = chooseCellForPassage(currNode)
        createPassage(currNode, adjCell)
        if (options.isSlowMo) {forceMazeUpdate()}

        // TRIGGER A RERENDER TO CONTINUE AFTER A CERTAIN AMOUNT OF TIME
        const timeBetweenRenders = 25
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
// # likelihood of going back to a random node to create a new branch (higher = less likely)
// branch_odds = MAZE_SIZE
// def Prims() -> None:
//     # make startnode a cell and add it's neighbours to poss_next_nodes
//     poss_next_nodes = []
//     make_node_cell(startnode)
//     poss_next_nodes.extend([x for x in get_adj_cells(startnode) if not is_passable(x)])
       //      while poss_next_nodes:
        //         curr_node, curr_node_i = choose_next_curr(poss_next_nodes)
        //         if is_passable(curr_node):
        //             poss_next_nodes.pop(curr_node_i)
        //             continue
        //         # add node to tree, pop it from poss_next_nodes, and add it's unvisited neighbours to poss_next_nodes
        //         make_node_cell(curr_node)
        //         poss_next_nodes.pop(curr_node_i)
        //         poss_next_nodes.extend([x for x in get_adj_cells(curr_node) if not is_passable(x)])
        //         # make passage from curr to an adj visited node
        //         adj = choose_cell_for_passage(curr_node)
        //         create_passage(curr_node, adj)
        //         # Updates the maze for rendering / text drawing
        //         signal_maze_updated(curr_node)
        //     create_entry_exit()

