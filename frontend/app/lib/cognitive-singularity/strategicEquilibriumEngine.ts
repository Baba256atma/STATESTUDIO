import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginStrategicEquilibriumEvaluation,
  balanceStrengthRank,
  clampStrategicEquilibriumConfidence,
  endStrategicEquilibriumEvaluation,
  equilibriumStateRank,
  shouldEvaluateStrategicEquilibrium,
  shouldRetainStrategicEquilibriumObservation,
  STRATEGIC_EQUILIBRIUM_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_EQUILIBRIUM_MIN_STRATEGIC_COHERENCE_OBSERVATIONS,
  STRATEGIC_EQUILIBRIUM_MIN_UNIFIED_RUNTIMES,
} from "./strategicEquilibriumGuards";
import { getStrategicEquilibriumStore } from "./strategicEquilibriumStore";
import type {
  CognitiveBalanceSignal,
  EnterpriseStrategicEquilibriumInput,
  EnterpriseStrategicEquilibriumResult,
  EnterpriseStrategicEquilibriumSnapshot,
  EquilibriumCategory,
  EquilibriumState,
  EquilibriumStabilityField,
  BalanceStrength,
  StrategicEquilibriumSummary,
  StrategicImbalanceIndicator,
  TotalSystemBalanceObservation,
} from "./strategicEquilibriumTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicEquilibrium]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildEquilibriumId(label: string): string {
  return stableSignature(["strategic-equilibrium", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: EnterpriseStrategicEquilibriumInput): number {
  let count = 0;
  if (
    input.memorySnapshot &&
    input.memorySnapshot.runtimeStatus !== "initializing"
  ) {
    count += 1;
  }
  if (input.temporalSnapshot && isRuntimeMature(input.temporalSnapshot.runtimeStatus)) {
    count += 1;
  }
  if (input.foresightSnapshot && isRuntimeMature(input.foresightSnapshot.runtimeStatus)) count += 1;
  if (input.decisionSnapshot && isRuntimeMature(input.decisionSnapshot.runtimeStatus)) count += 1;
  if (input.unifiedConsensusSnapshot && isRuntimeMature(input.unifiedConsensusSnapshot.runtimeStatus)) {
    count += 1;
  }
  if (
    input.unifiedSelfReflectiveSnapshot &&
    isRuntimeMature(input.unifiedSelfReflectiveSnapshot.runtimeStatus)
  ) {
    count += 1;
  }
  return count;
}

function hasStrategicCoherenceDepth(input: EnterpriseStrategicEquilibriumInput): boolean {
  const snapshot = input.unifiedStrategicCoherenceSnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_EQUILIBRIUM_MIN_STRATEGIC_COHERENCE_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(
  input: EnterpriseStrategicEquilibriumInput
): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= STRATEGIC_EQUILIBRIUM_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: EnterpriseStrategicEquilibriumInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  equilibriumState: EquilibriumState,
  balanceStrength: BalanceStrength,
  equilibriumCategory: EquilibriumCategory,
  summary: string,
  balanceSignals: string[],
  imbalanceRisks: string[],
  confidence: number,
  now: number
): TotalSystemBalanceObservation {
  return {
    equilibriumId: buildEquilibriumId(label),
    equilibriumState,
    balanceStrength,
    equilibriumCategory,
    summary,
    balanceSignals: Object.freeze(balanceSignals),
    imbalanceRisks: Object.freeze(imbalanceRisks),
    confidence: clampStrategicEquilibriumConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseStrategicEquilibriumBaseline(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const coherenceReady = hasStrategicCoherenceDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady =
    countActiveUnifiedRuntimes(input) >= STRATEGIC_EQUILIBRIUM_MIN_UNIFIED_RUNTIMES;

  if (!coherenceReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_strategic_equilibrium_01",
    "balanced",
    "stable",
    "resilience_speed_balance",
    "Enterprise intelligence remains strategically balanced across resilience, governance, foresight, decision orchestration, trust calibration, and consensus diversity, with mild execution-speed pressure requiring monitoring.",
    [
      "resilience_speed_balance",
      "governance_adaptability_balance",
      "confidence_uncertainty_balance",
      "consensus_diversity_balance",
    ],
    ["localized_execution_speed_pressure"],
    0.93,
    now
  );
}

function buildResilienceSpeedBalance(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const stressed = input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const continuity = input.continuityPreserved === true;
  const resilienceLine = (input.resilienceForecastLine ?? "").toLowerCase();
  const resilienceStable =
    !stressed || (continuity && !resilienceLine.includes("critical"));

  if (!resilienceStable && !stressed) return null;
  if (stressed && !continuity) return null;

  return createObservation(
    "resilience_speed_balance",
    stressed ? "rebalancing" : "balanced",
    stressed ? "moderate" : "stable",
    "resilience_speed_balance",
    stressed
      ? "Resilience-speed tension detected — operational speed pressure offset by continuity preservation; balance stabilization awareness mapped without autonomous correction."
      : "Resilience and execution speed remain balanced — enterprise operational tempo aligns with survivability posture.",
    ["resilience_speed_balance", stressed ? "speed_pressure_monitoring" : "operational_tempo_alignment"],
    stressed ? ["localized_execution_speed_pressure"] : [],
    stressed ? 0.86 : 0.9,
    now
  );
}

function buildGovernanceAdaptabilityBalance(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const metaStable =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "adaptive";
  const governanceAligned =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const adaptationActive =
    input.unifiedSelfReflectiveSnapshot?.summary.adaptationState === "adaptive" ||
    input.unifiedSelfReflectiveSnapshot?.summary.adaptationState === "stabilizing" ||
    input.unifiedSelfReflectiveSnapshot?.summary.adaptationState === "responsive";

  if (!metaStable || !governanceAligned) return null;

  return createObservation(
    "governance_adaptability_balance",
    "balanced",
    adaptationActive ? "stable" : "moderate",
    "governance_adaptability_balance",
    "Governance and adaptability remain in tradeoff balance — executive regulation supports responsive stabilization without autonomous enforcement.",
    ["governance_adaptability_balance", "executive_regulation_balance"],
    adaptationActive ? [] : ["governance_rigidity_monitoring"],
    adaptationActive ? 0.9 : 0.87,
    now
  );
}

function buildConsensusDiversityBalance(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const consensusReady = isRuntimeMature(input.unifiedConsensusSnapshot?.runtimeStatus);
  const diversityState = input.unifiedConsensusSnapshot?.summary.diversityState ?? "";
  const diversityPreserved =
    diversityState.includes("preserved") ||
    diversityState.includes("balanced") ||
    diversityState.includes("stable");
  const negotiationStable =
    input.unifiedConsensusSnapshot?.summary.negotiationState !== "fragmented";

  if (!consensusReady || !negotiationStable) return null;

  return createObservation(
    "consensus_diversity_balance",
    diversityPreserved ? "balanced" : "rebalancing",
    diversityPreserved ? "stable" : "moderate",
    "consensus_diversity_balance",
    diversityPreserved
      ? "Consensus intelligence preserves strategic diversity — groupthink risk remains bounded within executive tradeoff awareness."
      : "Consensus-diversity tension emerging — diversity preservation requires observational monitoring without autonomous rebalancing.",
    ["consensus_diversity_balance", "diversity_preservation_posture"],
    diversityPreserved ? [] : ["consensus_groupthink_monitoring"],
    diversityPreserved ? 0.91 : 0.85,
    now
  );
}

function buildForesightActionBalance(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const foresightReady =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionReady =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";

  if (!foresightReady || !decisionReady) return null;

  return createObservation(
    "foresight_action_balance",
    "balanced",
    "stable",
    "foresight_action_balance",
    "Foresight and decision orchestration remain in equilibrium — anticipatory reasoning balances with executable strategic action.",
    ["foresight_action_balance", "anticipatory_execution_equilibrium"],
    [],
    0.9,
    now
  );
}

function buildConfidenceUncertaintyBalance(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const trustCalibrated =
    input.unifiedSelfReflectiveSnapshot?.summary.trustCalibration === "calibrated" ||
    input.unifiedSelfReflectiveSnapshot?.summary.trustCalibration === "stable";
  const uncertaintyManaged =
    input.unifiedSelfReflectiveSnapshot?.summary.uncertaintyPosture === "managed" ||
    input.unifiedSelfReflectiveSnapshot?.summary.uncertaintyPosture === "bounded" ||
    input.unifiedSelfReflectiveSnapshot?.summary.uncertaintyPosture === "monitored";
  const integrityStable =
    input.unifiedSelfReflectiveSnapshot?.summary.reasoningIntegrity === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.reasoningIntegrity === "verified";

  if (!trustCalibrated && !uncertaintyManaged) return null;
  if (!integrityStable && !uncertaintyManaged) return null;

  return createObservation(
    "confidence_uncertainty_balance",
    trustCalibrated && uncertaintyManaged ? "balanced" : "rebalancing",
    trustCalibrated && uncertaintyManaged ? "stable" : "moderate",
    "confidence_uncertainty_balance",
    "Confidence and uncertainty remain calibrated — meta-cognition prevents overtrust and paralysis without autonomous trust enforcement.",
    ["confidence_uncertainty_balance", "trust_calibration_equilibrium"],
    trustCalibrated && uncertaintyManaged ? [] : ["trust_uncertainty_tension"],
    trustCalibrated && uncertaintyManaged ? 0.89 : 0.86,
    now
  );
}

function buildOverGovernanceExecutionSlowdown(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const governanceHeavy =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const decisionSlow =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!governanceHeavy || !decisionSlow) return null;

  return createObservation(
    "over_governance_execution_slowdown",
    "unstable",
    "moderate",
    "governance_adaptability_balance",
    "Governance concentration may slow execution — over-weighted regulation relative to decision-runtime velocity mapped as balance imbalance.",
    ["governance_execution_tension", "over_governance_concentration"],
    ["governance_execution_imbalance", "localized_execution_speed_pressure"],
    0.85,
    now
  );
}

function buildExcessiveSpeedResilienceStrain(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const decisionFast =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";
  const resilienceStrained =
    input.fragilityElevated === true || input.operationalTopologyStressed === true;

  if (!decisionFast || !resilienceStrained) return null;

  return createObservation(
    "excessive_speed_resilience_strain",
    "unstable",
    "moderate",
    "resilience_speed_balance",
    "Execution speed may outpace resilience — speed-resilience tension requires observational stabilization awareness without autonomous throttling.",
    ["excessive_speed_resilience_strain", "resilience_speed_imbalance"],
    ["weak_resilience_under_speed_pressure", "operational_fragility_elevation"],
    0.84,
    now
  );
}

function buildConsensusGroupthinkRisk(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const diversityState = input.unifiedConsensusSnapshot?.summary.diversityState ?? "";
  const groupthinkRisk =
    diversityState.includes("weak") ||
    diversityState.includes("low") ||
    diversityState.includes("collapsed") ||
    diversityState.includes("fragmented");

  if (!groupthinkRisk) return null;

  return createObservation(
    "consensus_groupthink_risk",
    "imbalanced",
    "weak",
    "consensus_diversity_balance",
    "Consensus overweight relative to diversity — groupthink risk signal preserves bounded balance awareness without autonomous perspective injection.",
    ["consensus_groupthink_risk", "diversity_underrepresentation"],
    ["consensus_diversity_imbalance", "strategic_perspective_concentration"],
    0.83,
    now
  );
}

function buildForesightParalysisRisk(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const foresightDominant =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionHesitant =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "initializing";
  const willHesitant =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState === "hesitant" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "partially_committed";

  if (!foresightDominant || (!decisionHesitant && !willHesitant)) return null;

  return createObservation(
    "foresight_paralysis_risk",
    "rebalancing",
    "moderate",
    "foresight_action_balance",
    "Foresight may outweigh action — anticipatory depth without commensurate execution velocity mapped as foresight-action imbalance.",
    ["foresight_paralysis_risk", "foresight_action_imbalance"],
    ["delayed_strategic_action", "execution_reflection_tension"],
    0.85,
    now
  );
}

function buildEnterpriseGradeStrategicBalance(
  input: EnterpriseStrategicEquilibriumInput,
  now: number
): TotalSystemBalanceObservation | null {
  const coherenceCoherent =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "coherent" ||
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "fully_aligned";
  const runtimesBalanced = countActiveUnifiedRuntimes(input) >= 4;
  const continuityStable = input.continuityPreserved === true;
  const willCommitted =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "directionally_committed" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "strategically_committed";

  if (!coherenceCoherent || !runtimesBalanced || !continuityStable || !willCommitted) {
    return null;
  }

  return createObservation(
    "enterprise_grade_strategic_balance",
    "strategically_stable",
    "enterprise_grade",
    "stability_innovation_balance",
    "Enterprise strategic equilibrium stabilized across resilience, governance, foresight, execution, trust, and consensus diversity — bounded balance intelligence, not AGI equilibrium behavior.",
    [
      "enterprise_grade_strategic_balance",
      "total_system_equilibrium_stabilization",
      "cognitive_balance_awareness",
    ],
    [],
    0.92,
    now
  );
}

function buildCognitiveBalanceSignal(
  observation: TotalSystemBalanceObservation,
  now: number
): CognitiveBalanceSignal {
  return {
    signalId: stableSignature(["cognitive-balance-signal", observation.equilibriumId]).slice(0, 48),
    signalLabel: observation.equilibriumState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.equilibriumCategory]),
    signalIntensity:
      observation.balanceStrength === "enterprise_grade" ||
      observation.balanceStrength === "stable"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildEquilibriumStabilityField(
  observation: TotalSystemBalanceObservation,
  now: number
): EquilibriumStabilityField | null {
  if (
    observation.equilibriumState !== "balanced" &&
    observation.equilibriumState !== "strategically_stable"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["equilibrium-stability-field", observation.equilibriumId]).slice(
      0,
      48
    ),
    fieldLabel: observation.equilibriumState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    balancePosture:
      observation.balanceStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.balanceStrength === "stable" || observation.balanceStrength === "balanced"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.equilibriumCategory]),
    generatedAt: now,
  };
}

