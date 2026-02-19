import type { GeographicEntity } from '../../data/types';
import { US_STATES } from '../../data/us-states';

const fipsMap = new Map<string, GeographicEntity>(
  US_STATES.map((s) => [s.svgId, s]),
);

export function fipsToEntity(fips: string): GeographicEntity | undefined {
  // Normalize: pad to 2 digits
  const padded = fips.padStart(2, '0');
  return fipsMap.get(padded);
}
