/**
 * D7:1:7 — Strategic decision consequence engine (deterministic, non-mutating).
 */

import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { SimulationOperationalMetrics } from "../simulationTypes.ts";
import type { SimulationPropagationSnapshotState } from "../simulationPropagationTypes.ts";
import {
  evolveOperationalState,
  simulatedStatesToSnapshotObjectStates,
  snapshotObjectStatesToSimulatedStates,
} from "../operationalStateEvolutionEngine.ts";
import {
  advanceOperationalTimeline,
  buildTimelineSnapshotFromLayers,
  createOperationalTimeline,
  getSnapshotAtTimelineTick,
} from "../timeline/operationalTimelineEvolutionEngine.ts";
import { buildCausalLinksFromTurn } from "../timeline/operationalTimelineEvolutionEngine.ts";
import { freezeSimulationSnapshot } from "../timeline/timelineSnapshotIndex.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type {
  DecisionConsequenceSnapshot,
  DecisionSimulationOutcome,
  SimulateStrategicDecisionInput,
  StrategicDecisionSimulationResult,
  WarRoomDecisionSimulationContract,
} from "./strategicDecisionTypes.ts";
import { guardStrategicDecisionSimulation } from "./decisionGuards.ts";
import {
  extractMetricsRecord,
  modelStrategicDecisionImpact,
} from "./decisionEffectModel.ts";
import { runDecisionPropagation } from "./decisionPropagationBridge.ts";
import { analyzeDecisionConsequenceTradeoffs } from "./decisionConsequenceTradeoffs.ts";
import { buildExecutiveDecisionNarrative } from "./executiveDecisionNarratives.ts";
import { logDecisionDev } from "./decisionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function mergeMetrics(
  base: SimulationOperationalMetrics | undefined,
  patch: Partial<SimulationOperationalMetrics>
): SimulationOperationalMetrics {
  return {
    fragility: clamp01(Number(patch.fragility ?? base?.fragility ?? 0.2)),
    operationalLoad: clamp01(Number(patch.operationalLoad ?? base?.operationalLoad ?? 0.3)),
    confidence: clamp01(Number(patch.confidence ?? base?.confidence ?? 0.75)),
  };
}

function riskLevel(fragility: number): WarRoomDecisionSimulationContract["riskLevel"] {
  if (fragility >= 0.75) return "critical";
  if (fragility >= 0.55) return "high";
  if (fragility >= 0.35) return "moderate";
  return "low";
}

export function buildDecisionSimulationFingerprint(input: {
  decisionId: string;
  decisionType: string;
  timelineId: string;
  appliedAtTick: number;
  intensity: number;
  targetObjectIds: readonly string[];
}): string {
  return stableStringify({
    decisionId: input.decisionId,
    decisionType: input.decisionType,
    timelineId: input.timelineId,
    appliedAtTick: input.appliedAtTick,
    intensity: input.intensity,
    targets: [...input.targetObjectIds].sort(),
  });
}

function replayTimelineToTick(
  source: OperationalTimeline,
  projectedTimelineId: string
): OperationalTimeline {
  const inherited = source.snapshots
    .filter((s) => s.timestamp.tick <= source.currentTick)
    .sort((a, b) => a.timestamp.tick - b.timestamp.tick)
    .map((s) => freezeSimulationSnapshot(s));

  if (inherited.length === 0) {
    throw new Error("Cannot project decision timeline without snapshots");
  }

  let projected = createOperationalTimeline({
    timelineId: projectedTimelineId,
    initialSnapshot: inherited[0]!,
    branchId: source.branchId,
    status: source.status === "completed" ? "paused" : source.status,
  });

  for (let i = 1; i < inherited.length; i += 1) {
    const snap = inherited[i]!;
    const advanced = advanceOperationalTimeline({
      timeline: projected,
      simulationEvents: [],
      nextSnapshot: snap,
      nextTick: snap.timestamp.tick,
    });
    if (!advanced.ok) break;
    projected = advanced.timeline;
  }

  return projected;
}

