import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import { resolveWorkspaceModeTransition } from "../../workspace/workspaceModeTransitionRuntime";
import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";
import type { ExecutiveViewportCameraFrame } from "./executiveViewportModeTypes";
import type { ExecutiveViewportModeConfig } from "./executiveViewportModeTypes";
import { logE92CameraMode, logE92ModeSwitch } from "./executiveViewportDiagnostics";

const modeConfigCache = new Map<WorkspaceViewMode, ExecutiveViewportModeConfig>();
const logged2DRestoreSignatures = new Set<string>();

export function buildExecutive2DRestoreSignature(input: {
  sceneSignature: string;
  layoutSignature?: string | null;
}): string {
  return `2d_restore:${input.sceneSignature}:${input.layoutSignature ?? "none"}`;
}

export function logExecutive2DRestoreOnce(input: {
  sceneSignature: string;
  layoutSignature?: string | null;
  restoredFrame: ExecutiveViewportCameraFrame;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = buildExecutive2DRestoreSignature({
    sceneSignature: input.sceneSignature,
    layoutSignature: input.layoutSignature,
  });
  if (logged2DRestoreSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`executive-2d-restore:${signature}`)) return;
  logged2DRestoreSignatures.add(signature);
  console.info("[Nexora][ModeSwitch2DRestore]", {
    from: "3D",
    to: "2D",
    sceneSignature: input.sceneSignature,
    layoutSignature: input.layoutSignature ?? null,
    restoredFrame: {
      position: input.restoredFrame.position,
      lookAt: input.restoredFrame.lookAt,
      zoom: input.restoredFrame.zoom,
      orthoSize: input.restoredFrame.orthoSize,
      operationalCenter: input.restoredFrame.operationalCenter,
    },
    reason: "canonical_2d_restore",
  });
}

export function resetExecutive2DRestoreLogsForTests(): void {
  logged2DRestoreSignatures.clear();
}

export function resolveExecutiveViewportModeConfig(
  viewMode: WorkspaceViewMode
): ExecutiveViewportModeConfig {
  const cached = modeConfigCache.get(viewMode);
  if (cached) return cached;

  const transition = resolveWorkspaceModeTransition({
    from: viewMode === "2D" ? "3D" : "2D",
    to: viewMode,
  });

  const config: ExecutiveViewportModeConfig =
    viewMode === "2D"
      ? {
          viewMode,
          projection: "orthographic",
          framingPreset: "VIEW_2D",
          navigationPreset: "VIEW_2D",
          transitionDurationMs: transition.durationMs,
          enableOrbitRotate: false,
          enablePan: true,
          enableZoom: true,
          zoomToCursor: true,
          screenSpacePanning: true,
          executiveTiltRadians: null,
        }
      : {
          viewMode,
          projection: "perspective",
          framingPreset: "VIEW_3D",
          navigationPreset: "VIEW_3D",
          transitionDurationMs: transition.durationMs,
          enableOrbitRotate: true,
          enablePan: true,
          enableZoom: true,
          zoomToCursor: true,
          screenSpacePanning: false,
          executiveTiltRadians: 0.58,
        };

  modeConfigCache.set(viewMode, config);
  logE92CameraMode(`${viewMode}:${config.projection}`, {
    viewMode,
    projection: config.projection,
    framingPreset: config.framingPreset,
    transitionDurationMs: config.transitionDurationMs,
  });

  return config;
}

export function buildExecutiveViewportModeSwitchSignature(input: {
  from: WorkspaceViewMode;
  to: WorkspaceViewMode;
  operationalCenter?: [number, number, number] | null;
}): string {
  const center = input.operationalCenter ?? [0, 0, 0];
  return [
    input.from,
    input.to,
    center.map((value) => Math.round(value * 100) / 100).join(","),
  ].join("|");
}

export function logExecutiveViewportModeSwitch(input: {
  from: WorkspaceViewMode;
  to: WorkspaceViewMode;
  source: string;
  operationalCenter?: [number, number, number] | null;
  preserveSelection?: boolean;
}): void {
  const signature = buildExecutiveViewportModeSwitchSignature(input);
  logE92ModeSwitch(signature, {
    from: input.from,
    to: input.to,
    source: input.source,
    operationalCenter: input.operationalCenter ?? null,
    preserveSelection: input.preserveSelection ?? true,
    config: resolveExecutiveViewportModeConfig(input.to),
  });
}

export function mapWorkspaceViewModeToFramingPreset(
  viewMode: WorkspaceViewMode
): "VIEW_2D" | "VIEW_3D" {
  return viewMode === "2D" ? "VIEW_2D" : "VIEW_3D";
}

export function resetExecutiveViewportModeRuntimeForTests(): void {
  modeConfigCache.clear();
  resetExecutive2DRestoreLogsForTests();
}
