import React from 'react'
import { MainContext } from '../Main'
import Node from './Node'
import Bfs from '../pathfindingAlgos/Bfs'
import { wallNode } from '../../namedConstants'


const MazeContext = React.createContext()


export default function Maze() {

    const { 
        mazeArr, 
        options,
        specialNodes,
        templatePathfinding,
    } = React.useContext(MainContext)

    const [, forceMazeUpdate] = React.useReducer(x => x + 1, 0)



    // HELPER FUNCTIONS FOR THE MAZE ALGOS 


    function resetPathfinding() {
        for (let row of mazeArr.current) {
            for (let node of row) {
                node.pathfinding = {...templatePathfinding}
            }
        }
        forceMazeUpdate()
    }

    function getNodeFromCoords(coords) {
        return mazeArr.current[coords[0]][coords[1]]
    }

    function makeNodeSearched(coords) {
        getNodeFromCoords(coords).pathfinding.isSearched = true
    }

    function isNodeSearched(coords) {
        return getNodeFromCoords(coords).pathfinding.isSearched
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

    function getAdjPassages(coords) {
        const row = coords[0]
        const col = coords [1]
        const passages = [[row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1]]
        const filteredPassages = passages.filter(psg => {
            return isWithinBounds(psg) && isPassable(psg)
        })
        const shuffledPassages = _.shuffle(filteredPassages)
        return shuffledPassages
        // THIS IS MISSING SOME STUFF FOR LEFT-TURN BACKTRACKING
    }
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
        return getNodeFromCoords(coords).clickChoiceType != wallNode
    }
    // def is_passable(node: (int, int)) -> bool:
    //     return maze[node[0]][node[1]] == CELL_CHAR or maze[node[0]][node[1]] == PASSAGE_CHAR
  


    function makeNodeWall(coords) {
        mazeArr.current[coords[0]][coords[1]].clickChoiceType = wallNode
    }


    function makeNodeDrawnPath(coords) {
        mazeArr.current[coords[0]][coords[1]].pathfinding.isDrawnPathNode = true
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

    return (
        <MazeContext.Provider value={{
            forceMazeUpdate,
            resetPathfinding,
            updatePathfindingParentNode,
            getPathfindingParentCoords,
            getAdjPassages,
            isNodeSearched,
            isWithinBounds,
            isPassable,
            makeNodeSearched,
            makeNodeWall,
            makeNodeDrawnPath,
        }}>
            <div className='maze--container'>
                {mazeRows}
                <Bfs />
            </div>
        </MazeContext.Provider>
    )
}

export { MazeContext }
