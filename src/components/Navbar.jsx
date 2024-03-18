import React from 'react'
import mazeImg from '/maze-icon.jpg'

export default function Navbar() {
    return (
        <nav>
            <ul className='navbar--ul'>
                <li><a className="navbar--link" href="#">Home</a></li>
                <li><a className="navbar--link" href="#">About Me</a></li>
                <li><a className="navbar--link" href="#">Projects</a></li>
            </ul>
            <h1 className='navbar--title'>Maze Generator <span className='accent-text'>&</span> Pathfinder</h1>
            <img className='navbar--icon' src={mazeImg} />
        </nav>
    )
}

