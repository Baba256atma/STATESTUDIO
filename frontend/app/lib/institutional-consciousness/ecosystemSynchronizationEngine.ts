import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginEcosystemSynchronizationEvaluation,
  clampEcosystemSyncConfidence,
  coordinationStateRank,
  ECOSYSTEM_SYNC_MIN_CONSCIOUSNESS_OBSERVATIONS,
  ECOSYSTEM_SYNC_MIN_CONSENSUS_SUBSYSTEMS,
  ECOSYSTEM_SYNC_MIN_UNIFIED_LAYERS,
  endEcosystemSynchronizationEvaluation,
  shouldEvaluateEcosystemSynchronization,
  shouldRetainOperationalSynchronizationObservation,
  synchronizationStrengthRank,
} from "./ecosystemSynchronizationGuards";
import { getEcosystemSynchronizationStore } from "./ecosystemSynchronizationStore";
import type {
  CivilizationScaleCoordinationField,
  CoordinationState,
  EcosystemSynchronizationInput,
  EcosystemSynchronizationResult,
  EcosystemSynchronizationSnapshot,
  EcosystemSynchronizationSummary,
  InstitutionalInterdependencySignal,
  MacroDependencyTopology,
  OperationalSynchronizationObservation,
  SynchronizationCategory,
  SynchronizationStrength,
} from "./ecosystemSynchronizationTypes";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][EcosystemSynchronization]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSyncId(label: string): string {
  return stableSignature(["ecosystem-synchronization", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: EcosystemSynchronizationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasInstitutionalConsciousnessDepth(input: EcosystemSynchronizationInput): boolean {
  const snapshot = input.institutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= ECOSYSTEM_SYNC_MIN_CONSCIOUSNESS_OBSERVATIONS &&
    institutionalStateRank(snapshot.awarenessSummary.dominantInstitutionalState) >=
      institutionalStateRank("connected")
  );
}

function createObservation(
  label: string,
  coordinationState: CoordinationState,
  synchronizationStrength: SynchronizationStrength,
  synchronizationCategory: SynchronizationCategory,
  summary: string,
  synchronizationSignals: string[],
  ecosystemRisks: string[],
  confidence: number,
  now: number
): OperationalSynchronizationObservation {
  return {
    synchronizationId: buildSyncId(label),
    coordinationState,
    synchronizationStrength,
    synchronizationCategory,
    summary,
    synchronizationSignals: Object.freeze(synchronizationSignals),
    ecosystemRisks: Object.freeze(ecosystemRisks),
    confidence: clampEcosystemSyncConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleDependencyField(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    ECOSYSTEM_SYNC_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= ECOSYSTEM_SYNC_MIN_UNIFIED_LAYERS;

  if (!consciousnessReady || !consensusMature || !layersReady) return null;

  return createObservation(
    "civilization_scale_dependency_field_01",
    "synchronized",
    "systemic",
    "infrastructure_synchronization",
    "Infrastructure, logistics, governance, and workforce systems are increasingly synchronized under elevated operational pressure, creating both macro-fragility exposure and coordinated resilience-stabilization opportunities.",
    [
      "cross_system_dependency_alignment",
      "macro_operational_coordination",
      "distributed_resilience_reinforcement",
      "institutional_interconnectivity",
    ],
    ["cascading_fragility_propagation"],
    0.91,
    now
  );
}

function buildMacroFragilityPropagation(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const topologyStress =
    input.operationalTopologyStressed ||
    input.fragilityElevated ||
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strained";
  const temporalFragmenting =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "fragmenting";

  if (!topologyStress || !temporalFragmenting) return null;

  return createObservation(
    "macro_fragility_propagation",
    "partially_connected",
    "strong",
    "fragility_synchronization",
    "Supply-chain and energy instability synchronizing across logistics, production, and workforce coordination — macro-fragility propagation maps cross-system pressure without autonomous orchestration.",
    [
      "macro_fragility_propagation",
      "supply_chain_energy_synchronization",
      "cross_system_pressure_alignment",
    ],
    ["cascading_fragility_propagation"],
    0.88,
    now
  );
}

function buildResilienceSynchronizationReinforcement(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const governanceStable =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable" &&
    (input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture ===
        "institutional_grade");
  const infrastructureAligned =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";

  if (!governanceStable || !infrastructureAligned) return null;

  return createObservation(
    "resilience_synchronization_reinforcement",
    "synchronized",
    "strong",
    "resilience_synchronization",
    "Governance and infrastructure stabilization aligning — resilience synchronization reinforcement strengthens macro-operational coordination fields across institutional substrates.",
    [
      "resilience_synchronization_reinforcement",
      "governance_infrastructure_alignment",
      "macro_coordination_stabilization",
    ],
    [],
    0.87,
    now
  );
}

function buildCivilizationScaleCoordinationSignal(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const pressureConvergence =
    input.fragilityElevated &&
    (input.unifiedConsensusSnapshot?.runtimeStatus === "adaptive" ||
      input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented");
  const systemsConverging =
    countActiveUnifiedLayers(input) >= ECOSYSTEM_SYNC_MIN_UNIFIED_LAYERS &&
    (input.institutionalConsciousnessSnapshot?.observationCount ?? 0) >= 2;

  if (!pressureConvergence || !systemsConverging) return null;

  return createObservation(
    "civilization_scale_coordination_signal",
    "systemically_integrated",
    "civilization_scale",
    "governance_synchronization",
    "Multiple institutional systems converging under pressure — civilization-scale coordination signal reflects bounded macro-synchronization across consensus, memory, and institutional consciousness runtimes.",
    [
      "civilization_scale_coordination_signal",
      "multi_system_pressure_convergence",
      "institutional_synchronization_pathway",
    ],
    ["coordination_saturation_risk"],
    0.9,
    now
  );
}

function buildSystemicSynchronizationDurability(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const continuity =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";
  const resilienceLine = (input.resilienceForecastLine?.trim().length ?? 0) > 0;
  const consciousnessCoherent =
    input.institutionalConsciousnessSnapshot?.awarenessSummary.dominantInstitutionalState ===
      "ecosystem_aware" ||
    input.institutionalConsciousnessSnapshot?.awarenessSummary.dominantInstitutionalState ===
      "systemically_integrated";

  if (!continuity && !resilienceLine && !consciousnessCoherent) return null;

  return createObservation(
    "systemic_synchronization_durability",
    "synchronized",
    "strong",
    "resilience_synchronization",
    "Distributed ecosystem resilience stabilizing operational continuity — systemic synchronization durability reinforces civilization-scale interdependency coherence.",
    [
      "systemic_synchronization_durability",
      "distributed_resilience_stabilization",
      "operational_continuity_reinforcement",
    ],
    [],
    0.86,
    now
  );
}

function buildInterdependencyAmplificationWarning(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const diversityFragile =
    input.unifiedConsensusSnapshot?.summary.diversityState === "constrained" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented";
  const externalStress = input.fragilityElevated && !input.continuityPreserved;

  if (!diversityFragile && !externalStress) return null;

  return createObservation(
    "interdependency_amplification_warning",
    "partially_connected",
    "moderate",
    "fragility_synchronization",
    "Fragility spreading across interconnected systems — interdependency amplification warning tracks cascading exposure across logistics, governance, and financial synchronization pathways.",
    [
      "interdependency_amplification_warning",
      "cascading_fragility_propagation",
      "cross_system_dependency_stress",
    ],
    ["macro_interdependency_cascade"],
    0.82,
    now
  );
}

function buildCivilizationGradeSynchronizationStability(
  input: EcosystemSynchronizationInput,
  now: number
): OperationalSynchronizationObservation | null {
  const consensusStable =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";
  const metaGoverned =
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "governed" ||
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "enterprise_grade";
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";

  if (!consensusStable || !decisionStable) return null;

  return createObservation(
    "civilization_grade_synchronization_stability",
    metaGoverned ? "civilization_coherent" : "systemically_integrated",
    "civilization_scale",
    "financial_synchronization",
    "Institutional coordination preserving macro-operational coherence — civilization-grade synchronization stability models bounded enterprise influence across interconnected operational networks.",
    [
      "civilization_grade_synchronization_stability",
      "macro_operational_coherence_preservation",
      "institutional_coordination_alignment",
    ],
    [],
    0.89,
    now
  );
}

function buildInterdependencySignal(
  observation: OperationalSynchronizationObservation,
  now: number
): InstitutionalInterdependencySignal {
  return {
    signalId: stableSignature(["interdependency-signal", observation.synchronizationId]).slice(0, 48),
    signalLabel: observation.coordinationState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.synchronizationCategory]),
    signalIntensity:
      observation.synchronizationStrength === "civilization_scale" ||
      observation.synchronizationStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildCoordinationField(
  observation: OperationalSynchronizationObservation,
  now: number
): CivilizationScaleCoordinationField | null {
  if (
    observation.coordinationState !== "synchronized" &&
    observation.coordinationState !== "systemically_integrated" &&
    observation.coordinationState !== "civilization_coherent"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["coordination-field", observation.synchronizationId]).slice(0, 48),
    fieldLabel: observation.coordinationState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    coordinationPosture:
      observation.synchronizationStrength === "civilization_scale"
        ? "executive_grade"
        : observation.synchronizationStrength === "systemic" ||
            observation.synchronizationStrength === "strong"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.synchronizationCategory]),
    generatedAt: now,
  };
}

function buildDependencyTopology(
  observation: OperationalSynchronizationObservation,
  now: number
): MacroDependencyTopology | null {
  if (observation.ecosystemRisks.length < 1 && observation.synchronizationStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["dependency-topology", observation.synchronizationId]).slice(0, 48),
    topologyLabel: observation.synchronizationCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    dependencyPosture:
      observation.ecosystemRisks.length > 0
        ? "high"
        : observation.synchronizationStrength === "systemic" ||
            observation.synchronizationStrength === "civilization_scale"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.synchronizationCategory]),
    generatedAt: now,
  };
}

