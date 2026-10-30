/** Share of a session spent in each phase, from the app engine. */
export const arcSplit = { easeIn: 0.25, hold: 0.5, return: 0.25 } as const;

export type ArcPhase = keyof typeof arcSplit;

/**
 * Whole minutes per phase for a session length. Rounds by largest remainder,
 * so the phases always add up to the session (25 min gives 6 / 13 / 6).
 */
export function phaseMinutes(totalMinutes: number): Record<ArcPhase, number> {
  const parts = (Object.keys(arcSplit) as ArcPhase[]).map((phase) => {
    const exact = totalMinutes * arcSplit[phase];
    return { phase, minutes: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let left = totalMinutes - parts.reduce((sum, part) => sum + part.minutes, 0);

  for (const part of [...parts].sort((a, b) => b.remainder - a.remainder)) {
    if (left <= 0) break;
    part.minutes += 1;
    left -= 1;
  }

  return Object.fromEntries(parts.map((part) => [part.phase, part.minutes])) as Record<
    ArcPhase,
    number
  >;
}
