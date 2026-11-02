export const tryTheBeat = {
  title: 'Hear it for yourself.',
  lead: 'Thirty seconds, a pair of earbuds and one small surprise.',
  steps: [
    'One tone in each ear',
    'Take one earbud out',
    'Change the gap',
    'Play like a speaker',
    'The gap never jumps',
  ],
  stepsLabel: 'Demo steps',
  note: "Keep the volume low. This demo shows how Amplii works. It isn't a session.",
  ear: (side: 'Left' | 'Right', hz: number) => `${side} · ${hz} Hz`,
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  /** The state before audio starts (Figma 202:164). */
  start: {
    label: 'Before you start',
    title: 'Put your headphones on.',
    body: 'On iPhone, turn off silent mode first. Keep the volume low.',
    button: 'Start',
  },
} as const;
