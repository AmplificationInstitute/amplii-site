import { DRIFT_STEP, RHYTHM_LIMIT_HZ, type WaveParams } from './params';

export type WaveTint = 'ink' | 'wave-1' | 'wave-2';

export interface WaveFrame {
  /** Output size, in px (or SVG user units). */
  width: number;
  height: number;
  /** Time in seconds. */
  t: number;
  /** 0 = flat line, 1 = full waves. */
  energy: number;
  /** Multiplies the amplitude: box height / refHeight for boxes, 1 for strips. */
  amplitudeScale: number;
}

export interface WaveStroke {
  d: string;
  width: number;
  alpha: number;
  tint: WaveTint;
}

/**
 * Background strips (Figma 214:574) start 0.9 screens to the left of the screen
 * and are drawn as whole, even cycles. CSS sets the crest length and amplitude
 * per width, so this many cycles always reach past the right edge (at most 3.2
 * crests on screen: 1.9 x 3.2 = 6.1).
 */
export const STRIP_CYCLES = 7;
export const STRIP_OFFSET = 0.9;

/**
 * The glow: the same lines again, blurred, under the crisp lines. Values from the
 * Figma "Strip Waves glow soft" and "Strip Waves glow" layers (layer blur radius,
 * layer opacity). A Gaussian's standard deviation is about half Figma's radius.
 */
export const GLOW_LAYERS = [
  { name: 'soft', blurRadius: 22, opacity: 0.7 },
  { name: 'near', blurRadius: 8, opacity: 0.8 },
] as const;

const POINTS_PER_CYCLE = 12;
const MIN_POINTS = 16;

function closeness(p: WaveParams, k: number): number {
  const mid = (p.lines - 1) / 2;
  return 1 - Math.abs(k - mid) / (mid + 1);
}

/** 0 outside the envelope, rising to 1 at its peak, tapering like the app's bundle. */
function envelopeHeight(p: WaveParams, x: number): number {
  if (!p.taper) return 1;
  const [lo, hi] = p.envelope;
  if (x <= lo || x >= hi) return 0;
  const peak = p.envelopePeak;
  const u = x < peak ? (0.5 * (x - lo)) / (peak - lo) : 0.5 + (0.5 * (x - peak)) / (hi - peak);
  return Math.max(0, Math.sin(Math.PI * u)) ** 1.6;
}

/** Vertical offset of line `k` at `x` (0 to 1 along the full wave), from the center line. */
export function lineOffset(p: WaveParams, k: number, x: number, frame: WaveFrame): number {
  const breathRate = Math.min(p.breathRate, RHYTHM_LIMIT_HZ);
  const breath = 1 + p.breathDepth * Math.sin(2 * Math.PI * breathRate * frame.t);
  const share = p.amplitudeByLine?.[k] ?? 0.35 + 0.65 * closeness(p, k);
  const amp = p.amplitude * frame.amplitudeScale * frame.energy * breath * share;
  const cycles = p.baseCycles + k * p.cycleSpread;
  const step = p.phaseFromCenter ? k - (p.lines - 1) / 2 : k;
  const phase = step * p.phaseStep + 2 * Math.PI * p.driftSpeed * frame.t * (1 + k * DRIFT_STEP);
  return amp * envelopeHeight(p, x) * Math.sin(2 * Math.PI * cycles * x + phase);
}

function lineStyle(p: WaveParams, k: number): Omit<WaveStroke, 'd'> {
  const mid = (p.lines - 1) / 2;
  const isCenter = k === Math.round(mid) && p.lineColor === undefined;
  const c = closeness(p, k);
  const byDistance = p.alphaByDistance;
  const alpha = byDistance
    ? (byDistance[Math.min(Math.round(Math.abs(k - mid)), byDistance.length - 1)] ?? 0)
    : 0.15 + 0.75 * c * c;
  return {
    width: isCenter ? p.centerWidth : p.lineWidth,
    alpha: Math.min(1, alpha * p.lineOpacity),
    tint: isCenter ? 'ink' : (p.lineColor ?? (k % 2 === 0 ? 'wave-1' : 'wave-2')),
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Smooth path through the points (Catmull-Rom as cubic Béziers). */
function smoothPath(points: readonly (readonly [number, number])[]): string {
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))] ?? [0, 0];
  const [x0, y0] = at(0);
  let d = `M${round(x0)} ${round(y0)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = at(i - 1);
    const [bx, by] = at(i);
    const [cx, cy] = at(i + 1);
    const [ex, ey] = at(i + 2);
    const c1x = bx + (cx - ax) / 6;
    const c1y = by + (cy - ay) / 6;
    const c2x = cx - (ex - bx) / 6;
    const c2y = cy - (ey - by) / 6;
    d += `C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(cx)} ${round(cy)}`;
  }
  return d;
}

/** Every line of the bundle at one moment, as SVG path data with its style. */
export function waveStrokes(p: WaveParams, frame: WaveFrame): WaveStroke[] {
  const maxCycles = p.baseCycles + (p.lines - 1) * p.cycleSpread;
  const count = Math.max(MIN_POINTS, Math.ceil(maxCycles * POINTS_PER_CYCLE));
  const centerY = frame.height / 2;

  return Array.from({ length: p.lines }, (_, k) => {
    const points = Array.from({ length: count + 1 }, (_, i) => {
      const x = i / count;
      return [x * frame.width, centerY + lineOffset(p, k, x, frame)] as const;
    });
    return { d: smoothPath(points), ...lineStyle(p, k) };
  });
}
