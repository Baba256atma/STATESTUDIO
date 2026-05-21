import { stableSignature } from "../intelligence/shared/dedupe";
import { impactStateRank } from "./institutionalInfluenceGuards";
import {
  beginCivilizationContinuityEvaluation,
  clampCivilizationContinuityConfidence,
  continuityStrengthRank,
  CIVILIZATION_CONTINUITY_MIN_CONSENSUS_SUBSYSTEMS,
  CIVILIZATION_CONTINUITY_MIN_INFLUENCE_OBSERVATIONS,
  CIVILIZATION_CONTINUITY_MIN_UNIFIED_LAYERS,
  endCivilizationContinuityEvaluation,
  shouldEvaluateCivilizationContinuity,
  shouldRetainEcosystemSurvivabilityObservation,
  sustainabilityStateRank,
} from "./civilizationContinuityGuards";
import { getCivilizationContinuityStore } from "./civilizationContinuityStore";
import type {
  CivilizationContinuityInput,
  CivilizationContinuityResult,
  CivilizationContinuitySnapshot,
  CivilizationContinuitySummary,
  ContinuityCategory,
  ContinuityStrength,
  EcosystemSurvivabilityObservation,
  LongHorizonResilienceField,
  MacroSustainabilitySignal,
  OperationalContinuityTopology,
  SustainabilityState,
} from "./civilizationContinuityTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][CivilizationContinuity]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildContinuityId(label: string): string {
  return stableSignature(["civilization-continuity", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: CivilizationContinuityInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasInstitutionalInfluenceDepth(input: CivilizationContinuityInput): boolean {
  const snapshot = input.institutionalInfluenceSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= CIVILIZATION_CONTINUITY_MIN_INFLUENCE_OBSERVATIONS &&
    impactStateRank(snapshot.impactSummary.dominantImpactState) >= impactStateRank("distributed")
  );
}

function hasInstitutionalConsciousnessDepth(input: CivilizationContinuityInput): boolean {
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
  sustainabilityState: SustainabilityState,
  continuityStrength: ContinuityStrength,
  continuityCategory: ContinuityCategory,
  summary: string,
  continuitySignals: string[],
  sustainabilityRisks: string[],
  confidence: number,
  now: number
): EcosystemSurvivabilityObservation {
  return {
    continuityId: buildContinuityId(label),
    sustainabilityState,
    continuityStrength,
    continuityCategory,
    summary,
    continuitySignals: Object.freeze(continuitySignals),
    sustainabilityRisks: Object.freeze(sustainabilityRisks),
    confidence: clampCivilizationContinuityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleOperationalSurvivability(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const influenceReady = hasInstitutionalInfluenceDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    CIVILIZATION_CONTINUITY_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= CIVILIZATION_CONTINUITY_MIN_UNIFIED_LAYERS;

  if (!influenceReady || !consciousnessReady || !consensusMature || !layersReady) return null;

  return createObservation(
    "civilization_scale_operational_survivability_01",
    "adaptive",
    "resilient",
    "institutional_survivability",
    "Infrastructure resilience, governance continuity, and distributed ecosystem coordination are reinforcing long-horizon operational survivability despite rising fragility pressure across logistics and workforce systems.",
    [
      "long_horizon_resilience_reinforcement",
      "ecosystem_sustainability_alignment",
      "distributed_operational_continuity",
      "macro_stabilization_fields",
    ],
    ["workforce_fragility_accumulation"],
    0.91,
    now
  );
}

function buildSustainabilityReinforcement(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const infrastructureResilient =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";
  const logisticsContinuity =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "systemically_integrated";

  if (!infrastructureResilient || !logisticsContinuity) return null;

  return createObservation(
    "sustainability_reinforcement",
    "sustainable",
    "resilient",
    "logistics_continuity",
    "Infrastructure resilience preserving logistics continuity — sustainability reinforcement strengthens long-horizon ecosystem durability without speculative forecasting behavior.",
    [
      "sustainability_reinforcement",
      "infrastructure_logistics_continuity",
      "long_horizon_durability",
    ],
    [],
    0.88,
    now
  );
}

function buildContinuityFragilityWarning(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const optimizationPressure =
    input.fragilityElevated &&
    input.operationalTopologyStressed &&
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strained";
  const foresightRushed =
    input.foresightSnapshot?.runtimeStatus === "degraded" ||
    input.foresightSnapshot?.runtimeStatus === "unstable";

  if (!optimizationPressure || !foresightRushed) return null;

  return createObservation(
    "continuity_fragility_warning",
    "pressured",
    "moderate",
    "ecosystem_sustainability",
    "Short-term optimization degrading ecosystem durability — continuity fragility warning maps bounded long-horizon survivability risk without autonomous societal planning.",
    [
      "continuity_fragility_warning",
      "short_term_optimization_pressure",
      "ecosystem_durability_degradation",
    ],
    ["hidden_fragility_accumulation"],
    0.86,
    now
  );
}

function buildMacroOperationalContinuityCoherence(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const governanceStable =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable" &&
    (input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture ===
        "institutional_grade");
  const workforceContinuity =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";

  if (!governanceStable || !workforceContinuity) return null;

  return createObservation(
    "macro_operational_continuity_coherence",
    "adaptive",
    "stable",
    "governance_continuity",
    "Governance stability supporting workforce survivability — macro-operational continuity coherence reinforces civilization-scale persistence across institutional pathways.",
    [
      "macro_operational_continuity_coherence",
      "governance_workforce_survivability",
      "institutional_continuity_alignment",
    ],
    [],
    0.87,
    now
  );
}

function buildCivilizationScaleSustainabilitySignal(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const distributedResilience =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";
  const multiLayerReady = countActiveUnifiedLayers(input) >= CIVILIZATION_CONTINUITY_MIN_UNIFIED_LAYERS;

  if (!distributedResilience || !multiLayerReady) return null;

  return createObservation(
    "civilization_scale_sustainability_signal",
    "sustainable",
    "civilization_scale",
    "resilience_continuity",
    "Distributed resilience sustaining long-horizon operations — civilization-scale sustainability signal reflects bounded macro-operational survivability across interconnected ecosystems.",
    [
      "civilization_scale_sustainability_signal",
      "distributed_resilience_continuity",
      "long_horizon_operational_sustainability",
    ],
    [],
    0.9,
    now
  );
}

function buildLongHorizonContinuityDegradation(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const fragilityAccumulation =
    (input.civilizationFragilitySnapshot?.observationCount ?? 0) >= 2 &&
    input.fragilityElevated;
  const influenceAmplified =
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState ===
      "systemically_influential" ||
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState ===
      "civilization_scale_impact";

  if (!fragilityAccumulation || !influenceAmplified) return null;

  return createObservation(
    "long_horizon_continuity_degradation",
    "fragile",
    "moderate",
    "workforce_continuity",
    "Repeated fragility accumulation reducing survivability — long-horizon continuity degradation tracks bounded ecosystem pressure without speculative civilization prophecy.",
    [
      "long_horizon_continuity_degradation",
      "fragility_accumulation_pressure",
      "survivability_erosion_risk",
    ],
    ["workforce_fragility_accumulation"],
    0.84,
    now
  );
}

function buildOperationalSurvivabilityReinforcement(
  input: CivilizationContinuityInput,
  now: number
): EcosystemSurvivabilityObservation | null {
  const adaptationActive =
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "governed" ||
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "enterprise_grade";
  const continuityPath =
    input.continuityPreserved === true ||
    (input.resilienceForecastLine?.trim().length ?? 0) > 0;
  const temporalEvolving =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "stabilizing" ||
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "institutionalizing";

  if (!adaptationActive || !continuityPath) return null;

  return createObservation(
    "operational_survivability_reinforcement",
    temporalEvolving ? "continuity_preserved" : "sustainable",
    "resilient",
    "institutional_survivability",
    "Institutional adaptation stabilizing ecosystem persistence — operational survivability reinforcement strengthens macro-operational continuity across civilization-scale networks.",
    [
      "operational_survivability_reinforcement",
      "institutional_adaptation_stabilization",
      "ecosystem_persistence_reinforcement",
    ],
    [],
    temporalEvolving ? 0.89 : 0.87,
    now
  );
}

function buildSustainabilitySignal(
  observation: EcosystemSurvivabilityObservation,
  now: number
): MacroSustainabilitySignal {
  return {
    signalId: stableSignature(["macro-sustainability-signal", observation.continuityId]).slice(0, 48),
    signalLabel: observation.sustainabilityState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.continuityCategory]),
    signalIntensity:
      observation.continuityStrength === "civilization_scale" ||
      observation.continuityStrength === "resilient"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildResilienceField(
  observation: EcosystemSurvivabilityObservation,
  now: number
): LongHorizonResilienceField | null {
  if (
    observation.sustainabilityState !== "adaptive" &&
    observation.sustainabilityState !== "sustainable" &&
    observation.sustainabilityState !== "continuity_preserved"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["long-horizon-resilience-field", observation.continuityId]).slice(0, 48),
    fieldLabel: observation.sustainabilityState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    resiliencePosture:
      observation.continuityStrength === "civilization_scale"
        ? "executive_grade"
        : observation.continuityStrength === "resilient" || observation.continuityStrength === "stable"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.continuityCategory]),
    generatedAt: now,
  };
}

