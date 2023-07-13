import React from 'react';
import TopPanel from './TopPanel';
import SidePanel from './SidePanel';
import Model from './Model';
import { useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from 'react-spring';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import { FaAngleRight } from 'react-icons/fa';
import sound from './assets/alarm.wav';
import './App.css';


function App() {
  const [showPanel, setshowPanel] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const [history, setHistory] = useState([]);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [running, setRunning]  = useState(false);


  // Slide in animation for Side Panel
  const slideInAnimation = useSpring({
    from: { transform: 'translateX(-100%)' },
    to: { transform: showPanel ? 'translateX(0%)' : 'translateX(-100%)' },
  });

  // Set format "00:00" to seconds
  const toSecond = (formatted) => {
    return parseInt(formatted.slice(0,2)) * 60 + parseInt(formatted.slice(3,5))
  };
  
  // Timer logic and alarm
  useEffect(() => {
    let interval;
    if (running && timerSeconds !== 0) {
      interval = setInterval(() => {
        setTimerSeconds(timerSeconds => timerSeconds - 1);
      }, 1000)
    } else if (timerSeconds === 0 && scheduleList.length >= 1 && running) {
      let arr = [...scheduleList];
      arr.shift();
      setScheduleList(arr);
      setTimeout(() => { document.getElementById("audio").load() }, 2500);
      document.getElementById("audio").play();
      
    }  else if (timerSeconds === 0 && running && scheduleList.length === 0) {
      setRunning(false);
    }
    return () => {
      clearInterval(interval);
    }
  }, [running, timerSeconds, scheduleList]);


  useEffect(() => {
    try {
      setTimerSeconds(toSecond(scheduleList[0].time));
      setTotalTime(toSecond(scheduleList[0].time)); // fixed
    } catch {
      setTimerSeconds(0);
      setTotalTime(0);
    }
  }, [scheduleList]);

  const startTime = () => {
    setRunning(true);
  };

  const stopTime = () => {
    setRunning(false);
  };

  const toggleOverlay = () => {
    setshowPanel(!showPanel);
    setRunning(false);
  };

  const addTask = (task) => {
    setScheduleList([...scheduleList, task]);
    setHistory([...scheduleList, task]);
  };

  const addWorkTask = () => {
    const work = {
      id: uuidv4(),
      title: "Work",
      time: "30:00",
      note: ""
    };
    setScheduleList([...scheduleList, work]);
  }

  const duplicateFirst = () => {
    if (scheduleList.length > 0) {
      const firstTask = scheduleList[0];
      const duplicatedTask = { ...firstTask, id: uuidv4() };
      setScheduleList([...scheduleList, duplicatedTask]);
    }
  }

  const duplicateLast = () => {
    if (scheduleList.length > 0) {
      const lastTask = scheduleList[scheduleList.length - 1];
      const duplicatedTask = { ...lastTask, id: uuidv4() };
      setScheduleList([...scheduleList, duplicatedTask]);
    }
  }

  const addRestTask = () => {
    const rest = {
      id: uuidv4(),
      title: "Rest",
      time: "10:00",
      note: ""
    };
    setScheduleList([...scheduleList, rest]);
  }

  const updateSchedule = (schedule) => {
    setScheduleList(schedule);
    setHistory(schedule);
  };

  const clearSchedule = () => {
    setScheduleList([]);
  }

  const reset = () => {
    setRunning(false);
    setScheduleList(history);
    try {
      setTimerSeconds(toSecond(scheduleList[0].time));
    } catch {
      setTimerSeconds(0);
    } 
  };

  const forward = () => {
    if (scheduleList.length >= 1) {
      setRunning(false);
      let arr = [...scheduleList];
      arr.shift();
      setScheduleList(arr);
    }
  };

  return (
    <div>
      {/* Floating stars */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      
      <TopPanel remainingTime={timerSeconds} totalTime={totalTime} title={scheduleList.length > 0 ? scheduleList[0].title : null} running={running} 
        onStart={startTime} onStop={stopTime} onReset={reset} onForward={forward} />

      <div className="center-model">
        <Canvas camera={{ position: [-9.331, 4.615, 9.464], rotation: [-0.233, -0.771, -0.164], zoom: "2" }}>
          <Suspense fallback={null}>
            <Model running={running} />
            <OrbitControls 
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI/4}
              maxPolarAngle={3 * Math.PI/5}
            />
            <Environment preset="warehouse" />
          </Suspense>
        </Canvas>
      </div>

      <div className="side-button" onClick={toggleOverlay}>
        <FaAngleRight className="side-button-icon" size="3em" />
      </div>

      <animated.div style={{ ...slideInAnimation, height: '100vh' }}>
        <SidePanel onOverlay={toggleOverlay} scheduleList={scheduleList} onAddTask={addTask.bind(this)} onAddWork={addWorkTask}
          onAddRest={addRestTask} onDuplicateFirst={duplicateFirst} onDuplicateLast={duplicateLast}
          onUpdateSchedule={updateSchedule.bind(this)} onClearSchedule={clearSchedule} />
      </animated.div>

      
      <audio id="audio" src={sound} hidden={true} type="audio/wav"></audio>
    </div>
  );
}

export default App;
