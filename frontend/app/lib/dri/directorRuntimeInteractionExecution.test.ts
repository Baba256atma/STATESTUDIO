import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  evaluateDirectorRuntimeInteractionContract,
} from "./directorRuntimeInteractionContracts.ts";
import {
  resolveDirectorRuntimeInteractionIntent,
} from "./directorRuntimeInteractionIntentResolution.ts";
import {
  createDirectorRuntimeFocusSelectionState,
  orchestrateDirectorRuntimeFocusSelection,
} from "./directorRuntimeFocusSelectionOrchestration.ts";
import {
  createDirectorRuntimeInteractionReactionPlan,
  createDirectorRuntimeReactionDirective,
  planDirectorRuntimeInteractionReaction,
  type DirectorRuntimeInteractionReactionPlan,
} from "./directorRuntimeInteractionReactionPlanning.ts";
import {
  DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES as directiveStatuses,
  DIRECTOR_RUNTIME_EXECUTION_REASONS as executionReasons,
  DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES as executionStatuses,
  createDirectorRuntimeInteractionExecutionRequest,
  deriveDirectorRuntimeInteractionExecutionStatus,
  directorRuntimeInteractionExecution as execution,
  directorRuntimeInteractionExecutionRegistry as registry,
  executeDirectorRuntimeInteraction,
  executeDirectorRuntimeReactionDirective,
  hasDirectorRuntimeExecutionWork,
  isCompletedDirectorRuntimeInteractionExecution,
  isDirectorRuntimeInteractionExecutionCapabilitySupported,
  isDirectorRuntimeInteractionExecutionResult,
  verifyDirectorRuntimeInteractionExecution,
} from "./directorRuntimeInteractionExecution.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionExecution.ts", import.meta.url),
  "utf8",
);

const factory = Object.freeze({ kind: "object" as const, id: "factory-01" });
const warehouse = Object.freeze({ kind: "object" as const, id: "warehouse-01" });

function focusPlan(): DirectorRuntimeInteractionReactionPlan {
  const accepted = evaluateDirectorRuntimeInteractionContract({
    requestId: "interaction-17",
    observation: {
      interactionId: "ix-1",
      kind: "focus",
      source: "object",
      target: factory,
      sequence: 17,
      scope: "scene",
    },
    context: { sceneId: "executive-main" },
  });
  assert.equal(accepted.disposition, "accepted");
  const resolved = resolveDirectorRuntimeInteractionIntent(accepted);
  assert.equal(resolved.disposition, "resolved");
  const transition = orchestrateDirectorRuntimeFocusSelection({
    currentState: createDirectorRuntimeFocusSelectionState({
      focusedTarget: warehouse,
      selectedTarget: warehouse,
    }),
    resolvedIntent: resolved as never,
  });
  return planDirectorRuntimeInteractionReaction(transition);
}

function noOpPlan(): DirectorRuntimeInteractionReactionPlan {
  const accepted = evaluateDirectorRuntimeInteractionContract({
    requestId: "interaction-17",
    observation: {
      interactionId: "ix-1",
      kind: "hover",
      source: "system",
      target: { kind: "none", id: "" },
      sequence: 1,
      scope: "local",
    },
  });
  assert.equal(accepted.disposition, "accepted");
  const resolved = resolveDirectorRuntimeInteractionIntent(accepted);
  assert.equal(resolved.disposition, "resolved");
  const transition = orchestrateDirectorRuntimeFocusSelection({
    currentState: createDirectorRuntimeFocusSelectionState(),
    resolvedIntent: resolved as never,
  });
  return planDirectorRuntimeInteractionReaction(transition);
}

