import Timer from './Timer';
import { useState } from 'react';
import './TopPanel.css';
import { FaPlay, FaPause, FaRedo, FaStepForward, FaBell, FaMusic } from 'react-icons/fa';


export default function TopPanel({ remainingTime, totalTime, running, onStart, onStop, onReset, onForward }) {
    const [isBellDisable, setBellDisable] = useState(false);
    const [isMusicDisable, setMusicDisable] = useState(false);

    const handleBellClick = () => {
        setBellDisable(!isBellDisable);
    };
    
      const handleMusicClick = () => {
        setMusicDisable(!isMusicDisable);
    };

    return (
        <div className="top-panel">
            <div className="left-section">
                <button className="icon-button" onClick={handleBellClick}><FaBell size="2em" />{isBellDisable && <span className="cross-icon">X</span>}</button>
                <button className="icon-button" onClick={handleMusicClick}><FaMusic size="2em" />{isMusicDisable && <span className="cross-icon">X</span>}</button>
            </div>
            <div className="middle-section">--- Working ---</div>
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
