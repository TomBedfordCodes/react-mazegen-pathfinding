import React from 'react'
import { MainContext } from '../Main'
import { bfs } from '../../namedConstants'
import useEffectOnUpdate from '../../hooks/useEffectonUpdate'
import { MazeContext } from '../maze/Maze'
import DrawPath from './DrawPath'


export default function Bfs() {

    const {
        specialNodes, 
        options, 
        pathfindingIsRunning, 
        stopPathfinding,
    } = React.useContext(MainContext)

    const {
        forceMazeUpdate,
        resetPathfinding,
        makeNodeSearched,
        isNodeSearched,
        getAdjPassages,
        makeNodeWall,
    } = React.useContext(MazeContext)


    const queue = React.useRef([])
    const [depsLocalUpdate, localUpdate] = React.useReducer(x => x + 1, 0)
    const [isDrawingPath, setIsDrawingPath] = React.useState(false)



    
    // console.log("Rerendered BFS")

    React.useEffect(() => {
        if (!pathfindingIsRunning && isDrawingPath) {
            setIsDrawingPath(false)
        }
    })


    useEffectOnUpdate(() => {
        // This useEffect function gets a closure with the current state values; any changes in
        //      state will not be reflected until the function is run again.

        // console.log("tried to run useEffect")
        if (!pathfindingIsRunning || options.pathfindingAlgo != bfs || 
            !specialNodes.current.startNode || !specialNodes.current.endNode) { 
            return
        }
        // console.log("successfully ran useEffect")

        // ALGORITHM (USING COORDS TO REPRESENT NODES)
        if (queue.current.length <= 0 && !isNodeSearched(specialNodes.current.startNode)) {
            // IF QUEUE IS EMPTY AND STARTNODE IS UNSEARCHED, BEGIN ALGO
            const firstNodeCoords = specialNodes.current.startNode
            makeNodeSearched(firstNodeCoords)
            queue.current.push(firstNodeCoords)
            // RE-RENDER THE MAZE MID-ALGO IF SLOW-MO IS TOGGLED ON
            if (options.isSlowMo) forceMazeUpdate()
        } 
        else if (queue.current.length <= 0) {
            // EMPTY QUEUE WITHOUT A PATH MEANS PATHFIND FAILED - WE EXIT HERE
            forceMazeUpdate()
            stopPathfinding()
            return
        }
        const curr = queue.current.shift()
        makeNodeSearched(curr)
        for (let adjPsg of getAdjPassages(curr)) {
            if (isNodeSearched(adjPsg)) {
                continue
            }
            if (_.isEqual(adjPsg, specialNodes.current.endNode)) {
                // if we find the end, add the current node as its parent, draw the path from the exit
                updatePathfindingParentNode(adjPsg, curr)
                setIsDrawingPath(true)
                return
            }
        }
        

        // PYTHON
        // curr = queue.popleft()
        // make_node_searched(curr)
        // for adj_psg in get_adj_passages(curr, ordered=True):
        //     if is_searched_node(adj_psg):
        //         continue
        //     if adj_psg == mz.maze_exit:
        //         # if we find the exit, add the current node as its parent, then draw the path from the exit
        //         update_pathfind_parent_node(adj_psg, curr)
        //         draw_path(adj_psg)
        //         *JS* stopPathfinding()
        //         return
        console.log("done")
        //     # otherwise add adj cell to frontier, and change adj passage to searched
        //     adj = get_adj_cell_from_passage(curr, adj_psg)
        //     make_node_frontier(adj)
        //     queue.append(adj)
        //     make_node_searched(adj_psg)
        //     signal_maze_updated(adj, pathfind=True)
        //     # update parents of adj and the adj_psg
        //     update_pathfind_parent_node(adj_psg, curr)
        //     update_pathfind_parent_node(adj, adj_psg)







        // if we haven't finished the algo yet, trigger a re-render to continue (and get updated state)
        setTimeout(localUpdate, 20)

        // stopPathfinding()  // run this once path is drawn as well

    }, [depsLocalUpdate, pathfindingIsRunning])

        




    return (
        <>
            {isDrawingPath && <DrawPath isDrawingPath={isDrawingPath} />}
        </>
    )
}
