import './Timer.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

export default function Timer({remainingTime, totalTime}) {
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [blinkColor, setBlinkColor] = useState(false);

    useEffect(() => {
        setMinute(Math.floor(remainingTime / 60));
        setSecond(remainingTime % 60);

        if (remainingTime === 0 && totalTime !== 0) {
            let blinkCount = 4;
            const blinkInterval = setInterval(() => {
                setBlinkColor((prevColor) => !prevColor);
                blinkCount--;

                if (blinkCount === 0) {
                    clearInterval(blinkInterval);
                }
            }, 500);
        }
    }, [remainingTime, totalTime]);

    const circleRadius = 45;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const orangeTime = 0.2 * totalTime;
    const progress = totalTime > 0 ? circleCircumference - ((totalTime - remainingTime) / totalTime) * circleCircumference : circleCircumference;

    const animatedPathProps = useSpring({
        strokeDashoffset: progress !== circleCircumference ? circleCircumference - progress : 0,
        strokeDasharray: circleCircumference,
        stroke: remainingTime === 0 ? (blinkColor ? '#ff7675' : 'white') : (remainingTime <= orangeTime ? '#fdcb6e' : 'white'),
        config: { duration: remainingTime === 0 ? 0 : 1000 }
    });
    
    return (
        <div className="time-line">
            <div className="timer-wrapper">
                <svg style={{transform: "rotateY(-180deg) rotateZ(-90deg)"}} viewBox="0 0 100 100">
                    <circle className="timer-base" cx="50" cy="50" r={circleRadius} />
                    <animated.circle cx="50" cy="50" r={circleRadius}
                        strokeWidth="5" strokeLinecap="round" fill="transparent" style={animatedPathProps}></animated.circle>
                </svg>
                <div className="minute">
                    {minute.toString().padStart(2, '0')}
                </div>
                <div className="second">
                    {second.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    )
}

