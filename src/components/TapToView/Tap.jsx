import React from 'react'
import './Tap.css'
function Tap(params) {
    return (
        <div id='tapBox' className='tapBox'
            style={
                {
                    top: `${params.top ? params.top : '10%'}`,
                    right: `${params.right ? params.right : '10%'}`
                }
            }>
            Tap to Open {params.text}
        </ div>
    )
}

export default Tap
