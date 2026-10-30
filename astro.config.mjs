// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://amplii.amplificationinstitute.com',
  output: 'static',
  // Pages build to `name.html` and URLs have no trailing slash, matching the legacy
  // `/privacy.html` style. Extensionless forms are rewritten in vercel.json.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  // Scope as a class, so a class passed to a child component keeps the parent's
  // scoped styles (the attribute strategy drops them).
  scopedStyleStrategy: 'class',
  vite: {
    build: {
      // The app requires iOS 17, whose Safari only knows -webkit-backdrop-filter.
      // Without this target the minifier drops the prefix and glass turns flat.
      cssTarget: ['safari17', 'ios17', 'chrome111', 'edge111', 'firefox115'],
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Jost',
      cssVariable: '--font-jost',
      weights: [300, 400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-archivo',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
});
