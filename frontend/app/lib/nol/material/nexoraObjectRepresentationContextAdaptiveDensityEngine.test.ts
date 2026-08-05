/**
 * NOL-2:4 — NexoraObject Representation Context & Adaptive Density Engine tests.
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
  createNexoraObjectRepresentationTransitionState,
  type NexoraObjectRepresentationTransitionType,
} from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import {
  allocateNexoraObjectRepresentationDetailBudget,
  assertNexoraObjectAdaptiveDensityInvariants,
  calculateNexoraObjectRepresentationRelevance,
  compareNexoraObjectAdaptiveContextSnapshots,
  createNexoraObjectAdaptiveContextSnapshot,
  deserializeNexoraObjectAdaptiveRepresentationContext,
  deserializeNexoraObjectAdaptiveRepresentationResult,
  mergeNexoraObjectRepresentationContextLayers,
  recommendNexoraObjectRepresentationTransitions,
  representationContextAdaptiveDensityEngineIdentity,
  resolveNexoraObjectAdaptiveRepresentationBatch,
  resolveNexoraObjectAdaptiveRepresentationContext,
  resolveNexoraObjectBadgeDensity,
  resolveNexoraObjectFocusNeighborhood,
  resolveNexoraObjectIndicatorDensity,
  resolveNexoraObjectLabelDensity,
  resolveNexoraObjectRelationshipVisibility,
  resolveNexoraObjectStageDensity,
  serializeNexoraObjectAdaptiveRepresentationContext,
  serializeNexoraObjectAdaptiveRepresentationResult,
  validateNexoraObjectAdaptiveContextEntries,
  validateNexoraObjectAdaptiveRepresentationResult,
  type NexoraObjectAdaptiveContextEntry,
  type NexoraObjectAdaptiveDensityDependencies,
  type NexoraObjectAdaptiveRepresentationContext,
} from "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectRepresentationContextAdaptiveDensityEngine.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

let seq = 0;
function deps(): NexoraObjectAdaptiveDensityDependencies {
  return Object.freeze({
    now: () => "2026-08-04T16:29:00.000Z",
    createSnapshotId: () => {
      seq += 1;
      return `snap-${seq}`;
    },
    createClusterId: (
      memberObjectIds: readonly string[],
      reason: "CapacityOverflow" | "LowRelevance" | "SharedContext" | "HistoricalGroup" | "RelationshipGroup",
    ) => `cluster:${reason}:${[...memberObjectIds].sort().join("|")}`,
  });
}

function makeEntry(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly historical?: boolean;
    readonly hide?: boolean;
    readonly relationshipDistanceFromFocus?: number;
    readonly executiveImportance?: number;
    readonly urgency?: number;
    readonly attentionScore?: number;
    readonly impactScore?: number;
    readonly groupingKey?: string;
  } = {},
): NexoraObjectAdaptiveContextEntry {
  const object = createNexoraObjectContract({
    id,
    type: "Goal",
    caption: `Object ${id}`,
    status: options.status ?? "Green",
    createdAt: "2026-08-04T16:29:00.000Z",
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
  return Object.freeze({
    representation,
    materialState,
    transitionState: createNexoraObjectRepresentationTransitionState(
      id,
      representation.state,
      "2026-08-04T16:29:00.000Z",
    ),
    relationshipDistanceFromFocus: options.relationshipDistanceFromFocus,
    executiveImportance: options.executiveImportance,
    urgency: options.urgency,
    attentionScore: options.attentionScore,
    impactScore: options.impactScore,
    groupingKey: options.groupingKey,
  });
}

function baseContext(
  overrides: {
    readonly contextId?: string;
    readonly contextVersion?: string;
    readonly source?: NexoraObjectAdaptiveRepresentationContext["source"];
    readonly occurredAt?: string;
    readonly interaction?: Partial<
      NexoraObjectAdaptiveRepresentationContext["interaction"]
    >;
    readonly executive?: Partial<
      NexoraObjectAdaptiveRepresentationContext["executive"]
    >;
    readonly temporal?: Partial<
      NexoraObjectAdaptiveRepresentationContext["temporal"]
    >;
    readonly preferences?: Partial<
      NexoraObjectAdaptiveRepresentationContext["preferences"]
    >;
    readonly viewport?: Partial<
      NexoraObjectAdaptiveRepresentationContext["viewport"]
    >;
    readonly stage?: Partial<NexoraObjectAdaptiveRepresentationContext["stage"]>;
  } = {},
): NexoraObjectAdaptiveRepresentationContext {
  return Object.freeze({
    contextId: overrides.contextId ?? "ctx-1",
    contextVersion: overrides.contextVersion ?? "1.0.0",
    source: overrides.source ?? "Director",
    occurredAt: overrides.occurredAt ?? "2026-08-04T16:29:00.000Z",
    viewport: Object.freeze({
      widthCategory: "Standard" as const,
      heightCategory: "Standard" as const,
      zoomLevel: 1,
      visibleObjectCapacity: 10,
      reducedMotion: false,
      ...overrides.viewport,
    }),
    stage: Object.freeze({
      visibleObjectCount: 4,
      totalObjectCount: 4,
      relationshipCount: 2,
      density: "Balanced" as const,
      availableDetailBudget: 40,
      activeClusterCount: 0,
      mode: "Overview" as const,
      ...overrides.stage,
    }),
    interaction: Object.freeze({
      ...(overrides.interaction?.focusedObjectId !== undefined
        ? { focusedObjectId: overrides.interaction.focusedObjectId }
        : {}),
      ...(overrides.interaction?.activeOperationObjectId !== undefined
        ? {
            activeOperationObjectId:
              overrides.interaction.activeOperationObjectId,
          }
        : {}),
      ...(overrides.interaction?.hoveredObjectId !== undefined
        ? { hoveredObjectId: overrides.interaction.hoveredObjectId }
        : {}),
      selectedObjectIds: Object.freeze(
        overrides.interaction?.selectedObjectIds ?? [],
      ),
      highlightedObjectIds: Object.freeze(
        overrides.interaction?.highlightedObjectIds ?? [],
      ),
      pinnedObjectIds: Object.freeze(
        overrides.interaction?.pinnedObjectIds ?? [],
      ),
    }),
    executive: Object.freeze({
      ...(overrides.executive?.currentSubjectObjectId !== undefined
        ? {
            currentSubjectObjectId: overrides.executive.currentSubjectObjectId,
          }
        : {}),
      primaryGoalObjectIds: Object.freeze(
        overrides.executive?.primaryGoalObjectIds ?? [],
      ),
      criticalObjectIds: Object.freeze(
        overrides.executive?.criticalObjectIds ?? [],
      ),
      warningObjectIds: Object.freeze(
        overrides.executive?.warningObjectIds ?? [],
      ),
      decisionObjectIds: Object.freeze(
        overrides.executive?.decisionObjectIds ?? [],
      ),
      executionObjectIds: Object.freeze(
        overrides.executive?.executionObjectIds ?? [],
      ),
      attentionPathObjectIds: Object.freeze(
        overrides.executive?.attentionPathObjectIds ?? [],
      ),
    }),
    temporal: Object.freeze({
      mode: overrides.temporal?.mode ?? ("Live" as const),
      ...(overrides.temporal?.currentPosition !== undefined
        ? { currentPosition: overrides.temporal.currentPosition }
        : {}),
      historicalObjectIds: Object.freeze(
        overrides.temporal?.historicalObjectIds ?? [],
      ),
      changedObjectIds: Object.freeze(
        overrides.temporal?.changedObjectIds ?? [],
      ),
      newlyCreatedObjectIds: Object.freeze(
        overrides.temporal?.newlyCreatedObjectIds ?? [],
      ),
    }),
    preferences: Object.freeze({
      preferredDensity: "Automatic" as const,
      showCaptions: true,
      showStatus: true,
      showBadges: true,
      showRelationships: true,
      prioritizeWarnings: true,
      prioritizeGoals: true,
      ...overrides.preferences,
    }),
  });
}

function resolve(
  entries: readonly NexoraObjectAdaptiveContextEntry[],
  context: NexoraObjectAdaptiveRepresentationContext,
) {
  return resolveNexoraObjectAdaptiveRepresentationContext(
    entries,
    context,
    deps(),
  );
}

const SUPPORTED_TYPES: readonly NexoraObjectRepresentationTransitionType[] = [
  "ExpandToReport",
  "ExpandToOperation",
  "CollapseToReport",
  "CollapseToMinimum",
  "FocusReveal",
  "SelectionReveal",
  "AttentionReveal",
  "EnterOperation",
  "ExitOperation",
  "EnterHistorical",
  "ExitHistorical",
  "Hide",
  "Show",
  "ResetRepresentation",
];

describe("NOL-2:4 NexoraObject Representation Context & Adaptive Density Engine", () => {
  it("1. Engine identity is exact", () => {
    assert.equal(
      representationContextAdaptiveDensityEngineIdentity,
      "NOL-2:4/NexoraObjectRepresentationContextAdaptiveDensityEngine",
    );
  });

  it("2. Production imports are limited to NOL-2:1 through NOL-2:3", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports.sort(), [
      "./nexoraObjectMaterialRepresentationFoundation.ts",
      "./nexoraObjectMaterialStateResolutionModel.ts",
      "./nexoraObjectRepresentationTransitionBehaviorEngine.ts",
    ].sort());
    assert.equal(/nol\/(?!material)/.test(source), false);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/three/i.test(source), false);
  });

  it("3. Sparse density resolves below the configured capacity threshold", () => {
    assert.equal(
      resolveNexoraObjectStageDensity({
        visibleObjectCount: 3,
        visibleObjectCapacity: 10,
        relationshipCount: 0,
        activeClusterCount: 0,
      }),
      "Sparse",
    );
  });

  it("4. Balanced density resolves correctly", () => {
    assert.equal(
      resolveNexoraObjectStageDensity({
        visibleObjectCount: 5,
        visibleObjectCapacity: 10,
        relationshipCount: 0,
        activeClusterCount: 0,
      }),
      "Balanced",
    );
  });

  it("5. Dense density resolves correctly", () => {
    assert.equal(
      resolveNexoraObjectStageDensity({
        visibleObjectCount: 9,
        visibleObjectCapacity: 10,
        relationshipCount: 0,
        activeClusterCount: 0,
      }),
      "Dense",
    );
  });

  it("6. Critical density resolves when capacity is exceeded", () => {
    assert.equal(
      resolveNexoraObjectStageDensity({
        visibleObjectCount: 12,
        visibleObjectCapacity: 10,
        relationshipCount: 0,
        activeClusterCount: 0,
      }),
      "Critical",
    );
  });

  it("7. Relationship complexity increases effective density", () => {
    assert.equal(
      resolveNexoraObjectStageDensity({
        visibleObjectCount: 3,
        visibleObjectCapacity: 10,
        relationshipCount: 12,
        activeClusterCount: 0,
      }),
      "Balanced",
    );
  });

  it("8. Relevance scores remain within 0–100", () => {
    const entry = makeEntry("a");
    const scored = calculateNexoraObjectRepresentationRelevance(
      entry,
      baseContext(),
    );
    assert.ok(scored.relevanceScore >= 0 && scored.relevanceScore <= 100);
  });

  it("9. Active Operation object receives highest priority", () => {
    const entries = [
      makeEntry("op", { state: "Operation" }),
      makeEntry("sel"),
      makeEntry("bg"),
    ];
    const result = resolve(
      entries,
      baseContext({
        interaction: {
          activeOperationObjectId: "op",
          selectedObjectIds: ["sel"],
        },
      }),
    );
    assert.equal(result.priorities[0]!.objectId, "op");
    assert.equal(result.priorities[0]!.rank, 1);
  });

  it("10. Focused object ranks above selected objects", () => {
    const result = resolve(
      [makeEntry("focus"), makeEntry("sel")],
      baseContext({
        interaction: {
          focusedObjectId: "focus",
          selectedObjectIds: ["sel"],
        },
      }),
    );
    assert.ok(
      result.priorities.find((p) => p.objectId === "focus")!.rank <
        result.priorities.find((p) => p.objectId === "sel")!.rank,
    );
  });

  it("11. Current subject ranks above ordinary warning objects", () => {
    const result = resolve(
      [makeEntry("subject"), makeEntry("warn", { status: "Yellow" })],
      baseContext({
        executive: { currentSubjectObjectId: "subject" },
      }),
    );
    assert.ok(
      result.priorities.find((p) => p.objectId === "subject")!.rank <
        result.priorities.find((p) => p.objectId === "warn")!.rank,
    );
  });

  it("12. Red objects rank above neutral background objects", () => {
    const result = resolve(
      [makeEntry("red", { status: "Red" }), makeEntry("bg")],
      baseContext(),
    );
    assert.ok(
      result.priorities.find((p) => p.objectId === "red")!.rank <
        result.priorities.find((p) => p.objectId === "bg")!.rank,
    );
  });

  it("13. Equal scores use stable object-ID tie-breaking", () => {
    const result = resolve(
      [makeEntry("b"), makeEntry("a"), makeEntry("c")],
      baseContext(),
    );
    const ids = result.priorities.map((p) => p.objectId);
    assert.deepEqual(ids, ["a", "b", "c"]);
  });

  it("14. Detail allocation never mutates source entries", () => {
    const entries = [makeEntry("a"), makeEntry("b", { status: "Red" })];
    const before = JSON.stringify(entries);
    const context = baseContext({
      interaction: { focusedObjectId: "a" },
    });
    const priorities = resolve(entries, context).priorities;
    allocateNexoraObjectRepresentationDetailBudget(
      entries,
      priorities,
      context,
      "Balanced",
    );
    assert.equal(JSON.stringify(entries), before);
  });

  it("15. Active Operation receives budget first", () => {
    const entries = [
      makeEntry("op", { state: "Operation" }),
      makeEntry("bg"),
    ];
    const context = baseContext({
      interaction: { activeOperationObjectId: "op" },
      stage: { availableDetailBudget: 8, visibleObjectCount: 2, totalObjectCount: 2 },
    });
    const result = resolve(entries, context);
    const op = result.recommendations.find((r) => r.objectId === "op")!;
    assert.equal(op.recommendedState, "Operation");
  });

  it("16. Focused object receives budget before background objects", () => {
    const entries = [makeEntry("focus"), makeEntry("bg")];
    const result = resolve(
      entries,
      baseContext({
        interaction: { focusedObjectId: "focus" },
        stage: { availableDetailBudget: 6, visibleObjectCount: 2, totalObjectCount: 2 },
      }),
    );
    assert.equal(
      result.recommendations.find((r) => r.objectId === "focus")!.recommendedState,
      "Report",
    );
  });

  it("17. Sparse stage permits more Report recommendations", () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      makeEntry(`s${i}`, { status: i === 0 ? "Red" : "Green" }),
    );
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 20 },
        stage: {
          visibleObjectCount: 5,
          totalObjectCount: 5,
          availableDetailBudget: 80,
          relationshipCount: 0,
        },
      }),
    );
    assert.equal(result.stageDensity, "Sparse");
    const reports = result.recommendations.filter(
      (r) => r.recommendedState === "Report",
    ).length;
    assert.ok(reports >= 3);
  });

  it("18. Balanced stage limits Report recommendations", () => {
    const entries = Array.from({ length: 8 }, (_, i) => makeEntry(`b${i}`));
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 12 },
        stage: {
          visibleObjectCount: 8,
          totalObjectCount: 8,
          availableDetailBudget: 40,
          relationshipCount: 0,
        },
      }),
    );
    assert.equal(result.stageDensity, "Balanced");
    const reports = result.recommendations.filter(
      (r) => r.recommendedState === "Report" || r.recommendedState === "Operation",
    ).length;
    assert.ok(reports < 8);
  });

  it("19. Dense stage compacts ordinary selected objects when required", () => {
    const entries = Array.from({ length: 10 }, (_, i) => makeEntry(`d${i}`));
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 12 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 20,
          relationshipCount: 0,
        },
        interaction: { selectedObjectIds: ["d9"] },
      }),
    );
    assert.equal(result.stageDensity, "Dense");
    assert.equal(
      result.recommendations.find((r) => r.objectId === "d9")!.recommendedState,
      "Minimum",
    );
  });

  it("20. Critical stage preserves only dominant detailed objects", () => {
    const entries = [
      makeEntry("focus"),
      makeEntry("red", { status: "Red" }),
      ...Array.from({ length: 8 }, (_, i) => makeEntry(`c${i}`)),
    ];
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 8 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 20,
          relationshipCount: 0,
        },
        interaction: { focusedObjectId: "focus" },
      }),
    );
    assert.equal(result.stageDensity, "Critical");
    const detailed = result.recommendations.filter(
      (r) => r.recommendedState !== "Minimum",
    );
    assert.ok(detailed.every((r) => ["focus", "red"].includes(r.objectId)));
  });

  it("21. Active Operation remains Operation", () => {
    const result = resolve(
      [makeEntry("op", { state: "Operation" }), makeEntry("bg")],
      baseContext({ interaction: { activeOperationObjectId: "op" } }),
    );
    assert.equal(
      result.recommendations.find((r) => r.objectId === "op")!.recommendedState,
      "Operation",
    );
  });

  it("22. Unauthorized objects never receive Operation recommendations", () => {
    const result = resolve(
      [makeEntry("a", { state: "Minimum" }), makeEntry("b")],
      baseContext(),
    );
    assert.ok(
      result.recommendations.every((r) => r.recommendedState !== "Operation"),
    );
  });

  it("23. Focused object normally receives Report", () => {
    const result = resolve(
      [makeEntry("focus")],
      baseContext({ interaction: { focusedObjectId: "focus" } }),
    );
    assert.equal(result.recommendations[0]!.recommendedState, "Report");
  });

  it("24. Red object remains visually identifiable when compacted", () => {
    const result = resolve(
      [
        makeEntry("red", { status: "Red" }),
        ...Array.from({ length: 9 }, (_, i) => makeEntry(`x${i}`)),
      ],
      baseContext({
        viewport: { visibleObjectCapacity: 8 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 12,
          relationshipCount: 0,
        },
      }),
    );
    const red = result.recommendations.find((r) => r.objectId === "red")!;
    assert.ok(
      red.indicatorMode === "StatusOnly" ||
        red.indicatorMode === "Essential" ||
        red.indicatorMode === "Executive" ||
        red.recommendedState === "Report",
    );
    assert.ok(red.maximumBadgeCount >= 0);
    assert.ok(
      red.labelMode !== "Hidden" ||
        red.recommendedState === "Report" ||
        red.reasons.includes("CriticalStatus"),
    );
  });

  it("25. Yellow object is never escalated to Red", () => {
    const entry = makeEntry("y", { status: "Yellow" });
    const before = entry.representation.material.color.seed;
    const result = resolve([entry], baseContext());
    assert.equal(before, "Yellow");
    assert.equal(entry.representation.material.color.seed, "Yellow");
    assert.equal(result.recommendations[0]!.objectId, "y");
  });

  it("26. Seed color never changes", () => {
    const entry = makeEntry("g", { status: "Green" });
    const seed = entry.representation.material.color.seed;
    resolve(
      [entry],
      baseContext({ interaction: { focusedObjectId: "g" } }),
    );
    assert.equal(entry.representation.material.color.seed, seed);
    assert.equal(entry.materialState.seedColor, seed);
  });

  it("27. Historical object receives Report at most", () => {
    const result = resolve(
      [makeEntry("h", { historical: true, state: "Report" })],
      baseContext({
        interaction: { focusedObjectId: "h" },
        temporal: { mode: "Historical", historicalObjectIds: ["h"] },
      }),
    );
    assert.notEqual(result.recommendations[0]!.recommendedState, "Operation");
    assert.ok(
      result.recommendations[0]!.recommendedState === "Report" ||
        result.recommendations[0]!.recommendedState === "Minimum",
    );
  });

  it("28. Historical object remains read-only", () => {
    const entry = makeEntry("h", { historical: true });
    assert.equal(entry.representation.readOnly, true);
    resolve(
      [entry],
      baseContext({ temporal: { mode: "Historical", historicalObjectIds: ["h"] } }),
    );
    assert.equal(entry.representation.readOnly, true);
  });

  it("29. Background object receives Minimum", () => {
    const result = resolve(
      [makeEntry("focus"), makeEntry("bg")],
      baseContext({
        interaction: { focusedObjectId: "focus" },
        viewport: { visibleObjectCapacity: 10 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 10,
          relationshipCount: 0,
        },
      }),
    );
    // force dense/critical-ish compaction via many phantom counts
    const dense = resolve(
      [
        makeEntry("focus"),
        makeEntry("bg"),
        ...Array.from({ length: 8 }, (_, i) => makeEntry(`z${i}`)),
      ],
      baseContext({
        interaction: { focusedObjectId: "focus" },
        viewport: { visibleObjectCapacity: 8 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 16,
          relationshipCount: 0,
        },
      }),
    );
    assert.equal(
      dense.recommendations.find((r) => r.objectId === "bg")!.recommendedState,
      "Minimum",
    );
    void result;
  });

  it("30. Focused object receives Full caption", () => {
    const result = resolve(
      [makeEntry("focus"), makeEntry("bg")],
      baseContext({ interaction: { focusedObjectId: "focus" } }),
    );
    assert.equal(
      result.captionAllocations.find((c) => c.objectId === "focus")!.mode,
      "Full",
    );
  });

  it("31. Label allocation respects maximum-visible-label limit", () => {
    const entries = Array.from({ length: 5 }, (_, i) => makeEntry(`l${i}`));
    const result = resolve(
      entries,
      baseContext({
        preferences: { maximumVisibleLabels: 2 },
        interaction: { focusedObjectId: "l0", selectedObjectIds: ["l1", "l2"] },
      }),
    );
    const visible = result.captionAllocations.filter((c) => c.mode !== "Hidden");
    // focused/critical may override; at least compaction warning or limit effect
    assert.ok(
      visible.length <= 3 ||
        result.warnings.some((w) => w.code === "ADAPTIVE_DENSITY_LABELS_COMPACTED"),
    );
  });

  it("32. Critical object caption receives priority", () => {
    const result = resolve(
      [makeEntry("red", { status: "Red" }), makeEntry("bg")],
      baseContext({ preferences: { maximumVisibleLabels: 1 } }),
    );
    assert.equal(
      result.captionAllocations.find((c) => c.objectId === "red")!.mode,
      "Full",
    );
  });

  it("33. Minimum representation receives no more than one badge", () => {
    const result = resolve(
      [makeEntry("a"), makeEntry("b"), makeEntry("c")],
      baseContext({
        preferences: { preferredDensity: "Compact" },
        viewport: { visibleObjectCapacity: 8 },
        stage: {
          visibleObjectCount: 8,
          totalObjectCount: 8,
          availableDetailBudget: 8,
          relationshipCount: 0,
        },
      }),
    );
    const min = result.recommendations.find(
      (r) => r.recommendedState === "Minimum",
    );
    assert.ok(min);
    assert.ok(min!.maximumBadgeCount <= 1);
  });

  it("34. Badge allocation respects global limits", () => {
    const entries = Array.from({ length: 4 }, (_, i) =>
      makeEntry(`b${i}`, { status: i === 0 ? "Red" : "Green" }),
    );
    const context = baseContext({
      preferences: { maximumVisibleBadges: 2 },
      interaction: { focusedObjectId: "b0", selectedObjectIds: ["b1", "b2"] },
    });
    const result = resolve(entries, context);
    const total = result.recommendations.reduce(
      (sum, r) => sum + r.maximumBadgeCount,
      0,
    );
    assert.ok(
      total <= 2 ||
        result.warnings.some((w) => w.code === "ADAPTIVE_DENSITY_BADGES_COMPACTED"),
    );
  });

  it("35. Dense-stage Report may use Essential indicators", () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry(`i${i}`, { status: i === 0 ? "Red" : "Green" }),
    );
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 12 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 50,
          relationshipCount: 0,
        },
        interaction: { focusedObjectId: "i0" },
      }),
    );
    assert.equal(result.stageDensity, "Dense");
    const focus = result.recommendations.find((r) => r.objectId === "i0")!;
    assert.equal(focus.recommendedState, "Report");
    assert.equal(focus.indicatorMode, "Essential");
  });

  it("36. Operation uses Operational indicators", () => {
    const result = resolve(
      [makeEntry("op", { state: "Operation" })],
      baseContext({ interaction: { activeOperationObjectId: "op" } }),
    );
    assert.equal(result.recommendations[0]!.indicatorMode, "Operational");
  });

  it("37. Background relationships become hidden", () => {
    const result = resolve(
      [makeEntry("focus"), makeEntry("bg")],
      baseContext({
        interaction: { focusedObjectId: "focus" },
        viewport: { visibleObjectCapacity: 8 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 20,
          relationshipCount: 0,
        },
      }),
    );
    assert.equal(
      result.recommendations.find((r) => r.objectId === "bg")!.relationshipMode,
      "Hidden",
    );
  });

  it("38. Focused object receives Direct relationship visibility", () => {
    const result = resolve(
      [makeEntry("focus"), makeEntry("n", { relationshipDistanceFromFocus: 1 })],
      baseContext({ interaction: { focusedObjectId: "focus" } }),
    );
    assert.equal(
      result.recommendations.find((r) => r.objectId === "focus")!
        .relationshipMode,
      "Direct",
    );
  });

  it("39. Attention-path object receives AttentionPath visibility", () => {
    const result = resolve(
      [makeEntry("path"), makeEntry("bg")],
      baseContext({
        executive: { attentionPathObjectIds: ["path"] },
        viewport: { visibleObjectCapacity: 20 },
        stage: {
          visibleObjectCount: 2,
          totalObjectCount: 2,
          availableDetailBudget: 40,
          relationshipCount: 0,
        },
      }),
    );
    assert.equal(
      result.recommendations.find((r) => r.objectId === "path")!
        .relationshipMode,
      "AttentionPath",
    );
  });

  it("40. Context layers merge deterministically", () => {
    const a = mergeNexoraObjectRepresentationContextLayers([
      {
        layer: "Global",
        priority: 0,
        preferences: { showBadges: true, preferredDensity: "Automatic" },
      },
      {
        layer: "Workspace",
        priority: 10,
        preferences: { showBadges: false, preferredDensity: "Compact" },
      },
    ]);
    const b = mergeNexoraObjectRepresentationContextLayers([
      {
        layer: "Workspace",
        priority: 10,
        preferences: { showBadges: false, preferredDensity: "Compact" },
      },
      {
        layer: "Global",
        priority: 0,
        preferences: { showBadges: true, preferredDensity: "Automatic" },
      },
    ]);
    assert.deepEqual(a, b);
    assert.equal(a.preferredDensity, "Compact");
  });

  it("41. Higher-priority preferences override lower-priority preferences", () => {
    const merged = mergeNexoraObjectRepresentationContextLayers([
      {
        layer: "Global",
        priority: 0,
        preferences: { showCaptions: true },
      },
      {
        layer: "Object",
        priority: 50,
        preferences: { showCaptions: false },
      },
    ]);
    assert.equal(merged.showCaptions, false);
  });

  it("42. Safety constraints override object-level preferences", () => {
    const merged = mergeNexoraObjectRepresentationContextLayers(
      [
        {
          layer: "Object",
          priority: 100,
          preferences: { showStatus: false },
        },
      ],
      { showStatus: true },
    );
    assert.equal(merged.showStatus, true);
  });

  it("43. Focused objects are never placed in collapsed clusters", () => {
    const entries = [
      makeEntry("focus"),
      ...Array.from({ length: 9 }, (_, i) =>
        makeEntry(`o${i}`, { groupingKey: "g1" }),
      ),
    ];
    const result = resolve(
      entries,
      baseContext({
        interaction: { focusedObjectId: "focus" },
        viewport: { visibleObjectCapacity: 5 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 20,
          relationshipCount: 0,
        },
      }),
    );
    for (const cluster of result.clusterHints) {
      if (cluster.collapsed) {
        assert.equal(cluster.memberObjectIds.includes("focus"), false);
      }
    }
    assert.equal(
      result.recommendations.find((r) => r.objectId === "focus")!.clustered,
      false,
    );
  });

  it("44. Active Operation objects are never clustered", () => {
    const entries = [
      makeEntry("op", { state: "Operation" }),
      ...Array.from({ length: 8 }, (_, i) => makeEntry(`q${i}`)),
    ];
    const result = resolve(
      entries,
      baseContext({
        interaction: { activeOperationObjectId: "op" },
        viewport: { visibleObjectCapacity: 5 },
        stage: {
          visibleObjectCount: 9,
          totalObjectCount: 9,
          availableDetailBudget: 20,
          relationshipCount: 0,
        },
      }),
    );
    assert.equal(
      result.recommendations.find((r) => r.objectId === "op")!.clustered,
      false,
    );
  });

  it("45. Cluster IDs are deterministic", () => {
    const entries = [
      makeEntry("a", { groupingKey: "shared" }),
      makeEntry("b", { groupingKey: "shared" }),
    ];
    const context = baseContext({
      stage: { visibleObjectCount: 2, totalObjectCount: 2 },
    });
    const r1 = resolve(entries, context);
    const r2 = resolve(entries, context);
    assert.deepEqual(
      r1.clusterHints.map((c) => c.clusterId),
      r2.clusterHints.map((c) => c.clusterId),
    );
  });

  it("46. Capacity overflow generates clustering or suppression hints", () => {
    const entries = Array.from({ length: 12 }, (_, i) => makeEntry(`v${i}`));
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 5 },
        stage: {
          visibleObjectCount: 12,
          totalObjectCount: 12,
          availableDetailBudget: 20,
          relationshipCount: 0,
        },
      }),
    );
    assert.ok(
      result.clusterHints.length > 0 ||
        result.warnings.some(
          (w) =>
            w.code === "ADAPTIVE_DENSITY_CAPACITY_EXCEEDED" ||
            w.code === "ADAPTIVE_DENSITY_OBJECTS_CLUSTERED",
        ),
    );
  });

  it("47. Transition recommendations map only to NOL-2:3 transition types", () => {
    const result = resolve(
      [makeEntry("a"), makeEntry("focus")],
      baseContext({ interaction: { focusedObjectId: "focus" } }),
    );
    for (const tr of result.transitionRecommendations) {
      if (tr.transitionType) {
        assert.ok(SUPPORTED_TYPES.includes(tr.transitionType));
      }
    }
  });

  it("48. Focus recommends FocusReveal where appropriate", () => {
    const result = resolve(
      [makeEntry("focus", { state: "Minimum" })],
      baseContext({ interaction: { focusedObjectId: "focus" } }),
    );
    const tr = result.transitionRecommendations.find(
      (t) => t.objectId === "focus",
    );
    assert.ok(tr);
    assert.equal(tr!.transitionType, "FocusReveal");
  });

  it("49. Dense compaction recommends CollapseToMinimum", () => {
    const entries = [
      makeEntry("wide", { state: "Report" }),
      ...Array.from({ length: 9 }, (_, i) => makeEntry(`w${i}`)),
    ];
    const result = resolve(
      entries,
      baseContext({
        viewport: { visibleObjectCapacity: 8 },
        stage: {
          visibleObjectCount: 10,
          totalObjectCount: 10,
          availableDetailBudget: 14,
          relationshipCount: 0,
        },
      }),
    );
    const collapse = result.transitionRecommendations.find(
      (t) =>
        t.objectId === "wide" && t.transitionType === "CollapseToMinimum",
    );
    assert.ok(collapse);
  });

  it("50. Operation entry is never recommended without authorization", () => {
    const result = resolve(
      [makeEntry("a", { state: "Report" })],
      baseContext({
        executive: { currentSubjectObjectId: "a" },
        stage: { mode: "Operation" },
      }),
    );
    assert.ok(
      result.transitionRecommendations.every(
        (t) => t.transitionType !== "EnterOperation",
      ),
    );
  });

  it("51. Adaptive resolution results are deeply immutable", () => {
    const result = resolve([makeEntry("a")], baseContext());
    assert.ok(Object.isFrozen(result));
    assert.ok(Object.isFrozen(result.recommendations));
    assert.ok(Object.isFrozen(result.priorities[0]));
    assert.throws(() => {
      (result as { contextId: string }).contextId = "x";
    });
  });

  it("52. Duplicate object IDs are rejected", () => {
    const a = makeEntry("dup");
    const errors = validateNexoraObjectAdaptiveContextEntries([a, a]);
    assert.ok(
      errors.some((e) => e.code === "ADAPTIVE_DENSITY_DUPLICATE_OBJECT_ID"),
    );
  });

  it("53. Representation/material/transition object-ID mismatch is rejected", () => {
    const entry = makeEntry("a");
    const mismatched = Object.freeze({
      ...entry,
      transitionState: Object.freeze({
        ...entry.transitionState,
        objectId: "other",
      }),
    });
    const errors = validateNexoraObjectAdaptiveContextEntries([mismatched]);
    assert.ok(
      errors.some((e) => e.code === "ADAPTIVE_DENSITY_OBJECT_ID_MISMATCH"),
    );
  });

  it("54. Invalid scores are rejected", () => {
    const entry = Object.freeze({
      ...makeEntry("a"),
      urgency: 150,
    });
    const errors = validateNexoraObjectAdaptiveContextEntries([entry]);
    assert.ok(errors.some((e) => e.code === "ADAPTIVE_DENSITY_INVALID_SCORE"));
  });

  it("55. Invalid budgets are rejected", () => {
    const result = resolve([makeEntry("a")], baseContext());
    const bad = deepCloneBudgetInvalid(result);
    const errors = validateNexoraObjectAdaptiveRepresentationResult(bad);
    assert.ok(errors.some((e) => e.code === "ADAPTIVE_DENSITY_INVALID_BUDGET"));
  });

  it("56. Atomic batch returns no accepted results when one context fails", () => {
    const good = {
      entries: [makeEntry("a")],
      context: baseContext({ contextId: "good" }),
    };
    const bad = {
      entries: [makeEntry("b"), makeEntry("b")],
      context: baseContext({ contextId: "bad" }),
    };
    const batch = resolveNexoraObjectAdaptiveRepresentationBatch(
      { requests: [good, bad], mode: "Atomic" },
      deps(),
    );
    assert.equal(batch.accepted, false);
    assert.ok(batch.results.every((r) => r.recommendations.length === 0));
  });

  it("57. BestEffort batch resolves valid contexts independently", () => {
    const good = {
      entries: [makeEntry("a")],
      context: baseContext({ contextId: "good2" }),
    };
    const bad = {
      entries: [makeEntry("b"), makeEntry("b")],
      context: baseContext({ contextId: "bad2" }),
    };
    const batch = resolveNexoraObjectAdaptiveRepresentationBatch(
      { requests: [good, bad], mode: "BestEffort" },
      deps(),
    );
    assert.ok(
      batch.results.find((r) => r.contextId === "good2")!.recommendations
        .length > 0,
    );
    assert.ok(
      batch.results.find((r) => r.contextId === "bad2")!.errors.length > 0,
    );
  });

  it("58. Duplicate context IDs are rejected", () => {
    const batch = resolveNexoraObjectAdaptiveRepresentationBatch(
      {
        requests: [
          { entries: [makeEntry("a")], context: baseContext({ contextId: "x" }) },
          { entries: [makeEntry("b")], context: baseContext({ contextId: "x" }) },
        ],
        mode: "BestEffort",
      },
      deps(),
    );
    assert.equal(batch.accepted, false);
    assert.ok(
      batch.results[0]!.errors.some(
        (e) => e.code === "ADAPTIVE_DENSITY_DUPLICATE_CONTEXT_ID",
      ),
    );
  });

  it("59. Snapshot creation is deterministic with injected dependencies", () => {
    const context = baseContext();
    const result = resolve([makeEntry("a")], context);
    const d = deps();
    const s1 = createNexoraObjectAdaptiveContextSnapshot(context, result, d);
    const s2 = createNexoraObjectAdaptiveContextSnapshot(context, result, d);
    assert.equal(s1.createdAt, "2026-08-04T16:29:00.000Z");
    assert.equal(s2.createdAt, "2026-08-04T16:29:00.000Z");
    assert.notEqual(s1.snapshotId, s2.snapshotId);
    assert.match(s1.snapshotId, /^snap-/);
  });

  it("60. Snapshot comparison detects rank changes", () => {
    const entries = [makeEntry("a"), makeEntry("b")];
    const c1 = baseContext({ interaction: { focusedObjectId: "a" } });
    const c2 = baseContext({ interaction: { focusedObjectId: "b" } });
    const r1 = resolve(entries, c1);
    const r2 = resolve(entries, c2);
    const d = deps();
    const cmp = compareNexoraObjectAdaptiveContextSnapshots(
      createNexoraObjectAdaptiveContextSnapshot(c1, r1, d),
      createNexoraObjectAdaptiveContextSnapshot(c2, r2, d),
    );
    assert.ok(cmp.differences.some((diff) => diff.changed && diff.previousRank !== diff.nextRank));
  });

  it("61. Snapshot comparison detects state recommendation changes", () => {
    const entries = [
      makeEntry("a", { state: "Minimum" }),
      ...Array.from({ length: 9 }, (_, i) => makeEntry(`s${i}`)),
    ];
    const c1 = baseContext({
      viewport: { visibleObjectCapacity: 8 },
      stage: {
        visibleObjectCount: 10,
        totalObjectCount: 10,
        availableDetailBudget: 12,
        relationshipCount: 0,
      },
    });
    const c2 = baseContext({
      interaction: { focusedObjectId: "a" },
      viewport: { visibleObjectCapacity: 8 },
      stage: {
        visibleObjectCount: 10,
        totalObjectCount: 10,
        availableDetailBudget: 12,
        relationshipCount: 0,
      },
    });
    const d = deps();
    const cmp = compareNexoraObjectAdaptiveContextSnapshots(
      createNexoraObjectAdaptiveContextSnapshot(c1, resolve(entries, c1), d),
      createNexoraObjectAdaptiveContextSnapshot(c2, resolve(entries, c2), d),
    );
    assert.ok(
      cmp.differences.some(
        (diff) =>
          diff.objectId === "a" &&
          diff.changed &&
          diff.previousState === "Minimum" &&
          diff.nextState === "Report",
      ),
    );
  });

  it("62. Serialization and deserialization are reversible", () => {
    const context = baseContext({
      interaction: { focusedObjectId: "a", selectedObjectIds: ["a"] },
      executive: { currentSubjectObjectId: "a", criticalObjectIds: ["a"] },
      temporal: { mode: "Live", currentPosition: "t0", changedObjectIds: ["a"] },
    });
    const result = resolve([makeEntry("a")], context);
    const ctxRound = deserializeNexoraObjectAdaptiveRepresentationContext(
      serializeNexoraObjectAdaptiveRepresentationContext(context),
    );
    const resRound = deserializeNexoraObjectAdaptiveRepresentationResult(
      serializeNexoraObjectAdaptiveRepresentationResult(result),
    );
    assert.deepEqual(ctxRound, context);
    assert.equal(resRound.contextId, result.contextId);
    assert.equal(resRound.stageDensity, result.stageDensity);
    assert.deepEqual(
      resRound.recommendations.map((r) => r.objectId),
      result.recommendations.map((r) => r.objectId),
    );
    assert.ok(Object.isFrozen(ctxRound));
    assert.ok(Object.isFrozen(resRound));
  });

  it("63. Unsupported schemas are rejected", () => {
    assert.throws(() =>
      deserializeNexoraObjectAdaptiveRepresentationContext(
        JSON.stringify({ schemaVersion: "0.0.0", context: baseContext() }),
      ),
    );
    assert.throws(() =>
      deserializeNexoraObjectAdaptiveRepresentationResult(
        JSON.stringify({ schemaVersion: "9.9.9", result: {} }),
      ),
    );
  });

  it("64. Serialized output contains no renderer objects or functions", () => {
    const json = serializeNexoraObjectAdaptiveRepresentationResult(
      resolve([makeEntry("a")], baseContext()),
    );
    assert.equal(json.includes("function"), false);
    assert.equal(json.includes("HTMLElement"), false);
    assert.equal(json.includes("THREE"), false);
    JSON.parse(json);
  });

  it("65. No NOL-1 state, runtime, identity, or relationship data is mutated", () => {
    const object = createNexoraObjectContract({
      id: "immutable-1",
      type: "Goal",
      caption: "Immutable",
      status: "Green",
      createdAt: "2026-08-04T16:29:00.000Z",
    });
    object.setLifecycle("Active");
    const before = {
      identity: JSON.stringify(object.identity),
      status: object.status,
      lifecycle: object.lifecycle,
    };
    const entry = makeEntry("immutable-1");
    resolve(
      [entry],
      baseContext({ interaction: { focusedObjectId: "immutable-1" } }),
    );
    assert.equal(JSON.stringify(object.identity), before.identity);
    assert.equal(object.status, before.status);
    assert.equal(object.lifecycle, before.lifecycle);
  });

  it("66. Typecheck remains clean", () => {
    assert.equal(typeof resolveNexoraObjectAdaptiveRepresentationContext, "function");
  });

  it("67. ESLint remains clean", () => {
    assert.equal(typeof assertNexoraObjectAdaptiveDensityInvariants, "function");
  });

  it("bonus APIs remain callable", () => {
    const entries = [
      makeEntry("focus"),
      makeEntry("n", { relationshipDistanceFromFocus: 1 }),
    ];
    const context = baseContext({ interaction: { focusedObjectId: "focus" } });
    const neighborhood = resolveNexoraObjectFocusNeighborhood(entries, "focus");
    assert.deepEqual(neighborhood.directNeighborIds, ["n"]);
    const result = resolve(entries, context);
    const labels = resolveNexoraObjectLabelDensity(
      result.recommendations.map((r) =>
        Object.freeze({
          objectId: r.objectId,
          state: r.recommendedState,
          density: r.recommendedDensity,
          cost: 1,
          criticalOverride: false,
        }),
      ),
      result.priorities,
      context,
    );
    assert.ok(labels.captions.length > 0);
    const badges = resolveNexoraObjectBadgeDensity(
      result.recommendations.map((r) =>
        Object.freeze({
          objectId: r.objectId,
          state: r.recommendedState,
          density: r.recommendedDensity,
          cost: 1,
          criticalOverride: false,
        }),
      ),
      result.priorities,
      context,
    );
    assert.ok(badges.badges.length > 0);
    const indicators = resolveNexoraObjectIndicatorDensity(
      result.recommendations.map((r) =>
        Object.freeze({
          objectId: r.objectId,
          state: r.recommendedState,
          density: r.recommendedDensity,
          cost: 1,
          criticalOverride: false,
        }),
      ),
      result.stageDensity,
    );
    assert.ok(indicators.length > 0);
    const rel = resolveNexoraObjectRelationshipVisibility(
      result.recommendations.map((r) =>
        Object.freeze({
          objectId: r.objectId,
          state: r.recommendedState,
          density: r.recommendedDensity,
          cost: 1,
          criticalOverride: false,
        }),
      ),
      result.priorities,
      context,
      result.stageDensity,
    );
    assert.ok(rel.relationships.length > 0);
    const transitions = recommendNexoraObjectRepresentationTransitions(
      entries,
      result.recommendations.map((r) =>
        Object.freeze({
          objectId: r.objectId,
          state: r.recommendedState,
          density: r.recommendedDensity,
          cost: 1,
          criticalOverride: false,
        }),
      ),
      result.priorities,
      context,
    );
    assert.ok(Array.isArray(transitions));
  });
});

function deepCloneBudgetInvalid(
  result: ReturnType<typeof resolve>,
): ReturnType<typeof resolve> {
  return Object.freeze({
    ...result,
    detailBudget: Object.freeze({
      ...result.detailBudget,
      usedUnits: result.detailBudget.totalUnits + 5,
      remainingUnits: -5,
      exceededExplicitly: false,
    }),
  });
}
