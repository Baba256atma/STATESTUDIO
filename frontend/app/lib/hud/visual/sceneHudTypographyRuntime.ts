import type React from "react";

import { auditedResolve } from "../../audit/auditedResolve";
import type { SceneNativeHudTypographyRole } from "./sceneNativeHudVisualTypes";
import { logSceneHudTypographyAudit } from "./sceneNativeHudVisualInstrumentation";

const TYPOGRAPHY_HIERARCHY: Record<SceneNativeHudTypographyRole, React.CSSProperties> = {
  executiveHeader: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1.25,
  },
  primaryMetric: {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "-0.01em",
    lineHeight: 1.15,
    fontVariantNumeric: "tabular-nums",
  },
  contextText: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
};

export function resolveSceneHudTypography(
  role: SceneNativeHudTypographyRole,
  color?: string
): React.CSSProperties {
  return auditedResolve({
    auditName: "TypographyAudit",
    inputs: { role, color: color ?? null },
    compute: () => ({ ...TYPOGRAPHY_HIERARCHY[role], ...(color ? { color } : {}) }),
    formatLogPayload: (style) => ({
      role,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    }),
    log: logSceneHudTypographyAudit,
  });
}

export function auditSceneHudTypography(surface: string): SceneNativeHudTypographyRole[] {
  const roles: SceneNativeHudTypographyRole[] = [
    "executiveHeader",
    "sectionHeader",
    "primaryMetric",
    "contextText",
  ];

  auditedResolve({
    auditName: "TypographyAudit",
    inputs: { surface, mode: "surface_audit" },
    compute: () => roles,
    formatLogPayload: () => ({ surface, roles }),
    log: logSceneHudTypographyAudit,
  });

  return roles;
}
