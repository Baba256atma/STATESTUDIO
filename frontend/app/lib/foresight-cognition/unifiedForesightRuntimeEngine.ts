import { stableSignature } from "../intelligence/shared/dedupe";
import { getRiskConstellationStore } from "./riskConstellationStore";
import { integrateEnterpriseForesightWithCognition } from "./integrateEnterpriseForesightWithCognition";
import {
  beginUnifiedForesightRuntimeEvaluation,
  endUnifiedForesightRuntimeEvaluation,
  foresightHealthRank,
  shouldEvaluateUnifiedForesightRuntime,
  shouldRetainUnifiedForesightSnapshot,
} from "./unifiedForesightRuntimeGuards";
import { getUnifiedForesightRuntimeStore } from "./unifiedForesightRuntimeStore";
import type {
  EnterpriseAnticipatorySnapshot,
  EnterpriseForesightPipelineResult,
  ExecutiveAnticipatoryIntelligence,
  ForesightConfidenceLevel,
  ForesightRuntimeStatus,
  ForesightSubsystemId,
  ForesightSubsystemState,
  StrategicForesightSummary,
  UnifiedExecutiveForesightRuntimeInput,
  UnifiedExecutiveForesightRuntimeResult,
  UnifiedForesightRuntimeState,
} from "./unifiedForesightRuntimeTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedForesightRuntime]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function layerEvaluated(result: { evaluated: boolean; skipped: boolean }): boolean {
  return result.evaluated && !result.skipped;
}

function buildSubsystemStates(
  pipeline: EnterpriseForesightPipelineResult,
  organizationId: string
): ForesightSubsystemState[] {
  const riskStore = getRiskConstellationStore(organizationId).getState();
  const weakSignalActive = riskStore.correlations.length > 0;

  const entries: [ForesightSubsystemId, { evaluated: boolean; skipped: boolean }, string, boolean][] =
    [
      [
        "foresight_foundation",
        pipeline.foresightFoundation,
        pipeline.foresightFoundation.storeSignature,
        true,
      ],
      [
        "weak_signal_correlation",
        pipeline.riskConstellation,
        pipeline.riskConstellation.storeSignature,
        weakSignalActive,
      ],
      [
        "risk_constellation",
        pipeline.riskConstellation,
        pipeline.riskConstellation.storeSignature,
        true,
      ],
      ["early_warning", pipeline.earlyWarning, pipeline.earlyWarning.storeSignature, true],
      ["positive_drift", pipeline.positiveDrift, pipeline.positiveDrift.storeSignature, true],
      [
        "stress_simulation",
        pipeline.stressSimulation,
        pipeline.stressSimulation.storeSignature,
        true,
      ],
      [
        "intervention_timing",
        pipeline.interventionTiming,
        pipeline.interventionTiming.storeSignature,
        true,
      ],
      [
        "preparedness_cognition",
        pipeline.preparednessCognition,
        pipeline.preparednessCognition.storeSignature,
        true,
      ],
      [
        "advisory_foresight",
        pipeline.advisoryForesight,
        pipeline.advisoryForesight.storeSignature,
        true,
      ],
      [
        "consensus_foresight",
        pipeline.consensusForesight,
        pipeline.consensusForesight.storeSignature,
        true,
      ],
    ];

  return entries.map(([subsystemId, result, signature, required]) => {
    const evaluated = layerEvaluated(result);
    const hasSnapshot =
      "snapshot" in result && result.snapshot !== null && result.snapshot !== undefined;
    const active = (evaluated || hasSnapshot) && (subsystemId !== "weak_signal_correlation" || weakSignalActive || required);
    return {
      subsystemId,
      active,
      healthy: evaluated,
      evaluated,
      signature: signature || "inactive",
    };
  });
}

function computeLayerDepth(pipeline: EnterpriseForesightPipelineResult): number {
  return (
    (pipeline.foresightFoundation.snapshot?.signalCount ?? 0) +
    (pipeline.riskConstellation.snapshot?.constellationCount ?? 0) +
    (pipeline.earlyWarning.snapshot?.warningCount ?? 0) +
    (pipeline.positiveDrift.snapshot?.opportunityCount ?? 0) +
    (pipeline.stressSimulation.snapshot?.scenarioCount ?? 0) +
    (pipeline.interventionTiming.snapshot?.windowCount ?? 0) +
    (pipeline.preparednessCognition.snapshot?.signalCount ?? 0) +
    (pipeline.advisoryForesight.snapshot?.recommendationCount ?? 0) +
    (pipeline.consensusForesight.snapshot?.consensusCount ?? 0)
  );
}

