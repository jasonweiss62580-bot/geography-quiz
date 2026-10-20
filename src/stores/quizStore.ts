import { create } from 'zustand';
import type { QuizConfig, QuizQuestion, AnswerRecord, SessionResult } from '../data/types';
import { generateQuestions } from '../lib/quiz-engine';
import { US_STATES } from '../data/us-states';
import { getCountriesForRegion } from '../data/world-countries';
import { isClose, normalizeAnswer } from '../lib/levenshtein';

type QuizPhase = 'idle' | 'question' | 'feedback' | 'complete';

interface QuizState {
  phase: QuizPhase;
  config: QuizConfig | null;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: AnswerRecord[];
  lastSession: SessionResult | null;
  questionStartTime: number;

  startSession: (config: QuizConfig) => void;
  submitAnswer: (userAnswer: string) => void;
  /** Map Identify + Capital: records two answers (country, then capital) */
  submitPairAnswer: (countryAnswer: string, capitalAnswer: string) => void;
  advanceQuestion: () => void;
  completeMatching: (records: AnswerRecord[]) => void;
  resetSession: () => void;
}

function getPool(config: QuizConfig) {
  if (config.topicId !== 'world-countries') {
    if (!config.usRegion || config.usRegion === 'all') return US_STATES;
    return US_STATES.filter((s) => s.region === config.usRegion);
  }
  return getCountriesForRegion(config.worldRegion);
}

function checkAnswer(
  question: QuizQuestion,
  userAnswer: string,
  allowClose: boolean,
  timeMs: number,
): AnswerRecord {
  const normalized = normalizeAnswer(userAnswer);
  const targets = [question.correctAnswer, ...(question.acceptedAnswers ?? [])]
    .map(normalizeAnswer);
  const exact = targets.includes(normalized);
  const close = !exact && targets.some((t) => isClose(normalized, t));
  return {
    question,
    userAnswer,
    correct: exact || (allowClose && close),
    wasClose: close,
    timeMs,
  };
}

export const useQuizStore = create<QuizState>((set, get) => ({
  phase: 'idle',
  config: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  lastSession: null,
  questionStartTime: 0,

  startSession(config) {
    const pool = getPool(config);
    const questions = generateQuestions(config, pool);
    set({
      phase: 'question',
      config,
      questions,
      currentIndex: 0,
      answers: [],
      questionStartTime: Date.now(),
    });
  },

  submitAnswer(userAnswer) {
    const { config, questions, currentIndex, answers, questionStartTime } = get();
    if (!config) return;
    const question = questions[currentIndex];
    const timeMs = Date.now() - questionStartTime;
    const record = checkAnswer(question, userAnswer, config.allowClose, timeMs);
    set({ phase: 'feedback', answers: [...answers, record] });
  },

  submitPairAnswer(countryAnswer, capitalAnswer) {
    const { config, questions, currentIndex, answers, questionStartTime } = get();
    if (!config) return;
    const { entity } = questions[currentIndex];
    // Split the time between the two parts so session totals stay accurate
    const timeMs = Math.round((Date.now() - questionStartTime) / 2);
    // Scored as two separate answers (a point each) so results show which part was missed
    const countryQuestion: QuizQuestion = {
      entity,
      correctAnswer: entity.name,
      options: [],
      prompt: 'Which country is highlighted?',
    };
    const capitalQuestion: QuizQuestion = {
      entity,
      correctAnswer: entity.capital,
      acceptedAnswers: entity.altCapitals,
      options: [],
      prompt: `What is the capital of ${entity.name}?`,
    };
    set({
      phase: 'feedback',
      answers: [
        ...answers,
        checkAnswer(countryQuestion, countryAnswer, config.allowClose, timeMs),
        checkAnswer(capitalQuestion, capitalAnswer, config.allowClose, timeMs),
      ],
    });
  },

  advanceQuestion() {
    const { questions, currentIndex, answers, config } = get();
    const next = currentIndex + 1;
    if (next >= questions.length) {
      const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0);
      const score = answers.filter((a) => a.correct).length;
      const session: SessionResult = {
        config: config!,
        answers,
        totalTimeMs,
        score,
        completedAt: Date.now(),
      };
      set({ phase: 'complete', lastSession: session });
    } else {
      set({ phase: 'question', currentIndex: next, questionStartTime: Date.now() });
    }
  },

  completeMatching(records) {
    const { config } = get();
    if (!config) return;
    const totalTimeMs = records.reduce((sum, a) => sum + a.timeMs, 0);
    const score = records.filter((a) => a.correct).length;
    const session: SessionResult = {
      config,
      answers: records,
      totalTimeMs,
      score,
      completedAt: Date.now(),
    };
    set({ phase: 'complete', lastSession: session, answers: records });
  },

  resetSession() {
    set({ phase: 'idle', questions: [], currentIndex: 0, answers: [] });
  },
}));
