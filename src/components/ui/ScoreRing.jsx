import { useEffect, useState } from 'react'

export default function ScoreRing({ score, size = 120, strokeWidth = 8, label = 'Score' }) {
  const [offset, setOffset] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  
  const color = 
    score >= 80 ? 'var(--aura-green)' :
    score >= 65 ? 'var(--aura-cyan)' :
    score >= 50 ? 'var(--aura-gold)' : 'var(--aura-orange)'

  useEffect(() => {
    const progressOffset = circumference - (score / 100) * circumference
    setTimeout(() => setOffset(progressOffset), 100)
  }, [score, circumference])

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--glass-bg-strong)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset === 0 ? circumference : offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out', filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: `${size * 0.28}px`, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        {label && <span style={{ fontSize: `${size * 0.09}px`, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</span>}
      </div>
    </div>
  )
}
