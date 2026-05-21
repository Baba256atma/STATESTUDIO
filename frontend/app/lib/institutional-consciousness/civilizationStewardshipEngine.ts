import { stableSignature } from "../intelligence/shared/dedupe";
import { convergenceStateRank } from "./civilizationWisdomGuards";
import {
  beginCivilizationStewardshipEvaluation,
  clampCivilizationStewardshipConfidence,
  CIVILIZATION_STEWARDSHIP_MIN_CONSENSUS_SUBSYSTEMS,
  CIVILIZATION_STEWARDSHIP_MIN_UNIFIED_LAYERS,
  CIVILIZATION_STEWARDSHIP_MIN_WISDOM_OBSERVATIONS,
  endCivilizationStewardshipEvaluation,
  preservationStateRank,
  shouldEvaluateCivilizationStewardship,
  shouldRetainLongHorizonStewardshipObservation,
  stewardshipStrengthRank,
} from "./civilizationStewardshipGuards";
import { getCivilizationStewardshipStore } from "./civilizationStewardshipStore";
import type {
  CivilizationStewardshipInput,
  CivilizationStewardshipResult,
  CivilizationStewardshipSnapshot,
  CivilizationStewardshipSummary,
  EcosystemSurvivabilityField,
  InstitutionalPreservationTopology,
  LongHorizonStewardshipObservation,
  MacroPreservationSignal,
  PreservationState,
  StewardshipCategory,
  StewardshipStrength,
} from "./civilizationStewardshipTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][CivilizationStewardship]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildStewardshipId(label: string): string {
  return stableSignature(["civilization-stewardship", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: CivilizationStewardshipInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasCivilizationWisdomDepth(input: CivilizationStewardshipInput): boolean {
  const snapshot = input.civilizationWisdomSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= CIVILIZATION_STEWARDSHIP_MIN_WISDOM_OBSERVATIONS &&
    convergenceStateRank(snapshot.wisdomSummary.dominantConvergenceState) >=
      convergenceStateRank("adaptive")
  );
}

function hasInstitutionalMemoryDepth(input: CivilizationStewardshipInput): boolean {
  const snapshot = input.memorySnapshot;
  if (!snapshot) return false;
  return snapshot.runtimeStatus !== "initializing" && snapshot.runtimeStatus !== "degraded";
}

function hasInstitutionalConsciousnessDepth(input: CivilizationStewardshipInput): boolean {
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
  preservationState: PreservationState,
  stewardshipStrength: StewardshipStrength,
  stewardshipCategory: StewardshipCategory,
  summary: string,
  stewardshipSignals: string[],
  preservationRisks: string[],
  confidence: number,
  now: number
): LongHorizonStewardshipObservation {
  return {
    stewardshipId: buildStewardshipId(label),
    preservationState,
    stewardshipStrength,
    stewardshipCategory,
    summary,
    stewardshipSignals: Object.freeze(stewardshipSignals),
    preservationRisks: Object.freeze(preservationRisks),
    confidence: clampCivilizationStewardshipConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleSurvivabilityPreservation(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const wisdomReady = hasCivilizationWisdomDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const memoryReady = hasInstitutionalMemoryDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    CIVILIZATION_STEWARDSHIP_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= CIVILIZATION_STEWARDSHIP_MIN_UNIFIED_LAYERS;

  if (!wisdomReady || !consciousnessReady || !memoryReady || !consensusMature || !layersReady) {
    return null;
  }

  return createObservation(
    "civilization_scale_survivability_preservation_01",
    "reinforced",
    "systemic",
    "ecosystem_preservation",
    "Distributed resilience coordination, infrastructure continuity, and ecosystem sustainability reinforcement are preserving civilization-scale operational survivability despite elevated macro-fragility pressure.",
    [
      "long_horizon_resilience_protection",
      "ecosystem_survivability_reinforcement",
      "institutional_continuity_preservation",
      "macro_operational_durability",
    ],
    ["resilience_reserve_degradation"],
    0.92,
    now
  );
}

function buildStewardshipReinforcement(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const infrastructureResilient =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";
  const continuityPreserved =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "continuity_preserved" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "sustainable";

  if (!infrastructureResilient || !continuityPreserved) return null;

  return createObservation(
    "stewardship_reinforcement",
    "reinforced",
    "resilient",
    "infrastructure_preservation",
    "Infrastructure resilience preserving long-term continuity — stewardship reinforcement strengthens macro-operational durability without ideological preservation systems.",
    [
      "stewardship_reinforcement",
      "infrastructure_continuity_preservation",
      "long_horizon_durability",
    ],
    [],
    0.9,
    now
  );
}

function buildPreservationRiskWarning(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const sustainabilityDegrading =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "fragile" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "pressured";
  const fragilityElevated = input.fragilityElevated === true;

  if (!sustainabilityDegrading || !fragilityElevated) return null;

  return createObservation(
    "preservation_risk_warning",
    "pressured",
    "moderate",
    "sustainability_preservation",
    "Sustainability degradation increasing systemic fragility — preservation-risk warning maps bounded survivability strain without moral-judgment systems.",
    [
      "preservation_risk_warning",
      "sustainability_degradation_fragility",
      "ecosystem_survivability_strain",
    ],
    ["resilience_reserve_degradation"],
    0.86,
    now
  );
}

function buildMacroSystemStewardshipCoherence(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const coordinationProtected =
    input.civilizationCoordinationSnapshot?.coordinationSummary.dominantHarmonyState ===
      "harmonized" ||
    input.civilizationCoordinationSnapshot?.coordinationSummary.dominantHarmonyState ===
      "civilization_coherent";
  const syncProtecting =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "systemically_integrated";

  if (!coordinationProtected || !syncProtecting) return null;

  return createObservation(
    "macro_system_stewardship_coherence",
    "protected",
    "systemic",
    "ecosystem_preservation",
    "Distributed ecosystem coordination protecting survivability — macro-system stewardship coherence reinforces civilization-scale operational preservation.",
    [
      "macro_system_stewardship_coherence",
      "distributed_survivability_protection",
      "ecosystem_coordination_preservation",
    ],
    [],
    0.89,
    now
  );
}

function buildCivilizationScalePreservationSignal(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const governanceStable =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable";
  const workforceContinuity =
    input.continuityPreserved === true &&
    (input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
      input.unifiedConsensusSnapshot?.summary.continuityState === "continuous");
  const operationalDurability =
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState === "adaptive" ||
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState ===
      "evolutionarily_stable";

  if (!governanceStable || !workforceContinuity || !operationalDurability) return null;

  return createObservation(
    "civilization_scale_preservation_signal",
    "sustainably_preserved",
    "civilization_scale",
    "workforce_preservation",
    "Workforce continuity stabilizing operational durability — civilization-scale preservation signal reinforces long-horizon ecosystem survivability.",
    [
      "civilization_scale_preservation_signal",
      "workforce_continuity_stabilization",
      "operational_durability_preservation",
    ],
    [],
    0.91,
    now
  );
}

function buildStewardshipFragilityConcern(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const overOptimized =
    input.operationalTopologyStressed === true &&
    (input.decisionSnapshot?.runtimeStatus === "unstable" ||
      input.decisionSnapshot?.runtimeStatus === "degraded");
  const reservesWeakened =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "unstable" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "pressured";

  if (!overOptimized || !reservesWeakened) return null;

  return createObservation(
    "stewardship_fragility_concern",
    "degrading",
    "moderate",
    "resilience_preservation",
    "Over-optimization weakening resilience reserves — stewardship fragility concern maps bounded preservation strain without autonomous societal-management behavior.",
    [
      "stewardship_fragility_concern",
      "resilience_reserve_depletion",
      "over_optimization_preservation_risk",
    ],
    ["resilience_reserve_degradation"],
    0.84,
    now
  );
}

function buildLongHorizonSurvivabilityReinforcement(
  input: CivilizationStewardshipInput,
  now: number
): LongHorizonStewardshipObservation | null {
  const continuityPreserving =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "continuity_preserved" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "sustainable";
  const resilienceProtected =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";
  const wisdomMature =
    input.civilizationWisdomSnapshot?.wisdomSummary.dominantConvergenceState === "converging" ||
    input.civilizationWisdomSnapshot?.wisdomSummary.dominantConvergenceState ===
      "wisdom_stabilized";

  if (!continuityPreserving || !resilienceProtected || !wisdomMature) return null;

  return createObservation(
    "long_horizon_survivability_reinforcement",
    "reinforced",
    "systemic",
    "continuity_preservation",
    "Institutional continuity preserving ecosystem resilience over time — long-horizon survivability reinforcement strengthens civilization-scale stewardship coherence.",
    [
      "long_horizon_survivability_reinforcement",
      "institutional_continuity_protection",
      "ecosystem_resilience_preservation",
    ],
    [],
    0.88,
    now
  );
}

function buildPreservationSignal(
  observation: LongHorizonStewardshipObservation,
  now: number
): MacroPreservationSignal {
  return {
    signalId: stableSignature(["macro-preservation-signal", observation.stewardshipId]).slice(0, 48),
    signalLabel: observation.preservationState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.stewardshipCategory]),
    signalIntensity:
      observation.stewardshipStrength === "civilization_scale" ||
      observation.stewardshipStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildSurvivabilityField(
  observation: LongHorizonStewardshipObservation,
  now: number
): EcosystemSurvivabilityField | null {
  if (
    observation.preservationState !== "protected" &&
    observation.preservationState !== "reinforced" &&
    observation.preservationState !== "sustainably_preserved"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["ecosystem-survivability-field", observation.stewardshipId]).slice(
      0,
      48
    ),
    fieldLabel: observation.preservationState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    survivabilityPosture:
      observation.stewardshipStrength === "civilization_scale"
        ? "executive_grade"
        : observation.stewardshipStrength === "systemic" ||
            observation.stewardshipStrength === "resilient"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.stewardshipCategory]),
    generatedAt: now,
  };
}

