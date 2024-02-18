import React from 'react'
import { MazeContext } from '../Main'
import {
    wallNode, pathNode, startNode, endNode
} from '../../namedConstants.js'


export default function Node({ node }) {

    const { 
        updateMazeOnClick,
        options
    } = React.useContext(MazeContext)

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
    const animated = "click-choice-shared"
    let className = baseName
    switch (node.clickChoiceType) {
        case wallNode: 
            className = `${baseName} ${animated} wall-node`
            break
        case pathNode: 
            className = `${baseName}`
            break
        case startNode:
            className = `${baseName} ${animated} start-node`
            break
        case endNode:
            className = `${baseName} ${animated} end-node`
            break
        default:
            className = baseName
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
