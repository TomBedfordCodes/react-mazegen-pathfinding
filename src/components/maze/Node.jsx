import React from 'react'
import { MazeContext } from '../Main'


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

    const className = isWall ? "maze--node wall" : "maze--node"

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
