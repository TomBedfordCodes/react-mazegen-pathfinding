import React from 'react'

export default function MazeSquare(props) {
    return (
        <div 
            className='maze--square' 
            onClick={props.handleClick}
            style={{backgroundColor: props.square.on ? "white" : "black"}}
        ></div>
    )
}