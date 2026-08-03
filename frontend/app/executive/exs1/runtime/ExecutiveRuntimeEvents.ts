/**
 * Sprint 4 — Executive Runtime event catalogue.
 * Aligns with cockpit interactions; reuses RTC naming spirit without inventing a second bus.
 */

export type ExecutiveRuntimeEventType =
  | "ModeChanged"
  | "PackSelected"
  | "TimelineMoved"
  | "ObjectSelected"
  | "ExplorerChanged"
  | "ScenarioSelected"
  | "ScenarioUpdated"
  | "DecisionSelected"
  | "DecisionApproved"
  | "DecisionUpdated"
  | "ExecutionStarted"
  | "ExecutionUpdated"
  | "SnapshotCreated"
  | "MonitoringUpdated"
  | "DataSourceSelected"
  | "DataUpdated"
  | "SimulationCompleted"
  | "ThemeChanged"
  | "AdvisorTabChanged"
  | "FloatingPanelChanged"
  | "AdvisorProposalCreated"
  | "AdvisorFocusRequested"
  | "AdvisorExplanationGenerated"
  | "AdvisorSuggestionAccepted"
  | "AdvisorSuggestionDismissed";

export type ExecutiveRuntimeEvent = {
  readonly id: string;
  readonly type: ExecutiveRuntimeEventType;
  readonly at: number;
  readonly payload?: unknown;
};

export const RUNTIME_EVENT_LOG_LIMIT = 64;

export function createRuntimeEvent(
  type: ExecutiveRuntimeEventType,
  payload?: unknown,
): ExecutiveRuntimeEvent {
  return {
    id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    at: Date.now(),
    payload,
  };
}
