/**
 * D7:1:8 — Executive war-room orchestration tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import { createOperationalTimeline } from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  createScenarioBranch,
  createScenarioBranchForest,
} from "../branching/branchingScenarioTimelineEngine.ts";
import {
  createWarRoomSimulationSession,
  freezeWarRoomOrchestrationSnapshot,
  orchestrateWarRoomSimulation,
} from "./executiveWarRoomOrchestrationEngine.ts";
import { buildOrchestrationRequestFingerprint } from "./warRoomGuards.ts";
import {
  buildWarRoomScenarioSlotsFromForest,
  cloneTimelinesByScenario,
} from "./multiScenarioCoordination.ts";
import { interventionsConflict } from "./warRoomGuards.ts";
import { applyWarRoomInterventionSequence } from "./interventionSequencing.ts";
import { buildExecutiveWarRoomSessionNarrative } from "./executiveWarRoomNarratives.ts";
import type { StrategicDecisionInput } from "../decision/strategicDecisionTypes.ts";

function snap(tick: number, fragility = 0.25) {
  return createSimulationStateSnapshot({
    simulationId: "sim-wr",
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

function buildForestWithAlternatives() {
  let parent = createOperationalTimeline({ timelineId: "tl-wr-root", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);

  const recovery = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      branchId: "aggressive_recovery",
      executiveScenarioKind: "aggressive_recovery",
      forkHeadPatch: { operationalMetrics: { fragility: 0.45 } },
    },
  });
  assert.ok(recovery.ok);
  if (!recovery.ok) throw new Error("branch failed");
  forest = recovery.forest;
  parent = recovery.parentTimeline;

  const stabilization = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      branchId: "controlled_stabilization",
      executiveScenarioKind: "controlled_stabilization",
      forkHeadPatch: { operationalMetrics: { fragility: 0.2 } },
    },
  });
  assert.ok(stabilization.ok);
  if (!stabilization.ok) throw new Error("branch failed");
  forest = stabilization.forest;

  return { forest, parent };
}

test("deterministic orchestration fingerprints", () => {
  const { forest } = buildForestWithAlternatives();
  const slots = buildWarRoomScenarioSlotsFromForest({ forest, baselineScenarioId: "baseline" });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-det",
    title: "Volatility review",
    scenarioIds: slots.map((s) => s.scenarioId),
    baselineScenarioId: "baseline",
  });

  const input = {
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    runComparisons: true,
  };

  const fp = buildOrchestrationRequestFingerprint(input);
  const r1 = orchestrateWarRoomSimulation(input);
  const r2 = orchestrateWarRoomSimulation({
    ...input,
    session: { ...session, status: "prepared" },
    history,
    priorOrchestrationFingerprints: [],
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(fp.length > 10, true);
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("multi-scenario coordination preserves forest immutability", () => {
  const { forest } = buildForestWithAlternatives();
  const frozenForest = JSON.stringify(forest);
  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-iso",
    title: "Isolation test",
    scenarioIds: slots.map((s) => s.scenarioId),
  });

  const result = orchestrateWarRoomSimulation({
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    runComparisons: true,
  });

  assert.ok(result.ok);
  assert.equal(JSON.stringify(forest), frozenForest);
  if (!result.ok) return;
  assert.ok(result.snapshot.comparisonSnapshots.length >= 1);
});

test("intervention sequencing preserves order and causality", () => {
  const { forest } = buildForestWithAlternatives();
  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);

  const sequence = applyWarRoomInterventionSequence({
    interventions: [
      {
        stepIndex: 1,
        targetScenarioId: "aggressive_recovery",
        decision: decision({ decisionId: "step-1", type: "stabilization" }),
      },
      {
        stepIndex: 2,
        targetScenarioId: "aggressive_recovery",
        decision: decision({ decisionId: "step-2", type: "risk_mitigation" }),
      },
    ],
    timelinesByScenarioId: timelines,
  });

  assert.ok("timelinesByScenarioId" in sequence);
  if (!("timelinesByScenarioId" in sequence)) return;
  assert.equal(sequence.historyEntries.length, 2);
  assert.equal(sequence.historyEntries[0]!.stepIndex, 1);
  assert.equal(sequence.historyEntries[1]!.stepIndex, 2);
  assert.notEqual(
    sequence.historyEntries[0]!.projectedTimelineId,
    sequence.historyEntries[1]!.projectedTimelineId
  );
});

test("rejects conflicting interventions at same step", () => {
  assert.equal(interventionsConflict("operational_pause", "expansion"), true);
  const { forest } = buildForestWithAlternatives();
  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-conflict",
    title: "Conflict test",
    scenarioIds: slots.map((s) => s.scenarioId),
  });

  const result = orchestrateWarRoomSimulation({
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    interventions: [
      {
        stepIndex: 1,
        targetScenarioId: "controlled_stabilization",
        decision: decision({ decisionId: "pause-1", type: "operational_pause" }),
      },
      {
        stepIndex: 1,
        targetScenarioId: "controlled_stabilization",
        decision: decision({ decisionId: "expand-1", type: "expansion" }),
      },
    ],
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.guard.code, "conflicting_interventions");
});

test("rejects duplicate orchestration fingerprint", () => {
  const { forest } = buildForestWithAlternatives();
  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-dup",
    title: "Duplicate orchestration",
    scenarioIds: slots.map((s) => s.scenarioId),
  });

  const input = {
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    runComparisons: false,
  };
  const fp = buildOrchestrationRequestFingerprint(input);
  const first = orchestrateWarRoomSimulation(input);
  assert.ok(first.ok);
  const second = orchestrateWarRoomSimulation({
    ...input,
    session: { ...session, status: "prepared" },
    priorOrchestrationFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_orchestration");
});

test("replay-safe frozen orchestration snapshot", () => {
  const { forest } = buildForestWithAlternatives();
  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-freeze",
    title: "Replay test",
    scenarioIds: slots.map((s) => s.scenarioId),
  });

  const result = orchestrateWarRoomSimulation({
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeWarRoomOrchestrationSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.session as { title: string }).title = "mutated";
  });
  assert.equal(frozen.fingerprint, result.snapshot.fingerprint);
});

test("executive session narrative is strategically readable", () => {
  const narrative = buildExecutiveWarRoomSessionNarrative({
    sessionTitle: "Supply-chain volatility review",
    scenarioSlots: [
      { scenarioId: "baseline", timelineId: "t0", label: "Baseline", role: "baseline" },
      {
        scenarioId: "aggressive_recovery",
        timelineId: "t1",
        label: "Aggressive recovery",
        role: "alternative",
        executiveLabel: "Aggressive recovery path",
      },
    ],
    syncRecord: {
      syncTick: 0,
      synchronizedScenarioIds: ["baseline", "aggressive_recovery"],
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    comparisonSnapshots: [],
    interventionCount: 2,
  });
  assert.match(narrative.headline, /war-room|compares|explores/i);
  assert.ok(!narrative.headline.includes("node set"));
  assert.ok(narrative.summary.includes("intervention"));
});

test("synchronization consistency across scenarios", () => {
  const { forest } = buildForestWithAlternatives();
  const slots = buildWarRoomScenarioSlotsFromForest({ forest });
  const timelines = cloneTimelinesByScenario(slots, forest);
  const { session, state, history } = createWarRoomSimulationSession({
    sessionId: "wr-sync",
    title: "Sync test",
    scenarioIds: slots.map((s) => s.scenarioId),
  });

  const result = orchestrateWarRoomSimulation({
    session,
    state,
    history,
    forest,
    scenarioSlots: slots,
    timelinesByScenarioId: timelines,
    syncAtTick: 0,
    runComparisons: true,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.syncRecord?.syncTick, 0);
  assert.ok(result.snapshot.history.syncHistory.length >= 1);
  assert.equal(result.snapshot.history.interventionSequence.length, 0);
});
