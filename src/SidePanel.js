import React from 'react';
import { useState } from 'react';
import './SidePanel.css';
import DragEditCard from './DragEditCard';
import { ImCross, ImPencil } from 'react-icons/im';


export default function Schedules({onOverlay, scheduleList, onAddTask, onAddWork, onAddRest, 
                                   onDuplicateFirst, onDuplicateLast, onUpdateSchedule, onClearSchedule}) {
    const [showManage, setShowManage] = useState(false);

    return (
        <div className="sidepanel">
            <button id="exit-button" onClick={onOverlay}><ImCross cursor="pointer" size="2em"/></button>
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
        </div>
    )
}



