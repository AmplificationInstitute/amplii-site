import type { ArcPhase } from '../../data/presets/arc';

export const arc = {
  title: 'Every session is an arc.',
  lead: 'No sudden jumps. Amplii starts near a relaxed waking rhythm, eases you toward your mode, holds, then brings you back.',
  phases: { easeIn: 'Ease in', hold: 'Hold', return: 'Return' } satisfies Record<ArcPhase, string>,
  minutes: (minutes: number) => `${minutes} min`,
  hz: (hz: number) => `${hz} Hz`,
  /** Text alternative for the chart, read instead of the drawing. */
  chartLabel: (mode: string, start: number, hold: number, end: number, total: number) =>
    `${mode}, ${total} minutes: starts at ${start} Hz, eases to ${hold} Hz, holds, then returns to ${end} Hz.`,
  note: 'Choose any length from 5 minutes to 2 hours. The arc stretches to fit. In Sleep, the beat keeps sinking at the end.',
} as const;
