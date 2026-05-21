import { stableSignature } from "../intelligence/shared/dedupe";
import { integrateEnterpriseTemporalCognitionWithCognition } from "./integrateEnterpriseTemporalCognitionWithCognition";
import {
  beginUnifiedTemporalCognitionEvaluation,
  endUnifiedTemporalCognitionEvaluation,
  shouldEvaluateUnifiedTemporalCognition,
  shouldRetainUnifiedTemporalSnapshot,
  temporalHealthRank,
} from "./unifiedTemporalCognitionGuards";
import { getUnifiedTemporalCognitionStore } from "./unifiedTemporalCognitionStore";
import type {
  EnterpriseTemporalCognitionPipelineResult,
  EnterpriseTimeIntelligenceSnapshot,
  OrganizationalEvolutionState,
  TemporalCognitionSubsystemState,
  TemporalHealthLevel,
  TemporalRuntimeStatus,
  TemporalSubsystemId,
  UnifiedTemporalAwarenessSummary,
  UnifiedTemporalCognitionInput,
  UnifiedTemporalCognitionResult,
  UnifiedTemporalCognitionState,
} from "./unifiedTemporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedTemporalCognition]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function layerEvaluated(result: { evaluated: boolean; skipped: boolean }): boolean {
  return result.evaluated && !result.skipped;
}

function buildSubsystemStates(
  pipeline: EnterpriseTemporalCognitionPipelineResult
): TemporalCognitionSubsystemState[] {
  const entries: [TemporalSubsystemId, { evaluated: boolean; skipped: boolean }, string][] = [
    ["timeline_awareness", pipeline.timelineAwareness, pipeline.timelineAwareness.storeSignature],
    [
      "causal_dependencies",
      pipeline.causalDependencies,
      pipeline.causalDependencies.storeSignature,
    ],
    ["operational_replay", pipeline.operationalReplay, pipeline.operationalReplay.storeSignature],
    ["drift_projection", pipeline.driftProjection, pipeline.driftProjection.storeSignature],
    [
      "divergence_awareness",
      pipeline.divergenceAwareness,
      pipeline.divergenceAwareness.storeSignature,
    ],
    [
      "convergence_intelligence",
      pipeline.convergenceIntelligence,
      pipeline.convergenceIntelligence.storeSignature,
    ],
    [
      "temporal_compression",
      pipeline.temporalCompression,
      pipeline.temporalCompression.storeSignature,
    ],
    [
      "cross_period_synchronization",
      pipeline.crossPeriodSynchronization,
      pipeline.crossPeriodSynchronization.storeSignature,
    ],
    [
      "long_horizon_awareness",
      pipeline.longHorizonAwareness,
      pipeline.longHorizonAwareness.storeSignature,
    ],
  ];

  return entries.map(([subsystemId, result, signature]) => {
    const evaluated = layerEvaluated(result);
    const hasSnapshot =
      "snapshot" in result && result.snapshot !== null && result.snapshot !== undefined;
    return {
      subsystemId,
      active: evaluated || hasSnapshot,
      healthy: evaluated,
      evaluated,
      signature: signature || "inactive",
    };
  });
}

function computeLayerDepth(pipeline: EnterpriseTemporalCognitionPipelineResult): number {
  return (
    (pipeline.timelineAwareness.snapshot?.sequenceCount ?? 0) +
    (pipeline.causalDependencies.snapshot?.chainCount ?? 0) +
    (pipeline.operationalReplay.snapshot?.replayCount ?? 0) +
    (pipeline.driftProjection.snapshot?.projectionCount ?? 0) +
    (pipeline.divergenceAwareness.snapshot?.branchCount ?? 0) +
    (pipeline.convergenceIntelligence.snapshot?.convergenceCount ?? 0) +
    (pipeline.temporalCompression.snapshot?.digestCount ?? 0) +
    (pipeline.crossPeriodSynchronization.snapshot?.syncCount ?? 0) +
    (pipeline.longHorizonAwareness.snapshot?.fieldCount ?? 0)
  );
}

function inferDominantTrajectory(
  pipeline: EnterpriseTemporalCognitionPipelineResult
): string {
  const drift = pipeline.driftProjection.snapshot?.dominantDirection;
  if (drift) return drift;
  const branch = pipeline.divergenceAwareness.snapshot?.dominantBranch;
  if (branch) return branch;
  return "operational_evolution";
}

