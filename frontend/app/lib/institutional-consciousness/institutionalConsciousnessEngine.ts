import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginInstitutionalConsciousnessEvaluation,
  clampInstitutionalConfidence,
  endInstitutionalConsciousnessEvaluation,
  institutionalStateRank,
  awarenessStrengthRank,
  INSTITUTIONAL_CONSCIOUSNESS_MIN_CONSENSUS_SUBSYSTEMS,
  INSTITUTIONAL_CONSCIOUSNESS_MIN_UNIFIED_LAYERS,
  shouldEvaluateInstitutionalConsciousness,
  shouldRetainMacroOperationalObservation,
} from "./institutionalConsciousnessGuards";
import { getInstitutionalConsciousnessStore } from "./institutionalConsciousnessStore";
import type {
  AwarenessCategory,
  AwarenessStrength,
  CivilizationScaleAwarenessField,
  EcosystemOperationalSignal,
  EnterpriseEcosystemRelationship,
  InstitutionalAwarenessSummary,
  InstitutionalConsciousnessInput,
  InstitutionalConsciousnessResult,
  InstitutionalConsciousnessSnapshot,
  InstitutionalState,
  MacroOperationalObservation,
} from "./institutionalConsciousnessTypes";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalConsciousness]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAwarenessId(label: string): string {
  return stableSignature(["institutional-consciousness", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: InstitutionalConsciousnessInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function createObservation(
  label: string,
  institutionalState: InstitutionalState,
  awarenessStrength: AwarenessStrength,
  awarenessCategory: AwarenessCategory,
  summary: string,
  ecosystemSignals: string[],
  ecosystemRisks: string[],
  confidence: number,
  now: number
): MacroOperationalObservation {
  return {
    institutionalAwarenessId: buildAwarenessId(label),
    institutionalState,
    awarenessStrength,
    awarenessCategory,
    summary,
    ecosystemSignals: Object.freeze(ecosystemSignals),
    ecosystemRisks: Object.freeze(ecosystemRisks),
    confidence: clampInstitutionalConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseEcosystemAwareness(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
      INSTITUTIONAL_CONSCIOUSNESS_MIN_CONSENSUS_SUBSYSTEMS;
  const memoryLesson =
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const layersReady = countActiveUnifiedLayers(input) >= INSTITUTIONAL_CONSCIOUSNESS_MIN_UNIFIED_LAYERS;

  if (!consensusMature || !layersReady || !memoryLesson) return null;

  return createObservation(
    "enterprise_ecosystem_awareness_01",
    "ecosystem_aware",
    "systemic",
    "operational_ecosystem_awareness",
    "Enterprise operational stability is increasingly influenced by external governance pressure, infrastructure dependencies, and distributed supply-chain fragility across interconnected institutional systems.",
    [
      "systemic_dependency_exposure",
      "macro_operational_pressure",
      "institutional_interconnectivity",
      "external_fragility_propagation",
    ],
    ["regional_coordination_instability"],
    memoryLesson ? 0.9 : 0.88,
    now
  );
}

function buildEcosystemAwarenessReinforcement(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const topologyStress =
    input.operationalTopologyStressed ||
    input.fragilityElevated ||
    (input.memorySnapshot?.summary.strategicMemoryContinuity === "strained");
  const dependencySignals =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "fragmenting";

  if (!topologyStress && !dependencySignals) return null;

  return createObservation(
    "ecosystem_awareness_reinforcement",
    "systemically_integrated",
    "strong",
    "systemic_dependency_awareness",
    "Supply-chain and operational-topology fragility propagating across multiple systems — ecosystem-awareness reinforcement structures macro dependency exposure without autonomous authority.",
    [
      "ecosystem_awareness_reinforcement",
      "supply_chain_fragility_propagation",
      "operational_topology_stress",
    ],
    ["infrastructure_cascade_risk"],
    0.87,
    now
  );
}

function buildMacroOperationalDependencySignal(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const governancePressure =
    input.fragilityElevated ||
    input.governanceSnapshot?.governanceStatus === "monitored" ||
    input.governanceSnapshot?.governanceStatus === "degraded" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";
  const consensusFragile =
    input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "adaptive";

  if (!governancePressure) return null;

  return createObservation(
    "macro_operational_dependency_signal",
    consensusFragile ? "connected" : "ecosystem_aware",
    "strong",
    "governance_awareness",
    "Governance instability increasing operational pressure — macro-operational dependency signal maps institutional governance strain onto broader ecosystem coordination pathways.",
    [
      "macro_operational_dependency_signal",
      "governance_pressure_propagation",
      "institutional_coordination_strain",
    ],
    ["policy_volatility_exposure"],
    0.85,
    now
  );
}

function buildInstitutionalInfluenceAwareness(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";
  const foresightActive =
    input.foresightSnapshot != null &&
    input.foresightSnapshot.runtimeStatus !== "initializing";
  const narrative =
    (input.enterpriseNarrativeLine?.trim().length ?? 0) > 0 ||
    (input.cognitionSnapshot?.organizationalLearningLine?.trim().length ?? 0) > 0;

  if (!decisionStable || !foresightActive) return null;

  return createObservation(
    "institutional_influence_awareness",
    "connected",
    "moderate",
    "economic_awareness",
    "Enterprise decisions influencing external coordination systems — institutional influence awareness tracks outward propagation of strategic actions across operational networks.",
    [
      "institutional_influence_awareness",
      "external_coordination_influence",
      "strategic_action_propagation",
    ],
    [],
    narrative ? 0.86 : 0.84,
    now
  );
}

function buildCivilizationScaleInterconnectivity(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const consensusStable =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";
  const metaReliable =
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "governed" ||
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "enterprise_grade";
  const layers = countActiveUnifiedLayers(input);

  if (!consensusStable || layers < INSTITUTIONAL_CONSCIOUSNESS_MIN_UNIFIED_LAYERS) return null;

  return createObservation(
    "civilization_scale_interconnectivity",
    metaReliable ? "institutionally_conscious" : "systemically_integrated",
    "civilization_scale",
    "societal_awareness",
    "Distributed cognition identifying ecosystem fragility — civilization-scale interconnectivity detection reflects bounded macro-awareness across institutional, temporal, and consensus runtimes.",
    [
      "civilization_scale_interconnectivity",
      "distributed_cognition_ecosystem_mapping",
      "macro_system_coherence",
    ],
    [],
    0.91,
    now
  );
}

function buildSystemicInterconnectedness(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const dependencies =
    (input.memorySnapshot?.runtimeStatus === "stable" ? 1 : 0) +
    (input.temporalSnapshot?.runtimeStatus === "stable" ? 1 : 0) +
    (input.foresightSnapshot?.runtimeStatus === "stable" ? 1 : 0) +
    (input.decisionSnapshot?.runtimeStatus === "stable" ? 1 : 0);

  if (dependencies < 3) return null;

  return createObservation(
    "systemic_interconnectedness_signal",
    "systemically_integrated",
    "systemic",
    "infrastructure_awareness",
    "Multiple enterprise dependencies converging — systemic interconnectedness signal models operational coupling across memory, temporal, foresight, and decision substrates.",
    [
      "systemic_interconnectedness",
      "multi_runtime_dependency_convergence",
      "enterprise_network_coupling",
    ],
    ["single_point_fragility_risk"],
    0.86,
    now
  );
}

function buildEnterpriseEcosystemCoherence(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const resilient =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";
  const continuity =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";
  const resilienceLine = (input.resilienceForecastLine?.trim().length ?? 0) > 0;

  if (!resilient && !continuity && !resilienceLine) return null;

  return createObservation(
    "enterprise_ecosystem_coherence",
    "ecosystem_aware",
    "strong",
    "institutional_resilience_awareness",
    "Institutional resilience stabilizing broader operational networks — enterprise ecosystem coherence reinforces macro survivability without claiming autonomous consciousness.",
    [
      "enterprise_ecosystem_coherence",
      "institutional_resilience_stabilization",
      "macro_network_coherence",
    ],
    [],
    0.88,
    now
  );
}

function buildExternalFragilityPropagation(
  input: InstitutionalConsciousnessInput,
  now: number
): MacroOperationalObservation | null {
  const diversityFragile =
    input.unifiedConsensusSnapshot?.summary.diversityState === "constrained" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented";
  const externalStress = input.fragilityElevated && !input.continuityPreserved;

  if (!diversityFragile && !externalStress) return null;

  return createObservation(
    "external_fragility_propagation",
    "connected",
    "moderate",
    "operational_ecosystem_awareness",
    "Institutional fragility propagation detected — external operational pressures reshaping enterprise coordination through interconnected ecosystem pathways.",
    [
      "external_fragility_propagation",
      "ecosystem_pressure_reshaping",
      "institutional_fragility_awareness",
    ],
    ["cross_system_instability_risk"],
    0.79,
    now
  );
}

function buildEcosystemSignal(
  observation: MacroOperationalObservation,
  now: number
): EcosystemOperationalSignal {
  return {
    signalId: stableSignature(["ecosystem-signal", observation.institutionalAwarenessId]).slice(0, 48),
    signalLabel: observation.institutionalState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.awarenessCategory]),
    signalIntensity:
      observation.awarenessStrength === "civilization_scale" ||
      observation.awarenessStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildAwarenessField(
  observation: MacroOperationalObservation,
  now: number
): CivilizationScaleAwarenessField | null {
  if (
    observation.institutionalState !== "ecosystem_aware" &&
    observation.institutionalState !== "systemically_integrated" &&
    observation.institutionalState !== "institutionally_conscious"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["awareness-field", observation.institutionalAwarenessId]).slice(0, 48),
    fieldLabel: observation.institutionalState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    awarenessPosture:
      observation.awarenessStrength === "civilization_scale"
        ? "executive_grade"
        : observation.awarenessStrength === "systemic" || observation.awarenessStrength === "strong"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.awarenessCategory]),
    generatedAt: now,
  };
}

function buildEcosystemRelationship(
  observation: MacroOperationalObservation,
  now: number
): EnterpriseEcosystemRelationship | null {
  if (observation.ecosystemRisks.length < 1 && observation.awarenessStrength === "weak") {
    return null;
  }
  return {
    relationshipId: stableSignature(["ecosystem-relationship", observation.institutionalAwarenessId]).slice(
      0,
      48
    ),
    relationshipLabel: observation.awarenessCategory.replace(/_/g, " "),
    relationshipSummary: observation.summary.slice(0, 100),
    dependencyPosture:
      observation.ecosystemRisks.length > 0
        ? "high"
        : observation.awarenessStrength === "systemic" ||
            observation.awarenessStrength === "civilization_scale"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.awarenessCategory]),
    generatedAt: now,
  };
}

