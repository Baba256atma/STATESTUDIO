/**
 * CC:7 — Executive Context Awareness certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY,
  EXECUTIVE_CONTEXT_BOUNDS,
  EXECUTIVE_CONTEXT_REASON,
  executiveContextAwarenessArchitecturalRole,
  getExecutiveContextAwarenessIdentity,
} from "./executiveContextAwareness.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
} from "./executiveContextSnapshot.ts";
import { updateNexoraExecutiveContext } from "./executiveContextUpdater.ts";
import {
  projectExecutiveContextForConversation,
  toNexoraConversationContextSnapshot,
} from "./executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { syncNexoraExecutiveContextFromRuntimeState } from "@/app/lib/nex-mvp/nexoraMVPExecutiveContextAwareness.ts";
import { CONVERSATIONAL_INTENT_BOUNDARY } from "./conversationalIntent.ts";
import { CONVERSATIONAL_CONTEXT_BOUNDARY } from "./conversationalContext.ts";
import { CONVERSATIONAL_COMMAND_BOUNDARY } from "./conversationalCommand.ts";
import { CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY } from "./conversationalRuntimeBridge.ts";
import { CONVERSATIONAL_EXPERIENCE_BOUNDARY } from "./conversationalExperience.ts";
import { CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY } from "./conversationalExperienceContext.ts";

function initialState(
  workspace: "overview" | "problem" | "scenario" | "decision" | "execution" = "overview",
) {
  return createInitialNexoraMVPObjectInteractionState({
    workspace,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  opts?: {
    readonly state?: ReturnType<typeof initialState>;
    readonly executiveContext?: ReturnType<
      typeof createEmptyNexoraExecutiveContextSnapshot
    >;
    readonly seed?: string;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: opts?.executiveContext,
    conversationContext: opts?.executiveContext
      ? toNexoraConversationContextSnapshot(opts.executiveContext)
      : Object.freeze({}),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: opts?.state ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    messageIdSeed: opts?.seed ?? `cc7-${utterance}`,
  });
}

test("CC:7 identity and boundary", () => {
  const id = getExecutiveContextAwarenessIdentity();
  assert.equal(id.id, "CC:7/ExecutiveContextAwareness");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    executiveContextAwarenessArchitecturalRole,
    "ExecutiveContextAwarenessAuthority",
  );
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.mutatesRuntime, false);
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.mutatesStage, false);
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.movesCamera, false);
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.executesCommands, false);
  assert.equal(
    EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.generatesRecommendations,
    false,
  );
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.runsScenarios, false);
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.commitsDecisions, false);
  assert.equal(
    EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.performsExecutionFollowUp,
    false,
  );
  assert.equal(
    EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.usesLlmOrExternalProvider,
    false,
  );
  assert.equal(
    EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.durableCrossSessionMemory,
    false,
  );
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.rawChatIsNotAuthority, true);
});

test("1: first successful subject establishes context", () => {
  const result = run("Focus on Revenue", { seed: "t1" });
  assert.equal(result.status, "applied");
  assert.equal(
    result.nextExecutiveContext.currentSubject?.subjectId,
    "obj-revenue",
  );
  assert.equal(result.nextConversationContext.currentSubjectId, "obj-revenue");
});

test("2: second subject replaces current and pushes previous", () => {
  const first = run("Focus on Revenue", { seed: "t2a" });
  const second = run("Focus on Capacity", {
    state: first.nextRuntimeState,
    executiveContext: first.nextExecutiveContext,
    seed: "t2b",
  });
  assert.equal(
    second.nextExecutiveContext.currentSubject?.subjectId,
    "obj-capacity",
  );
  assert.ok(
    second.nextExecutiveContext.previousSubjects.some(
      (s) => s.subjectId === "obj-revenue",
    ),
  );
});

test("3: failed turn preserves context", () => {
  const first = run("Focus on Revenue", { seed: "t3a" });
  const failed = run("Focus on Moon Department", {
    state: first.nextRuntimeState,
    executiveContext: first.nextExecutiveContext,
    seed: "t3b",
  });
  assert.equal(failed.status, "not-found");
  assert.equal(
    failed.nextExecutiveContext.currentSubject?.subjectId,
    "obj-revenue",
  );
  assert.ok(
    failed.executiveContextUpdate?.trace.reasons.includes(
      EXECUTIVE_CONTEXT_REASON.FAILED_TURN_CONTEXT_PRESERVED,
    ),
  );
});

test("4: pronoun projection to CC:2 — Show its problems", () => {
  const first = run("Focus on Revenue", { seed: "t4a" });
  const second = run("Show its problems", {
    state: first.nextRuntimeState,
    executiveContext: first.nextExecutiveContext,
    seed: "t4b",
  });
  assert.equal(second.status, "applied");
  assert.equal(
    second.contextResult.context.primarySubject?.subjectId,
    "obj-revenue",
  );
});

test("5: conversation → click → pronoun uses Capacity", () => {
  const first = run("Focus on Revenue", { seed: "t5a" });
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const clicked = selectNexoraMVPInteractionSubject(
    first.nextRuntimeState,
    "obj-capacity",
    catalog,
  );
  const synced = syncNexoraExecutiveContextFromRuntimeState({
    previousContext: first.nextExecutiveContext,
    nextState: clicked,
    syncSource: "runtime",
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
  });
  assert.equal(synced.nextContext.currentSubject?.subjectId, "obj-capacity");

  const second = run("Show its problems", {
    state: clicked,
    executiveContext: synced.nextContext,
    seed: "t5b",
  });
  assert.equal(
    second.contextResult.context.primarySubject?.subjectId,
    "obj-capacity",
  );
});

test("6: conversation → navigation Back → pronoun", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = initialState();
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue", catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-budget", catalog);

  const context = createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: freezeExecutiveContextReference({
      subjectId: "obj-budget",
      subjectKind: "object",
      canonicalName: "Budget",
      source: "explicit",
      turnIndex: 3,
    }),
    previousSubjects: Object.freeze([
      freezeExecutiveContextReference({
        subjectId: "obj-capacity",
        subjectKind: "object",
        canonicalName: "Capacity",
        source: "explicit",
        turnIndex: 2,
      }),
      freezeExecutiveContextReference({
        subjectId: "obj-revenue",
        subjectKind: "object",
        canonicalName: "Revenue",
        source: "explicit",
        turnIndex: 1,
      }),
    ]),
    turnIndex: 3,
  });

  const back = stepBackNexoraMVPObjectInteraction(state, catalog);
  const synced = syncNexoraExecutiveContextFromRuntimeState({
    previousContext: context,
    nextState: back,
    syncSource: "navigation",
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
  });
  assert.equal(synced.nextContext.currentSubject?.subjectId, "obj-capacity");

  const result = run("Show its problems", {
    state: back,
    executiveContext: synced.nextContext,
    seed: "t6",
  });
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "obj-capacity",
  );
});

test("7–8: workspace transition + explicit subject after prepare", () => {
  const prepared = run("Prepare me for the project review.", { seed: "t7a" });
  assert.equal(prepared.nextRuntimeState.workspace, "decision");
  assert.equal(prepared.nextExecutiveContext.currentWorkspaceId, "decision");

  const focused = run("Focus on Budget", {
    state: prepared.nextRuntimeState,
    executiveContext: prepared.nextExecutiveContext,
    seed: "t7b",
  });
  assert.equal(focused.nextRuntimeState.workspace, "decision");
  assert.equal(
    focused.nextExecutiveContext.currentSubject?.subjectId,
    "obj-budget",
  );
});

test("9: automatic attention does not steal context", () => {
  const focused = run("Focus on Budget", { seed: "t9" });
  // Capacity may be critical in fixtures; context remains Budget until user/runtime changes it.
  assert.equal(
    focused.nextExecutiveContext.currentSubject?.subjectId,
    "obj-budget",
  );
  const preserved = updateNexoraExecutiveContext({
    previousContext: focused.nextExecutiveContext,
    trustedSuccess: false,
  });
  assert.equal(
    preserved.nextContext.currentSubject?.subjectId,
    "obj-budget",
  );
  assert.ok(
    preserved.trace.reasons.includes(
      EXECUTIVE_CONTEXT_REASON.FAILED_TURN_CONTEXT_PRESERVED,
    ),
  );
});

test("10–14: semantic slot updates by subject kind", () => {
  const subjects = projectDefaultNexoraMvpConversationalSubjects();
  const problem = subjects.find((s) => s.subjectId === "ctx-problem-capacity")!;
  const scenario = subjects.find((s) => s.subjectId === "ctx-scenario-capacity")!;
  const decision = subjects.find((s) => s.subjectId === "ctx-decision-capacity")!;
  const execution = subjects.find(
    (s) => s.subjectId === "ctx-execution-capacity",
  )!;
  const goal = freezeExecutiveContextReference({
    subjectId: "goal-growth",
    subjectKind: "goal",
    canonicalName: "Growth",
    source: "explicit",
    turnIndex: 1,
  });

  const ctx = createEmptyNexoraExecutiveContextSnapshot();
  let updated = updateNexoraExecutiveContext({
    previousContext: ctx,
    trustedSuccess: true,
    runtimeFocusedSubjectId: goal.subjectId,
    runtimeFocusedSubjectKind: "goal",
    runtimeFocusedCanonicalName: "Growth",
    executiveSubjects: Object.freeze([
      ...subjects,
      Object.freeze({
        subjectId: "goal-growth",
        subjectKind: "goal" as const,
        canonicalName: "Growth",
        aliases: Object.freeze(["growth"]),
      }),
    ]),
  });
  assert.equal(updated.nextContext.currentGoal?.subjectId, "goal-growth");

  updated = updateNexoraExecutiveContext({
    previousContext: updated.nextContext,
    trustedSuccess: true,
    runtimeFocusedSubjectId: problem.subjectId,
    runtimeFocusedSubjectKind: "problem",
    runtimeFocusedCanonicalName: problem.canonicalName,
    executiveSubjects: subjects,
  });
  assert.equal(updated.nextContext.currentProblem?.subjectId, problem.subjectId);
  assert.equal(updated.nextContext.currentGoal?.subjectId, "goal-growth");

  updated = updateNexoraExecutiveContext({
    previousContext: updated.nextContext,
    trustedSuccess: true,
    runtimeFocusedSubjectId: scenario.subjectId,
    runtimeFocusedSubjectKind: "scenario",
    runtimeFocusedCanonicalName: scenario.canonicalName,
    executiveSubjects: subjects,
  });
  assert.equal(
    updated.nextContext.currentScenario?.subjectId,
    scenario.subjectId,
  );

  updated = updateNexoraExecutiveContext({
    previousContext: updated.nextContext,
    trustedSuccess: true,
    runtimeFocusedSubjectId: decision.subjectId,
    runtimeFocusedSubjectKind: "decision",
    runtimeFocusedCanonicalName: decision.canonicalName,
    executiveSubjects: subjects,
  });
  assert.equal(
    updated.nextContext.currentDecision?.subjectId,
    decision.subjectId,
  );

  updated = updateNexoraExecutiveContext({
    previousContext: updated.nextContext,
    trustedSuccess: true,
    runtimeFocusedSubjectId: execution.subjectId,
    runtimeFocusedSubjectKind: "execution",
    runtimeFocusedCanonicalName: execution.canonicalName,
    executiveSubjects: subjects,
  });
  assert.equal(
    updated.nextContext.currentExecution?.subjectId,
    execution.subjectId,
  );
});

test("15–17: presented set + ordinal resolution / missing set fails", () => {
  const withSet = createEmptyNexoraExecutiveContextSnapshot({
    presentedSet: Object.freeze({
      kind: "problems",
      subjectIds: Object.freeze([
        "ctx-problem-capacity",
        "ctx-problem-margin",
        "ctx-decision-capacity",
      ]),
      anchorSubjectId: "obj-capacity",
      turnIndex: 1,
    }),
    turnIndex: 1,
  });

  const ordinal = run("Open the second one.", {
    executiveContext: withSet,
    seed: "ord1",
  });
  assert.equal(
    ordinal.contextResult.context.primarySubject?.subjectId,
    "ctx-problem-margin",
  );

  const missing = run("Open the second one.", {
    executiveContext: createEmptyNexoraExecutiveContextSnapshot(),
    seed: "ord2",
  });
  assert.ok(
    missing.status === "not-found" ||
      missing.status === "clarification-required",
  );
  assert.equal(missing.shouldCommitRuntime, false);
});

test("18–19: bounded previous subjects and recent references", () => {
  let ctx = createEmptyNexoraExecutiveContextSnapshot();
  const subjects = projectDefaultNexoraMvpConversationalSubjects();
  for (let i = 0; i < 20; i += 1) {
    const id = subjects[i % subjects.length]!.subjectId;
    const kind = subjects[i % subjects.length]!.subjectKind;
    ctx = updateNexoraExecutiveContext({
      previousContext: ctx,
      trustedSuccess: true,
      runtimeFocusedSubjectId: `${id}-turn-${i}`,
      runtimeFocusedSubjectKind: kind,
      runtimeFocusedCanonicalName: `S${i}`,
      executiveSubjects: Object.freeze([
        ...subjects,
        Object.freeze({
          subjectId: `${id}-turn-${i}`,
          subjectKind: kind,
          canonicalName: `S${i}`,
        }),
      ]),
    }).nextContext;
  }
  assert.ok(
    ctx.previousSubjects.length <= EXECUTIVE_CONTEXT_BOUNDS.previousSubjects,
  );
  assert.ok(
    ctx.recentReferences.length <= EXECUTIVE_CONTEXT_BOUNDS.recentReferences,
  );
});

test("20: serialization", () => {
  const result = run("Focus on Revenue", { seed: "ser" });
  assert.doesNotThrow(() =>
    JSON.stringify({
      context: result.nextExecutiveContext,
      update: result.executiveContextUpdate,
      projection: projectExecutiveContextForConversation(
        result.nextExecutiveContext,
      ),
    }),
  );
});

test("21: CC:1–6 regression boundaries", () => {
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.movesCamera, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.writesFocusDirectly, false);
  assert.equal(
    CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.inventsWorkspaceIds,
    false,
  );
});

test("22–23: Stage click + navigation authorities unchanged", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = selectNexoraMVPInteractionSubject(
    initialState(),
    "obj-revenue",
    catalog,
  );
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const back = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(back.focusedSubject?.id, "obj-revenue");
});

test("Sequence B: Focus Revenue → Focus Capacity → Show its problems", () => {
  const a = run("Focus on Revenue", { seed: "sb1" });
  const b = run("Focus on Capacity", {
    state: a.nextRuntimeState,
    executiveContext: a.nextExecutiveContext,
    seed: "sb2",
  });
  const c = run("Show its problems", {
    state: b.nextRuntimeState,
    executiveContext: b.nextExecutiveContext,
    seed: "sb3",
  });
  assert.equal(c.contextResult.context.primarySubject?.subjectId, "obj-capacity");
});

test("last command / runtime result recorded on success", () => {
  const result = run("Focus on Revenue", { seed: "lc1" });
  assert.equal(result.nextExecutiveContext.lastCommand?.kind, "focus-subject");
  assert.equal(result.nextExecutiveContext.lastRuntimeResult?.status, "applied");
});