function buildImbalanceIndicator(
  observation: TotalSystemBalanceObservation,
  now: number
): StrategicImbalanceIndicator | null {
  if (observation.imbalanceRisks.length < 1 && observation.equilibriumState !== "imbalanced") {
    return null;
  }
  return {
    indicatorId: stableSignature(["strategic-imbalance-indicator", observation.equilibriumId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.equilibriumCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    imbalanceSeverity:
      observation.imbalanceRisks.length > 1
        ? "high"
        : observation.equilibriumState === "imbalanced" ||
            observation.equilibriumState === "unstable"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.equilibriumCategory]),
    generatedAt: now,
  };
}

function buildStrategicEquilibriumSnapshot(
  organizationId: string,
  observations: TotalSystemBalanceObservation[],
  signals: CognitiveBalanceSignal[],
  fields: EquilibriumStabilityField[],
  indicators: StrategicImbalanceIndicator[],
  now: number
): EnterpriseStrategicEquilibriumSnapshot {
  const top = observations[0];
  const strategicEquilibriumSummary: StrategicEquilibriumSummary = top
    ? {
        dominantEquilibriumState: top.equilibriumState,
        dominantBalanceStrength: top.balanceStrength,
        equilibriumHeadline: top.summary,
        balancePosture:
          top.balanceStrength === "enterprise_grade"
            ? "executive_grade"
            : top.balanceStrength === "stable" || top.balanceStrength === "balanced"
              ? "high"
              : top.balanceStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantEquilibriumState: "imbalanced",
        dominantBalanceStrength: "weak",
        equilibriumHeadline:
          "Strategic equilibrium awaiting sufficient strategic-coherence field depth.",
        balancePosture: "low",
      };

  const signature = stableSignature([
    "d9-9-7-strategic-equilibrium-snapshot",
    organizationId,
    observations.map((o) => o.equilibriumId),
    strategicEquilibriumSummary.balancePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    strategicEquilibriumSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    cognitiveBalanceSignals: Object.freeze(signals.slice(0, 6)),
    equilibriumStabilityFields: Object.freeze(fields.slice(0, 6)),
    imbalanceIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateEnterpriseStrategicEquilibrium(
  input: EnterpriseStrategicEquilibriumInput
): EnterpriseStrategicEquilibriumResult {
  if (!beginStrategicEquilibriumEvaluation()) {
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
    const store = getStrategicEquilibriumStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-7-strategic-equilibrium-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.unifiedStrategicCoherenceSnapshot?.signature ?? "no-strategic-coherence",
      input.enterpriseStrategicWillSnapshot?.signature ?? "no-strategic-will",
      input.enterpriseStrategicIdentitySnapshot?.signature ?? "no-strategic-identity",
      input.unifiedStrategicIntentSnapshot?.signature ?? "no-strategic-intent",
      input.awarenessSynchronizationSnapshot?.signature ?? "no-awareness-sync",
      input.unifiedInstitutionalConsciousnessSnapshot?.signature ?? "no-institutional",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-meta",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateStrategicEquilibrium(
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

    if (!hasStrategicCoherenceDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_strategic_coherence_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (!hasUnifiedInstitutionalConsciousnessDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_consciousness_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeRuntimes = countActiveUnifiedRuntimes(input);

    if (activeRuntimes < STRATEGIC_EQUILIBRIUM_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: TotalSystemBalanceObservation[] = [];

    const baseline = buildEnterpriseStrategicEquilibriumBaseline(input, now);
    if (baseline) candidates.push(baseline);

    const resilienceSpeed = buildResilienceSpeedBalance(input, now);
    if (resilienceSpeed) candidates.push(resilienceSpeed);

    const governanceAdaptability = buildGovernanceAdaptabilityBalance(input, now);
    if (governanceAdaptability) candidates.push(governanceAdaptability);

    const consensusDiversity = buildConsensusDiversityBalance(input, now);
    if (consensusDiversity) candidates.push(consensusDiversity);

    const foresightAction = buildForesightActionBalance(input, now);
    if (foresightAction) candidates.push(foresightAction);

    const confidenceUncertainty = buildConfidenceUncertaintyBalance(input, now);
    if (confidenceUncertainty) candidates.push(confidenceUncertainty);

    const governanceSlowdown = buildOverGovernanceExecutionSlowdown(input, now);
    if (governanceSlowdown) candidates.push(governanceSlowdown);

    const speedStrain = buildExcessiveSpeedResilienceStrain(input, now);
    if (speedStrain) candidates.push(speedStrain);

    const groupthinkRisk = buildConsensusGroupthinkRisk(input, now);
    if (groupthinkRisk) candidates.push(groupthinkRisk);

    const foresightParalysis = buildForesightParalysisRisk(input, now);
    if (foresightParalysis) candidates.push(foresightParalysis);

    const enterpriseGrade = buildEnterpriseGradeStrategicBalance(input, now);
    if (enterpriseGrade) candidates.push(enterpriseGrade);

    const retained = candidates
      .filter(shouldRetainStrategicEquilibriumObservation)
      .sort(
        (a, b) =>
          equilibriumStateRank(b.equilibriumState) - equilibriumStateRank(a.equilibriumState) ||
          balanceStrengthRank(b.balanceStrength) - balanceStrengthRank(a.balanceStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.equilibriumId));
    const newCount = retained.filter((o) => !priorIds.has(o.equilibriumId)).length;

    const signals = retained.map((o) => buildCognitiveBalanceSignal(o, now));
    const fields = retained
      .map((o) => buildEquilibriumStabilityField(o, now))
      .filter((f): f is EquilibriumStabilityField => f !== null);
    const indicators = retained
      .map((o) => buildImbalanceIndicator(o, now))
      .filter((i): i is StrategicImbalanceIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertCognitiveBalanceSignals(signals, now);
    store.upsertEquilibriumStabilityFields(fields, now);
    store.upsertImbalanceIndicators(indicators, now);

    const snapshot = buildStrategicEquilibriumSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastEquilibriumState(snapshot.strategicEquilibriumSummary.dominantEquilibriumState);

    const priorState = prior.lastEquilibriumState;

    if (baseline || resilienceSpeed || governanceAdaptability || enterpriseGrade) {
      devLog("equilibrium strengthening — total-system strategic balance advancing");
    }

    if (
      governanceSlowdown ||
      speedStrain ||
      groupthinkRisk ||
      foresightParalysis
    ) {
      devLog("major imbalance detection — cognitive tradeoff tension mapped");
    }

    if (enterpriseGrade) {
      devLog("enterprise-grade balance formation — strategic equilibrium stabilized");
    }

    if (
      priorState &&
      priorState !== snapshot.strategicEquilibriumSummary.dominantEquilibriumState &&
      (snapshot.strategicEquilibriumSummary.dominantEquilibriumState === "balanced" ||
        snapshot.strategicEquilibriumSummary.dominantEquilibriumState === "strategically_stable")
    ) {
      devLog(
        `strategic stabilization shift — ${priorState} → ${snapshot.strategicEquilibriumSummary.dominantEquilibriumState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newObservations: newCount,
      storeSignature: store.getState().signature,
    };
  } finally {
    endStrategicEquilibriumEvaluation();
  }
}
