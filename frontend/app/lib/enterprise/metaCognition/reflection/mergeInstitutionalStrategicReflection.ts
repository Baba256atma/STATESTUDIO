import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";
import type { InstitutionalStrategicReflectionLayerSnapshot } from "./institutionalStrategicReflectionTypes";

/**
 * F10:3 — Merges institutional strategic reflection into the enterprise intelligence snapshot.
 */
export function mergeInstitutionalStrategicReflection(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  reflection: InstitutionalStrategicReflectionLayerSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useEvolutionDisplay =
    reflection.cognitiveEvolutionActive ||
    (reflection.institutionalReflectionActive && reflection.cognitiveEvolutionPosture !== "idle");

  const displayHeadline = useEvolutionDisplay
    ? reflection.evolutionHeadline
    : stack.governanceHeadline;

  const displaySubline = useEvolutionDisplay ? reflection.evolutionSubline : stack.governanceSubline;

  const signature = stableSignature([
    "f10-enterprise-intelligence-complete",
    stack.signature,
    reflection.signature,
  ]);

  const assistantLine =
    reflection.assistantInstitutionalReflectionLine ||
    stack.assistantMetaCognitionLine ||
    stack.assistantUnifiedGovernanceLine ||
    stack.assistantAdaptationLine ||
    stack.assistantStabilityLine ||
    stack.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || reflection.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useEvolutionDisplay
      ? reflection.timelineInstitutionalEvolutionLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    cognitiveEvolutionPosture: reflection.cognitiveEvolutionPosture,
    evolutionHeadline: reflection.evolutionHeadline,
    evolutionSubline: reflection.evolutionSubline,
    strategicMaturityLine: reflection.strategicMaturityLine,
    resilienceEvolutionLine: reflection.resilienceEvolutionLine,
    organizationalLearningLine: reflection.organizationalLearningLine,
    timelineInstitutionalEvolutionLine: reflection.timelineInstitutionalEvolutionLine,
    assistantInstitutionalReflectionLine: reflection.assistantInstitutionalReflectionLine,
    institutionalReflectionActive: reflection.institutionalReflectionActive,
    cognitiveEvolutionActive: reflection.cognitiveEvolutionActive,
    institutionalStrategicReflection: reflection,
  };
}
