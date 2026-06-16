/**
 * MRP:4F:2 / 4F:3 — Map WarRoomState into workspace card snapshots.
 */

import { getWarRoomScenarioHandoffState } from "./warRoomScenarioHandoffRuntime.ts";
import {
  buildWarRoomIntakeActiveDecisionSnapshot,
  buildWarRoomIntakeStrategySummarySnapshot,
} from "./warRoomScenarioIntakeResolver.ts";
import {
  buildWarRoomActionPlanCardSnapshot,
  countWarRoomActionPlanItems,
} from "./warRoomActionPlanResolver.ts";
import type { WarRoomActionPlanLayer } from "./warRoomActionPlanContract.ts";
import type { WarRoomMonitoringLayer } from "./warRoomMonitoringContract.ts";
import {
  buildWarRoomMonitoringDecisionStatusCardSnapshot,
  buildWarRoomMonitoringWatchListCardSnapshot,
  countWarRoomMonitoringSignals,
} from "./warRoomMonitoringResolver.ts";
import { WAR_ROOM_RUNTIME_STATE_TAG } from "./warRoomStateContract.ts";
import {
  selectWarRoomActionPlanIds,
  selectWarRoomActiveDecisionId,
  selectWarRoomActiveScenarioId,
  selectWarRoomSelectedStrategy,
  selectWarRoomStatusLabel,
  selectWarRoomWatchListIds,
} from "./warRoomStateSelectors.ts";
import type { WarRoomState } from "./warRoomStateContract.ts";
import type { WarRoomFieldSnapshot } from "./warRoomWorkspaceStateContract.ts";
import type { WarRoomWorkspaceContext } from "./warRoomWorkspaceContextContract.ts";

export function buildWarRoomWorkspaceSnapshotsFromState(input: {
  warRoomState: WarRoomState;
  workspaceContext: WarRoomWorkspaceContext;
  actionPlanLayer?: WarRoomActionPlanLayer;
  monitoringLayer?: WarRoomMonitoringLayer;
}): Readonly<{
  strategySummary: WarRoomFieldSnapshot;
  activeDecision: WarRoomFieldSnapshot;
  actionPlan: WarRoomFieldSnapshot;
  watchList: WarRoomFieldSnapshot;
  decisionStatus: WarRoomFieldSnapshot;
}> {
  const { warRoomState, workspaceContext, actionPlanLayer, monitoringLayer } = input;
  const strategy = selectWarRoomSelectedStrategy(warRoomState);
  const decisionId = selectWarRoomActiveDecisionId(warRoomState);
  const scenarioId = selectWarRoomActiveScenarioId(warRoomState);
  const actionPlanIds = selectWarRoomActionPlanIds(warRoomState);
  const watchListIds = selectWarRoomWatchListIds(warRoomState);
  const statusLabel = selectWarRoomStatusLabel(warRoomState);
  const handoffPackage = getWarRoomScenarioHandoffState().commitPackage;
  const hasIntake =
    handoffPackage !== null &&
    warRoomState.activeScenarioId === handoffPackage.scenarioId &&
    warRoomState.activeDecisionId !== null;

  const strategySummary = hasIntake
    ? buildWarRoomIntakeStrategySummarySnapshot(handoffPackage)
    : Object.freeze({
        headline: strategy ?? "No strategy selected",
        detail: `${WAR_ROOM_RUNTIME_STATE_TAG} Strategy focus for ${workspaceContext.selectedObject} — commitment runtime MRP:4F:2.`,
      });

  const activeDecision = hasIntake
    ? buildWarRoomIntakeActiveDecisionSnapshot(handoffPackage, decisionId!)
    : Object.freeze({
        headline: decisionId ?? "No active decision",
        detail: scenarioId
          ? `${WAR_ROOM_RUNTIME_STATE_TAG} Decision linked to scenario handoff ${scenarioId} — reference only, no Scenario ownership.`
          : `${WAR_ROOM_RUNTIME_STATE_TAG} Active decision slot ready — no Timeline ownership.`,
      });

  const actionPlan =
    actionPlanLayer && countWarRoomActionPlanItems(actionPlanLayer) > 0
      ? buildWarRoomActionPlanCardSnapshot(actionPlanLayer)
      : Object.freeze({
          headline:
            actionPlanIds.length > 0
              ? `${actionPlanIds.length} action plan${actionPlanIds.length === 1 ? "" : "s"} tracked`
              : "No action plans",
          detail: `${WAR_ROOM_RUNTIME_STATE_TAG} ${actionPlanIds.join(" · ") || "Awaiting action plan assignment."}`,
        });

  const hasMonitoring =
    monitoringLayer !== undefined && countWarRoomMonitoringSignals(monitoringLayer) > 0;

  return Object.freeze({
    strategySummary,
    activeDecision,
    actionPlan,
    watchList: hasMonitoring
      ? buildWarRoomMonitoringWatchListCardSnapshot(monitoringLayer!)
      : Object.freeze({
          headline:
            watchListIds.length > 0
              ? `${watchListIds.length} watch item${watchListIds.length === 1 ? "" : "s"}`
              : "No watch items",
          detail: `${WAR_ROOM_RUNTIME_STATE_TAG} ${watchListIds.join(" · ") || "Watch list empty."}`,
        }),
    decisionStatus: hasMonitoring
      ? buildWarRoomMonitoringDecisionStatusCardSnapshot(monitoringLayer!, warRoomState.status)
      : Object.freeze({
          headline: statusLabel,
          detail: `${WAR_ROOM_RUNTIME_STATE_TAG} Commitment status ${warRoomState.status} — War Room owns commitment only.`,
        }),
  });
}
