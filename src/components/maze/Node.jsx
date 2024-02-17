import React from 'react'
import { MazeContext } from '../Main'
import { wallNode, pathNode } from '../../namedConstants.js'


export default function Node({ node }) {

    const { 
        updateMazeOnClick,
        forceUpdate, 
        mazeArr, 
        specialNodes, 
        options
    } = React.useContext(MazeContext)

    const { 
        nodeWidth, 
        nodeHeight, 
        coords, 
        isWall 
    } = node

    const styles = {
        width: nodeWidth,
        height: nodeHeight,
    }

    const baseName = "maze--node"
    let className = baseName
    switch (node.terrainType) {
        case wallNode: 
            className = `${baseName} wall`
            break
        case pathNode: 
            className = baseName
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
            // className='maze--node'
            className={className}
            onMouseEnter={checkBtnDown}
            // onClick={() => updateMazeOnClick(coords)}
            onMouseDown={() => updateMazeOnClick(coords)}
            style={styles}
        >
        </div>
    )
}
