import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../stores/quizStore';
import { useScoresStore } from '../../stores/scoresStore';
import { useTimer } from '../../hooks/useTimer';
import { useAudio } from '../../hooks/useAudio';
import { useConfetti } from '../../hooks/useConfetti';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar';
import { ScoreDisplay } from '../../components/ui/ScoreDisplay/ScoreDisplay';
import { FeedbackOverlay } from '../../components/feedback/FeedbackOverlay/FeedbackOverlay';
import { WorldMapIdentify } from '../../components/quiz-modes/WorldMapIdentify/WorldMapIdentify';
import { WorldMapLocate } from '../../components/quiz-modes/WorldMapLocate/WorldMapLocate';
import { FlashcardForward } from '../../components/quiz-modes/FlashcardForward/FlashcardForward';
import { FlashcardReverse } from '../../components/quiz-modes/FlashcardReverse/FlashcardReverse';
import { Matching } from '../../components/quiz-modes/Matching/Matching';
import type { AnswerRecord } from '../../data/types';
import styles from './WorldQuizSession.module.css';

export function WorldQuizSession() {
  const navigate = useNavigate();
  const {
    phase, config, questions, currentIndex, answers,
    submitAnswer, advanceQuestion, completeMatching,
  } = useQuizStore();
  const { updateScore } = useScoresStore();
  const { playCorrect, playWrong, playFanfare } = useAudio();
  const { fire } = useConfetti();

  const isRunning = phase === 'question' || phase === 'feedback';
  const elapsedMs = useTimer(isRunning);

  useEffect(() => {
    if (phase === 'idle') navigate('/world', { replace: true });
  }, [phase, navigate]);

  useEffect(() => {
    if (phase === 'feedback') {
      const lastAnswer = answers[answers.length - 1];
      if (lastAnswer?.correct) playCorrect();
      else playWrong();
    }
    if (phase === 'complete') {
      const { lastSession } = useQuizStore.getState();
      if (lastSession) {
        updateScore(lastSession);
        playFanfare();
        fire();
      }
      navigate('/world/results', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!config || questions.length === 0) return null;

  const question = questions[currentIndex];
  const correctCount = answers.filter((a) => a.correct).length;
  const lastAnswer = answers[answers.length - 1];
  const isFeedback = phase === 'feedback';
  const modeId = config.modeId;
  const formatId = config.formatId;
  const worldRegion = config.worldRegion;

  function handleMatchingComplete(results: { state: string; capital: string; correct: boolean }[]) {
    const timePerMatch = Math.round(elapsedMs / results.length);
    const records: AnswerRecord[] = results.map((r, i) => {
      const entity = questions[i]?.entity ?? questions[0].entity;
      return {
        question: {
          entity,
          correctAnswer: entity.capital,
          options: [],
          prompt: 'Matching',
        },
        userAnswer: r.capital,
        correct: r.correct,
        wasClose: false,
        timeMs: timePerMatch,
      };
    });
    completeMatching(records);
  }

  return (
    <PageLayout
      title="Quiz"
      headerRight={
        <ScoreDisplay
          correct={correctCount}
          total={answers.length}
          elapsedMs={elapsedMs}
          showTimer={config.showTimer}
        />
      }
    >
      <div className={styles.wrapper}>
        {modeId !== 'matching' && (
          <div className={styles.topBar}>
            <ProgressBar current={currentIndex + 1} total={questions.length} />
          </div>
        )}

        <div className={styles.content} key={`q-${currentIndex}`}>
          {modeId === 'map-identify' && (
            <WorldMapIdentify
              question={question}
              formatId={formatId}
              disabled={isFeedback}
              allowClose={config.allowClose}
              worldRegion={worldRegion}
              onAnswer={submitAnswer}
            />
          )}
          {modeId === 'map-locate' && (
            <WorldMapLocate
              question={question}
              disabled={isFeedback}
              worldRegion={worldRegion}
              onAnswer={submitAnswer}
            />
          )}
          {modeId === 'flashcard-forward' && (
            <FlashcardForward
              question={question}
              formatId={formatId}
              disabled={isFeedback}
              allowClose={config.allowClose}
              onAnswer={submitAnswer}
            />
          )}
          {modeId === 'flashcard-reverse' && (
            <FlashcardReverse
              question={question}
              formatId={formatId}
              disabled={isFeedback}
              allowClose={config.allowClose}
              onAnswer={submitAnswer}
            />
          )}
          {modeId === 'matching' && (
            <Matching
              entities={questions.map((q) => q.entity)}
              onComplete={handleMatchingComplete}
            />
          )}
        </div>

        {isFeedback && lastAnswer && modeId !== 'matching' && (
          <FeedbackOverlay
            correct={lastAnswer.correct}
            wasClose={lastAnswer.wasClose}
            correctAnswer={lastAnswer.question.correctAnswer}
            onDismiss={advanceQuestion}
          />
        )}
      </div>
    </PageLayout>
  );
}
