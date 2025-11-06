import React from 'react'

// TimerDisplay: purely presentational component that shows formatted time
// Props:
// - value: number of seconds remaining
// - format: function to format seconds into MM:SS (optional)
export default function TimerDisplay({ value, format }) {
  const text = typeof format === 'function' ? format(value) : String(value)
  return (
    <div className="display" aria-live="polite">
      {text}
    </div>
  )
}
