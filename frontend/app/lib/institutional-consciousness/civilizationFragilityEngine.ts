import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginCivilizationFragilityEvaluation,
  clampCivilizationFragilityConfidence,
  CIVILIZATION_FRAGILITY_MIN_CONSENSUS_SUBSYSTEMS,
  CIVILIZATION_FRAGILITY_MIN_ECOSYSTEM_SYNC_OBSERVATIONS,
  CIVILIZATION_FRAGILITY_MIN_UNIFIED_LAYERS,
  endCivilizationFragilityEvaluation,
  propagationStrengthRank,
  resilienceStateRank,
  shouldEvaluateCivilizationFragility,
  shouldRetainCascadingInstabilityObservation,
} from "./civilizationFragilityGuards";
import { getCivilizationFragilityStore } from "./civilizationFragilityStore";
import type {
  CascadingInstabilityObservation,
  CivilizationFragilityInput,
  CivilizationFragilityResult,
  CivilizationFragilitySnapshot,
  CivilizationResilienceSummary,
  FragilityCategory,
  FragilityPropagationField,
  MacroResilienceSignal,
  PropagationStrength,
  ResilienceState,
  SystemicResilienceTopology,
} from "./civilizationFragilityTypes";
import { coordinationStateRank } from "./ecosystemSynchronizationGuards";
import { institutionalStateRank } from "./institutionalConsciousnessGuards";

