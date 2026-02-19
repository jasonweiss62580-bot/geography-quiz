import { useCallback, memo } from 'react';
import { ComposableMap, Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import type { Feature, Geometry } from 'geojson';
import type { GeographicEntity } from '../../data/types';
import { fipsToEntity } from './mapUtils';
import styles from './USMap.module.css';

import geoUrl from 'us-atlas/states-10m.json';

interface USMapProps {
  highlightedIds?: string[];
  correctId?: string;
  wrongId?: string;
  interactive?: boolean;
  onStateClick?: (entity: GeographicEntity) => void;
}

function getFill(fips: string, highlightedIds: string[], correctId?: string, wrongId?: string): string {
  if (correctId && fips === correctId) return '#4ade80';
  if (wrongId && fips === wrongId) return '#f87171';
  if (highlightedIds.includes(fips)) return '#fbbf24';
  return '#cbd5e1';
}

// Stable geography prop — module-level constant so it never changes reference
const GEO_URL = geoUrl as unknown as Parameters<typeof Geographies>[0]['geography'];

export const USMap = memo(function USMap({
  highlightedIds = [],
  correctId,
  wrongId,
  interactive = false,
  onStateClick,
}: USMapProps) {
  // Stable children callback — only recreated when rendering inputs change.
  // This prevents the library's internal GeographiesContent from unmounting/remounting
  // on every render (which would cause states to flicker and lose click events).
  const renderGeographies = useCallback(
    ({ geographies }: { geographies: Feature<Geometry>[] }) =>
      geographies.map((geo) => {
        const fips = String(
          (geo as Feature<Geometry> & { id?: string | number }).id ?? '',
        ).padStart(2, '0');
        const fill = getFill(fips, highlightedIds, correctId, wrongId);
        return (
          <Geography
            key={fips}
            geography={geo}
            className={`${styles.geography} ${interactive ? styles.interactive : ''}`}
            style={{
              default: { fill, outline: 'none' },
              hover: { fill: interactive ? '#94a3b8' : fill, outline: 'none' },
              pressed: { fill, outline: 'none' },
            }}
            onClick={
              interactive && onStateClick
                ? () => {
                    const entity = fipsToEntity(fips);
                    if (entity) onStateClick(entity);
                  }
                : undefined
            }
          />
        );
      }),
    // Re-create only when map appearance or interaction inputs change
    [highlightedIds, correctId, wrongId, interactive, onStateClick],
  );

  return (
    <div className={styles.wrapper}>
      <ComposableMap
        projection="geoAlbersUsa"
        className={styles.map}
        width={800}
        height={500}
      >
        <Geographies geography={GEO_URL}>
          {renderGeographies}
        </Geographies>
      </ComposableMap>
    </div>
  );
});