function inferResilienceDirection(
  pipeline: EnterpriseTemporalCognitionPipelineResult,
  fragilityElevated: boolean
): string {
  const field = pipeline.longHorizonAwareness.snapshot?.dominantCategory;
  if (field === "resilience" || field === "recovery") return "strengthening";
  if (field === "fragility" || fragilityElevated) return "at_risk";
  const convergence = pipeline.convergenceIntelligence.snapshot?.dominantCategory;
  if (convergence === "resilience_alignment" || convergence === "recovery_synchronization") {
    return "strengthening";
  }
  if (convergence === "escalation_decay") return "stabilizing";
  return "neutral";
}

function inferEvolutionState(
  pipeline: EnterpriseTemporalCognitionPipelineResult
): OrganizationalEvolutionState {
  const alignment = pipeline.convergenceIntelligence.snapshot?.dominantAlignmentState;
  if (alignment === "institutionalized") return "institutionalizing";
  if (alignment === "converging" || alignment === "stabilizing") return "stabilizing";
  if (alignment === "emerging") return "emerging";
  const compression = pipeline.temporalCompression.snapshot?.dominantAbstractionState;
  if (compression === "executive_ready" || compression === "distilled") return "institutionalizing";
  if (compression === "fragmented") return "fragmenting";
  return "evolving";
}

function inferTemporalContinuity(pipeline: EnterpriseTemporalCognitionPipelineResult): string {
  const syncState = pipeline.crossPeriodSynchronization.snapshot?.dominantPeriodState;
  if (syncState === "synchronized" || syncState === "bridged") return "persistent";
  if (syncState === "drifted") return "shifting";
  return "forming";
}

function inferLongHorizonSignal(
  pipeline: EnterpriseTemporalCognitionPipelineResult
): string {
  const field = pipeline.longHorizonAwareness.snapshot;
  if (!field) return "pending_long_horizon_depth";
  const category = field.dominantCategory;
  const strength = field.dominantFieldStrength;
  if (category === "resilience" && strength === "foundational") {
    return "institutional_resilience_growth";
  }
  if (category === "fragility") return "institutional_fragility_persistence";
  if (category === "governance") return "governance_durability_evolution";
  if (category === "strategic") return "strategic_continuity_field";
  return `${category}_${strength}_field`;
}

function buildAwarenessSummary(
  pipeline: EnterpriseTemporalCognitionPipelineResult,
  fragilityElevated: boolean
): UnifiedTemporalAwarenessSummary {
  return {
    dominantTrajectory: inferDominantTrajectory(pipeline),
    resilienceDirection: inferResilienceDirection(pipeline, fragilityElevated),
    organizationalEvolutionState: inferEvolutionState(pipeline),
    temporalContinuity: inferTemporalContinuity(pipeline),
    longHorizonSignal: inferLongHorizonSignal(pipeline),
  };
}

function inferRuntimeStatus(
  subsystemStates: TemporalCognitionSubsystemState[],
  layerDepth: number,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  priorStatus: TemporalRuntimeStatus | null
): TemporalRuntimeStatus {
  const healthyCount = subsystemStates.filter((s) => s.healthy).length;
  const degradedCount = subsystemStates.filter((s) => s.active && !s.healthy).length;

  if (layerDepth < 8) return "initializing";
  if (fragilityElevated && healthyCount < 4) return "unstable";
  if (!continuityPreserved && degradedCount >= 3) return "unstable";
  if (degradedCount >= 4) return "degraded";
  if (priorStatus === "degraded" || priorStatus === "unstable") {
    if (healthyCount >= 6 && continuityPreserved) return "recovering";
  }
  if (healthyCount >= 5) return "stable";
  if (healthyCount >= 3) return "recovering";
  return "degraded";
}

function inferTemporalHealth(
  subsystemStates: TemporalCognitionSubsystemState[],
  runtimeStatus: TemporalRuntimeStatus
): TemporalHealthLevel {
  const healthyCount = subsystemStates.filter((s) => s.healthy).length;
  if (runtimeStatus === "stable" && healthyCount >= 7) return "verified";
  if (runtimeStatus === "stable" && healthyCount >= 5) return "strong";
  if (runtimeStatus === "recovering" && healthyCount >= 4) return "moderate";
  if (healthyCount >= 3) return "moderate";
  return "weak";
}

