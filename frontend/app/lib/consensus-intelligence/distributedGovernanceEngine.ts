import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginDistributedGovernanceEvaluation,
  clampGovernanceConfidence,
  DISTRIBUTED_GOVERNANCE_MIN_MEMORY_SYNC_DEPTH,
  DISTRIBUTED_GOVERNANCE_MIN_UNIFIED_LAYERS,
  endDistributedGovernanceEvaluation,
  governanceStateRank,
  integrityStrengthRank,
  shouldEvaluateDistributedGovernance,
  shouldRetainCollaborativeIntegrityObservation,
} from "./distributedGovernanceGuards";
import { getDistributedGovernanceStore } from "./distributedGovernanceStore";
import type {
  CollaborativeIntegrityObservation,
  CollectiveGovernanceSummary,
  CollectiveIntegritySignal,
  DistributedGovernanceIndicator,
  DistributedStrategicGovernanceInput,
  DistributedStrategicGovernanceResult,
  DistributedStrategicGovernanceSnapshot,
  EnterpriseCoherenceField,
  GovernanceCategory,
  GovernanceState,
  IntegrityStrength,
} from "./distributedGovernanceTypes";

const DEV_LOG_PREFIX = "[Nexora][DistributedGovernance]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildGovernanceId(label: string): string {
  return stableSignature(["distributed-governance", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: DistributedStrategicGovernanceInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function createObservation(
  label: string,
  governanceState: GovernanceState,
  integrityStrength: IntegrityStrength,
  governanceCategory: GovernanceCategory,
  summary: string,
  governanceSignals: string[],
  integrityRisks: string[],
  confidence: number,
  now: number
): CollaborativeIntegrityObservation {
  return {
    governanceId: buildGovernanceId(label),
    governanceState,
    integrityStrength,
    governanceCategory,
    summary,
    governanceSignals: Object.freeze(governanceSignals),
    integrityRisks: Object.freeze(integrityRisks),
    confidence: clampGovernanceConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseCollectiveIntegrity(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const stackMature =
    (input.collectiveLearningSnapshot?.observationCount ?? 0) >= 1 &&
    (input.memorySyncSnapshot?.observationCount ?? 0) >= 1 &&
    (input.diversitySnapshot?.observationCount ?? 0) >= 1 &&
    (input.counterfactualSnapshot?.observationCount ?? 0) >= 1;
  const advisoryStable = (input.collectiveGuidanceSnapshot?.observationCount ?? 0) >= 1;

  if (!stackMature || !advisoryStable) return null;

  return createObservation(
    "enterprise_collective_integrity_01",
    "coherent",
    "governed",
    "consensus_governance",
    "Distributed enterprise cognition maintains strong governance coherence, collaborative trustworthiness, and strategic continuity across consensus, advisory, and counterfactual systems under elevated operational uncertainty.",
    [
      "distributed_reasoning_stability",
      "trust_preservation",
      "strategic_memory_continuity",
      "diversity_balance",
    ],
    ["moderate_consensus_concentration"],
    0.92,
    now
  );
}

function buildCollectiveIntegrityReinforcement(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const underPressure = input.fragilityElevated || !input.continuityPreserved;
  const coherent =
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "aligned" ||
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "converging";
  const advisoryCoherent =
    input.collectiveGuidanceSnapshot?.awarenessSummary.collectivePosture === "high" ||
    input.collectiveGuidanceSnapshot?.awarenessSummary.collectivePosture === "executive_grade";

  if (!underPressure || !coherent) return null;
  if (!advisoryCoherent) return null;

  return createObservation(
    "collective_integrity_reinforcement",
    "integrity_preserved",
    "governed",
    "advisory_governance",
    "Distributed perspectives remaining coherent under pressure — collective-integrity reinforcement preserves collaborative reasoning discipline without suppressing plurality.",
    [
      "collective_integrity_reinforcement",
      "pressure_coherence_preservation",
      "distributed_advisory_stability",
    ],
    [],
    0.9,
    now
  );
}

function buildGovernanceFragilityWarning(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const diversityCollapsed =
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "collapsed" ||
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "narrowing";
  const debateWeak = (input.counterfactualSnapshot?.observationCount ?? 0) < 2;

  if (!diversityCollapsed && !debateWeak) return null;

  return createObservation(
    "governance_fragility_warning",
    "unstable",
    "monitored",
    "diversity_governance",
    "Counterfactual diversity collapsing — governance-fragility warning indicates distributed challenge pathways weakening collaborative integrity boundaries.",
    [
      "governance_fragility_warning",
      "counterfactual_diversity_collapse",
      "challenge_pathway_weakening",
    ],
    ["distributed_reasoning_collapse_risk", "integrity_boundary_erosion"],
    0.76,
    now
  );
}

function buildTrustGovernanceDegradation(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const reflective = input.unifiedSelfReflectiveSnapshot?.summary;
  const explainabilityWeak =
    reflective?.explainabilityState === "opaque" ||
    reflective?.explainabilityState === "limited" ||
    reflective?.explainabilityState === "degraded";
  const trustWeak =
    reflective?.trustCalibration === "uncertain" ||
    reflective?.trustCalibration === "fragile";

  if (!explainabilityWeak && !trustWeak) return null;

  return createObservation(
    "trust_governance_degradation",
    "unstable",
    "monitored",
    "explainability_governance",
    "Explainability weakening across distributed systems — trust-governance degradation signals collective-trust boundaries require observational reinforcement without autonomous suppression.",
    [
      "trust_governance_degradation",
      "explainability_weakening",
      "collective_trust_boundary_strain",
    ],
    ["consensus_explainability_loss", "executive_accountability_strain"],
    0.74,
    now
  );
}

function buildEnterpriseGradeDistributedGovernance(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const memorySyncStrong =
    input.memorySyncSnapshot?.awarenessSummary.coherencePosture === "high" ||
    input.memorySyncSnapshot?.awarenessSummary.coherencePosture === "executive_grade";
  const continuityStable =
    input.memorySyncSnapshot?.awarenessSummary.dominantContinuityState === "synchronized" ||
    input.memorySyncSnapshot?.awarenessSummary.dominantContinuityState === "continuous";
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";

  if (!memorySyncStrong || !continuityStable || !runtimesStable) return null;

  return createObservation(
    "enterprise_grade_distributed_governance",
    "integrity_preserved",
    "enterprise_grade",
    "memory_governance",
    "Stable synchronization preserving strategic continuity — enterprise-grade distributed governance reflects collaborative coherence without autonomous executive authority.",
    [
      "enterprise_grade_distributed_governance",
      "strategic_continuity_preservation",
      "memory_synchronization_governance",
    ],
    [],
    0.93,
    now
  );
}

function buildPluralityGovernanceConcern(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const lowDiversity =
    input.strategicConsensusSnapshot?.awarenessSummary.perspectiveDiversityPosture === "low";
  const highConcentration = input.strategicConsensusSnapshot?.reasoningPerspectives.some(
    (p) => p.perspectiveWeight >= 0.85
  );
  const alignedDominant =
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "aligned";

  if (!lowDiversity && !(highConcentration && alignedDominant)) return null;

  return createObservation(
    "plurality_governance_concern",
    "regulated",
    "stable",
    "consensus_governance",
    "Consensus concentration increasing excessively — plurality-governance concern preserves minority perspective visibility without automatic suppression.",
    [
      "plurality_governance_concern",
      "consensus_concentration_risk",
      "minority_perspective_visibility",
    ],
    ["governance_balance_strain", "perspective_homogenization_risk"],
    0.8,
    now
  );
}

function buildResilientCollectiveIntegrity(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const plural =
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "balanced" ||
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "resilient" ||
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "diverse";
  const coherent =
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "converging" ||
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "aligned";
  const learningMature =
    input.collectiveLearningSnapshot?.awarenessSummary.maturationPosture === "high" ||
    input.collectiveLearningSnapshot?.awarenessSummary.maturationPosture === "executive_grade";

  if (!plural || !coherent) return null;

  return createObservation(
    "resilient_collective_integrity",
    "coherent",
    "governed",
    "diversity_governance",
    "Distributed cognition preserving coherence and diversity simultaneously — resilient collective intelligence integrity balances governance discipline with perspective plurality.",
    [
      "resilient_collective_integrity",
      "coherence_diversity_balance",
      "collaborative_reasoning_discipline",
    ],
    learningMature ? [] : ["maturation_pathway_incomplete"],
    0.88,
    now
  );
}

function buildCollaborativeFragmentationEmergence(
  input: DistributedStrategicGovernanceInput,
  now: number
): CollaborativeIntegrityObservation | null {
  const fragmented =
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "fragmented" ||
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "divergent";
  const memoryFragile =
    input.memorySyncSnapshot?.awarenessSummary.dominantContinuityState === "fragmented" ||
    input.memorySyncSnapshot?.awarenessSummary.dominantContinuityState === "drifting";

  if (!fragmented && !memoryFragile) return null;

  return createObservation(
    "collaborative_fragmentation_emergence",
    "fragmented",
    "weak",
    "unknown",
    "Distributed perspectives diverging excessively — collaborative fragmentation emergence indicates collective intelligence integrity requires observational governance reinforcement.",
    [
      "collaborative_fragmentation_emergence",
      "distributed_divergence_excess",
      "integrity_degradation_signal",
    ],
    ["strategic_fragmentation_growth", "coordination_incoherence_risk"],
    0.66,
    now
  );
}

function buildIntegritySignal(
  observation: CollaborativeIntegrityObservation,
  now: number
): CollectiveIntegritySignal {
  return {
    signalId: stableSignature(["integrity-signal", observation.governanceId]).slice(0, 48),
    signalLabel: observation.governanceState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.governanceCategory]),
    signalIntensity:
      observation.integrityStrength === "enterprise_grade" ||
      observation.integrityStrength === "governed"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildGovernanceIndicator(
  observation: CollaborativeIntegrityObservation,
  now: number
): DistributedGovernanceIndicator | null {
  if (observation.integrityRisks.length < 1) return null;
  return {
    indicatorId: stableSignature(["governance-indicator", observation.governanceId]).slice(0, 48),
    indicatorLabel: "integrity risk",
    indicatorSummary: observation.summary.slice(0, 100),
    governancePosture:
      observation.governanceState === "fragmented"
        ? "high"
        : observation.governanceState === "unstable"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.governanceCategory]),
    generatedAt: now,
  };
}

function buildCoherenceField(
  observation: CollaborativeIntegrityObservation,
  now: number
): EnterpriseCoherenceField | null {
  if (
    observation.governanceState !== "coherent" &&
    observation.governanceState !== "integrity_preserved" &&
    observation.governanceState !== "regulated"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["coherence-field", observation.governanceId]).slice(0, 48),
    fieldLabel: observation.governanceState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    coherencePosture:
      observation.integrityStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.integrityStrength === "governed" || observation.integrityStrength === "stable"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.governanceCategory]),
    generatedAt: now,
  };
}

