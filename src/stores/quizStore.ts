import { create } from 'zustand';
import type { QuizConfig, QuizQuestion, AnswerRecord, SessionResult } from '../data/types';
import { generateQuestions } from '../lib/quiz-engine';
import { US_STATES } from '../data/us-states';
import { WORLD_COUNTRIES } from '../data/world-countries';
import { isClose } from '../lib/levenshtein';

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

function getPool(topicId: string) {
  return topicId === 'us-states' ? US_STATES : WORLD_COUNTRIES;
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
    const pool = getPool(config.topicId);
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
    const normalized = userAnswer.trim().toLowerCase();
    const target = question.correctAnswer.trim().toLowerCase();
    const exact = normalized === target;
    const close = !exact && isClose(normalized, target);
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
