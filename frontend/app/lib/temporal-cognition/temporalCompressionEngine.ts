import { stableSignature } from "../intelligence/shared/dedupe";
import { getCausalDependencyStore } from "./causalDependencyStore";
import {
  beginTemporalCompressionEvaluation,
  endTemporalCompressionEvaluation,
  shouldEvaluateTemporalCompression,
  shouldRetainExecutiveDigest,
} from "./temporalCompressionGuards";
import { getTemporalCompressionStore } from "./temporalCompressionStore";
import { getTemporalConvergenceStore } from "./temporalConvergenceStore";
import { getMultiTimelineStore } from "./multiTimelineStore";
import { getOperationalReplayStore } from "./operationalReplayStore";
import { getTemporalDriftProjectionStore } from "./temporalDriftProjectionStore";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  CompressionLevel,
  EvolutionDistillationSignal,
  ExecutiveTemporalDigest,
  OrganizationalEvolutionSummary,
  StrategicTemporalCompressionInput,
  StrategicTemporalCompressionResult,
  StrategicTimelineCompression,
  SummaryCategory,
  TemporalAbstractionLayer,
  TemporalCompressionSnapshot,
  TimelineAbstractionState,
} from "./temporalCompressionTypes";
import type { StabilityConvergencePattern } from "./temporalConvergenceTypes";
import type { TemporalDriftProjection } from "./temporalDriftProjectionTypes";
import type { StrategicTimelineSequence } from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][TemporalCompression]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildCompressionId(category: SummaryCategory, level: CompressionLevel): string {
  return stableSignature(["executive-temporal-digest", category, level]).slice(0, 56);
}

function dedupeSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function inferCompressionLevel(signalCount: number, layerDepth: number): CompressionLevel {
  if (layerDepth >= 12 && signalCount >= 4) return "executive_core";
  if (layerDepth >= 8 && signalCount >= 3) return "distilled";
  if (layerDepth >= 5) return "condensed";
  if (signalCount >= 2) return "summarized";
  return "raw";
}

function inferAbstractionState(level: CompressionLevel): TimelineAbstractionState {
  if (level === "executive_core") return "executive_ready";
  if (level === "distilled") return "distilled";
  if (level === "condensed") return "condensed";
  if (level === "summarized") return "organized";
  return "fragmented";
}

