import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { useQuizStore } from '../../stores/quizStore';
import { useSettingsStore } from '../../stores/settingsStore';
import type { AnswerFormatId, QuizModeId, QuizTopicId } from '../../data/types';
import { resumeCtx } from '../../lib/audio';
import styles from './FormatSelect.module.css';

export function FormatSelect() {
  const { topicId, modeId } = useParams<{ topicId: string; modeId: string }>();
  const navigate = useNavigate();
  const { startSession } = useQuizStore();
  const { questionCount, showTimer, allowClose, setQuestionCount, setShowTimer, setAllowClose } = useSettingsStore();

  function handleFormat(formatId: AnswerFormatId) {
    resumeCtx();
    startSession({
      topicId: topicId as QuizTopicId,
      modeId: modeId as QuizModeId,
      formatId,
      questionCount,
      showTimer,
      allowClose,
    });
    navigate('/quiz');
  }

  return (
    <PageLayout title="Choose a Format">
      <div className={styles.wrapper}>
        <div className={styles.cards}>
          <button className={styles.card} onClick={() => handleFormat('multiple-choice')}>
            <span className={styles.emoji}>🎯</span>
            <p className={styles.title}>Multiple Choice</p>
            <p className={styles.desc}>Pick the correct answer from 4 options.</p>
          </button>
          <button className={styles.card} onClick={() => handleFormat('spelling')}>
            <span className={styles.emoji}>✏️</span>
            <p className={styles.title}>Spelling</p>
            <p className={styles.desc}>Type the answer yourself.</p>
          </button>
        </div>

        <div className={styles.settings}>
          <div className={styles.settingRow}>
            <label className={styles.settingLabel} htmlFor="qcount">Questions</label>
            <div className={styles.settingControl}>
              <input
                id="qcount"
                type="number"
                className={styles.countInput}
                value={questionCount}
                min={1}
                max={50}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>(1–50)</span>
            </div>
          </div>
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Show Timer</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
              />
              {showTimer ? 'On' : 'Off'}
            </label>
          </div>
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Accept Close Spelling</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={allowClose}
                onChange={(e) => setAllowClose(e.target.checked)}
              />
              {allowClose ? 'On' : 'Off'}
            </label>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
