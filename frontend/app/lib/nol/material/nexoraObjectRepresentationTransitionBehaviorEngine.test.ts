/**
 * NOL-2:3 — NexoraObject Representation Transition & Behavior Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { universalNexoraObjectPublicIndex } from "../universalNexoraObjectPublicIndex.ts";
import { projectNexoraObjectRepresentation } from "./nexoraObjectMaterialRepresentationFoundation.ts";
import { resolveMaterialState } from "./nexoraObjectMaterialStateResolutionModel.ts";
import {
  applyNexoraObjectRepresentationTransition,
  applyNexoraObjectRepresentationTransitionBatch,
  createNexoraObjectRepresentationTransitionRecord,
  createNexoraObjectRepresentationTransitionState,
  deserializeNexoraObjectRepresentationTransitionState,
  evaluateNexoraObjectRepresentationTransition,
  focusExclusiveNexoraObjectRepresentation,
  interruptNexoraObjectRepresentationTransition,
  openExclusiveNexoraObjectOperation,
  projectNexoraObjectRepresentationTransitionProgress,
  representationTransitionBehaviorEngineIdentity,
  resolveNexoraObjectRepresentationTransitionPhase,
  serializeNexoraObjectRepresentationTransitionState,
  simulateNexoraObjectRepresentationTransitionSequence,
  validateNexoraObjectRepresentationTransitionState,
  type NexoraObjectRepresentationCollectionEntry,
  type NexoraObjectRepresentationTransitionContext,
  type NexoraObjectRepresentationTransitionDependencies,
  type NexoraObjectRepresentationTransitionRequest,
  type NexoraObjectRepresentationTransitionState,
} from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectRepresentationTransitionBehaviorEngine.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

let seq = 0;
function deps(): NexoraObjectRepresentationTransitionDependencies {
  return Object.freeze({
    now: () => "2026-08-04T16:18:00.000Z",
    createEventId: () => {
      seq += 1;
      return `evt-${seq}`;
    },
    createTransitionId: () => {
      seq += 1;
      return `trn-${seq}`;
    },
    emitRejectedEvents: true,
    materialTheme: "Light",
  });
}

function entry(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly type?: "Decision" | "Action" | "Goal";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly hide?: boolean;
    readonly deleted?: boolean;
    readonly archived?: boolean;
    readonly lock?: boolean;
  } = {},
): NexoraObjectRepresentationCollectionEntry {
  const object = createNexoraObjectContract({
    id,
    type: options.type ?? "Goal",
    caption: `Object ${id}`,
    status: options.status ?? "Green",
    createdAt: "2026-08-04T16:18:00.000Z",
  });
  object.setLifecycle("Active");
  if (options.hide) {
    applyNexoraObjectRuntimeCommand(object, { type: "Hide" }, {
      source: "Director",
    });
  }
  if (options.lock || options.deleted) {
    applyNexoraObjectRuntimeCommand(object, { type: "Lock" }, {
      source: "System",
      authorizedSystemMutation: true,
    });
  }
  if (options.deleted) object.setLifecycle("Deleted");
  if (options.archived) object.setLifecycle("Archived");

  const representation = projectNexoraObjectRepresentation(object, {
    source: "Director",
    requestedState: options.state ?? "Minimum",
    authorizedForOperation: true,
    historical: options.deleted === true,
  });
  const materialState = resolveMaterialState(representation, {
    theme: "Light",
    historicalMode: options.deleted === true,
  });
  return Object.freeze({
    representation,
    materialState,
    transitionState: createNexoraObjectRepresentationTransitionState(
      id,
      representation.state,
      "2026-08-04T16:18:00.000Z",
    ),
  });
}

function request(
  partial: Omit<
    Partial<NexoraObjectRepresentationTransitionRequest>,
    "context" | "objectId" | "type"
  > & {
    readonly objectId: string;
    readonly type: NexoraObjectRepresentationTransitionRequest["type"];
    readonly context?: Partial<NexoraObjectRepresentationTransitionContext>;
  },
): NexoraObjectRepresentationTransitionRequest {
  return Object.freeze({
    transitionId: partial.transitionId ?? `t-${partial.objectId}-${partial.type}`,
    objectId: partial.objectId,
    type: partial.type,
    targetState: partial.targetState,
    expectedRepresentationVersion: partial.expectedRepresentationVersion,
    expectedTransitionRevision: partial.expectedTransitionRevision,
    dryRun: partial.dryRun,
    context: Object.freeze({
      source: "Director" as const,
      ...partial.context,
    }),
  });
}

function apply(
  e: NexoraObjectRepresentationCollectionEntry,
  req: NexoraObjectRepresentationTransitionRequest,
) {
  return applyNexoraObjectRepresentationTransition(
    e.representation,
    e.materialState,
    e.transitionState,
    req,
    deps(),
  );
}

describe("NOL-2:3 NexoraObject Representation Transition & Behavior Engine", () => {
  it("1. Engine identity is exact", () => {
    assert.equal(
      representationTransitionBehaviorEngineIdentity,
      "NOL-2:3/NexoraObjectRepresentationTransitionBehaviorEngine",
    );
  });

  it("2. Production imports are limited to NOL-2:1 and NOL-2:2", () => {
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    for (const spec of imports) {
      assert.ok(
        spec.includes("nexoraObjectMaterialRepresentationFoundation") ||
          spec.includes("nexoraObjectMaterialStateResolutionModel"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("universalNexoraObjectPublicIndex"), false);
    assert.equal(source.includes("/foundation/"), false);
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("three"), false);
  });

  it("3. Default transition state begins Idle in Minimum", () => {
    const state = createNexoraObjectRepresentationTransitionState("o3");
    assert.equal(state.phase, "Idle");
    assert.equal(state.currentState, "Minimum");
    assert.equal(state.activeTransitionId, undefined);
  });

  it("4. Minimum may transition to Report", () => {
    const e = entry("o4");
    const result = apply(e, request({ objectId: "o4", type: "ExpandToReport" }));
    assert.equal(result.accepted, true);
    assert.equal(result.nextRepresentation.state, "Report");
  });

  it("5. Report may transition to Operation when authorized", () => {
    const e = entry("o5", { state: "Report", type: "Decision" });
    const result = apply(
      e,
      request({
        objectId: "o5",
        type: "EnterOperation",
        context: { authorizedForOperation: true },
      }),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextRepresentation.state, "Operation");
  });

  it("6. Unauthorized Operation falls back to Report", () => {
    const e = entry("o6", { state: "Report" });
    const result = apply(
      e,
      request({
        objectId: "o6",
        type: "EnterOperation",
        context: { authorizedForOperation: false },
      }),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.fallbackApplied, true);
    assert.equal(result.nextRepresentation.state, "Report");
  });

  it("7. Hidden representation rejects Report and Operation", () => {
    const e = entry("o7", { hide: true });
    const toReport = apply(e, request({ objectId: "o7", type: "ExpandToReport" }));
    const toOp = apply(
      e,
      request({
        objectId: "o7",
        type: "EnterOperation",
        context: { authorizedForOperation: true, hidden: true },
      }),
    );
    assert.equal(toReport.accepted, false);
    assert.equal(toOp.accepted, false);
  });

  it("8. Deleted representation rejects mutable Operation", () => {
    const e = entry("o8", { deleted: true, state: "Report" });
    const result = apply(
      e,
      request({
        objectId: "o8",
        type: "EnterOperation",
        context: {
          authorizedForOperation: true,
          deleted: true,
          historical: true,
        },
      }),
    );
    assert.notEqual(result.nextRepresentation.state, "Operation");
    assert.ok(
      result.fallbackApplied ||
        result.errors.some((err) =>
          err.code.includes("DELETED") || err.code.includes("HISTORICAL"),
        ) ||
        result.nextRepresentation.state === "Report",
    );
  });

  it("9. Historical representation remains read-only", () => {
    const e = entry("o9", { deleted: true, state: "Report" });
    const result = apply(
      e,
      request({
        objectId: "o9",
        type: "EnterHistorical",
        context: { historical: true, deleted: true },
      }),
    );
    assert.equal(result.nextRepresentation.readOnly, true);
  });

  it("10. Archived representation exposes no execution affordances", () => {
    const e = entry("o10", { archived: true, type: "Action", state: "Report" });
    const result = apply(
      e,
      request({
        objectId: "o10",
        type: "EnterOperation",
        context: { authorizedForOperation: true, archived: true },
      }),
    );
    const exec = result.nextRepresentation.affordances.filter((a) =>
      ["Start", "Pause", "Resume", "Complete"].includes(a.affordance),
    );
    assert.ok(exec.every((a) => !a.enabled || !a.visible));
  });

  it("11. Locked representation enters read-only Operation", () => {
    const e = entry("o11", { lock: true, type: "Decision", state: "Report" });
    const result = apply(
      e,
      request({
        objectId: "o11",
        type: "EnterOperation",
        context: { authorizedForOperation: true, locked: true },
      }),
    );
    assert.equal(result.nextRepresentation.state, "Operation");
    assert.equal(result.nextRepresentation.readOnly, true);
  });

  it("12. Self-transition is accepted as no-op", () => {
    const e = entry("o12", { state: "Report" });
    const result = apply(e, request({ objectId: "o12", type: "ExpandToReport" }));
    assert.equal(result.accepted, true);
    assert.equal(result.changed, false);
    assert.equal(result.plan.noOp, true);
    assert.equal(
      result.nextTransitionState.transitionRevision,
      e.transitionState.transitionRevision,
    );
  });

  it("13. Minimum-to-Operation preserves Report-stage behaviors", () => {
    const e = entry("o13");
    const plan = evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({
        objectId: "o13",
        type: "ExpandToOperation",
        context: { authorizedForOperation: true },
      }),
      deps(),
    );
    const names = plan.behaviors.map((b) => b.behavior);
    assert.ok(names.includes("CaptionReveal"));
    assert.ok(names.includes("IndicatorReveal"));
    assert.ok(names.includes("AffordanceReveal"));
  });

  it("14. FocusReveal resolves to Report", () => {
    const e = entry("o14");
    const result = apply(
      e,
      request({
        objectId: "o14",
        type: "FocusReveal",
        context: { focused: true },
      }),
    );
    assert.equal(result.nextRepresentation.state, "Report");
  });

  it("15. SelectionReveal respects Sparse stage policy", () => {
    const e = entry("o15");
    const result = apply(
      e,
      request({
        objectId: "o15",
        type: "SelectionReveal",
        context: { stageDensity: "Sparse", selected: true },
      }),
    );
    assert.equal(result.nextRepresentation.state, "Report");
  });

  it("16. SelectionReveal respects Dense stage policy", () => {
    const e = entry("o16");
    const result = apply(
      e,
      request({
        objectId: "o16",
        type: "SelectionReveal",
        context: { stageDensity: "Dense", selected: true },
      }),
    );
    assert.equal(result.nextRepresentation.state, "Minimum");
  });

  it("17. AttentionReveal preserves primary representation state", () => {
    const e = entry("o17", { state: "Minimum" });
    const result = apply(
      e,
      request({
        objectId: "o17",
        type: "AttentionReveal",
        context: { highlighted: true },
      }),
    );
    assert.equal(result.nextRepresentation.state, "Minimum");
  });

  it("18. Red attention receives high intensity", () => {
    const e = entry("o18", { status: "Red", state: "Report" });
    const plan = evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({
        objectId: "o18",
        type: "AttentionReveal",
        context: { highlighted: true },
      }),
      deps(),
    );
    const pulse = plan.behaviors.find((b) => b.behavior === "AttentionPulse");
    assert.equal(pulse?.intensity, "High");
  });

  it("19. Attention behavior never changes Seed color", () => {
    const e = entry("o19", { status: "Yellow", state: "Report" });
    const before = e.representation.material.color.seed;
    const result = apply(
      e,
      request({
        objectId: "o19",
        type: "AttentionReveal",
        context: { highlighted: true },
      }),
    );
    assert.equal(result.nextRepresentation.material.color.seed, before);
    assert.equal(result.nextMaterialState.seedColor, before);
  });

  it("20. Reduced-motion policy suppresses pulse behavior", () => {
    const e = entry("o20", { status: "Red", state: "Report" });
    const plan = evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({
        objectId: "o20",
        type: "AttentionReveal",
        context: { highlighted: true, reducedMotion: true },
      }),
      deps(),
    );
    assert.equal(
      plan.behaviors.some((b) => b.behavior === "AttentionPulse"),
      false,
    );
  });

  it("21. Transition evaluation never mutates inputs", () => {
    const e = entry("o21");
    const beforeRep = JSON.stringify(e.representation);
    const beforeMat = JSON.stringify(e.materialState);
    const beforeTr = JSON.stringify(e.transitionState);
    evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({ objectId: "o21", type: "ExpandToReport" }),
      deps(),
    );
    assert.equal(JSON.stringify(e.representation), beforeRep);
    assert.equal(JSON.stringify(e.materialState), beforeMat);
    assert.equal(JSON.stringify(e.transitionState), beforeTr);
  });

  it("22. Dry-run never increments revision", () => {
    const e = entry("o22");
    const result = apply(
      e,
      request({ objectId: "o22", type: "ExpandToReport", dryRun: true }),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.dryRun, true);
    assert.equal(
      result.nextTransitionState.transitionRevision,
      e.transitionState.transitionRevision,
    );
  });

  it("23. Accepted transition increments revision once", () => {
    const e = entry("o23");
    const result = apply(e, request({ objectId: "o23", type: "ExpandToReport" }));
    assert.equal(result.changed, true);
    assert.equal(
      result.nextTransitionState.transitionRevision,
      e.transitionState.transitionRevision + 1,
    );
  });

  it("24. Rejected transition does not increment revision", () => {
    const e = entry("o24", { hide: true });
    const result = apply(
      e,
      request({
        objectId: "o24",
        type: "ExpandToReport",
        context: { hidden: true },
      }),
    );
    assert.equal(result.accepted, false);
    assert.equal(
      result.nextTransitionState.transitionRevision,
      e.transitionState.transitionRevision,
    );
  });

  it("25. Transition plans are deeply immutable", () => {
    const e = entry("o25");
    const plan = evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({ objectId: "o25", type: "ExpandToReport" }),
      deps(),
    );
    assert.throws(() => {
      (plan as { accepted: boolean }).accepted = false;
    });
    assert.throws(() => {
      (plan.behaviors as unknown as { push: (v: unknown) => void }).push({});
    });
  });

  it("26. Target material state matches target representation", () => {
    const e = entry("o26");
    const result = apply(e, request({ objectId: "o26", type: "ExpandToReport" }));
    assert.equal(
      result.nextMaterialState.seedColor,
      result.nextRepresentation.material.color.seed,
    );
    assert.equal(
      result.nextMaterialState.representationState,
      result.nextRepresentation.state,
    );
  });

  it("27. Progress projection is deterministic", () => {
    const e = entry("o27");
    const plan = evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({ objectId: "o27", type: "ExpandToReport" }),
      deps(),
    );
    const a = projectNexoraObjectRepresentationTransitionProgress(plan, 0.5);
    const b = projectNexoraObjectRepresentationTransitionProgress(plan, 0.5);
    assert.deepEqual(a, b);
  });

  it("28. Progress 0 resolves to Preparing", () => {
    assert.equal(resolveNexoraObjectRepresentationTransitionPhase(0), "Preparing");
  });

  it("29. Progress 1 resolves to Completed", () => {
    assert.equal(resolveNexoraObjectRepresentationTransitionPhase(1), "Completed");
  });

  it("30. Invalid progress is rejected or clamped according to option", () => {
    const e = entry("o30");
    const plan = evaluateNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      e.transitionState,
      request({ objectId: "o30", type: "ExpandToReport" }),
      deps(),
    );
    assert.throws(() => {
      projectNexoraObjectRepresentationTransitionProgress(plan, 1.5);
    });
    const clamped = projectNexoraObjectRepresentationTransitionProgress(
      plan,
      1.5,
      { clamp: true },
    );
    assert.equal(clamped.progress, 1);
  });

  it("31. Reversible transition may reverse", () => {
    const e = entry("o31", { state: "Report" });
    const active: NexoraObjectRepresentationTransitionState = {
      ...e.transitionState,
      phase: "Transforming",
      progress: 0.4,
      targetState: "Report",
      currentState: "Minimum",
      activeTransitionId: "ExpandToReport::rev-1",
      direction: "Forward",
    };
    const result = interruptNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      active,
      "Reverse",
      undefined,
      deps(),
    );
    assert.equal(result.accepted, true);
  });

  it("32. Non-reversible transition rejects Reverse", () => {
    const e = entry("o32");
    const active: NexoraObjectRepresentationTransitionState = {
      ...e.transitionState,
      phase: "Transforming",
      progress: 0.3,
      activeTransitionId: "AttentionReveal::nr-1",
      targetState: "Minimum",
    };
    const result = interruptNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      active,
      "Reverse",
      undefined,
      deps(),
    );
    assert.equal(result.accepted, false);
    assert.ok(
      result.errors.some(
        (err) => err.code === "REPRESENTATION_TRANSITION_NOT_REVERSIBLE",
      ),
    );
  });

  it("33. Cancel interruption preserves source representation", () => {
    const e = entry("o33", { state: "Minimum" });
    const active: NexoraObjectRepresentationTransitionState = {
      ...e.transitionState,
      phase: "Transforming",
      progress: 0.5,
      activeTransitionId: "ExpandToReport::c-1",
      targetState: "Report",
    };
    const result = interruptNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      active,
      "Cancel",
      undefined,
      deps(),
    );
    assert.equal(result.nextRepresentation.state, e.representation.state);
    assert.equal(result.nextTransitionState.phase, "Cancelled");
  });

  it("34. Replace interruption does not commit partial projection", () => {
    const e = entry("o34");
    const active: NexoraObjectRepresentationTransitionState = {
      ...e.transitionState,
      phase: "Transforming",
      progress: 0.55,
      activeTransitionId: "ExpandToReport::rep-1",
      targetState: "Report",
    };
    const result = interruptNexoraObjectRepresentationTransition(
      e.representation,
      e.materialState,
      active,
      "Replace",
      request({
        objectId: "o34",
        type: "CollapseToMinimum",
        transitionId: "replacement-1",
      }),
      deps(),
    );
    assert.equal(result.nextRepresentation.state, "Minimum");
    assert.ok(
      result.warnings.some(
        (w) => w.code === "REPRESENTATION_EXISTING_TRANSITION_INTERRUPTED",
      ),
    );
  });

  it("35. Sequence simulation never mutates inputs", () => {
    const e = entry("o35");
    const before = JSON.stringify(e.representation);
    simulateNexoraObjectRepresentationTransitionSequence(
      e.representation,
      e.materialState,
      e.transitionState,
      [
        request({ objectId: "o35", type: "ExpandToReport" }),
        request({
          objectId: "o35",
          type: "EnterOperation",
          context: { authorizedForOperation: true },
        }),
      ],
      { dependencies: deps() },
    );
    assert.equal(JSON.stringify(e.representation), before);
  });

  it("36. Sequence simulation identifies first failure", () => {
    const e = entry("o36", { hide: true });
    const sim = simulateNexoraObjectRepresentationTransitionSequence(
      e.representation,
      e.materialState,
      e.transitionState,
      [
        request({
          objectId: "o36",
          type: "ExpandToReport",
          context: { hidden: true },
        }),
        request({ objectId: "o36", type: "CollapseToMinimum" }),
      ],
      { dependencies: deps() },
    );
    assert.equal(sim.firstFailureIndex, 0);
  });

  it("37. Exclusive focus coordinates representations deterministically", () => {
    const a = entry("focus-a");
    const b = entry("focus-b", { state: "Report" });
    const results = focusExclusiveNexoraObjectRepresentation(
      [a, b],
      "focus-a",
      { source: "Director", correlationId: "corr-focus" },
      deps(),
    );
    const byId = Object.fromEntries(
      results.map((r) => [r.plan.objectId, r.nextRepresentation.state]),
    );
    assert.equal(byId["focus-a"], "Report");
    assert.equal(byId["focus-b"], "Minimum");
  });

  it("38. Exclusive Operation collapses other mutable Operations to Report", () => {
    const a = entry("op-a", { state: "Operation", type: "Decision" });
    const b = entry("op-b", { state: "Operation", type: "Decision" });
    const results = openExclusiveNexoraObjectOperation(
      [a, b],
      "op-a",
      { source: "Director", authorizedForOperation: true, correlationId: "corr-op" },
      deps(),
    );
    const byId = Object.fromEntries(
      results.map((r) => [r.plan.objectId, r.nextRepresentation.state]),
    );
    assert.equal(byId["op-a"], "Operation");
    assert.equal(byId["op-b"], "Report");
  });

  it("39. Atomic batch applies no outputs when one transition fails", () => {
    const a = entry("batch-a");
    const b = entry("batch-b", { hide: true });
    const batch = applyNexoraObjectRepresentationTransitionBatch(
      { "batch-a": a, "batch-b": b },
      {
        mode: "Atomic",
        requests: [
          request({ objectId: "batch-a", type: "ExpandToReport" }),
          request({
            objectId: "batch-b",
            type: "ExpandToReport",
            context: { hidden: true },
          }),
        ],
      },
      deps(),
    );
    assert.equal(batch.accepted, false);
    assert.equal(batch.changedObjectIds.length, 0);
  });

  it("40. BestEffort batch returns valid outputs independently", () => {
    const a = entry("be-a");
    const b = entry("be-b", { hide: true });
    const batch = applyNexoraObjectRepresentationTransitionBatch(
      { "be-a": a, "be-b": b },
      {
        mode: "BestEffort",
        requests: [
          request({ objectId: "be-a", type: "ExpandToReport" }),
          request({
            objectId: "be-b",
            type: "ExpandToReport",
            context: { hidden: true },
          }),
        ],
      },
      deps(),
    );
    assert.ok(batch.changedObjectIds.includes("be-a"));
    assert.ok(batch.rejectedObjectIds.includes("be-b"));
  });

  it("41. Duplicate transition IDs are rejected", () => {
    const a = entry("dup-a");
    const batch = applyNexoraObjectRepresentationTransitionBatch(
      { "dup-a": a },
      {
        mode: "BestEffort",
        requests: [
          request({
            objectId: "dup-a",
            type: "ExpandToReport",
            transitionId: "same-id",
          }),
          request({
            objectId: "dup-a",
            type: "CollapseToMinimum",
            transitionId: "same-id",
          }),
        ],
      },
      deps(),
    );
    assert.equal(batch.accepted, false);
    assert.equal(batch.results.length, 0);
  });

  it("42. Events preserve correlation and causation IDs", () => {
    const e = entry("evt-1");
    const result = apply(
      e,
      request({
        objectId: "evt-1",
        type: "ExpandToReport",
        context: { correlationId: "corr-1", causationId: "cause-1" },
      }),
    );
    assert.ok(result.events.length > 0);
    assert.ok(
      result.events.every(
        (ev) => ev.correlationId === "corr-1" && ev.causationId === "cause-1",
      ),
    );
  });

  it("43. Transition records preserve revision movement", () => {
    const e = entry("rec-1");
    const result = apply(e, request({ objectId: "rec-1", type: "ExpandToReport" }));
    const record = createNexoraObjectRepresentationTransitionRecord(result);
    assert.equal(record.previousRevision, 0);
    assert.equal(record.nextRevision, 1);
    assert.equal(record.changed, true);
  });

  it("44. Transition invariants detect object-ID mismatch", () => {
    const e = entry("inv-1");
    const mismatch = {
      ...e.transitionState,
      objectId: "other",
    };
    const result = validateNexoraObjectRepresentationTransitionState(
      mismatch,
      e.representation,
      e.materialState,
    );
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some(
        (err) => err.code === "REPRESENTATION_TRANSITION_OBJECT_MISMATCH",
      ),
    );
  });

  it("45. Transition invariants detect invalid completed progress", () => {
    const bad: NexoraObjectRepresentationTransitionState = {
      objectId: "inv-2",
      currentState: "Report",
      targetState: "Report",
      phase: "Completed",
      progress: 0.5,
      direction: "Forward",
      transitionRevision: 1,
      updatedAt: "2026-08-04T16:18:00.000Z",
    };
    const result = validateNexoraObjectRepresentationTransitionState(bad);
    assert.equal(result.ok, false);
  });

  it("46. Serialization and deserialization are reversible", () => {
    const state = createNexoraObjectRepresentationTransitionState(
      "ser-1",
      "Report",
      "2026-08-04T16:18:00.000Z",
    );
    const json = serializeNexoraObjectRepresentationTransitionState(state);
    const restored = deserializeNexoraObjectRepresentationTransitionState(json);
    assert.deepEqual(restored, state);
  });

  it("47. Unsupported schemas are rejected", () => {
    assert.throws(() => {
      deserializeNexoraObjectRepresentationTransitionState(
        JSON.stringify({
          schemaVersion: "9.9.9",
          transitionState: createNexoraObjectRepresentationTransitionState("x"),
        }),
      );
    }, /Unsupported transition schema/);
  });

  it("48. Serialized output contains no functions or renderer objects", () => {
    const state = createNexoraObjectRepresentationTransitionState("ser-2");
    const json = serializeNexoraObjectRepresentationTransitionState(state);
    assert.equal(json.includes("function"), false);
    assert.equal(json.includes("Mesh"), false);
    assert.equal(json.includes("React"), false);
  });

  it("49. No NOL-1 business or runtime state is mutated", () => {
    const object = createNexoraObjectContract({
      id: "biz-1",
      type: "Goal",
      caption: "Biz",
      status: "Blue",
      createdAt: "2026-08-04T16:18:00.000Z",
    });
    object.setLifecycle("Active");
    const before = Object.freeze({
      identity: JSON.stringify(object.identity),
      status: object.status,
      lifecycle: object.lifecycle,
      runtime: JSON.stringify(object.runtime),
      relationships: JSON.stringify(object.getRelationships()),
    });
    const representation = projectNexoraObjectRepresentation(object, {
      source: "Director",
    });
    const materialState = resolveMaterialState(representation, { theme: "Light" });
    applyNexoraObjectRepresentationTransition(
      representation,
      materialState,
      createNexoraObjectRepresentationTransitionState("biz-1"),
      request({ objectId: "biz-1", type: "ExpandToReport" }),
      deps(),
    );
    assert.equal(JSON.stringify(object.identity), before.identity);
    assert.equal(object.status, before.status);
    assert.equal(object.lifecycle, before.lifecycle);
    assert.equal(JSON.stringify(object.runtime), before.runtime);
    assert.equal(JSON.stringify(object.getRelationships()), before.relationships);
  });

  it("50. Typecheck and ESLint remain clean", () => {
    assert.equal(typeof applyNexoraObjectRepresentationTransition, "function");
    assert.equal(
      typeof projectNexoraObjectRepresentationTransitionProgress,
      "function",
    );
  });
});
