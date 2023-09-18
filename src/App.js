import { useState, useEffect, useRef } from 'react';
import './App.css';



// clock lifecylce is 25 minutes work, 5 minutes break
// when timer reaches 00:00, switch to break
// when break reaches 00:00, switch to work
// when timer reaches 00:00, play sound
// when break reaches 00:00, play sound
// you can custom the break and work length
function PomodoroClock() {
  const [breakLength, setBreakLength] = useState(5);
  const [workLength, setWorkLength] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState("00");
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [mode, setMode] = useState("work");// work or break;

  // call once when component is mounted
  let intervalRef = useRef(intervalId);
  let minutesRef = useRef();
  let secondsRef = useRef(parseInt());
  const switchmodeRef = useRef();
  function updateref() {
    minutesRef.current = minutes;
    secondsRef.current = parseInt(seconds);
    switchmodeRef.current = switchmode;
  }


  function handleStartPause() {
    updateref();
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }
  
  function startTimer() {
    setIsRunning(true);
  }
  function pauseTimer() {
    setIsRunning(false);
  }


  function switchmode() {
    if (mode === "work") {
      setMinutes(breakLength);
      setSeconds("00");
      console.log("switching to break");
      setIsRunning(false);
      setMode("break");
    } else {
      setMinutes(workLength);
      setSeconds("00");
      updateref();
      console.log("switching to work");
      setIsRunning(false);
      setMode("work");
    }
  }

  // this use effect is for the timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (isRunning === false) {
        return;
      }
      if (secondsRef.current === 0) {
        if (minutesRef.current === 0) {
          clearInterval(intervalRef.current);
          switchmodeRef.current();
          return;
        }
        minutesRef.current--;
        secondsRef.current = 59;
      } else {
        secondsRef.current--;
      }
      console.log("minutesRef.current = " + minutesRef.current + " secondsRef.current = " + secondsRef.current)
      setMinutes(minutesRef.current);
      setSeconds(secondsRef.current < 10 ? `0${secondsRef.current}` : secondsRef.current);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);




  function resetButton() {
    pauseTimer();
    setBreakLength(5);
    setWorkLength(25);
    setMinutes(25);
    setSeconds("00");
  }

  function breakPlus() {
    if (isRunning) { return }
    if (breakLength >= 60) { return }
    setBreakLength(breakLength + 1);
    if (mode === "break") { setMinutes(breakLength - 1); }
    updateref();
  }

  function breakMinus() {
    if (isRunning) { return }
    if (breakLength <= 1) { return }
    setBreakLength(breakLength - 1);
    if (mode === "break") { setMinutes(breakLength - 1); }
    updateref();
  }

  function workPlus() {
    if (isRunning) { return }
    if (workLength >= 60) { return }
    setWorkLength(workLength + 1);
    if (mode === "work") { setMinutes(workLength - 1); }
    updateref();
  }

  function workMinus() {
    if (isRunning) { return }
    if (workLength <= 1) { return }
    setWorkLength(workLength - 1);
    if (mode === "work") {
      setMinutes(workLength - 1);
    }
    updateref();
  }


  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div className="grid">

        <div id="break-label">Break Length</div>
        <div id="session-label">Session Length</div>
        <div className="flexbox border">
          <button id="break-decrement" onClick={breakMinus}>Break -</button>
          <div id="break-length">{breakLength}</div>
          <button id="break-increment" onClick={breakPlus}>Break +</button>
        </div>

        <div className="flexbox border">
          <button id="session-decrement" onClick={workMinus}>Session -</button>
          <div id="session-length">{workLength}</div>
          <button id="session-increment" onClick={workPlus}>Session +</button>
        </div>
      </div>


      <div id="timer-label">Session</div>
      <div id="time-left">{minutes}:{seconds}</div>
      <button onClick={handleStartPause}
        id="start_stop">Start/Stop</button>
      <button onClick={resetButton}
        id="reset">Reset</button>
      <div>isRunning? = {isRunning ? "yes" : "no"}</div>
    </div>
  );
}

export default PomodoroClock;
