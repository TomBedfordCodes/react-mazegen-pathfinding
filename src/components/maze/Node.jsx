import React from 'react'
import { MainContext } from '../Main'
import { MazeContext } from './Maze.jsx'
import {
    wallNode, pathNode, startNode, endNode, drawnPathNode, searchedNode, frontierNode, currentNode,
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
    let className = baseName
    switch (node.clickChoiceType) {
        case wallNode: 
            className = `${animated} ${wallNode}`  // ${baseName} 
            break
        case pathNode: 
            className = `${baseName}`
            break
        default:
            className = baseName
    }

    if (node.pathfinding.isDrawnPath) {
        className = `${options.isSlowMo && pathAnimated} ${drawnPathNode}`  // ${baseName} 
    } else if (specialNodes.current.currentNode && nodeIsCurrent(coords)) {
        className = `${options.isSlowMo && pathAnimated} ${currentNode}`  // ${baseName} 
    } else if (node.pathfinding.isSearched) {
        className = `${searchedNode}`  // ${baseName} 
    } else if (node.pathfinding.isFrontier) {
        className = `${options.isSlowMo && animated} ${frontierNode}`  // ${baseName} 
    }

    switch (node.clickChoiceType) {
        case startNode:
            className = `${animated} ${startNode}`  // ${baseName} 
            break
        case endNode:
            className = `${animated} ${endNode}`  //${baseName} 
            break
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
