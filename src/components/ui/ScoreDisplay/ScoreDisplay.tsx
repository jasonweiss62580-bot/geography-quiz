import { Timer } from '../Timer/Timer';
import styles from './ScoreDisplay.module.css';

interface ScoreDisplayProps {
  correct: number;
  total: number;
  elapsedMs: number;
  showTimer: boolean;
}

export function ScoreDisplay({ correct, total, elapsedMs, showTimer }: ScoreDisplayProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.score}>⭐ {correct}/{total}</span>
      {showTimer && <Timer elapsedMs={elapsedMs} />}
    </div>
  );
}
