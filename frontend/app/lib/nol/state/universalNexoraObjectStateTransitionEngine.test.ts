/**
 * NOL-1:4 — Universal NexoraObject State & Transition Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createNexoraObjectContract } from "../contract/universalNexoraObjectContract.ts";
import {
  getNexoraObjectRuntimeState,
  hydrateNexoraObjectRuntimeState,
  resetNexoraObjectRuntimeStoreForTests,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";
import {
  activateNexoraObject,
  applyNexoraObjectCompositeTransition,
  applyNexoraObjectTransition,
  applyNexoraObjectTransitionBatch,
  archiveNexoraObject,
  assertNexoraObjectStateInvariants,
  createNexoraObjectState,
  createNexoraObjectTransitionRecord,
  deleteNexoraObject,
  deserializeNexoraObjectState,
  evaluateNexoraObjectTransition,
  pauseNexoraObjectLifecycle,
  projectNexoraObjectTransitionHistory,
  resetNexoraObjectStateTransitionStoreForTests,
  restoreNexoraObject,
  resumeNexoraObjectLifecycle,
  serializeNexoraObjectState,
  setNexoraObjectExecutiveState,
  setNexoraObjectStatus,
  setNexoraObjectVisualizationState,
  simulateNexoraObjectTransition,
  simulateNexoraObjectTransitionSequence,
  stateTransitionEngineIdentity,
  stateTransitionSchemaVersion,
  validateNexoraObjectState,
  type NexoraObjectState,
  type NexoraObjectStateTransitionDependencies,
  type NexoraObjectTransitionContext,
} from "./universalNexoraObjectStateTransitionEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function deps(): NexoraObjectStateTransitionDependencies {
  let n = 0;
  let e = 0;
  let t = 0;
  return {
    now: () =>
      `2026-08-04T12:${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n++ % 60).padStart(2, "0")}.000Z`,
    createEventId: () => `evt-${++e}`,
    createTransitionId: () => `trn-${++t}`,
  };
}

function ctx(
  source: NexoraObjectTransitionContext["source"] = "Runtime",
  extra: Partial<NexoraObjectTransitionContext> = {},
): NexoraObjectTransitionContext {
  return Object.freeze({ source, ...extra });
}

function makeObject(id: string) {
  const object = createNexoraObjectContract({
    id,
    type: "Decision",
    caption: `Object ${id}`,
    createdAt: "2026-08-04T12:00:00.000Z",
  });
  hydrateNexoraObjectRuntimeState(object, undefined, {
    updatedAt: "2026-08-04T12:00:00.000Z",
  });
  return object;
}

describe("NOL-1:4 Universal NexoraObject State & Transition Engine", () => {
  beforeEach(() => {
    resetNexoraObjectRuntimeStoreForTests();
    resetNexoraObjectStateTransitionStoreForTests();
  });

  it("1. canonical object state is created from the Contract model", () => {
    const object = makeObject("ste-1");
    const state = createNexoraObjectState(object, deps());
    assert.equal(state.objectId, "ste-1");
    assert.equal(state.lifecycle, "Created");
    assert.equal(state.status, "White");
    assert.equal(state.stateRevision, 0);
    assert.equal(state.stateSchemaVersion, stateTransitionSchemaVersion);
  });

  it("2. state identity matches object identity", () => {
    const object = makeObject("ste-2");
    const state = createNexoraObjectState(object, deps());
    assert.equal(state.objectId, object.identity.id);
    assert.equal(state.objectType, object.identity.type);
  });

  it("3. Created objects may activate", () => {
    const object = makeObject("ste-3");
    const result = activateNexoraObject(object, ctx(), deps());
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Active");
    assert.equal(object.lifecycle, "Active");
  });

  it("4. Created objects cannot pause or archive directly", () => {
    const object = makeObject("ste-4");
    const d = deps();
    assert.equal(pauseNexoraObjectLifecycle(object, ctx(), d).accepted, false);
    assert.equal(archiveNexoraObject(object, ctx(), d).accepted, false);
    assert.equal(object.lifecycle, "Created");
  });

  it("5. Active objects may pause", () => {
    const object = makeObject("ste-5");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = pauseNexoraObjectLifecycle(object, ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Paused");
  });

  it("6. Paused objects may resume", () => {
    const object = makeObject("ste-6");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    pauseNexoraObjectLifecycle(object, ctx(), d);
    const result = resumeNexoraObjectLifecycle(object, ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Active");
  });

  it("7. Active objects may archive when execution is idle", () => {
    const object = makeObject("ste-7");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = archiveNexoraObject(object, ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Archived");
  });

  it("8. Archived objects may restore to Active", () => {
    const object = makeObject("ste-8");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    archiveNexoraObject(object, ctx(), d);
    const result = restoreNexoraObject(object, ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Active");
  });

  it("9. Deleted is terminal", () => {
    const object = makeObject("ste-9");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "Lock", context: ctx() }, d);
    deleteNexoraObject(object, "terminal", ctx("Workspace"), d);
    assert.equal(object.lifecycle, "Deleted");
    assert.equal(activateNexoraObject(object, ctx(), d).accepted, false);
    assert.equal(restoreNexoraObject(object, ctx(), d).accepted, false);
  });

  it("10. Delete clears interaction state and locks runtime", () => {
    const object = makeObject("ste-10");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "Focus", context: ctx() }, d);
    applyNexoraObjectTransition(object, { type: "Highlight", context: ctx() }, d);
    applyNexoraObjectTransition(object, { type: "Lock", context: ctx() }, d);
    const result = deleteNexoraObject(object, "cleanup", ctx("Workspace"), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.runtime.selected, false);
    assert.equal(result.nextState.runtime.focused, false);
    assert.equal(result.nextState.runtime.highlighted, false);
    assert.equal(result.nextState.runtime.locked, true);
  });

  it("11. Delete requires reason", () => {
    const object = makeObject("ste-11");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "Lock", context: ctx() }, d);
    const result = applyNexoraObjectTransition(
      object,
      { type: "Delete", context: ctx("Workspace") },
      d,
    );
    assert.equal(result.accepted, false);
    assert.ok(
      result.errors.some(
        (e) =>
          e.code === "TRANSITION_REASON_REQUIRED" ||
          e.message.toLowerCase().includes("reason"),
      ),
    );
  });

  it("12. Non-System delete requires prior lock", () => {
    const object = makeObject("ste-12");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = deleteNexoraObject(object, "no-lock", ctx("Workspace"), d);
    assert.equal(result.accepted, false);
    assert.equal(object.lifecycle, "Active");
  });

  it("13. Authorized System delete may bypass prior lock", () => {
    const object = makeObject("ste-13");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = deleteNexoraObject(
      object,
      "system-delete",
      ctx("System", { authorizedSystemMutation: true }),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Deleted");
    assert.equal(result.nextState.runtime.locked, true);
  });

  it("14. Status transitions support all six Seed colors", () => {
    const object = makeObject("ste-14");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    for (const status of ["Green", "Yellow", "Red", "Blue", "White", "Black"] as const) {
      const result = setNexoraObjectStatus(object, status, ctx(), d);
      assert.equal(result.accepted, true, status);
      assert.equal(object.status, status);
    }
  });

  it("15. Reapplying the same status is a no-op", () => {
    const object = makeObject("ste-15");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    setNexoraObjectStatus(object, "Green", ctx(), d);
    const before = createNexoraObjectState(object, d).stateRevision;
    const result = setNexoraObjectStatus(object, "Green", ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.changed, false);
    assert.equal(result.noOp, true);
    assert.equal(createNexoraObjectState(object, d).stateRevision, before);
  });

  it("16. Black status locks the object", () => {
    const object = makeObject("ste-16");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = setNexoraObjectStatus(object, "Black", ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.runtime.locked, true);
  });

  it("17. Changing away from Black does not automatically unlock", () => {
    const object = makeObject("ste-17");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    setNexoraObjectStatus(object, "Black", ctx(), d);
    const result = setNexoraObjectStatus(
      object,
      "White",
      ctx("System", { authorizedSystemMutation: true }),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.status, "White");
    assert.equal(result.nextState.runtime.locked, true);
  });

  it("18. Runtime transitions delegate to NOL-1:3", () => {
    const object = makeObject("ste-18");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = applyNexoraObjectTransition(
      object,
      { type: "Select", context: ctx() },
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(getNexoraObjectRuntimeState(object).selected, true);
    assert.equal(object.runtime.selected, true);
  });

  it("19. Execution transitions delegate to NOL-1:3", () => {
    const object = makeObject("ste-19");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    assert.equal(
      applyNexoraObjectTransition(
        object,
        { type: "PrepareExecution", context: ctx() },
        d,
      ).accepted,
      true,
    );
    assert.equal(
      applyNexoraObjectTransition(
        object,
        { type: "StartExecution", context: ctx() },
        d,
      ).accepted,
      true,
    );
    assert.equal(getNexoraObjectRuntimeState(object).executionState, "Running");
  });

  it("20. Runtime errors are converted without losing diagnostic detail", () => {
    const object = makeObject("ste-20");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "Lock", context: ctx() }, d);
    const result = applyNexoraObjectTransition(
      object,
      { type: "Select", context: ctx("Workspace") },
      d,
    );
    assert.equal(result.accepted, false);
    assert.ok(result.errors.length > 0);
    assert.ok(
      result.errors.some(
        (e) =>
          e.code.includes("LOCKED") ||
          e.message.toLowerCase().includes("lock") ||
          (e.details && JSON.stringify(e.details).includes("LOCKED")),
      ),
    );
  });

  it("21. Running execution is paused during lifecycle Pause", () => {
    const object = makeObject("ste-21");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "PrepareExecution", context: ctx() }, d);
    applyNexoraObjectTransition(object, { type: "StartExecution", context: ctx() }, d);
    const result = pauseNexoraObjectLifecycle(object, ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Paused");
    assert.equal(getNexoraObjectRuntimeState(object).executionState, "Paused");
  });

  it("22. Archive rejects active execution by default", () => {
    const object = makeObject("ste-22");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "PrepareExecution", context: ctx() }, d);
    applyNexoraObjectTransition(object, { type: "StartExecution", context: ctx() }, d);
    const result = archiveNexoraObject(object, ctx(), d);
    assert.equal(result.accepted, false);
    assert.equal(object.lifecycle, "Active");
  });

  it("23. Authorized System may cancel execution and archive atomically", () => {
    const object = makeObject("ste-23");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    applyNexoraObjectTransition(object, { type: "PrepareExecution", context: ctx() }, d);
    applyNexoraObjectTransition(object, { type: "StartExecution", context: ctx() }, d);
    const result = archiveNexoraObject(
      object,
      ctx("System", { authorizedSystemMutation: true }),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.lifecycle, "Archived");
    assert.equal(getNexoraObjectRuntimeState(object).executionState, "Cancelled");
  });

  it("24. Visualization updates affect only visualization", () => {
    const object = makeObject("ste-24");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    object.setMetadata({ tags: ["keep"] });
    object.addRelationship({
      id: "rel-v",
      kind: "related_to",
      toId: "other",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    const meta = JSON.stringify(object.metadata);
    const rels = object.getRelationships().map((r) => r.id);
    const identity = object.identity.id;
    const result = setNexoraObjectVisualizationState(
      object,
      { opacity: 0.5, priority: 3 },
      ctx(),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(object.visualization.opacity, 0.5);
    assert.equal(object.identity.id, identity);
    assert.equal(JSON.stringify(object.metadata), meta);
    assert.deepEqual(object.getRelationships().map((r) => r.id), rels);
  });

  it("25. Executive updates affect only executive state", () => {
    const object = makeObject("ste-25");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const statusBefore = object.status;
    const result = setNexoraObjectExecutiveState(
      object,
      { importance: 40, attentionScore: 70 },
      ctx(),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(object.executive.importance, 40);
    assert.equal(object.executive.attentionScore, 70);
    assert.equal(object.status, statusBefore);
  });

  it("26. Empty visualization and executive patches are no-ops", () => {
    const object = makeObject("ste-26");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const before = createNexoraObjectState(object, d).stateRevision;
    const viz = setNexoraObjectVisualizationState(object, {}, ctx(), d);
    const exec = setNexoraObjectExecutiveState(object, {}, ctx(), d);
    assert.equal(viz.accepted, true);
    assert.equal(viz.changed, false);
    assert.equal(exec.accepted, true);
    assert.equal(exec.changed, false);
    assert.equal(createNexoraObjectState(object, d).stateRevision, before);
  });

  it("27. Composite transitions are atomic", () => {
    const object = makeObject("ste-27");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = applyNexoraObjectCompositeTransition(
      object,
      [
        { type: "SetRed" },
        { type: "Select" },
        { type: "Pause" }, // Active→Paused ok
      ],
      ctx("Runtime", { correlationId: "comp-1" }),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(object.status, "Red");
    assert.equal(object.runtime.selected, true);
    assert.equal(object.lifecycle, "Paused");
  });

  it("28. Nested Composite transitions are rejected", () => {
    const object = makeObject("ste-28");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = applyNexoraObjectTransition(
      object,
      {
        type: "Composite",
        context: ctx(),
        payload: {
          transitions: [
            { type: "SetGreen" },
            {
              type: "Composite",
              payload: { transitions: [{ type: "Select" }] },
            },
          ],
        },
      },
      d,
    );
    assert.equal(result.accepted, false);
    assert.ok(
      result.errors.some((e) => e.code.includes("COMPOSITE") || e.message.includes("Composite")),
    );
  });

  it("29. Composite state revision increments once", () => {
    const object = makeObject("ste-29");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const before = createNexoraObjectState(object, d).stateRevision;
    const result = applyNexoraObjectCompositeTransition(
      object,
      [{ type: "SetYellow" }, { type: "Select" }, { type: "Highlight" }],
      ctx(),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextStateRevision, before + 1);
  });

  it("30. Dry-run produces a plan without mutation", () => {
    const object = makeObject("ste-30");
    const d = deps();
    const before = object.lifecycle;
    const plan = evaluateNexoraObjectTransition(
      object,
      { type: "Activate", dryRun: true, context: ctx() },
      d,
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.dryRun, true);
    assert.equal(plan.projectedState.lifecycle, "Active");
    assert.equal(object.lifecycle, before);
    const applied = applyNexoraObjectTransition(
      object,
      { type: "Activate", dryRun: true, context: ctx() },
      d,
    );
    assert.equal(applied.accepted, true);
    assert.equal(applied.changed, false);
    assert.equal(object.lifecycle, before);
  });

  it("31. Simulation does not mutate the object", () => {
    const object = makeObject("ste-31");
    const d = deps();
    const sim = simulateNexoraObjectTransition(
      object,
      { type: "Activate", context: ctx() },
      d,
    );
    assert.equal(sim.accepted, true);
    assert.equal(object.lifecycle, "Created");
  });

  it("32. Transition sequences produce deterministic projected state", () => {
    const object = makeObject("ste-32");
    const d = deps();
    const a = simulateNexoraObjectTransitionSequence(
      object,
      [{ type: "Activate" }, { type: "SetGreen" }, { type: "Select" }],
      d,
    );
    const b = simulateNexoraObjectTransitionSequence(
      object,
      [{ type: "Activate" }, { type: "SetGreen" }, { type: "Select" }],
      d,
    );
    assert.equal(a.accepted, true);
    assert.equal(b.accepted, true);
    assert.equal(a.finalState.lifecycle, "Active");
    assert.equal(a.finalState.status, "Green");
    assert.equal(a.finalState.runtime.selected, true);
    assert.deepEqual(
      {
        lifecycle: a.finalState.lifecycle,
        status: a.finalState.status,
        selected: a.finalState.runtime.selected,
      },
      {
        lifecycle: b.finalState.lifecycle,
        status: b.finalState.status,
        selected: b.finalState.runtime.selected,
      },
    );
    assert.equal(object.lifecycle, "Created");
  });

  it("33. Expected state revision conflicts are rejected", () => {
    const object = makeObject("ste-33");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const result = applyNexoraObjectTransition(
      object,
      { type: "SetGreen", expectedStateRevision: 0, context: ctx() },
      d,
    );
    assert.equal(result.accepted, false);
    assert.ok(
      result.errors.some((e) => e.code === "TRANSITION_STATE_REVISION_CONFLICT"),
    );
  });

  it("34. Accepted changes increment state revision", () => {
    const object = makeObject("ste-34");
    const d = deps();
    const before = createNexoraObjectState(object, d).stateRevision;
    const result = activateNexoraObject(object, ctx(), d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextStateRevision, before + 1);
  });

  it("35. Rejected and no-op transitions do not increment state revision", () => {
    const object = makeObject("ste-35");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    const before = createNexoraObjectState(object, d).stateRevision;
    const rejected = pauseNexoraObjectLifecycle(
      makeObject("ste-35b"),
      ctx(),
      d,
    );
    assert.equal(rejected.accepted, false);
    setNexoraObjectStatus(object, "Blue", ctx(), d);
    const mid = createNexoraObjectState(object, d).stateRevision;
    const noop = setNexoraObjectStatus(object, "Blue", ctx(), d);
    assert.equal(noop.noOp, true);
    assert.equal(createNexoraObjectState(object, d).stateRevision, mid);
    assert.ok(mid > before);
  });

  it("36. Transition events contain correlation and causation IDs", () => {
    const object = makeObject("ste-36");
    const d = deps();
    const result = activateNexoraObject(
      object,
      ctx("Director", { correlationId: "corr-36", causationId: "cause-36" }),
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.correlationId, "corr-36");
    assert.equal(result.causationId, "cause-36");
    assert.ok(
      result.events.length === 0 ||
        result.events.every(
          (e) =>
            e.correlationId === "corr-36" && e.causationId === "cause-36",
        ),
    );
  });

  it("37. Transition records preserve revision movement", () => {
    const object = makeObject("ste-37");
    const d = deps();
    const result = activateNexoraObject(object, ctx(), d);
    const record = createNexoraObjectTransitionRecord(result);
    assert.equal(record.previousStateRevision, 0);
    assert.equal(record.nextStateRevision, 1);
    assert.equal(record.accepted, true);
    assert.equal(record.changed, true);
    const history = projectNexoraObjectTransitionHistory([record]);
    assert.equal(history.length, 1);
    assert.equal(history[0]?.nextStateRevision, 1);
  });

  it("38. Atomic batch performs no mutations when one request fails", () => {
    const a = makeObject("ste-38a");
    const b = makeObject("ste-38b");
    const d = deps();
    const batch = applyNexoraObjectTransitionBatch(
      [a, b],
      {
        mode: "Atomic",
        transitions: [
          { objectId: "ste-38a", type: "Activate", context: ctx() },
          { objectId: "ste-38b", type: "Pause", context: ctx() },
        ],
      },
      d,
    );
    assert.equal(batch.accepted, false);
    assert.equal(a.lifecycle, "Created");
    assert.equal(b.lifecycle, "Created");
  });

  it("39. BestEffort batch applies valid requests", () => {
    const a = makeObject("ste-39a");
    const b = makeObject("ste-39b");
    const d = deps();
    const batch = applyNexoraObjectTransitionBatch(
      [a, b],
      {
        mode: "BestEffort",
        transitions: [
          { objectId: "ste-39a", type: "Activate", context: ctx() },
          { objectId: "ste-39b", type: "Pause", context: ctx() },
        ],
      },
      d,
    );
    assert.equal(batch.accepted, false);
    assert.equal(a.lifecycle, "Active");
    assert.equal(b.lifecycle, "Created");
    assert.ok(batch.changedObjectIds.includes("ste-39a"));
    assert.ok(batch.rejectedObjectIds.includes("ste-39b"));
  });

  it("40. State serialization and deserialization are reversible", () => {
    const object = makeObject("ste-40");
    const d = deps();
    activateNexoraObject(object, ctx(), d);
    setNexoraObjectStatus(object, "Yellow", ctx(), d);
    const state = createNexoraObjectState(object, d);
    const restored = deserializeNexoraObjectState(serializeNexoraObjectState(state));
    assert.equal(restored.objectId, state.objectId);
    assert.equal(restored.stateRevision, state.stateRevision);
    assert.equal(restored.status, state.status);
    assert.equal(restored.lifecycle, state.lifecycle);
    assert.equal(restored.stateSchemaVersion, stateTransitionSchemaVersion);
  });

  it("41. Unsupported schemas are rejected", () => {
    assert.throws(() =>
      deserializeNexoraObjectState(
        JSON.stringify({
          engineIdentity: stateTransitionEngineIdentity,
          engineVersion: "1.0.0",
          stateSchemaVersion: "9.9.9",
          objectId: "x",
          objectType: "Decision",
          stateRevision: 0,
          status: "White",
          lifecycle: "Created",
          runtime: createNexoraObjectState(makeObject("ste-41"), deps()).runtime,
          visualization: makeObject("ste-41b").visualization,
          executive: createNexoraObjectState(makeObject("ste-41c"), deps()).executive,
          updatedAt: "2026-08-04T12:00:00.000Z",
        }),
      ),
    );
  });

  it("42. State invariants detect corrupted lifecycle/runtime combinations", () => {
    const object = makeObject("ste-42");
    const d = deps();
    const base = createNexoraObjectState(object, d);
    const bad: NexoraObjectState = {
      ...base,
      lifecycle: "Deleted",
      runtime: {
        ...base.runtime,
        locked: false,
        selected: true,
        focused: true,
        executing: true,
        executionState: "Running",
        interactionState: "Focused",
      },
    };
    const validation = validateNexoraObjectState(bad);
    assert.equal(validation.ok, false);
    assert.throws(() => assertNexoraObjectStateInvariants(bad, object.identity.id));
  });

  it("43. Transition helpers never modify identity", () => {
    const object = makeObject("ste-43");
    const d = deps();
    const before = {
      id: object.identity.id,
      type: object.identity.type,
      createdAt: object.identity.createdAt,
    };
    activateNexoraObject(object, ctx(), d);
    setNexoraObjectStatus(object, "Red", ctx(), d);
    applyNexoraObjectTransition(object, { type: "Focus", context: ctx() }, d);
    assert.deepEqual(
      {
        id: object.identity.id,
        type: object.identity.type,
        createdAt: object.identity.createdAt,
      },
      before,
    );
  });

  it("44. Transition helpers never modify metadata or relationships", () => {
    const object = makeObject("ste-44");
    const d = deps();
    object.setMetadata({ tags: ["stable"], notes: ["n"] });
    object.addRelationship({
      id: "rel-44",
      kind: "related_to",
      toId: "peer",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    const meta = JSON.stringify(object.metadata);
    const rels = object.getRelationships().map((r) => r.id);
    activateNexoraObject(object, ctx(), d);
    setNexoraObjectStatus(object, "Green", ctx(), d);
    applyNexoraObjectTransition(object, { type: "Select", context: ctx() }, d);
    assert.equal(JSON.stringify(object.metadata), meta);
    assert.deepEqual(object.getRelationships().map((r) => r.id), rels);
  });

  it("45. the module imports only NOL-1:1, NOL-1:2 and NOL-1:3", () => {
    const source = readFileSync(
      join(__dirname, "universalNexoraObjectStateTransitionEngine.ts"),
      "utf8",
    );
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    assert.ok(imports.length >= 3);
    for (const spec of imports) {
      assert.ok(
        spec.includes("/foundation/universalNexoraObjectFoundation") ||
          spec.includes("/contract/universalNexoraObjectContract") ||
          spec.includes("/runtime/universalNexoraObjectRuntimeModel"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(stateTransitionEngineIdentity, "NOL-1:4/UniversalNexoraObjectStateTransitionEngine");
  });
});
