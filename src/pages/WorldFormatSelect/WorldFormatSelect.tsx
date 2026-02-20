import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { useQuizStore } from '../../stores/quizStore';
import { useWorldSettingsStore } from '../../stores/worldSettingsStore';
import { WORLD_COUNTRIES } from '../../data/world-countries';
import type { AnswerFormatId, QuizModeId } from '../../data/types';
import { resumeCtx } from '../../lib/audio';
import styles from './WorldFormatSelect.module.css';

function countEntities(region: string): number {
  if (!region || region === 'all') return WORLD_COUNTRIES.length;
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

export function WorldFormatSelect() {
  const { modeId } = useParams<{ modeId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { startSession } = useQuizStore();
  const { questionCount, showTimer, allowClose } = useWorldSettingsStore();

  const worldRegion = searchParams.get('region') ?? 'all';
  const entityCount = countEntities(worldRegion);

  function handleFormat(formatId: AnswerFormatId) {
    resumeCtx();
    startSession({
      topicId: 'world-countries',
      modeId: modeId as QuizModeId,
      formatId,
      questionCount: Math.min(questionCount, entityCount),
      showTimer,
      allowClose,
      worldRegion,
    });
    navigate('/world/quiz');
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
