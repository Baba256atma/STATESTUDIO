"use client";

import { traceHighlightFlow } from "../debug/highlightDebugTrace";

export type ScannerVisualRank =
  | "neutral"
  | "primary"
  | "secondary"
  | "background";

export type ScannerVisualPolicyResult = {
  rank: ScannerVisualRank;
  isHighlighted: boolean;
  isProtectedFromDim: boolean;
  shouldDimAsUnrelated: boolean;
  shouldUseScannerHalo: boolean;
  shouldShowScannerLabel: boolean;
  opacityMode: "normal" | "soft_shadow" | "dominant";
  emissiveMode: "normal" | "quiet" | "strong";
  colorMode: "base" | "scanner_primary" | "scanner_secondary" | "shadowed";
  scaleMultiplier: number;
  opacityMultiplier: number;
  emissiveBoost: number;
  isPrimaryTarget: boolean;
  isSecondaryTarget: boolean;
};

export type ResolveScannerVisualPriorityInput = {
  scannerSceneActive: boolean;
  scannerPrimaryTargetId?: string | null;
  scannerTargetIds?: string[];
  currentObjectIds: string[];
  isFocused: boolean;
  isSelected: boolean;
  isPinned: boolean;
  dimUnrelatedObjects: boolean;
  scannerFragilityScore: number;
  scannerHighlighted: boolean;
  scannerFocused: boolean;
};

function matchesAnyId(candidate: string | null | undefined, ids: string[]): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) return false;
  return ids.includes(candidate);
}

export function resolveScannerVisualPriority(
  input: ResolveScannerVisualPriorityInput
): ScannerVisualPolicyResult {
  const targetIds = Array.isArray(input.scannerTargetIds) ? input.scannerTargetIds.map(String) : [];
  const currentIds = input.currentObjectIds.filter(Boolean);
  const isInTargetSet = currentIds.some((id) => targetIds.includes(id));
  const hasExplicitPrimary = matchesAnyId(input.scannerPrimaryTargetId ?? null, targetIds);
  const isExplicitPrimary = matchesAnyId(input.scannerPrimaryTargetId ?? null, currentIds);
  const shouldPromoteSingleton = !hasExplicitPrimary && targetIds.length === 1 && isInTargetSet;
  const shouldPromoteFocusedTarget = !hasExplicitPrimary && isInTargetSet && input.scannerFocused;
  const isPrimaryTarget = isExplicitPrimary || shouldPromoteSingleton || shouldPromoteFocusedTarget;
  const isSecondaryTarget = isInTargetSet && !isPrimaryTarget;

  if (!input.scannerSceneActive || targetIds.length === 0) {
    return {
      rank: "neutral",
      isHighlighted: input.scannerHighlighted,
      isProtectedFromDim: input.isFocused || input.isSelected || input.isPinned,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: input.scannerHighlighted && input.scannerFragilityScore > 0.1,
      shouldShowScannerLabel:
        input.scannerFocused || ((input.isFocused || input.isSelected) && input.scannerHighlighted),
      opacityMode: "normal",
      emissiveMode: "normal",
      colorMode: "base",
      scaleMultiplier: 1,
      opacityMultiplier: 1,
      emissiveBoost: 0,
      isPrimaryTarget: false,
      isSecondaryTarget: false,
    };
  }

  if (isPrimaryTarget) {
    return {
      rank: "primary",
      isHighlighted: true,
      isProtectedFromDim: true,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: input.scannerFragilityScore > 0.1,
      shouldShowScannerLabel: true,
      opacityMode: "dominant",
      emissiveMode: "strong",
      colorMode: "scanner_primary",
      scaleMultiplier: 1.06,
      opacityMultiplier: 1,
      emissiveBoost: 2.3,
      isPrimaryTarget: true,
      isSecondaryTarget: false,
    };
  }

  if (isSecondaryTarget) {
    return {
      rank: "secondary",
      isHighlighted: true,
      isProtectedFromDim: true,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: false,
      shouldShowScannerLabel: input.scannerFocused,
      opacityMode: "normal",
      emissiveMode: "normal",
      colorMode: "scanner_secondary",
      scaleMultiplier: 1.02,
      opacityMultiplier: 0.96,
      emissiveBoost: 0.35,
      isPrimaryTarget: false,
      isSecondaryTarget: true,
    };
  }

  return {
    rank: "background",
    isHighlighted: false,
    isProtectedFromDim: input.isSelected,
    shouldDimAsUnrelated: input.dimUnrelatedObjects,
    shouldUseScannerHalo: false,
    shouldShowScannerLabel: false,
    opacityMode: "soft_shadow",
    emissiveMode: "quiet",
    colorMode: "shadowed",
    scaleMultiplier: 1,
    opacityMultiplier: 0.58,
    emissiveBoost: 0,
    isPrimaryTarget: false,
    isSecondaryTarget: false,
  };
}

export function traceScannerVisualPriorityPolicy(
  objectId: string,
  input: ResolveScannerVisualPriorityInput,
  result: ScannerVisualPolicyResult
): void {
  if (process.env.NODE_ENV === "production") return;
  traceHighlightFlow("scene_object_state", {
    objectId,
    scannerSceneActive: input.scannerSceneActive,
    scannerPrimaryTargetId: input.scannerPrimaryTargetId ?? null,
    isFocused: input.isFocused,
    isSelected: input.isSelected,
    isPinned: input.isPinned,
    rank: result.rank,
    opacityMode: result.opacityMode,
    colorMode: result.colorMode,
  });
}
