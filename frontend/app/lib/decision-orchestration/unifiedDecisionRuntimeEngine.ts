import { stableSignature } from "../intelligence/shared/dedupe";
import { integrateEnterpriseDecisionOrchestrationWithCognition } from "./integrateEnterpriseDecisionOrchestrationWithCognition";
import {
  beginUnifiedDecisionRuntimeEvaluation,
  endUnifiedDecisionRuntimeEvaluation,
  orchestrationHealthRank,
  shouldEvaluateUnifiedDecisionRuntime,
  shouldRetainUnifiedDecisionSnapshot,
} from "./unifiedDecisionRuntimeGuards";
import { getUnifiedDecisionRuntimeStore } from "./unifiedDecisionRuntimeStore";
import type {
  DecisionRuntimeHealth,
  DecisionRuntimeStatus,
  DecisionSubsystemId,
  DecisionSubsystemState,
  EnterpriseDecisionOrchestrationPipelineResult,
  EnterpriseStrategicActionSnapshot,
  ExecutiveActionIntelligence,
  OrchestrationConfidenceLevel,
  StrategicOrchestrationSummary,
  UnifiedDecisionRuntimeState,
  UnifiedExecutiveDecisionRuntimeInput,
  UnifiedExecutiveDecisionRuntimeResult,
} from "./unifiedDecisionRuntimeTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedDecisionRuntime]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function layerEvaluated(result: { evaluated: boolean; skipped: boolean }): boolean {
  return result.evaluated && !result.skipped;
}

function buildSubsystemStates(
  pipeline: EnterpriseDecisionOrchestrationPipelineResult
): DecisionSubsystemState[] {
  const entries: [
    DecisionSubsystemId,
    { evaluated: boolean; skipped: boolean; reason?: string },
    string,
  ][] = [
    [
      "decision_orchestration",
      pipeline.decisionOrchestration,
      pipeline.decisionOrchestration.storeSignature,
    ],
    ["action_dependency", pipeline.actionDependency, pipeline.actionDependency.storeSignature],
    [
      "priority_arbitration",
      pipeline.priorityArbitration,
      pipeline.priorityArbitration.storeSignature,
    ],
    [
      "scenario_coordination",
      pipeline.scenarioCoordination,
      pipeline.scenarioCoordination.storeSignature,
    ],
    [
      "adaptive_sequencing",
      pipeline.adaptiveSequencing,
      pipeline.adaptiveSequencing.storeSignature,
    ],
    [
      "confidence_arbitration",
      pipeline.confidenceArbitration,
      pipeline.confidenceArbitration.storeSignature,
    ],
    [
      "institutional_alignment",
      pipeline.institutionalAlignment,
      pipeline.institutionalAlignment.storeSignature,
    ],
    [
      "intervention_projection",
      pipeline.interventionProjection,
      pipeline.interventionProjection.storeSignature,
    ],
    [
      "stability_optimization",
      pipeline.stabilityOptimization,
      pipeline.stabilityOptimization.storeSignature,
    ],
  ];

  return entries.map(([subsystemId, result, signature]) => {
    const evaluated = layerEvaluated(result);
    const hasSnapshot =
      "snapshot" in result && result.snapshot !== null && result.snapshot !== undefined;
    const skippedIsolation =
      result.skipped &&
      (result.reason === "insufficient_orchestration_depth" ||
        result.reason === "insufficient_dependency_depth" ||
        result.reason === "insufficient_arbitration_depth" ||
        result.reason === "insufficient_coordination_depth" ||
        result.reason === "insufficient_sequencing_depth" ||
        result.reason === "insufficient_confidence_depth" ||
        result.reason === "insufficient_alignment_depth" ||
        result.reason === "insufficient_projection_depth" ||
        result.reason === "insufficient_optimization_depth");
    const active = evaluated || hasSnapshot;
    return {
      subsystemId,
      active,
      healthy: evaluated,
      evaluated,
      isolated: skippedIsolation && !hasSnapshot,
      signature: signature || "inactive",
    };
  });
}

function computeLayerDepth(pipeline: EnterpriseDecisionOrchestrationPipelineResult): number {
  return (
    (pipeline.decisionOrchestration.snapshot?.orchestrationCount ?? 0) +
    (pipeline.actionDependency.snapshot?.graphCount ?? 0) +
    (pipeline.priorityArbitration.snapshot?.arbitrationCount ?? 0) +
    (pipeline.scenarioCoordination.snapshot?.topologyCount ?? 0) +
    (pipeline.adaptiveSequencing.snapshot?.sequenceCount ?? 0) +
    (pipeline.confidenceArbitration.snapshot?.confidenceCount ?? 0) +
    (pipeline.institutionalAlignment.snapshot?.alignmentCount ?? 0) +
    (pipeline.interventionProjection.snapshot?.projectionCount ?? 0) +
    (pipeline.stabilityOptimization.snapshot?.optimizationCount ?? 0)
  );
}

