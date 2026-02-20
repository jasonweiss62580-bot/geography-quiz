import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { RegionSelector } from '../../components/RegionSelector/RegionSelector';
import { useQuizStore } from '../../stores/quizStore';
import { useWorldSettingsStore } from '../../stores/worldSettingsStore';
import { WORLD_COUNTRIES } from '../../data/world-countries';
import type { MacroRegionId, MicroRegionId } from '../../data/world-regions';
import type { QuizModeId } from '../../data/types';
import { resumeCtx } from '../../lib/audio';
import styles from './WorldModeSelect.module.css';

const MODES = [
  { id: 'map-identify',      emoji: '🔍', title: 'Map Identify',     desc: 'A highlighted country appears — name it!' },
  { id: 'map-locate',        emoji: '📍', title: 'Map Locate',       desc: 'A country name appears — find it on the map!' },
  { id: 'flashcard-forward', emoji: '📋', title: 'Country → Capital', desc: 'See the country, name the capital.' },
  { id: 'flashcard-reverse', emoji: '🔄', title: 'Capital → Country', desc: 'See the capital, name the country.' },
  { id: 'matching',          emoji: '🔗', title: 'Matching',          desc: 'Match 10 countries to their capitals.' },
] as const;

const SKIP_FORMAT: QuizModeId[] = ['map-locate', 'matching'];

/** Derive the worldRegion string to pass to QuizConfig */
function resolveRegion(macro: MacroRegionId, micro: MicroRegionId): string {
  if (macro === 'all') return 'all';
  if (micro === 'all') return macro; // all countries in the macro
  return micro;
}

/** Count how many quiz-eligible countries are in the current selection */
function countEntities(macro: MacroRegionId, micro: MicroRegionId): number {
  const region = resolveRegion(macro, micro);
  if (region === 'all') return WORLD_COUNTRIES.length;
  const macros = ['americas', 'africa', 'asia', 'europe', 'oceania'];
  if (macros.includes(region)) {
    const microToMacro: Record<string, string> = {
      'north-america': 'americas', 'central-america-caribbean': 'americas', 'south-america': 'americas',
      'western-europe': 'europe', 'eastern-europe': 'europe',
      'north-africa': 'africa', 'eastern-africa': 'africa', 'middle-africa': 'africa', 'southern-africa': 'africa',
      'middle-east': 'asia', 'south-asia': 'asia', 'east-southeast-asia': 'asia',
      'oceania': 'oceania',
    };
    return WORLD_COUNTRIES.filter((c) => c.region && microToMacro[c.region] === region).length;
  }
  return WORLD_COUNTRIES.filter((c) => c.region === region).length;
}

export function WorldModeSelect() {
  const navigate = useNavigate();
  const { startSession } = useQuizStore();
  const { questionCount, showTimer, allowClose } = useWorldSettingsStore();

  const [selectedMacro, setSelectedMacro] = useState<MacroRegionId>('americas');
  const [selectedMicro, setSelectedMicro] = useState<MicroRegionId>('all');

  const entityCount = countEntities(selectedMacro, selectedMicro);
  const worldRegion = resolveRegion(selectedMacro, selectedMicro);

  function handleMode(modeId: QuizModeId) {
    if (entityCount === 0) return;
    resumeCtx();

    const baseConfig = {
      topicId: 'world-countries' as const,
      modeId,
      formatId: 'multiple-choice' as const,
      questionCount,
      showTimer,
      allowClose,
      worldRegion,
    };

    if (SKIP_FORMAT.includes(modeId)) {
      const count =
        modeId === 'matching'
          ? Math.min(questionCount, Math.min(10, entityCount))
          : Math.min(questionCount, entityCount);
      startSession({ ...baseConfig, questionCount: count });
      navigate('/world/quiz');
    } else {
      navigate(`/world/mode/${modeId}/format?region=${encodeURIComponent(worldRegion)}`);
    }
  }

  return (
    <PageLayout title="World Geography" showBack>
      <div className={styles.wrapper}>
        {/* Region selector */}
        <RegionSelector
          selectedMacro={selectedMacro}
          selectedMicro={selectedMicro}
          onMacroChange={setSelectedMacro}
          onMicroChange={setSelectedMicro}
        />

        {/* Entity count badge */}
        <p className={styles.countNote}>
          {entityCount === 0
            ? 'No countries available for this region yet.'
            : `${entityCount} countr${entityCount === 1 ? 'y' : 'ies'} in this region`}
        </p>

        {/* Mode cards */}
        <div className={styles.grid}>
          {MODES.map((mode) => (
            <button
              key={mode.id}
              className={`${styles.card} ${entityCount === 0 ? styles.cardDisabled : ''}`}
              onClick={() => handleMode(mode.id as QuizModeId)}
              disabled={entityCount === 0}
            >
              <span className={styles.emoji}>{mode.emoji}</span>
              <p className={styles.title}>{mode.title}</p>
              <p className={styles.desc}>{mode.desc}</p>
            </button>
          ))}
          <button
            className={`${styles.card} ${styles.settingsCard}`}
            onClick={() => navigate('/world/settings')}
          >
            <span className={styles.emoji}>⚙️</span>
            <p className={styles.title}>Settings</p>
            <p className={styles.desc}>Questions, timer, and spelling options</p>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
