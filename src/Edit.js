import React from 'react'
import './Edit.css'
import { ImCross, ImCheckmark } from 'react-icons/im'
import { useState } from 'react'

export default function Edit({ index, content, onToggle, onUpdate }) {

    const [status, setStatus] = useState(content.status)

    const update = () => {
        content.description = document.getElementById('description').value
        content.time = document.getElementById('appt').value
        content.status = status
        onUpdate(index, content)
        onToggle()
    }
    const onStatus = () => {
        if (status) {
            setStatus(false)
        } else {
            setStatus(true)
        }
    }

    return (
        <div className="full-page">
            <div className="center-on-page" id="edit-panel">
                <button id="button-exit" onClick={() => onToggle()}><ImCross cursor="pointer" /></button>
                <p className="line">Status: {status ? 'Work' : 'Rest'}</p>
                <input type="checkbox" id="switch" onClick={onStatus} defaultChecked={content.status ? false : true}/><label htmlFor="switch">Toggle</label>
                <p className="line">Time: </p>
                <input type="text" maxLength="5" id="appt" name="appt"
                 required  defaultValue={content.time} />
                <p className="line">Description: </p>
                <textarea cols="25" rows="2" maxLength="23" id="description" defaultValue={content.description}></textarea>
                <button id="button-check" onClick={update}><ImCheckmark cursor="pointer" size="2em" /></button>
            </div>
        </div>
    )
}
