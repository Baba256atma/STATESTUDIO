import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginUnifiedCognitiveSingularityRuntimeEvaluation,
  clampUnifiedCognitiveSingularityRuntimeConfidence,
  endUnifiedCognitiveSingularityRuntimeEvaluation,
  intelligenceLevelRank,
  shouldEvaluateUnifiedCognitiveSingularityRuntime,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INTELLIGENCE_SIGNALS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_ACTIVE_SUBSYSTEMS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_FINAL_INTEGRATION_OBSERVATIONS,
  validateFinalStrategicIntelligenceSnapshot,
} from "./unifiedCognitiveSingularityRuntimeGuards";
import { getUnifiedCognitiveSingularityRuntimeStore } from "./unifiedCognitiveSingularityRuntimeStore";
import type {
  CognitiveSingularityHealth,
  CognitiveSingularitySubsystemId,
  CognitiveSingularitySubsystemState,
  EnterpriseStrategicConvergenceSummary,
  FinalEnterpriseIntelligenceSignal,
  FinalStrategicIntelligenceSnapshot,
  IntelligenceLevel,
  UnifiedCognitiveSingularityRuntimeHistoryEntry,
  UnifiedCognitiveSingularityRuntimeInput,
  UnifiedCognitiveSingularityRuntimeResult,
  UnifiedCognitiveSingularityRuntimeStatus,
} from "./unifiedCognitiveSingularityRuntimeTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedCognitiveSingularityRuntime]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapPostureToIntelligence(posture: string | undefined): IntelligenceLevel {
  if (posture === "executive_grade") return "enterprise_grade";
  if (posture === "high") return "unified";
  if (posture === "moderate") return "coherent";
  if (posture === "low") return "weak";
  return "moderate";
}

function mapDominantStateToIntelligence(state: string | undefined): IntelligenceLevel {
  const normalized = (state ?? "").toLowerCase();
  if (
    normalized.includes("enterprise") ||
    normalized.includes("fully") ||
    normalized.includes("strategically_resonant") ||
    normalized.includes("strategically_stable")
  ) {
    return "enterprise_grade";
  }
  if (
    normalized.includes("unified") ||
    normalized.includes("coherent") ||
    normalized.includes("harmonic") ||
    normalized.includes("balanced") ||
    normalized.includes("aligned")
  ) {
    return "unified";
  }
  if (
    normalized.includes("converging") ||
    normalized.includes("reinforcing") ||
    normalized.includes("rebalancing") ||
    normalized.includes("partially")
  ) {
    return "coherent";
  }
  if (
    normalized.includes("fragmented") ||
    normalized.includes("dissonant") ||
    normalized.includes("imbalanced") ||
    normalized.includes("unstable")
  ) {
    return "weak";
  }
  return "moderate";
}

function intelligenceToSubsystemStatus(
  level: IntelligenceLevel,
  degraded: boolean
): UnifiedCognitiveSingularityRuntimeStatus {
  if (degraded && (level === "weak" || level === "moderate")) return "degraded";
  if (level === "enterprise_grade" || level === "unified") {
    return degraded ? "recovering" : "unified";
  }
  if (level === "coherent") return degraded ? "recovering" : "stable";
  if (level === "moderate") return "stable";
  return "initializing";
}

function buildSubsystemState(
  subsystemId: CognitiveSingularitySubsystemId,
  observationCount: number,
  headline: string,
  dominantState: string | undefined,
  posture: string | undefined,
  degraded: boolean,
  now: number
): CognitiveSingularitySubsystemState {
  const dominantLevel = mapDominantStateToIntelligence(dominantState);
  const intelligenceLevel =
    dominantLevel === "weak"
      ? dominantLevel
      : posture !== undefined
        ? mapPostureToIntelligence(posture)
        : dominantLevel;

  return {
    subsystemId,
    status: intelligenceToSubsystemStatus(intelligenceLevel, degraded),
    observationCount,
    intelligenceLevel,
    headline: headline.slice(0, 120),
    active: observationCount > 0,
    lastUpdatedAt: now,
  };
}

