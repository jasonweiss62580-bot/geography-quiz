import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { USRegionSelector } from '../../components/USRegionSelector/USRegionSelector';
import { useQuizStore } from '../../stores/quizStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { US_STATES } from '../../data/us-states';
import type { USRegionId } from '../../data/us-regions';
import type { QuizModeId, QuizTopicId } from '../../data/types';
import { resumeCtx } from '../../lib/audio';
import styles from './ModeSelect.module.css';

const MODES = [
  { id: 'map-identify',      emoji: '🔍', title: 'Map Identify',  desc: 'A highlighted state appears — name it!' },
  { id: 'map-locate',        emoji: '📍', title: 'Map Locate',    desc: 'A state name appears — find it on the map!' },
  { id: 'flashcard-forward', emoji: '📋', title: 'State → Capital', desc: 'See the state, name the capital.' },
  { id: 'flashcard-reverse', emoji: '🔄', title: 'Capital → State', desc: 'See the capital, name the state.' },
  { id: 'matching',          emoji: '🔗', title: 'Matching',       desc: 'Match states to their capitals.' },
] as const;

const SKIP_FORMAT: QuizModeId[] = ['map-locate', 'matching'];

function countStates(region: USRegionId): number {
  if (region === 'all') return US_STATES.length;
  return US_STATES.filter((s) => s.region === region).length;
}

export function ModeSelect() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { startSession } = useQuizStore();
  const { questionCount, showTimer, allowClose, selectedUSRegion, setSelectedUSRegion } = useSettingsStore();

  const stateCount = countStates(selectedUSRegion);

  function handleMode(modeId: QuizModeId) {
    resumeCtx();
    const baseConfig = {
      topicId: topicId as QuizTopicId,
      modeId,
      formatId: 'multiple-choice' as const,
      questionCount,
      showTimer,
      allowClose,
      usRegion: selectedUSRegion === 'all' ? undefined : selectedUSRegion,
    };

    if (SKIP_FORMAT.includes(modeId)) {
      const count =
        modeId === 'matching'
          ? Math.min(questionCount, Math.min(10, stateCount))
          : Math.min(questionCount, stateCount);
      startSession({ ...baseConfig, questionCount: count });
      navigate('/quiz');
    } else {
      const regionParam = selectedUSRegion !== 'all' ? `?region=${selectedUSRegion}` : '';
      navigate(`/topic/${topicId}/mode/${modeId}/format${regionParam}`);
    }
  }

  return (
    <PageLayout title="US States Geography" backTo="/">
      <div className={styles.wrapper}>
        <USRegionSelector selected={selectedUSRegion} onChange={setSelectedUSRegion} />

        <p className={styles.countNote}>
          {stateCount} state{stateCount === 1 ? '' : 's'} in this region
        </p>

        <div className={styles.grid}>
          {MODES.map((mode) => (
            <button
              key={mode.id}
              className={styles.card}
              onClick={() => handleMode(mode.id as QuizModeId)}
            >
              <span className={styles.emoji}>{mode.emoji}</span>
              <p className={styles.title}>{mode.title}</p>
              <p className={styles.desc}>{mode.desc}</p>
            </button>
          ))}
          <button
            className={`${styles.card} ${styles.settingsCard}`}
            onClick={() => navigate('/settings')}
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
