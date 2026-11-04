# Amplii landing: architecture

How the landing is structured, laid out and animated. The product rules live in `CLAUDE.md`; this file explains how the code meets them. Design source: Figma file `ALgcDixmxXEBy5MYBzYJzg`, page "Amplii / Landing" (`201:2`).

## 1. Sections

Ten sections, in the Figma order. Ids match the nav links (How it works, Modes, Science, Pricing).

| #   | Section component                | id                                 | Figma (393 / 1024 / 1440 / 1920)       |
| --- | -------------------------------- | ---------------------------------- | -------------------------------------- |
| 1   | `HeroSection`                    | (none, `#main` is the skip target) | 201:6 / 218:1319 / 211:4 / 218:768     |
| 2   | `TryTheBeatSection`              | `how-it-works`                     | 201:53 / 218:1374 / 211:57 / 218:825   |
| 3   | `ArcSection`                     | `arc`                              | 201:116 / 231:157 / 211:133 / 218:903  |
| 4   | `ModesSection`                   | `modes`                            | 201:145 / 218:1450 / 211:164 / 218:936 |
| 5   | `MeditationsSection`             | `meditations`                      | 202:2 / 231:188 / 213:2 / 218:1012     |
| 6   | `ScienceSection`                 | `science`                          | 202:15 / 218:1524 / 213:31 / 218:1061  |
| 7   | `PrivacySection`                 | `privacy`                          | 202:37 / 231:235 / 213:64 / 218:1110   |
| 8   | `PricingSection`                 | `pricing`                          | 202:53 / 218:1571 / 213:81 / 218:1154  |
| 9   | `FaqSection`                     | `faq`                              | 202:78 / 231:277 / 213:137 / 218:1226  |
| 10  | `DownloadSection` + `SiteFooter` | `download`                         | 202:127 / 231:325 / 213:185 / 218:1276 |

Decisions folded in:

- "What binaural beats are" is taught inside Try the beat. "Who makes Amplii" is one line in the footer area, above the links: "Amplii is made by Amplification Institute.", with "Amplification Institute" linking to https://amplificationinstitute.com.
- Meditations: "coming soon" only. No SoundCloud link, no preview player. Hidden Figma layers never reach the build.
- Contact email on the landing is contact@amplificationinstitute.com everywhere, FAQ included. Legacy pages keep support@ untouched.
- The QR code appears only in the Download section, on tablet and desktop, beside the App Store badge (about 120 px), captioned "Scan with your iPhone camera to get Amplii." The hero stays as in Figma.

## 2. Files and naming

```
src/
  pages/            index.astro, 404.astro
  layouts/          BaseLayout.astro
  sections/         HeroSection, TryTheBeatSection, ArcSection, ModesSection,
                    MeditationsSection, ScienceSection, PrivacySection,
                    PricingSection, FaqSection, DownloadSection  (.astro)
  components/       SeoHead, SiteHeader, SiteFooter, StickyAppBar, Logo, Section,
                    SectionHeader, GlassCard, Pill, Button, AppStoreBadge, QrCode,
                    Glow, Horizon, WaveStrip, PhoneMockup, ModeCard, FactCard,
                    FaqItem, PlanCard, DemoCard, Stepper, ArcChart  (.astro)
  lib/app-store.ts  appStoreUrl(campaign), the one builder for App Store links
  lib/unique-id.ts  page-unique ids for inline SVG references
  lib/wave/         params.ts (types, presets' limits, guards)
                    geometry.ts (pure wave maths, shared by build-time SVG and runtime canvas)
  animations/       index.ts (entry and lazy loader)
                    core/      gsap.ts, lenis.ts, tokens.ts, reveal.ts, reduced-motion.ts
                    waves/     renderer.ts (canvas, driven by the shared ticker)
                    sections/  hero.ts, try-the-beat.ts, arc.ts, modes.ts, meditations.ts,
                               science.ts, privacy.ts, pricing.ts, faq.ts, download.ts
                    sticky-bar.ts
  audio/            (phase 3a) binaural.ts, demo-controller.ts
  content/          site.ts (language-neutral)
                    en/  nav, hero, try-the-beat, arc, modes, meditations, science,
                         privacy, pricing, faq, download, footer  (.ts)
  data/presets/     modes.ts (arc Hz, default length, band, demo beat, wave values)
                    arc.ts (25 / 50 / 25 split)
                    waves.ts (hero, background, demo presets)
  styles/           global.css, tokens/ (color, type, space, radius, motion)
  assets/           logo.svg, app-store-badge.svg, qr-app-store.svg,
                    screens/complete (Figma redraw for now, real screenshot later)
```

