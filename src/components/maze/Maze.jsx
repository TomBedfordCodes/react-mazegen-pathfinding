import React from 'react'
import { MainContext } from '../Main'
import Node from './Node'
import {
    prims, backtracking, kruskals, huntAndKill,
    bfs, dfs, dijkstras, astar,
    wallNode, pathNode,
    startNode, endNode,  
} from '../../namedConstants'
import Prims from '../mazegenAlgos/Prims'
import Backtracking from '../mazegenAlgos/Backtracking'
import Kruskals from '../mazegenAlgos/Kruskals'
import HuntAndKill from '../mazegenAlgos/HuntAndKill'
import Bfs from '../pathfindingAlgos/Bfs'
import Dfs from '../pathfindingAlgos/Dfs'
import Dijkstras from '../pathfindingAlgos/Dijkstras'
import AStar from '../pathfindingAlgos/AStar'


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


    function getMazegenAlgoStartingPoint() {
        // WILL RETURN A NODE ON AN ODD ROW AND COLUMN
        let row = _.random(1, rowsInCol - 2)
        let col = _.random(1, nodesInRow - 2)
        while (row % 2 === 0 || col % 2 === 0) {
            if (row % 2 === 0) {
                row = _.random(1, rowsInCol - 2)
            } else if (col % 2 === 0) {
                col = _.random(1, nodesInRow - 2)
            }
        }
        return [row, col]
    }

    function addMazegenStartAndEndNodes() {
        specialNodes.current.startNode = getRandomMazeStartNode()
        makeNodePath(specialNodes.current.startNode)
        specialNodes.current.endNode = getRandomMazeEndNode()
        makeNodePath(specialNodes.current.endNode)
    }

    const confineFraction = 4
    function getRandomMazeStartNode() {
        let start = [0, _.random(1, Math.floor(nodesInRow / confineFraction))]
        // let start = [0, _.random(0, nodesInRow - 2)]
        if (start[1] % 2 === 0) { start = [start[0], start[1] + 1] }
        while (isNodeWall([1, start[1]])) {
            start = [0, _.random(1, Math.floor(nodesInRow / confineFraction))]
            // start = [0, _.random(0, nodesInRow - 2)]
            if (start[1] % 2 === 0) { start = [start[0], start[1] + 1] }
        }
        return start
        // s = 0, randint(1, MAZE_SIZE // 3)
        // if s[1] % 2 == 0: s = s[0], s[1] + 1
        // while maze[1][s[1]] == WALL_CHAR:
        //      if maze[1][s[1]] == WALL_CHAR:
        //          s = 0, randint(1, MAZE_SIZE // 3)
        //          if s[1] % 2 == 0: s = s[0], s[1] + 1
        // maze[s[0]][s[1]] = CELL_CHAR
    }

    function getRandomMazeEndNode() {
        let end = [rowsInCol - 1, _.random(Math.floor(nodesInRow / confineFraction * (confineFraction - 1)), nodesInRow - 2)]
        // let end = [rowsInCol - 1, _.random(1, nodesInRow - 2)]
        if (end[1] % 2 === 0) { end = [end[0], end[1] - 1] }
        while (isNodeWall([end[0] - 1, end[1]])) {
            end = [rowsInCol - 1, _.random(Math.floor(nodesInRow / confineFraction * (confineFraction - 1)), nodesInRow - 2)]
            // end = [rowsInCol - 1, _.random(0, nodesInRow - 2)]
            if (end[1] % 2 === 0) { end = [end[0], end[1] - 1] }
        }
        return end
        // e = MAZE_SIZE - 1, randint(MAZE_SIZE // 3 * 2, MAZE_SIZE - 2)
        // if e[1] % 2 == 0: e = e[0], e[1] - 1
        // while maze[e[0] - 1][e[1]] == WALL_CHAR:

        //      e = MAZE_SIZE - 1, randint(MAZE_SIZE // 3 * 2, MAZE_SIZE - 2)
        //      if e[1] % 2 == 0: e = e[0], e[1] - 1
        // maze[e[0]][e[1]] = CELL_CHAR
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
        if (parentNode) {
            return parentNode.coords
        } else return null
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




    function getAdjCells(coords, ordered = false) {
        // ORDERED FALSE BY DEFAULT FOR MAZE GENERATION
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


    function getAdjPassages(coords, turnLeftParent = null) {
        const row = coords[0]
        const col = coords[1]
        // ORDER: NESW
        let passages = [[row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1]]
        // let passages = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
        if (turnLeftParent) {
            passages = getTurnLeftPassages(coords, turnLeftParent, passages)
        }
        const filteredPassages = passages.filter(psg => {
            return isWithinBounds(psg) && isPassable(psg)
        })
        return filteredPassages
    }

    function getTurnLeftPassages(node, parent, cells) {
        // FROM NORTH
        if (node [0] > parent [0]) {
            return cells.slice(1)
        } // FROM SOUTH
        if (node [0] < parent [0]) {
            const newCells = cells.slice(3)
            newCells.push(...cells.slice(0, 2))
            return newCells
        } // FROM WEST
        if (node [1] > parent [1]) {
            return cells.slice(0, 3)
        } // FROM EAST
        if (node [1] < parent [1]) {
            const newCells = cells.slice(2)
            newCells.push(...cells.slice(0, 1))
            return newCells
        }
    }

    function getPassage(currNodeCoords, adjCellCoords) {
        if (adjCellCoords[0] > currNodeCoords[0]) {
            return [currNodeCoords[0] + 1, currNodeCoords[1]]
        } else if (adjCellCoords[0] < currNodeCoords[0]) {
            return [currNodeCoords[0] - 1, currNodeCoords[1]]
        } else if (adjCellCoords[1] > currNodeCoords[1]) {
            return [currNodeCoords[0], currNodeCoords[1] + 1]
        } else if (adjCellCoords[1] < currNodeCoords[1]) {
            return [currNodeCoords[0], currNodeCoords[1] - 1]
        }
    }


    function isWithinBounds(coords) {
        if (_.isEqual(coords, specialNodes.current.startNode) ||
            _.isEqual(coords, specialNodes.current.endNode)) {
            return true
        }
        return ((0 <= coords[0] && coords[0] < rowsInCol) &&
            (0 <= coords[1] && coords[1] < nodesInRow))
    }


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
            // return [currCoords[0] + 1, currCoords[1]]
        } else if (adjCoords[0] < currCoords[0]) {
            makeNodePath([currCoords[0] - 1, currCoords[1]])
            // return [currCoords[0] - 1, currCoords[1]]
        } else if (adjCoords[1] > currCoords[1]) {
            makeNodePath([currCoords[0], currCoords[1] + 1])
            // return [currCoords[0], currCoords[1] + 1]
        } else if (adjCoords[1] < currCoords[1]) {
            makeNodePath([currCoords[0], currCoords[1] - 1])
            // return [currCoords[0], currCoords[1] - 1]
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

    function isPossibleCell(coords) {
        return coords[0] % 2 === 1 && coords[1] % 2 === 1 
    }







    const mazeRows = mazeArr.current.map((row, i) => {
        const newRow = row.map(node => {
            return (
                <Node node={node} key={`${node.id}`} />
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
            getMazegenAlgoStartingPoint,
            addMazegenStartAndEndNodes,
            updatePathfindingParentNode,
            getPathfindingParentCoords,
            getAdjCellFromPassage,
            getAdjCells,
            getAdjPassages,
            getPassage,
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
            isPossibleCell,
            getNodeFromCoords,
        }}>
            {/* <div className='maze--border-container'> */}
            <div className='maze--container' id="maze-container-rect">
                {mazeRows}

                {options.mazegenAlgo === prims && mazegenIsRunning && <Prims />}
                {options.mazegenAlgo === backtracking && mazegenIsRunning && <Backtracking />}
                {options.mazegenAlgo === kruskals && mazegenIsRunning && <Kruskals />}
                {options.mazegenAlgo === huntAndKill && mazegenIsRunning && <HuntAndKill />}

                {options.pathfindingAlgo === bfs && pathfindingIsRunning && <Bfs />}
                {options.pathfindingAlgo === dfs && pathfindingIsRunning && <Dfs />}
                {options.pathfindingAlgo === dijkstras && pathfindingIsRunning && <Dijkstras />}
                {options.pathfindingAlgo === astar && pathfindingIsRunning && <AStar />}

            </div>
            {/* </div> */}
        </MazeContext.Provider>
    )
}

export { MazeContext }
