import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginUnifiedConsensusRuntimeEvaluation,
  clampUnifiedConsensusConfidence,
  endUnifiedConsensusRuntimeEvaluation,
  shouldEvaluateUnifiedConsensusRuntime,
  UNIFIED_CONSENSUS_RUNTIME_MIN_ACTIVE_SUBSYSTEMS,
  UNIFIED_CONSENSUS_RUNTIME_MIN_GOVERNANCE_DEPTH,
  validateDistributedExecutiveCognitionSnapshot,
} from "./unifiedConsensusRuntimeGuards";
import { getUnifiedConsensusRuntimeStore } from "./unifiedConsensusRuntimeStore";
import type {
  CollectiveIntelligenceHealth,
  ConsensusIntegrityLevel,
  ConsensusRuntimeHistoryEntry,
  ConsensusSubsystemId,
  ConsensusSubsystemState,
  DistributedExecutiveCognitionSnapshot,
  DistributedStrategicCognition,
  DistributedStrategicCognitionSummary,
  UnifiedConsensusRuntimeStatus,
  UnifiedEnterpriseConsensusRuntimeInput,
  UnifiedEnterpriseConsensusRuntimeResult,
} from "./unifiedConsensusRuntimeTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedConsensusRuntime]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapStrengthToIntegrity(
  strength: string | undefined,
  posture: string | undefined
): ConsensusIntegrityLevel {
  if (strength === "enterprise_grade" || posture === "executive_grade") return "enterprise_grade";
  if (strength === "governed" || strength === "synchronized" || strength === "strong") return "governed";
  if (strength === "stable" || strength === "mature" || strength === "moderate") return "stable";
  if (strength === "monitored" || strength === "partial" || strength === "developing") return "monitored";
  return "weak";
}

function mapConsensusStateLabel(state: string | undefined): string {
  if (!state) return "pending";
  if (state === "aligned" || state === "converging") return "coordinated";
  if (state === "negotiating" || state === "partially_resolved") return "negotiating";
  if (state === "fragmented" || state === "divergent") return "fragmented";
  return state.replace(/_/g, " ");
}

function mapDiversityStateLabel(state: string | undefined): string {
  if (!state) return "pending";
  if (state === "balanced" || state === "resilient" || state === "diverse") return "balanced";
  if (state === "collapsed" || state === "narrowing") return "constrained";
  return state.replace(/_/g, " ");
}

function mapAdvisoryStateLabel(state: string | undefined, posture: string | undefined): string {
  if (state === "collectively_aligned" || state === "aligned" || posture === "executive_grade") {
    return "collectively_aligned";
  }
  if (state === "coordinated" || state === "converging") return "coordinated";
  return state?.replace(/_/g, " ") ?? "pending";
}

function buildSubsystemState(
  subsystemId: ConsensusSubsystemId,
  observationCount: number,
  headline: string,
  integrityLevel: ConsensusIntegrityLevel,
  status: UnifiedConsensusRuntimeStatus,
  now: number
): ConsensusSubsystemState {
  return {
    subsystemId,
    status,
    observationCount,
    integrityLevel,
    headline: headline.slice(0, 120),
    active: observationCount > 0,
    lastUpdatedAt: now,
  };
}

function subsystemStatusFromIntegrity(
  integrity: ConsensusIntegrityLevel,
  degraded: boolean
): UnifiedConsensusRuntimeStatus {
  if (degraded && integrity === "weak") return "fragmented";
  if (integrity === "enterprise_grade" || integrity === "governed") return "stable";
  if (integrity === "stable") return degraded ? "adaptive" : "stable";
  if (integrity === "monitored") return "adaptive";
  return "initializing";
}

