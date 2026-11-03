export const site = {
  name: 'Amplii',
  url: 'https://amplii.amplificationinstitute.com',
  lang: 'en',
  locale: 'en_US',
  title: 'Amplii: Binaural Beats for iPhone',
  description:
    'Binaural beats to meditate, focus, energize and sleep. An iPhone app by Amplification Institute, with no account and nothing leaving your phone.',
  contactEmail: 'contact@amplificationinstitute.com',
  /** Open Graph and Twitter card image (Figma 268:157, exported at 1200 x 630). */
  shareImage: {
    path: '/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Amplii: find your frequency. Soft blue waves over a glowing horizon.',
  },
  appStore: {
    appId: '6811405143',
    url: 'https://apps.apple.com/app/id6811405143',
  },
  organization: {
    name: 'Amplification Institute',
    url: 'https://amplificationinstitute.com',
  },
  legal: {
    privacy: '/privacy',
    support: '/support',
    terms: '/terms',
  },
} as const;
