import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createDirectorRuntimeInteractionReactionPlan,
  createDirectorRuntimeReactionDirective,
} from "./directorRuntimeInteractionReactionPlanning.ts";
import {
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS as dispositions,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES as phases,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES as traceStatuses,
  continueDirectorRuntimeInteractionOrchestrationAfterIntent,
  continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan,
  createDirectorRuntimeFocusSelectionState,
  createDirectorRuntimeInteractionOrchestrationInput,
  createEmptyDirectorRuntimeFocusSelectionState,
  directorRuntimeInteractionOrchestrationPlatform as platform,
  directorRuntimeInteractionOrchestrationPlatformRegistry as registry,
  isCompletedDirectorRuntimeInteractionOrchestration,
  isDirectorRuntimeInteractionOrchestrationResult,
  isRejectedDirectorRuntimeInteractionOrchestration,
  isStoppedDirectorRuntimeInteractionOrchestration,
  orchestrateDirectorRuntimeInteraction,
  verifyDirectorRuntimeInteractionOrchestrationPlatform,
  type AcceptedDirectorRuntimeInteractionContract,
  type DirectorRuntimeInteractionOrchestrationInput,
  type ResolvedDirectorRuntimeInteractionIntent,
} from "./directorRuntimeInteractionOrchestrationPlatform.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionOrchestrationPlatform.ts", import.meta.url),
  "utf8",
);

const warehouse = Object.freeze({ kind: "object" as const, id: "warehouse-01" });
const factory = Object.freeze({ kind: "object" as const, id: "factory-01" });

function baseInput(
  overrides: Partial<DirectorRuntimeInteractionOrchestrationInput> = {},
): DirectorRuntimeInteractionOrchestrationInput {
  return {
    requestId: "interaction-17",
    observation: {
      interactionId: "ix-17",
      kind: "select",
      source: "object",
      target: factory,
      sequence: 17,
      scope: "scene",
    },
    context: { sceneId: "executive-main", workspaceId: "workspace-1" },
    currentState: createDirectorRuntimeFocusSelectionState({
      focusedTarget: warehouse,
      selectedTarget: null,
    }),
    ...overrides,
  };
}

test("1-4. exact DRI-4:7 identity, version, namespace, sole DRI-4:6 dependency", () => {
  assert.deepEqual({
    phase: platform.phase,
    name: platform.name,
    identity: platform.identity,
    namespace: platform.namespace,
    version: platform.version,
    layer: platform.layer,
    stage: platform.stage,
    immediateDependency: platform.immediateDependency,
  }, {
    phase: "DRI-4:7",
    name: "DirectorRuntimeInteractionOrchestrationPlatform",
    identity: "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
    namespace: "nexora.dri.interaction.orchestration.platform",
    version: "4.7.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "Platform",
    immediateDependency: "DRI-4:6/DirectorRuntimeInteractionExecution",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeInteractionExecution",
  ]);
});

test("5-9. phase count 6, immutable phases/dispositions/trace statuses, exact order", () => {
  assert.equal(phases.length, 6);
  assert.deepEqual([...phases], [
    "foundation",
    "contract",
    "intent-resolution",
    "focus-selection",
    "reaction-planning",
    "execution",
  ]);
  assert.deepEqual([...dispositions], ["completed", "stopped", "rejected"]);
  assert.deepEqual([...traceStatuses], ["completed", "skipped", "stopped", "rejected"]);
  assert.equal(Object.isFrozen(phases), true);
  assert.equal(Object.isFrozen(dispositions), true);
  assert.equal(Object.isFrozen(traceStatuses), true);
});

test("10-11. platform input construction deterministic; result immutable", () => {
  const input = baseInput();
  const a = createDirectorRuntimeInteractionOrchestrationInput(input);
  const b = createDirectorRuntimeInteractionOrchestrationInput(input);
  assert.deepEqual(a, b);
  assert.equal(Object.isFrozen(a), true);
  assert.equal(Object.isFrozen(a.currentState), true);
  const result = orchestrateDirectorRuntimeInteraction(input);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.trace), true);
  assert.equal(isDirectorRuntimeInteractionOrchestrationResult(result), true);
});