function buildAllSubsystemStates(
  input: UnifiedEnterpriseConsensusRuntimeInput,
  now: number
): ConsensusSubsystemState[] {
  const consensus = input.strategicConsensusSnapshot;
  const negotiation = input.conflictResolutionSnapshot;
  const weighting = input.consensusPrioritySnapshot;
  const advisory = input.collectiveGuidanceSnapshot;
  const debate = input.counterfactualSnapshot;
  const diversity = input.diversitySnapshot;
  const learning = input.collectiveLearningSnapshot;
  const memorySync = input.memorySyncSnapshot;
  const governance = input.distributedGovernanceSnapshot;
  const fragile = input.fragilityElevated ?? false;

  return [
    buildSubsystemState(
      "consensus_intelligence",
      consensus?.observationCount ?? 0,
      consensus?.awarenessSummary.consensusHeadline ?? "Consensus intelligence foundation awaiting depth.",
      mapStrengthToIntegrity(
        consensus?.awarenessSummary.dominantConsensusStrength,
        undefined
      ),
      subsystemStatusFromIntegrity(
        mapStrengthToIntegrity(consensus?.awarenessSummary.dominantConsensusStrength, undefined),
        fragile
      ),
      now
    ),
    buildSubsystemState(
      "perspective_negotiation",
      negotiation?.observationCount ?? 0,
      negotiation?.awarenessSummary.negotiationHeadline ?? "Perspective negotiation awaiting depth.",
      mapStrengthToIntegrity(
        negotiation?.awarenessSummary.dominantNegotiationStrength,
        negotiation?.awarenessSummary.cohesionPosture
      ),
      negotiation?.awarenessSummary.dominantResolutionState === "reconciled"
        ? "stable"
        : "adaptive",
      now
    ),
    buildSubsystemState(
      "perspective_weighting",
      weighting?.observationCount ?? 0,
      weighting?.awarenessSummary.prioritizationHeadline ?? "Perspective weighting awaiting depth.",
      mapStrengthToIntegrity(
        weighting?.awarenessSummary.dominantWeightingStrength,
        weighting?.awarenessSummary.balancePosture
      ),
      subsystemStatusFromIntegrity(
        mapStrengthToIntegrity(
          weighting?.awarenessSummary.dominantWeightingStrength,
          weighting?.awarenessSummary.balancePosture
        ),
        fragile
      ),
      now
    ),
    buildSubsystemState(
      "distributed_advisory",
      advisory?.observationCount ?? 0,
      advisory?.awarenessSummary.advisoryHeadline ?? "Distributed advisory awaiting depth.",
      mapStrengthToIntegrity(
        advisory?.awarenessSummary.dominantGuidanceStrength,
        advisory?.awarenessSummary.collectivePosture
      ),
      subsystemStatusFromIntegrity(
        mapStrengthToIntegrity(
          advisory?.awarenessSummary.dominantGuidanceStrength,
          advisory?.awarenessSummary.collectivePosture
        ),
        fragile
      ),
      now
    ),
    buildSubsystemState(
      "strategic_debate",
      debate?.observationCount ?? 0,
      debate?.awarenessSummary.debateHeadline ?? "Strategic debate simulation awaiting depth.",
      mapStrengthToIntegrity(
        debate?.awarenessSummary.dominantDebateStrength,
        debate?.awarenessSummary.robustnessPosture
      ),
      subsystemStatusFromIntegrity(
        mapStrengthToIntegrity(
          debate?.awarenessSummary.dominantDebateStrength,
          debate?.awarenessSummary.robustnessPosture
        ),
        fragile
      ),
      now
    ),
    buildSubsystemState(
      "diversity_preservation",
      diversity?.observationCount ?? 0,
      diversity?.awarenessSummary.preservationHeadline ?? "Diversity preservation awaiting depth.",
      (() => {
        const frag = diversity?.awarenessSummary.dominantFragilityStrength;
        if (frag === "dangerous" || frag === "systemic") return "weak" as ConsensusIntegrityLevel;
        return mapStrengthToIntegrity(undefined, diversity?.awarenessSummary.resiliencePosture);
      })(),
      diversity?.awarenessSummary.dominantPluralityState === "collapsed"
        ? "fragmented"
        : diversity?.awarenessSummary.dominantPluralityState === "balanced" ||
            diversity?.awarenessSummary.dominantPluralityState === "resilient"
          ? "stable"
          : "adaptive",
      now
    ),
    buildSubsystemState(
      "collective_learning",
      learning?.observationCount ?? 0,
      learning?.awarenessSummary.evolutionHeadline ?? "Collective strategic learning awaiting depth.",
      mapStrengthToIntegrity(
        learning?.awarenessSummary.dominantEvolutionStrength,
        learning?.awarenessSummary.maturationPosture
      ),
      learning?.awarenessSummary.dominantLearningState === "strategically_mature"
        ? "stable"
        : "adaptive",
      now
    ),
    buildSubsystemState(
      "distributed_memory_sync",
      memorySync?.observationCount ?? 0,
      memorySync?.awarenessSummary.continuityHeadline ?? "Distributed memory synchronization awaiting depth.",
      mapStrengthToIntegrity(
        memorySync?.awarenessSummary.dominantSynchronizationStrength,
        memorySync?.awarenessSummary.coherencePosture
      ),
      memorySync?.awarenessSummary.dominantContinuityState === "continuous" ||
        memorySync?.awarenessSummary.dominantContinuityState === "synchronized"
        ? "stable"
        : "adaptive",
      now
    ),
    buildSubsystemState(
      "distributed_governance",
      governance?.observationCount ?? 0,
      governance?.awarenessSummary.governanceHeadline ?? "Distributed strategic governance awaiting depth.",
      mapStrengthToIntegrity(
        governance?.awarenessSummary.dominantIntegrityStrength,
        governance?.awarenessSummary.integrityPosture
      ),
      governance?.awarenessSummary.dominantGovernanceState === "integrity_preserved" ||
        governance?.awarenessSummary.dominantGovernanceState === "coherent"
        ? "stable"
        : governance?.awarenessSummary.dominantGovernanceState === "fragmented"
          ? "fragmented"
          : "adaptive",
      now
    ),
  ];
}