function inferDominantRisk(pipeline: EnterpriseForesightPipelineResult): string {
  const stress = pipeline.stressSimulation.snapshot?.awarenessSummary.dominantCategory;
  if (stress === "governance_overload" || stress === "escalation_pressure") {
    return "emerging operational pressure concentration";
  }
  const warning = pipeline.earlyWarning.snapshot?.awarenessSummary.warningHeadline;
  if (warning) return warning;
  const constellation = pipeline.riskConstellation.snapshot?.awarenessSummary.dominantCategory;
  if (constellation === "operational_pressure_field") {
    return "distributed operational pressure field";
  }
  const foresight = pipeline.foresightFoundation.snapshot?.awarenessSummary.anticipatoryHeadline;
  return foresight || "anticipatory risk signals forming";
}

function inferDominantOpportunity(pipeline: EnterpriseForesightPipelineResult): string {
  const drift = pipeline.positiveDrift.snapshot?.awarenessSummary?.opportunityHeadline;
  if (drift) return drift;
  const resilience = pipeline.foresightFoundation.snapshot?.awarenessSummary.resilienceEmergence;
  if (resilience === "strengthening") {
    return "resilience strengthening through governance alignment";
  }
  return "strategic opportunity signals emerging";
}

function inferEarlyWarningState(pipeline: EnterpriseForesightPipelineResult): string {
  const escalation = pipeline.earlyWarning.snapshot?.awarenessSummary.dominantEscalationState;
  if (escalation) return escalation;
  const foresight = pipeline.foresightFoundation.snapshot?.awarenessSummary.preEscalationRisk;
  if (foresight === "elevated") return "emerging";
  return "dormant";
}

function inferPreparednessState(pipeline: EnterpriseForesightPipelineResult): string {
  const posture =
    pipeline.preparednessCognition.snapshot?.awarenessSummary.enterprisePreparednessPosture;
  if (posture === "weak" || posture === "limited") return "weak";
  if (posture === "resilient" || posture === "strong") return "strong";
  return posture ?? "moderate";
}

function inferRecommendedFocus(pipeline: EnterpriseForesightPipelineResult): string {
  const advisory = pipeline.advisoryForesight.snapshot?.awarenessSummary.advisoryHeadline;
  if (advisory) return advisory;
  const category = pipeline.advisoryForesight.snapshot?.awarenessSummary.dominantCategory;
  if (category === "governance_alignment" || category === "pressure_reduction") {
    return "governance stabilization and pressure reduction";
  }
  if (category === "escalation_prevention") {
    return "escalation prevention and coordination stabilization";
  }
  return "executive strategic alignment review";
}

function inferConsensusStrength(pipeline: EnterpriseForesightPipelineResult): string {
  const strength = pipeline.consensusForesight.snapshot?.awarenessSummary.dominantConsensusStrength;
  if (strength) return strength;
  const integrity = pipeline.consensusForesight.snapshot?.awarenessSummary.advisoryIntegrity;
  return integrity ?? "moderate";
}

function buildStrategicSummary(
  pipeline: EnterpriseForesightPipelineResult
): StrategicForesightSummary {
  return {
    dominantRisk: inferDominantRisk(pipeline),
    dominantOpportunity: inferDominantOpportunity(pipeline),
    earlyWarningState: inferEarlyWarningState(pipeline),
    preparednessState: inferPreparednessState(pipeline),
    recommendedFocus: inferRecommendedFocus(pipeline),
    consensusStrength: inferConsensusStrength(pipeline),
  };
}

function buildExecutiveAnticipatoryIntelligence(
  pipeline: EnterpriseForesightPipelineResult,
  summary: StrategicForesightSummary
): ExecutiveAnticipatoryIntelligence {
  const foundation = pipeline.foresightFoundation.snapshot?.awarenessSummary.anticipatoryHeadline;
  const integrity =
    pipeline.consensusForesight.snapshot?.awarenessSummary.advisoryIntegrity ?? "moderate";
  const timing = pipeline.interventionTiming.snapshot?.awarenessSummary?.timingHeadline;

  return {
    anticipatoryHeadline:
      foundation ?? "Enterprise anticipatory intelligence runtime synthesizing foresight layers.",
    riskAwarenessLine: summary.dominantRisk,
    opportunityAwarenessLine: summary.dominantOpportunity,
    advisoryIntegrity: integrity,
    interventionReadiness: timing ?? "intervention timing under evaluation",
  };
}

