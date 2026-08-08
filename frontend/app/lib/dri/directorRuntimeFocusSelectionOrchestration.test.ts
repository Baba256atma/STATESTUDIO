import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  evaluateDirectorRuntimeInteractionContract,
  type AcceptedDirectorRuntimeInteractionContract,
} from "./directorRuntimeInteractionContracts.ts";
import {
  resolveDirectorRuntimeInteractionIntent,
  type DirectorRuntimeInteractionIntentKind,
  type ResolvedDirectorRuntimeInteractionIntent,
} from "./directorRuntimeInteractionIntentResolution.ts";
import {
  DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS as transitionKinds,
  DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES as transitionRules,
  areDirectorRuntimeFocusSelectionStatesEqual,
  areDirectorRuntimeInteractionTargetsEqual,
  createDirectorRuntimeFocusSelectionState,
  createEmptyDirectorRuntimeFocusSelectionState,
  didDirectorRuntimeFocusSelectionChange,
  directorRuntimeEmptyFocusSelectionState as emptyState,
  directorRuntimeFocusSelectionOrchestration as orchestration,
  directorRuntimeFocusSelectionOrchestrationRegistry as registry,
  findDirectorRuntimeFocusSelectionTransitionRuleConflicts,
  isDirectorRuntimeFocusSelectionState,
  isDirectorRuntimeFocusSelectionTransition,
  orchestrateDirectorRuntimeFocusSelection,
  verifyDirectorRuntimeFocusSelectionOrchestration,
  type DirectorRuntimeFocusSelectionState,
} from "./directorRuntimeFocusSelectionOrchestration.ts";

const source = readFileSync(
  new URL("./directorRuntimeFocusSelectionOrchestration.ts", import.meta.url),
  "utf8",
);

const warehouse = Object.freeze({ kind: "object" as const, id: "warehouse-01" });
const factory = Object.freeze({ kind: "object" as const, id: "factory-01" });

function acceptedFor(kind: string, target = factory, extra: {
  readonly source?: string;
  readonly targetKind?: string;
} = {}): AcceptedDirectorRuntimeInteractionContract {
  const interactionKind = ({
    "select-target": "select",
    "focus-target": "focus",
    "activate-target": "activate",
    "inspect-target": "inspect",
    "open-target": "open",
    "close-target": "close",
    "navigate-back": "back",
    "navigate-to": "navigate",
    "expand-target": "expand",
    "collapse-target": "collapse",
    "invoke-target": "invoke",
    "preview-target": "hover",
    "clear-focus": "close",
    "no-op": "hover",
  } as const)[kind as DirectorRuntimeInteractionIntentKind];

  const observationTarget = kind === "clear-focus" ||
    (kind === "select-target" && target.kind === "none") ||
    (kind === "no-op")
    ? (kind === "select-target" && target.kind === "none"
      ? target
      : kind === "clear-focus"
        ? { kind: "none" as const, id: "" }
        : { kind: "none" as const, id: "" })
    : target;

  const observationSource = kind === "no-op" || kind === "clear-focus"
    ? "system"
    : (extra.source ?? "object");

  const observationKind = kind === "clear-focus"
    ? "close"
    : kind === "no-op"
      ? "hover"
      : interactionKind;

  const result = evaluateDirectorRuntimeInteractionContract({
    requestId: "interaction-17",
    observation: {
      interactionId: "ix-1",
      kind: observationKind as never,
      source: observationSource as never,
      target: observationTarget as never,
      sequence: 17,
      scope: "scene",
    },
    context: { sceneId: "executive-main", workspaceId: "goal", lensId: "objects" },
  });
  assert.equal(result.disposition, "accepted");
  return result as AcceptedDirectorRuntimeInteractionContract;
}