function deriveRuntimeStatus(
  subsystemStates: ConsensusSubsystemState[],
  priorStatus: UnifiedConsensusRuntimeStatus | null,
  fragilityElevated: boolean
): UnifiedConsensusRuntimeStatus {
  const fragmentedCount = subsystemStates.filter((s) => s.status === "fragmented").length;
  const stableCount = subsystemStates.filter((s) => s.status === "stable").length;
  const activeCount = subsystemStates.filter((s) => s.active).length;

  if (activeCount < 3) return "initializing";
  if (fragmentedCount >= 3) return "fragmented";
  if (priorStatus === "fragmented" && stableCount >= 5) return "recovering";
  if (fragilityElevated && fragmentedCount >= 1) return "adaptive";
  if (stableCount >= 6) return "stable";
  if (stableCount >= 4) return "adaptive";
  return priorStatus === "recovering" ? "recovering" : "adaptive";
}

function deriveCollectiveIntegrity(
  governance: UnifiedEnterpriseConsensusRuntimeInput["distributedGovernanceSnapshot"],
  subsystemStates: ConsensusSubsystemState[]
): ConsensusIntegrityLevel {
  if (governance?.awarenessSummary.integrityPosture === "executive_grade") return "enterprise_grade";
  if (governance?.awarenessSummary.dominantIntegrityStrength === "enterprise_grade") {
    return "enterprise_grade";
  }
  if (
    governance?.awarenessSummary.dominantGovernanceState === "integrity_preserved" ||
    governance?.awarenessSummary.dominantGovernanceState === "coherent"
  ) {
    return "governed";
  }

  const levels = subsystemStates.filter((s) => s.active).map((s) => s.integrityLevel);
  if (levels.includes("weak")) return "monitored";
  if (levels.filter((l) => l === "governed" || l === "enterprise_grade").length >= 4) {
    return "governed";
  }
  if (levels.filter((l) => l === "stable").length >= 5) return "stable";
  return "monitored";
}

function buildDistributedSummary(
  input: UnifiedEnterpriseConsensusRuntimeInput
): DistributedStrategicCognitionSummary {
  const consensus = input.strategicConsensusSnapshot;
  const negotiation = input.conflictResolutionSnapshot;
  const advisory = input.collectiveGuidanceSnapshot;
  const diversity = input.diversitySnapshot;
  const memorySync = input.memorySyncSnapshot;
  const governance = input.distributedGovernanceSnapshot;

  return {
    consensusState: mapConsensusStateLabel(
      consensus?.awarenessSummary.dominantConsensusState
    ),
    diversityState: mapDiversityStateLabel(diversity?.awarenessSummary.dominantPluralityState),
    negotiationState:
      negotiation?.awarenessSummary.dominantResolutionState === "reconciled"
        ? "reconciled"
        : negotiation?.awarenessSummary.dominantResolutionState === "negotiating"
          ? "adaptive"
          : mapConsensusStateLabel(negotiation?.awarenessSummary.dominantResolutionState),
    advisoryState: mapAdvisoryStateLabel(
      advisory?.awarenessSummary.dominantCoordinationState,
      advisory?.awarenessSummary.collectivePosture
    ),
    continuityState:
      memorySync?.awarenessSummary.dominantContinuityState?.replace(/_/g, " ") ?? "pending",
    governanceState:
      governance?.awarenessSummary.dominantGovernanceState?.replace(/_/g, " ") ?? "pending",
  };
}

