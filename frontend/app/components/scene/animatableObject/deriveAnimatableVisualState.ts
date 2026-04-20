import type {
  DecisionPathNarrativeNodeRole,
  DecisionPathNodeVisualHints,
} from "../../overlays/DecisionPathOverlayLayer";
import {
  buildSceneObjectVisualState,
  getInteractionProfile,
  getNarrativeNodeStyle,
  getRoleDynamicLayoutProfile,
  getScannerLabelVisualTone,
  getSimulationNodeStyle,
  normalizeScannerLabelSeverity,
  resolveInteractionRole,
  severityToScannerColor,
  type InteractionRole,
  type NarrativeNodeRole,
  type ScannerStoryReveal,
} from "../sceneRenderUtils";

type ScannerPolicyLike = {
  isHighlighted: boolean;
  isProtectedFromDim: boolean;
  shouldDimAsUnrelated: boolean;
  rank: "primary" | "secondary" | "background" | "neutral";
  shouldUseScannerHalo: boolean;
  labelTitle?: string | null;
  colorMode: "scanner_primary" | "scanner_affected" | "scanner_related" | "shadowed" | "base";
  opacityMultiplier: number;
  emissiveBoost: number;
  scaleMultiplier: number;
};

export type AnimatableVisualStateInput = {
  stableId: string;
  stableIdWithName: string;
  hoveredId: string | null;
  hoveredInteractionRole: InteractionRole;
  neighborIds: string[];
  attentionMemoryStrength: number;
  narrativeFocusStrength: number;
  narrativeFocusRole: NarrativeNodeRole;
  simulationStrength: number;
  isSimulationSource: boolean;
  decisionPathStrength: number;
  decisionPathRole: DecisionPathNarrativeNodeRole;
  decisionPathVisualHints?: DecisionPathNodeVisualHints;
  isDecisionPathSource: boolean;
  scannerSceneActive: boolean;
  scannerFragilityScore: number;
  scannerTargetIdSet: Set<string>;
  resolvedPrimaryRenderId: string | null;
  labelOwnerId: string | null;
  scannerPolicy: ScannerPolicyLike;
  scannerCausalityRole: string;
  isFocused: boolean;
  isSelected: boolean;
  isPinned: boolean;
  isLowFragilityScan: boolean;
  scannerEmphasis: number;
  scannerSeverity?: string;
  theme: "day" | "night" | "stars";
  scannerStoryReveal: ScannerStoryReveal;
  objType?: string;
  motionCalm?: boolean;
};

function softenHoverProfile<T extends { hoverScale: number; emissiveBoost: number; opacityBoost: number; neighborDim: number; edgeBoost: number }>(
  profile: T,
  calm: boolean
): T {
  if (!calm) return profile;
  const m = 0.62;
  return {
    ...profile,
    hoverScale: 1 + (profile.hoverScale - 1) * m,
    emissiveBoost: profile.emissiveBoost * m,
    opacityBoost: profile.opacityBoost * m,
    neighborDim: profile.neighborDim * m,
    edgeBoost: 1 + (profile.edgeBoost - 1) * m,
  };
}

function getRoleMotionProfile(role: "primary" | "affected" | "context" | "neutral") {
  if (role === "primary") return { pulseBoost: 1.16, driftMul: 0.74, scaleAuthority: 1.05, wobbleMul: 0.72 };
  if (role === "affected") return { pulseBoost: 1.04, driftMul: 0.92, scaleAuthority: 1.02, wobbleMul: 0.94 };
  if (role === "context") return { pulseBoost: 0.92, driftMul: 0.8, scaleAuthority: 0.98, wobbleMul: 0.78 };
  return { pulseBoost: 0.86, driftMul: 0.72, scaleAuthority: 0.96, wobbleMul: 0.68 };
}

