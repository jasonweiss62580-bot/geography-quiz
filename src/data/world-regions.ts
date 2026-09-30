export type MacroRegionId = 'all' | 'americas' | 'africa' | 'asia' | 'europe' | 'oceania';

export type MicroRegionId =
  | 'all'
  | 'north-america'
  | 'central-america-caribbean'
  | 'south-america'
  | 'western-europe'
  | 'eastern-europe'
  | 'north-africa'
  | 'west-africa'
  | 'middle-africa'
  | 'eastern-africa'
  | 'southern-africa'
  | 'middle-east'
  | 'central-asia'
  | 'south-asia'
  | 'east-southeast-asia'
  | 'oceania';

export interface MacroRegionDef {
  id: MacroRegionId;
  label: string;
  micro: MicroRegionDef[];
}

export interface MicroRegionDef {
  id: MicroRegionId;
  label: string;
  macro: MacroRegionId;
  available: boolean;
}

export const MACRO_REGIONS: MacroRegionDef[] = [
  {
    id: 'americas',
    label: 'The Americas',
    micro: [
      { id: 'north-america',             label: 'North America',              macro: 'americas', available: true },
      { id: 'central-america-caribbean', label: 'Central America & Caribbean', macro: 'americas', available: true },
      { id: 'south-america',             label: 'South America',              macro: 'americas', available: true },
    ],
  },
  {
    id: 'europe',
    label: 'Europe',
    micro: [
      { id: 'western-europe', label: 'Western Europe', macro: 'europe', available: true },
      { id: 'eastern-europe', label: 'Eastern Europe', macro: 'europe', available: true },
    ],
  },
  {
    id: 'africa',
    label: 'Africa',
    micro: [
      { id: 'north-africa',    label: 'North Africa',    macro: 'africa', available: true },
      { id: 'eastern-africa',  label: 'Eastern Africa',  macro: 'africa', available: true },
      { id: 'middle-africa',   label: 'Middle Africa',   macro: 'africa', available: true },
      { id: 'southern-africa', label: 'Southern Africa', macro: 'africa', available: true },
      { id: 'west-africa',     label: 'Western Africa',  macro: 'africa', available: true },
    ],
  },
  {
    id: 'asia',
    label: 'Asia',
    micro: [
      { id: 'middle-east',          label: 'Middle East',           macro: 'asia', available: true },
      { id: 'central-asia',         label: 'Central Asia',          macro: 'asia', available: true },
      { id: 'south-asia',           label: 'South Asia',            macro: 'asia', available: true },
      { id: 'east-southeast-asia',  label: 'East & Southeast Asia', macro: 'asia', available: true },
    ],
  },
  {
    id: 'oceania',
    label: 'Oceania',
    micro: [],
  },
];

/**
 * Class study sets: fixed lists of countries matching a class study guide's
 * numbered quizzes. Shown as an extra row of chips under their macro region.
 * A set can span regions (Africa Quiz 6 covers Middle and Southern Africa).
 */
export type StudySetId =
  | 'africa-quiz-1' | 'africa-quiz-2' | 'africa-quiz-3' | 'africa-quiz-4'
  | 'africa-quiz-5' | 'africa-quiz-6' | 'africa-quiz-7' | 'africa-quiz-8';

export interface StudySetDef {
  id: StudySetId;
  label: string;
  /** Item numbers from the study guide, e.g. "#1-6" */
  range: string;
  macro: MacroRegionId;
  /** Region(s) the set's countries come from; used to filter chips by region */
  regions: MicroRegionId[];
  /** ISO numeric codes, in study guide order */
  svgIds: string[];
}

