import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';

interface RestTimerProps {
  restSeconds: number;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
}

export function RestTimer({ restSeconds, onSkip, onAddTime }: RestTimerProps) {
  const { seconds, start, addTime } = useTimer({
    mode: 'countdown',
    initialSeconds: restSeconds,
    onComplete: onSkip,
  });

  useEffect(() => {
    start();
  }, [start]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = restSeconds > 0 ? seconds / restSeconds : 0;
  const dashOffset = circumference * (1 - progress);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAddTime = () => {
    addTime(15);
    onAddTime(15);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
      <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-8">
        Rest
      </p>

      {/* Circular progress */}
      <div className="relative w-56 h-56 mb-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        {/* Center time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-white tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddTime}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-white/80 bg-white/10 hover:bg-white/20 active:scale-[0.97] transition-all"
        >
          +15s
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-[0.97] transition-all"
        >
          Skip Rest
        </button>
      </div>
    </div>
  );
}
