export const faq = {
  title: 'Good to know.',
  /** Shown from tablet up, as in Figma. The email is a mailto link. */
  contact: {
    before: 'Still curious? Write to us at',
    email: 'contact@amplificationinstitute.com',
  },
  items: [
    {
      question: 'Do I need headphones?',
      answer:
        'Yes. Each ear needs its own tone. Any wired or wireless headphones work. On speakers the tones mix in the air, so you hear a plain wobble in the sound instead of the binaural beat.',
    },
    {
      question: 'Do binaural beats really work?',
      answer:
        'Research suggests modest benefits on average for attention and anxiety, and the effect varies from person to person. Whether beats directly change brainwaves is still debated, so Amplii invites a rhythm instead of promising one.',
    },
    {
      question: 'Is it safe?',
      answer:
        "For most people, yes. Keep the volume low, and don't listen while driving or doing anything that needs your full attention. If you have epilepsy or a seizure disorder, talk to your doctor first.",
    },
    {
      question: 'Can I fall asleep with it?',
      answer:
        'Yes. Sleep mode is made for that: its beat keeps sinking at the end instead of lifting, so you can drift off.',
    },
    {
      question: 'Does it work offline?',
      answer: 'Yes. The sound is generated on your iPhone, so Amplii works without a connection.',
    },
    {
      question: 'Is there a subscription?',
      answer: 'No. The four modes are free for good, and Amplii Full is a one-time purchase.',
    },
    {
      question: 'What do you collect?',
      answer:
        'Only what you choose to give us. If you back up your Amplii Full purchase with an email, we keep that email to restore it, and you can delete it anytime in Settings. Nothing about your sessions or settings ever leaves your phone. Purchases are handled by Apple.',
    },
    {
      question: 'Is there an Android version?',
      answer: 'Not for now. Amplii is made for iPhone, and an iPad version is on its way.',
    },
  ],
} as const;
