import { stableSignature } from "../../intelligence/shared/dedupe";
import { reasoningSelfObservationLayer } from "./reasoningSelfObservationLayer";
import { strategicAssumptionReflectionLayer } from "./strategicAssumptionReflectionLayer";
import {
  buildExecutiveMetaCognitionSignature,
  synthesizeExecutiveMetaCognition,
} from "./synthesizeExecutiveMetaCognition";
import type {
  AutonomousExecutiveMetaCognitionLayerSnapshot,
  ExecutiveMetaCognitionSnapshot,
  MetaCognitionPosture,
  SynthesizeExecutiveMetaCognitionInput,
} from "./executiveMetaCognitionTypes";

export type ResolveAutonomousExecutiveMetaCognitionInput = SynthesizeExecutiveMetaCognitionInput & {
  enabled: boolean;
  sessionHydrated: boolean;
  runtimeStable: boolean;
  onboardingActive: boolean;
};

function resolveMetaCognitionPosture(
  cognition: ExecutiveMetaCognitionSnapshot | null,
  continuityPreserved: boolean
): MetaCognitionPosture {
  if (!continuityPreserved) return "attention";
  if (!cognition) return "idle";
  if (cognition.uncertainty === "low" && cognition.confidenceEvolution === "strengthening") {
    return "transparent";
  }
  if (cognition.reasoningPath === "reflecting") return "reflecting";
  if (cognition.reasoningPath !== "observing") return "observing";
  return "observing";
}

export function resolveAutonomousExecutiveMetaCognition(
  input: ResolveAutonomousExecutiveMetaCognitionInput
): AutonomousExecutiveMetaCognitionLayerSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeExecutiveMetaCognition(input)
      : null;

  const metaCognitionPosture = resolveMetaCognitionPosture(canonical, input.continuityPreserved);

  const executiveMetaCognitionActive =
    metaCognitionPosture === "transparent" || metaCognitionPosture === "reflecting";

  const strategicSelfAwarenessActive =
    executiveMetaCognitionActive || metaCognitionPosture === "observing";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    metaCognitionPosture !== "idle";

  const reflectionHeadline =
    metaCognitionPosture === "transparent"
      ? "Enterprise strategic self-awareness transparent"
      : metaCognitionPosture === "reflecting"
        ? "Executive meta-cognition reflecting on reasoning formation"
        : metaCognitionPosture === "observing"
          ? "Meta-cognitive intelligence observing reasoning pathways"
          : metaCognitionPosture === "attention"
            ? "Reasoning reflection requires continuity attention"
            : "Executive meta-cognition idle";

  const reflectionSubline = canonical
    ? canonical.strategicReflection
    : "Meta-cognition explains how reasoning formed — not machine consciousness";

  const reasoningPathLine = canonical
    ? reasoningSelfObservationLayer.synthesizeReasoningPathLine(
        canonical.reasoningPath,
        canonical.governanceContext
      )
    : "Reasoning pathway cognition establishes with governance stack depth";

  const assumptionsLine = canonical
    ? strategicAssumptionReflectionLayer.synthesizeAssumptionsLine(canonical.assumptions)
    : "";

  const uncertaintyLine = canonical
    ? strategicAssumptionReflectionLayer.synthesizeUncertaintyLine(
        canonical.uncertainty,
        canonical.supportingSignals.length
      )
    : "";

  const confidenceEvolutionLine = canonical
    ? strategicAssumptionReflectionLayer.synthesizeConfidenceEvolutionLine(
        canonical.confidenceEvolution
      )
    : "";

  const advisoryLimitsLine = canonical
    ? strategicAssumptionReflectionLayer.synthesizeAdvisoryLimitsLine(canonical.advisoryLimits)
    : "";

  const timelineReasoningLine =
    "Timeline reflects strategic reasoning memory — confidence changes, assumption evolution, and governance interpretation progression";

  const assistantMetaCognitionLine =
    executiveMetaCognitionActive || metaCognitionPosture === "observing"
      ? "Meta-cognitive transparency is available — discuss reasoning pathways, strategic assumptions, confidence changes, and advisory limits without consciousness claims."
      : "Executive meta-cognition is establishing — strategic self-awareness will synchronize with the governance intelligence stack.";

  const signature = canonical
    ? buildExecutiveMetaCognitionSignature(canonical)
    : stableSignature(["f10-1-meta-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    metaCognitionPosture,
    reflectionHeadline,
    reflectionSubline,
    reasoningPathLine,
    assumptionsLine,
    uncertaintyLine,
    confidenceEvolutionLine,
    advisoryLimitsLine,
    timelineReasoningLine,
    assistantMetaCognitionLine,
    executiveMetaCognitionActive,
    strategicSelfAwarenessActive,
    canonical,
    reflectionStable: input.continuityPreserved && input.runtimeStable,
  };
}
