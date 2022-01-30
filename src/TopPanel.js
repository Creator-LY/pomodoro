import './TopPanel.css'
import { GrSchedulePlay, GrPowerReset, GrFastForward, GrPause } from 'react-icons/gr';
import { useState, useEffect } from 'react'


export default function TopPanel({ onStop, onSchedule, onReset, onForward, schedulesList }) {
    const [displayWork, setDisplayWork] = useState([])
    const [laterWork, setLaterWork] = useState([])

    useEffect(() => {
        let arr = [...schedulesList].slice(0, 2)
        setDisplayWork(arr)
        let arr2 = [...schedulesList].slice(2)
        let arr3 = []
        for (let i=0; i<arr2.length; i++) {
            let dict = {}
            dict.status = arr2[i].status
            dict.id = i + new Date().getTime()
            arr3.push(dict)
        }
        setLaterWork(arr3)
    }, [schedulesList])

    return (
        <div className="top-panel">
            <button className="icon-button" onClick={onSchedule}><GrSchedulePlay className="icon" size="2em" cursor="pointer" /></button>
            <button className="icon-button" onClick={onReset}><GrPowerReset className="icon" size="2em" cursor="pointer" /></button>
            <button className="icon-button" onClick={onStop}><GrPause className="icon" size="2em" cursor="pointer" /></button>
            <button className="icon-button" onClick={onForward}><GrFastForward className="icon" size="2em" cursor="pointer" /></button>
            {displayWork.map((work) => {
                return <div key={displayWork.indexOf(work)} className="left-border" style={{ borderColor: work.status ? 'orange' : 'rgb(51, 102, 255)' }}>
                            <p id="status">{work.status ? 'Work' : 'Rest'}</p>
                            <p id="time">{work.time}</p>
                            <p id="text">{work.description}</p>
                       </div>
            })}
            {laterWork.map((status) => {
                return <div key={"status" + status.id} className="work-circle" style={{ backgroundColor: status.status ? 'orange' : 'rgb(66, 84, 245)' }}></div>
            })}
        </div>
    )
}
