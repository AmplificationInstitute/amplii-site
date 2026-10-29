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

- "What binaural beats are" is taught inside Try the beat. "Who makes Amplii" is one line in the footer area, above the links: "Amplii is made by Amplification Institute, founded by Marie Monet.", with "Amplification Institute" linking to https://amplificationinstitute.com.
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
  audio/            (phase 5) binaural.ts, demo-controller.ts
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

| Component                                          | Props                                                                                                                                                       | Used in                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `Section`                                          | `id`, `labelledBy`; `bleed` slot (glows and waves, full width), default slot (in the container)                                                             | every section                                                |
| `SectionHeader`                                    | `title`, `lead?`, `level` (default 2), `align: 'start' \| 'center'`                                                                                         | 2 to 10                                                      |
| `GlassCard`                                        | `as` (`div` / `article` / `li`), `padding: 'md' \| 'lg'` (Figma card: fill, stroke, radius 30, shadow, blur 12)                                             | arc, meditations, demo, plans, facts, modes                  |
| `Pill`                                             | `label` (accent fill, Figma "Coming to Amplii")                                                                                                             | "Coming to Amplii"                                           |
| `Button`                                           | `href?` (renders `<a>`, else `<button>`), `variant: 'primary' \| 'secondary'`, `size: 'sm' (40) \| 'md' (52) \| 'lg' (56)`, `type?`                         | nav, hero, demo, plans                                       |
| `AppStoreBadge`                                    | `campaign` (passed to `appStoreUrl`), `height` (default 56, Apple minimum 40), `eager`                                                                      | hero, pricing, download, sticky bar                          |
| `QrCode`                                           | `size` (static pre-generated SVG, no library)                                                                                                               | download (tablet and desktop)                                |
| `Glow`                                             | `x`, `y` (center), `width`, `height` (the ellipse), `intensity` (CSS radial gradient, `aria-hidden`). The dawn variant comes with the Download section (2c) | all                                                          |
| `Horizon`                                          | none (three layers: glow, rim, line)                                                                                                                        | hero                                                         |
| `WaveStrip`                                        | see §6                                                                                                                                                      | hero, modes, meditations, science, pricing, demo, mode cards |
| `PhoneMockup`                                      | `screen: ImageMetadata`, `alt`, `width`                                                                                                                     | privacy                                                      |
| `ModeCard`                                         | `mode: ModeId` (everything else comes from presets and copy)                                                                                                | modes                                                        |
| `FactCard`                                         | `index`, `title`, `body`                                                                                                                                    | science                                                      |
| `FaqItem`                                          | `question`, `answer`, `group` (shared `name`, one answer open at a time)                                                                                    | FAQ, "Read the studies"                                      |
| `Stepper`                                          | `steps`, `current`                                                                                                                                          | try the beat                                                 |
| `DemoCard`                                         | `steps`, `leftHz`, `rightHz` (composes WaveStrip, Stepper text and Buttons)                                                                                 | try the beat                                                 |
| `ArcChart`                                         | `mode` (default meditate; curve, axis and minutes from presets)                                                                                             | arc                                                          |
| `PlanCard`                                         | `plan: 'free' \| 'full'`, `featured?`                                                                                                                       | pricing                                                      |
| `SiteHeader`, `SiteFooter`, `StickyAppBar`, `Logo` | none (copy from content files)                                                                                                                              | layout                                                       |

A section only composes these components with its content file.

**App Store links:** one helper, `appStoreUrl(campaign)` in `src/lib/app-store.ts`, builds every link to the App Store: the badges, "Get the app" in the nav and the sticky bar, and "Try Amplii Full". Each call site passes its own campaign name, so downloads can be attributed without tracking visitors. Until phase 6 the provider and campaign tokens are `[TODO]` and the helper returns the plain `https://apps.apple.com/app/id6811405143`. "Try the beat" is an in-page anchor (`#how-it-works`) and needs none.

**Type weights:** Jost SemiBold for the hero and section titles (`--weight-display`, the only preloaded weight), Jost Light for the fact numbers, Archivo Regular and Medium for text. Jost Regular is not loaded.

**Badge size:** the official badge is 56 px tall, lining up with the 56 px secondary button beside it.

**App Store badge rule:** wherever "Download on the App Store" appears (hero, pricing, download, sticky bar), it is Apple's official badge (`AppStoreBadge`), per Apple's marketing guidelines. Custom `Button`s ("Get the app", "Try the beat", "Try Amplii Full") never use the Apple logo or the words "App Store".

**Touch targets:** the 40 px nav button keeps its look and gets a 44 px hit area through a pseudo-element.

## 4. Responsive (CSS only, no JavaScript for layout)

From Figma `214:574`.

- **Designed widths:** 393 phone, 1024 tablet and small laptop, 1440 desktop, 1920 large desktop.
- **Breakpoints:** `@media (width >= 768px)` tablet layout, `(width >= 1280px)` desktop layout. One extra rule at `1024px` (Try the beat, two columns). Above 1920 it stays the 1920 design with more space.
- **Scoped styles:** `scopedStyleStrategy: 'class'` in `astro.config.mjs`, so a class a section passes to a component (`<WaveStrip class="…">`) keeps the section's scoped styles.
- **Container:** text and cards in a centered column, max 1200 px. Glows, waves and the horizon run full width through the `Section` `bleed` slot. Only the page clips sideways: `html { overflow-x: clip }` (`clip`, not `hidden`, so `position: sticky` still works).
- **Side margins:** 20 px below 390, 24 px phone, 48 px tablet, then `clamp(3rem, 17.31vw - 8.075rem, 7.5rem)` from 1024 (48 at 1024, 120 at 1440), then the 1200 column is centered.
- **Type scale:** one linear `clamp()` per segment (393 to 1024, 1024 to 1440, 1440 to 1920), with the token redefined at 1024 and 1440. Segment ends match, so nothing jumps.
  - Hero title 40 / 60 / 76 / 88
  - Section title 32 / 44 / 52 / 56
  - Body 16 / 18 / 20 / 20
  - Jost from 28 px up, Archivo at 20 px and below.
