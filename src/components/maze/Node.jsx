import React from 'react'
import { MazeContext } from '../Main'


export default function Node({ node }) {

    const { updateMaze, mazeArr, specialNodes, options } = React.useContext(MazeContext)

    
    const { nodeWidth, nodeHeight, coords, isWall } = node
    

    const styles = {
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: isWall ? "black" : "white"
    }

    return (
        <div 
            className='maze--node'
            onClick={() => updateMaze(coords)}
            style={styles}
        >
        </div>
    )
}
