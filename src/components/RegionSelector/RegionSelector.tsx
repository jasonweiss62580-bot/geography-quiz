import type { MacroRegionId, MicroRegionId } from '../../data/world-regions';
import { MACRO_REGIONS, getMicrosByMacro, isMacroAvailable } from '../../data/world-regions';
import styles from './RegionSelector.module.css';

interface RegionSelectorProps {
  selectedMacro: MacroRegionId;
  selectedMicro: MicroRegionId;
  onMacroChange: (macro: MacroRegionId) => void;
  onMicroChange: (micro: MicroRegionId) => void;
}

export function RegionSelector({
  selectedMacro,
  selectedMicro,
  onMacroChange,
  onMicroChange,
}: RegionSelectorProps) {
  const micros = selectedMacro === 'all' ? [] : getMicrosByMacro(selectedMacro);

  function handleMacroClick(macroId: MacroRegionId) {
    onMacroChange(macroId);
    onMicroChange('all'); // reset micro when changing macro
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

      {/* Micro chips — only when a specific macro is selected */}
      {selectedMacro !== 'all' && micros.length > 0 && (
        <div className={styles.microRow}>
          <button
            className={`${styles.microChip} ${selectedMicro === 'all' ? styles.microActive : ''}`}
            onClick={() => onMicroChange('all')}
          >
            All {MACRO_REGIONS.find((m) => m.id === selectedMacro)?.label}
          </button>
          {micros.map((micro) => (
            <button
              key={micro.id}
              className={`${styles.microChip} ${selectedMicro === micro.id ? styles.microActive : ''} ${!micro.available ? styles.microDimmed : ''}`}
              onClick={() => micro.available && onMicroChange(micro.id)}
              disabled={!micro.available}
              title={!micro.available ? 'Coming soon' : undefined}
            >
              {micro.label}
              {!micro.available && <span className={styles.soonBadge}>Soon</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