export const STUDY_SETS: StudySetDef[] = [
  // North Africa: Algeria, Egypt, Libya, Morocco, Sudan, Tunisia
  { id: 'africa-quiz-1', label: 'Quiz 1', range: '#1-6',   macro: 'africa', regions: ['north-africa'], svgIds: ['12', '818', '434', '504', '729', '788'] },
  // Eastern Africa: Burundi, Comoros, Djibouti, Eritrea, Ethiopia, Kenya
  { id: 'africa-quiz-2', label: 'Quiz 2', range: '#7-12',  macro: 'africa', regions: ['eastern-africa'], svgIds: ['108', '174', '262', '232', '231', '404'] },
  // Eastern Africa: Madagascar, Mozambique, Malawi, Mauritius, Rwanda, Seychelles
  { id: 'africa-quiz-3', label: 'Quiz 3', range: '#13-18', macro: 'africa', regions: ['eastern-africa'], svgIds: ['450', '508', '454', '480', '646', '690'] },
  // Eastern Africa: Somalia, South Sudan, Tanzania, Uganda, Zambia, Zimbabwe
  { id: 'africa-quiz-4', label: 'Quiz 4', range: '#19-24', macro: 'africa', regions: ['eastern-africa'], svgIds: ['706', '728', '834', '800', '894', '716'] },
  // Middle Africa: Angola, Cameroon, Central African Republic, Chad, Republic of the Congo
  { id: 'africa-quiz-5', label: 'Quiz 5', range: '#25-29', macro: 'africa', regions: ['middle-africa'], svgIds: ['24', '120', '140', '148', '178'] },
  // Middle Africa: DR Congo, Equatorial Guinea, Gabon, São Tomé and Príncipe
  // Southern Africa: Botswana, Eswatini, Lesotho, Namibia, South Africa
  { id: 'africa-quiz-6', label: 'Quiz 6', range: '#30-38', macro: 'africa', regions: ['middle-africa', 'southern-africa'], svgIds: ['180', '226', '266', '678', '72', '748', '426', '516', '710'] },
  // Western Africa: Benin, Burkina Faso, Cabo Verde, The Gambia, Ghana, Guinea, Guinea-Bissau, Côte d'Ivoire
  { id: 'africa-quiz-7', label: 'Quiz 7', range: '#39-46', macro: 'africa', regions: ['west-africa'], svgIds: ['204', '854', '132', '270', '288', '324', '624', '384'] },
  // Western Africa: Liberia, Mali, Mauritania, Niger, Nigeria, Senegal, Sierra Leone, Togo
  { id: 'africa-quiz-8', label: 'Quiz 8', range: '#47-54', macro: 'africa', regions: ['west-africa'], svgIds: ['430', '466', '478', '562', '566', '686', '694', '768'] },
];

export function getStudySetsByMacro(macroId: MacroRegionId): StudySetDef[] {
  return STUDY_SETS.filter((s) => s.macro === macroId);
}

export function getStudySet(id: string): StudySetDef | undefined {
  return STUDY_SETS.find((s) => s.id === id);
}

/** Region id for one or more study sets, e.g. 'africa-quiz-1+africa-quiz-2' */
export function joinStudySets(ids: StudySetId[]): string {
  // Study guide order, so the same selection always gives the same id (and high score)
  return STUDY_SETS.filter((s) => ids.includes(s.id)).map((s) => s.id).join('+');
}

/** The study sets in a region id made by joinStudySets, or null if it isn't one */
export function parseStudySets(region: string): StudySetDef[] | null {
  const sets = region.split('+').map(getStudySet);
  return sets.every((s) => s !== undefined) ? (sets as StudySetDef[]) : null;
}

/**
 * Which REGION_VIEW entry to zoom the map to for a region id. Several study sets
 * zoom to the one region they all cover, or else to their whole macro region.
 */
export function getMapViewKey(region: string): string {
  const sets = parseStudySets(region);
  if (!sets || sets.length === 1) return region;
  const covered = new Set(sets.flatMap((s) => s.regions));
  return covered.size === 1 ? [...covered][0] : sets[0].macro;
}

/** All micro-regions across all macros */
export const ALL_MICRO_REGIONS: MicroRegionDef[] = MACRO_REGIONS.flatMap((m) => m.micro);

