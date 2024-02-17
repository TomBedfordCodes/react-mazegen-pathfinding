import React from 'react'
import { MazeContext } from '../Main'
import { choiceNames } from '../../namedConstants'




export default function ClickChoicePanel({ choices }) {

    const { updateClickChoice } = React.useContext(MazeContext)

    const choiceBtnElements = choices.map((choice, i) => {
        return (
            <button 
                key={i}
                className='options--click-choice-btn' 
                onClick={() => updateClickChoice(choice)}
            >
                {choiceNames[choice]}
            </button>
        )
    })

    return (
        <div className='options--click-choice-panel--container'>  
            {choiceBtnElements}
        </div>
    )
}
