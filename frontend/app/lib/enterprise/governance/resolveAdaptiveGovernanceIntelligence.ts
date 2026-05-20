import { stableSignature } from "../../intelligence/shared/dedupe";
import { enterpriseSelfCalibrationLayer } from "./enterpriseSelfCalibrationLayer";
import { strategicOversightInterpretationLayer } from "./strategicOversightInterpretationLayer";
import {
  buildAdaptiveGovernanceSignature,
  synthesizeAdaptiveGovernanceCognition,
} from "./synthesizeAdaptiveGovernanceCognition";
import type {
  AdaptiveGovernanceCognition,
  AdaptiveGovernanceIntelligenceSnapshot,
  GovernanceOversightPosture,
  SynthesizeAdaptiveGovernanceCognitionInput,
} from "./adaptiveGovernanceTypes";

export type ResolveAdaptiveGovernanceIntelligenceInput = SynthesizeAdaptiveGovernanceCognitionInput & {
  enabled: boolean;
  sessionHydrated: boolean;
  runtimeStable: boolean;
  onboardingActive: boolean;
};

function resolveOversightPosture(
  cognition: AdaptiveGovernanceCognition | null,
  continuityPreserved: boolean
): GovernanceOversightPosture {
  if (!continuityPreserved) return "attention";
  if (!cognition) return "idle";

  if (
    cognition.governanceStability === "stable" &&
    cognition.strategicAlignment === "aligned"
  ) {
    return "oversight_active";
  }
  if (cognition.institutionalCoherence === "coherent" || cognition.institutionalCoherence === "stable") {
    return "synchronized";
  }
  if (cognition.governanceStability === "forming" || cognition.strategicAlignment === "tracking") {
    return "calibrating";
  }
  if (cognition.governanceStability !== "fragile") return "observing";
  return "attention";
}

export function resolveAdaptiveGovernanceIntelligence(
  input: ResolveAdaptiveGovernanceIntelligenceInput
): AdaptiveGovernanceIntelligenceSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeAdaptiveGovernanceCognition(input)
      : null;

  const oversightPosture = resolveOversightPosture(canonical, input.continuityPreserved);

  const governanceOversightActive =
    oversightPosture === "oversight_active" ||
    oversightPosture === "synchronized" ||
    oversightPosture === "calibrating";

  const enterpriseSelfCalibrationActive =
    governanceOversightActive || oversightPosture === "observing";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    oversightPosture !== "idle";

  const governanceHeadline =
    oversightPosture === "oversight_active"
      ? "Adaptive governance oversight active"
      : oversightPosture === "synchronized"
        ? "Strategic oversight synchronized with institutional cognition"
        : oversightPosture === "calibrating"
          ? "Enterprise governance self-calibration in progress"
          : oversightPosture === "observing"
            ? "Governance oversight observing operational discipline"
            : oversightPosture === "attention"
              ? "Governance cognition requires continuity attention"
              : "Adaptive governance intelligence idle";

  const governanceSubline = canonical
    ? `Stability ${canonical.governanceStability} · alignment ${canonical.strategicAlignment} · coherence ${canonical.institutionalCoherence}`
    : "Strategic oversight derives from institutional cognition — no autonomous corporate control authority";

  const oversightInterpretationLine = canonical
    ? strategicOversightInterpretationLayer.synthesizeOversightLine(
        canonical.strategicAlignment,
        canonical.institutionalCoherence
      )
    : "Operational governance interpretation establishes with institutional stack depth";

  const selfCalibrationLine = canonical
    ? enterpriseSelfCalibrationLayer.synthesizeCalibrationLine(
        canonical.governanceStability,
        canonical.operationalDiscipline
      )
    : "Enterprise self-calibration foundations prepare as governance cognition synchronizes";

  const strategicAlignmentLine = canonical
    ? strategicOversightInterpretationLayer.synthesizeAlignmentLine(
        canonical.strategicAlignment,
        canonical.resilienceGovernance
      )
    : "";

  const timelineGovernanceLine =
    "Timeline reflects governance evolution — strategic alignment, operational discipline, and resilience oversight maturation";

  const assistantGovernanceLine =
    governanceOversightActive || oversightPosture === "synchronized"
      ? "Governance cognition is available — discuss strategic alignment, operational discipline, and resilience governance without claiming executive replacement authority."
      : "Adaptive governance intelligence is establishing — oversight awareness will synchronize with institutional evolution cognition.";

  const signature = canonical
    ? buildAdaptiveGovernanceSignature(canonical)
    : stableSignature(["f9-1-governance-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    oversightPosture,
    governanceHeadline,
    governanceSubline,
    oversightInterpretationLine,
    selfCalibrationLine,
    strategicAlignmentLine,
    timelineGovernanceLine,
    assistantGovernanceLine,
    governanceOversightActive,
    enterpriseSelfCalibrationActive,
    canonical,
    governanceStable: input.continuityPreserved && input.runtimeStable,
    coherencePosture: "idle",
    coherenceHeadline: "Strategic alignment integrity idle",
    coherenceSubline: governanceSubline,
    alignmentIntegrityLine: "",
    operationalHarmonyLine: "",
    fragmentationAwarenessLine: "",
    timelineCoherenceLine: timelineGovernanceLine,
    assistantCoherenceLine: "",
    enterpriseCoherenceActive: false,
    strategicAlignmentIntegrityActive: false,
    strategicCoherence: null,
    calibrationPosture: "idle",
    calibrationHeadline: "Adaptive strategic calibration idle",
    calibrationSubline: governanceSubline,
    decisionQualityLine: "",
    operationalCorrectionLine: "",
    refinementInterpretationLine: "",
    timelineCalibrationLine: timelineGovernanceLine,
    assistantCalibrationLine: "",
    strategicCalibrationActive: false,
    decisionQualityCognitionActive: false,
    strategicCalibration: null,
    pressurePosture: "idle",
    stabilityHeadline: "Strategic pressure governance idle",
    stabilitySubline: governanceSubline,
    executiveStabilityLine: "",
    escalationGovernanceLine: "",
    pressureStabilizationLine: "",
    timelineStabilityLine: timelineGovernanceLine,
    assistantStabilityLine: "",
    executiveStabilityActive: false,
    pressureGovernanceActive: false,
    strategicPressureGovernance: null,
    adaptationPosture: "idle",
    evolutionHeadline: "Strategic adaptation governance idle",
    evolutionSubline: governanceSubline,
    transformationContinuityLine: "",
    adaptationGovernanceLine: "",
    operationalEvolutionLine: "",
    timelineTransformationLine: timelineGovernanceLine,
    assistantAdaptationLine: "",
    organizationalEvolutionActive: false,
    adaptationGovernanceActive: false,
    strategicAdaptationGovernance: null,
    evolutionConvergencePosture: "idle",
    unifiedGovernanceHeadline: "Unified adaptive governance runtime idle",
    unifiedGovernanceSubline: governanceSubline,
    strategicEvolutionLine: "",
    selfRegulationLine: "",
    timelineStrategicEvolutionLine: timelineGovernanceLine,
    assistantUnifiedGovernanceLine: "",
    unifiedGovernanceRuntimeActive: false,
    institutionalStrategicEvolutionConverged: false,
    unifiedAdaptiveGovernanceRuntime: null,
  };
}
