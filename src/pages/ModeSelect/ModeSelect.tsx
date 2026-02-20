import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { useQuizStore } from '../../stores/quizStore';
import { useSettingsStore } from '../../stores/settingsStore';
import type { QuizModeId, QuizTopicId } from '../../data/types';
import { resumeCtx } from '../../lib/audio';
import styles from './ModeSelect.module.css';

const MODES = [
  { id: 'map-identify', emoji: '🔍', title: 'Map Identify', desc: 'A highlighted state appears — name it!' },
  { id: 'map-locate', emoji: '📍', title: 'Map Locate', desc: 'A state name appears — find it on the map!' },
  { id: 'flashcard-forward', emoji: '📋', title: 'State → Capital', desc: 'See the state, name the capital.' },
  { id: 'flashcard-reverse', emoji: '🔄', title: 'Capital → State', desc: 'See the capital, name the state.' },
  { id: 'matching', emoji: '🔗', title: 'Matching', desc: 'Match 10 states to their capitals.' },
] as const;

// Modes that skip format select and go directly to quiz
const SKIP_FORMAT: QuizModeId[] = ['map-locate', 'matching'];

export function ModeSelect() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { startSession } = useQuizStore();
  const { questionCount, showTimer, allowClose } = useSettingsStore();

  function handleMode(modeId: QuizModeId) {
    resumeCtx();
    if (SKIP_FORMAT.includes(modeId)) {
      const count = modeId === 'matching' ? Math.min(questionCount, 10) : questionCount;
      startSession({
        topicId: topicId as QuizTopicId,
        modeId,
        formatId: 'multiple-choice', // unused for these modes
        questionCount: count,
        showTimer,
        allowClose,
      });
      navigate('/quiz');
    } else {
      navigate(`/topic/${topicId}/mode/${modeId}/format`);
    }
  }

  return (
    <PageLayout title="US States Geography">
      <div className={styles.wrapper}>
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
