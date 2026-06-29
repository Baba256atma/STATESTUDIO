/**
 * APP-5:8 — Scenario Timeline Dashboard adapter.
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
import type { ScenarioTimelineDashboardDiagnostics } from "./scenarioTimelineDashboardTypes.ts";

export function readScenarioTimelineDashboardDiagnostics(): ScenarioTimelineDashboardDiagnostics {
  const health = getScenarioTimelineHealth();
  return Object.freeze({
    apiLayerReady: isScenarioTimelineApiLayerInitialized(),
    timelineHealthy: health.data?.healthy === true,
    validationValid: true,
    assistantContextUsed: false,
    readOnly: true as const,
  });
}

export function fetchDashboardScenarioTimelineView(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimeline(filters);
}

export function fetchDashboardScenarioTimelineQuery(filters: ScenarioTimelineQueryFilters) {
  return queryScenarioTimeline(filters);
}

export function fetchDashboardScenarioTimelineSummary(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineSummary(filters);
}

export function fetchDashboardScenarioTimelineMilestones(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineMilestones(filters);
}

export function fetchDashboardScenarioTimelineStatus(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineStatus(filters);
}

export function fetchDashboardScenarioTimelineProgress(filters: ScenarioTimelineQueryFilters) {
  return getScenarioTimelineProgress(filters);
}

export function fetchDashboardScenarioTimelineValidation(filters: ScenarioTimelineQueryFilters) {
  return validateScenarioTimeline(filters);
}

export function fetchDashboardScenarioTimelineVersion() {
  return getScenarioTimelineVersion();
}

export function fetchDashboardScenarioTimelineHealth() {
  return getScenarioTimelineHealth();
}

export const ScenarioTimelineDashboardAdapter = Object.freeze({
  readScenarioTimelineDashboardDiagnostics,
  fetchDashboardScenarioTimelineView,
  fetchDashboardScenarioTimelineQuery,
  fetchDashboardScenarioTimelineSummary,
  fetchDashboardScenarioTimelineMilestones,
  fetchDashboardScenarioTimelineStatus,
  fetchDashboardScenarioTimelineProgress,
  fetchDashboardScenarioTimelineValidation,
  fetchDashboardScenarioTimelineVersion,
  fetchDashboardScenarioTimelineHealth,
  isScenarioTimelineApiLayerInitialized,
});
