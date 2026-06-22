import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import { shouldUseBillboardLabels } from "./workspaceLabelRenderingRuntime";
import { devDiagnosticLog } from "../runtime/diagnosticSwitch";

export const OBJECT_CAPTION_BILLBOARD_TAGS = Object.freeze([
  "NWB82_FIX",
  "OBJECT_LABEL_BILLBOARD_ENFORCED",
  "CAMERA_FACING_LABELS_ACTIVE",
  "SCENE_READABILITY_CERTIFIED",
  "NW_B82_FIX_COMPLETE",
]);

export type ObjectCaptionBillboardState = {
  billboardEnabled: boolean;
  useSpriteTransform: boolean;
};

const emittedBillboardKeys = new Set<string>();
let lastCameraFacingSignature = "";
let lastCameraFacingLogMs = 0;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function resolveObjectCaptionBillboardState(
  viewMode: WorkspaceViewMode
): ObjectCaptionBillboardState {
  const billboardEnabled = shouldUseBillboardLabels(viewMode);
  return {
    billboardEnabled,
    useSpriteTransform: false,
  };
}

function logBillboardLabel(
  label: string,
  payload?: Record<string, unknown>
): void {
  devDiagnosticLog("billboardLabel", `[BillboardLabel] ${label}`, payload);
}

export function emitBillboardLabelMounted(objectId: string, viewMode: WorkspaceViewMode): void {
  if (!isDev()) return;
  const key = `mounted:${objectId}:${viewMode}`;
  if (emittedBillboardKeys.has(key)) return;
  emittedBillboardKeys.add(key);
  logBillboardLabel("Label Mounted", { objectId, viewMode, tags: OBJECT_CAPTION_BILLBOARD_TAGS });
}

export function emitBillboardLabelCameraFacingEnabled(
  objectId: string,
  viewMode: WorkspaceViewMode
): void {
  if (!isDev()) return;
  const key = `camera-facing:${objectId}:${viewMode}`;
  if (emittedBillboardKeys.has(key)) return;
  emittedBillboardKeys.add(key);
  logBillboardLabel("Camera Facing Enabled", { objectId, viewMode, tags: OBJECT_CAPTION_BILLBOARD_TAGS });
}

export function emitBillboardLabelActive(objectId: string, viewMode: WorkspaceViewMode): void {
  if (!isDev()) return;
  const key = `active:${objectId}:${viewMode}`;
  if (emittedBillboardKeys.has(key)) return;
  emittedBillboardKeys.add(key);
  logBillboardLabel("Billboard Active", { objectId, viewMode, tags: OBJECT_CAPTION_BILLBOARD_TAGS });
}

export function trackBillboardLabelOrientationUpdated(
  camera: { position: { x: number; y: number; z: number }; quaternion: { w: number } },
  objectId: string
): void {
  if (!isDev()) return;
  const signature = [
    camera.position.x.toFixed(2),
    camera.position.y.toFixed(2),
    camera.position.z.toFixed(2),
    camera.quaternion.w.toFixed(3),
  ].join(":");
  if (signature === lastCameraFacingSignature) return;
  lastCameraFacingSignature = signature;

  const now = Date.now();
  if (now - lastCameraFacingLogMs < 500) return;
  lastCameraFacingLogMs = now;

  logBillboardLabel("Orientation Updated", { objectId, tags: OBJECT_CAPTION_BILLBOARD_TAGS });
}

/** @deprecated NW-B:8-2 diagnostic alias */
export function emitObjectCaptionBillboardEnabled(objectId: string, viewMode: WorkspaceViewMode): void {
  emitBillboardLabelMounted(objectId, viewMode);
  if (resolveObjectCaptionBillboardState(viewMode).billboardEnabled) {
    emitBillboardLabelCameraFacingEnabled(objectId, viewMode);
    emitBillboardLabelActive(objectId, viewMode);
  }
}

/** @deprecated NW-B:8-2 diagnostic alias */
export function trackObjectCaptionCameraFacingUpdated(
  camera: { position: { x: number; y: number; z: number }; quaternion: { w: number } },
  objectId: string
): void {
  trackBillboardLabelOrientationUpdated(camera, objectId);
}

export function resetObjectCaptionBillboardRuntimeForTests(): void {
  emittedBillboardKeys.clear();
  lastCameraFacingSignature = "";
  lastCameraFacingLogMs = 0;
}
