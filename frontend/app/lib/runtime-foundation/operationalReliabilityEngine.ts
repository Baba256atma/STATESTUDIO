import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginOperationalReliabilityEvaluation,
  clampOperationalReliabilityConfidence,
  endOperationalReliabilityEvaluation,
  operationalReliabilityLevelRank,
  OPERATIONAL_RELIABILITY_MAX_TRUST_SIGNALS,
  OPERATIONAL_RELIABILITY_MIN_ACTIVE_CATEGORIES,
  OPERATIONAL_RELIABILITY_MIN_RUNTIME_FOUNDATION_DEPTH,
  shouldEvaluateOperationalReliability,
  validateExecutiveOperationalReliabilitySnapshot,
} from "./operationalReliabilityGuards";
import { getOperationalReliabilityStore } from "./operationalReliabilityStore";
import type {
  EnterpriseRuntimeTrustField,
  ExecutiveOperationalReliabilityInput,
  ExecutiveOperationalReliabilityResult,
  ExecutiveOperationalReliabilitySnapshot,
  OperationalReliabilityCategory,
  OperationalReliabilityHistoryEntry,
  OperationalReliabilityLevel,
  OperationalReliabilityObservation,
  OperationalReliabilitySummary,
  PanelRuntimeHealthSignal,
  RuntimeTrustRiskIndicator,
  RuntimeTrustSignal,
  RuntimeTrustState,
  SceneStabilitySignal,
} from "./operationalReliabilityTypes";

const DEV_LOG_PREFIX = "[Nexora][OperationalReliability]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function resolvePanelHealth(input: ExecutiveOperationalReliabilityInput): PanelRuntimeHealthSignal {
  const explicit = input.panelRuntimeHealth;
  if (explicit) return explicit;

  const stable = input.runtimeStable !== false && input.sessionHydrated !== false;
  return {
    panelStable: stable,
    panelFlashDetected: !stable || input.fragilityElevated === true,
    disappearingPanelSymptom: input.fragilityElevated === true && !stable,
    transitionLatencyElevated: input.operationalTopologyStressed === true,
  };
}

function resolveSceneStability(input: ExecutiveOperationalReliabilityInput): SceneStabilitySignal {
  const explicit = input.sceneStability;
  if (explicit) return explicit;

  const stable = input.continuityPreserved !== false && input.cognitionConverged !== false;
  return {
    sceneReactionStable: stable,
    sceneContractConsistent: stable && input.runtimeStable !== false,
    reactionWithoutContractReason: !stable && input.fragilityElevated === true,
  };
}

function mapCategoryLevel(healthy: boolean, pressured: boolean): OperationalReliabilityLevel {
  if (healthy && !pressured) return "stable";
  if (healthy && pressured) return "reliable";
  if (!healthy && !pressured) return "moderate";
  return "weak";
}

