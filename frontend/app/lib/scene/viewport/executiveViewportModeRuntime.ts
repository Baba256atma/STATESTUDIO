import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import { resolveWorkspaceModeTransition } from "../../workspace/workspaceModeTransitionRuntime";
import type { ExecutiveViewportModeConfig } from "./executiveViewportModeTypes";
import { logE92CameraMode, logE92ModeSwitch } from "./executiveViewportDiagnostics";

const modeConfigCache = new Map<WorkspaceViewMode, ExecutiveViewportModeConfig>();

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
          executiveTiltRadians: 0.68,
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
}
