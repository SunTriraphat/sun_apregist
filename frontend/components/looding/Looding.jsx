import React from 'react'
import style from './Looding.module.css'

function Looding({ title, subtitle }) {
    return (
        < >

            <p className="text-gray-700 text-lg font-semibold text-center">
                {title}
            </p>
            <p className="text-gray-500 text-sm text-center">
                {subtitle}
            </p>
            <div className="flex flex-row justify-center items-end space-x-4 relative  ">
                <div className={`circle animate-circle ${style.delay0}`} />
                <div className={`circle animate-circle ${style.delay1}`} />
                <div className={`circle animate-circle ${style.delay2}`} />
                <div className={`circle animate-circle ${style.delay3}`} />
            </div>

        </ >
    )
}

export default Looding
