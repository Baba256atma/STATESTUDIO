import type React from "react";

import { logExecutiveTypographyGovernance } from "./executiveHarmonizationInstrumentation";

export type ExecutiveTypographyRole =
  | "display"
  | "header"
  | "section"
  | "metric"
  | "body"
  | "caption";

export type ExecutiveTypographySpec = React.CSSProperties & {
  role: ExecutiveTypographyRole;
  maxFontSizePx: number;
};

const TYPOGRAPHY_SYSTEM: Record<ExecutiveTypographyRole, ExecutiveTypographySpec> = {
  display: {
    role: "display",
    maxFontSizePx: 17,
    fontSize: 17,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
  },
  header: {
    role: "header",
    maxFontSizePx: 10,
    fontSize: 10,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  section: {
    role: "section",
    maxFontSizePx: 9,
    fontSize: 9,
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  metric: {
    role: "metric",
    maxFontSizePx: 14,
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
    fontVariantNumeric: "tabular-nums",
  },
  body: {
    role: "body",
    maxFontSizePx: 12,
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  caption: {
    role: "caption",
    maxFontSizePx: 10,
    fontSize: 10,
    fontWeight: 650,
    lineHeight: 1.35,
    letterSpacing: 0,
  },
};

const LEGACY_ROLE_MAP: Record<string, ExecutiveTypographyRole> = {
  objectName: "display",
  objectType: "body",
  sectionTitle: "section",
  value: "metric",
  metadata: "caption",
  label: "caption",
  executiveHeader: "header",
  sectionHeader: "section",
  primaryMetric: "metric",
  contextText: "body",
};

/** E2:49 Part 5 — unified executive typography hierarchy. */
export function resolveExecutiveTypography(
  role: ExecutiveTypographyRole,
  color?: string
): React.CSSProperties {
  const spec = { ...TYPOGRAPHY_SYSTEM[role] };
  delete (spec as Partial<ExecutiveTypographySpec>).role;
  delete (spec as Partial<ExecutiveTypographySpec>).maxFontSizePx;
  const style = { ...spec, ...(color ? { color } : {}) };
  logExecutiveTypographyGovernance("resolved", { role, fontSize: style.fontSize });
  return style;
}

export function resolveExecutiveTypographyFromLegacy(
  legacyRole: string,
  color?: string
): React.CSSProperties {
  const role = LEGACY_ROLE_MAP[legacyRole] ?? "body";
  return resolveExecutiveTypography(role, color);
}

export function auditExecutiveTypographyScale(fontSizePx: number): boolean {
  return fontSizePx <= 17;
}

export function listExecutiveTypographyRoles(): ExecutiveTypographyRole[] {
  return Object.keys(TYPOGRAPHY_SYSTEM) as ExecutiveTypographyRole[];
}
