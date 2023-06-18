import React from 'react';
import TopPanel from './TopPanel';
import SidePanel from './SidePanel';
import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring';
import './App.css';
import { FaAngleRight } from 'react-icons/fa'
import sound from './alarm.wav'


function App() {
  const [showPanel, setshowPanel] = useState(false)
  const [schedulesList, setScheduleList] = useState([])
  const [history, setHistory] = useState([])

  const [timerSeconds, setTimerSeconds] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [running, setRunning]  = useState(false)

  // Slide in animation for Side Panel
  const slideInAnimation = useSpring({
    transform: showPanel ? 'translateX(0)' : 'translateX(-100%)',
  });

  // Set format "00:00" to seconds
  const toSecond = (formatted) => {
    return parseInt(formatted.slice(0,2)) * 60 + parseInt(formatted.slice(3,5))
  }
  
  // Timer logic and alarm
  useEffect(() => {
    let interval;
    if (running && timerSeconds !== 0) {
      interval = setInterval(() => {
        setTimerSeconds(timerSeconds => timerSeconds - 1)
      }, 1000)
    } else if (timerSeconds === 0 && schedulesList.length >= 1 && running) {
      let arr = [...schedulesList]
      arr.shift()
      setScheduleList(arr)
      setTimeout(() => { document.getElementById("audio").load() }, 2500)
      document.getElementById("audio").play()
      
    }  else if (timerSeconds === 0 && running && schedulesList.length === 0) {
      setRunning(false)
    }
    return () => {
      clearInterval(interval)
    }
  }, [running, timerSeconds, schedulesList])


  useEffect(() => {
    try {
      setTimerSeconds(toSecond(schedulesList[0].time))
      setTotalTime(toSecond(schedulesList[0].time)) // fixed
    } catch {
      setTimerSeconds(0)
      setTotalTime(0)
    }
  }, [schedulesList])

  const startTime = () => {
    setRunning(true)
  }

  const stopTime = () => {
    setRunning(false)
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
    setRunning(false)
    setScheduleList(history)
    try {
      setTimerSeconds(toSecond(schedulesList[0].time))
    } catch {
      setTimerSeconds(0)
    } 
  }

  const forward = () => {
    if (schedulesList.length >= 1) {
      setRunning(false)
      let arr = [...schedulesList]
      arr.shift()
      setScheduleList(arr)
    }
  }

  return (
    <div>
      {/* Floating stars */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      
      <TopPanel remainingTime={timerSeconds} totalTime={totalTime} running={running} 
        onStart={startTime} onStop={stopTime} onReset={reset} onForward={forward} />

      <div className="side-button" onClick={toggleOverlay}>
        <FaAngleRight className="side-button-icon" size="3em" />
      </div>

      { showPanel ? <animated.div style={{ ...slideInAnimation, height: '100vh' }}>
        <SidePanel onOverlay={toggleOverlay} schedulesList={schedulesList} onPomo={setPomo} addTask={addTask.bind(this)}
        moveUp={moveUp.bind(this)} moveDown={moveDown.bind(this)} updateSchedule={updateSchedule.bind(this)} />
      </animated.div> : null }
      
      <audio id="audio" src={sound} hidden={true} type="audio/wav"></audio>
    </div>
  );
}

export default App;