const DEV_LOG_PREFIX = "[Nexora][CivilizationFragility]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildFragilityId(label: string): string {
  return stableSignature(["civilization-fragility", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: CivilizationFragilityInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasEcosystemSynchronizationDepth(input: CivilizationFragilityInput): boolean {
  const snapshot = input.ecosystemSynchronizationSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.observationCount >= CIVILIZATION_FRAGILITY_MIN_ECOSYSTEM_SYNC_OBSERVATIONS &&
    coordinationStateRank(snapshot.synchronizationSummary.dominantCoordinationState) >=
      coordinationStateRank("partially_connected")
  );
}

function hasInstitutionalConsciousnessDepth(input: CivilizationFragilityInput): boolean {
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
  resilienceState: ResilienceState,
  propagationStrength: PropagationStrength,
  fragilityCategory: FragilityCategory,
  summary: string,
  propagationSignals: string[],
  resilienceRisks: string[],
  confidence: number,
  now: number
): CascadingInstabilityObservation {
  return {
    fragilityId: buildFragilityId(label),
    resilienceState,
    propagationStrength,
    fragilityCategory,
    summary,
    propagationSignals: Object.freeze(propagationSignals),
    resilienceRisks: Object.freeze(resilienceRisks),
    confidence: clampCivilizationFragilityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCivilizationScaleFragilityField(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const syncReady = hasEcosystemSynchronizationDepth(input);
  const consciousnessReady = hasInstitutionalConsciousnessDepth(input);
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    CIVILIZATION_FRAGILITY_MIN_CONSENSUS_SUBSYSTEMS;
  const layersReady = countActiveUnifiedLayers(input) >= CIVILIZATION_FRAGILITY_MIN_UNIFIED_LAYERS;

  if (!syncReady || !consciousnessReady || !consensusMature || !layersReady) return null;

  return createObservation(
    "civilization_scale_fragility_field_01",
    "adaptive",
    "systemic",
    "energy_fragility",
    "Energy, logistics, and workforce systems are experiencing synchronized fragility propagation, while governance coordination and infrastructure resilience are partially absorbing macro-operational instability.",
    [
      "cross_system_instability_diffusion",
      "macro_pressure_concentration",
      "resilience_absorption_field",
      "institutional_stabilization",
    ],
    ["cascading_logistics_disruption"],
    0.91,
    now
  );
}

function buildCascadingFragilityField(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const energyLogisticsStress =
    input.operationalTopologyStressed ||
    input.fragilityElevated ||
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strained";
  const temporalFragmenting =
    input.temporalSnapshot?.summary?.organizationalEvolutionState === "fragmenting";

  if (!energyLogisticsStress || !temporalFragmenting) return null;

  return createObservation(
    "cascading_fragility_field",
    "pressured",
    "strong",
    "logistics_fragility",
    "Energy instability propagating into logistics — cascading fragility field maps bounded cross-system diffusion without speculative collapse simulation.",
    [
      "cascading_fragility_field",
      "energy_logistics_propagation",
      "operational_shock_diffusion",
    ],
    ["cascading_logistics_disruption"],
    0.88,
    now
  );
}

function buildResilienceAbsorptionReinforcement(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const governanceStable =
    input.governanceSnapshot?.governanceStatus !== "degraded" &&
    input.governanceSnapshot?.governanceStatus !== "unstable" &&
    (input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
      input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture ===
        "institutional_grade");
  const syncStabilized =
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "synchronized" ||
    input.ecosystemSynchronizationSnapshot?.synchronizationSummary.dominantCoordinationState ===
      "systemically_integrated";

  if (!governanceStable || !syncStabilized) return null;

  return createObservation(
    "resilience_absorption_reinforcement",
    "resilient",
    "strong",
    "governance_fragility",
    "Governance stabilization reducing ecosystem pressure — resilience absorption reinforcement strengthens macro-systemic continuity across institutional coordination pathways.",
    [
      "resilience_absorption_reinforcement",
      "governance_pressure_reduction",
      "ecosystem_stabilization_absorption",
    ],
    [],
    0.87,
    now
  );
}

function buildMacroResilienceCoherence(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const infrastructureResilient =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";
  const workforceContinuity =
    input.unifiedConsensusSnapshot?.summary.continuityState === "synchronized" ||
    input.unifiedConsensusSnapshot?.summary.continuityState === "continuous";

  if (!infrastructureResilient || !workforceContinuity) return null;

  return createObservation(
    "macro_resilience_coherence",
    "resilient",
    "strong",
    "infrastructure_fragility",
    "Infrastructure resilience stabilizing workforce continuity — macro-resilience coherence reinforces systemic absorption fields across interconnected operational substrates.",
    [
      "macro_resilience_coherence",
      "infrastructure_workforce_stabilization",
      "systemic_absorption_field",
    ],
    [],
    0.86,
    now
  );
}

function buildCivilizationScalePropagationWarning(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const fragilityConvergence =
    input.fragilityElevated &&
    (input.unifiedConsensusSnapshot?.runtimeStatus === "adaptive" ||
      input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented");
  const multiSystemStress =
    countActiveUnifiedLayers(input) >= CIVILIZATION_FRAGILITY_MIN_UNIFIED_LAYERS &&
    (input.ecosystemSynchronizationSnapshot?.observationCount ?? 0) >= 2;

  if (!fragilityConvergence || !multiSystemStress) return null;

  return createObservation(
    "civilization_scale_propagation_warning",
    "pressured",
    "civilization_scale",
    "financial_fragility",
    "Distributed fragility converging across multiple systems — civilization-scale propagation warning reflects bounded instability diffusion without autonomous civilization management.",
    [
      "civilization_scale_propagation_warning",
      "multi_system_fragility_convergence",
      "macro_instability_diffusion",
    ],
    ["interdependency_collapse_risk"],
    0.9,
    now
  );
}

function buildSystemicResilienceDurability(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const consensusStable =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";
  const institutionalCoherent =
    input.institutionalConsciousnessSnapshot?.awarenessSummary.dominantInstitutionalState ===
      "ecosystem_aware" ||
    input.institutionalConsciousnessSnapshot?.awarenessSummary.dominantInstitutionalState ===
      "systemically_integrated";

  if (!consensusStable || !institutionalCoherent) return null;

  return createObservation(
    "systemic_resilience_durability",
    "adaptive",
    "strong",
    "governance_fragility",
    "Institutional coordination reducing instability spread — systemic resilience durability models bounded survivability across civilization-scale operational networks.",
    [
      "systemic_resilience_durability",
      "institutional_coordination_stabilization",
      "instability_spread_reduction",
    ],
    [],
    0.85,
    now
  );
}

function buildMacroStabilizationReinforcement(
  input: CivilizationFragilityInput,
  now: number
): CascadingInstabilityObservation | null {
  const recoveryPathway =
    (input.resilienceForecastLine?.trim().length ?? 0) > 0 ||
    input.continuityPreserved === true;
  const metaGoverned =
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "governed" ||
    input.unifiedSelfReflectiveSnapshot?.governanceHealth === "enterprise_grade";
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";

  if (!recoveryPathway || !decisionStable) return null;

  return createObservation(
    "macro_stabilization_reinforcement",
    metaGoverned ? "macro_stabilized" : "resilient",
    "systemic",
    "workforce_fragility",
    "Recovery pathways absorbing operational shock — macro-stabilization reinforcement strengthens civilization-scale continuity without speculative collapse behavior.",
    [
      "macro_stabilization_reinforcement",
      "operational_shock_absorption",
      "recovery_pathway_reinforcement",
    ],
    [],
    0.89,
    now
  );
}

function buildResilienceSignal(
  observation: CascadingInstabilityObservation,
  now: number
): MacroResilienceSignal {
  return {
    signalId: stableSignature(["macro-resilience-signal", observation.fragilityId]).slice(0, 48),
    signalLabel: observation.resilienceState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.fragilityCategory]),
    signalIntensity:
      observation.propagationStrength === "civilization_scale" ||
      observation.propagationStrength === "systemic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildPropagationField(
  observation: CascadingInstabilityObservation,
  now: number
): FragilityPropagationField | null {
  if (
    observation.resilienceState !== "pressured" &&
    observation.resilienceState !== "adaptive" &&
    observation.resilienceState !== "resilient" &&
    observation.resilienceState !== "macro_stabilized"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["fragility-propagation-field", observation.fragilityId]).slice(0, 48),
    fieldLabel: observation.resilienceState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    propagationPosture:
      observation.propagationStrength === "civilization_scale"
        ? "executive_grade"
        : observation.propagationStrength === "systemic" ||
            observation.propagationStrength === "strong"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.fragilityCategory]),
    generatedAt: now,
  };
}