function resolved(
  intentKind: DirectorRuntimeInteractionIntentKind,
  target = factory,
): ResolvedDirectorRuntimeInteractionIntent {
  if (intentKind === "clear-focus") {
    const resolution = resolveDirectorRuntimeInteractionIntent(acceptedFor("clear-focus"));
    assert.equal(resolution.disposition, "resolved");
    assert.equal(
      (resolution as ResolvedDirectorRuntimeInteractionIntent).intent.kind,
      "clear-focus",
    );
    return resolution as ResolvedDirectorRuntimeInteractionIntent;
  }
  if (intentKind === "no-op") {
    const resolution = resolveDirectorRuntimeInteractionIntent(acceptedFor("no-op"));
    assert.equal(resolution.disposition, "resolved");
    return resolution as ResolvedDirectorRuntimeInteractionIntent;
  }
  if (intentKind === "select-target" && target.kind === "none") {
    const resolution = resolveDirectorRuntimeInteractionIntent(
      acceptedFor("select-target", target),
    );
    assert.equal(resolution.disposition, "resolved");
    return resolution as ResolvedDirectorRuntimeInteractionIntent;
  }

  const resolution = resolveDirectorRuntimeInteractionIntent(acceptedFor(intentKind, target));
  assert.equal(resolution.disposition, "resolved");
  const resolvedIntent = resolution as ResolvedDirectorRuntimeInteractionIntent;
  // Target-aware DRI-4:3 rules may remap select/activate. Force exact intent kinds
  // for DRI-4:4 orchestration tests via a structurally valid resolved envelope.
  if (resolvedIntent.intent.kind !== intentKind) {
    const category = ({
      "select-target": "selection",
      "focus-target": "focus",
      "activate-target": "activation",
      "inspect-target": "inspection",
      "open-target": "visibility",
      "close-target": "visibility",
      "navigate-back": "navigation",
      "navigate-to": "navigation",
      "expand-target": "visibility",
      "collapse-target": "visibility",
      "invoke-target": "invocation",
      "preview-target": "inspection",
      "clear-focus": "focus",
      "no-op": "neutral",
    } as const)[intentKind];
    return Object.freeze({
      disposition: "resolved" as const,
      matchedRuleId: "test-forced",
      specificity: 1,
      intent: Object.freeze({
        ...resolvedIntent.intent,
        kind: intentKind,
        category,
        target: Object.freeze({ ...target }),
        intentId: `interaction-17:intent:${intentKind}:17`,
      }),
    });
  }
  return resolvedIntent;
}

function state(selected = warehouse, focused = warehouse): DirectorRuntimeFocusSelectionState {
  return createDirectorRuntimeFocusSelectionState({
    selectedTarget: selected,
    focusedTarget: focused,
  });
}

test("1-4. publishes exact DRI-4:4 identity, version, namespace, and DRI-4:3-only dependency", () => {
  assert.deepEqual({
    phase: orchestration.phase,
    name: orchestration.name,
    identity: orchestration.identity,
    namespace: orchestration.namespace,
    version: orchestration.version,
    layer: orchestration.layer,
    stage: orchestration.stage,
    immediateDependency: orchestration.immediateDependency,
  }, {
    phase: "DRI-4:4",
    name: "DirectorRuntimeFocusSelectionOrchestration",
    identity: "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration",
    namespace: "nexora.dri.interaction.orchestration.focus-selection",
    version: "4.4.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "FocusSelectionOrchestration",
    immediateDependency: "DRI-4:3/DirectorRuntimeInteractionIntentResolution",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeInteractionIntentResolution",
  ]);
  assert.doesNotMatch(source, /directorRuntimeInteractionContracts|directorRuntimeInteractionOrchestrationFoundation/);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration|directorRuntimeStateContext|directorRuntimeIntegration/);
});

test("5-6. reuses DRI-4:3 intents and publishes immutable transition vocabulary", () => {
  assert.doesNotMatch(source, /export const DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS/);
  assert.deepEqual([...transitionKinds], [
    "select", "focus", "select-and-focus", "clear-selection", "clear-focus", "clear-all", "preserve",
  ]);
  assert.equal(Object.isFrozen(transitionKinds), true);
  assert.equal(Object.isFrozen(transitionRules), true);
});

test("7-9. empty state, deterministic construction, and distinct focus/selection", () => {
  assert.deepEqual(emptyState, {
    focus: { focusedTarget: null },
    selection: { selectedTarget: null },
  });
  assert.deepEqual(createEmptyDirectorRuntimeFocusSelectionState(), emptyState);
  assert.notEqual(createEmptyDirectorRuntimeFocusSelectionState(), emptyState);
  const one = createDirectorRuntimeFocusSelectionState({
    focusedTarget: factory, selectedTarget: warehouse,
  });
  const two = createDirectorRuntimeFocusSelectionState({
    focusedTarget: { ...factory }, selectedTarget: { ...warehouse },
  });
  assert.deepEqual(one, two);
  assert.equal(one.focus.focusedTarget?.id, "factory-01");
  assert.equal(one.selection.selectedTarget?.id, "warehouse-01");
  assert.notEqual(one.focus.focusedTarget?.id, one.selection.selectedTarget?.id);
  assert.equal(isDirectorRuntimeFocusSelectionState(one), true);
});

