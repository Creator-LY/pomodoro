import React from 'react';
import './TimeLine.css';

export default function TimeLine({ scheduleList = [] }) {
    return (
        <ul className="timeline">
            {scheduleList.slice(0, 3).map((task, index) => (
                <li key={task.id} className="task">
                    <div className="task-info">
                        <h5>{task.title} ({task.time})</h5>
                        {task.note ? <p>{task.note}</p> : <p>No note was added to this task.</p>}
                    </div>
                    {index === 0 ? <div className="circle active"></div> : <div className="circle"></div>}
                </li>
            ))}
            {scheduleList.length === 4 ? 
                <li key={scheduleList[3].id} className="task">
                    <div className="task-info">
                        <h5>{scheduleList[3].title} ({scheduleList[3].time})</h5>
                        {scheduleList[3].note ? <p>{scheduleList[3].note}</p> : <p>No note was added to this task.</p>}
                    </div>
                    <div className="circle"></div>
                </li> : null}
            {scheduleList.length > 4 ? 
            <li key={scheduleList[4].id} className="task">
                <div className="task-info">
                    <h5>There are {scheduleList.length - 3} more tasks</h5>
                    <p>On schedule: {scheduleList[4].title} ...</p>
                </div>
                <div className="diamond"></div>
            </li> : null}   
        </ul>
    );
}