- Components are PascalCase, CSS custom properties are kebab-case, data attributes are kebab-case.
- `lib/` is the one folder beyond CLAUDE.md §11: the wave maths runs both at build time and in the browser, and `appStoreUrl` is shared by every App Store link.
- Copy lives in `content/en/`, one file per section, so another language is a sibling folder.

## 3. Components

| Component                                          | Props                                                                                                                                                                                                                                                                                                                 | Used in                                                                                                                                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Section`                                          | `id`, `labelledBy`; `bleed` slot (glows and waves, full width, clipped sideways only, so glows and the hero horizon continue into the next section), default slot (in the container)                                                                                                                                  | every section                                                                                                                                                                                       |
| `SectionHeader`                                    | `title`, `lead?`, `level` (default 2), `align: 'start' \| 'center' \| 'center-from-tablet'` (phone headers are left-aligned in Figma)                                                                                                                                                                                 | 2 to 10                                                                                                                                                                                             |
| `GlassCard`                                        | `as` (`div` / `article` / `li`), `padding: 'md' \| 'lg'`, other attributes pass through (Figma card: fill, stroke, radius 30, shadow, blur 12)                                                                                                                                                                        | 'lg'` (Figma card: fill, stroke, radius 30, shadow, blur 12)                                                                                                                                        | arc, meditations, demo, plans, facts, modes |
| `Pill`                                             | `label`, `class` (accent fill; smaller on phone in meditations)                                                                                                                                                                                                                                                       | "Coming soon to Amplii Full"                                                                                                                                                                        |
| `Button`                                           | `href?` (renders `<a>`, else `<button>`), `variant: 'primary' \| 'secondary'`, `size: 'sm' (40) \| 'md' (52) \| 'lg' (56)`, `type?`                                                                                                                                                                                   | nav, hero, demo, plans                                                                                                                                                                              |
| `AppStoreBadge`                                    | `campaign` (passed to `appStoreUrl`), `height` (default 56, Apple minimum 40), `eager`                                                                                                                                                                                                                                | hero, download, sticky bar                                                                                                                                                                          |
| `QrCode`                                           | `size`, `label` (static SVG in `src/assets/qr-app-store.svg`, generated once with `npx qrcode`, inlined; dark modules on a light tile)                                                                                                                                                                                | download (tablet and desktop)                                                                                                                                                                       |
| `CardGlow`                                         | `intensity`, `class`; default slot (wraps a card or a card group with a soft "ambient" light behind it from 768, so the glass blur reads)                                                                                                                                                                             | try the beat, arc, modes, meditations, and the 2c card sections                                                                                                                                     |
| `Glow`                                             | `x`, `y` (center), `width`, `height` (the ellipse), `intensity`, `tint: 'glow' \| 'ambient' \| 'dawn' \| 'dawn-core'`, `class` (CSS radial gradient; the falloff is `--glow-spread`, set per use)                                                                                                                     | 'ambient'`(phone "Ambient" layers),`class` (CSS radial gradient). The dawn variant comes with the Download section (2c)                                                                             | all                                         |
| `Horizon`                                          | none (three layers: glow, rim, line). Phone: 1140 px, 340 px from the top, behind the text; its bottom curve is part of the design and lands below the Try the beat note. From 768: a fixed distance above the hero's bottom edge. Not clipped at the bottom: as in Figma, the disc continues behind the next section | hero                                                                                                                                                                                                |
| `WaveStrip`                                        | see §6                                                                                                                                                                                                                                                                                                                | hero, modes, meditations, science, pricing, demo, mode cards                                                                                                                                        |
| `PhoneMockup`                                      | `screen: ImageMetadata` (the app screen only, 2x), `alt`, `class`; the frame (bezel, border, radius, shadow, Dynamic Island) is CSS from Figma 217:199, sized in container units                                                                                                                                      | privacy                                                                                                                                                                                             |
| `ModeCard`                                         | `mode: ModeId` (everything else comes from presets and copy)                                                                                                                                                                                                                                                          | modes                                                                                                                                                                                               |
| `FactCard`                                         | `number` ("01", Jost Light from 768; none on phone), `title`, `body`                                                                                                                                                                                                                                                  | science                                                                                                                                                                                             |
| `FaqItem`                                          | `question`, `answer`, `group` (shared `name`, one answer open at a time), `open` (the first is open, as in Figma); plus and minus drawn in one inline SVG                                                                                                                                                             | FAQ, "Read the studies"                                                                                                                                                                             |
| `Stepper`                                          | `steps`, `current`                                                                                                                                                                                                                                                                                                    | try the beat                                                                                                                                                                                        |
| `DemoCard`                                         | `leftHz`, `rightHz`; every demo state is in the HTML (Figma 202:164 to 202:179) and the card's `data-step` (0 to 5) and `data-speaker` pick what shows; the Start button is `hidden` (space kept) until the phase 3a script runs                                                                                      | try the beat                                                                                                                                                                                        |
| `ArcChart`                                         | `mode` (default meditate; curve, axis and minutes from presets)                                                                                                                                                                                                                                                       | arc                                                                                                                                                                                                 |
| `PlanCard`                                         | `plan: 'free' \| 'full'` (copy from `content/en/pricing.ts`; both cards have the same layout at every size and the same primary button to the App Store: "Get Amplii Full" and "Download Amplii free"; a price line under the cards)                                                                                  | 'full'`(copy from`content/en/pricing.ts`; Full links to the App Store with "Try Amplii Full free", Free carries the official badge from 768; the phone Free card is the short version, as in Figma) | 'full'`, `featured?`                        | pricing |
| `SiteHeader`, `SiteFooter`, `StickyAppBar`, `Logo` | none (copy from content files). `SiteFooter` sits after `<main>` and holds the dawn glow, anchored to the bottom of the page; footer text is stacked and centered at every size so it stays on the bright part of the dawn (4.5:1)                                                                                    | layout                                                                                                                                                                                              |

A section only composes these components with its content file.

**App Store links:** one helper, `appStoreUrl(campaign)` in `src/lib/app-store.ts`, builds every link to the App Store: the badges, "Get the app" in the nav and the sticky bar, and "Get Amplii Full". Each call site passes its own campaign name, so downloads can be attributed without tracking visitors. Until phase 6 the provider and campaign tokens are `[TODO]` and the helper returns the plain `https://apps.apple.com/app/id6811405143`. The hero has no "Try the beat" button (hidden in Figma); the nav's "How it works" link reaches the demo.

