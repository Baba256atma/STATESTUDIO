/**
 * Phase B — Build Executive Signals from change + context + relationships.
 */

import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import { resolveAttention } from "./ExecutiveAttentionEngine";
import type {
  ExecutiveChangeRecord,
  ExecutiveContextAnalysis,
  ExecutiveRelationshipAnalysis,
  ExecutiveSignal,
  ExecutiveSignalType,
} from "./ExecutiveSignalTypes";

function signalTypeFor(
  eventType: ExecutiveChangeRecord["eventType"],
  severity: ExecutiveSignal["severity"],
): ExecutiveSignalType {
  if (eventType === "DecisionApproved" || eventType === "DecisionUpdated") {
    return "Decision Required";
  }
  if (severity === "Critical") return "Critical";
  if (severity === "High") return "Warning";
  if (
    eventType === "ScenarioSelected" ||
    eventType === "ScenarioUpdated" ||
    eventType === "SimulationCompleted"
  ) {
    return "Opportunity";
  }
  if (eventType === "ObjectSelected" || eventType === "TimelineMoved") {
    return "Information";
  }
  return "Observation";
}

function suggestedWorkspace(
  eventType: ExecutiveChangeRecord["eventType"],
  current: ExecutiveModeId,
): ExecutiveModeId {
  switch (eventType) {
    case "DecisionApproved":
    case "DecisionUpdated":
      return "Decision";
    case "ExecutionStarted":
    case "ExecutionUpdated":
      return "Execution";
    case "SnapshotCreated":
    case "MonitoringUpdated":
      return "Monitoring";
    case "ScenarioSelected":
    case "ScenarioUpdated":
    case "SimulationCompleted":
      return "Scenario";
    case "DataSourceSelected":
    case "DataUpdated":
      return current;
    default:
      return current;
  }
}

function suggestedAction(
  type: ExecutiveSignalType,
  eventType: ExecutiveChangeRecord["eventType"],
): string {
  if (type === "Decision Required") return "Review decision commitment";
  if (eventType === "ExecutionStarted") return "Inspect blockers";
  if (eventType === "SnapshotCreated") return "Open Monitoring workspace";
  if (eventType === "DataUpdated") return "Review published connector data";
  if (eventType === "SimulationCompleted")
    return "Compare Future State and consider Decision Candidate";
  if (eventType === "ScenarioSelected") return "Compare scenarios";
  return "Review executive context";
}

export function createExecutiveSignal(input: {
  readonly change: ExecutiveChangeRecord;
  readonly context: ExecutiveContextAnalysis;
  readonly relationships: ExecutiveRelationshipAnalysis;
}): ExecutiveSignal {
  const attention = resolveAttention(input.change.eventType);
  const type = signalTypeFor(input.change.eventType, attention.severity);
  const workspace = suggestedWorkspace(
    input.change.eventType,
    input.context.workspace,
  );

  return {
    signalId: `sig-${input.change.changeId}`,
    type,
    severity: attention.severity,
    sourceEvent: input.change.eventType,
    sourceSummary: input.change.summary,
    relatedObjectIds: input.relationships.relatedObjectIds,
    relatedPackId: input.context.packId,
    relatedPackTitle: input.context.packTitle,
    relatedTimeline: `${input.context.timelineLens} @ ${input.context.timelinePosition}`,
    summary: `${type} · ${input.change.summary} · ${input.context.packTitle}`,
    suggestedWorkspace: workspace,
    suggestedAction: suggestedAction(type, input.change.eventType),
    timestamp: input.change.at,
    lifecycle: "New",
    unread: attention.deservesAttention,
    domainNames: input.relationships.relatedDomainNames.length
      ? input.relationships.relatedDomainNames
      : input.context.domainNames,
    changeId: input.change.changeId,
  };
}
