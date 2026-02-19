import { useMemo } from 'react';
import type { QuizQuestion } from '../../../data/types';
import { USMap } from '../../map/USMap';
import { MultipleChoice } from '../../answer-formats/MultipleChoice/MultipleChoice';
import { SpellingInput } from '../../answer-formats/SpellingInput/SpellingInput';
import styles from './MapIdentify.module.css';

interface MapIdentifyProps {
  question: QuizQuestion;
  formatId: 'multiple-choice' | 'spelling';
  disabled: boolean;
  allowClose: boolean;
  onAnswer: (answer: string) => void;
}

export function MapIdentify({ question, formatId, disabled, allowClose, onAnswer }: MapIdentifyProps) {
  // Stable array reference — only changes when the question changes, not on every timer tick
  const highlightedIds = useMemo(() => [question.entity.svgId], [question.entity.svgId]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.prompt}>Which state is highlighted?</p>
      <USMap highlightedIds={highlightedIds} interactive={false} />
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
