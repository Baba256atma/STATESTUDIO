/**
 * APP-7:4 — Business Timeline Lifecycle validation.
 */

import { validateBusinessTimeline } from "./businessTimelineContracts.ts";
import { isBusinessEventEngineInitialized } from "./businessEventEngine.ts";
import { isBusinessTimelineQueryLayerInitialized } from "./businessTimelineQuery.ts";
import { validateWorkspaceIsolation } from "./businessTimelineValidation.ts";
import {
  BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS,
  BUSINESS_LIFECYCLE_PHASE_KEYS,
  BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
  isBusinessLifecyclePhase,
  type BusinessLifecycleModel,
  type BusinessMilestone,
  type BusinessLifecycleSegment,
  type BusinessValidationIssue,
  type BusinessValidationResult,
} from "./businessTimelineLifecycleTypes.ts";

function issue(code: string, message: string, field?: string): BusinessValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForLifecycle(timestamp: string): BusinessValidationResult {
  const foundation = validateBusinessTimeline(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validatePrerequisitesForLifecycle(): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isBusinessEventEngineInitialized()) {
    issues.push(issue("engine_not_initialized", "APP-7:2 Business Event Engine is not initialized."));
  }
  if (!isBusinessTimelineQueryLayerInitialized()) {
    issues.push(issue("query_not_initialized", "APP-7:3 Business Timeline Query Layer is not initialized."));
  }
  return result(issues);
}

function validateConfidence(value: number, field: string, issues: BusinessValidationIssue[]): void {
  if (value < BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.min || value > BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.max) {
    issues.push(
      issue(
        "invalid_confidence",
        `Confidence must be between ${BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.min} and ${BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.max}.`,
        field
      )
    );
  }
}

function validateSegment(segment: BusinessLifecycleSegment, workspaceId: string, issues: BusinessValidationIssue[]): void {
  if (!isBusinessLifecyclePhase(segment.phase)) {
    issues.push(issue("invalid_phase", "Invalid lifecycle phase.", "phase"));
  }
  validateConfidence(segment.confidence, "confidence", issues);
  const isolation = validateWorkspaceIsolation(workspaceId, segment.workspaceId);
  if (!isolation.valid) {
    issues.push(...isolation.issues);
  }
  if (segment.startAt > segment.endAt) {
    issues.push(issue("invalid_range", "Segment startAt must be before or equal to endAt.", "startAt"));
  }
  if (segment.eventIds.length === 0) {
    issues.push(issue("invalid_field", "Segment must include at least one event.", "eventIds"));
  }
}

function validateMilestone(milestone: BusinessMilestone, workspaceId: string, issues: BusinessValidationIssue[]): void {
  validateConfidence(milestone.confidence, "confidence", issues);
  const isolation = validateWorkspaceIsolation(workspaceId, milestone.workspaceId);
  if (!isolation.valid) {
    issues.push(...isolation.issues);
  }
}

export function validateBusinessLifecycleModel(model: BusinessLifecycleModel): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];

  if (model.contractVersion !== BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Lifecycle model must be read-only.", "readOnly"));
  }
  if (model.summary.segmentCount !== model.segments.length) {
    issues.push(issue("summary_mismatch", "Summary segmentCount mismatch.", "summary.segmentCount"));
  }
  if (model.summary.milestoneCount !== model.milestones.length) {
    issues.push(issue("summary_mismatch", "Summary milestoneCount mismatch.", "summary.milestoneCount"));
  }
  if (model.summary.eventCount !== model.eventMappings.length) {
    issues.push(issue("summary_mismatch", "Summary eventCount mismatch.", "summary.eventCount"));
  }

  for (const phase of BUSINESS_LIFECYCLE_PHASE_KEYS) {
    const expected = model.segments.filter((segment) => segment.phase === phase).length;
    if ((model.summary.phaseCounts[phase] ?? 0) !== expected) {
      issues.push(issue("summary_mismatch", `Phase count mismatch for ${phase}.`, "summary.phaseCounts"));
      break;
    }
  }

  for (const segment of model.segments) {
    validateSegment(segment, model.workspaceId, issues);
  }
  for (const milestone of model.milestones) {
    validateMilestone(milestone, model.workspaceId, issues);
  }

  return result(issues);
}

export function assertNoMutationApisInLifecycleSource(source: string): boolean {
  return (
    !source.includes("createBusinessEvent(") &&
    !source.includes("updateBusinessEventMetadata(") &&
    !source.includes("archiveBusinessEvent(") &&
    !source.includes("registerBusinessEvent(")
  );
}

export const BusinessTimelineLifecycleValidation = Object.freeze({
  validateFoundationCompatibilityForLifecycle,
  validatePrerequisitesForLifecycle,
  validateBusinessLifecycleModel,
  assertNoMutationApisInLifecycleSource,
});