function buildAllSubsystemStates(
  input: UnifiedCognitiveSingularityRuntimeInput,
  now: number
): CognitiveSingularitySubsystemState[] {
  const degraded = input.fragilityElevated === true || input.operationalTopologyStressed === true;

  return [
    buildSubsystemState(
      "cognitive_singularity",
      input.cognitiveSingularitySnapshot?.observationCount ?? 0,
      input.cognitiveSingularitySnapshot?.singularitySummary.singularityHeadline ??
        "Cognitive singularity foundation awaiting depth.",
      input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState,
      input.cognitiveSingularitySnapshot?.singularitySummary.convergencePosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "awareness_synchronization",
      input.awarenessSynchronizationSnapshot?.observationCount ?? 0,
      input.awarenessSynchronizationSnapshot?.synchronizationSummary.synchronizationHeadline ??
        "Awareness synchronization awaiting depth.",
      input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState,
      input.awarenessSynchronizationSnapshot?.synchronizationSummary.alignmentPosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "strategic_intent",
      input.unifiedStrategicIntentSnapshot?.observationCount ?? 0,
      input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.intentHeadline ??
        "Strategic intent awaiting depth.",
      input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState,
      input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.alignmentPosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "strategic_identity",
      input.enterpriseStrategicIdentitySnapshot?.observationCount ?? 0,
      input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.identityHeadline ??
        "Strategic identity awaiting depth.",
      input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState,
      input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.consistencyPosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "strategic_will",
      input.enterpriseStrategicWillSnapshot?.observationCount ?? 0,
      input.enterpriseStrategicWillSnapshot?.strategicWillSummary.willHeadline ??
        "Strategic will awaiting depth.",
      input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState,
      input.enterpriseStrategicWillSnapshot?.strategicWillSummary.commitmentPosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "strategic_coherence",
      input.unifiedStrategicCoherenceSnapshot?.observationCount ?? 0,
      input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.coherenceHeadline ??
        "Strategic coherence awaiting depth.",
      input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState,
      input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.alignmentPosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "strategic_equilibrium",
      input.enterpriseStrategicEquilibriumSnapshot?.observationCount ?? 0,
      input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary.equilibriumHeadline ??
        "Strategic equilibrium awaiting depth.",
      input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
        .dominantEquilibriumState,
      input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary.balancePosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "strategic_resonance",
      input.enterpriseStrategicResonanceSnapshot?.observationCount ?? 0,
      input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.resonanceHeadline ??
        "Strategic resonance awaiting depth.",
      input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceState,
      input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.harmonicPosture,
      degraded,
      now
    ),
    buildSubsystemState(
      "final_strategic_integration",
      input.finalStrategicIntegrationSnapshot?.observationCount ?? 0,
      input.finalStrategicIntegrationSnapshot?.finalIntegrationSummary.integrationHeadline ??
        "Final strategic integration awaiting depth.",
      input.finalStrategicIntegrationSnapshot?.finalIntegrationSummary.dominantIntegrationState,
      input.finalStrategicIntegrationSnapshot?.finalIntegrationSummary.convergencePosture,
      degraded,
      now
    ),
  ];
}

function deriveRuntimeStatus(
  subsystemStates: CognitiveSingularitySubsystemState[],
  priorStatus: UnifiedCognitiveSingularityRuntimeStatus | null,
  degraded: boolean
): UnifiedCognitiveSingularityRuntimeStatus {
  const degradedCount = subsystemStates.filter((s) => s.status === "degraded").length;
  const unifiedCount = subsystemStates.filter((s) => s.status === "unified").length;
  const initializingCount = subsystemStates.filter((s) => s.status === "initializing").length;

  if (degradedCount >= 2) return "degraded";
  if (initializingCount >= 4) return "initializing";
  if (unifiedCount >= 6 && !degraded) return "unified";
  if (unifiedCount >= 4) return degraded ? "recovering" : "stable";
  if (priorStatus === "unified" && degraded) return "recovering";
  return degraded ? "recovering" : "stable";
}

function deriveIntelligenceLevel(
  subsystemStates: CognitiveSingularitySubsystemState[]
): IntelligenceLevel {
  const levels = subsystemStates.filter((s) => s.active).map((s) => s.intelligenceLevel);
  if (levels.length === 0) return "weak";

  const maxRank = Math.max(...levels.map((l) => intelligenceLevelRank(l)));
  const enterpriseCount = levels.filter((l) => l === "enterprise_grade").length;
  const unifiedCount = levels.filter((l) => l === "unified" || l === "enterprise_grade").length;

  if (enterpriseCount >= 4 && unifiedCount >= 6) return "enterprise_grade";
  if (maxRank >= intelligenceLevelRank("unified") && unifiedCount >= 5) return "unified";
  if (maxRank >= intelligenceLevelRank("coherent")) return "coherent";
  if (maxRank >= intelligenceLevelRank("moderate")) return "moderate";
  return "weak";
}

