import { stableSignature } from "../intelligence/shared/dedupe";
import { evolutionStateRank } from "./civilizationAdaptationGuards";
import {
  beginCivilizationCoordinationEvaluation,
  clampCivilizationCoordinationConfidence,
  coordinationStrengthRank,
  CIVILIZATION_COORDINATION_MIN_ADAPTATION_OBSERVATIONS,
  CIVILIZATION_COORDINATION_MIN_CONSENSUS_SUBSYSTEMS,
  CIVILIZATION_COORDINATION_MIN_UNIFIED_LAYERS,
  endCivilizationCoordinationEvaluation,
  harmonyStateRank,
  shouldEvaluateCivilizationCoordination,
  shouldRetainCoordinationStabilityObservation,
} from "./civilizationCoordinationGuards";
import { getCivilizationCoordinationStore } from "./civilizationCoordinationStore";
import type {
  CivilizationCoordinationInput,
  CivilizationCoordinationResult,
  CivilizationCoordinationSnapshot,
  CivilizationCoordinationSummary,
  CoordinationCategory,
  CoordinationStrength,
  CoordinationStabilityObservation,
  EcosystemAlignmentTopology,
  HarmonyState,
  InstitutionalHarmonySignal,
  MacroOperationalCoherenceField,
} from "./civilizationCoordinationTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][CivilizationCoordination]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildCoordinationId(label: string): string {
  return stableSignature(["civilization-coordination", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: CivilizationCoordinationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasCivilizationAdaptationDepth(input: CivilizationCoordinationInput): boolean {
  const snapshot = input.civilizationAdaptationSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= CIVILIZATION_COORDINATION_MIN_ADAPTATION_OBSERVATIONS &&
    evolutionStateRank(snapshot.adaptationSummary.dominantEvolutionState) >=
      evolutionStateRank("adaptive")
  );
}

function hasInstitutionalConsciousnessDepth(input: CivilizationCoordinationInput): boolean {
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
  harmonyState: HarmonyState,
  coordinationStrength: CoordinationStrength,
  coordinationCategory: CoordinationCategory,
  summary: string,
  coordinationSignals: string[],
  coordinationRisks: string[],
  confidence: number,
  now: number
): CoordinationStabilityObservation {
  return {
    coordinationId: buildCoordinationId(label),
    harmonyState,
    coordinationStrength,
    coordinationCategory,
    summary,
    coordinationSignals: Object.freeze(coordinationSignals),
    coordinationRisks: Object.freeze(coordinationRisks),
    confidence: clampCivilizationCoordinationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleHarmonyField(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const adaptationReady = hasCivilizationAdaptationDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    CIVILIZATION_COORDINATION_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= CIVILIZATION_COORDINATION_MIN_UNIFIED_LAYERS;

  if (!adaptationReady || !consciousnessReady || !consensusMature || !layersReady) return null;

  return createObservation(
    "civilization_scale_harmony_field_01",
    "coordinated",
    "systemic",
    "systemic_harmony",
    "Governance, logistics, infrastructure, and resilience systems are maintaining coordinated macro-operational coherence under elevated ecosystem pressure, reinforcing civilization-scale operational continuity.",
    [
      "distributed_resilience_alignment",
      "ecosystem_harmony_reinforcement",
      "institutional_stabilization",
      "macro_operational_coherence",
    ],
    ["localized_infrastructure_fragmentation"],
    0.92,
    now
  );
}

function buildInstitutionalHarmonyReinforcement(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const governanceStable =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable" &&
    (input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture ===
        "institutional_grade");
  const logisticsAligned =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "systemically_integrated";

  if (!governanceStable || !logisticsAligned) return null;

  return createObservation(
    "institutional_harmony_reinforcement",
    "harmonized",
    "stable",
    "governance_coordination",
    "Governance and logistics systems stabilizing together — institutional harmony reinforcement strengthens macro-operational alignment without ideological governance behavior.",
    [
      "institutional_harmony_reinforcement",
      "governance_logistics_alignment",
      "ecosystem_stabilization_coordination",
    ],
    [],
    0.9,
    now
  );
}

function buildMacroCoherenceDegradationWarning(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const infrastructureFragmented =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "degraded" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "unstable";
  const syncDisconnected =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "disconnected" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "partially_connected";

  if (!infrastructureFragmented || !syncDisconnected) return null;

  return createObservation(
    "macro_coherence_degradation_warning",
    "unstable",
    "moderate",
    "infrastructure_coordination",
    "Infrastructure fragmentation disrupting coordination — macro-coherence degradation warning maps bounded systemic incoherence without societal-control simulation.",
    [
      "macro_coherence_degradation_warning",
      "infrastructure_fragmentation_disruption",
      "coordination_incoherence_risk",
    ],
    ["localized_infrastructure_fragmentation"],
    0.86,
    now
  );
}

function buildCivilizationScaleOperationalHarmony(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const resilienceSynchronized =
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState === "resilient" ||
    input.civilizationFragilitySnapshot?.resilienceSummary.dominantResilienceState ===
      "macro_stabilized";
  const consensusContinuous =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";

  if (!resilienceSynchronized || !consensusContinuous) return null;

  return createObservation(
    "civilization_scale_operational_harmony",
    "harmonized",
    "civilization_scale",
    "resilience_coordination",
    "Distributed resilience systems synchronizing effectively — civilization-scale operational harmony reinforces ecosystem coherence across interconnected institutional networks.",
    [
      "civilization_scale_operational_harmony",
      "distributed_resilience_synchronization",
      "macro_operational_harmony",
    ],
    [],
    0.91,
    now
  );
}

function buildCoordinationSurvivabilityReinforcement(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const adaptationMature =
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState === "adaptive" ||
    input.civilizationAdaptationSnapshot?.adaptationSummary.dominantEvolutionState ===
      "evolutionarily_stable";
  const continuitySustainable =
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "sustainable" ||
    input.civilizationContinuitySnapshot?.continuitySummary.dominantSustainabilityState ===
      "continuity_preserved";

  if (!adaptationMature || !continuitySustainable) return null;

  return createObservation(
    "coordination_survivability_reinforcement",
    "coordinated",
    "systemic",
    "ecosystem_alignment",
    "Ecosystem adaptation increasing alignment durability — coordination survivability reinforcement stabilizes long-horizon macro-operational coherence.",
    [
      "coordination_survivability_reinforcement",
      "adaptation_alignment_durability",
      "ecosystem_coordination_maturity",
    ],
    [],
    0.88,
    now
  );
}

function buildSystemicIncoherenceSignal(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const systemsDiverging =
    input.fragilityElevated &&
    (input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented" ||
      input.unifiedConsensusSnapshot?.runtimeStatus === "adaptive");
  const influenceAmplified =
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState ===
      "civilization_scale_impact" ||
    input.institutionalInfluenceSnapshot?.impactSummary.dominantImpactState ===
      "systemically_influential";

  if (!systemsDiverging || !influenceAmplified) return null;

  return createObservation(
    "systemic_incoherence_signal",
    "fragmented",
    "moderate",
    "systemic_harmony",
    "Multiple institutional systems diverging simultaneously — systemic incoherence signal reflects bounded coordination strain without political decision systems.",
    [
      "systemic_incoherence_signal",
      "multi_system_divergence",
      "institutional_alignment_strain",
    ],
    ["coordination_fragmentation_risk"],
    0.84,
    now
  );
}

function buildCivilizationGradeCoordinationStability(
  input: CivilizationCoordinationInput,
  now: number
): CoordinationStabilityObservation | null {
  const syncStable =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "systemically_integrated" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "civilization_coherent";
  const pressureManaged = input.continuityPreserved === true && !input.operationalTopologyStressed;
  const consensusStable =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";

  if (!syncStable || !consensusStable) return null;

  return createObservation(
    "civilization_grade_coordination_stability",
    pressureManaged ? "civilization_coherent" : "coordinated",
    "systemic",
    "logistics_coordination",
    "Operational ecosystems maintaining stable synchronization under pressure — civilization-grade coordination stability preserves macro-institutional harmony.",
    [
      "civilization_grade_coordination_stability",
      "stable_synchronization_under_pressure",
      "macro_coordination_resilience",
    ],
    [],
    pressureManaged ? 0.9 : 0.87,
    now
  );
}

function buildHarmonySignal(
  observation: CoordinationStabilityObservation,
  now: number
): InstitutionalHarmonySignal {
  return {
    signalId: stableSignature(["institutional-harmony-signal", observation.coordinationId]).slice(
      0,
      48
    ),
    signalLabel: observation.harmonyState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.coordinationCategory]),
    signalIntensity:
      observation.coordinationStrength === "civilization_scale" ||
      observation.coordinationStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildCoherenceField(
  observation: CoordinationStabilityObservation,
  now: number
): MacroOperationalCoherenceField | null {
  if (
    observation.harmonyState !== "coordinated" &&
    observation.harmonyState !== "harmonized" &&
    observation.harmonyState !== "civilization_coherent"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["macro-coherence-field", observation.coordinationId]).slice(0, 48),
    fieldLabel: observation.harmonyState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    coherencePosture:
      observation.coordinationStrength === "civilization_scale"
        ? "executive_grade"
        : observation.coordinationStrength === "systemic" ||
            observation.coordinationStrength === "stable"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.coordinationCategory]),
    generatedAt: now,
  };
}

