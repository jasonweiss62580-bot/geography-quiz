import type { MacroRegionId, MicroRegionId, StudySetId } from '../../data/world-regions';
import { MACRO_REGIONS, getMicrosByMacro, getStudySetsByMacro, isMacroAvailable } from '../../data/world-regions';
import styles from './RegionSelector.module.css';


interface RegionSelectorProps {
  selectedMacro: MacroRegionId;
  selectedMicro: MicroRegionId;
  selectedStudySet: StudySetId | null;
  onMacroChange: (macro: MacroRegionId) => void;
  onMicroChange: (micro: MicroRegionId) => void;
  onStudySetChange: (id: StudySetId | null) => void;
}

export function RegionSelector({
  selectedMacro,
  selectedMicro,
  selectedStudySet,
  onMacroChange,
  onMicroChange,
  onStudySetChange,
}: RegionSelectorProps) {
  const micros = selectedMacro === 'all' ? [] : getMicrosByMacro(selectedMacro);
  // Class quizzes are filtered by the selected region ("All" shows every quiz)
  const studySets = selectedMacro === 'all'
    ? []
    : getStudySetsByMacro(selectedMacro).filter(
        (set) => selectedMicro === 'all' || set.regions.includes(selectedMicro),
      );

  function handleMacroClick(macroId: MacroRegionId) {
    onMacroChange(macroId);
    handleMicroClick('all');
  }

  function handleMicroClick(microId: MicroRegionId) {
    onMicroChange(microId);
    onStudySetChange(null);
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Region</p>

      {/* Macro row */}
      <div className={styles.macroRow}>
        <button
          className={`${styles.macroBtn} ${selectedMacro === 'all' ? styles.macroActive : ''}`}
          onClick={() => handleMacroClick('all')}
        >
          All
        </button>
        {MACRO_REGIONS.map((macro) => {
          const available = isMacroAvailable(macro.id);
          return (
            <button
              key={macro.id}
              className={`${styles.macroBtn} ${selectedMacro === macro.id ? styles.macroActive : ''} ${!available ? styles.macroDimmed : ''}`}
              onClick={() => available && handleMacroClick(macro.id)}
              disabled={!available}
              title={!available ? 'Coming soon' : undefined}
            >
              {macro.label}
            </button>
          );
        })}
      </div>

      {/* Micro chips — only when a specific macro is selected and has sub-regions */}
      {selectedMacro !== 'all' && micros.length > 0 && (
        <div className={styles.microRow}>
          <button
            className={`${styles.microChip} ${selectedMicro === 'all' ? styles.microActive : ''}`}
            onClick={() => handleMicroClick('all')}
          >
            All {MACRO_REGIONS.find((m) => m.id === selectedMacro)?.label}
          </button>
          {micros.map((micro) => (
            <button
              key={micro.id}
              className={`${styles.microChip} ${selectedMicro === micro.id ? styles.microActive : ''} ${!micro.available ? styles.microDimmed : ''}`}
              onClick={() => micro.available && handleMicroClick(micro.id)}
              disabled={!micro.available}
              title={!micro.available ? 'Coming soon' : undefined}
            >
              {micro.label}
              {!micro.available && <span className={styles.soonBadge}>Soon</span>}
            </button>
          ))}
        </div>
      )}

      {/* Class quiz chips — fixed country lists from a class study guide */}
      {studySets.length > 0 && (
        <div className={styles.studySetSection}>
          <p className={styles.subLabel}>Class quizzes</p>
          <div className={styles.studySetRow}>
            {studySets.map((set) => (
              <button
                key={set.id}
                className={`${styles.microChip} ${selectedStudySet === set.id ? styles.microActive : ''}`}
                // Tapping the chosen quiz again goes back to the whole region
                onClick={() => onStudySetChange(selectedStudySet === set.id ? null : set.id)}
              >
                {set.label}
                <span className={styles.rangeNote}>{set.range}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
