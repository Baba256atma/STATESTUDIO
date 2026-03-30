"use client";

export type ResolveScannerPrimaryTargetInput = {
  highlightedIds?: string[];
  resolvedRiskSourceIds?: string[];
  resolvedRiskTargetIds?: string[];
  scannerTargetIds?: string[];
  focusedId?: string | null;
  sceneObjectIds?: string[];
};

export type ResolveScannerPrimaryTargetResult = {
  primaryTargetId: string | null;
  affectedTargetIds: string[];
  contextTargetIds: string[];
  reason: string;
  primaryRole: "primary_cause" | "affected" | "related_context" | "neutral";
  primaryLabelTitle: string | null;
  primaryLabelBody: string | null;
};

function uniqueOrdered(ids: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  ids.forEach((id) => {
    if (typeof id !== "string" || id.length === 0 || seen.has(id)) return;
    seen.add(id);
    ordered.push(id);
  });
  return ordered;
}

function buildPrimaryLabelMeta(reason: string, hasPrimaryTarget: boolean): {
  primaryRole: "primary_cause" | "affected" | "related_context" | "neutral";
  primaryLabelTitle: string | null;
  primaryLabelBody: string | null;
} {
  if (!hasPrimaryTarget) {
    return {
      primaryRole: "neutral",
      primaryLabelTitle: null,
      primaryLabelBody: null,
    };
  }

  switch (reason) {
    case "single_highlighted_target":
    case "highlighted_target_aligned_with_risk_source":
    case "first_risk_source":
      return {
        primaryRole: "primary_cause",
        primaryLabelTitle: "Primary Risk Node",
        primaryLabelBody: "Main pressure source",
      };
    case "first_risk_target":
      return {
        primaryRole: "affected",
        primaryLabelTitle: "Affected Node",
        primaryLabelBody: "Downstream impact",
      };
    case "focused_id_fallback":
      return {
        primaryRole: "related_context",
        primaryLabelTitle: "Related Context",
        primaryLabelBody: "Selected system context",
      };
    default:
      return {
        primaryRole: "related_context",
        primaryLabelTitle: "Related Context",
        primaryLabelBody: "Related system signal",
      };
  }
}

export function resolveScannerPrimaryTarget(
  input: ResolveScannerPrimaryTargetInput
): ResolveScannerPrimaryTargetResult {
  const sceneObjectIdSet = new Set((input.sceneObjectIds ?? []).map(String));
  const highlightedIds = uniqueOrdered((input.highlightedIds ?? []).map((id) => String(id)));
  const resolvedRiskSourceIds = uniqueOrdered((input.resolvedRiskSourceIds ?? []).map((id) => String(id)));
  const resolvedRiskTargetIds = uniqueOrdered((input.resolvedRiskTargetIds ?? []).map((id) => String(id)));
  const scannerTargetIds = uniqueOrdered((input.scannerTargetIds ?? []).map((id) => String(id)));
  const focusedId =
    typeof input.focusedId === "string" && input.focusedId.length > 0 ? input.focusedId : null;

  const validHighlightedIds = highlightedIds.filter((id) => sceneObjectIdSet.has(id));
  const validRiskSourceIds = resolvedRiskSourceIds.filter((id) => sceneObjectIdSet.has(id));
  const validRiskTargetIds = resolvedRiskTargetIds.filter((id) => sceneObjectIdSet.has(id));
  const validScannerTargetIds = scannerTargetIds.filter((id) => sceneObjectIdSet.has(id));
  const validFocusedId = focusedId && sceneObjectIdSet.has(focusedId) ? focusedId : null;

  let primaryTargetId: string | null = null;
  let reason = "none";

  if (validHighlightedIds.length === 1) {
    primaryTargetId = validHighlightedIds[0];
    reason = "single_highlighted_target";
  } else if (validHighlightedIds.length > 1) {
    primaryTargetId =
      validHighlightedIds.find((id) => validRiskSourceIds.includes(id)) ??
      validHighlightedIds[0] ??
      null;
    reason = primaryTargetId && validRiskSourceIds.includes(primaryTargetId)
      ? "highlighted_target_aligned_with_risk_source"
      : "first_stable_highlighted_target";
  } else if (validRiskSourceIds.length > 0) {
    primaryTargetId = validRiskSourceIds[0];
    reason = "first_risk_source";
  } else if (validRiskTargetIds.length > 0) {
    primaryTargetId = validRiskTargetIds[0];
    reason = "first_risk_target";
  } else if (validFocusedId) {
    primaryTargetId = validFocusedId;
    reason = "focused_id_fallback";
  }

  const affectedTargetIds = validRiskTargetIds.filter((id) => id !== primaryTargetId);
  const contextTargetIds = validScannerTargetIds.filter(
    (id) => id !== primaryTargetId && !affectedTargetIds.includes(id)
  );
  const labelMeta = buildPrimaryLabelMeta(reason, !!primaryTargetId);

  return {
    primaryTargetId,
    affectedTargetIds,
    contextTargetIds,
    reason,
    primaryRole: labelMeta.primaryRole,
    primaryLabelTitle: labelMeta.primaryLabelTitle,
    primaryLabelBody: labelMeta.primaryLabelBody,
  };
}
