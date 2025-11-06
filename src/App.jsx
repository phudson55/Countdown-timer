import React, { useState, useRef, useEffect } from 'react'

function formatTime(seconds) {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mm}:${ss}`
}

export default function App() {
  const [minutesInput, setMinutesInput] = useState('01')
  const [secondsInput, setSecondsInput] = useState('00')
  const [remaining, setRemaining] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  // update remaining when inputs change (but only when not running)
  useEffect(() => {
    if (!isRunning) {
      const m = parseInt(minutesInput || '0', 10)
      const s = parseInt(secondsInput || '0', 10)
      const total = Math.max(0, (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s))
      setRemaining(total)
    }
  }, [minutesInput, secondsInput, isRunning])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  function handleStartPause() {
    setIsRunning(r => !r)
  }

  function handleReset() {
    setIsRunning(false)
    const m = parseInt(minutesInput || '0', 10)
    const s = parseInt(secondsInput || '0', 10)
    const total = Math.max(0, (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s))
    setRemaining(total)
    clearInterval(intervalRef.current)
  }

  function handleQuickSet(seconds) {
    setIsRunning(false)
    setRemaining(seconds)
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    setMinutesInput(String(m).padStart(2, '0'))
    setSecondsInput(String(s).padStart(2, '0'))
  }

  return (
    <div className="container">
      <h1>Countdown Timer</h1>

      <div className="display">{formatTime(remaining)}</div>

      <div className="controls">
        <div className="inputs">
          <label>
            Minutes
            <input
              type="number"
              min="0"
              value={minutesInput}
              onChange={e => setMinutesInput(e.target.value)}
              disabled={isRunning}
            />
          </label>
          <label>
            Seconds
            <input
              type="number"
              min="0"
              max="59"
              value={secondsInput}
              onChange={e => setSecondsInput(e.target.value)}
              disabled={isRunning}
            />
          </label>
        </div>

        <div className="buttons">
          <button onClick={handleStartPause} className="primary">
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>

        <div className="quick">
          <button onClick={() => handleQuickSet(60)}>1 min</button>
          <button onClick={() => handleQuickSet(300)}>5 min</button>
          <button onClick={() => handleQuickSet(600)}>10 min</button>
        </div>
      </div>

      <p className="note">Tip: edit minutes/seconds then press Start.</p>
    </div>
  )
}
