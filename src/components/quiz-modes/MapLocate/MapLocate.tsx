import { useState, useCallback, useMemo } from 'react';
import type { QuizQuestion } from '../../../data/types';
import type { GeographicEntity } from '../../../data/types';
import { USMap } from '../../map/USMap';
import styles from './MapLocate.module.css';

interface MapLocateProps {
  question: QuizQuestion;
  disabled: boolean;
  onAnswer: (answer: string) => void;
}

// Stable empty array so USMap's useCallback doesn't see a new reference each render
const EMPTY_IDS: string[] = [];

export function MapLocate({ question, disabled, onAnswer }: MapLocateProps) {
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // useCallback keeps the reference stable across parent re-renders (e.g. from useTimer).
  // This prevents USMap's Geographies children from invalidating on every tick.
  const handleClick = useCallback(
    (entity: GeographicEntity) => {
      if (disabled || clickedId !== null) return;
      const correct = entity.name === question.entity.name;
      setClickedId(entity.svgId);
      setWasCorrect(correct);
      onAnswer(entity.name);
    },
    [disabled, clickedId, question.entity.name, onAnswer],
  );

  const interactive = !disabled && clickedId === null;
  // When correct: clicked state turns green.
  // When wrong: clicked state turns red AND the correct state turns green so the user can see it.
  const correctId = useMemo(
    () => (clickedId !== null ? question.entity.svgId : undefined),
    [clickedId, question.entity.svgId],
  );
  const wrongId = useMemo(
    () => (wasCorrect === false ? (clickedId ?? undefined) : undefined),
    [wasCorrect, clickedId],
  );

  return (
    <div className={styles.wrapper}>
      <p className={styles.prompt}>Click on {question.entity.name}</p>
      <p className={styles.hint}>Find the state on the map</p>
      <USMap
        interactive={interactive}
        correctId={correctId}
        wrongId={wrongId}
        highlightedIds={EMPTY_IDS}
        onStateClick={handleClick}
      />
    </div>
  );
}
