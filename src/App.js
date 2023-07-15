import React from 'react';
import TopPanel from './TopPanel';
import SidePanel from './SidePanel';
import Model from './Model';
import TimeLine from './TimeLine';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSpring, animated } from 'react-spring';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import { FaAngleRight } from 'react-icons/fa';
import beeping from './assets/alarm.wav';
import crowing from './assets/mixkit-short-rooster-crowing-2470.wav';
import './App.css';


function App() {
  const [showPanel, setshowPanel] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const [history, setHistory] = useState([]);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [running, setRunning]  = useState(false);

  const alarmRef = useRef(null);
  const [alarm, setAlarm] = useState(beeping);
  const [alarmPlaying, setAlarmPlaying] = useState(true);


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
      if (scheduleList.length === 1) setRunning(false);
      const [completedTask, ...remainingTasks] = scheduleList;
      setHistory([...history, completedTask]);
      setScheduleList(remainingTasks);

      // Play alarm if set
      if (alarmPlaying) {
        const audioElement = alarmRef.current;
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.play();
      }
    }

    return () => {
      clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [running, timerSeconds]);


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
    if (scheduleList.length < 7) {
      setScheduleList([...scheduleList, task]);
    } else {
      alert("Instead of adding more tasks, try do some of the tasks.")
    }
  };

  const addWorkTask = () => {
    if (scheduleList.length < 7) {
      const work = {
        id: uuidv4(),
        title: "Work",
        time: "30:00",
        note: ""
      };
      setScheduleList([...scheduleList, work]);
    } else {
      alert("Instead of adding more tasks, try do some of the tasks.")
    }
  }

  const addRestTask = () => {
    if (scheduleList.length < 7) {
      const rest = {
        id: uuidv4(),
        title: "Rest",
        time: "10:00",
        note: ""
      };
      setScheduleList([...scheduleList, rest]);
    } else {
      alert("Instead of adding more tasks, try do some of the tasks.")
    }
  }

  const duplicateFirst = () => {
    if (scheduleList.length < 7) {
      if (scheduleList.length > 0) {
        const firstTask = scheduleList[0];
        const duplicatedTask = { ...firstTask, id: uuidv4() };
        setScheduleList([...scheduleList, duplicatedTask]);
      }
    } else {
      alert("Instead of adding more tasks, try do some of the tasks.")
    }
  }

  const duplicateLast = () => {
    if (scheduleList.length < 7) {
      if (scheduleList.length > 0) {
        const lastTask = scheduleList[scheduleList.length - 1];
        const duplicatedTask = { ...lastTask, id: uuidv4() };
        setScheduleList([...scheduleList, duplicatedTask]);
      }
    } else {
      alert("Instead of adding more tasks, try do some of the tasks.")
    }
  }

  const updateSchedule = (schedule) => {
    setScheduleList(schedule);
  };

  const clearSchedule = () => {
    setScheduleList([]);
  }

  const reset = () => {
    setRunning(false);
    setScheduleList([...history, ...scheduleList]);
    setHistory([]);
    try {
      setTimerSeconds(toSecond(scheduleList[0].time));
    } catch {
      setTimerSeconds(0);
    } 
  };

  const forward = () => {
    if (scheduleList.length >= 1) {
      setRunning(false);
      const [forwarded, ...remainingTasks] = scheduleList;
      setHistory([...history, forwarded]);
      setScheduleList(remainingTasks);
    }
  };

  const toggleAlarm = () => {
    setAlarmPlaying(!alarmPlaying);
  }

  const swapAlarm = async (type) => {
    const audioElement = alarmRef.current;
    audioElement.pause();

    switch (type) {
      case 'beeping':
        setAlarm(beeping);
        break;
      case 'crowing':
        setAlarm(crowing);
        break;
      default:
        setAlarm(beeping);
        break;
    }
    // Play this alarm type
    audioElement.load();
    await new Promise((resolve) => {
      audioElement.onloadeddata = resolve;
    });
    audioElement.play();
  };

  return (
    <div>
      {/* Floating stars */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      
      <TopPanel remainingTime={timerSeconds} totalTime={totalTime} title={scheduleList.length > 0 ? scheduleList[0].title : null} running={running} 
        onStart={startTime} onStop={stopTime} onReset={reset} onForward={forward} onToggleAlarm={toggleAlarm} />

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

      <div className="right-panel">
        <TimeLine scheduleList={scheduleList} />
      </div>

      <animated.div style={{ ...slideInAnimation, height: '100vh' }}>
        <SidePanel onOverlay={toggleOverlay} scheduleList={scheduleList} onAddTask={addTask.bind(this)} onAddWork={addWorkTask}
          onAddRest={addRestTask} onDuplicateFirst={duplicateFirst} onDuplicateLast={duplicateLast}
          onUpdateSchedule={updateSchedule.bind(this)} onClearSchedule={clearSchedule} history={history} onSwapAlarm={swapAlarm.bind(this)}/>
      </animated.div>

      <audio ref={alarmRef} src={alarm} hidden={true} type="audio/wav"></audio>
    </div>
  );
}

export default App;
