import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import type { InstitutionalStrategicAdaptationGovernanceSnapshot } from "./strategicAdaptationGovernanceTypes";

/**
 * F9:5 — Merges adaptation governance into the enterprise governance stack snapshot.
 */
export function mergeStrategicAdaptationGovernance(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  adaptation: InstitutionalStrategicAdaptationGovernanceSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useAdaptationDisplay =
    adaptation.organizationalEvolutionActive ||
    (adaptation.adaptationGovernanceActive && adaptation.adaptationPosture !== "idle");

  const displayHeadline = useAdaptationDisplay
    ? adaptation.evolutionHeadline
    : stack.governanceHeadline;

  const displaySubline = useAdaptationDisplay ? adaptation.evolutionSubline : stack.governanceSubline;

  const signature = stableSignature([
    "f9-governance-stack-complete",
    stack.signature,
    adaptation.signature,
  ]);

  const assistantLine =
    adaptation.assistantAdaptationLine ||
    stack.assistantStabilityLine ||
    stack.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || adaptation.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useAdaptationDisplay
      ? adaptation.timelineTransformationLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    adaptationPosture: adaptation.adaptationPosture,
    evolutionHeadline: adaptation.evolutionHeadline,
    evolutionSubline: adaptation.evolutionSubline,
    transformationContinuityLine: adaptation.transformationContinuityLine,
    adaptationGovernanceLine: adaptation.adaptationGovernanceLine,
    operationalEvolutionLine: adaptation.operationalEvolutionLine,
    timelineTransformationLine: adaptation.timelineTransformationLine,
    assistantAdaptationLine: adaptation.assistantAdaptationLine,
    organizationalEvolutionActive: adaptation.organizationalEvolutionActive,
    adaptationGovernanceActive: adaptation.adaptationGovernanceActive,
    strategicAdaptationGovernance: adaptation,
  };
}
