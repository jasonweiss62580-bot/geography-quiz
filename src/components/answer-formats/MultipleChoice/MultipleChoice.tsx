import { useEffect, useState } from 'react';
import styles from './MultipleChoice.module.css';

interface MultipleChoiceProps {
  options: string[];
  correctAnswer: string;
  disabled: boolean;
  onSelect: (answer: string) => void;
}

export function MultipleChoice({ options, correctAnswer, disabled, onSelect }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Reset on new question (options change)
  useEffect(() => { setSelected(null); }, [options]);

  function handleClick(option: string) {
    if (disabled || selected !== null) return;
    setSelected(option);
    onSelect(option);
  }

  function getClass(option: string) {
    if (selected === null) return styles.option;
    if (option === correctAnswer) return `${styles.option} ${styles.correct}`;
    if (option === selected) return `${styles.option} ${styles.wrong}`;
    return styles.option;
  }

  return (
    <div className={styles.grid}>
      {options.map((option) => (
        <button
          key={option}
          className={getClass(option)}
          onClick={() => handleClick(option)}
          disabled={disabled || selected !== null}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
