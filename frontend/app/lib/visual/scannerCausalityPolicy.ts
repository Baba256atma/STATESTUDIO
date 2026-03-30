"use client";

import { traceHighlightFlow } from "../debug/highlightDebugTrace";

export type ScannerCausalRole =
  | "primary_cause"
  | "affected"
  | "related_context"
  | "background"
  | "neutral";

export type ScannerCausalityResult = {
  role: ScannerCausalRole;
  isPrimaryCause: boolean;
  isAffected: boolean;
  isRelatedContext: boolean;
  isBackground: boolean;
};

export type ResolveScannerCausalityRoleInput = {
  scannerSceneActive: boolean;
  scannerPrimaryTargetId?: string | null;
  scannerTargetIds?: string[];
  affectedTargetIds?: string[];
  contextTargetIds?: string[];
  riskSourceIds?: string[];
  riskTargetIds?: string[];
  currentObjectIds: string[];
};

function matchesAnyId(candidate: string | null | undefined, ids: string[]): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) return false;
  return ids.includes(candidate);
}

export function resolveScannerCausalityRole(
  input: ResolveScannerCausalityRoleInput
): ScannerCausalityResult {
  const currentIds = input.currentObjectIds.filter(Boolean);
  const targetIds = Array.isArray(input.scannerTargetIds) ? input.scannerTargetIds.map(String) : [];
  const affectedTargetIds = Array.isArray(input.affectedTargetIds) ? input.affectedTargetIds.map(String) : [];
  const contextTargetIds = Array.isArray(input.contextTargetIds) ? input.contextTargetIds.map(String) : [];
  const riskSourceIds = Array.isArray(input.riskSourceIds) ? input.riskSourceIds.map(String) : [];
  const riskTargetIds = Array.isArray(input.riskTargetIds) ? input.riskTargetIds.map(String) : [];
  const scannerPrimaryTargetId = input.scannerPrimaryTargetId ?? null;

  if (!input.scannerSceneActive || (targetIds.length === 0 && riskSourceIds.length === 0 && riskTargetIds.length === 0)) {
    return {
      role: "neutral",
      isPrimaryCause: false,
      isAffected: false,
      isRelatedContext: false,
      isBackground: false,
    };
  }

  const isPrimaryTarget = matchesAnyId(scannerPrimaryTargetId, currentIds);
  const isAffectedTarget = currentIds.some((id) => affectedTargetIds.includes(id));
  const isContextTarget = currentIds.some((id) => contextTargetIds.includes(id));
  const isRiskSource = currentIds.some((id) => riskSourceIds.includes(id));
  const isRiskTarget = currentIds.some((id) => riskTargetIds.includes(id));
  const isScannerTarget = currentIds.some((id) => targetIds.includes(id));

  if (isPrimaryTarget) {
    return {
      role: "primary_cause",
      isPrimaryCause: true,
      isAffected: false,
      isRelatedContext: false,
      isBackground: false,
    };
  }

  if (isAffectedTarget || isRiskTarget) {
    return {
      role: "affected",
      isPrimaryCause: false,
      isAffected: true,
      isRelatedContext: false,
      isBackground: false,
    };
  }

  if (isRiskSource) {
    return {
      role: "related_context",
      isPrimaryCause: false,
      isAffected: false,
      isRelatedContext: true,
      isBackground: false,
    };
  }

  if (isContextTarget || isScannerTarget) {
    return {
      role: "related_context",
      isPrimaryCause: false,
      isAffected: false,
      isRelatedContext: true,
      isBackground: false,
    };
  }

  return {
    role: "background",
    isPrimaryCause: false,
    isAffected: false,
    isRelatedContext: false,
    isBackground: true,
  };
}

export function traceScannerCausalityRole(
  objectId: string,
  input: ResolveScannerCausalityRoleInput,
  result: ScannerCausalityResult
): void {
  if (process.env.NODE_ENV === "production") return;
  const currentIds = input.currentObjectIds.filter(Boolean);
  const riskSourceIds = Array.isArray(input.riskSourceIds) ? input.riskSourceIds.map(String) : [];
  const riskTargetIds = Array.isArray(input.riskTargetIds) ? input.riskTargetIds.map(String) : [];
  const affectedTargetIds = Array.isArray(input.affectedTargetIds) ? input.affectedTargetIds.map(String) : [];
  const contextTargetIds = Array.isArray(input.contextTargetIds) ? input.contextTargetIds.map(String) : [];
  traceHighlightFlow("scene_object_state", {
    objectId,
    causalRole: result.role,
    scannerPrimaryTargetId: input.scannerPrimaryTargetId ?? null,
    isRiskSource: currentIds.some((id) => riskSourceIds.includes(id)),
    isRiskTarget: currentIds.some((id) => riskTargetIds.includes(id)),
    isAffectedTarget: currentIds.some((id) => affectedTargetIds.includes(id)),
    isContextTarget: currentIds.some((id) => contextTargetIds.includes(id)),
  });
}
