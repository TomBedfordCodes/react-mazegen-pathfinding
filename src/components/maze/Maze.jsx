import React from 'react'
import { MainContext } from '../Main'
import Node from './Node'
import Bfs from '../pathfindingAlgos/Bfs'
import Prims from '../mazegenAlgos/Prims'
import { 
    bfs, wallNode, pathNode,
    startNode, endNode, prims,
 } from '../../namedConstants'


const MazeContext = React.createContext()


export default function Maze() {

    const {
        mazeArr,
        options,
        specialNodes,
        nodesInRow,
        rowsInCol,
        mazegenIsRunning,
        pathfindingIsRunning,
        getClickChoiceType,
        forceUpdate,
    } = React.useContext(MainContext)

    const [, forceMazeUpdate] = React.useReducer(x => x + 1, 0)

    const mouseLastEnteredNode = React.useRef(Date.now())



    // WHEN USER CLICKS ON THE MAZE (CHANGES TERRAIN ETC.)
    function updateMazeOnClick(coords) {
        if (Date.now() - mouseLastEnteredNode.current < 30) {
            return
        }
        mouseLastEnteredNode.current = Date.now()
        const choiceType = getClickChoiceType()
        // IF CLICK CHOICE IS START OR END NODE, UPDATE SPECIAL NODES REF WITH COORDS
        if (choiceType === startNode || choiceType === endNode) {
            if (choiceType === startNode && specialNodes.current.startNode) {
                changeNodeClickChoice(specialNodes.current.startNode, pathNode)
                specialNodes.current.startNode = null
            } else if (choiceType === endNode && specialNodes.current.endNode) {
                changeNodeClickChoice(specialNodes.current.endNode, pathNode)
                specialNodes.current.endNode = null
            } 
            if (choiceType === startNode && !specialNodes.current.startNode) {
                specialNodes.current.startNode = coords
                // HANDLES CASE WHERE START REPLACES END AND VICE VERSA
                if (_.isEqual(coords, specialNodes.current.endNode)) {
                    specialNodes.current.endNode = null
                }
            } else if (choiceType === endNode && !specialNodes.current.endNode) {
                specialNodes.current.endNode = coords
                if (_.isEqual(coords, specialNodes.current.startNode)) {
                    specialNodes.current.startNode = null
                }
            }
        }
        // IF CHANGING A START/END NODE TO SOMETHING ELSE, REMOVE COORDS FROM SPECIAL NODES REF
        else if (_.isEqual(coords, specialNodes.current.startNode)) {
            specialNodes.current.startNode = null
        } else if (_.isEqual(coords, specialNodes.current.endNode)) {
            specialNodes.current.endNode = null
        }
        // UPDATE NODE WITH THE CHOSEN NODE TYPE
        changeNodeClickChoice(coords, choiceType)
        forceUpdate()
    }

    // UPDATES MAZE BASED ON CLICK
    function changeNodeClickChoice(coords, choiceType) {
        let node = mazeArr.current[coords[0]][coords[1]]
        node = {
            ...node,
            clickChoiceType: choiceType
        }
        mazeArr.current[coords[0]][coords[1]] = node
    }








    // HELPER FUNCTIONS FOR THE MAZE ALGOS 


    function getMazegenStartingPoint() {
        // WILL RETURN A NODE ON AN ODD ROW AND COLUMN
        let row = _.random(0, rowsInCol - 1)
        let col = _.random(0, nodesInRow - 1)
        while (row % 2 === 0 || col % 2 === 0) {
            if (row % 2 === 0) {
                row = _.random(0, rowsInCol - 1)
            } else if (col % 2 === 0) {
                col = _.random(0, nodesInRow - 1)
            }
        }
        return [row, col]
    }


    function getNodeFromCoords(coords) {
        return mazeArr.current[coords[0]][coords[1]]
    }

    function makeNodeSearched(coords) {
        const node = getNodeFromCoords(coords)
        node.pathfinding.isSearched = true
        node.pathfinding.isFrontier = false
    }

    function updatePathfindingParentNode(childCoords, parentCoords) {
        const childNode = getNodeFromCoords(childCoords)
        const parentNode = getNodeFromCoords(parentCoords)
        childNode.pathfinding.parentNode = parentNode
    }

    function getPathfindingParentCoords(coords) {
        const parentNode = getNodeFromCoords(coords).pathfinding.parentNode
        return parentNode.coords
    }


    function getAdjCellFromPassage(currCoords, adjPassageCoords) {
        if (adjPassageCoords[0] > currCoords[0]) {
            return [currCoords[0] + 2, currCoords[1]]
        } else if (adjPassageCoords[0] < currCoords[0]) {
            return [currCoords[0] - 2, currCoords[1]]
        } else if (adjPassageCoords[1] > currCoords[1]) {
            return [currCoords[0], currCoords[1] + 2]
        } else if (adjPassageCoords[1] < currCoords[1]) {
            return [currCoords[0], currCoords[1] - 2]
        }
    }
    // def get_adj_cell_from_passage(curr_node: (int, int), adj_passage: (int, int)) -> (int, int):
    //     if adj_passage[0] > curr_node[0]:
    //         return curr_node[0] + 2, curr_node[1]
    //     elif adj_passage[0] < curr_node[0]:
    //         return curr_node[0] - 2, curr_node[1]
    //     elif adj_passage[1] > curr_node[1]:
    //         return curr_node[0], curr_node[1] + 2
    //     elif adj_passage[1] < curr_node[1]:
    //         return curr_node[0], curr_node[1] - 2




    function getAdjCells(coords, ordered=false) {
        const row = coords[0]
        const col = coords[1]
        const cells = [[row + 2, col], [row, col + 2], [row - 2, col], [row, col - 2]]
        const filteredCells = cells.filter(cell => {
            return isWithinBounds(cell)
        })
        if (ordered) {
            return filteredCells
        }
        return _.shuffle(filteredCells)
    }
    // ORDERED STUFF FOR LEFT-TURN BACKTRACKING MISSING
    // def get_adj_cells(node: (int, int), ordered: bool = False) -> list:
    //     # returns adjacent cells (visited and unvisited) in random order (unless ordered=True, then in order SENW)
    //     row, col = node[0], node[1]
    //     cells = [(row + 2, col), (row, col + 2), (row - 2, col), (row, col - 2)]
    //     cells = [x for x in cells if is_within_bounds(x)]
    //     if ordered: return cells
    //     random.shuffle(cells)
    //     return cells



    function getAdjPassages(coords) {
        const row = coords[0]
        const col = coords[1]
        const passages = [[row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1]]
        const filteredPassages = passages.filter(psg => {
            return isWithinBounds(psg) && isPassable(psg)
        })
        return filteredPassages
    }
    // LEFT-TURN STUFF FOR BACKTRACKING MISSING (DONT THINK I NEED UNORDERED)
    // def get_adj_passages(node: (int, int), ordered: bool = False, turn_left_parent: (int, int) = None) -> list:
    //     # returns adjacent passages in random order (unless ordered=True, then in order NESW)
    //     row, col = node[0], node[1]
    //     passages = [(row - 1, col), (row, col + 1), (row + 1, col), (row, col - 1)]
    //     if turn_left_parent is not None:
    //         passages = _get_turnleft_cells(node, turn_left_parent, passages)
    //     passages = [x for x in passages if is_within_bounds(x) and is_passable(x)]
    //     if ordered:
    //         return passages
    //     random.shuffle(passages)
    //     return passages

    // def _get_turnleft_cells(node: (int, int), parent: (int, int), cells: list) -> list:
    //     # FROM NORTH
    //     if node[0] > parent[0]:
    //         return cells[1:]
    //     # FROM SOUTH
    //     if node[0] < parent[0]:
    //         newcells = cells[3:]
    //         newcells.extend(cells[:2])
    //         return newcells
    //     # FROM WEST
    //     if node[1] > parent[1]:
    //         return cells[:3]
    //     # FROM EAST
    //     if node[1] < parent[1]:
    //         newcells = cells[2:]
    //         newcells.extend(cells[:1])
    //         return newcells



    function isWithinBounds(coords) {
        if (_.isEqual(coords, specialNodes.current.startNode) ||
            _.isEqual(coords, specialNodes.current.endNode)) {
        // if ((coords[0] === specialNodes.current.startNode[0] &&
        //     coords[1] === specialNodes.current.startNode[1]) ||
        //     (coords[0] === specialNodes.current.endNode[0] &&
        //         coords[1] === specialNodes.current.endNode[1])) {
            return true
        }
        return ((0 <= coords[0] && coords[0] < rowsInCol) &&
            (0 <= coords[1] && coords[1] < nodesInRow))
    }
    // def is_within_bounds(node: (int, int)) -> bool:
    //     if node == maze_entry or node == maze_exit:
    //         return True
    //     return (0 <= node[0] < MAZE_SIZE - 1) and (0 <= node[1] < MAZE_SIZE - 1)



    function isPassable(coords) {
        const node = getNodeFromCoords(coords)
        const isWall = node.clickChoiceType === wallNode
        const isSearched = node.pathfinding.isSearched
        const isFrontier = node.pathfinding.isFrontier
        return (!isWall && !isSearched && !isFrontier)
    }
    // def is_passable(node: (int, int)) -> bool:
    //     return maze[node[0]][node[1]] == CELL_CHAR or maze[node[0]][node[1]] == PASSAGE_CHAR



    function createPassage(currCoords, adjCoords) {
        if (adjCoords[0] > currCoords[0]) {
            makeNodePath([currCoords[0] + 1, currCoords[1]])
        } else if (adjCoords[0] < currCoords[0]) {
            makeNodePath([currCoords[0] - 1, currCoords[1]])
        } else if (adjCoords[1] > currCoords[1]) {
            makeNodePath([currCoords[0], currCoords[1] + 1])
        } else if (adjCoords[1] < currCoords[1]) {
            makeNodePath([currCoords[0], currCoords[1] - 1])
        }
    }
    // def create_passage(curr_node: (int, int), adj_node: (int, int)) -> None:
    // if adj_node[0] > curr_node[0]:
    //     maze[curr_node[0] + 1][curr_node[1]] = PASSAGE_CHAR
    // elif adj_node[0] < curr_node[0]:
    //     maze[curr_node[0] - 1][curr_node[1]] = PASSAGE_CHAR
    // elif adj_node[1] > curr_node[1]:
    //     maze[curr_node[0]][curr_node[1] + 1] = PASSAGE_CHAR
    // elif adj_node[1] < curr_node[1]:
    //     maze[curr_node[0]][curr_node[1] - 1] = PASSAGE_CHAR



    function makeNodePath(coords) {
        getNodeFromCoords(coords).clickChoiceType = pathNode
    }


    function makeNodeWall(coords) {
        getNodeFromCoords(coords).clickChoiceType = wallNode
    }


    function makeNodeFrontier(coords) {
        getNodeFromCoords(coords).pathfinding.isFrontier = true
    }


    function makeNodeDrawnPath(coords) {
        getNodeFromCoords(coords).pathfinding.isDrawnPath = true
    }


    function makeNodeCurrent(coords) {
        specialNodes.current.currentNode = coords
    }

    function isNodeCurrent(coords) {
        return (
            specialNodes.current.currentNode[0] === coords[0] &&
            specialNodes.current.currentNode[1] === coords[1]
        )
    }

    function isNodeSearched(coords) {
        return getNodeFromCoords(coords).pathfinding.isSearched
    }

    function isNodeWall(coords) {
        return getNodeFromCoords(coords).clickChoiceType === wallNode
    }







    const mazeRows = mazeArr.current.map((row, i) => {
        const newRow = row.map(node => {
            return (
                <Node node={node} key={`${node.id}`}/>
            )
        })
        return (
            <div key={i} className='maze--row'>
                {newRow}
            </div>
        )
    })

    // console.log("maze re-rendered")

    return (
        <MazeContext.Provider value={{
            updateMazeOnClick,
            forceMazeUpdate,
            getMazegenStartingPoint,
            updatePathfindingParentNode,
            getPathfindingParentCoords,
            getAdjCellFromPassage,
            getAdjCells,
            getAdjPassages,
            createPassage,
            makeNodePath,
            makeNodeSearched,
            makeNodeWall,
            makeNodeFrontier,
            makeNodeDrawnPath,
            makeNodeCurrent,
            isNodeSearched,
            isWithinBounds,
            isPassable,
            isNodeCurrent,
            isNodeWall,
        }}>
            {/* <div className='maze--border-container'> */}
                <div className='maze--container' id="maze-container-rect">
                    {mazeRows}

                    {options.mazegenAlgo === prims && mazegenIsRunning && <Prims />}

                    {options.pathfindingAlgo === bfs && pathfindingIsRunning && <Bfs />}

                </div>
            {/* </div> */}
        </MazeContext.Provider>
    )
}

export { MazeContext }
