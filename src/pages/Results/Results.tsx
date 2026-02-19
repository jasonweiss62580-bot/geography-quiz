import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../stores/quizStore';
import { useScoresStore, makeScoreKey } from '../../stores/scoresStore';
import { useConfetti } from '../../hooks/useConfetti';
import { useAudio } from '../../hooks/useAudio';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { Button } from '../../components/ui/Button/Button';
import styles from './Results.module.css';

function fmt(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function Results() {
  const navigate = useNavigate();
  const { lastSession, startSession, resetSession } = useQuizStore();
  const { getHighScore } = useScoresStore();
  const { fire } = useConfetti();
  const { playFanfare } = useAudio();

  useEffect(() => {
    if (!lastSession) {
      navigate('/', { replace: true });
      return;
    }
    // Celebration (audio already played in QuizSession, but confetti here in case it's a page refresh)
    fire();
    playFanfare();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lastSession) return null;

  const { config, answers, totalTimeMs, score } = lastSession;
  const total = answers.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const key = makeScoreKey(lastSession);
  const highScore = getHighScore(key);
  const isNewHigh = highScore?.completedAt === lastSession.completedAt;

  function handlePlayAgain() {
    startSession(config);
    navigate('/quiz', { replace: true });
  }

  function handleHome() {
    resetSession();
    navigate(`/topic/${config.topicId}/mode`, { replace: true });
  }

  const trophy = pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪';

  return (
    <PageLayout title="Results" showBack={false}>
      <div className={styles.wrapper}>
        <div className={styles.scoreCard}>
          <span className={styles.trophy}>{trophy}</span>
          <p className={styles.scoreLabel}>Your Score</p>
          <p className={styles.scoreFraction}>{score}/{total}</p>
          <p className={styles.scorePct}>{pct}%</p>
          {config.showTimer && (
            <p className={styles.time}>⏱ Total time: {fmt(totalTimeMs)}</p>
          )}
          {isNewHigh && (
            <div className={styles.highScore}>🎉 New High Score!</div>
          )}
          {!isNewHigh && highScore && (
            <div className={styles.highScore}>
              Best: {highScore.score}/{total} ({Math.round((highScore.score / total) * 100)}%)
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button onClick={handlePlayAgain}>Play Again</Button>
          <Button variant="ghost" onClick={handleHome}>Home</Button>
        </div>

        {answers.length > 0 && (
          <div className={styles.reviewSection}>
            <h2 className={styles.reviewTitle}>Answer Review</h2>
            <div className={styles.reviewList}>
              {answers.map((record, i) => (
                <div
                  key={i}
                  className={`${styles.reviewItem} ${record.correct ? styles.correct : styles.wrong}`}
                >
                  <span className={styles.reviewIcon}>{record.correct ? '✅' : '❌'}</span>
                  <div className={styles.reviewText}>
                    <p className={styles.reviewQuestion}>{record.question.prompt}</p>
                    <p className={`${styles.reviewAnswer} ${record.correct ? styles.reviewCorrect : styles.reviewWrong}`}>
                      {record.question.correctAnswer}
                    </p>
                    {!record.correct && record.userAnswer && (
                      <p className={styles.reviewYours}>You answered: {record.userAnswer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