function buildReliabilityObservations(
  input: ExecutiveOperationalReliabilityInput,
  panel: PanelRuntimeHealthSignal,
  scene: SceneStabilitySignal,
  now: number
): OperationalReliabilityObservation[] {
  const foundation = input.mvpStrategicReadinessSnapshot;
  const singularity = input.finalStrategicIntelligenceSnapshot;
  const pressured = input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const runtimeStable = input.runtimeStable !== false;
  const foundationStable =
    foundation?.runtimeStatus === "mvp_ready" ||
    foundation?.runtimeStatus === "hardened" ||
    foundation?.runtimeStatus === "operational";
  const singularityStable =
    singularity?.runtimeStatus === "unified" ||
    singularity?.runtimeStatus === "stable" ||
    singularity?.runtimeStatus === "recovering";
  const orchestrationActive = (input.decisionSnapshot?.activeSubsystems.length ?? 0) > 0;
  const metaExplainable = Boolean(
    input.unifiedSelfReflectiveSnapshot?.summary.explainabilityState?.trim()
  );
  const cognitionExplainable =
    Boolean(input.cognitionSnapshot?.organizationalLearningLine?.trim()) &&
    Boolean(input.cognitionSnapshot?.resilienceForecastLine?.trim());
  const outputConsistent = input.cognitionConverged !== false && singularityStable;

  const categories: Array<{
    category: OperationalReliabilityCategory;
    healthy: boolean;
    headline: string;
  }> = [
    {
      category: "runtime_stability",
      healthy: foundationStable && runtimeStable && singularityStable,
      headline: foundationStable
        ? "Enterprise runtime foundation remains within MVP stabilization envelopes."
        : "Runtime stability requires strengthened foundation convergence.",
    },
    {
      category: "panel_stability",
      healthy: panel.panelStable && !panel.panelFlashDetected && !panel.disappearingPanelSymptom,
      headline: panel.panelStable
        ? "Executive panels remain stable without flash or disappearance symptoms."
        : "Panel stability monitoring elevated for executive interaction surfaces.",
    },
    {
      category: "scene_stability",
      healthy: scene.sceneReactionStable && scene.sceneContractConsistent,
      headline: scene.sceneContractConsistent
        ? "Scene reactions remain contract-consistent and operationally bounded."
        : "Scene stability requires contract-aligned reaction monitoring.",
    },
    {
      category: "orchestration_reliability",
      healthy: orchestrationActive && !pressured,
      headline: orchestrationActive
        ? "Decision orchestration maintains deterministic sequencing reliability."
        : "Orchestration reliability awaiting bounded runtime depth.",
    },
    {
      category: "cognition_consistency",
      healthy: outputConsistent && input.continuityPreserved !== false,
      headline: outputConsistent
        ? "Cognition outputs remain consistent under repeated bounded evaluation."
        : "Cognition consistency monitoring active across runtime pathways.",
    },
    {
      category: "explainability_reliability",
      healthy: cognitionExplainable && (metaExplainable || cognitionExplainable),
      headline: cognitionExplainable
        ? "Explainability remains available for executive-facing runtime outputs."
        : "Explainability trust gap detected for executive output surfaces.",
    },
    {
      category: "executive_output_trust",
      healthy:
        foundationStable &&
        panel.panelStable &&
        scene.sceneContractConsistent &&
        cognitionExplainable,
      headline:
        foundationStable && panel.panelStable
          ? "Executive outputs remain trustworthy under bounded MVP runtime behavior."
          : "Executive output trust strengthening via runtime stabilization.",
    },
  ];

  return categories.map(({ category, healthy, headline }) => ({
    observationId: stableSignature(["operational-reliability-observation", category, String(now)]).slice(
      0,
      48
    ),
    category,
    reliabilityLevel: mapCategoryLevel(healthy, pressured),
    headline: headline.slice(0, 120),
    active: true,
    generatedAt: now,
  }));
}

function deriveReliabilityLevel(observations: OperationalReliabilityObservation[]): OperationalReliabilityLevel {
  const active = observations.filter((o) => o.active);
  if (active.length === 0) return "weak";
  const maxRank = Math.max(...active.map((o) => operationalReliabilityLevelRank(o.reliabilityLevel)));
  const levels: OperationalReliabilityLevel[] = [
    "weak",
    "moderate",
    "reliable",
    "stable",
    "production_ready",
  ];
  return levels[maxRank - 1] ?? "moderate";
}

