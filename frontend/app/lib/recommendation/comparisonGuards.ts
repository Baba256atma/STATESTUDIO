/**
 * D7:5:4 — Multi-strategy comparison governance guard rails.
 */

import type { StrategyComparisonSignal } from "./multiStrategyComparisonTypes.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { logStrategyComparisonDev } from "./comparisonDevLog.ts";

export type StrategyComparisonGuardCode =
  | "empty_comparison_context"
  | "too_many_strategy_comparisons"
  | "invalid_comparison_strength"
  | "invalid_comparison_region"
  | "duplicate_comparison_build"
  | "unsupported_comparison_claim"
  | "hidden_strategy_ranking"
  | "autonomous_strategy_selection"
  | "runaway_comparison_amplification"
  | "corrupted_comparison_state";

export type StrategyComparisonGuardResult =
  | { ok: true }
  | { ok: false; code: StrategyComparisonGuardCode; message: string };

export const DEFAULT_MAX_STRATEGY_COMPARISONS = 32;
export const COMPARISON_UNCERTAINTY_DISCLAIMER =
  "Multi-strategy comparisons reflect pathway differences under current conditions and are indicative, not definitive.";
export const NON_RANKING_DISCLAIMER =
  "Nexora does not rank or mandate strategies; executives retain full pathway selection authority.";

const PROHIBITED_RANKING_TEXT = [
  "best strategy",
  "winning strategy",
  "rank #",
  "ranked first",
  "top strategy",
  "automatically choose",
  "automatically select",
  "auto-select",
  "recommended winner",
  "hidden prioritization",
  "override executive",
] as const;

function containsProhibitedRankingText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_RANKING_TEXT.some((phrase) => lower.includes(phrase));
}

function reject(code: StrategyComparisonGuardCode, message: string): StrategyComparisonGuardResult {
  const result = { ok: false as const, code, message };
  logStrategyComparisonDev("ComparisonGuard", { code, message });
  return result;
}

export function buildComparisonContentFingerprint(input: {
  topologyFingerprint: string;
  tradeoffFingerprint?: string;
  recommendationFingerprint?: string;
  confidenceFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    tradeoff: input.tradeoffFingerprint ?? null,
    recommendation: input.recommendationFingerprint ?? null,
    confidence: input.confidenceFingerprint ?? null,
    tick: input.tick,
  });
}

export function guardEvaluateMultiStrategyComparison(input: {
  topologyId: string;
  regionIds: readonly string[];
  comparisons: readonly StrategyComparisonSignal[];
  priorComparisonFingerprints?: readonly string[];
  pendingFingerprint?: string;
  comparisonStabilityScore?: number;
  pathwayDivergenceScore?: number;
}): StrategyComparisonGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_comparison_context",
      "Topology context is required to evaluate multi-strategy comparison"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.comparisons.length > DEFAULT_MAX_STRATEGY_COMPARISONS) {
    return reject(
      "too_many_strategy_comparisons",
      `Strategy comparison count ${input.comparisons.length} exceeds max ${DEFAULT_MAX_STRATEGY_COMPARISONS}`
    );
  }

  if ((input.comparisonStabilityScore ?? 0) > 0.95) {
    return reject(
      "runaway_comparison_amplification",
      "Comparison stability score implies uncontrolled comparison amplification"
    );
  }

  if ((input.pathwayDivergenceScore ?? 0) > 0.95) {
    return reject(
      "runaway_comparison_amplification",
      "Pathway divergence score implies uncontrolled comparison amplification"
    );
  }

  for (const comparison of input.comparisons) {
    if (comparison.comparisonStrength < 0 || comparison.comparisonStrength > 1) {
      return reject(
        "invalid_comparison_strength",
        `Strategy ${comparison.strategyId} comparison strength must be between 0 and 1`
      );
    }
    if (comparison.comparisonStrength > 0.92) {
      return reject(
        "unsupported_comparison_claim",
        `Strategy ${comparison.strategyId} comparison strength implies excessive certainty`
      );
    }
    for (const regionId of comparison.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_comparison_region",
          `Strategy ${comparison.strategyId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(comparison.executiveLabel ?? "");
    if (containsFalseCertaintyText(label)) {
      return reject(
        "unsupported_comparison_claim",
        `Strategy ${comparison.strategyId} contains prohibited certainty language`
      );
    }
    if (containsProhibitedRankingText(label)) {
      return reject(
        "hidden_strategy_ranking",
        `Strategy ${comparison.strategyId} contains prohibited ranking language`
      );
    }
    if (containsProhibitedRankingText(comparison.strategyLabel)) {
      return reject(
        "hidden_strategy_ranking",
        `Strategy ${comparison.strategyId} label contains prohibited ranking language`
      );
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorComparisonFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_comparison_build",
      "Identical multi-strategy comparison evaluation was already executed"
    );
  }

  return { ok: true };
}

export function guardComparisonExecutiveSemantics(input: {
  headline: string;
  summary: string;
}): StrategyComparisonGuardResult {
  if (containsFalseCertaintyText(input.headline)) {
    return reject(
      "unsupported_comparison_claim",
      "Comparison headline contains prohibited certainty language"
    );
  }
  if (containsFalseCertaintyText(input.summary)) {
    return reject(
      "unsupported_comparison_claim",
      "Comparison summary contains prohibited certainty language"
    );
  }
  if (containsProhibitedRankingText(input.headline)) {
    return reject("hidden_strategy_ranking", "Comparison headline contains prohibited ranking language");
  }
  if (containsProhibitedRankingText(input.summary)) {
    return reject("hidden_strategy_ranking", "Comparison summary contains prohibited ranking language");
  }
  const combined = `${input.headline} ${input.summary}`.toLowerCase();
  if (combined.includes("automatically choose") || combined.includes("automatically select")) {
    return reject(
      "autonomous_strategy_selection",
      "Comparison semantics contain prohibited autonomous selection language"
    );
  }
  return { ok: true };
}
