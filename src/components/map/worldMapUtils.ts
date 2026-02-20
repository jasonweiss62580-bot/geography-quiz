import type { GeographicEntity } from '../../data/types';
import { WORLD_COUNTRIES } from '../../data/world-countries';

/** ISO numeric code (as string) → GeographicEntity */
const isoMap = new Map<string, GeographicEntity>(
  WORLD_COUNTRIES.map((c) => [c.svgId, c]),
);

export function isoToEntity(isoNumeric: string): GeographicEntity | undefined {
  return isoMap.get(isoNumeric);
}
