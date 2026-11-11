/**
 * APP-10:4 — Outcome Learning Engine immutable registry.
 */

import { OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION, OUTCOME_LEARNING_ENGINE_LIMITS } from "./outcomeLearningEngineConstants.ts";
import type {
  ExecutiveOutcome,
  OutcomeEngineResult,
  OutcomeId,
  OutcomeRegistrySnapshot,
  OutcomeWorkspaceId,
} from "./outcomeLearningEngineTypes.ts";
import { demoProfileIdForWrite, demoProfileMutationAllowed, demoProfileVisible } from "../demo-profile/demoProfileOwnership.ts";
import { validateExecutiveOutcome } from "./outcomeLearningEngineValidation.ts";

const outcomeRegistry = new Map<OutcomeId, ExecutiveOutcome>();
const workspaceIndex = new Map<OutcomeWorkspaceId, Set<OutcomeId>>();

function indexOutcome(outcome: ExecutiveOutcome): void {
  const ids = workspaceIndex.get(outcome.outcome.workspaceId) ?? new Set<OutcomeId>();
  ids.add(outcome.outcome.outcomeId);
  workspaceIndex.set(outcome.outcome.workspaceId, ids);
}

function unindexOutcome(outcome: ExecutiveOutcome): void {
  const ids = workspaceIndex.get(outcome.outcome.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(outcome.outcome.outcomeId);
  if (ids.size === 0) {
    workspaceIndex.delete(outcome.outcome.workspaceId);
  }
}

export function clearOutcomeLearningRegistryForTests(): void {
  outcomeRegistry.clear();
  workspaceIndex.clear();
}

export function outcomeExists(outcomeId: OutcomeId): boolean {
  return outcomeRegistry.has(outcomeId);
}

function withDemoProfile(outcome: ExecutiveOutcome): ExecutiveOutcome {
  const profileId = demoProfileIdForWrite(outcome.outcome.workspaceId);
  if (!profileId || outcome.outcome.metadata.extensions.demoProfileId) return outcome;
  return Object.freeze({
    ...outcome,
    outcome: Object.freeze({
      ...outcome.outcome,
      metadata: Object.freeze({
        ...outcome.outcome.metadata,
        extensions: Object.freeze({
          ...outcome.outcome.metadata.extensions,
          demoProfileId: profileId,
        }),
      }),
    }),
  });
}

export function registerOutcome(outcome: ExecutiveOutcome): OutcomeEngineResult<ExecutiveOutcome> {
  const stamped = withDemoProfile(outcome);
  const validation = validateExecutiveOutcome(stamped);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: validation.issues[0] ?? null,
      readOnly: true as const,
    });
  }
  if (outcomeRegistry.has(stamped.outcome.outcomeId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate outcome id: ${outcome.outcome.outcomeId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_outcome",
        message: "Duplicate outcome id.",
        field: "outcomeId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (outcomeRegistry.size >= OUTCOME_LEARNING_ENGINE_LIMITS.maxRegisteredOutcomes) {
    return Object.freeze({
      success: false,
      reason: "Outcome registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Outcome registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  outcomeRegistry.set(stamped.outcome.outcomeId, stamped);
  indexOutcome(stamped);
  return Object.freeze({
    success: true,
    reason: "Executive outcome registered.",
    data: stamped,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterOutcome(outcomeId: OutcomeId): OutcomeEngineResult<OutcomeId> {
  const existing = outcomeRegistry.get(outcomeId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Outcome not found: ${outcomeId}.`,
      data: null,
      error: Object.freeze({
        code: "outcome_not_found",
        message: "Outcome not found.",
        field: "outcomeId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!demoProfileMutationAllowed(existing.outcome.workspaceId, existing.outcome.metadata.extensions.demoProfileId)) {
    return Object.freeze({
      success: false,
      reason: "Outcome belongs to another demo profile.",
      data: null,
      error: Object.freeze({
        code: "outcome_not_found",
        message: "Outcome belongs to another demo profile.",
        field: "outcomeId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  outcomeRegistry.delete(outcomeId);
  unindexOutcome(existing);
  return Object.freeze({
    success: true,
    reason: "Executive outcome unregistered.",
    data: outcomeId,
    error: null,
    readOnly: true as const,
  });
}

export function getOutcome(outcomeId: OutcomeId): ExecutiveOutcome | null {
  return outcomeRegistry.get(outcomeId) ?? null;
}

export function getOutcomes(workspaceId?: OutcomeWorkspaceId): readonly ExecutiveOutcome[] {
  if (!workspaceId) {
    return Object.freeze(
      [...outcomeRegistry.values()].sort((left, right) => left.outcome.outcomeId.localeCompare(right.outcome.outcomeId))
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => outcomeRegistry.get(id))
      .filter((entry): entry is ExecutiveOutcome => entry !== undefined)
      .filter((entry) => demoProfileVisible(entry.outcome.workspaceId, entry.outcome.metadata.extensions.demoProfileId))
      .sort((left, right) => left.outcome.outcomeId.localeCompare(right.outcome.outcomeId))
  );
}

export function getOutcomeRegistrySnapshot(): OutcomeRegistrySnapshot {
  return Object.freeze({
    registryVersion: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
    outcomeCount: outcomeRegistry.size,
    outcomeIds: Object.freeze([...outcomeRegistry.keys()].sort()),
    readOnly: true as const,
  });
}

export const OutcomeLearningEngineRegistry = Object.freeze({
  clearOutcomeLearningRegistryForTests,
  outcomeExists,
  registerOutcome,
  unregisterOutcome,
  getOutcome,
  getOutcomes,
  getOutcomeRegistrySnapshot,
});
