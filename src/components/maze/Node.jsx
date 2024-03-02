import React from 'react'
import { MainContext } from '../Main'
import { MazeContext } from './Maze.jsx'
import {
    wallNode, pathNode, startNode, endNode, drawnPathNode, 
    searchedNode, frontierNode, currentNode, forestNode, mountainNode,
    searchedForestNode, frontierForestNode, searchedMountainNode, frontierMountainNode,
} from '../../namedConstants.js'


export default function Node({ node }) {

    const { updateMazeOnClick, options, specialNodes } = React.useContext(MainContext)
    const { nodeIsCurrent } = React.useContext(MazeContext)

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
    const animated = "animate-node"
    const pathAnimated = "animate-path"
    const currentAnimated = "animate-current"
    let className = baseName
    switch (node.clickChoiceType) {
        // case wallNode: 
        //     className = `${animated} ${wallNode}`  // ${baseName} 
        //     break
        case pathNode: 
            className = `${baseName}`
            break
        case forestNode: 
            className = `${forestNode}`  // ${baseName} 
            break
        case mountainNode: 
            className = `${mountainNode}` // ${baseName} 
            break
        default:
            className = baseName
    }

    if (node.pathfinding.isDrawnPath) {
        className = `${options.isSlowMo && pathAnimated} ${drawnPathNode}`  // ${baseName} 
    } else if (specialNodes.current.currentNode && nodeIsCurrent(coords)) {
        className = `${options.isSlowMo && currentAnimated} ${currentNode}`  // ${baseName}  
    } else if (node.pathfinding.isSearched) {
        className = `${searchedNode}`  // ${baseName} 
        if (node.clickChoiceType === forestNode) {
            className = `${searchedForestNode}`
        } else if (node.clickChoiceType === mountainNode) {
            className = `${searchedMountainNode}`
        }
    } else if (node.pathfinding.isFrontier) {
        className = `${options.isSlowMo && animated} ${frontierNode}`  // ${baseName} 
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
