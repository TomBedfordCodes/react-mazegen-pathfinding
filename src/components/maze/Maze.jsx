import React from 'react'
import { MazeContext } from '../Main'
import Node from './Node'


export default function Maze() {

    const { 
        updateMaze, 
        forceUpdate,
        mazeArr, 
        specialNodes, 
        options 
    } = React.useContext(MazeContext)

    const mazeRows = mazeArr.current.map((row, i) => {
        const newRow = row.map(node => {
            return (
                <Node node={node} key={`${node.id}`}/>
            )
        })
        return (
            <div key={i} className='maze--row'>
                {newRow}
            </div>
        )
    })

    return (
        <div className='maze--container'>
            {mazeRows}
        </div>
    )
}


