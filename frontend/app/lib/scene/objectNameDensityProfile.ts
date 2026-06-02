/** E2:58 / E2:66 — Density-aware object name visibility (10 / 25 / 50 / 100 objects). */

import {
  traceObjectLabelCached,
  traceObjectLabelComputed,
} from "./objectLabelDiagnosticGuard";
import { buildObjectLabelDensitySignatureForCount } from "./objectLabelSignature";
import { getObjectLabelCached, setObjectLabelCached } from "./objectLabelRuntimeCache";

export type ObjectNameDensityTier = "sparse" | "normal" | "dense" | "critical";

export type ObjectNameDensityProfile = {
  tier: ObjectNameDensityTier;
  showAllNames: boolean;
  showSelectedOnly: boolean;
  minOpacity: number;
  selectedOpacity: number;
  fontSizePx: number;
  declutterSpacing: number;
};

export function resolveObjectNameDensityTier(objectCount: number): ObjectNameDensityTier {
  if (objectCount <= 10) return "sparse";
  if (objectCount <= 25) return "normal";
  if (objectCount <= 50) return "dense";
  return "critical";
}

function computeObjectNameDensityProfile(objectCount: number): ObjectNameDensityProfile {
  const tier = resolveObjectNameDensityTier(objectCount);

  if (tier === "sparse") {
    return {
      tier,
      showAllNames: true,
      showSelectedOnly: false,
      minOpacity: 0.92,
      selectedOpacity: 1,
      fontSizePx: 13,
      declutterSpacing: 0,
    };
  }
  if (tier === "normal") {
    return {
      tier,
      showAllNames: true,
      showSelectedOnly: false,
      minOpacity: 0.84,
      selectedOpacity: 1,
      fontSizePx: 12,
      declutterSpacing: 0.02,
    };
  }
  if (tier === "dense") {
    return {
      tier,
      showAllNames: true,
      showSelectedOnly: false,
      minOpacity: 0.62,
      selectedOpacity: 0.98,
      fontSizePx: 9,
      declutterSpacing: 0.04,
    };
  }
  return {
    tier,
    showAllNames: false,
    showSelectedOnly: true,
    minOpacity: 0.48,
    selectedOpacity: 1,
    fontSizePx: 9,
    declutterSpacing: 0.06,
  };
}

export function resolveObjectNameDensityProfile(objectCount: number): ObjectNameDensityProfile {
  const signature = buildObjectLabelDensitySignatureForCount(objectCount);
  const cached = getObjectLabelCached<ObjectNameDensityProfile>("density", signature);
  if (cached) {
    traceObjectLabelCached("density", signature);
    return cached;
  }

  const profile = computeObjectNameDensityProfile(objectCount);
  setObjectLabelCached("density", signature, profile);
  traceObjectLabelComputed("density", signature, {
    tier: profile.tier,
    objectCount,
    showAllNames: profile.showAllNames,
    showSelectedOnly: profile.showSelectedOnly,
  });
  return profile;
}

export function shouldRenderExecutiveObjectName(input: {
  objectCount?: number;
  profile?: ObjectNameDensityProfile;
  selected: boolean;
  focused: boolean;
  index: number;
}): boolean {
  const profile =
    input.profile ?? resolveObjectNameDensityProfile(input.objectCount ?? 0);
  if (profile.showAllNames) return true;
  if (profile.showSelectedOnly) return input.selected || input.focused;
  return input.index % 2 === 0;
}

export function resolveObjectNameOpacity(input: {
  objectCount?: number;
  profile?: ObjectNameDensityProfile;
  selected: boolean;
  focused: boolean;
}): number {
  const profile =
    input.profile ?? resolveObjectNameDensityProfile(input.objectCount ?? 0);
  if (input.selected || input.focused) return profile.selectedOpacity;
  return profile.minOpacity;
}

export function resetObjectNameDensityLogsForTests(): void {
  /* retained for test compatibility — cache/diagnostics reset separately */
}
