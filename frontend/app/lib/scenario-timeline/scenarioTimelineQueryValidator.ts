/**
 * APP-5:5 — Scenario Timeline Query validator.
 */

import {
  SCENARIO_TIMELINE_QUERY_FILTER_KEYS,
  SCENARIO_TIMELINE_QUERY_TYPE_KEYS,
} from "./scenarioTimelineQueryConstants.ts";
import type {
  ScenarioTimelineQueryFilters,
  ScenarioTimelineQueryInput,
  ScenarioTimelineQueryResult,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
} from "./scenarioTimelineQueryTypes.ts";
import { isScenarioTimelineEventType, isScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformValidation.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function isValidIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function validateTimelineQueryFilters(filters: ScenarioTimelineQueryFilters): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  for (const key of Object.keys(filters)) {
    if (!(SCENARIO_TIMELINE_QUERY_FILTER_KEYS as readonly string[]).includes(key)) {
      issues.push(issue("unsupported_filter", `Unsupported filter key: ${key}.`, key));
    }
  }

  if (filters.stage && !isScenarioTimelineLifecycleStage(filters.stage)) {
    issues.push(issue("invalid_filter", "Invalid lifecycle stage filter.", "stage"));
  }
  if (filters.eventType && !isScenarioTimelineEventType(filters.eventType)) {
    issues.push(issue("invalid_filter", "Invalid event type filter.", "eventType"));
  }
  if (filters.dateFrom && !isValidIsoDate(filters.dateFrom)) {
    issues.push(issue("invalid_filter", "dateFrom must be a valid ISO-8601 timestamp.", "dateFrom"));
  }
  if (filters.dateTo && !isValidIsoDate(filters.dateTo)) {
    issues.push(issue("invalid_filter", "dateTo must be a valid ISO-8601 timestamp.", "dateTo"));
  }
  if (filters.sequenceFrom !== undefined && filters.sequenceFrom < 1) {
    issues.push(issue("invalid_filter", "sequenceFrom must be >= 1.", "sequenceFrom"));
  }
  if (filters.sequenceTo !== undefined && filters.sequenceTo < 1) {
    issues.push(issue("invalid_filter", "sequenceTo must be >= 1.", "sequenceTo"));
  }
  if (
    filters.sequenceFrom !== undefined &&
    filters.sequenceTo !== undefined &&
    filters.sequenceTo < filters.sequenceFrom
  ) {
    issues.push(issue("invalid_filter", "sequenceTo must be >= sequenceFrom.", "sequenceTo"));
  }

  return result(issues);
}

export function validateTimelineQueryInput(input: ScenarioTimelineQueryInput): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  if (!(SCENARIO_TIMELINE_QUERY_TYPE_KEYS as readonly string[]).includes(input.queryType)) {
    issues.push(issue("invalid_query_type", "Unsupported query type.", "queryType"));
  }

  const filterValidation = validateTimelineQueryFilters(input.filters);
  issues.push(...filterValidation.issues);

  const requiresScenario =
    input.queryType !== "by_event_id" &&
    input.queryType !== "by_history_id" &&
    !input.filters.scenarioId &&
    !input.filters.historyId &&
    !input.filters.eventId;

  if (requiresScenario && !input.filters.workspaceId) {
    issues.push(issue("missing_filter", "scenarioId, historyId, eventId, or workspaceId is required.", "filters"));
  }

  if (input.queryType === "by_stage" && !input.filters.stage) {
    issues.push(issue("missing_filter", "stage filter is required for by_stage queries.", "stage"));
  }
  if (input.queryType === "by_date" && !input.filters.dateFrom && !input.filters.dateTo) {
    issues.push(issue("missing_filter", "dateFrom or dateTo is required for by_date queries.", "dateFrom"));
  }
  if (input.queryType === "by_event_id" && !input.filters.eventId) {
    issues.push(issue("missing_filter", "eventId filter is required for by_event_id queries.", "eventId"));
  }
  if (input.queryType === "by_history_id" && !input.filters.historyId) {
    issues.push(issue("missing_filter", "historyId filter is required for by_history_id queries.", "historyId"));
  }

  return result(issues);
}

export function validateTimelineQueryResult(resultObject: ScenarioTimelineQueryResult): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  if (resultObject.readOnly !== true) {
    issues.push(issue("contract_violation", "Query results must be read-only.", "readOnly"));
  }
  if (resultObject.events.length > 512) {
    issues.push(issue("result_limit", "Query result exceeds maximum event count.", "events"));
  }

  return result(issues);
}

export const ScenarioTimelineQueryValidator = Object.freeze({
  validateTimelineQueryFilters,
  validateTimelineQueryInput,
  validateTimelineQueryResult,
});
