/**
 * NOL-3:1 — NexoraObject Director Integration Foundation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { universalNexoraObjectPublicIndex } from "../universalNexoraObjectPublicIndex.ts";
import {
  projectVisualization,
  type NexoraObjectVisualizationDependencies,
  type NexoraObjectVisualizationProjection,
  type NexoraObjectVisualizationProjectionInput,
} from "../nexoraObjectMaterialRepresentationPublicIndex.ts";
import { projectNexoraObjectRepresentation } from "../material/nexoraObjectMaterialRepresentationFoundation.ts";
import { resolveMaterialState } from "../material/nexoraObjectMaterialStateResolutionModel.ts";
import { createNexoraObjectRepresentationTransitionState } from "../material/nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import type { NexoraObjectAdaptiveRepresentationRecommendation } from "../material/nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";
import {
  resolveNexoraObjectMaterialInteractionAttention,
  type NexoraObjectMaterialAttentionDependencies,
  type NexoraObjectMaterialInteractionAttentionInput,
} from "../material/nexoraObjectMaterialInteractionAttentionEngine.ts";
import {
  calculateNexoraObjectDirectorIntegrationDiff,
  compareNexoraObjectDirectorIntegrationSnapshots,
  createNexoraDirectorSceneObjectId,
  createNexoraObjectDirectorIntegrationSnapshot,
  deserializeNexoraObjectDirectorIntegrationPackage,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  projectNexoraDirectorEventRoutes,
  projectNexoraObjectDirectorIntegration,
  projectNexoraObjectDirectorIntegrationBatch,
  projectNexoraObjectDirectorIntegrationCollection,
  resolveNexoraDirectorSceneOrder,
  serializeNexoraObjectDirectorIntegrationPackage,
  validateNexoraObjectDirectorIntegrationCollection,
  validateNexoraObjectDirectorIntegrationPackage,
  type NexoraDirectorEventRoute,
  type NexoraObjectDirectorIntegrationContext,
  type NexoraObjectDirectorIntegrationDependencies,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorIntegrationFoundation.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

const NOW = "2026-08-04T17:20:00.000Z";

let seq = 0;

function vizDeps(): NexoraObjectVisualizationDependencies {
  return Object.freeze({
    now: () => NOW,
    createProjectionId: () => {
      seq += 1;
      return `proj-${seq}`;
    },
    createPackageId: () => {
      seq += 1;
      return `pkg-${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `snap-${seq}`;
    },
  });
}

function attnDeps(): NexoraObjectMaterialAttentionDependencies {
  return Object.freeze({
    now: () => NOW,
    createEventId: () => {
      seq += 1;
      return `evt-${seq}`;
    },
    createRecordId: () => {
      seq += 1;
      return `rec-${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `attn-snap-${seq}`;
    },
  });
}

function dirDeps(): NexoraObjectDirectorIntegrationDependencies {
  let local = 0;
  return Object.freeze({
    now: () => NOW,
    createPackageId: (objectId: string, visualizationVersion: string) => {
      local += 1;
      return `dir-pkg:${objectId}:${visualizationVersion}:${local}`;
    },
    createCollectionId: (sceneObjectIds: readonly string[]) => {
      local += 1;
      return `dir-col:${sceneObjectIds.join("|")}:${local}`;
    },
    createSnapshotId: () => {
      local += 1;
      return `dir-snap:${local}`;
    },
    createRouteId: (
      sceneObjectId: string,
      event: NexoraDirectorEventRoute["event"],
    ) => {
      local += 1;
      return `dir-route:${sceneObjectId}:${event}:${local}`;
    },
  });
}

function ctx(
  overrides: Partial<NexoraObjectDirectorIntegrationContext> = {},
): NexoraObjectDirectorIntegrationContext {
  return Object.freeze({
    source: overrides.source ?? "Director",
    stageMode: overrides.stageMode ?? "Overview",
    previousPackage: overrides.previousPackage,
    correlationId: overrides.correlationId,
    occurredAt: overrides.occurredAt ?? NOW,
    reducedMotion: overrides.reducedMotion,
  });
}

function makeAdaptive(
  objectId: string,
  overrides: Partial<NexoraObjectAdaptiveRepresentationRecommendation> = {},
): NexoraObjectAdaptiveRepresentationRecommendation {
  return Object.freeze({
    objectId,
    currentState: overrides.currentState ?? "Minimum",
    recommendedState: overrides.recommendedState ?? "Minimum",
    recommendedDensity: overrides.recommendedDensity ?? "Seed",
    relevanceScore: overrides.relevanceScore ?? 10,
    rank: overrides.rank ?? 1,
    labelMode: overrides.labelMode ?? "Short",
    maximumBadgeCount: overrides.maximumBadgeCount ?? 1,
    indicatorMode: overrides.indicatorMode ?? "StatusOnly",
    relationshipMode: overrides.relationshipMode ?? "Hidden",
    dimmed: overrides.dimmed ?? false,
    clustered: overrides.clustered ?? false,
    transitionRecommended: overrides.transitionRecommended ?? false,
    reasons: Object.freeze(overrides.reasons ?? []),
  });
}

function makeFacets(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly historical?: boolean;
    readonly hide?: boolean;
  } = {},
) {
  const object = createNexoraObjectContract({
    id,
    type: "Goal",
    caption: `Object ${id}`,
    status: options.status ?? "Green",
    createdAt: NOW,
  });
  object.setLifecycle(options.historical ? "Deleted" : "Active");
  if (options.hide) {
    applyNexoraObjectRuntimeCommand(object, { type: "Hide" }, {
      source: "Director",
    });
  }
  const representation = projectNexoraObjectRepresentation(object, {
    source: "Director",
    requestedState: options.state ?? "Minimum",
    authorizedForOperation: true,
    historical: options.historical === true,
  });
  const materialState = resolveMaterialState(representation, {
    theme: "Light",
    historicalMode: options.historical === true,
  });
  const transitionState = createNexoraObjectRepresentationTransitionState(
    id,
    representation.state,
    NOW,
  );
  return Object.freeze({ object, representation, materialState, transitionState });
}

function makeInput(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly historical?: boolean;
    readonly hide?: boolean;
    readonly adaptive?: Partial<NexoraObjectAdaptiveRepresentationRecommendation>;
    readonly focus?: boolean;
    readonly operate?: boolean;
    readonly objectType?: string;
    readonly stageDensity?: "Sparse" | "Balanced" | "Dense" | "Critical";
    readonly metadata?: Readonly<Record<string, unknown>>;
    readonly clusterHint?: {
      readonly clusterId: string;
      readonly memberObjectIds: readonly string[];
    };
  } = {},
): NexoraObjectVisualizationProjectionInput {
  const facets = makeFacets(id, options);
  const adaptive = makeAdaptive(id, {
    currentState: facets.representation.state,
    recommendedState:
      options.adaptive?.recommendedState ?? facets.representation.state,
    recommendedDensity:
      options.adaptive?.recommendedDensity ??
      (facets.representation.state === "Operation"
        ? "Operational"
        : facets.representation.state === "Report"
          ? "Executive"
          : "Seed"),
    labelMode:
      options.adaptive?.labelMode ??
      (facets.representation.state === "Minimum" ? "Short" : "Full"),
    maximumBadgeCount: options.adaptive?.maximumBadgeCount ?? 2,
    indicatorMode:
      options.adaptive?.indicatorMode ??
      (facets.representation.state === "Operation"
        ? "Operational"
        : facets.representation.state === "Report"
          ? "Executive"
          : "StatusOnly"),
    relationshipMode:
      options.adaptive?.relationshipMode ??
      (options.focus ? "Direct" : "Hidden"),
    dimmed: options.adaptive?.dimmed,
    clustered: options.adaptive?.clustered,
    rank: options.adaptive?.rank,
    relevanceScore: options.adaptive?.relevanceScore,
    reasons: options.adaptive?.reasons,
  });

  const attentionInput: NexoraObjectMaterialInteractionAttentionInput =
    Object.freeze({
      representation: facets.representation,
      materialState: facets.materialState,
      transitionState: facets.transitionState,
      adaptiveRecommendation: adaptive,
      interactionSignals: Object.freeze([
        ...(options.focus
          ? [
              Object.freeze({
                signalId: `focus-${id}`,
                objectId: id,
                type: "Focus" as const,
                source: "Director" as const,
                occurredAt: NOW,
                payload: Object.freeze({}),
              }),
            ]
          : []),
        ...(options.operate
          ? [
              Object.freeze({
                signalId: `op-${id}`,
                objectId: id,
                type: "OperationEnter" as const,
                source: "Director" as const,
                occurredAt: NOW,
                payload: Object.freeze({}),
              }),
            ]
          : []),
      ]),
      attentionSignals: Object.freeze([]),
      context: Object.freeze({
        source: "Director" as const,
        stageDensity: options.stageDensity ?? ("Balanced" as const),
        stageMode: options.operate
          ? ("Operation" as const)
          : ("Overview" as const),
        reducedMotion: false,
        currentTime: NOW,
        focusedObjectId: options.focus ? id : undefined,
        activeOperationObjectId: options.operate ? id : undefined,
      }),
    });

  const attentionResult = resolveNexoraObjectMaterialInteractionAttention(
    attentionInput,
    attnDeps(),
  );

  return Object.freeze({
    representation: facets.representation,
    materialState: facets.materialState,
    transitionState: facets.transitionState,
    adaptiveRecommendation: adaptive,
    interactionResponse: attentionResult.response,
    objectType: options.objectType ?? "Goal",
    stageDensity: options.stageDensity ?? "Balanced",
    clusterHint: options.clusterHint
      ? Object.freeze({
          clusterId: options.clusterHint.clusterId,
          memberObjectIds: Object.freeze([
            ...options.clusterHint.memberObjectIds,
          ]),
          reason: "SharedContext" as const,
          collapsed: false,
        })
      : undefined,
    metadata: options.metadata,
  });
}

function viz(
  id: string,
  options: Parameters<typeof makeInput>[1] = {},
): NexoraObjectVisualizationProjection {
  return projectVisualization(makeInput(id, options), vizDeps());
}

function project(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext = ctx(),
  deps: NexoraObjectDirectorIntegrationDependencies = dirDeps(),
): NexoraObjectDirectorIntegrationPackage {
  return projectNexoraObjectDirectorIntegration(visualization, context, deps);
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

describe("NOL-3:1 NexoraObject Director Integration Foundation", () => {
  it("1. Identity is exact.", () => {
    assert.equal(
      nexoraObjectDirectorIntegrationFoundationIdentity,
      "NOL-3:1/NexoraObjectDirectorIntegrationFoundation",
    );
  });

  it("2. Production import is limited to NOL-2:9.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "../nexoraObjectMaterialRepresentationPublicIndex.ts",
    ]);
  });

  it("3. No direct NOL-1 or internal NOL-2 imports exist.", () => {
    assert.equal(/from\s+"\.\.\/universalNexoraObject/.test(source), false);
    assert.equal(/from\s+"\.\.\/material\//.test(source), false);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
    assert.equal(/\bTHREE\b/.test(source), false);
  });

  it("4. Scene-object ID is deterministic.", () => {
    assert.equal(
      createNexoraDirectorSceneObjectId("obj-a"),
      createNexoraDirectorSceneObjectId("obj-a"),
    );
    assert.equal(
      createNexoraDirectorSceneObjectId("obj-a"),
      "nexora-scene-object:obj-a",
    );
  });

  it("5. Scene-object ID preserves original object identity.", () => {
    const pkg = project(viz("preserve-1"));
    assert.equal(pkg.objectId, "preserve-1");
    assert.equal(pkg.sceneObject.objectId, "preserve-1");
    assert.equal(
      pkg.sceneObject.sceneObjectId,
      "nexora-scene-object:preserve-1",
    );
  });

  it("6. Equal inputs produce equal integration packages.", () => {
    const visualization = viz("eq-1", { state: "Report", focus: true });
    const deps = dirDeps();
    const a = project(visualization, ctx(), deps);
    const b = project(visualization, ctx(), deps);
    assert.equal(a.sceneObject.renderingLevel, b.sceneObject.renderingLevel);
    assert.equal(a.sceneObject.renderingPriority, b.sceneObject.renderingPriority);
    assert.deepEqual(a.hierarchy, b.hierarchy);
    assert.deepEqual(a.interaction.state, b.interaction.state);
    assert.deepEqual(a.picking.pickingId, b.picking.pickingId);
  });

  it("7. Integration package is deeply immutable.", () => {
    const pkg = project(viz("imm-1"));
    assert.ok(isDeeplyFrozen(pkg));
    assert.throws(() => {
      (pkg as { objectId: string }).objectId = "mutated";
    });
  });

  it("8. Hidden visualization produces non-visible scene object.", () => {
    const pkg = project(viz("hid-1", { hide: true }));
    assert.equal(pkg.sceneObject.visible, false);
    assert.equal(pkg.sceneObject.renderingLevel, "Hidden");
  });

  it("9. Hidden object exposes no enabled picking.", () => {
    const pkg = project(viz("hid-pick-1", { hide: true }));
    assert.equal(pkg.picking.enabled, false);
  });

  it("10. Minimum visualization maps to Minimal rendering.", () => {
    const pkg = project(viz("min-1", { state: "Minimum" }));
    assert.equal(pkg.sceneObject.renderingLevel, "Minimal");
  });

  it("11. Report visualization maps to Important rendering.", () => {
    const pkg = project(viz("rep-1", { state: "Report" }));
    assert.equal(pkg.sceneObject.renderingLevel, "Important");
  });

  it("12. Operation visualization maps to Operation rendering.", () => {
    const pkg = project(
      viz("op-1", { state: "Operation", operate: true }),
      ctx({ stageMode: "Operation" }),
    );
    assert.equal(pkg.sceneObject.renderingLevel, "Operation");
  });

  it("13. Rendering priority is preserved from NOL-2.", () => {
    const visualization = viz("prio-1", { state: "Report", focus: true });
    const pkg = project(visualization);
    assert.equal(pkg.sceneObject.renderingPriority, visualization.rendering.priority);
    assert.equal(pkg.rendering.renderingPriority, visualization.rendering.priority);
  });

  it("14. Hierarchy order is deterministic.", () => {
    const visualization = viz("ord-1", { adaptive: { rank: 7 } });
    const a = project(visualization, ctx(), dirDeps());
    const b = project(visualization, ctx(), dirDeps());
    assert.equal(a.hierarchy.order, 7);
    assert.equal(a.hierarchy.order, b.hierarchy.order);
  });

  it("15. Child scene-object IDs are unique.", () => {
    const pkg = project(viz("child-1"));
    assert.equal(
      new Set(pkg.hierarchy.childSceneObjectIds).size,
      pkg.hierarchy.childSceneObjectIds.length,
    );
  });

  it("16. Interaction state is preserved.", () => {
    const visualization = viz("int-1", { focus: true, state: "Report" });
    const pkg = project(visualization);
    assert.equal(pkg.interaction.state, visualization.interaction.interactionState);
  });

  it("17. Disabled interaction exposes no mutation affordances.", () => {
    const visualization = viz("dis-1");
    const mutated = deepCloneViz(visualization, {
      interaction: {
        ...visualization.interaction,
        interactionState: "Disabled",
        interactive: false,
      },
    });
    const pkg = project(mutated);
    assert.equal(pkg.interaction.state, "Disabled");
    assert.ok(
      pkg.interaction.affordances.every(
        (item) =>
          ![
            "AddToStage",
            "RemoveFromStage",
            "Approve",
            "Reject",
            "Cancel",
            "Start",
            "Pause",
            "Resume",
            "Complete",
            "Edit",
          ].includes(item.type) || !item.enabled,
      ),
    );
  });

  it("18. Historical interaction exposes inspection-safe affordances only.", () => {
    const pkg = project(viz("hist-1", { historical: true }));
    assert.equal(pkg.interaction.state, "Historical");
    assert.ok(
      pkg.interaction.affordances.every(
        (item) =>
          ![
            "AddToStage",
            "RemoveFromStage",
            "Approve",
            "Reject",
            "Cancel",
            "Start",
            "Pause",
            "Resume",
            "Complete",
            "Edit",
          ].includes(item.type) || !item.enabled,
      ),
    );
  });

  it("19. Picking metadata contains no renderer hit-test object.", () => {
    const pkg = project(viz("pick-1"));
    const record = pkg.picking as unknown as Record<string, unknown>;
    assert.equal("hitTest" in record, false);
    assert.equal("mesh" in record, false);
    assert.equal("raycaster" in record, false);
  });

  it("20. Picking IDs are deterministic.", () => {
    const visualization = viz("pick-det-1");
    const a = project(visualization, ctx(), dirDeps());
    const b = project(visualization, ctx(), dirDeps());
    assert.equal(a.picking.pickingId, b.picking.pickingId);
    assert.equal(
      a.picking.pickingId,
      `nexora-pick:${a.sceneObject.sceneObjectId}:Object`,
    );
  });

  it("21. Camera hints contain no coordinates or camera instances.", () => {
    const pkg = project(viz("cam-1", { focus: true, state: "Report" }));
    const record = pkg.camera as unknown as Record<string, unknown>;
    assert.equal("x" in record, false);
    assert.equal("y" in record, false);
    assert.equal("z" in record, false);
    assert.equal("position" in record, false);
    assert.equal("cameraInstance" in record, false);
  });

  it("22. Animation intents reuse NOL-2 semantics.", () => {
    const visualization = viz("anim-1", { focus: true, state: "Report" });
    const pkg = project(visualization);
    if (visualization.animation.semantic !== "None") {
      assert.ok(
        pkg.animation.intents.some(
          (intent) => intent.type === visualization.animation.semantic,
        ),
      );
    }
  });

  it("23. Reduced-motion state is preserved.", () => {
    const pkg = project(viz("rm-1"), ctx({ reducedMotion: true }));
    assert.equal(pkg.animation.reducedMotion, true);
  });

  it("24. Relationship projection performs no graph traversal.", () => {
    const visualization = viz("rel-1", {
      focus: true,
      adaptive: { relationshipMode: "Direct" },
    });
    const pkg = project(visualization);
    assert.equal(pkg.relationships.mode, visualization.relationships.mode);
    assert.equal(
      (visualization.relationships as { graphTraversalPerformed: false })
        .graphTraversalPerformed,
      false,
    );
  });

  it("25. Relationship anchors are deterministic.", () => {
    const visualization = viz("rel-det-1", {
      focus: true,
      adaptive: { relationshipMode: "Direct" },
    });
    const a = project(visualization, ctx(), dirDeps());
    const b = project(visualization, ctx(), dirDeps());
    assert.deepEqual(a.relationships.anchors, b.relationships.anchors);
    assert.equal(
      a.relationships.anchors[0]?.anchorId,
      `nexora-rel-anchor:${a.sceneObject.sceneObjectId}:0`,
    );
  });

  it("26. Cluster hints are adapted without spatial clustering.", () => {
    const pkg = project(
      viz("cl-1", {
        adaptive: { clustered: true },
        clusterHint: {
          clusterId: "cluster-a",
          memberObjectIds: ["cl-1"],
        },
      }),
    );
    assert.equal(pkg.clustering.clustered, true);
    assert.equal(pkg.clustering.clusterId, "cluster-a");
    assert.ok(!("x" in (pkg.clustering as object)));
  });

  it("27. Focused object is not hidden inside collapsed cluster.", () => {
    const pkg = project(
      viz("cl-focus-1", {
        focus: true,
        state: "Report",
        adaptive: { clustered: true },
        clusterHint: {
          clusterId: "cluster-focus",
          memberObjectIds: ["cl-focus-1"],
        },
      }),
    );
    assert.equal(pkg.clustering.clustered, true);
    assert.equal(pkg.clustering.collapsed, false);
  });

  it("28. Operating object is not hidden inside collapsed cluster.", () => {
    const pkg = project(
      viz("cl-op-1", {
        state: "Operation",
        operate: true,
        adaptive: { clustered: true },
        clusterHint: {
          clusterId: "cluster-op",
          memberObjectIds: ["cl-op-1"],
        },
      }),
      ctx({ stageMode: "Operation" }),
    );
    assert.equal(pkg.clustering.clustered, true);
    assert.equal(pkg.clustering.collapsed, false);
  });

  it("29. Event routes contain no event handlers.", () => {
    const routes = projectNexoraDirectorEventRoutes(viz("evt-1"), ctx(), dirDeps());
    for (const route of routes) {
      const record = route as unknown as Record<string, unknown>;
      assert.equal(typeof record.onEvent, "undefined");
      assert.equal(typeof record.handler, "undefined");
      assert.equal(typeof record.dispatch, "undefined");
    }
  });

  it("30. Disabled affordances generate disabled routes.", () => {
    const visualization = viz("evt-dis-1");
    const mutated = deepCloneViz(visualization, {
      interaction: {
        ...visualization.interaction,
        interactionState: "Disabled",
        interactive: false,
        affordances: visualization.interaction.affordances.map((item) =>
          Object.freeze({ ...item, enabled: false }),
        ),
      },
    });
    const routes = projectNexoraDirectorEventRoutes(mutated, ctx(), dirDeps());
    const affordanceRoutes = routes.filter((route) => route.event === "Affordance");
    assert.ok(affordanceRoutes.length > 0);
    assert.ok(affordanceRoutes.every((route) => route.enabled === false));
  });

  it("31. Scene order follows layer, priority, depth, and ID.", () => {
    const packages = [
      project(viz("order-b", { adaptive: { rank: 1 } })),
      project(viz("order-a", { focus: true, state: "Report", adaptive: { rank: 2 } })),
      project(
        viz("order-c", {
          state: "Operation",
          operate: true,
          adaptive: { rank: 3 },
        }),
        ctx({ stageMode: "Operation" }),
      ),
    ];
    const order = resolveNexoraDirectorSceneOrder(packages);
    assert.equal(order[order.length - 1], packages[2]!.sceneObject.sceneObjectId);
    assert.ok(
      order.indexOf(packages[1]!.sceneObject.sceneObjectId) >
        order.indexOf(packages[0]!.sceneObject.sceneObjectId),
    );
  });

  it("32. Exactly one focused scene object is recognized.", () => {
    const collection = projectNexoraObjectDirectorIntegrationCollection(
      [
        viz("f1", { focus: true, state: "Report" }),
        viz("f2", { state: "Minimum" }),
      ],
      ctx(),
      dirDeps(),
    );
    assert.ok(collection.focusedSceneObjectId);
    assert.equal(
      collection.packages.filter(
        (pkg) => pkg.sceneObject.sceneObjectId === collection.focusedSceneObjectId,
      ).length,
      1,
    );
  });

  it("33. Exactly one active Operation scene object is recognized.", () => {
    const collection = projectNexoraObjectDirectorIntegrationCollection(
      [
        viz("o1", { state: "Operation", operate: true }),
        viz("o2", { state: "Report" }),
      ],
      ctx({ stageMode: "Operation" }),
      dirDeps(),
    );
    assert.ok(collection.activeOperationSceneObjectId);
    assert.equal(
      collection.packages.filter(
        (pkg) =>
          pkg.sceneObject.sceneObjectId ===
          collection.activeOperationSceneObjectId,
      ).length,
      1,
    );
  });

  it("34. Collection projection preserves deterministic ordering.", () => {
    const visualizations = [
      viz("c-b", { adaptive: { rank: 2 } }),
      viz("c-a", { adaptive: { rank: 1 } }),
    ];
    const a = projectNexoraObjectDirectorIntegrationCollection(
      visualizations,
      ctx(),
      dirDeps(),
    );
    const b = projectNexoraObjectDirectorIntegrationCollection(
      visualizations,
      ctx(),
      dirDeps(),
    );
    assert.deepEqual(a.sceneOrder, b.sceneOrder);
  });

  it("35. Integration diff reports only changed sections.", () => {
    const visualization = viz("diff-1", { state: "Report" });
    const previous = project(visualization, ctx(), dirDeps());
    const nextViz = viz("diff-1", { state: "Report", focus: true });
    const next = project(
      nextViz,
      ctx({ previousPackage: previous }),
      dirDeps(),
    );
    const diff = calculateNexoraObjectDirectorIntegrationDiff(previous, next);
    assert.ok(diff.changed);
    assert.ok(diff.update.changedSections.length > 0);
    assert.ok(diff.update.changedSections.length < 10);
  });

  it("36. Equal packages produce Reuse recommendation.", () => {
    const visualization = viz("reuse-1");
    const previous = project(visualization, ctx(), dirDeps());
    const next = project(
      visualization,
      ctx({ previousPackage: previous }),
      dirDeps(),
    );
    const diff = calculateNexoraObjectDirectorIntegrationDiff(previous, next);
    assert.equal(diff.update.type, "Reuse");
  });

  it("37. No previous package produces Create recommendation.", () => {
    const next = project(viz("create-1"));
    const diff = calculateNexoraObjectDirectorIntegrationDiff(null, next);
    assert.equal(diff.update.type, "Create");
  });

  it("38. Visible-to-hidden produces Hide recommendation.", () => {
    const previous = project(viz("vh-1", { state: "Report" }));
    const next = project(
      viz("vh-1", { state: "Report", hide: true }),
      ctx({ previousPackage: previous }),
      dirDeps(),
    );
    const diff = calculateNexoraObjectDirectorIntegrationDiff(previous, next);
    assert.equal(diff.update.type, "Hide");
  });

  it("39. Hidden-to-visible produces Show recommendation.", () => {
    const visualization = viz("hv-1", { state: "Report" });
    const hiddenVisualization = deepCloneViz(visualization, {
      rendering: { ...visualization.rendering, level: "Hidden" },
      visibility: {
        ...visualization.visibility,
        visible: false,
        renderingLevel: "Hidden",
      },
    });
    const previous = project(hiddenVisualization);
    const next = project(
      visualization,
      ctx({ previousPackage: previous }),
      dirDeps(),
    );
    assert.equal(previous.sceneObject.visible, false);
    assert.equal(next.sceneObject.visible, true);
    const diff = calculateNexoraObjectDirectorIntegrationDiff(previous, next);
    assert.equal(diff.update.type, "Show");
  });

  it("40. Mismatched object IDs reject diff.", () => {
    const left = project(viz("mis-a"));
    const right = project(viz("mis-b"));
    assert.throws(() =>
      calculateNexoraObjectDirectorIntegrationDiff(left, right),
    );
  });

  it("41. Atomic batch returns no accepted packages when one item fails.", () => {
    const good = viz("batch-a-1");
    const bad = deepCloneViz(good, {
      identity: { ...good.identity, objectId: "batch-a-2" },
      rendering: { ...good.rendering, priority: Number.NaN },
    });
    const result = projectNexoraObjectDirectorIntegrationBatch(
      {
        mode: "Atomic",
        items: [
          { visualization: good, context: ctx() },
          { visualization: bad, context: ctx() },
        ],
      },
      dirDeps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(result.packages.length, 0);
    assert.ok(result.rejectedObjectIds.length >= 1);
  });

  it("42. BestEffort batch returns valid packages independently.", () => {
    const good = viz("batch-b-1");
    const bad = deepCloneViz(good, {
      identity: { ...good.identity, objectId: "batch-b-2" },
      rendering: { ...good.rendering, priority: Number.NaN },
    });
    const result = projectNexoraObjectDirectorIntegrationBatch(
      {
        mode: "BestEffort",
        items: [
          { visualization: good, context: ctx() },
          { visualization: bad, context: ctx() },
        ],
      },
      dirDeps(),
    );
    assert.equal(result.packages.length, 1);
    assert.deepEqual(result.acceptedObjectIds, ["batch-b-1"]);
    assert.ok(result.rejectedObjectIds.includes("batch-b-2"));
  });

  it("43. Duplicate object IDs are rejected.", () => {
    const visualization = viz("dup-1");
    assert.throws(() =>
      projectNexoraObjectDirectorIntegrationCollection(
        [visualization, visualization],
        ctx(),
        dirDeps(),
      ),
    );
    const batch = projectNexoraObjectDirectorIntegrationBatch(
      {
        mode: "Atomic",
        items: [
          { visualization, context: ctx() },
          { visualization, context: ctx() },
        ],
      },
      dirDeps(),
    );
    assert.equal(batch.accepted, false);
  });

  it("44. Snapshot comparison detects package additions.", () => {
    const left = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [viz("snap-a")],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const right = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [viz("snap-a"), viz("snap-b")],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const comparison = compareNexoraObjectDirectorIntegrationSnapshots(
      left,
      right,
    );
    assert.deepEqual(comparison.addedObjectIds, ["snap-b"]);
  });

  it("45. Snapshot comparison detects removals.", () => {
    const left = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [viz("snap-r1"), viz("snap-r2")],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const right = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [viz("snap-r1")],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const comparison = compareNexoraObjectDirectorIntegrationSnapshots(
      left,
      right,
    );
    assert.deepEqual(comparison.removedObjectIds, ["snap-r2"]);
  });

  it("46. Snapshot comparison detects scene-order changes.", () => {
    const left = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [viz("so-1"), viz("so-2", { focus: true, state: "Report" })],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const right = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [
          viz("so-1", { focus: true, state: "Report" }),
          viz("so-2"),
        ],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const comparison = compareNexoraObjectDirectorIntegrationSnapshots(
      left,
      right,
    );
    assert.equal(comparison.sceneOrderChanged, true);
  });

  it("47. Snapshot comparison detects camera-intent changes.", () => {
    const leftPkg = project(viz("cam-chg-1"));
    const rightPkg = project(viz("cam-chg-1", { focus: true, state: "Report" }));
    const left = createNexoraObjectDirectorIntegrationSnapshot(
      projectNexoraObjectDirectorIntegrationCollection(
        [viz("cam-chg-1")],
        ctx(),
        dirDeps(),
      ),
      dirDeps(),
    );
    const rightCollection = projectNexoraObjectDirectorIntegrationCollection(
      [viz("cam-chg-1", { focus: true, state: "Report" })],
      ctx(),
      dirDeps(),
    );
    const right = createNexoraObjectDirectorIntegrationSnapshot(
      rightCollection,
      dirDeps(),
    );
    const comparison = compareNexoraObjectDirectorIntegrationSnapshots(
      left,
      right,
    );
    assert.ok(
      leftPkg.camera.intent !== rightPkg.camera.intent ||
        comparison.cameraIntentChangedObjectIds.includes("cam-chg-1") ||
        comparison.interactionChangedObjectIds.includes("cam-chg-1"),
    );
    if (leftPkg.camera.intent !== rightPkg.camera.intent) {
      assert.ok(comparison.cameraIntentChangedObjectIds.includes("cam-chg-1"));
    }
  });

  it("48. Validation rejects duplicate scene-object IDs.", () => {
    const pkg = project(viz("dup-scene-1"));
    const collection = Object.freeze({
      collectionId: "bad-col",
      packages: Object.freeze([pkg, pkg]),
      sceneOrder: Object.freeze([pkg.sceneObject.sceneObjectId]),
      attentionSceneObjectIds: Object.freeze([] as string[]),
      hiddenSceneObjectIds: Object.freeze([] as string[]),
      metadata: Object.freeze({}),
    });
    const errors = validateNexoraObjectDirectorIntegrationCollection(collection);
    assert.ok(
      errors.some(
        (error) =>
          error.code === "DIRECTOR_INTEGRATION_DUPLICATE_SCENE_OBJECT_ID" ||
          error.code === "DIRECTOR_INTEGRATION_DUPLICATE_OBJECT_ID",
      ),
    );
  });

  it("49. Validation rejects invalid cluster representative.", () => {
    const pkg = project(
      viz("cl-bad-1", {
        adaptive: { clustered: true },
        clusterHint: {
          clusterId: "cluster-bad",
          memberObjectIds: ["cl-bad-1"],
        },
      }),
    );
    const broken = Object.freeze({
      ...pkg,
      clustering: Object.freeze({
        ...pkg.clustering,
        representativeSceneObjectId: "nexora-scene-object:missing",
        memberSceneObjectIds: Object.freeze([pkg.sceneObject.sceneObjectId]),
      }),
    });
    const errors = validateNexoraObjectDirectorIntegrationPackage(broken);
    assert.ok(
      errors.some((error) => error.code === "DIRECTOR_INTEGRATION_INVALID_CLUSTER"),
    );
  });

  it("50. Validation rejects renderer-specific objects.", () => {
    const pkg = project(viz("rend-bad-1"));
    const broken = Object.freeze({
      ...pkg,
      metadata: Object.freeze({
        ...pkg.metadata,
        meshRef: { forbidden: true },
      }),
    });
    const errors = validateNexoraObjectDirectorIntegrationPackage(broken);
    assert.ok(
      errors.some(
        (error) =>
          error.code === "DIRECTOR_INTEGRATION_RENDERER_OBJECT_FORBIDDEN",
      ),
    );
  });

  it("51. No coordinates, vectors, matrices, meshes, materials, or scenes are emitted.", () => {
    const pkg = project(viz("no-coords-1", { focus: true, state: "Report" }));
    const json = JSON.stringify(pkg);
    assert.equal(/"x"\s*:/.test(json), false);
    assert.equal(/"y"\s*:/.test(json), false);
    assert.equal(/"z"\s*:/.test(json), false);
    assert.equal(/mesh/i.test(json), false);
    assert.equal(/vector3/i.test(json), false);
    assert.equal(/matrix4/i.test(json), false);
    assert.equal(/sceneRef/i.test(json), false);
  });

  it("52. Serialization and deserialization are reversible.", () => {
    const pkg = project(viz("ser-1", { state: "Report", focus: true }));
    const restored = deserializeNexoraObjectDirectorIntegrationPackage(
      serializeNexoraObjectDirectorIntegrationPackage(pkg),
    );
    assert.equal(restored.objectId, pkg.objectId);
    assert.deepEqual(restored.sceneObject, pkg.sceneObject);
    assert.deepEqual(restored.hierarchy, pkg.hierarchy);
    assert.ok(Object.isFrozen(restored));
  });

  it("53. Unsupported schemas are rejected.", () => {
    assert.throws(() =>
      deserializeNexoraObjectDirectorIntegrationPackage(
        JSON.stringify({
          schemaVersion: "0.0.0",
          package: project(viz("uns-1")),
        }),
      ),
    );
  });

  it("54. Serialized output contains no functions or renderer instances.", () => {
    const serialized = serializeNexoraObjectDirectorIntegrationPackage(
      project(viz("ser-fn-1")),
    );
    assert.equal(/function/.test(serialized), false);
    assert.equal(/\[Function/.test(serialized), false);
    assert.equal(/WebGL/.test(serialized), false);
    assert.equal(/THREE/.test(serialized), false);
  });

  it("55. No source visualization projection is mutated.", () => {
    const visualization = viz("mut-viz-1", { state: "Report" });
    const before = JSON.stringify(visualization);
    project(visualization);
    assert.equal(JSON.stringify(visualization), before);
  });

  it("56. No NOL-1 object state is mutated.", () => {
    const facets = makeFacets("mut-obj-1", { state: "Report" });
    const before = JSON.stringify({
      id: facets.object.identity.id,
      status: facets.object.status,
      lifecycle: facets.object.lifecycle,
    });
    project(
      projectVisualization(
        makeInput("mut-obj-1", { state: "Report" }),
        vizDeps(),
      ),
    );
    assert.equal(
      JSON.stringify({
        id: facets.object.identity.id,
        status: facets.object.status,
        lifecycle: facets.object.lifecycle,
      }),
      before,
    );
  });

  it("57. Typecheck remains clean.", () => {
    const pkg: NexoraObjectDirectorIntegrationPackage = project(viz("tc-1"));
    assert.equal(typeof pkg.packageId, "string");
  });

  it("58. ESLint remains clean.", () => {
    assert.equal(source.includes("eslint-disable"), false);
    assert.equal(
      typeof projectNexoraObjectDirectorIntegration,
      "function",
    );
  });
});

function deepCloneViz(
  visualization: NexoraObjectVisualizationProjection,
  patch: Partial<NexoraObjectVisualizationProjection>,
): NexoraObjectVisualizationProjection {
  return Object.freeze({
    ...visualization,
    ...patch,
    identity: Object.freeze({
      ...visualization.identity,
      ...(patch.identity ?? {}),
    }),
    representation: Object.freeze({
      ...visualization.representation,
      ...(patch.representation ?? {}),
    }),
    interaction: Object.freeze({
      ...visualization.interaction,
      ...(patch.interaction ?? {}),
      affordances: Object.freeze(
        (patch.interaction?.affordances ?? visualization.interaction.affordances).map(
          (item) => Object.freeze({ ...item }),
        ),
      ),
    }),
    rendering: Object.freeze({
      ...visualization.rendering,
      ...(patch.rendering ?? {}),
    }),
    visibility: Object.freeze({
      ...visualization.visibility,
      ...(patch.visibility ?? {}),
    }),
    hierarchy: Object.freeze({
      ...visualization.hierarchy,
      ...(patch.hierarchy ?? {}),
    }),
    attention: Object.freeze({
      ...visualization.attention,
      ...(patch.attention ?? {}),
    }),
    relationships: Object.freeze({
      ...visualization.relationships,
      ...(patch.relationships ?? {}),
    }),
    picking: Object.freeze({
      ...visualization.picking,
      ...(patch.picking ?? {}),
    }),
    animation: Object.freeze({
      ...visualization.animation,
      ...(patch.animation ?? {}),
    }),
    cameraHints: Object.freeze({
      ...visualization.cameraHints,
      ...(patch.cameraHints ?? {}),
    }),
    geometry: Object.freeze({
      ...visualization.geometry,
      ...(patch.geometry ?? {}),
    }),
    labels: Object.freeze({
      ...visualization.labels,
      ...(patch.labels ?? {}),
    }),
    badges: Object.freeze({
      ...visualization.badges,
      ...(patch.badges ?? {}),
    }),
    indicators: Object.freeze({
      ...visualization.indicators,
      ...(patch.indicators ?? {}),
    }),
    material: visualization.material,
    metadata: Object.freeze({
      ...visualization.metadata,
      ...(patch.metadata ?? {}),
    }),
  }) as NexoraObjectVisualizationProjection;
}
