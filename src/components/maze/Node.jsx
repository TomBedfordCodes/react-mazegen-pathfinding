import React from 'react'
import { MainContext } from '../Main'
import {
    wallNode, pathNode, startNode, endNode
} from '../../namedConstants.js'


export default function Node({ node }) {

    const { updateMazeOnClick } = React.useContext(MainContext)

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
            className = `${baseName} ${animated} ${wallNode}`
            break
        case pathNode: 
            className = `${baseName}`
            break
        case startNode:
            className = `${baseName} ${animated} ${startNode}`
            break
        case endNode:
            className = `${baseName} ${animated} ${endNode}`
            break
        default:
            className = baseName
    }

    // HAVE ANOTHER SWITCH CASE FOR ALGORITHM OVERLAYS WHICH WILL CHANGE THE CLASSES
    //      SEARCHED
    //      FRONTIER
    //      PATH

    
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
