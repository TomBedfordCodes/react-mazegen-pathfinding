import React from 'react'
import Maze from '../components/Maze.jsx'

export default function Main() {
    return (
        <main>
            <div className='main--maze-container'>
                <h2>Maze</h2>
                <Maze />
            </div>
            <div className='main--options-container'>
                <h2>Options</h2>
            </div>
        </main>
    )
}