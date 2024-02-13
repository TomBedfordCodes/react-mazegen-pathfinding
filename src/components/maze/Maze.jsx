import React from 'react'
import { MazeContext } from '../Main'
import Node from './Node'


export default function Maze() {

    const { updateMaze, mazeArr, specialNodes, options } = React.useContext(MazeContext)

    const mazeRows = mazeArr.map(row => {
        const newRow = row.map(node => {
            return (
                <Node node={node} id={`${node.id}`}/>
            )
        })
        return (
            <div className='maze--row'>
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


