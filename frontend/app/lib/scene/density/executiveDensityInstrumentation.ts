import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";

const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  if (shouldSuppressIdleDebugLog(`${event}:${key}`)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

function roundedScaleBucket(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value * 100) / 100;
}

export function logExecutiveDensityResolved(payload: Record<string, unknown>): void {
  devLogOnce(`density-${payload.objectCount ?? 0}-${payload.sceneDensity ?? "unknown"}`, "[Nexora][Density]", payload);
}

export function logExecutiveObjectScaleApplied(payload: Record<string, unknown>): void {
  const roundedInputScale = roundedScaleBucket(payload.inputScale);
  const roundedNormalizedScale = roundedScaleBucket(payload.normalizedScale);
  const roundedPayload = {
    ...payload,
    inputScale: roundedInputScale ?? payload.inputScale,
    normalizedScale: roundedNormalizedScale ?? payload.normalizedScale,
  };
  const signature = [
    payload.objectId ?? "scene",
    payload.selected === true ? 1 : 0,
    payload.objectCount ?? "unknown",
    roundedInputScale ?? "none",
    roundedNormalizedScale ?? "none",
  ].join(":");
  devLogOnce(`object-scale-${signature}`, "[Nexora][ObjectScale]", roundedPayload);
}

export function logExecutiveCameraStability(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][CameraStability]", payload);
}

export function logStrategicLayoutApplied(payload: Record<string, unknown>): void {
  devLogOnce(`layout-${payload.mode ?? "unknown"}-${payload.objectCount ?? 0}`, "[Nexora][LayoutEngine]", payload);
}

export function logExecutiveSpacingResolved(payload: Record<string, unknown>): void {
  devLogOnce(`spacing-${payload.minDistance ?? 0}-${payload.objectCount ?? 0}`, "[Nexora][Spacing]", payload);
}

export function logAdaptiveSceneLabelMode(payload: Record<string, unknown>): void {
  devLogOnce(`label-${payload.mode ?? "unknown"}-${payload.objectCount ?? 0}`, "[Nexora][AdaptiveLabel]", payload);
}

export function logExecutiveFocusWorkspace(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][FocusMode]", payload);
}

export function logWorkspaceScaleMetrics(payload: Record<string, unknown>): void {
  devLogOnce(`metrics-${payload.totalObjects ?? 0}-${payload.densityScore ?? 0}`, "[Nexora][WorkspaceScaleMetrics]", payload);
}

export function resetExecutiveDensityInstrumentationForTests(): void {
  loggedKeys.clear();
}
