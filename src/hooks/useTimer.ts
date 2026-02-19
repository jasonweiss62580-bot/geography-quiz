import { useEffect, useRef, useState } from 'react';

/** Returns elapsed milliseconds since `running` became true. Resets to 0 when running goes false→true. */
export function useTimer(running: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      setElapsed(0);
      return;
    }

    startRef.current = performance.now();

    function tick(now: number) {
      setElapsed(Math.floor(now - startRef.current!));
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  return elapsed;
}
