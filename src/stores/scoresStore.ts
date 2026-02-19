import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionResult } from '../data/types';

interface HighScore {
  score: number;
  totalTimeMs: number;
  completedAt: number;
}

type ScoreKey = string; // `${topicId}:${modeId}:${formatId}`

interface ScoresState {
  scores: Record<ScoreKey, HighScore>;
  updateScore: (result: SessionResult) => void;
  getHighScore: (key: ScoreKey) => HighScore | null;
}

export function makeScoreKey(result: SessionResult): ScoreKey {
  const { topicId, modeId, formatId } = result.config;
  return `${topicId}:${modeId}:${formatId}`;
}

export const useScoresStore = create<ScoresState>()(
  persist(
    (set, get) => ({
      scores: {},

      updateScore(result) {
        const key = makeScoreKey(result);
        const existing = get().scores[key];
        const newScore: HighScore = {
          score: result.score,
          totalTimeMs: result.totalTimeMs,
          completedAt: result.completedAt,
        };
        const maxPossible = result.answers.length;
        const isHigher = !existing || result.score > existing.score;
        const isFaster =
          existing &&
          result.score === existing.score &&
          result.totalTimeMs < existing.totalTimeMs;
        if (isHigher || isFaster) {
          set((state) => ({
            scores: { ...state.scores, [key]: newScore },
          }));
        }
        // keep max possible for context but don't store it (can be derived)
        void maxPossible;
      },

      getHighScore(key) {
        return get().scores[key] ?? null;
      },
    }),
    { name: 'geography-quiz-scores' },
  ),
);
