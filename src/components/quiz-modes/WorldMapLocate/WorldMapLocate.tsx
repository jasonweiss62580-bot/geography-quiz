import { useState, useCallback, useMemo } from 'react';
import type { QuizQuestion } from '../../../data/types';
import type { GeographicEntity } from '../../../data/types';
import type { MacroRegionId } from '../../../data/world-regions';
import { getMacroForMicro } from '../../../data/world-regions';
import { WorldMap } from '../../map/WorldMap';
import styles from './WorldMapLocate.module.css';

interface WorldMapLocateProps {
  question: QuizQuestion;
  disabled: boolean;
  worldRegion?: string;
  onAnswer: (answer: string) => void;
}

const EMPTY_IDS: string[] = [];

function getMacroFromRegion(region?: string): MacroRegionId {
  if (!region || region === 'all') return 'americas';
  const macros = ['americas', 'africa', 'asia', 'europe', 'oceania'];
  if (macros.includes(region)) return region as MacroRegionId;
  return getMacroForMicro(region as never) ?? 'americas';
}

export function WorldMapLocate({ question, disabled, worldRegion, onAnswer }: WorldMapLocateProps) {
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

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
  const correctId = useMemo(
    () => (clickedId !== null ? question.entity.svgId : undefined),
    [clickedId, question.entity.svgId],
  );
  const wrongId = useMemo(
    () => (wasCorrect === false ? (clickedId ?? undefined) : undefined),
    [wasCorrect, clickedId],
  );
  const macroRegion = getMacroFromRegion(worldRegion);

  return (
    <div className={styles.wrapper}>
      <p className={styles.prompt}>Click on {question.entity.name}</p>
      <p className={styles.hint}>Find the country on the map</p>
      <WorldMap
        macroRegion={macroRegion}
        interactive={interactive}
        correctId={correctId}
        wrongId={wrongId}
        highlightedIds={EMPTY_IDS}
        onCountryClick={handleClick}
      />
    </div>
  );
}
