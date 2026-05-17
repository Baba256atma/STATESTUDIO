/**
 * D7:1:1 — Reality Simulation Core foundation tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { advanceSimulationTick, createSimulationTimestamp } from "./simulationClock.ts";
import { guardDuplicateEvent, validateRuntimeTransition } from "./simulationGuards.ts";
import type { SimulationEvent } from "./simulationEventTypes.ts";
import {
  advanceSimulationCycle,
  buildSimulationReplayTimeline,
  createSimulationRuntime,
  enqueueSimulationEvent,
  prepareSimulationRuntime,
  startSimulationRuntime,
} from "./simulationRuntime.ts";
import { selectReplayOrderedSnapshots, selectSimulationSnapshotAtTick } from "./simulationSelectors.ts";

function makeEvent(partial: Partial<SimulationEvent> & Pick<SimulationEvent, "id" | "type">): SimulationEvent {
  return {
    createdAt: partial.createdAt ?? "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

test("advanceSimulationTick is deterministic", () => {
  assert.equal(advanceSimulationTick(0), 1);
  assert.equal(advanceSimulationTick(1), 2);
  assert.equal(advanceSimulationTick(-3), 1);
});

test("createSimulationTimestamp advances simulatedAt with tick", () => {
  const t0 = createSimulationTimestamp(0, { epochSimulatedAt: "2026-05-01T00:00:00.000Z" });
  const t2 = createSimulationTimestamp(2, { epochSimulatedAt: "2026-05-01T00:00:00.000Z" });
  assert.equal(t0.tick, 0);
  assert.equal(t2.tick, 2);
  assert.ok(Date.parse(t2.simulatedAt) > Date.parse(t0.simulatedAt));
});

test("runtime lifecycle: idle → prepared → running", () => {
  const runtime = createSimulationRuntime({ simulationId: "sim-test-1" });
  assert.equal(runtime.runtimeState, "idle");
  const prepared = prepareSimulationRuntime(runtime);
  assert.equal(prepared.ok, true);
  if (!prepared.ok) return;
  const started = startSimulationRuntime(prepared.runtime);
  assert.equal(started.ok, true);
  if (!started.ok) return;
  assert.equal(started.runtime.runtimeState, "running");
});

test("invalid runtime transition is rejected", () => {
  const bad = validateRuntimeTransition("idle", "running");
  assert.equal(bad.ok, false);
});

test("enqueue and advance cycle progresses snapshot deterministically", () => {
  const created = createSimulationRuntime({
    simulationId: "sim-cycle",
    epochSimulatedAt: "2026-01-01T00:00:00.000Z",
  });
  const prepared = prepareSimulationRuntime(created);
  assert.ok(prepared.ok);
  const started = startSimulationRuntime(prepared.runtime);
  assert.ok(started.ok);
  let runtime = started.runtime;

  const enq = enqueueSimulationEvent(
    runtime,
    makeEvent({
      id: "evt-1",
      type: "state_change",
      sourceObjectId: "node-a",
      payload: { objectId: "node-a", patch: { risk: 0.4 } },
    })
  );
  assert.equal(enq.ok, true);
  if (!enq.ok) return;

  const cycle = advanceSimulationCycle(enq.runtime);
  assert.equal(cycle.ok, true);
  if (!cycle.ok) return;
  assert.equal(cycle.runtime.currentTick, 1);
  assert.equal(cycle.runtime.processedEventIds.has("evt-1"), true);
  assert.equal(cycle.runtime.objectStates["node-a"]?.risk, 0.4);

  const atTick1 = selectSimulationSnapshotAtTick(cycle.runtime, 1);
  assert.ok(atTick1);
  assert.equal(atTick1?.timestamp.tick, 1);
});

test("duplicate event is rejected on enqueue", () => {
  let runtime = createSimulationRuntime({ simulationId: "sim-dup" });
  const prepared = prepareSimulationRuntime(runtime);
  assert.ok(prepared.ok);
  runtime = prepared.runtime;
  const started = startSimulationRuntime(runtime);
  assert.ok(started.ok);
  runtime = started.runtime;

  const event = makeEvent({ id: "dup-1", type: "operational_alert" });
  const first = enqueueSimulationEvent(runtime, event);
  assert.ok(first.ok);
  runtime = first.runtime;
  runtime = advanceSimulationCycle(runtime).ok
    ? (advanceSimulationCycle(runtime) as { ok: true; runtime: typeof runtime }).runtime
    : runtime;

  const dupGuard = guardDuplicateEvent(event, runtime.processedEventIds);
  assert.equal(dupGuard.ok, false);

  const second = enqueueSimulationEvent(runtime, event);
  assert.equal(second.ok, false);
});

test("replay timeline is ordered by tick", () => {
  const created = createSimulationRuntime({ simulationId: "sim-replay" });
  const prepared = prepareSimulationRuntime(created);
  assert.ok(prepared.ok);
  const started = startSimulationRuntime(prepared.runtime);
  assert.ok(started.ok);
  let runtime = started.runtime;

  for (let i = 0; i < 3; i += 1) {
    const enq = enqueueSimulationEvent(
      runtime,
      makeEvent({
        id: `evt-${i}`,
        type: "risk_increase",
        payload: { delta: 0.01 },
      })
    );
    assert.ok(enq.ok);
    runtime = enq.runtime;
    const cyc = advanceSimulationCycle(runtime);
    assert.ok(cyc.ok);
    runtime = cyc.runtime;
  }

  const timeline = buildSimulationReplayTimeline(runtime);
  const ordered = selectReplayOrderedSnapshots(runtime);
  assert.equal(timeline.length, ordered.length);
  for (let i = 1; i < timeline.length; i += 1) {
    assert.ok(timeline[i]!.timestamp.tick >= timeline[i - 1]!.timestamp.tick);
  }
});

test("advanceSimulationCycle refuses when not running", () => {
  const runtime = createSimulationRuntime({ simulationId: "sim-idle" });
  const cycle = advanceSimulationCycle(runtime);
  assert.equal(cycle.ok, false);
  if (cycle.ok) return;
  assert.equal(cycle.guard.code, "runtime_not_running");
});
