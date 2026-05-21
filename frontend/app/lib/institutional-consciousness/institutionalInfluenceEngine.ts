import { stableSignature } from "../intelligence/shared/dedupe";
import { resilienceStateRank } from "./civilizationFragilityGuards";
import {
  beginInstitutionalInfluenceEvaluation,
  clampInstitutionalInfluenceConfidence,
  endInstitutionalInfluenceEvaluation,
  impactStateRank,
  influenceStrengthRank,
  INSTITUTIONAL_INFLUENCE_MIN_CONSENSUS_SUBSYSTEMS,
  INSTITUTIONAL_INFLUENCE_MIN_FRAGILITY_OBSERVATIONS,
  INSTITUTIONAL_INFLUENCE_MIN_UNIFIED_LAYERS,
  shouldEvaluateInstitutionalInfluence,
  shouldRetainMacroInfluenceObservation,
} from "./institutionalInfluenceGuards";
import { getInstitutionalInfluenceStore } from "./institutionalInfluenceStore";
import type {
  CivilizationImpactSignal,
  EcosystemImpactTopology,
  ImpactState,
  InfluenceCategory,
  InfluenceStrength,
  InstitutionalImpactSummary,
  InstitutionalInfluenceInput,
  InstitutionalInfluenceResult,
  InstitutionalInfluenceSnapshot,
  MacroInfluenceObservation,
  OperationalInfluenceField,
} from "./institutionalInfluenceTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalInfluence]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildInfluenceId(label: string): string {
  return stableSignature(["institutional-influence", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: InstitutionalInfluenceInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasCivilizationFragilityDepth(input: InstitutionalInfluenceInput): boolean {
  const snapshot = input.civilizationFragilitySnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= INSTITUTIONAL_INFLUENCE_MIN_FRAGILITY_OBSERVATIONS &&
    resilienceStateRank(snapshot.resilienceSummary.dominantResilienceState) >=
      resilienceStateRank("pressured")
  );
}

function hasInstitutionalConsciousnessDepth(input: InstitutionalInfluenceInput): boolean {
  const snapshot = input.institutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= 1 &&
    institutionalStateRank(snapshot.awarenessSummary.dominantInstitutionalState) >=
      institutionalStateRank("connected")
  );
}

