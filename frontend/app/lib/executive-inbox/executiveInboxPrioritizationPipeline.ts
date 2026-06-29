/**
 * APP-11:3 — Executive Inbox Prioritization Engine deterministic pipeline.
 */

import { calculateExecutivePriority } from "./executiveInboxPrioritizationCalculator.ts";
import {
  evaluatePriorityDimensions,
  resolveWeightConfiguration,
} from "./executiveInboxPrioritizationDimensionEvaluator.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES } from "./executiveInboxPrioritizationEngineConstants.ts";
import { registerPriority } from "./executiveInboxPrioritizationEngineRegistry.ts";
import {
  buildExecutiveInboxPriority,
  buildPriorityLearningResult,
} from "./executiveInboxPrioritizationProfileBuilder.ts";
import type {
  ExecutiveInboxPrioritizationRequest,
  ExecutiveInboxPrioritizationResult,
  ExecutiveInboxPriority,
  InboxItemPrioritizationInput,
} from "./executiveInboxPrioritizationEngineTypes.ts";
import {
  validateExecutiveInboxPrioritizationRequest,
  validateExecutivePriority,
  validatePrioritizationDependencies,
} from "./executiveInboxPrioritizationEngineValidation.ts";

function emptyResult(
  request: ExecutiveInboxPrioritizationRequest,
  reason: string,
  prioritizationTimestamp: string
): ExecutiveInboxPrioritizationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    prioritizedItems: Object.freeze([]),
    registeredPriorityIds: Object.freeze([]),
    learningResults: Object.freeze([]),
    skippedItems: 0,
    pipelineStages: EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES,
    prioritizationTimestamp,
    readOnly: true as const,
  });
}

function sortInputsDeterministically(
  inputs: readonly InboxItemPrioritizationInput[]
): readonly InboxItemPrioritizationInput[] {
  return Object.freeze([...inputs].sort((left, right) => left.item.itemId.localeCompare(right.item.itemId)));
}

export function calculateExecutivePriorities(
  request: ExecutiveInboxPrioritizationRequest
): readonly ExecutiveInboxPriority[] {
  const prioritizationTimestamp = request.prioritizationTimestamp ?? new Date(0).toISOString();
  const weights = resolveWeightConfiguration(request.weightConfiguration);
  const sortedInputs = sortInputsDeterministically(request.items);

  return Object.freeze(
    sortedInputs.map((input) => {
      const evaluation = evaluatePriorityDimensions(input);
      const calculation = calculateExecutivePriority(input.item.itemId, evaluation.scores, weights);
      return buildExecutiveInboxPriority(input.item, calculation, evaluation.evidence, prioritizationTimestamp);
    })
  );
}

export function prioritizeExecutiveInbox(
  request: ExecutiveInboxPrioritizationRequest
): ExecutiveInboxPrioritizationResult {
  const prioritizationTimestamp = request.prioritizationTimestamp ?? new Date(0).toISOString();

  const dependencyValidation = validatePrioritizationDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      prioritizationTimestamp
    );
  }

  const requestValidation = validateExecutiveInboxPrioritizationRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      prioritizationTimestamp
    );
  }

  const calculated = calculateExecutivePriorities(request);
  const registeredPriorityIds: string[] = [];
  const learningResults = [];
  let skippedItems = 0;

  for (const priority of calculated) {
    const priorityValidation = validateExecutivePriority(priority);
    if (!priorityValidation.valid) {
      return emptyResult(
        request,
        `Priority validation failed: ${priorityValidation.issues.map((issue) => issue.message).join("; ")}`,
        prioritizationTimestamp
      );
    }
    const registration = registerPriority(priority);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_priority") {
        skippedItems += 1;
        continue;
      }
      return emptyResult(request, registration.reason, prioritizationTimestamp);
    }
    registeredPriorityIds.push(priority.priorityId);
    learningResults.push(buildPriorityLearningResult(priority));
  }

  const prioritizedItems = Object.freeze(
    registeredPriorityIds
      .map((priorityId) => calculated.find((entry) => entry.priorityId === priorityId))
      .filter((entry): entry is ExecutiveInboxPriority => entry !== undefined)
      .sort((left, right) => {
        const scoreDelta = right.weightedScore - left.weightedScore;
        if (scoreDelta !== 0) {
          return scoreDelta;
        }
        return left.priorityId.localeCompare(right.priorityId);
      })
  );

  return Object.freeze({
    success: prioritizedItems.length > 0,
    reason:
      prioritizedItems.length > 0
        ? `Prioritized ${prioritizedItems.length} executive inbox item(s) deterministically.`
        : "No inbox priorities were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    prioritizedItems,
    registeredPriorityIds: Object.freeze(registeredPriorityIds),
    learningResults: Object.freeze(learningResults),
    skippedItems,
    pipelineStages: EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES,
    prioritizationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPrioritizationPipeline = Object.freeze({
  prioritizeExecutiveInbox,
  calculateExecutivePriorities,
  stages: EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES,
});
