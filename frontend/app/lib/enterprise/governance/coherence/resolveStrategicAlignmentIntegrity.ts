import { stableSignature } from "../../../intelligence/shared/dedupe";
import { operationalConsistencyInterpretationLayer } from "./operationalConsistencyInterpretationLayer";
import { organizationalFragmentationCognitionLayer } from "./organizationalFragmentationCognitionLayer";
import {
  buildEnterpriseCoherenceSignature,
  synthesizeEnterpriseStrategicCoherence,
} from "./synthesizeEnterpriseStrategicCoherence";
import type {
  CoherencePosture,
  EnterpriseStrategicCoherence,
  SynthesizeEnterpriseStrategicCoherenceInput,
  StrategicAlignmentIntegritySnapshot,
} from "./enterpriseStrategicCoherenceTypes";

export type ResolveStrategicAlignmentIntegrityInput = SynthesizeEnterpriseStrategicCoherenceInput & {
  enabled: boolean;
  sessionHydrated: boolean;
  runtimeStable: boolean;
  onboardingActive: boolean;
};

function resolveCoherencePosture(
  coherence: EnterpriseStrategicCoherence | null,
  continuityPreserved: boolean
): CoherencePosture {
  if (!continuityPreserved) return "attention";
  if (!coherence) return "idle";

  if (
    coherence.strategicAlignment === "harmonized" &&
    coherence.institutionalHarmony === "stable"
  ) {
    return "harmonized";
  }
  if (
    coherence.governanceSynchronization === "coherent" ||
    coherence.governanceSynchronization === "synchronized"
  ) {
    return "synchronized";
  }
  if (coherence.strategicAlignment === "tracking" || coherence.strategicAlignment === "forming") {
    return "aligning";
  }
  if (coherence.strategicAlignment !== "fragmented") return "observing";
  return "attention";
}

export function resolveStrategicAlignmentIntegrity(
  input: ResolveStrategicAlignmentIntegrityInput
): StrategicAlignmentIntegritySnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeEnterpriseStrategicCoherence(input)
      : null;

  const coherencePosture = resolveCoherencePosture(canonical, input.continuityPreserved);

  const enterpriseCoherenceActive =
    coherencePosture === "harmonized" ||
    coherencePosture === "synchronized" ||
    coherencePosture === "aligning";

  const strategicAlignmentIntegrityActive =
    enterpriseCoherenceActive || coherencePosture === "observing";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    coherencePosture !== "idle";

  const coherenceHeadline =
    coherencePosture === "harmonized"
      ? "Enterprise strategic coherence harmonized"
      : coherencePosture === "synchronized"
        ? "Strategic alignment integrity synchronized"
        : coherencePosture === "aligning"
          ? "Operational alignment integrity establishing"
          : coherencePosture === "observing"
            ? "Enterprise coherence cognition observing"
            : coherencePosture === "attention"
              ? "Strategic coherence requires continuity attention"
              : "Strategic alignment integrity idle";

  const coherenceSubline = canonical
    ? `Alignment ${canonical.strategicAlignment} · consistency ${canonical.operationalConsistency} · harmony ${canonical.institutionalHarmony}`
    : "Coherence cognition derives from governance oversight — not bureaucratic policy enforcement";

  const alignmentIntegrityLine = canonical
    ? operationalConsistencyInterpretationLayer.synthesizeAlignmentIntegrityLine(
        canonical.strategicAlignment,
        canonical.operationalConsistency
      )
    : "Alignment integrity interpretation establishes with adaptive governance depth";

  const operationalHarmonyLine = canonical
    ? operationalConsistencyInterpretationLayer.synthesizeHarmonyLine(
        canonical.institutionalHarmony,
        canonical.governanceSynchronization
      )
    : "Operational harmony forming through governance and institutional synchronization";

  const fragmentationAwarenessLine = canonical
    ? organizationalFragmentationCognitionLayer.synthesizeFragmentationLine(
        canonical.strategicAlignment,
        canonical.coordinationIntegrity,
        canonical.resilienceCoherence
      )
    : "";

  const timelineCoherenceLine =
    "Timeline reflects institutional coherence memory — alignment evolution, governance consistency, and operational synchronization";

  const assistantCoherenceLine =
    enterpriseCoherenceActive
      ? "Strategic coherence is available — discuss alignment quality, operational consistency, and coordination fragmentation without rigid audit behavior."
      : "Enterprise coherence cognition is establishing — alignment integrity will synchronize with governance oversight awareness.";

  const signature = canonical
    ? buildEnterpriseCoherenceSignature(canonical)
    : stableSignature(["f9-2-coherence-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    coherencePosture,
    coherenceHeadline,
    coherenceSubline,
    alignmentIntegrityLine,
    operationalHarmonyLine,
    fragmentationAwarenessLine,
    timelineCoherenceLine,
    assistantCoherenceLine,
    enterpriseCoherenceActive,
    strategicAlignmentIntegrityActive,
    canonical,
    coherenceStable: input.continuityPreserved && input.runtimeStable,
  };
}
