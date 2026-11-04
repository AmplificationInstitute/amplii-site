import { tryTheBeat } from '../content/en/try-the-beat';
import {
  DEMO_CARRIER_HZ,
  DEMO_GLIDE_SECONDS,
  DEMO_GLIDE_TO_HZ,
  DEMO_START_MODE,
  demoTones,
} from '../data/presets/demo';
import { modes, type ModeId } from '../data/presets/modes';
import { BinauralBeat } from './binaural';

/**
 * Drives the Try the beat card (DemoCard.astro): the steps, the sound, the
 * stepper beside it, focus and screen reader announcements. Every state is
 * already in the HTML; this only switches data-step and a few labels.
 *
 * The sound stops, and the demo starts fresh from step 0, on Stop, when the
 * section leaves the screen, when the tab is hidden, or when the phone
 * interrupts it. Nothing visual follows the beat frequency (CLAUDE.md §6).
 */

const STEPS = tryTheBeat.stepCards.length;
/** The step 5 label updates at most once a second. */
const NOW_INTERVAL = 1000;

function query<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Try the beat: missing ${selector}`);
  return element;
}

/** "8.4", or "10" once the glide lands */
function formatHz(hz: number): string {
  return String(Math.round(hz * 10) / 10);
}

export function initDemo(card: HTMLElement): void {
  const section = card.closest('section') ?? document.body;
  const start = query<HTMLButtonElement>(card, '[data-demo-start]');
  const next = query<HTMLButtonElement>(card, '[data-demo-next]');
  const stops = card.querySelectorAll<HTMLButtonElement>('[data-demo-stop]');
  const speaker = query<HTMLButtonElement>(card, '[data-demo-speaker]');
  const radios = card.querySelectorAll<HTMLInputElement>('input[name="demo-mode"]');
  const earLeft = query<HTMLElement>(card, '[data-demo-ear="left"]');
  const earRight = query<HTMLElement>(card, '[data-demo-ear="right"]');
  const now = query<HTMLElement>(card, '[data-demo-now]');
  const live = query<HTMLElement>(card, '[data-demo-live]');
  const stepperItems = section.querySelectorAll<HTMLElement>('[data-part="stepper"] li');
  const lastTitle = query<HTMLElement>(card, '.demo-card__text [data-for="5"] .demo-card__title');

  let engine: BinauralBeat | null = null;
  let step = 0;
  let mode: ModeId = DEMO_START_MODE;
  let nowTimer = 0;
  let starting = false;

  const modeName = (id: ModeId) => modes.find((m) => m.id === id)?.name ?? id;

  function announce(text: string): void {
    /* Cleared first, so the same words are read again */
    live.textContent = '';
    requestAnimationFrame(() => {
      live.textContent = text;
    });
  }

  function showTones(id: ModeId): void {
    const tones = demoTones(id);
    earLeft.textContent = tryTheBeat.ear('Left', tones.left);
    earRight.textContent = tryTheBeat.ear('Right', tones.right);
  }

  function setSpeaker(on: boolean): void {
    speaker.setAttribute('aria-checked', String(on));
    card.dataset.speaker = on ? 'on' : 'off';
    engine?.setSpeaker(on);
  }

  function setMode(id: ModeId): void {
    mode = id;
    for (const radio of radios) radio.checked = radio.value === id;
    showTones(id);
    engine?.setBeat(demoTones(id).beat);
  }

  function stopNowLabel(): void {
    window.clearInterval(nowTimer);
    nowTimer = 0;
  }

  function updateNowLabel(): void {
    if (!engine) return;
    const hz = engine.beatHz;
    now.textContent = tryTheBeat.now(formatHz(hz));
    if (hz === DEMO_GLIDE_TO_HZ) stopNowLabel();
  }

  function setStep(next: number): void {
    step = next;
    card.dataset.step = String(next);
    const current = Math.max(next, 1);
    stepperItems.forEach((item, index) => {
      if (index + 1 === current) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    if (next !== 4) setSpeaker(false);
    if (next === 5 && engine) {
      engine.setBeat(DEMO_GLIDE_TO_HZ, DEMO_GLIDE_SECONDS);
      updateNowLabel();
      nowTimer = window.setInterval(updateNowLabel, NOW_INTERVAL);
    }

    const stepCard = tryTheBeat.stepCards[next - 1];
    if (stepCard) announce(tryTheBeat.announceStep(next, STEPS, stepCard.title));
  }

  /** Back to "Before you start", ready for a fresh start */
  function reset({ moveFocus }: { moveFocus: boolean }): void {
    stopNowLabel();
    engine = null;
    setSpeaker(false);
    setMode(DEMO_START_MODE);
    now.textContent = tryTheBeat.now(formatHz(demoTones(DEMO_START_MODE).beat));
    setStep(0);
    announce(tryTheBeat.announceStopped);
    if (moveFocus) start.focus();
  }

  async function stop({ moveFocus }: { moveFocus: boolean }): Promise<void> {
    if (!engine) return;
    const playing = engine;
    reset({ moveFocus });
    await playing.stop();
  }

  start.addEventListener('click', () => {
    if (engine || starting) return;
    starting = true;
    const beat = new BinauralBeat({
      carrierHz: DEMO_CARRIER_HZ,
      beatHz: demoTones(mode).beat,
      onInterrupt: () => {
        if (engine === beat) reset({ moveFocus: false });
      },
    });
    engine = beat;
    beat
      .start()
      .then(() => {
        if (engine !== beat) return;
        setStep(1);
        next.focus();
      })
      .catch(() => {
        if (engine === beat) reset({ moveFocus: true });
      })
      .finally(() => {
        starting = false;
      });
  });

  next.addEventListener('click', () => {
    if (!engine || step >= STEPS) return;
    setStep(step + 1);
    /* Next is gone on the last step; its title takes the focus instead */
    if (step === STEPS) lastTitle.focus();
  });

  for (const button of stops) {
    button.addEventListener('click', () => void stop({ moveFocus: true }));
  }

  for (const radio of radios) {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      const id = radio.value as ModeId;
      setMode(id);
      announce(tryTheBeat.announceMode(modeName(id), demoTones(id).beat));
    });
  }

  speaker.addEventListener('click', () => {
    const on = speaker.getAttribute('aria-checked') !== 'true';
    setSpeaker(on);
    announce(tryTheBeat.announceSpeaker(on));
  });

  /* Escape anywhere in the card stops the sound */
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && engine) void stop({ moveFocus: true });
  });

  /* Stop when the section leaves the screen or the tab is hidden; focus stays put */
  new IntersectionObserver((entries) => {
    if (entries.some((entry) => !entry.isIntersecting)) void stop({ moveFocus: false });
  }).observe(section);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) void stop({ moveFocus: false });
  });

  lastTitle.tabIndex = -1;
  start.hidden = false;
}