export function deriveAnimatableVisualState(input: AnimatableVisualStateInput) {
  const isScannerTarget =
    input.scannerSceneActive &&
    (input.scannerTargetIdSet.has(input.stableIdWithName) || input.scannerTargetIdSet.has(input.stableId));
  const isScannerPrimaryTarget =
    input.scannerSceneActive &&
    !!input.resolvedPrimaryRenderId &&
    (input.resolvedPrimaryRenderId === input.stableIdWithName || input.resolvedPrimaryRenderId === input.stableId);
  const isScannerLabelOwner =
    input.scannerSceneActive &&
    !!input.labelOwnerId &&
    (input.labelOwnerId === input.stableIdWithName || input.labelOwnerId === input.stableId);

  const scannerHighlighted = input.scannerPolicy.isHighlighted || isScannerTarget;
  const scannerFocused = input.scannerPolicy.rank === "primary" || isScannerPrimaryTarget;
  const baseVisualState = buildSceneObjectVisualState({
    isHighlighted: scannerHighlighted,
    isFocused: input.isFocused,
    isSelected: input.isSelected,
    isPinned: input.isPinned,
    dimUnrelatedObjects: input.scannerSceneActive && input.scannerTargetIdSet.size > 0,
    scannerSceneActive: input.scannerSceneActive,
    isLowFragilityScan: input.isLowFragilityScan,
  });
  const visualState = input.scannerSceneActive
    ? {
        ...baseVisualState,
        isHighlighted: input.scannerPolicy.isHighlighted,
        isProtectedFromDim: input.scannerPolicy.isProtectedFromDim,
        shouldDimAsUnrelated: input.scannerPolicy.shouldDimAsUnrelated,
      }
    : baseVisualState;

  const scannerBackgroundDimmed = visualState.shouldDimAsUnrelated;
  const showCalmScannerConfirmation = input.isLowFragilityScan && isScannerPrimaryTarget;
  const scannerColor = severityToScannerColor(input.scannerSeverity, input.theme);
  const scannerLabelSeverity = normalizeScannerLabelSeverity(input.scannerSeverity, input.scannerFragilityScore);
  const scannerHierarchyRole =
    isScannerPrimaryTarget || isScannerLabelOwner
      ? "primary"
      : input.scannerCausalityRole === "affected"
      ? "affected"
      : input.scannerCausalityRole === "related_context"
      ? "context"
      : "neutral";
  const scannerLabelTone = getScannerLabelVisualTone(
    scannerLabelSeverity,
    scannerHierarchyRole,
    input.theme,
    scannerColor
  );

  const interactionRole = resolveInteractionRole({
    isScannerPrimary: isScannerPrimaryTarget,
    causalityRole: input.scannerCausalityRole,
  });
  const calmMotion = input.motionCalm === true;
  const interactionProfile = softenHoverProfile(getInteractionProfile(interactionRole), calmMotion);
  const hoveredInteractionProfile = softenHoverProfile(getInteractionProfile(input.hoveredInteractionRole), calmMotion);
  const isHovered = input.hoveredId === input.stableIdWithName || input.hoveredId === input.stableId;
  const isNeighbor =
    !!input.hoveredId &&
    input.hoveredId !== input.stableId &&
    input.hoveredId !== input.stableIdWithName &&
    input.neighborIds.includes(input.hoveredId);
  const shouldSoftDim = !!input.hoveredId && !isHovered && !isNeighbor && input.scannerSceneActive;
  const neighborDimFactor = shouldSoftDim ? 1 - hoveredInteractionProfile.neighborDim : 1;
  const passiveAttentionMemoryStrength =
    !isHovered && !input.isSelected ? input.attentionMemoryStrength : 0;

  const decisionPathNarrativeRole =
    input.decisionPathRole !== "outside" ? input.decisionPathRole : input.narrativeFocusRole;
  const decisionNarrativeStrength = Math.max(
    input.narrativeFocusStrength,
    input.decisionPathStrength *
      (input.decisionPathVisualHints?.isCriticalPath
        ? 1
        : input.decisionPathVisualHints?.isLeveragePoint
        ? 0.94
        : 0.82)
  );
  const decisionSimulationStrength = Math.max(
    input.simulationStrength,
    input.decisionPathStrength *
      (input.decisionPathVisualHints?.isProtected
        ? 0.36
        : input.decisionPathVisualHints?.isBottleneck
        ? 0.92
        : input.decisionPathVisualHints?.isLeveragePoint
        ? 0.88
        : 0.74)
  );
  const narrativeNodeStyle = getNarrativeNodeStyle(decisionPathNarrativeRole, decisionNarrativeStrength);
  const simulationNodeStyle = getSimulationNodeStyle(
    decisionSimulationStrength,
    input.isSimulationSource || input.isDecisionPathSource
  );
  const roleMotionProfile = getRoleMotionProfile(scannerHierarchyRole);
  const roleLayoutProfile = getRoleDynamicLayoutProfile(scannerHierarchyRole);
  const nodeStoryReveal =
    scannerHierarchyRole === "primary"
      ? input.scannerStoryReveal.primary
      : scannerHierarchyRole === "affected"
      ? input.scannerStoryReveal.affected
      : scannerHierarchyRole === "context"
      ? input.scannerStoryReveal.context
      : 1;
  const nodeStoryEmphasis = input.scannerSceneActive ? 0.72 + nodeStoryReveal * 0.28 : 1;
  const scannerHaloVisible =
    ((input.scannerPolicy.shouldUseScannerHalo && scannerHierarchyRole === "primary") ||
      showCalmScannerConfirmation) &&
    input.objType !== "line_path" &&
    input.objType !== "points_cloud";

  return {
    isScannerTarget,
    isScannerPrimaryTarget,
    isScannerLabelOwner,
    scannerHighlighted,
    scannerFocused,
    visualState,
    scannerBackgroundDimmed,
    showCalmScannerConfirmation,
    scannerColor,
    scannerLabelSeverity,
    scannerHierarchyRole,
    scannerLabelTone,
    interactionRole,
    interactionProfile,
    hoveredInteractionProfile,
    isHovered,
    isNeighbor,
    shouldSoftDim,
    neighborDimFactor,
    passiveAttentionMemoryStrength,
    decisionPathNarrativeRole,
    decisionNarrativeStrength,
    decisionSimulationStrength,
    narrativeNodeStyle,
    simulationNodeStyle,
    roleMotionProfile,
    roleLayoutProfile,
    nodeStoryReveal,
    nodeStoryEmphasis,
    scannerHaloVisible,
  };
}
