/**
 * CC:9 — Deterministic scenario evaluation policy.
 *
 * Documents which interventions are evaluable. No black-box scores.
 *
 * Modeled (directional only; no invented magnitudes for unmodeled metrics):
 *   - do-nothing (requires explicit horizon when requireHorizon)
 *   - obj-capacity increase-by / decrease-by %
 *   - obj-demand increase-by / decrease-by %
 *
 * Unsupported:
 *   - advertising, hiring, and any subject not in MODELED_SUBJECTS
 */

export const NEXORA_SCENARIO_MODELED_SUBJECTS = Object.freeze([
  "obj-capacity",
  "obj-demand",
] as const);

export const NEXORA_SCENARIO_EVALUATION_POLICY = Object.freeze({
  /** Capacity % change affects capacity pressure directionally. */
  capacityPressureModeled: true as const,
  /** Demand % change affects demand pressure directionally. */
  demandPressureModeled: true as const,
  /**
   * Revenue / cost numeric outcomes are not invented.
   * Canonical relationships may mark relevance as unknown magnitude → partial.
   */
  inventNumericBusinessOutcomes: false as const,
  /** Horizon required for do-nothing evaluation when policy flag set. */
  doNothingRequiresHorizon: true as const,
  /** Preference uses transparent dimensions — not a universal score. */
  universalScore: false as const,
});

export function isModeledScenarioSubject(subjectId: string): boolean {
  return (NEXORA_SCENARIO_MODELED_SUBJECTS as readonly string[]).includes(
    subjectId,
  );
}