**Type weights:** Jost SemiBold only for the hero title "Find your frequency." (`--weight-hero`, the only preloaded weight). Every section title is Jost Regular (`--weight-title`), which overrides the SemiBold titles in Figma. Jost Light for the fact numbers, Archivo Regular and Medium for text.

**Badge size:** the official badge is 56 px tall, lining up with the 56 px secondary button beside it.

**App Store badge rule:** wherever "Download on the App Store" appears (hero, download, sticky bar), it is Apple's official badge (`AppStoreBadge`), per Apple's marketing guidelines. Custom `Button`s ("Get the app", "Try the beat", and the two pricing buttons "Get Amplii Full" and "Download Amplii free", which share one design so neither plan is favored) never use the Apple logo or the words "App Store".

**Touch targets:** the 40 px nav button keeps its look and gets a 44 px hit area through a pseudo-element.

## 4. Responsive (CSS only, no JavaScript for layout)

From Figma `214:574`.

- **Designed widths:** 393 phone, 1024 tablet and small laptop, 1440 desktop, 1920 large desktop.
- **Breakpoints:** `@media (width >= 768px)` tablet layout, `(width >= 1280px)` desktop layout. One extra rule at `1024px` (Try the beat, two columns). Above 1920 it stays the 1920 design with more space.
- **Scoped styles:** `scopedStyleStrategy: 'class'` in `astro.config.mjs`, so a class a section passes to a component (`<WaveStrip class="…">`) keeps the section's scoped styles.
- **Container:** text and cards in a centered column, max 1200 px. Glows, waves and the horizon run full width through the `Section` `bleed` slot. Scripts are never inlined (`assetsInlineLimit: 0`), because the CSP allows only same-origin script files. Only the page clips sideways: `html { overflow-x: clip }` (`clip`, not `hidden`, so `position: sticky` still works).
- **Side margins:** 20 px below 390, 24 px phone, 48 px tablet, then `clamp(3rem, 17.31vw - 8.075rem, 7.5rem)` from 1024 (48 at 1024, 120 at 1440), then the 1200 column is centered.
- **Type scale:** one linear `clamp()` per segment (393 to 1024, 1024 to 1440, 1440 to 1920), with the token redefined at 1024 and 1440. Segment ends match, so nothing jumps.
  - Hero title 36 / 60 / 76 / 88 (36 from the phone frame 201:3, one line; below 393 it shrinks with the screen to stay on one line)
  - Section title 32 / 44 / 52 / 56
  - Body 16 / 18 / 20 / 20
  - Jost from 28 px up, Archivo at 20 px and below.
