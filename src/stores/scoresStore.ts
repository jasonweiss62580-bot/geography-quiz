import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionResult } from '../data/types';

interface HighScore {
  score: number;
  total: number;       // questions in that session — needed for correct display
  totalTimeMs: number;
  completedAt: number;
}

type ScoreKey = string;

interface ScoresState {
  scores: Record<ScoreKey, HighScore>;
  updateScore: (result: SessionResult) => void;
  getHighScore: (key: ScoreKey) => HighScore | null;
}

export function makeScoreKey(result: SessionResult): ScoreKey {
  const { topicId, modeId, formatId, usRegion, worldRegion } = result.config;
  const region = usRegion ?? worldRegion ?? 'all';
  return `${topicId}:${modeId}:${formatId}:${region}`;
}

export const useScoresStore = create<ScoresState>()(
  persist(
    (set, get) => ({
      scores: {},

      updateScore(result) {
        const key = makeScoreKey(result);
        const existing = get().scores[key];
        const total = result.answers.length;
        const newPct = total > 0 ? result.score / total : 0;
        const existingPct = existing && existing.total > 0 ? existing.score / existing.total : 0;

        const isHigher = !existing || newPct > existingPct;
        const isFaster =
          existing &&
          newPct === existingPct &&
          result.totalTimeMs < existing.totalTimeMs;

        if (isHigher || isFaster) {
          set((state) => ({
            scores: {
              ...state.scores,
              [key]: {
                score: result.score,
                total,
                totalTimeMs: result.totalTimeMs,
                completedAt: result.completedAt,
              },
            },
          }));
        }
      },

      getHighScore(key) {
        return get().scores[key] ?? null;
      },
    }),
    { name: 'geography-quiz-scores' },
  ),
);
