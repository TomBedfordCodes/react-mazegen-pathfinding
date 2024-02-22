import React from 'react'

// USEEFFECT WHICH DOESN'T RUN ON FIRST RENDER, ONLY WHEN DEPS ARRAY CHANGES
export default function useEffectOnUpdate(effectFunction, depsArr) {
    const firstRender = React.useRef(true)
    
    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        } else {
            effectFunction()
        }
    }, depsArr)
}
