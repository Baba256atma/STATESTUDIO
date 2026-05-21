import { stableSignature } from "../intelligence/shared/dedupe";
import {
  integrateInstitutionalMemoryWithCognition,
  type InstitutionalMemoryIntegrationResult,
} from "./integrateInstitutionalMemoryWithCognition";
import {
  beginUnifiedInstitutionalMemoryEvaluation,
  endUnifiedInstitutionalMemoryEvaluation,
  shouldEvaluateUnifiedInstitutionalMemory,
  shouldRetainUnifiedSnapshot,
} from "./unifiedInstitutionalMemoryGuards";
import { getUnifiedInstitutionalMemoryStore } from "./unifiedInstitutionalMemoryStore";
import type {
  EnterpriseMemoryCognitionSnapshot,
  InstitutionalHealthLevel,
  InstitutionalLearningHealth,
  InstitutionalSubsystemId,
  MemoryRuntimeStatus,
  OrganizationalWisdomState,
  SubsystemHealthRecord,
  UnifiedInstitutionalMemoryInput,
  UnifiedInstitutionalMemoryResult,
  UnifiedInstitutionalMemoryState,
  UnifiedLearningSummary,
} from "./unifiedInstitutionalMemoryTypes";

const DEV_LOG_PREFIX = "[Nexora][UnifiedInstitutionalMemory]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapGovernanceToRuntime(governanceStatus: string | undefined): MemoryRuntimeStatus {
  if (governanceStatus === "stable") return "stable";
  if (governanceStatus === "recovering") return "recovering";
  if (governanceStatus === "monitored") return "stable";
  if (governanceStatus === "degraded") return "degraded";
  if (governanceStatus === "unstable") return "unstable";
  return "initializing";
}

function mapIntegrityToHealth(integrityLevel: string | undefined): InstitutionalHealthLevel {
  if (integrityLevel === "verified") return "verified";
  if (integrityLevel === "strong") return "strong";
  if (integrityLevel === "moderate") return "moderate";
  return "weak";
}

function buildSubsystemHealth(
  integration: InstitutionalMemoryIntegrationResult
): SubsystemHealthRecord[] {
  const records: SubsystemHealthRecord[] = [
    {
      subsystemId: "institutional_memory",
      active: (integration.snapshot?.memoryCount ?? 0) > 0,
      healthy: (integration.snapshot?.memoryCount ?? 0) > 0,
      signature: integration.storeSignature ?? integration.snapshot?.signature ?? "",
    },
    {
      subsystemId: "experience_correlation",
      active: (integration.correlation.snapshot?.patternCount ?? 0) > 0,
      healthy: (integration.correlation.snapshot?.patternCount ?? 0) > 0,
      signature: integration.correlation.storeSignature,
    },
    {
      subsystemId: "adaptation_intelligence",
      active: (integration.adaptationRecovery.snapshot?.adaptationCount ?? 0) > 0,
      healthy: (integration.adaptationRecovery.snapshot?.adaptationCount ?? 0) > 0,
      signature: integration.adaptationRecovery.storeSignature,
    },
    {
      subsystemId: "decision_outcomes",
      active: (integration.decisionOutcomes.snapshot?.outcomeCount ?? 0) > 0,
      healthy: (integration.decisionOutcomes.snapshot?.outcomeCount ?? 0) > 0,
      signature: integration.decisionOutcomes.storeSignature,
    },
    {
      subsystemId: "knowledge_distillation",
      active: (integration.knowledgeDistillation.snapshot?.insightCount ?? 0) > 0,
      healthy: (integration.knowledgeDistillation.snapshot?.insightCount ?? 0) > 0,
      signature: integration.knowledgeDistillation.storeSignature,
    },
    {
      subsystemId: "historical_recall",
      active: (integration.cognitiveRecall.snapshot?.recallCount ?? 0) > 0,
      healthy: (integration.cognitiveRecall.snapshot?.recallCount ?? 0) > 0,
      signature: integration.cognitiveRecall.storeSignature,
    },
    {
      subsystemId: "maturity_tracking",
      active: (integration.learningEvolution.snapshot?.snapshotCount ?? 0) > 0,
      healthy: (integration.learningEvolution.snapshot?.snapshotCount ?? 0) > 0,
      signature: integration.learningEvolution.storeSignature,
    },
    {
      subsystemId: "wisdom_preservation",
      active: (integration.knowledgeContinuity.snapshot?.artifactCount ?? 0) > 0,
      healthy: (integration.knowledgeContinuity.snapshot?.artifactCount ?? 0) > 0,
      signature: integration.knowledgeContinuity.storeSignature,
    },
    {
      subsystemId: "cognitive_governance",
      active: (integration.learningGovernance.snapshot?.snapshotCount ?? 0) > 0,
      healthy: (integration.learningGovernance.snapshot?.snapshotCount ?? 0) > 0,
      signature: integration.learningGovernance.storeSignature,
    },
  ];
  return records;
}

