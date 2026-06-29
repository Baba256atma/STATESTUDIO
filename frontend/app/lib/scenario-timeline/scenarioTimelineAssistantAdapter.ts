/**
 * APP-5:7 — Scenario Timeline Assistant adapter.
 * Consumes only APP-5:6 public APIs.
 */

import {
  getScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineMilestones,
  getScenarioTimelineProgress,
  getScenarioTimelineStatus,
  getScenarioTimelineSummary,
  getScenarioTimelineVersion,
  isScenarioTimelineApiLayerInitialized,
  queryScenarioTimeline,
  validateScenarioTimeline,
} from "./scenarioTimelineApiLayer.ts";
import type { ScenarioTimelineQueryFilters } from "./scenarioTimelineApiTypes.ts";
import type { ScenarioTimelineAssistantDiagnostics } from "./scenarioTimelineAssistantTypes.ts";

export function readScenarioTimelineAssistantDiagnostics(): ScenarioTimelineAssistantDiagnostics {
  const health = getScenarioTimelineHealth();
  return Object.freeze({
    apiLayerReady: isScenarioTimelineApiLayerInitialized(),
    timelineHealthy: health.data?.healthy === true,
    validationValid: true,
    readOnly: true as const,
  });
}

export function fetchScenarioTimelineView(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimeline(filters);
}

export function fetchScenarioTimelineQuery(filters: ScenarioTimelineQueryFilters) {
  return queryScenarioTimeline(filters);
}

export function fetchScenarioTimelineSummary(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineSummary(filters);
}

export function fetchScenarioTimelineMilestones(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineMilestones(filters);
}

export function fetchScenarioTimelineStatus(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineStatus(filters);
}

export function fetchScenarioTimelineProgress(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineProgress(filters);
}

export function fetchScenarioTimelineValidation(filters: ScenarioTimelineQueryFilters) {
  return validateScenarioTimeline(filters);
}

export function fetchScenarioTimelineVersion() {
  return getScenarioTimelineVersion();
}

export const ScenarioTimelineAssistantAdapter = Object.freeze({
  readScenarioTimelineAssistantDiagnostics,
  fetchScenarioTimelineView,
  fetchScenarioTimelineQuery,
  fetchScenarioTimelineSummary,
  fetchScenarioTimelineMilestones,
  fetchScenarioTimelineStatus,
  fetchScenarioTimelineProgress,
  fetchScenarioTimelineValidation,
  fetchScenarioTimelineVersion,
  isScenarioTimelineApiLayerInitialized,
});
