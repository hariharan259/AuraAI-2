export default function ProgressBar({ progress, colorClass = 'progress-primary' }) {
  return (
    <div className="progress-track">
      <div 
        className={`progress-fill ${colorClass}`} 
        style={{ width: `${progress}%` }} 
      />
    </div>
  )
}
