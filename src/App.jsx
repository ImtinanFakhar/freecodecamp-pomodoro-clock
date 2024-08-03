import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Update timeLeft whenever sessionLength changes
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            const audio = document.getElementById('beep');
            audio.play();
            clearInterval(id);
            setIsRunning(false);
            if (isSession) {
              setTimeLeft(breakLength * 60);
              setIsSession(false);
              document.getElementById('timer-label').innerText = 'Break';
            } else {
              setTimeLeft(sessionLength * 60);
              setIsSession(true);
              document.getElementById('timer-label').innerText = 'Session';
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, breakLength, sessionLength, isSession]);

  const handleReset = () => {
    // Stop the timer and reset all values
    setIsRunning(false);
    clearInterval(intervalId);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    document.getElementById('timer-label').innerText = 'Session';
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  };

  const handleSessionChange = (increment) => {
    setSessionLength(prev => {
      const newLength = Math.min(Math.max(prev + increment, 1), 60);
      if (isSession) setTimeLeft(newLength * 60);
      return newLength;
    });
  };

  const handleBreakChange = (increment) => {
    setBreakLength(prev => Math.min(Math.max(prev + increment, 1), 60));
  };

  const handleStartStop = () => {
    if (isRunning) {
      // If running, pause the timer
      setIsRunning(false);
    } else {
      // If not running, start the timer
      setIsRunning(true);
    }
  };

  return (
    <div id="clock">
      <div id="break-label">Break Length</div>
      <div id="break-length">{breakLength}</div>
      <button id="break-decrement" onClick={() => handleBreakChange(-1)}>-</button>
      <button id="break-increment" onClick={() => handleBreakChange(1)}>+</button>

      <div id="session-label">Session Length</div>
      <div id="session-length">{sessionLength}</div>
      <button id="session-decrement" onClick={() => handleSessionChange(-1)}>-</button>
      <button id="session-increment" onClick={() => handleSessionChange(1)}>+</button>

      <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
      <div id="time-left">
        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </div>

      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={handleReset}>Reset</button>

      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" />
    </div>
  );
}

export default App;
