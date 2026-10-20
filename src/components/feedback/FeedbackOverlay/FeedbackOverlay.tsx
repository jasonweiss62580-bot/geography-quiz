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

export interface FeedbackPart {
  label: string;   // "Country" / "Capital"
  answer: string;  // the correct answer for display
  correct: boolean;
}

interface FeedbackOverlayProps {
  correct: boolean;
  wasClose: boolean;
  correctAnswer: string;
  /** When provided and the answer is wrong, shown instead of the correct answer.
   *  Used by Map Locate so the user sees which country they accidentally clicked. */
  userAnswer?: string;
  /** For two-part questions: shown instead of a single answer, listing each part that was missed */
  parts?: FeedbackPart[];
  /** How long the overlay stays up (default 1200ms) */
  durationMs?: number;
  onDismiss: () => void;
}

export function FeedbackOverlay({
  correct,
  wasClose,
  correctAnswer,
  userAnswer,
  parts,
  durationMs = 1200,
  onDismiss,
}: FeedbackOverlayProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [onDismiss, durationMs]);

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
        {!correct && parts && parts.filter((p) => !p.correct).map((p) => (
          <p key={p.label} className={styles.answer}>
            {p.label}: <strong>{p.answer}</strong>
          </p>
        ))}
        {!correct && !parts && (
          <p className={styles.answer}>
            {userAnswer
              ? <>You selected: <strong>{userAnswer}</strong></>
              : <>Answer: <strong>{correctAnswer}</strong></>}
          </p>
        )}
      </div>
    </div>
  );
}