- **Layout changes** (grid; card internals use `@container`):

| Section              | Phone (< 768)                                                    | Tablet (768 to 1279)              | Desktop (≥ 1280)                             |
| -------------------- | ---------------------------------------------------------------- | --------------------------------- | -------------------------------------------- |
| Nav                  | wordmark, Get the app                                            | + four section links              | same as tablet                               |
| Hero                 | stacked; the App Store badge is the only button                  | same, larger                      | as Figma                                     |
| Try the beat         | stacked                                                          | two columns from 1024 (`5fr 7fr`) | two columns                                  |
| Modes                | one column of row cards                                          | 2 × 2                             | 4 in a row                                   |
| Science              | scroll-snap carousel (no JS, labelled focusable region)          | 2 × 2                             | row of 4                                     |
| Privacy              | phone below the text                                             | phone below the text              | phone beside the text (`1fr auto`)           |
| Pricing              | stacked                                                          | stacked                           | side by side (`720fr 456fr`, Full then Free) |
| FAQ                  | stacked                                                          | stacked                           | title column + 720 px questions              |
| Download             | badge only                                                       | badge + QR code                   | badge + QR code                              |
| Sticky App Store bar | after the hero; hidden during Try the beat and the final section | hidden                            | hidden                                       |

- Hover only under `@media (hover: hover)`.

## 5. Motion

### Per section

From the Figma motion notes `214:4` to `214:23`.

| #   | Section      | What animates                                                                                                                                                              | Trigger                                                                                 | Tokens                           |
| --- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Hero         | Waves grow out of a flat line; horizon rises 40 px and fades in; title, lead, buttons, note blur-reveal 80 ms apart; slow drift; waves flatten a little as the hero leaves | First paint (**CSS keyframes**); drift continuous (GSAP); flatten is a **scrub** (GSAP) | slow, standard, blur, stagger    |
| 2   | Try the beat | Section blur-fades in; live canvas follows the sound (right wave fades with an earbud out, shape changes per mode); step text blur-replaces in place; stepper follows      | Into view; then interaction                                                             | standard, exit, quick, slow      |
| 3   | Arc          | Curve draws left to right, a dot rides along it, Ease in / Hold / Return light up as the dot passes                                                                        | **Scrub**, no pinning                                                                   | scrub; labels quick              |
| 4   | Modes        | Cards blur-fade 80 ms apart; each mini wave drifts at its mode's pace                                                                                                      | Into view; drift continuous                                                             | standard, blur, stagger          |
| 5   | Meditations  | Card blur-fades in; flat waves drift very slowly                                                                                                                           | Into view                                                                               | standard, blur                   |
| 6   | Science      | Cards blur-fade left to right, 80 ms apart; "Read the studies" expands in place                                                                                            | Into view; interaction                                                                  | standard, stagger, exit          |
| 7   | Privacy      | Text blur-reveals; phone blur-fades in and rises 12 px                                                                                                                     | Into view                                                                               | standard, blur, stagger          |
| 8   | Pricing      | Full first, then Free; waves drift behind both; hover scales to 1.03, edge and outer glow brighten                                                                         | Into view; hover                                                                        | standard, stagger, quick         |
| 9   | FAQ          | One answer open at a time; soft height and opacity; plus becomes minus                                                                                                     | Interaction                                                                             | exit                             |
| 10  | Download     | **No waves.** Dawn glow rises from below, then title, line and badge blur-reveal 80 ms apart. Glow stays very soft, no color banding at any width                          | Into view                                                                               | ambient, standard, blur, stagger |
|     | Sticky bar   | Blur-fades in after the hero, out while the demo is in view                                                                                                                | Scroll toggle                                                                           | standard, exit                   |

