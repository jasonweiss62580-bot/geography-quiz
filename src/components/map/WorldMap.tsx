import { useCallback, memo } from 'react';
import { ComposableMap, Geographies, Geography, createCoordinates } from '@vnedyalk0v/react19-simple-maps';
import type { Feature, Geometry } from 'geojson';
import type { GeographicEntity } from '../../data/types';
import type { MacroRegionId } from '../../data/world-regions';
import { MACRO_REGION_ISO_CODES } from '../../data/world-regions';
import { isoToEntity } from './worldMapUtils';
import styles from './WorldMap.module.css';

import geoUrl from 'world-atlas/countries-110m.json';

const GEO_URL = geoUrl as unknown as Parameters<typeof Geographies>[0]['geography'];

/** Projection config per macro region */
const REGION_VIEW: Record<string, { center: ReturnType<typeof createCoordinates>; scale: number }> = {
  all:      { center: createCoordinates(0, 20),     scale: 140 },
  americas: { center: createCoordinates(-80, 12),   scale: 380 },
  europe:   { center: createCoordinates(15, 52),    scale: 650 },
  africa:   { center: createCoordinates(20, 0),     scale: 380 },
  asia:     { center: createCoordinates(90, 30),    scale: 270 },
  oceania:  { center: createCoordinates(145, -28),  scale: 380 },
};

function getFill(
  iso: string,
  highlightedIds: string[],
  correctId?: string,
  wrongId?: string,
): string {
  if (correctId && iso === correctId) return '#4ade80';
  if (wrongId && iso === wrongId) return '#f87171';
  if (highlightedIds.includes(iso)) return '#fbbf24';
  return '#cbd5e1';
}

interface WorldMapProps {
  macroRegion?: MacroRegionId;
  /** ISO codes the user can click (quiz pool). If undefined, all rendered countries are interactive. */
  clickableIds?: string[];
  highlightedIds?: string[];
  correctId?: string;
  wrongId?: string;
  interactive?: boolean;
  onCountryClick?: (entity: GeographicEntity) => void;
}

export const WorldMap = memo(function WorldMap({
  macroRegion = 'americas',
  clickableIds,
  highlightedIds = [],
  correctId,
  wrongId,
  interactive = false,
  onCountryClick,
}: WorldMapProps) {
  const view = REGION_VIEW[macroRegion] ?? REGION_VIEW.americas;
  const visibleIso = macroRegion === 'all' ? null : (MACRO_REGION_ISO_CODES[macroRegion] ?? null);

  const renderGeographies = useCallback(
    ({ geographies }: { geographies: Feature<Geometry>[] }) =>
      geographies
        .filter((geo) => {
          if (!visibleIso) return true; // show all for 'all'
          const id = String((geo as Feature<Geometry> & { id?: string | number }).id ?? '');
          return visibleIso.includes(id);
        })
        .map((geo) => {
          const id = String((geo as Feature<Geometry> & { id?: string | number }).id ?? '');
          const isClickable = interactive && (!clickableIds || clickableIds.includes(id));
          const fill = getFill(id, highlightedIds, correctId, wrongId);

          return (
            <Geography
              key={id}
              geography={geo}
              className={`${styles.geography} ${isClickable ? styles.interactive : ''}`}
              style={{
                default: { fill, outline: 'none' },
                hover: { fill: isClickable ? '#94a3b8' : fill, outline: 'none' },
                pressed: { fill, outline: 'none' },
              }}
              onClick={
                isClickable && onCountryClick
                  ? () => {
                      const entity = isoToEntity(id);
                      if (entity) onCountryClick(entity);
                    }
                  : undefined
              }
            />
          );
        }),
    [visibleIso, highlightedIds, correctId, wrongId, interactive, clickableIds, onCountryClick],
  );

  return (
    <div className={styles.wrapper}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: view.center, scale: view.scale }}
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
