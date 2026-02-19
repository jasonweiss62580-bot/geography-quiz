import { useEffect, useMemo } from 'react';
import styles from './FeedbackOverlay.module.css';

const CORRECT_MESSAGES = [
  'Awesome!', 'Great job!', 'You got it!', 'Nailed it!', 'Correct!', 'Brilliant!',
];
const WRONG_MESSAGES = [
  'Not quite!', 'Try again!', 'So close...', 'Oops!', 'Not this time!',
];
const CLOSE_MESSAGES = [
  'Almost!', 'Very close!', 'Nearly there!', 'Good try!',
];

const CORRECT_EMOJIS = ['🌟', '🎉', '✅', '🏆', '🦄', '🎯'];
const WRONG_EMOJIS = ['❌', '😬', '🙈', '💨', '🤔'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface FeedbackOverlayProps {
  correct: boolean;
  wasClose: boolean;
  correctAnswer: string;
  onDismiss: () => void;
}

export function FeedbackOverlay({ correct, wasClose, correctAnswer, onDismiss }: FeedbackOverlayProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 1200);
    return () => clearTimeout(id);
  }, [onDismiss]);

  const type = correct ? 'correct' : wasClose ? 'close' : 'wrong';
  // useMemo prevents pick() from re-running on every timer-driven re-render
  const message = useMemo(
    () => (correct ? pick(CORRECT_MESSAGES) : wasClose ? pick(CLOSE_MESSAGES) : pick(WRONG_MESSAGES)),
    [correct, wasClose],
  );
  const emoji = useMemo(
    () => (correct ? pick(CORRECT_EMOJIS) : pick(WRONG_EMOJIS)),
    [correct],
  );

  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} ${styles[type]}`}>
        <span className={styles.emoji}>{emoji}</span>
        <p className={styles.message}>{message}</p>
        {!correct && (
          <p className={styles.answer}>
            Answer: <strong>{correctAnswer}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
