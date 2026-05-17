/**
 * D7:1:3 — Deterministic propagation intensity attenuation by depth.
 */

export const PROPAGATION_ATTENUATION_BY_DEPTH: Readonly<Record<number, number>> = {
  1: 0.9,
  2: 0.6,
  3: 0.3,
};

/** Depth 4+ receives no propagation (cutoff). */
export const PROPAGATION_MAX_EFFECTIVE_DEPTH = 3;

export const PROPAGATION_INTENSITY_CUTOFF = 0.08;

export function attenuationFactorForDepth(depth: number): number {
  const d = Math.max(1, Math.floor(Number(depth) || 1));
  if (d > PROPAGATION_MAX_EFFECTIVE_DEPTH) return 0;
  return PROPAGATION_ATTENUATION_BY_DEPTH[d] ?? 0;
}

export function applyAttenuation(baseIntensity: number, depth: number): number {
  const base = Math.min(1, Math.max(0, Number(baseIntensity) || 0));
  const factor = attenuationFactorForDepth(depth);
  const out = base * factor;
  if (out < PROPAGATION_INTENSITY_CUTOFF) return 0;
  return Math.min(1, Number(out.toFixed(6)));
}

export function shouldCutoffAtDepth(depth: number): boolean {
  return Math.floor(Number(depth) || 0) > PROPAGATION_MAX_EFFECTIVE_DEPTH;
}
