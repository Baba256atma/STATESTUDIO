import { stableSignature } from "../intelligence/shared/dedupe";
import { harmonyStateRank } from "./civilizationCoordinationGuards";
import {
  beginCivilizationWisdomEvaluation,
  clampCivilizationWisdomConfidence,
  convergenceStateRank,
  CIVILIZATION_WISDOM_MIN_CONSENSUS_SUBSYSTEMS,
  CIVILIZATION_WISDOM_MIN_COORDINATION_OBSERVATIONS,
  CIVILIZATION_WISDOM_MIN_UNIFIED_LAYERS,
  endCivilizationWisdomEvaluation,
  shouldEvaluateCivilizationWisdom,
  shouldRetainLongHorizonWisdomObservation,
  wisdomStrengthRank,
} from "./civilizationWisdomGuards";
import { getCivilizationWisdomStore } from "./civilizationWisdomStore";
import type {
  CivilizationWisdomInput,
  CivilizationWisdomResult,
  CivilizationWisdomSnapshot,
  CivilizationWisdomSummary,
  InstitutionalLearningConvergenceSignal,
  LearningConvergenceState,
  LongHorizonWisdomObservation,
  MacroWisdomField,
  StrategicExperienceTopology,
  WisdomCategory,
  WisdomStrength,
} from "./civilizationWisdomTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][CivilizationWisdom]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildWisdomId(label: string): string {
  return stableSignature(["civilization-wisdom", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: CivilizationWisdomInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasCivilizationCoordinationDepth(input: CivilizationWisdomInput): boolean {
  const snapshot = input.civilizationCoordinationSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= CIVILIZATION_WISDOM_MIN_COORDINATION_OBSERVATIONS &&
    harmonyStateRank(snapshot.coordinationSummary.dominantHarmonyState) >=
      harmonyStateRank("coordinated")
  );
}

function hasInstitutionalMemoryDepth(input: CivilizationWisdomInput): boolean {
  const snapshot = input.memorySnapshot;
  if (!snapshot) return false;
  return snapshot.runtimeStatus !== "initializing" && snapshot.runtimeStatus !== "degraded";
}

function hasInstitutionalConsciousnessDepth(input: CivilizationWisdomInput): boolean {
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
  convergenceState: LearningConvergenceState,
  wisdomStrength: WisdomStrength,
  wisdomCategory: WisdomCategory,
  summary: string,
  wisdomSignals: string[],
  wisdomRisks: string[],
  confidence: number,
  now: number
): LongHorizonWisdomObservation {
  return {
    wisdomId: buildWisdomId(label),
    convergenceState,
    wisdomStrength,
    wisdomCategory,
    summary,
    wisdomSignals: Object.freeze(wisdomSignals),
    wisdomRisks: Object.freeze(wisdomRisks),
    confidence: clampCivilizationWisdomConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleLearningConvergence(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const coordinationReady = hasCivilizationCoordinationDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const memoryReady = hasInstitutionalMemoryDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    CIVILIZATION_WISDOM_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= CIVILIZATION_WISDOM_MIN_UNIFIED_LAYERS;

  if (!coordinationReady || !consciousnessReady || !memoryReady || !consensusMature || !layersReady) {
    return null;
  }

  return createObservation(
    "civilization_scale_learning_convergence_01",
    "converging",
    "systemic",
    "ecosystem_wisdom",
    "Civilization-scale operational ecosystems are converging toward resilience-oriented coordination, distributed continuity reinforcement, and adaptive ecosystem stabilization through accumulated long-horizon institutional learning.",
    [
      "resilience_learning_reinforcement",
      "distributed_coordination_maturity",
      "ecosystem_survivability_learning",
      "long_horizon_operational_adaptation",
    ],
    ["partial_fragility_pattern_recurrence"],
    0.92,
    now
  );
}

function buildResilienceWisdomConvergence(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const fragilityRepeated = input.fragilityElevated === true;
  const resilienceReinforced =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";

  if (!fragilityRepeated || !resilienceReinforced) return null;

  return createObservation(
    "resilience_wisdom_convergence",
    "adaptive",
    "mature",
    "resilience_wisdom",
    "Repeated fragility reinforcing resilience redundancy — resilience wisdom convergence accumulates experiential lessons without speculative philosophical reasoning.",
    [
      "resilience_wisdom_convergence",
      "resilience_redundancy_learning",
      "fragility_experience_accumulation",
    ],
    [],
    0.89,
    now
  );
}

function buildInstitutionalMaturityReinforcement(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const governanceAdaptive =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable";
  const adaptationImproving =
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState === "adaptive" ||
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState ===
      "evolutionarily_stable";
  const continuitySustainable =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "sustainable" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "continuity_preserved";

  if (!governanceAdaptive || !adaptationImproving || !continuitySustainable) return null;

  return createObservation(
    "institutional_maturity_reinforcement",
    "converging",
    "systemic",
    "governance_wisdom",
    "Governance adaptation improving ecosystem survivability — institutional maturity reinforcement strengthens macro-operational learning convergence.",
    [
      "institutional_maturity_reinforcement",
      "governance_adaptation_survivability",
      "ecosystem_learning_maturity",
    ],
    [],
    0.9,
    now
  );
}

function buildCivilizationScaleOperationalWisdom(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const coordinationMature =
    input.civilizationCoordinationSnapshot?.coordinationSummary.dominantHarmonyState ===
      "harmonized" ||
    input.civilizationCoordinationSnapshot?.coordinationSummary.dominantHarmonyState ===
      "civilization_coherent";
  const continuityPreserved = input.continuityPreserved === true;
  const consensusContinuous =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";

  if (!coordinationMature || !continuityPreserved || !consensusContinuous) return null;

  return createObservation(
    "civilization_scale_operational_wisdom",
    "wisdom_stabilized",
    "civilization_scale",
    "operational_wisdom",
    "Distributed coordination preserving continuity repeatedly — civilization-scale operational wisdom reinforces long-horizon strategic survivability patterns.",
    [
      "civilization_scale_operational_wisdom",
      "distributed_coordination_continuity",
      "macro_operational_wisdom_accumulation",
    ],
    [],
    0.91,
    now
  );
}

function buildMacroOperationalLearningConvergence(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const continuityLongHorizon =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "continuity_preserved" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "sustainable";
  const resilienceStabilizing =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient";
  const temporalMature =
    input.temporalSnapshot?.runtimeStatus === "stable" ||
    input.temporalSnapshot?.runtimeStatus === "recovering";

  if (!continuityLongHorizon || !resilienceStabilizing || !temporalMature) return null;

  return createObservation(
    "macro_operational_learning_convergence",
    "converging",
    "systemic",
    "continuity_wisdom",
    "Long-horizon resilience stabilizing ecosystems — macro-operational learning convergence reinforces civilization-scale experiential intelligence.",
    [
      "macro_operational_learning_convergence",
      "long_horizon_resilience_stabilization",
      "ecosystem_learning_coherence",
    ],
    [],
    0.88,
    now
  );
}

function buildFragilityLearningAccumulation(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const overCentralized =
    input.governanceSnapshot?.governanceStatus === "degraded" ||
    input.governanceSnapshot?.governanceStatus === "unstable";
  const syncFragile =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "disconnected" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "partially_connected";
  const fragilityRepeated = input.fragilityElevated === true;

  if (!overCentralized || !syncFragile || !fragilityRepeated) return null;

  return createObservation(
    "fragility_learning_accumulation",
    "emerging",
    "moderate",
    "infrastructure_wisdom",
    "Repeated over-centralization causing instability — fragility-learning accumulation maps bounded experiential lessons without ideological reasoning engines.",
    [
      "fragility_learning_accumulation",
      "over_centralization_instability_lesson",
      "resilience_correction_pathway",
    ],
    ["partial_fragility_pattern_recurrence"],
    0.85,
    now
  );
}

function buildStrategicWisdomMaturation(
  input: CivilizationWisdomInput,
  now: number
): LongHorizonWisdomObservation | null {
  const adaptationMaturing =
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState ===
      "evolutionarily_stable" ||
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState === "adaptive";
  const cascadingReduced =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState !== "unstable" &&
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState !== "pressured";
  const influenceStabilized =
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState !==
      "civilization_scale_impact";

  if (!adaptationMaturing || !cascadingReduced || !influenceStabilized) return null;

  return createObservation(
    "strategic_wisdom_maturation",
    "adaptive",
    "mature",
    "sustainability_wisdom",
    "Ecosystem adaptation reducing cascading failures over time — strategic wisdom maturation reinforces civilization-scale adaptation intelligence.",
    [
      "strategic_wisdom_maturation",
      "cascading_failure_reduction_learning",
      "ecosystem_adaptation_maturity",
    ],
    [],
    0.87,
    now
  );
}

function buildConvergenceSignal(
  observation: LongHorizonWisdomObservation,
  now: number
): InstitutionalLearningConvergenceSignal {
  return {
    signalId: stableSignature(["institutional-learning-convergence-signal", observation.wisdomId]).slice(
      0,
      48
    ),
    signalLabel: observation.convergenceState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.wisdomCategory]),
    signalIntensity:
      observation.wisdomStrength === "civilization_scale" ||
      observation.wisdomStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildWisdomField(
  observation: LongHorizonWisdomObservation,
  now: number
): MacroWisdomField | null {
  if (
    observation.convergenceState !== "converging" &&
    observation.convergenceState !== "adaptive" &&
    observation.convergenceState !== "wisdom_stabilized"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["macro-wisdom-field", observation.wisdomId]).slice(0, 48),
    fieldLabel: observation.convergenceState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    wisdomPosture:
      observation.wisdomStrength === "civilization_scale"
        ? "executive_grade"
        : observation.wisdomStrength === "systemic" || observation.wisdomStrength === "mature"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.wisdomCategory]),
    generatedAt: now,
  };
}

