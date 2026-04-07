import { createLocalStorageState } from '../../lib/localStorageState.svelte';
import type { BaseGameState } from '../types';

export interface LicensePlateState extends BaseGameState {
  schemaVersion: 1;
  found: Record<string, string>; // state name → ISO timestamp
}

const INITIAL: LicensePlateState = {
  schemaVersion: 1,
  found: {},
  startedAt: null,
  completedAt: null,
};

export const US_STATES: readonly string[] = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export const licensePlateState = createLocalStorageState<LicensePlateState>(
  'rtg:license-plate',
  INITIAL
);

export function markFound(stateName: string): void {
  const current = licensePlateState.value;
  const now = new Date().toISOString();
  const wasEmpty = Object.keys(current.found).length === 0;
  const newFound = { ...current.found, [stateName]: now };
  const isComplete = Object.keys(newFound).length === 50;

  licensePlateState.value = {
    ...current,
    found: newFound,
    startedAt: wasEmpty ? now : current.startedAt,
    completedAt: isComplete ? now : current.completedAt,
  };
}

export function unmarkFound(stateName: string): void {
  const current = licensePlateState.value;

  const { [stateName]: _, ...remaining } = current.found;

  licensePlateState.value = {
    ...current,
    found: remaining,
    completedAt: null,
  };
}

export function resetGame(): void {
  licensePlateState.reset();
}

export function formatDuration(startedAt: string, completedAt: string): string {
  const seconds = Math.floor(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000
  );
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
