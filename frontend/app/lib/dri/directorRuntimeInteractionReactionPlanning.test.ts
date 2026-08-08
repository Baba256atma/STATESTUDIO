import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  evaluateDirectorRuntimeInteractionContract,
} from "./directorRuntimeInteractionContracts.ts";
import {
  resolveDirectorRuntimeInteractionIntent,
  type DirectorRuntimeInteractionIntentKind,
  type ResolvedDirectorRuntimeInteractionIntent,
} from "./directorRuntimeInteractionIntentResolution.ts";
import {
  createDirectorRuntimeFocusSelectionState,
  orchestrateDirectorRuntimeFocusSelection,
  type DirectorRuntimeFocusSelectionTransition,
} from "./directorRuntimeFocusSelectionOrchestration.ts";
import {
  DIRECTOR_RUNTIME_REACTION_KINDS as reactionKinds,
  DIRECTOR_RUNTIME_REACTION_PRIORITIES as priorities,
  DIRECTOR_RUNTIME_REACTION_SURFACES as surfaces,
  DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES as planningRules,
  createDirectorRuntimeInteractionReactionPlan,
  createDirectorRuntimeReactionDirective,
  directorRuntimeInteractionReactionPlanning as planning,
  directorRuntimeInteractionReactionPlanningRegistry as registry,
  findDirectorRuntimeInteractionReactionPlanningRuleConflicts,
  findDirectorRuntimeReactionDirectiveConflicts,
  hasDirectorRuntimeReactionWork,
  isDirectorRuntimeInteractionReactionPlan,
  planDirectorRuntimeInteractionReaction,
  verifyDirectorRuntimeInteractionReactionPlanning,
} from "./directorRuntimeInteractionReactionPlanning.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionReactionPlanning.ts", import.meta.url),
  "utf8",
);

const warehouse = Object.freeze({ kind: "object" as const, id: "warehouse-01" });
const factory = Object.freeze({ kind: "object" as const, id: "factory-01" });

function resolved(
  intentKind: DirectorRuntimeInteractionIntentKind,
  target = factory,
): ResolvedDirectorRuntimeInteractionIntent {
  const interactionByIntent = {
    "select-target": { kind: "select", source: "object", target },
    "focus-target": { kind: "focus", source: "object", target },
    "activate-target": { kind: "activate", source: "object", target },
    "inspect-target": { kind: "inspect", source: "object", target },
    "open-target": { kind: "open", source: "object", target },
    "close-target": { kind: "close", source: "object", target },
    "navigate-back": { kind: "back", source: "object", target },
    "navigate-to": { kind: "navigate", source: "object", target },
    "expand-target": { kind: "expand", source: "object", target },
    "collapse-target": { kind: "collapse", source: "object", target },
    "invoke-target": { kind: "invoke", source: "object", target },
    "preview-target": { kind: "hover", source: "object", target },
    "clear-focus": { kind: "close", source: "system", target: { kind: "none" as const, id: "" } },
    "no-op": { kind: "hover", source: "system", target: { kind: "none" as const, id: "" } },
  } as const;
  const observation = interactionByIntent[intentKind];
  const accepted = evaluateDirectorRuntimeInteractionContract({
    requestId: "interaction-17",
    observation: {
      interactionId: "ix-1",
      kind: observation.kind as never,
      source: observation.source as never,
      target: observation.target as never,
      sequence: 17,
      scope: "scene",
    },
    context: { sceneId: "executive-main", workspaceId: "workspace-1" },
  });
  assert.equal(accepted.disposition, "accepted");
  const resolution = resolveDirectorRuntimeInteractionIntent(accepted);
  assert.equal(resolution.disposition, "resolved");
  const value = resolution as ResolvedDirectorRuntimeInteractionIntent;
  if (value.intent.kind === intentKind) return value;
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
      ...value.intent,
      kind: intentKind,
      category,
      target: Object.freeze({ ...target }),
      intentId: `interaction-17:intent:${intentKind}:17`,
    }),
  });
}

