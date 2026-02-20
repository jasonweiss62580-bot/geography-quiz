import type { GeographicEntity } from './types';

/**
 * World countries for the geography quiz.
 * svgId = ISO 3166-1 numeric code (matches world-atlas TopoJSON feature IDs).
 * region = micro-region ID from world-regions.ts.
 *
 * Currently populated: North America + Central America & Caribbean.
 * Other regions (South America, Europe, Africa, Asia, Oceania) will be added later.
 */
export const WORLD_COUNTRIES: GeographicEntity[] = [
  // ── North America ────────────────────────────────────────────────────────────
  { name: 'Canada',         abbreviation: 'CA', capital: 'Ottawa',           svgId: '124', region: 'north-america' },
  { name: 'United States',  abbreviation: 'US', capital: 'Washington, D.C.', svgId: '840', region: 'north-america' },
  { name: 'Mexico',         abbreviation: 'MX', capital: 'Mexico City',      svgId: '484', region: 'north-america' },

  // ── Central America ──────────────────────────────────────────────────────────
  { name: 'Belize',         abbreviation: 'BZ', capital: 'Belmopan',         svgId: '84',  region: 'central-america-caribbean' },
  { name: 'Guatemala',      abbreviation: 'GT', capital: 'Guatemala City',   svgId: '320', region: 'central-america-caribbean' },
  { name: 'Honduras',       abbreviation: 'HN', capital: 'Tegucigalpa',      svgId: '340', region: 'central-america-caribbean' },
  { name: 'El Salvador',    abbreviation: 'SV', capital: 'San Salvador',     svgId: '222', region: 'central-america-caribbean' },
  { name: 'Nicaragua',      abbreviation: 'NI', capital: 'Managua',          svgId: '558', region: 'central-america-caribbean' },
  { name: 'Costa Rica',     abbreviation: 'CR', capital: 'San José',         svgId: '188', region: 'central-america-caribbean' },
  { name: 'Panama',         abbreviation: 'PA', capital: 'Panama City',      svgId: '591', region: 'central-america-caribbean' },

  // ── Caribbean ────────────────────────────────────────────────────────────────
  { name: 'Cuba',                            abbreviation: 'CU', capital: 'Havana',          svgId: '192', region: 'central-america-caribbean' },
  { name: 'Jamaica',                         abbreviation: 'JM', capital: 'Kingston',         svgId: '388', region: 'central-america-caribbean' },
  { name: 'Haiti',                           abbreviation: 'HT', capital: 'Port-au-Prince',   svgId: '332', region: 'central-america-caribbean' },
  { name: 'Dominican Republic',              abbreviation: 'DO', capital: 'Santo Domingo',    svgId: '214', region: 'central-america-caribbean' },
  { name: 'Trinidad and Tobago',             abbreviation: 'TT', capital: 'Port of Spain',    svgId: '780', region: 'central-america-caribbean' },
  { name: 'Bahamas',                         abbreviation: 'BS', capital: 'Nassau',           svgId: '44',  region: 'central-america-caribbean' },
  { name: 'Barbados',                        abbreviation: 'BB', capital: 'Bridgetown',       svgId: '52',  region: 'central-america-caribbean' },
  { name: 'Saint Lucia',                     abbreviation: 'LC', capital: 'Castries',         svgId: '662', region: 'central-america-caribbean' },
  { name: 'Saint Vincent and the Grenadines', abbreviation: 'VC', capital: 'Kingstown',       svgId: '670', region: 'central-america-caribbean' },
  { name: 'Grenada',                         abbreviation: 'GD', capital: "St. George's",     svgId: '308', region: 'central-america-caribbean' },
  { name: 'Antigua and Barbuda',             abbreviation: 'AG', capital: "Saint John's",     svgId: '28',  region: 'central-america-caribbean' },
  { name: 'Dominica',                        abbreviation: 'DM', capital: 'Roseau',           svgId: '212', region: 'central-america-caribbean' },
  { name: 'Saint Kitts and Nevis',           abbreviation: 'KN', capital: 'Basseterre',       svgId: '659', region: 'central-america-caribbean' },
];
