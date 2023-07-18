import React from 'react';
import Timer from './Timer';
import SidePanel from './SidePanel';
import Model from './Model';
import TimeLine from './TimeLine';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSpring, animated } from 'react-spring';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import { FaPlay, FaPause, FaRedo, FaStepForward, FaBell, FaMusic, FaAngleRight } from 'react-icons/fa';
import beeping from './assets/alarm.wav';
import crowing from './assets/mixkit-short-rooster-crowing-2470.wav';
import music1 from './assets/eco-technology-145636.mp3';
import music2 from './assets/just-relax-11157.mp3';
import music3 from './assets/lofi-study-112191.mp3';
import music4 from './assets/motivational-day-112790.mp3';
import music5 from './assets/please-calm-my-mind-125566.mp3';
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

  const musicRef = useRef(null);
  const [playList, setPlayList] = useState([
    { id: uuidv4(), title: 'Eco Technology', src: music1, enable: true },
    { id: uuidv4(), title: 'Just Relax', src: music2, enable: true },
    { id: uuidv4(), title: 'Lofi Study', src: music3, enable: true },
    { id: uuidv4(), title: 'Motivational Day', src: music4, enable: true },
    { id: uuidv4(), title: 'Please Calm My Mind', src: music5, enable: true },
  ]);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8); // Initial volume set to 80%


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
        musicRef.current.pause()
        alarmRef.current.play();
        togglePlayback();
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

  const toggleStartTime = () => {
    if (scheduleList.length > 0)
      setRunning(!running);
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

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  }

  const togglePlayback = () => {
    const audioElement = musicRef.current;
    if (musicPlaying && running) {
      try {
        audioElement.play();
      } catch (error) {
        console.error("music playback failed:", error);
      }
    } else {
      audioElement.pause();
    }
  };

  const playNextMusic = () => {
    let nextIndex = (currentMusicIndex + 1) % playList.length;
    while (nextIndex !== currentMusicIndex) {
      if (playList[nextIndex].enable) {
        setCurrentMusicIndex(nextIndex);
        return;
      }
      nextIndex = (nextIndex + 1) % playList.length;
    }
    // repeat current music
    togglePlayback();
  };

  useEffect(() => {
    const audioElement = musicRef.current;
    audioElement.load();
    audioElement.addEventListener("ended", playNextMusic);

    return () => {
      audioElement.removeEventListener("ended", playNextMusic);
    };
    // eslint-disable-next-line
  }, [currentMusicIndex, playList, running]);

  useEffect(() => {
    togglePlayback();
    // eslint-disable-next-line
  }, [musicPlaying, running, currentMusicIndex]);

  useEffect(() => {
    alarmRef.current.volume = volume;
    musicRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    // Find the index of the first music item with `enable` set to true
    const firstEnabledIndex = playList.findIndex((item) => item.enable);

    if (firstEnabledIndex !== -1) {
      setMusicPlaying(true);
      // If at least one music item is enabled, set currentMusicIndex to the first enabled item
      setCurrentMusicIndex(firstEnabledIndex);
    } else {
      setMusicPlaying(false);
      setCurrentMusicIndex(0);
    }
  }, [playList]);

  const schedule = {
    scheduleList: scheduleList,
    onAddTask: addTask.bind(this),
    onAddWork: addWorkTask,
    onAddRest: addRestTask,
    onDuplicateFirst: duplicateFirst,
    onDuplicateLast: duplicateLast,
    onUpdateSchedule: updateSchedule.bind(this),
    onClearSchedule: clearSchedule
  };

  return (
    <div>
      {/* Floating stars */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <div className="top-panel">
        <div className="left-section">
          <button className="icon-button" onClick={toggleAlarm}><FaBell size="2em" />{!alarmPlaying && <span className="cross-icon">X</span>}</button>
          <button className="icon-button" onClick={toggleMusic}><FaMusic size="2em" />{!musicPlaying && <span className="cross-icon">X</span>}</button>
        </div>
        <div className="middle-section">--- {scheduleList[0] ? scheduleList[0].title : "Fulfill Your Day"} ---</div>
        <div className="right-section">
            <button className="icon-button" onClick={toggleStartTime}>{running ? <FaPause size="2em" />:<FaPlay size="2em" />}</button>
            <button className="icon-button" onClick={reset}><FaRedo size="2em" /></button>
            <button className="icon-button" onClick={forward}><FaStepForward size="2em" /></button>
            
            <Timer remainingTime={timerSeconds} totalTime={totalTime} />
        </div>
      </div>

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
        <SidePanel onOverlay={toggleOverlay} schedule={schedule} history={history}
          onSwapAlarm={swapAlarm.bind(this)}
          playList={playList} setPlayList={setPlayList.bind(this)}
          volume={volume} setVolume={setVolume.bind(this)} />
      </animated.div>

      <audio ref={alarmRef} src={alarm} hidden={true} type="audio/wav"></audio>
      <audio ref={musicRef} src={playList[currentMusicIndex].src} hidden={true} type="audio/mpeg"></audio>
    </div>
  );
}

export default App;