function transitionFor(
  intentKind: DirectorRuntimeInteractionIntentKind,
  options: {
    readonly selected?: typeof warehouse;
    readonly focused?: typeof warehouse;
    readonly target?: typeof factory;
  } = {},
): DirectorRuntimeFocusSelectionTransition {
  return orchestrateDirectorRuntimeFocusSelection({
    currentState: createDirectorRuntimeFocusSelectionState({
      selectedTarget: options.selected ?? warehouse,
      focusedTarget: options.focused ?? warehouse,
    }),
    resolvedIntent: resolved(intentKind, options.target ?? factory),
  });
}

test("1-5. publishes exact DRI-4:5 identity and reuses DRI-4:4 only", () => {
  assert.deepEqual({
    phase: planning.phase,
    name: planning.name,
    identity: planning.identity,
    namespace: planning.namespace,
    version: planning.version,
    layer: planning.layer,
    stage: planning.stage,
    immediateDependency: planning.immediateDependency,
  }, {
    phase: "DRI-4:5",
    name: "DirectorRuntimeInteractionReactionPlanning",
    identity: "DRI-4:5/DirectorRuntimeInteractionReactionPlanning",
    namespace: "nexora.dri.interaction.orchestration.reaction-planning",
    version: "4.5.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "ReactionPlanning",
    immediateDependency: "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeFocusSelectionOrchestration",
  ]);
  assert.doesNotMatch(source, /export const DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS/);
  assert.doesNotMatch(source, /directorRuntimeInteractionIntentResolution|directorRuntimeInteractionContracts|directorRuntimeInteractionOrchestrationFoundation/);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration/);
});

test("6-8. reaction surface, kind, and priority vocabularies are immutable", () => {
  assert.deepEqual([...surfaces], [
    "scene", "advisor", "insight", "live-lens", "explorer", "timeline", "mode", "attention", "none",
  ]);
  assert.deepEqual([...reactionKinds], [
    "emphasize-target", "deemphasize-non-targets", "reveal-related", "preserve", "refresh-context",
    "align-context", "clear-context", "open-context", "close-context", "highlight-path",
    "show-related-packs", "show-related-metrics", "no-op",
  ]);
  assert.deepEqual([...priorities], ["critical", "primary", "secondary", "supporting"]);
  assert.equal(Object.isFrozen(surfaces), true);
  assert.equal(Object.isFrozen(reactionKinds), true);
  assert.equal(Object.isFrozen(priorities), true);
  assert.equal(Object.isFrozen(planningRules), true);
});

test("9-10. reaction-plan construction is deterministic", () => {
  const transition = transitionFor("focus-target");
  const one = planDirectorRuntimeInteractionReaction(transition);
  const two = planDirectorRuntimeInteractionReaction(transition);
  assert.deepEqual(one, two);
  assert.equal(one.planId, `${transition.intentId}:reaction-plan`);
  assert.equal(isDirectorRuntimeInteractionReactionPlan(one), true);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.reactions), true);
});

test("11. focus change produces canonical focus reactions", () => {
  const plan = planDirectorRuntimeInteractionReaction(transitionFor("focus-target"));
  assert.equal(plan.changed, true);
  assert.equal(hasDirectorRuntimeReactionWork(plan), true);
  const kinds = plan.reactions.map((reaction) => `${reaction.surface}:${reaction.kind}`);
  assert.ok(kinds.includes("attention:emphasize-target"));
  assert.ok(kinds.includes("scene:deemphasize-non-targets"));
  assert.ok(kinds.includes("scene:reveal-related"));
  assert.ok(kinds.includes("attention:highlight-path"));
  assert.ok(kinds.includes("advisor:refresh-context"));
  assert.ok(kinds.includes("insight:refresh-context"));
  assert.ok(kinds.includes("live-lens:align-context"));
  assert.equal(plan.reactions[0]?.surface, "attention");
  assert.equal(plan.reactions[0]?.kind, "emphasize-target");
});

