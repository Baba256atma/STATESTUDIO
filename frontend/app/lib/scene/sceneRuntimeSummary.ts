/**
 * MRP_HUD:14:1 — Scene-level runtime summary for the system control center.
 * Answers: "What is happening in the entire system?"
 */

import { bindTopologyToSceneObjects } from "./topology/topologySceneBinding.ts";
import {
  ACTIVE_SCENE_TOPOLOGY_MODE,
  type SceneTopologyMode,
} from "./topology/topologySceneBindingTypes.ts";
import type { TopologyType } from "./topology/topologyTypes.ts";
import type { SceneObject } from "../sceneTypes.ts";

function readSceneObjects(sceneJson: unknown): SceneObject[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? (objects as SceneObject[]) : [];
}

function countSceneConnections(sceneJson: unknown): number {
  const raw = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene?.relationships;
  if (!Array.isArray(raw)) return 0;
  return raw.filter((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const rel = entry as {
      id?: unknown;
      sourceId?: unknown;
      targetId?: unknown;
      type?: unknown;
      direction?: unknown;
      createdAt?: unknown;
    };
    return (
      typeof rel.id === "string" &&
      typeof rel.sourceId === "string" &&
      typeof rel.targetId === "string" &&
      typeof rel.type === "string" &&
      (rel.direction === "uni" || rel.direction === "bi") &&
      typeof rel.createdAt === "string"
    );
  }).length;
}

export type SceneRuntimeStatus = "ready" | "loading" | "degraded" | "idle";

export type SceneRuntimeSummary = Readonly<{
  sceneTitle: string;
  objectCount: number;
  connectionCount: number;
  topologyLabel: string;
  scenarioLabel: string;
  runtimeStatus: SceneRuntimeStatus;
  warningCount: number;
  recommendationCount: number;
  lastUpdateLabel: string;
}>;

export type BuildSceneRuntimeSummaryInput = Readonly<{
  sceneJson: unknown;
  sceneTitle?: string | null;
  activeScenarioTitle?: string | null;
  topologyMode?: SceneTopologyMode;
  runtimeStatus?: SceneRuntimeStatus;
  warningCount?: number;
  recommendationCount?: number;
  lastUpdateAt?: number | string | null;
}>;

const DEFAULT_SCENE_TITLE = "Executive Workspace";
const DEFAULT_SCENARIO_LABEL = "Baseline";

let loggedSummarySignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function formatTopologyDisplayLabel(topologyType: TopologyType | "off"): string {
  if (topologyType === "off") return "Off";
  if (topologyType === "hub") return "Hub";
  if (topologyType === "flow") return "Flow";
  if (topologyType === "auto") return "Auto";
  return topologyType.charAt(0).toUpperCase() + topologyType.slice(1);
}

export function resolveSceneRuntimeStatus(input: {
  objectCount: number;
  runtimeStatus?: SceneRuntimeStatus;
}): SceneRuntimeStatus {
  if (input.runtimeStatus) return input.runtimeStatus;
  if (input.objectCount === 0) return "idle";
  return "ready";
}

export function resolveLastUpdateLabel(
  lastUpdateAt: number | string | null | undefined,
  runtimeStatus: SceneRuntimeStatus
): string {
  if (runtimeStatus === "loading") return "Pending";
  if (typeof lastUpdateAt === "number" && Number.isFinite(lastUpdateAt)) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(lastUpdateAt);
  }
  if (typeof lastUpdateAt === "string" && lastUpdateAt.trim()) {
    return lastUpdateAt.trim();
  }
  return "Runtime";
}

export function resolveActiveTopologyLabel(input: {
  sceneJson: unknown;
  topologyMode?: SceneTopologyMode;
}): string {
  const objects = readSceneObjects(input.sceneJson) as SceneObject[];
  const binding = bindTopologyToSceneObjects({
    sceneObjects: objects,
    topologyMode: input.topologyMode ?? ACTIVE_SCENE_TOPOLOGY_MODE,
  });
  return formatTopologyDisplayLabel(binding.topologyType);
}

export function resolveSceneRuntimeSummary(input: BuildSceneRuntimeSummaryInput): SceneRuntimeSummary {
  const objectCount = readSceneObjects(input.sceneJson).length;
  const connectionCount = countSceneConnections(input.sceneJson);
  const topologyLabel = resolveActiveTopologyLabel({
    sceneJson: input.sceneJson,
    topologyMode: input.topologyMode,
  });
  const runtimeStatus = resolveSceneRuntimeStatus({
    objectCount,
    runtimeStatus: input.runtimeStatus,
  });

  const summary: SceneRuntimeSummary = Object.freeze({
    sceneTitle: input.sceneTitle?.trim() || DEFAULT_SCENE_TITLE,
    objectCount,
    connectionCount,
    topologyLabel,
    scenarioLabel: input.activeScenarioTitle?.trim() || DEFAULT_SCENARIO_LABEL,
    runtimeStatus,
    warningCount: Math.max(0, input.warningCount ?? 0),
    recommendationCount: Math.max(0, input.recommendationCount ?? 0),
    lastUpdateLabel: resolveLastUpdateLabel(input.lastUpdateAt, runtimeStatus),
  });

  traceNexoraScenePanelSummary(summary);
  return summary;
}

export function traceNexoraScenePanelSummary(
  summary: Pick<SceneRuntimeSummary, "objectCount" | "connectionCount" | "topologyLabel">
): void {
  if (!isDev()) return;
  const signature = `${summary.objectCount}:${summary.connectionCount}:${summary.topologyLabel}`;
  if (loggedSummarySignature === signature) return;
  loggedSummarySignature = signature;
  globalThis.console?.log?.(
    `[NexoraScenePanel] objects=${summary.objectCount} connections=${summary.connectionCount} topology=${summary.topologyLabel.toLowerCase()}`
  );
}

export function resetSceneRuntimeSummaryForTests(): void {
  loggedSummarySignature = null;
}
