import { stableSignature } from "../../../intelligence/shared/dedupe";
import { institutionalStrategicEvolutionConvergenceLayer } from "./institutionalStrategicEvolutionConvergenceLayer";
import {
  buildInstitutionalStrategicEvolutionSignature,
  synthesizeInstitutionalStrategicEvolution,
} from "./synthesizeInstitutionalStrategicEvolution";
import type {
  EvolutionConvergencePosture,
  InstitutionalStrategicEvolution,
  SynthesizeInstitutionalStrategicEvolutionInput,
  UnifiedAdaptiveGovernanceRuntimeSnapshot,
} from "./unifiedAdaptiveGovernanceTypes";

export type ResolveUnifiedAdaptiveGovernanceRuntimeInput =
  SynthesizeInstitutionalStrategicEvolutionInput & {
    enabled: boolean;
    sessionHydrated: boolean;
    runtimeStable: boolean;
    onboardingActive: boolean;
  };

function resolveEvolutionConvergencePosture(
  evolution: InstitutionalStrategicEvolution | null,
  continuityPreserved: boolean,
  stackLayersActive: number
): EvolutionConvergencePosture {
  if (!continuityPreserved) return "attention";
  if (!evolution) return "idle";

  if (
    evolution.enterpriseStrategicContinuity === "coherent" &&
    evolution.selfRegulationDiscipline === "mature"
  ) {
    return "self_regulating";
  }
  if (
    evolution.institutionalEvolutionSync === "synchronized" ||
    evolution.institutionalEvolutionSync === "progressive"
  ) {
    return "synchronized";
  }
  if (stackLayersActive >= 2 || evolution.institutionalEvolutionSync === "converging") {
    return "converging";
  }
  return "idle";
}

export function resolveUnifiedAdaptiveGovernanceRuntime(
  input: ResolveUnifiedAdaptiveGovernanceRuntimeInput
): UnifiedAdaptiveGovernanceRuntimeSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeInstitutionalStrategicEvolution(input)
      : null;

  const activeLayers = [
    input.stack.governanceOversightActive,
    input.stack.enterpriseCoherenceActive,
    input.stack.strategicCalibrationActive,
    input.stack.executiveStabilityActive,
    input.stack.organizationalEvolutionActive,
  ].filter(Boolean).length;

  const evolutionConvergencePosture = resolveEvolutionConvergencePosture(
    canonical,
    input.continuityPreserved,
    activeLayers
  );

  const unifiedGovernanceRuntimeActive =
    evolutionConvergencePosture === "self_regulating" ||
    evolutionConvergencePosture === "synchronized" ||
    evolutionConvergencePosture === "converging";

  const institutionalStrategicEvolutionConverged =
    evolutionConvergencePosture === "self_regulating" ||
    evolutionConvergencePosture === "synchronized";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    evolutionConvergencePosture !== "idle";

  const unifiedGovernanceHeadline =
    evolutionConvergencePosture === "self_regulating"
      ? "Unified adaptive governance runtime self-regulating"
      : evolutionConvergencePosture === "synchronized"
        ? "Institutional strategic evolution synchronized"
        : evolutionConvergencePosture === "converging"
          ? "Unified adaptive governance converging across institutional layers"
          : evolutionConvergencePosture === "attention"
            ? "Unified governance requires institutional continuity attention"
            : "Unified adaptive governance runtime idle";

  const unifiedGovernanceSubline = canonical
    ? `Governance ${canonical.governanceContinuity} · coherence ${canonical.operationalCoherence} · evolution ${canonical.institutionalEvolutionSync}`
    : "Unified runtime coordinates F9 governance layers — not autonomous enterprise authority";

  const strategicEvolutionLine = canonical
    ? institutionalStrategicEvolutionConvergenceLayer.synthesizeStrategicEvolutionLine(
        canonical,
        evolutionConvergencePosture
      )
    : "Institutional strategic evolution cognition establishes with full governance stack convergence";

  const selfRegulationLine = canonical
    ? institutionalStrategicEvolutionConvergenceLayer.synthesizeSelfRegulationLine(canonical)
    : "";

  const timelineStrategicEvolutionLine =
    "Timeline reflects living institutional strategic memory — governance evolution, operational coherence progression, executive stability continuity, and enterprise transformation evolution";

  const assistantUnifiedGovernanceLine =
    unifiedGovernanceRuntimeActive || evolutionConvergencePosture === "converging"
      ? "Unified adaptive governance is synchronized — discuss governance continuity, strategic coherence, executive stability, institutional adaptation, and long-term strategic evolution without autonomous governance authority."
      : "Unified adaptive governance runtime is establishing — institutional strategic evolution will converge as the governance stack deepens.";

  const signature = canonical
    ? buildInstitutionalStrategicEvolutionSignature(canonical)
    : stableSignature(["f9-6-runtime-idle", String(activeLayers)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    evolutionConvergencePosture,
    unifiedGovernanceHeadline,
    unifiedGovernanceSubline,
    strategicEvolutionLine,
    selfRegulationLine,
    timelineStrategicEvolutionLine,
    assistantUnifiedGovernanceLine,
    unifiedGovernanceRuntimeActive,
    institutionalStrategicEvolutionConverged,
    canonical,
    runtimeStable: input.continuityPreserved && input.runtimeStable,
  };
}
