export const pricing = {
  title: 'Make every session yours.',
  full: {
    name: 'Amplii Full',
    pill: 'Full control',
    tagline:
      "The free modes follow a set path. With Amplii Full you choose where the beat starts and how long it holds before it comes back. You can pick the tone that's easiest on your ears, and swap sides if one ear hears better than the other. Guided meditations, written and recorded by real people, are on their way to Full as well. You pay $9.99 once, and it's yours to keep.",
    features: [
      { title: 'Frequency arc', body: 'Set where the beat starts, holds and returns.' },
      { title: 'Ears and tone', body: 'Choose the pitch and swap which ear takes the lower tone.' },
      { title: 'Voice', body: 'Guided meditations by real human voices, coming soon.' },
    ],
    cta: 'Get Amplii Full',
  },
  free: {
    name: 'Free',
    tagline: "The four modes at any length, free. It's a good way to start.",
    items: [
      'Meditate, Focus, Energy and Sleep',
      'Any length, 5 minutes to 2 hours',
      'No account, nothing tracked',
    ],
    cta: 'Download Amplii free',
  },
  /** Under the cards: the $9.99 in the Full card is the US price. */
  priceNote: 'Price shown in US dollars. The App Store shows the price in your country.',
} as const;
