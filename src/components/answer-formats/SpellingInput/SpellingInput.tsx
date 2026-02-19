import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './SpellingInput.module.css';

interface SpellingInputProps {
  correctAnswer: string;
  disabled: boolean;
  allowClose: boolean;
  onSubmit: (answer: string) => void;
}

export function SpellingInput({ correctAnswer, disabled, allowClose, onSubmit }: SpellingInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue('');
    inputRef.current?.focus();
  }, [correctAnswer]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit();
  }

  function submit() {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  }

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your answer..."
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {allowClose && (
        <p className={styles.hint}>Spelling close enough counts!</p>
      )}
      <button
        className={styles.submitBtn}
        onClick={submit}
        disabled={disabled || !value.trim()}
      >
        Submit
      </button>
    </div>
  );
}
