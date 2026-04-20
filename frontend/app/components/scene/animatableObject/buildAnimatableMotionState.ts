type RoleMotionProfile = {
  pulseBoost: number;
  driftMul: number;
  scaleAuthority: number;
  wobbleMul: number;
};

type RoleLayoutProfile = {
  attraction: number;
  repulsion: number;
  orbitStrength: number;
  yLift: number;
  zBias: number;
};

type InteractionProfile = {
  hoverScale: number;
  emissiveBoost: number;
  opacityBoost: number;
  neighborDim: number;
  edgeBoost: number;
};

type NarrativeNodeStyle = {
  scaleMul: number;
  emissiveBoost: number;
  opacityMul: number;
  opacityBoost: number;
  liftY: number;
};

type SimulationNodeStyle = {
  scaleMul: number;
  emissiveBoost: number;
  opacityBoost: number;
  motionBoost: number;
};

type InteractionRole = "primary" | "affected" | "context" | "neutral";

type BuildAnimatableMotionStateInput = {
  objType?: string;
  hierarchyAmbientMul: number;
  hierarchyScaleMul: number;
  roleMotionProfile: RoleMotionProfile;
  roleLayoutProfile: RoleLayoutProfile;
  scannerBackgroundDimmed: boolean;
  showCalmScannerConfirmation: boolean;
  scannerEmphasis: number;
  scannerRank: "primary" | "secondary" | "background" | "neutral";
  scannerScaleMultiplier: number;
  visualState: {
    isFocused: boolean;
    isSelected: boolean;
    isPinned: boolean;
  };
  scannerSceneActive: boolean;
  nodeStoryReveal: number;
  nodeStoryEmphasis: number;
  interactionProfile: InteractionProfile;
  narrativeNodeStyle: NarrativeNodeStyle;
  simulationNodeStyle: SimulationNodeStyle;
  passiveAttentionMemoryStrength: number;
  interactionRole: InteractionRole;
  isSelected: boolean;
  isHovered: boolean;
  isSimulationSource: boolean;
  isDecisionPathSource: boolean;
  decisionSimulationStrength: number;
  ambientPhase: number;
  decisionCenter: [number, number, number];
  finalPosition: [number, number, number];
  focusScaleMul: number;
  isFocused: boolean;
  scannerHighlighted: boolean;
  scannerFocused: boolean;
  isLowFragilityScan: boolean;
  sceneIdleSway: number;
  motionCalm?: boolean;
};

