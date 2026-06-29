/**
 * APP-11:3 — Executive Inbox Prioritization profile builder.
 */

import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxPrioritizationEngineConstants.ts";
import type { ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import type {
  ExecutiveInboxPriority,
  ExecutivePriorityProfile,
  ExecutivePriorityProvenance,
  PriorityCalculation,
  PriorityEvidence,
  PriorityLearningResult,
} from "./executiveInboxPrioritizationEngineTypes.ts";

export function buildPriorityId(itemId: string): string {
  return `inbox-priority-${itemId}`;
}

export function buildExecutivePriorityProvenance(item: ExecutiveInboxItem): ExecutivePriorityProvenance {
  return Object.freeze({
    itemId: item.itemId,
    originatingPlatform: item.provenance.originatingPlatform,
    workspaceId: item.workspaceId,
    aggregationVersion: item.provenance.aggregationVersion,
    engineVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    calculationVersion: "APP-11/3-calc-v1" as const,
    foundationVersion: "APP-11/1" as const,
    readOnly: true as const,
  });
}

export function buildPriorityExplanation(
  item: ExecutiveInboxItem,
  calculation: PriorityCalculation,
  evidence: readonly PriorityEvidence[]
): string {
  const topDimensions = [...calculation.dimensions]
    .sort((left, right) => right.weightedContribution - left.weightedContribution)
    .slice(0, 3)
    .map((entry) => `${entry.label} (${entry.score})`)
    .join(", ");
  const topEvidence = evidence
    .slice(0, 2)
    .map((entry) => entry.rationale)
    .join(" ");
  return `Executive priority ${calculation.priorityLevel} (score ${calculation.weightedScore}) for ${item.sourceType} item ${item.itemId}. Top dimensions: ${topDimensions}. ${topEvidence}`.trim();
}

export function buildExecutivePriorityProfile(
  item: ExecutiveInboxItem,
  calculation: PriorityCalculation,
  evidence: readonly PriorityEvidence[],
  prioritizationTimestamp: string
): ExecutivePriorityProfile {
  const provenance = buildExecutivePriorityProvenance(item);
  return Object.freeze({
    profileId: `priority-profile-${item.itemId}`,
    itemId: item.itemId,
    workspaceId: item.workspaceId,
    priorityLevel: calculation.priorityLevel,
    weightedScore: calculation.weightedScore,
    dimensions: calculation.dimensions,
    evidence,
    explanation: buildPriorityExplanation(item, calculation, evidence),
    provenance,
    prioritizationTimestamp,
    engineVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveInboxPriority(
  item: ExecutiveInboxItem,
  calculation: PriorityCalculation,
  evidence: readonly PriorityEvidence[],
  prioritizationTimestamp: string
): ExecutiveInboxPriority {
  const profile = buildExecutivePriorityProfile(item, calculation, evidence, prioritizationTimestamp);
  const provenance = buildExecutivePriorityProvenance(item);
  return Object.freeze({
    priorityId: buildPriorityId(item.itemId),
    itemId: item.itemId,
    workspaceId: item.workspaceId,
    priorityLevel: calculation.priorityLevel,
    weightedScore: calculation.weightedScore,
    profile,
    calculation,
    provenance,
    prioritizationTimestamp,
    engineVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildPriorityLearningResult(priority: ExecutiveInboxPriority): PriorityLearningResult {
  const topDimensions = Object.freeze(
    [...priority.calculation.dimensions]
      .sort((left, right) => right.weightedContribution - left.weightedContribution)
      .slice(0, 3)
      .map((entry) => entry.dimensionKey)
  );
  return Object.freeze({
    learningId: `priority-learning-${priority.itemId}`,
    itemId: priority.itemId,
    priorityLevel: priority.priorityLevel,
    weightedScore: priority.weightedScore,
    topDimensions,
    explanationSummary: priority.profile.explanation,
    deterministic: true as const,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPrioritizationProfileBuilder = Object.freeze({
  buildPriorityId,
  buildExecutivePriorityProvenance,
  buildPriorityExplanation,
  buildExecutivePriorityProfile,
  buildExecutiveInboxPriority,
  buildPriorityLearningResult,
});