### Tokens and limits

- Tokens: quick 0.25, standard 0.45, exit 0.35, slow 1.2, ambient 2.4, blur 12 px, stagger 0.08, **press 0.15** (new, the soft white wash on press).
- Figma durations map to tokens: hover 0.3 s → quick, FAQ 0.35 s → exit.
- Offsets: text and UI at most 12 px. Background elements (glows, horizon, waves) at most 40 px.
- **Text reveals stagger whole elements** (title, then lead, then buttons, then note), 80 ms apart, as in the app's motion rules. Text is never split into lines or words. No SplitText for now; if it is ever added, use `autoSplit: true`.
- Hover glow brightens through `opacity` on a pseudo-element, never by animating `box-shadow`.
- **The one height exception:** the FAQ answer (and "Read the studies") opens with `grid-template-rows: 0fr → 1fr` (or `interpolate-size` where supported), exit duration. Instant with Reduce Motion.
- **FAQ is native `<details name="faq">`**, with no JS accordion. It works without JS, the native `<summary>` is keyboard accessible, and the shared `name` keeps one answer open at a time. On iOS 17.0 and 17.1 (no `name` support) two answers can be open at once, which is harmless.
- The arc curve draws with `stroke-dashoffset` on a single SVG path (cheap); fallback is a `clip-path` reveal.

### Marking elements (fixed in phase 2, so the HTML never changes later)

- `data-section="<id>"` on each section root: the loader's key.
- `data-reveal`: blur-fade in. `data-reveal="rise"`: plus a 12 px rise.
- `data-reveal-group` on a parent: its `[data-reveal]` children stagger. `data-reveal-order` overrides the order (Full before Free).
- `data-part="curve|dot|phase|horizon|title|…"`: hooks inside a section; a module queries only within its own section root.
- `data-wave="<preset>"` on `WaveStrip`.
- Classes are for styling, data attributes for behaviour. JS never queries a class.

### Hero entrance (CSS, not GSAP)

The hero H1 is the likely LCP element, so its entrance never waits for the JS bundle.

- The entrance is CSS `@keyframes` (opacity and `filter: blur()`) declared in the hero's own styles, so it starts at first paint.
- Title, lead, buttons and note use the same keyframes with `animation-delay` steps of 80 ms (`--motion-stagger`).
- The waves grow from a flat line with a `scaleY(0 → 1)` keyframe on the `WaveStrip` wrapper (slow, ease-in-out). The phase 5 canvas sits inside the same wrapper, so it inherits the growth with no handoff.
- The horizon rises 40 px and fades in with its own keyframe (ambient).
- `animation-fill-mode: both`, so there is no flash of the final state before the animation starts. The start state lives only in the keyframes; nothing is hidden by a class, so there is no fallback timer.
- GSAP only handles the hero's scroll-linked flatten and the wave drift.
- With Reduce Motion there is no entrance animation: the keyframes are only applied inside `@media (prefers-reduced-motion: no-preference)`.

### Where the code lives

- One `<script>` in `BaseLayout` loads `animations/index.ts`: registers GSAP, starts Lenis and the wave renderer, runs `sections/hero.ts` (flatten scrub only) right away.
- An IntersectionObserver (`rootMargin: 100%`) loads each other section's module with dynamic `import()` from a static map, so the bundler splits them.
- Every module exports `init(root: HTMLElement): () => void`. Inside it uses `gsap.matchMedia()` with `reduce` / `motion` conditions; the returned cleanup calls `mm.revert()`.
- `core/reveal.ts` holds the single blur-fade helper every section uses.

### Lenis + ScrollTrigger

- `new Lenis({ autoRaf: false })`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
- The wave canvases draw from the same `gsap.ticker`: one loop for the page.
- Touch scroll stays native (no `syncTouch`). Keyboard scroll stays native. Anchors go through Lenis with the header offset, matching `scroll-margin-top`.
- `ScrollTrigger.config({ ignoreMobileResize: true })` for the iOS address bar. No pinned sections.
- Lenis's own stylesheet (`lenis/dist/lenis.css`, or its rules copied in) is part of the global styles, added in phase 5 with the package.

### Reduce Motion

Figma `214:23`: everything appears without movement, waves stay still.