function inferRuntimeStatus(
  subsystemStates: ForesightSubsystemState[],
  layerDepth: number,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  priorStatus: ForesightRuntimeStatus | null
): ForesightRuntimeStatus {
  const healthyCount = subsystemStates.filter((s) => s.healthy).length;
  const degradedCount = subsystemStates.filter((s) => s.active && !s.healthy).length;

  if (layerDepth < 6) return "initializing";
  if (fragilityElevated && healthyCount < 4) return "unstable";
  if (!continuityPreserved && degradedCount >= 3) return "unstable";
  if (degradedCount >= 5) return "degraded";
  if (priorStatus === "degraded" || priorStatus === "unstable") {
    if (healthyCount >= 6 && continuityPreserved) return "recovering";
  }
  if (healthyCount >= 5) return "stable";
  if (healthyCount >= 3) return "recovering";
  return "degraded";
}

function inferForesightHealth(
  subsystemStates: ForesightSubsystemState[],
  runtimeStatus: ForesightRuntimeStatus,
  consensusStrength: string
): ForesightConfidenceLevel {
  const healthyCount = subsystemStates.filter((s) => s.healthy).length;
  if (consensusStrength === "executive_grade" && runtimeStatus === "stable" && healthyCount >= 7) {
    return "executive_grade";
  }
  if (runtimeStatus === "stable" && healthyCount >= 6) return "strong";
  if (runtimeStatus === "recovering" && healthyCount >= 4) return "moderate";
  if (healthyCount >= 3) return "moderate";
  return "weak";
}

function buildEnterpriseAnticipatorySnapshot(
  organizationId: string,
  pipeline: EnterpriseForesightPipelineResult,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  priorStatus: ForesightRuntimeStatus | null,
  now: number
): EnterpriseAnticipatorySnapshot {
  const subsystemStates = buildSubsystemStates(pipeline, organizationId);
  const layerDepth = computeLayerDepth(pipeline);
  const summary = buildStrategicSummary(pipeline);
  const runtimeStatus = inferRuntimeStatus(
    subsystemStates,
    layerDepth,
    fragilityElevated,
    continuityPreserved,
    priorStatus
  );
  const foresightHealth = inferForesightHealth(
    subsystemStates,
    runtimeStatus,
    summary.consensusStrength
  );
  const activeSubsystems = Object.freeze(
    subsystemStates.filter((s) => s.active && s.healthy).map((s) => s.subsystemId)
  );

  const signature = stableSignature([
    "d9-4-10-enterprise-anticipatory",
    organizationId,
    runtimeStatus,
    foresightHealth,
    pipeline.pipelineSignature,
    activeSubsystems.join(","),
    summary.consensusStrength,
  ]);

  return {
    snapshotId: stableSignature(["anticipatory-snapshot", organizationId, signature]).slice(0, 56),
    organizationId,
    runtimeStatus,
    foresightHealth,
    summary,
    activeSubsystems,
    subsystemStates: Object.freeze(subsystemStates),
    runtimeHealth: {
      level: foresightHealth,
      activeSubsystemCount: activeSubsystems.length,
      layerDepth,
      degradedSubsystemCount: subsystemStates.filter((s) => s.active && !s.healthy).length,
    },
    executiveAnticipatoryIntelligence: buildExecutiveAnticipatoryIntelligence(pipeline, summary),
    generatedAt: now,
    signature,
  };
}

function buildUnifiedState(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getUnifiedForesightRuntimeStore>["getState"]>,
  latest: EnterpriseAnticipatorySnapshot | null
): UnifiedForesightRuntimeState {
  return {
    organizationId,
    latestSnapshot: latest,
    foresightHistory: Object.freeze(storeState.snapshots.slice(0, 8)),
    runtimeStatus: storeState.runtimeStatus,
    signature: storeState.signature,
    updatedAt: storeState.updatedAt,
    lastEvaluationSignature: storeState.lastEvaluationSignature,
    lastRuntimeStatus: storeState.lastRuntimeStatus,
  };
}

/**
 * D9:4:10 — Unified executive strategic foresight runtime evaluation.
 */
