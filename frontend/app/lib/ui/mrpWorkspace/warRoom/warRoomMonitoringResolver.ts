/**
 * MRP:4F:5 — Derive War Room monitoring layer from commitment runtime state.
 *
 * Structural execution tracking only — no simulation or timeline workspace reads.
 */

import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";
import {
  DEFAULT_WAR_ROOM_MONITORING_LAYER,
  WAR_ROOM_MONITORING_PURPOSE,
  WAR_ROOM_MONITORING_TAG,
  WAR_ROOM_MONITOR_CATEGORY_LABELS,
  type WarRoomDecisionHealthSignal,
  type WarRoomEscalationIndicator,
  type WarRoomEscalationLevel,
  type WarRoomMonitorAlert,
  type WarRoomMonitoringLayer,
  type WarRoomMonitoringSurface,
  type WarRoomWatchItem,
} from "./warRoomMonitoringContract.ts";
import type { WarRoomFieldSnapshot } from "./warRoomWorkspaceStateContract.ts";
import type { WarRoomStatus } from "./warRoomStateContract.ts";
import type { WarRoomWorkspaceContext } from "./warRoomWorkspaceContextContract.ts";

export type WarRoomMonitoringInput = Readonly<{
  selectedStrategy: string | null;
  activeDecisionId: string | null;
  status: WarRoomStatus;
  workspaceContext: WarRoomWorkspaceContext;
  commitPackage: ScenarioCommitPackage | null;
  actionPlanItemCount: number;
}>;

function resolveStrategyLabel(input: WarRoomMonitoringInput): string {
  return (
    input.commitPackage?.title?.trim() ||
    input.selectedStrategy?.trim() ||
    input.workspaceContext.strategyFocus.trim() ||
    "Selected strategy"
  );
}

function resolveObjectSegment(input: WarRoomMonitoringInput): string {
  return (
    input.commitPackage?.selectedObjectId?.trim() ||
    input.workspaceContext.selectedObjectId?.trim() ||
    "general"
  );
}

function resolveEscalationLevel(input: WarRoomMonitoringInput): WarRoomEscalationLevel {
  if (input.status === "closed") return "none";
  if (input.status === "active" && input.actionPlanItemCount > 0) return "watch";
  if (input.status === "review") return "escalate";
  if (input.status === "approved") return "watch";
  return "none";
}

