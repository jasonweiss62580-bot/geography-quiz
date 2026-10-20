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
import { WorldMapIdentifyCapital } from '../../components/quiz-modes/WorldMapIdentifyCapital/WorldMapIdentifyCapital';
import { WorldMapLocate } from '../../components/quiz-modes/WorldMapLocate/WorldMapLocate';
import { FlashcardForward } from '../../components/quiz-modes/FlashcardForward/FlashcardForward';
import { FlashcardReverse } from '../../components/quiz-modes/FlashcardReverse/FlashcardReverse';
import { Matching } from '../../components/quiz-modes/Matching/Matching';
import type { AnswerRecord } from '../../data/types';
import { formatAnswer } from '../../lib/quiz-engine';
import styles from './WorldQuizSession.module.css';

export function WorldQuizSession() {
  const navigate = useNavigate();
  const {
    phase, config, questions, currentIndex, answers,
    submitAnswer, submitPairAnswer, advanceQuestion, completeMatching,
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
      // Map Identify + Capital records two answers per question; both must be right
      const count = config?.modeId === 'map-identify-capital' ? 2 : 1;
      const latest = answers.slice(-count);
      if (latest.length > 0 && latest.every((a) => a.correct)) playCorrect();
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
  // Country and capital answers from the latest Map Identify + Capital question
  const lastPair = modeId === 'map-identify-capital' ? answers.slice(-2) : [];
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
          {modeId === 'map-identify-capital' && (
            <WorldMapIdentifyCapital
              question={question}
              disabled={isFeedback}
              allowClose={config.allowClose}
              worldRegion={worldRegion}
              onAnswer={submitPairAnswer}
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

        {isFeedback && lastPair.length === 2 && (
          <FeedbackOverlay
            correct={lastPair.every((a) => a.correct)}
            // One of the two right shows as "Almost!"
            wasClose={lastPair.some((a) => a.correct || a.wasClose)}
            correctAnswer={formatAnswer(lastPair[0].question)}
            parts={[
              { label: 'Country', answer: formatAnswer(lastPair[0].question), correct: lastPair[0].correct },
              { label: 'Capital', answer: formatAnswer(lastPair[1].question), correct: lastPair[1].correct },
            ]}
            // Extra time to read the corrections
            durationMs={lastPair.every((a) => a.correct) ? 1200 : 2200}
            onDismiss={advanceQuestion}
          />
        )}
        {isFeedback && lastAnswer && modeId !== 'matching' && modeId !== 'map-identify-capital' && (
          <FeedbackOverlay
            correct={lastAnswer.correct}
            wasClose={lastAnswer.wasClose}
            correctAnswer={formatAnswer(lastAnswer.question)}
            userAnswer={modeId === 'map-locate' ? lastAnswer.userAnswer : undefined}
            onDismiss={advanceQuestion}
          />
        )}
      </div>
    </PageLayout>
  );
}
