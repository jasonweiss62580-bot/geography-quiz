import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './PairSpellingInput.module.css';

interface PairSpellingInputProps {
  firstLabel: string;
  secondLabel: string;
  disabled: boolean;
  allowClose: boolean;
  onSubmit: (first: string, second: string) => void;
}

/**
 * Two typed answers submitted together, e.g. a country and its capital.
 * Starts empty; the quiz session remounts it for each new question.
 */
export function PairSpellingInput({
  firstLabel,
  secondLabel,
  disabled,
  allowClose,
  onSubmit,
}: PairSpellingInputProps) {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const ready = first.trim() !== '' && second.trim() !== '';

  function submit() {
    if (!ready || disabled) return;
    onSubmit(first.trim(), second.trim());
  }

  // Enter in the first box moves to the second; Enter in the second submits
  function handleFirstKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (ready) submit();
      else secondRef.current?.focus();
    }
  }

  function handleSecondKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (ready) submit();
      else if (!first.trim()) firstRef.current?.focus();
    }
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.field}>
        <span className={styles.label}>{firstLabel}</span>
        <input
          ref={firstRef}
          className={styles.input}
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          onKeyDown={handleFirstKeyDown}
          placeholder={`Type the ${firstLabel.toLowerCase()}...`}
          disabled={disabled}
          enterKeyHint="next"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{secondLabel}</span>
        <input
          ref={secondRef}
          className={styles.input}
          value={second}
          onChange={(e) => setSecond(e.target.value)}
          onKeyDown={handleSecondKeyDown}
          placeholder={`Type the ${secondLabel.toLowerCase()}...`}
          disabled={disabled}
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>
      {allowClose && (
        <p className={styles.hint}>Spelling close enough counts!</p>
      )}
      <button
        className={styles.submitBtn}
        onClick={submit}
        disabled={disabled || !ready}
      >
        Submit
      </button>
    </div>
  );
}