function buildUnifiedSummary(
  integration: InstitutionalMemoryIntegrationResult
): UnifiedLearningSummary {
  const distillation = integration.knowledgeDistillation.snapshot;
  const continuity = integration.knowledgeContinuity.snapshot;
  const governance = integration.learningGovernance.snapshot;
  const maturity = integration.learningEvolution.snapshot;

  const primaryInsight =
    distillation?.recentInsights[0]?.title ??
    integration.correlation.snapshot?.consolidatedPatterns[0]?.lesson ??
    integration.correlation.snapshot?.strongCorrelations[0]?.summary ??
    "Institutional learning accumulating operational experience.";

  const resilienceMaturity =
    maturity?.dominantMaturityLevel ??
    maturity?.recentSnapshots[0]?.maturityLevel ??
    "adaptive";

  const wisdomState =
    continuity?.dominantContinuityLevel ??
    continuity?.recentArtifacts[0]?.continuityLevel ??
    "retained";

  const cognitiveIntegrity =
    governance?.integrityLevel ??
    governance?.recentGovernanceSnapshots[0]?.integrityLevel ??
    "moderate";

  const memoryContinuity =
    continuity?.dominantContinuityLevel === "foundational" ||
    continuity?.dominantContinuityLevel === "institutionalized"
      ? "persistent"
      : continuity?.dominantContinuityLevel ?? "retained";

  return {
    primaryStrategicLesson: primaryInsight,
    resilienceMaturity,
    organizationalWisdomState: wisdomState,
    cognitiveIntegrity,
    strategicMemoryContinuity: memoryContinuity,
  };
}

function buildWisdomState(
  integration: InstitutionalMemoryIntegrationResult
): OrganizationalWisdomState {
  const continuity = integration.knowledgeContinuity.snapshot;
  return {
    dominantContinuityLevel: continuity?.dominantContinuityLevel ?? "retained",
    artifactCount: continuity?.artifactCount ?? 0,
    anchorCount: continuity?.anchorCount ?? 0,
    summary:
      continuity?.continuitySummary ??
      "Organizational wisdom preservation awaiting sufficient institutional depth.",
  };
}

function buildLearningHealth(
  integration: InstitutionalMemoryIntegrationResult,
  subsystemHealth: readonly SubsystemHealthRecord[]
): InstitutionalLearningHealth {
  const governance = integration.learningGovernance.snapshot;
  const activeCount = subsystemHealth.filter((s) => s.active && s.healthy).length;
  return {
    level: mapIntegrityToHealth(governance?.integrityLevel),
    governanceStatus: governance?.governanceStatus ?? "initializing",
    layerDepth:
      (integration.snapshot?.memoryCount ?? 0) +
      (integration.correlation.snapshot?.patternCount ?? 0) +
      (integration.adaptationRecovery.snapshot?.adaptationCount ?? 0) +
      (integration.decisionOutcomes.snapshot?.outcomeCount ?? 0) +
      (integration.knowledgeDistillation.snapshot?.insightCount ?? 0) +
      (integration.cognitiveRecall.snapshot?.recallCount ?? 0) +
      (integration.learningEvolution.snapshot?.snapshotCount ?? 0) +
      (integration.knowledgeContinuity.snapshot?.artifactCount ?? 0) +
      (integration.learningGovernance.snapshot?.snapshotCount ?? 0),
    activeSubsystemCount: activeCount,
  };
}

function buildEnterpriseSnapshot(
  organizationId: string,
  integration: InstitutionalMemoryIntegrationResult,
  now: number
): EnterpriseMemoryCognitionSnapshot {
  const subsystemHealth = buildSubsystemHealth(integration);
  const learningHealth = buildLearningHealth(integration, subsystemHealth);
  const governance = integration.learningGovernance.snapshot;
  const runtimeStatus = mapGovernanceToRuntime(governance?.governanceStatus);
  const institutionalHealth = mapIntegrityToHealth(governance?.integrityLevel);
  const activeSubsystems = Object.freeze(
    subsystemHealth.filter((s) => s.active && s.healthy).map((s) => s.subsystemId)
  );

  const signature = stableSignature([
    "d9-2-10-enterprise-memory",
    organizationId,
    runtimeStatus,
    institutionalHealth,
    integration.storeSignature,
    integration.learningGovernance.storeSignature,
    activeSubsystems.join(","),
  ]);

  return {
    snapshotId: stableSignature(["enterprise-memory-snapshot", organizationId, signature]).slice(
      0,
      56
    ),
    organizationId,
    runtimeStatus,
    institutionalHealth,
    summary: buildUnifiedSummary(integration),
    activeSubsystems,
    subsystemHealth: Object.freeze(subsystemHealth),
    learningHealth,
    wisdomState: buildWisdomState(integration),
    generatedAt: now,
    signature,
  };
}

