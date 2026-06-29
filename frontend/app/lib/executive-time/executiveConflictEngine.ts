/**
 * APP-1:8 — Executive Conflict Engine.
 * Deterministic conflict detection — metadata only, no automatic resolution.
 */

import type { ExecutivePredictionRequest } from "./executivePredictionAuthorityTypes.ts";
import type {
  ExecutiveConflictResult,
  ExecutiveConflictSeverity,
  ExecutiveConflictType,
  ExecutivePredictionTemporalSignals,
} from "./executivePredictionEngineTypes.ts";
import { EXECUTIVE_CONFLICT_ENGINE_OWNER } from "./executivePredictionEngineTypes.ts";

let conflictCounter = 0;

export function resetExecutiveConflictEngineForTests(): void {
  conflictCounter = 0;
}

function nextConflictId(workspaceId: string): string {
  conflictCounter += 1;
  return `conflict-${workspaceId.trim()}-${String(conflictCounter).padStart(4, "0")}`;
}

function buildConflict(input: {
  workspaceId: string;
  conflictType: ExecutiveConflictType;
  severity: ExecutiveConflictSeverity;
  entityType: ExecutivePredictionTemporalSignals["entityType"];
  entityId: string;
  explanation: string;
  suggestedResolution: string;
}): ExecutiveConflictResult {
  return Object.freeze({
    conflictId: nextConflictId(input.workspaceId),
    conflictType: input.conflictType,
    severity: input.severity,
    affectedEntities: Object.freeze([
      Object.freeze({ entityType: input.entityType, entityId: input.entityId }),
    ]),
    explanation: input.explanation,
    suggestedResolution: input.suggestedResolution,
    metadata: Object.freeze({
      engineOwner: EXECUTIVE_CONFLICT_ENGINE_OWNER,
      metadataOnly: true,
    }),
  });
}

export function detectConflict(input: {
  request: ExecutivePredictionRequest;
  signals: ExecutivePredictionTemporalSignals;
  priorRequestIds?: readonly string[];
}): ExecutiveConflictResult | null {
  const conflicts = detectConflicts(input);
  return conflicts[0] ?? null;
}

export function detectConflicts(input: {
  request: ExecutivePredictionRequest;
  signals: ExecutivePredictionTemporalSignals;
  priorRequestIds?: readonly string[];
}): readonly ExecutiveConflictResult[] {
  const { request, signals } = input;
  const conflicts: ExecutiveConflictResult[] = [];

  if (signals.contextDrift) {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "temporal_overlap",
        severity: "medium",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: "Camera context differs from declared time context.",
        suggestedResolution: "Align camera and context before acting on prediction.",
      })
    );
  }

  if (signals.transitionBlocked) {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "transition_conflict",
        severity: "high",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: "Target transition is blocked by transition engine validation.",
        suggestedResolution: "Resolve transition blocking issues before future-state prediction.",
      })
    );
  }

  if (signals.approvalRequired) {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "approval_conflict",
        severity: "high",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: "Approval is required for the evaluated transition path.",
        suggestedResolution: "Obtain required approval metadata before proceeding.",
      })
    );
  }

  if (signals.priorityLevel === "critical" || signals.priorityLevel === "urgent") {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "priority_conflict",
        severity: signals.priorityLevel === "critical" ? "critical" : "high",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: `Entity priority is ${signals.priorityLevel} under current temporal signals.`,
        suggestedResolution: "Review urgent priority items before scheduling additional work.",
      })
    );
  }

  if (input.priorRequestIds?.includes(request.id)) {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "duplicate_prediction_request",
        severity: "low",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: "Duplicate prediction request id detected in batch.",
        suggestedResolution: "Use unique prediction request ids.",
      })
    );
  }

  const reservation = request.metadata?.resourceReservation;
  if (typeof reservation === "string" && reservation.trim()) {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "resource_reservation_metadata",
        severity: "medium",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: `Resource reservation metadata "${reservation}" may overlap with temporal scope.`,
        suggestedResolution: "Validate resource reservation metadata manually.",
      })
    );
  }

  if (request.predictionType === "dependency_forecast") {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "dependency_conflict",
        severity: "medium",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: "Dependency forecast requested — upstream dependencies must be verified.",
        suggestedResolution: "Review dependency metadata before execution.",
      })
    );
  }

  if (signals.currentState === "archived" || signals.currentState === "completed") {
    conflicts.push(
      buildConflict({
        workspaceId: request.workspaceId,
        conflictType: "state_conflict",
        severity: "medium",
        entityType: request.entityType,
        entityId: request.entityId,
        explanation: `Entity is in terminal-like state "${signals.currentState}".`,
        suggestedResolution: "Confirm state before future-state prediction.",
      })
    );
  }

  return Object.freeze(conflicts.map((entry) => Object.freeze(entry)));
}

export function classifyConflict(conflict: ExecutiveConflictResult): ExecutiveConflictType {
  return conflict.conflictType;
}

export const ExecutiveConflictEngine = Object.freeze({
  detectConflict,
  detectConflicts,
  classifyConflict,
});