function buildGovernanceSnapshot(
  organizationId: string,
  observations: CollaborativeIntegrityObservation[],
  signals: CollectiveIntegritySignal[],
  indicators: DistributedGovernanceIndicator[],
  fields: EnterpriseCoherenceField[],
  now: number
): DistributedStrategicGovernanceSnapshot {
  const top = observations[0];
  const awarenessSummary: CollectiveGovernanceSummary = top
    ? {
        dominantGovernanceState: top.governanceState,
        dominantIntegrityStrength: top.integrityStrength,
        governanceHeadline: top.summary,
        integrityPosture:
          top.integrityStrength === "enterprise_grade"
            ? "executive_grade"
            : top.integrityStrength === "governed" || top.integrityStrength === "stable"
              ? "high"
              : top.integrityStrength === "monitored"
                ? "moderate"
                : "low",
      }
    : {
        dominantGovernanceState: "unstable",
        dominantIntegrityStrength: "weak",
        governanceHeadline:
          "Enterprise distributed strategic governance awaiting sufficient memory-synchronization runtime depth.",
        integrityPosture: "low",
      };

  const signature = stableSignature([
    "d9-7-9-governance-snapshot",
    organizationId,
    observations.map((o) => o.governanceId),
    awarenessSummary.integrityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    integritySignals: Object.freeze(signals.slice(0, 6)),
    governanceIndicators: Object.freeze(indicators.slice(0, 6)),
    coherenceFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateDistributedStrategicGovernance(
  input: DistributedStrategicGovernanceInput
): DistributedStrategicGovernanceResult {
  if (!beginDistributedGovernanceEvaluation()) {
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
    const store = getDistributedGovernanceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-9-distributed-governance-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.collectiveGuidanceSnapshot?.signature ?? "no-advisory",
      input.counterfactualSnapshot?.signature ?? "no-debate",
      input.diversitySnapshot?.signature ?? "no-diversity",
      input.collectiveLearningSnapshot?.signature ?? "no-collective-learning",
      input.memorySyncSnapshot?.signature ?? "no-memory-sync",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateDistributedGovernance(
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
    const memorySyncDepth = input.memorySyncSnapshot?.observationCount ?? 0;

    if (activeLayers < DISTRIBUTED_GOVERNANCE_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_governance_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (memorySyncDepth < DISTRIBUTED_GOVERNANCE_MIN_MEMORY_SYNC_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_memory_sync_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: CollaborativeIntegrityObservation[] = [];

    const primaryIntegrity = buildEnterpriseCollectiveIntegrity(input, now);
    if (primaryIntegrity) candidates.push(primaryIntegrity);

    const integrityReinforcement = buildCollectiveIntegrityReinforcement(input, now);
    if (integrityReinforcement) candidates.push(integrityReinforcement);

    const fragilityWarning = buildGovernanceFragilityWarning(input, now);
    if (fragilityWarning) candidates.push(fragilityWarning);

    const trustDegradation = buildTrustGovernanceDegradation(input, now);
    if (trustDegradation) candidates.push(trustDegradation);

    const enterpriseGrade = buildEnterpriseGradeDistributedGovernance(input, now);
    if (enterpriseGrade) candidates.push(enterpriseGrade);

    const pluralityConcern = buildPluralityGovernanceConcern(input, now);
    if (pluralityConcern) candidates.push(pluralityConcern);

    const resilientIntegrity = buildResilientCollectiveIntegrity(input, now);
    if (resilientIntegrity) candidates.push(resilientIntegrity);

    const fragmentation = buildCollaborativeFragmentationEmergence(input, now);
    if (fragmentation) candidates.push(fragmentation);

    const retained = candidates
      .filter(shouldRetainCollaborativeIntegrityObservation)
      .sort(
        (a, b) =>
          governanceStateRank(b.governanceState) - governanceStateRank(a.governanceState) ||
          integrityStrengthRank(b.integrityStrength) - integrityStrengthRank(a.integrityStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.governanceId));
    const newCount = retained.filter((o) => !priorIds.has(o.governanceId)).length;

    const signals = retained.map((o) => buildIntegritySignal(o, now));
    const indicators = retained
      .map((o) => buildGovernanceIndicator(o, now))
      .filter((i): i is DistributedGovernanceIndicator => i !== null);
    const fields = retained
      .map((o) => buildCoherenceField(o, now))
      .filter((f): f is EnterpriseCoherenceField => f !== null);

    store.upsertObservations(retained, now);
    store.upsertIntegritySignals(signals, now);
    store.upsertGovernanceIndicators(indicators, now);
    store.upsertCoherenceFields(fields, now);

    const snapshot = buildGovernanceSnapshot(
      organizationId,
      retained,
      signals,
      indicators,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastGovernanceState(snapshot.awarenessSummary.dominantGovernanceState);

    const finalState = store.getState();
    const priorGovernance = prior.lastGovernanceState;

    if (primaryIntegrity || integrityReinforcement || resilientIntegrity) {
      devLog("distributed-governance stabilization — collective integrity coherence advancing");
    }

    if (fragilityWarning || trustDegradation || fragmentation) {
      devLog("collective-integrity degradation — distributed governance boundaries under strain");
    }

    if (enterpriseGrade) {
      devLog("enterprise-grade coherence formation — distributed strategic governance stabilized");
    }

    if (fragmentation) {
      devLog("collaborative fragmentation emergence — plurality-governance reinforcement advised");
    }

    if (
      priorGovernance &&
      priorGovernance !== snapshot.awarenessSummary.dominantGovernanceState &&
      (snapshot.awarenessSummary.dominantGovernanceState === "coherent" ||
        snapshot.awarenessSummary.dominantGovernanceState === "integrity_preserved")
    ) {
      devLog(
        `collective-integrity recovery — ${priorGovernance} → ${snapshot.awarenessSummary.dominantGovernanceState}`
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
    endDistributedGovernanceEvaluation();
  }
}
