import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  evaluateDirectorRuntimeInteractionContract,
  rejectDirectorRuntimeInteractionContract,
  type AcceptedDirectorRuntimeInteractionContract,
  type CreateDirectorRuntimeInteractionRequestInput,
} from "./directorRuntimeInteractionContracts.ts";
import {
  DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES as categories,
  DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS as intentKinds,
  DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_DISPOSITIONS as dispositions,
  DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES as rules,
  directorRuntimeInteractionIntentResolution as resolution,
  directorRuntimeInteractionIntentResolutionRegistry as registry,
  findDirectorRuntimeInteractionIntentRuleConflicts,
  isDirectorRuntimeInteractionIntent,
  isResolvedDirectorRuntimeInteractionIntent,
  isUnresolvedDirectorRuntimeInteractionIntent,
  resolveDirectorRuntimeInteractionIntent,
  validateDirectorRuntimeInteractionIntent,
  verifyDirectorRuntimeInteractionIntentResolution,
  type DirectorRuntimeInteractionIntentResolutionRule,
} from "./directorRuntimeInteractionIntentResolution.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionIntentResolution.ts", import.meta.url),
  "utf8",
);

function accepted(
  overrides: Partial<CreateDirectorRuntimeInteractionRequestInput> = {},
): AcceptedDirectorRuntimeInteractionContract {
  const input: CreateDirectorRuntimeInteractionRequestInput = {
    requestId: overrides.requestId ?? "interaction-17",
    observation: overrides.observation ?? {
      interactionId: "ix-1",
      kind: "select",
      source: "object",
      target: { kind: "object", id: "factory-01" },
      sequence: 17,
      scope: "scene",
    },
    context: overrides.context ?? {
      sceneId: "executive-main",
      workspaceId: "goal",
      lensId: "objects",
    },
    ...(overrides.contractVersion === undefined
      ? {}
      : { contractVersion: overrides.contractVersion }),
  };
  const result = evaluateDirectorRuntimeInteractionContract(input);
  assert.equal(result.disposition, "accepted");
  return result as AcceptedDirectorRuntimeInteractionContract;
}

function resolveKind(kind: CreateDirectorRuntimeInteractionRequestInput["observation"]["kind"]) {
  return resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix-1", kind, source: "object",
      target: { kind: "object", id: "factory-01" }, sequence: 1, scope: "scene",
    },
  }));
}

test("1-4. publishes exact DRI-4:3 identity, version, namespace, and DRI-4:2-only dependency", () => {
  assert.deepEqual({
    phase: resolution.phase,
    name: resolution.name,
    identity: resolution.identity,
    namespace: resolution.namespace,
    version: resolution.version,
    layer: resolution.layer,
    stage: resolution.stage,
    immediateDependency: resolution.immediateDependency,
  }, {
    phase: "DRI-4:3",
    name: "DirectorRuntimeInteractionIntentResolution",
    identity: "DRI-4:3/DirectorRuntimeInteractionIntentResolution",
    namespace: "nexora.dri.interaction.orchestration.intent-resolution",
    version: "4.3.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "IntentResolution",
    immediateDependency: "DRI-4:2/DirectorRuntimeInteractionContracts",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], ["@/app/lib/dri/directorRuntimeInteractionContracts"]);
  assert.doesNotMatch(source, /directorRuntimeInteractionOrchestrationFoundation/);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration|directorRuntimeStateContext|directorRuntimeIntegration/);
});

test("5-7. intent kind, category, and resolution registry vocabularies are immutable", () => {
  assert.deepEqual([...intentKinds], [
    "select-target", "focus-target", "activate-target", "inspect-target", "open-target",
    "close-target", "navigate-back", "navigate-to", "expand-target", "collapse-target",
    "invoke-target", "preview-target", "clear-focus", "no-op",
  ]);
  assert.deepEqual([...categories], [
    "selection", "focus", "navigation", "inspection", "activation", "visibility",
    "invocation", "neutral",
  ]);
  assert.deepEqual([...dispositions], ["resolved", "unresolved"]);
  assert.equal(Object.isFrozen(intentKinds), true);
  assert.equal(Object.isFrozen(categories), true);
  assert.equal(Object.isFrozen(rules), true);
  assert.equal(Object.isFrozen(registry), true);
});

test("8-9. valid accepted contract resolves deterministically", () => {
  const contract = accepted();
  const one = resolveDirectorRuntimeInteractionIntent(contract);
  const two = resolveDirectorRuntimeInteractionIntent(contract);
  assert.deepEqual(one, two);
  assert.equal(one.disposition, "resolved");
  assert.equal(isResolvedDirectorRuntimeInteractionIntent(one), true);
});

