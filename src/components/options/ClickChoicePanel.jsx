import React from 'react'
import { MainContext } from '../Main'
import { choiceNames } from '../../namedConstants'
import { startNode, endNode } from '../../namedConstants'
import { OptionsContext } from './Options'


export default function ClickChoicePanel({ choices }) {

    const { getClickChoiceType } = React.useContext(MainContext)
    const { updateClickChoice, } = React.useContext(OptionsContext)

    const choiceBtnElements = choices.map((choice, i) => {
        let isDisabled = false

        const isSelected = getClickChoiceType() === choice
        const secondClassName = isSelected && !isDisabled ? "btn-selected" : ""

        return (
            <button
                key={i}
                className={`options--btn ${secondClassName}`}
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
