import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  mode: 'countdown' | 'stopwatch';
  initialSeconds?: number;
  onComplete?: () => void;
}

export function useTimer({ mode, initialSeconds = 0, onComplete }: UseTimerOptions) {
  const [seconds, setSeconds] = useState(mode === 'countdown' ? initialSeconds : 0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setSeconds(prev => {
        if (mode === 'countdown') {
          const next = prev - 1;
          if (next <= 0) {
            setIsRunning(false);
            onCompleteRef.current?.();
            return 0;
          }
          return next;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(mode === 'countdown' ? initialSeconds : 0);
  }, [mode, initialSeconds]);
  const addTime = useCallback((s: number) => setSeconds(prev => prev + s), []);

  return { seconds, isRunning, start, pause, reset, addTime };
}