function buildConvergenceSummary(
  input: UnifiedCognitiveSingularityRuntimeInput
): EnterpriseStrategicConvergenceSummary {
  const pressured = input.operationalTopologyStressed === true;
  return {
    singularityState:
      input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState ?? "unknown",
    awarenessState:
      input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ??
      "unknown",
    intentState:
      input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ?? "unknown",
    identityState:
      input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ??
      "unknown",
    willState:
      input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ?? "unknown",
    coherenceState:
      input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ??
      "unknown",
    equilibriumState:
      input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
        .dominantEquilibriumState ?? "unknown",
    resonanceState:
      input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceState ??
      "unknown",
    integrationState:
      input.finalStrategicIntegrationSnapshot?.finalIntegrationSummary.dominantIntegrationState ??
      "unknown",
    primaryConvergenceRisk: pressured
      ? "localized_operational_speed_pressure"
      : "bounded_strategic_convergence_monitoring",
  };
}

function buildCognitiveSingularityHealth(
  intelligenceLevel: IntelligenceLevel,
  runtimeStatus: UnifiedCognitiveSingularityRuntimeStatus,
  summary: EnterpriseStrategicConvergenceSummary
): CognitiveSingularityHealth {
  return {
    level: intelligenceLevel,
    integrityState:
      runtimeStatus === "unified"
        ? "enterprise_runtime_unified"
        : runtimeStatus === "degraded"
          ? "runtime_fragmentation_detected"
          : "runtime_convergence_active",
    runtimeHeadline:
      "Unified enterprise cognitive singularity runtime consolidating D9:9 strategic intelligence layers.",
    convergencePosture:
      intelligenceLevel === "enterprise_grade"
        ? "executive_grade"
        : intelligenceLevel === "unified"
          ? "high"
          : intelligenceLevel === "coherent"
            ? "moderate"
            : "low",
  };
}

function collectUnifiedSignals(
  activeSubsystems: CognitiveSingularitySubsystemId[],
  summary: EnterpriseStrategicConvergenceSummary,
  runtimeStatus: UnifiedCognitiveSingularityRuntimeStatus
): string[] {
  const signals: string[] = ["cross_runtime_convergence"];

  if (activeSubsystems.includes("strategic_intent") && activeSubsystems.includes("strategic_identity") && activeSubsystems.includes("strategic_will")) {
    signals.push("strategic_intent_identity_will_alignment");
  }
  if (activeSubsystems.includes("strategic_coherence")) {
    signals.push("total_system_coherence");
  }
  if (activeSubsystems.includes("strategic_equilibrium")) {
    signals.push("strategic_equilibrium");
  }
  if (activeSubsystems.includes("strategic_resonance")) {
    signals.push("safe_resonance");
  }
  if (activeSubsystems.includes("final_strategic_integration")) {
    signals.push("final_runtime_integration");
  }
  if (runtimeStatus === "unified") {
    signals.push("unified_cognitive_singularity_runtime");
  }
  if (
    summary.coherenceState === "fully_aligned" ||
    summary.integrationState === "fully_integrated"
  ) {
    signals.push("enterprise_strategic_convergence");
  }

  return Array.from(new Set(signals)).slice(0, 6);
}

function collectRisks(
  input: UnifiedCognitiveSingularityRuntimeInput,
  subsystemStates: CognitiveSingularitySubsystemState[]
): string[] {
  const risks: string[] = [];

  if (input.operationalTopologyStressed) {
    risks.push("localized_operational_speed_pressure");
  }
  if (subsystemStates.some((s) => s.status === "degraded")) {
    risks.push("subsystem_runtime_fragmentation");
  }
  const coherenceState =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState;
  if (coherenceState === "drifting" || coherenceState === "fragmented") {
    risks.push("coherence_drift_monitoring");
  }
  if (
    input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceState ===
    "dissonant"
  ) {
    risks.push("resonance_dissonance_monitoring");
  }

  return Array.from(new Set(risks)).slice(0, 6);
}

