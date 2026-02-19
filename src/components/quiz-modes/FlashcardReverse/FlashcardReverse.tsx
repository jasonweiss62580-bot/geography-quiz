import type { QuizQuestion } from '../../../data/types';
import { MultipleChoice } from '../../answer-formats/MultipleChoice/MultipleChoice';
import { SpellingInput } from '../../answer-formats/SpellingInput/SpellingInput';
import styles from './FlashcardReverse.module.css';

interface FlashcardReverseProps {
  question: QuizQuestion;
  formatId: 'multiple-choice' | 'spelling';
  disabled: boolean;
  allowClose: boolean;
  onAnswer: (answer: string) => void;
}

export function FlashcardReverse({ question, formatId, disabled, allowClose, onAnswer }: FlashcardReverseProps) {
  return (
    <div>
      <div className={styles.card}>
        <p className={styles.label}>Capital City</p>
        <p className={styles.capital}>{question.entity.capital}</p>
        <p className={styles.question}>Which state is this the capital of?</p>
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
