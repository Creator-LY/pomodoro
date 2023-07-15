import React from 'react';
import { useState, useEffect } from 'react';
import './SidePanel.css';
import DragEditCard from './DragEditCard';
import { ImCross, ImPencil } from 'react-icons/im';
import { GiAlarmClock, GiChicken} from 'react-icons/gi';


export default function SidePanel({onOverlay, scheduleList, onAddTask, onAddWork, onAddRest, 
                                   onDuplicateFirst, onDuplicateLast, onUpdateSchedule, onClearSchedule, history,
                                   onSwapAlarm}) {
    const [showManage, setShowManage] = useState(false);
    const [totalTime, setTotalTime] = useState({ minutes: 0, seconds: 0 });

    const [selectedAlarm, setSelectedAlarm] = useState(null);

    useEffect(() => {
        const totalTime = scheduleList.reduce((total, task) => {
            const taskTime = task.time;
            const [minutes, seconds] = taskTime.split(':');
            total.minutes += parseInt(minutes);
            total.seconds += parseInt(seconds);
            return total;
        }, { minutes: 0, seconds: 0 });

        // Adjust minutes if seconds exceed 60
        if (totalTime.seconds >= 60) {
            totalTime.minutes += Math.floor(totalTime.seconds / 60);
            totalTime.seconds %= 60;
        }
    
        setTotalTime(totalTime);
    }, [scheduleList]);

    return (
        <div className="sidepanel">
            <button id="exit-button" onClick={onOverlay}><ImCross cursor="pointer" size="2em"/></button>
            <div>
                <div className="stat-container">
                    <div className="inline-box">Remaining Tasks: <span className="t18">{scheduleList.length}</span></div>
                    <div className="inline-box">Finish After: <span className="t18">{totalTime.minutes}m {totalTime.seconds}s</span></div>
                </div>
                <div className="history-container">
                    <div className="inline-box">Finished Tasks: <span className="t18">{history.length}</span></div>
                    {history.map((task) => (
                        <div key={task.id} className="completed-task">
                            <input type="checkbox" checked readOnly />
                            <label>{task.title} ({task.time})</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="task-container">
                <div className="head-container">
                    <span className="t18">Tasks</span>
                    <div style={{ position : "relative" }}>
                        <button className="manage-button" onClick={() => {setShowManage(!showManage);}}><ImPencil cursor="pointer" size="1.5em" /></button>
                        {showManage ? <div className="manage-section">
                            <div className="manage-block" onClick={() => {onAddWork();setShowManage(false);}}>Add work block (basic)</div>
                            <div className="manage-block" onClick={() => {onAddRest();setShowManage(false);}}>Add rest block (basic)</div>
                            <div className="manage-block" onClick={() => {onDuplicateFirst();setShowManage(false);}}>Duplicate first task</div>
                            <div className="manage-block" onClick={() => {onDuplicateLast();setShowManage(false);}}>Duplicate last task</div>
                            <div className="manage-block" onClick={() => {onClearSchedule();setShowManage(false);}}>Clear all tasks</div>
                        </div> : null}
                    </div>
                </div>
                <DragEditCard scheduleList={scheduleList} onAddTask={onAddTask} onUpdateSchedule={onUpdateSchedule} />
            </div>
            <div className="sound-container">
                <h3>Alarm</h3>
                <div>
                    <div className={`radio-icon ${selectedAlarm === 'beeping' ? 'active' : ''}`}
                        onClick={() => {setSelectedAlarm("beeping"); onSwapAlarm("beeping");}}>
                        <GiAlarmClock size="3em" />
                        <h5>Beeping</h5>
                    </div>
                    <div className={`radio-icon ${selectedAlarm === 'crowing' ? 'active' : ''}`}
                        onClick={() => {setSelectedAlarm("crowing"); onSwapAlarm("crowing");}}>
                        <GiChicken size="3em" />
                        <h5>Crowing</h5>
                    </div>
                </div>
                <h3>Music</h3>
            </div>
        </div>
    )
}



