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
  /** The five steps once the sound plays (Figma 202:167 to 202:179). */
  stepCards: [
    {
      title: 'One tone in each ear.',
      body: 'Your left ear hears 197 Hz, your right ear 203 Hz. Listen for a slow wobble on top.',
    },
    {
      title: 'Now take one earbud out.',
      body: "The wobble disappears. Put it back and it returns. That wobble isn't in the sound. Your brain makes it from the gap between your ears.",
    },
    {
      title: 'The gap sets the pace.',
      body: 'Same pitch, different rhythm. A small gap feels slow and heavy. A wider one feels quicker.',
    },
    {
      title: 'Why headphones matter.',
      body: "A speaker mixes both tones before they reach you. You'll still hear a wobble, but now it's in the sound itself, not made by your brain. Take one earbud out: this time it stays.",
    },
    {
      title: 'In Amplii, the gap never jumps.',
      body: 'Sessions move slowly through an arc, over minutes, not seconds.',
    },
  ],
  next: 'Next',
  stop: 'Stop',
  stopDemo: 'Stop the demo',
  /** Step 3: one chip per mode, slowest beat first. */
  chipsLabel: 'Beat',
  chip: (mode: string, hz: number) => `${mode} · ${hz}`,
  /** Step 4 */
  speaker: 'Play like a speaker',
  mixed: 'Both ears · mixed',
  /** Step 5: the beat while it glides, updated at most once a second. */
  now: (hz: string) => `Now · ${hz} Hz`,
  /** Read out by screen readers when the step or the beat changes. */
  announceStep: (step: number, total: number, title: string) =>
    `Step ${step} of ${total}: ${title}`,
  announceMode: (mode: string, hz: number) => `${mode}, ${hz} Hz beat`,
  announceSpeaker: (on: boolean) => (on ? 'Playing like a speaker' : 'One tone in each ear'),
  announceStopped: 'Demo stopped',
} as const;
