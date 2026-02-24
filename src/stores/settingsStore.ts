import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { USRegionId } from '../data/us-regions';

interface SettingsState {
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
  selectedUSRegion: USRegionId;
  setQuestionCount: (n: number) => void;
  setShowTimer: (v: boolean) => void;
  setAllowClose: (v: boolean) => void;
  setSelectedUSRegion: (r: USRegionId) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      questionCount: 10,
      showTimer: true,
      allowClose: false,
      selectedUSRegion: 'all',
      setQuestionCount: (n) => set({ questionCount: Math.min(50, Math.max(1, n)) }),
      setShowTimer: (v) => set({ showTimer: v }),
      setAllowClose: (v) => set({ allowClose: v }),
      setSelectedUSRegion: (r) => set({ selectedUSRegion: r }),
    }),
    { name: 'geography-quiz-settings' },
  ),
);
