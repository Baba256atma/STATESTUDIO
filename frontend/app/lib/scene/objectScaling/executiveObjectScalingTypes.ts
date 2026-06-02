import type { ExecutiveCameraPresetId } from "../camera/executiveCameraPresetRegistry";

/** E2:90 — Presentation scale tiers for executive readability. */
export type ExecutivePresentationScaleTier = "tiny" | "small" | "medium" | "large" | "critical";

/** E2:90 — Visual importance tiers for hierarchy scaling. */
export type ExecutiveObjectImportanceTier = "critical" | "important" | "supporting" | "minor";

export type ExecutiveObjectScaleInput = {
  rawScale?: number | null;
  objectCount?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  cameraPreset?: ExecutiveCameraPresetId | null;
  importance?: ExecutiveObjectImportanceTier;
  selected?: boolean;
  focused?: boolean;
  hovered?: boolean;
  dimmed?: boolean;
  objectId?: string | null;
};

export type ExecutiveObjectScaleResult = {
  scale: number;
  presentationTier: ExecutivePresentationScaleTier;
  importance: ExecutiveObjectImportanceTier;
  signature: string;
};

export type ExecutiveLabelScaleInput = {
  objectCount?: number;
  importance?: ExecutiveObjectImportanceTier;
  selected?: boolean;
  focused?: boolean;
  hovered?: boolean;
  dimmed?: boolean;
  cameraPreset?: ExecutiveCameraPresetId | null;
  viewportWidth?: number;
  viewportHeight?: number;
  baseFontSizePx?: number;
  index?: number;
};

export type ExecutiveLabelScaleResult = {
  fontSizePx: number;
  opacity: number;
  priority: number;
  fadeWhenCrowded: boolean;
  signature: string;
};

export type ExecutiveDensityCompressionInput = {
  objectCount?: number;
  relationshipCount?: number;
  boundsSpan?: number;
};

export type ExecutiveDensityCompressionResult = {
  cameraDistanceMultiplier: number;
  layoutSpacingMultiplier: number;
  fitPaddingMultiplier: number;
  emptySpaceReduction: number;
  signature: string;
};