test("1-5. publishes exact DRI-4:6 identity and reuses DRI-4:5 only", () => {
  assert.deepEqual({
    phase: execution.phase,
    name: execution.name,
    identity: execution.identity,
    namespace: execution.namespace,
    version: execution.version,
    layer: execution.layer,
    stage: execution.stage,
    immediateDependency: execution.immediateDependency,
  }, {
    phase: "DRI-4:6",
    name: "DirectorRuntimeInteractionExecution",
    identity: "DRI-4:6/DirectorRuntimeInteractionExecution",
    namespace: "nexora.dri.interaction.orchestration.execution",
    version: "4.6.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "InteractionExecution",
    immediateDependency: "DRI-4:5/DirectorRuntimeInteractionReactionPlanning",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeInteractionReactionPlanning",
  ]);
  assert.doesNotMatch(source, /export const DIRECTOR_RUNTIME_REACTION_SURFACES/);
  assert.doesNotMatch(source, /export const DIRECTOR_RUNTIME_REACTION_KINDS/);
  assert.doesNotMatch(
    source,
    /directorRuntimeFocusSelectionOrchestration|directorRuntimeInteractionIntentResolution|directorRuntimeInteractionContracts|directorRuntimeInteractionOrchestrationFoundation/,
  );
});

test("6-8. execution, directive-status, and reason vocabularies are immutable", () => {
  assert.deepEqual([...executionStatuses], ["completed", "partial", "skipped", "rejected"]);
  assert.deepEqual([...directiveStatuses], ["executed", "skipped", "rejected", "unsupported"]);
  assert.deepEqual([...executionReasons], [
    "no-op", "unsupported-surface", "unsupported-reaction", "invalid-directive",
    "execution-conflict", "adapter-unavailable",
  ]);
  assert.equal(Object.isFrozen(executionStatuses), true);
  assert.equal(Object.isFrozen(directiveStatuses), true);
  assert.equal(Object.isFrozen(executionReasons), true);
  assert.equal(Object.isFrozen(capabilities), true);
});

test("9-12. request/execution identity and ordering are deterministic", () => {
  const plan = focusPlan();
  const request = createDirectorRuntimeInteractionExecutionRequest({ reactionPlan: plan });
  assert.equal(request.executionId, `${plan.planId}:execution`);
  const one = executeDirectorRuntimeInteraction(request);
  const two = executeDirectorRuntimeInteraction(request);
  assert.deepEqual(one, two);
  assert.deepEqual(
    one.directives.map(({ directive }) => `${directive.surface}:${directive.kind}`),
    plan.reactions.map((directive) => `${directive.surface}:${directive.kind}`),
  );
  assert.equal(Object.isFrozen(one), true);
});

test("13-14. executable directives execute; no-op skips", () => {
  const completed = executeDirectorRuntimeInteraction({ reactionPlan: focusPlan() });
  assert.equal(completed.status, "completed");
  assert.ok(completed.executedCount > 0);
  assert.equal(completed.unsupportedCount, 0);
  assert.equal(isCompletedDirectorRuntimeInteractionExecution(completed), true);
  assert.equal(hasDirectorRuntimeExecutionWork(completed), true);

  const skipped = executeDirectorRuntimeInteraction({ reactionPlan: noOpPlan() });
  assert.equal(skipped.status, "skipped");
  assert.equal(skipped.executedCount, 0);
  assert.equal(skipped.skippedCount, 1);
  assert.equal(skipped.directives[0]?.reason, "no-op");
});

test("15-17. unsupported and invalid directives produce deterministic outcomes", () => {
  const unsupportedPlan = createDirectorRuntimeInteractionReactionPlan({
    planId: "plan-unsupported",
    intentId: "intent-1",
    requestId: "request-1",
    intentKind: "invoke-target",
    transitionKind: "preserve",
    changed: false,
    reactions: [
      createDirectorRuntimeReactionDirective({
        surface: "mode", kind: "open-context", target: factory, priority: "primary",
      }),
    ],
  });
  const unsupported = executeDirectorRuntimeInteraction({ reactionPlan: unsupportedPlan });
  assert.equal(unsupported.directives[0]?.status, "unsupported");
  assert.equal(unsupported.directives[0]?.reason, "unsupported-reaction");
  assert.equal(unsupported.status, "partial");
  assert.equal(unsupported.unsupportedCount, 1);

  const invalid = executeDirectorRuntimeReactionDirective({
    surface: "scene",
    kind: "emphasize-target",
    target: factory,
    relatedTargetIds: [],
    priority: "primary",
    reason: "x",
  } as never);
  // Valid shape executes; truly invalid rejected:
  const rejected = executeDirectorRuntimeReactionDirective({
    surface: "not-a-surface",
    kind: "emphasize-target",
    target: null,
    relatedTargetIds: [],
    priority: "primary",
    reason: "bad",
  } as never);
  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.reason, "invalid-directive");
  assert.equal(invalid.status, "unsupported");
});

