import type React from "react";

import { resolveExecutiveTypographyFromLegacy } from "../workspace/harmonization";

export const executiveTypography = {
  objectName: resolveExecutiveTypographyFromLegacy("objectName"),
  objectType: resolveExecutiveTypographyFromLegacy("objectType"),
  sectionTitle: resolveExecutiveTypographyFromLegacy("sectionTitle"),
  value: resolveExecutiveTypographyFromLegacy("value"),
  metadata: resolveExecutiveTypographyFromLegacy("metadata"),
  label: resolveExecutiveTypographyFromLegacy("label"),
} satisfies Record<string, React.CSSProperties>;

export type ExecutiveTypographyToken = keyof typeof executiveTypography;
