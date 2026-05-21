import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginEnterpriseRuntimeFoundationEvaluation,
  clampEnterpriseRuntimeFoundationConfidence,
  endEnterpriseRuntimeFoundationEvaluation,
  ENTERPRISE_RUNTIME_FOUNDATION_MAX_GOVERNANCE_SIGNALS,
  ENTERPRISE_RUNTIME_FOUNDATION_MIN_ACTIVE_CATEGORIES,
  ENTERPRISE_RUNTIME_FOUNDATION_MIN_UNIFIED_SINGULARITY_DEPTH,
  reliabilityLevelRank,
  shouldEvaluateEnterpriseRuntimeFoundation,
  validateMVPStrategicReadinessSnapshot,
} from "./enterpriseRuntimeFoundationGuards";
import { getEnterpriseRuntimeFoundationStore } from "./enterpriseRuntimeFoundationStore";
import type {
  EnterpriseRuntimeFoundationHistoryEntry,
  EnterpriseRuntimeFoundationInput,
  EnterpriseRuntimeFoundationResult,
  EnterpriseRuntimeFoundationStatus,
  EnterpriseRuntimeGovernanceSignal,
  MVPStrategicReadinessSnapshot,
  RuntimeFoundationCategory,
  RuntimeFoundationSummary,
  RuntimeOperationalHealth,
  RuntimeReliabilityLevel,
  RuntimeReliabilityObservation,
} from "./enterpriseRuntimeFoundationTypes";

const DEV_LOG_PREFIX = "[Nexora][RuntimeFoundation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapSingularityToReliability(
  intelligenceLevel: string | undefined,
  runtimeStatus: string | undefined
): RuntimeReliabilityLevel {
  if (intelligenceLevel === "enterprise_grade" && (runtimeStatus === "unified" || runtimeStatus === "stable")) {
    return "enterprise_grade";
  }
  if (runtimeStatus === "unified" || intelligenceLevel === "unified") return "stable";
  if (runtimeStatus === "stable" || runtimeStatus === "recovering" || intelligenceLevel === "coherent") {
    return "reliable";
  }
  if (runtimeStatus === "degraded" || runtimeStatus === "initializing") return "weak";
  return "moderate";
}

function mapCategoryReliability(
  healthy: boolean,
  pressured: boolean
): RuntimeReliabilityLevel {
  if (healthy && !pressured) return "stable";
  if (healthy && pressured) return "reliable";
  if (!healthy && !pressured) return "moderate";
  return "weak";
}

function buildReliabilityObservations(
  input: EnterpriseRuntimeFoundationInput,
  now: number
): RuntimeReliabilityObservation[] {
  const singularity = input.finalStrategicIntelligenceSnapshot;
  const pressured = input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const singularityStable =
    singularity?.runtimeStatus === "unified" ||
    singularity?.runtimeStatus === "stable" ||
    singularity?.runtimeStatus === "recovering";
  const orchestrationActive = (input.decisionSnapshot?.activeSubsystems.length ?? 0) > 0;
  const institutionalActive =
    (input.unifiedInstitutionalConsciousnessSnapshot?.activeSubsystems.length ?? 0) > 0;
  const cognitionBounded = input.cognitionConverged !== false && input.continuityPreserved !== false;
  const explainable =
    Boolean(input.cognitionSnapshot?.organizationalLearningLine?.trim()) &&
    Boolean(input.cognitionSnapshot?.resilienceForecastLine?.trim());
  const executiveReady =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) > 0 &&
    (input.foresightSnapshot?.activeSubsystems.length ?? 0) > 0;
  const runtimeStable = input.runtimeStable !== false;

  const categories: Array<{
    category: RuntimeFoundationCategory;
    healthy: boolean;
    headline: string;
  }> = [
    {
      category: "runtime_stability",
      healthy: singularityStable && runtimeStable,
      headline: singularityStable
        ? "Unified cognitive singularity runtime remains structurally stable."
        : "Runtime stability requires additional singularity convergence.",
    },
    {
      category: "orchestration_reliability",
      healthy: orchestrationActive && !pressured,
      headline: orchestrationActive
        ? "Decision orchestration runtime maintains bounded sequencing reliability."
        : "Orchestration reliability awaiting decision-runtime depth.",
    },
    {
      category: "cognition_governance",
      healthy: institutionalActive && cognitionBounded,
      headline: institutionalActive
        ? "Institutional cognition governance remains within bounded operational envelopes."
        : "Cognition governance alignment requires institutional runtime depth.",
    },
    {
      category: "bounded_execution",
      healthy: cognitionBounded && singularity?.risks.every((r) => !r.includes("amplification")) !== false,
      headline: cognitionBounded
        ? "Cognition execution remains bounded without autonomous authority expansion."
        : "Bounded execution monitoring active across cognition pathways.",
    },
    {
      category: "operational_safety",
      healthy: input.continuityPreserved !== false && !pressured,
      headline:
        input.continuityPreserved !== false
          ? "Operational safety continuity preserved across enterprise topology."
          : "Operational safety monitoring elevated under topology pressure.",
    },
    {
      category: "explainability_reliability",
      healthy: explainable && (singularity?.confidence ?? 0) >= 0.48,
      headline: explainable
        ? "Executive explainability lines remain deterministic and traceable."
        : "Explainability reliability requires stronger narrative continuity.",
    },
    {
      category: "executive_readiness",
      healthy: executiveReady && singularityStable,
      headline: executiveReady
        ? "Executive interaction surfaces remain trustworthy under bounded runtime outputs."
        : "Executive readiness strengthening via consensus and foresight depth.",
    },
  ];

  return categories.map(({ category, healthy, headline }) => ({
    observationId: stableSignature(["runtime-foundation-observation", category, String(now)]).slice(
      0,
      48
    ),
    category,
    reliabilityLevel: mapCategoryReliability(healthy, pressured),
    headline: headline.slice(0, 120),
    active: healthy || category === "runtime_stability",
    generatedAt: now,
  }));
}