function buildCollectiveIntelligenceHealth(
  integrity: ConsensusIntegrityLevel,
  governance: UnifiedEnterpriseConsensusRuntimeInput["distributedGovernanceSnapshot"]
): CollectiveIntelligenceHealth {
  return {
    level: integrity,
    integrityState: governance?.awarenessSummary.dominantGovernanceState ?? "monitored",
    governanceHeadline:
      governance?.awarenessSummary.governanceHeadline ??
      "Distributed strategic governance monitoring collective intelligence integrity.",
    coherencePosture: governance?.awarenessSummary.integrityPosture ?? "moderate",
  };
}

function buildDistributedStrategicCognition(
  input: UnifiedEnterpriseConsensusRuntimeInput,
  runtimeStatus: UnifiedConsensusRuntimeStatus,
  integrity: ConsensusIntegrityLevel,
  activeCount: number,
  summary: DistributedStrategicCognitionSummary,
  now: number
): DistributedStrategicCognition {
  const diversity = input.diversitySnapshot;
  const confidence = clampUnifiedConsensusConfidence(
    integrity === "enterprise_grade"
      ? 0.93
      : integrity === "governed"
        ? 0.9
        : integrity === "stable"
          ? 0.86
          : 0.72
  );

  return {
    cognitionId: stableSignature(["distributed-strategic-cognition", input.organizationId]).slice(
      0,
      48
    ),
    runtimeHeadline: `Unified enterprise consensus runtime ${runtimeStatus.replace(/_/g, " ")} with ${integrity.replace(/_/g, " ")} collective integrity across ${activeCount} active distributed cognition subsystems.`,
    cognitionSummary: `Enterprise distributed executive strategic cognition coordinates consensus, negotiation, advisory, debate, diversity preservation, collective learning, memory synchronization, and governance as a bounded unified runtime — ${summary.consensusState} consensus, ${summary.diversityState} diversity, ${summary.governanceState} governance.`,
    activeSubsystemCount: activeCount,
    diversityPreservationPosture: diversity?.awarenessSummary.resiliencePosture ?? "moderate",
    confidence,
    generatedAt: now,
  };
}

