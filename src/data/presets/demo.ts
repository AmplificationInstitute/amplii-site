import { modes, type ModeId } from './modes';

/** The demo's two tones sit evenly around this pitch (CLAUDE.md §8). */
export const DEMO_CARRIER_HZ = 200;
/** The mode the demo starts in: a 6 Hz beat, 197 Hz left and 203 Hz right. */
export const DEMO_START_MODE: ModeId = 'meditate';

/** Each mode's demo beat is its hold frequency (Sleep 2.5, Meditate 6, Focus 14, Energy 18 Hz). */
export function demoTones(mode: ModeId): { left: number; right: number; beat: number } {
  const beat = modes.find((m) => m.id === mode)?.arcHz.hold ?? 0;
  return { left: DEMO_CARRIER_HZ - beat / 2, right: DEMO_CARRIER_HZ + beat / 2, beat };
}
