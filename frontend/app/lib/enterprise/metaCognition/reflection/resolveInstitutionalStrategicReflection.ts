import { stableSignature } from "../../../intelligence/shared/dedupe";
import { executiveCognitiveEvolutionLayer } from "./executiveCognitiveEvolutionLayer";
import { organizationalLearningReflectionLayer } from "./organizationalLearningReflectionLayer";
import {
  buildInstitutionalStrategicReflectionSignature,
  synthesizeInstitutionalStrategicReflection,
} from "./synthesizeInstitutionalStrategicReflection";
import type {
  CognitiveEvolutionPosture,
  InstitutionalStrategicReflection,
  InstitutionalStrategicReflectionLayerSnapshot,
  SynthesizeInstitutionalStrategicReflectionInput,
} from "./institutionalStrategicReflectionTypes";

export type ResolveInstitutionalStrategicReflectionInput =
  SynthesizeInstitutionalStrategicReflectionInput & {
    enabled: boolean;
    sessionHydrated: boolean;
    runtimeStable: boolean;
    onboardingActive: boolean;
  };

function resolveCognitiveEvolutionPosture(
  reflection: InstitutionalStrategicReflection | null,
  continuityPreserved: boolean
): CognitiveEvolutionPosture {
  if (!continuityPreserved) return "attention";
  if (!reflection) return "idle";

  if (
    reflection.reasoningEvolution === "sustained" &&
    reflection.governanceMaturity === "mature"
  ) {
    return "sustained";
  }
  if (reflection.reasoningEvolution === "maturing" || reflection.resilienceProgression === "sustained") {
    return "evolving";
  }
  if (reflection.governanceMaturity === "developing") return "maturing";
  if (reflection.reasoningEvolution !== "nascent") return "observing";
  return "observing";
}

export function resolveInstitutionalStrategicReflection(
  input: ResolveInstitutionalStrategicReflectionInput
): InstitutionalStrategicReflectionLayerSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeInstitutionalStrategicReflection(input)
      : null;

  const cognitiveEvolutionPosture = resolveCognitiveEvolutionPosture(
    canonical,
    input.continuityPreserved
  );

  const cognitiveEvolutionActive =
    cognitiveEvolutionPosture === "sustained" || cognitiveEvolutionPosture === "evolving";

  const institutionalReflectionActive =
    cognitiveEvolutionActive || cognitiveEvolutionPosture === "maturing";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    cognitiveEvolutionPosture !== "idle";

  const evolutionHeadline =
    cognitiveEvolutionPosture === "sustained"
      ? "Institutional strategic reflection sustained"
      : cognitiveEvolutionPosture === "evolving"
        ? "Executive cognitive evolution intelligence active"
        : cognitiveEvolutionPosture === "maturing"
          ? "Strategic maturity cognition maturing"
          : cognitiveEvolutionPosture === "observing"
            ? "Organizational learning reflection observing patterns"
            : cognitiveEvolutionPosture === "attention"
              ? "Institutional evolution requires continuity attention"
              : "Institutional strategic reflection idle";

  const evolutionSubline = canonical
    ? canonical.strategicReflectionSummary
    : "Evolution intelligence tracks organizational learning — not autonomous AI self-modification";

  const strategicMaturityLine = canonical
    ? executiveCognitiveEvolutionLayer.synthesizeStrategicMaturityLine(
        canonical.governanceMaturity,
        canonical.reasoningEvolution
      )
    : "Strategic maturity cognition establishes with meta-cognitive stack depth";

  const resilienceEvolutionLine = canonical
    ? executiveCognitiveEvolutionLayer.synthesizeResilienceEvolutionLine(canonical.resilienceProgression)
    : "";

  const organizationalLearningLine = canonical
    ? organizationalLearningReflectionLayer.synthesizeOrganizationalLearningLine(
        canonical.institutionalStrengths,
        canonical.institutionalFragilities
      )
    : "";

  const timelineInstitutionalEvolutionLine =
    "Timeline reflects institutional strategic memory — maturity progression, resilience evolution, governance adaptation, and long-term cognition evolution";

  const assistantInstitutionalReflectionLine =
    institutionalReflectionActive || cognitiveEvolutionPosture === "observing"
      ? "Institutional reflection is available — discuss strategic growth trends, resilience evolution, governance maturity, and organizational learning without judging executives personally."
      : "Institutional strategic reflection is establishing — cognitive evolution awareness will synchronize with meta-cognitive intelligence.";

  const signature = canonical
    ? buildInstitutionalStrategicReflectionSignature(canonical)
    : stableSignature(["f10-3-reflection-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    cognitiveEvolutionPosture,
    evolutionHeadline,
    evolutionSubline,
    strategicMaturityLine,
    resilienceEvolutionLine,
    organizationalLearningLine,
    timelineInstitutionalEvolutionLine,
    assistantInstitutionalReflectionLine,
    institutionalReflectionActive,
    cognitiveEvolutionActive,
    canonical,
    evolutionStable: input.continuityPreserved && input.runtimeStable,
  };
}