- **Layout changes** (grid; card internals use `@container`):

| Section              | Phone (< 768)                                           | Tablet (768 to 1279)              | Desktop (≥ 1280)                             |
| -------------------- | ------------------------------------------------------- | --------------------------------- | -------------------------------------------- |
| Nav                  | wordmark, Get the app                                   | + four section links              | same as tablet                               |
| Hero                 | stacked, buttons stacked                                | buttons in a row                  | as Figma                                     |
| Try the beat         | stacked                                                 | two columns from 1024 (`5fr 7fr`) | two columns                                  |
| Modes                | one column of row cards                                 | 2 × 2                             | 4 in a row                                   |
| Science              | scroll-snap carousel (no JS, labelled focusable region) | 2 × 2                             | row of 4                                     |
| Privacy              | phone below the text                                    | phone below the text              | phone beside the text (`1fr auto`)           |
| Pricing              | stacked                                                 | stacked                           | side by side (`720fr 456fr`, Full then Free) |
| FAQ                  | stacked                                                 | stacked                           | title column + 720 px questions              |
| Download             | badge only                                              | badge + QR code                   | badge + QR code                              |
| Sticky App Store bar | shown after the hero, hidden during the demo            | hidden                            | hidden                                       |

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
- The waves grow from a flat line with a `scaleY(0 → 1)` keyframe on the `WaveStrip` wrapper (slow, ease-in-out). The phase 3 canvas sits inside the same wrapper, so it inherits the growth with no handoff.
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
- Lenis's own stylesheet (`lenis/dist/lenis.css`, or its rules copied in) is part of the global styles, added in phase 3 with the package.

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
  - **Animated canvas (phase 3):** the glow is drawn on its own canvas at about 1/4 resolution, scaled up with CSS, plus a light CSS `filter: blur()` on that glow canvas only. The main lines stay on a full-resolution canvas on top. No per-frame blur on full-resolution layers. Acceptance: steady 60 fps on the hero at 4× CPU throttling.
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

Background and hero strips (one `background` preset), measured from the Figma "Strip Waves" vectors: 7 lines, 9 crests across the 2.8 × strip (about 3 on screen), no cycle spread, center amplitude 43 px, center line 1.6 px, line opacity by distance from the center 0.95 / 0.55 / 0.45 / 0.35. Drift 0.06 (about 17 s), breathing 0.1 Hz.

### Strip rule (Figma `214:574`)

The background strip is 2.8 × the screen width and starts 0.9 widths to the left, so every screen shows the same part of the wave (about three crests). Never repeat or squeeze it.

- The canvas draws only the visible window, mapped to that part of the strip: `x_strip = (0.9 + x) / 2.8`. Same picture, no 4000 px canvas.
- The phase 2 static SVG uses a normalized `viewBox`, `preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke`, which gives the same result without JS.

### `WaveStrip` props

`preset` (`'background' | 'demo-left' | 'demo-right' | 'demo-beat' | ModeId`), `layout: 'strip' | 'box'`, `height`. The hero uses the `background` preset. Always `aria-hidden`.

- **Phase 2:** static inline SVG at `t = 0`, `energy = 1`.
- **Phase 3:** `animations/waves/renderer.ts` adds two canvases over the SVG (a 1/4-resolution glow canvas with a light CSS blur, and a full-resolution lines canvas on top) and draws from the shared ticker. Paused off screen (IntersectionObserver), DPR capped at 2, never created under Reduce Motion.

## 7. Assets

- **Logo:** SVG from the Figma "Logo / Wordmark / Night" component.
- **App Store badge:** Apple's official "Download on the App Store" SVG, from Apple's marketing resources, unmodified.
- **QR code:** static SVG pointing to `https://apps.apple.com/app/id6811405143` (with the campaign token once known), generated once and committed.
- **Privacy phone mockup:** for now, the Figma redraw ("Phone · B5 Complete", `217:199`) exported from the Privacy section as SVG or 2× PNG. Ana replaces it with a real screenshot later.

## 8. Phase 2 split

- **2a:** this document, token updates (gutters, type scale, press duration), primitive components.
- **2b:** sections 1 to 5.
- **2c:** sections 6 to 10.

Each is one branch from `develop` (`feat/2a-tokens-components`, `feat/2b-sections-1-5`, `feat/2c-sections-6-10`) and one PR into `develop`.

## 9. Later phases (additions to CLAUDE.md §15)

- **Phase 5 (Try the beat):** the demo gets labelled controls, full keyboard operation, and `aria-live="polite"` announcements for step and mode changes.
- **Phase 6 (SEO/AEO):** `public/robots.txt` with the rules in CLAUDE.md §13, and the JSON-LD (§12) in `SeoHead`. App Store campaign tokens are filled in `appStoreUrl`.

## 10. Known risks

- **LCP:** the hero entrance is CSS from first paint, so LCP doesn't wait for JS. Still measured in phase 3, since an element at opacity 0 isn't counted until it starts to show.
- **Wave glow cost:** phase 2 blurs static SVG layers once (painted, then cached). Phase 3 blurs only the 1/4-resolution glow canvas; verified at 4× CPU throttle on the hero.
- **Dependencies:** `gsap` and `lenis` are added in phase 3. Estimated initial JS about 50 KB gzipped.
