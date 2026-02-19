import styles from './Timer.module.css';

interface TimerProps {
  elapsedMs: number;
}

function fmt(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function Timer({ elapsedMs }: TimerProps) {
  return (
    <div className={styles.timer}>
      <span className={styles.icon}>⏱</span>
      <span>{fmt(elapsedMs)}</span>
    </div>
  );
}
