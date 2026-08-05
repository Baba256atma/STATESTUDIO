/**
 * NOL-2:6 — NexoraObject Visualization & Director Projection Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { universalNexoraObjectPublicIndex } from "../universalNexoraObjectPublicIndex.ts";
import { projectNexoraObjectRepresentation } from "./nexoraObjectMaterialRepresentationFoundation.ts";
import { resolveMaterialState } from "./nexoraObjectMaterialStateResolutionModel.ts";
import { createNexoraObjectRepresentationTransitionState } from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import type { NexoraObjectAdaptiveRepresentationRecommendation } from "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";
import {
  resolveNexoraObjectMaterialInteractionAttention,
  type NexoraObjectMaterialAttentionDependencies,
  type NexoraObjectMaterialInteractionAttentionInput,
} from "./nexoraObjectMaterialInteractionAttentionEngine.ts";
import {
  calculateVisualizationProjectionDiff,
  deserializeVisualizationProjection,
  projectDirectorPackage,
  projectGeometry,
  projectRenderingPriority,
  projectVisualization,
  projectVisualizationCollection,
  serializeVisualizationProjection,
  visualizationDirectorProjectionEngineIdentity,
  type NexoraObjectVisualizationDependencies,
  type NexoraObjectVisualizationProjectionInput,
} from "./nexoraObjectVisualizationDirectorProjectionEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectVisualizationDirectorProjectionEngine.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

const NOW = "2026-08-04T16:54:00.000Z";

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
  } = {},
): NexoraObjectVisualizationProjectionInput {
  const facets = makeFacets(id, options);
  const adaptive = makeAdaptive(id, {
    currentState: facets.representation.state,
    recommendedState: options.adaptive?.recommendedState ?? facets.representation.state,
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
    metadata: options.metadata,
  });
}

describe("NOL-2:6 NexoraObject Visualization & Director Projection Engine", () => {
  it("1. Engine identity is exact.", () => {
    assert.equal(
      visualizationDirectorProjectionEngineIdentity,
      "NOL-2:6/NexoraObjectVisualizationDirectorProjectionEngine",
    );
  });

  it("2. Imports limited to NOL-2:1–2:5.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(
      imports.sort(),
      [
        "./nexoraObjectMaterialRepresentationFoundation.ts",
        "./nexoraObjectMaterialStateResolutionModel.ts",
        "./nexoraObjectRepresentationTransitionBehaviorEngine.ts",
        "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts",
        "./nexoraObjectMaterialInteractionAttentionEngine.ts",
      ].sort(),
    );
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
    assert.equal(/\bTHREE\b/.test(source), false);
  });

  it("3. Projection is deterministic.", () => {
    const input = makeInput("det-1", { state: "Report", focus: true });
    const a = projectVisualization(input, vizDeps());
    const b = projectVisualization(input, vizDeps());
    assert.equal(a.rendering.level, b.rendering.level);
    assert.equal(a.rendering.priority, b.rendering.priority);
    assert.deepEqual(a.geometry, b.geometry);
    assert.deepEqual(a.labels, b.labels);
    assert.equal(a.identity.seedColor, b.identity.seedColor);
  });

  it("4. Output is deeply immutable.", () => {
    const projection = projectVisualization(makeInput("imm-1"), vizDeps());
    assert.ok(Object.isFrozen(projection));
    assert.ok(Object.isFrozen(projection.geometry));
    assert.ok(Object.isFrozen(projection.labels));
    assert.throws(() => {
      (projection as { metadata: Record<string, unknown> }).metadata = {};
    });
  });

  it("5. Hidden objects produce Hidden rendering.", () => {
    const projection = projectVisualization(
      makeInput("hid-1", { hide: true }),
      vizDeps(),
    );
    assert.equal(projection.rendering.level, "Hidden");
    assert.equal(projection.visibility.visible, false);
  });

  it("6. Minimal representation projects correctly.", () => {
    const projection = projectVisualization(
      makeInput("min-1", { state: "Minimum" }),
      vizDeps(),
    );
    assert.equal(projection.representation.state, "Minimum");
    assert.equal(projection.rendering.level, "Minimal");
  });

  it("7. Report projects Important rendering.", () => {
    const projection = projectVisualization(
      makeInput("rep-1", { state: "Report" }),
      vizDeps(),
    );
    assert.equal(projection.rendering.level, "Important");
  });

  it("8. Operation projects Operation rendering.", () => {
    const projection = projectVisualization(
      makeInput("op-1", { state: "Operation", operate: true }),
      vizDeps(),
    );
    assert.equal(projection.rendering.level, "Operation");
    assert.equal(projection.rendering.priorityBand, "Operation");
  });

  it("9. Labels are preserved.", () => {
    const projection = projectVisualization(
      makeInput("lab-1", {
        state: "Report",
        adaptive: { labelMode: "Full" },
      }),
      vizDeps(),
    );
    assert.equal(projection.labels.mode, "Full");
    assert.equal(projection.labels.source, "AdaptiveDensity");
  });

  it("10. Badges are preserved.", () => {
    const input = makeInput("bad-1", {
      state: "Report",
      adaptive: { maximumBadgeCount: 2 },
    });
    const projection = projectVisualization(input, vizDeps());
    assert.ok(projection.badges.maximumBadgeCount <= 2);
    assert.ok(Array.isArray(projection.badges.badges));
  });

  it("11. Indicators are preserved.", () => {
    const projection = projectVisualization(
      makeInput("ind-1", {
        state: "Report",
        adaptive: { indicatorMode: "Executive" },
      }),
      vizDeps(),
    );
    assert.equal(projection.indicators.mode, "Executive");
    assert.equal(
      typeof projection.indicators.indicators.statusVisible,
      "boolean",
    );
  });

  it("12. Attention projection is preserved.", () => {
    const projection = projectVisualization(
      makeInput("att-1", { status: "Red" }),
      vizDeps(),
    );
    assert.equal(projection.attention.attentionState, "Critical");
    assert.equal(projection.identity.seedColor, "Red");
  });

  it("13. Geometry contains no coordinates.", () => {
    const input = makeInput("geo-1");
    const geometry = projectGeometry(
      input.representation,
      input.adaptiveRecommendation,
    );
    const projection = projectVisualization(input, vizDeps());
    assert.equal(geometry.coordinatesForbidden, true);
    assert.equal(projection.geometry.coordinatesForbidden, true);
    assert.equal("x" in projection.geometry, false);
    assert.equal("position" in projection.geometry, false);
  });

  it("14. Camera hints are renderer-independent.", () => {
    const projection = projectVisualization(
      makeInput("cam-1", { focus: true, state: "Report" }),
      vizDeps(),
    );
    assert.ok(
      ["Normal", "Center", "Follow", "Overview", "Inspection"].includes(
        projection.cameraHints.hint,
      ),
    );
    assert.equal(typeof projection.cameraHints.weight, "number");
  });

  it("15. Relationship projection never traverses graphs.", () => {
    const projection = projectVisualization(
      makeInput("rel-1", {
        focus: true,
        adaptive: { relationshipMode: "Direct" },
      }),
      vizDeps(),
    );
    assert.equal(projection.relationships.graphTraversalPerformed, false);
    assert.equal(projection.relationships.mode, "Direct");
  });

  it("16. Picking metadata is complete.", () => {
    const projection = projectVisualization(
      makeInput("pick-1", { objectType: "Goal", focus: true }),
      vizDeps(),
    );
    assert.equal(projection.picking.objectId, "pick-1");
    assert.equal(projection.picking.objectType, "Goal");
    assert.ok(projection.picking.layer);
    assert.ok(projection.picking.interactionState);
    assert.ok(projection.picking.representationState);
    assert.ok(projection.picking.renderingLevel);
  });

  it("17. Rendering priority is deterministic.", () => {
    const op = projectRenderingPriority(
      makeInput("p-op", { state: "Operation", operate: true }),
    );
    const focus = projectRenderingPriority(
      makeInput("p-focus", { state: "Report", focus: true }),
    );
    const bg = projectRenderingPriority(makeInput("p-bg", { state: "Minimum" }));
    assert.ok(op.priority > focus.priority);
    assert.ok(focus.priority > bg.priority);
    assert.equal(op.priorityBand, "Operation");
  });

  it("18. Update diff detects changed sections only.", () => {
    const base = makeInput("diff-1", { state: "Minimum" });
    const previous = projectVisualization(base, vizDeps());
    const next = projectVisualization(
      makeInput("diff-1", { state: "Report", focus: true }),
      vizDeps(),
    );
    const diff = calculateVisualizationProjectionDiff(previous, next);
    assert.equal(diff.changed, true);
    assert.ok(diff.changedSections.includes("rendering"));
    assert.ok(diff.changedSections.includes("representation"));
    assert.ok(diff.changedSections.length < 17);
    const unchanged = calculateVisualizationProjectionDiff(previous, previous);
    assert.equal(unchanged.changed, false);
    assert.deepEqual([...unchanged.changedSections], []);
  });

  it("19. Batch projection preserves ordering.", () => {
    const batch = projectVisualizationCollection(
      {
        mode: "BestEffort",
        inputs: [
          makeInput("o1"),
          makeInput("o2", { state: "Report" }),
          makeInput("o3", { status: "Red" }),
        ],
      },
      vizDeps(),
    );
    assert.deepEqual(
      batch.projections.map((p) => p.identity.objectId),
      ["o1", "o2", "o3"],
    );
  });

  it("20. Atomic batch rejects partial success.", () => {
    const good = makeInput("atomic-good");
    const bad = Object.freeze({
      ...makeInput("atomic-bad"),
      transitionState: Object.freeze({
        ...makeInput("atomic-bad").transitionState,
        objectId: "mismatch",
      }),
    });
    const batch = projectVisualizationCollection(
      { mode: "Atomic", inputs: [good, bad] },
      vizDeps(),
    );
    assert.equal(batch.accepted, false);
    assert.equal(batch.projections.length, 0);
  });

  it("21. BestEffort batch succeeds independently.", () => {
    const good = makeInput("be-good");
    const bad = Object.freeze({
      ...makeInput("be-bad"),
      transitionState: Object.freeze({
        ...makeInput("be-bad").transitionState,
        objectId: "other",
      }),
    });
    const batch = projectVisualizationCollection(
      { mode: "BestEffort", inputs: [good, bad] },
      vizDeps(),
    );
    assert.ok(batch.projections.some((p) => p.identity.objectId === "be-good"));
    assert.ok(batch.rejectedObjectIds.includes("be-bad"));
  });

  it("22. Serialization is reversible.", () => {
    const projection = projectVisualization(
      makeInput("ser-1", { state: "Report", focus: true }),
      vizDeps(),
    );
    const round = deserializeVisualizationProjection(
      serializeVisualizationProjection(projection),
    );
    assert.equal(round.identity.objectId, projection.identity.objectId);
    assert.equal(round.rendering.level, projection.rendering.level);
    assert.deepEqual(round.geometry, projection.geometry);
    assert.ok(Object.isFrozen(round));
  });

  it("23. Unsupported schemas are rejected.", () => {
    assert.throws(() =>
      deserializeVisualizationProjection(
        JSON.stringify({
          schemaVersion: "0.0.1",
          projection: projectVisualization(makeInput("u1"), vizDeps()),
        }),
      ),
    );
  });

  it("24. No renderer-specific objects exist.", () => {
    const projection = projectVisualization(makeInput("rr-1"), vizDeps());
    const json = serializeVisualizationProjection(projection);
    assert.equal(json.includes("THREE"), false);
    assert.equal(json.includes("HTMLElement"), false);
    assert.equal(json.includes("function"), false);
    assert.equal(json.includes("Mesh"), false);
  });

  it("25. No NOL-1 state is mutated.", () => {
    const facets = makeFacets("nol1-1");
    const before = {
      identity: JSON.stringify(facets.object.identity),
      status: facets.object.status,
      lifecycle: facets.object.lifecycle,
    };
    projectVisualization(makeInput("nol1-1", { focus: true }), vizDeps());
    assert.equal(JSON.stringify(facets.object.identity), before.identity);
    assert.equal(facets.object.status, before.status);
    assert.equal(facets.object.lifecycle, before.lifecycle);
  });

  it("26. Typecheck passes.", () => {
    assert.equal(typeof projectVisualization, "function");
    assert.equal(typeof projectDirectorPackage, "function");
  });

  it("27. ESLint passes.", () => {
    assert.equal(typeof calculateVisualizationProjectionDiff, "function");
  });

  it("Director package aggregates projections.", () => {
    const pkg = projectDirectorPackage(
      [makeInput("d1"), makeInput("d2", { state: "Report" })],
      vizDeps(),
    );
    assert.equal(
      pkg.engineIdentity,
      "NOL-2:6/NexoraObjectVisualizationDirectorProjectionEngine",
    );
    assert.equal(pkg.projections.length, 2);
    assert.equal(pkg.createdAt, NOW);
  });
});