test("12. selection change produces canonical selection reactions", () => {
  const plan = planDirectorRuntimeInteractionReaction(transitionFor("select-target"));
  assert.equal(plan.transitionKind, "select");
  assert.equal(plan.changed, true);
  const kinds = plan.reactions.map((reaction) => `${reaction.surface}:${reaction.kind}`);
  assert.ok(kinds.includes("advisor:refresh-context"));
  assert.ok(kinds.includes("insight:show-related-metrics"));
  assert.ok(kinds.includes("explorer:show-related-packs"));
  assert.equal(kinds.includes("attention:emphasize-target"), false);
});

test("13-14. combined select/focus plan is coherent and deduplicated", () => {
  const plan = planDirectorRuntimeInteractionReaction(transitionFor("activate-target"));
  assert.equal(plan.transitionKind, "select-and-focus");
  const keys = plan.reactions.map((reaction) =>
    `${reaction.surface}|${reaction.kind}|${reaction.target?.id ?? "null"}`);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(keys.includes("attention|emphasize-target|factory-01"));
  assert.ok(keys.includes("explorer|show-related-packs|factory-01"));
  assert.equal(keys.filter((key) => key.startsWith("attention|emphasize-target")).length, 1);
});

test("15-17. preserve and idempotent transitions produce minimal no-op plans", () => {
  const preserve = planDirectorRuntimeInteractionReaction(transitionFor("no-op"));
  assert.equal(preserve.transitionKind, "preserve");
  assert.equal(preserve.changed, false);
  assert.equal(preserve.hasWork, false);
  assert.deepEqual(preserve.reactions.map(({ kind }) => kind), ["no-op"]);

  const sameFocus = planDirectorRuntimeInteractionReaction(transitionFor("focus-target", {
    focused: factory, selected: warehouse, target: factory,
  }));
  assert.equal(sameFocus.changed, false);
  assert.equal(sameFocus.hasWork, false);
  assert.deepEqual(sameFocus.reactions.map(({ kind }) => kind), ["no-op"]);

  const sameSelect = planDirectorRuntimeInteractionReaction(transitionFor("select-target", {
    focused: warehouse, selected: factory, target: factory,
  }));
  assert.equal(sameSelect.changed, false);
  assert.equal(sameSelect.hasWork, false);
});

test("18-24. reactions preserve target identity and remain semantic by surface", () => {
  const plan = planDirectorRuntimeInteractionReaction(transitionFor("focus-target"));
  for (const reaction of plan.reactions) {
    if (reaction.kind !== "no-op") {
      assert.equal(reaction.target?.id, "factory-01");
      assert.equal(reaction.target?.kind, "object");
    }
  }
  assert.ok(plan.reactions.some((reaction) => reaction.surface === "advisor"));
  assert.ok(plan.reactions.some((reaction) => reaction.surface === "insight"));
  assert.ok(plan.reactions.some((reaction) => reaction.surface === "live-lens"));
  assert.ok(plan.reactions.some((reaction) => reaction.surface === "explorer"));
  assert.doesNotMatch(JSON.stringify(plan), /setOpacity|animateCamera|setCSSClass|zoomTo|fadeIn/);
  assert.ok(plan.reactions.some((reaction) => reaction.kind === "highlight-path"));
  assert.ok(plan.reactions.some((reaction) => reaction.kind === "reveal-related"));
});

test("25-29. no rendering, graph traversal, or runtime lookup mechanics", () => {
  assert.doesNotMatch(source, /\b(?:opacity|easing|durationMs|camera\.|translateX|fadeIn|spring)\b/i);
  assert.doesNotMatch(source, /\b(?:traverse|getObjectById|lookupScene|querySelector|findRelated|walkGraph)\b/);
  assert.doesNotMatch(source, /\b(?:fetch|localStorage|indexedDB|THREE|Object3D|Raycaster)\b/);
});

