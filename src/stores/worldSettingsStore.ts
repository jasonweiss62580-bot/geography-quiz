import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorldSettingsState {
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
  setQuestionCount: (n: number) => void;
  setShowTimer: (v: boolean) => void;
  setAllowClose: (v: boolean) => void;
}

export const useWorldSettingsStore = create<WorldSettingsState>()(
  persist(
    (set) => ({
      questionCount: 10,
      showTimer: true,
      allowClose: false,
      setQuestionCount: (n) => set({ questionCount: Math.min(50, Math.max(1, n)) }),
      setShowTimer: (v) => set({ showTimer: v }),
      setAllowClose: (v) => set({ allowClose: v }),
    }),
    { name: 'world-quiz-settings' },
  ),
);
