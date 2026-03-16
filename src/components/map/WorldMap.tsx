import { useMemo, memo } from 'react';
import { ComposableMap, useMapContext, createCoordinates } from '@vnedyalk0v/react19-simple-maps';
import type { ProjectionConfig } from '@vnedyalk0v/react19-simple-maps';

// createRotationAngles is not exported by the library; replicate its branded cast.
function asRotation(r: [number, number, number]): ProjectionConfig['rotate'] {
  return r as ProjectionConfig['rotate'];
}
import type { Feature, Geometry } from 'geojson';
import type { GeographicEntity } from '../../data/types';
import type { MacroRegionId } from '../../data/world-regions';
import { MACRO_REGION_ISO_CODES } from '../../data/world-regions';
import { isoToEntity } from './worldMapUtils';
import styles from './WorldMap.module.css';

import geoUrl from 'world-atlas/countries-50m.json';
import { feature as topoFeature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

// Pre-extract GeoJSON features once at module level — never changes
const WORLD_FEATURES = (
  topoFeature(
    geoUrl as unknown as Topology<{ countries: GeometryCollection }>,
    (geoUrl as unknown as Topology<{ countries: GeometryCollection }>).objects.countries,
  ) as unknown as { features: Feature<Geometry>[] }
).features;

/** Projection config per region (macro or micro). Micro-region keys take priority.
 *  `rotate` shifts the antimeridian cut; needed for Europe so Russia (which spans ±180°)
 *  projects correctly. Coords in `center` are in the rotated frame (lon - rotate[0]).
 */
const REGION_VIEW: Record<string, { center: [number, number]; scale: number; rotate?: [number, number, number] }> = {
  // ── Global ──────────────────────────────────────────────────────────────────
  all:      { center: [0, 20],       scale: 140 },

  // ── Americas ─────────────────────────────────────────────────────────────────
  americas:                     { center: [-80, 10],   scale: 175 },
  'north-america':              { center: [-100, 50],  scale: 300 },
  'central-america-caribbean':  { center: [-76, 16],   scale: 1300 },
  'south-america':              { center: [-58, -25],  scale: 360 },

  // ── Europe ───────────────────────────────────────────────────────────────────
  // rotate: [-15, 0, 0] moves the antimeridian cut to -165°W (Pacific), so Russia's
  // path projects correctly. Center coords are in the rotated frame (geo lon − 15).
  europe:           { center: [15, 52], scale: 420, rotate: [15, 0, 0] },
  'western-europe': { center: [33, 48], scale: 420, rotate: [15, 0, 0] },
  'eastern-europe': { center: [28, 50], scale: 580, rotate: [15, 0, 0] },

  // ── Africa ───────────────────────────────────────────────────────────────────
  africa:            { center: [20, 0],    scale: 380 },
  'north-africa':    { center: [17, 27],   scale: 530 },
  'west-africa':     { center: [-3, 12],   scale: 650 },
  'middle-africa':   { center: [20, -1],   scale: 620 },
  'eastern-africa':  { center: [38, -5],   scale: 520 },
  'southern-africa': { center: [26, -24],  scale: 620 },

  // ── Asia ─────────────────────────────────────────────────────────────────────
  asia:                   { center: [90, 30],   scale: 320 },
  'middle-east':          { center: [42, 30],   scale: 620 },
  'central-asia':         { center: [63, 42],   scale: 470 },
  'south-asia':           { center: [78, 22],   scale: 620 },
  'east-southeast-asia':  { center: [112, 25],  scale: 380 },

  // ── Oceania ──────────────────────────────────────────────────────────────────
  // rotate: [-165, 0, 0] moves the antimeridian cut to ~15°W (Atlantic), so
  // Samoa and Tonga (at ~175°W) project correctly without being clipped.
  // center is in the rotated frame: center_geographic = center_param - rotate[0]
  // So [0, -22] with rotate[-165,0,0] → geographic center 0-(-165) = 165°E (central Pacific)
  oceania: { center: [0, -22], scale: 300, rotate: [-165, 0, 0] },
};

/**
 * Small island nations that are too tiny to click reliably as Geography paths.
 * Rendered as marker circles on top of the main map.
 * `macro` controls which macro-region view shows the marker.
 * Coordinates are approximate island centers [lon, lat].
 */
const SMALL_ISLAND_MARKERS: Array<{ iso: string; coords: [number, number]; macro: string }> = [
  // Caribbean / Americas
  { iso: '28',  coords: [-61.80, 17.27], macro: 'americas' }, // Antigua and Barbuda
  { iso: '44',  coords: [-77.35, 25.05], macro: 'americas' }, // Bahamas
  { iso: '52',  coords: [-59.54, 13.19], macro: 'americas' }, // Barbados
  { iso: '212', coords: [-61.37, 15.42], macro: 'americas' }, // Dominica
  { iso: '308', coords: [-61.68, 12.12], macro: 'americas' }, // Grenada
  { iso: '388', coords: [-77.31, 18.11], macro: 'americas' }, // Jamaica
  { iso: '659', coords: [-62.79, 17.36], macro: 'americas' }, // Saint Kitts and Nevis
  { iso: '662', coords: [-60.98, 13.91], macro: 'americas' }, // Saint Lucia
  { iso: '670', coords: [-61.20, 13.26], macro: 'americas' }, // Saint Vincent and the Grenadines
  { iso: '780', coords: [-61.25, 10.50], macro: 'americas' }, // Trinidad and Tobago
  // Africa islands
  { iso: '132', coords: [-23.60, 14.93], macro: 'africa' }, // Cabo Verde
  { iso: '678', coords: [  6.61,  0.19], macro: 'africa' }, // São Tomé and Príncipe
  { iso: '174', coords: [ 43.37,-11.64], macro: 'africa' }, // Comoros
  { iso: '480', coords: [ 57.55,-20.27], macro: 'africa' }, // Mauritius
  { iso: '690', coords: [ 55.49, -4.62], macro: 'africa' }, // Seychelles
  // Asia islands
  { iso: '48',  coords: [ 50.54, 26.07], macro: 'asia' }, // Bahrain
  { iso: '462', coords: [ 73.51,  3.20], macro: 'asia' }, // Maldives
  { iso: '702', coords: [103.82,  1.35], macro: 'asia' }, // Singapore
  // Oceania islands
  { iso: '585', coords: [134.58,  7.51], macro: 'oceania' }, // Palau
  { iso: '583', coords: [158.24,  6.92], macro: 'oceania' }, // Micronesia
  { iso: '520', coords: [166.93, -0.53], macro: 'oceania' }, // Nauru
  { iso: '296', coords: [173.00,  1.42], macro: 'oceania' }, // Kiribati (Gilbert Islands)
  { iso: '584', coords: [171.18,  7.11], macro: 'oceania' }, // Marshall Islands
  { iso: '798', coords: [179.21, -8.00], macro: 'oceania' }, // Tuvalu
  { iso: '882', coords: [-172.50,-13.50], macro: 'oceania' }, // Samoa
  { iso: '776', coords: [-175.20,-21.20], macro: 'oceania' }, // Tonga
  { iso: '90',  coords: [160.00, -8.00], macro: 'oceania' }, // Solomon Islands
  { iso: '242', coords: [178.00,-17.90], macro: 'oceania' }, // Fiji
  { iso: '548', coords: [167.00,-16.70], macro: 'oceania' }, // Vanuatu
  // Europe islands
  { iso: '470', coords: [ 14.38, 35.90], macro: 'europe'  }, // Malta
  { iso: '196', coords: [ 33.00, 35.10], macro: 'europe'  }, // Cyprus
];

const SMALL_ISLAND_ISO_SET = new Set(SMALL_ISLAND_MARKERS.map((m) => m.iso));

/**
 * Countries whose SVG path click-hit detection is unreliable due to antimeridian
 * crossing or extreme geographic extent. A transparent clickable circle is rendered
 * at the given coordinate so the user can reliably click/tap the country.
 * Coords are [lon, lat] of the click target (typically the capital or geographic center).
 */
const COUNTRY_CLICK_OVERLAYS: Array<{ iso: string; coords: [number, number] }> = [
  { iso: '643', coords: [37.6, 55.75] }, // Russia — Moscow
];

/**
 * Normalize a topojson feature ID to an unpadded numeric string.
 * world-atlas stores IDs as zero-padded strings ("028", "052") but our
 * WORLD_COUNTRIES data uses unpadded values ("28", "52").
 */
function geoId(geo: Feature<Geometry>): string {
  const raw = (geo as Feature<Geometry> & { id?: string | number }).id;
  if (raw == null) return '';
  const n = parseInt(String(raw), 10);
  return isNaN(n) ? String(raw) : String(n);
}

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
  /** Override projection with a micro- or macro-region key (e.g. 'north-america'). */
  regionId?: string;
  /** ISO codes the user can click (quiz pool). If undefined, all rendered countries are interactive. */
  clickableIds?: string[];
  highlightedIds?: string[];
  correctId?: string;
  wrongId?: string;
  interactive?: boolean;
  onCountryClick?: (entity: GeographicEntity) => void;
}

