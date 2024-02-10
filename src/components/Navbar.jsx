import React from 'react'

export default function Navbar() {
    return (
        <nav>
            <ul className='navbar--ul'>
                <li><a className="navbar--link" href="#">Home</a></li>
                <li><a className="navbar--link" href="#">About Me</a></li>
                <li><a className="navbar--link" href="#">Projects</a></li>
            </ul>
            <h1 className='navbar--title'>Maze Generator & Pathfinder</h1>
            <img className='navbar--icon' src='/maze-icon.jpg' />
        </nav>
    )
}