export function buildAnimatableMotionState(input: BuildAnimatableMotionStateInput) {
  const calm = input.motionCalm ? 0.55 : 1;
  const ambientAmp =
    (input.objType === "line_path" || input.objType === "points_cloud"
      ? 0.05
      : 0.08 * input.hierarchyAmbientMul * input.roleMotionProfile.driftMul) * calm;

  const baseX = Number(input.finalPosition?.[0] ?? 0);
  const baseY = Number(input.finalPosition?.[1] ?? 0);
  const baseZ = Number(input.finalPosition?.[2] ?? 0);
  const centerX = Number(input.decisionCenter?.[0] ?? 0);
  const centerZ = Number(input.decisionCenter?.[2] ?? 0);
  const toCenterX = centerX - baseX;
  const toCenterZ = centerZ - baseZ;
  const planarDistance = Math.hypot(toCenterX, toCenterZ);
  const dirX = planarDistance > 1e-4 ? toCenterX / planarDistance : Math.cos(input.ambientPhase);
  const dirZ = planarDistance > 1e-4 ? toCenterZ / planarDistance : Math.sin(input.ambientPhase);
  const netPull = input.roleLayoutProfile.attraction - input.roleLayoutProfile.repulsion;
  const orbitX = -dirZ * Math.cos(input.ambientPhase * 0.9) * input.roleLayoutProfile.orbitStrength;
  const orbitZ = dirX * Math.sin(input.ambientPhase * 0.75) * input.roleLayoutProfile.orbitStrength;
  const roleSpatialOffset: [number, number, number] = [
    toCenterX * netPull + orbitX,
    input.roleLayoutProfile.yLift,
    toCenterZ * netPull + input.roleLayoutProfile.zBias + orbitZ,
  ];

  const scannerScaleMul =
    input.scannerBackgroundDimmed
      ? 0.92
      : input.showCalmScannerConfirmation
      ? 1 + 0.03 + input.scannerEmphasis * 0.04 * input.roleMotionProfile.scaleAuthority
      : input.scannerRank === "primary"
      ? input.scannerScaleMultiplier + 0.18 + input.scannerEmphasis * 0.18 * input.roleMotionProfile.scaleAuthority
      : input.scannerRank === "secondary"
      ? input.scannerScaleMultiplier + 0.02 + input.scannerEmphasis * 0.04 * input.roleMotionProfile.scaleAuthority
      : input.visualState.isFocused || input.visualState.isSelected || input.visualState.isPinned
      ? 1.04
      : 1;

  const storyScaleMul = input.scannerSceneActive ? 0.94 + input.nodeStoryReveal * 0.06 : 1;
  const interactionScaleMul = input.isHovered ? input.interactionProfile.hoverScale : 1;
  const narrativeScaleMul = input.narrativeNodeStyle.scaleMul;
  const simulationScaleMul = input.simulationNodeStyle.scaleMul;
  const memoryCap = input.motionCalm ? 0.55 : 1;
  const memoryScaleMul =
    1 +
    input.passiveAttentionMemoryStrength *
      memoryCap *
      (input.interactionRole === "primary"
        ? 0.02
        : input.interactionRole === "affected"
        ? 0.014
        : 0.008);
  const selectionRoleMul =
    input.isSelected && input.interactionRole === "primary"
      ? 1.03
      : input.isSelected && input.interactionRole === "affected"
      ? 1.02
      : input.isSelected && input.interactionRole === "context"
      ? 1.008
      : 1;
  const selectionLiftY =
    input.isSelected && input.interactionRole === "affected"
      ? 0.04
      : input.isSelected && input.interactionRole === "primary"
      ? 0.02
      : input.isSelected && input.interactionRole === "context"
      ? 0.01
      : 0;
  const narrativeLiftY = input.narrativeNodeStyle.liftY;
  const simulationLiftY =
    input.decisionSimulationStrength > 0
      ? input.decisionSimulationStrength * (input.isSimulationSource || input.isDecisionPathSource ? 0.032 : 0.014)
      : 0;
  const spatialBase: [number, number, number] = [
    baseX + roleSpatialOffset[0],
    baseY + roleSpatialOffset[1] + selectionLiftY + narrativeLiftY + simulationLiftY,
    baseZ + roleSpatialOffset[2],
  ];
  const driftAmplitude: [number, number, number] = [ambientAmp * 0.55, ambientAmp, ambientAmp * 0.5];
  const hoverScaleMul =
    input.isHovered && !input.isFocused && !input.isSelected ? (input.motionCalm ? 1.012 : 1.03) : 1;
  const staticScaleMul =
    input.focusScaleMul *
    input.hierarchyScaleMul *
    hoverScaleMul *
    scannerScaleMul *
    storyScaleMul *
    interactionScaleMul *
    narrativeScaleMul *
    simulationScaleMul *
    memoryScaleMul *
    selectionRoleMul;

  const scannerPulseAmplitude =
    input.scannerHighlighted
      ? input.isLowFragilityScan
        ? input.showCalmScannerConfirmation
          ? (0.008 + input.scannerEmphasis * 0.01) * input.roleMotionProfile.pulseBoost * input.nodeStoryEmphasis
          : 0
        : input.scannerFocused
        ? (0.014 + input.scannerEmphasis * 0.01) * input.roleMotionProfile.pulseBoost * input.nodeStoryEmphasis
        : 0
      : 0;
  const scannerPulseSpeed = input.isLowFragilityScan ? 1.6 : 2.8;
  const simulationPulseAmplitude =
    input.decisionSimulationStrength > 0 ? input.simulationNodeStyle.motionBoost * 0.035 : 0;
  const simulationPulseSpeed =
    input.isSimulationSource || input.isDecisionPathSource ? 1.9 : 1.5;

  return {
    ambientAmp,
    roleSpatialOffset,
    scannerScaleMul,
    storyScaleMul,
    interactionScaleMul,
    narrativeScaleMul,
    simulationScaleMul,
    memoryScaleMul,
    selectionRoleMul,
    selectionLiftY,
    narrativeLiftY,
    simulationLiftY,
    spatialBase,
    driftAmplitude,
    hoverScaleMul,
    staticScaleMul,
    animPulseBase: 0.08 * input.roleMotionProfile.pulseBoost * input.nodeStoryEmphasis,
    wobbleBase: 0.25 * input.roleMotionProfile.wobbleMul * input.nodeStoryEmphasis,
    scannerPulseAmplitude,
    scannerPulseSpeed,
    simulationPulseAmplitude,
    simulationPulseSpeed,
    driftSpeed: input.sceneIdleSway,
  };
}
