import { stableSignature } from "../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../governance/adaptiveGovernanceTypes";
import type { AutonomousExecutiveMetaCognitionLayerSnapshot } from "./executiveMetaCognitionTypes";

/**
 * F10:1 — Merges executive meta-cognition into the enterprise intelligence snapshot.
 */
export function mergeExecutiveMetaCognition(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  metaCognition: AutonomousExecutiveMetaCognitionLayerSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useMetaDisplay =
    metaCognition.executiveMetaCognitionActive ||
    (metaCognition.strategicSelfAwarenessActive && metaCognition.metaCognitionPosture !== "idle");

  const displayHeadline = useMetaDisplay
    ? metaCognition.reflectionHeadline
    : stack.governanceHeadline;

  const displaySubline = useMetaDisplay ? metaCognition.reflectionSubline : stack.governanceSubline;

  const signature = stableSignature([
    "f10-enterprise-intelligence",
    stack.signature,
    metaCognition.signature,
  ]);

  const assistantLine =
    metaCognition.assistantMetaCognitionLine ||
    stack.assistantUnifiedGovernanceLine ||
    stack.assistantAdaptationLine ||
    stack.assistantStabilityLine ||
    stack.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || metaCognition.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useMetaDisplay
      ? metaCognition.timelineReasoningLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    metaCognitionPosture: metaCognition.metaCognitionPosture,
    reflectionHeadline: metaCognition.reflectionHeadline,
    reflectionSubline: metaCognition.reflectionSubline,
    reasoningPathLine: metaCognition.reasoningPathLine,
    assumptionsLine: metaCognition.assumptionsLine,
    uncertaintyLine: metaCognition.uncertaintyLine,
    confidenceEvolutionLine: metaCognition.confidenceEvolutionLine,
    advisoryLimitsLine: metaCognition.advisoryLimitsLine,
    timelineReasoningLine: metaCognition.timelineReasoningLine,
    assistantMetaCognitionLine: metaCognition.assistantMetaCognitionLine,
    executiveMetaCognitionActive: metaCognition.executiveMetaCognitionActive,
    strategicSelfAwarenessActive: metaCognition.strategicSelfAwarenessActive,
    autonomousExecutiveMetaCognition: metaCognition,
  };
}
