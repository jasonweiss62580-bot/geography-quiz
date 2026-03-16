import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroRegionId, MicroRegionId } from '../data/world-regions';

interface WorldSettingsState {
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
  selectedMacro: MacroRegionId;
  selectedMicro: MicroRegionId;
  setQuestionCount: (n: number) => void;
  setShowTimer: (v: boolean) => void;
  setAllowClose: (v: boolean) => void;
  setSelectedMacro: (macro: MacroRegionId) => void;
  setSelectedMicro: (micro: MicroRegionId) => void;
}

export const useWorldSettingsStore = create<WorldSettingsState>()(
  persist(
    (set) => ({
      questionCount: 10,
      showTimer: true,
      allowClose: false,
      selectedMacro: 'americas',
      selectedMicro: 'north-america',
      setQuestionCount: (n) => set({ questionCount: Math.min(50, Math.max(1, n)) }),
      setShowTimer: (v) => set({ showTimer: v }),
      setAllowClose: (v) => set({ allowClose: v }),
      setSelectedMacro: (macro) => set({ selectedMacro: macro }),
      setSelectedMicro: (micro) => set({ selectedMicro: micro }),
    }),
    { name: 'world-quiz-settings' },
  ),
);