function deriveTrustState(
  reliabilityLevel: OperationalReliabilityLevel,
  observations: OperationalReliabilityObservation[],
  panel: PanelRuntimeHealthSignal,
  scene: SceneStabilitySignal,
  pressured: boolean,
  priorTrust: RuntimeTrustState | null
): RuntimeTrustState {
  const weakCount = observations.filter((o) => o.reliabilityLevel === "weak").length;
  const panelUnstable = panel.panelFlashDetected || panel.disappearingPanelSymptom;
  const sceneUnstable = scene.reactionWithoutContractReason || !scene.sceneContractConsistent;

  if (panelUnstable && sceneUnstable) return "untrusted";
  if (weakCount >= 3) return "monitored";

  if (
    reliabilityLevel === "production_ready" &&
    !pressured &&
    panel.panelStable &&
    scene.sceneContractConsistent &&
    !panel.panelFlashDetected
  ) {
    return "executive_grade";
  }

  if (reliabilityLevel === "stable" || reliabilityLevel === "production_ready") {
    return pressured ? "conditionally_trusted" : "trusted";
  }

  if (priorTrust === "executive_grade" && (pressured || panelUnstable)) {
    return "conditionally_trusted";
  }

  if (weakCount >= 1 || panelUnstable || sceneUnstable) return "monitored";
  return "conditionally_trusted";
}

function buildReliabilitySummary(
  input: ExecutiveOperationalReliabilityInput,
  panel: PanelRuntimeHealthSignal,
  scene: SceneStabilitySignal
): OperationalReliabilitySummary {
  const pressured = input.operationalTopologyStressed === true;
  return {
    foundationRuntimeState: input.mvpStrategicReadinessSnapshot?.runtimeStatus ?? "unknown",
    singularityRuntimeState: input.finalStrategicIntelligenceSnapshot?.runtimeStatus ?? "unknown",
    orchestrationState:
      input.decisionSnapshot?.summary.orchestrationState ??
      input.decisionSnapshot?.runtimeStatus ??
      "unknown",
    metaCognitionState:
      input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment ??
      input.unifiedSelfReflectiveSnapshot?.runtimeStatus ??
      "unknown",
    panelStabilityState: panel.panelStable ? "stable" : "monitoring",
    sceneStabilityState: scene.sceneContractConsistent ? "contract_aligned" : "drift_monitoring",
    primaryTrustRisk: pressured
      ? "localized_runtime_amplification_pressure"
      : panel.transitionLatencyElevated
        ? "minor_panel_transition_latency"
        : "bounded_trust_monitoring",
  };
}

function buildTrustField(
  reliabilityLevel: OperationalReliabilityLevel,
  trustState: RuntimeTrustState
): EnterpriseRuntimeTrustField {
  return {
    level: reliabilityLevel,
    trustState,
    trustHeadline:
      "Enterprise runtime trust field stabilizing executive operational reliability awareness.",
    stabilizationPosture:
      trustState === "executive_grade"
        ? "executive_grade"
        : trustState === "trusted"
          ? "high"
          : trustState === "conditionally_trusted"
            ? "moderate"
            : "low",
  };
}

function collectReliabilitySignals(
  activeCategories: OperationalReliabilityCategory[],
  panel: PanelRuntimeHealthSignal,
  scene: SceneStabilitySignal,
  trustState: RuntimeTrustState
): string[] {
  const signals: string[] = [];

  if (panel.panelStable && activeCategories.includes("panel_stability")) {
    signals.push("panel_stability");
  }
  if (scene.sceneContractConsistent && activeCategories.includes("scene_stability")) {
    signals.push("scene_contract_consistency");
  }
  if (activeCategories.includes("orchestration_reliability")) {
    signals.push("orchestration_determinism");
  }
  if (activeCategories.includes("explainability_reliability")) {
    signals.push("explainability_available");
  }
  signals.push("bounded_runtime_behavior");
  if (trustState === "trusted" || trustState === "executive_grade") {
    signals.push("executive_runtime_trust");
  }
  if (trustState === "executive_grade") {
    signals.push("production_readiness_trust");
  }

  return Array.from(new Set(signals)).slice(0, 6);
}