function buildInstitutionalSnapshot(
  organizationId: string,
  observations: MacroOperationalObservation[],
  signals: EcosystemOperationalSignal[],
  fields: CivilizationScaleAwarenessField[],
  relationships: EnterpriseEcosystemRelationship[],
  now: number
): InstitutionalConsciousnessSnapshot {
  const top = observations[0];
  const awarenessSummary: InstitutionalAwarenessSummary = top
    ? {
        dominantInstitutionalState: top.institutionalState,
        dominantAwarenessStrength: top.awarenessStrength,
        awarenessHeadline: top.summary,
        ecosystemPosture:
          top.awarenessStrength === "civilization_scale"
            ? "executive_grade"
            : top.awarenessStrength === "systemic" || top.awarenessStrength === "strong"
              ? "high"
              : top.awarenessStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantInstitutionalState: "isolated",
        dominantAwarenessStrength: "weak",
        awarenessHeadline:
          "Institutional consciousness awaiting sufficient unified consensus runtime depth.",
        ecosystemPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-1-institutional-consciousness-snapshot",
    organizationId,
    observations.map((o) => o.institutionalAwarenessId),
    awarenessSummary.ecosystemPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    ecosystemSignals: Object.freeze(signals.slice(0, 6)),
    awarenessFields: Object.freeze(fields.slice(0, 6)),
    ecosystemRelationships: Object.freeze(relationships.slice(0, 6)),
  };
}