function buildContinuityTopology(
  observation: EcosystemSurvivabilityObservation,
  now: number
): OperationalContinuityTopology | null {
  if (observation.sustainabilityRisks.length < 1 && observation.continuityStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["operational-continuity-topology", observation.continuityId]).slice(
      0,
      48
    ),
    topologyLabel: observation.continuityCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    continuityPosture:
      observation.sustainabilityRisks.length > 0
        ? "high"
        : observation.sustainabilityState === "sustainable" ||
            observation.sustainabilityState === "continuity_preserved"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.continuityCategory]),
    generatedAt: now,
  };
}

function buildContinuitySnapshot(
  organizationId: string,
  observations: EcosystemSurvivabilityObservation[],
  signals: MacroSustainabilitySignal[],
  fields: LongHorizonResilienceField[],
  topologies: OperationalContinuityTopology[],
  now: number
): CivilizationContinuitySnapshot {
  const top = observations[0];
  const continuitySummary: CivilizationContinuitySummary = top
    ? {
        dominantSustainabilityState: top.sustainabilityState,
        dominantContinuityStrength: top.continuityStrength,
        continuityHeadline: top.summary,
        survivabilityPosture:
          top.continuityStrength === "civilization_scale"
            ? "executive_grade"
            : top.continuityStrength === "resilient" || top.continuityStrength === "stable"
              ? "high"
              : top.continuityStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantSustainabilityState: "fragile",
        dominantContinuityStrength: "weak",
        continuityHeadline:
          "Civilization continuity awaiting sufficient institutional influence depth.",
        survivabilityPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-5-civilization-continuity-snapshot",
    organizationId,
    observations.map((o) => o.continuityId),
    continuitySummary.survivabilityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    continuitySummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    sustainabilitySignals: Object.freeze(signals.slice(0, 6)),
    resilienceFields: Object.freeze(fields.slice(0, 6)),
    continuityTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateCivilizationContinuityIntelligence(
  input: CivilizationContinuityInput
): CivilizationContinuityResult {
  if (!beginCivilizationContinuityEvaluation()) {
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
    const store = getCivilizationContinuityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-5-civilization-continuity-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateCivilizationContinuity(
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

    if (!hasInstitutionalInfluenceDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_influence_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < CIVILIZATION_CONTINUITY_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < CIVILIZATION_CONTINUITY_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: EcosystemSurvivabilityObservation[] = [];

    const survivability = buildCivilizationScaleOperationalSurvivability(input, now);
    if (survivability) candidates.push(survivability);

    const sustainabilityReinforcement = buildSustainabilityReinforcement(input, now);
    if (sustainabilityReinforcement) candidates.push(sustainabilityReinforcement);

    const fragilityWarning = buildContinuityFragilityWarning(input, now);
    if (fragilityWarning) candidates.push(fragilityWarning);

    const continuityCoherence = buildMacroOperationalContinuityCoherence(input, now);
    if (continuityCoherence) candidates.push(continuityCoherence);

    const sustainabilitySignal = buildCivilizationScaleSustainabilitySignal(input, now);
    if (sustainabilitySignal) candidates.push(sustainabilitySignal);

    const continuityDegradation = buildLongHorizonContinuityDegradation(input, now);
    if (continuityDegradation) candidates.push(continuityDegradation);

    const survivabilityReinforcement = buildOperationalSurvivabilityReinforcement(input, now);
    if (survivabilityReinforcement) candidates.push(survivabilityReinforcement);

    const retained = candidates
      .filter(shouldRetainEcosystemSurvivabilityObservation)
      .sort(
        (a, b) =>
          sustainabilityStateRank(b.sustainabilityState) -
            sustainabilityStateRank(a.sustainabilityState) ||
          continuityStrengthRank(b.continuityStrength) -
            continuityStrengthRank(a.continuityStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.continuityId));
    const newCount = retained.filter((o) => !priorIds.has(o.continuityId)).length;

    const signals = retained.map((o) => buildSustainabilitySignal(o, now));
    const fields = retained
      .map((o) => buildResilienceField(o, now))
      .filter((f): f is LongHorizonResilienceField => f !== null);
    const topologies = retained
      .map((o) => buildContinuityTopology(o, now))
      .filter((t): t is OperationalContinuityTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertSustainabilitySignals(signals, now);
    store.upsertResilienceFields(fields, now);
    store.upsertContinuityTopologies(topologies, now);

    const snapshot = buildContinuitySnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastSustainabilityState(snapshot.continuitySummary.dominantSustainabilityState);

    const finalState = store.getState();
    const priorState = prior.lastSustainabilityState;

    if (survivability || sustainabilitySignal || survivabilityReinforcement) {
      devLog("macro-operational survivability shifts — long-horizon continuity advancing");
    }

    if (sustainabilityReinforcement || continuityCoherence) {
      devLog("sustainability reinforcement emergence — ecosystem durability pathways strengthening");
    }

    if (fragilityWarning || continuityDegradation) {
      devLog("continuity degradation — long-horizon fragility accumulation detected");
    }

    if (sustainabilityReinforcement || survivabilityReinforcement) {
      devLog("long-horizon resilience stabilization — operational survivability reinforced");
    }

    if (
      priorState &&
      priorState !== snapshot.continuitySummary.dominantSustainabilityState &&
      (snapshot.continuitySummary.dominantSustainabilityState === "sustainable" ||
        snapshot.continuitySummary.dominantSustainabilityState === "continuity_preserved")
    ) {
      devLog(
        `continuity recovery — ${priorState} → ${snapshot.continuitySummary.dominantSustainabilityState}`
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
    endCivilizationContinuityEvaluation();
  }
}