function collectTrustRisks(
  input: ExecutiveOperationalReliabilityInput,
  panel: PanelRuntimeHealthSignal,
  scene: SceneStabilitySignal,
  observations: OperationalReliabilityObservation[],
  reliabilityLevel: OperationalReliabilityLevel,
  trustState: RuntimeTrustState
): string[] {
  const risks: string[] = [];

  if (panel.panelFlashDetected || panel.disappearingPanelSymptom) {
    risks.push("panel_reliability_warning");
  }
  if (scene.reactionWithoutContractReason) {
    risks.push("runtime_trust_degradation");
  }
  if (!input.cognitionSnapshot?.organizationalLearningLine?.trim()) {
    risks.push("explainability_trust_risk");
  }
  if (panel.transitionLatencyElevated) {
    risks.push("minor_panel_transition_latency");
  }
  if (
    reliabilityLevel === "production_ready" &&
    trustState !== "executive_grade" &&
    (!panel.panelStable || !scene.sceneContractConsistent)
  ) {
    risks.push("trust_mismatch_warning");
  }
  if (observations.filter((o) => o.reliabilityLevel === "weak").length >= 2) {
    risks.push("orchestration_instability_signal");
  }
  if (input.operationalTopologyStressed) {
    risks.push("localized_runtime_amplification_pressure");
  }

  return Array.from(new Set(risks)).slice(0, 6);
}

function buildTrustSignals(
  activeCategories: OperationalReliabilityCategory[],
  trustState: RuntimeTrustState,
  reliabilityLevel: OperationalReliabilityLevel,
  now: number
): RuntimeTrustSignal[] {
  const signals: RuntimeTrustSignal[] = [];

  if (trustState === "trusted" || trustState === "executive_grade") {
    signals.push({
      signalId: stableSignature(["runtime-trust-signal", "trusted"]).slice(0, 48),
      signalLabel: "runtime trust stabilization",
      signalSummary: "Executive operational trust stabilized across bounded runtime surfaces.",
      linkedCategories: Object.freeze(activeCategories.slice(0, 4)),
      signalIntensity: "high",
      confidence: 0.88,
      generatedAt: now,
    });
  }

  if (reliabilityLevel === "production_ready" && trustState === "executive_grade") {
    signals.push({
      signalId: stableSignature(["runtime-trust-signal", "production-ready"]).slice(0, 48),
      signalLabel: "production-readiness strengthening",
      signalSummary: "MVP production-readiness trust reinforced under deterministic runtime behavior.",
      linkedCategories: Object.freeze(["runtime_stability", "executive_output_trust"] as const),
      signalIntensity: "high",
      confidence: 0.9,
      generatedAt: now,
    });
  }

  if (activeCategories.includes("panel_stability")) {
    signals.push({
      signalId: stableSignature(["runtime-trust-signal", "panel"]).slice(0, 48),
      signalLabel: "panel stability",
      signalSummary: "Panel runtime health mapped for executive trust stabilization.",
      linkedCategories: Object.freeze(["panel_stability"] as const),
      signalIntensity: "moderate",
      confidence: 0.84,
      generatedAt: now,
    });
  }

  return signals.slice(0, OPERATIONAL_RELIABILITY_MAX_TRUST_SIGNALS);
}

function buildRiskIndicators(
  trustRisks: string[],
  activeCategories: OperationalReliabilityCategory[],
  now: number
): RuntimeTrustRiskIndicator[] {
  return trustRisks.slice(0, 4).map((risk) => ({
    indicatorId: stableSignature(["runtime-trust-risk", risk]).slice(0, 48),
    riskLabel: risk,
    riskSummary: `Operational trust risk mapped: ${risk.replace(/_/g, " ")}.`,
    linkedCategories: Object.freeze(activeCategories.slice(0, 3)),
    severity:
      risk.includes("degradation") || risk.includes("mismatch") || risk.includes("instability")
        ? "high"
        : risk.includes("warning") || risk.includes("risk")
          ? "moderate"
          : "low",
    generatedAt: now,
  }));
}