function buildExperienceTopology(
  observation: LongHorizonWisdomObservation,
  now: number
): StrategicExperienceTopology | null {
  if (observation.wisdomRisks.length < 1 && observation.wisdomStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["strategic-experience-topology", observation.wisdomId]).slice(0, 48),
    topologyLabel: observation.wisdomCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    experiencePosture:
      observation.wisdomRisks.length > 0
        ? "high"
        : observation.convergenceState === "converging" ||
            observation.convergenceState === "wisdom_stabilized"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.wisdomCategory]),
    generatedAt: now,
  };
}

function buildWisdomSnapshot(
  organizationId: string,
  observations: LongHorizonWisdomObservation[],
  signals: InstitutionalLearningConvergenceSignal[],
  fields: MacroWisdomField[],
  topologies: StrategicExperienceTopology[],
  now: number
): CivilizationWisdomSnapshot {
  const top = observations[0];
  const wisdomSummary: CivilizationWisdomSummary = top
    ? {
        dominantConvergenceState: top.convergenceState,
        dominantWisdomStrength: top.wisdomStrength,
        wisdomHeadline: top.summary,
        learningPosture:
          top.wisdomStrength === "civilization_scale"
            ? "executive_grade"
            : top.wisdomStrength === "systemic" || top.wisdomStrength === "mature"
              ? "high"
              : top.wisdomStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantConvergenceState: "fragmented",
        dominantWisdomStrength: "weak",
        wisdomHeadline:
          "Civilization wisdom awaiting sufficient civilization coordination depth.",
        learningPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-8-civilization-wisdom-snapshot",
    organizationId,
    observations.map((o) => o.wisdomId),
    wisdomSummary.learningPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    wisdomSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    convergenceSignals: Object.freeze(signals.slice(0, 6)),
    wisdomFields: Object.freeze(fields.slice(0, 6)),
    experienceTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateCivilizationWisdomIntelligence(
  input: CivilizationWisdomInput
): CivilizationWisdomResult {
  if (!beginCivilizationWisdomEvaluation()) {
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
    const store = getCivilizationWisdomStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-8-civilization-wisdom-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateCivilizationWisdom(
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

    if (!hasCivilizationCoordinationDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_civilization_coordination_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < CIVILIZATION_WISDOM_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < CIVILIZATION_WISDOM_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: LongHorizonWisdomObservation[] = [];

    const learningConvergence = buildCivilizationScaleLearningConvergence(input, now);
    if (learningConvergence) candidates.push(learningConvergence);

    const resilienceWisdom = buildResilienceWisdomConvergence(input, now);
    if (resilienceWisdom) candidates.push(resilienceWisdom);

    const maturityReinforcement = buildInstitutionalMaturityReinforcement(input, now);
    if (maturityReinforcement) candidates.push(maturityReinforcement);

    const operationalWisdom = buildCivilizationScaleOperationalWisdom(input, now);
    if (operationalWisdom) candidates.push(operationalWisdom);

    const learningConvergenceMacro = buildMacroOperationalLearningConvergence(input, now);
    if (learningConvergenceMacro) candidates.push(learningConvergenceMacro);

    const fragilityLearning = buildFragilityLearningAccumulation(input, now);
    if (fragilityLearning) candidates.push(fragilityLearning);

    const wisdomMaturation = buildStrategicWisdomMaturation(input, now);
    if (wisdomMaturation) candidates.push(wisdomMaturation);

    const retained = candidates
      .filter(shouldRetainLongHorizonWisdomObservation)
      .sort(
        (a, b) =>
          convergenceStateRank(b.convergenceState) - convergenceStateRank(a.convergenceState) ||
          wisdomStrengthRank(b.wisdomStrength) - wisdomStrengthRank(a.wisdomStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.wisdomId));
    const newCount = retained.filter((o) => !priorIds.has(o.wisdomId)).length;

    const signals = retained.map((o) => buildConvergenceSignal(o, now));
    const fields = retained
      .map((o) => buildWisdomField(o, now))
      .filter((f): f is MacroWisdomField => f !== null);
    const topologies = retained
      .map((o) => buildExperienceTopology(o, now))
      .filter((t): t is StrategicExperienceTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertConvergenceSignals(signals, now);
    store.upsertWisdomFields(fields, now);
    store.upsertExperienceTopologies(topologies, now);

    const snapshot = buildWisdomSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastConvergenceState(snapshot.wisdomSummary.dominantConvergenceState);

    const finalState = store.getState();
    const priorState = prior.lastConvergenceState;

    if (learningConvergence || operationalWisdom || learningConvergenceMacro) {
      devLog("learning-convergence emergence — civilization-scale experiential pathways advancing");
    }

    if (resilienceWisdom || maturityReinforcement) {
      devLog("resilience wisdom reinforcement — macro-operational learning stabilized");
    }

    if (operationalWisdom || wisdomMaturation) {
      devLog("civilization-scale maturity stabilization — strategic wisdom accumulation");
    }

    if (fragilityLearning) {
      devLog("operational wisdom accumulation — fragility-learning patterns mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.wisdomSummary.dominantConvergenceState &&
      (snapshot.wisdomSummary.dominantConvergenceState === "converging" ||
        snapshot.wisdomSummary.dominantConvergenceState === "wisdom_stabilized")
    ) {
      devLog(
        `learning-convergence shift — ${priorState} → ${snapshot.wisdomSummary.dominantConvergenceState}`
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
    endCivilizationWisdomEvaluation();
  }
}
