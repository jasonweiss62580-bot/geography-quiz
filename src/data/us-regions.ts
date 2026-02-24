export type USRegionId =
  | 'all'
  | 'new-england'
  | 'mid-atlantic'
  | 'southeast'
  | 'midwest'
  | 'southwest'
  | 'rocky-mountain'
  | 'pacific';

export interface USRegionDef {
  id: USRegionId;
  label: string;
}

export const US_REGIONS: USRegionDef[] = [
  { id: 'new-england',    label: 'New England' },
  { id: 'mid-atlantic',   label: 'Mid-Atlantic' },
  { id: 'southeast',      label: 'Southeast' },
  { id: 'midwest',        label: 'Midwest' },
  { id: 'southwest',      label: 'Southwest' },
  { id: 'rocky-mountain', label: 'Rocky Mountain' },
  { id: 'pacific',        label: 'Pacific' },
];
