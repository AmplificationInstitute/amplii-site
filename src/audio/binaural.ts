/**
 * Binaural beat engine for the Try the beat demo (CLAUDE.md §8). Two sine
 * tones a few Hz apart, one in each ear: the brain hears the difference as a
 * soft beat. Generated live with the Web Audio API, no files.
 *
 *   left oscillator  ─┬─ gain ─ left channel ─┐
 *                     └─ gain ─ right channel ┤
 *   right oscillator ─┬─ gain ─ left channel ─┼─ merger ─ master ─ speakers
 *                     └─ gain ─ right channel ┘
 *
 * With headphones each tone reaches one ear only. "Play like a speaker"
 * opens the cross gains, so both tones mix in both ears.
 */

/** Seconds. Matches the motion tokens: audio fades follow the same feel. */
const FADE_IN = 2;
const FADE_OUT = 0.35; /* exit */
const SPEAKER_FADE = 0.25; /* quick */
/** Time constant of quick frequency changes: smooth, with no click. */
const QUICK_CHANGE = 0.04;
/** Peak level of the master gain: about −16 dB, so it starts quiet. */
const DEFAULT_VOLUME = 0.16;
/** Speaker mode: each tone at this level in each ear, so two tones per ear sound about as loud as one. */
const MIX_LEVEL = 0.6;

export interface BinauralOptions {
  /** The pitch both tones sit evenly around, in Hz. */
  carrierHz: number;
  /** The difference between the ears, in Hz. */
  beatHz: number;
  volume?: number;
  /** Called once if the browser stops the sound on its own (a call, another app). */
  onInterrupt?: () => void;
}

/* Safari 17+: lets web audio play with the iPhone silent switch on. Not in the DOM types yet. */
interface AudioSessionNavigator extends Navigator {
  audioSession?: { type: string };
}

/** A linear glide of the beat, in AudioContext time. */
interface Glide {
  from: number;
  to: number;
  start: number;
  end: number;
}

export function isBinauralSupported(): boolean {
  return typeof window !== 'undefined' && 'AudioContext' in window;
}

export class BinauralBeat {
  readonly #carrier: number;
  readonly #volume: number;
  readonly #onInterrupt: (() => void) | undefined;

  #context: AudioContext | null = null;
  #left: OscillatorNode | null = null;
  #right: OscillatorNode | null = null;
  #master: GainNode | null = null;
  /** Each tone in its own ear, and in the other ear (speaker mode). */
  #own: GainNode[] = [];
  #cross: GainNode[] = [];
  #glide: Glide;
  #stopping = false;

  constructor({ carrierHz, beatHz, volume = DEFAULT_VOLUME, onInterrupt }: BinauralOptions) {
    this.#carrier = carrierHz;
    this.#volume = volume;
    this.#onInterrupt = onInterrupt;
    this.#glide = { from: beatHz, to: beatHz, start: 0, end: 0 };
  }

  get playing(): boolean {
    return this.#context !== null && !this.#stopping;
  }

  /** The beat right now, in Hz, following any glide in progress. */
  get beatHz(): number {
    const { from, to, start, end } = this.#glide;
    const now = this.#context?.currentTime ?? 0;
    if (now >= end || end <= start) return to;
    if (now <= start) return from;
    return from + ((to - from) * (now - start)) / (end - start);
  }

  /** Must run inside a tap or key press: browsers only allow sound after one. */
  async start(): Promise<void> {
    if (this.#context) return;

    const session = (navigator as AudioSessionNavigator).audioSession;
    if (session) session.type = 'playback';

    const context = new AudioContext();
    this.#context = context;
    this.#stopping = false;

    const merger = context.createChannelMerger(2);
    const master = context.createGain();
    master.gain.value = 0;
    merger.connect(master).connect(context.destination);

    const beat = this.#glide.to;
    const left = this.#tone(context, this.#carrier - beat / 2);
    const right = this.#tone(context, this.#carrier + beat / 2);

    /* Own ear at full level; the other ear starts closed (headphones) */
    this.#own = [
      this.#route(context, left, merger, 0, 1),
      this.#route(context, right, merger, 1, 1),
    ];
    this.#cross = [
      this.#route(context, left, merger, 1, 0),
      this.#route(context, right, merger, 0, 0),
    ];

    this.#left = left;
    this.#right = right;
    this.#master = master;
    this.#glide = { from: beat, to: beat, start: 0, end: 0 };

    context.addEventListener('statechange', () => {
      if (this.#context === context && !this.#stopping && context.state !== 'running') {
        this.#teardown();
        this.#onInterrupt?.();
      }
    });

    await context.resume();
    const now = context.currentTime;
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(this.#volume, now + FADE_IN);
  }

  /**
   * Changes the beat. Without a glide it moves within a few milliseconds
   * (no click); with one it glides linearly over that many seconds.
   */
  setBeat(beatHz: number, glideSeconds = 0): void {
    const context = this.#context;
    const left = this.#left;
    const right = this.#right;
    if (!context || !left || !right) {
      this.#glide = { from: beatHz, to: beatHz, start: 0, end: 0 };
      return;
    }

    const now = context.currentTime;
    const from = this.beatHz;
    for (const [tone, sign] of [
      [left, -1],
      [right, 1],
    ] as const) {
      const param = tone.frequency;
      const target = this.#carrier + (sign * beatHz) / 2;
      param.cancelScheduledValues(now);
      param.setValueAtTime(this.#carrier + (sign * from) / 2, now);
      if (glideSeconds > 0) param.linearRampToValueAtTime(target, now + glideSeconds);
      else param.setTargetAtTime(target, now, QUICK_CHANGE);
    }
    this.#glide =
      glideSeconds > 0
        ? { from, to: beatHz, start: now, end: now + glideSeconds }
        : { from: beatHz, to: beatHz, start: 0, end: 0 };
  }

  /** On: both tones in both ears, as a speaker would play them. */
  setSpeaker(on: boolean): void {
    const context = this.#context;
    if (!context) return;
    const now = context.currentTime;
    const levels: [GainNode[], number][] = [
      [this.#own, on ? MIX_LEVEL : 1],
      [this.#cross, on ? MIX_LEVEL : 0],
    ];
    for (const [gains, level] of levels) {
      for (const gain of gains) {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(level, now + SPEAKER_FADE);
      }
    }
  }

  /** Fades out, then releases the audio hardware. */
  async stop(): Promise<void> {
    const context = this.#context;
    const master = this.#master;
    if (!context || !master || this.#stopping) return;
    this.#stopping = true;

    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    await new Promise((resolve) => setTimeout(resolve, FADE_OUT * 1000 + 50));
    this.#teardown();
  }

  #tone(context: AudioContext, hz: number): OscillatorNode {
    const tone = context.createOscillator();
    tone.type = 'sine';
    tone.frequency.value = hz;
    tone.start();
    return tone;
  }

  #route(
    context: AudioContext,
    tone: OscillatorNode,
    merger: ChannelMergerNode,
    channel: 0 | 1,
    level: number,
  ): GainNode {
    const gain = context.createGain();
    gain.gain.value = level;
    tone.connect(gain).connect(merger, 0, channel);
    return gain;
  }

  #teardown(): void {
    const context = this.#context;
    this.#context = null;
    this.#left?.stop();
    this.#right?.stop();
    this.#left = null;
    this.#right = null;
    this.#master = null;
    this.#own = [];
    this.#cross = [];
    this.#glide = { from: this.#glide.to, to: this.#glide.to, start: 0, end: 0 };
    this.#stopping = false;
    void context?.close();
  }
}
