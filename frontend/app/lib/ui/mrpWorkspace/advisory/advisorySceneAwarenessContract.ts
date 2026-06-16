/**
 * MRP:5A:2 — Advisory scene awareness contract (read-only).
 */

export const MRP_ADVISORY_SCENE_AWARE_TAG = "[MRP_ADVISORY_SCENE_AWARE]" as const;

export const ADVISORY_SCENE_AWARENESS_VERSION = "5A.2.0";

export type AdvisorySceneForbiddenCapability =
  | "modify_scene"
  | "move_objects"
  | "modify_topology"
  | "change_camera"
  | "control_scene";

export type AdvisorySceneWriteAttempt = Readonly<{
  capability: AdvisorySceneForbiddenCapability;
  source?: string | null;
}>;

export type AdvisorySceneWriteGuardResult = Readonly<{
  allowed: false;
  tag: typeof MRP_ADVISORY_SCENE_AWARE_TAG;
  reason: string;
  capability: AdvisorySceneForbiddenCapability;
}>;

export type AdvisorySceneAwarenessSnapshot = Readonly<{
  sceneWritesAllowed: false;
  readOnly: true;
  revision: number;
  signature: string;
}>;

export const DEFAULT_ADVISORY_SCENE_AWARENESS: AdvisorySceneAwarenessSnapshot = Object.freeze({
  sceneWritesAllowed: false,
  readOnly: true,
  revision: 0,
  signature: "advisory:scene:read_only",
});