test("12-18. valid interaction executes full pipeline with preserved outputs", () => {
  const result = orchestrateDirectorRuntimeInteraction(baseInput());
  assert.equal(result.disposition, "completed");
  assert.equal(isCompletedDirectorRuntimeInteractionOrchestration(result), true);
  assert.equal(result.contract?.disposition, "accepted");
  assert.equal(result.intent?.disposition, "resolved");
  assert.ok(result.transition !== null);
  assert.ok(result.reactionPlan !== null);
  assert.ok(result.execution !== null);
  assert.equal(result.finalState, result.transition!.nextState);
  assert.equal(result.transition!.transitionKind, "select");
  assert.equal(result.finalState.selection.selectedTarget?.id, "factory-01");
  assert.equal(result.platformRunId, "interaction-17:platform");
  assert.equal(result.requestId, "interaction-17");
  if (result.intent?.disposition === "resolved") {
    assert.equal(result.intent.intent.requestId, "interaction-17");
    assert.equal(result.reactionPlan!.intentId, result.intent.intent.intentId);
    assert.equal(result.execution!.intentId, result.intent.intent.intentId);
    assert.equal(result.execution!.requestId, "interaction-17");
  }
});

test("19-23. rejected contract stops pipeline without downstream stages", () => {
  const result = orchestrateDirectorRuntimeInteraction(baseInput({
    observation: {
      interactionId: "ix-bad",
      kind: "select",
      source: "object",
      target: { kind: "object", id: "" },
      sequence: 1,
      scope: "scene",
    },
  }));
  assert.equal(result.disposition, "rejected");
  assert.equal(isRejectedDirectorRuntimeInteractionOrchestration(result), true);
  assert.equal(result.terminationPhase, "contract");
  assert.ok(result.reason !== null);
  assert.equal(result.contract?.disposition, "rejected");
  assert.equal(result.intent, null);
  assert.equal(result.transition, null);
  assert.equal(result.reactionPlan, null);
  assert.equal(result.execution, null);
  assert.equal(
    result.trace.find((entry) => entry.phase === "intent-resolution")?.status,
    "skipped",
  );
  assert.equal(
    result.trace.find((entry) => entry.phase === "focus-selection")?.status,
    "skipped",
  );
  assert.equal(
    result.trace.find((entry) => entry.phase === "reaction-planning")?.status,
    "skipped",
  );
  assert.equal(
    result.trace.find((entry) => entry.phase === "execution")?.status,
    "skipped",
  );
});

test("24-27. unresolved intent stops without transition/plan/execution", () => {
  const accepted = orchestrateDirectorRuntimeInteraction(baseInput());
  assert.equal(accepted.contract?.disposition, "accepted");
  const result = continueDirectorRuntimeInteractionOrchestrationAfterIntent({
    requestId: "interaction-17",
    observation: accepted.observation,
    context: accepted.context,
    currentState: accepted.initialState,
    contract: accepted.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: Object.freeze({
      disposition: "unresolved" as const,
      reason: "unsupported-combination" as const,
      requestId: "interaction-17",
      matchedRuleIds: Object.freeze([] as const),
    }),
  });
  assert.equal(result.disposition, "stopped");
  assert.equal(isStoppedDirectorRuntimeInteractionOrchestration(result), true);
  assert.equal(result.terminationPhase, "intent-resolution");
  assert.equal(result.intent?.disposition, "unresolved");
  assert.equal(result.transition, null);
  assert.equal(result.reactionPlan, null);
  assert.equal(result.execution, null);
  assert.equal(
    result.trace.find((entry) => entry.phase === "focus-selection")?.status,
    "skipped",
  );
  assert.equal(
    result.trace.find((entry) => entry.phase === "reaction-planning")?.status,
    "skipped",
  );
  assert.equal(
    result.trace.find((entry) => entry.phase === "execution")?.status,
    "skipped",
  );
});

test("28-31. legitimate NoOp/preserve path remains successful and canonical", () => {
  const result = orchestrateDirectorRuntimeInteraction(baseInput({
    observation: {
      interactionId: "ix-noop",
      kind: "hover",
      source: "system",
      target: { kind: "none", id: "" },
      sequence: 3,
      scope: "scene",
    },
    currentState: createEmptyDirectorRuntimeFocusSelectionState(),
  }));
  assert.equal(result.disposition, "completed");
  assert.equal(result.contract?.disposition, "accepted");
  assert.equal(result.intent?.disposition, "resolved");
  if (result.intent?.disposition === "resolved") {
    assert.equal(result.intent.intent.kind, "no-op");
  }
  assert.equal(result.transition?.transitionKind, "preserve");
  assert.equal(result.transition?.changed, false);
  assert.ok(result.reactionPlan !== null);
  assert.ok(
    result.reactionPlan!.reactions.every(
      (directive) => directive.kind === "no-op" || directive.kind === "preserve",
    ),
  );
  assert.ok(result.execution !== null);
  assert.ok(["completed", "skipped", "partial"].includes(result.execution!.status));
  const preservedExecution = result.execution!;
  assert.equal(
    orchestrateDirectorRuntimeInteraction(baseInput({
      observation: {
        interactionId: "ix-noop",
        kind: "hover",
        source: "system",
        target: { kind: "none", id: "" },
        sequence: 3,
        scope: "scene",
      },
      currentState: createEmptyDirectorRuntimeFocusSelectionState(),
    })).execution?.status,
    preservedExecution.status,
  );
});

