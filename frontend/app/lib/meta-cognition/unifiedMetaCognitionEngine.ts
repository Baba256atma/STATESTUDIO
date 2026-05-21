import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginUnifiedMetaCognitionEvaluation,
  clampUnifiedMetaCognitionConfidence,
  endUnifiedMetaCognitionEvaluation,
  shouldEvaluateUnifiedMetaCognition,
  UNIFIED_META_COGNITION_MIN_ACTIVE_SUBSYSTEMS,
  UNIFIED_META_COGNITION_MIN_GOVERNANCE_DEPTH,
  validateEnterpriseSelfReflectiveSnapshot,
} from "./unifiedMetaCognitionGuards";
import { getUnifiedMetaCognitionStore } from "./unifiedMetaCognitionStore";
import type {
  CognitionGovernanceHistoryEntry,
  CognitiveGovernanceHealth,
  EnterpriseSelfReflectiveIntelligence,
  EnterpriseSelfReflectiveSnapshot,
  ExecutiveSelfReflectiveSummary,
  ExecutiveTrustRuntime,
  GovernanceHealthLevel,
  MetaCognitionSubsystemId,
  MetaCognitionSubsystemState,
  SelfRegulationPatternRecord,
  SurvivabilitySummaryRecord,
  UnifiedExecutiveMetaCognitionInput,
  UnifiedExecutiveMetaCognitionResult,
  UnifiedRuntimeStatus,
} from "./unifiedMetaCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedMetaCognition]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapGovernanceStrengthToHealth(
  strength: string | undefined,
  posture: string | undefined
): GovernanceHealthLevel {
  if (strength === "enterprise_grade" || posture === "enterprise_grade") return "enterprise_grade";
  if (strength === "governed" || strength === "strong") return "governed";
  if (strength === "stable" || strength === "moderate") return "stable";
  if (strength === "monitored") return "monitored";
  return "weak";
}

function buildSubsystemState(
  subsystemId: MetaCognitionSubsystemId,
  observationCount: number,
  headline: string,
  healthLevel: GovernanceHealthLevel,
  status: UnifiedRuntimeStatus,
  now: number
): MetaCognitionSubsystemState {
  return {
    subsystemId,
    status,
    observationCount,
    healthLevel,
    headline: headline.slice(0, 120),
    active: observationCount > 0,
    lastUpdatedAt: now,
  };
}

