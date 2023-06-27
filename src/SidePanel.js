import React from 'react';
import { useState } from 'react';
import './SidePanel.css';
import DragEditCard from './DragEditCard';
import { ImCross, ImPencil } from 'react-icons/im';


export default function Schedules({onOverlay, schedulesList, onAddTask, onUpdateSchedule, onClearSchedule}) {
    const [showManage, setShowManage] = useState(false);

    const handleManageClick = () => {
        setShowManage(!showManage);
    };

    const handleClear = () => {
        onClearSchedule();
        setShowManage(false);
    }

    return (
        <div className="sidepanel">
            <button id="exit-button" onClick={onOverlay}><ImCross cursor="pointer" size="2em"/></button>
            <div className="task-container">
                <div className="head-container">
                    <span className="t18">Tasks</span>
                    <div style={{ position : "relative" }}>
                        <button className="manage-button" onClick={handleManageClick}><ImPencil cursor="pointer" size="1.5em" /></button>
                        {showManage ? <div className="manage-section">
                            <div className="manage-block" onClick={handleClear}>Clear all tasks</div>
                        </div> : null}
                    </div>
                </div>
                <DragEditCard scheduleList={schedulesList} onAddTask={onAddTask} onUpdateSchedule={onUpdateSchedule} />
            </div>
        </div>
    )
}



