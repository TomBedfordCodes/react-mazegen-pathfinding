import React from 'react'
import MazeTest from './mazetest/MazeTest.jsx'
import Maze from './maze/Maze.jsx'


const MazeContext = React.createContext()


export default function Main() {

    // WRAP MAIN WITH CONTEXT FOR ALL OPTIONS WHICH WILL IMPACT THE MAZEGEN / CLICKING / PATHFINDING
    //      THIS MEANS MAZE ARRAY HAS TO BE HERE

    // I'D LIKE MOST OF THE SCREEN TO BE THE GRID, WITH AN OPTIONS MENU TO SLIDE FROM THE RIGHT
    //      (WITH SOME BASIC OPTIONS ALWAYS VISIBLE?)

    // OPTIONS:
    //      CLICKING:
    //          WALL; PATH; FOREST; MOUNTAIN; START; END (get react-icons for start/end)
    //      WHICH MAZEGEN ALGO:
    //          KRUSKALS, PRIMMS, BACKTRACKING, HUNT AND KILL
    //      WHICH PATHFINDING ALGO:
    //          BFS, DFS (TURN LEFT), DIJKSTRA'S, A-STAR
    //      TOGGLES:
    //          WALLS UNEDITABLE
    //          SHOW GENERATION/PATHFINDING (SLOW-MO)
    // STRETCH:
    //      RESIZE MAZE



    const [mazeArr, setMazeArr] = React.useState([
        // CREATE MAZE ARRAY OF OBJECTS HERE
    ])

    function updateMaze() {
        // const newArr = mazeArr.map(arr => arr.slice())
        // doesn't solve issue cos objects wont be deep copied
    }



    return (
        <MazeContext.Provider value={{
            // ADD IN ALL CONTEXT VALUES HERE
        }}>
            <main>
                <div className='main--maze-container'>
                    <h2>Maze</h2>
                    {/* <MazeTest /> */}
                    <Maze />
                </div>
                <div className='main--options-container'>
                    <h2>Options</h2>
                    <div className='options--container'></div>
                </div>
            </main>
        </MazeContext.Provider>
    )
}