- Lenis never starts.
- The hero has no entrance animation; it is simply there.
- Other reveals are plain opacity: no blur, no offset, no scale.
- Arc renders fully drawn with every phase lit. Hero renders at its final state, no flatten scrub.
- No wave canvas is created and the renderer is not loaded: the static SVG from phase 2 is the frame.
- FAQ opens instantly.
- `gsap.matchMedia()` reverts live if the setting changes while the page is open.

### Without JavaScript

- All content is in the HTML and visible.
- The hero entrance is pure CSS and plays the same with or without JS. Nothing is hidden behind a `.js` class.
- Below the fold, starting states are set with `gsap.set` when each module loads. Elements already on screen at that moment stay visible, so jumping to an anchor never hides content.
- FAQ and "Read the studies" are `<details name="…">`, which open and close without JS.

## 6. Waves

Same maths and values as the app's `WaveBundle` (`Signal/App/DesignSystem/WaveBundle.swift`, `ModeWaves.swift`). The app repo is read only.

### Maths (`lib/wave/geometry.ts`)

For line `k` of `n`, with `mid = (n - 1) / 2`, `x` in 0…1 across the box and time `t` in seconds:

```
closeness = 1 - |k - mid| / (mid + 1)
breath    = 1 + breathDepth · sin(2π · breathRate · t)
amp_k     = amplitude · energy · breath · (0.35 + 0.65 · closeness)
cycles_k  = baseCycles + k · cycleSpread
phase_k   = 0.55 · k + 2π · driftSpeed · t · (1 + 0.07 · k)
y         = centerY + amp_k · envelope(x) · sin(2π · cycles_k · x + phase_k)
envelope  = sin(π · u)^1.6   (u maps envelope.lo…peak…hi to 0…0.5…1; 0 outside)
```

- **Line spacing:** lines share one center line. They separate through the amplitude taper (closeness), `cycleSpread` (extra cycles per line), a fixed 0.55 rad phase step and a 7% faster drift per line. There is no vertical offset.
- **Colors:** the center line is white at 2 px; the others alternate `--color-wave-1` / `--color-wave-2` at 1.1 px. Alpha is `(0.15 + 0.75 · closeness²) · lineOpacity`.
- **Glow:** as in Figma, the same lines drawn again under the crisp lines and blurred: a soft layer (Figma layer blur 22, opacity 0.7) and a near layer (blur 8, opacity 0.8), with the lines' own colors and opacities. A Gaussian's standard deviation is about half Figma's radius (`GLOW_LAYERS` in `lib/wave/geometry.ts`).
  - **Static SVG (phase 2):** each glow layer is its own `<svg>` blurred with a real `feGaussianBlur` (stdDeviation 11 and 4), referenced through CSS `filter: url(#…)`. On an HTML-level element the blur is measured in CSS px, so it stays round although the viewBox stretches sideways. The filter region reaches well past the wave (x −25 %, y −100 %, width 150 %, height 300 %), so the blur never ends in a straight edge.
  - **Animated canvas (phase 5):** the glow is drawn on its own canvas at about 1/4 resolution, scaled up with CSS, plus a light CSS `filter: blur()` on that glow canvas only. The main lines stay on a full-resolution canvas on top. No per-frame blur on full-resolution layers. Acceptance: steady 60 fps on the hero at 4× CPU throttling.
- `energy` (0…1) grows the waves from a flat line (hero).

### Units

- `driftSpeed`: phase drift in **cycles per second** (0.05 = one drift cycle every 20 s).
- `breathRate`: Hz. `breathDepth`: default 0.12.
- `amplitude`: peak height of the center line, in points, for the app's reference frame. The app's rule is frame ≥ 2.2 × amplitude + 50. On the web, amplitude scales to the box: `amp_px = amplitude × boxHeight / refHeight`. Line widths stay fixed in px.

### Speeds

- **Background and hero waves** drift on 10 to 20 s cycles (`driftSpeed` 0.05 to 0.1) and breathe at most 0.1 Hz.
- **Mode mini waves** keep the app presets: Sleep drifts slowest (50 s), Energy fastest (about 7 s) on purpose, so each mode shows its own pace.
- **This is not a photosensitivity issue.** The risk is light flashing at 2.5 to 18 Hz (the binaural beat range). The fastest wave on the page moves at about 0.22 Hz, more than ten times slower than the bottom of that range, and the guards below make anything faster impossible.

