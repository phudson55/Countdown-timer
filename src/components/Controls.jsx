import React from 'react'

// Controls: Start/Pause and Reset buttons
// Props:
// - isRunning: boolean
// - onStartPause: handler for start/pause
// - onReset: handler for reset
export default function Controls({ isRunning, onStartPause, onReset }) {
  return (
    <div className="buttons">
      <button onClick={onStartPause} className="primary">
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}
