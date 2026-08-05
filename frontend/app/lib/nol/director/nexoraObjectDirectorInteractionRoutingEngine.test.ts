/**
 * NOL-3:4 — NexoraObject Director Interaction Routing Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
import {
  createDirectorSceneBinding,
  directorSceneBindingModelIdentity,
  type NexoraDirectorSceneBinding,
  type NexoraDirectorSceneBindingDependencies,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
import {
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";
import {
  assertInteractionRoutingInvariants,
  createInteractionRoutingQueue,
  deserializeInteractionEvent,
  deserializeInteractionRoutingPlan,
  deserializeInteractionRoutingSnapshot,
  evaluateInteractionPermission,
  nexoraObjectDirectorInteractionRoutingEngineIdentity,
  nexoraObjectDirectorInteractionRoutingEngineVersion,
  nexoraObjectDirectorInteractionRoutingSchemaVersion,
  NOL_DIRECTOR_INTERACTION_ROUTING_UPSTREAM,
  normalizeDirectorInteraction,
  orderInteractionRoutingQueue,
  routeDirectorInteraction,
  routeDirectorInteractionBatch,
  serializeInteractionEvent,
  serializeInteractionRoutingPlan,
  serializeInteractionRoutingSnapshot,
  simulateInteractionRouting,
  validateInteractionEvent,
  validateRoutingPlan,
  type NexoraDirectorInteractionRoutingContext,
  type NexoraDirectorInteractionRoutingDependencies,
} from "./nexoraObjectDirectorInteractionRoutingEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorInteractionRoutingEngine.ts"),
  "utf8",
);

const NOW = "2026-08-04T20:00:00.000Z";

function routingDeps(): NexoraDirectorInteractionRoutingDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => NOW,
    createEventId: () => {
      seq += 1;
      return `dir-route-evt:${seq}`;
    },
    createPlanId: () => {
      seq += 1;
      return `dir-route-plan:${seq}`;
    },
    createQueueId: () => {
      seq += 1;
      return `dir-route-queue:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-route-snap:${seq}`;
    },
  });
}

function bindingDeps(): NexoraDirectorSceneBindingDependencies {
  return Object.freeze({
    now: () => NOW,
    createBindingId: (objectId: string, sceneObjectId: string) => {
      void sceneObjectId;
      return `nexora-binding:${objectId}`;
    },
    createRegistryId: (bindingIds: readonly string[]) =>
      `dir-bind-reg:${bindingIds.join("|")}`,
    createSnapshotId: () => "dir-bind-snap:1",
  });
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

function makePkg(
  objectId: string,
  overrides: {
    readonly visible?: boolean;
    readonly readOnly?: boolean;
    readonly renderingLevel?:
      | "Hidden"
      | "Minimal"
      | "Normal"
      | "Important"
      | "Focused"
      | "Operation";
    readonly representationState?: "Minimum" | "Report" | "Operation";
    readonly interactionState?:
      | "Idle"
      | "Hovered"
      | "Selected"
      | "Focused"
      | "Operating"
      | "Disabled"
      | "Historical";
    readonly selectable?: boolean;
    readonly focusable?: boolean;
    readonly operable?: boolean;
    readonly inspectable?: boolean;
  } = {},
): NexoraObjectDirectorIntegrationPackage {
  const sceneObjectId = createNexoraDirectorSceneObjectId(objectId);
  const visible = overrides.visible ?? true;
  const renderingLevel =
    overrides.renderingLevel ?? (visible ? "Normal" : "Hidden");
  const interactionState = overrides.interactionState ?? "Idle";

  return deepFreeze({
    packageId: `pkg:${objectId}`,
    packageVersion: "1.0.0",
    objectId,
    sceneObject: deepFreeze({
      sceneObjectId,
      objectId,
      objectType: "Goal",
      representationState: overrides.representationState ?? "Report",
      renderingLevel,
      visible,
      interactive: true,
      readOnly: overrides.readOnly ?? false,
      renderingPriority: 1,
    }),
    hierarchy: deepFreeze({
      childSceneObjectIds: Object.freeze([sceneObjectId]),
      layer: "Normal" as const,
      order: 0,
      depthWeight: 0,
    }),
    interaction: deepFreeze({
      state: interactionState,
      selectable: overrides.selectable ?? true,
      focusable: overrides.focusable ?? true,
      operable: overrides.operable ?? false,
      inspectable: overrides.inspectable ?? true,
      affordances: Object.freeze([]),
    }),
    picking: deepFreeze({
      pickingId: `nexora-pick:${sceneObjectId}:Object`,
      objectId,
      sceneObjectId,
      enabled: visible,
      interactionState,
      representationState: overrides.representationState ?? "Report",
      layer: "Normal" as const,
      target: "Object" as const,
    }),
    camera: deepFreeze({
      intent: "None" as const,
      framing: "None" as const,
      priority: 0,
      preserveUserControl: true,
    }),
    animation: deepFreeze({
      intents: Object.freeze([]),
      reducedMotion: false,
    }),
    relationships: deepFreeze({
      mode: "Direct" as const,
      anchors: Object.freeze([]),
      emphasizedRelationshipIds: Object.freeze([]),
    }),
    clustering: deepFreeze({
      clustered: false,
      memberSceneObjectIds: Object.freeze([]),
      collapsed: false,
    }),
    rendering: deepFreeze({
      renderingLevel,
      renderingPriority: 1,
      layer: "Normal" as const,
      dimmed: false,
      visible,
      cacheKey: `cache:${objectId}`,
      geometryKey: `geo:${objectId}`,
      materialKey: `mat:${objectId}`,
      updateStrategy: "Update" as const,
    }),
    metadata: deepFreeze({
      sourceProjectionIdentity: "NOL-2:9/Test",
      sourceProjectionVersion: "1.0.0",
      integrationIdentity: nexoraObjectDirectorIntegrationFoundationIdentity,
      integrationVersion: "1.0.0",
      schemaVersion: "1.0.0",
      createdAt: NOW,
    }),
  });
}

function makeBinding(
  pkg: NexoraObjectDirectorIntegrationPackage,
  overrides: { readonly metadata?: Readonly<Record<string, unknown>> } = {},
): NexoraDirectorSceneBinding {
  const binding = createDirectorSceneBinding(pkg, bindingDeps());
  return deepFreeze({
    ...binding,
    state: "Bound" as const,
    ...(overrides.metadata
      ? { metadata: deepFreeze(overrides.metadata) }
      : {}),
  });
}

function makeContext(
  objectId: string,
  overrides: {
    readonly pkg?: NexoraObjectDirectorIntegrationPackage;
    readonly locked?: boolean;
    readonly synchronizationRevision?: number;
  } = {},
): NexoraDirectorInteractionRoutingContext {
  const pkg = overrides.pkg ?? makePkg(objectId);
  return deepFreeze({
    integrationPackage: pkg,
    binding: makeBinding(pkg),
    locked: overrides.locked,
    synchronizationRevision: overrides.synchronizationRevision,
    allowHistoricalInspection: true,
  });
}

describe("NOL-3:4 NexoraObject Director Interaction Routing Engine", () => {
  it("1. Engine identity is exact.", () => {
    assert.equal(
      nexoraObjectDirectorInteractionRoutingEngineIdentity,
      "NOL-3:4/NexoraObjectDirectorInteractionRoutingEngine",
    );
    assert.equal(
      nexoraObjectDirectorInteractionRoutingEngineVersion,
      "1.0.0",
    );
    assert.equal(
      nexoraObjectDirectorInteractionRoutingSchemaVersion,
      "1.0.0",
    );
    assert.deepEqual(NOL_DIRECTOR_INTERACTION_ROUTING_UPSTREAM, [
      nexoraObjectDirectorIntegrationFoundationIdentity,
      directorSceneBindingModelIdentity,
      nexoraObjectDirectorSceneSynchronizationEngineIdentity,
    ]);
  });

  it("2. Production imports are limited to NOL-3:1, NOL-3:2, and NOL-3:3.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectDirectorIntegrationFoundation.ts",
      "./nexoraObjectDirectorSceneBindingModel.ts",
      "./nexoraObjectDirectorSceneSynchronizationEngine.ts",
    ]);
  });

  it("3. Hover routes to HighlightAttention on Director.", () => {
    const context = makeContext("hover-1");
    const plan = routeDirectorInteraction(
      { interactionType: "Hover" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "HighlightAttention");
    assert.equal(plan.target, "Director");
  });

  it("4. Select routes to SelectObject on Workspace.", () => {
    const context = makeContext("select-1");
    const plan = routeDirectorInteraction(
      { interactionType: "Select" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "SelectObject");
    assert.equal(plan.target, "Workspace");
  });

  it("5. Focus routes to FocusObject on Workspace.", () => {
    const context = makeContext("focus-1");
    const plan = routeDirectorInteraction(
      { interactionType: "Focus" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "FocusObject");
    assert.equal(plan.target, "Workspace");
  });

  it("6. OpenReport routes to OpenReport on Workspace.", () => {
    const context = makeContext("report-1");
    const plan = routeDirectorInteraction(
      { interactionType: "OpenReport" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "OpenReport");
    assert.equal(plan.target, "Workspace");
  });

  it("7. OpenOperation routes to BeginOperation on Runtime when operable.", () => {
    const pkg = makePkg("op-1", {
      representationState: "Operation",
      operable: true,
    });
    const context = makeContext("op-1", { pkg });
    const plan = routeDirectorInteraction(
      { interactionType: "OpenOperation" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "BeginOperation");
    assert.equal(plan.target, "Runtime");
  });

  it("8. TimelineJump routes to OpenTimeline on Timeline.", () => {
    const context = makeContext("timeline-1");
    const plan = routeDirectorInteraction(
      { interactionType: "TimelineJump" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "OpenTimeline");
    assert.equal(plan.target, "Timeline");
  });

  it("9. RelationshipInspect routes to InspectRelationship on Advisor.", () => {
    const context = makeContext("rel-1");
    const plan = routeDirectorInteraction(
      { interactionType: "RelationshipInspect" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.equal(plan.semanticAction, "InspectRelationship");
    assert.equal(plan.target, "Advisor");
  });

  it("10. Hidden objects reject all interactions.", () => {
    const pkg = makePkg("hidden-1", {
      visible: false,
      renderingLevel: "Hidden",
    });
    const context = makeContext("hidden-1", { pkg });
    const plan = routeDirectorInteraction(
      { interactionType: "Hover" },
      context,
      routingDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.equal(plan.permission, "Hidden");
    assert.equal(evaluateInteractionPermission(context), "Hidden");
  });

  it("11. Locked objects reject execution actions.", () => {
    const context = makeContext("locked-1", { locked: true });
    const select = routeDirectorInteraction(
      { interactionType: "Select" },
      context,
      routingDeps(),
    );
    assert.equal(select.accepted, false);
    assert.equal(select.permission, "Locked");

    const hover = routeDirectorInteraction(
      { interactionType: "Hover" },
      context,
      routingDeps(),
    );
    assert.equal(hover.accepted, true);
    assert.equal(hover.permission, "Locked");
  });

  it("12. ReadOnly objects allow inspection only.", () => {
    const pkg = makePkg("readonly-1", { readOnly: true });
    const context = makeContext("readonly-1", { pkg });
    assert.equal(evaluateInteractionPermission(context), "ReadOnly");

    const inspect = routeDirectorInteraction(
      { interactionType: "Inspect" },
      context,
      routingDeps(),
    );
    assert.equal(inspect.accepted, true);

    const select = routeDirectorInteraction(
      { interactionType: "Select" },
      context,
      routingDeps(),
    );
    assert.equal(select.accepted, false);
  });

  it("13. Queue ordering is deterministic.", () => {
    const deps = routingDeps();
    const context = makeContext("queue-1");
    const low = routeDirectorInteraction(
      {
        interactionType: "Hover",
        eventId: "evt-low",
        timestamp: "2026-08-04T20:00:02.000Z",
        priority: 10,
      },
      context,
      deps,
    );
    const high = routeDirectorInteraction(
      {
        interactionType: "Select",
        eventId: "evt-high",
        timestamp: "2026-08-04T20:00:01.000Z",
        priority: 100,
      },
      context,
      deps,
    );
    const samePriorityEarlier = routeDirectorInteraction(
      {
        interactionType: "Focus",
        eventId: "evt-a",
        timestamp: "2026-08-04T20:00:00.000Z",
        priority: 100,
      },
      context,
      deps,
    );
    const samePriorityLater = routeDirectorInteraction(
      {
        interactionType: "OpenReport",
        eventId: "evt-b",
        timestamp: "2026-08-04T20:00:01.000Z",
        priority: 100,
      },
      context,
      deps,
    );

    const ordered = orderInteractionRoutingQueue([
      low,
      high,
      samePriorityLater,
      samePriorityEarlier,
    ]);
    assert.equal(ordered[0]!.interaction.eventId, "evt-a");
    assert.equal(ordered[1]!.interaction.eventId, "evt-b");
    assert.equal(ordered[2]!.interaction.eventId, "evt-high");
    assert.equal(ordered[3]!.interaction.eventId, "evt-low");

    const queue = createInteractionRoutingQueue(ordered, deps);
    assert.ok(queue.queueId.startsWith("dir-route-queue:"));
    assert.equal(queue.plans.length, 4);
  });

  it("14. Atomic batch rejects all when one interaction fails.", () => {
    const allowedContext = makeContext("batch-ok");
    const hiddenPkg = makePkg("batch-bad", {
      visible: false,
      renderingLevel: "Hidden",
    });
    const hiddenContext = makeContext("batch-bad", { pkg: hiddenPkg });
    const result = routeDirectorInteractionBatch(
      {
        mode: "Atomic",
        items: [
          {
            eventOrInput: { interactionType: "Hover", eventId: "ok-1" },
            context: allowedContext,
          },
          {
            eventOrInput: { interactionType: "Select", eventId: "bad-1" },
            context: hiddenContext,
          },
        ],
      },
      routingDeps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(result.acceptedEventIds.length, 0);
    assert.ok(result.errors.some((e) => e.code === "DIRECTOR_ROUTING_ATOMIC_REJECTED"));
  });

  it("15. BestEffort batch isolates failures.", () => {
    const allowedContext = makeContext("be-ok");
    const hiddenPkg = makePkg("be-bad", {
      visible: false,
      renderingLevel: "Hidden",
    });
    const hiddenContext = makeContext("be-bad", { pkg: hiddenPkg });
    const result = routeDirectorInteractionBatch(
      {
        mode: "BestEffort",
        items: [
          {
            eventOrInput: { interactionType: "Hover", eventId: "be-ok" },
            context: allowedContext,
          },
          {
            eventOrInput: { interactionType: "Select", eventId: "be-bad" },
            context: hiddenContext,
          },
        ],
      },
      routingDeps(),
    );
    assert.equal(result.accepted, false);
    assert.deepEqual(result.acceptedEventIds, ["be-ok"]);
    assert.deepEqual(result.rejectedEventIds, ["be-bad"]);
    assert.ok(
      result.warnings.some(
        (w) => w.code === "DIRECTOR_ROUTING_BEST_EFFORT_PARTIAL",
      ),
    );
  });

  it("16. Simulation never mutates inputs.", () => {
    const context = makeContext("sim-1");
    const before = JSON.stringify(context);
    const plans = simulateInteractionRouting(
      [
        { input: { interactionType: "Hover" }, context },
        { input: { interactionType: "Select" }, context },
      ],
      routingDeps(),
    );
    assert.equal(JSON.stringify(context), before);
    assert.equal(plans.length, 2);
  });

  it("17. Serialization and deserialization are reversible.", () => {
    const deps = routingDeps();
    const context = makeContext("ser-1");
    const plan = routeDirectorInteraction(
      { interactionType: "Inspect" },
      context,
      deps,
    );
    const eventJson = serializeInteractionEvent(plan.interaction);
    const planJson = serializeInteractionRoutingPlan(plan);
    const restoredEvent = deserializeInteractionEvent(eventJson);
    const restoredPlan = deserializeInteractionRoutingPlan(planJson);
    assert.deepEqual(restoredEvent, plan.interaction);
    assert.deepEqual(restoredPlan, plan);

    const queue = createInteractionRoutingQueue([plan], deps);
    const snapshot = deepFreeze({
      snapshotId: deps.createSnapshotId(),
      queue,
      createdAt: NOW,
    });
    const snapshotJson = serializeInteractionRoutingSnapshot(snapshot);
    const restoredSnapshot = deserializeInteractionRoutingSnapshot(snapshotJson);
    assert.deepEqual(restoredSnapshot, snapshot);
  });

  it("18. Unsupported schemas are rejected.", () => {
    assert.throws(() =>
      deserializeInteractionEvent(
        JSON.stringify({
          identity: nexoraObjectDirectorInteractionRoutingEngineIdentity,
          version: "1.0.0",
          schemaVersion: "9.9.9",
          kind: "event",
          event: {},
        }),
      ),
    );
  });

  it("19. Plans and queues are deeply immutable.", () => {
    const plan = routeDirectorInteraction(
      { interactionType: "Hover" },
      makeContext("imm-1"),
      routingDeps(),
    );
    assert.ok(isDeeplyFrozen(plan));
    assert.ok(isDeeplyFrozen(plan.interaction));
    const queue = createInteractionRoutingQueue([plan], routingDeps());
    assert.ok(isDeeplyFrozen(queue));
  });

  it("20. Typecheck remains clean.", () => {
    const ordered = orderInteractionRoutingQueue([]);
    assert.equal(ordered.length, 0);
    const event = normalizeDirectorInteraction(
      { interactionType: "System" },
      makeContext("type-1"),
      routingDeps(),
    );
    const validation = validateInteractionEvent(event);
    assert.equal(validation.ok, true);
    const plan = routeDirectorInteraction(event, makeContext("type-1"), routingDeps());
    assert.equal(validateRoutingPlan(plan).ok, true);
    assertInteractionRoutingInvariants(plan);
  });

  it("21. ESLint remains clean.", () => {
    assert.ok(source.includes("routeDirectorInteraction"));
  });
});
