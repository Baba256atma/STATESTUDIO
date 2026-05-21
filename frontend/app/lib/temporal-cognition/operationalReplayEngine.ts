import { stableSignature } from "../intelligence/shared/dedupe";
import { getInstitutionalRecallStore } from "../institutional-memory/institutionalRecallStore";
import { getCausalDependencyStore } from "./causalDependencyStore";
import type { DependencyCategory, OperationalCausalChain } from "./causalDependencyTypes";
import {
  beginOperationalReplayEvaluation,
  confidenceToReplayLevel,
  endOperationalReplayEvaluation,
  shouldEvaluateOperationalReplay,
  shouldRetainReplaySequence,
} from "./operationalReplayGuards";
import { getOperationalReplayStore } from "./operationalReplayStore";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  EnterpriseReplayFrame,
  HistoricalScenarioReconstruction,
  OperationalReplayCognitionInput,
  OperationalReplayCognitionResult,
  OperationalReplaySequence,
  OrganizationalReplaySnapshot,
  ReplayCategory,
  ReplayProgressionState,
  StrategicReplayEvent,
} from "./operationalReplayTypes";
import type {
  OrganizationalTimelineEvent,
  StrategicTimelineSequence,
  TimelineCategory,
} from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][OperationalReplay]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function toReplayCategory(category: TimelineCategory | DependencyCategory): ReplayCategory {
  if (category === "unknown") return "unknown";
  return category;
}

function buildReplayId(category: ReplayCategory, steps: string[]): string {
  return stableSignature(["operational-replay", category, ...steps.slice(0, 4)]).slice(0, 56);
}

function inferReplayState(
  category: ReplayCategory,
  hasRecovery: boolean,
  hasGovernance: boolean,
  cascading: boolean,
  runtimeRecovering: boolean
): ReplayProgressionState {
  if (hasRecovery && hasGovernance) return "resolved";
  if (runtimeRecovering || (hasRecovery && category === "recovery")) return "recovering";
  if (hasGovernance && !cascading) return "stabilizing";
  if (cascading || category === "escalation") return "propagating";
  if (category === "fragility") return "destabilizing";
  if (hasRecovery) return "recovering";
  return "developing";
}

function mergeSequenceSteps(
  temporalSteps: readonly string[],
  causalSteps: readonly string[],
  tailSteps: readonly string[] = []
): readonly string[] {
  return Object.freeze(
    Array.from(new Set([...temporalSteps, ...causalSteps, ...tailSteps])).slice(0, 8)
  );
}

