import './Timer.css'
import { VscDebugStart } from 'react-icons/vsc'
import React from 'react'
import { useSpring, animated } from 'react-spring'

export default function Timer({time, onStart, running, animation, duration, reset}) {
    const props = useSpring({ 
        from: {
            strokeDashoffset: "0px",
        },
        to: {
            strokeDashoffset: "2022px",
        },
        enter: {
            strokeDashoffset: "0px",
        },
        leave: {
            strokeDashoffset: "0px",
        },
        loop: true,
        config: { duration: duration },
        pause: animation,
        reset: reset,
        onReset: () => {console.log("reset")}
     })
    
    return (
        <div className="center-on-page">
            <div className="time-line">
                <svg id="animate">
                    <animated.path d="M350 3
                            h247
                            q100 0 100 100
                            v194
                            q0 100 -100 100
                            h-494
                            q-100 0 -100 -100
                            v-194
                            q0 -100 100 -100
                            h247
                            Z"  style={props}/>
                </svg>
                <span>{time}</span>
                {(!running && time !== "00:00:00") && (<button onClick={onStart}><VscDebugStart color="white" id="start-button" size="2em" cursor="pointer"  /></button>)}
            </div>
        </div>
    )
}