function buildResilienceTopology(
  observation: CascadingInstabilityObservation,
  now: number
): SystemicResilienceTopology | null {
  if (observation.resilienceRisks.length < 1 && observation.propagationStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["resilience-topology", observation.fragilityId]).slice(0, 48),
    topologyLabel: observation.fragilityCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    resiliencePosture:
      observation.resilienceRisks.length > 0
        ? "high"
        : observation.resilienceState === "resilient" ||
            observation.resilienceState === "macro_stabilized"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.fragilityCategory]),
    generatedAt: now,
  };
}

function buildFragilitySnapshot(
  organizationId: string,
  observations: CascadingInstabilityObservation[],
  signals: MacroResilienceSignal[],
  fields: FragilityPropagationField[],
  topologies: SystemicResilienceTopology[],
  now: number
): CivilizationFragilitySnapshot {
  const top = observations[0];
  const resilienceSummary: CivilizationResilienceSummary = top
    ? {
        dominantResilienceState: top.resilienceState,
        dominantPropagationStrength: top.propagationStrength,
        resilienceHeadline: top.summary,
        fragilityPosture:
          top.propagationStrength === "civilization_scale"
            ? "executive_grade"
            : top.propagationStrength === "systemic" || top.propagationStrength === "strong"
              ? "high"
              : top.propagationStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantResilienceState: "unstable",
        dominantPropagationStrength: "weak",
        resilienceHeadline:
          "Civilization fragility propagation awaiting sufficient ecosystem synchronization depth.",
        fragilityPosture: "low",
      };

  const signature = stableSignature([
    "d9-8-3-civilization-fragility-snapshot",
    organizationId,
    observations.map((o) => o.fragilityId),
    resilienceSummary.fragilityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    resilienceSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    resilienceSignals: Object.freeze(signals.slice(0, 6)),
    propagationFields: Object.freeze(fields.slice(0, 6)),
    resilienceTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateCivilizationFragilityPropagation(
  input: CivilizationFragilityInput
): CivilizationFragilityResult {
  if (!beginCivilizationFragilityEvaluation()) {
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
    const store = getCivilizationFragilityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-8-3-civilization-fragility-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateCivilizationFragility(
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

    if (!hasEcosystemSynchronizationDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_ecosystem_synchronization_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const consensusSubsystems = input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0;

    if (activeLayers < CIVILIZATION_FRAGILITY_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (consensusSubsystems < CIVILIZATION_FRAGILITY_MIN_CONSENSUS_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: CascadingInstabilityObservation[] = [];

    const fragilityField = buildCivilizationScaleFragilityField(input, now);
    if (fragilityField) candidates.push(fragilityField);

    const cascadingField = buildCascadingFragilityField(input, now);
    if (cascadingField) candidates.push(cascadingField);

    const absorptionReinforcement = buildResilienceAbsorptionReinforcement(input, now);
    if (absorptionReinforcement) candidates.push(absorptionReinforcement);

    const resilienceCoherence = buildMacroResilienceCoherence(input, now);
    if (resilienceCoherence) candidates.push(resilienceCoherence);

    const propagationWarning = buildCivilizationScalePropagationWarning(input, now);
    if (propagationWarning) candidates.push(propagationWarning);

    const resilienceDurability = buildSystemicResilienceDurability(input, now);
    if (resilienceDurability) candidates.push(resilienceDurability);

    const stabilizationReinforcement = buildMacroStabilizationReinforcement(input, now);
    if (stabilizationReinforcement) candidates.push(stabilizationReinforcement);

    const retained = candidates
      .filter(shouldRetainCascadingInstabilityObservation)
      .sort(
        (a, b) =>
          resilienceStateRank(b.resilienceState) - resilienceStateRank(a.resilienceState) ||
          propagationStrengthRank(b.propagationStrength) -
            propagationStrengthRank(a.propagationStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.fragilityId));
    const newCount = retained.filter((o) => !priorIds.has(o.fragilityId)).length;

    const signals = retained.map((o) => buildResilienceSignal(o, now));
    const fields = retained
      .map((o) => buildPropagationField(o, now))
      .filter((f): f is FragilityPropagationField => f !== null);
    const topologies = retained
      .map((o) => buildResilienceTopology(o, now))
      .filter((t): t is SystemicResilienceTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertResilienceSignals(signals, now);
    store.upsertPropagationFields(fields, now);
    store.upsertResilienceTopologies(topologies, now);

    const snapshot = buildFragilitySnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastResilienceState(snapshot.resilienceSummary.dominantResilienceState);

    const finalState = store.getState();
    const priorState = prior.lastResilienceState;

    if (fragilityField || cascadingField || propagationWarning) {
      devLog("cascading instability emergence — civilization-scale propagation field advancing");
    }

    if (absorptionReinforcement || resilienceCoherence || stabilizationReinforcement) {
      devLog("macro-resilience reinforcement — systemic absorption fields strengthening");
    }

    if (propagationWarning) {
      devLog("civilization-scale propagation detection — bounded multi-system fragility convergence");
    }

    if (stabilizationReinforcement || resilienceDurability) {
      devLog("systemic stabilization recovery — macro-operational shock absorption pathways mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.resilienceSummary.dominantResilienceState &&
      (snapshot.resilienceSummary.dominantResilienceState === "resilient" ||
        snapshot.resilienceSummary.dominantResilienceState === "macro_stabilized")
    ) {
      devLog(
        `macro-resilience maturation — ${priorState} → ${snapshot.resilienceSummary.dominantResilienceState}`
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
    endCivilizationFragilityEvaluation();
  }
}