### Guards (`lib/wave/params.ts`, checked at build time, clamped at runtime)

- `breathRate ≤ 0.25 Hz` (hard limit). Background presets ≤ 0.1 Hz breathing and 0.05 to 0.1 drift.
- The fastest line's drift, `driftSpeed · (1 + 0.07 · (n - 1))`, is also ≤ 0.25 Hz. That is how often any point on screen sees a crest pass (Energy: 0.14 × 1.56 ≈ 0.22 Hz).
- No visual value is ever derived from the audio beat frequency.

### Presets (`data/presets/`)

Mode waves (from `ModeWaves.swift`, `refHeight` 126):

| Mode     | lines | amplitude | baseCycles | cycleSpread | lineOpacity | driftSpeed | breathRate | glow |
| -------- | ----- | --------- | ---------- | ----------- | ----------- | ---------- | ---------- | ---- |
| Sleep    | 5     | 34        | 0.8        | 0.10        | 0.8         | 0.02       | 0.06       | yes  |
| Meditate | 7     | 28        | 1.6        | 0.10        | 1           | 0.04       | 0.10       | yes  |
| Focus    | 7     | 20        | 2.6        | 0.05        | 1           | 0.07       | 0.12       | yes  |
| Energy   | 9     | 26        | 4          | 0.15        | 1           | 0.14       | 0.22       | yes  |

In the 64 px mode-card box, amplitude scales by 64 / 126 (Sleep: 34 → 17 px).

Demo waves (from `WaveBundle.leftTone / rightTone / beat`, `refHeight` 200): left tone 5 lines, amplitude 38, 2.8 cycles, envelope 0…0.93 peak 0.41, wave-1 color, no glow. Right tone 5 lines, 38, 3.2 cycles, envelope 0.07…1 peak 0.59, wave-2 color, no glow. Beat 7 lines, 58, 1.2 cycles, envelope 0.14…0.87 peak 0.5, with glow. These match the demo canvas layers in Figma (Left tone, Right tone, Beat glow, Beat).

Background and hero strips (one `background` preset), measured from the Figma "Strip Waves" vectors (phone 201:3, tablet and desktop share the same shape): 7 lines, even crests with no taper (`taper: false`), no cycle spread. Each line is a fixed share of the center line's height (0.45 / 0.7 / 0.9 / 1 / 0.85 / 0.65 / 0.4) and 0.045 of a cycle behind the next (`phaseStep`, counted from the center line). Center line 1.6 px, line opacity by distance from the center 0.95 / 0.55 / 0.45 / 0.35. Drift 0.06 (about 17 s), breathing 0.1 Hz.

### Where the strips show (Figma, per size)

| Section     | Phone                                                                   | Tablet | Desktop |
| ----------- | ----------------------------------------------------------------------- | ------ | ------- |
| Hero        | on (stronger center line: 0.35 / 0.55 / 0.8 / 1.35 / 0.8 / 0.55 / 0.35) | on     | on      |
| Modes       | off                                                                     | on     | off     |
| Meditations | off                                                                     | off    | off     |
| Science     | off                                                                     | on     | on      |
| Pricing     | on                                                                      | on     | on      |
| Download    | off                                                                     | off    | off     |

Hidden Figma layers never reach the build. Tablet is 768 to 1279, desktop from 1280.

### Strip rule (Figma `214:574`)

The background strip starts 0.9 screen widths to the left. Its crests are calm, even sines at every width: same length and height across the screen, never squeezed into sharp peaks.

| Width | Crests on screen | Crest length | Center amplitude |
| ----- | ---------------- | ------------ | ---------------- |
| 393   | 2.6              | 151 px       | 16 px            |
| 1024  | 3.2              | 320 px       | 30.7 px          |
| 1440  | 3.2              | 450 px       | 43.2 px          |
| 1920  | 3.2              | 600 px       | 57.6 px          |

From 1024 up the crest length is `31.25vw` and the amplitude `3vw`; from 393 to 1024 both follow one linear segment, so nothing jumps.

- The phase 2 static SVG draws `STRIP_CYCLES` (7) whole cycles and is sized in CSS (`WaveStrip`, `--strip-wavelength`, `--strip-amplitude`), so it only scales and every crest stays a true sine. `vector-effect: non-scaling-stroke` keeps line widths fixed.
- The canvas uses the same two values per width and draws only the visible part: `x_strip = 0.9 · width + x`, in crest lengths.