function deriveReliabilityLevel(observations: RuntimeReliabilityObservation[]): RuntimeReliabilityLevel {
  const active = observations.filter((o) => o.active);
  if (active.length === 0) return "weak";
  const maxRank = Math.max(...active.map((o) => reliabilityLevelRank(o.reliabilityLevel)));
  const levels: RuntimeReliabilityLevel[] = [
    "weak",
    "moderate",
    "reliable",
    "stable",
    "enterprise_grade",
  ];
  return levels[maxRank - 1] ?? "moderate";
}

function deriveRuntimeStatus(
  reliabilityLevel: RuntimeReliabilityLevel,
  observations: RuntimeReliabilityObservation[],
  priorStatus: EnterpriseRuntimeFoundationStatus | null,
  pressured: boolean
): EnterpriseRuntimeFoundationStatus {
  const weakCount = observations.filter((o) => o.reliabilityLevel === "weak").length;
  const stableCount = observations.filter(
    (o) => o.reliabilityLevel === "stable" || o.reliabilityLevel === "enterprise_grade"
  ).length;

  if (weakCount >= 3) return "unstable";
  if (
    reliabilityLevel === "enterprise_grade" &&
    stableCount >= 5 &&
    !pressured
  ) {
    return "mvp_ready";
  }
  if (reliabilityLevel === "stable" || reliabilityLevel === "enterprise_grade") {
    return pressured ? "hardened" : "mvp_ready";
  }
  if (reliabilityLevel === "reliable") return pressured ? "operational" : "hardened";
  if (priorStatus === "mvp_ready" && pressured) return "operational";
  if (weakCount >= 1) return "stabilizing";
  return "operational";
}

function buildFoundationSummary(input: EnterpriseRuntimeFoundationInput): RuntimeFoundationSummary {
  const pressured = input.operationalTopologyStressed === true;
  return {
    singularityRuntimeState:
      input.finalStrategicIntelligenceSnapshot?.runtimeStatus ?? "unknown",
    institutionalRuntimeState:
      input.unifiedInstitutionalConsciousnessSnapshot?.runtimeStatus ??
      input.unifiedInstitutionalConsciousnessSnapshot?.summary.ecosystemState ??
      "unknown",
    orchestrationState:
      input.decisionSnapshot?.summary.orchestrationState ??
      input.decisionSnapshot?.runtimeStatus ??
      "unknown",
    governanceState:
      input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment ??
      input.unifiedSelfReflectiveSnapshot?.runtimeStatus ??
      "unknown",
    explainabilityState: input.cognitionSnapshot?.organizationalLearningLine
      ? "deterministic_narrative_active"
      : "narrative_awaiting_depth",
    executiveInteractionState:
      (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) > 0
        ? "consensus_backed_interaction"
        : "interaction_depth_pending",
    primaryOperationalRisk: pressured
      ? "localized_runtime_amplification_pressure"
      : "bounded_runtime_monitoring",
  };
}

