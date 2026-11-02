import type { ModeId } from '../../data/presets/modes';

export const modesCopy = {
  title: 'Four modes, four moods.',
  lead: 'Your brain changes rhythm all day. Each mode gently invites one of them.',
  descriptions: {
    meditate: 'Quiet, inward, a little dreamy.',
    focus: 'Clear, awake, not tense.',
    energy: 'Alert and ready to move.',
    sleep: 'Heavy, still, far away.',
  } satisfies Record<ModeId, string>,
  bandHz: (band: string, hz: number) => `${band} · ${hz} Hz`,
  defaultLength: (minutes: number) => `${minutes} min by default`,
} as const;