function buildAlignmentTopology(
  observation: CoordinationStabilityObservation,
  now: number
): EcosystemAlignmentTopology | null {
  if (observation.coordinationRisks.length < 1 && observation.coordinationStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["ecosystem-alignment-topology", observation.coordinationId]).slice(
      0,
      48
    ),
    topologyLabel: observation.coordinationCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    alignmentPosture:
      observation.coordinationRisks.length > 0
        ? "high"
        : observation.harmonyState === "harmonized" ||
            observation.harmonyState === "civilization_coherent"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.coordinationCategory]),
    generatedAt: now,
  };
}

function buildCoordinationSnapshot(
  organizationId: string,
  observations: CoordinationStabilityObservation[],
  signals: InstitutionalHarmonySignal[],
  fields: MacroOperationalCoherenceField[],
  topologies: EcosystemAlignmentTopology[],
  now: number
): CivilizationCoordinationSnapshot {
  const top = observations[0];
  const coordinationSummary: CivilizationCoordinationSummary = top
    ? {
        dominantHarmonyState: top.harmonyState,
        dominantCoordinationStrength: top.coordinationStrength,
        coordinationHeadline: top.summary,
        harmonyPosture:
          top.coordinationStrength === "civilization_scale"
            ? "executive_grade"
            : top.coordinationStrength === "systemic" || top.coordinationStrength === "stable"
              ? "high"
              : top.coordinationStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantHarmonyState: "fragmented",
        dominantCoordinationStrength: "weak",
        coordinationHeadline:
          "Civilization coordination awaiting sufficient civilization adaptation depth.",
        harmonyPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-7-civilization-coordination-snapshot",
    organizationId,
    observations.map((o) => o.coordinationId),
    coordinationSummary.harmonyPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    coordinationSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    harmonySignals: Object.freeze(signals.slice(0, 6)),
    coherenceFields: Object.freeze(fields.slice(0, 6)),
    alignmentTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateCivilizationCoordinationIntelligence(
  input: CivilizationCoordinationInput
): CivilizationCoordinationResult {
  if (!beginCivilizationCoordinationEvaluation()) {
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
    const store = getCivilizationCoordinationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-7-civilization-coordination-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateCivilizationCoordination(
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

    if (!hasCivilizationAdaptationDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_civilization_adaptation_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < CIVILIZATION_COORDINATION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < CIVILIZATION_COORDINATION_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: CoordinationStabilityObservation[] = [];

    const harmonyField = buildCivilizationScaleHarmonyField(input, now);
    if (harmonyField) candidates.push(harmonyField);

    const harmonyReinforcement = buildInstitutionalHarmonyReinforcement(input, now);
    if (harmonyReinforcement) candidates.push(harmonyReinforcement);

    const coherenceDegradation = buildMacroCoherenceDegradationWarning(input, now);
    if (coherenceDegradation) candidates.push(coherenceDegradation);

    const operationalHarmony = buildCivilizationScaleOperationalHarmony(input, now);
    if (operationalHarmony) candidates.push(operationalHarmony);

    const survivabilityReinforcement = buildCoordinationSurvivabilityReinforcement(input, now);
    if (survivabilityReinforcement) candidates.push(survivabilityReinforcement);

    const incoherenceSignal = buildSystemicIncoherenceSignal(input, now);
    if (incoherenceSignal) candidates.push(incoherenceSignal);

    const coordinationStability = buildCivilizationGradeCoordinationStability(input, now);
    if (coordinationStability) candidates.push(coordinationStability);

    const retained = candidates
      .filter(shouldRetainCoordinationStabilityObservation)
      .sort(
        (a, b) =>
          harmonyStateRank(b.harmonyState) - harmonyStateRank(a.harmonyState) ||
          coordinationStrengthRank(b.coordinationStrength) -
            coordinationStrengthRank(a.coordinationStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.coordinationId));
    const newCount = retained.filter((o) => !priorIds.has(o.coordinationId)).length;

    const signals = retained.map((o) => buildHarmonySignal(o, now));
    const fields = retained
      .map((o) => buildCoherenceField(o, now))
      .filter((f): f is MacroOperationalCoherenceField => f !== null);
    const topologies = retained
      .map((o) => buildAlignmentTopology(o, now))
      .filter((t): t is EcosystemAlignmentTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertHarmonySignals(signals, now);
    store.upsertCoherenceFields(fields, now);
    store.upsertAlignmentTopologies(topologies, now);

    const snapshot = buildCoordinationSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastHarmonyState(snapshot.coordinationSummary.dominantHarmonyState);

    const finalState = store.getState();
    const priorState = prior.lastHarmonyState;

    if (harmonyField || operationalHarmony || coordinationStability) {
      devLog("macro-coordination emergence — civilization-scale coherence pathways advancing");
    }

    if (harmonyReinforcement || survivabilityReinforcement) {
      devLog("institutional harmony stabilization — ecosystem alignment reinforced");
    }

    if (coherenceDegradation || incoherenceSignal) {
      devLog("ecosystem fragmentation detection — macro-coherence strain mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.coordinationSummary.dominantHarmonyState &&
      (snapshot.coordinationSummary.dominantHarmonyState === "harmonized" ||
        snapshot.coordinationSummary.dominantHarmonyState === "civilization_coherent")
    ) {
      devLog(
        `civilization-scale coherence shifts — ${priorState} → ${snapshot.coordinationSummary.dominantHarmonyState}`
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
    endCivilizationCoordinationEvaluation();
  }
}
