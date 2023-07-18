import React from 'react';
import { useState, useEffect } from 'react';
import './DragEditCard.css';
import { MdAddBox, MdEdit, MdPunchClock } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';


export default function DragEditCard({ scheduleList = [], onAddTask, onUpdateSchedule, changeMenu, setShowManage }) {
    const [editingTask, setEditingTask] = useState(null);
    const [cancelId, setCancelId] = useState(null);
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);

    useEffect(() => {
        handleCancelTask();
    // eslint-disable-next-line
    }, [changeMenu]);

    const handleAddTask = () => {
        if (scheduleList.length < 7) {
            // Close tool menu
            setShowManage(false);
            // Create a temporary task for editing
            const newTask = {
            id: uuidv4(),
            title: "",
            time: "05:00",
            note: ""
            };
            
            setCancelId(newTask.id);
            setEditingTask(newTask);
            onAddTask(newTask);
        } else {
            alert("Instead of adding more tasks, try do some of the tasks.")
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };
    
    const handleCancelTask = () => {
        if (cancelId) {
            const updatedTasks = scheduleList.filter((t) => t.id !== cancelId);
            onUpdateSchedule(updatedTasks);
            setCancelId(null);
        }
        setEditingTask(null);
    };
    
    const handleSaveTask = () => {
        if (editingTask && editingTask.title && editingTask.time) {
            const updatedTasks = scheduleList.map((task) =>
                task.id === editingTask.id ? editingTask : task
            );
            onUpdateSchedule(updatedTasks);

            setEditingTask(null);
            setCancelId(null);
        }
    };

    const handleDeleteTask = (task) => {
        const updatedTasks = scheduleList.filter((t) => t.id !== task.id);
        onUpdateSchedule(updatedTasks);
        setEditingTask(null);
    };
    
    const handleContentChange = (event, field) => {
        const { value } = event.target;

        setEditingTask((prevTask) => ({
            ...prevTask,
            [field]: value,
        }));
    };

    const handleInputChange = (e, inputType) => {
        let value = parseInt(e.target.value, 10);
        value = isNaN(value) ? 0 : Math.min(Math.max(value, 0), 60);

        const time = editingTask?.time || '00:00';
        const [minutes, seconds] = time.split(':');

        let updatedMinutes = parseInt(minutes, 10);
        let updatedSeconds = parseInt(seconds, 10);
      
        if (inputType === 'minutes') {
          updatedMinutes = value;
        } else if (inputType === 'seconds') {
          updatedSeconds = value;
        }

        if (updatedMinutes === 60 && updatedSeconds > 0) {
            // Adjust the seconds value to 0 if minutes reach 60
            updatedSeconds = 0;
        }
        
        const updatedTime = `${String(updatedMinutes).padStart(2, '0')}:${String(updatedSeconds).padStart(2, '0')}`;
        
        setEditingTask((prevTask) => ({
            ...prevTask,
            time: updatedTime,
        }));
    };

    const handleDragStart = (e, index) => {
        handleCancelTask();
        e.dataTransfer.setData('text/plain', index);
        setDraggedOverIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (index !== draggedOverIndex) {
          setDraggedOverIndex(index);
        }
    };
    
    const handleDrop = (e, destinationIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (sourceIndex !== destinationIndex) {
            const updatedTasks = [...scheduleList];
            const [reorderedItem] = updatedTasks.splice(sourceIndex, 1);
            updatedTasks.splice(destinationIndex, 0, reorderedItem);
            onUpdateSchedule(updatedTasks);
        }
    };

    return (
        <div>
            {scheduleList.map((task, index) => (
                <div key={task.id+"#"+index}>
                    { editingTask && (editingTask.id === task.id) ? (
                        <div className="edit-card">
                            <div className="edit-card-content">
                                <input className="entry-field"
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(event) => handleContentChange(event, 'title')}
                                    placeholder="What to do?"
                                    maxLength="30"
                                />
                                <div>
                                    <input
                                        className="time-field"
                                        type="text"
                                        pattern="[0-9]{2}"
                                        maxLength="2"
                                        value={parseInt(editingTask.time.split(':')[0], 10)}
                                        onChange={(e) => handleInputChange(e, 'minutes')}
                                    />
                                    <span style={{ fontWeight: "bold", fontSize: "25px", color: "grey", margin: "0px 5px" }}>:</span>
                                    <input
                                        className="time-field"
                                        type="text"
                                        pattern="[0-9]{2}"
                                        maxLength="2"
                                        value={parseInt(editingTask.time.split(':')[1], 10)}
                                        onChange={(e) => handleInputChange(e, 'seconds')}
                                    />
                                </div>
                                <div>
                                    <button className="arrow-button" onClick={() => handleInputChange({ target: { value: parseInt(editingTask.time.split(':')[0], 10) + 5 } }, 'minutes')}>
                                    ▲
                                    </button>
                                    <button className="arrow-button" onClick={() => handleInputChange({ target: { value: parseInt(editingTask.time.split(':')[0], 10) - 5 } }, 'minutes')}>
                                    ▼
                                    </button>
                                    <span>&nbsp;&nbsp;&nbsp;</span>
                                    <button className="arrow-button" onClick={() => handleInputChange({ target: { value: parseInt(editingTask.time.split(':')[1], 10) + 5 } }, 'seconds')}>
                                    ▲
                                    </button>
                                    <button className="arrow-button" onClick={() => handleInputChange({ target: { value: parseInt(editingTask.time.split(':')[1], 10) - 5 } }, 'seconds')}>
                                    ▼
                                    </button>
                                </div>
                                <textarea className="text-field"
                                    value={editingTask.note}
                                    onChange={(event) => handleContentChange(event, 'note')}
                                    placeholder="Add notes"
                                    maxLength="140"
                                />
                            </div>
                            <div className="edit-card-tool">
                                <button onClick={() => handleDeleteTask(editingTask)}
                                    style={{ visibility: cancelId ? "hidden" : "visible" }}>Delete</button>
                                <div>
                                    <button onClick={handleCancelTask}>Cancel</button>
                                    <button className="black-button" onClick={handleSaveTask}>Save</button>
                                </div>
                            </div>
                        </div>
                    ) 
                    : (
                        <div className={`info-card ${draggedOverIndex === index ? 'drag-to' : ''}`}
                            draggable={editingTask === null}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={() => setDraggedOverIndex(null)}
                        >
                            <div className="info-card-head">
                                <div className="info-card-title">{task.title}</div>
                                <div className="info-card-container">
                                    <MdPunchClock size="1.5em" /><div className="info-card-time">{task.time}</div>
                                </div>
                                <button className="edit-button" onClick={() => handleEditTask(task)}><MdEdit size="1.5em" /></button>
                            </div>
                            {task.note ? <div className="info-card-body">{task.note}</div> : null}
                        </div>
                    )}
                </div>
            ))}
            { !editingTask ? (
                <div className="dashed-container" onClick={handleAddTask}>
                    <MdAddBox size="2em"/>
                    <div className="t18">Add Task</div>
                </div>
            ) : null }
            
        </div>
    )
}