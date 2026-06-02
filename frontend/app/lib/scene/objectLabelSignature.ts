import type { ObjectLabelPlacementInput } from "./objectLabelPlacementRuntime";
import type { ObjectNameDensityProfile } from "./objectNameDensityProfile";

export type ObjectLabelContextSignatureInput = {
  objectCount: number;
  showAllNames?: boolean;
  showSelectedOnly?: boolean;
  selectedObjectId?: string | null;
  viewMode?: string | null;
  cameraMode?: string | null;
};

/** Stable signature for density / visibility resolution. */
export function buildObjectLabelDensitySignature(input: ObjectLabelContextSignatureInput): string {
  return JSON.stringify({
    objectCount: input.objectCount,
    showAllNames: input.showAllNames ?? null,
    showSelectedOnly: input.showSelectedOnly ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    viewMode: input.viewMode ?? null,
    cameraMode: input.cameraMode ?? null,
  });
}

/** Stable signature keyed by object count (density tier derives from count). */
export function buildObjectLabelDensitySignatureForCount(objectCount: number): string {
  return buildObjectLabelDensitySignature({ objectCount });
}

export function buildObjectLabelPlacementSignature(input: ObjectLabelPlacementInput): string {
  return JSON.stringify({
    baseScaleY: Number(input.baseScaleY.toFixed(4)),
    objectScale: Number(input.objectScale.toFixed(4)),
    offsetYMultiplier: input.profile.offsetYMultiplier,
    offsetYBase: input.profile.offsetYBase,
    index: input.index,
    objectCount: input.objectCount,
    neighborOffset: input.neighborOffset ?? null,
    relationshipDensity: input.relationshipDensity ?? null,
  });
}

export function buildObjectLabelVisibilitySignature(input: {
  profile: ObjectNameDensityProfile;
  selected: boolean;
  focused: boolean;
  index: number;
}): string {
  return JSON.stringify({
    tier: input.profile.tier,
    showAllNames: input.profile.showAllNames,
    showSelectedOnly: input.profile.showSelectedOnly,
    selected: input.selected,
    focused: input.focused,
    index: input.index,
  });
}

export function buildObjectLabelOpacitySignature(input: {
  profile: ObjectNameDensityProfile;
  selected: boolean;
  focused: boolean;
}): string {
  return JSON.stringify({
    tier: input.profile.tier,
    minOpacity: input.profile.minOpacity,
    selectedOpacity: input.profile.selectedOpacity,
    selected: input.selected,
    focused: input.focused,
  });
}
