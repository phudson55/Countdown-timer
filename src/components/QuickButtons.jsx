import React from 'react'

// QuickButtons: set common preset timers
// Props:
// - onSet: function(seconds) to set the timer quickly
export default function QuickButtons({ onSet }) {
  return (
    <div className="quick">
      <button onClick={() => onSet(60)}>1 min</button>
      <button onClick={() => onSet(300)}>5 min</button>
      <button onClick={() => onSet(600)}>10 min</button>
    </div>
  )
}
