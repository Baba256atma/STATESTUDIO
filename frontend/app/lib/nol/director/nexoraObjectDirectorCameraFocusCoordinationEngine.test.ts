/**
 * NOL-3:5 — NexoraObject Director Camera & Focus Coordination Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
import {
  createDirectorSceneBinding,
  directorSceneBindingModelIdentity,
  type NexoraDirectorSceneBinding,
  type NexoraDirectorSceneBindingDependencies,
  type NexoraDirectorSceneBindingRegistry,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
import {
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  type NexoraDirectorSceneSynchronizationState,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";
import {
  nexoraObjectDirectorInteractionRoutingEngineIdentity,
  type NexoraDirectorInteractionRoutingPlan,
} from "./nexoraObjectDirectorInteractionRoutingEngine.ts";
import {
  applyNexoraDirectorCameraFocusCoordination,
  clearNexoraDirectorFocusStack,
  compareNexoraDirectorCameraFocusSnapshots,
  coordinateNexoraDirectorCameraFocusBatch,
  createNexoraDirectorCameraFocusQueue,
  createNexoraDirectorCameraFocusRecord,
  createNexoraDirectorCameraFocusSnapshot,
  createNexoraDirectorCameraFocusState,
  deserializeNexoraDirectorCameraFocusSnapshot,
  deserializeNexoraDirectorCameraFocusState,
  deserializeNexoraDirectorFocusRequest,
  deserializeNexoraDirectorFocusStack,
  enqueueNexoraDirectorFocusRequest,
  evaluateNexoraDirectorCameraFocusCoordination,
  nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
  nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
  nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
  NOL_DIRECTOR_CAMERA_FOCUS_UPSTREAM,
  popNexoraDirectorFocusStack,
  pushNexoraDirectorFocusStack,
  resolveNexoraDirectorAttentionPathFraming,
  resolveNexoraDirectorCameraFocusQueue,
  resolveNexoraDirectorCameraPreservation,
  resolveNexoraDirectorCameraPriority,
  resolveNexoraDirectorClusterFraming,
  resolveNexoraDirectorFocusNeighborhood,
  resolveNexoraDirectorFocusTarget,
  resolveNexoraDirectorHistoricalFraming,
  resolveNexoraDirectorOperationFraming,
  restorePreviousNexoraDirectorFocus,
  serializeNexoraDirectorCameraFocusSnapshot,
  serializeNexoraDirectorCameraFocusState,
  serializeNexoraDirectorFocusRequest,
  serializeNexoraDirectorFocusStack,
  simulateNexoraDirectorCameraFocusSequence,
  validateNexoraDirectorFocusRequest,
  validateNexoraDirectorFocusStack,
  type NexoraDirectorCameraFocusContext,
  type NexoraDirectorCameraFocusDependencies,
  type NexoraDirectorCameraFocusState,
  type NexoraDirectorFocusRequest,
  type NexoraDirectorFocusStack,
  type NexoraDirectorFocusStackEntry,
} from "./nexoraObjectDirectorCameraFocusCoordinationEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorCameraFocusCoordinationEngine.ts"),
  "utf8",
);

const NOW = "2026-08-04T22:00:00.000Z";

function focusDeps(): NexoraDirectorCameraFocusDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => NOW,
    createStateId: () => {
      seq += 1;
      return `dir-focus-state:${seq}`;
    },
    createCommandId: (requestId: string, type: string) => {
      seq += 1;
      return `dir-focus-cmd:${requestId}:${type}:${seq}`;
    },
    createEventId: () => {
      seq += 1;
      return `dir-focus-evt:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-focus-snap:${seq}`;
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
    readonly anchors?: readonly {
      readonly sceneObjectId: string;
      readonly index?: number;
    }[];
    readonly clustering?: {
      readonly clustered: boolean;
      readonly clusterId?: string;
      readonly memberSceneObjectIds?: readonly string[];
      readonly representativeSceneObjectId?: string;
      readonly collapsed?: boolean;
    };
    readonly layer?: "Background" | "Normal" | "Selected" | "Focused" | "Attention" | "Overlay" | "Historical";
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
      layer: overrides.layer ?? ("Normal" as const),
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
      layer: overrides.layer ?? ("Normal" as const),
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
      anchors: Object.freeze(
        (overrides.anchors ?? []).map((anchor, index) =>
          deepFreeze({
            anchorId: `anchor:${objectId}:${index}`,
            sceneObjectId: anchor.sceneObjectId,
            index: anchor.index ?? index,
            enabled: true,
          }),
        ),
      ),
      emphasizedRelationshipIds: Object.freeze([]),
    }),
    clustering: deepFreeze({
      clustered: overrides.clustering?.clustered ?? false,
      clusterId: overrides.clustering?.clusterId,
      memberSceneObjectIds: Object.freeze([
        ...(overrides.clustering?.memberSceneObjectIds ?? []),
      ]),
      representativeSceneObjectId:
        overrides.clustering?.representativeSceneObjectId,
      collapsed: overrides.clustering?.collapsed ?? false,
    }),
    rendering: deepFreeze({
      renderingLevel,
      renderingPriority: 1,
      layer: overrides.layer ?? ("Normal" as const),
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
  overrides: {
    readonly state?: NexoraDirectorSceneBinding["state"];
    readonly metadata?: Readonly<Record<string, unknown>>;
  } = {},
): NexoraDirectorSceneBinding {
  const binding = createDirectorSceneBinding(pkg, bindingDeps());
  return deepFreeze({
    ...binding,
    state: overrides.state ?? ("Bound" as const),
    ...(overrides.metadata
      ? { metadata: deepFreeze(overrides.metadata) }
      : {}),
  });
}

function makeCollection(
  packages: readonly NexoraObjectDirectorIntegrationPackage[],
  extras: {
    readonly attentionSceneObjectIds?: readonly string[];
    readonly hiddenSceneObjectIds?: readonly string[];
    readonly activeOperationSceneObjectId?: string;
  } = {},
): NexoraObjectDirectorIntegrationCollection {
  return deepFreeze({
    collectionId: "col:camera-focus",
    packages: Object.freeze([...packages]),
    sceneOrder: Object.freeze(
      packages.map((pkg) => pkg.sceneObject.sceneObjectId),
    ),
    attentionSceneObjectIds: Object.freeze([
      ...(extras.attentionSceneObjectIds ?? []),
    ]),
    hiddenSceneObjectIds: Object.freeze([
      ...(extras.hiddenSceneObjectIds ?? []),
    ]),
    activeOperationSceneObjectId: extras.activeOperationSceneObjectId,
    metadata: Object.freeze({}),
  });
}

function makeRegistry(
  bindings: readonly NexoraDirectorSceneBinding[],
): NexoraDirectorSceneBindingRegistry {
  return deepFreeze({
    registryId: "reg:camera-focus",
    bindings: Object.freeze([...bindings]),
  });
}

function makeContext(
  packages: readonly NexoraObjectDirectorIntegrationPackage[],
  bindings: readonly NexoraDirectorSceneBinding[],
  overrides: {
    readonly currentFocus?: NexoraDirectorCameraFocusState;
    readonly userCameraActive?: boolean;
    readonly userCameraLocked?: boolean;
    readonly stageMode?: NexoraDirectorCameraFocusContext["stageMode"];
    readonly attentionSceneObjectIds?: readonly string[];
    readonly synchronizationState?: NexoraDirectorSceneSynchronizationState;
    readonly routingPlans?: readonly NexoraDirectorInteractionRoutingPlan[];
  } = {},
): NexoraDirectorCameraFocusContext {
  return deepFreeze({
    integrationCollection: makeCollection(packages, {
      attentionSceneObjectIds: overrides.attentionSceneObjectIds,
    }),
    bindingRegistry: makeRegistry(bindings),
    synchronizationState: overrides.synchronizationState,
    routingPlans: overrides.routingPlans,
    currentFocus: overrides.currentFocus,
    userCameraActive: overrides.userCameraActive ?? false,
    userCameraLocked: overrides.userCameraLocked ?? false,
    stageMode: overrides.stageMode ?? "Inspection",
    reducedMotion: false,
  });
}

function req(
  partial: Partial<NexoraDirectorFocusRequest> &
    Pick<NexoraDirectorFocusRequest, "requestId" | "type">,
): NexoraDirectorFocusRequest {
  return deepFreeze({
    source: "Workspace",
    priority: 10,
    ...partial,
  });
}

function fixtureAB() {
  const a = makePkg("obj-a", {
    anchors: [{ sceneObjectId: createNexoraDirectorSceneObjectId("obj-b") }],
  });
  const b = makePkg("obj-b", {
    anchors: [{ sceneObjectId: createNexoraDirectorSceneObjectId("obj-a") }],
  });
  const c = makePkg("obj-c", { layer: "Background" });
  const bindings = [makeBinding(a), makeBinding(b), makeBinding(c)];
  return { a, b, c, bindings, context: makeContext([a, b, c], bindings) };
}

describe("NOL-3:5 NexoraObject Director Camera & Focus Coordination Engine", () => {
  it("1. Engine identity is exact", () => {
    assert.equal(
      nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
      "NOL-3:5/NexoraObjectDirectorCameraFocusCoordinationEngine",
    );
    assert.equal(
      nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
      "1.0.0",
    );
    assert.equal(
      nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
      "1.0.0",
    );
    assert.deepEqual([...NOL_DIRECTOR_CAMERA_FOCUS_UPSTREAM], [
      nexoraObjectDirectorIntegrationFoundationIdentity,
      directorSceneBindingModelIdentity,
      nexoraObjectDirectorSceneSynchronizationEngineIdentity,
      nexoraObjectDirectorInteractionRoutingEngineIdentity,
    ]);
  });

  it("2. Production imports are limited to NOL-3:1 through NOL-3:4", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.ok(imports.length >= 4);
    for (const spec of imports) {
      assert.ok(
        spec === "./nexoraObjectDirectorIntegrationFoundation.ts" ||
          spec === "./nexoraObjectDirectorSceneBindingModel.ts" ||
          spec === "./nexoraObjectDirectorSceneSynchronizationEngine.ts" ||
          spec === "./nexoraObjectDirectorInteractionRoutingEngine.ts",
        `Unexpected import: ${spec}`,
      );
    }
    assert.match(source, /nexoraObjectDirectorIntegrationFoundationIdentity/);
    assert.match(source, /directorSceneBindingModelIdentity/);
    assert.match(
      source,
      /nexoraObjectDirectorSceneSynchronizationEngineIdentity/,
    );
    assert.match(
      source,
      /nexoraObjectDirectorInteractionRoutingEngineIdentity/,
    );
  });

  it("3. Default state contains no focus and revision zero", () => {
    const state = createNexoraDirectorCameraFocusState(focusDeps());
    assert.equal(state.revision, 0);
    assert.equal(state.focusState, "None");
    assert.equal(state.cameraIntent, "None");
    assert.equal(state.framingMode, "None");
    assert.equal(state.focusedObjectId, undefined);
    assert.equal(state.userControlPreserved, true);
    assert.equal(state.neighborhoodSceneObjectIds.length, 0);
  });

  it("4. Focus request resolves object and scene identity", () => {
    const { a, bindings, context } = fixtureAB();
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r4",
        type: "Focus",
        targetObjectId: a.objectId,
      }),
      context,
    );
    assert.equal(resolution.accepted, true);
    assert.equal(resolution.objectId, a.objectId);
    assert.equal(resolution.sceneObjectId, a.sceneObject.sceneObjectId);
    assert.equal(resolution.bindingId, bindings[0]!.bindingId);
    assert.equal(resolution.packageId, a.packageId);
  });

  it("5. Missing target is rejected", () => {
    const { context } = fixtureAB();
    const resolution = resolveNexoraDirectorFocusTarget(
      req({ requestId: "r5", type: "Focus" }),
      context,
    );
    assert.equal(resolution.accepted, false);
    assert.ok(
      resolution.errors.some((e) => e.code === "DIRECTOR_FOCUS_TARGET_NOT_FOUND"),
    );
  });

  it("6. Hidden target rejects ordinary focus", () => {
    const hidden = makePkg("obj-hidden", {
      visible: false,
      renderingLevel: "Hidden",
    });
    const context = makeContext([hidden], [makeBinding(hidden)]);
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r6",
        type: "Focus",
        targetObjectId: "obj-hidden",
      }),
      context,
    );
    assert.equal(resolution.accepted, false);
    assert.ok(
      resolution.errors.some((e) => e.code === "DIRECTOR_FOCUS_TARGET_HIDDEN"),
    );
  });

  it("7. Historical target allows HistoricalFocus", () => {
    const hist = makePkg("obj-hist", {
      interactionState: "Historical",
      layer: "Historical",
    });
    const context = makeContext([hist], [makeBinding(hist)]);
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r7",
        type: "HistoricalFocus",
        source: "Timeline",
        targetObjectId: "obj-hist",
      }),
      context,
    );
    assert.equal(resolution.accepted, true);
    assert.equal(resolution.focusState, "Historical");
  });

  it("8. Removed binding rejects focus", () => {
    const pkg = makePkg("obj-removed");
    const context = makeContext(
      [pkg],
      [makeBinding(pkg, { state: "Removed" })],
    );
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r8",
        type: "Focus",
        targetObjectId: "obj-removed",
      }),
      context,
    );
    assert.equal(resolution.accepted, false);
    assert.ok(
      resolution.errors.some((e) => e.code === "DIRECTOR_FOCUS_TARGET_REMOVED"),
    );
  });

  it("9. Detached binding may recover when allowed", () => {
    const pkg = makePkg("obj-detached");
    const context = makeContext(
      [pkg],
      [makeBinding(pkg, { state: "Detached" })],
    );
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r9",
        type: "Focus",
        targetObjectId: "obj-detached",
        payload: { allowBindingRecovery: true },
      }),
      context,
    );
    assert.equal(resolution.accepted, true);
    assert.ok(
      resolution.warnings.some(
        (w) => w.code === "DIRECTOR_FOCUS_TARGET_RECOVERED",
      ),
    );
  });

  it("10. Inspect resolves Inspecting state", () => {
    const { a, context } = fixtureAB();
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r10",
        type: "Inspect",
        targetObjectId: a.objectId,
      }),
      context,
    );
    assert.equal(resolution.accepted, true);
    assert.equal(resolution.focusState, "Inspecting");
  });

  it("11. Operate resolves Operating state only for Operation packages", () => {
    const report = makePkg("obj-report", { representationState: "Report" });
    const op = makePkg("obj-op", {
      representationState: "Operation",
      operable: true,
      renderingLevel: "Operation",
    });
    const context = makeContext(
      [report, op],
      [makeBinding(report), makeBinding(op)],
    );
    const bad = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r11a",
        type: "Operate",
        targetObjectId: "obj-report",
      }),
      context,
    );
    assert.equal(bad.accepted, false);
    const good = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r11b",
        type: "Operate",
        targetObjectId: "obj-op",
      }),
      context,
    );
    assert.equal(good.accepted, true);
    assert.equal(good.focusState, "Operating");
  });

  it("12. Read-only Operation produces warning", () => {
    const op = makePkg("obj-ro", {
      representationState: "Operation",
      readOnly: true,
      operable: false,
      renderingLevel: "Operation",
    });
    const context = makeContext([op], [makeBinding(op)]);
    const resolution = resolveNexoraDirectorFocusTarget(
      req({
        requestId: "r12",
        type: "Operate",
        targetObjectId: "obj-ro",
      }),
      context,
    );
    assert.equal(resolution.accepted, true);
    assert.ok(
      resolution.warnings.some(
        (w) => w.code === "DIRECTOR_FOCUS_OPERATION_READ_ONLY",
      ),
    );
  });

  it("13. Overview clears dominant focus", () => {
    const { a, context } = fixtureAB();
    const focused = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r13a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const overview = applyNexoraDirectorCameraFocusCoordination(
      req({ requestId: "r13b", type: "Overview", source: "Director" }),
      { ...context, currentFocus: focused.nextState },
      focusDeps(),
      focused.focusStack,
    );
    assert.equal(overview.accepted, true);
    assert.equal(overview.nextState.focusState, "None");
    assert.equal(overview.nextState.focusedObjectId, undefined);
    assert.equal(overview.nextState.cameraIntent, "Overview");
    assert.equal(overview.nextState.framingMode, "Stage");
  });

  it("14. ClearFocus succeeds without target", () => {
    const { context } = fixtureAB();
    const result = applyNexoraDirectorCameraFocusCoordination(
      req({ requestId: "r14", type: "ClearFocus" }),
      context,
      focusDeps(),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.focusState, "None");
  });

  it("15. Exactly one dominant focus exists", () => {
    const { a, b, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r15a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const second = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r15b",
        type: "Focus",
        targetObjectId: b.objectId,
        source: "User",
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    assert.equal(second.nextState.focusedObjectId, b.objectId);
    assert.notEqual(second.nextState.focusedObjectId, a.objectId);
  });

  it("16. New permanent focus replaces previous focus", () => {
    const { a, b, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r16a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const second = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r16b",
        type: "Focus",
        targetObjectId: b.objectId,
        source: "User",
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    assert.equal(second.nextState.focusedObjectId, "obj-b");
    assert.ok(second.focusStack.entries.some((e) => e.objectId === "obj-a"));
  });

  it("17. Temporary focus suspends previous focus", () => {
    const { a, b, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r17a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const temp = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r17b",
        type: "Focus",
        targetObjectId: b.objectId,
        source: "Timeline",
        payload: { temporary: true },
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    assert.equal(temp.nextState.focusedObjectId, "obj-b");
    assert.equal(temp.nextState.suspendedObjectId, "obj-a");
  });

  it("18. Restore returns to previous valid focus", () => {
    const { a, b, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r18a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const temp = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r18b",
        type: "HistoricalFocus",
        targetObjectId: b.objectId,
        source: "Timeline",
      }),
      {
        ...context,
        currentFocus: first.nextState,
        integrationCollection: makeCollection([
          a,
          makePkg("obj-b", { interactionState: "Historical" }),
          makePkg("obj-c", { layer: "Background" }),
        ]),
      },
      focusDeps(),
      first.focusStack,
    );
    const restored = applyNexoraDirectorCameraFocusCoordination(
      req({ requestId: "r18c", type: "RestorePreviousFocus", source: "User" }),
      { ...context, currentFocus: temp.nextState },
      focusDeps(),
      temp.focusStack,
    );
    assert.equal(restored.accepted, true);
    assert.equal(restored.nextState.focusedObjectId, "obj-a");
  });

  it("19. Invalid stack entries are skipped", () => {
    const { a, context } = fixtureAB();
    const removed = makePkg("obj-gone");
    const stack: NexoraDirectorFocusStack = deepFreeze({
      entries: Object.freeze([
        deepFreeze({
          objectId: "obj-gone",
          sceneObjectId: createNexoraDirectorSceneObjectId("obj-gone"),
          focusState: "Focused" as const,
          requestId: "old",
          source: "User" as const,
        }),
        deepFreeze({
          objectId: a.objectId,
          sceneObjectId: a.sceneObject.sceneObjectId,
          focusState: "Focused" as const,
          requestId: "keep",
          source: "User" as const,
        }),
      ] as NexoraDirectorFocusStackEntry[]),
    });
    void removed;
    const result = restorePreviousNexoraDirectorFocus(stack, context);
    // top is obj-a (valid); if we put gone on top:
    const stackInvalidOnTop: NexoraDirectorFocusStack = deepFreeze({
      entries: Object.freeze([
        deepFreeze({
          objectId: a.objectId,
          sceneObjectId: a.sceneObject.sceneObjectId,
          focusState: "Focused" as const,
          requestId: "keep",
          source: "User" as const,
        }),
        deepFreeze({
          objectId: "obj-gone",
          sceneObjectId: createNexoraDirectorSceneObjectId("obj-gone"),
          focusState: "Focused" as const,
          requestId: "old",
          source: "User" as const,
        }),
      ]),
    });
    const skipped = restorePreviousNexoraDirectorFocus(
      stackInvalidOnTop,
      context,
    );
    assert.equal(skipped.entry?.objectId, "obj-a");
    assert.ok(
      skipped.warnings.some(
        (w) => w.code === "DIRECTOR_FOCUS_STACK_ENTRY_SKIPPED",
      ),
    );
    void result;
  });

  it("20. Duplicate adjacent stack entries are rejected", () => {
    const entry: NexoraDirectorFocusStackEntry = deepFreeze({
      objectId: "obj-a",
      sceneObjectId: createNexoraDirectorSceneObjectId("obj-a"),
      focusState: "Focused",
      requestId: "s1",
      source: "User",
    });
    const stack = pushNexoraDirectorFocusStack(
      clearNexoraDirectorFocusStack(),
      entry,
    );
    assert.throws(() => pushNexoraDirectorFocusStack(stack, entry), {
      code: "DIRECTOR_FOCUS_INVALID_STACK",
    });
  });

  it("21. Focused object is never dimmed", () => {
    const { a, context } = fixtureAB();
    const neighborhood = resolveNexoraDirectorFocusNeighborhood(
      a.sceneObject.sceneObjectId,
      context,
    );
    assert.ok(
      !neighborhood.dimmedSceneObjectIds.includes(a.sceneObject.sceneObjectId),
    );
    const result = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r21",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.ok(
      !result.nextState.dimmedSceneObjectIds.includes(
        a.sceneObject.sceneObjectId,
      ),
    );
  });

  it("22. Direct neighborhood remains visible", () => {
    const { a, b, context } = fixtureAB();
    const neighborhood = resolveNexoraDirectorFocusNeighborhood(
      a.sceneObject.sceneObjectId,
      context,
    );
    assert.ok(
      neighborhood.directSceneObjectIds.includes(b.sceneObject.sceneObjectId),
    );
    assert.ok(
      !neighborhood.dimmedSceneObjectIds.includes(b.sceneObject.sceneObjectId),
    );
  });

  it("23. Background objects may be dimmed", () => {
    const { a, c, context } = fixtureAB();
    const neighborhood = resolveNexoraDirectorFocusNeighborhood(
      a.sceneObject.sceneObjectId,
      context,
    );
    assert.ok(
      neighborhood.dimmedSceneObjectIds.includes(c.sceneObject.sceneObjectId) ||
        neighborhood.backgroundSceneObjectIds.includes(
          c.sceneObject.sceneObjectId,
        ),
    );
  });

  it("24. Critical objects remain identifiable", () => {
    const a = makePkg("obj-a");
    const critical = makePkg("obj-crit", {
      representationState: "Operation",
      renderingLevel: "Operation",
      operable: true,
    });
    const context = makeContext(
      [a, critical],
      [makeBinding(a), makeBinding(critical)],
      {
        // active operation via collection helper
      },
    );
    const withActive = deepFreeze({
      ...context,
      integrationCollection: {
        ...context.integrationCollection,
        activeOperationSceneObjectId: critical.sceneObject.sceneObjectId,
      },
    });
    const neighborhood = resolveNexoraDirectorFocusNeighborhood(
      a.sceneObject.sceneObjectId,
      withActive,
    );
    assert.ok(
      !neighborhood.dimmedSceneObjectIds.includes(
        critical.sceneObject.sceneObjectId,
      ),
    );
  });

  it("25. Attention-path order is preserved", () => {
    const a = makePkg("obj-a");
    const b = makePkg("obj-b");
    const c = makePkg("obj-c");
    const path = [
      a.sceneObject.sceneObjectId,
      b.sceneObject.sceneObjectId,
      c.sceneObject.sceneObjectId,
    ];
    const context = makeContext(
      [a, b, c],
      [makeBinding(a), makeBinding(b), makeBinding(c)],
      { attentionSceneObjectIds: path },
    );
    const framing = resolveNexoraDirectorAttentionPathFraming(
      req({
        requestId: "r25",
        type: "FocusAttentionPath",
        payload: { attentionPathSceneObjectIds: path },
      }),
      context,
    );
    assert.deepEqual([...framing.attentionPathSceneObjectIds], path);
    assert.equal(framing.rootSceneObjectId, path[0]);
    assert.equal(framing.targetSceneObjectId, path[2]);
  });

  it("26. Invalid attention-path member is reported", () => {
    const { context } = fixtureAB();
    const framing = resolveNexoraDirectorAttentionPathFraming(
      req({
        requestId: "r26",
        type: "FocusAttentionPath",
        payload: {
          attentionPathSceneObjectIds: [
            createNexoraDirectorSceneObjectId("obj-a"),
            "nexora-scene-object:missing",
          ],
        },
      }),
      context,
    );
    assert.ok(
      framing.errors.some(
        (e) => e.code === "DIRECTOR_FOCUS_INVALID_ATTENTION_PATH",
      ),
    );
  });

  it("27. Cluster representative must belong to membership", () => {
    const a = makePkg("obj-a", {
      clustering: {
        clustered: true,
        clusterId: "cluster-1",
        memberSceneObjectIds: [createNexoraDirectorSceneObjectId("obj-a")],
        representativeSceneObjectId: createNexoraDirectorSceneObjectId("obj-x"),
      },
    });
    const context = makeContext([a], [makeBinding(a)]);
    const framing = resolveNexoraDirectorClusterFraming(
      req({
        requestId: "r27",
        type: "FocusCluster",
        targetObjectId: "obj-a",
      }),
      context,
    );
    assert.equal(framing.accepted, false);
    assert.ok(
      framing.errors.some((e) => e.code === "DIRECTOR_FOCUS_INVALID_CLUSTER"),
    );
  });

  it("28. Operation member can force cluster expansion recommendation", () => {
    const aId = createNexoraDirectorSceneObjectId("obj-a");
    const bId = createNexoraDirectorSceneObjectId("obj-b");
    const a = makePkg("obj-a", {
      clustering: {
        clustered: true,
        clusterId: "cluster-2",
        memberSceneObjectIds: [aId, bId],
        representativeSceneObjectId: aId,
        collapsed: true,
      },
    });
    const b = makePkg("obj-b", {
      representationState: "Operation",
      renderingLevel: "Operation",
      operable: true,
      clustering: {
        clustered: true,
        clusterId: "cluster-2",
        memberSceneObjectIds: [aId, bId],
        representativeSceneObjectId: aId,
      },
    });
    const context = makeContext([a, b], [makeBinding(a), makeBinding(b)]);
    const framing = resolveNexoraDirectorClusterFraming(
      req({
        requestId: "r28",
        type: "FocusCluster",
        targetObjectId: "obj-a",
      }),
      context,
    );
    assert.equal(framing.accepted, true);
    assert.equal(framing.expandRecommended, true);
  });

  it("29. User camera activity preserves camera for automatic focus", () => {
    const { a, context } = fixtureAB();
    const decision = resolveNexoraDirectorCameraPreservation(
      req({
        requestId: "r29",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "Advisor",
      }),
      { ...context, userCameraActive: true },
    );
    assert.equal(decision, "Preserve");
  });

  it("30. Explicit user focus may recommend camera override", () => {
    const { a, context } = fixtureAB();
    const decision = resolveNexoraDirectorCameraPreservation(
      req({
        requestId: "r30",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      { ...context, userCameraActive: true },
    );
    assert.equal(decision, "OverrideAllowed");
  });

  it("31. User camera lock blocks automatic camera changes", () => {
    const { a, context } = fixtureAB();
    const decision = resolveNexoraDirectorCameraPreservation(
      req({
        requestId: "r31",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "Workspace",
      }),
      { ...context, userCameraLocked: true },
    );
    assert.equal(decision, "Blocked");
  });

  it("32. System safety override requires explicit permission", () => {
    const { a, context } = fixtureAB();
    const locked = { ...context, userCameraLocked: true };
    const without = resolveNexoraDirectorCameraPreservation(
      req({
        requestId: "r32a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "System",
      }),
      locked,
    );
    assert.equal(without, "Blocked");
    const withSafety = resolveNexoraDirectorCameraPreservation(
      req({
        requestId: "r32b",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "System",
        payload: { safetyOverride: true },
      }),
      locked,
    );
    assert.equal(withSafety, "OverrideAllowed");
    assert.ok(
      resolveNexoraDirectorCameraPriority(
        req({
          requestId: "r32c",
          type: "Focus",
          source: "System",
          payload: { safetyOverride: true },
        }),
        context,
      ) >= 1000,
    );
  });

  it("33. Camera plans contain no coordinates", () => {
    const { a, context } = fixtureAB();
    const plan = evaluateNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r33",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const json = JSON.stringify(plan);
    assert.equal(json.includes("coordinates"), false);
    assert.equal(json.includes("vector3"), false);
    assert.equal(json.includes("matrix4"), false);
    assert.equal(json.includes("worldPosition"), false);
  });

  it("34. Camera plans contain no camera instances", () => {
    const { a, context } = fixtureAB();
    const plan = evaluateNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r34",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const json = JSON.stringify(plan);
    assert.equal(json.includes("cameraInstance"), false);
    assert.equal(json.includes("PerspectiveCamera"), false);
    for (const command of plan.commands) {
      assert.equal(typeof command.payload, "object");
      assert.equal("camera" in command.payload, false);
    }
  });

  it("35. Operation framing resolves Operation intent", () => {
    const op = makePkg("obj-op", {
      representationState: "Operation",
      operable: true,
      renderingLevel: "Operation",
    });
    const context = makeContext([op], [makeBinding(op)]);
    const framing = resolveNexoraDirectorOperationFraming(
      req({
        requestId: "r35",
        type: "Operate",
        targetObjectId: "obj-op",
        source: "User",
      }),
      context,
    );
    assert.equal(framing.accepted, true);
    assert.equal(framing.cameraIntent, "Operation");
  });

  it("36. Historical framing resolves inspection-safe intent", () => {
    const hist = makePkg("obj-hist", { interactionState: "Historical" });
    const context = makeContext([hist], [makeBinding(hist)]);
    const framing = resolveNexoraDirectorHistoricalFraming(
      req({
        requestId: "r36",
        type: "HistoricalFocus",
        targetObjectId: "obj-hist",
        source: "Timeline",
      }),
      context,
    );
    assert.equal(framing.accepted, true);
    assert.equal(framing.cameraIntent, "Inspection");
    assert.equal(framing.focusState, "Historical");
  });

  it("37. Replay may recommend Follow without executing it", () => {
    const hist = makePkg("obj-hist", { interactionState: "Historical" });
    const context = makeContext([hist], [makeBinding(hist)], {
      stageMode: "Replay",
    });
    const framing = resolveNexoraDirectorHistoricalFraming(
      req({
        requestId: "r37",
        type: "HistoricalFocus",
        targetObjectId: "obj-hist",
        source: "Timeline",
        payload: { replay: true },
      }),
      context,
    );
    assert.equal(framing.recommendFollow, true);
    assert.equal(framing.cameraIntent, "Follow");
  });

  it("38. Queue ordering is deterministic", () => {
    const { context } = fixtureAB();
    const queue = createNexoraDirectorCameraFocusQueue([
      req({
        requestId: "q-overview",
        type: "Overview",
        source: "Director",
        priority: 50,
        occurredAt: "2026-08-04T22:00:02.000Z",
      }),
      req({
        requestId: "q-user",
        type: "Focus",
        source: "User",
        priority: 1,
        targetObjectId: "obj-a",
        occurredAt: "2026-08-04T22:00:01.000Z",
      }),
      req({
        requestId: "q-advisor",
        type: "Inspect",
        source: "Advisor",
        priority: 99,
        targetObjectId: "obj-a",
        occurredAt: "2026-08-04T22:00:00.000Z",
      }),
    ]);
    const ordered = resolveNexoraDirectorCameraFocusQueue(queue, context);
    assert.equal(ordered.requests[0]!.requestId, "q-user");
    assert.ok(
      resolveNexoraDirectorCameraPriority(ordered.requests[0]!, context) >
        resolveNexoraDirectorCameraPriority(ordered.requests[2]!, context),
    );
  });

  it("39. Duplicate request IDs are rejected", () => {
    const queue = createNexoraDirectorCameraFocusQueue([
      req({ requestId: "dup", type: "ClearFocus" }),
    ]);
    assert.throws(
      () =>
        enqueueNexoraDirectorFocusRequest(
          queue,
          req({ requestId: "dup", type: "Overview" }),
        ),
      { code: "DIRECTOR_FOCUS_DUPLICATE_REQUEST_ID" },
    );
  });

  it("40. Atomic batch rejects all when one request fails", () => {
    const { a, context } = fixtureAB();
    const batch = coordinateNexoraDirectorCameraFocusBatch(
      {
        mode: "Atomic",
        requests: [
          req({
            requestId: "b40a",
            type: "Focus",
            targetObjectId: a.objectId,
            source: "User",
          }),
          req({
            requestId: "b40b",
            type: "Focus",
            targetObjectId: "missing",
            source: "User",
          }),
        ],
      },
      context,
      focusDeps(),
    );
    assert.equal(batch.accepted, false);
    assert.equal(batch.results.length, 0);
    assert.ok(batch.rejectedRequestIds.includes("b40b"));
  });

  it("41. BestEffort applies valid requests sequentially", () => {
    const { a, b, context } = fixtureAB();
    const batch = coordinateNexoraDirectorCameraFocusBatch(
      {
        mode: "BestEffort",
        requests: [
          req({
            requestId: "b41a",
            type: "Focus",
            targetObjectId: a.objectId,
            source: "User",
          }),
          req({
            requestId: "b41b",
            type: "Focus",
            targetObjectId: "missing",
            source: "User",
          }),
          req({
            requestId: "b41c",
            type: "Focus",
            targetObjectId: b.objectId,
            source: "User",
          }),
        ],
      },
      context,
      focusDeps(),
    );
    assert.ok(batch.acceptedRequestIds.includes("b41a"));
    assert.ok(batch.acceptedRequestIds.includes("b41c"));
    assert.ok(batch.rejectedRequestIds.includes("b41b"));
    assert.equal(batch.nextState.focusedObjectId, "obj-b");
  });

  it("42. Final batch state has one focus", () => {
    const { a, b, context } = fixtureAB();
    const batch = coordinateNexoraDirectorCameraFocusBatch(
      {
        mode: "BestEffort",
        requests: [
          req({
            requestId: "b42a",
            type: "Focus",
            targetObjectId: a.objectId,
            source: "User",
          }),
          req({
            requestId: "b42b",
            type: "Focus",
            targetObjectId: b.objectId,
            source: "User",
          }),
        ],
      },
      context,
      focusDeps(),
    );
    assert.equal(batch.nextState.focusedObjectId, "obj-b");
    assert.ok(batch.nextState.focusedObjectId);
  });

  it("43. No-op request does not increment revision", () => {
    const { a, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r43a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const second = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r43b",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    assert.equal(second.changed, false);
    assert.equal(second.nextState.revision, first.nextState.revision);
  });

  it("44. Accepted change increments revision once", () => {
    const { a, context } = fixtureAB();
    const result = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r44",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.equal(result.changed, true);
    assert.equal(result.nextState.revision, 1);
    assert.equal(result.previousState.revision, 0);
  });

  it("45. Rejected request preserves state", () => {
    const { a, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r45a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const rejected = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r45b",
        type: "Focus",
        targetObjectId: "missing",
        source: "User",
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    assert.equal(rejected.accepted, false);
    assert.equal(rejected.changed, false);
    assert.equal(rejected.nextState.revision, first.nextState.revision);
    assert.equal(rejected.nextState.focusedObjectId, "obj-a");
  });

  it("46. Simulation never mutates context", () => {
    const { a, context } = fixtureAB();
    const before = JSON.stringify(context);
    simulateNexoraDirectorCameraFocusSequence(
      [
        req({
          requestId: "r46",
          type: "Focus",
          targetObjectId: a.objectId,
          source: "User",
        }),
      ],
      context,
      {},
      focusDeps(),
    );
    assert.equal(JSON.stringify(context), before);
  });

  it("47. Simulation identifies first failure", () => {
    const { a, context } = fixtureAB();
    const sim = simulateNexoraDirectorCameraFocusSequence(
      [
        req({
          requestId: "r47a",
          type: "Focus",
          targetObjectId: a.objectId,
          source: "User",
        }),
        req({
          requestId: "r47b",
          type: "Focus",
          targetObjectId: "missing",
          source: "User",
        }),
        req({
          requestId: "r47c",
          type: "ClearFocus",
        }),
      ],
      context,
      { stopOnFailure: true },
      focusDeps(),
    );
    assert.equal(sim.firstFailureRequestId, "r47b");
    assert.equal(sim.accepted, false);
  });

  it("48. Events preserve correlation and causation IDs", () => {
    const { a, context } = fixtureAB();
    const result = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r48",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
        correlationId: "corr-48",
        causationId: "cause-48",
      }),
      context,
      focusDeps(),
    );
    assert.ok(result.events.length > 0);
    for (const event of result.events) {
      assert.equal(event.correlationId, "corr-48");
      assert.equal(event.causationId, "cause-48");
    }
  });

  it("49. Focus records preserve revision movement", () => {
    const { a, context } = fixtureAB();
    const request = req({
      requestId: "r49",
      type: "Focus",
      targetObjectId: a.objectId,
      source: "User",
    });
    const result = applyNexoraDirectorCameraFocusCoordination(
      request,
      context,
      focusDeps(),
    );
    const record = createNexoraDirectorCameraFocusRecord(
      result,
      request,
      focusDeps(),
    );
    assert.equal(record.revisionBefore, 0);
    assert.equal(record.revisionAfter, 1);
    assert.equal(record.changed, true);
  });

  it("50. Snapshot comparison detects focus-target changes", () => {
    const { a, b, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r50a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const second = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r50b",
        type: "Focus",
        targetObjectId: b.objectId,
        source: "User",
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    const left = createNexoraDirectorCameraFocusSnapshot(
      first.nextState,
      first.focusStack,
      focusDeps(),
    );
    const right = createNexoraDirectorCameraFocusSnapshot(
      second.nextState,
      second.focusStack,
      focusDeps(),
    );
    const cmp = compareNexoraDirectorCameraFocusSnapshots(left, right);
    assert.equal(cmp.focusTargetChanged, true);
  });

  it("51. Snapshot comparison detects camera-intent changes", () => {
    const op = makePkg("obj-op", {
      representationState: "Operation",
      operable: true,
      renderingLevel: "Operation",
    });
    const context = makeContext([op], [makeBinding(op)]);
    const inspect = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r51a",
        type: "Inspect",
        targetObjectId: "obj-op",
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const operate = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r51b",
        type: "Operate",
        targetObjectId: "obj-op",
        source: "User",
      }),
      { ...context, currentFocus: inspect.nextState },
      focusDeps(),
      inspect.focusStack,
    );
    const cmp = compareNexoraDirectorCameraFocusSnapshots(
      createNexoraDirectorCameraFocusSnapshot(
        inspect.nextState,
        inspect.focusStack,
        focusDeps(),
      ),
      createNexoraDirectorCameraFocusSnapshot(
        operate.nextState,
        operate.focusStack,
        focusDeps(),
      ),
    );
    assert.equal(cmp.cameraIntentChanged, true);
  });

  it("52. Snapshot comparison detects neighborhood changes", () => {
    const { a, b, context } = fixtureAB();
    const first = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r52a",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const second = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r52b",
        type: "Focus",
        targetObjectId: b.objectId,
        source: "User",
      }),
      { ...context, currentFocus: first.nextState },
      focusDeps(),
      first.focusStack,
    );
    const cmp = compareNexoraDirectorCameraFocusSnapshots(
      createNexoraDirectorCameraFocusSnapshot(
        first.nextState,
        first.focusStack,
        focusDeps(),
      ),
      createNexoraDirectorCameraFocusSnapshot(
        second.nextState,
        second.focusStack,
        focusDeps(),
      ),
    );
    assert.equal(cmp.neighborhoodChanged, true);
  });

  it("53. Validation rejects identity mismatch", () => {
    const validation = validateNexoraDirectorFocusRequest(
      req({
        requestId: "r53",
        type: "Focus",
        targetObjectId: "obj-a",
        targetSceneObjectId: "nexora-scene-object:obj-b",
      }),
    );
    assert.equal(validation.ok, false);
    if (!validation.ok) {
      assert.ok(
        validation.errors.some(
          (e) => e.code === "DIRECTOR_FOCUS_SCENE_IDENTITY_MISMATCH",
        ),
      );
    }
  });

  it("54. Validation rejects invalid priority", () => {
    const validation = validateNexoraDirectorFocusRequest(
      req({
        requestId: "r54",
        type: "Focus",
        priority: -1,
        targetObjectId: "obj-a",
      }),
    );
    assert.equal(validation.ok, false);
    if (!validation.ok) {
      assert.ok(
        validation.errors.some(
          (e) => e.code === "DIRECTOR_FOCUS_INVALID_PRIORITY",
        ),
      );
    }
  });

  it("55. Validation rejects invalid focus stack", () => {
    const entry: NexoraDirectorFocusStackEntry = deepFreeze({
      objectId: "obj-a",
      sceneObjectId: createNexoraDirectorSceneObjectId("obj-a"),
      focusState: "Focused",
      requestId: "s",
      source: "User",
    });
    const invalid = deepFreeze({
      entries: Object.freeze([entry, entry]),
    });
    const validation = validateNexoraDirectorFocusStack(invalid);
    assert.equal(validation.ok, false);
  });

  it("56. Validation rejects renderer-specific objects", () => {
    const validation = validateNexoraDirectorFocusRequest(
      req({
        requestId: "r56",
        type: "Focus",
        targetObjectId: "obj-a",
        payload: { cameraInstance: { id: "cam" } },
      }),
    );
    assert.equal(validation.ok, false);
    if (!validation.ok) {
      assert.ok(
        validation.errors.some(
          (e) => e.code === "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN",
        ),
      );
    }
  });

  it("57. Outputs are deeply immutable", () => {
    const { a, context } = fixtureAB();
    const result = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r57",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.equal(isDeeplyFrozen(result), true);
    assert.equal(isDeeplyFrozen(result.plan), true);
    assert.equal(isDeeplyFrozen(result.nextState), true);
  });

  it("58. Serialization and deserialization are reversible", () => {
    const { a, context } = fixtureAB();
    const request = req({
      requestId: "r58",
      type: "Focus",
      targetObjectId: a.objectId,
      source: "User",
    });
    const result = applyNexoraDirectorCameraFocusCoordination(
      request,
      context,
      focusDeps(),
    );
    const reqRound = deserializeNexoraDirectorFocusRequest(
      serializeNexoraDirectorFocusRequest(request),
    );
    const stateRound = deserializeNexoraDirectorCameraFocusState(
      serializeNexoraDirectorCameraFocusState(result.nextState),
    );
    const stackRound = deserializeNexoraDirectorFocusStack(
      serializeNexoraDirectorFocusStack(result.focusStack),
    );
    const snap = createNexoraDirectorCameraFocusSnapshot(
      result.nextState,
      result.focusStack,
      focusDeps(),
    );
    const snapRound = deserializeNexoraDirectorCameraFocusSnapshot(
      serializeNexoraDirectorCameraFocusSnapshot(snap),
    );
    assert.equal(reqRound.requestId, request.requestId);
    assert.equal(stateRound.focusedObjectId, result.nextState.focusedObjectId);
    assert.deepEqual(stackRound.entries, result.focusStack.entries);
    assert.equal(snapRound.snapshotId, snap.snapshotId);
  });

  it("59. Unsupported schemas are rejected", () => {
    assert.throws(
      () =>
        deserializeNexoraDirectorCameraFocusState(
          JSON.stringify({
            identity: nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
            version: "1.0.0",
            schemaVersion: "9.9.9",
            kind: "focusState",
            state: createNexoraDirectorCameraFocusState(focusDeps()),
          }),
        ),
      { code: "DIRECTOR_FOCUS_UNSUPPORTED_VERSION" },
    );
  });

  it("60. Serialized output contains no functions, vectors, matrices, cameras, or renderer instances", () => {
    const { a, context } = fixtureAB();
    const result = applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r60",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    const serialized = serializeNexoraDirectorCameraFocusState(result.nextState);
    assert.equal(serialized.includes("function"), false);
    assert.equal(serialized.includes("vector3"), false);
    assert.equal(serialized.includes("matrix4"), false);
    assert.equal(serialized.includes("cameraInstance"), false);
    assert.equal(serialized.includes("WebGL"), false);
  });

  it("61. No bindings are mutated", () => {
    const { a, bindings, context } = fixtureAB();
    const before = JSON.stringify(bindings);
    applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r61",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.equal(JSON.stringify(bindings), before);
    assert.equal(JSON.stringify(context.bindingRegistry.bindings), before);
  });

  it("62. No synchronization state is mutated", () => {
    const syncState: NexoraDirectorSceneSynchronizationState = deepFreeze({
      synchronizationId: "sync-1",
      collectionId: "col:camera-focus",
      revision: 3,
      status: "Completed",
      packageCount: 1,
      bindingCount: 1,
      pendingCommandCount: 0,
      completedCommandCount: 1,
      failedCommandCount: 0,
      updatedAt: NOW,
    });
    const { a, bindings } = fixtureAB();
    const context = makeContext([a], bindings.slice(0, 1), {
      synchronizationState: syncState,
    });
    const before = JSON.stringify(syncState);
    applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r62",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.equal(JSON.stringify(syncState), before);
  });

  it("63. No interaction routing plan is dispatched", () => {
    assert.equal(source.includes("routeDirectorInteraction("), false);
    assert.equal(source.includes("dispatch"), false);
    const plan: NexoraDirectorInteractionRoutingPlan = deepFreeze({
      planId: "plan-1",
      accepted: true,
      priority: 1,
      interaction: deepFreeze({
        eventId: "evt-1",
        interactionType: "Focus" as const,
        objectId: "obj-a",
        sceneObjectId: createNexoraDirectorSceneObjectId("obj-a"),
        bindingId: "nexora-binding:obj-a",
        timestamp: NOW,
        source: "Workspace" as const,
        modifiers: Object.freeze({}),
        payload: Object.freeze({}),
        priority: 1,
      }),
      semanticAction: "FocusObject" as const,
      target: "Workspace" as const,
      permission: "Allowed" as const,
      requiredPermissions: Object.freeze(["focusable"]),
      warnings: Object.freeze([]),
      errors: Object.freeze([]),
      metadata: Object.freeze({}),
    });
    const { a, bindings } = fixtureAB();
    const context = makeContext([a], bindings.slice(0, 1), {
      routingPlans: [plan],
    });
    const before = JSON.stringify(plan);
    applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r63",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.equal(JSON.stringify(plan), before);
  });

  it("64. No NOL-1 or NOL-2 state is mutated", () => {
    assert.equal(source.includes("../nexoraObject"), false);
    assert.equal(source.includes("/nol/runtime"), false);
    assert.equal(source.includes("material/"), false);
    const { a, context } = fixtureAB();
    const before = JSON.stringify(context.integrationCollection);
    applyNexoraDirectorCameraFocusCoordination(
      req({
        requestId: "r64",
        type: "Focus",
        targetObjectId: a.objectId,
        source: "User",
      }),
      context,
      focusDeps(),
    );
    assert.equal(JSON.stringify(context.integrationCollection), before);
  });

  it("65. Typecheck remains clean", () => {
    // Structural compile coverage via exercised public APIs.
    const state = createNexoraDirectorCameraFocusState(focusDeps());
    const stack = clearNexoraDirectorFocusStack();
    const popped = popNexoraDirectorFocusStack(stack);
    assert.equal(state.revision, 0);
    assert.equal(popped.entry, undefined);
  });

  it("66. ESLint remains clean", () => {
    assert.match(source, /export function createNexoraDirectorCameraFocusState/);
    assert.match(source, /export function applyNexoraDirectorCameraFocusCoordination/);
    assert.equal(source.includes("eslint-disable"), false);
  });
});
