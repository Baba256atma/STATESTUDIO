/**
 * Sprint 4 — Pure selectors over Executive Runtime state.
 */

import { filterSources } from "../data/ExecutiveDataConfig";
import { sortScenarios } from "../scenario/ScenarioConfig";
import type { ExecutiveRuntimeState } from "./ExecutiveRuntimeStore";

export function selectActiveMode(state: ExecutiveRuntimeState) {
  return state.mode.activeMode;
}

export function selectTimeline(state: ExecutiveRuntimeState) {
  return state.timeline;
}

export function selectPackId(state: ExecutiveRuntimeState) {
  return state.pack.selectedPackId;
}

export function selectSelection(state: ExecutiveRuntimeState) {
  return state.selection;
}

export function selectExplorer(state: ExecutiveRuntimeState) {
  return state.explorer;
}

export function selectCurrentScenario(state: ExecutiveRuntimeState) {
  return (
    state.scenario.scenarios.find(
      (s) => s.id === state.scenario.currentScenarioId,
    ) ?? null
  );
}

export function selectRankedScenarios(state: ExecutiveRuntimeState) {
  return sortScenarios(state.scenario.scenarios, state.scenario.rankSort);
}

export function selectActiveObjectIds(state: ExecutiveRuntimeState) {
  const { compareIds, scenarios, currentScenarioId } = state.scenario;
  if (compareIds.length >= 2) {
    const ids = new Set<string>();
    for (const id of compareIds) {
      const scenario = scenarios.find((s) => s.id === id);
      scenario?.objectIds.forEach((oid) => ids.add(oid));
    }
    return Array.from(ids);
  }
  return (
    scenarios.find((s) => s.id === currentScenarioId)?.objectIds ?? []
  );
}

export function selectCurrentDecision(state: ExecutiveRuntimeState) {
  return (
    state.decision.decisions.find(
      (d) => d.id === state.decision.currentDecisionId,
    ) ?? null
  );
}

export function selectSelectedTask(state: ExecutiveRuntimeState) {
  return (
    state.execution.plan.tasks.find(
      (t) => t.id === state.execution.selectedTaskId,
    ) ?? null
  );
}

export function selectSelectedSource(state: ExecutiveRuntimeState) {
  return (
    state.data.sources.find((s) => s.id === state.data.selectedSourceId) ??
    null
  );
}

export function selectVisibleSources(state: ExecutiveRuntimeState) {
  return filterSources(
    state.data.sources,
    state.data.filter,
    state.data.query,
  );
}

export function selectRuntimeInspectorSnapshot(state: ExecutiveRuntimeState) {
  return {
    mode: state.mode.activeMode,
    pack: state.pack.selectedPackId,
    timeline: state.timeline,
    selectedObjectId: state.selection.selectedObjectId,
    scenario: state.scenario.currentScenarioId,
    decision: state.decision.currentDecisionId,
    execution: state.execution.plan.status,
    monitoringHealth: state.monitoring.executiveHealth,
    dataSource: state.data.selectedSourceId,
    explorer: state.explorer,
  };
}