test("10-13. select and focus update only their dimensions", () => {
  const current = state();
  const selected = orchestrateDirectorRuntimeFocusSelection({
    currentState: current, resolvedIntent: resolved("select-target", factory),
  });
  assert.equal(selected.transitionKind, "select");
  assert.equal(selected.changed, true);
  assert.equal(selected.nextState.selection.selectedTarget?.id, "factory-01");
  assert.equal(selected.nextState.focus.focusedTarget?.id, "warehouse-01");

  const focused = orchestrateDirectorRuntimeFocusSelection({
    currentState: current, resolvedIntent: resolved("focus-target", factory),
  });
  assert.equal(focused.transitionKind, "focus");
  assert.equal(focused.changed, true);
  assert.equal(focused.nextState.focus.focusedTarget?.id, "factory-01");
  assert.equal(focused.nextState.selection.selectedTarget?.id, "warehouse-01");
});

test("14. explicit combined activate transition updates both", () => {
  const transition = orchestrateDirectorRuntimeFocusSelection({
    currentState: state(), resolvedIntent: resolved("activate-target", factory),
  });
  assert.equal(transition.transitionKind, "select-and-focus");
  assert.equal(transition.changed, true);
  assert.equal(transition.nextState.focus.focusedTarget?.id, "factory-01");
  assert.equal(transition.nextState.selection.selectedTarget?.id, "factory-01");
});

test("15-16. clear-focus and clear-selection behave correctly", () => {
  const clearFocus = orchestrateDirectorRuntimeFocusSelection({
    currentState: state(), resolvedIntent: resolved("clear-focus"),
  });
  assert.equal(clearFocus.transitionKind, "clear-focus");
  assert.equal(clearFocus.nextState.focus.focusedTarget, null);
  assert.equal(clearFocus.nextState.selection.selectedTarget?.id, "warehouse-01");

  const clearSelection = orchestrateDirectorRuntimeFocusSelection({
    currentState: state(),
    resolvedIntent: resolved("select-target", { kind: "none", id: "" }),
  });
  assert.equal(clearSelection.transitionKind, "clear-selection");
  assert.equal(clearSelection.nextState.selection.selectedTarget, null);
  assert.equal(clearSelection.nextState.focus.focusedTarget?.id, "warehouse-01");
});

test("17-18. preserve transition leaves state unchanged for non-focus intents", () => {
  const current = state();
  for (const kind of [
    "inspect-target", "open-target", "close-target", "navigate-back", "navigate-to",
    "expand-target", "collapse-target", "invoke-target", "preview-target", "no-op",
  ] as const) {
    const transition = orchestrateDirectorRuntimeFocusSelection({
      currentState: current, resolvedIntent: resolved(kind, factory),
    });
    assert.equal(transition.transitionKind, "preserve", kind);
    assert.equal(transition.changed, false, kind);
    assert.equal(
      areDirectorRuntimeFocusSelectionStatesEqual(transition.previousState, transition.nextState),
      true,
      kind,
    );
  }
});

test("19-22. same-target transitions are idempotent with changed=false", () => {
  const current = createDirectorRuntimeFocusSelectionState({
    focusedTarget: factory, selectedTarget: factory,
  });
  const focusAgain = orchestrateDirectorRuntimeFocusSelection({
    currentState: current, resolvedIntent: resolved("focus-target", factory),
  });
  assert.equal(focusAgain.transitionKind, "focus");
  assert.equal(focusAgain.changed, false);
  assert.equal(didDirectorRuntimeFocusSelectionChange(focusAgain), false);

  const selectAgain = orchestrateDirectorRuntimeFocusSelection({
    currentState: current, resolvedIntent: resolved("select-target", factory),
  });
  assert.equal(selectAgain.transitionKind, "select");
  assert.equal(selectAgain.changed, false);

  const changed = orchestrateDirectorRuntimeFocusSelection({
    currentState: current, resolvedIntent: resolved("focus-target", warehouse),
  });
  assert.equal(changed.changed, true);
});