### `WaveStrip` props

`preset` (`'background' | 'demo-left' | 'demo-right' | 'demo-beat' | ModeId`), `layout: 'strip' | 'box'`, `height` (box only; a strip's center line sits where it is placed). The hero uses the `background` preset. Always `aria-hidden`.

- **Phase 2:** static inline SVG at `t = 0`, `energy = 1`. Strips are clipped sideways by `WaveStrip` and the `Section` bleed, so they never widen the page.
- **Phase 5:** `animations/waves/renderer.ts` adds two canvases over the SVG (a 1/4-resolution glow canvas with a light CSS blur, and a full-resolution lines canvas on top) and draws from the shared ticker. Paused off screen (IntersectionObserver), DPR capped at 2, never created under Reduce Motion.

## 7. Assets

- **Logo:** SVG from the Figma "Logo / Wordmark / Night" component.
- **App Store badge:** Apple's official "Download on the App Store" SVG, from Apple's marketing resources, unmodified.
- **QR code:** static SVG pointing to `https://apps.apple.com/app/id6811405143` (with the campaign token once known), generated once and committed.
- **Privacy phone mockup:** for now, the Figma redraw's screen ("B5 · Complete", `217:262`) exported as a 2× PNG (`src/assets/privacy-complete.png`, served as AVIF/WebP); the phone frame around it is CSS. Ana replaces the screen with a real screenshot later.

## 8. Phase 2 split

- **2a:** this document, token updates (gutters, type scale, press duration), primitive components.
- **2b:** sections 1 to 5.
- **2c:** sections 6 to 10.

Each is one branch from `develop` (`feat/2a-tokens-components`, `feat/2b-sections-1-5`, `feat/2c-sections-6-10`) and one PR into `develop`.

## 9. Later phases (order in CLAUDE.md §15)

After 2c comes the launch pack (phase 3), then launch (phase 4). The motion system (phase 5) and the section animations (phase 6) come after launch, one section at a time on the live site.

- **Phase 3a (Try the beat with real audio):** the Start button (hidden until the script runs), Web Audio tones, the earbud test, mode chips and the silent-mode hint. The demo gets labelled controls, full keyboard operation, and `aria-live="polite"` announcements for step and mode changes. Its waves stay static until phase 5. Built: `src/audio/binaural.ts` (engine) and `src/audio/demo-controller.ts` (steps, chips, switch, the step 5 glide to 10 Hz over 20 s with a "Now" label updated once a second, stop and fresh start on Stop, Escape, scrolling away, a hidden tab or an interruption). A small loader in `DemoCard` imports them when the card is within one screen of the viewport.
- **Phase 3b (sticky App Store bar):** built hidden in 2c (`hidden` attribute, phone only); a small script removes `hidden` after the hero and puts it back while the demo or the final section is on screen, so it never covers the footer (IntersectionObserver, no GSAP). Built: one IntersectionObserver on the hero, Try the beat, the final section and the footer; the bar shows on phone only when none of them is on screen (from the arc section to the FAQ). A temporary CSS opacity fade, to be replaced by the motion phase's blur-fade.
- **Phase 3c (SEO/AEO):** titles and descriptions, the share image, `public/robots.txt` with the rules in CLAUDE.md §13, the sitemap, the Smart App Banner and the JSON-LD (§12) in `SeoHead`. App Store campaign tokens are filled in `appStoreUrl`.
- **Phase 3d (checks):** Lighthouse, VoiceOver on iPhone, keyboard, Safari and Chrome on phone, iPad and desktop.
- **Phase 3e (launch steps):** written out for Ana, for after Marie approves (domain to Vercel, GitHub Pages off).

## 10. Known risks

- **LCP:** the hero entrance is CSS from first paint, so LCP doesn't wait for JS. Still measured in phase 5, since an element at opacity 0 isn't counted until it starts to show.
- **Wave glow cost:** phase 2 blurs static SVG layers once (painted, then cached). Phase 5 blurs only the 1/4-resolution glow canvas; verified at 4× CPU throttle on the hero.
- **Dependencies:** `gsap` and `lenis` are added in phase 5. Estimated initial JS about 50 KB gzipped.
