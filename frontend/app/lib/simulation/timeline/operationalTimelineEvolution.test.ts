/**
 * D7:1:4 — Operational timeline evolution tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import {
  advanceOperationalTimeline,
  buildCausalLinksFromTurn,
  createOperationalTimeline,
  getReplayOrderedTimelineSnapshots,
  operationalTimelineFingerprint,
} from "./operationalTimelineEvolutionEngine.ts";
import { buildReplayTrackFromOperationalTimeline } from "./timelineReplayBridge.ts";
import { guardTimelineTickProgression, validateOperationalTimeline } from "./timelineGuards.ts";
import { freezeSimulationSnapshot } from "./timelineSnapshotIndex.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";

function snap(tick: number, simulationId = "sim-1", fragility = 0.2) {
  return createSimulationStateSnapshot({
    simulationId,
    timestamp: createSimulationTimestamp(tick, { epochSimulatedAt: "2026-01-01T00:00:00.000Z" }),
    objectStates: { a: { operationalState: "stable" } },
    operationalMetrics: { fragility, confidence: 0.75, operationalLoad: 0.3 },
  });
}

function evt(id: string, type: SimulationEvent["type"] = "risk_increase"): SimulationEvent {
  return {
    id,
    type,
    sourceObjectId: "a",
    targetObjectIds: ["b"],
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

test("deterministic timeline progression appends immutable snapshots", () => {
  let timeline = createOperationalTimeline({
    timelineId: "tl-1",
    initialSnapshot: snap(0),
    status: "running",
  });
  const frozen0 = JSON.stringify(timeline.snapshots[0]);

  const advanced = advanceOperationalTimeline({
    timeline,
    simulationEvents: [evt("e1")],
    nextSnapshot: snap(1, "sim-1", 0.45),
    nextTick: 1,
  });
  assert.equal(advanced.ok, true);
  if (!advanced.ok) return;
  timeline = advanced.timeline;

  assert.equal(timeline.snapshots.length, 2);
  assert.equal(JSON.stringify(timeline.snapshots[0]), frozen0);
  assert.equal(timeline.currentTick, 1);
  assert.ok(timeline.causality.length >= 1);
});

test("duplicate tick rejection", () => {
  const guard = guardTimelineTickProgression(2, 2);
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "duplicate_tick");
});

test("backward tick rejection", () => {
  const guard = guardTimelineTickProgression(4, 3);
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "backward_progression");
});

test("causality preservation across ticks", () => {
  let timeline = createOperationalTimeline({ timelineId: "tl-cause", initialSnapshot: snap(0) });
  const links = buildCausalLinksFromTurn({
    tick: 1,
    simulationEvents: [evt("ev-a"), evt("ev-b")],
  });
  assert.equal(links.length, 2);
  const adv = advanceOperationalTimeline({
    timeline,
    simulationEvents: [evt("ev-a"), evt("ev-b")],
    nextSnapshot: snap(1, "sim-1", 0.6),
    nextTick: 1,
    causalLinks: links,
  });
  assert.ok(adv.ok);
  timeline = adv.timeline;
  assert.equal(timeline.causality.length, 2);
  assert.equal(timeline.history.entries[1]!.causalLinkIds.length, 2);
});

test("replay ordering consistency and fingerprint stability", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-replay", initialSnapshot: snap(0) });
  const a = advanceOperationalTimeline({
    timeline,
    simulationEvents: [],
    nextSnapshot: snap(1),
    nextTick: 1,
  });
  assert.ok(a.ok);
  if (!a.ok) return;
  const b = advanceOperationalTimeline({
    timeline: a.timeline,
    simulationEvents: [],
    nextSnapshot: snap(2, "sim-1", 0.7),
    nextTick: 2,
  });
  assert.ok(b.ok);
  if (!b.ok) return;

  const ordered = getReplayOrderedTimelineSnapshots(b.timeline);
  assert.equal(ordered[0]!.timestamp.tick, 0);
  assert.equal(ordered[2]!.timestamp.tick, 2);

  const fp1 = operationalTimelineFingerprint(b.timeline);
  const fp2 = operationalTimelineFingerprint(b.timeline);
  assert.equal(fp1, fp2);
});

test("timeline validation passes for coherent timeline", () => {
  const timeline = createOperationalTimeline({ timelineId: "tl-valid", initialSnapshot: snap(0) });
  assert.equal(validateOperationalTimeline(timeline).ok, true);
});

test("replay bridge maps to NexoraReplayTrack without mutating timeline", () => {
  let timeline = createOperationalTimeline({ timelineId: "tl-bridge", initialSnapshot: snap(0) });
  const adv = advanceOperationalTimeline({
    timeline,
    simulationEvents: [evt("e1")],
    nextSnapshot: snap(1),
    nextTick: 1,
  });
  assert.ok(adv.ok);
  if (!adv.ok) return;
  timeline = adv.timeline;
  const frozen = JSON.stringify(timeline);
  const track = buildReplayTrackFromOperationalTimeline(timeline);
  assert.equal(track.frames.length, 2);
  assert.equal(track.playbackMode, "timeline");
  assert.equal(JSON.stringify(timeline), frozen);
});

test("freezeSimulationSnapshot prevents shared mutation", () => {
  const original = snap(0);
  const frozen = freezeSimulationSnapshot(original);
  (original.objectStates as Record<string, unknown>).a = { operationalState: "mutated" };
  assert.notEqual((frozen.objectStates as Record<string, unknown>).a, original.objectStates.a);
});
