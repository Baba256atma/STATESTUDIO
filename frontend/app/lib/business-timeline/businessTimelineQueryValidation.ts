/**
 * APP-7:3 — Business Timeline Query validation.
 */

import {
  isBusinessEventCategory,
  isBusinessEventImportance,
  isBusinessEventSource,
  isBusinessEventStatus,
  isBusinessEventType,
  validateWorkspaceIsolation,
} from "./businessTimelineValidation.ts";
import { validateBusinessTimeline } from "./businessTimelineContracts.ts";
import { isBusinessEventEngineInitialized } from "./businessEventEngine.ts";
import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import {
  BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
  BUSINESS_TIMELINE_QUERY_ORDER_FIELDS,
  DEFAULT_BUSINESS_TIMELINE_QUERY_DIRECTION,
  type BusinessTimelineQueryFilters,
  type BusinessTimelineQueryInput,
  type BusinessTimelineQueryResult,
  type BusinessValidationIssue,
  type BusinessValidationResult,
} from "./businessTimelineQueryTypes.ts";

function issue(code: string, message: string, field?: string): BusinessValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForQuery(timestamp: string): BusinessValidationResult {
  const foundation = validateBusinessTimeline(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateEventEngineAvailabilityForQuery(): BusinessValidationResult {
  if (!isBusinessEventEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-7:2 Business Event Engine is not initialized.")]);
  }
  return result([]);
}

export function validateBusinessTimelineQueryInput(input: BusinessTimelineQueryInput): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  const filters = input.filters;

  if (!filters.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }

  if (filters.category !== undefined && !isBusinessEventCategory(filters.category)) {
    issues.push(issue("invalid_enum", "Invalid category.", "category"));
  }
  if (filters.type !== undefined && !isBusinessEventType(filters.type)) {
    issues.push(issue("invalid_enum", "Invalid type.", "type"));
  }
  if (filters.importance !== undefined && !isBusinessEventImportance(filters.importance)) {
    issues.push(issue("invalid_enum", "Invalid importance.", "importance"));
  }
  if (filters.status !== undefined && !isBusinessEventStatus(filters.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (filters.source !== undefined && !isBusinessEventSource(filters.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }

  if (filters.direction !== undefined && filters.direction !== "asc" && filters.direction !== "desc") {
    issues.push(issue("invalid_enum", "Invalid direction.", "direction"));
  }

  if (filters.occurredFrom && filters.occurredTo && filters.occurredFrom > filters.occurredTo) {
    issues.push(issue("invalid_range", "occurredFrom must be before or equal to occurredTo.", "occurredFrom"));
  }

  return result(issues);
}

export function validateBusinessTimelineQueryResult(resultValue: BusinessTimelineQueryResult): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];

  if (resultValue.contractVersion !== BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (resultValue.readOnly !== true) {
    issues.push(issue("contract_violation", "Query result must be read-only.", "readOnly"));
  }
  if (resultValue.totalEvents !== resultValue.events.length) {
    issues.push(issue("invalid_field", "totalEvents must match events length.", "totalEvents"));
  }
  if (!(BUSINESS_TIMELINE_QUERY_ORDER_FIELDS as readonly string[]).includes(resultValue.orderedBy)) {
    issues.push(issue("invalid_field", "Invalid orderedBy field.", "orderedBy"));
  }
  if (resultValue.direction !== "asc" && resultValue.direction !== "desc") {
    issues.push(issue("invalid_field", "Invalid direction.", "direction"));
  }

  return result(issues);
}

export function validateWorkspaceIsolationForQueryResult(
  events: readonly BusinessEngineEvent[],
  workspaceId: string
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  for (const event of events) {
    const isolation = validateWorkspaceIsolation(workspaceId, event.workspaceId);
    if (!isolation.valid) {
      issues.push(...isolation.issues);
      break;
    }
  }
  return result(issues);
}

export function resolveQueryDirection(filters: BusinessTimelineQueryFilters): "asc" | "desc" {
  return filters.direction ?? DEFAULT_BUSINESS_TIMELINE_QUERY_DIRECTION;
}

export function assertNoMutationApisInQuerySource(source: string): boolean {
  return (
    !source.includes("createBusinessEvent(") &&
    !source.includes("updateBusinessEventMetadata(") &&
    !source.includes("archiveBusinessEvent(") &&
    !source.includes("registerBusinessEvent(")
  );
}

export const BusinessTimelineQueryValidation = Object.freeze({
  validateFoundationCompatibilityForQuery,
  validateEventEngineAvailabilityForQuery,
  validateBusinessTimelineQueryInput,
  validateBusinessTimelineQueryResult,
  validateWorkspaceIsolationForQueryResult,
  resolveQueryDirection,
  assertNoMutationApisInQuerySource,
});