function buildIntelligenceSignals(
  activeSubsystems: CognitiveSingularitySubsystemId[],
  runtimeStatus: UnifiedCognitiveSingularityRuntimeStatus,
  intelligenceLevel: IntelligenceLevel,
  now: number
): FinalEnterpriseIntelligenceSignal[] {
  const signals: FinalEnterpriseIntelligenceSignal[] = [];

  if (runtimeStatus === "unified" || intelligenceLevel === "enterprise_grade") {
    signals.push({
      signalId: stableSignature(["final-enterprise-intelligence-signal", "runtime-unified"]).slice(
        0,
        48
      ),
      signalLabel: "runtime unification",
      signalSummary: "D9:9 strategic intelligence layers unified into bounded enterprise runtime.",
      linkedSubsystems: Object.freeze(activeSubsystems.slice(0, 6)),
      signalIntensity: "high",
      confidence: 0.92,
      generatedAt: now,
    });
  }

  if (activeSubsystems.includes("final_strategic_integration")) {
    signals.push({
      signalId: stableSignature(["final-enterprise-intelligence-signal", "final-integration"]).slice(
        0,
        48
      ),
      signalLabel: "final integration",
      signalSummary: "Final strategic integration subsystem active within unified runtime.",
      linkedSubsystems: Object.freeze(["final_strategic_integration"] as const),
      signalIntensity: "moderate",
      confidence: 0.88,
      generatedAt: now,
    });
  }

  return signals.slice(0, UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INTELLIGENCE_SIGNALS);
}

