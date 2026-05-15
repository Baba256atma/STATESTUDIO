/**
 * Decision Intelligence — deterministic decision score engine (D4 foundation).
 *
 * This scoring engine is deterministic and UI-free.
 * Future D4 prompts may use it for:
 * - recommendation ranking
 * - scenario intelligence
 * - executive confidence
 * - strategic reasoning
 * - adaptive intelligence
 *
 * Boundaries: pure functions, no I/O, no scene/routing/panel mutation, no Date.now.
 */

import { clamp01 } from "./shared/normalization.ts";
import type {
  DecisionAction,
  DecisionConfidence,
  DecisionEvidence,
  DecisionOutcomeProjection,
  DecisionRiskAssessment,
  DecisionTradeoff,
} from "./decisionIntelligenceContracts.ts";
import type { DecisionPriority } from "./decisionTypes.ts";

/** Centralized weights (sum = 1.0). Impact and uncertainty are folded via risk/opportunity and post dampening. */
export const DECISION_SCORE_WEIGHTS = Object.freeze({
  confidence: 0.2,
  evidenceStrength: 0.2,
  riskPressure: 0.2,
  urgency: 0.15,
  opportunity: 0.15,
  reversibility: 0.1,
} as const);

export type DecisionScoreWeightsUsed = Readonly<{
  readonly confidence: number;
  readonly evidenceStrength: number;
  readonly riskPressure: number;
  readonly urgency: number;
  readonly opportunity: number;
  readonly reversibility: number;
}>;

export type DecisionScoreLabel = "weak" | "watch" | "actionable" | "strong" | "critical";

export type DecisionScoreResult = Readonly<{
  readonly score: number;
  readonly label: DecisionScoreLabel;
  readonly confidence: number;
  readonly evidenceStrength: number;
  readonly riskPressure: number;
  readonly urgency: number;
  readonly opportunity: number;
  readonly reversibility: number;
  readonly uncertainty: number;
  readonly explanation: string;
  readonly weightsUsed: DecisionScoreWeightsUsed;
}>;

const SCORING_LOG_PREFIX = "[Nexora][DecisionScoring]";
const MAX_SCORING_LOG_KEYS = 40;
const recentScoringLogKeys: string[] = [];

function rememberScoringLogKey(key: string): boolean {
  const i = recentScoringLogKeys.indexOf(key);
  if (i >= 0) return false;
  recentScoringLogKeys.push(key);
  if (recentScoringLogKeys.length > MAX_SCORING_LOG_KEYS) recentScoringLogKeys.shift();
  return true;
}

/** Optional dev trace; call explicitly — deduped, silent in production. */
export function trackDecisionScoreComputed(result: DecisionScoreResult): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  const key = `${result.score.toFixed(4)}|${result.label}|${result.explanation.slice(0, 80)}`;
  if (!rememberScoringLogKey(key)) return;
  if (typeof globalThis !== "undefined" && globalThis.console?.debug) {
    globalThis.console.debug(SCORING_LOG_PREFIX, {
      score: result.score,
      label: result.label,
      components: {
        confidence: result.confidence,
        evidenceStrength: result.evidenceStrength,
        riskPressure: result.riskPressure,
        urgency: result.urgency,
        opportunity: result.opportunity,
        reversibility: result.reversibility,
        uncertainty: result.uncertainty,
      },
    });
  }
}

export function normalizeDecisionScore(value: unknown): number {
  return clamp01(value);
}

function riskSeverity01(label: DecisionRiskAssessment["severityLabel"]): number {
  switch (label) {
    case "critical":
      return 1;
    case "high":
      return 0.78;
    case "medium":
      return 0.52;
    case "low":
    default:
      return 0.22;
  }
}

/** Aggregate evidence strength; empty evidence yields a low but non-zero baseline. */
export function calculateEvidenceStrength(evidence: readonly DecisionEvidence[] | null | undefined): number {
  if (evidence == null || evidence.length === 0) return 0.08;
  let sum = 0;
  let n = 0;
  for (const e of evidence) {
    sum += normalizeDecisionScore(e.strength01);
    n += 1;
  }
  return normalizeDecisionScore(n > 0 ? sum / n : 0.08);
}

/** Risk pressure from assessments plus outcome deltas (impact proxy). */
export function calculateRiskPressure(
  risks: readonly DecisionRiskAssessment[] | null | undefined,
  projectedOutcomes: readonly DecisionOutcomeProjection[] | null | undefined
): number {
  let peak = 0.12;
  if (risks != null) {
    for (const r of risks) {
      const sev = riskSeverity01(r.severityLabel);
      const li = normalizeDecisionScore(r.likelihood01);
      const im = normalizeDecisionScore(r.impact01);
      const fused = normalizeDecisionScore(sev * 0.45 + li * im * 0.55);
      peak = Math.max(peak, fused);
    }
  }
  if (projectedOutcomes != null) {
    for (const o of projectedOutcomes) {
      const d = normalizeDecisionScore(o.expectedDelta01);
      const stress = normalizeDecisionScore(Math.abs(d) * 0.55 + normalizeDecisionScore(o.uncertainty01) * 0.45);
      peak = Math.max(peak, stress);
    }
  }
  return normalizeDecisionScore(peak);
}

