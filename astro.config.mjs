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
