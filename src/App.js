import { useState, useEffect, useRef } from 'react';
import './App.css';
import { clear } from '@testing-library/user-event/dist/clear';


// clock lifecylce is 25 minutes work, 5 minutes break
// when timer reaches 00:00, switch to break
// when break reaches 00:00, switch to work
// when timer reaches 00:00, play sound
// when break reaches 00:00, play sound
function PomodoroClock() {
  const [breakLength, setBreakLength] = useState(5);
  const [workLength, setWorkLength] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState("00");
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);


  function handleStartPause() {
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

  // handling timer with useEffect and useRef
  // from my understanding, useRef is used to store a value that will not change
  // and will not cause a re-render
  // in this case, we are storing the intervalId, minutes, and seconds
  // we are using useEffect to update the timer every second
  // we are using useRef to store the values of the timer

  const intervalRef = useRef(intervalId);
  const minutesRef = useRef(minutes);
  const secondsRef = useRef(seconds);

  // this use effect is for the timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (secondsRef.current === "00") {
        if (minutesRef.current === 0) {
          clearInterval(intervalRef.current);
          return;
        }
        minutesRef.current--;
        secondsRef.current = 59;
      } else {
        secondsRef.current--;
      }
      setMinutes(minutesRef.current);
      setSeconds(secondsRef.current);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);









  function breakPlus() {
    if (breakLength >= 60) { return }
    setBreakLength(breakLength + 1);
  }
  function breakMinus() {
    if (breakLength <= 1) { return }
    setBreakLength(breakLength - 1);
  }

  function workPlus() {
    if (workLength >= 60) { return }
    setWorkLength(workLength + 1);
  }

  function workMinus() {
    if (workLength <= 1) { return }
    setWorkLength(workLength - 1);
  }

  function resetButton() {
    setBreakLength(5);
    setWorkLength(25);
    setMinutes(25);
    setSeconds("00");
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
