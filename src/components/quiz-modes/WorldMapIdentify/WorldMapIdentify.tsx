import { useMemo } from 'react';
import type { QuizQuestion } from '../../../data/types';
import type { MacroRegionId } from '../../../data/world-regions';
import { getMacroForMicro } from '../../../data/world-regions';
import { WorldMap } from '../../map/WorldMap';
import { MultipleChoice } from '../../answer-formats/MultipleChoice/MultipleChoice';
import { SpellingInput } from '../../answer-formats/SpellingInput/SpellingInput';
import styles from './WorldMapIdentify.module.css';

interface WorldMapIdentifyProps {
  question: QuizQuestion;
  formatId: 'multiple-choice' | 'spelling';
  disabled: boolean;
  allowClose: boolean;
  worldRegion?: string;
  onAnswer: (answer: string) => void;
}

function getMacroFromRegion(region?: string): MacroRegionId {
  if (!region || region === 'all') return 'americas';
  const macros = ['americas', 'africa', 'asia', 'europe', 'oceania'];
  if (macros.includes(region)) return region as MacroRegionId;
  return getMacroForMicro(region as never) ?? 'americas';
}

export function WorldMapIdentify({
  question,
  formatId,
  disabled,
  allowClose,
  worldRegion,
  onAnswer,
}: WorldMapIdentifyProps) {
  const highlightedIds = useMemo(
    () => [question.entity.svgId],
    [question.entity.svgId],
  );
  const macroRegion = getMacroFromRegion(worldRegion);

  return (
    <div className={styles.wrapper}>
      <p className={styles.prompt}>Which country is highlighted?</p>
      <WorldMap
        macroRegion={macroRegion}
        highlightedIds={highlightedIds}
        interactive={false}
      />
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