function createObservation(
  label: string,
  impactState: ImpactState,
  influenceStrength: InfluenceStrength,
  influenceCategory: InfluenceCategory,
  summary: string,
  influenceSignals: string[],
  impactRisks: string[],
  confidence: number,
  now: number
): MacroInfluenceObservation {
  return {
    influenceId: buildInfluenceId(label),
    impactState,
    influenceStrength,
    influenceCategory,
    summary,
    influenceSignals: Object.freeze(influenceSignals),
    impactRisks: Object.freeze(impactRisks),
    confidence: clampInstitutionalInfluenceConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseEcosystemImpact(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const fragilityReady = hasCivilizationFragilityDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    INSTITUTIONAL_INFLUENCE_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= INSTITUTIONAL_INFLUENCE_MIN_UNIFIED_LAYERS;

  if (!fragilityReady || !consciousnessReady || !consensusMature || !layersReady) return null;

  return createObservation(
    "enterprise_ecosystem_impact_01",
    "ecosystem_active",
    "systemic",
    "logistics_influence",
    "Enterprise operational instability is propagating influence across logistics, workforce, and infrastructure ecosystems, while coordinated governance stabilization is partially reducing civilization-scale fragility amplification.",
    [
      "cross_system_impact_diffusion",
      "resilience_propagation",
      "institutional_dependency_pressure",
      "ecosystem_stabilization",
    ],
    ["regional_supply_chain_disruption"],
    0.91,
    now
  );
}

function buildInstitutionalFragilityInfluenceSignal(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const disruptionStress =
    input.operationalTopologyStressed ||
    input.fragilityElevated ||
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strained";
  const decisionActive = input.decisionSnapshot?.runtimeStatus === "stable";

  if (!disruptionStress || !decisionActive) return null;

  return createObservation(
    "institutional_fragility_influence_signal",
    "distributed",
    "strong",
    "fragility_influence",
    "Operational disruption propagating into supplier ecosystems — institutional fragility influence signal maps bounded outward consequence without autonomous societal influence behavior.",
    [
      "institutional_fragility_influence_signal",
      "supplier_ecosystem_pressure",
      "operational_disruption_propagation",
    ],
    ["regional_supply_chain_disruption"],
    0.88,
    now
  );
}

function buildResilienceInfluenceReinforcement(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const governanceStable =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable" &&
    (input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture ===
        "institutional_grade");
  const fragilityAbsorbing =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";

  if (!governanceStable || !fragilityAbsorbing) return null;

  return createObservation(
    "resilience_influence_reinforcement",
    "ecosystem_active",
    "strong",
    "resilience_influence",
    "Governance stabilization improving distributed continuity — resilience influence reinforcement strengthens macro-operational impact absorption across institutional pathways.",
    [
      "resilience_influence_reinforcement",
      "governance_continuity_improvement",
      "distributed_stabilization_effect",
    ],
    [],
    0.87,
    now
  );
}

function buildMacroOperationalCoherenceImpact(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const syncCoherent =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "systemically_integrated";
  const consensusContinuous =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";

  if (!syncCoherent || !consensusContinuous) return null;

  return createObservation(
    "macro_operational_coherence_impact",
    "systemically_influential",
    "strong",
    "governance_influence",
    "Enterprise coordination stabilizing ecosystem dependencies — macro-operational coherence impact reinforces civilization-scale operational influence without speculative control behavior.",
    [
      "macro_operational_coherence_impact",
      "ecosystem_dependency_stabilization",
      "institutional_coordination_influence",
    ],
    [],
    0.86,
    now
  );
}

function buildCivilizationScaleImpactWarning(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const failureAmplification =
    input.fragilityElevated &&
    (input.unifiedConsensusSnapshot?.runtimeStatus === "adaptive" ||
      input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented");
  const multiSystemImpact =
    countActiveUnifiedLayers(input) >= INSTITUTIONAL_INFLUENCE_MIN_UNIFIED_LAYERS &&
    (input.civilizationFragilitySnapshot?.observationCount ?? 0) >= 2;

  if (!failureAmplification || !multiSystemImpact) return null;

  return createObservation(
    "civilization_scale_impact_warning",
    "systemically_influential",
    "civilization_scale",
    "economic_influence",
    "Distributed operational failure amplifying systemic pressure — civilization-scale impact warning reflects bounded enterprise consequence diffusion across interconnected ecosystems.",
    [
      "civilization_scale_impact_warning",
      "distributed_failure_amplification",
      "macro_consequence_concentration",
    ],
    ["systemic_pressure_amplification"],
    0.9,
    now
  );
}

function buildEcosystemResiliencePropagation(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const infrastructureAdapted =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";
  const temporalStabilizing =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "stabilizing";

  if (!infrastructureAdapted || !temporalStabilizing) return null;

  return createObservation(
    "ecosystem_resilience_propagation",
    "ecosystem_active",
    "strong",
    "infrastructure_influence",
    "Infrastructure adaptation reducing external instability — ecosystem resilience propagation externalizes bounded stabilization influence across operational networks.",
    [
      "ecosystem_resilience_propagation",
      "infrastructure_adaptation_influence",
      "external_instability_reduction",
    ],
    [],
    0.85,
    now
  );
}

function buildCivilizationScaleOperationalStabilization(
  input: InstitutionalInfluenceInput,
  now: number
): MacroInfluenceObservation | null {
  const continuityPreserved = input.continuityPreserved === true;
  const narrative =
    (input.enterpriseNarrativeLine?.trim().length ?? 0) > 0 ||
    (input.cognitionSnapshot?.organizationalLearningLine?.trim().length ?? 0) > 0;
  const consensusStable =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";

  if (!continuityPreserved || !consensusStable) return null;

  return createObservation(
    "civilization_scale_operational_stabilization",
    narrative ? "civilization_scale_impact" : "systemically_influential",
    "systemic",
    "workforce_influence",
    "Institutional continuity reinforcing regional coordination — civilization-scale operational stabilization models bounded enterprise influence on macro-systemic continuity.",
    [
      "civilization_scale_operational_stabilization",
      "institutional_continuity_influence",
      "regional_coordination_reinforcement",
    ],
    [],
    narrative ? 0.89 : 0.87,
    now
  );
}

function buildImpactSignal(
  observation: MacroInfluenceObservation,
  now: number
): CivilizationImpactSignal {
  return {
    signalId: stableSignature(["civilization-impact-signal", observation.influenceId]).slice(0, 48),
    signalLabel: observation.impactState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.influenceCategory]),
    signalIntensity:
      observation.influenceStrength === "civilization_scale" ||
      observation.influenceStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildInfluenceField(
  observation: MacroInfluenceObservation,
  now: number
): OperationalInfluenceField | null {
  if (
    observation.impactState !== "distributed" &&
    observation.impactState !== "ecosystem_active" &&
    observation.impactState !== "systemically_influential" &&
    observation.impactState !== "civilization_scale_impact"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["operational-influence-field", observation.influenceId]).slice(0, 48),
    fieldLabel: observation.impactState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    influencePosture:
      observation.influenceStrength === "civilization_scale"
        ? "executive_grade"
        : observation.influenceStrength === "systemic" || observation.influenceStrength === "strong"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.influenceCategory]),
    generatedAt: now,
  };
}

function buildImpactTopology(
  observation: MacroInfluenceObservation,
  now: number
): EcosystemImpactTopology | null {
  if (observation.impactRisks.length < 1 && observation.influenceStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["ecosystem-impact-topology", observation.influenceId]).slice(0, 48),
    topologyLabel: observation.influenceCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    impactPosture:
      observation.impactRisks.length > 0
        ? "high"
        : observation.impactState === "systemically_influential" ||
            observation.impactState === "civilization_scale_impact"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.influenceCategory]),
    generatedAt: now,
  };
}

