import React from 'react'
import { MainContext } from '../Main'
import { MazeContext } from './Maze.jsx'
import {
    wallNode, pathNode, startNode, endNode, drawnPathNode, 
    searchedNode, frontierNode, currentNode, forestNode, mountainNode,
    searchedForestNode, frontierForestNode, searchedMountainNode, frontierMountainNode,
} from '../../namedConstants.js'


export default function Node({ node }) {

    const { options, specialNodes, pathfindingIsRunning } = React.useContext(MainContext)  // updateMazeOnClick
    const { isNodeCurrent, updateMazeOnClick } = React.useContext(MazeContext)

    const { 
        nodeWidth, 
        nodeHeight, 
        coords, 
    } = node

    const styles = {
        width: nodeWidth,
        height: nodeHeight,
    }

    const baseName = "maze--node"
    const fade = "maze--node-transition"
    const animated = "animate-node"
    const animateAlt = "animate-node-alt"
    const pathAnimated = "animate-path"
    const currentAnimated = "animate-current"
    let className = baseName
    switch (node.clickChoiceType) {
        case pathNode: 
            className = `${baseName} ${fade}`  // ${!pathfindingIsRunning && fade}`
            break
        case forestNode: // unfortunately using animateAlt animates node on every reset
            className = `${animateAlt} ${forestNode}`  // ${baseName} ${animateAlt} 
            break
        case mountainNode: 
            className = `${animateAlt} ${mountainNode}` // ${baseName} ${animateAlt}
            break
        default:
            className = baseName
    }

    if (node.pathfinding.isDrawnPath) {
        className = `${options.isSlowMo && pathfindingIsRunning && pathAnimated} ${drawnPathNode}`  // ${baseName} 
    } else if (specialNodes.current.currentNode && isNodeCurrent(coords)) {
        className = `${options.isSlowMo && pathfindingIsRunning && currentAnimated} ${currentNode}`  // ${baseName}  
    } else if (node.pathfinding.isSearched) {
        className = `${searchedNode}`  // ${baseName} 
        if (node.clickChoiceType === forestNode) {
            className = `${searchedForestNode}`
        } else if (node.clickChoiceType === mountainNode) {
            className = `${searchedMountainNode}`
        }
    } else if (node.pathfinding.isFrontier) {
        className = `${options.isSlowMo && pathfindingIsRunning && animated} ${frontierNode}`  // ${baseName} 
        if (node.clickChoiceType === forestNode) {
            className = `${options.isSlowMo && animated} ${frontierForestNode}`
        } else if (node.clickChoiceType === mountainNode) {
            className = `${options.isSlowMo && animated} ${frontierMountainNode}`
        }
    }


    if (specialNodes.current.startNode &&
        coords[0] === specialNodes.current.startNode[0] &&
        coords[1] === specialNodes.current.startNode[1]) {
            className = `${animated} ${startNode}`  // ${baseName} 
    } else if (specialNodes.current.endNode &&
        coords[0] === specialNodes.current.endNode[0] &&
        coords[1] === specialNodes.current.endNode[1]) {
            className = `${animated} ${endNode}`  //${baseName} 
    }

    if (node.clickChoiceType === wallNode) {
        className = `${animated} ${wallNode}`  // ${baseName} 
    }

    
    function checkBtnDown(e) {
        if (e.buttons === 1) {
            updateMazeOnClick(coords)
        }
    }

    return (
        <div
            className={className}
            onMouseEnter={checkBtnDown}
            onMouseDown={() => updateMazeOnClick(coords)}
            style={styles}
        >
        </div>
    )
}