test("18-22. overall status derivation covers completed/partial/skipped/rejected", () => {
  assert.equal(deriveDirectorRuntimeInteractionExecutionStatus([
    { directiveIndex: 0, status: "executed", reason: null, directive: focusPlan().reactions[0]! },
  ]), "completed");
  assert.equal(deriveDirectorRuntimeInteractionExecutionStatus([
    { directiveIndex: 0, status: "executed", reason: null, directive: focusPlan().reactions[0]! },
    {
      directiveIndex: 1, status: "unsupported", reason: "unsupported-reaction",
      directive: createDirectorRuntimeReactionDirective({
        surface: "mode", kind: "open-context", target: factory,
      }),
    },
  ]), "partial");
  assert.equal(deriveDirectorRuntimeInteractionExecutionStatus([
    {
      directiveIndex: 0, status: "skipped", reason: "no-op",
      directive: createDirectorRuntimeReactionDirective({
        surface: "none", kind: "no-op",
      }),
    },
  ]), "skipped");
  assert.equal(deriveDirectorRuntimeInteractionExecutionStatus([
    {
      directiveIndex: 0, status: "rejected", reason: "invalid-directive",
      directive: createDirectorRuntimeReactionDirective({
        surface: "none", kind: "no-op",
      }),
    },
  ]), "rejected");

  const invalidRequest = executeDirectorRuntimeInteraction({
    reactionPlan: { planId: "" } as never,
  });
  assert.equal(invalidRequest.status, "rejected");
});

test("23-27. counts derive from directive results", () => {
  const mixedPlan = createDirectorRuntimeInteractionReactionPlan({
    planId: "plan-mixed",
    intentId: "intent-mixed",
    requestId: "request-mixed",
    intentKind: "focus-target",
    transitionKind: "focus",
    changed: true,
    reactions: [
      createDirectorRuntimeReactionDirective({
        surface: "attention", kind: "emphasize-target", target: factory, priority: "critical",
      }),
      createDirectorRuntimeReactionDirective({
        surface: "none", kind: "no-op", priority: "supporting",
      }),
      createDirectorRuntimeReactionDirective({
        surface: "timeline", kind: "show-related-metrics", target: factory, priority: "secondary",
      }),
    ],
  });
  const result = executeDirectorRuntimeInteraction({ reactionPlan: mixedPlan });
  assert.equal(result.executedCount, 1);
  assert.equal(result.skippedCount, 1);
  assert.equal(result.unsupportedCount, 1);
  assert.equal(result.rejectedCount, 0);
  assert.equal(result.status, "partial");
  assert.equal(
    result.executedCount + result.skippedCount + result.unsupportedCount + result.rejectedCount,
    result.directives.length,
  );
});

test("28-29. provenance preserves plan/intent/request identities", () => {
  const plan = focusPlan();
  const result = executeDirectorRuntimeInteraction({ reactionPlan: plan });
  assert.equal(result.planId, plan.planId);
  assert.equal(result.intentId, plan.intentId);
  assert.equal(result.requestId, plan.requestId);
  assert.equal(result.executionId, `${plan.planId}:execution`);
});

test("30-34. inputs are not mutated; result and capabilities are immutable", () => {
  const plan = focusPlan();
  const beforePlan = JSON.stringify(plan);
  const beforeReactions = JSON.stringify(plan.reactions);
  const beforeTarget = JSON.stringify(plan.reactions[0]?.target);
  const result = executeDirectorRuntimeInteraction({ reactionPlan: plan });
  assert.equal(JSON.stringify(plan), beforePlan);
  assert.equal(JSON.stringify(plan.reactions), beforeReactions);
  assert.equal(JSON.stringify(plan.reactions[0]?.target), beforeTarget);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.directives), true);
  assert.equal(Object.isFrozen(capabilities), true);
  assert.equal(
    isDirectorRuntimeInteractionExecutionCapabilitySupported("attention", "emphasize-target"),
    true,
  );
  assert.equal(
    isDirectorRuntimeInteractionExecutionCapabilitySupported("mode", "open-context"),
    false,
  );
});

