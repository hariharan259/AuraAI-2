import React from 'react';

interface ProgressBarProps {
  progress: number;
  colorClass?: string;
}

export default function ProgressBar({ progress, colorClass = 'bg-teal-500' }: ProgressBarProps) {
  // Map old CSS classes to Tailwind if needed
  let barColor = colorClass;
  if (colorClass === 'progress-primary') barColor = 'bg-purple-600';
  else if (colorClass === 'progress-gold') barColor = 'bg-yellow-500';
  else if (colorClass === 'progress-cyan') barColor = 'bg-cyan-500';
  else if (colorClass === 'progress-green') barColor = 'bg-emerald-500';

  return (
    <div className="w-full h-2 rounded-full bg-black/45 overflow-hidden border border-white/5">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
      />
    </div>
  );
}
