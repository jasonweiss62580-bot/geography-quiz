import type { USRegionId } from '../../data/us-regions';
import { US_REGIONS } from '../../data/us-regions';
import styles from './USRegionSelector.module.css';

interface USRegionSelectorProps {
  selected: USRegionId;
  onChange: (region: USRegionId) => void;
}

export function USRegionSelector({ selected, onChange }: USRegionSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Region</p>
      <div className={styles.chips}>
        <button
          className={`${styles.chip} ${selected === 'all' ? styles.active : ''}`}
          onClick={() => onChange('all')}
        >
          All States
        </button>
        {US_REGIONS.map((region) => (
          <button
            key={region.id}
            className={`${styles.chip} ${selected === region.id ? styles.active : ''}`}
            onClick={() => onChange(region.id)}
          >
            {region.label}
          </button>
        ))}
      </div>
    </div>
  );
}