test("35-36. capability matching is deterministic; conflicts reject predictably", () => {
  assert.equal(
    isDirectorRuntimeInteractionExecutionCapabilitySupported("scene", "reveal-related"),
    isDirectorRuntimeInteractionExecutionCapabilitySupported("scene", "reveal-related"),
  );
  // Plan constructor rejects conflicts; supply a plan-shaped object for execution.
  const manualConflict = Object.freeze({
    planId: "plan-conflict",
    intentId: "intent-conflict",
    requestId: "request-conflict",
    intentKind: "focus-target" as const,
    transitionKind: "focus" as const,
    changed: true,
    hasWork: true,
    reactions: Object.freeze([
      createDirectorRuntimeReactionDirective({
        surface: "scene", kind: "emphasize-target", target: factory, priority: "primary",
      }),
      createDirectorRuntimeReactionDirective({
        surface: "scene", kind: "clear-context", target: factory, priority: "primary",
      }),
    ]),
  });
  const result = executeDirectorRuntimeInteraction({ reactionPlan: manualConflict });
  assert.equal(result.status, "rejected");
  assert.ok(result.rejectedCount >= 2);
  assert.equal(result.directives[0]?.reason, "execution-conflict");
});

test("37-40. execution does not invent reactions or recompute intent/focus/selection", () => {
  // Pipeline re-exports may name upstream APIs; execution must not invoke them.
  assert.doesNotMatch(source, /\bplanDirectorRuntimeInteractionReaction\s*\(/);
  assert.doesNotMatch(source, /\bresolveDirectorRuntimeInteractionIntent\s*\(/);
  assert.doesNotMatch(source, /\borchestrateDirectorRuntimeFocusSelection\s*\(/);
  assert.doesNotMatch(source, /\b(?:focusedTarget|selectedTarget)\s*=/);
  const plan = focusPlan();
  const result = executeDirectorRuntimeInteraction({ reactionPlan: plan });
  assert.equal(result.directives.length, plan.reactions.length);
});

test("41-53. architectural negatives: purity, UI, renderer, persistence, business", () => {
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|Date\.now|new Date)\b/);
  assert.doesNotMatch(source, /\b(?:localStorage|indexedDB|fetch|XMLHttpRequest|WebSocket)\b/);
  assert.doesNotMatch(source, /\b(?:globalThis|process\.env)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|HTMLElement|Object3D|Mesh|Camera|Vector3)\b/,
  );
  assert.doesNotMatch(source, /\b(?:document|window)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:durationMs|easingCurve|frameTiming|springConfig|opacity\s*[:=]|camera\.position)\b/i,
  );
  assert.doesNotMatch(
    source,
    /\b(?:generateSummary|recommend|callLLM|calculateKpi|approveDecision|allocateBudget)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(execution.philosophy, "execution-result-is-not-animation-completion");
});

test("54-56. registry counts match and verification succeeds", () => {
  assert.equal(registry.executionStatusCount, registry.executionStatuses.length);
  assert.equal(registry.directiveStatusCount, registry.directiveStatuses.length);
  assert.equal(registry.executionReasonCount, registry.executionReasons.length);
  assert.equal(registry.executionCapabilityCount, registry.executionCapabilities.length);
  assert.equal(registry.publicApiCount, registry.publicApis.length);
  assert.equal(registry.publicTypeCount, registry.publicTypes.length);
  assert.equal(isDirectorRuntimeInteractionExecutionResult(
    executeDirectorRuntimeInteraction({ reactionPlan: focusPlan() }),
  ), true);
  assert.equal(verifyDirectorRuntimeInteractionExecution(), true);
  assert.equal(verifyDirectorRuntimeInteractionExecution(), true);
});