function buildEnterpriseTimeSnapshot(
  organizationId: string,
  pipeline: EnterpriseTemporalCognitionPipelineResult,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  priorStatus: TemporalRuntimeStatus | null,
  now: number
): EnterpriseTimeIntelligenceSnapshot {
  const subsystemStates = buildSubsystemStates(pipeline);
  const layerDepth = computeLayerDepth(pipeline);
  const runtimeStatus = inferRuntimeStatus(
    subsystemStates,
    layerDepth,
    fragilityElevated,
    continuityPreserved,
    priorStatus
  );
  const temporalHealth = inferTemporalHealth(subsystemStates, runtimeStatus);
  const activeSubsystems = Object.freeze(
    subsystemStates.filter((s) => s.active && s.healthy).map((s) => s.subsystemId)
  );
  const summary = buildAwarenessSummary(pipeline, fragilityElevated);

  const signature = stableSignature([
    "d9-3-10-enterprise-time",
    organizationId,
    runtimeStatus,
    temporalHealth,
    pipeline.pipelineSignature,
    activeSubsystems.join(","),
    summary.organizationalEvolutionState,
  ]);

  return {
    snapshotId: stableSignature(["enterprise-time-snapshot", organizationId, signature]).slice(
      0,
      56
    ),
    organizationId,
    runtimeStatus,
    temporalHealth,
    summary,
    activeSubsystems,
    subsystemStates: Object.freeze(subsystemStates),
    runtimeHealth: {
      level: temporalHealth,
      activeSubsystemCount: activeSubsystems.length,
      layerDepth,
      degradedSubsystemCount: subsystemStates.filter((s) => s.active && !s.healthy).length,
    },
    generatedAt: now,
    signature,
  };
}

function buildUnifiedState(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getUnifiedTemporalCognitionStore>["getState"]>,
  latest: EnterpriseTimeIntelligenceSnapshot | null
): UnifiedTemporalCognitionState {
  return {
    organizationId,
    latestSnapshot: latest,
    cognitionHistory: Object.freeze(storeState.snapshots.slice(0, 8)),
    runtimeStatus: storeState.runtimeStatus,
    signature: storeState.signature,
    updatedAt: storeState.updatedAt,
    lastEvaluationSignature: storeState.lastEvaluationSignature,
    lastRuntimeStatus: storeState.lastRuntimeStatus,
  };
}

/**
 * D9:3:10 — Unified enterprise temporal cognition runtime evaluation.
 */
export function evaluateUnifiedTemporalCognition(
  input: UnifiedTemporalCognitionInput
): UnifiedTemporalCognitionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginUnifiedTemporalCognitionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_unified_temporal_guard",
      pipeline: null,
      snapshot: null,
      state: null,
      storeSignature: "",
    };
  }

  try {
    const store = getUnifiedTemporalCognitionStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-3-10-unified-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.fragilityElevated ? "fragile" : "stable",
      input.continuityPreserved === false ? "disrupted" : "continuous",
    ]);

    if (
      !shouldEvaluateUnifiedTemporalCognition(
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

    const pipeline = integrateEnterpriseTemporalCognitionWithCognition({
      organizationId,
      cognitionSnapshot: input.cognitionSnapshot ?? null,
      fragilityElevated: input.fragilityElevated ?? false,
      continuityPreserved: input.continuityPreserved ?? true,
      now,
    });

    const layerDepth = computeLayerDepth(pipeline);

    if (layerDepth < 8) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_temporal_depth",
        pipeline,
        snapshot: prior.snapshots[0] ?? null,
        state: buildUnifiedState(organizationId, prior, prior.snapshots[0] ?? null),
        storeSignature: prior.signature,
      };
    }

    const snapshot = buildEnterpriseTimeSnapshot(
      organizationId,
      pipeline,
      input.fragilityElevated ?? false,
      input.continuityPreserved ?? true,
      prior.lastRuntimeStatus,
      now
    );

    if (!shouldRetainUnifiedTemporalSnapshot(snapshot, layerDepth)) {
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
    store.upsertEvolutionSummaries(
      [
        {
          summaryId: stableSignature(["evolution-summary", snapshot.snapshotId]).slice(0, 48),
          headline: `${snapshot.summary.organizationalEvolutionState} — ${snapshot.summary.dominantTrajectory}`,
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

    if (
      snapshot.summary.organizationalEvolutionState === "stabilizing" &&
      runtimeTransition?.to === "stable"
    ) {
      devLog("convergence stabilization — organizational evolution stabilizing");
    }

    if (snapshot.summary.organizationalEvolutionState !== prior.snapshots[0]?.summary.organizationalEvolutionState) {
      devLog(
        `evolution state shift — ${snapshot.summary.organizationalEvolutionState} (${snapshot.summary.resilienceDirection})`
      );
    }

    if (snapshot.runtimeStatus === "degraded" || snapshot.runtimeStatus === "unstable") {
      devLog(`temporal cognition degradation — ${snapshot.runtimeStatus}`);
    }

    if (temporalHealthRank(snapshot.temporalHealth) >= 3 && snapshot.runtimeStatus === "stable") {
      devLog(`verified temporal health — ${snapshot.summary.longHorizonSignal}`);
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
    endUnifiedTemporalCognitionEvaluation();
  }
}
