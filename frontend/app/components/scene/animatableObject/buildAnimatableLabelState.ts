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

/** E2:58 — Legacy floating tooltip cards removed; Object Info owns detail surfaces. */
export function buildAnimatableLabelState(input: BuildAnimatableLabelStateInput) {
  const intelligentScannerLabel = buildIntelligentScannerLabel({
    objectLabelName: input.objectLabelName,
    scannerRoleTitle: "Primary Risk Node",
    scannerRoleBody: null,
    scannerCausalityRole: input.scannerCausalityRole,
    scannerFragilityScore: input.scannerFragilityScore,
    scannerSeverity: input.scannerSeverity,
    isScannerPrimaryTarget: false,
    affectedCount: input.affectedCount,
    contextCount: input.contextCount,
    activeDomainId: input.activeDomainId,
  });

  return {
    scannerRoleTitle: null,
    scannerRoleBody: null,
    scannerLabelTitle: intelligentScannerLabel.title,
    effectiveScannerReason: null,
    hasLabelContent: false,
    shouldShowPrimaryLabel: false,
  };
}