test("32-33. partial and unsupported execution information is preserved", () => {
  const completed = orchestrateDirectorRuntimeInteraction(baseInput());
  assert.equal(completed.disposition, "completed");
  assert.ok(completed.transition !== null);
  assert.ok(completed.reactionPlan !== null);
  assert.equal(completed.intent?.disposition, "resolved");

  const unsupportedDirective = createDirectorRuntimeReactionDirective({
    surface: "scene",
    kind: "show-related-metrics",
    target: factory,
    priority: "primary",
  });
  const craftedPlan = createDirectorRuntimeInteractionReactionPlan({
    planId: `${completed.reactionPlan!.planId}:unsupported`,
    intentId: completed.reactionPlan!.intentId,
    requestId: completed.reactionPlan!.requestId,
    intentKind: completed.reactionPlan!.intentKind,
    transitionKind: completed.reactionPlan!.transitionKind,
    changed: true,
    reactions: Object.freeze([
      ...completed.reactionPlan!.reactions,
      unsupportedDirective,
    ]),
  });
  const withUnsupported = continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan({
    requestId: completed.requestId,
    observation: completed.observation,
    context: completed.context,
    currentState: completed.initialState,
    contract: completed.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: completed.intent as ResolvedDirectorRuntimeInteractionIntent,
    transition: completed.transition!,
    reactionPlan: craftedPlan,
  });
  assert.equal(withUnsupported.disposition, "completed");
  assert.ok(withUnsupported.execution !== null);
  assert.ok(withUnsupported.execution!.unsupportedCount > 0);
  assert.ok(
    withUnsupported.execution!.status === "partial" ||
      withUnsupported.execution!.status === "completed",
  );
  assert.ok(
    withUnsupported.execution!.directives.some(
      (entry) => entry.status === "unsupported",
    ),
  );

  // Plan constructor rejects conflicts; supply a plan-shaped object for execution.
  const conflictPlan = Object.freeze({
    planId: `${completed.reactionPlan!.planId}:conflict`,
    intentId: completed.reactionPlan!.intentId,
    requestId: completed.reactionPlan!.requestId,
    intentKind: completed.reactionPlan!.intentKind,
    transitionKind: completed.reactionPlan!.transitionKind,
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
  const withRejectedExecution = continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan({
    requestId: completed.requestId,
    observation: completed.observation,
    context: completed.context,
    currentState: completed.initialState,
    contract: completed.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: completed.intent as ResolvedDirectorRuntimeInteractionIntent,
    transition: completed.transition!,
    reactionPlan: conflictPlan,
  });
  assert.equal(withRejectedExecution.disposition, "completed");
  assert.equal(withRejectedExecution.execution?.status, "rejected");
  assert.ok((withRejectedExecution.execution?.rejectedCount ?? 0) > 0);
});

test("34-40. phase trace covers six phases, ordering, early-stop skipped, immutable/deterministic", () => {
  const success = orchestrateDirectorRuntimeInteraction(baseInput());
  assert.equal(success.trace.length, 6);
  assert.deepEqual(success.trace.map((entry) => entry.phase), [...phases]);
  assert.ok(success.trace.every((entry) => entry.status === "completed"));

  const rejectedContract = orchestrateDirectorRuntimeInteraction(baseInput({
    observation: {
      interactionId: "ix-bad",
      kind: "select",
      source: "object",
      target: { kind: "object", id: "" },
      sequence: 1,
      scope: "scene",
    },
  }));
  assert.deepEqual(rejectedContract.trace.map((entry) => entry.phase), [...phases]);
  assert.equal(rejectedContract.trace[0]?.status, "completed");
  assert.equal(rejectedContract.trace[1]?.status, "rejected");
  assert.ok(rejectedContract.trace.slice(2).every((entry) => entry.status === "skipped"));

  const unresolved = continueDirectorRuntimeInteractionOrchestrationAfterIntent({
    requestId: "interaction-17",
    observation: success.observation,
    context: success.context,
    currentState: success.initialState,
    contract: success.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: Object.freeze({
      disposition: "unresolved" as const,
      reason: "ambiguous-semantic-mapping" as const,
      requestId: "interaction-17",
      matchedRuleIds: Object.freeze(["a", "b"] as const),
    }),
  });
  assert.equal(unresolved.trace[0]?.status, "completed");
  assert.equal(unresolved.trace[1]?.status, "completed");
  assert.equal(unresolved.trace[2]?.status, "stopped");
  assert.ok(unresolved.trace.slice(3).every((entry) => entry.status === "skipped"));

  assert.equal(Object.isFrozen(success.trace), true);
  assert.equal(Object.isFrozen(success.trace[0]), true);
  const again = orchestrateDirectorRuntimeInteraction(baseInput());
  assert.deepEqual(again.trace, success.trace);
});

test("41-43. same input produces equivalent platform output, trace, and identity propagation", () => {
  const a = orchestrateDirectorRuntimeInteraction(baseInput());
  const b = orchestrateDirectorRuntimeInteraction(baseInput());
  assert.deepEqual(a, b);
  assert.deepEqual(a.trace, b.trace);
  assert.equal(a.platformRunId, "interaction-17:platform");
  assert.equal(a.execution?.executionId, a.reactionPlan?.planId + ":execution");
});

test("44-49. no random/wall-clock IDs; inputs and upstream outputs not mutated", () => {
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|Date\.now|new Date)\b/);
  const observation = {
    interactionId: "ix-17",
    kind: "select" as const,
    source: "object" as const,
    target: { kind: "object" as const, id: "factory-01" },
    sequence: 17,
    scope: "scene" as const,
  };
  const context = { sceneId: "executive-main", workspaceId: "workspace-1" };
  const currentState = createDirectorRuntimeFocusSelectionState({
    focusedTarget: warehouse,
    selectedTarget: null,
  });
  const observationSnapshot = structuredClone(observation);
  const contextSnapshot = structuredClone(context);
  const stateSnapshot = structuredClone(currentState);
  const result = orchestrateDirectorRuntimeInteraction({
    requestId: "interaction-17",
    observation,
    context,
    currentState,
  });
  assert.deepEqual(observation, observationSnapshot);
  assert.deepEqual(context, contextSnapshot);
  assert.deepEqual(currentState, stateSnapshot);
  assert.ok(result.contract !== null);
  assert.ok(Object.isFrozen(result.contract));
  if (result.intent) assert.equal(Object.isFrozen(result.intent), true);
  if (result.transition) assert.equal(Object.isFrozen(result.transition), true);
  if (result.reactionPlan) assert.equal(Object.isFrozen(result.reactionPlan), true);
  if (result.execution) assert.equal(Object.isFrozen(result.execution), true);
});