function buildOperationalHealth(
  reliabilityLevel: RuntimeReliabilityLevel,
  runtimeStatus: EnterpriseRuntimeFoundationStatus
): RuntimeOperationalHealth {
  return {
    level: reliabilityLevel,
    integrityState:
      runtimeStatus === "mvp_ready"
        ? "mvp_runtime_ready"
        : runtimeStatus === "unstable"
          ? "runtime_instability_detected"
          : "runtime_stabilization_active",
    foundationHeadline:
      "Enterprise runtime foundation consolidating production-safe cognition orchestration.",
    readinessPosture:
      reliabilityLevel === "enterprise_grade"
        ? "executive_grade"
        : reliabilityLevel === "stable"
          ? "high"
          : reliabilityLevel === "reliable"
            ? "moderate"
            : "low",
  };
}

function collectReadinessSignals(
  activeCategories: RuntimeFoundationCategory[],
  runtimeStatus: EnterpriseRuntimeFoundationStatus,
  input: EnterpriseRuntimeFoundationInput
): string[] {
  const signals: string[] = [];

  if (activeCategories.includes("bounded_execution")) {
    signals.push("bounded_cognition");
  }
  if (activeCategories.includes("orchestration_reliability")) {
    signals.push("stable_orchestration");
  }
  if (activeCategories.includes("cognition_governance")) {
    signals.push("runtime_governance_alignment");
  }
  if (activeCategories.includes("explainability_reliability")) {
    signals.push("executive_safe_outputs");
  }
  if (input.cognitionConverged !== false) {
    signals.push("deterministic_runtime_behavior");
  }
  if (runtimeStatus === "mvp_ready" || runtimeStatus === "hardened") {
    signals.push("mvp_strategic_readiness");
  }
  if (activeCategories.includes("executive_readiness")) {
    signals.push("executive_interaction_trust");
  }

  return Array.from(new Set(signals)).slice(0, 6);
}

function collectOperationalRisks(
  input: EnterpriseRuntimeFoundationInput,
  observations: RuntimeReliabilityObservation[]
): string[] {
  const risks: string[] = [];

  if (input.operationalTopologyStressed) {
    risks.push("localized_runtime_amplification_pressure");
  }
  if (observations.filter((o) => o.reliabilityLevel === "weak").length >= 2) {
    risks.push("orchestration_reliability_weakness");
  }
  if (!input.cognitionSnapshot?.organizationalLearningLine?.trim()) {
    risks.push("explainability_degradation_warning");
  }
  if (
    input.finalStrategicIntelligenceSnapshot?.risks.some((r) =>
      r.includes("fragmentation")
    )
  ) {
    risks.push("cognition_governance_risk");
  }
  if (input.fragilityElevated && input.continuityPreserved === false) {
    risks.push("operational_reliability_gap");
  }

  return Array.from(new Set(risks)).slice(0, 6);
}

function buildGovernanceSignals(
  activeCategories: RuntimeFoundationCategory[],
  runtimeStatus: EnterpriseRuntimeFoundationStatus,
  reliabilityLevel: RuntimeReliabilityLevel,
  now: number
): EnterpriseRuntimeGovernanceSignal[] {
  const signals: EnterpriseRuntimeGovernanceSignal[] = [];

  if (runtimeStatus === "mvp_ready" || reliabilityLevel === "enterprise_grade") {
    signals.push({
      signalId: stableSignature(["runtime-governance-signal", "mvp-readiness"]).slice(0, 48),
      signalLabel: "MVP readiness strengthening",
      signalSummary: "Enterprise runtime foundation reached MVP strategic readiness posture.",
      linkedCategories: Object.freeze(activeCategories.slice(0, 4)),
      signalIntensity: "high",
      confidence: 0.9,
      generatedAt: now,
    });
  }

  if (runtimeStatus === "stabilizing" || runtimeStatus === "unstable") {
    signals.push({
      signalId: stableSignature(["runtime-governance-signal", "stabilization"]).slice(0, 48),
      signalLabel: "runtime stabilization",
      signalSummary: "Runtime foundation actively stabilizing orchestration and cognition boundaries.",
      linkedCategories: Object.freeze(["runtime_stability", "orchestration_reliability"] as const),
      signalIntensity: "moderate",
      confidence: 0.82,
      generatedAt: now,
    });
  }

  if (activeCategories.includes("cognition_governance")) {
    signals.push({
      signalId: stableSignature(["runtime-governance-signal", "cognition-governance"]).slice(0, 48),
      signalLabel: "cognition governance",
      signalSummary: "Bounded cognition governance enforced across enterprise intelligence runtimes.",
      linkedCategories: Object.freeze(["cognition_governance", "bounded_execution"] as const),
      signalIntensity: "moderate",
      confidence: 0.85,
      generatedAt: now,
    });
  }

  return signals.slice(0, ENTERPRISE_RUNTIME_FOUNDATION_MAX_GOVERNANCE_SIGNALS);
}

