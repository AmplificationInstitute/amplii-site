export const science = {
  title: 'What the science says.',
  /** Name of the swipeable card row on phone, for screen readers. */
  carouselLabel: 'Facts about binaural beats',
  facts: [
    {
      title: 'The beat is real.',
      body: 'First described in 1839. Studies have measured how the brain responds to it.',
    },
    {
      title: 'Modest benefits, on average.',
      body: 'Research has linked listening to lower anxiety and better attention. Effects vary from person to person.',
    },
    {
      title: 'Not everything is proven.',
      body: 'Whether a beat moves your brain into a specific state is still debated. So Amplii invites a rhythm instead of promising one.',
    },
    {
      title: 'Longer works better.',
      body: 'In the studies, longer listening, and listening before a task, worked better than short bursts.',
    },
  ],
  /** The large number from tablet up ("01"). */
  number: (index: number) => String(index).padStart(2, '0'),
  disclaimer: 'Amplii is a wellness tool, not a medical treatment.',
  studiesLabel: 'Read the studies',
  /** Titles, journals and years as listed on PubMed and PMC. */
  studies: [
    {
      title:
        'Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis',
      journal: 'Psychological Research',
      year: 2019,
      url: 'https://pubmed.ncbi.nlm.nih.gov/30073406/',
    },
    {
      title:
        'Potential of binaural beats intervention for improving memory and attention: insights from meta-analysis and systematic review',
      journal: 'Psychological Research',
      year: 2023,
      url: 'https://pubmed.ncbi.nlm.nih.gov/35842538/',
    },
    {
      title:
        'Binaural beats to entrain the brain? A systematic review of the effects of binaural beat stimulation on brain oscillatory activity, and the implications for psychological research and intervention',
      journal: 'PLOS ONE',
      year: 2023,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/',
    },
  ],
} as const;
