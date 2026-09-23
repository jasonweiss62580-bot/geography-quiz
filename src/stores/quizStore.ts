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
    const normalized = normalizeAnswer(userAnswer);
    const targets = [question.correctAnswer, ...(question.acceptedAnswers ?? [])]
      .map(normalizeAnswer);
    const exact = targets.includes(normalized);
    const close = !exact && targets.some((t) => isClose(normalized, t));
    const correct = exact || (config.allowClose && close);
    const record: AnswerRecord = {
      question,
      userAnswer,
      correct,
      wasClose: close,
      timeMs,
    };
    set({ phase: 'feedback', answers: [...answers, record] });
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
