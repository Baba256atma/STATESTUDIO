/**
 * MRP:4D:5 — Pure resolver for Timeline scene awareness snapshot.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import { classifyRiskBand, readObjectHaystack } from "../risk/riskSceneScanResolver.ts";
import {
  DEFAULT_TIMELINE_SCENE_AWARENESS,
  DEFAULT_TIMELINE_SCENE_COVERAGE,
  type TimelineSceneAwarenessInput,
  type TimelineSceneAwarenessSnapshot,
  type TimelineSceneCoverage,
} from "./timelineSceneAwarenessContract.ts";
import { deriveTimelineWorkspaceMetrics } from "./timelineWorkspaceMetricsResolver.ts";
import type { TimelineWorkspaceDataInput } from "./timelineWorkspaceMetricsContract.ts";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveSelectedObjectId(input: TimelineSceneAwarenessInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function countSceneObjects(sceneJson: SceneJson | null | undefined): number {
  const objects = sceneJson?.scene?.objects;
  return Array.isArray(objects) ? objects.length : 0;
}

function readObjectDecisionHaystack(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  return [record.decision, record.decision_status, record.approval_status, semantic?.decision]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function isDecisionHaystack(haystack: string): boolean {
  return /\bdecision\b|\bapproved\b|\brejected\b|\bcommitted\b|\bpending approval\b/.test(
    haystack
  );
}

function objectHasTimelineEventMarker(obj: unknown): boolean {
  const haystack = readObjectHaystack(obj);
  const decisionHaystack = readObjectDecisionHaystack(obj);
  return isDecisionHaystack(decisionHaystack) || classifyRiskBand(haystack) !== "none";
}

function countSceneObjectsWithEvents(sceneJson: SceneJson | null | undefined): number {
  const objects = sceneJson?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) return 0;

  let count = 0;
  for (const obj of objects) {
    if (objectHasTimelineEventMarker(obj)) count += 1;
  }
  return count;
}

function toMetricsInput(input: TimelineSceneAwarenessInput): TimelineWorkspaceDataInput {
  return Object.freeze({
    selectedObjectId: input.selectedObjectId,
    routeObjectId: input.routeObjectId,
    sceneJson: input.sceneJson,
    navigationHistoryEntries: input.navigationHistoryEntries,
  });
}

export function resolveTimelineSceneCoverage(
  input: TimelineSceneAwarenessInput
): TimelineSceneCoverage {
  const objectsTracked = countSceneObjects(input.sceneJson);
  const objectsWithEvents = countSceneObjectsWithEvents(input.sceneJson);
  const recentEvents = deriveTimelineWorkspaceMetrics(toMetricsInput(input)).recentEventCount;

  if (!objectsTracked && recentEvents === 0) {
    return DEFAULT_TIMELINE_SCENE_COVERAGE;
  }

  return Object.freeze({
    objectsTracked,
    objectsWithEvents,
    recentEvents,
  });
}

export function resolveTimelineSceneAwareness(
  input: TimelineSceneAwarenessInput,
  revision = 0
): TimelineSceneAwarenessSnapshot {
  const selectedObjectId = resolveSelectedObjectId(input);
  const coverage = resolveTimelineSceneCoverage(input);
  const snapshot = Object.freeze({
    selectedObjectId,
    coverage,
    readOnly: true as const,
    revision,
    signature: "",
  });

  return Object.freeze({
    ...snapshot,
    signature: buildTimelineSceneAwarenessSignature(snapshot),
  });
}

export function buildTimelineSceneAwarenessSignature(
  snapshot: Pick<
    TimelineSceneAwarenessSnapshot,
    "selectedObjectId" | "coverage" | "readOnly"
  >
): string {
  return JSON.stringify({
    selectedObjectId: snapshot.selectedObjectId,
    coverage: snapshot.coverage,
    readOnly: snapshot.readOnly,
  });
}

export function buildTimelineSceneCoverageSignature(coverage: TimelineSceneCoverage): string {
  return JSON.stringify(coverage);
}

/** @internal */
export function resolveTimelineSceneAwarenessFromDefaults(
  revision = 0
): TimelineSceneAwarenessSnapshot {
  return Object.freeze({
    ...DEFAULT_TIMELINE_SCENE_AWARENESS,
    revision,
    signature: buildTimelineSceneAwarenessSignature(DEFAULT_TIMELINE_SCENE_AWARENESS),
  });
}