export function deriveWarRoomMonitoringLayer(
  input: WarRoomMonitoringInput
): WarRoomMonitoringLayer {
  const hasMonitoringContext =
    input.workspaceContext.hasSelection ||
    input.activeDecisionId !== null ||
    input.commitPackage !== null;

  if (!hasMonitoringContext) {
    return DEFAULT_WAR_ROOM_MONITORING_LAYER;
  }

  const strategy = resolveStrategyLabel(input);
  const objectSegment = resolveObjectSegment(input);
  const objectLabel = input.workspaceContext.selectedObject;
  const escalationLevel = resolveEscalationLevel(input);

  const watchItems: WarRoomWatchItem[] = [
    Object.freeze({
      id: `watch:critical_objects:${objectSegment}`,
      label: WAR_ROOM_MONITOR_CATEGORY_LABELS.critical_objects,
      category: "critical_objects",
      severity: "critical",
      summary: `Monitor ${objectLabel} as a critical commitment object.`,
    }),
    Object.freeze({
      id: `watch:strategic_risks:${objectSegment}`,
      label: WAR_ROOM_MONITOR_CATEGORY_LABELS.strategic_risks,
      category: "strategic_risks",
      severity: input.status === "review" ? "warning" : "stable",
      summary: `Track strategic risk posture for ${strategy}.`,
    }),
    Object.freeze({
      id: `watch:operational_signals:${objectSegment}`,
      label: WAR_ROOM_MONITOR_CATEGORY_LABELS.operational_signals,
      category: "operational_signals",
      severity: "warning",
      summary: `Watch operational signals tied to ${objectLabel} execution.`,
    }),
    Object.freeze({
      id: `watch:decision_health:${objectSegment}`,
      label: WAR_ROOM_MONITOR_CATEGORY_LABELS.decision_health,
      category: "decision_health",
      severity: input.status === "active" ? "stable" : "warning",
      summary: `Monitor decision health for ${input.activeDecisionId ?? "pending decision"}.`,
    }),
  ];

  const alerts: WarRoomMonitorAlert[] = [];
  if (input.status === "review") {
    alerts.push(
      Object.freeze({
        id: `alert:review:${objectSegment}`,
        title: "Decision under review",
        severity: "warning",
        category: "decision_health",
        detail: `${strategy} requires War Room review before execution proceeds.`,
      })
    );
  }
  if (input.status === "active") {
    alerts.push(
      Object.freeze({
        id: `alert:active:${objectSegment}`,
        title: "Execution in progress",
        severity: "info",
        category: "operational_signals",
        detail: `Active commitment execution tracked for ${objectLabel}.`,
      })
    );
  }
  if (escalationLevel === "escalate") {
    alerts.push(
      Object.freeze({
        id: `alert:escalation:${objectSegment}`,
        title: "Escalation watch active",
        severity: "critical",
        category: "strategic_risks",
        detail: `Strategic escalation indicators triggered for ${strategy}.`,
      })
    );
  }

  const decisionHealth: WarRoomDecisionHealthSignal[] = [
    Object.freeze({
      id: `health:commitment:${objectSegment}`,
      label: "Commitment trajectory",
      status: input.status === "active" ? "healthy" : input.status === "review" ? "at_risk" : "healthy",
      detail: `Commitment status ${input.status} for ${strategy}.`,
    }),
    Object.freeze({
      id: `health:actions:${objectSegment}`,
      label: "Action plan coverage",
      status: input.actionPlanItemCount > 0 ? "healthy" : "at_risk",
      detail:
        input.actionPlanItemCount > 0
          ? `${input.actionPlanItemCount} action items linked to execution monitoring.`
          : "Action plan coverage pending — monitor remains advisory.",
    }),
    Object.freeze({
      id: `health:alignment:${objectSegment}`,
      label: "Stakeholder alignment",
      status: input.commitPackage ? "at_risk" : "healthy",
      detail: input.commitPackage
        ? `Scenario handoff reference ${input.commitPackage.scenarioId} under active watch.`
        : "Alignment stable — no pending handoff escalation.",
    }),
  ];

  const escalationIndicators: WarRoomEscalationIndicator[] = [
    Object.freeze({
      id: `escalation:primary:${objectSegment}`,
      label: "Primary escalation lane",
      level: escalationLevel,
      reason:
        escalationLevel === "escalate"
          ? "Decision review requires executive escalation watch."
          : escalationLevel === "watch"
            ? "Execution monitoring active — no immediate escalation."
            : "No escalation required.",
    }),
    Object.freeze({
      id: `escalation:commitment:${objectSegment}`,
      label: "Commitment health gate",
      level: input.status === "closed" ? "none" : escalationLevel === "none" ? "watch" : escalationLevel,
      reason: `Decision health monitored post-commitment for ${objectLabel}.`,
    }),
  ];

  return Object.freeze({
    watchItems: Object.freeze(watchItems),
    alerts: Object.freeze(alerts),
    decisionHealth: Object.freeze(decisionHealth),
    escalationIndicators: Object.freeze(escalationIndicators),
    executionTrackingOwned: true,
  });
}

export function buildWarRoomMonitoringSignature(layer: WarRoomMonitoringLayer): string {
  return JSON.stringify(layer);
}

export function buildWarRoomMonitoringSurface(
  layer: WarRoomMonitoringLayer
): WarRoomMonitoringSurface {
  return Object.freeze({
    purpose: WAR_ROOM_MONITORING_PURPOSE,
    watchList: layer.watchItems,
    alerts: layer.alerts,
    decisionHealth: layer.decisionHealth,
    escalationIndicators: layer.escalationIndicators,
    dashboardContext: "war_room",
    executionTrackingOwned: true,
  });
}

export function countWarRoomMonitoringSignals(layer: WarRoomMonitoringLayer): number {
  return (
    layer.watchItems.length +
    layer.alerts.length +
    layer.decisionHealth.length +
    layer.escalationIndicators.length
  );
}

export function buildWarRoomMonitoringWatchListCardSnapshot(
  layer: WarRoomMonitoringLayer
): WarRoomFieldSnapshot {
  return Object.freeze({
    headline: `Watch List active (${layer.watchItems.length} monitors)`,
    detail: `${WAR_ROOM_MONITORING_TAG} ${WAR_ROOM_MONITORING_PURPOSE} Critical objects, strategic risks, operational signals, and decision health — no simulation logic.`,
  });
}

export function buildWarRoomMonitoringDecisionStatusCardSnapshot(
  layer: WarRoomMonitoringLayer,
  status: WarRoomStatus
): WarRoomFieldSnapshot {
  const atRisk = layer.decisionHealth.filter((signal) => signal.status !== "healthy").length;
  return Object.freeze({
    headline: atRisk > 0 ? "Decision health at risk" : "Decision health stable",
    detail: `${WAR_ROOM_MONITORING_TAG} ${layer.decisionHealth.length} health signals · commitment ${status} — War Room tracks execution, Timeline owns history.`,
  });
}