function createDigest(
  category: SummaryCategory,
  summary: string,
  signals: string[],
  confidence: number,
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest {
  const distilledSignals = dedupeSignals(signals);
  const compressionLevel = inferCompressionLevel(distilledSignals.length, layerDepth);
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));

  return {
    compressionId: buildCompressionId(category, compressionLevel),
    category,
    compressionLevel,
    abstractionState: inferAbstractionState(compressionLevel),
    summary,
    distilledSignals,
    confidence: conf,
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildInstabilityDigest(
  sequences: readonly StrategicTimelineSequence[],
  projections: readonly TemporalDriftProjection[],
  eventCount: number,
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  const cyclical = sequences.filter(
    (s) => s.sequenceType === "cyclical" || s.sequenceType === "recurring"
  ).length;
  const escalating = projections.filter(
    (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
  ).length;
  if (cyclical < 1 && escalating < 1 && eventCount < 4) return null;

  return createDigest(
    "escalation",
    "Repeated escalation and instability cycles compress into a distilled pattern of organizational pressure concentration and cross-system propagation risk.",
    [
      "repeated_escalation_cycles",
      "instability_recurrence",
      "pressure_concentration",
      "cascade_risk",
    ],
    cyclical >= 2 ? 0.86 : 0.78,
    layerDepth,
    now
  );
}

function buildResilienceEvolutionDigest(
  convergence: readonly StabilityConvergencePattern[],
  projections: readonly TemporalDriftProjection[],
  maturityTrend: string | undefined,
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  const resilient =
    convergence.some((c) => c.category === "resilience_alignment") ||
    projections.some(
      (p) => p.trajectoryDirection === "adaptive_growth" || p.trajectoryDirection === "recovering"
    ) ||
    maturityTrend === "improving" ||
    maturityTrend === "accelerating";
  if (!resilient) return null;

  return createDigest(
    "resilience",
    "Over time, the organization demonstrates gradual resilience maturation through governance stabilization, reduced escalation propagation, and improved operational recovery consistency.",
    [
      "reduced_fragility_growth",
      "faster_recovery",
      "stabilized_coordination",
      "pressure_decay",
    ],
    maturityTrend === "accelerating" ? 0.92 : 0.88,
    layerDepth,
    now
  );
}

function buildGovernanceTimelineDigest(
  convergence: readonly StabilityConvergencePattern[],
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  const gov = convergence.filter((c) => c.category === "governance_stabilization");
  if (gov.length === 0) return null;

  const signals = dedupeSignals(gov.flatMap((c) => [...c.convergenceSignals]));
  return createDigest(
    "governance",
    "Governance stabilization progression compresses into a strategic timeline of executive alignment, pressure containment, and institutional coordination maturity.",
    signals.length >= 2
      ? [...signals]
      : ["governance_alignment", "pressure_containment", "executive_stability"],
    gov[0]!.confidence,
    layerDepth,
    now
  );
}

function buildFragilityReductionDigest(
  convergence: readonly StabilityConvergencePattern[],
  projections: readonly TemporalDriftProjection[],
  fragilityElevated: boolean,
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  if (fragilityElevated) return null;
  const reducing =
    convergence.some((c) => c.category === "fragility_reduction") ||
    !projections.some((p) => p.trajectoryDirection === "fragile");
  if (!reducing) return null;

  return createDigest(
    "fragility",
    "Reduced pressure propagation over time distills into a fragility reduction evolution summary across the enterprise operational chronology.",
    ["pressure_spread_weakening", "fragility_containment", "stability_momentum"],
    0.82,
    layerDepth,
    now
  );
}

function buildRecoveryMaturityDigest(
  convergence: readonly StabilityConvergencePattern[],
  replays: readonly { replayState: string }[],
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  const recovery =
    convergence.some((c) => c.category === "recovery_synchronization") ||
    replays.some((r) => r.replayState === "recovering" || r.replayState === "resolved");
  if (!recovery) return null;

  return createDigest(
    "recovery",
    "Repeated recovery acceleration patterns compress into an adaptive operational maturity digest reflecting intervention consistency and restoration momentum.",
    ["recovery_acceleration", "intervention_consistency", "restoration_momentum"],
    0.85,
    layerDepth,
    now
  );
}

function buildExecutiveStabilityDigest(
  convergence: readonly StabilityConvergencePattern[],
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  if (convergence.length < 2) return null;

  const signals = dedupeSignals(convergence.flatMap((c) => [...c.convergenceSignals]));
  if (signals.length < 2) return null;

  const digest = createDigest(
    "strategic",
    "Multi-system stabilization convergence compresses into an executive stability alignment summary spanning resilience, governance, and operational synchronization.",
    [...signals, "enterprise_stability_alignment", "cross_system_convergence"],
    Number(
      (convergence.reduce((s, c) => s + c.confidence, 0) / convergence.length + 0.04).toFixed(2)
    ),
    layerDepth + convergence.length,
    now
  );

  return {
    ...digest,
    compressionLevel: "executive_core",
    abstractionState: "executive_ready",
    compressionId: buildCompressionId("strategic", "executive_core"),
  };
}

function buildOperationalDigest(
  sequences: readonly StrategicTimelineSequence[],
  memoryCount: number,
  layerDepth: number,
  now: number
): ExecutiveTemporalDigest | null {
  if (sequences.length < 2 && memoryCount < 3) return null;

  const steps = dedupeSignals(
    sequences.flatMap((s) => [...s.events]).slice(0, 6)
  );
  if (steps.length < 2) return null;

  return createDigest(
    "operational",
    "Operational progression sequences compress into a concise chronology of enterprise adaptation across institutional memory and temporal layers.",
    [...steps],
    0.76,
    layerDepth,
    now
  );
}

function buildTimelineCompressions(
  sequences: readonly StrategicTimelineSequence[],
  digests: ExecutiveTemporalDigest[],
  now: number
): StrategicTimelineCompression[] {
  return sequences.slice(0, 4).map((seq) => ({
    compressionKey: stableSignature(["timeline-compression", seq.timelineId]).slice(0, 48),
    category: (seq.category === "unknown" ? "operational" : seq.category) as SummaryCategory,
    timelineLabel: `${seq.category}_timeline`,
    compressedSteps: Object.freeze(seq.events.slice(0, 6)),
    sourceEventCount: seq.events.length,
    generatedAt: now,
  }));
}

function buildEvolutionSummaries(
  digests: ExecutiveTemporalDigest[],
  now: number
): OrganizationalEvolutionSummary[] {
  return digests.slice(0, 5).map((d) => ({
    summaryId: stableSignature(["evolution-summary", d.compressionId]).slice(0, 48),
    category: d.category,
    evolutionHeadline: `${d.category.replace(/_/g, " ")} evolution`,
    narrative: d.summary.slice(0, 220),
    linkedCompressionIds: Object.freeze([d.compressionId]),
    compressionLevel: d.compressionLevel,
    generatedAt: now,
  }));
}

function buildDistillationSignals(
  digests: ExecutiveTemporalDigest[],
  now: number
): EvolutionDistillationSignal[] {
  return digests.slice(0, 5).map((d) => ({
    signalId: stableSignature(["distillation-signal", d.compressionId]).slice(0, 48),
    category: d.category,
    label: `${d.category}_distillation`,
    summary: d.summary.slice(0, 120),
    confidence: d.confidence,
    generatedAt: now,
  }));
}

function buildAbstractionLayer(
  digests: ExecutiveTemporalDigest[],
  now: number
): TemporalAbstractionLayer | null {
  if (digests.length === 0) return null;
  const top = digests[0]!;
  return {
    layerId: stableSignature(["abstraction-layer", top.abstractionState]).slice(0, 48),
    abstractionState: top.abstractionState,
    layerSummary: `Temporal abstraction at ${top.abstractionState} with ${digests.length} executive digests.`,
    digestIds: Object.freeze(digests.slice(0, 6).map((d) => d.compressionId)),
    generatedAt: now,
  };
}

function buildCompressionSnapshot(
  organizationId: string,
  digests: ExecutiveTemporalDigest[],
  summaries: OrganizationalEvolutionSummary[],
  timelines: StrategicTimelineCompression[],
  signals: EvolutionDistillationSignal[],
  layers: TemporalAbstractionLayer[],
  now: number
): TemporalCompressionSnapshot {
  const dominant = digests[0];
  const signature = stableSignature([
    "d9-3-7-compression-snapshot",
    organizationId,
    digests.length,
    dominant?.compressionId ?? "none",
    dominant?.compressionLevel ?? "raw",
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    digestCount: digests.length,
    compressionSummary:
      dominant?.summary ??
      "Executive temporal compression awaiting sufficient organizational evolution depth.",
    dominantCategory: dominant?.category ?? "unknown",
    dominantCompressionLevel: dominant?.compressionLevel ?? "summarized",
    dominantAbstractionState: dominant?.abstractionState ?? "organized",
    recentDigests: Object.freeze(digests.slice(0, 6)),
    evolutionSummaries: Object.freeze(summaries),
    timelineCompressions: Object.freeze(timelines),
    distillationSignals: Object.freeze(signals),
    abstractionLayers: Object.freeze(layers),
  };
}

function rankDigests(digests: ExecutiveTemporalDigest[]): ExecutiveTemporalDigest[] {
  const levelOrder: CompressionLevel[] = [
    "executive_core",
    "distilled",
    "condensed",
    "summarized",
    "raw",
  ];
  return [...digests].sort((a, b) => {
    const levelDiff =
      levelOrder.indexOf(a.compressionLevel) - levelOrder.indexOf(b.compressionLevel);
    if (levelDiff !== 0) return levelDiff;
    return b.confidence - a.confidence;
  });
}

export function evaluateStrategicTemporalCompression(
  input: StrategicTemporalCompressionInput
): StrategicTemporalCompressionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginTemporalCompressionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_compression_guard",
      snapshot: null,
      newDigests: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getTemporalCompressionStore(organizationId);
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const causalState = getCausalDependencyStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();
    const multiState = getMultiTimelineStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();

    const temporalSnapshot = input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;
    const multiSnapshot = input.multiTimelineSnapshot ?? multiState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-7-compression-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? temporalState.signature,
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      multiSnapshot?.signature ?? multiState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
      input.maturitySnapshot?.signature ?? "no-maturity",
    ]);

    if (
      !shouldEvaluateTemporalCompression(
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
        newDigests: 0,
        storeSignature: prior.signature,
      };
    }

    const sequences = temporalSnapshot?.recentSequences ?? temporalState.sequences;
    const events = temporalSnapshot?.recentEvents ?? temporalState.events;
    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const convergence =
      convergenceSnapshot?.recentConvergencePatterns ?? convergenceState.patterns;
    const memoryCount = input.memorySnapshot?.memoryCount ?? 0;
    const maturityTrend = input.maturitySnapshot?.dominantEvolutionTrend;

    const layerDepth =
      sequences.length +
      events.length +
      projections.length +
      replays.length +
      convergence.length +
      (multiSnapshot?.branchCount ?? multiState.branches.length) +
      causalState.chains.length;

    if (layerDepth < 5) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_compression_depth",
        snapshot: prior.snapshots[0] ?? null,
        newDigests: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: ExecutiveTemporalDigest[] = [];

    const instability = buildInstabilityDigest(
      sequences,
      projections,
      events.length,
      layerDepth,
      now
    );
    if (instability) candidates.push(instability);

    const resilience = buildResilienceEvolutionDigest(
      convergence,
      projections,
      maturityTrend,
      layerDepth,
      now
    );
    if (resilience) candidates.push(resilience);

    const governance = buildGovernanceTimelineDigest(convergence, layerDepth, now);
    if (governance) candidates.push(governance);

    const fragility = buildFragilityReductionDigest(
      convergence,
      projections,
      input.fragilityElevated ?? false,
      layerDepth,
      now
    );
    if (fragility) candidates.push(fragility);

    const recovery = buildRecoveryMaturityDigest(convergence, replays, layerDepth, now);
    if (recovery) candidates.push(recovery);

    const executive = buildExecutiveStabilityDigest(convergence, layerDepth, now);
    if (executive) candidates.push(executive);

    const operational = buildOperationalDigest(sequences, memoryCount, layerDepth, now);
    if (operational) candidates.push(operational);

    const retained = rankDigests(candidates.filter(shouldRetainExecutiveDigest));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_digests",
        snapshot: prior.snapshots[0] ?? null,
        newDigests: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.digests.map((d) => d.compressionId));
    const newCount = retained.filter((d) => !priorIds.has(d.compressionId)).length;

    store.upsertDigests(retained, now);

    const summaries = buildEvolutionSummaries(retained, now);
    store.upsertSummaries(summaries, now);

    const timelines = buildTimelineCompressions(sequences, retained, now);
    store.upsertTimelineCompressions(timelines, now);

    const distillationSignals = buildDistillationSignals(retained, now);
    store.upsertSignals(distillationSignals, now);

    const abstractionLayer = buildAbstractionLayer(retained, now);
    const layers = abstractionLayer ? [abstractionLayer] : [];
    store.upsertAbstractionLayers(layers, now);

    const snapshot = buildCompressionSnapshot(
      organizationId,
      retained,
      summaries,
      timelines,
      distillationSignals,
      layers,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.length >= 2) {
      devLog(`timeline compression — ${retained.length} executive digests at ${snapshot.dominantAbstractionState}`);
    }
    if (resilience) {
      devLog(`executive digest — resilience: ${resilience.summary.slice(0, 72)}`);
    }
    if (executive) {
      devLog(`strategic evolution distillation — ${executive.compressionLevel}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newDigests: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTemporalCompressionEvaluation();
  }
}
