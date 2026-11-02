export const pricing = {
  title: 'Start free. Go further.',
  full: {
    name: 'Amplii Full',
    pill: '7 days free',
    tagline: 'Shape your own arc.',
    features: [
      { title: 'Frequency arc', body: 'Set where the beat starts, holds and returns.' },
      { title: 'Ears and tone', body: 'Choose the pitch and swap which ear takes the lower tone.' },
      { title: 'Voice', body: 'Guided meditations by Marie, coming soon.' },
    ],
    note: 'Try everything free for 7 days. After that, unlock it to keep the controls, or carry on with the four free modes.',
    cta: 'Try Amplii Full free for 7 days',
  },
  free: {
    name: 'Free',
    tagline: 'The four modes, any length. Free, always.',
    items: [
      'Meditate, Focus, Energy and Sleep',
      'Any length, 5 minutes to 2 hours',
      'No account, nothing tracked',
    ],
    cta: 'Download Amplii free',
  },
} as const;