/** Opportunity / upside from tradeoffs decisiveness and positive projected deltas. */
export function calculateOpportunityScore(
  tradeoffs: readonly DecisionTradeoff[] | null | undefined,
  projectedOutcomes: readonly DecisionOutcomeProjection[] | null | undefined
): number {
  let acc = 0.18;
  let parts = 0;
  if (tradeoffs != null && tradeoffs.length > 0) {
    let tsum = 0;
    for (const t of tradeoffs) {
      const w = normalizeDecisionScore(t.favorAWeight01);
      tsum += normalizeDecisionScore(Math.abs(w - 0.5) * 2);
    }
    acc += normalizeDecisionScore(tsum / tradeoffs.length);
    parts += 1;
  }
  if (projectedOutcomes != null && projectedOutcomes.length > 0) {
    let pos = 0;
    for (const o of projectedOutcomes) {
      const d = normalizeDecisionScore(o.expectedDelta01);
      if (d > 0) pos = Math.max(pos, d);
    }
    acc += normalizeDecisionScore(pos * 0.85);
    parts += 1;
  }
  return normalizeDecisionScore(parts > 0 ? acc / Math.max(1, parts) : acc);
}

function priorityUrgency01(priority: DecisionPriority): number {
  switch (priority) {
    case "p0":
      return 1;
    case "p1":
      return 0.78;
    case "p2":
      return 0.58;
    case "p3":
      return 0.4;
    case "deferred":
    default:
      return 0.22;
  }
}

/** Urgency from priority and confirmation-heavy actions. */
export function calculateUrgencyScore(
  priority: DecisionPriority,
  actions: readonly DecisionAction[] | null | undefined
): number {
  let u = priorityUrgency01(priority);
  if (actions != null && actions.length > 0) {
    let confirmN = 0;
    for (const a of actions) {
      if (a.requiresConfirmation) confirmN += 1;
    }
    const boost = normalizeDecisionScore((confirmN / actions.length) * 0.22);
    u = normalizeDecisionScore(u * (0.82 + boost));
  }
  return normalizeDecisionScore(u);
}

/** Irreversible actions increase executive salience (higher component). */
export function calculateReversibilityScore(actions: readonly DecisionAction[] | null | undefined): number {
  if (actions == null || actions.length === 0) return 0.45;
  let sum = 0;
  for (const a of actions) {
    sum += a.reversible ? 0.32 : 0.88;
  }
  return normalizeDecisionScore(sum / actions.length);
}

function aggregateUncertainty01(projectedOutcomes: readonly DecisionOutcomeProjection[] | null | undefined): number {
  if (projectedOutcomes == null || projectedOutcomes.length === 0) return 0.12;
  let sum = 0;
  for (const o of projectedOutcomes) {
    sum += normalizeDecisionScore(o.uncertainty01);
  }
  return normalizeDecisionScore(sum / projectedOutcomes.length);
}

export type CalculateDecisionScoreInput = Readonly<{
  readonly confidence: DecisionConfidence;
  readonly evidence: readonly DecisionEvidence[];
  readonly risks?: readonly DecisionRiskAssessment[] | null;
  readonly tradeoffs?: readonly DecisionTradeoff[] | null;
  readonly projectedOutcomes?: readonly DecisionOutcomeProjection[] | null;
  readonly actions?: readonly DecisionAction[] | null;
  readonly priority: DecisionPriority;
}>;

export function getDecisionScoreLabel(score01: unknown): DecisionScoreLabel {
  const s = normalizeDecisionScore(score01);
  if (s < 0.2) return "weak";
  if (s < 0.4) return "watch";
  if (s < 0.65) return "actionable";
  if (s < 0.85) return "strong";
  return "critical";
}

export function calculateDecisionScore(input: CalculateDecisionScoreInput): DecisionScoreResult {
  const w = DECISION_SCORE_WEIGHTS;
  const confidence = normalizeDecisionScore(input.confidence.score01);
  const evidenceStrength = calculateEvidenceStrength(input.evidence);
  const riskPressure = calculateRiskPressure(input.risks ?? undefined, input.projectedOutcomes ?? undefined);
  const opportunity = calculateOpportunityScore(input.tradeoffs ?? undefined, input.projectedOutcomes ?? undefined);
  const urgency = calculateUrgencyScore(input.priority, input.actions ?? undefined);
  const reversibility = calculateReversibilityScore(input.actions ?? undefined);
  const uncertainty = aggregateUncertainty01(input.projectedOutcomes ?? undefined);

  const weighted = normalizeDecisionScore(
    confidence * w.confidence +
      evidenceStrength * w.evidenceStrength +
      riskPressure * w.riskPressure +
      urgency * w.urgency +
      opportunity * w.opportunity +
      reversibility * w.reversibility
  );

  const dampened = normalizeDecisionScore(weighted * (1 - 0.28 * uncertainty));

  const weightsUsed: DecisionScoreWeightsUsed = {
    confidence: w.confidence,
    evidenceStrength: w.evidenceStrength,
    riskPressure: w.riskPressure,
    urgency: w.urgency,
    opportunity: w.opportunity,
    reversibility: w.reversibility,
  };

  const explanation =
    `Weighted blend (conf ${confidence.toFixed(2)}, evidence ${evidenceStrength.toFixed(2)}, risk ${riskPressure.toFixed(2)}, ` +
    `urgency ${urgency.toFixed(2)}, opportunity ${opportunity.toFixed(2)}, reversibility ${reversibility.toFixed(2)}); ` +
    `uncertainty damp ${uncertainty.toFixed(2)} → ${dampened.toFixed(2)}.`;

  return {
    score: dampened,
    label: getDecisionScoreLabel(dampened),
    confidence,
    evidenceStrength,
    riskPressure,
    urgency,
    opportunity,
    reversibility,
    uncertainty,
    explanation,
    weightsUsed,
  };
}