function buildAllSubsystemStates(
  input: UnifiedExecutiveMetaCognitionInput,
  now: number
): MetaCognitionSubsystemState[] {
  const meta = input.metaCognitionSnapshot;
  const integrity = input.reasoningIntegritySnapshot;
  const drift = input.cognitiveDriftSnapshot;
  const uncertainty = input.cognitiveUncertaintySnapshot;
  const explainability = input.explainabilitySnapshot;
  const trust = input.trustCalibrationSnapshot;
  const resilience = input.cognitiveResilienceSnapshot;
  const adaptation = input.cognitiveAdaptationSnapshot;
  const governance = input.cognitiveGovernanceSnapshot;

  const integrityState = integrity?.awarenessSummary.dominantConsistencyState ?? "fragmented";
  const driftState = drift?.awarenessSummary.dominantStabilityState ?? "fluctuating";
  const trustState = trust?.awarenessSummary.dominantTrustState ?? "monitored";
  const survivability = resilience?.awarenessSummary.dominantSurvivabilityState ?? "unstable";
  const stabilization = adaptation?.awarenessSummary.dominantStabilizationState ?? "reactive";
  const regulation = governance?.awarenessSummary.dominantRegulationState ?? "monitored";

  const states: MetaCognitionSubsystemState[] = [
    buildSubsystemState(
      "meta_cognition",
      meta?.observationCount ?? 0,
      meta?.awarenessSummary.metaCognitionHeadline ?? "Meta-cognition foundation awaiting depth.",
      mapGovernanceStrengthToHealth(
        meta?.awarenessSummary.dominantCognitionHealth,
        meta?.awarenessSummary.reflectionPosture
      ),
      (meta?.observationCount ?? 0) >= 1 ? "stable" : "initializing",
      now
    ),
    buildSubsystemState(
      "integrity_verification",
      integrity?.verificationCount ?? 0,
      integrity?.awarenessSummary.verificationHeadline ?? "Reasoning integrity verification pending.",
      mapGovernanceStrengthToHealth(integrity?.awarenessSummary.trustPosture, undefined),
      integrityState === "verified" || integrityState === "coherent" ? "stable" : "adaptive",
      now
    ),
    buildSubsystemState(
      "cognitive_drift",
      drift?.stabilityCount ?? 0,
      drift?.awarenessSummary.driftHeadline ?? "Cognitive drift awareness pending.",
      mapGovernanceStrengthToHealth(undefined, drift?.awarenessSummary.durabilityPosture),
      driftState === "stable" || driftState === "adaptive" ? "stable" : "degraded",
      now
    ),
    buildSubsystemState(
      "uncertainty_awareness",
      uncertainty?.ambiguityCount ?? 0,
      uncertainty?.awarenessSummary.uncertaintyHeadline ?? "Uncertainty awareness pending.",
      mapGovernanceStrengthToHealth(undefined, uncertainty?.awarenessSummary.epistemicPosture),
      (uncertainty?.ambiguityCount ?? 0) >= 2 ? "adaptive" : "stable",
      now
    ),
    buildSubsystemState(
      "explainability",
      explainability?.traceCount ?? 0,
      explainability?.awarenessSummary.explainabilityHeadline ?? "Explainability intelligence pending.",
      mapGovernanceStrengthToHealth(
        explainability?.awarenessSummary.dominantExplanationStrength,
        undefined
      ),
      (explainability?.traceCount ?? 0) >= 1 ? "stable" : "initializing",
      now
    ),
    buildSubsystemState(
      "trust_calibration",
      trust?.adjustmentCount ?? 0,
      trust?.awarenessSummary.calibrationHeadline ?? "Trust calibration pending.",
      mapGovernanceStrengthToHealth(
        trust?.awarenessSummary.dominantReliabilityStrength,
        trust?.awarenessSummary.dependabilityPosture
      ),
      trustState === "reliable" || trustState === "highly_trustworthy" ? "stable" : "adaptive",
      now
    ),
    buildSubsystemState(
      "cognitive_resilience",
      resilience?.observationCount ?? 0,
      resilience?.awarenessSummary.survivabilityHeadline ?? "Cognitive resilience monitoring pending.",
      mapGovernanceStrengthToHealth(
        resilience?.awarenessSummary.dominantResilienceStrength,
        resilience?.awarenessSummary.robustnessPosture
      ),
      survivability === "durable" || survivability === "survivable" ? "stable" : "adaptive",
      now
    ),
    buildSubsystemState(
      "adaptive_stabilization",
      adaptation?.observationCount ?? 0,
      adaptation?.awarenessSummary.stabilizationHeadline ?? "Adaptive stabilization pending.",
      mapGovernanceStrengthToHealth(
        adaptation?.awarenessSummary.dominantAdaptationStrength,
        adaptation?.awarenessSummary.balancePosture
      ),
      stabilization === "self_stabilized" || stabilization === "stabilizing" ? "stable" : "adaptive",
      now
    ),
    buildSubsystemState(
      "cognitive_governance",
      governance?.observationCount ?? 0,
      governance?.awarenessSummary.regulationHeadline ?? "Cognitive governance pending.",
      mapGovernanceStrengthToHealth(
        governance?.awarenessSummary.dominantGovernanceStrength,
        governance?.awarenessSummary.integrityPosture
      ),
      regulation === "self_regulated" || regulation === "stabilized" ? "stable" : "adaptive",
      now
    ),
  ];

  return states;
}

function deriveRuntimeStatus(
  subsystemStates: MetaCognitionSubsystemState[],
  priorStatus: UnifiedRuntimeStatus | null,
  fragilityElevated: boolean
): UnifiedRuntimeStatus {
  const active = subsystemStates.filter((s) => s.active);
  if (active.length < UNIFIED_META_COGNITION_MIN_ACTIVE_SUBSYSTEMS) return "initializing";

  const degradedCount = subsystemStates.filter((s) => s.status === "degraded").length;
  const stableCount = subsystemStates.filter((s) => s.status === "stable").length;
  const adaptiveCount = subsystemStates.filter((s) => s.status === "adaptive").length;

  if (degradedCount >= 2) {
    if (priorStatus === "degraded" && adaptiveCount >= 2) return "recovering";
    return "degraded";
  }

  if (priorStatus === "degraded" && stableCount >= 5) return "recovering";

  if (stableCount >= 6 && !fragilityElevated) return "stable";
  if (adaptiveCount >= 3 || fragilityElevated) return "adaptive";
  return "stable";
}

