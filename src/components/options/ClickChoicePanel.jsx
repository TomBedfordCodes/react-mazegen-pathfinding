import React from 'react'
import { MainContext } from '../Main'
import { choiceNames } from '../../namedConstants'
import { startNode, endNode } from '../../namedConstants'


export default function ClickChoicePanel({ choices }) {

    const { updateClickChoice, getClickChoiceType, specialNodes } = React.useContext(MainContext)

    const choiceBtnElements = choices.map((choice, i) => {
        let isDisabled = false
        if (choice === startNode && specialNodes.current.startNode) {
            isDisabled = true
        } else if (choice === endNode && specialNodes.current.endNode) {
            isDisabled = true
        }

        const isSelected = getClickChoiceType() === choice
        const secondClassName = isSelected && !isDisabled ? "btn-selected" : ""

        return (
            <button
                key={i}
                className={`options--click-choice-btn ${secondClassName}`}
                onClick={() => updateClickChoice(choice)}
                disabled={isDisabled}
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
