/** E2:58 — Executive object name rendering profile (object → name below). */

import type React from "react";

export type ObjectNamePlacement = "below";

export type ObjectNameRenderingProfile = {
  placement: ObjectNamePlacement;
  offsetYMultiplier: number;
  offsetYBase: number;
  fontSizePx: number;
  fontWeight: number;
  letterSpacing: string;
  maxWidthPx: number;
  singleLine: boolean;
};

export const DEFAULT_OBJECT_NAME_PROFILE: ObjectNameRenderingProfile = Object.freeze({
  placement: "below",
  offsetYMultiplier: 0.6,
  offsetYBase: 0.28,
  fontSizePx: 10,
  fontWeight: 700,
  letterSpacing: "0.02em",
  maxWidthPx: 128,
  singleLine: true,
});

export function resolveObjectNameRenderingProfile(input?: {
  selected?: boolean;
  fontSizePx?: number;
}): ObjectNameRenderingProfile {
  return {
    ...DEFAULT_OBJECT_NAME_PROFILE,
    fontSizePx: input?.fontSizePx ?? DEFAULT_OBJECT_NAME_PROFILE.fontSizePx,
    fontWeight: input?.selected ? 800 : DEFAULT_OBJECT_NAME_PROFILE.fontWeight,
  };
}

export function executiveObjectNameLabelStyle(input: {
  profile: ObjectNameRenderingProfile;
  theme: "day" | "night";
  opacity: number;
  selected?: boolean;
}): React.CSSProperties {
  const { profile, theme, opacity, selected } = input;
  return {
    fontSize: profile.fontSizePx,
    fontWeight: profile.fontWeight,
    letterSpacing: profile.letterSpacing,
    lineHeight: 1.2,
    color: theme === "day" ? "rgba(15, 23, 42, 0.92)" : "rgba(241, 245, 249, 0.94)",
    textShadow:
      theme === "day"
        ? "0 1px 2px rgba(255,255,255,0.65)"
        : "0 1px 3px rgba(2, 6, 23, 0.85)",
    opacity,
    maxWidth: profile.maxWidthPx,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: profile.singleLine ? "nowrap" : "normal",
    textAlign: "center",
    userSelect: "none",
    pointerEvents: "none",
    padding: selected ? "1px 4px" : 0,
    borderRadius: selected ? 4 : 0,
    background: selected
      ? theme === "day"
        ? "rgba(255,255,255,0.55)"
        : "rgba(15, 23, 42, 0.42)"
      : "transparent",
  };
}

/** @deprecated E2:66 — use objectLabelDiagnosticGuard trace helpers instead. */
export function logObjectLabel(_payload: Record<string, unknown>): void {
  /* no-op: render-path logging removed in E2:66 */
}
