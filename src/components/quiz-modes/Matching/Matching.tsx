import { useEffect, useState } from 'react';
import type { GeographicEntity } from '../../../data/types';
import { shuffle } from '../../../lib/quiz-engine';
import styles from './Matching.module.css';

interface MatchResult {
  state: string;
  capital: string;
  correct: boolean;
}

interface MatchingProps {
  entities: GeographicEntity[];   // exactly 10
  onComplete: (results: MatchResult[]) => void;
}

export function Matching({ entities, onComplete }: MatchingProps) {
  const [states] = useState(() => shuffle(entities.map((e) => e.name)));
  const [capitals] = useState(() => shuffle(entities.map((e) => e.capital)));
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCapital, setSelectedCapital] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<MatchResult[]>([]);

  // When both are selected, attempt a match
  useEffect(() => {
    if (!selectedState || !selectedCapital) return;
    const entity = entities.find((e) => e.name === selectedState);
    const correct = entity?.capital === selectedCapital;
    const result: MatchResult = {
      state: selectedState,
      capital: selectedCapital,
      correct,
    };

    if (correct) {
      const newMatched = new Set(matched);
      newMatched.add(selectedState);
      newMatched.add(selectedCapital);
      const newResults = [...results, result];
      setMatched(newMatched);
      setResults(newResults);
      setSelectedState(null);
      setSelectedCapital(null);
      if (newResults.length === entities.length) {
        setTimeout(() => onComplete(newResults), 300);
      }
    } else {
      // Wrong — flash then deselect
      const timeoutId = setTimeout(() => {
        setSelectedState(null);
        setSelectedCapital(null);
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCapital]);

  function handleStateClick(state: string) {
    if (matched.has(state)) return;
    setSelectedState((prev) => (prev === state ? null : state));
  }

  function handleCapitalClick(capital: string) {
    if (matched.has(capital)) return;
    if (!selectedState) return; // must pick state first
    setSelectedCapital(capital);
  }

  const matchCount = results.filter((r) => r.correct).length;

  return (
    <div className={styles.wrapper}>
      <p className={styles.instructions}>
        Click a state, then click its capital to match them.
      </p>
      <div className={styles.columns}>
        <div className={styles.column}>
          <p className={styles.columnHeader}>States</p>
          {states.map((state) => (
            <button
              key={state}
              className={[
                styles.item,
                matched.has(state) ? styles.matched : '',
                selectedState === state ? styles.selected : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleStateClick(state)}
              disabled={matched.has(state)}
            >
              {state}
            </button>
          ))}
        </div>
        <div className={styles.column}>
          <p className={styles.columnHeader}>Capitals</p>
          {capitals.map((capital) => (
            <button
              key={capital}
              className={[
                styles.item,
                matched.has(capital) ? styles.matched : '',
                selectedCapital === capital ? styles.selected : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleCapitalClick(capital)}
              disabled={matched.has(capital)}
            >
              {capital}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.progress}>{matchCount} of {entities.length} matched</p>
    </div>
  );
}
