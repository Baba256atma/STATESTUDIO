import { stableSignature } from "../intelligence/shared/dedupe";
import { sustainabilityStateRank } from "./civilizationContinuityGuards";
import {
  adaptationStrengthRank,
  beginCivilizationAdaptationEvaluation,
  clampCivilizationAdaptationConfidence,
  CIVILIZATION_ADAPTATION_MIN_CONSENSUS_SUBSYSTEMS,
  CIVILIZATION_ADAPTATION_MIN_CONTINUITY_OBSERVATIONS,
  CIVILIZATION_ADAPTATION_MIN_UNIFIED_LAYERS,
  endCivilizationAdaptationEvaluation,
  evolutionStateRank,
  shouldEvaluateCivilizationAdaptation,
  shouldRetainLongHorizonEvolutionObservation,
} from "./civilizationAdaptationGuards";
import { getCivilizationAdaptationStore } from "./civilizationAdaptationStore";
import type {
  AdaptationCategory,
  AdaptationStrength,
  CivilizationAdaptationInput,
  CivilizationAdaptationResult,
  CivilizationAdaptationSnapshot,
  CivilizationAdaptationSummary,
  EcosystemTransformationField,
  EvolutionState,
  LongHorizonEvolutionObservation,
  MacroEvolutionSignal,
  SystemicAdaptationTopology,
} from "./civilizationAdaptationTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][CivilizationAdaptation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAdaptationId(label: string): string {
  return stableSignature(["civilization-adaptation", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: CivilizationAdaptationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasCivilizationContinuityDepth(input: CivilizationAdaptationInput): boolean {
  const snapshot = input.civilizationContinuitySnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= CIVILIZATION_ADAPTATION_MIN_CONTINUITY_OBSERVATIONS &&
    sustainabilityStateRank(snapshot.continuitySummary.dominantSustainabilityState) >=
      sustainabilityStateRank("adaptive")
  );
}

function hasInstitutionalConsciousnessDepth(input: CivilizationAdaptationInput): boolean {
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
  evolutionState: EvolutionState,
  adaptationStrength: AdaptationStrength,
  adaptationCategory: AdaptationCategory,
  summary: string,
  adaptationSignals: string[],
  evolutionRisks: string[],
  confidence: number,
  now: number
): LongHorizonEvolutionObservation {
  return {
    adaptationId: buildAdaptationId(label),
    evolutionState,
    adaptationStrength,
    adaptationCategory,
    summary,
    adaptationSignals: Object.freeze(adaptationSignals),
    evolutionRisks: Object.freeze(evolutionRisks),
    confidence: clampCivilizationAdaptationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleEvolutionField(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const continuityReady = hasCivilizationContinuityDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    CIVILIZATION_ADAPTATION_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= CIVILIZATION_ADAPTATION_MIN_UNIFIED_LAYERS;

  if (!continuityReady || !consciousnessReady || !consensusMature || !layersReady) return null;

  return createObservation(
    "civilization_scale_evolution_field_01",
    "adaptive",
    "systemic",
    "operational_evolution",
    "Civilization-scale operational ecosystems are adaptively reorganizing through distributed resilience reinforcement, logistics decentralization, and governance coordination restructuring under sustained macro-operational pressure.",
    [
      "ecosystem_reorganization",
      "distributed_resilience_growth",
      "operational_topology_shift",
      "institutional_adaptation_convergence",
    ],
    ["unstable_transformation_overlap"],
    0.91,
    now
  );
}

function buildEcosystemAdaptationSignal(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const logisticsInstability =
    input.operationalTopologyStressed ||
    input.fragilityElevated ||
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strained";
  const temporalShifting =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "evolving" ||
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "fragmenting";

  if (!logisticsInstability || !temporalShifting) return null;

  return createObservation(
    "ecosystem_adaptation_signal",
    "shifting",
    "adaptive",
    "logistics_adaptation",
    "Repeated logistics instability driving decentralization — ecosystem adaptation signal maps bounded operational restructuring without speculative future-evolution forecasting.",
    [
      "ecosystem_adaptation_signal",
      "logistics_decentralization_pressure",
      "resilience_redundancy_formation",
    ],
    ["regional_restructuring_risk"],
    0.88,
    now
  );
}

function buildAdaptiveEvolutionReinforcement(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const infrastructureResilient =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";
  const continuitySustainable =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "sustainable" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "continuity_preserved";

  if (!infrastructureResilient || !continuitySustainable) return null;

  return createObservation(
    "adaptive_evolution_reinforcement",
    "evolutionarily_stable",
    "adaptive",
    "infrastructure_adaptation",
    "Infrastructure resilience improving operational continuity — adaptive evolution reinforcement strengthens long-horizon ecosystem transformation pathways.",
    [
      "adaptive_evolution_reinforcement",
      "infrastructure_continuity_improvement",
      "resilience_maturation_signal",
    ],
    [],
    0.87,
    now
  );
}

function buildMacroSystemReorganizationAwareness(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const governancePressure =
    input.governanceSnapshot?.governanceStatus === "monitored" ||
    input.governanceSnapshot?.governanceStatus === "degraded" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";
  const syncReorganizing =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "partially_connected" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized";

  if (!governancePressure || !syncReorganizing) return null;

  return createObservation(
    "macro_system_reorganization_awareness",
    "reorganizing",
    "systemic",
    "governance_adaptation",
    "Governance coordination restructuring under pressure — macro-system reorganization awareness tracks bounded institutional evolution without autonomous societal planning.",
    [
      "macro_system_reorganization_awareness",
      "governance_coordination_restructuring",
      "institutional_evolution_pressure",
    ],
    ["coordination_transition_risk"],
    0.86,
    now
  );
}

function buildCivilizationScaleAdaptationDurability(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const workforceAdaptive =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";
  const influenceStabilizing =
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState === "ecosystem_active" ||
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState ===
      "systemically_influential";

  if (!workforceAdaptive || !influenceStabilizing) return null;

  return createObservation(
    "civilization_scale_adaptation_durability",
    "adaptive",
    "civilization_scale",
    "workforce_adaptation",
    "Workforce adaptation stabilizing ecosystem survivability — civilization-scale adaptation durability reinforces macro-operational evolution coherence.",
    [
      "civilization_scale_adaptation_durability",
      "workforce_survivability_stabilization",
      "ecosystem_adaptation_maturity",
    ],
    [],
    0.9,
    now
  );
}

function buildSystemicEvolutionTransition(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const fragilityShifting =
    (input.civilizationFragilitySnapshot?.observationCount ?? 0) >= 2 && input.fragilityElevated;
  const evolutionTemporal =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "evolving" ||
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "emerging";

  if (!fragilityShifting || !evolutionTemporal) return null;

  return createObservation(
    "systemic_evolution_transition",
    "shifting",
    "moderate",
    "resilience_adaptation",
    "Fragility patterns shifting across operational systems — systemic evolution transition maps bounded transformation overlap without uncontrolled future-evolution simulation.",
    [
      "systemic_evolution_transition",
      "fragility_pattern_shift",
      "operational_system_realignment",
    ],
    ["unstable_transformation_overlap"],
    0.84,
    now
  );
}

function buildMacroOperationalMaturityReinforcement(
  input: CivilizationAdaptationInput,
  now: number
): LongHorizonEvolutionObservation | null {
  const resilienceMature =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";
  const narrative =
    (input.resilienceForecastLine?.trim().length ?? 0) > 0 ||
    (input.enterpriseNarrativeLine?.trim().length ?? 0) > 0;
  const consensusStable =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";

  if (!resilienceMature || !consensusStable) return null;

  return createObservation(
    "macro_operational_maturity_reinforcement",
    narrative ? "evolutionarily_stable" : "adaptive",
    "systemic",
    "resilience_adaptation",
    "Long-horizon resilience mechanisms strengthening — macro-operational maturity reinforcement stabilizes civilization-scale adaptation fields across evolving ecosystems.",
    [
      "macro_operational_maturity_reinforcement",
      "long_horizon_resilience_strengthening",
      "adaptation_field_stabilization",
    ],
    [],
    narrative ? 0.89 : 0.87,
    now
  );
}

function buildEvolutionSignal(
  observation: LongHorizonEvolutionObservation,
  now: number
): MacroEvolutionSignal {
  return {
    signalId: stableSignature(["macro-evolution-signal", observation.adaptationId]).slice(0, 48),
    signalLabel: observation.evolutionState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.adaptationCategory]),
    signalIntensity:
      observation.adaptationStrength === "civilization_scale" ||
      observation.adaptationStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildTransformationField(
  observation: LongHorizonEvolutionObservation,
  now: number
): EcosystemTransformationField | null {
  if (
    observation.evolutionState !== "shifting" &&
    observation.evolutionState !== "adaptive" &&
    observation.evolutionState !== "reorganizing" &&
    observation.evolutionState !== "evolutionarily_stable"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["ecosystem-transformation-field", observation.adaptationId]).slice(
      0,
      48
    ),
    fieldLabel: observation.evolutionState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    transformationPosture:
      observation.adaptationStrength === "civilization_scale"
        ? "executive_grade"
        : observation.adaptationStrength === "systemic" || observation.adaptationStrength === "adaptive"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.adaptationCategory]),
    generatedAt: now,
  };
}

