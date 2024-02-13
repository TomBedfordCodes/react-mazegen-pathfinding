import React from 'react'
// import MazeTest from './mazetest/MazeTest.jsx'
import Maze from './maze/Maze.jsx'


    // WRAP MAIN WITH CONTEXT FOR ALL OPTIONS AND THE MAZE ARRAY

    // MAZE:
    //      EACH NODE TO BE AN OBJECT WITHIN THE 2D ARRAY - SEPARATE OUT ATTRS RELEVANT TO EACH ALGO.
    //      CREATE A SEPARATE FILE WITH ALL THE ALGO NAMES AS CONSTS AND USE THESE TO AVOID MISSPELLING.
    //      PUT A 'SPECIAL NODES' OBJECT IN STATE AS WELL:
    //          THIS WILL TRACK THE LOCATION OF THE START/END/CURRENT NODES (AND ANY OTHERS TO BE ADDED)
    //          ON MAZE ARRAY UPDATE ALSO SET THE OBJECT IF ONE OF THE SPECIAL NODES CHANGES

    // OPTIONS:
    //      TRACK - IS MAZE GENERATION / PATHFINDING HAPPENING RIGHT NOW?
    //      CLICKING (selectable radiobtn type thing):
    //          WALL; PATH (normal speed); FOREST (x2 slower); MOUNTAIN (x5 slower); START; END 
    //              (get react-icons for start/end)
    //          KEEP IN STATE THE CURRENTLY SELECTED TYPE (use an enum or something similar)
    //      WHICH MAZEGEN ALGO (some kind of dropdown selection component for these two):
    //          KRUSKALS, PRIMMS, BACKTRACKING, HUNT AND KILL
    //      WHICH PATHFINDING ALGO:
    //          BFS, DFS (TURN LEFT), DIJKSTRA'S, A-STAR
    //      TOGGLES (create custom useToggle hook for this):
    //          SHOW GENERATION/PATHFINDING (SLOW-MO) OR JUST INSTA DO IT

    // STRETCH GOALS:
    //      RESIZE MAZE TO FILL MOST OF THE SCREEN
    //      I'D LIKE MOST OF THE SCREEN TO BE THE GRID, WITH AN OPTIONS MENU TO SLIDE FROM THE RIGHT
    //          (WITH SOME BASIC OPTIONS ALWAYS VISIBLE?)
    //      TOGGLE WALLS UNEDITABLE
    //      MOBILE FIRST:
    //          - Use burger for menu in top-left which slides out.
    //          - Not enough width for navbar (causing footer issues).
    //          - Have settings at the top, then maze below. 'Generate maze' button 
    // 	            just above maze. Possible to snap view to maze?
    //      SEPARATE OUT MAZE AND OPTIONS STATES INTO THEIR RESPECTIVE COMPONENTS AND EXPOSE TO MAIN
    //      ADD 'VIA' SPECIAL NODE


    
const MazeContext = React.createContext()


export default function Main() {

    const [mazeArr, setMazeArr] = React.useState([
        // CREATE MAZE ARRAY OF OBJECTS HERE
    ])

    function updateMaze() {
        // Have to go through every object on every maze update to see what needs changing.
        //      This seems like it will be slow for large mazes, but I haven't done the
        //      tutorial on React optimisation yet; might be improvements to be made.
    }


    return (
        <MazeContext.Provider value={{
            // ADD IN CONTEXT VALUES HERE - MAZE ARRAY, SPECIAL NODES ARRAY, AND OPTIONS
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
