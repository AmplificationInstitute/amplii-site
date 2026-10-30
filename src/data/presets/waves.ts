import { STRIP_CYCLES } from '../../lib/wave/geometry';
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
   * "Strip Waves" vectors (phone, tablet and desktop share the shape): even
   * crests with no taper, each line a fixed share of the center line's height
   * and 0.045 of a cycle behind the next. Drawn as STRIP_CYCLES cycles; the
   * crest length and amplitude per width are set in WaveStrip's CSS.
   */
  background: defineBackgroundWave({
    lines: 7,
    amplitude: 43.2,
    refHeight: 172.8,
    baseCycles: STRIP_CYCLES,
    cycleSpread: 0,
    taper: false,
    amplitudeByLine: [0.45, 0.7, 0.9, 1, 0.85, 0.65, 0.4],
    phaseStep: 2 * Math.PI * 0.045,
    phaseFromCenter: true,
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
