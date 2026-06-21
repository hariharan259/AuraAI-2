import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 120, strokeWidth = 8, label = 'Score' }: ScoreRingProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const color = 
    score >= 80 ? '#10b981' : // emerald-500
    score >= 65 ? '#06b6d4' : // cyan-500
    score >= 50 ? '#eab308' : // amber-500
    '#f97316';                // orange-500

  useEffect(() => {
    const progressOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset === 0 ? circumference : offset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 1.5s ease-in-out', 
            filter: `drop-shadow(0 0 6px ${color}80)` 
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span 
          style={{ fontSize: `${size * 0.26}px`, color }} 
          className="font-extrabold leading-none tracking-tight"
        >
          {score}
        </span>
        {label && (
          <span 
            style={{ fontSize: `${size * 0.08}px` }} 
            className="font-bold text-aura-muted uppercase tracking-widest mt-1 px-1 truncate max-w-full"
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