function buildReadinessSnapshot(
  organizationId: string,
  runtimeStatus: EnterpriseRuntimeFoundationStatus,
  reliabilityLevel: RuntimeReliabilityLevel,
  summary: RuntimeFoundationSummary,
  activeCategories: RuntimeFoundationCategory[],
  observations: RuntimeReliabilityObservation[],
  health: RuntimeOperationalHealth,
  governanceSignals: EnterpriseRuntimeGovernanceSignal[],
  readinessSignals: string[],
  operationalRisks: string[],
  confidence: number,
  now: number
): MVPStrategicReadinessSnapshot {
  const runtimeSummary =
    "Nexora's enterprise intelligence runtimes remain operationally stable, bounded, explainable, and strategically coherent across cognition, orchestration, governance, and executive interaction systems.";

  const signature = stableSignature([
    "d9-10-1-enterprise-runtime-foundation-snapshot",
    organizationId,
    runtimeStatus,
    reliabilityLevel,
    activeCategories.join(","),
    summary.primaryOperationalRisk,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    runtimeFoundationId: stableSignature([
      "enterprise-runtime-foundation",
      organizationId,
    ]).slice(0, 56),
    runtimeStatus,
    reliabilityLevel,
    summary: runtimeSummary,
    readinessSignals: Object.freeze(readinessSignals),
    operationalRisks: Object.freeze(operationalRisks),
    confidence: clampEnterpriseRuntimeFoundationConfidence(confidence),
    activeFoundationCategories: Object.freeze(activeCategories),
    reliabilityObservations: Object.freeze(observations),
    runtimeOperationalHealth: health,
    runtimeFoundationSummary: summary,
    governanceSignals: Object.freeze(governanceSignals),
  };
}

function computeConfidence(
  observations: RuntimeReliabilityObservation[],
  reliabilityLevel: RuntimeReliabilityLevel,
  runtimeStatus: EnterpriseRuntimeFoundationStatus
): number {
  const activeCount = observations.filter((o) => o.active).length;
  const base = 0.7 + activeCount * 0.03;
  const levelBoost =
    reliabilityLevel === "enterprise_grade"
      ? 0.2
      : reliabilityLevel === "stable"
        ? 0.15
        : reliabilityLevel === "reliable"
          ? 0.08
          : 0;
  const statusBoost =
    runtimeStatus === "mvp_ready" ? 0.05 : runtimeStatus === "unstable" ? -0.08 : 0;
  return base + levelBoost + statusBoost;
}

export function evaluateEnterpriseRuntimeFoundation(
  input: EnterpriseRuntimeFoundationInput
): EnterpriseRuntimeFoundationResult {
  if (!beginEnterpriseRuntimeFoundationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      activeFoundationCategoryCount: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getEnterpriseRuntimeFoundationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-10-1-enterprise-runtime-foundation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.finalStrategicIntelligenceSnapshot?.signature ?? "no-singularity",
      input.unifiedInstitutionalConsciousnessSnapshot?.signature ?? "no-institutional",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-meta",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      String(input.runtimeStable ?? "unknown"),
    ]);

    if (
      !shouldEvaluateEnterpriseRuntimeFoundation(
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
        snapshot: prior.readinessSnapshots[0] ?? null,
        activeFoundationCategoryCount: prior.reliabilityObservations.filter((o) => o.active)
          .length,
        storeSignature: prior.signature,
      };
    }

    const singularityDepth = input.finalStrategicIntelligenceSnapshot ? 1 : 0;
    if (singularityDepth < ENTERPRISE_RUNTIME_FOUNDATION_MIN_UNIFIED_SINGULARITY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_cognitive_singularity_depth",
        snapshot: prior.readinessSnapshots[0] ?? null,
        activeFoundationCategoryCount: 0,
        storeSignature: prior.signature,
      };
    }

    const observations = buildReliabilityObservations(input, now);
    const activeCategories = observations
      .filter((o) => o.active)
      .map((o) => o.category);

    if (activeCategories.length < ENTERPRISE_RUNTIME_FOUNDATION_MIN_ACTIVE_CATEGORIES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_foundation_categories",
        snapshot: prior.readinessSnapshots[0] ?? null,
        activeFoundationCategoryCount: activeCategories.length,
        storeSignature: prior.signature,
      };
    }

    const pressured = input.operationalTopologyStressed === true || input.fragilityElevated === true;
    const singularityReliability = mapSingularityToReliability(
      input.finalStrategicIntelligenceSnapshot?.intelligenceLevel,
      input.finalStrategicIntelligenceSnapshot?.runtimeStatus
    );
    const observationReliability = deriveReliabilityLevel(observations);
    const reliabilityLevel =
      reliabilityLevelRank(singularityReliability) >= reliabilityLevelRank(observationReliability)
        ? singularityReliability
        : observationReliability;

    const runtimeStatus = deriveRuntimeStatus(
      reliabilityLevel,
      observations,
      prior.lastRuntimeStatus,
      pressured
    );
    const foundationSummary = buildFoundationSummary(input);
    const health = buildOperationalHealth(reliabilityLevel, runtimeStatus);
    const readinessSignals = collectReadinessSignals(activeCategories, runtimeStatus, input);
    const operationalRisks = collectOperationalRisks(input, observations);
    const governanceSignals = buildGovernanceSignals(
      activeCategories,
      runtimeStatus,
      reliabilityLevel,
      now
    );
    const confidence = computeConfidence(observations, reliabilityLevel, runtimeStatus);

    const snapshot = buildReadinessSnapshot(
      organizationId,
      runtimeStatus,
      reliabilityLevel,
      foundationSummary,
      activeCategories,
      observations,
      health,
      governanceSignals,
      readinessSignals,
      operationalRisks,
      confidence,
      now
    );

    if (!validateMVPStrategicReadinessSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_readiness_snapshot",
        snapshot: prior.readinessSnapshots[0] ?? null,
        activeFoundationCategoryCount: activeCategories.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: EnterpriseRuntimeFoundationHistoryEntry = {
      entryId: stableSignature(["runtime-foundation-history", snapshot.signature]).slice(0, 48),
      reliabilityLevel,
      runtimeStatus,
      headline: health.foundationHeadline.slice(0, 80),
      generatedAt: now,
    };

    store.upsertReadinessSnapshots([snapshot], now);
    store.upsertReliabilityObservations(observations, now);
    store.upsertFoundationHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(runtimeStatus);

    const priorRuntime = prior.lastRuntimeStatus;

    if (runtimeStatus === "mvp_ready" || runtimeStatus === "hardened") {
      devLog("MVP readiness strengthening — enterprise runtime foundation stabilized");
    }

    if (runtimeStatus === "stabilizing" || runtimeStatus === "unstable") {
      devLog("runtime stabilization — orchestration and cognition boundaries under reinforcement");
    }

    if (
      observations.some((o) => o.category === "orchestration_reliability" && o.reliabilityLevel === "weak")
    ) {
      devLog("orchestration reliability degradation — bounded sequencing monitoring elevated");
    }

    if (operationalRisks.includes("cognition_governance_risk")) {
      devLog("cognition-governance risk — institutional runtime drift from operational reality mapped");
    }

    if (
      priorRuntime &&
      priorRuntime !== runtimeStatus &&
      (runtimeStatus === "unstable" || runtimeStatus === "stabilizing")
    ) {
      devLog(`runtime foundation shift — ${priorRuntime} → ${runtimeStatus}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeFoundationCategoryCount: activeCategories.length,
      storeSignature: store.getState().signature,
    };
  } finally {
    endEnterpriseRuntimeFoundationEvaluation();
  }
}
