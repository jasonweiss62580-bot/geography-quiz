import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroRegionId, MicroRegionId, StudySetId } from '../data/world-regions';
import { getStudySet } from '../data/world-regions';

interface WorldSettingsState {
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
  selectedMacro: MacroRegionId;
  selectedMicro: MicroRegionId;
  /** Class quiz chosen within the selected region, or null for the whole region */
  selectedStudySet: StudySetId | null;
  setQuestionCount: (n: number) => void;
  setShowTimer: (v: boolean) => void;
  setAllowClose: (v: boolean) => void;
  setSelectedMacro: (macro: MacroRegionId) => void;
  setSelectedMicro: (micro: MicroRegionId) => void;
  setSelectedStudySet: (id: StudySetId | null) => void;
}

export const useWorldSettingsStore = create<WorldSettingsState>()(
  persist(
    (set) => ({
      questionCount: 10,
      showTimer: true,
      allowClose: false,
      selectedMacro: 'americas',
      selectedMicro: 'north-america',
      selectedStudySet: null,
      setQuestionCount: (n) => set({ questionCount: Math.min(50, Math.max(1, n)) }),
      setShowTimer: (v) => set({ showTimer: v }),
      setAllowClose: (v) => set({ allowClose: v }),
      setSelectedMacro: (macro) => set({ selectedMacro: macro }),
      setSelectedMicro: (micro) => set({ selectedMicro: micro }),
      setSelectedStudySet: (id) => set({ selectedStudySet: id }),
    }),
    {
      name: 'world-quiz-settings',
      version: 1,
      // v0 stored a chosen class quiz in selectedMicro; move it to selectedStudySet
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 1 && typeof state.selectedMicro === 'string' && getStudySet(state.selectedMicro)) {
          return { ...state, selectedStudySet: state.selectedMicro, selectedMicro: 'all' };
        }
        return state;
      },
    },
  ),
);
