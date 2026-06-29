/**
 * APP-7:5 — Business Timeline Context validation.
 */

import { validateBusinessTimeline } from "./businessTimelineContracts.ts";
import { isBusinessEventEngineInitialized } from "./businessEventEngine.ts";
import { isBusinessTimelineQueryLayerInitialized } from "./businessTimelineQuery.ts";
import { isBusinessTimelineLifecycleLayerInitialized } from "./businessTimelineLifecycle.ts";
import { validateWorkspaceIsolation } from "./businessTimelineValidation.ts";
import {
  BUSINESS_CONTEXT_CONFIDENCE_BOUNDS,
  BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  isBusinessEventRelationshipType,
  type BusinessTimelineContextModel,
  type BusinessValidationIssue,
  type BusinessValidationResult,
} from "./businessTimelineContextTypes.ts";

function issue(code: string, message: string, field?: string): BusinessValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForContext(timestamp: string): BusinessValidationResult {
  const foundation = validateBusinessTimeline(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validatePrerequisitesForContext(): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isBusinessEventEngineInitialized()) {
    issues.push(issue("engine_not_initialized", "APP-7:2 Business Event Engine is not initialized."));
  }
  if (!isBusinessTimelineQueryLayerInitialized()) {
    issues.push(issue("query_not_initialized", "APP-7:3 Business Timeline Query Layer is not initialized."));
  }
  if (!isBusinessTimelineLifecycleLayerInitialized()) {
    issues.push(issue("lifecycle_not_initialized", "APP-7:4 Business Timeline Lifecycle Layer is not initialized."));
  }
  return result(issues);
}

function validateConfidence(value: number, field: string, issues: BusinessValidationIssue[]): void {
  if (value < BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.min || value > BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.max) {
    issues.push(
      issue(
        "invalid_confidence",
        `Confidence must be between ${BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.min} and ${BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.max}.`,
        field
      )
    );
  }
}

export function validateBusinessTimelineContextModel(model: BusinessTimelineContextModel): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];

  if (model.contractVersion !== BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Context model must be read-only.", "readOnly"));
  }
  if (model.summary.eventCount !== model.events.length) {
    issues.push(issue("summary_mismatch", "Summary eventCount mismatch.", "summary.eventCount"));
  }
  if (model.summary.relationshipCount !== model.relationships.length) {
    issues.push(issue("summary_mismatch", "Summary relationshipCount mismatch.", "summary.relationshipCount"));
  }
  if (model.summary.clusterCount !== model.clusters.length) {
    issues.push(issue("summary_mismatch", "Summary clusterCount mismatch.", "summary.clusterCount"));
  }
  if (model.summary.contextCount !== model.eventContexts.length) {
    issues.push(issue("summary_mismatch", "Summary contextCount mismatch.", "summary.contextCount"));
  }

  for (const relationship of model.relationships) {
    if (!isBusinessEventRelationshipType(relationship.relationshipType)) {
      issues.push(issue("invalid_relationship", "Invalid relationship type.", "relationshipType"));
    }
    validateConfidence(relationship.confidence, "relationship.confidence", issues);
    const isolation = validateWorkspaceIsolation(model.workspaceId, relationship.workspaceId);
    if (!isolation.valid) {
      issues.push(...isolation.issues);
    }
  }

  for (const cluster of model.clusters) {
    validateConfidence(cluster.confidence, "cluster.confidence", issues);
    if (cluster.startAt > cluster.endAt) {
      issues.push(issue("invalid_range", "Cluster startAt must be before or equal to endAt.", "startAt"));
    }
  }

  for (const context of model.eventContexts) {
    validateConfidence(context.confidence, "context.confidence", issues);
    if (context.eventId === context.previousEventId || context.eventId === context.nextEventId) {
      issues.push(issue("invalid_context", "Event cannot reference itself as previous/next.", "eventId"));
    }
  }

  return result(issues);
}

export function assertNoMutationApisInContextSource(source: string): boolean {
  return (
    !source.includes("createBusinessEvent(") &&
    !source.includes("updateBusinessEventMetadata(") &&
    !source.includes("archiveBusinessEvent(") &&
    !source.includes("registerBusinessEvent(") &&
    !source.includes("buildBusinessLifecycleModelFromEvents(")
  );
}

export const BusinessTimelineContextValidation = Object.freeze({
  validateFoundationCompatibilityForContext,
  validatePrerequisitesForContext,
  validateBusinessTimelineContextModel,
  assertNoMutationApisInContextSource,
});
