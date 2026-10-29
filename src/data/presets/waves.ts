import { defineBackgroundWave, defineWave, type WaveParams } from '../../lib/wave/params';
import { modes, type ModeId } from './modes';

export type WavePresetId = 'background' | 'demo-left' | 'demo-right' | 'demo-beat' | ModeId;

const modeWaves = Object.fromEntries(modes.map((mode) => [mode.id, mode.wave])) as Record<
  ModeId,
  WaveParams
>;

export const wavePresets: Record<WavePresetId, WaveParams> = {
  /*
   * Full-width strips behind the hero and sections, measured from the Figma
   * "Strip Waves" vectors: 7 lines, 9 crests across the 2.8 x strip (about 3
   * on screen), same cycles on every line.
   */
  background: defineBackgroundWave({
    lines: 7,
    amplitude: 43,
    refHeight: 220,
    baseCycles: 9,
    cycleSpread: 0,
    driftSpeed: 0.06,
    breathRate: 0.1,
    centerWidth: 1.6,
    alphaByDistance: [0.95, 0.55, 0.45, 0.35],
  }),

  /* Demo tones, from WaveBundle.leftTone / rightTone / beat. Designed for a 200 px box. */
  'demo-left': defineWave({
    lines: 5,
    amplitude: 38,
    refHeight: 200,
    baseCycles: 2.8,
    cycleSpread: 0.1,
    glow: false,
    lineColor: 'wave-1',
    envelope: [0, 0.93],
    envelopePeak: 0.41,
  }),
  'demo-right': defineWave({
    lines: 5,
    amplitude: 38,
    refHeight: 200,
    baseCycles: 3.2,
    cycleSpread: 0.1,
    glow: false,
    lineColor: 'wave-2',
    envelope: [0.07, 1],
    envelopePeak: 0.59,
  }),
  'demo-beat': defineWave({
    lines: 7,
    amplitude: 58,
    refHeight: 200,
    baseCycles: 1.2,
    cycleSpread: 0.1,
    envelope: [0.14, 0.87],
    envelopePeak: 0.5,
  }),

  ...modeWaves,
};
