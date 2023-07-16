import Timer from './Timer';
import './TopPanel.css';
import { FaPlay, FaPause, FaRedo, FaStepForward, FaBell, FaMusic } from 'react-icons/fa';


export default function TopPanel({ remainingTime, totalTime, title, running, onStart, onStop, onReset, onForward,
                                   alarmPlaying, musicPlaying, onToggleAlarm, onToggleMusic }) {
    return (
        <div className="top-panel">
            <div className="left-section">
                <button className="icon-button" onClick={onToggleAlarm}><FaBell size="2em" />{!alarmPlaying && <span className="cross-icon">X</span>}</button>
                <button className="icon-button" onClick={onToggleMusic}><FaMusic size="2em" />{!musicPlaying && <span className="cross-icon">X</span>}</button>
            </div>
            {title ? <div className="middle-section">--- {title} ---</div> : <div className="middle-section">--- Fulfill Your Day ---</div>}
            <div className="right-section">
                { running ? <button className="icon-button" onClick={onStop}><FaPause size="2em" /></button>
                  : <button className="icon-button" onClick={onStart}><FaPlay size="2em" /></button>}
                
                <button className="icon-button" onClick={onReset}><FaRedo size="2em" /></button>
                <button className="icon-button" onClick={onForward}><FaStepForward size="2em" /></button>
                
                <Timer remainingTime={remainingTime} totalTime={totalTime} />
            </div>
        </div>
    )
}
