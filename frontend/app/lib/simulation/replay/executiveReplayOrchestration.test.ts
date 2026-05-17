/**
 * D7:1:9 — Executive replay + strategic memory tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import {
  advanceOperationalTimeline,
  createOperationalTimeline,
} from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  createScenarioBranch,
  createScenarioBranchForest,
} from "../branching/branchingScenarioTimelineEngine.ts";
import {
  orchestrateWarRoomSimulation,
  createWarRoomSimulationSession,
} from "../warroom/executiveWarRoomOrchestrationEngine.ts";
import {
  buildWarRoomScenarioSlotsFromForest,
  cloneTimelinesByScenario,
} from "../warroom/multiScenarioCoordination.ts";
import {
  applyWarRoomInterventionSequence,
} from "../warroom/interventionSequencing.ts";
import type { StrategicDecisionInput } from "../decision/strategicDecisionTypes.ts";
import {
  advanceReplayToFrame,
  createSimulationReplaySession,
  freezeReplayOrchestrationSnapshot,
  replaySimulationTimeline,
} from "./executiveReplayOrchestrationEngine.ts";
import { buildReplayContentFingerprint } from "./replayGuards.ts";
import {
  reconstructTimelineForReplay,
  detectOperationalTransitions,
} from "./timelineReconstruction.ts";
import {
  buildStrategicMemorySnapshot,
  lookupMemoryByDecisionId,
} from "./strategicMemoryIndex.ts";
import { buildExecutiveReplayNarrative } from "./executiveReplayNarratives.ts";

function snap(tick: number, fragility = 0.25) {
  return createSimulationStateSnapshot({
    simulationId: "sim-replay",
    timestamp: createSimulationTimestamp(tick, { epochSimulatedAt: "2026-01-01T00:00:00.000Z" }),
    objectStates: {
      supply: { operationalState: "stable" },
      logistics: { operationalState: "stable" },
    },
    operationalMetrics: { fragility, confidence: 0.75, operationalLoad: 0.35 },
  });
}

function decision(
  partial: Partial<StrategicDecisionInput> & Pick<StrategicDecisionInput, "decisionId" | "type">
): StrategicDecisionInput {
  return {
    targetObjectIds: ["supply", "logistics"],
    createdAt: "2026-01-01T00:00:00.000Z",
    intensity: 0.55,
    ...partial,
  };
}

test("deterministic replay fingerprints", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-rep-det", initialSnapshot: snap(0) });
  const session = createSimulationReplaySession({
    replayId: "rep-det",
    sourceTimelineId: timeline.timelineId,
    title: "Determinism test",
  });

  const input = { session, sourceTimeline: timeline };
  const r1 = replaySimulationTimeline(input);
  const r2 = replaySimulationTimeline({
    ...input,
    session: createSimulationReplaySession({
      replayId: "rep-det-2",
      sourceTimelineId: timeline.timelineId,
      title: "Determinism test",
    }),
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(
    r1.snapshot.reconstruction.fingerprint,
    r2.snapshot.reconstruction.fingerprint
  );
});

test("timeline reconstruction ordering consistency", () => {
  let timeline = createOperationalTimeline({ timelineId: "tl-recon", initialSnapshot: snap(0, 0.2) });
  const advanced = advanceOperationalTimeline({
    timeline,
    simulationEvents: [],
    nextSnapshot: snap(1, 0.45),
    nextTick: 1,
  });
  assert.ok(advanced.ok);
  if (!advanced.ok) return;
  timeline = advanced.timeline;

  const bundle = reconstructTimelineForReplay({ sourceTimeline: timeline });
  assert.equal(bundle.orderedSnapshots.length, 2);
  assert.equal(bundle.orderedSnapshots[0]!.timestamp.tick, 0);
  assert.equal(bundle.orderedSnapshots[1]!.timestamp.tick, 1);
  assert.equal(bundle.replayTrack.frames.length, 2);
});

test("replay does not mutate source timeline", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-immut-rep", initialSnapshot: snap(0) });
  const frozen = JSON.stringify(timeline);
  const session = createSimulationReplaySession({
    replayId: "rep-immut",
    sourceTimelineId: timeline.timelineId,
  });
  const result = replaySimulationTimeline({ session, sourceTimeline: timeline });
  assert.ok(result.ok);
  assert.equal(JSON.stringify(timeline), frozen);
});

test("decision replay tracking from war-room interventions", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-wr-rep", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  const branch = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: { branchId: "recovery_path", forkHeadPatch: { operationalMetrics: { fragility: 0.35 } } },
  });
  assert.ok(branch.ok);
  if (!branch.ok) return;
  forest = branch.forest;
  parent = branch.parentTimeline;

  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);

  const sequence = applyWarRoomInterventionSequence({
    interventions: [
      {
        stepIndex: 1,
        targetScenarioId: "recovery_path",
        decision: decision({ decisionId: "wr-dec-1", type: "stabilization" }),
      },
    ],
    timelinesByScenarioId: timelines,
  });
  assert.ok("timelinesByScenarioId" in sequence);
  if (!("timelinesByScenarioId" in sequence)) return;

  const projected = sequence.timelinesByScenarioId.recovery_path!;
  const session = createSimulationReplaySession({
    replayId: "rep-wr",
    sourceTimelineId: projected.timelineId,
    title: "War-room replay",
  });
  const result = replaySimulationTimeline({
    session,
    sourceTimeline: projected,
    interventionOutcomes: sequence.outcomes,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(
    result.snapshot.reconstruction.decisionMarkers.some((m) => m.decisionId === "wr-dec-1")
  );
  const memoryHits = lookupMemoryByDecisionId(result.snapshot.memory, "wr-dec-1");
  assert.ok(memoryHits.length >= 1);
});

test("memory indexing consistency", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-mem", initialSnapshot: snap(0, 0.3) });
  const advanced = advanceOperationalTimeline({
    timeline,
    simulationEvents: [],
    nextSnapshot: snap(1, 0.55),
    nextTick: 1,
  });
  assert.ok(advanced.ok);
  if (!advanced.ok) return;

  const reconstruction = reconstructTimelineForReplay({ sourceTimeline: advanced.timeline });
  const memory = buildStrategicMemorySnapshot({
    memoryId: "mem-1",
    sourceTimeline: advanced.timeline,
    reconstruction,
  });

  assert.ok(memory.entries.length >= 1);
  assert.ok(memory.index.byTimelineId[advanced.timeline.timelineId]?.length >= 1);
  assert.equal(memory.fingerprint.length > 10, true);
});

test("rejects duplicate replay fingerprint", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-dup-rep", initialSnapshot: snap(0) });
  const session = createSimulationReplaySession({
    replayId: "rep-dup",
    sourceTimelineId: timeline.timelineId,
  });
  const fp = buildReplayContentFingerprint({
    sourceTimelineId: timeline.timelineId,
    snapshotFingerprints: timeline.snapshots.map((s) => s.fingerprint),
  });
  const first = replaySimulationTimeline({ session, sourceTimeline: timeline });
  assert.ok(first.ok);
  const second = replaySimulationTimeline({
    session: createSimulationReplaySession({
      replayId: "rep-dup-2",
      sourceTimelineId: timeline.timelineId,
    }),
    sourceTimeline: timeline,
    priorReplayFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_replay");
});

test("replay-safe frozen orchestration snapshot", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-freeze-rep", initialSnapshot: snap(0) });
  const session = createSimulationReplaySession({
    replayId: "rep-freeze",
    sourceTimelineId: timeline.timelineId,
  });
  const result = replaySimulationTimeline({ session, sourceTimeline: timeline });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeReplayOrchestrationSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.session as { replayId: string }).replayId = "mutated";
  });
});

test("executive replay narrative is strategically readable", () => {
  const ordered = [snap(0, 0.25), snap(1, 0.5), snap(2, 0.35)];
  const transitions = detectOperationalTransitions(ordered);
  assert.equal(transitions.escalationTick, 1);

  const timeline = createOperationalTimeline({ timelineId: "tl-nar", initialSnapshot: ordered[0]! });
  let current = timeline;
  for (let t = 1; t < ordered.length; t += 1) {
    const adv = advanceOperationalTimeline({
      timeline: current,
      simulationEvents: [],
      nextSnapshot: ordered[t]!,
      nextTick: t,
    });
    if (!adv.ok) break;
    current = adv.timeline;
  }

  const reconstruction = reconstructTimelineForReplay({ sourceTimeline: current });
  const narrative = buildExecutiveReplayNarrative({
    sourceTimelineId: current.timelineId,
    reconstruction,
    decisionMarkers: [],
    sessionTitle: "Supply volatility review",
  });
  assert.match(narrative.headline, /instability|evolution|Replay/i);
  assert.ok(!narrative.headline.includes("delta recalculated"));
});

test("advanceReplayToFrame respects frame guards", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-frame", initialSnapshot: snap(0) });
  const session = createSimulationReplaySession({
    replayId: "rep-frame",
    sourceTimelineId: timeline.timelineId,
  });
  const result = replaySimulationTimeline({ session, sourceTimeline: timeline });
  assert.ok(result.ok);
  if (!result.ok) return;

  const advanced = advanceReplayToFrame(result.snapshot, 0);
  assert.ok(!("ok" in advanced) || (advanced as { ok?: boolean }).ok !== false);
  if ("ok" in advanced && advanced.ok === false) return;

  const bad = advanceReplayToFrame(result.snapshot, 99);
  assert.equal("ok" in bad && bad.ok === false, true);
});

test("integrated war-room orchestration replay", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-int", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  const alt = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      branchId: "stabilization_path",
      executiveScenarioKind: "controlled_stabilization",
      forkHeadPatch: { operationalMetrics: { fragility: 0.22 } },
    },
  });
  assert.ok(alt.ok);
  if (!alt.ok) return;
  forest = alt.forest;

  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-int",
    title: "Integrated volatility session",
    scenarioIds: slots.map((s) => s.scenarioId),
  });

  const orchestrated = orchestrateWarRoomSimulation({
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    runComparisons: true,
  });
  assert.ok(orchestrated.ok);
  if (!orchestrated.ok) return;

  const baselineTimeline = orchestrated.snapshot.workingTimelinesByScenarioId.baseline ?? parent;
  const replaySession = createSimulationReplaySession({
    replayId: "rep-int",
    sourceTimelineId: baselineTimeline.timelineId,
    title: "Integrated replay",
    sourceWarRoomSessionId: session.sessionId,
  });

  const replayed = replaySimulationTimeline({
    session: replaySession,
    sourceTimeline: baselineTimeline,
    warRoomSnapshot: orchestrated.snapshot,
    branchForest: forest,
  });
  assert.ok(replayed.ok);
  if (!replayed.ok) return;
  assert.ok(replayed.snapshot.memory.entries.length > 0);
  assert.ok(replayed.panelContract.scrubPoints.length >= 1);
});
