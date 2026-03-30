"use client";

import { traceHighlightFlow } from "../debug/highlightDebugTrace";
import type { ScannerCausalRole } from "./scannerCausalityPolicy";

export type ScannerVisualRank =
  | "neutral"
  | "primary"
  | "secondary"
  | "background";

export type ScannerVisualPolicyResult = {
  rank: ScannerVisualRank;
  causalRole: ScannerCausalRole;
  isHighlighted: boolean;
  isProtectedFromDim: boolean;
  shouldDimAsUnrelated: boolean;
  shouldUseScannerHalo: boolean;
  shouldShowScannerLabel: boolean;
  opacityMode: "normal" | "soft_shadow" | "dominant";
  emissiveMode: "normal" | "quiet" | "strong";
  colorMode: "base" | "scanner_primary" | "scanner_affected" | "scanner_related" | "shadowed";
  labelTitle: string | null;
  scaleMultiplier: number;
  opacityMultiplier: number;
  emissiveBoost: number;
  isPrimaryTarget: boolean;
  isSecondaryTarget: boolean;
};

export type ResolveScannerVisualPriorityInput = {
  scannerSceneActive: boolean;
  causalRole: ScannerCausalRole;
  isFocused: boolean;
  isSelected: boolean;
  isPinned: boolean;
  dimUnrelatedObjects: boolean;
  scannerFragilityScore: number;
  scannerHighlighted: boolean;
  scannerFocused: boolean;
};

export function resolveScannerVisualPriority(
  input: ResolveScannerVisualPriorityInput
): ScannerVisualPolicyResult {
  if (!input.scannerSceneActive || input.causalRole === "neutral") {
    return {
      rank: "neutral",
      causalRole: "neutral",
      isHighlighted: input.scannerHighlighted,
      isProtectedFromDim: input.isFocused || input.isSelected || input.isPinned,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: input.scannerHighlighted && input.scannerFragilityScore > 0.1,
      shouldShowScannerLabel:
        input.scannerFocused || ((input.isFocused || input.isSelected) && input.scannerHighlighted),
      opacityMode: "normal",
      emissiveMode: "normal",
      colorMode: "base",
      labelTitle: input.scannerFocused ? "Scanner Focus" : "Fragility Signal",
      scaleMultiplier: 1,
      opacityMultiplier: 1,
      emissiveBoost: 0,
      isPrimaryTarget: false,
      isSecondaryTarget: false,
    };
  }

  if (input.causalRole === "primary_cause") {
    return {
      rank: "primary",
      causalRole: input.causalRole,
      isHighlighted: true,
      isProtectedFromDim: true,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: input.scannerFragilityScore > 0.1,
      shouldShowScannerLabel: true,
      opacityMode: "dominant",
      emissiveMode: "strong",
      colorMode: "scanner_primary",
      labelTitle: "Primary Risk Node",
      scaleMultiplier: 1.06,
      opacityMultiplier: 1,
      emissiveBoost: 2.45,
      isPrimaryTarget: true,
      isSecondaryTarget: false,
    };
  }

  if (input.causalRole === "affected") {
    return {
      rank: "secondary",
      causalRole: input.causalRole,
      isHighlighted: true,
      isProtectedFromDim: true,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: false,
      shouldShowScannerLabel: true,
      opacityMode: "normal",
      emissiveMode: "normal",
      colorMode: "scanner_affected",
      labelTitle: "Affected Node",
      scaleMultiplier: 1.03,
      opacityMultiplier: 0.94,
      emissiveBoost: 0.55,
      isPrimaryTarget: false,
      isSecondaryTarget: true,
    };
  }

  if (input.causalRole === "related_context") {
    return {
      rank: "secondary",
      causalRole: input.causalRole,
      isHighlighted: true,
      isProtectedFromDim: true,
      shouldDimAsUnrelated: false,
      shouldUseScannerHalo: false,
      shouldShowScannerLabel: input.scannerFocused,
      opacityMode: "normal",
      emissiveMode: "normal",
      colorMode: "scanner_related",
      labelTitle: "Related Context",
      scaleMultiplier: 1.01,
      opacityMultiplier: 0.86,
      emissiveBoost: 0.18,
      isPrimaryTarget: false,
      isSecondaryTarget: true,
    };
  }

  return {
    rank: "background",
    causalRole: input.causalRole,
    isHighlighted: false,
    isProtectedFromDim: false,
    shouldDimAsUnrelated: input.dimUnrelatedObjects,
    shouldUseScannerHalo: false,
    shouldShowScannerLabel: false,
    opacityMode: "soft_shadow",
    emissiveMode: "quiet",
    colorMode: "shadowed",
    labelTitle: null,
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
    causalRole: result.causalRole,
    isFocused: input.isFocused,
    isSelected: input.isSelected,
    isPinned: input.isPinned,
    rank: result.rank,
    opacityMode: result.opacityMode,
    colorMode: result.colorMode,
  });
}
