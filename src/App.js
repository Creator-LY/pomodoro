import React from 'react';
import Timer from './Timer';
import TopPanel from './TopPanel';
import SidePanel from './SidePanel';
import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring';
import './App.css';
import { FaAngleRight } from 'react-icons/fa'
import sound from './alarm.wav'


function App() {
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [running, setRunning]  = useState(false)
  const [showPanel, setshowPanel] = useState(false)
  const [schedulesList, setScheduleList] = useState([])
  const [enable, setEnable] = useState(true)
  const [history, setHistory] = useState([])
  const [animation, setAnimation] = useState(true)
  const [duration, setDuration] = useState(0)
  const [resetA, setResetA] = useState(false)

  const slideInAnimation = useSpring({
    transform: showPanel ? 'translateX(0)' : 'translateX(-100%)',
  });

  
  const formatTime = (timerSeconds) => {
    let hours = ("0" + Math.floor(timerSeconds / 3600)).slice(-2)
    let minutes = ("0" + Math.floor(timerSeconds % 3600 / 60)).slice(-2)
    let seconds = ("0" + Math.floor(timerSeconds % 3600 % 60)).slice(-2)

    return hours + ":" + minutes + ":" + seconds
  }

  const toSecond = (formatted) => {
    return parseInt(formatted.slice(0,2)) * 60 + parseInt(formatted.slice(3,5))
  }
  
  useEffect(() => {
    let interval;
    if (running && timerSeconds !== 0) {
      setEnable(true)
      interval = setInterval(() => {
        setTimerSeconds(timerSeconds => timerSeconds - 1)
      }, 1000)
    } else if (timerSeconds === 0 && schedulesList.length >= 1 && running && enable) {
      let arr = [...schedulesList]
      arr.shift()
      setScheduleList(arr)
      setEnable(false)
      setTimeout(() => { document.getElementById("audio").load() }, 2500)
      document.getElementById("audio").play()
      
    }  else if (timerSeconds === 0 && running && schedulesList.length === 0) {
      setRunning(false)
    }
    return () => {
      clearInterval(interval)
    }
  }, [running, timerSeconds, schedulesList, enable])

  useEffect(() => {
    try {
      setTimerSeconds(toSecond(schedulesList[0].time))
      setDuration(toSecond(schedulesList[0].time) * 1000)
    } catch {
      setTimerSeconds(0)
      setDuration(0)
    }
  }, [schedulesList])

  const startTime = () => {
    if (!running) {
      setRunning(!running)
      setAnimation(false)
    }
  }

  const stopTime = () => {
    if (running) {
      setRunning(!running)
      setAnimation(true)
    }
  }

  const toggleOverlay = () => {
    setshowPanel(!showPanel)
    setRunning(false)
  }

  const setPomo = () => {
    if (schedulesList.length < 4) {
      for (let i = 0; i < 3; i++) {
        const newTask = {
          time:"25:00", description:"", status:true
        }
        const newTask2 = {
          time:"10:00", description:"Take a break", status:false
        }
        setScheduleList(schedulesList.push(newTask, newTask2))
      }
      const newTask = {
        time:"45:00", description:"", status:true
      }
      const newTask2 = {
        time:"30:00", description:"Take a break", status:false
      }
      setScheduleList([...schedulesList, newTask, newTask2])
      setHistory([...schedulesList, newTask, newTask2])
    }
  }

  const addTask = (time) => {
    if (schedulesList.length < 11) {
      let newTask = {}
      if (time <= 10) {
        if (time === 5) {
          newTask = {
            time:"0" + (time).toString() + ":00", description:"Take a break", status:false
          }
        } else {
          newTask = {
            time:(time).toString() + ":00", description:"Take a break", status:false
          }
        }
      } else {
        newTask = {
          time:(time).toString() + ":00", description:"", status:true
        }
      }
      setScheduleList([...schedulesList, newTask])
      setHistory([...schedulesList, newTask])
    }
  }

  const moveUp = (index) => {
    let arr = [...schedulesList]
    if (index !== 0) {
      let temp = arr[index]
      arr[index] = arr[index-1]
      arr[index-1] = temp
      setScheduleList(arr)
    } else {
      let temp = arr[index]
      arr[index] = arr[schedulesList.length-1]
      arr[schedulesList.length-1] = temp
      setScheduleList(arr)
    }
    setHistory(arr)
  }
  const moveDown = (index) => {
    let arr = [...schedulesList]
    if (index !== schedulesList.length-1) {
      let temp = arr[index]
      arr[index] = arr[index+1]
      arr[index+1] = temp
      setScheduleList(arr)
    } else {
      let temp = arr[index]
      arr[index] = arr[0]
      arr[0] = temp
      setScheduleList(arr)
    }
    setHistory(arr)
  }
  const updateSchedule = (index, schedule) => {
    let arr = [...schedulesList]
    arr[index] = schedule
    setScheduleList(arr)
    setHistory(arr)
  }
  const reset = () => {
    if (duration === 0) {
      setDuration(Infinity)
    }
    setScheduleList(history)
    try {
      setTimerSeconds(toSecond(schedulesList[0].time))
    } catch {
      setTimerSeconds(0)
    }
    setRunning(false)
    setResetA(true)
    setAnimation(false)
    setTimeout(() => { setResetA(false); setAnimation(true) }, 0)
    
  }

  const forward = () => {
    if (schedulesList.length >= 1) {
      setRunning(false)
      let arr = [...schedulesList]
      arr.shift()
      setScheduleList(arr)
      setResetA(true)
      setAnimation(false)
      setTimeout(() => { setResetA(false); setAnimation(true) }, 0)
    }
  }

  return (
    <div>
      {/* Floating stars */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      
      <TopPanel onStop={stopTime} onOverlay={toggleOverlay} onReset={reset} onForward={forward} schedulesList={schedulesList} />

      <Timer className="center-on-page" time={formatTime(timerSeconds)} onStart={startTime} running={running} animation={animation} 
      duration={duration} reset={resetA} />

      <div className="side-button" onClick={toggleOverlay}>
        <FaAngleRight className="side-button-icon" size="3em" cursor="pointer" />
      </div>

      <animated.div style={{ ...slideInAnimation, height: '100vh' }}>
        <SidePanel onOverlay={toggleOverlay} schedulesList={schedulesList} onPomo={setPomo} addTask={addTask.bind(this)}
        moveUp={moveUp.bind(this)} moveDown={moveDown.bind(this)} updateSchedule={updateSchedule.bind(this)} />
      </animated.div>
      
      <audio id="audio" src={sound} hidden={true} type="audio/wav"></audio>
    </div>
  );
}

export default App;
