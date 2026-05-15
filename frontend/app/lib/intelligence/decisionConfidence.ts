/**
 * Decision Intelligence — confidence normalization (D4 foundation).
 *
 * Purpose: single clamp + band mapping for all decision-facing scores.
 * Future role: shared by ranking, overlays, and AI adapter post-processors.
 * Boundaries: pure functions only; no logging here (use decisionInstrumentation.ts).
 */

import { clamp01 } from "./shared/normalization.ts";
import type { DecisionConfidenceBand } from "./decisionTypes.ts";

/** Clamp to [0, 1]; non-finite inputs become 0 (NaN-safe). */
export function normalizeDecisionConfidence01(value: unknown): number {
  return clamp01(value);
}

/**
 * Map a 0–1 score to executive bands: [0, 0.3) low, [0.3, 0.7) medium, [0.7, 1] high.
 */
export function decisionConfidenceLabelFrom01(score01: unknown): DecisionConfidenceBand {
  const s = normalizeDecisionConfidence01(score01);
  if (s < 0.3) return "low";
  if (s < 0.7) return "medium";
  return "high";
}