function formatCategoryLabel(category: string): string {
  return category.replace(/_/g, " ");
}

function inferDominantPriority(pipeline: EnterpriseDecisionOrchestrationPipelineResult): string {
  const arbitration = pipeline.priorityArbitration.snapshot?.recentExecutiveArbitrations[0];
  if (arbitration?.competingPriorities[0]) {
    return formatCategoryLabel(arbitration.competingPriorities[0]);
  }
  const coordination = pipeline.decisionOrchestration.snapshot?.awarenessSummary.dominantCategory;
  if (coordination === "governance_alignment") return "governance stabilization";
  if (coordination === "pressure_reduction") return "pressure reduction";
  return coordination ? formatCategoryLabel(coordination) : "strategic coordination review";
}

function inferOrchestrationState(pipeline: EnterpriseDecisionOrchestrationPipelineResult): string {
  const sequencing =
    pipeline.adaptiveSequencing.snapshot?.awarenessSummary.dominantSequencingState;
  if (sequencing === "adaptive" || sequencing === "evolving") return "adaptive";
  if (sequencing === "stabilized") return "stabilized";
  const readiness =
    pipeline.decisionOrchestration.snapshot?.awarenessSummary.dominantReadinessState;
  if (readiness === "coordinated" || readiness === "ready") return "coordinated";
  return sequencing ?? readiness ?? "organizing";
}

function inferConfidenceState(pipeline: EnterpriseDecisionOrchestrationPipelineResult): string {
  const certainty =
    pipeline.confidenceArbitration.snapshot?.recentExecutiveConfidences[0]?.certaintyState;
  if (certainty) return certainty;
  const level =
    pipeline.confidenceArbitration.snapshot?.coordinationSummary.dominantCertaintyState;
  return level ?? "stabilizing";
}

function inferResiliencePathway(pipeline: EnterpriseDecisionOrchestrationPipelineResult): string {
  const optimization =
    pipeline.stabilityOptimization.snapshot?.awarenessSummary.dominantOptimizationState;
  const posture =
    pipeline.stabilityOptimization.snapshot?.awarenessSummary.resiliencePosture;
  if (optimization === "sustainable" || optimization === "resilient") return "strengthening";
  if (posture === "executive_grade" || posture === "high") return "strengthening";
  if (optimization === "unstable") return "at_risk";
  const pathway = pipeline.stabilityOptimization.snapshot?.resiliencePathways[0]?.durability;
  if (pathway === "high") return "strengthening";
  return "forming";
}

function inferStabilizationFocus(pipeline: EnterpriseDecisionOrchestrationPipelineResult): string {
  const scenario = pipeline.scenarioCoordination.snapshot?.awarenessSummary.topologyHeadline;
  if (scenario) return scenario.slice(0, 120);
  const dependency = pipeline.actionDependency.snapshot?.awarenessSummary.dependencyHeadline;
  if (dependency) return dependency.slice(0, 120);
  const coordination =
    pipeline.decisionOrchestration.snapshot?.awarenessSummary.orchestrationHeadline;
  if (coordination?.includes("pressure")) {
    return "pressure reduction and coordination reinforcement";
  }
  return coordination?.slice(0, 120) ?? "coordination reinforcement and dependency sequencing";
}

function inferInstitutionalAlignment(pipeline: EnterpriseDecisionOrchestrationPipelineResult): string {
  const coherence =
    pipeline.institutionalAlignment.snapshot?.alignmentSummary.coherencePosture;
  if (coherence === "institutional_grade" || coherence === "high") return "coherent";
  if (coherence === "moderate") return "aligning";
  const state =
    pipeline.institutionalAlignment.snapshot?.alignmentSummary.dominantCoherenceState;
  return state === "fragmented" ? "fragmented" : "forming";
}

function buildStrategicSummary(
  pipeline: EnterpriseDecisionOrchestrationPipelineResult
): StrategicOrchestrationSummary {
  return {
    dominantPriority: inferDominantPriority(pipeline),
    orchestrationState: inferOrchestrationState(pipeline),
    confidenceState: inferConfidenceState(pipeline),
    resiliencePathway: inferResiliencePathway(pipeline),
    stabilizationFocus: inferStabilizationFocus(pipeline),
    institutionalAlignment: inferInstitutionalAlignment(pipeline),
  };
}

