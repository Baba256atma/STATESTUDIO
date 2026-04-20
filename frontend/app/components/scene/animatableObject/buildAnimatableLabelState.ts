import { buildIntelligentScannerLabel } from "../sceneRenderUtils";

type BuildAnimatableLabelStateInput = {
  scannerSceneActive: boolean;
  isScannerPrimaryTarget: boolean;
  isScannerLabelOwner: boolean;
  scannerPrimaryLabelTitle: string | null;
  scannerPrimaryLabelBody: string | null;
  scannerPolicyLabelTitle?: string | null;
  scannerCausalityRole: string;
  scannerReason: string | null;
  scannerFocused: boolean;
  objectLabelName: string;
  scannerFragilityScore: number;
  scannerSeverity?: string;
  affectedCount: number;
  contextCount: number;
  activeDomainId?: string | null;
};

export function buildAnimatableLabelState(input: BuildAnimatableLabelStateInput) {
  const scannerRoleTitle =
    (input.isScannerPrimaryTarget ? input.scannerPrimaryLabelTitle : null) ??
    input.scannerPolicyLabelTitle ??
    (input.isScannerLabelOwner
      ? "Primary Risk Node"
      : input.scannerCausalityRole === "affected"
      ? "Affected Node"
      : input.scannerCausalityRole === "related_context"
      ? "Related Context"
      : input.scannerFocused
      ? "Scanner Focus"
      : "Fragility Signal");

  const scannerRoleBody =
    (input.isScannerPrimaryTarget ? input.scannerPrimaryLabelBody : null) ??
    (input.scannerCausalityRole === "affected"
      ? "Downstream impact"
      : input.scannerCausalityRole === "related_context"
      ? "Related context"
      : null) ??
    input.scannerReason ??
    (input.isScannerLabelOwner ? "Primary decision focus" : null);

  const intelligentScannerLabel = buildIntelligentScannerLabel({
    objectLabelName: input.objectLabelName,
    scannerRoleTitle,
    scannerRoleBody,
    scannerCausalityRole: input.scannerCausalityRole,
    scannerFragilityScore: input.scannerFragilityScore,
    scannerSeverity: input.scannerSeverity,
    isScannerPrimaryTarget: input.isScannerLabelOwner,
    affectedCount: input.affectedCount,
    contextCount: input.contextCount,
    activeDomainId: input.activeDomainId,
  });

  const scannerLabelTitle = intelligentScannerLabel.title;
  const effectiveScannerReason = intelligentScannerLabel.body;
  const hasLabelContent =
    !!(input.isScannerPrimaryTarget ? input.scannerPrimaryLabelTitle : null) ||
    !!(input.isScannerPrimaryTarget ? input.scannerPrimaryLabelBody : null) ||
    !!input.scannerReason ||
    !!input.scannerPolicyLabelTitle ||
    input.isScannerLabelOwner;
  const shouldShowPrimaryLabel =
    input.scannerSceneActive && input.isScannerLabelOwner && hasLabelContent;

  return {
    scannerRoleTitle,
    scannerRoleBody,
    scannerLabelTitle,
    effectiveScannerReason,
    hasLabelContent,
    shouldShowPrimaryLabel,
  };
}
