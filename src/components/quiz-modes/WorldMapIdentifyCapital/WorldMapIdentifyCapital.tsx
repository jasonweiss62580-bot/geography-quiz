import { useMemo } from 'react';
import type { QuizQuestion } from '../../../data/types';
import type { MacroRegionId } from '../../../data/world-regions';
import { getMacroForMicro } from '../../../data/world-regions';
import { WorldMap } from '../../map/WorldMap';
import { PairSpellingInput } from '../../answer-formats/PairSpellingInput/PairSpellingInput';
import styles from '../WorldMapIdentify/WorldMapIdentify.module.css';

interface WorldMapIdentifyCapitalProps {
  question: QuizQuestion;
  disabled: boolean;
  allowClose: boolean;
  worldRegion?: string;
  onAnswer: (country: string, capital: string) => void;
}

function getMacroFromRegion(region?: string): MacroRegionId {
  if (!region || region === 'all') return 'americas';
  const macros = ['americas', 'africa', 'asia', 'europe', 'oceania'];
  if (macros.includes(region)) return region as MacroRegionId;
  return getMacroForMicro(region) ?? 'americas';
}

/** Map Identify variant: spell both the highlighted country and its capital. */
export function WorldMapIdentifyCapital({
  question,
  disabled,
  allowClose,
  worldRegion,
  onAnswer,
}: WorldMapIdentifyCapitalProps) {
  const highlightedIds = useMemo(
    () => [question.entity.svgId],
    [question.entity.svgId],
  );
  const macroRegion = getMacroFromRegion(worldRegion);

  return (
    <div className={styles.wrapper}>
      <p className={styles.prompt}>Name the highlighted country and its capital</p>
      <WorldMap
        macroRegion={macroRegion}
        regionId={worldRegion}
        highlightedIds={highlightedIds}
        interactive={false}
      />
      <PairSpellingInput
        firstLabel="Country"
        secondLabel="Capital"
        disabled={disabled}
        allowClose={allowClose}
        onSubmit={onAnswer}
      />
    </div>
  );
}