export function evaluateUnifiedExecutiveForesightRuntime(
  input: UnifiedExecutiveForesightRuntimeInput
): UnifiedExecutiveForesightRuntimeResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginUnifiedForesightRuntimeEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_unified_foresight_guard",
      pipeline: null,
      snapshot: null,
      state: null,
      storeSignature: "",
    };
  }

  try {
    const store = getUnifiedForesightRuntimeStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-4-10-unified-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.fragilityElevated ? "fragile" : "stable",
      input.continuityPreserved === false ? "disrupted" : "continuous",
      input.pressureTopologyStressed ? "stressed" : "stable-topology",
    ]);

    if (
      !shouldEvaluateUnifiedForesightRuntime(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      const latest = prior.snapshots[0] ?? null;
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        pipeline: null,
        snapshot: latest,
        state: buildUnifiedState(organizationId, prior, latest),
        storeSignature: prior.signature,
      };
    }

    const pipeline = integrateEnterpriseForesightWithCognition({
      organizationId,
      cognitionSnapshot: input.cognitionSnapshot ?? null,
      fragilityElevated: input.fragilityElevated ?? false,
      continuityPreserved: input.continuityPreserved ?? true,
      pressureTopologyStressed: input.pressureTopologyStressed ?? false,
      now,
    });

    const layerDepth = computeLayerDepth(pipeline);

    if (layerDepth < 6) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_foresight_depth",
        pipeline,
        snapshot: prior.snapshots[0] ?? null,
        state: buildUnifiedState(organizationId, prior, prior.snapshots[0] ?? null),
        storeSignature: prior.signature,
      };
    }

    const snapshot = buildEnterpriseAnticipatorySnapshot(
      organizationId,
      pipeline,
      input.fragilityElevated ?? false,
      input.continuityPreserved ?? true,
      prior.lastRuntimeStatus,
      now
    );

    if (!shouldRetainUnifiedForesightSnapshot(snapshot, layerDepth)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "snapshot_retention_guard",
        pipeline,
        snapshot: prior.snapshots[0] ?? null,
        state: buildUnifiedState(organizationId, prior, prior.snapshots[0] ?? null),
        storeSignature: prior.signature,
      };
    }

    store.upsertSnapshot(snapshot, now);
    store.upsertForesightSummaries(
      [
        {
          summaryId: stableSignature(["foresight-summary", snapshot.snapshotId]).slice(0, 48),
          headline: `${snapshot.summary.consensusStrength} — ${snapshot.summary.recommendedFocus}`,
          generatedAt: now,
        },
      ],
      now
    );
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(snapshot.runtimeStatus);

    const finalState = store.getState();
    const runtimeTransition =
      prior.lastRuntimeStatus && prior.lastRuntimeStatus !== snapshot.runtimeStatus
        ? { from: prior.lastRuntimeStatus, to: snapshot.runtimeStatus }
        : undefined;

    if (runtimeTransition) {
      devLog(`runtime health — ${runtimeTransition.from} → ${runtimeTransition.to}`);
    }

    if (snapshot.foresightHealth === "executive_grade") {
      devLog(`executive-grade foresight formation — ${snapshot.summary.recommendedFocus}`);
    }

    const priorConsensus = prior.snapshots[0]?.summary.consensusStrength;
    if (priorConsensus && priorConsensus !== snapshot.summary.consensusStrength) {
      devLog(
        `major advisory consensus shift — ${priorConsensus} → ${snapshot.summary.consensusStrength}`
      );
    }

    if (snapshot.runtimeStatus === "degraded" || snapshot.runtimeStatus === "unstable") {
      devLog(`foresight runtime degradation — ${snapshot.runtimeStatus}`);
    }

    if (runtimeTransition?.to === "recovering" || runtimeTransition?.to === "stable") {
      if (prior.lastRuntimeStatus === "degraded" || prior.lastRuntimeStatus === "unstable") {
        devLog(`foresight runtime recovery — ${snapshot.runtimeStatus}`);
      }
    }

    if (foresightHealthRank(snapshot.foresightHealth) >= 3 && snapshot.runtimeStatus === "stable") {
      devLog(`strong anticipatory runtime — ${snapshot.summary.dominantOpportunity}`);
    }

    return {
      evaluated: true,
      skipped: false,
      pipeline,
      snapshot,
      state: buildUnifiedState(organizationId, finalState, snapshot),
      storeSignature: finalState.signature,
      runtimeTransition,
    };
  } finally {
    endUnifiedForesightRuntimeEvaluation();
  }
}
