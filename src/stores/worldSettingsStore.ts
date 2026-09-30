import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroRegionId, MicroRegionId, StudySetId } from '../data/world-regions';
import { STUDY_SETS, getStudySet } from '../data/world-regions';

interface WorldSettingsState {
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
  selectedMacro: MacroRegionId;
  selectedMicro: MicroRegionId;
  /** Class quizzes chosen within the selected region; empty means the whole region */
  selectedStudySets: StudySetId[];
  setQuestionCount: (n: number) => void;
  setShowTimer: (v: boolean) => void;
  setAllowClose: (v: boolean) => void;
  setSelectedMacro: (macro: MacroRegionId) => void;
  setSelectedMicro: (micro: MicroRegionId) => void;
  setSelectedStudySets: (ids: StudySetId[]) => void;
}

export const useWorldSettingsStore = create<WorldSettingsState>()(
  persist(
    (set) => ({
      questionCount: 10,
      showTimer: true,
      allowClose: false,
      selectedMacro: 'americas',
      selectedMicro: 'north-america',
      selectedStudySets: [],
      setQuestionCount: (n) => set({ questionCount: Math.min(50, Math.max(1, n)) }),
      setShowTimer: (v) => set({ showTimer: v }),
      setAllowClose: (v) => set({ allowClose: v }),
      setSelectedMacro: (macro) => set({ selectedMacro: macro }),
      setSelectedMicro: (micro) => set({ selectedMicro: micro }),
      setSelectedStudySets: (ids) => set({ selectedStudySets: ids }),
    }),
    {
      name: 'world-quiz-settings',
      version: 2,
      // v0 stored one class quiz in selectedMicro; v1 stored one in selectedStudySet.
      // v2 stores a list in selectedStudySets.
      migrate: (persisted, version) => {
        let state = persisted as Record<string, unknown>;
        if (version < 1 && typeof state.selectedMicro === 'string' && getStudySet(state.selectedMicro)) {
          state = { ...state, selectedStudySet: state.selectedMicro, selectedMicro: 'all' };
        }
        if (version < 2) {
          const { selectedStudySet, ...rest } = state;
          const valid = STUDY_SETS.some((s) => s.id === selectedStudySet);
          state = { ...rest, selectedStudySets: valid ? [selectedStudySet] : [] };
        }
        return state;
      },
    },
  ),
);