export function evaluateInstitutionalConsciousness(
  input: InstitutionalConsciousnessInput
): InstitutionalConsciousnessResult {
  if (!beginInstitutionalConsciousnessEvaluation()) {
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
    const store = getInstitutionalConsciousnessStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-1-institutional-consciousness-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateInstitutionalConsciousness(
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

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < INSTITUTIONAL_CONSCIOUSNESS_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < INSTITUTIONAL_CONSCIOUSNESS_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: MacroOperationalObservation[] = [];

    const primaryAwareness = buildEnterpriseEcosystemAwareness(input, now);
    if (primaryAwareness) candidates.push(primaryAwareness);

    const reinforcement = buildEcosystemAwarenessReinforcement(input, now);
    if (reinforcement) candidates.push(reinforcement);

    const dependencySignal = buildMacroOperationalDependencySignal(input, now);
    if (dependencySignal) candidates.push(dependencySignal);

    const influenceAwareness = buildInstitutionalInfluenceAwareness(input, now);
    if (influenceAwareness) candidates.push(influenceAwareness);

    const interconnectivity = buildCivilizationScaleInterconnectivity(input, now);
    if (interconnectivity) candidates.push(interconnectivity);

    const systemicInterconnectedness = buildSystemicInterconnectedness(input, now);
    if (systemicInterconnectedness) candidates.push(systemicInterconnectedness);

    const ecosystemCoherence = buildEnterpriseEcosystemCoherence(input, now);
    if (ecosystemCoherence) candidates.push(ecosystemCoherence);

    const fragilityPropagation = buildExternalFragilityPropagation(input, now);
    if (fragilityPropagation) candidates.push(fragilityPropagation);

    const retained = candidates
      .filter(shouldRetainMacroOperationalObservation)
      .sort(
        (a, b) =>
          institutionalStateRank(b.institutionalState) - institutionalStateRank(a.institutionalState) ||
          awarenessStrengthRank(b.awarenessStrength) - awarenessStrengthRank(a.awarenessStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.institutionalAwarenessId));
    const newCount = retained.filter((o) => !priorIds.has(o.institutionalAwarenessId)).length;

    const signals = retained.map((o) => buildEcosystemSignal(o, now));
    const fields = retained
      .map((o) => buildAwarenessField(o, now))
      .filter((f): f is CivilizationScaleAwarenessField => f !== null);
    const relationships = retained
      .map((o) => buildEcosystemRelationship(o, now))
      .filter((r): r is EnterpriseEcosystemRelationship => r !== null);

    store.upsertObservations(retained, now);
    store.upsertEcosystemSignals(signals, now);
    store.upsertAwarenessFields(fields, now);
    store.upsertEcosystemRelationships(relationships, now);

    const snapshot = buildInstitutionalSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      relationships,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastInstitutionalState(snapshot.awarenessSummary.dominantInstitutionalState);

    const finalState = store.getState();
    const priorState = prior.lastInstitutionalState;

    if (primaryAwareness || interconnectivity || systemicInterconnectedness) {
      devLog("ecosystem-awareness emergence — macro-operational dependency topology advancing");
    }

    if (dependencySignal || fragilityPropagation) {
      devLog("institutional fragility propagation — external pressure pathways detected");
    }

    if (interconnectivity) {
      devLog("civilization-scale interconnectivity detection — bounded macro-system awareness formed");
    }

    if (reinforcement || ecosystemCoherence) {
      devLog("macro-operational dependency formation — ecosystem coherence signals reinforced");
    }

    if (
      priorState &&
      priorState !== snapshot.awarenessSummary.dominantInstitutionalState &&
      (snapshot.awarenessSummary.dominantInstitutionalState === "systemically_integrated" ||
        snapshot.awarenessSummary.dominantInstitutionalState === "institutionally_conscious")
    ) {
      devLog(
        `ecosystem-awareness maturation — ${priorState} → ${snapshot.awarenessSummary.dominantInstitutionalState}`
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
    endInstitutionalConsciousnessEvaluation();
  }
}
