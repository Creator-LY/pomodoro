import React from 'react'
import './SidePanel.css'
import Edit from './Edit';
import { ImCross, ImArrowUp, ImArrowDown, ImPencil } from 'react-icons/im'
import { useState } from 'react'


export default function Schedules({onOverlay, schedulesList, onPomo, addTask, moveUp, moveDown, updateSchedule}) {
    const [showEdit, setShowEdit] = useState(false)
    const [schedule, setSchedule] = useState({})
    const [index, setIndex] = useState(0)

    const toggleEdit = (index, schedule) => {
        if (!showEdit) {
            setIndex(index)
            setSchedule(schedule)
            setShowEdit(!showEdit)
        } else {
            setShowEdit(!showEdit)
        }
    }
    return (
        <div style={{ backgroundColor: '#FFFFCC', width: '100%', height: '100%' }}>
            <div className="leftpanel">
                <span className="header">
                   <p id="header-id">Schedules</p>
                </span>
                <button id="exit-button" onClick={onOverlay}><ImCross cursor="pointer" /></button>
                <ul id="list-container">
                    {schedulesList.map((schedule) => {
                        return <li key={schedulesList.indexOf(schedule)} className="list" style={{ backgroundColor: schedule.status ? 'orange' : 'rgb(66, 84, 245)' }}>
                                    <h3 className="time-label">{schedule.time}</h3>
                                    <p className="time-description">{schedule.description}</p>
                                    <button id="up-button" onClick={() => moveUp(schedulesList.indexOf(schedule))}><ImArrowUp cursor="pointer" size="1.5em" /></button>
                                    <button id="down-button" onClick={() => moveDown(schedulesList.indexOf(schedule))}><ImArrowDown cursor="pointer" size="1.5em" /></button>
                                    <button id="edit-button" onClick={() => toggleEdit(schedulesList.indexOf(schedule), schedule)} ><ImPencil cursor="pointer" size="1.5em" /></button>
                               </li>
                    })}
                </ul>
            </div>
            {/* <div className="rightpanel">
                <button className="circle" id="time-5" onClick={() => addTask(5)}>5 mins</button>
                <button className="circle" id="time-10" onClick={() => addTask(10)}>10 mins</button>
                <button className="circle" id="time-15" onClick={() => addTask(15)}>15 mins</button>
                <button className="circle" id="time-20" onClick={() => addTask(20)}>20 mins</button>
                <button className="circle" id="time-25" onClick={() => addTask(25)}>25 mins</button>
                <button className="circle" id="time-30" onClick={() => addTask(30)}>30 mins</button>
                <button className="circle" id="time-45" onClick={() => addTask(45)}>45 mins</button>
                <button className="circle" id="time-60" onClick={() => addTask(60)}>60 mins</button>
                <button className="circle" id="time-pomodoro" onClick={onPomo}>Pomodoro</button>
            </div>
            { showEdit ? <Edit index={index} content={schedule} onToggle={toggleEdit.bind(this)} onUpdate={updateSchedule} /> : null } */}
        </div>
    )
}