/** All macro IDs that have at least one available micro, or no sub-regions at all */
export function isMacroAvailable(macroId: MacroRegionId): boolean {
  if (macroId === 'all') return true;
  const macro = MACRO_REGIONS.find((m) => m.id === macroId);
  if (!macro) return false;
  // A macro with no sub-regions is itself the selectable region
  if (macro.micro.length === 0) return true;
  return macro.micro.some((r) => r.available);
}

/** Get the micro-regions for a given macro (or all available micros for 'all') */
export function getMicrosByMacro(macroId: MacroRegionId): MicroRegionDef[] {
  if (macroId === 'all') return ALL_MICRO_REGIONS;
  return MACRO_REGIONS.find((m) => m.id === macroId)?.micro ?? [];
}

/** Get a human-readable label for any region ID */
export function getRegionLabel(id: string): string {
  if (id === 'all') return 'All Available Regions';
  const sets = parseStudySets(id);
  if (sets) {
    const macroLabel = MACRO_REGIONS.find((m) => m.id === sets[0].macro)?.label ?? '';
    return `${macroLabel} ${sets.map((s) => s.label).join(' + ')}`.trim();
  }
  for (const macro of MACRO_REGIONS) {
    if (macro.id === id) return macro.label;
    const micro = macro.micro.find((m) => m.id === id);
    if (micro) return micro.label;
  }
  return id;
}

/** Get the macro region that a micro-region or study set(s) belong to */
export function getMacroForMicro(microId: string): MacroRegionId | null {
  const sets = parseStudySets(microId);
  if (sets) return sets[0].macro;
  for (const macro of MACRO_REGIONS) {
    if (macro.micro.find((m) => m.id === microId)) return macro.id;
  }
  return null;
}

/**
 * ISO 3166-1 numeric codes (as strings) for countries in each macro region.
 * Used by WorldMap to filter which countries to render.
 * Includes countries we don't have quiz data for, for visual map context.
 */
export const MACRO_REGION_ISO_CODES: Record<string, string[]> = {
  americas: [
    // North America
    '124', '840', '484',
    // Central America
    '84', '188', '222', '320', '340', '558', '591',
    // Caribbean
    '28', '44', '52', '192', '212', '214', '308', '332', '388', '659', '662', '670', '780',
    // South America
    '32', '68', '76', '152', '170', '218', '254', '328', '600', '604', '740', '858', '862',
    // Dependencies / territories included for context
    '304', '630', '850', '474', '660', '060', '092', '136', '238', '312', '534', '796',
  ],
  europe: [
    '8', '20', '40', '56', '70', '100', '112', '191', '196', '203', '208', '233', '246',
    '250', '276', '300', '348', '352', '372', '380', '428', '438', '440', '442',
    '470', '492', '498', '499', '528', '578', '616', '620', '642', '643', '688', '703', '705',
    '724', '752', '756', '804', '807', '826',
  ],
  africa: [
    '12', '24', '72', '108', '120', '132', '140', '148', '174', '175', '178',
    '180', '204', '226', '231', '232', '262', '266', '270', '288', '324', '384', '404', '426',
    '430', '434', '450', '454', '466', '478', '480', '504', '508', '516', '562', '566', '624',
    '638', '646', '678', '686', '690', '694', '706', '710', '716', '728', '729', '732',
    '748', '768', '788', '800', '818', '834', '854', '894',
  ],
  asia: [
    '4', '31', '48', '50', '51', '64', '96', '104', '116', '144', '156', '268', '275',
    '356', '360', '364', '368', '376', '392', '398', '400', '408', '410', '414', '417',
    '418', '422', '458', '462', '496', '512', '524', '586', '608', '626', '634',
    '682', '702', '704', '760', '762', '764', '784', '792', '795', '860', '887',
  ],
  oceania: [
    '36', '90', '242', '296', '520', '554', '583', '584', '585', '598', '776', '798', '882', '548',
  ],
};
