/**
 * MRP:4D:5 — Timeline workspace scene awareness contract.
 *
 * Read-only boundary for Timeline ↔ Scene synchronization.
 * No scene writes, topology changes, or camera control.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";

export const MRP_TIMELINE_SCENE_AWARE_TAG = "[MRP_TIMELINE_SCENE_AWARE]" as const;

export const TIMELINE_SCENE_AWARENESS_VERSION = "4D.5.0";

/** Scene/workspace fields the Timeline workspace may read — and only read. */
export type TimelineSceneReadField =
  | "selectedObject"
  | "sceneObjects"
  | "workspaceDiagnostics"
  | "eventHistory";

/** Scene capabilities explicitly forbidden for Timeline workspace. */
export type TimelineSceneForbiddenCapability =
  | "move_objects"
  | "modify_topology"
  | "modify_scene"
  | "change_camera"
  | "control_scene";

export type TimelineSceneCoverage = Readonly<{
  objectsTracked: number;
  objectsWithEvents: number;
  recentEvents: number;
}>;

export type TimelineSceneAwarenessSnapshot = Readonly<{
  selectedObjectId: string | null;
  coverage: TimelineSceneCoverage;
  readOnly: true;
  revision: number;
  signature: string;
}>;

export type TimelineSceneAwarenessInput = Readonly<{
  selectedObjectId?: string | null;
  routeObjectId?: string | null;
  sceneJson?: SceneJson | null;
  navigationHistoryEntries?: readonly WorkspaceNavigationHistoryEntry[] | null;
}>;

export type TimelineSceneWriteAttempt = Readonly<{
  capability: TimelineSceneForbiddenCapability;
  source?: string | null;
}>;

export type TimelineSceneWriteGuardResult = Readonly<{
  allowed: false;
  reason: string;
  capability: TimelineSceneForbiddenCapability;
  tag: typeof MRP_TIMELINE_SCENE_AWARE_TAG;
}>;

export const TIMELINE_SCENE_READ_FIELDS: readonly TimelineSceneReadField[] = Object.freeze([
  "selectedObject",
  "sceneObjects",
  "workspaceDiagnostics",
  "eventHistory",
]);

export const TIMELINE_SCENE_FORBIDDEN_CAPABILITIES: readonly TimelineSceneForbiddenCapability[] =
  Object.freeze([
    "move_objects",
    "modify_topology",
    "modify_scene",
    "change_camera",
    "control_scene",
  ]);

export const TIMELINE_SCENE_COVERAGE_LABELS = Object.freeze({
  objectsTracked: "Objects Tracked",
  objectsWithEvents: "Objects With Events",
  recentEvents: "Recent Events",
});

export const DEFAULT_TIMELINE_SCENE_COVERAGE: TimelineSceneCoverage = Object.freeze({
  objectsTracked: 0,
  objectsWithEvents: 0,
  recentEvents: 0,
});

export const DEFAULT_TIMELINE_SCENE_AWARENESS: TimelineSceneAwarenessSnapshot = Object.freeze({
  selectedObjectId: null,
  coverage: DEFAULT_TIMELINE_SCENE_COVERAGE,
  readOnly: true,
  revision: 0,
  signature: "timeline:scene:defaults",
});