test("10-21. kind defaults resolve to canonical intents", () => {
  const expectations = {
    select: "select-target",
    focus: "focus-target",
    activate: "activate-target",
    inspect: "inspect-target",
    open: "open-target",
    close: "close-target",
    back: "navigate-back",
    navigate: "navigate-to",
    expand: "expand-target",
    collapse: "collapse-target",
    invoke: "invoke-target",
    hover: "preview-target",
  } as const;
  for (const [kind, intentKind] of Object.entries(expectations)) {
    const result = resolveKind(kind as keyof typeof expectations);
    assert.equal(result.disposition, "resolved");
    if (result.disposition === "resolved") {
      assert.equal(result.intent.kind, intentKind);
      assert.equal(result.intent.interactionKind, kind);
    }
  }
});

test("22. source-aware mapping works", () => {
  const timeline = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "activate", source: "timeline",
      target: { kind: "object", id: "factory-01" }, sequence: 2, scope: "scene",
    },
  }));
  assert.equal(timeline.disposition, "resolved");
  if (timeline.disposition === "resolved") {
    assert.equal(timeline.intent.kind, "navigate-to");
    assert.equal(timeline.matchedRuleId, "activate-timeline");
  }
  const liveLens = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "activate", source: "live-lens",
      target: { kind: "object", id: "factory-01" }, sequence: 3, scope: "workspace",
    },
  }));
  assert.equal(liveLens.disposition, "resolved");
  if (liveLens.disposition === "resolved") {
    assert.equal(liveLens.intent.kind, "navigate-to");
    assert.equal(liveLens.matchedRuleId, "activate-live-lens");
  }
});

test("23. target-aware mapping works", () => {
  const mode = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "select", source: "object",
      target: { kind: "mode", id: "analysis" }, sequence: 4, scope: "global",
    },
  }));
  assert.equal(mode.disposition, "resolved");
  if (mode.disposition === "resolved") {
    assert.equal(mode.intent.kind, "activate-target");
    assert.equal(mode.matchedRuleId, "select-mode");
  }
  const pack = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "select", source: "pack",
      target: { kind: "pack", id: "production-delay" }, sequence: 5, scope: "scene",
    },
  }));
  assert.equal(pack.disposition, "resolved");
  if (pack.disposition === "resolved") {
    assert.equal(pack.intent.kind, "open-target");
    assert.equal(pack.intent.target.id, "production-delay");
  }
  const clear = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "close", source: "system",
      target: { kind: "none", id: "" }, sequence: 6, scope: "scene",
    },
  }));
  assert.equal(clear.disposition, "resolved");
  if (clear.disposition === "resolved") {
    assert.equal(clear.intent.kind, "clear-focus");
  }
});

test("24. context-aware mapping works where explicitly defined", () => {
  const contextual = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "select", source: "object",
      target: { kind: "object", id: "factory-01" }, sequence: 17, scope: "scene",
    },
    context: { workspaceId: "goal", lensId: "objects", sceneId: "executive-main" },
  }));
  assert.equal(contextual.disposition, "resolved");
  if (contextual.disposition === "resolved") {
    assert.equal(contextual.matchedRuleId, "select-object-goal-workspace-objects-lens");
    assert.equal(contextual.specificity, 4);
    assert.equal(contextual.intent.kind, "select-target");
  }
  const withoutLens = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "select", source: "object",
      target: { kind: "object", id: "factory-01" }, sequence: 18, scope: "scene",
    },
    context: { workspaceId: "goal", sceneId: "executive-main" },
  }));
  assert.equal(withoutLens.disposition, "resolved");
  if (withoutLens.disposition === "resolved") {
    assert.equal(withoutLens.matchedRuleId, "kind-select");
    assert.equal(withoutLens.specificity, 1);
  }
});

test("25-26. generic fallback precedence and NoOp combination are deterministic", () => {
  const generic = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "expand", source: "explorer",
      target: { kind: "explorer-item", id: "item-1" }, sequence: 9, scope: "local",
    },
  }));
  assert.equal(generic.disposition, "resolved");
  if (generic.disposition === "resolved") {
    assert.equal(generic.intent.kind, "expand-target");
    assert.equal(generic.matchedRuleId, "kind-expand");
  }
  const noop = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "hover", source: "system",
      target: { kind: "none", id: "" }, sequence: 10, scope: "local",
    },
  }));
  assert.equal(noop.disposition, "resolved");
  if (noop.disposition === "resolved") {
    assert.equal(noop.intent.kind, "no-op");
    assert.equal(noop.matchedRuleId, "hover-system-none");
  }
});

