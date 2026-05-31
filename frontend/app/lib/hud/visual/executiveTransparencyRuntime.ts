import type { ExecutiveTransparencyMode, ExecutiveTransparencySnapshot } from "./sceneNativeHudVisualTypes";
import { logExecutiveTransparency } from "./sceneNativeHudVisualInstrumentation";

export const DEFAULT_EXECUTIVE_TRANSPARENCY_MODE: ExecutiveTransparencyMode = "BALANCED";

let activeTransparencyMode: ExecutiveTransparencyMode = DEFAULT_EXECUTIVE_TRANSPARENCY_MODE;

const TRANSPARENCY_PROFILES: Record<
  ExecutiveTransparencyMode,
  Omit<ExecutiveTransparencySnapshot, "mode">
> = {
  SUBTLE: {
    surfaceOpacity: 0.68,
    backdropOpacity: 0.52,
    blurPx: 6,
    allowSceneVisibility: true,
  },
  BALANCED: {
    surfaceOpacity: 0.78,
    backdropOpacity: 0.64,
    blurPx: 10,
    allowSceneVisibility: true,
  },
  FOCUSED: {
    surfaceOpacity: 0.9,
    backdropOpacity: 0.82,
    blurPx: 14,
    allowSceneVisibility: false,
  },
};

export function setExecutiveTransparencyMode(mode: ExecutiveTransparencyMode): void {
  activeTransparencyMode = mode;
}

export function getExecutiveTransparencyMode(): ExecutiveTransparencyMode {
  return activeTransparencyMode;
}

export function resetExecutiveTransparencyForTests(): void {
  activeTransparencyMode = DEFAULT_EXECUTIVE_TRANSPARENCY_MODE;
}

export function resolveExecutiveTransparency(
  mode: ExecutiveTransparencyMode = activeTransparencyMode,
  options?: { collapsed?: boolean; focused?: boolean }
): ExecutiveTransparencySnapshot {
  const profile = TRANSPARENCY_PROFILES[mode];
  const collapsedBoost = options?.collapsed ? 0.08 : 0;
  const focusedBoost = options?.focused ? 0.06 : 0;

  const snapshot: ExecutiveTransparencySnapshot = {
    mode,
    surfaceOpacity: Math.min(0.96, profile.surfaceOpacity + collapsedBoost + focusedBoost),
    backdropOpacity: Math.min(0.94, profile.backdropOpacity + collapsedBoost),
    blurPx: profile.blurPx + (options?.focused ? 2 : 0),
    allowSceneVisibility: profile.allowSceneVisibility && !options?.focused,
  };

  logExecutiveTransparency(snapshot as unknown as Record<string, unknown>);
  return snapshot;
}
