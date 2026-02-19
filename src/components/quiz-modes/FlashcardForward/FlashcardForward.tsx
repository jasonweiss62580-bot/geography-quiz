import type { QuizQuestion } from '../../../data/types';
import { MultipleChoice } from '../../answer-formats/MultipleChoice/MultipleChoice';
import { SpellingInput } from '../../answer-formats/SpellingInput/SpellingInput';
import styles from './FlashcardForward.module.css';

interface FlashcardForwardProps {
  question: QuizQuestion;
  formatId: 'multiple-choice' | 'spelling';
  disabled: boolean;
  allowClose: boolean;
  onAnswer: (answer: string) => void;
}

export function FlashcardForward({ question, formatId, disabled, allowClose, onAnswer }: FlashcardForwardProps) {
  return (
    <div>
      <div className={styles.card}>
        <p className={styles.label}>State</p>
        <p className={styles.state}>{question.entity.name}</p>
        <p className={styles.abbr}>({question.entity.abbreviation})</p>
        <p className={styles.question}>What is the capital?</p>
      </div>
      {formatId === 'multiple-choice' ? (
        <MultipleChoice
          options={question.options}
          correctAnswer={question.correctAnswer}
          disabled={disabled}
          onSelect={onAnswer}
        />
      ) : (
        <SpellingInput
          correctAnswer={question.correctAnswer}
          disabled={disabled}
          allowClose={allowClose}
          onSubmit={onAnswer}
        />
      )}
    </div>
  );
}
