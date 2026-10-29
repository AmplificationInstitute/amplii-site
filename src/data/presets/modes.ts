import { defineWave, type WaveParams } from '../../lib/wave/params';

export type ModeId = 'meditate' | 'focus' | 'energy' | 'sleep';

export interface Mode {
  id: ModeId;
  name: string;
  band: 'Delta' | 'Theta' | 'Beta';
  /** Beat frequency at the start, during the hold, and at the end of a session, in Hz. */
  arcHz: { start: number; hold: number; end: number };
  defaultMinutes: number;
  /** The mode's own wave (app ModeWaves.swift). Designed for a 126 px box. */
  wave: WaveParams;
}

/** From the app engine. Order matches the landing (Meditate, Focus, Energy, Sleep). */
export const modes = [
  {
    id: 'meditate',
    name: 'Meditate',
    band: 'Theta',
    arcHz: { start: 10, hold: 6, end: 12 },
    defaultMinutes: 25,
    wave: defineWave({
      lines: 7,
      amplitude: 28,
      refHeight: 126,
      baseCycles: 1.6,
      cycleSpread: 0.1,
      driftSpeed: 0.04,
      breathRate: 0.1,
    }),
  },
  {
    id: 'focus',
    name: 'Focus',
    band: 'Beta',
    arcHz: { start: 10, hold: 14, end: 10 },
    defaultMinutes: 45,
    wave: defineWave({
      lines: 7,
      amplitude: 20,
      refHeight: 126,
      baseCycles: 2.6,
      cycleSpread: 0.05,
      driftSpeed: 0.07,
      breathRate: 0.12,
    }),
  },
  {
    id: 'energy',
    name: 'Energy',
    band: 'Beta',
    arcHz: { start: 12, hold: 18, end: 14 },
    defaultMinutes: 15,
    wave: defineWave({
      lines: 9,
      amplitude: 26,
      refHeight: 126,
      baseCycles: 4,
      cycleSpread: 0.15,
      driftSpeed: 0.14,
      breathRate: 0.22,
    }),
  },
  {
    id: 'sleep',
    name: 'Sleep',
    band: 'Delta',
    arcHz: { start: 8, hold: 2.5, end: 2 },
    defaultMinutes: 60,
    wave: defineWave({
      lines: 5,
      amplitude: 34,
      refHeight: 126,
      baseCycles: 0.8,
      cycleSpread: 0.1,
      lineOpacity: 0.8,
      driftSpeed: 0.02,
      breathRate: 0.06,
    }),
  },
] as const satisfies readonly Mode[];