test("50-53. platform does not duplicate upstream semantic rule tables", () => {
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES\s*=/);
  assert.match(source, /evaluateDirectorRuntimeInteractionContract\s*\(/);
  assert.match(source, /resolveDirectorRuntimeInteractionIntent\s*\(/);
  assert.match(source, /orchestrateDirectorRuntimeFocusSelection\s*\(/);
  assert.match(source, /planDirectorRuntimeInteractionReaction\s*\(/);
  assert.match(source, /executeDirectorRuntimeInteraction\s*\(/);
});

test("54-56. registry counts match definitions; verification returns true", () => {
  assert.equal(registry.platformPhaseCount, phases.length);
  assert.equal(registry.platformDispositionCount, dispositions.length);
  assert.equal(registry.traceStatusCount, traceStatuses.length);
  assert.equal(registry.platformInputContractCount, registry.platformInputContracts.length);
  assert.equal(registry.platformResultContractCount, registry.platformResultContracts.length);
  assert.equal(registry.traceContractCount, registry.traceContracts.length);
  assert.equal(registry.publicApiCount, registry.publicApis.length);
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationPlatform(), true);
});

test("57-70. architectural negatives and composition constraints", () => {
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:publish|subscribe|emit|EventEmitter)\s*\(/);
  assert.doesNotMatch(source, /\b(?:setTimeout|setInterval|requestAnimationFrame|Promise\.|async\s+function)\b/);
  assert.doesNotMatch(source, /\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|WebSocket)\b/);
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
  assert.doesNotMatch(
    source,
    /directorRuntimeSceneOrchestration(?!PublicIndex)|orchestrateDirectorRuntimeScene/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntime(?:Interaction(?:OrchestrationFoundation|Contracts|IntentResolution|ReactionPlanning)|FocusSelectionOrchestration)/,
  );
  assert.equal(platform.philosophy, "platform-is-composition-of-existing-semantics");
  assert.equal(platform.status, "PlatformReady");
});

