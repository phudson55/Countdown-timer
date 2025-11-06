import React from 'react'

// Inputs: minutes and seconds inputs
// Props:
// - minutes: string value for minutes input
// - seconds: string value for seconds input
// - setMinutes: setter for minutes
// - setSeconds: setter for seconds
// - disabled: boolean to disable while timer is running
export default function Inputs({ minutes, seconds, setMinutes, setSeconds, disabled }) {
  return (
    <div className="inputs">
      <label>
        Minutes
        <input
          type="number"
          min="0"
          value={minutes}
          onChange={e => setMinutes(e.target.value)}
          disabled={disabled}
        />
      </label>

      <label>
        Seconds
        <input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={e => setSeconds(e.target.value)}
          disabled={disabled}
        />
      </label>
    </div>
  )
}