function buildReliabilitySnapshot(
  organizationId: string,
  trustState: RuntimeTrustState,
  reliabilityLevel: OperationalReliabilityLevel,
  summary: OperationalReliabilitySummary,
  activeCategories: OperationalReliabilityCategory[],
  observations: OperationalReliabilityObservation[],
  trustField: EnterpriseRuntimeTrustField,
  trustSignals: RuntimeTrustSignal[],
  riskIndicators: RuntimeTrustRiskIndicator[],
  reliabilitySignals: string[],
  trustRisks: string[],
  confidence: number,
  now: number
): ExecutiveOperationalReliabilitySnapshot {
  const runtimeSummary =
    "Nexora runtime behavior remains stable across executive panels, scene reactions, orchestration, and explainability systems, supporting MVP-grade operational trust.";

  const signature = stableSignature([
    "d9-10-2-operational-reliability-snapshot",
    organizationId,
    trustState,
    reliabilityLevel,
    activeCategories.join(","),
    summary.primaryTrustRisk,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    reliabilityId: stableSignature(["executive-runtime-trust", organizationId]).slice(0, 56),
    trustState,
    reliabilityLevel,
    summary: runtimeSummary,
    reliabilitySignals: Object.freeze(reliabilitySignals),
    trustRisks: Object.freeze(trustRisks),
    confidence: clampOperationalReliabilityConfidence(confidence),
    activeReliabilityCategories: Object.freeze(activeCategories),
    reliabilityObservations: Object.freeze(observations),
    runtimeTrustField: trustField,
    operationalReliabilitySummary: summary,
    runtimeTrustSignals: Object.freeze(trustSignals),
    runtimeTrustRiskIndicators: Object.freeze(riskIndicators),
  };
}

function computeConfidence(
  observations: OperationalReliabilityObservation[],
  reliabilityLevel: OperationalReliabilityLevel,
  trustState: RuntimeTrustState
): number {
  const activeCount = observations.filter((o) => o.active).length;
  const base = 0.68 + activeCount * 0.03;
  const levelBoost =
    reliabilityLevel === "production_ready"
      ? 0.18
      : reliabilityLevel === "stable"
        ? 0.14
        : reliabilityLevel === "reliable"
          ? 0.08
          : 0;
  const trustBoost =
    trustState === "executive_grade" ? 0.05 : trustState === "untrusted" ? -0.1 : 0;
  return base + levelBoost + trustBoost;
}

export function evaluateExecutiveOperationalReliability(
  input: ExecutiveOperationalReliabilityInput
): ExecutiveOperationalReliabilityResult {
  if (!beginOperationalReliabilityEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      activeReliabilityCategoryCount: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getOperationalReliabilityStore(organizationId);
    const prior = store.getState();
    const panel = resolvePanelHealth(input);
    const scene = resolveSceneStability(input);

    const evaluationSignature = stableSignature([
      "d9-10-2-operational-reliability-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.mvpStrategicReadinessSnapshot?.signature ?? "no-foundation",
      input.finalStrategicIntelligenceSnapshot?.signature ?? "no-singularity",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-meta",
      String(panel.panelStable),
      String(scene.sceneContractConsistent),
      String(input.runtimeStable ?? "unknown"),
    ]);

    if (
      !shouldEvaluateOperationalReliability(
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
        snapshot: prior.reliabilitySnapshots[0] ?? null,
        activeReliabilityCategoryCount: prior.trustObservations.filter((o) => o.active).length,
        storeSignature: prior.signature,
      };
    }

    const foundationDepth = input.mvpStrategicReadinessSnapshot ? 1 : 0;
    if (foundationDepth < OPERATIONAL_RELIABILITY_MIN_RUNTIME_FOUNDATION_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_runtime_foundation_depth",
        snapshot: prior.reliabilitySnapshots[0] ?? null,
        activeReliabilityCategoryCount: 0,
        storeSignature: prior.signature,
      };
    }

    const observations = buildReliabilityObservations(input, panel, scene, now);
    const activeCategories = observations.filter((o) => o.active).map((o) => o.category);

    if (activeCategories.length < OPERATIONAL_RELIABILITY_MIN_ACTIVE_CATEGORIES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_reliability_categories",
        snapshot: prior.reliabilitySnapshots[0] ?? null,
        activeReliabilityCategoryCount: activeCategories.length,
        storeSignature: prior.signature,
      };
    }

    const pressured = input.operationalTopologyStressed === true || input.fragilityElevated === true;
    const reliabilityLevel = deriveReliabilityLevel(observations);
    const trustState = deriveTrustState(
      reliabilityLevel,
      observations,
      panel,
      scene,
      pressured,
      prior.lastTrustState
    );

    const cappedReliabilityLevel =
      trustState === "executive_grade" && !pressured && panel.panelStable && scene.sceneContractConsistent
        ? "production_ready"
        : reliabilityLevel === "production_ready" && trustState !== "executive_grade"
          ? "stable"
          : reliabilityLevel;

    const summary = buildReliabilitySummary(input, panel, scene);
    const trustField = buildTrustField(cappedReliabilityLevel, trustState);
    const reliabilitySignals = collectReliabilitySignals(activeCategories, panel, scene, trustState);
    const trustRisks = collectTrustRisks(
      input,
      panel,
      scene,
      observations,
      cappedReliabilityLevel,
      trustState
    );
    const trustSignals = buildTrustSignals(activeCategories, trustState, cappedReliabilityLevel, now);
    const riskIndicators = buildRiskIndicators(trustRisks, activeCategories, now);
    const confidence = computeConfidence(observations, cappedReliabilityLevel, trustState);

    const snapshot = buildReliabilitySnapshot(
      organizationId,
      trustState,
      cappedReliabilityLevel,
      summary,
      activeCategories,
      observations,
      trustField,
      trustSignals,
      riskIndicators,
      reliabilitySignals,
      trustRisks,
      confidence,
      now
    );

    if (!validateExecutiveOperationalReliabilitySnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_reliability_snapshot",
        snapshot: prior.reliabilitySnapshots[0] ?? null,
        activeReliabilityCategoryCount: activeCategories.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: OperationalReliabilityHistoryEntry = {
      entryId: stableSignature(["operational-reliability-history", snapshot.signature]).slice(0, 48),
      trustState,
      reliabilityLevel: cappedReliabilityLevel,
      headline: trustField.trustHeadline.slice(0, 80),
      generatedAt: now,
    };

    store.upsertReliabilitySnapshots([snapshot], now);
    store.upsertTrustObservations(observations, now);
    store.upsertTrustHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastTrustState(trustState);

    const priorTrust = prior.lastTrustState;

    if (trustState === "trusted" || trustState === "executive_grade") {
      devLog("runtime trust stabilization — executive operational reliability strengthened");
    }

    if (trustState === "monitored" || trustState === "untrusted") {
      devLog(`reliability degradation — trust state ${priorTrust ?? "unknown"} → ${trustState}`);
    }

    if (panel.panelFlashDetected || panel.disappearingPanelSymptom) {
      devLog("panel instability detection — panel flash or disappearance symptom mapped");
    }

    if (scene.reactionWithoutContractReason) {
      devLog("scene instability detection — scene reaction drift without contract reason");
    }

    if (cappedReliabilityLevel === "production_ready" && trustState === "executive_grade") {
      devLog("production-readiness strengthening — MVP executive runtime trust reinforced");
    }

    if (priorTrust && priorTrust !== trustState) {
      devLog(`trust-state transition — ${priorTrust} → ${trustState}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeReliabilityCategoryCount: activeCategories.length,
      storeSignature: store.getState().signature,
    };
  } finally {
    endOperationalReliabilityEvaluation();
  }
}