function buildEscalationReplay(
  sequences: readonly StrategicTimelineSequence[],
  chains: readonly OperationalCausalChain[],
  events: readonly OrganizationalTimelineEvent[],
  now: number
): OperationalReplaySequence | null {
  const escalationSeq = sequences.find((s) => s.category === "escalation");
  const escalationChain = chains.find((c) => c.category === "escalation");
  if (!escalationSeq && !escalationChain && events.every((e) => e.category !== "escalation")) {
    return null;
  }

  const replaySequence = mergeSequenceSteps(
    escalationSeq?.events ?? [],
    escalationChain?.chain ?? [],
    Object.freeze([
      "fragility_accumulation",
      "pressure_growth",
      "coordination_instability",
      "escalation_spread",
    ])
  );

  const hasGovernance = events.some((e) => e.category === "governance");
  const hasRecovery = events.some((e) => e.category === "recovery" || e.category === "resilience");
  const tail = hasGovernance
    ? hasRecovery
      ? Object.freeze(["governance_stabilization", "recovery_acceleration"])
      : Object.freeze(["governance_stabilization"])
    : [];

  const fullSequence = mergeSequenceSteps(replaySequence, [], tail);
  const cascading =
    escalationSeq?.sequenceType === "cascading" || escalationChain?.propagationType === "cascading";

  const confidence = Number(
    Math.min(
      0.94,
      Math.max(escalationSeq?.confidence ?? 0, escalationChain?.confidence ?? 0, 0.82) + 0.04
    ).toFixed(2)
  );

  const replayState = inferReplayState(
    "escalation",
    hasRecovery,
    hasGovernance,
    cascading,
    false
  );

  return {
    replayId: buildReplayId("escalation", [...fullSequence]),
    replayCategory: "escalation",
    replayState,
    summary:
      "Operational fragility accumulated gradually before escalating across dependent systems due to delayed governance stabilization and coordination degradation.",
    replaySequence: fullSequence,
    linkedTimelineIds: Object.freeze(
      escalationSeq ? [escalationSeq.timelineId] : []
    ),
    linkedCausalChainIds: Object.freeze(
      escalationChain ? [escalationChain.causalChainId] : []
    ),
    confidence,
    confidenceLevel: confidenceToReplayLevel(confidence),
    generatedAt: now,
    lastObservedAt: escalationSeq?.lastObservedAt ?? escalationChain?.lastObservedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildGovernanceFailureReplay(
  chains: readonly OperationalCausalChain[],
  continuityPreserved: boolean,
  now: number
): OperationalReplaySequence | null {
  const govChain = chains.find((c) => c.category === "governance");
  if (!govChain && continuityPreserved) return null;

  const replaySequence = mergeSequenceSteps(
    govChain?.chain ?? [],
    [],
    Object.freeze(["governance_delay", "pressure_amplification", "coordination_degradation"])
  );

  const confidence = govChain?.confidence ?? 0.78;
  return {
    replayId: buildReplayId("governance", [...replaySequence]),
    replayCategory: "governance",
    replayState: continuityPreserved ? "developing" : "destabilizing",
    summary:
      "Governance delay amplified pressure before coordination could stabilize, replaying the historical governance failure progression sequence.",
    replaySequence,
    linkedTimelineIds: Object.freeze([]),
    linkedCausalChainIds: Object.freeze(govChain ? [govChain.causalChainId] : []),
    confidence,
    confidenceLevel: confidenceToReplayLevel(confidence),
    generatedAt: now,
    lastObservedAt: govChain?.lastObservedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildResilienceRecoveryReplay(
  chains: readonly OperationalCausalChain[],
  sequences: readonly StrategicTimelineSequence[],
  now: number
): OperationalReplaySequence | null {
  const resilienceChain = chains.find(
    (c) => c.category === "resilience" || c.category === "recovery"
  );
  const recoverySeq = sequences.find(
    (s) => s.category === "recovery" || s.category === "resilience"
  );
  if (!resilienceChain && !recoverySeq) return null;

  const replaySequence = mergeSequenceSteps(
    recoverySeq?.events ?? [],
    resilienceChain?.chain ?? [],
    Object.freeze([
      "coordination_stabilization",
      "governance_alignment",
      "recovery_acceleration",
    ])
  );

  const confidence = Number(
    Math.min(0.94, Math.max(resilienceChain?.confidence ?? 0, recoverySeq?.confidence ?? 0, 0.85)).toFixed(
      2
    )
  );

  return {
    replayId: buildReplayId("resilience", [...replaySequence]),
    replayCategory: "resilience",
    replayState: "recovering",
    summary:
      "Coordination stabilization preceded recovery acceleration, replaying the resilience recovery path across historical organizational progression.",
    replaySequence,
    linkedTimelineIds: Object.freeze(recoverySeq ? [recoverySeq.timelineId] : []),
    linkedCausalChainIds: Object.freeze(resilienceChain ? [resilienceChain.causalChainId] : []),
    confidence,
    confidenceLevel: confidenceToReplayLevel(confidence),
    generatedAt: now,
    lastObservedAt: recoverySeq?.lastObservedAt ?? resilienceChain?.lastObservedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildCascadingDegradationReplay(
  sequences: readonly StrategicTimelineSequence[],
  now: number
): OperationalReplaySequence | null {
  const cyclical = sequences.find(
    (s) => s.sequenceType === "cyclical" || s.sequenceType === "cascading"
  );
  if (!cyclical) return null;

  const replaySequence = mergeSequenceSteps(cyclical.events, [], [
    "systemic_instability",
    "dependency_propagation",
    "operational_degradation",
  ]);

  const confidence = cyclical.confidence;
  return {
    replayId: buildReplayId("operational", [...replaySequence]),
    replayCategory: "operational",
    replayState: cyclical.sequenceType === "cyclical" ? "propagating" : "destabilizing",
    summary:
      "Cascading operational degradation replayed as systemic instability propagation across connected organizational systems.",
    replaySequence,
    linkedTimelineIds: Object.freeze([cyclical.timelineId]),
    linkedCausalChainIds: Object.freeze([]),
    confidence,
    confidenceLevel: confidenceToReplayLevel(confidence),
    generatedAt: now,
    lastObservedAt: cyclical.lastObservedAt,
    occurrenceCount: cyclical.occurrenceCount,
  };
}

function buildAdaptationStabilizationReplay(
  chains: readonly OperationalCausalChain[],
  now: number
): OperationalReplaySequence | null {
  const recoveryChain = chains.find((c) => c.category === "recovery");
  if (!recoveryChain) return null;

  const replaySequence = mergeSequenceSteps(recoveryChain.chain, [], [
    "recovery_intervention",
    "fragility_reduction",
    "resilience_strengthening",
  ]);

  return {
    replayId: buildReplayId("recovery", [...replaySequence]),
    replayCategory: "recovery",
    replayState: "resolved",
    summary:
      "Recovery interventions reduced fragility over time, replaying the adaptation stabilization sequence from intervention through resilience strengthening.",
    replaySequence,
    linkedTimelineIds: Object.freeze([]),
    linkedCausalChainIds: Object.freeze([recoveryChain.causalChainId]),
    confidence: recoveryChain.confidence,
    confidenceLevel: confidenceToReplayLevel(recoveryChain.confidence),
    generatedAt: now,
    lastObservedAt: recoveryChain.lastObservedAt,
    occurrenceCount: 1,
  };
}

function buildRecallInformedReplay(
  recallTitles: readonly string[],
  recallCategories: readonly string[],
  now: number
): OperationalReplaySequence | null {
  if (recallTitles.length === 0) return null;

  const category = toReplayCategory(
    (recallCategories.find((c) => c !== "unknown") ?? "strategic") as ReplayCategory
  );
  const replaySequence = Object.freeze(
    recallTitles.slice(0, 4).map((t) => t.replace(/\s+/g, "_").toLowerCase().slice(0, 40))
  );

  if (replaySequence.length < 2) return null;

  const confidence = 0.72;
  return {
    replayId: buildReplayId(category, [...replaySequence]),
    replayCategory: category,
    replayState: "initiated",
    summary: `Historical recall reconstructed ${replaySequence.length} strategic progression steps from institutional memory parallels.`,
    replaySequence,
    linkedTimelineIds: Object.freeze([]),
    linkedCausalChainIds: Object.freeze([]),
    confidence,
    confidenceLevel: confidenceToReplayLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildScenarios(
  replays: OperationalReplaySequence[],
  now: number
): HistoricalScenarioReconstruction[] {
  return replays.slice(0, 4).map((replay) => ({
    scenarioId: stableSignature(["replay-scenario", replay.replayId]).slice(0, 48),
    replayCategory: replay.replayCategory,
    scenarioTitle: `${replay.replayCategory}_historical_scenario`,
    narrative: replay.summary.slice(0, 200),
    replayIds: Object.freeze([replay.replayId]),
    firstObservedAt: replay.generatedAt,
    lastObservedAt: replay.lastObservedAt,
    generatedAt: now,
  }));
}

function buildReplayFrames(
  replays: OperationalReplaySequence[],
  now: number
): EnterpriseReplayFrame[] {
  return replays.slice(0, 4).map((replay) => ({
    frameId: stableSignature(["replay-frame", replay.replayId]).slice(0, 48),
    replayCategory: replay.replayCategory,
    frameLabel: `${replay.replayCategory}_progression_frame`,
    progressionSummary: replay.summary.slice(0, 160),
    replayIds: Object.freeze([replay.replayId]),
    sequenceStepCount: replay.replaySequence.length,
    generatedAt: now,
  }));
}

function buildStrategicReplayEvents(
  replays: OperationalReplaySequence[],
  events: readonly OrganizationalTimelineEvent[],
  now: number
): StrategicReplayEvent[] {
  const strategic: StrategicReplayEvent[] = [];
  for (const replay of replays.slice(0, 3)) {
    for (let i = 0; i < replay.replaySequence.length; i += 1) {
      const label = replay.replaySequence[i]!;
      strategic.push({
        eventId: stableSignature(["replay-event", replay.replayId, label, i]).slice(0, 48),
        replayCategory: replay.replayCategory,
        eventLabel: label,
        progressionLabel: `${replay.replayState}_step_${i + 1}`,
        replayId: replay.replayId,
        observedAt: events[i]?.observedAt ?? now + i,
      });
    }
  }
  return strategic.slice(0, 16);
}

function buildReplaySnapshot(
  organizationId: string,
  replays: OperationalReplaySequence[],
  scenarios: HistoricalScenarioReconstruction[],
  frames: EnterpriseReplayFrame[],
  strategicEvents: StrategicReplayEvent[],
  now: number
): OrganizationalReplaySnapshot {
  const dominantCategories = Object.freeze(
    [...new Set(replays.map((r) => r.replayCategory))].slice(0, 4) as ReplayCategory[]
  );
  const dominantReplayState =
    replays.find((r) => r.replayState === "resolved")?.replayState ??
    replays.find((r) => r.replayState === "recovering")?.replayState ??
    replays[0]?.replayState ??
    "initiated";

  const replaySummary =
    replays[0]?.summary ??
    "Enterprise operational replay cognition awaiting sufficient temporal and causal chronology depth.";

  const signature = stableSignature([
    "d9-3-3-replay-snapshot",
    organizationId,
    replays.length,
    scenarios.length,
    replays[0]?.replayId ?? "none",
    dominantReplayState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    replayCount: replays.length,
    scenarioCount: scenarios.length,
    replaySummary,
    dominantCategories,
    dominantReplayState,
    recentReplays: Object.freeze(replays.slice(0, 6)),
    reconstructedScenarios: Object.freeze(scenarios),
    replayFrames: Object.freeze(frames),
    strategicEvents: Object.freeze(strategicEvents),
  };
}

export function evaluateOperationalReplayCognition(
  input: OperationalReplayCognitionInput
): OperationalReplayCognitionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginOperationalReplayEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_replay_guard",
      snapshot: null,
      newReplays: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getOperationalReplayStore(organizationId);
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const causalState = getCausalDependencyStore(organizationId).getState();
    const recallState = getInstitutionalRecallStore(organizationId).getState();

    const temporalSnapshot = input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const causalSnapshot = input.causalSnapshot ?? causalState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-3-replay-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? temporalState.signature,
      causalSnapshot?.signature ?? causalState.signature,
      input.recallSnapshot?.signature ?? recallState.signature,
      input.fragilityElevated ? "fragile" : "stable",
    ]);

    if (
      !shouldEvaluateOperationalReplay(
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
        newReplays: 0,
        storeSignature: prior.signature,
      };
    }

    const events = temporalSnapshot?.recentEvents ?? temporalState.events;
    const sequences = temporalSnapshot?.recentSequences ?? temporalState.sequences;
    const chains = causalSnapshot?.recentChains ?? causalState.chains;

    const replayDepth =
      events.length + sequences.length + chains.length + recallState.recalls.length;

    if (replayDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_replay_depth",
        snapshot: prior.snapshots[0] ?? null,
        newReplays: 0,
        storeSignature: prior.signature,
      };
    }

    const runtimeRecovering =
      input.causalSnapshot?.dominantPropagationType === "localized" &&
      (input.temporalSnapshot?.dominantTimelineState === "recovering" ||
        temporalSnapshot?.dominantTimelineState === "recovering");

    const candidates: OperationalReplaySequence[] = [];

    const escalationReplay = buildEscalationReplay(sequences, chains, events, now);
    if (escalationReplay) candidates.push(escalationReplay);

    const governanceReplay = buildGovernanceFailureReplay(
      chains,
      input.continuityPreserved !== false,
      now
    );
    if (governanceReplay) candidates.push(governanceReplay);

    const resilienceReplay = buildResilienceRecoveryReplay(chains, sequences, now);
    if (resilienceReplay) candidates.push(resilienceReplay);

    const cascadingReplay = buildCascadingDegradationReplay(sequences, now);
    if (cascadingReplay) candidates.push(cascadingReplay);

    const adaptationReplay = buildAdaptationStabilizationReplay(chains, now);
    if (adaptationReplay) candidates.push(adaptationReplay);

    const recallReplay = buildRecallInformedReplay(
      recallState.recalls.map((r) => r.title),
      recallState.recalls.map((r) => r.category),
      now
    );
    if (recallReplay && candidates.length < 2) candidates.push(recallReplay);

    if (runtimeRecovering && resilienceReplay) {
      const resolved = { ...resilienceReplay, replayState: "resolved" as ReplayProgressionState };
      const idx = candidates.findIndex((c) => c.replayId === resilienceReplay.replayId);
      if (idx >= 0) candidates[idx] = resolved;
    }

    const retained = candidates.filter(shouldRetainReplaySequence);
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_replays",
        snapshot: prior.snapshots[0] ?? null,
        newReplays: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.replays.map((r) => r.replayId));
    const newCount = retained.filter((r) => !priorIds.has(r.replayId)).length;

    store.upsertReplays(retained, now);

    const scenarios = buildScenarios(retained, now);
    store.upsertScenarios(scenarios, now);

    const frames = buildReplayFrames(retained, now);
    store.upsertFrames(frames, now);

    const strategicEvents = buildStrategicReplayEvents(retained, events, now);
    store.upsertStrategicEvents(strategicEvents, now);

    const snapshot = buildReplaySnapshot(
      organizationId,
      retained,
      scenarios,
      frames,
      strategicEvents,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (escalationReplay) {
      devLog(`escalation replay — ${escalationReplay.replayState}: ${escalationReplay.summary.slice(0, 72)}`);
    }
    if (retained.some((r) => r.replayState === "resolved")) {
      devLog("recovery replay completion — historical progression resolved");
    }
    if (retained.length >= 2) {
      devLog(`replay reconstruction — ${retained.length} operational progression replays`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newReplays: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endOperationalReplayEvaluation();
  }
}
