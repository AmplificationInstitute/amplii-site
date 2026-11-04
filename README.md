# Amplii site

Landing page for [Amplii](https://apps.apple.com/app/id6811405143), the binaural beats app by Amplification Institute. Live at amplii.amplificationinstitute.com.

Static site built with Astro and TypeScript, hosted on Vercel.

## Setup

Requires Node 24 (see `.nvmrc`).

```sh
nvm use
npm install
npm run dev
```

The dev server runs at http://localhost:4321.

## Scripts

| Script                 | What it does                                                             |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run dev`          | Start the dev server                                                     |
| `npm run build`        | Type-check, then build the static site into `dist/`                      |
| `npm run preview`      | Serve the built site locally                                             |
| `npm run check`        | Type-check Astro and TypeScript files                                    |
| `npm run lint`         | ESLint (TypeScript, Astro and accessibility rules), fails on any warning |
| `npm run format`       | Format with Prettier                                                     |
| `npm run format:check` | Check formatting without writing                                         |

## Structure

```
public/                 Served as is
  privacy.html          Legacy pages, kept byte for byte (linked from the App Store)
  support.html
  terms.html
  assets/fonts/         Fonts used only by the legacy pages
docs/
  ARCHITECTURE.md       How the landing is structured, laid out and animated
src/
  pages/                Routes
  layouts/              Page shell (head, skip link, main landmark)
  components/           Small reusable components (one per repeating Figma element)
  sections/             Landing page sections
  animations/           GSAP and Lenis code
  audio/                Web Audio code for the "Try the beat" section
  content/              Site settings; copy per language in content/en/
  data/presets/         Mode and wave presets from the app engine
  lib/                  Shared helpers: App Store links, wave maths
  assets/               Logo and the official App Store badge (SVG)
  styles/tokens/        Design tokens (color, type, space, radius, motion)
  styles/global.css     Base styles
```

## Legacy URLs

The App Store listing links to `/privacy.html`, `/support.html` and `/`. `/privacy`, `/support` and `/terms` (no extension) must also keep working. `vercel.json` rewrites them to the `.html` files so every form returns 200 without a redirect.

## Fonts

Jost and Archivo come from Fontsource through Astro's fonts API (`astro.config.mjs`). They are self-hosted at build time and subset to latin, with a metric-matched fallback. Jost loads Light (big numbers) and SemiBold (titles); only Jost SemiBold, the hero title, is preloaded.

## Deployment

Vercel builds every push. Preview deployments from `develop` are used for review; production goes live only after approval.