function buildInfluenceSnapshot(
  organizationId: string,
  observations: MacroInfluenceObservation[],
  signals: CivilizationImpactSignal[],
  fields: OperationalInfluenceField[],
  topologies: EcosystemImpactTopology[],
  now: number
): InstitutionalInfluenceSnapshot {
  const top = observations[0];
  const impactSummary: InstitutionalImpactSummary = top
    ? {
        dominantImpactState: top.impactState,
        dominantInfluenceStrength: top.influenceStrength,
        impactHeadline: top.summary,
        ecosystemInfluencePosture:
          top.influenceStrength === "civilization_scale"
            ? "executive_grade"
            : top.influenceStrength === "systemic" || top.influenceStrength === "strong"
              ? "high"
              : top.influenceStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantImpactState: "localized",
        dominantInfluenceStrength: "weak",
        impactHeadline:
          "Institutional influence awaiting sufficient civilization fragility propagation depth.",
        ecosystemInfluencePosture: "low",
      };

  const signature = stableSignature([
    "d9-8-4-institutional-influence-snapshot",
    organizationId,
    observations.map((o) => o.influenceId),
    impactSummary.ecosystemInfluencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    impactSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    impactSignals: Object.freeze(signals.slice(0, 6)),
    influenceFields: Object.freeze(fields.slice(0, 6)),
    impactTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateStrategicInstitutionalInfluence(
  input: InstitutionalInfluenceInput
): InstitutionalInfluenceResult {
  if (!beginInstitutionalInfluenceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getInstitutionalInfluenceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-4-institutional-influence-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.civilizationFragilitySnapshot?.signature ?? "no-fragility",
      input.ecosystemSynchronizationSnapshot?.signature ?? "no-sync",
      input.institutionalConsciousnessSnapshot?.signature ?? "no-consciousness",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateInstitutionalInfluence(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (!hasCivilizationFragilityDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_civilization_fragility_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < INSTITUTIONAL_INFLUENCE_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < INSTITUTIONAL_INFLUENCE_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: MacroInfluenceObservation[] = [];

    const ecosystemImpact = buildEnterpriseEcosystemImpact(input, now);
    if (ecosystemImpact) candidates.push(ecosystemImpact);

    const fragilityInfluence = buildInstitutionalFragilityInfluenceSignal(input, now);
    if (fragilityInfluence) candidates.push(fragilityInfluence);

    const resilienceReinforcement = buildResilienceInfluenceReinforcement(input, now);
    if (resilienceReinforcement) candidates.push(resilienceReinforcement);

    const coherenceImpact = buildMacroOperationalCoherenceImpact(input, now);
    if (coherenceImpact) candidates.push(coherenceImpact);

    const impactWarning = buildCivilizationScaleImpactWarning(input, now);
    if (impactWarning) candidates.push(impactWarning);

    const resiliencePropagation = buildEcosystemResiliencePropagation(input, now);
    if (resiliencePropagation) candidates.push(resiliencePropagation);

    const operationalStabilization = buildCivilizationScaleOperationalStabilization(input, now);
    if (operationalStabilization) candidates.push(operationalStabilization);

    const retained = candidates
      .filter(shouldRetainMacroInfluenceObservation)
      .sort(
        (a, b) =>
          impactStateRank(b.impactState) - impactStateRank(a.impactState) ||
          influenceStrengthRank(b.influenceStrength) - influenceStrengthRank(a.influenceStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_observations",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.observations.map((o) => o.influenceId));
    const newCount = retained.filter((o) => !priorIds.has(o.influenceId)).length;

    const signals = retained.map((o) => buildImpactSignal(o, now));
    const fields = retained
      .map((o) => buildInfluenceField(o, now))
      .filter((f): f is OperationalInfluenceField => f !== null);
    const topologies = retained
      .map((o) => buildImpactTopology(o, now))
      .filter((t): t is EcosystemImpactTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertImpactSignals(signals, now);
    store.upsertInfluenceFields(fields, now);
    store.upsertImpactTopologies(topologies, now);

    const snapshot = buildInfluenceSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastImpactState(snapshot.impactSummary.dominantImpactState);

    const finalState = store.getState();
    const priorState = prior.lastImpactState;

    if (ecosystemImpact || fragilityInfluence || impactWarning) {
      devLog("ecosystem-impact emergence — macro-operational influence propagation advancing");
    }

    if (resilienceReinforcement || resiliencePropagation || operationalStabilization) {
      devLog("macro-resilience reinforcement — civilization-scale stabilization effects detected");
    }

    if (impactWarning) {
      devLog("distributed consequence amplification — civilization-scale impact warning mapped");
    }

    if (coherenceImpact || operationalStabilization) {
      devLog("civilization-scale stabilization effects — institutional influence coherence reinforced");
    }

    if (
      priorState &&
      priorState !== snapshot.impactSummary.dominantImpactState &&
      (snapshot.impactSummary.dominantImpactState === "systemically_influential" ||
        snapshot.impactSummary.dominantImpactState === "civilization_scale_impact")
    ) {
      devLog(
        `macro-impact maturation — ${priorState} → ${snapshot.impactSummary.dominantImpactState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalInfluenceEvaluation();
  }
}
