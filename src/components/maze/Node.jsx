import React from 'react'
import { MazeContext } from '../Main'
import { wallNode, pathNode, startNode } from '../../namedConstants.js'


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
    let className = baseName
    switch (node.clickChoiceType) {
        case wallNode: 
            className = `${baseName} wall`
            break
        case pathNode: 
            className = `${baseName}`
            break
        case startNode:
            className = `${baseName} start`
            break
        case startNode:
            className = `${baseName} end`
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