function buildPreservationTopology(
  observation: LongHorizonStewardshipObservation,
  now: number
): InstitutionalPreservationTopology | null {
  if (observation.preservationRisks.length < 1 && observation.stewardshipStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["institutional-preservation-topology", observation.stewardshipId]).slice(
      0,
      48
    ),
    topologyLabel: observation.stewardshipCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    preservationPosture:
      observation.preservationRisks.length > 0
        ? "high"
        : observation.preservationState === "reinforced" ||
            observation.preservationState === "sustainably_preserved"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.stewardshipCategory]),
    generatedAt: now,
  };
}

function buildStewardshipSnapshot(
  organizationId: string,
  observations: LongHorizonStewardshipObservation[],
  signals: MacroPreservationSignal[],
  fields: EcosystemSurvivabilityField[],
  topologies: InstitutionalPreservationTopology[],
  now: number
): CivilizationStewardshipSnapshot {
  const top = observations[0];
  const stewardshipSummary: CivilizationStewardshipSummary = top
    ? {
        dominantPreservationState: top.preservationState,
        dominantStewardshipStrength: top.stewardshipStrength,
        stewardshipHeadline: top.summary,
        preservationPosture:
          top.stewardshipStrength === "civilization_scale"
            ? "executive_grade"
            : top.stewardshipStrength === "systemic" || top.stewardshipStrength === "resilient"
              ? "high"
              : top.stewardshipStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantPreservationState: "degrading",
        dominantStewardshipStrength: "weak",
        stewardshipHeadline:
          "Civilization stewardship awaiting sufficient civilization wisdom depth.",
        preservationPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-9-civilization-stewardship-snapshot",
    organizationId,
    observations.map((o) => o.stewardshipId),
    stewardshipSummary.preservationPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    stewardshipSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    preservationSignals: Object.freeze(signals.slice(0, 6)),
    survivabilityFields: Object.freeze(fields.slice(0, 6)),
    preservationTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateCivilizationStewardshipIntelligence(
  input: CivilizationStewardshipInput
): CivilizationStewardshipResult {
  if (!beginCivilizationStewardshipEvaluation()) {
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
    const store = getCivilizationStewardshipStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-9-civilization-stewardship-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.civilizationWisdomSnapshot?.signature ?? "no-wisdom",
      input.civilizationCoordinationSnapshot?.signature ?? "no-coordination",
      input.civilizationAdaptationSnapshot?.signature ?? "no-adaptation",
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
      !shouldEvaluateCivilizationStewardship(
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

    if (!hasCivilizationWisdomDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_civilization_wisdom_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < CIVILIZATION_STEWARDSHIP_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < CIVILIZATION_STEWARDSHIP_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: LongHorizonStewardshipObservation[] = [];

    const survivabilityPreservation = buildCivilizationScaleSurvivabilityPreservation(input, now);
    if (survivabilityPreservation) candidates.push(survivabilityPreservation);

    const stewardshipReinforcement = buildStewardshipReinforcement(input, now);
    if (stewardshipReinforcement) candidates.push(stewardshipReinforcement);

    const preservationRisk = buildPreservationRiskWarning(input, now);
    if (preservationRisk) candidates.push(preservationRisk);

    const stewardshipCoherence = buildMacroSystemStewardshipCoherence(input, now);
    if (stewardshipCoherence) candidates.push(stewardshipCoherence);

    const preservationSignal = buildCivilizationScalePreservationSignal(input, now);
    if (preservationSignal) candidates.push(preservationSignal);

    const fragilityConcern = buildStewardshipFragilityConcern(input, now);
    if (fragilityConcern) candidates.push(fragilityConcern);

    const survivabilityReinforcement = buildLongHorizonSurvivabilityReinforcement(input, now);
    if (survivabilityReinforcement) candidates.push(survivabilityReinforcement);

    const retained = candidates
      .filter(shouldRetainLongHorizonStewardshipObservation)
      .sort(
        (a, b) =>
          preservationStateRank(b.preservationState) - preservationStateRank(a.preservationState) ||
          stewardshipStrengthRank(b.stewardshipStrength) -
            stewardshipStrengthRank(a.stewardshipStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.stewardshipId));
    const newCount = retained.filter((o) => !priorIds.has(o.stewardshipId)).length;

    const signals = retained.map((o) => buildPreservationSignal(o, now));
    const fields = retained
      .map((o) => buildSurvivabilityField(o, now))
      .filter((f): f is EcosystemSurvivabilityField => f !== null);
    const topologies = retained
      .map((o) => buildPreservationTopology(o, now))
      .filter((t): t is InstitutionalPreservationTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertPreservationSignals(signals, now);
    store.upsertSurvivabilityFields(fields, now);
    store.upsertPreservationTopologies(topologies, now);

    const snapshot = buildStewardshipSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastPreservationState(snapshot.stewardshipSummary.dominantPreservationState);

    const finalState = store.getState();
    const priorState = prior.lastPreservationState;

    if (survivabilityPreservation || preservationSignal || survivabilityReinforcement) {
      devLog("survivability-preservation emergence — civilization-scale continuity pathways advancing");
    }

    if (stewardshipReinforcement || stewardshipCoherence) {
      devLog("ecosystem durability reinforcement — macro-system preservation stabilized");
    }

    if (preservationSignal || survivabilityReinforcement) {
      devLog("long-horizon continuity stabilization — institutional preservation reinforced");
    }

    if (preservationRisk || fragilityConcern) {
      devLog("macro-system preservation risks — bounded survivability strain mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.stewardshipSummary.dominantPreservationState &&
      (snapshot.stewardshipSummary.dominantPreservationState === "reinforced" ||
        snapshot.stewardshipSummary.dominantPreservationState === "sustainably_preserved")
    ) {
      devLog(
        `preservation state shift — ${priorState} → ${snapshot.stewardshipSummary.dominantPreservationState}`
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
    endCivilizationStewardshipEvaluation();
  }
}
