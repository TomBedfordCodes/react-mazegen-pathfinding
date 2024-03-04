import React from 'react'
import { MainContext } from '../Main'
import { prims } from '../../namedConstants'
import { MazeContext } from '../maze/Maze'


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
        getMazegenStartingPoint,
        forceMazeUpdate,
        makeNodeSearched,
        getAdjPassages,
        getAdjCells,
        createPassage,
        makeNodeFrontier,
        makeNodeCurrent,
        makeNodePath,
        updatePathfindingParentNode,
        isPassable,
        isNodeSearched,
        isNodeWall,
    } = React.useContext(MazeContext)


    const stack = React.useRef([])

    const [depsLocalUpdate, localUpdate] = React.useReducer(x => x + 1, 0)

    const count = React.useRef(0)

    // CHOOSE A RANDOM STARTING POINT (KEEP IN STATE TO CHECK IF THIS IS THE FIRST PASS)
    const [
        mazegenStartingPoint, 
        setMazegenStartingPoint
    ] = React.useState(getMazegenStartingPoint)

    

    React.useEffect(() => {
        if (!mazegenIsRunning || options.mazegenAlgo != prims) { 
            return
        }
        // LIKELIHOOD OF GOING BACK TO A RANDOM NODE TO CREATE A NEW BRANCH (HIGHER = LESS LIKELY)
        const branchOdds = (nodesInRow + rowsInCol) / 2

        // ALGORITHM (USING COORDS TO REPRESENT NODES)
        
        // EDGE CASES OF FIRST / LAST PASS
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
            // EMPTY STACK MEANS MAZEGEN COMPLETE
            stopMazegen()
            specialNodes.current.currentNode = null

            // ADD RANDOM START/ENDNODE POSITIONS

            return
        }

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
            // QUICKLY SKIP TO THE NEXT WALL NODE
            setTimeout(localUpdate, 0)
        }

        else {
            // ADD CURR TO TREE; POP IT FROM STACK; ADD ITS UNVISITED NEIGHBOURS TO STACK
            makeNodePath(currNode)
            makeNodeCurrent(currNode)
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
            const timeBetweenRenders = 10
            if (options.isSlowMo) {
                setTimeout(localUpdate, timeBetweenRenders)
            } else {setTimeout(localUpdate, 0)}
        }
        


        // // DRAW AFTER X UPDATE CYCLES HAVE PASSED
        // let skipFrames = 1
        // count.current++
        // if (count.current % skipFrames === 0 && options.isSlowMo) {
        //     forceMazeUpdate()
        // }
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
