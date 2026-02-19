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
  const { questionCount, showTimer, allowClose } = useSettingsStore();

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
      </div>
    </PageLayout>
  );
}