function buildFinalSnapshot(
  organizationId: string,
  runtimeStatus: UnifiedCognitiveSingularityRuntimeStatus,
  intelligenceLevel: IntelligenceLevel,
  summary: EnterpriseStrategicConvergenceSummary,
  activeSubsystems: CognitiveSingularitySubsystemId[],
  subsystemStates: CognitiveSingularitySubsystemState[],
  health: CognitiveSingularityHealth,
  intelligenceSignals: FinalEnterpriseIntelligenceSignal[],
  unifiedSignals: string[],
  risks: string[],
  confidence: number,
  now: number
): FinalStrategicIntelligenceSnapshot {
  const runtimeSummary =
    "Nexora's strategic intelligence runtimes are unified across cognition, memory, temporal awareness, foresight, orchestration, meta-cognition, consensus, institutional continuity, and final strategic integration.";

  const signature = stableSignature([
    "d9-9-10-unified-cognitive-singularity-runtime-snapshot",
    organizationId,
    runtimeStatus,
    intelligenceLevel,
    activeSubsystems.join(","),
    summary.integrationState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    runtimeId: stableSignature(["unified-enterprise-cognitive-singularity", organizationId]).slice(
      0,
      56
    ),
    runtimeStatus,
    intelligenceLevel,
    summary: runtimeSummary,
    unifiedSignals: Object.freeze(unifiedSignals),
    risks: Object.freeze(risks),
    confidence: clampUnifiedCognitiveSingularityRuntimeConfidence(confidence),
    activeSubsystems: Object.freeze(activeSubsystems),
    subsystemStates: Object.freeze(subsystemStates),
    cognitiveSingularityHealth: health,
    enterpriseStrategicConvergenceSummary: summary,
    finalEnterpriseIntelligenceSignals: Object.freeze(intelligenceSignals),
  };
}

function computeConfidence(
  subsystemStates: CognitiveSingularitySubsystemState[],
  intelligenceLevel: IntelligenceLevel,
  runtimeStatus: UnifiedCognitiveSingularityRuntimeStatus
): number {
  const activeCount = subsystemStates.filter((s) => s.active).length;
  const base = 0.72 + activeCount * 0.025;
  const levelBoost =
    intelligenceLevel === "enterprise_grade"
      ? 0.18
      : intelligenceLevel === "unified"
        ? 0.14
        : intelligenceLevel === "coherent"
          ? 0.08
          : 0;
  const statusBoost = runtimeStatus === "unified" ? 0.05 : runtimeStatus === "degraded" ? -0.06 : 0;
  return base + levelBoost + statusBoost;
}

export function evaluateUnifiedCognitiveSingularityRuntime(
  input: UnifiedCognitiveSingularityRuntimeInput
): UnifiedCognitiveSingularityRuntimeResult {
  if (!beginUnifiedCognitiveSingularityRuntimeEvaluation()) {
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
    const store = getUnifiedCognitiveSingularityRuntimeStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-10-unified-cognitive-singularity-runtime-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.finalStrategicIntegrationSnapshot?.signature ?? "no-final-integration",
      input.enterpriseStrategicResonanceSnapshot?.signature ?? "no-resonance",
      input.enterpriseStrategicEquilibriumSnapshot?.signature ?? "no-equilibrium",
      input.unifiedStrategicCoherenceSnapshot?.signature ?? "no-coherence",
      input.enterpriseStrategicWillSnapshot?.signature ?? "no-will",
      input.enterpriseStrategicIdentitySnapshot?.signature ?? "no-identity",
      input.unifiedStrategicIntentSnapshot?.signature ?? "no-intent",
      input.awarenessSynchronizationSnapshot?.signature ?? "no-awareness",
      input.cognitiveSingularitySnapshot?.signature ?? "no-singularity",
      input.unifiedInstitutionalConsciousnessSnapshot?.signature ?? "no-institutional",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-meta",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateUnifiedCognitiveSingularityRuntime(
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
        snapshot: prior.finalSnapshots[0] ?? null,
        activeSubsystemCount: prior.subsystemStates.filter((s) => s.active).length,
        storeSignature: prior.signature,
      };
    }

    const integrationDepth = input.finalStrategicIntegrationSnapshot?.observationCount ?? 0;
    if (integrationDepth < UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_FINAL_INTEGRATION_OBSERVATIONS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_final_strategic_integration_depth",
        snapshot: prior.finalSnapshots[0] ?? null,
        activeSubsystemCount: 0,
        storeSignature: prior.signature,
      };
    }

    const subsystemStates = buildAllSubsystemStates(input, now);
    const activeSubsystems = subsystemStates
      .filter((s) => s.active)
      .map((s) => s.subsystemId);

    if (activeSubsystems.length < UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_ACTIVE_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_subsystems",
        snapshot: prior.finalSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const degraded = input.fragilityElevated === true || input.operationalTopologyStressed === true;
    const runtimeStatus = deriveRuntimeStatus(
      subsystemStates,
      prior.lastRuntimeStatus,
      degraded
    );
    const intelligenceLevel = deriveIntelligenceLevel(subsystemStates);
    const convergenceSummary = buildConvergenceSummary(input);
    const health = buildCognitiveSingularityHealth(
      intelligenceLevel,
      runtimeStatus,
      convergenceSummary
    );
    const unifiedSignals = collectUnifiedSignals(activeSubsystems, convergenceSummary, runtimeStatus);
    const risks = collectRisks(input, subsystemStates);
    const confidence = computeConfidence(subsystemStates, intelligenceLevel, runtimeStatus);
    const intelligenceSignals = buildIntelligenceSignals(
      activeSubsystems,
      runtimeStatus,
      intelligenceLevel,
      now
    );

    const snapshot = buildFinalSnapshot(
      organizationId,
      runtimeStatus,
      intelligenceLevel,
      convergenceSummary,
      activeSubsystems,
      subsystemStates,
      health,
      intelligenceSignals,
      unifiedSignals,
      risks,
      confidence,
      now
    );

    if (!validateFinalStrategicIntelligenceSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_final_snapshot",
        snapshot: prior.finalSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: UnifiedCognitiveSingularityRuntimeHistoryEntry = {
      entryId: stableSignature(["unified-cognitive-singularity-history", snapshot.signature]).slice(
        0,
        48
      ),
      intelligenceLevel,
      runtimeStatus,
      headline: health.runtimeHeadline.slice(0, 80),
      generatedAt: now,
    };

    store.upsertFinalSnapshots([snapshot], now);
    store.upsertSubsystemStates(subsystemStates, now);
    store.upsertRuntimeHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(runtimeStatus);

    const priorRuntime = prior.lastRuntimeStatus;

    if (runtimeStatus === "unified" || intelligenceLevel === "enterprise_grade") {
      devLog("runtime unification — D9:9 strategic intelligence layers consolidated");
    }

    if (runtimeStatus === "degraded" || subsystemStates.filter((s) => s.status === "degraded").length >= 2) {
      devLog("strategic fragmentation — subsystem runtime divergence mapped without autonomous repair");
    }

    if (intelligenceLevel === "enterprise_grade" && runtimeStatus === "unified") {
      devLog("enterprise-grade convergence — final unified enterprise intelligence runtime complete");
    }

    if (
      priorRuntime &&
      priorRuntime !== runtimeStatus &&
      (runtimeStatus === "degraded" || runtimeStatus === "recovering")
    ) {
      devLog(`final integration degradation/recovery — ${priorRuntime} → ${runtimeStatus}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeSubsystemCount: activeSubsystems.length,
      storeSignature: store.getState().signature,
    };
  } finally {
    endUnifiedCognitiveSingularityRuntimeEvaluation();
  }
}