interface InnerProps extends WorldMapProps {
  visibleIso: string[] | null;
}

/**
 * Inner component that consumes MapContext directly. By calling path(geo) ourselves
 * we bypass the Geographies component's module-level LRU cache, which was keyed on
 * featureIds + path.toString(). Since path.toString() always returns the same D3 source
 * code regardless of projection parameters, that cache never invalidated on region change.
 */
function WorldGeographies({
  macroRegion = 'americas',
  visibleIso,
  clickableIds,
  highlightedIds = [],
  correctId,
  wrongId,
  interactive = false,
  onCountryClick,
}: InnerProps) {
  // path and projection come fresh from context — no LRU caching
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { path, projection } = useMapContext() as { path: any; projection: any };

  const visibleFeatures = useMemo(
    () => (visibleIso ? WORLD_FEATURES.filter((geo) => visibleIso.includes(geoId(geo))) : WORLD_FEATURES),
    [visibleIso],
  );

  // Compute SVG path strings for all visible country polygons.
  // This memo only re-runs when the projection or visible region changes — not on
  // every highlight/feedback update — keeping re-render cost minimal.
  const pathData = useMemo(
    () =>
      visibleFeatures
        .filter((geo) => !SMALL_ISLAND_ISO_SET.has(geoId(geo)))
        .map((geo) => ({ id: geoId(geo), d: path(geo) as string | null }))
        .filter((item): item is { id: string; d: string } => item.d !== null),
    // path is a new function reference whenever ComposableMap remounts (key change) or
    // its projectionConfig changes, so this correctly re-runs on region switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleFeatures, path],
  );

  // Pre-project marker positions for the current macro region; only recomputes when projection changes.
  const markerPositions = useMemo(
    () =>
      SMALL_ISLAND_MARKERS
        .filter((m) => macroRegion === 'all' || m.macro === macroRegion)
        .map(({ iso, coords }) => {
          const pos = projection(coords) as [number, number] | null;
          return pos ? { iso, x: pos[0], y: pos[1] } : null;
        })
        .filter((m): m is { iso: string; x: number; y: number } => m !== null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [macroRegion, projection],
  );

  // Transparent click overlays for countries with unreliable path hit-testing.
  const overlayPositions = useMemo(
    () =>
      COUNTRY_CLICK_OVERLAYS
        .map(({ iso, coords }) => {
          const pos = projection(coords) as [number, number] | null;
          return pos ? { iso, x: pos[0], y: pos[1] } : null;
        })
        .filter((o): o is { iso: string; x: number; y: number } => o !== null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projection],
  );

  return (
    <>
      {pathData.map(({ id, d }) => {
        const isClickable = interactive && !SMALL_ISLAND_ISO_SET.has(id) && (!clickableIds || clickableIds.includes(id));
        const fill = getFill(id, highlightedIds, correctId, wrongId);
        return (
          <path
            key={id}
            d={d}
            fill={fill}
            className={`${styles.geography} ${isClickable ? styles.interactive : ''}`}
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
      })}

      {markerPositions.map(({ iso, x, y }) => {
          if (clickableIds && !clickableIds.includes(iso)) return null;
          const fill = getFill(iso, highlightedIds, correctId, wrongId);
          const isActive = highlightedIds.includes(iso) || iso === correctId || iso === wrongId;
          const isClickable = interactive && (!clickableIds || clickableIds.includes(iso));
          return (
            <circle
              key={`marker-${iso}`}
              cx={x}
              cy={y}
              r={isActive ? 9 : 6}
              fill={fill}
              stroke="white"
              strokeWidth={1.5}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
              onClick={
                isClickable && onCountryClick
                  ? (e) => {
                      e.stopPropagation();
                      const entity = isoToEntity(iso);
                      if (entity) onCountryClick(entity);
                    }
                  : undefined
              }
            />
          );
        })}

      {overlayPositions.map(({ iso, x, y }) => {
        if (visibleIso && !visibleIso.includes(iso)) return null;
        if (clickableIds && !clickableIds.includes(iso)) return null;
        const isClickable = interactive && (!clickableIds || clickableIds.includes(iso));
        return (
          <circle
            key={`clickoverlay-${iso}`}
            cx={x}
            cy={y}
            r={60}
            fill="transparent"
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
            onClick={
              isClickable && onCountryClick
                ? (e) => {
                    e.stopPropagation();
                    const entity = isoToEntity(iso);
                    if (entity) onCountryClick(entity);
                  }
                : undefined
            }
          />
        );
      })}
    </>
  );
}


export const WorldMap = memo(function WorldMap({
  macroRegion = 'americas',
  regionId,
  clickableIds,
  highlightedIds = [],
  correctId,
  wrongId,
  interactive = false,
  onCountryClick,
}: WorldMapProps) {
  const view = REGION_VIEW[regionId ?? macroRegion] ?? REGION_VIEW[macroRegion] ?? REGION_VIEW.americas;
  const visibleIso = macroRegion === 'all' ? null : (MACRO_REGION_ISO_CODES[macroRegion] ?? null);

  return (
    <div className={styles.wrapper}>
      <ComposableMap
        key={`${view.scale}-${view.center[0]}-${view.center[1]}-${view.rotate?.join(',') ?? ''}`}
        projection="geoMercator"
        projectionConfig={{
          center: createCoordinates(view.center[0], view.center[1]),
          scale: view.scale,
          ...(view.rotate ? { rotate: asRotation(view.rotate) } : {}),
        }}
        className={styles.map}
        width={800}
        height={500}
      >
        <WorldGeographies
          macroRegion={macroRegion}
          regionId={regionId}
          visibleIso={visibleIso}
          clickableIds={clickableIds}
          highlightedIds={highlightedIds}
          correctId={correctId}
          wrongId={wrongId}
          interactive={interactive}
          onCountryClick={onCountryClick}
        />
      </ComposableMap>
    </div>
  );
});