function deriveGovernanceHealth(
  governance: UnifiedExecutiveMetaCognitionInput["cognitiveGovernanceSnapshot"],
  subsystemStates: MetaCognitionSubsystemState[]
): GovernanceHealthLevel {
  const govStrength = governance?.awarenessSummary.dominantGovernanceStrength;
  const mapped = mapGovernanceStrengthToHealth(
    govStrength,
    governance?.awarenessSummary.integrityPosture
  );
  if (mapped !== "weak") return mapped;

  const governedCount = subsystemStates.filter(
    (s) => s.healthLevel === "governed" || s.healthLevel === "enterprise_grade"
  ).length;
  if (governedCount >= 4) return "governed";
  if (governedCount >= 2) return "stable";
  return "monitored";
}

function buildReflectiveSummary(
  input: UnifiedExecutiveMetaCognitionInput
): ExecutiveSelfReflectiveSummary {
  return {
    reasoningIntegrity:
      input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState ?? "pending",
    trustCalibration:
      input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState ?? "pending",
    explainabilityState:
      input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState ?? "pending",
    driftState: input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState ?? "pending",
    survivabilityState:
      input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState ?? "pending",
    governanceAlignment:
      input.cognitiveGovernanceSnapshot?.awarenessSummary.dominantRegulationState ?? "pending",
    uncertaintyPosture:
      input.cognitiveUncertaintySnapshot?.awarenessSummary.dominantCautionPosture ?? "pending",
    adaptationState:
      input.cognitiveAdaptationSnapshot?.awarenessSummary.dominantStabilizationState ?? "pending",
  };
}

function buildCognitiveGovernanceHealth(
  input: UnifiedExecutiveMetaCognitionInput,
  governanceHealth: GovernanceHealthLevel
): CognitiveGovernanceHealth {
  const gov = input.cognitiveGovernanceSnapshot;
  return {
    level: governanceHealth,
    regulationState: gov?.awarenessSummary.dominantRegulationState ?? "monitored",
    governanceHeadline:
      gov?.awarenessSummary.regulationHeadline ??
      "Enterprise cognitive governance awaiting consolidation depth.",
    integrityPosture: gov?.awarenessSummary.integrityPosture ?? "low",
  };
}

function buildExecutiveTrustRuntime(
  input: UnifiedExecutiveMetaCognitionInput,
  now: number
): ExecutiveTrustRuntime {
  const trust = input.trustCalibrationSnapshot;
  const confidence = clampUnifiedMetaCognitionConfidence(
    trust?.recentTrustAdjustments[0]?.confidence ?? 0.72
  );
  return {
    trustRuntimeId: stableSignature([
      "executive-trust-runtime",
      input.organizationId,
      trust?.signature ?? "no-trust",
    ]).slice(0, 48),
    dominantTrustState: trust?.awarenessSummary.dominantTrustState ?? "monitored",
    dependabilityPosture: trust?.awarenessSummary.dependabilityPosture ?? "moderate",
    trustHeadline:
      trust?.awarenessSummary.calibrationHeadline ??
      "Executive trust runtime awaiting calibration depth.",
    confidence,
    generatedAt: now,
  };
}

function buildSelfReflectiveIntelligence(
  input: UnifiedExecutiveMetaCognitionInput,
  runtimeStatus: UnifiedRuntimeStatus,
  governanceHealth: GovernanceHealthLevel,
  activeSubsystems: MetaCognitionSubsystemId[],
  summary: ExecutiveSelfReflectiveSummary,
  now: number
): EnterpriseSelfReflectiveIntelligence {
  const coherence =
    input.cognitiveGovernanceSnapshot?.awarenessSummary.integrityPosture ?? "moderate";
  const confidence = clampUnifiedMetaCognitionConfidence(
    runtimeStatus === "stable" && governanceHealth === "enterprise_grade"
      ? 0.93
      : runtimeStatus === "degraded"
        ? 0.62
        : 0.84
  );

  return {
    intelligenceId: stableSignature([
      "enterprise-self-reflective-intelligence",
      input.organizationId,
      runtimeStatus,
      governanceHealth,
    ]).slice(0, 56),
    runtimeHeadline: `Unified executive meta-cognition runtime is ${runtimeStatus} with ${governanceHealth} governance health.`,
    reflectionSummary: `Reasoning ${summary.reasoningIntegrity}, trust ${summary.trustCalibration}, explainability ${summary.explainabilityState}, survivability ${summary.survivabilityState}, governance ${summary.governanceAlignment}.`,
    activeSubsystemCount: activeSubsystems.length,
    governanceCoherence: coherence,
    confidence,
    generatedAt: now,
  };
}