function buildUnifiedState(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getUnifiedInstitutionalMemoryStore>["getState"]>,
  latest: EnterpriseMemoryCognitionSnapshot | null
): UnifiedInstitutionalMemoryState {
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

export type { UnifiedInstitutionalMemoryResult } from "./unifiedInstitutionalMemoryTypes";

export function evaluateUnifiedInstitutionalMemory(
  input: UnifiedInstitutionalMemoryInput
): UnifiedInstitutionalMemoryResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginUnifiedInstitutionalMemoryEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_unified_memory_guard",
      integration: null,
      snapshot: null,
      state: null,
      storeSignature: "",
    };
  }

  try {
    const store = getUnifiedInstitutionalMemoryStore(organizationId);
    const prior = store.getState();

    const cognitionSignature = input.cognitionSnapshot?.signature ?? "no-cognition";
    const evaluationSignature = stableSignature([
      "d9-2-10-unified-eval",
      organizationId,
      cognitionSignature,
      input.fragilityElevated ? "fragile" : "stable",
      input.continuityPreserved === false ? "disrupted" : "continuous",
    ]);

    if (
      !shouldEvaluateUnifiedInstitutionalMemory(
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
        integration: null,
        snapshot: latest,
        state: buildUnifiedState(organizationId, prior, latest),
        storeSignature: prior.signature,
      };
    }

    const integration = integrateInstitutionalMemoryWithCognition({
      organizationId,
      cognitionSnapshot: input.cognitionSnapshot ?? null,
      observations: input.observations ?? null,
      fragilityElevated: input.fragilityElevated ?? false,
      continuityPreserved: input.continuityPreserved ?? true,
    });

    const layerDepth =
      (integration.snapshot?.memoryCount ?? 0) +
      (integration.correlation.snapshot?.patternCount ?? 0) +
      (integration.adaptationRecovery.snapshot?.adaptationCount ?? 0) +
      (integration.decisionOutcomes.snapshot?.outcomeCount ?? 0) +
      (integration.knowledgeDistillation.snapshot?.insightCount ?? 0) +
      (integration.cognitiveRecall.snapshot?.recallCount ?? 0) +
      (integration.learningEvolution.snapshot?.snapshotCount ?? 0) +
      (integration.knowledgeContinuity.snapshot?.artifactCount ?? 0) +
      (integration.learningGovernance.snapshot?.snapshotCount ?? 0);

    if (layerDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        integration,
        snapshot: null,
        state: buildUnifiedState(organizationId, prior, prior.snapshots[0] ?? null),
        storeSignature: prior.signature,
      };
    }

    const snapshot = buildEnterpriseSnapshot(organizationId, integration, now);

    if (!shouldRetainUnifiedSnapshot(snapshot, layerDepth)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "snapshot_retention_guard",
        integration,
        snapshot: prior.snapshots[0] ?? null,
        state: buildUnifiedState(organizationId, prior, prior.snapshots[0] ?? null),
        storeSignature: prior.signature,
      };
    }

    store.upsertSnapshot(snapshot, now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRuntimeStatus(snapshot.runtimeStatus);

    const finalState = store.getState();
    const runtimeTransition =
      prior.lastRuntimeStatus && prior.lastRuntimeStatus !== snapshot.runtimeStatus
        ? { from: prior.lastRuntimeStatus, to: snapshot.runtimeStatus }
        : undefined;

    if (runtimeTransition) {
      devLog(`runtime transition — ${runtimeTransition.from} → ${runtimeTransition.to}`);
    }

    if (snapshot.institutionalHealth === "verified") {
      devLog(`verified wisdom — ${snapshot.summary.primaryStrategicLesson.slice(0, 72)}`);
    }

    if (snapshot.runtimeStatus === "degraded" || snapshot.runtimeStatus === "unstable") {
      devLog(`cognition degradation — ${snapshot.runtimeStatus}: ${snapshot.summary.primaryStrategicLesson.slice(0, 56)}`);
    }

    if (snapshot.runtimeStatus === "recovering" && runtimeTransition) {
      devLog(`subsystem recovery — institutional health ${snapshot.institutionalHealth}`);
    }

    return {
      evaluated: true,
      skipped: false,
      integration,
      snapshot,
      state: buildUnifiedState(organizationId, finalState, snapshot),
      storeSignature: finalState.signature,
      runtimeTransition,
    };
  } finally {
    endUnifiedInstitutionalMemoryEvaluation();
  }
}