function buildExecutiveActionIntelligence(
  pipeline: EnterpriseDecisionOrchestrationPipelineResult,
  summary: StrategicOrchestrationSummary
): ExecutiveActionIntelligence {
  const readiness =
    pipeline.decisionOrchestration.snapshot?.awarenessSummary.orchestrationHeadline;
  const dependency = pipeline.actionDependency.snapshot?.awarenessSummary.dependencyHeadline;
  const sequencing = pipeline.adaptiveSequencing.snapshot?.awarenessSummary.sequencingHeadline;
  const alignment = pipeline.institutionalAlignment.snapshot?.alignmentSummary.alignmentHeadline;
  const stability =
    pipeline.stabilityOptimization.snapshot?.awarenessSummary.optimizationHeadline;

  return {
    actionReadinessHeadline:
      readiness ??
      "Enterprise strategic action intelligence runtime synthesizing orchestration layers.",
    dependencyAwarenessLine: dependency ?? summary.stabilizationFocus,
    sequencingCoordinationLine: sequencing ?? `${summary.orchestrationState} orchestration sequencing`,
    governanceAlignmentLine: alignment ?? `institutional alignment ${summary.institutionalAlignment}`,
    resilienceOrchestrationLine:
      stability ?? `resilience pathway ${summary.resiliencePathway}`,
  };
}

function inferRuntimeStatus(
  subsystemStates: DecisionSubsystemState[],
  layerDepth: number,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  priorStatus: DecisionRuntimeStatus | null
): DecisionRuntimeStatus {
  const healthyCount = subsystemStates.filter((s) => s.healthy).length;
  const degradedCount = subsystemStates.filter((s) => s.active && !s.healthy).length;
  const isolatedCount = subsystemStates.filter((s) => s.isolated).length;

  if (layerDepth < 9) return "initializing";
  if (fragilityElevated && healthyCount < 4) return "unstable";
  if (!continuityPreserved && (degradedCount >= 3 || isolatedCount >= 4)) return "unstable";
  if (degradedCount >= 5 || isolatedCount >= 6) return "degraded";
  if (priorStatus === "degraded" || priorStatus === "unstable") {
    if (healthyCount >= 6 && continuityPreserved) return "recovering";
  }
  if (healthyCount >= 7) return "stable";
  if (healthyCount >= 4) return "recovering";
  return "degraded";
}

function inferOrchestrationHealth(
  subsystemStates: DecisionSubsystemState[],
  runtimeStatus: DecisionRuntimeStatus,
  summary: StrategicOrchestrationSummary
): OrchestrationConfidenceLevel {
  const healthyCount = subsystemStates.filter((s) => s.healthy).length;
  if (
    summary.institutionalAlignment === "coherent" &&
    summary.resiliencePathway === "strengthening" &&
    runtimeStatus === "stable" &&
    healthyCount >= 8
  ) {
    return "executive_grade";
  }
  if (runtimeStatus === "stable" && healthyCount >= 7) return "strong";
  if (runtimeStatus === "recovering" && healthyCount >= 5) return "moderate";
  if (healthyCount >= 4) return "moderate";
  return "weak";
}

function buildEnterpriseStrategicActionSnapshot(
  organizationId: string,
  pipeline: EnterpriseDecisionOrchestrationPipelineResult,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  priorStatus: DecisionRuntimeStatus | null,
  now: number
): EnterpriseStrategicActionSnapshot {
  const subsystemStates = buildSubsystemStates(pipeline);
  const layerDepth = computeLayerDepth(pipeline);
  const summary = buildStrategicSummary(pipeline);
  const runtimeStatus = inferRuntimeStatus(
    subsystemStates,
    layerDepth,
    fragilityElevated,
    continuityPreserved,
    priorStatus
  );
  const orchestrationHealth = inferOrchestrationHealth(
    subsystemStates,
    runtimeStatus,
    summary
  );
  const activeSubsystems = Object.freeze(
    subsystemStates.filter((s) => s.active && s.healthy).map((s) => s.subsystemId)
  );

  const signature = stableSignature([
    "d9-5-10-enterprise-strategic-action",
    organizationId,
    runtimeStatus,
    orchestrationHealth,
    pipeline.pipelineSignature,
    activeSubsystems.join(","),
    summary.dominantPriority,
  ]);

  const runtimeHealth: DecisionRuntimeHealth = {
    level: orchestrationHealth,
    activeSubsystemCount: activeSubsystems.length,
    layerDepth,
    degradedSubsystemCount: subsystemStates.filter((s) => s.active && !s.healthy).length,
    isolatedSubsystemCount: subsystemStates.filter((s) => s.isolated).length,
  };

  return {
    snapshotId: stableSignature(["strategic-action-snapshot", organizationId, signature]).slice(
      0,
      56
    ),
    organizationId,
    runtimeStatus,
    orchestrationHealth,
    summary,
    activeSubsystems,
    subsystemStates: Object.freeze(subsystemStates),
    runtimeHealth,
    executiveActionIntelligence: buildExecutiveActionIntelligence(pipeline, summary),
    generatedAt: now,
    signature,
  };
}

