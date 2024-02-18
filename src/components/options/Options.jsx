import React from 'react'
import ClickChoicePanel from './ClickChoicePanel'
import {
    wallNode, pathNode, startNode, endNode, 
} from '../../namedConstants.js'


export default function Options() {

    return (
        <div className='options--container'>
            <h2>Options</h2>
            <ClickChoicePanel choices={[wallNode, pathNode]} />
            <ClickChoicePanel choices={[startNode, endNode]} />
        </div>
    )
}

