import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalCompressionStore } from "./temporalCompressionStore";
import { getTemporalConvergenceStore } from "./temporalConvergenceStore";
import { getMultiTimelineStore } from "./multiTimelineStore";
import { getTemporalDriftProjectionStore } from "./temporalDriftProjectionStore";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import {
  beginTemporalMemorySyncEvaluation,
  confidenceToSyncLevel,
  endTemporalMemorySyncEvaluation,
  shouldEvaluateTemporalMemorySync,
  shouldRetainSyncRecord,
} from "./temporalMemorySyncGuards";
import { getTemporalMemorySyncStore } from "./temporalMemorySyncStore";
import type { ExecutiveTemporalDigest } from "./temporalCompressionTypes";
import type { StabilityConvergencePattern } from "./temporalConvergenceTypes";
import type { TemporalDriftProjection } from "./temporalDriftProjectionTypes";
import type {
  CrossPeriodAwarenessSignal,
  InstitutionalTemporalSyncSnapshot,
  OrganizationalPeriodBridge,
  PeriodAwarenessState,
  PeriodSynchronizationSequence,
  SyncCategory,
  SyncStrength,
  TemporalMemorySyncInput,
  TemporalMemorySyncRecord,
  TemporalMemorySyncResult,
  TemporalPeriodAlignment,
} from "./temporalMemorySyncTypes";

const DEV_LOG_PREFIX = "[Nexora][TemporalMemorySync]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSyncId(category: SyncCategory, strength: SyncStrength): string {
  return stableSignature(["enterprise-cross-period-sync", category, strength]).slice(0, 56);
}

function periodReference(fingerprint: string): string {
  return `period_${fingerprint.slice(0, 16)}`;
}

function dedupeSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createSyncRecord(
  category: SyncCategory,
  syncStrength: SyncStrength,
  periodState: PeriodAwarenessState,
  summary: string,
  signals: string[],
  priorRef: string,
  currentRef: string,
  confidence: number,
  now: number
): TemporalMemorySyncRecord {
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));
  return {
    syncId: buildSyncId(category, syncStrength),
    category,
    syncStrength,
    periodState,
    summary,
    crossPeriodSignals: dedupeSignals(signals),
    priorPeriodReference: priorRef,
    currentPeriodReference: currentRef,
    confidence: conf,
    confidenceLevel: confidenceToSyncLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildPeriodFingerprint(input: {
  temporalSig: string;
  driftSig: string;
  multiSig: string;
  convergenceSig: string;
  compressionSig: string;
  memorySig: string;
}): string {
  return stableSignature([
    "d9-3-8-period-fingerprint",
    input.temporalSig,
    input.driftSig,
    input.multiSig,
    input.convergenceSig,
    input.compressionSig,
    input.memorySig,
  ]);
}

function buildContinuitySync(
  priorFingerprint: string,
  currentFingerprint: string,
  priorRef: string,
  currentRef: string,
  continuityPreserved: boolean,
  now: number
): TemporalMemorySyncRecord | null {
  if (priorFingerprint === currentFingerprint) return null;
  if (!continuityPreserved) return null;

  return createSyncRecord(
    "continuity",
    "aligned",
    "synchronized",
    "Institutional temporal memory remains synchronized across evaluation periods with preserved continuity and stable cross-layer signatures.",
    [
      "period_continuity",
      "memory_alignment",
      "signature_stability",
      "cross_period_coherence",
    ],
    priorRef,
    currentRef,
    0.88,
    now
  );
}

function buildResilienceShiftSync(
  convergence: readonly StabilityConvergencePattern[],
  digests: readonly ExecutiveTemporalDigest[],
  maturityTrend: string | undefined,
  priorRef: string,
  currentRef: string,
  now: number
): TemporalMemorySyncRecord | null {
  const resilienceConvergence = convergence.some(
    (p) => p.category === "resilience_alignment" || p.category === "recovery_synchronization"
  );
  const resilienceDigest = digests.some((d) => d.category === "resilience" || d.category === "recovery");
  const improving = maturityTrend === "improving" || maturityTrend === "accelerating";
  if (!resilienceConvergence && !resilienceDigest && !improving) return null;

  return createSyncRecord(
    "resilience_shift",
    resilienceConvergence && improving ? "strong" : "moderate",
    "bridged",
    "Cross-period awareness detects resilience improvement as convergence and compressed evolution signals align across institutional periods.",
    [
      "resilience_improvement",
      "reduced_fragility_spread",
      "recovery_maturity",
      "adaptive_growth",
    ],
    priorRef,
    currentRef,
    resilienceConvergence ? 0.86 : 0.76,
    now
  );
}

function buildEscalationCycleSync(
  digests: readonly ExecutiveTemporalDigest[],
  projections: readonly TemporalDriftProjection[],
  priorRef: string,
  currentRef: string,
  now: number
): TemporalMemorySyncRecord | null {
  const escalationDigest = digests.filter((d) => d.category === "escalation").length;
  const unstableDrift = projections.filter(
    (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
  ).length;
  if (escalationDigest < 1 && unstableDrift < 1) return null;

  return createSyncRecord(
    "escalation_cycle",
    escalationDigest >= 2 ? "strong" : "moderate",
    "drifted",
    "Escalation cycles recur across institutional periods, indicating cross-period pressure concentration requiring executive awareness.",
    [
      "escalation_recurrence",
      "pressure_concentration",
      "instability_persistence",
      "cross_period_escalation",
    ],
    priorRef,
    currentRef,
    escalationDigest >= 2 ? 0.84 : 0.72,
    now
  );
}

function buildGovernanceEvolutionSync(
  convergence: readonly StabilityConvergencePattern[],
  continuityPreserved: boolean,
  priorRef: string,
  currentRef: string,
  now: number
): TemporalMemorySyncRecord | null {
  const govConvergence = convergence.some(
    (p) =>
      p.category === "governance_stabilization" || p.category === "adaptive_alignment"
  );
  if (!govConvergence && !continuityPreserved) return null;

  return createSyncRecord(
    "governance_evolution",
    govConvergence ? "strong" : "moderate",
    "synchronized",
    "Governance evolution synchronizes across periods as stabilization convergence and continuity preservation reinforce institutional oversight posture.",
    [
      "governance_stabilization",
      "oversight_continuity",
      "executive_alignment",
      "period_governance_sync",
    ],
    priorRef,
    currentRef,
    govConvergence ? 0.85 : 0.74,
    now
  );
}

function buildRecoveryProgressionSync(
  convergence: readonly StabilityConvergencePattern[],
  digests: readonly ExecutiveTemporalDigest[],
  priorRef: string,
  currentRef: string,
  now: number
): TemporalMemorySyncRecord | null {
  const recoverySignals =
    convergence.some((p) => p.category === "recovery_synchronization") ||
    digests.some((d) => d.category === "recovery");
  if (!recoverySignals) return null;

  return createSyncRecord(
    "recovery_progression",
    "moderate",
    "bridged",
    "Recovery progression advances across institutional periods as replay and convergence layers indicate maturing operational restoration.",
    [
      "recovery_progression",
      "operational_restoration",
      "maturity_bridge",
      "cross_period_recovery",
    ],
    priorRef,
    currentRef,
    0.8,
    now
  );
}

function buildOperationalShiftSync(
  projections: readonly TemporalDriftProjection[],
  priorFingerprint: string,
  currentFingerprint: string,
  priorRef: string,
  currentRef: string,
  now: number
): TemporalMemorySyncRecord | null {
  if (priorFingerprint === currentFingerprint) return null;
  const shifting = projections.some(
    (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
  );
  if (!shifting) return null;

  return createSyncRecord(
    "operational_shift",
    "moderate",
    "drifted",
    "Operational shift detected between periods as drift trajectories diverge from prior institutional temporal fingerprints.",
    [
      "operational_shift",
      "trajectory_divergence",
      "period_drift",
      "cross_layer_shift",
    ],
    priorRef,
    currentRef,
    0.77,
    now
  );
}

function buildStrategicCrossPeriodSync(
  digests: readonly ExecutiveTemporalDigest[],
  branchCount: number,
  priorRef: string,
  currentRef: string,
  now: number
): TemporalMemorySyncRecord | null {
  const strategic = digests.some((d) => d.category === "strategic" || d.compressionLevel === "executive_core");
  if (!strategic && branchCount < 2) return null;

  return createSyncRecord(
    "strategic",
    strategic ? "strong" : "moderate",
    "synchronized",
    "Strategic temporal memory synchronizes executive digests and divergence branches into a cross-period awareness layer for leadership review.",
    [
      "strategic_alignment",
      "executive_digest_sync",
      "cross_period_strategy",
      "leadership_awareness",
    ],
    priorRef,
    currentRef,
    strategic ? 0.87 : 0.75,
    now
  );
}

function rankSyncRecords(records: TemporalMemorySyncRecord[]): TemporalMemorySyncRecord[] {
  const strengthRank: Record<SyncStrength, number> = {
    aligned: 4,
    strong: 3,
    moderate: 2,
    weak: 1,
  };
  return [...records]
    .sort(
      (a, b) =>
        strengthRank[b.syncStrength] - strengthRank[a.syncStrength] ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildAwarenessSignals(
  records: TemporalMemorySyncRecord[],
  now: number
): CrossPeriodAwarenessSignal[] {
  return records.slice(0, 4).map((r) => ({
    signalId: stableSignature(["cross-period-signal", r.syncId]).slice(0, 48),
    category: r.category,
    syncStrength: r.syncStrength,
    summary: r.summary.slice(0, 120),
    confidence: r.confidence,
    generatedAt: now,
  }));
}

function buildPeriodBridges(
  records: TemporalMemorySyncRecord[],
  now: number
): OrganizationalPeriodBridge[] {
  if (records.length === 0) return [];
  const primary = records[0];
  return [
    {
      bridgeId: stableSignature([
        "period-bridge",
        primary.priorPeriodReference,
        primary.currentPeriodReference,
      ]).slice(0, 48),
      fromPeriodReference: primary.priorPeriodReference,
      toPeriodReference: primary.currentPeriodReference,
      bridgeSummary: `Cross-period bridge linking ${records.length} synchronized awareness records.`,
      linkedSyncIds: Object.freeze(records.map((r) => r.syncId)),
      generatedAt: now,
    },
  ];
}

function buildPeriodAlignments(
  records: TemporalMemorySyncRecord[],
  now: number
): TemporalPeriodAlignment[] {
  const byCategory = new Map<SyncCategory, TemporalMemorySyncRecord[]>();
  for (const r of records) {
    const list = byCategory.get(r.category) ?? [];
    list.push(r);
    byCategory.set(r.category, list);
  }
  return Array.from(byCategory.entries()).map(([category, group]) => ({
    alignmentId: stableSignature(["period-alignment", category]).slice(0, 48),
    category,
    alignmentLabel: `${category} alignment`,
    alignmentSummary: `${group.length} cross-period sync record(s) in ${category} category.`,
    syncIds: Object.freeze(group.map((r) => r.syncId)),
    generatedAt: now,
  }));
}

function buildSynchronizationSequences(
  records: TemporalMemorySyncRecord[],
  now: number
): PeriodSynchronizationSequence[] {
  return records.slice(0, 3).map((r) => ({
    sequenceId: stableSignature(["sync-sequence", r.syncId]).slice(0, 48),
    category: r.category,
    sequenceLabel: `${r.category} synchronization`,
    stepLabels: Object.freeze([
      `prior:${r.priorPeriodReference}`,
      `state:${r.periodState}`,
      `current:${r.currentPeriodReference}`,
      ...r.crossPeriodSignals.slice(0, 3),
    ]),
    generatedAt: now,
  }));
}

function buildSyncSnapshot(
  organizationId: string,
  records: TemporalMemorySyncRecord[],
  signals: CrossPeriodAwarenessSignal[],
  bridges: OrganizationalPeriodBridge[],
  alignments: TemporalPeriodAlignment[],
  sequences: PeriodSynchronizationSequence[],
  currentRef: string,
  priorRef: string | null,
  now: number
): InstitutionalTemporalSyncSnapshot {
  const dominant = records[0];
  const signature = stableSignature([
    "d9-3-8-institutional-temporal-sync",
    organizationId,
    records.map((r) => r.syncId),
    currentRef,
    priorRef ?? "none",
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    syncCount: records.length,
    periodSummary: dominant
      ? dominant.summary
      : "Cross-period institutional temporal memory synchronization pending sufficient period depth.",
    dominantCategory: dominant?.category ?? "unknown",
    dominantSyncStrength: dominant?.syncStrength ?? "weak",
    dominantPeriodState: dominant?.periodState ?? "current",
    currentPeriodReference: currentRef,
    priorPeriodReference: priorRef,
    recentSyncRecords: Object.freeze(records),
    awarenessSignals: Object.freeze(signals),
    periodBridges: Object.freeze(bridges),
    periodAlignments: Object.freeze(alignments),
    synchronizationSequences: Object.freeze(sequences),
  };
}

/**
 * D9:3:8 — Passive institutional temporal memory synchronization + cross-period awareness.
 */
export function evaluateInstitutionalTemporalMemorySync(
  input: TemporalMemorySyncInput
): TemporalMemorySyncResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getTemporalMemorySyncStore(organizationId);

  if (!beginTemporalMemorySyncEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newSyncRecords: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const multiState = getMultiTimelineStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();
    const compressionState = getTemporalCompressionStore(organizationId).getState();

    const temporalSnapshot = input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const multiSnapshot = input.multiTimelineSnapshot ?? multiState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;
    const compressionSnapshot =
      input.compressionSnapshot ?? compressionState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-8-sync-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? temporalState.signature,
      driftSnapshot?.signature ?? driftState.signature,
      multiSnapshot?.signature ?? multiState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      compressionSnapshot?.signature ?? compressionState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
      input.maturitySnapshot?.signature ?? "no-maturity",
    ]);

    if (
      !shouldEvaluateTemporalMemorySync(
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
        newSyncRecords: 0,
        storeSignature: prior.signature,
      };
    }

    const currentFingerprint = buildPeriodFingerprint({
      temporalSig: temporalSnapshot?.signature ?? temporalState.signature,
      driftSig: driftSnapshot?.signature ?? driftState.signature,
      multiSig: multiSnapshot?.signature ?? multiState.signature,
      convergenceSig: convergenceSnapshot?.signature ?? convergenceState.signature,
      compressionSig: compressionSnapshot?.signature ?? compressionState.signature,
      memorySig: input.memorySnapshot?.signature ?? "no-memory",
    });

    const priorFingerprintEntry = prior.periodFingerprints[0] ?? null;
    const priorFingerprint = priorFingerprintEntry?.fingerprint ?? null;
    const currentRef = periodReference(currentFingerprint);
    const priorRef = priorFingerprint
      ? periodReference(priorFingerprint)
      : priorFingerprintEntry?.reference ?? "institutional_baseline";

    const layerDepth =
      (compressionSnapshot?.digestCount ?? compressionState.digests.length) +
      (convergenceSnapshot?.convergenceCount ?? convergenceState.patterns.length) +
      (temporalSnapshot?.sequenceCount ?? temporalState.sequences.length) +
      prior.periodFingerprints.length;

    if (layerDepth < 4 || !priorFingerprint) {
      store.recordPeriodFingerprint(currentRef, currentFingerprint, now);
      store.setLastEvaluationSignature(evaluationSignature);
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_cross_period_depth",
        snapshot: prior.snapshots[0] ?? null,
        newSyncRecords: 0,
        storeSignature: store.getState().signature,
      };
    }

    const digests =
      compressionSnapshot?.recentDigests ?? compressionState.digests;
    const convergence =
      convergenceSnapshot?.recentConvergencePatterns ?? convergenceState.patterns;
    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const maturityTrend = input.maturitySnapshot?.dominantEvolutionTrend;

    const candidates: TemporalMemorySyncRecord[] = [];

    const continuity = buildContinuitySync(
      priorFingerprint,
      currentFingerprint,
      priorRef,
      currentRef,
      input.continuityPreserved ?? true,
      now
    );
    if (continuity) candidates.push(continuity);

    const resilience = buildResilienceShiftSync(
      convergence,
      digests,
      maturityTrend,
      priorRef,
      currentRef,
      now
    );
    if (resilience) candidates.push(resilience);

    const escalation = buildEscalationCycleSync(
      digests,
      projections,
      priorRef,
      currentRef,
      now
    );
    if (escalation) candidates.push(escalation);

    const governance = buildGovernanceEvolutionSync(
      convergence,
      input.continuityPreserved ?? true,
      priorRef,
      currentRef,
      now
    );
    if (governance) candidates.push(governance);

    const recovery = buildRecoveryProgressionSync(
      convergence,
      digests,
      priorRef,
      currentRef,
      now
    );
    if (recovery) candidates.push(recovery);

    const operational = buildOperationalShiftSync(
      projections,
      priorFingerprint,
      currentFingerprint,
      priorRef,
      currentRef,
      now
    );
    if (operational) candidates.push(operational);

    const strategic = buildStrategicCrossPeriodSync(
      digests,
      multiSnapshot?.branchCount ?? multiState.branches.length,
      priorRef,
      currentRef,
      now
    );
    if (strategic) candidates.push(strategic);

    const retained = rankSyncRecords(candidates.filter(shouldRetainSyncRecord));
    store.recordPeriodFingerprint(currentRef, currentFingerprint, now);

    if (retained.length === 0) {
      store.setLastEvaluationSignature(evaluationSignature);
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_sync_records",
        snapshot: prior.snapshots[0] ?? null,
        newSyncRecords: 0,
        storeSignature: store.getState().signature,
      };
    }

    const priorIds = new Set(prior.syncRecords.map((r) => r.syncId));
    const newCount = retained.filter((r) => !priorIds.has(r.syncId)).length;

    store.upsertSyncRecords(retained, now);

    const awarenessSignals = buildAwarenessSignals(retained, now);
    store.upsertAwarenessSignals(awarenessSignals, now);

    const bridges = buildPeriodBridges(retained, now);
    store.upsertPeriodBridges(bridges, now);

    const alignments = buildPeriodAlignments(retained, now);
    store.upsertPeriodAlignments(alignments, now);

    const sequences = buildSynchronizationSequences(retained, now);
    store.upsertSequences(sequences, now);

    const snapshot = buildSyncSnapshot(
      organizationId,
      retained,
      awarenessSignals,
      bridges,
      alignments,
      sequences,
      currentRef,
      priorRef,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.length >= 2) {
      devLog(
        `cross-period sync — ${retained.length} records at ${snapshot.dominantPeriodState} (${snapshot.dominantCategory})`
      );
    }
    if (resilience) {
      devLog(`resilience shift — ${resilience.crossPeriodSignals[0]}`);
    }
    if (governance) {
      devLog(`governance evolution sync — ${governance.syncStrength}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newSyncRecords: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTemporalMemorySyncEvaluation();
  }
}