test("30-34. ordering, dedupe, conflicts, and specificity are deterministic", () => {
  const plan = planDirectorRuntimeInteractionReaction(transitionFor("focus-target"));
  const ranks = { critical: 1, primary: 2, secondary: 3, supporting: 4 } as const;
  for (let index = 1; index < plan.reactions.length; index += 1) {
    assert.ok(
      ranks[plan.reactions[index - 1]!.priority] <= ranks[plan.reactions[index]!.priority],
    );
  }
  const duplicate = createDirectorRuntimeInteractionReactionPlan({
    planId: "p",
    intentId: "i",
    requestId: "r",
    intentKind: "focus-target",
    transitionKind: "focus",
    changed: true,
    reactions: [
      createDirectorRuntimeReactionDirective({
        surface: "advisor", kind: "refresh-context", target: factory, priority: "secondary",
      }),
      createDirectorRuntimeReactionDirective({
        surface: "advisor", kind: "refresh-context", target: { ...factory }, priority: "secondary",
      }),
    ],
  });
  assert.equal(duplicate.reactions.length, 1);

  const conflicts = findDirectorRuntimeReactionDirectiveConflicts([
    createDirectorRuntimeReactionDirective({
      surface: "scene", kind: "emphasize-target", target: factory, priority: "primary",
    }),
    createDirectorRuntimeReactionDirective({
      surface: "scene", kind: "clear-context", target: factory, priority: "primary",
    }),
  ]);
  assert.deepEqual(conflicts, ["scene:emphasize-target|clear-context"]);
  assert.deepEqual(findDirectorRuntimeInteractionReactionPlanningRuleConflicts(), []);

  const combined = planDirectorRuntimeInteractionReaction(transitionFor("activate-target"));
  assert.equal(combined.reactions.some((reaction) => reaction.reason.includes("combined")), true);
});

test("35-39. plan identity and provenance are deterministic; transition not mutated", () => {
  const transition = transitionFor("focus-target");
  const before = JSON.stringify(transition);
  const plan = planDirectorRuntimeInteractionReaction(transition);
  assert.equal(plan.planId, "interaction-17:intent:focus-target:17:reaction-plan");
  assert.equal(plan.intentId, transition.intentId);
  assert.equal(plan.requestId, transition.requestId);
  assert.equal(plan.intentKind, "focus-target");
  assert.equal(JSON.stringify(transition), before);
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|Date\.now|new Date)\b/);
});

test("40-45. previous/next state and targets are not mutated; plan/directives immutable", () => {
  const transition = transitionFor("select-target");
  const beforePrevious = JSON.stringify(transition.previousState);
  const beforeNext = JSON.stringify(transition.nextState);
  const beforeTarget = JSON.stringify(transition.target);
  const plan = planDirectorRuntimeInteractionReaction(transition);
  assert.equal(JSON.stringify(transition.previousState), beforePrevious);
  assert.equal(JSON.stringify(transition.nextState), beforeNext);
  assert.equal(JSON.stringify(transition.target), beforeTarget);
  assert.equal(Object.isFrozen(plan), true);
  assert.equal(Object.isFrozen(plan.reactions[0]), true);
});

test("46-47. registry counts match and verification succeeds", () => {
  assert.equal(registry.reactionSurfaceCount, registry.reactionSurfaces.length);
  assert.equal(registry.reactionKindCount, registry.reactionKinds.length);
  assert.equal(registry.priorityCount, registry.priorities.length);
  assert.equal(registry.planningRuleCount, registry.planningRules.length);
  assert.equal(registry.directiveContractCount, registry.directiveContracts.length);
  assert.equal(registry.planContractCount, registry.planContracts.length);
  assert.equal(registry.publicApiCount, registry.publicApis.length);
  assert.equal(verifyDirectorRuntimeInteractionReactionPlanning(), true);
  assert.equal(verifyDirectorRuntimeInteractionReactionPlanning(), true);
});

test("48-58. architectural negatives: execution, UI, scene, advisor content, animation", () => {
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:globalThis|process\.env)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|HTMLElement|Object3D|Mesh|Camera|Vector3)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:resolveDirectorSceneOrchestration|publishDirectorRuntimeScene|mutateScene|executeScene)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:applyReaction|executeReaction|dispatchReaction|updateAdvisor|generateSummary|recommend)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:durationMs|easingCurve|frameTiming|springConfig|opacity\s*[:=]|camera\.position)\b/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:approveDecision|rejectScenario|allocateBudget|escalateRisk|pauseProject)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(planning.philosophy, "reaction-plan-is-not-execution");
});
