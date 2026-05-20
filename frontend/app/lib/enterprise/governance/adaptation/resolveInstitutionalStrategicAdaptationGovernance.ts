import { stableSignature } from "../../../intelligence/shared/dedupe";
import { organizationalEvolutionCognitionLayer } from "./organizationalEvolutionCognitionLayer";
import { transformationGovernanceInterpretationLayer } from "./transformationGovernanceInterpretationLayer";
import {
  buildStrategicAdaptationGovernanceSignature,
  synthesizeInstitutionalStrategicAdaptationGovernance,
} from "./synthesizeInstitutionalStrategicAdaptationGovernance";
import type {
  AdaptationGovernancePosture,
  InstitutionalStrategicAdaptationGovernance,
  InstitutionalStrategicAdaptationGovernanceSnapshot,
  SynthesizeInstitutionalStrategicAdaptationGovernanceInput,
} from "./strategicAdaptationGovernanceTypes";

export type ResolveInstitutionalStrategicAdaptationGovernanceInput =
  SynthesizeInstitutionalStrategicAdaptationGovernanceInput & {
    enabled: boolean;
    sessionHydrated: boolean;
    runtimeStable: boolean;
    onboardingActive: boolean;
  };

function resolveAdaptationPosture(
  adaptation: InstitutionalStrategicAdaptationGovernance | null,
  continuityPreserved: boolean
): AdaptationGovernancePosture {
  if (!continuityPreserved) return "attention";
  if (!adaptation) return "idle";

  if (
    adaptation.transformationContinuity === "coherent" &&
    adaptation.institutionalProgression === "mature"
  ) {
    return "progressive";
  }
  if (
    adaptation.strategicTransformation === "sustained" ||
    adaptation.resilienceEvolution === "mature"
  ) {
    return "evolving";
  }
  if (
    adaptation.adaptationGovernance === "mature" ||
    adaptation.adaptationGovernance === "developing"
  ) {
    return "adapting";
  }
  if (adaptation.strategicTransformation !== "nascent") return "observing";
  return "observing";
}

export function resolveInstitutionalStrategicAdaptationGovernance(
  input: ResolveInstitutionalStrategicAdaptationGovernanceInput
): InstitutionalStrategicAdaptationGovernanceSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeInstitutionalStrategicAdaptationGovernance(input)
      : null;

  const adaptationPosture = resolveAdaptationPosture(canonical, input.continuityPreserved);

  const organizationalEvolutionActive =
    adaptationPosture === "progressive" ||
    adaptationPosture === "evolving" ||
    adaptationPosture === "adapting";

  const adaptationGovernanceActive =
    organizationalEvolutionActive || adaptationPosture === "observing";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    adaptationPosture !== "idle";

  const evolutionHeadline =
    adaptationPosture === "progressive"
      ? "Institutional strategic adaptation governance progressive"
      : adaptationPosture === "evolving"
        ? "Autonomous organizational evolution cognition active"
        : adaptationPosture === "adapting"
          ? "Enterprise transformation continuity adapting"
          : adaptationPosture === "observing"
            ? "Adaptation governance observing transformation progression"
            : adaptationPosture === "attention"
              ? "Transformation continuity requires institutional attention"
              : "Strategic adaptation governance idle";

  const evolutionSubline = canonical
    ? `Continuity ${canonical.transformationContinuity} · adaptation ${canonical.adaptationGovernance} · progression ${canonical.institutionalProgression}`
    : "Adaptation governance derives from institutional stack depth — not autonomous corporate AI";

  const transformationContinuityLine = canonical
    ? organizationalEvolutionCognitionLayer.synthesizeTransformationContinuityLine(
        canonical.transformationContinuity,
        canonical.strategicTransformation
      )
    : "Transformation continuity cognition establishes with governance stack depth";

  const adaptationGovernanceLine = canonical
    ? transformationGovernanceInterpretationLayer.synthesizeAdaptationGovernanceLine(
        canonical.adaptationGovernance,
        canonical.resilienceEvolution
      )
    : "Adaptation governance interpretation forming";

  const operationalEvolutionLine = canonical
    ? organizationalEvolutionCognitionLayer.synthesizeOperationalEvolutionLine(
        canonical.operationalAdaptation,
        canonical.coordinationEvolution
      )
    : "";

  const timelineTransformationLine =
    "Timeline reflects organizational transformation memory — strategic progression, operational adaptation continuity, and resilience-oriented evolution";

  const assistantAdaptationLine =
    organizationalEvolutionActive || adaptationPosture === "observing"
      ? "Organizational evolution governance is available — discuss transformation continuity, adaptation governance progression, and resilience-oriented evolution without autonomous executive replacement."
      : "Strategic adaptation governance is establishing — enterprise transformation continuity will synchronize with the institutional governance stack.";

  const signature = canonical
    ? buildStrategicAdaptationGovernanceSignature(canonical)
    : stableSignature(["f9-5-adaptation-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    adaptationPosture,
    evolutionHeadline,
    evolutionSubline,
    transformationContinuityLine,
    adaptationGovernanceLine,
    operationalEvolutionLine,
    timelineTransformationLine,
    assistantAdaptationLine,
    organizationalEvolutionActive,
    adaptationGovernanceActive,
    canonical,
    evolutionStable: input.continuityPreserved && input.runtimeStable,
  };
}