function buildAdaptationTopology(
  observation: LongHorizonEvolutionObservation,
  now: number
): SystemicAdaptationTopology | null {
  if (observation.evolutionRisks.length < 1 && observation.adaptationStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["systemic-adaptation-topology", observation.adaptationId]).slice(
      0,
      48
    ),
    topologyLabel: observation.adaptationCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    adaptationPosture:
      observation.evolutionRisks.length > 0
        ? "high"
        : observation.evolutionState === "evolutionarily_stable" ||
            observation.evolutionState === "reorganizing"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.adaptationCategory]),
    generatedAt: now,
  };
}

function buildAdaptationSnapshot(
  organizationId: string,
  observations: LongHorizonEvolutionObservation[],
  signals: MacroEvolutionSignal[],
  fields: EcosystemTransformationField[],
  topologies: SystemicAdaptationTopology[],
  now: number
): CivilizationAdaptationSnapshot {
  const top = observations[0];
  const adaptationSummary: CivilizationAdaptationSummary = top
    ? {
        dominantEvolutionState: top.evolutionState,
        dominantAdaptationStrength: top.adaptationStrength,
        adaptationHeadline: top.summary,
        evolutionPosture:
          top.adaptationStrength === "civilization_scale"
            ? "executive_grade"
            : top.adaptationStrength === "systemic" || top.adaptationStrength === "adaptive"
              ? "high"
              : top.adaptationStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantEvolutionState: "static",
        dominantAdaptationStrength: "weak",
        adaptationHeadline:
          "Civilization adaptation awaiting sufficient civilization continuity depth.",
        evolutionPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-6-civilization-adaptation-snapshot",
    organizationId,
    observations.map((o) => o.adaptationId),
    adaptationSummary.evolutionPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    adaptationSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    evolutionSignals: Object.freeze(signals.slice(0, 6)),
    transformationFields: Object.freeze(fields.slice(0, 6)),
    adaptationTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateCivilizationAdaptationIntelligence(
  input: CivilizationAdaptationInput
): CivilizationAdaptationResult {
  if (!beginCivilizationAdaptationEvaluation()) {
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
    const store = getCivilizationAdaptationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-6-civilization-adaptation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.civilizationContinuitySnapshot?.signature ?? "no-continuity",
      input.institutionalInfluenceSnapshot?.signature ?? "no-influence",
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
      !shouldEvaluateCivilizationAdaptation(
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

    if (!hasCivilizationContinuityDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_civilization_continuity_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < CIVILIZATION_ADAPTATION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < CIVILIZATION_ADAPTATION_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: LongHorizonEvolutionObservation[] = [];

    const evolutionField = buildCivilizationScaleEvolutionField(input, now);
    if (evolutionField) candidates.push(evolutionField);

    const adaptationSignal = buildEcosystemAdaptationSignal(input, now);
    if (adaptationSignal) candidates.push(adaptationSignal);

    const evolutionReinforcement = buildAdaptiveEvolutionReinforcement(input, now);
    if (evolutionReinforcement) candidates.push(evolutionReinforcement);

    const reorganizationAwareness = buildMacroSystemReorganizationAwareness(input, now);
    if (reorganizationAwareness) candidates.push(reorganizationAwareness);

    const adaptationDurability = buildCivilizationScaleAdaptationDurability(input, now);
    if (adaptationDurability) candidates.push(adaptationDurability);

    const evolutionTransition = buildSystemicEvolutionTransition(input, now);
    if (evolutionTransition) candidates.push(evolutionTransition);

    const maturityReinforcement = buildMacroOperationalMaturityReinforcement(input, now);
    if (maturityReinforcement) candidates.push(maturityReinforcement);

    const retained = candidates
      .filter(shouldRetainLongHorizonEvolutionObservation)
      .sort(
        (a, b) =>
          evolutionStateRank(b.evolutionState) - evolutionStateRank(a.evolutionState) ||
          adaptationStrengthRank(b.adaptationStrength) - adaptationStrengthRank(a.adaptationStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.adaptationId));
    const newCount = retained.filter((o) => !priorIds.has(o.adaptationId)).length;

    const signals = retained.map((o) => buildEvolutionSignal(o, now));
    const fields = retained
      .map((o) => buildTransformationField(o, now))
      .filter((f): f is EcosystemTransformationField => f !== null);
    const topologies = retained
      .map((o) => buildAdaptationTopology(o, now))
      .filter((t): t is SystemicAdaptationTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertEvolutionSignals(signals, now);
    store.upsertTransformationFields(fields, now);
    store.upsertAdaptationTopologies(topologies, now);

    const snapshot = buildAdaptationSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastEvolutionState(snapshot.adaptationSummary.dominantEvolutionState);

    const finalState = store.getState();
    const priorState = prior.lastEvolutionState;

    if (evolutionField || adaptationSignal || reorganizationAwareness) {
      devLog("ecosystem adaptation emergence — macro-system evolution pathways advancing");
    }

    if (reorganizationAwareness || evolutionTransition) {
      devLog("macro-system restructuring — operational topology transformation detected");
    }

    if (evolutionReinforcement || maturityReinforcement || adaptationDurability) {
      devLog("civilization-scale evolution stabilization — long-horizon adaptation maturing");
    }

    if (evolutionTransition) {
      devLog("operational topology transformation — systemic evolution transition mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.adaptationSummary.dominantEvolutionState &&
      (snapshot.adaptationSummary.dominantEvolutionState === "reorganizing" ||
        snapshot.adaptationSummary.dominantEvolutionState === "evolutionarily_stable")
    ) {
      devLog(
        `evolution maturation — ${priorState} → ${snapshot.adaptationSummary.dominantEvolutionState}`
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
    endCivilizationAdaptationEvaluation();
  }
}
