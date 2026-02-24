import type { GeographicEntity } from './types';

export const US_STATES: GeographicEntity[] = [
  // ── New England ──────────────────────────────────────────────────────────────
  { name: 'Connecticut',    abbreviation: 'CT', capital: 'Hartford',       svgId: '09', region: 'new-england' },
  { name: 'Maine',          abbreviation: 'ME', capital: 'Augusta',        svgId: '23', region: 'new-england' },
  { name: 'Massachusetts',  abbreviation: 'MA', capital: 'Boston',         svgId: '25', region: 'new-england' },
  { name: 'New Hampshire',  abbreviation: 'NH', capital: 'Concord',        svgId: '33', region: 'new-england' },
  { name: 'Rhode Island',   abbreviation: 'RI', capital: 'Providence',     svgId: '44', region: 'new-england' },
  { name: 'Vermont',        abbreviation: 'VT', capital: 'Montpelier',     svgId: '50', region: 'new-england' },

  // ── Mid-Atlantic ─────────────────────────────────────────────────────────────
  { name: 'Delaware',       abbreviation: 'DE', capital: 'Dover',          svgId: '10', region: 'mid-atlantic' },
  { name: 'Maryland',       abbreviation: 'MD', capital: 'Annapolis',      svgId: '24', region: 'mid-atlantic' },
  { name: 'New Jersey',     abbreviation: 'NJ', capital: 'Trenton',        svgId: '34', region: 'mid-atlantic' },
  { name: 'New York',       abbreviation: 'NY', capital: 'Albany',         svgId: '36', region: 'mid-atlantic' },
  { name: 'Pennsylvania',   abbreviation: 'PA', capital: 'Harrisburg',     svgId: '42', region: 'mid-atlantic' },

  // ── Southeast ────────────────────────────────────────────────────────────────
  { name: 'Alabama',        abbreviation: 'AL', capital: 'Montgomery',     svgId: '01', region: 'southeast' },
  { name: 'Arkansas',       abbreviation: 'AR', capital: 'Little Rock',    svgId: '05', region: 'southeast' },
  { name: 'Florida',        abbreviation: 'FL', capital: 'Tallahassee',    svgId: '12', region: 'southeast' },
  { name: 'Georgia',        abbreviation: 'GA', capital: 'Atlanta',        svgId: '13', region: 'southeast' },
  { name: 'Kentucky',       abbreviation: 'KY', capital: 'Frankfort',      svgId: '21', region: 'southeast' },
  { name: 'Louisiana',      abbreviation: 'LA', capital: 'Baton Rouge',    svgId: '22', region: 'southeast' },
  { name: 'Mississippi',    abbreviation: 'MS', capital: 'Jackson',        svgId: '28', region: 'southeast' },
  { name: 'North Carolina', abbreviation: 'NC', capital: 'Raleigh',        svgId: '37', region: 'southeast' },
  { name: 'South Carolina', abbreviation: 'SC', capital: 'Columbia',       svgId: '45', region: 'southeast' },
  { name: 'Tennessee',      abbreviation: 'TN', capital: 'Nashville',      svgId: '47', region: 'southeast' },
  { name: 'Virginia',       abbreviation: 'VA', capital: 'Richmond',       svgId: '51', region: 'southeast' },
  { name: 'West Virginia',  abbreviation: 'WV', capital: 'Charleston',     svgId: '54', region: 'southeast' },

  // ── Midwest ──────────────────────────────────────────────────────────────────
  { name: 'Illinois',       abbreviation: 'IL', capital: 'Springfield',    svgId: '17', region: 'midwest' },
  { name: 'Indiana',        abbreviation: 'IN', capital: 'Indianapolis',   svgId: '18', region: 'midwest' },
  { name: 'Iowa',           abbreviation: 'IA', capital: 'Des Moines',     svgId: '19', region: 'midwest' },
  { name: 'Kansas',         abbreviation: 'KS', capital: 'Topeka',         svgId: '20', region: 'midwest' },
  { name: 'Michigan',       abbreviation: 'MI', capital: 'Lansing',        svgId: '26', region: 'midwest' },
  { name: 'Minnesota',      abbreviation: 'MN', capital: 'Saint Paul',     svgId: '27', region: 'midwest' },
  { name: 'Missouri',       abbreviation: 'MO', capital: 'Jefferson City', svgId: '29', region: 'midwest' },
  { name: 'Nebraska',       abbreviation: 'NE', capital: 'Lincoln',        svgId: '31', region: 'midwest' },
  { name: 'North Dakota',   abbreviation: 'ND', capital: 'Bismarck',       svgId: '38', region: 'midwest' },
  { name: 'Ohio',           abbreviation: 'OH', capital: 'Columbus',       svgId: '39', region: 'midwest' },
  { name: 'South Dakota',   abbreviation: 'SD', capital: 'Pierre',         svgId: '46', region: 'midwest' },
  { name: 'Wisconsin',      abbreviation: 'WI', capital: 'Madison',        svgId: '55', region: 'midwest' },

  // ── Southwest ────────────────────────────────────────────────────────────────
  { name: 'Arizona',        abbreviation: 'AZ', capital: 'Phoenix',        svgId: '04', region: 'southwest' },
  { name: 'New Mexico',     abbreviation: 'NM', capital: 'Santa Fe',       svgId: '35', region: 'southwest' },
  { name: 'Oklahoma',       abbreviation: 'OK', capital: 'Oklahoma City',  svgId: '40', region: 'southwest' },
  { name: 'Texas',          abbreviation: 'TX', capital: 'Austin',         svgId: '48', region: 'southwest' },

  // ── Rocky Mountain ───────────────────────────────────────────────────────────
  { name: 'Colorado',       abbreviation: 'CO', capital: 'Denver',         svgId: '08', region: 'rocky-mountain' },
  { name: 'Idaho',          abbreviation: 'ID', capital: 'Boise',          svgId: '16', region: 'rocky-mountain' },
  { name: 'Montana',        abbreviation: 'MT', capital: 'Helena',         svgId: '30', region: 'rocky-mountain' },
  { name: 'Nevada',         abbreviation: 'NV', capital: 'Carson City',    svgId: '32', region: 'rocky-mountain' },
  { name: 'Utah',           abbreviation: 'UT', capital: 'Salt Lake City', svgId: '49', region: 'rocky-mountain' },
  { name: 'Wyoming',        abbreviation: 'WY', capital: 'Cheyenne',       svgId: '56', region: 'rocky-mountain' },

  // ── Pacific ──────────────────────────────────────────────────────────────────
  { name: 'Alaska',         abbreviation: 'AK', capital: 'Juneau',         svgId: '02', region: 'pacific' },
  { name: 'California',     abbreviation: 'CA', capital: 'Sacramento',     svgId: '06', region: 'pacific' },
  { name: 'Hawaii',         abbreviation: 'HI', capital: 'Honolulu',       svgId: '15', region: 'pacific' },
  { name: 'Oregon',         abbreviation: 'OR', capital: 'Salem',          svgId: '41', region: 'pacific' },
  { name: 'Washington',     abbreviation: 'WA', capital: 'Olympia',        svgId: '53', region: 'pacific' },
];
