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
      { id: 'west-africa',     label: 'West Africa',     macro: 'africa', available: true },
      { id: 'middle-africa',   label: 'Central Africa',  macro: 'africa', available: true },
      { id: 'eastern-africa',  label: 'Eastern Africa',  macro: 'africa', available: true },
      { id: 'southern-africa', label: 'Southern Africa', macro: 'africa', available: true },
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
  for (const macro of MACRO_REGIONS) {
    if (macro.id === id) return macro.label;
    const micro = macro.micro.find((m) => m.id === id);
    if (micro) return micro.label;
  }
  return id;
}

/** Get the macro region that a micro belongs to */
export function getMacroForMicro(microId: MicroRegionId): MacroRegionId | null {
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
