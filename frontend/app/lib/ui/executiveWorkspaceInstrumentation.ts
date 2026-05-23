import type { ExecutiveWorkspaceLayoutMetrics } from "./executiveWorkspaceLayout";
import { buildExecutiveWorkspaceLayoutSignature } from "./executiveWorkspaceLayout";

const loggedKeys = new Set<string>();

function devLog(key: string, event: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload);
}

export function logExecutiveWorkspaceLayoutInitialized(metrics: ExecutiveWorkspaceLayoutMetrics): void {
  devLog("workspace-layout-init", "[Nexora][E2][WorkspaceLayoutInitialized]", {
    breakpoint: metrics.breakpoint,
    viewportWidth: metrics.viewportWidth,
    leftDockWidthPx: metrics.leftDockWidthPx,
    rightDockWidthPx: metrics.rightDockWidthPx,
    scenePaddingPx: metrics.scenePaddingPx,
  });
}

export function logExecutiveSceneZoneReady(params: {
  objectCount: number;
  viewportWidth: number;
}): void {
  devLog("scene-zone-ready", "[Nexora][E2][SceneZoneReady]", params);
}

export function logExecutiveResponsiveWorkspaceApplied(metrics: ExecutiveWorkspaceLayoutMetrics): void {
  const signature = buildExecutiveWorkspaceLayoutSignature(metrics);
  devLog(`responsive-${signature}`, "[Nexora][E2][ResponsiveWorkspaceApplied]", {
    breakpoint: metrics.breakpoint,
    viewportWidth: metrics.viewportWidth,
    leftDockWidthPx: metrics.leftDockWidthPx,
    rightDockWidthPx: metrics.rightDockWidthPx,
  });
}

/** Test-only reset for dedupe keys. */
export function resetExecutiveWorkspaceInstrumentationForTests(): void {
  loggedKeys.clear();
}
