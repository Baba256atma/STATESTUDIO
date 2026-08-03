/**
 * Phase B — Detect Runtime changes from event stream.
 */

import type { ExecutiveRuntimeEvent } from "../runtime/ExecutiveRuntimeEvents";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import type { ExecutiveChangeRecord } from "./ExecutiveSignalTypes";

function payloadValue(payload: unknown, key: string): string | null {
  if (!payload || typeof payload !== "object") return null;
  const value = (payload as Record<string, unknown>)[key];
  if (value == null) return null;
  return String(value);
}

export function detectExecutiveChange(
  event: ExecutiveRuntimeState["events"][number] | ExecutiveRuntimeEvent,
  previous: ExecutiveRuntimeState | null,
  current: ExecutiveRuntimeState,
): ExecutiveChangeRecord {
  const type = event.type;
  let fromValue: string | null = null;
  let toValue: string | null = null;
  let summary = `${type} occurred`;

  switch (type) {
    case "ModeChanged":
      fromValue = previous?.mode.activeMode ?? null;
      toValue = payloadValue(event.payload, "mode") ?? current.mode.activeMode;
      summary = `Mode changed ${fromValue ?? "—"} → ${toValue}`;
      break;
    case "PackSelected":
      fromValue = previous?.pack.selectedPackId ?? null;
      toValue = payloadValue(event.payload, "packId") ?? current.pack.selectedPackId;
      summary = `Pack selected → ${toValue}`;
      break;
    case "ObjectSelected":
      fromValue = previous?.selection.selectedObjectId ?? null;
      toValue =
        payloadValue(event.payload, "objectId") ??
        current.selection.selectedObjectId;
      summary = `Object selected → ${toValue}`;
      break;
    case "TimelineMoved":
      fromValue = previous
        ? `${previous.timeline.lens}@${previous.timeline.position}`
        : null;
      toValue = `${current.timeline.lens}@${current.timeline.position}`;
      summary = `Timeline moved → ${toValue}`;
      break;
    case "ScenarioSelected":
      fromValue = previous?.scenario.currentScenarioId ?? null;
      toValue =
        payloadValue(event.payload, "id") ?? current.scenario.currentScenarioId;
      summary = `Scenario selected → ${toValue}`;
      break;
    case "DecisionApproved":
      fromValue = "Pending";
      toValue = payloadValue(event.payload, "id") ?? "Approved";
      summary = `Decision approved → ${toValue}`;
      break;
    case "ExecutionStarted":
      fromValue = previous?.execution.plan.status ?? "Idle";
      toValue = "Running";
      summary = "Execution started";
      break;
    case "SnapshotCreated":
      fromValue = String(previous?.monitoring.snapshots.length ?? 0);
      toValue = String(current.monitoring.snapshots.length);
      summary = "Monitoring snapshot created";
      break;
    case "DataSourceSelected":
    case "DataUpdated": {
      fromValue = previous?.data.selectedSourceId ?? null;
      toValue = current.data.selectedSourceId;
      const published = payloadValue(event.payload, "published");
      const sourceName = payloadValue(event.payload, "sourceName");
      if (type === "DataSourceSelected") {
        summary = `Data source selected → ${toValue}`;
      } else if (published === "true" || published === "1") {
        summary = `${sourceName ?? "Dataset"} Updated`;
        toValue = payloadValue(event.payload, "sourceId") ?? toValue;
      } else {
        summary = "Data catalog updated";
      }
      break;
    }
    case "SimulationCompleted":
      fromValue = "Baseline";
      toValue =
        payloadValue(event.payload, "scenarioLabel") ?? "Future State";
      summary = `Simulation completed · ${toValue}`;
      break;
    default:
      summary = `${type} observed`;
      toValue = payloadValue(event.payload, "id");
      break;
  }

  return {
    changeId: `chg-${event.id}`,
    eventType: type,
    at: event.at,
    fromValue,
    toValue,
    summary,
  };
}

export function shouldProcessEvent(
  type: ExecutiveRuntimeEvent["type"],
): boolean {
  return ![
    "ThemeChanged",
    "AdvisorTabChanged",
    "FloatingPanelChanged",
    "AdvisorExplanationGenerated",
    "AdvisorProposalCreated",
    "AdvisorFocusRequested",
    "AdvisorSuggestionAccepted",
    "AdvisorSuggestionDismissed",
  ].includes(type);
}