export function buildWarRoomDecisionContract(input: {
  simulationId: string;
  decision: SimulateStrategicDecisionInput["decision"];
  narrative: DecisionConsequenceSnapshot["narrative"];
  metricsBefore: Readonly<Record<string, number>>;
  metricsAfter: Readonly<Record<string, number>>;
  tradeoffs: DecisionConsequenceSnapshot["tradeoffs"];
  fingerprint: string;
}): WarRoomDecisionSimulationContract {
  const fragilityDelta = input.metricsAfter.fragility - input.metricsBefore.fragility;
  const recoveryDelta =
    (1 - input.metricsAfter.fragility) * input.metricsAfter.confidence -
    (1 - input.metricsBefore.fragility) * input.metricsBefore.confidence;

  return Object.freeze({
    simulationId: input.simulationId,
    decisionId: input.decision.decisionId,
    decisionType: input.decision.type,
    headline: input.narrative.headline,
    riskLevel: riskLevel(input.metricsAfter.fragility),
    fragilityDelta: Number(fragilityDelta.toFixed(4)),
    recoveryDelta: Number(recoveryDelta.toFixed(4)),
    targetObjectIds: [...input.decision.targetObjectIds],
    tradeoffSummaries: Object.freeze(input.tradeoffs.map((t) => t.summary)),
    replayFingerprint: input.fingerprint,
    viewHint: input.tradeoffs.length > 2 ? "tradeoff_grid" : "consequence_timeline",
  });
}

/**
 * Simulate executive decision consequences without mutating the source timeline.
 */
