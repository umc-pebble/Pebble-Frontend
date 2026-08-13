import type { ActivityColor, ActivityPalette } from '../types/activityLogs';

export const DEFAULT_ACTIVITY_COLOR: ActivityColor = '#A3A3A3';

export const ACTIVITY_COLOR_PALETTES: Record<ActivityColor, ActivityPalette> = {
  '#A3A3A3': {
    activityColor: '#A3A3A3',
    colors: {
      empty: '#FAFAFA',
      level1: '#E5E5E5',
      level2: '#A3A3A3',
      level3: '#171717',
    },
  },
  '#82A0FF': {
    activityColor: '#82A0FF',
    colors: {
      empty: '#FAFAFA',
      level1: '#D5E1FF',
      level2: '#82A0FF',
      level3: '#2343DB',
    },
  },
  '#ABE692': {
    activityColor: '#ABE692',
    colors: {
      empty: '#FAFAFA',
      level1: '#D2F2C4',
      level2: '#ABE692',
      level3: '#7ED957',
    },
  },
  '#FFE48B': {
    activityColor: '#FFE48B',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFF1C1',
      level2: '#FFE48B',
      level3: '#FFD64D',
    },
  },
  '#FFB67A': {
    activityColor: '#FFB67A',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFD7B8',
      level2: '#FFB67A',
      level3: '#FF8E33',
    },
  },
  '#FFB4B4': {
    activityColor: '#FFB4B4',
    colors: {
      empty: '#FAFAFA',
      level1: '#FFD6D6',
      level2: '#FFB4B4',
      level3: '#FF8B8B',
    },
  },
};

export function isActivityColor(value: string): value is ActivityColor {
  return Object.prototype.hasOwnProperty.call(ACTIVITY_COLOR_PALETTES, value);
}

export function getActivityPalette(activityColor: string): ActivityPalette {
  return isActivityColor(activityColor)
    ? ACTIVITY_COLOR_PALETTES[activityColor]
    : ACTIVITY_COLOR_PALETTES[DEFAULT_ACTIVITY_COLOR];
}