function buildUnifiedState(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getUnifiedDecisionRuntimeStore>["getState"]>,
  latest: EnterpriseStrategicActionSnapshot | null
): UnifiedDecisionRuntimeState {
  return {
    organizationId,
    latestSnapshot: latest,
    actionHistory: Object.freeze(storeState.snapshots.slice(0, 8)),
    runtimeStatus: storeState.runtimeStatus,
    signature: storeState.signature,
    updatedAt: storeState.updatedAt,
    lastEvaluationSignature: storeState.lastEvaluationSignature,
    lastRuntimeStatus: storeState.lastRuntimeStatus,
  };
}

/**
 * D9:5:10 — Unified executive decision orchestration runtime evaluation.
 */
export function evaluateUnifiedExecutiveDecisionRuntime(
  input: UnifiedExecutiveDecisionRuntimeInput
): UnifiedExecutiveDecisionRuntimeResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginUnifiedDecisionRuntimeEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_unified_decision_guard",
      pipeline: null,
      snapshot: null,
      state: null,
      storeSignature: "",
    };
  }

  try {
    const store = getUnifiedDecisionRuntimeStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-5-10-unified-decision-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.fragilityElevated ? "fragile" : "stable",
      input.continuityPreserved === false ? "disrupted" : "continuous",
      input.pressureTopologyStressed ? "stressed" : "stable-topology",
    ]);

    if (
      !shouldEvaluateUnifiedDecisionRuntime(
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

    const pipeline = integrateEnterpriseDecisionOrchestrationWithCognition({
      organizationId,
      cognitionSnapshot: input.cognitionSnapshot ?? null,
      fragilityElevated: input.fragilityElevated ?? false,
      continuityPreserved: input.continuityPreserved ?? true,
      pressureTopologyStressed: input.pressureTopologyStressed ?? false,
      now,
    });

    const layerDepth = computeLayerDepth(pipeline);

    if (layerDepth < 9) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_orchestration_depth",
        pipeline,
        snapshot: prior.snapshots[0] ?? null,
        state: buildUnifiedState(organizationId, prior, prior.snapshots[0] ?? null),
        storeSignature: prior.signature,
      };
    }

    const snapshot = buildEnterpriseStrategicActionSnapshot(
      organizationId,
      pipeline,
      input.fragilityElevated ?? false,
      input.continuityPreserved ?? true,
      prior.lastRuntimeStatus,
      now
    );

    if (!shouldRetainUnifiedDecisionSnapshot(snapshot, layerDepth)) {
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
    store.upsertOrchestrationSummaries(
      [
        {
          summaryId: stableSignature(["orchestration-summary", snapshot.snapshotId]).slice(0, 48),
          headline: `${snapshot.orchestrationHealth} — ${snapshot.summary.stabilizationFocus}`,
          generatedAt: now,
        },
      ],
      now
    );
    store.upsertStrategicActionHistory(
      [
        {
          actionId: stableSignature(["strategic-action", snapshot.snapshotId]).slice(0, 48),
          headline: snapshot.executiveActionIntelligence.actionReadinessHeadline.slice(0, 120),
          generatedAt: now,
        },
      ],
      now
    );
    store.upsertSubsystemHealthRecords(
      snapshot.subsystemStates.map((s) => ({
        recordId: stableSignature(["subsystem-health", s.subsystemId, snapshot.snapshotId]).slice(
          0,
          48
        ),
        subsystemId: s.subsystemId,
        healthy: s.healthy,
        generatedAt: now,
      })),
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
      devLog(`orchestration health — ${runtimeTransition.from} → ${runtimeTransition.to}`);
    }

    if (snapshot.orchestrationHealth === "executive_grade") {
      devLog(
        `executive-grade action intelligence — ${snapshot.summary.dominantPriority}`
      );
    }

    const priorPriority = prior.snapshots[0]?.summary.dominantPriority;
    if (priorPriority && priorPriority !== snapshot.summary.dominantPriority) {
      devLog(
        `major coordination topology shift — ${priorPriority} → ${snapshot.summary.dominantPriority}`
      );
    }

    if (snapshot.runtimeStatus === "degraded" || snapshot.runtimeStatus === "unstable") {
      devLog(`decision runtime degradation — ${snapshot.runtimeStatus}`);
    }

    if (runtimeTransition?.to === "recovering" || runtimeTransition?.to === "stable") {
      if (prior.lastRuntimeStatus === "degraded" || prior.lastRuntimeStatus === "unstable") {
        devLog(`decision runtime recovery — ${snapshot.runtimeStatus}`);
      }
    }

    if (
      orchestrationHealthRank(snapshot.orchestrationHealth) >= 3 &&
      snapshot.runtimeStatus === "stable"
    ) {
      devLog(`strong orchestration runtime — ${snapshot.summary.stabilizationFocus}`);
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
    endUnifiedDecisionRuntimeEvaluation();
  }
}
