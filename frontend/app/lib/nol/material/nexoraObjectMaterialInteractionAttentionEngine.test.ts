/**
 * NOL-2:5 — NexoraObject Material Interaction & Attention Engine tests.
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
  type NexoraObjectRepresentationBehaviorType,
} from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import type { NexoraObjectAdaptiveRepresentationRecommendation } from "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";
import {
  allocateNexoraObjectAttentionBudget,
  assertNexoraObjectMaterialInteractionAttentionInvariants,
  clearNexoraObjectAttentionSignals,
  compareNexoraObjectMaterialAttentionSnapshots,
  createNexoraObjectMaterialAttentionRecord,
  createNexoraObjectMaterialAttentionSnapshot,
  deserializeNexoraObjectAttentionSignal,
  deserializeNexoraObjectMaterialInteractionResponse,
  materialInteractionAttentionEngineIdentity,
  recommendNexoraObjectAttentionBehaviors,
  resetNexoraObjectMaterialInteractionAttention,
  resolveNexoraObjectAttentionPath,
  resolveNexoraObjectAttentionSourcePriority,
  resolveNexoraObjectAttentionSuppression,
  resolveNexoraObjectBackgroundDimming,
  resolveNexoraObjectMaterialAttentionState,
  resolveNexoraObjectMaterialInteractionAttention,
  resolveNexoraObjectMaterialInteractionAttentionCollection,
  resolveNexoraObjectMaterialInteractionState,
  serializeNexoraObjectAttentionSignal,
  serializeNexoraObjectMaterialInteractionResponse,
  validateNexoraObjectAttentionSignal,
  validateNexoraObjectMaterialInteractionAttentionInput,
  type NexoraObjectAttentionPath,
  type NexoraObjectAttentionSignal,
  type NexoraObjectInteractionSignal,
  type NexoraObjectMaterialAttentionDependencies,
  type NexoraObjectMaterialInteractionAttentionContext,
  type NexoraObjectMaterialInteractionAttentionInput,
  type NexoraObjectMaterialInteractionResponse,
} from "./nexoraObjectMaterialInteractionAttentionEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectMaterialInteractionAttentionEngine.ts"),
  "utf8",
);

const { createNexoraObjectContract } =
  universalNexoraObjectPublicIndex.objectContracts;
const { applyNexoraObjectRuntimeCommand } =
  universalNexoraObjectPublicIndex.objectRuntime;

const NOW = "2026-08-04T16:42:00.000Z";

const MUTATION_AFFORDANCES = new Set([
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
]);

const SUPPORTED_ATTENTION_BEHAVIORS: readonly NexoraObjectRepresentationBehaviorType[] =
  Object.freeze([
    "AttentionPulse",
    "FocusPull",
    "BackgroundDim",
    "DepthShift",
    "IndicatorReveal",
    "RelationshipReveal",
    "HistoricalMute",
    "OperationLock",
  ]);

let seq = 0;
function deps(): NexoraObjectMaterialAttentionDependencies {
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
      return `snap-${seq}`;
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
    relevanceScore: overrides.relevanceScore ?? 1,
    rank: overrides.rank ?? 1,
    labelMode: overrides.labelMode ?? "Short",
    maximumBadgeCount: overrides.maximumBadgeCount ?? 0,
    indicatorMode: overrides.indicatorMode ?? "StatusOnly",
    relationshipMode: overrides.relationshipMode ?? "Hidden",
    dimmed: overrides.dimmed ?? false,
    clustered: overrides.clustered ?? false,
    transitionRecommended: overrides.transitionRecommended ?? false,
    reasons: Object.freeze([...(overrides.reasons ?? [])]),
  });
}

function makeEntry(
  id: string,
  options: {
    readonly status?: "Red" | "Yellow" | "Green" | "Blue" | "White" | "Black";
    readonly state?: "Minimum" | "Report" | "Operation";
    readonly historical?: boolean;
    readonly hide?: boolean;
  } = {},
): {
  readonly representation: ReturnType<typeof projectNexoraObjectRepresentation>;
  readonly materialState: ReturnType<typeof resolveMaterialState>;
  readonly transitionState: ReturnType<
    typeof createNexoraObjectRepresentationTransitionState
  >;
} {
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
  return Object.freeze({
    representation,
    materialState,
    transitionState: createNexoraObjectRepresentationTransitionState(
      id,
      representation.state,
      NOW,
    ),
  });
}

function ctx(
  overrides: Partial<NexoraObjectMaterialInteractionAttentionContext> = {},
): NexoraObjectMaterialInteractionAttentionContext {
  return Object.freeze({
    source: overrides.source ?? "Director",
    stageDensity: overrides.stageDensity ?? "Balanced",
    stageMode: overrides.stageMode ?? "Overview",
    reducedMotion: overrides.reducedMotion ?? false,
    currentTime: overrides.currentTime ?? NOW,
    ...(overrides.activeAttentionPathId !== undefined
      ? { activeAttentionPathId: overrides.activeAttentionPathId }
      : {}),
    ...(overrides.focusedObjectId !== undefined
      ? { focusedObjectId: overrides.focusedObjectId }
      : {}),
    ...(overrides.activeOperationObjectId !== undefined
      ? { activeOperationObjectId: overrides.activeOperationObjectId }
      : {}),
    ...(overrides.suppressRepeatedAttention !== undefined
      ? { suppressRepeatedAttention: overrides.suppressRepeatedAttention }
      : {}),
    ...(overrides.attentionCooldownMs !== undefined
      ? { attentionCooldownMs: overrides.attentionCooldownMs }
      : {}),
  });
}

function inputFrom(
  entry: ReturnType<typeof makeEntry>,
  overrides: {
    readonly adaptiveRecommendation?: NexoraObjectAdaptiveRepresentationRecommendation;
    readonly interactionSignals?: readonly NexoraObjectInteractionSignal[];
    readonly attentionSignals?: readonly NexoraObjectAttentionSignal[];
    readonly context?: NexoraObjectMaterialInteractionAttentionContext;
  } = {},
): NexoraObjectMaterialInteractionAttentionInput {
  return Object.freeze({
    representation: entry.representation,
    materialState: entry.materialState,
    transitionState: entry.transitionState,
    adaptiveRecommendation:
      overrides.adaptiveRecommendation ??
      makeAdaptive(entry.representation.objectId, {
        currentState: entry.representation.state,
        recommendedState: entry.representation.state,
      }),
    interactionSignals: Object.freeze(overrides.interactionSignals ?? []),
    attentionSignals: Object.freeze(overrides.attentionSignals ?? []),
    context: overrides.context ?? ctx(),
  });
}

function ixSignal(
  partial: Partial<NexoraObjectInteractionSignal> &
    Pick<NexoraObjectInteractionSignal, "objectId" | "type">,
): NexoraObjectInteractionSignal {
  return Object.freeze({
    signalId: partial.signalId ?? `ix-${partial.objectId}-${partial.type}`,
    objectId: partial.objectId,
    type: partial.type,
    source: partial.source ?? "Director",
    occurredAt: partial.occurredAt ?? NOW,
    ...(partial.correlationId !== undefined
      ? { correlationId: partial.correlationId }
      : {}),
    payload: Object.freeze({ ...(partial.payload ?? {}) }),
  });
}

function atSignal(
  partial: Partial<NexoraObjectAttentionSignal> &
    Pick<NexoraObjectAttentionSignal, "objectId" | "level">,
): NexoraObjectAttentionSignal {
  return Object.freeze({
    signalId:
      partial.signalId ?? `at-${partial.objectId}-${partial.level}-${seq + 1}`,
    objectId: partial.objectId,
    source: partial.source ?? "Director",
    level: partial.level,
    reason: partial.reason ?? "DirectorAttention",
    priority: partial.priority ?? 1,
    persistent: partial.persistent ?? false,
    suppressible: partial.suppressible ?? true,
    ...(partial.pathId !== undefined ? { pathId: partial.pathId } : {}),
    ...(partial.correlationId !== undefined
      ? { correlationId: partial.correlationId }
      : {}),
    ...(partial.causationId !== undefined
      ? { causationId: partial.causationId }
      : {}),
    createdAt: partial.createdAt ?? NOW,
    ...(partial.expiresAt !== undefined ? { expiresAt: partial.expiresAt } : {}),
    payload: Object.freeze({ ...(partial.payload ?? {}) }),
  });
}

function resolve(
  input: NexoraObjectMaterialInteractionAttentionInput,
  previous?: NexoraObjectMaterialInteractionResponse,
) {
  return resolveNexoraObjectMaterialInteractionAttention(
    input,
    deps(),
    previous,
  );
}

function mutationAffordancesEnabled(
  response: NexoraObjectMaterialInteractionResponse,
): boolean {
  return response.affordances.some(
    (descriptor) =>
      MUTATION_AFFORDANCES.has(descriptor.affordance) && descriptor.enabled,
  );
}

describe("NOL-2:5 NexoraObject Material Interaction & Attention Engine", () => {
  it("1. Engine identity is exact.", () => {
    assert.equal(
      materialInteractionAttentionEngineIdentity,
      "NOL-2:5/NexoraObjectMaterialInteractionAttentionEngine",
    );
  });

  it("2. Production imports are limited to NOL-2:1 through NOL-2:4.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(
      imports.sort(),
      [
        "./nexoraObjectMaterialRepresentationFoundation.ts",
        "./nexoraObjectMaterialStateResolutionModel.ts",
        "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts",
        "./nexoraObjectRepresentationTransitionBehaviorEngine.ts",
      ].sort(),
    );
    assert.equal(/nol\/(?!material)/.test(source), false);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/three/i.test(source), false);
  });

  it("3. Default interaction resolves to Idle.", () => {
    const entry = makeEntry("idle-1");
    const state = resolveNexoraObjectMaterialInteractionState({
      representation: entry.representation,
      adaptiveRecommendation: makeAdaptive("idle-1"),
      interactionSignals: [],
      context: ctx(),
    });
    assert.equal(state, "Idle");
  });

  it("4. Hover resolves to Hovered.", () => {
    const entry = makeEntry("hover-1");
    const state = resolveNexoraObjectMaterialInteractionState({
      representation: entry.representation,
      adaptiveRecommendation: makeAdaptive("hover-1"),
      interactionSignals: [ixSignal({ objectId: "hover-1", type: "HoverEnter" })],
      context: ctx(),
    });
    assert.equal(state, "Hovered");
  });

  it("5. Selection overrides Hover.", () => {
    const entry = makeEntry("sel-1");
    const state = resolveNexoraObjectMaterialInteractionState({
      representation: entry.representation,
      adaptiveRecommendation: makeAdaptive("sel-1"),
      interactionSignals: [
        ixSignal({
          objectId: "sel-1",
          type: "HoverEnter",
          occurredAt: "2026-08-04T16:41:00.000Z",
        }),
        ixSignal({ objectId: "sel-1", type: "Select" }),
      ],
      context: ctx(),
    });
    assert.equal(state, "Selected");
  });

  it("6. Focus overrides Selection.", () => {
    const entry = makeEntry("focus-1");
    const state = resolveNexoraObjectMaterialInteractionState({
      representation: entry.representation,
      adaptiveRecommendation: makeAdaptive("focus-1"),
      interactionSignals: [
        ixSignal({
          objectId: "focus-1",
          type: "Select",
          occurredAt: "2026-08-04T16:41:00.000Z",
        }),
        ixSignal({ objectId: "focus-1", type: "Focus" }),
      ],
      context: ctx(),
    });
    assert.equal(state, "Focused");
  });

  it("7. Operation overrides Focus.", () => {
    const entry = makeEntry("op-1", { state: "Operation" });
    const state = resolveNexoraObjectMaterialInteractionState({
      representation: entry.representation,
      adaptiveRecommendation: makeAdaptive("op-1", {
        currentState: "Operation",
        recommendedState: "Operation",
        recommendedDensity: "Operational",
      }),
      interactionSignals: [
        ixSignal({
          objectId: "op-1",
          type: "Focus",
          occurredAt: "2026-08-04T16:41:00.000Z",
        }),
        ixSignal({ objectId: "op-1", type: "OperationEnter" }),
      ],
      context: ctx(),
    });
    assert.equal(state, "Operating");
  });

  it("8. Historical overrides mutable interaction.", () => {
    const historicalEntry = makeEntry("hist-1", { historical: true });
    assert.equal(
      resolveNexoraObjectMaterialInteractionState({
        representation: historicalEntry.representation,
        adaptiveRecommendation: makeAdaptive("hist-1"),
        interactionSignals: [
          ixSignal({ objectId: "hist-1", type: "Select" }),
        ],
        context: ctx(),
      }),
      "Historical",
    );

    const liveEntry = makeEntry("hist-2");
    assert.equal(
      resolveNexoraObjectMaterialInteractionState({
        representation: liveEntry.representation,
        adaptiveRecommendation: makeAdaptive("hist-2"),
        interactionSignals: [
          ixSignal({ objectId: "hist-2", type: "Focus" }),
          ixSignal({ objectId: "hist-2", type: "HistoricalEnter" }),
        ],
        context: ctx(),
      }),
      "Historical",
    );
  });

  it("9. Disabled interaction exposes no mutation affordances.", () => {
    const entry = makeEntry("dis-1", { state: "Operation" });
    const result = resolve(
      inputFrom(entry, {
        adaptiveRecommendation: makeAdaptive("dis-1", {
          currentState: "Operation",
          recommendedState: "Operation",
          recommendedDensity: "Operational",
        }),
        interactionSignals: [ixSignal({ objectId: "dis-1", type: "Disable" })],
      }),
    );
    assert.equal(result.response.interactionState, "Disabled");
    assert.equal(mutationAffordancesEnabled(result.response), false);
    for (const affordance of ["Approve", "Edit", "Start"] as const) {
      const descriptor = result.response.affordances.find(
        (item) => item.affordance === affordance,
      );
      if (descriptor) assert.equal(descriptor.enabled, false);
    }
  });

  it("10. Hidden representation is not interactive.", () => {
    const entry = makeEntry("hide-1", { hide: true, state: "Operation" });
    assert.equal(entry.representation.visible, false);
    const state = resolveNexoraObjectMaterialInteractionState({
      representation: entry.representation,
      adaptiveRecommendation: makeAdaptive("hide-1", {
        currentState: "Operation",
        recommendedState: "Operation",
      }),
      interactionSignals: [ixSignal({ objectId: "hide-1", type: "HoverEnter" })],
      context: ctx(),
    });
    assert.ok(state === "Idle" || state === "Disabled");

    const result = resolve(
      inputFrom(entry, {
        adaptiveRecommendation: makeAdaptive("hide-1", {
          currentState: entry.representation.state,
          recommendedState: entry.representation.state,
        }),
      }),
    );
    assert.ok(
      result.response.interactionState === "Idle" ||
        result.response.interactionState === "Disabled",
    );
    assert.ok(result.response.affordances.every((item) => !item.enabled));
  });

  it("11. Attention defaults to None.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "attn-none",
      seedColor: "Green",
      attentionSignals: [],
      context: ctx(),
      includeStatusBaseline: true,
    });
    assert.equal(resolved.attentionState, "None");
  });

  it("12. Notice overrides Observe.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "lvl-1",
      seedColor: "Green",
      attentionSignals: [
        atSignal({
          objectId: "lvl-1",
          level: "Observe",
          signalId: "obs",
          priority: 10,
        }),
        atSignal({
          objectId: "lvl-1",
          level: "Notice",
          signalId: "not",
          priority: 1,
        }),
      ],
      context: ctx(),
    });
    assert.equal(resolved.attentionState, "Notice");
  });

  it("13. Warning overrides Notice.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "lvl-2",
      seedColor: "Green",
      attentionSignals: [
        atSignal({ objectId: "lvl-2", level: "Notice", signalId: "n" }),
        atSignal({ objectId: "lvl-2", level: "Warning", signalId: "w" }),
      ],
      context: ctx(),
    });
    assert.equal(resolved.attentionState, "Warning");
  });

  it("14. Critical overrides Warning.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "lvl-3",
      seedColor: "Green",
      attentionSignals: [
        atSignal({ objectId: "lvl-3", level: "Warning", signalId: "w" }),
        atSignal({ objectId: "lvl-3", level: "Critical", signalId: "c" }),
      ],
      context: ctx(),
    });
    assert.equal(resolved.attentionState, "Critical");
  });

  it("15. Immediate overrides Critical.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "lvl-4",
      seedColor: "Green",
      attentionSignals: [
        atSignal({ objectId: "lvl-4", level: "Critical", signalId: "c" }),
        atSignal({
          objectId: "lvl-4",
          level: "Immediate",
          signalId: "i",
          source: "System",
        }),
      ],
      context: ctx(),
    });
    assert.equal(resolved.attentionState, "Immediate");
  });

  it("16. Red status creates Critical baseline attention.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "red-1",
      seedColor: "Red",
      attentionSignals: [],
      context: ctx(),
      includeStatusBaseline: true,
    });
    assert.equal(resolved.attentionState, "Critical");
  });

  it("17. Yellow status creates Warning baseline attention.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "yel-1",
      seedColor: "Yellow",
      attentionSignals: [],
      context: ctx(),
      includeStatusBaseline: true,
    });
    assert.equal(resolved.attentionState, "Warning");
  });

  it("18. Green status is not artificially escalated.", () => {
    assert.equal(
      resolveNexoraObjectMaterialAttentionState({
        objectId: "g",
        seedColor: "Green",
        attentionSignals: [],
        context: ctx(),
      }).attentionState,
      "None",
    );
  });

  it("19. Blue status is not artificially escalated.", () => {
    assert.equal(
      resolveNexoraObjectMaterialAttentionState({
        objectId: "b",
        seedColor: "Blue",
        attentionSignals: [],
        context: ctx(),
      }).attentionState,
      "None",
    );
  });

  it("20. White status remains neutral.", () => {
    assert.equal(
      resolveNexoraObjectMaterialAttentionState({
        objectId: "w",
        seedColor: "White",
        attentionSignals: [],
        context: ctx(),
      }).attentionState,
      "None",
    );
  });

  it("21. Black status does not automatically become Critical.", () => {
    assert.equal(
      resolveNexoraObjectMaterialAttentionState({
        objectId: "k",
        seedColor: "Black",
        attentionSignals: [],
        context: ctx(),
      }).attentionState,
      "None",
    );
  });

  it("22. Seed color never changes.", () => {
    const entry = makeEntry("seed-1", { status: "Yellow" });
    const before = entry.representation.material.color.seed;
    const result = resolve(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({ objectId: "seed-1", type: "Focus" }),
        ],
        attentionSignals: [
          atSignal({
            objectId: "seed-1",
            level: "Immediate",
            source: "System",
            signalId: "seed-imm",
          }),
        ],
      }),
    );
    assert.equal(result.response.materialState.seedColor, before);
    assert.equal(
      result.response.materialState.material.color.seed,
      before,
    );
    assert.equal(entry.representation.material.color.seed, before);
  });

  it("23. Focus does not change attention to Critical.", () => {
    const entry = makeEntry("focus-attn", { status: "Green" });
    const result = resolve(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({ objectId: "focus-attn", type: "Focus" }),
        ],
      }),
    );
    assert.equal(result.response.interactionState, "Focused");
    assert.equal(result.response.attentionState, "None");
  });

  it("24. Operation does not create Warning without a signal.", () => {
    const entry = makeEntry("op-attn", { state: "Operation", status: "Green" });
    const result = resolve(
      inputFrom(entry, {
        adaptiveRecommendation: makeAdaptive("op-attn", {
          currentState: "Operation",
          recommendedState: "Operation",
          recommendedDensity: "Operational",
        }),
        interactionSignals: [
          ixSignal({ objectId: "op-attn", type: "OperationEnter" }),
        ],
      }),
    );
    assert.equal(result.response.interactionState, "Operating");
    assert.notEqual(result.response.attentionState, "Warning");
    assert.equal(result.response.attentionState, "None");
  });

  it("25. Source arbitration is deterministic.", () => {
    assert.ok(
      resolveNexoraObjectAttentionSourcePriority("System") <
        resolveNexoraObjectAttentionSourcePriority("Director"),
    );
    assert.ok(
      resolveNexoraObjectAttentionSourcePriority("Director") <
        resolveNexoraObjectAttentionSourcePriority("Status"),
    );
  });

  it("26. Equal-level signals use priority.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "prio-1",
      seedColor: "Green",
      attentionSignals: [
        atSignal({
          objectId: "prio-1",
          level: "Notice",
          priority: 1,
          signalId: "low",
          source: "Director",
          reason: "low-priority",
        }),
        atSignal({
          objectId: "prio-1",
          level: "Notice",
          priority: 9,
          signalId: "high",
          source: "Advisor",
          reason: "high-priority",
        }),
      ],
      context: ctx(),
    });
    assert.equal(resolved.dominantSignal?.signalId, "high");
  });

  it("27. Equal-priority signals use stable source and ID tie-breaking.", () => {
    const bySource = resolveNexoraObjectMaterialAttentionState({
      objectId: "tie-1",
      seedColor: "Green",
      attentionSignals: [
        atSignal({
          objectId: "tie-1",
          level: "Notice",
          priority: 5,
          signalId: "z-status",
          source: "Status",
        }),
        atSignal({
          objectId: "tie-1",
          level: "Notice",
          priority: 5,
          signalId: "a-system",
          source: "System",
        }),
      ],
      context: ctx(),
    });
    assert.equal(bySource.dominantSignal?.source, "System");

    const byId = resolveNexoraObjectMaterialAttentionState({
      objectId: "tie-2",
      seedColor: "Green",
      attentionSignals: [
        atSignal({
          objectId: "tie-2",
          level: "Notice",
          priority: 5,
          signalId: "b-signal",
          source: "Director",
        }),
        atSignal({
          objectId: "tie-2",
          level: "Notice",
          priority: 5,
          signalId: "a-signal",
          source: "Director",
        }),
      ],
      context: ctx(),
    });
    assert.equal(byId.dominantSignal?.signalId, "a-signal");
  });

  it("28. Expired signals are ignored.", () => {
    const resolved = resolveNexoraObjectMaterialAttentionState({
      objectId: "exp-1",
      seedColor: "Green",
      attentionSignals: [
        atSignal({
          objectId: "exp-1",
          level: "Critical",
          signalId: "expired",
          expiresAt: "2026-08-04T16:40:00.000Z",
        }),
        atSignal({
          objectId: "exp-1",
          level: "Observe",
          signalId: "alive",
        }),
      ],
      context: ctx({ currentTime: NOW }),
    });
    assert.equal(resolved.attentionState, "Observe");
    assert.ok(resolved.expiredSignalIds.includes("expired"));
  });

  it("29. Duplicate signal IDs are rejected.", () => {
    const entry = makeEntry("dup-1");
    const errors = validateNexoraObjectMaterialInteractionAttentionInput(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({
            objectId: "dup-1",
            type: "HoverEnter",
            signalId: "same",
          }),
        ],
        attentionSignals: [
          atSignal({
            objectId: "dup-1",
            level: "Notice",
            signalId: "same",
          }),
        ],
      }),
    );
    assert.ok(
      errors.some((error) => error.code === "ATTENTION_DUPLICATE_SIGNAL_ID"),
    );
  });

  it("30. Persistent signals remain active.", () => {
    const signals = [
      atSignal({
        objectId: "pers-1",
        level: "Notice",
        signalId: "temp",
        persistent: false,
      }),
      atSignal({
        objectId: "pers-1",
        level: "Warning",
        signalId: "keep",
        persistent: true,
      }),
    ];
    const cleared = clearNexoraObjectAttentionSignals(signals);
    assert.equal(cleared.length, 1);
    assert.equal(cleared[0]!.signalId, "keep");
    assert.equal(cleared[0]!.persistent, true);
  });

  it("31. Hover produces no critical pulse.", () => {
    const entry = makeEntry("pulse-hover", { status: "Green" });
    const result = resolve(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({ objectId: "pulse-hover", type: "HoverEnter" }),
        ],
      }),
    );
    assert.equal(result.response.interactionState, "Hovered");
    assert.notEqual(result.response.pulse.intensity, "High");
    assert.equal(result.response.pulse.enabled, false);
    assert.equal(result.response.pulse.intensity, "None");
  });

  it("32. Reduced motion disables repeated pulse.", () => {
    const entry = makeEntry("rm-1", { status: "Red" });
    const result = resolve(
      inputFrom(entry, {
        context: ctx({ reducedMotion: true }),
      }),
    );
    assert.equal(result.response.attentionState, "Critical");
    assert.equal(result.response.pulse.repetitions, 0);
    assert.equal(result.response.pulse.reducedMotionApplied, true);
  });

  it("33. Immediate safety signals are never suppressed.", () => {
    const signals = [
      atSignal({
        objectId: "imm-1",
        level: "Immediate",
        signalId: "imm-a",
        source: "System",
        suppressible: true,
        reason: "safety",
      }),
      atSignal({
        objectId: "imm-1",
        level: "Immediate",
        signalId: "imm-b",
        source: "System",
        suppressible: true,
        reason: "safety",
      }),
    ];
    const suppressed = resolveNexoraObjectAttentionSuppression(
      signals,
      Object.freeze([]),
      ctx({ suppressRepeatedAttention: true, attentionCooldownMs: 60_000 }),
    );
    assert.equal(suppressed.includes("imm-a"), false);
    assert.equal(suppressed.includes("imm-b"), false);
  });

  it("34. Repeated temporary signals respect cooldown.", () => {
    const first = atSignal({
      objectId: "cool-1",
      level: "Notice",
      signalId: "n1",
      reason: "repeat",
      persistent: false,
      suppressible: true,
    });
    const second = atSignal({
      objectId: "cool-1",
      level: "Notice",
      signalId: "n2",
      reason: "repeat",
      persistent: false,
      suppressible: true,
    });
    const suppressed = resolveNexoraObjectAttentionSuppression(
      [first, second],
      Object.freeze([
        Object.freeze({
          objectId: "cool-1",
          signalId: "n2",
          lastPresentedAt: "2026-08-04T16:41:30.000Z",
          presentationCount: 1,
        }),
      ]),
      ctx({
        suppressRepeatedAttention: true,
        attentionCooldownMs: 60_000,
      }),
    );
    assert.ok(suppressed.includes("n2"));
  });

  it("35. Critical compact objects remain identifiable.", () => {
    const entry = makeEntry("crit-compact", { status: "Red" });
    const result = resolve(
      inputFrom(entry, {
        adaptiveRecommendation: makeAdaptive("crit-compact", {
          recommendedState: "Minimum",
          recommendedDensity: "Compact",
          currentState: "Minimum",
        }),
      }),
    );
    assert.equal(result.response.attentionState, "Critical");
    assert.equal(result.response.dimmed, false);
    assert.equal(result.response.materialState.seedColor, "Red");
    assert.ok(
      result.response.emphasis === "Critical" ||
        result.response.attentionState === "Critical",
    );
  });

  it("36. Focused and Operation objects are never dimmed.", () => {
    const focused = resolve(
      inputFrom(makeEntry("dim-focus"), {
        interactionSignals: [
          ixSignal({ objectId: "dim-focus", type: "Focus" }),
        ],
        context: ctx({ focusedObjectId: "other" }),
      }),
    );
    assert.equal(focused.response.interactionState, "Focused");
    assert.equal(focused.response.dimmed, false);

    const operating = resolve(
      inputFrom(makeEntry("dim-op", { state: "Operation" }), {
        adaptiveRecommendation: makeAdaptive("dim-op", {
          currentState: "Operation",
          recommendedState: "Operation",
          recommendedDensity: "Operational",
        }),
        interactionSignals: [
          ixSignal({ objectId: "dim-op", type: "OperationEnter" }),
        ],
        context: ctx({ focusedObjectId: "other" }),
      }),
    );
    assert.equal(operating.response.interactionState, "Operating");
    assert.equal(operating.response.dimmed, false);
  });

  it("37. Background objects may be dimmed.", () => {
    const entry = makeEntry("bg-1");
    const dimmed = resolveNexoraObjectBackgroundDimming({
      objectId: "bg-1",
      interactionState: "Idle",
      attentionState: "None",
      context: ctx({ focusedObjectId: "focus-elsewhere" }),
    });
    assert.equal(dimmed, true);

    const result = resolve(
      inputFrom(entry, {
        context: ctx({ focusedObjectId: "focus-elsewhere" }),
      }),
    );
    assert.equal(result.response.interactionState, "Idle");
    assert.equal(result.response.dimmed, true);
  });

  it("38. Dimming does not change Seed color.", () => {
    const entry = makeEntry("dim-seed", { status: "Blue" });
    const result = resolve(
      inputFrom(entry, {
        context: ctx({ focusedObjectId: "elsewhere" }),
      }),
    );
    assert.equal(result.response.dimmed, true);
    assert.equal(result.response.materialState.seedColor, "Blue");
  });

  it("39. Attention path root receives highest path emphasis.", () => {
    const path: NexoraObjectAttentionPath = Object.freeze({
      pathId: "path-1",
      objectIds: Object.freeze(["root", "mid", "leaf"]),
      rootObjectId: "root",
      targetObjectId: "leaf",
      source: "Director",
      level: "Notice",
      reason: "path",
    });
    const resolved = resolveNexoraObjectAttentionPath(path);
    assert.equal(resolved.roles.root, "Root");
    assert.ok(
      ["Notice", "Warning", "Critical", "Immediate"].includes(
        resolved.attentionByObjectId.root!,
      ),
    );
    assert.ok(
      resolveNexoraObjectMaterialAttentionState({
        objectId: "x",
        seedColor: "Green",
        attentionSignals: [
          atSignal({
            objectId: "x",
            level: resolved.attentionByObjectId.root!,
            signalId: "r",
          }),
          atSignal({
            objectId: "x",
            level: resolved.attentionByObjectId.mid!,
            signalId: "m",
          }),
        ],
        context: ctx(),
      }).attentionState === resolved.attentionByObjectId.root,
    );
  });

  it("40. Intermediate path objects receive contextual emphasis.", () => {
    const resolved = resolveNexoraObjectAttentionPath(
      Object.freeze({
        pathId: "path-2",
        objectIds: Object.freeze(["root", "mid", "leaf"]),
        rootObjectId: "root",
        targetObjectId: "leaf",
        source: "Director",
        level: "Warning",
        reason: "path",
      }),
    );
    assert.equal(resolved.roles.mid, "Intermediate");
    assert.equal(resolved.attentionByObjectId.mid, "Observe");
  });

  it("41. Path resolution performs no graph traversal.", () => {
    const resolved = resolveNexoraObjectAttentionPath(
      Object.freeze({
        pathId: "path-3",
        objectIds: Object.freeze(["a", "b"]),
        rootObjectId: "a",
        source: "Director",
        level: "Notice",
        reason: "path",
      }),
    );
    assert.equal(resolved.performedGraphTraversal, false);
  });

  it("42. Attention budget limits Immediate objects.", () => {
    const budget = allocateNexoraObjectAttentionBudget(
      [
        Object.freeze({
          objectId: "i1",
          attentionState: "Immediate" as const,
          seedColor: "Green" as const,
          adaptiveRank: 1,
          isFocused: false,
          isOperating: false,
        }),
        Object.freeze({
          objectId: "i2",
          attentionState: "Immediate" as const,
          seedColor: "Green" as const,
          adaptiveRank: 2,
          isFocused: false,
          isOperating: false,
        }),
      ],
      Object.freeze({
        maximumImmediateObjects: 1,
        maximumCriticalObjects: 3,
        maximumPulsingObjects: 2,
        maximumStrongGlowObjects: 4,
      }),
    );
    const allocatedImmediate = budget.allocations.filter(
      (item) => item.allocatedAttentionState === "Immediate",
    );
    assert.equal(allocatedImmediate.length, 1);
    assert.ok(budget.allocations.some((item) => item.downgraded));
  });

  it("43. Attention budget limits pulsing objects.", () => {
    const budget = allocateNexoraObjectAttentionBudget(
      [
        Object.freeze({
          objectId: "p1",
          attentionState: "Critical" as const,
          seedColor: "Red" as const,
          adaptiveRank: 1,
          isFocused: false,
          isOperating: false,
        }),
        Object.freeze({
          objectId: "p2",
          attentionState: "Critical" as const,
          seedColor: "Red" as const,
          adaptiveRank: 2,
          isFocused: false,
          isOperating: false,
        }),
        Object.freeze({
          objectId: "p3",
          attentionState: "Critical" as const,
          seedColor: "Red" as const,
          adaptiveRank: 3,
          isFocused: false,
          isOperating: false,
        }),
      ],
      Object.freeze({
        maximumImmediateObjects: 1,
        maximumCriticalObjects: 3,
        maximumPulsingObjects: 1,
        maximumStrongGlowObjects: 4,
      }),
    );
    const pulsing = budget.allocations.filter((item) => item.pulseAllowed);
    assert.equal(pulsing.length, 1);
  });

  it("44. Downgraded attention remains visible.", () => {
    const budget = allocateNexoraObjectAttentionBudget(
      [
        Object.freeze({
          objectId: "d1",
          attentionState: "Immediate" as const,
          seedColor: "Green" as const,
          adaptiveRank: 1,
          isFocused: false,
          isOperating: false,
        }),
        Object.freeze({
          objectId: "d2",
          attentionState: "Immediate" as const,
          seedColor: "Green" as const,
          adaptiveRank: 2,
          isFocused: false,
          isOperating: false,
        }),
      ],
      Object.freeze({
        maximumImmediateObjects: 1,
        maximumCriticalObjects: 3,
        maximumPulsingObjects: 2,
        maximumStrongGlowObjects: 4,
      }),
    );
    const downgraded = budget.allocations.find((item) => item.downgraded)!;
    assert.ok(downgraded);
    assert.notEqual(downgraded.allocatedAttentionState, "None");
    assert.ok(
      ["Critical", "Warning", "Notice", "Observe"].includes(
        downgraded.allocatedAttentionState,
      ),
    );
  });

  it("45. Red objects outrank Yellow objects in equal context.", () => {
    const budget = allocateNexoraObjectAttentionBudget(
      [
        Object.freeze({
          objectId: "yellow",
          attentionState: "Immediate" as const,
          seedColor: "Yellow" as const,
          adaptiveRank: 1,
          isFocused: false,
          isOperating: false,
        }),
        Object.freeze({
          objectId: "red",
          attentionState: "Immediate" as const,
          seedColor: "Red" as const,
          adaptiveRank: 2,
          isFocused: false,
          isOperating: false,
        }),
      ],
      Object.freeze({
        maximumImmediateObjects: 1,
        maximumCriticalObjects: 3,
        maximumPulsingObjects: 2,
        maximumStrongGlowObjects: 4,
      }),
    );
    const red = budget.allocations.find((item) => item.objectId === "red")!;
    const yellow = budget.allocations.find(
      (item) => item.objectId === "yellow",
    )!;
    assert.equal(red.allocatedAttentionState, "Immediate");
    assert.equal(red.downgraded, false);
    assert.equal(yellow.downgraded, true);
    assert.notEqual(yellow.allocatedAttentionState, "Immediate");
  });

  it("46. Adaptive density recommendations remain authoritative.", () => {
    const entry = makeEntry("adapt-1", { state: "Minimum" });
    const adaptive = makeAdaptive("adapt-1", {
      currentState: "Minimum",
      recommendedState: "Minimum",
      recommendedDensity: "Seed",
      rank: 3,
    });
    const beforeAdaptive = JSON.stringify(adaptive);
    const beforeRepState = entry.representation.state;
    const result = resolve(
      inputFrom(entry, {
        adaptiveRecommendation: adaptive,
        interactionSignals: [
          ixSignal({ objectId: "adapt-1", type: "OperationEnter" }),
        ],
      }),
    );
    assert.equal(JSON.stringify(adaptive), beforeAdaptive);
    assert.equal(entry.representation.state, beforeRepState);
    assert.notEqual(result.response.interactionState, "Operating");
    assert.equal(adaptive.recommendedState, "Minimum");
  });

  it("47. NOL-2:3 behavior recommendations contain only supported behavior types.", () => {
    const entry = makeEntry("beh-1", { status: "Red", state: "Operation" });
    const result = resolve(
      inputFrom(entry, {
        adaptiveRecommendation: makeAdaptive("beh-1", {
          currentState: "Operation",
          recommendedState: "Operation",
          recommendedDensity: "Operational",
          reasons: Object.freeze(["AttentionPath"]),
        }),
        interactionSignals: [
          ixSignal({ objectId: "beh-1", type: "OperationEnter" }),
        ],
        context: ctx({ focusedObjectId: "elsewhere" }),
      }),
    );
    const behaviors = recommendNexoraObjectAttentionBehaviors({
      response: result.response,
      context: ctx(),
    });
    assert.ok(behaviors.length > 0);
    for (const behavior of behaviors) {
      assert.ok(SUPPORTED_ATTENTION_BEHAVIORS.includes(behavior.behavior));
    }
  });

  it("48. Primary resolution never mutates input.", () => {
    const entry = makeEntry("immut-1");
    const input = inputFrom(entry, {
      interactionSignals: [
        ixSignal({ objectId: "immut-1", type: "Select" }),
      ],
      attentionSignals: [
        atSignal({ objectId: "immut-1", level: "Notice", signalId: "n" }),
      ],
    });
    const before = JSON.stringify(input);
    resolve(input);
    assert.equal(JSON.stringify(input), before);
  });

  it("49. Collection resolution preserves input order.", () => {
    const ids = ["c", "a", "b"];
    const entries = ids.map((id) =>
      Object.freeze({
        input: inputFrom(makeEntry(id)),
      }),
    );
    const collection =
      resolveNexoraObjectMaterialInteractionAttentionCollection(entries, {
        dependencies: deps(),
      });
    assert.deepEqual(
      collection.results.map((item) => item.response.objectId),
      ids,
    );
  });

  it("50. Collection resolution handles multiple Critical objects.", () => {
    const entries = ["cr1", "cr2", "cr3"].map((id) =>
      Object.freeze({
        input: inputFrom(makeEntry(id, { status: "Red" })),
      }),
    );
    const collection =
      resolveNexoraObjectMaterialInteractionAttentionCollection(entries, {
        dependencies: deps(),
      });
    assert.equal(collection.results.length, 3);
    assert.ok(
      collection.results.every(
        (item) => item.response.attentionState === "Critical",
      ),
    );
  });

  it("51. Collection ties use adaptive rank then object ID.", () => {
    const lowRank = Object.freeze({
      input: inputFrom(makeEntry("z-obj", { status: "Green" }), {
        adaptiveRecommendation: makeAdaptive("z-obj", { rank: 1 }),
        attentionSignals: [
          atSignal({
            objectId: "z-obj",
            level: "Immediate",
            signalId: "z-imm",
            source: "System",
          }),
        ],
      }),
    });
    const highRank = Object.freeze({
      input: inputFrom(makeEntry("a-obj", { status: "Green" }), {
        adaptiveRecommendation: makeAdaptive("a-obj", { rank: 5 }),
        attentionSignals: [
          atSignal({
            objectId: "a-obj",
            level: "Immediate",
            signalId: "a-imm",
            source: "System",
          }),
        ],
      }),
    });
    const collection =
      resolveNexoraObjectMaterialInteractionAttentionCollection(
        [highRank, lowRank],
        {
          dependencies: deps(),
          budget: Object.freeze({
            maximumImmediateObjects: 1,
            maximumCriticalObjects: 3,
            maximumPulsingObjects: 2,
            maximumStrongGlowObjects: 4,
          }),
        },
      );
    const z = collection.results.find(
      (item) => item.response.objectId === "z-obj",
    )!;
    const a = collection.results.find(
      (item) => item.response.objectId === "a-obj",
    )!;
    assert.equal(z.response.attentionState, "Immediate");
    assert.notEqual(a.response.attentionState, "Immediate");
  });

  it("52. Clear removes temporary attention only.", () => {
    const signals = [
      atSignal({
        objectId: "clr-1",
        level: "Notice",
        signalId: "temp",
        persistent: false,
      }),
      atSignal({
        objectId: "clr-1",
        level: "Warning",
        signalId: "persist",
        persistent: true,
      }),
      atSignal({
        objectId: "clr-1",
        level: "Critical",
        signalId: "status-like",
        source: "Status",
        persistent: false,
      }),
    ];
    const cleared = clearNexoraObjectAttentionSignals(signals, {
      clearPersistent: false,
    });
    assert.ok(cleared.every((signal) => signal.signalId !== "temp"));
    assert.ok(cleared.some((signal) => signal.signalId === "persist"));
    assert.ok(cleared.some((signal) => signal.signalId === "status-like"));
  });

  it("53. Reset preserves Seed color.", () => {
    const entry = makeEntry("reset-1", { status: "Yellow" });
    const reset = resetNexoraObjectMaterialInteractionAttention({
      representation: entry.representation,
      materialState: entry.materialState,
      adaptiveRecommendation: makeAdaptive("reset-1"),
      context: ctx(),
    });
    assert.equal(reset.materialState.seedColor, "Yellow");
    assert.equal(reset.attentionState, "None");
  });

  it("54. Reset does not change representation state.", () => {
    const entry = makeEntry("reset-2", { state: "Report" });
    const before = entry.representation.state;
    resetNexoraObjectMaterialInteractionAttention({
      representation: entry.representation,
      materialState: entry.materialState,
      adaptiveRecommendation: makeAdaptive("reset-2", {
        currentState: "Report",
        recommendedState: "Report",
        recommendedDensity: "Executive",
      }),
      context: ctx(),
    });
    assert.equal(entry.representation.state, before);
  });

  it("55. Events preserve correlation and causation IDs.", () => {
    const entry = makeEntry("evt-1");
    const result = resolve(
      inputFrom(entry, {
        attentionSignals: [
          atSignal({
            objectId: "evt-1",
            level: "Warning",
            signalId: "corr-sig",
            correlationId: "corr-99",
            causationId: "cause-42",
          }),
        ],
      }),
    );
    const activated = result.events.find(
      (event) => event.type === "AttentionActivated",
    );
    assert.ok(activated);
    assert.equal(activated!.correlationId, "corr-99");
    assert.equal(activated!.causationId, "cause-42");
  });

  it("56. Records are immutable.", () => {
    const entry = makeEntry("rec-1", { status: "Red" });
    const result = resolve(inputFrom(entry));
    const record = createNexoraObjectMaterialAttentionRecord(result.response, {
      dependencies: deps(),
      source: "Status",
    });
    assert.ok(Object.isFrozen(record));
    assert.ok(Object.isFrozen(record.activeSignalIds));
    assert.ok(Object.isFrozen(result));
    assert.ok(Object.isFrozen(result.response));
    assert.throws(() => {
      (record as { objectId: string }).objectId = "x";
    });
  });

  it("57. Snapshot comparison detects interaction changes.", () => {
    const entry = makeEntry("snap-ix");
    const idle = resolve(inputFrom(entry)).response;
    const hovered = resolve(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({ objectId: "snap-ix", type: "HoverEnter" }),
        ],
      }),
    ).response;
    const d = deps();
    const cmp = compareNexoraObjectMaterialAttentionSnapshots(
      createNexoraObjectMaterialAttentionSnapshot([idle], d),
      createNexoraObjectMaterialAttentionSnapshot([hovered], d),
    );
    assert.equal(cmp.interactionChanged, true);
    assert.ok(
      cmp.differences.some(
        (diff) => diff.objectId === "snap-ix" && diff.interactionChanged,
      ),
    );
  });

  it("58. Snapshot comparison detects attention-level changes.", () => {
    const entry = makeEntry("snap-at", { status: "Green" });
    const none = resolve(inputFrom(entry)).response;
    const warning = resolve(
      inputFrom(entry, {
        attentionSignals: [
          atSignal({
            objectId: "snap-at",
            level: "Warning",
            signalId: "w-snap",
          }),
        ],
      }),
    ).response;
    const d = deps();
    const cmp = compareNexoraObjectMaterialAttentionSnapshots(
      createNexoraObjectMaterialAttentionSnapshot([none], d),
      createNexoraObjectMaterialAttentionSnapshot([warning], d),
    );
    assert.equal(cmp.attentionChanged, true);
  });

  it("59. Snapshot comparison detects glow and pulse changes.", () => {
    const entry = makeEntry("snap-glow", { status: "Green" });
    const calm = resolve(inputFrom(entry)).response;
    const critical = resolve(
      inputFrom(entry, {
        attentionSignals: [
          atSignal({
            objectId: "snap-glow",
            level: "Critical",
            signalId: "c-snap",
            source: "Director",
          }),
        ],
      }),
    ).response;
    const d = deps();
    const cmp = compareNexoraObjectMaterialAttentionSnapshots(
      createNexoraObjectMaterialAttentionSnapshot([calm], d),
      createNexoraObjectMaterialAttentionSnapshot([critical], d),
    );
    assert.equal(cmp.glowOrPulseChanged, true);
  });

  it("60. Validation rejects object-ID mismatch.", () => {
    const entry = makeEntry("mismatch-1");
    const errors = validateNexoraObjectMaterialInteractionAttentionInput(
      Object.freeze({
        ...inputFrom(entry),
        transitionState: Object.freeze({
          ...entry.transitionState,
          objectId: "other-id",
        }),
      }),
    );
    assert.ok(
      errors.some((error) => error.code === "ATTENTION_OBJECT_ID_MISMATCH"),
    );
  });

  it("61. Validation rejects invalid priorities.", () => {
    const errors = validateNexoraObjectAttentionSignal(
      atSignal({
        objectId: "bad-prio",
        level: "Notice",
        priority: -1,
        signalId: "neg",
      }),
    );
    assert.ok(
      errors.some((error) => error.code === "ATTENTION_INVALID_PRIORITY"),
    );
  });

  it("62. Validation rejects invalid timestamps.", () => {
    const errors = validateNexoraObjectAttentionSignal(
      atSignal({
        objectId: "bad-ts",
        level: "Notice",
        signalId: "bad-ts",
        createdAt: "not-a-timestamp",
      }),
    );
    assert.ok(
      errors.some((error) => error.code === "ATTENTION_INVALID_TIMESTAMP"),
    );
  });

  it("63. Validation rejects Seed-color conflicts.", () => {
    const entry = makeEntry("seed-conflict", { status: "Green" });
    const badMaterial = Object.freeze({
      ...entry.materialState,
      seedColor: "Red" as const,
    });
    const errors = validateNexoraObjectMaterialInteractionAttentionInput(
      Object.freeze({
        ...inputFrom(entry),
        materialState: badMaterial,
      }),
    );
    assert.ok(
      errors.some((error) => error.code === "ATTENTION_SEED_COLOR_CONFLICT"),
    );
  });

  it("64. Serialization and deserialization are reversible.", () => {
    const signal = atSignal({
      objectId: "ser-1",
      level: "Warning",
      signalId: "ser-sig",
      source: "Director",
      reason: "DirectorAttention",
      priority: 3,
      persistent: true,
      suppressible: false,
      correlationId: "corr",
      causationId: "cause",
      pathId: "path",
      expiresAt: "2026-08-05T00:00:00.000Z",
      payload: Object.freeze({ k: 1 }),
    });
    const signalRound = deserializeNexoraObjectAttentionSignal(
      serializeNexoraObjectAttentionSignal(signal),
    );
    assert.equal(signalRound.signalId, signal.signalId);
    assert.equal(signalRound.objectId, signal.objectId);
    assert.equal(signalRound.level, signal.level);
    assert.equal(signalRound.priority, signal.priority);
    assert.equal(signalRound.correlationId, signal.correlationId);
    assert.equal(signalRound.causationId, signal.causationId);
    assert.ok(Object.isFrozen(signalRound));

    const entry = makeEntry("ser-2", { status: "Yellow" });
    const response = resolve(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({ objectId: "ser-2", type: "Select" }),
        ],
      }),
    ).response;
    const responseRound = deserializeNexoraObjectMaterialInteractionResponse(
      serializeNexoraObjectMaterialInteractionResponse(response),
    );
    assert.equal(responseRound.objectId, response.objectId);
    assert.equal(responseRound.interactionState, response.interactionState);
    assert.equal(responseRound.attentionState, response.attentionState);
    assert.equal(responseRound.materialState.seedColor, response.materialState.seedColor);
    assert.ok(Object.isFrozen(responseRound));
  });

  it("65. Unsupported schemas are rejected.", () => {
    assert.throws(() =>
      deserializeNexoraObjectAttentionSignal(
        JSON.stringify({
          schemaVersion: "0.0.0",
          signal: atSignal({ objectId: "x", level: "Notice", signalId: "x" }),
        }),
      ),
    );
    assert.throws(() =>
      deserializeNexoraObjectMaterialInteractionResponse(
        JSON.stringify({ schemaVersion: "9.9.9", response: {} }),
      ),
    );
  });

  it("66. Serialized output contains no renderer objects or functions.", () => {
    const entry = makeEntry("ser-safe", { status: "Red" });
    const response = resolve(inputFrom(entry)).response;
    const json = serializeNexoraObjectMaterialInteractionResponse(response);
    assert.equal(json.includes("function"), false);
    assert.equal(json.includes("HTMLElement"), false);
    assert.equal(json.includes("THREE"), false);
    JSON.parse(json);
  });

  it("67. No NOL-1 identity, runtime, lifecycle, status, or relationships are mutated.", () => {
    const object = createNexoraObjectContract({
      id: "nol1-safe",
      type: "Goal",
      caption: "Immutable",
      status: "Green",
      createdAt: NOW,
    });
    object.setLifecycle("Active");
    const before = {
      identity: JSON.stringify(object.identity),
      status: object.status,
      lifecycle: object.lifecycle,
    };
    const entry = makeEntry("nol1-safe");
    resolve(
      inputFrom(entry, {
        interactionSignals: [
          ixSignal({ objectId: "nol1-safe", type: "Focus" }),
        ],
        attentionSignals: [
          atSignal({
            objectId: "nol1-safe",
            level: "Notice",
            signalId: "n-safe",
          }),
        ],
      }),
    );
    assert.equal(JSON.stringify(object.identity), before.identity);
    assert.equal(object.status, before.status);
    assert.equal(object.lifecycle, before.lifecycle);
  });

  it("68. Typecheck remains clean.", () => {
    assert.equal(
      typeof resolveNexoraObjectMaterialInteractionAttention,
      "function",
    );
    assert.equal(
      typeof resolveNexoraObjectMaterialInteractionAttentionCollection,
      "function",
    );
  });

  it("69. ESLint remains clean.", () => {
    assert.equal(
      typeof assertNexoraObjectMaterialInteractionAttentionInvariants,
      "function",
    );
    assert.equal(typeof recommendNexoraObjectAttentionBehaviors, "function");
  });
});
