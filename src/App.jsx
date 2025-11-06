import React, { useState, useRef, useEffect } from 'react'
import TimerDisplay from './components/TimerDisplay'
import Inputs from './components/Inputs'
import Controls from './components/Controls'
import QuickButtons from './components/QuickButtons'

// Helper: format seconds as MM:SS
function formatTime(seconds) {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mm}:${ss}`
}

// App: orchestrates state and behavior, composes presentational components.
// Responsibilities:
// - maintain inputs (minutes/seconds)
// - keep remaining seconds and running state
// - start/pause/reset behavior and tick interval
export default function App() {
  // --- Inputs (controlled as strings so the user can type freely) ---
  const [minutesInput, setMinutesInput] = useState('01')
  const [secondsInput, setSecondsInput] = useState('00')

  // --- Timer state ---
  // remaining: number of seconds left
  const [remaining, setRemaining] = useState(60)
  const [isRunning, setIsRunning] = useState(false)

  // useRef holds the interval id so we can clear from callbacks
  //
  // Why use a ref here?
  // - A ref stores a mutable value that persists across renders without
  //   triggering re-renders when it changes. That's perfect for the
  //   numeric id returned by `setInterval`.
  // - We keep the id in `intervalRef.current` so any effect or handler can
  //   call `clearInterval(intervalRef.current)` to stop the timer.
  // - Using a ref avoids stale-closure problems that can happen when
  //   interval callbacks capture outdated state.
  const intervalRef = useRef(null)

  // When the inputs change (and the timer is not running), update the
  // remaining seconds to match the inputs. This keeps the display in sync
  // with the form values when idle.
  useEffect(() => {
    if (!isRunning) {
      const m = parseInt(minutesInput || '0', 10)
      const s = parseInt(secondsInput || '0', 10)
      const total = Math.max(0, (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s))
      setRemaining(total)
    }
  }, [minutesInput, secondsInput, isRunning])

  // Interval effect: when isRunning is true, start a 1s interval that
  // decrements remaining. When reaching 0, stop the timer.
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            // reached zero or about to — stop and clear interval
            clearInterval(intervalRef.current)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    // cleanup if isRunning toggles or component unmounts
    return () => clearInterval(intervalRef.current)
  }, [isRunning])





  // --- Handlers ---
  // toggle running state
  function handleStartPause() {
    setIsRunning(r => !r)
  }

  // reset to values currently in inputs, and stop the timer
  function handleReset() {
    setIsRunning(false)
    const m = parseInt(minutesInput || '0', 10)
    const s = parseInt(secondsInput || '0', 10)
    const total = Math.max(0, (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s))
    setRemaining(total)
    clearInterval(intervalRef.current)
  }

  // quick set presets (stop timer and load preset seconds into inputs + remaining)
  function handleQuickSet(seconds) {
    setIsRunning(false)
    setRemaining(seconds)
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    setMinutesInput(String(m).padStart(2, '0'))
    setSecondsInput(String(s).padStart(2, '0'))
  }

  // --- Render: compose small components for clarity ---
  return (
    <div className="container">
      <h1>Countdown Timer</h1>

      {/* Display: large MM:SS readout */}
      <TimerDisplay value={remaining} format={formatTime} />

      <div className="controls">
        {/* Inputs: minutes / seconds */}
        <Inputs
          minutes={minutesInput}
          seconds={secondsInput}
          setMinutes={setMinutesInput}
          setSeconds={setSecondsInput}
          disabled={isRunning}
        />

        {/* Buttons: Start/Pause & Reset */}
        <Controls isRunning={isRunning} onStartPause={handleStartPause} onReset={handleReset} />

        {/* Quick preset buttons */}
        <QuickButtons onSet={handleQuickSet} />
      </div>

      <p className="note">Tip: edit minutes/seconds then press Start.</p>
    </div>
  )
}