function buildSelfReflectiveSnapshot(
  organizationId: string,
  runtimeStatus: UnifiedRuntimeStatus,
  governanceHealth: GovernanceHealthLevel,
  summary: ExecutiveSelfReflectiveSummary,
  activeSubsystems: MetaCognitionSubsystemId[],
  subsystemStates: MetaCognitionSubsystemState[],
  cognitiveGovernanceHealth: CognitiveGovernanceHealth,
  executiveTrustRuntime: ExecutiveTrustRuntime,
  selfReflectiveIntelligence: EnterpriseSelfReflectiveIntelligence,
  now: number
): EnterpriseSelfReflectiveSnapshot {
  const signature = stableSignature([
    "d9-6-10-enterprise-self-reflective-snapshot",
    organizationId,
    runtimeStatus,
    governanceHealth,
    activeSubsystems,
    summary.reasoningIntegrity,
    summary.trustCalibration,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    runtimeStatus,
    governanceHealth,
    summary,
    activeSubsystems: Object.freeze(activeSubsystems),
    subsystemStates: Object.freeze(subsystemStates),
    cognitiveGovernanceHealth,
    executiveTrustRuntime,
    selfReflectiveIntelligence,
  };
}

export function evaluateUnifiedExecutiveMetaCognitionRuntime(
  input: UnifiedExecutiveMetaCognitionInput
): UnifiedExecutiveMetaCognitionResult {
  if (!beginUnifiedMetaCognitionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      activeSubsystemCount: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getUnifiedMetaCognitionStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-10-unified-meta-cognition-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.metaCognitionSnapshot?.signature ?? "no-meta-cognition",
      input.reasoningIntegritySnapshot?.signature ?? "no-reasoning-integrity",
      input.cognitiveDriftSnapshot?.signature ?? "no-cognitive-drift",
      input.cognitiveUncertaintySnapshot?.signature ?? "no-cognitive-uncertainty",
      input.explainabilitySnapshot?.signature ?? "no-explainability",
      input.trustCalibrationSnapshot?.signature ?? "no-trust-calibration",
      input.cognitiveResilienceSnapshot?.signature ?? "no-cognitive-resilience",
      input.cognitiveAdaptationSnapshot?.signature ?? "no-cognitive-adaptation",
      input.cognitiveGovernanceSnapshot?.signature ?? "no-cognitive-governance",
    ]);

    if (
      !shouldEvaluateUnifiedMetaCognition(
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
        snapshot: prior.selfReflectiveSnapshots[0] ?? null,
        activeSubsystemCount: prior.subsystemStates.filter((s) => s.active).length,
        storeSignature: prior.signature,
      };
    }

    const governanceDepth = input.cognitiveGovernanceSnapshot?.observationCount ?? 0;
    if (governanceDepth < UNIFIED_META_COGNITION_MIN_GOVERNANCE_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_governance_depth",
        snapshot: prior.selfReflectiveSnapshots[0] ?? null,
        activeSubsystemCount: 0,
        storeSignature: prior.signature,
      };
    }

    const subsystemStates = buildAllSubsystemStates(input, now);
    const activeSubsystems = subsystemStates
      .filter((s) => s.active)
      .map((s) => s.subsystemId) as MetaCognitionSubsystemId[];

    if (activeSubsystems.length < UNIFIED_META_COGNITION_MIN_ACTIVE_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_subsystems",
        snapshot: prior.selfReflectiveSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const runtimeStatus = deriveRuntimeStatus(
      subsystemStates,
      prior.lastRuntimeStatus,
      input.fragilityElevated ?? false
    );
    const governanceHealth = deriveGovernanceHealth(
      input.cognitiveGovernanceSnapshot,
      subsystemStates
    );
    const summary = buildReflectiveSummary(input);
    const cognitiveGovernanceHealth = buildCognitiveGovernanceHealth(input, governanceHealth);
    const executiveTrustRuntime = buildExecutiveTrustRuntime(input, now);
    const selfReflectiveIntelligence = buildSelfReflectiveIntelligence(
      input,
      runtimeStatus,
      governanceHealth,
      activeSubsystems,
      summary,
      now
    );

    const snapshot = buildSelfReflectiveSnapshot(
      organizationId,
      runtimeStatus,
      governanceHealth,
      summary,
      activeSubsystems,
      subsystemStates,
      cognitiveGovernanceHealth,
      executiveTrustRuntime,
      selfReflectiveIntelligence,
      now
    );

    if (!validateEnterpriseSelfReflectiveSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_self_reflective_snapshot",
        snapshot: prior.selfReflectiveSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const governanceHistoryEntry: CognitionGovernanceHistoryEntry = {
      entryId: stableSignature(["governance-history", snapshot.signature]).slice(0, 48),
      governanceHealth,
      runtimeStatus,
      headline: cognitiveGovernanceHealth.governanceHeadline.slice(0, 80),
      generatedAt: now,
    };

    const survivabilityRecord: SurvivabilitySummaryRecord | null = input.cognitiveResilienceSnapshot
      ? {
          recordId: stableSignature(["survivability", organizationId, snapshot.signature]).slice(
            0,
            48
          ),
          survivabilityState: summary.survivabilityState,
          robustnessPosture:
            input.cognitiveResilienceSnapshot.awarenessSummary.robustnessPosture ?? "moderate",
          summary:
            input.cognitiveResilienceSnapshot.awarenessSummary.survivabilityHeadline.slice(0, 80),
          generatedAt: now,
        }
      : null;

    const regulationPatterns: SelfRegulationPatternRecord[] = (
      input.cognitiveGovernanceSnapshot?.recentConstraintObservations ?? []
    )
      .slice(0, 3)
      .map((o) => ({
        patternId: stableSignature(["regulation-pattern", o.governanceId]).slice(0, 48),
        regulationState: o.regulationState,
        patternLabel: o.governanceCategory.replace(/_/g, " "),
        generatedAt: now,
      }));

    store.upsertSelfReflectiveSnapshots([snapshot], now);
    store.upsertSubsystemStates(subsystemStates, now);
    store.upsertGovernanceHistory([governanceHistoryEntry], now);
    store.upsertTrustRuntimeObservations([executiveTrustRuntime], now);
    if (survivabilityRecord) store.upsertSurvivabilitySummaries([survivabilityRecord], now);
    if (regulationPatterns.length > 0) store.upsertSelfRegulationPatterns(regulationPatterns, now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(runtimeStatus);

    const finalState = store.getState();
    const priorRuntime = prior.lastRuntimeStatus;
    const priorGovernance = prior.selfReflectiveSnapshots[0]?.governanceHealth;

    if (priorRuntime && priorRuntime !== runtimeStatus) {
      devLog(`runtime survivability shift — ${priorRuntime} → ${runtimeStatus}`);
    }

    if (priorGovernance && priorGovernance !== governanceHealth) {
      devLog(`governance health change — ${priorGovernance} → ${governanceHealth}`);
    }

    if (
      summary.reasoningIntegrity === "verified" ||
      summary.reasoningIntegrity === "coherent"
    ) {
      if (priorRuntime === "degraded") {
        devLog("reasoning integrity recovery — coherence restored across reflective runtime");
      }
    } else if (
      summary.reasoningIntegrity === "contradictory" ||
      summary.reasoningIntegrity === "fragmented"
    ) {
      devLog("reasoning integrity degradation — bounded reflection monitoring elevated");
    }

    if (
      summary.trustCalibration === "highly_trustworthy" ||
      summary.trustCalibration === "reliable"
    ) {
      if (governanceHealth === "governed" || governanceHealth === "enterprise_grade") {
        devLog("executive-grade trust formation — unified trust runtime aligned with governance");
      }
    }

    if (runtimeStatus === "stable" && governanceHealth === "enterprise_grade") {
      devLog("self-regulation stabilization — enterprise-grade unified meta-cognition runtime");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeSubsystemCount: activeSubsystems.length,
      storeSignature: finalState.signature,
    };
  } finally {
    endUnifiedMetaCognitionEvaluation();
  }
}
