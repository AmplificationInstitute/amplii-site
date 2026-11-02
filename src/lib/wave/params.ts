/**
 * Wave bundle parameters. Same model and units as the app's WaveBundle
 * (Signal/App/DesignSystem/WaveBundle.swift).
 */
export interface WaveParams {
  lines: number;
  /** Peak height of the center line, in px, for a box `refHeight` tall. */
  amplitude: number;
  /** Box height the amplitude was designed for. Box layouts scale by height / refHeight. */
  refHeight: number;
  /** Wave cycles across the full width (center line). */
  baseCycles: number;
  /** Extra cycles per line, so lines drift in and out of phase. */
  cycleSpread: number;
  lineOpacity: number;
  /** Phase drift, in cycles per second. 0.05 = one drift cycle every 20 s. */
  driftSpeed: number;
  /** Amplitude breathing, in Hz. */
  breathRate: number;
  breathDepth: number;
  glow: boolean;
  /** One color for every line. Without it: ink center line, alternating blue lines. */
  lineColor?: 'wave-1' | 'wave-2';
  /** Line opacity by distance from the center line. Without it: the app's curve. */
  alphaByDistance?: readonly number[];
  centerWidth: number;
  lineWidth: number;
  /** Where the waves live across the width (fractions of it), and where they peak. */
  envelope: readonly [number, number];
  envelopePeak: number;
  /** false: every crest the same height across the width (background strips). */
  taper: boolean;
  /** Phase step between lines, in radians. */
  phaseStep: number;
  /** Count the phase step from the center line instead of the first line. */
  phaseFromCenter: boolean;
  /** Amplitude of each line as a share of the center line. Without it: the app's taper. */
  amplitudeByLine?: readonly number[];
}

/** Hard photosensitivity limit for any visual rhythm (CLAUDE.md §6). */
export const RHYTHM_LIMIT_HZ = 0.25;
/** Background waves breathe slower than this. */
export const BACKGROUND_BREATH_LIMIT_HZ = 0.1;
/** Background waves drift on 10 to 20 s cycles. */
export const BACKGROUND_DRIFT_RANGE = [0.05, 0.1] as const;
/** Each line drifts this much faster than the previous one. */
export const DRIFT_STEP = 0.07;

const appDefaults = {
  cycleSpread: 0.12,
  lineOpacity: 1,
  driftSpeed: 0.05,
  breathRate: 0.1,
  breathDepth: 0.12,
  glow: true,
  centerWidth: 2,
  lineWidth: 1.1,
  envelope: [0, 1],
  envelopePeak: 0.5,
  taper: true,
  phaseStep: 0.55,
  phaseFromCenter: false,
} as const satisfies Partial<WaveParams>;

type WaveInput = Pick<WaveParams, 'lines' | 'amplitude' | 'refHeight' | 'baseCycles'> &
  Partial<WaveParams>;

/** How often any point on screen sees a crest pass: the fastest line's drift. */
export function fastestDriftHz(p: Pick<WaveParams, 'driftSpeed' | 'lines'>): number {
  return p.driftSpeed * (1 + DRIFT_STEP * (p.lines - 1));
}

/** Builds a preset and fails the build if it could move faster than the limits allow. */
export function defineWave(input: WaveInput): WaveParams {
  const wave: WaveParams = { ...appDefaults, ...input };
  if (wave.breathRate > RHYTHM_LIMIT_HZ) {
    throw new Error(`Wave breathing ${wave.breathRate} Hz is above ${RHYTHM_LIMIT_HZ} Hz`);
  }
  if (fastestDriftHz(wave) > RHYTHM_LIMIT_HZ) {
    throw new Error(`Wave drift ${fastestDriftHz(wave)} Hz is above ${RHYTHM_LIMIT_HZ} Hz`);
  }
  return wave;
}

/** A background preset: breathing at most 0.1 Hz, drift on a 10 to 20 s cycle. */
export function defineBackgroundWave(input: WaveInput): WaveParams {
  const wave = defineWave(input);
  const [minDrift, maxDrift] = BACKGROUND_DRIFT_RANGE;
  if (wave.breathRate > BACKGROUND_BREATH_LIMIT_HZ) {
    throw new Error(`Background breathing ${wave.breathRate} Hz is above 0.1 Hz`);
  }
  if (wave.driftSpeed < minDrift || wave.driftSpeed > maxDrift) {
    throw new Error(`Background drift ${wave.driftSpeed} is outside a 10 to 20 s cycle`);
  }
  return wave;
}