function buildSynchronizationSnapshot(
  organizationId: string,
  observations: OperationalSynchronizationObservation[],
  signals: InstitutionalInterdependencySignal[],
  fields: CivilizationScaleCoordinationField[],
  topologies: MacroDependencyTopology[],
  now: number
): EcosystemSynchronizationSnapshot {
  const top = observations[0];
  const synchronizationSummary: EcosystemSynchronizationSummary = top
    ? {
        dominantCoordinationState: top.coordinationState,
        dominantSynchronizationStrength: top.synchronizationStrength,
        synchronizationHeadline: top.summary,
        interdependencyPosture:
          top.synchronizationStrength === "civilization_scale"
            ? "executive_grade"
            : top.synchronizationStrength === "systemic" || top.synchronizationStrength === "strong"
              ? "high"
              : top.synchronizationStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantCoordinationState: "disconnected",
        dominantSynchronizationStrength: "weak",
        synchronizationHeadline:
          "Ecosystem synchronization awaiting sufficient institutional consciousness depth.",
        interdependencyPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-2-ecosystem-synchronization-snapshot",
    organizationId,
    observations.map((o) => o.synchronizationId),
    synchronizationSummary.interdependencyPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    synchronizationSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    interdependencySignals: Object.freeze(signals.slice(0, 6)),
    coordinationFields: Object.freeze(fields.slice(0, 6)),
    dependencyTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateInstitutionalEcosystemSynchronization(
  input: EcosystemSynchronizationInput
): EcosystemSynchronizationResult {
  if (!beginEcosystemSynchronizationEvaluation()) {
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
    const store = getEcosystemSynchronizationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-2-ecosystem-synchronization-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.institutionalConsciousnessSnapshot?.signature ?? "no-consciousness",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateEcosystemSynchronization(
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

    if (!hasInstitutionalConsciousnessDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_consciousness_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < ECOSYSTEM_SYNC_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < ECOSYSTEM_SYNC_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: OperationalSynchronizationObservation[] = [];

    const dependencyField = buildCivilizationScaleDependencyField(input, now);
    if (dependencyField) candidates.push(dependencyField);

    const fragilityPropagation = buildMacroFragilityPropagation(input, now);
    if (fragilityPropagation) candidates.push(fragilityPropagation);

    const resilienceReinforcement = buildResilienceSynchronizationReinforcement(input, now);
    if (resilienceReinforcement) candidates.push(resilienceReinforcement);

    const coordinationSignal = buildCivilizationScaleCoordinationSignal(input, now);
    if (coordinationSignal) candidates.push(coordinationSignal);

    const syncDurability = buildSystemicSynchronizationDurability(input, now);
    if (syncDurability) candidates.push(syncDurability);

    const amplificationWarning = buildInterdependencyAmplificationWarning(input, now);
    if (amplificationWarning) candidates.push(amplificationWarning);

    const syncStability = buildCivilizationGradeSynchronizationStability(input, now);
    if (syncStability) candidates.push(syncStability);

    const retained = candidates
      .filter(shouldRetainOperationalSynchronizationObservation)
      .sort(
        (a, b) =>
          coordinationStateRank(b.coordinationState) - coordinationStateRank(a.coordinationState) ||
          synchronizationStrengthRank(b.synchronizationStrength) -
            synchronizationStrengthRank(a.synchronizationStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.synchronizationId));
    const newCount = retained.filter((o) => !priorIds.has(o.synchronizationId)).length;

    const signals = retained.map((o) => buildInterdependencySignal(o, now));
    const fields = retained
      .map((o) => buildCoordinationField(o, now))
      .filter((f): f is CivilizationScaleCoordinationField => f !== null);
    const topologies = retained
      .map((o) => buildDependencyTopology(o, now))
      .filter((t): t is MacroDependencyTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertInterdependencySignals(signals, now);
    store.upsertCoordinationFields(fields, now);
    store.upsertDependencyTopologies(topologies, now);

    const snapshot = buildSynchronizationSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastCoordinationState(snapshot.synchronizationSummary.dominantCoordinationState);

    const finalState = store.getState();
    const priorState = prior.lastCoordinationState;

    if (dependencyField || coordinationSignal || syncStability) {
      devLog("macro-synchronization emergence — civilization-scale coordination field advancing");
    }

    if (fragilityPropagation || amplificationWarning) {
      devLog("cascading fragility propagation — interdependency amplification pathways detected");
    }

    if (resilienceReinforcement || syncDurability) {
      devLog("civilization-scale coordination stabilization — resilience synchronization reinforced");
    }

    if (amplificationWarning) {
      devLog("interdependency amplification — cross-system fragility synchronization mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.synchronizationSummary.dominantCoordinationState &&
      (snapshot.synchronizationSummary.dominantCoordinationState === "systemically_integrated" ||
        snapshot.synchronizationSummary.dominantCoordinationState === "civilization_coherent")
    ) {
      devLog(
        `macro-synchronization maturation — ${priorState} → ${snapshot.synchronizationSummary.dominantCoordinationState}`
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
    endEcosystemSynchronizationEvaluation();
  }
}
