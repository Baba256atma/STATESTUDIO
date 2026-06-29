/**
 * APP-11:3 — Executive Inbox Prioritization dimension evaluator.
 */

import {
  EXECUTIVE_INBOX_PRIORITIZATION_DEFAULT_WEIGHTS,
  EXECUTIVE_INBOX_PRIORITIZATION_SOURCE_TYPE_BASELINE_SCORES,
  EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import type { ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import type {
  InboxItemPrioritizationInput,
  PriorityDimensionKey,
  PriorityEvidence,
} from "./executiveInboxPrioritizationEngineTypes.ts";

const DIMENSION_LABELS: Readonly<Record<PriorityDimensionKey, string>> = Object.freeze({
  business_impact: "Business Impact",
  risk_severity: "Risk Severity",
  time_sensitivity: "Time Sensitivity",
  strategic_importance: "Strategic Importance",
  decision_dependency: "Decision Dependency",
  executive_visibility: "Executive Visibility",
  regulatory_importance: "Regulatory Importance",
  customer_impact: "Customer Impact",
  financial_impact: "Financial Impact",
  operational_impact: "Operational Impact",
});

const DEFAULT_BASELINE_SCORE = 35;

function baselineScore(sourceType: ExecutiveInboxItem["sourceType"], dimensionKey: PriorityDimensionKey): number {
  const baselines = EXECUTIVE_INBOX_PRIORITIZATION_SOURCE_TYPE_BASELINE_SCORES[sourceType];
  return baselines?.[dimensionKey] ?? DEFAULT_BASELINE_SCORE;
}

function buildEvidence(
  item: ExecutiveInboxItem,
  dimensionKey: PriorityDimensionKey,
  score: number,
  signal: string
): PriorityEvidence {
  return Object.freeze({
    evidenceId: `evidence-${item.itemId}-${dimensionKey}`,
    dimensionKey,
    signal,
    rationale: `${DIMENSION_LABELS[dimensionKey]} scored ${score} for ${item.sourceType} item ${item.itemId} via ${signal}.`,
    score,
    readOnly: true as const,
  });
}

export function evaluatePriorityDimensions(
  input: InboxItemPrioritizationInput
): Readonly<{ scores: Readonly<Record<PriorityDimensionKey, number>>; evidence: readonly PriorityEvidence[] }> {
  const item = input.item;
  const scores = {} as Record<PriorityDimensionKey, number>;
  const evidence: PriorityEvidence[] = [];
  const overrideMap = new Map(
    (input.dimensionOverrides ?? []).map((entry) => [entry.dimensionKey, entry] as const)
  );

  for (const dimensionKey of EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS) {
    const override = overrideMap.get(dimensionKey);
    const score = override?.score ?? baselineScore(item.sourceType, dimensionKey);
    scores[dimensionKey] = score;
    evidence.push(
      buildEvidence(
        item,
        dimensionKey,
        score,
        override?.signal ?? `source_type_baseline:${item.sourceType}`
      )
    );
  }

  return Object.freeze({
    scores: Object.freeze(scores),
    evidence: Object.freeze(evidence),
  });
}

export function resolveWeightConfiguration(
  overrides?: Readonly<Partial<Record<PriorityDimensionKey, number>>>
): Readonly<Record<PriorityDimensionKey, number>> {
  if (!overrides || Object.keys(overrides).length === 0) {
    return EXECUTIVE_INBOX_PRIORITIZATION_DEFAULT_WEIGHTS;
  }
  const merged = { ...EXECUTIVE_INBOX_PRIORITIZATION_DEFAULT_WEIGHTS, ...overrides };
  return Object.freeze(merged);
}

export function getDimensionLabel(dimensionKey: PriorityDimensionKey): string {
  return DIMENSION_LABELS[dimensionKey];
}

export const ExecutiveInboxPrioritizationDimensionEvaluator = Object.freeze({
  evaluatePriorityDimensions,
  resolveWeightConfiguration,
  getDimensionLabel,
});