function buildCognitionSnapshot(
  organizationId: string,
  runtimeStatus: UnifiedConsensusRuntimeStatus,
  collectiveIntegrity: ConsensusIntegrityLevel,
  summary: DistributedStrategicCognitionSummary,
  activeSubsystems: ConsensusSubsystemId[],
  subsystemStates: ConsensusSubsystemState[],
  collectiveIntelligenceHealth: CollectiveIntelligenceHealth,
  distributedStrategicCognition: DistributedStrategicCognition,
  now: number
): DistributedExecutiveCognitionSnapshot {
  const signature = stableSignature([
    "d9-7-10-unified-consensus-snapshot",
    organizationId,
    runtimeStatus,
    collectiveIntegrity,
    activeSubsystems.join(","),
    summary.consensusState,
    summary.governanceState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    runtimeStatus,
    collectiveIntegrity,
    summary,
    activeSubsystems: Object.freeze(activeSubsystems),
    subsystemStates: Object.freeze(subsystemStates),
    collectiveIntelligenceHealth,
    distributedStrategicCognition,
  };
}

export function evaluateUnifiedEnterpriseConsensusRuntime(
  input: UnifiedEnterpriseConsensusRuntimeInput
): UnifiedEnterpriseConsensusRuntimeResult {
  if (!beginUnifiedConsensusRuntimeEvaluation()) {
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
    const store = getUnifiedConsensusRuntimeStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-10-unified-consensus-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.collectiveGuidanceSnapshot?.signature ?? "no-advisory",
      input.counterfactualSnapshot?.signature ?? "no-debate",
      input.diversitySnapshot?.signature ?? "no-diversity",
      input.collectiveLearningSnapshot?.signature ?? "no-learning",
      input.memorySyncSnapshot?.signature ?? "no-memory-sync",
      input.distributedGovernanceSnapshot?.signature ?? "no-governance",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-reflective",
    ]);

    if (
      !shouldEvaluateUnifiedConsensusRuntime(
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
        snapshot: prior.cognitionSnapshots[0] ?? null,
        activeSubsystemCount: prior.subsystemStates.filter((s) => s.active).length,
        storeSignature: prior.signature,
      };
    }

    const governanceDepth = input.distributedGovernanceSnapshot?.observationCount ?? 0;
    if (governanceDepth < UNIFIED_CONSENSUS_RUNTIME_MIN_GOVERNANCE_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_governance_depth",
        snapshot: prior.cognitionSnapshots[0] ?? null,
        activeSubsystemCount: 0,
        storeSignature: prior.signature,
      };
    }

    const subsystemStates = buildAllSubsystemStates(input, now);
    const activeSubsystems = subsystemStates
      .filter((s) => s.active)
      .map((s) => s.subsystemId) as ConsensusSubsystemId[];

    if (activeSubsystems.length < UNIFIED_CONSENSUS_RUNTIME_MIN_ACTIVE_SUBSYSTEMS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_active_subsystems",
        snapshot: prior.cognitionSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const runtimeStatus = deriveRuntimeStatus(
      subsystemStates,
      prior.lastRuntimeStatus,
      input.fragilityElevated ?? false
    );
    const collectiveIntegrity = deriveCollectiveIntegrity(
      input.distributedGovernanceSnapshot,
      subsystemStates
    );
    const summary = buildDistributedSummary(input);
    const collectiveIntelligenceHealth = buildCollectiveIntelligenceHealth(
      collectiveIntegrity,
      input.distributedGovernanceSnapshot
    );
    const distributedStrategicCognition = buildDistributedStrategicCognition(
      input,
      runtimeStatus,
      collectiveIntegrity,
      activeSubsystems.length,
      summary,
      now
    );

    const snapshot = buildCognitionSnapshot(
      organizationId,
      runtimeStatus,
      collectiveIntegrity,
      summary,
      activeSubsystems,
      subsystemStates,
      collectiveIntelligenceHealth,
      distributedStrategicCognition,
      now
    );

    if (!validateDistributedExecutiveCognitionSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_cognition_snapshot",
        snapshot: prior.cognitionSnapshots[0] ?? null,
        activeSubsystemCount: activeSubsystems.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: ConsensusRuntimeHistoryEntry = {
      entryId: stableSignature(["consensus-runtime-history", snapshot.signature]).slice(0, 48),
      collectiveIntegrity,
      runtimeStatus,
      headline: collectiveIntelligenceHealth.governanceHeadline.slice(0, 80),
      generatedAt: now,
    };

    store.upsertCognitionSnapshots([snapshot], now);
    store.upsertSubsystemStates(subsystemStates, now);
    store.upsertRuntimeHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(runtimeStatus);

    const finalState = store.getState();
    const priorRuntime = prior.lastRuntimeStatus;
    const priorIntegrity = prior.cognitionSnapshots[0]?.collectiveIntegrity;

    if (priorRuntime && priorRuntime !== runtimeStatus) {
      if (runtimeStatus === "stable" || runtimeStatus === "recovering") {
        devLog(`distributed-governance recovery — ${priorRuntime} → ${runtimeStatus}`);
      } else if (runtimeStatus === "fragmented") {
        devLog("consensus-fragmentation emergence — distributed cognition boundaries strained");
      }
    }

    if (priorIntegrity && priorIntegrity !== collectiveIntegrity) {
      if (
        collectiveIntegrity === "governed" ||
        collectiveIntegrity === "enterprise_grade"
      ) {
        devLog(`collective-integrity recovery — ${priorIntegrity} → ${collectiveIntegrity}`);
      } else if (collectiveIntegrity === "weak" || collectiveIntegrity === "monitored") {
        devLog("collective-integrity degradation — governance monitoring elevated");
      }
    }

    if (
      summary.diversityState === "balanced" &&
      (runtimeStatus === "stable" || runtimeStatus === "recovering")
    ) {
      devLog("strategic-diversity stabilization — plurality preserved across unified runtime");
    }

    if (
      collectiveIntegrity === "enterprise_grade" &&
      runtimeStatus === "stable"
    ) {
      devLog("enterprise-grade collaborative coherence formation — unified consensus runtime stabilized");
    }

    if (
      summary.consensusState === "fragmented" ||
      subsystemStates.filter((s) => s.subsystemId === "diversity_preservation" && s.status === "fragmented")
        .length > 0
    ) {
      devLog("collaborative fragmentation emergence — bounded plurality monitoring active");
    }

    if (
      summary.governanceState === "integrity preserved" ||
      summary.governanceState === "coherent"
    ) {
      if (priorRuntime === "fragmented" || priorRuntime === "adaptive") {
        devLog("distributed-learning convergence — collective governance coherence advancing");
      }
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      activeSubsystemCount: activeSubsystems.length,
      storeSignature: finalState.signature,
    };
  } finally {
    endUnifiedConsensusRuntimeEvaluation();
  }
}