test("27-28. conflicting equally-specific rules are detected; precedence is deterministic", () => {
  assert.deepEqual(findDirectorRuntimeInteractionIntentRuleConflicts(), []);
  const conflicting = [
    {
      ruleId: "a", interactionKind: "select", targetKind: "object",
      intentKind: "select-target", category: "selection",
    },
    {
      ruleId: "b", interactionKind: "select", targetKind: "object",
      intentKind: "focus-target", category: "focus",
    },
  ] as const satisfies readonly DirectorRuntimeInteractionIntentResolutionRule[];
  assert.deepEqual(findDirectorRuntimeInteractionIntentRuleConflicts(conflicting), ["a|b"]);

  const specific = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix", kind: "activate", source: "timeline",
      target: { kind: "timeline-entry", id: "t-1" }, sequence: 11, scope: "scene",
    },
  }));
  assert.equal(specific.disposition, "resolved");
  if (specific.disposition === "resolved") {
    assert.equal(specific.matchedRuleId, "activate-timeline-timeline-entry");
    assert.equal(specific.specificity, 3);
    assert.equal(specific.intent.kind, "navigate-to");
  }
});

test("29-31. resolved intent preserves request provenance, target identity, and scope", () => {
  const result = resolveDirectorRuntimeInteractionIntent(accepted({
    observation: {
      interactionId: "ix-17", kind: "select", source: "object",
      target: { kind: "object", id: "factory-01", parentId: "plant" },
      sequence: 17, scope: "scene", contextRef: "ctx-1",
    },
  }));
  assert.equal(result.disposition, "resolved");
  if (result.disposition === "resolved") {
    assert.equal(result.intent.requestId, "interaction-17");
    assert.equal(result.intent.target.id, "factory-01");
    assert.equal(result.intent.target.parentId, "plant");
    assert.equal(result.intent.scope, "scene");
    assert.equal(result.intent.source, "object");
    assert.equal(result.intent.contextRef, "ctx-1");
    assert.equal(result.intent.intentId, "interaction-17:intent:select-target:17");
  }
});

test("32-34. accepted contract, observation, and context are never mutated", () => {
  const contract = accepted();
  const before = JSON.stringify(contract);
  resolveDirectorRuntimeInteractionIntent(contract);
  resolveDirectorRuntimeInteractionIntent(contract);
  assert.equal(JSON.stringify(contract), before);
  assert.equal(Object.isFrozen(contract), true);
});

test("35. rejected DRI-4:2 contract cannot be normally resolved", () => {
  const rejected = rejectDirectorRuntimeInteractionContract({ reason: "invalid-request" });
  assert.throws(() => resolveDirectorRuntimeInteractionIntent(rejected), TypeError);
});

test("36-37. intent validation and guards work", () => {
  const resolved = resolveDirectorRuntimeInteractionIntent(accepted());
  assert.equal(isResolvedDirectorRuntimeInteractionIntent(resolved), true);
  if (resolved.disposition === "resolved") {
    assert.equal(validateDirectorRuntimeInteractionIntent(resolved.intent), true);
    assert.equal(isDirectorRuntimeInteractionIntent(resolved.intent), true);
    assert.equal(validateDirectorRuntimeInteractionIntent({
      ...resolved.intent, kind: "not-an-intent",
    }), false);
    assert.equal(validateDirectorRuntimeInteractionIntent({
      ...resolved.intent, category: "navigation",
    }), false);
  }
  const unresolved = {
    disposition: "unresolved" as const,
    reason: "ambiguous-semantic-mapping" as const,
    requestId: "r",
    matchedRuleIds: Object.freeze(["a", "b"]),
  };
  assert.equal(isUnresolvedDirectorRuntimeInteractionIntent(unresolved), true);
  assert.equal(isResolvedDirectorRuntimeInteractionIntent(unresolved), false);
});

test("38-39. registry counts match definitions and verification succeeds", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.intentKindCount, registry.intentKinds],
    [registry.intentCategoryCount, registry.intentCategories],
    [registry.resolutionDispositionCount, registry.resolutionDispositions],
    [registry.unresolvedReasonCount, registry.unresolvedReasons],
    [registry.resolutionRuleCount, registry.resolutionRules],
    [registry.publicTypeCount, registry.publicTypes],
    [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.equal(verifyDirectorRuntimeInteractionIntentResolution(), true);
  assert.equal(verifyDirectorRuntimeInteractionIntentResolution(), true);
});

test("40-50. architectural negatives: determinism, UI, focus, reaction, execution", () => {
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|crypto\.random|Date\.now|new Date)\b/);
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:globalThis|process\.env|localStorage)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|KeyboardEvent|HTMLElement|Object3D)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:focusedObjectId|selectedObjectId|previousFocus|focusStack|selectionHistory|selectionStack)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:reactionPlan|centerObject|dimNodes|highlightPath|updateAdvisor|changeLens|MoveCamera|GlowObject)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:mutateScene|executeScene|publishDirectorRuntimeScene|resolveDirectorSceneOrchestration)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /\b(?:CenterObject|DimOtherObjects|AnimatePath|OpenRightPanel|RenderChart)\b/);
});
