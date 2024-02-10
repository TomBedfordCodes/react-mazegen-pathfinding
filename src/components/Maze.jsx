import React from 'react'
import MazeSquare from './MazeSquare'

export default function Maze() {

    const [mazeSquares, setMazeSquares] = React.useState([
        {on: true}, 
        {on: true},
        {on: true},
        {on: true},
        {on: true},
    ])


    const mazeSquareEls = mazeSquares.map((_square, i) => {
        return (
            <MazeSquare 
                key={i} 
                handleClick={() => handleClick(i)}
                square={mazeSquares[i]} 
            />
        )
    })

    console.log(mazeSquares)

    function handleClick(index) {
        setMazeSquares(prevArr => {
            const newArr = prevArr.map((square, i) => {
                return i === index ? {on: !square.on} : square
            })
            return newArr
        })
    }

    return (
        <section className='maze--row'>
            {mazeSquareEls}
        </section>
    )
}