export function simulateStrategicDecision(
  input: SimulateStrategicDecisionInput
): StrategicDecisionSimulationResult {
  const simulationId = String(input.simulationId ?? `sim-decision::${input.decision.decisionId}`).trim();
  const pendingFingerprint = buildDecisionSimulationFingerprint({
    decisionId: input.decision.decisionId,
    decisionType: input.decision.type,
    timelineId: input.activeTimeline.timelineId,
    appliedAtTick: input.activeTimeline.currentTick,
    intensity: input.decision.intensity ?? 0.5,
    targetObjectIds: input.decision.targetObjectIds,
  });

  const guard = guardStrategicDecisionSimulation({
    decision: input.decision,
    activeTimeline: input.activeTimeline,
    currentSnapshot: input.currentSnapshot,
    resourceAvailability: input.resourceAvailability,
    priorSimulationFingerprints: input.priorSimulationFingerprints,
    pendingFingerprint,
    decisionChain: input.decisionChain,
  });
  if (!guard.ok) return { ok: false, guard };

  const appliedAtTick = guard.appliedAtTick;
  const headSnapshot =
    input.currentSnapshot ?? getSnapshotAtTimelineTick(input.activeTimeline, appliedAtTick);
  if (!headSnapshot) {
    return {
      ok: false,
      guard: {
        ok: false,
        code: "corrupted_timeline",
        message: `Missing snapshot at tick ${appliedAtTick}`,
      },
    };
  }

  logDecisionDev("StrategicDecision", {
    decisionId: input.decision.decisionId,
    type: input.decision.type,
    tick: appliedAtTick,
    targets: input.decision.targetObjectIds.length,
  });

  const modeled = modelStrategicDecisionImpact(input.decision, guard.normalizedIntensity);
  const metricsBefore = extractMetricsRecord(headSnapshot.operationalMetrics);

  const { event, propagationResults, evolutionSignals } = runDecisionPropagation({
    decision: input.decision,
    snapshot: headSnapshot,
    tick: appliedAtTick,
    seedIntensity: modeled.propagationSeedIntensity,
    objectGraph: input.objectGraph,
  });

  const projectedTick = appliedAtTick + 1;
  const currentStates = snapshotObjectStatesToSimulatedStates(headSnapshot.objectStates, appliedAtTick);

  for (const [objectId, patch] of Object.entries(modeled.objectStatePatches)) {
    const prev = currentStates[objectId] ?? {
      objectId,
      operationalState: "stable" as const,
      metadata: { severity: 0.2 },
      lastUpdatedTick: appliedAtTick,
      transitionHistory: [],
    };
    const op = (patch.operationalState as typeof prev.operationalState | undefined) ?? prev.operationalState;
    currentStates[objectId] = {
      ...prev,
      operationalState: op,
      metadata: {
        ...prev.metadata,
        ...(patch.metadata as typeof prev.metadata | undefined),
      },
      lastUpdatedTick: projectedTick,
    };
  }

  const evolution = evolveOperationalState({
    currentStates,
    simulationEvents: [event],
    propagationEffects: [...evolutionSignals],
    tick: projectedTick,
    operationalMetrics: mergeMetrics(headSnapshot.operationalMetrics, modeled.metricsPatch),
  });

  const metricsAfter = extractMetricsRecord(
    mergeMetrics(headSnapshot.operationalMetrics, modeled.metricsPatch)
  );

  const propagationFragment = propagationResults[0]?.snapshotFragment as
    | SimulationPropagationSnapshotState
    | undefined;

  const nextSnapshot = buildTimelineSnapshotFromLayers({
    simulationId: headSnapshot.simulationId,
    branchId: headSnapshot.branchId,
    tick: projectedTick,
    epochSimulatedAt: headSnapshot.timestamp.simulatedAt,
    objectStates: simulatedStatesToSnapshotObjectStates(evolution.nextStates),
    propagationState: propagationFragment ?? headSnapshot.propagationState,
    operationalMetrics: mergeMetrics(headSnapshot.operationalMetrics, modeled.metricsPatch),
  });

  const projectedTimelineId = `${input.activeTimeline.timelineId}::decision::${input.decision.decisionId}`;
  let projectedTimeline = replayTimelineToTick(input.activeTimeline, projectedTimelineId);

  const causalLinks = buildCausalLinksFromTurn({
    tick: projectedTick,
    simulationEvents: [event],
    propagationResults: [...propagationResults],
  });

  const advanced = advanceOperationalTimeline({
    timeline: projectedTimeline,
    simulationEvents: [event],
    propagationResults: [...propagationResults],
    nextSnapshot,
    nextTick: projectedTick,
    causalLinks,
    status: "running",
  });

  if (!advanced.ok) {
    const guardMessage =
      advanced.guard.ok === false
        ? advanced.guard.message
        : "Timeline could not advance for decision simulation";
    return {
      ok: false,
      guard: {
        ok: false,
        code: "impossible_operational_action",
        message: guardMessage,
      },
    };
  }
  projectedTimeline = advanced.timeline;

  const tradeoffs = analyzeDecisionConsequenceTradeoffs({
    modeled,
    effects: modeled.effects,
    metricsBefore,
    metricsAfter,
  });

  const narrative = buildExecutiveDecisionNarrative({
    decision: input.decision,
    modeled,
    tradeoffs,
    metricsBefore,
    metricsAfter,
  });

  const fingerprint = stableStringify({
    pendingFingerprint,
    metricsAfter,
    evolution: Object.keys(evolution.nextStates).sort().join(","),
    propagationEventCount: propagationResults.reduce(
      (sum, r) => sum + r.propagationEvents.length,
      0
    ),
  });

  const consequenceSnapshot: DecisionConsequenceSnapshot = Object.freeze({
    simulationId,
    decisionId: input.decision.decisionId,
    sourceTimelineId: input.activeTimeline.timelineId,
    projectedTimelineId,
    appliedAtTick,
    projectedTick,
    effects: Object.freeze(modeled.effects.map((e) => Object.freeze({ ...e }))),
    tradeoffs: Object.freeze(tradeoffs.map((t) => Object.freeze({ ...t }))),
    narrative: Object.freeze({
      ...narrative,
      benefits: Object.freeze([...narrative.benefits]),
      costs: Object.freeze([...narrative.costs]),
      bullets: Object.freeze([...narrative.bullets]),
    }),
    metricsBefore: Object.freeze({ ...metricsBefore }),
    metricsAfter: Object.freeze({ ...metricsAfter }),
    propagationEventCount: propagationResults.reduce(
      (sum, r) => sum + r.propagationEvents.length,
      0
    ),
    fingerprint,
  });

  const warRoomContract = buildWarRoomDecisionContract({
    simulationId,
    decision: input.decision,
    narrative: consequenceSnapshot.narrative,
    metricsBefore,
    metricsAfter,
    tradeoffs: consequenceSnapshot.tradeoffs,
    fingerprint,
  });

  logDecisionDev("DecisionSimulation", {
    simulationId,
    decisionId: input.decision.decisionId,
    projectedTimelineId,
    projectedTick,
    fingerprint,
  });

  const outcome: DecisionSimulationOutcome = Object.freeze({
    simulationId,
    decisionId: input.decision.decisionId,
    sourceTimelineId: input.activeTimeline.timelineId,
    projectedTimeline,
    consequenceSnapshot,
    propagationResults: Object.freeze([...propagationResults]),
    warRoomContract,
  });

  return { ok: true, outcome };
}

/** Returns a frozen copy of an outcome for replay audit trails. */
export function freezeDecisionSimulationOutcome(
  outcome: DecisionSimulationOutcome
): DecisionSimulationOutcome {
  return Object.freeze({
    ...outcome,
    consequenceSnapshot: Object.freeze({
      ...outcome.consequenceSnapshot,
      effects: Object.freeze(outcome.consequenceSnapshot.effects.map((e) => Object.freeze({ ...e }))),
      tradeoffs: Object.freeze(outcome.consequenceSnapshot.tradeoffs.map((t) => Object.freeze({ ...t }))),
      narrative: Object.freeze({ ...outcome.consequenceSnapshot.narrative }),
    }),
    propagationResults: Object.freeze([...outcome.propagationResults]),
    warRoomContract: Object.freeze({ ...outcome.warRoomContract }),
  });
}