test("23-26. target and state equality are structural and deterministic", () => {
  assert.equal(
    areDirectorRuntimeInteractionTargetsEqual({ ...factory }, { kind: "object", id: "factory-01" }),
    true,
  );
  assert.equal(
    areDirectorRuntimeInteractionTargetsEqual(factory, { kind: "object", id: "warehouse-01" }),
    false,
  );
  assert.equal(
    areDirectorRuntimeInteractionTargetsEqual(factory, { kind: "pack", id: "factory-01" }),
    false,
  );
  assert.equal(areDirectorRuntimeFocusSelectionStatesEqual(state(), state()), true);
  assert.equal(
    areDirectorRuntimeFocusSelectionStatesEqual(state(), state(factory, factory)),
    false,
  );
});

test("27-30. transition preserves previous/next state and intent/request provenance", () => {
  const current = state();
  const transition = orchestrateDirectorRuntimeFocusSelection({
    currentState: current, resolvedIntent: resolved("focus-target", factory),
  });
  assert.equal(transition.previousState.selection.selectedTarget?.id, "warehouse-01");
  assert.equal(transition.previousState.focus.focusedTarget?.id, "warehouse-01");
  assert.equal(transition.nextState.focus.focusedTarget?.id, "factory-01");
  assert.equal(transition.intentId.includes("focus-target"), true);
  assert.equal(transition.requestId, "interaction-17");
  assert.equal(transition.target.id, "factory-01");
  assert.equal(isDirectorRuntimeFocusSelectionTransition(transition), true);
  assert.equal(Object.isFrozen(transition), true);
  assert.equal(Object.isFrozen(transition.nextState), true);
});

test("31-35. inputs are not mutated; transition and rules are immutable", () => {
  const current = state();
  const intent = resolved("select-target", factory);
  const beforeState = JSON.stringify(current);
  const beforeIntent = JSON.stringify(intent);
  const target = { ...factory };
  const beforeTarget = JSON.stringify(target);
  orchestrateDirectorRuntimeFocusSelection({ currentState: current, resolvedIntent: intent });
  assert.equal(JSON.stringify(current), beforeState);
  assert.equal(JSON.stringify(intent), beforeIntent);
  assert.equal(JSON.stringify(target), beforeTarget);
  assert.equal(Object.isFrozen(transitionRules), true);
});

test("36-38. transition rules cover intents, have no conflicts, reject unresolved", () => {
  assert.deepEqual(findDirectorRuntimeFocusSelectionTransitionRuleConflicts(), []);
  assert.equal(transitionRules.length >= 14, true);
  const unresolved = Object.freeze({
    disposition: "unresolved" as const,
    reason: "unsupported-combination" as const,
    requestId: "interaction-17",
    matchedRuleIds: Object.freeze([] as string[]),
  });
  assert.throws(() => orchestrateDirectorRuntimeFocusSelection({
    currentState: state(),
    resolvedIntent: unresolved as never,
  }), TypeError);
});

test("39-40. registry counts match definitions and verification succeeds", () => {
  assert.equal(registry.transitionKindCount, registry.transitionKinds.length);
  assert.equal(registry.transitionRuleCount, registry.transitionRules.length);
  assert.equal(registry.focusStateContractCount, registry.focusStateContracts.length);
  assert.equal(registry.selectionStateContractCount, registry.selectionStateContracts.length);
  assert.equal(registry.combinedStateContractCount, registry.combinedStateContracts.length);
  assert.equal(registry.publicApiCount, registry.publicApis.length);
  assert.equal(verifyDirectorRuntimeFocusSelectionOrchestration(), true);
  assert.equal(verifyDirectorRuntimeFocusSelectionOrchestration(), true);
});

test("41-52. architectural negatives: purity, UI, scene, reaction, advisor", () => {
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|crypto\.random|Date\.now|new Date)\b/);
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:globalThis|process\.env|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|KeyboardEvent|HTMLElement|Object3D)\b/,
  );
  assert.doesNotMatch(source, /\b(?:getObjectById|lookupScene|querySelector|scene\.get|findObject)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:mutateScene|executeScene|resolveDirectorSceneOrchestration|publishDirectorRuntimeScene)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:reactionPlan|centerTarget|dimUnrelated|highlightPath|moveCamera|GlowObject|AnimatePath)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:updateAdvisor|updateInsight|AdvisorContent|InsightContent|recommendation)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:useState|setState|dispatch|createContext|zustand|redux|useRef|router\.push)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
