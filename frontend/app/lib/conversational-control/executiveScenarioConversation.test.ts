/**
 * CC:9 — Scenario Conversation certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY,
  EXECUTIVE_SCENARIO_REASON,
  executiveScenarioConversationArchitecturalRole,
  getExecutiveScenarioConversationIdentity,
} from "./executiveScenarioConversation.ts";
import { defineNexoraExecutiveScenario } from "./executiveScenarioDefinition.ts";
import {
  createNexoraScenarioBaselineSnapshot,
  evaluateNexoraExecutiveScenario,
} from "./executiveScenarioEvaluation.ts";
import { compareNexoraExecutiveScenarios } from "./executiveScenarioComparison.ts";
import {
  createEmptyNexoraExecutiveScenarioSession,
  resolveNexoraExecutiveScenarioConversation,
} from "./executiveScenarioResolver.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
} from "./executiveContextSnapshot.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { toNexoraConversationContextSnapshot } from "./executiveContextProjection.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { CONVERSATIONAL_INTENT_BOUNDARY } from "./conversationalIntent.ts";
import { CONVERSATIONAL_CONTEXT_BOUNDARY } from "./conversationalContext.ts";
import { CONVERSATIONAL_COMMAND_BOUNDARY } from "./conversationalCommand.ts";
import { CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY } from "./conversationalRuntimeBridge.ts";
import { CONVERSATIONAL_EXPERIENCE_BOUNDARY } from "./conversationalExperience.ts";
import { CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY } from "./conversationalExperienceContext.ts";
import { EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY } from "./executiveContextAwareness.ts";
import { EXECUTIVE_REASONING_BOUNDARY } from "./executiveReasoning.ts";

function ctx(partial?: {
  readonly subjectId?: string;
  readonly goalId?: string;
  readonly problemId?: string;
  readonly workspaceId?: string;
}) {
  const ref = (
    id: string,
    kind: "object" | "goal" | "problem" | "scenario" = "object",
  ) =>
    freezeExecutiveContextReference({
      subjectId: id,
      subjectKind: kind,
      canonicalName: id,
      source: "explicit",
      turnIndex: 1,
    });
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: partial?.subjectId ? ref(partial.subjectId) : null,
    currentGoal: partial?.goalId ? ref(partial.goalId, "goal") : null,
    currentProblem: partial?.problemId
      ? ref(partial.problemId, "problem")
      : null,
    currentWorkspaceId: partial?.workspaceId ?? "overview",
    turnIndex: 1,
  });
}

function baseline() {
  return createNexoraScenarioBaselineSnapshot({
    attentionBySubject: {
      "obj-capacity": "important",
      "obj-revenue": "elevated",
      "obj-demand": "elevated",
      "obj-budget": "normal",
    },
  });
}

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
    readonly scenarioSession?: ReturnType<
      typeof createEmptyNexoraExecutiveScenarioSession
    > | null;
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
    scenarioSession: opts?.scenarioSession ?? null,
    messageIdSeed: opts?.seed ?? `cc9-${utterance}`,
  });
}

test("CC:9 identity and boundary", () => {
  const id = getExecutiveScenarioConversationIdentity();
  assert.equal(id.id, "CC:9/ScenarioConversation");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    executiveScenarioConversationArchitecturalRole,
    "ExecutiveScenarioConversationAuthority",
  );
  assert.equal(EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY.mutatesDecisionState, false);
  assert.equal(EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY.inventsBusinessOutcomes, false);
  assert.equal(EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY.commitsDecisions, false);
  assert.equal(EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY.sessionOnlyDrafts, true);
});

test("1–2: define and evaluate do-nothing with horizon", () => {
  const defined = defineNexoraExecutiveScenario({
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    requestKind: "do-nothing",
    primarySubjectId: "obj-capacity",
    horizon: Object.freeze({ amount: 1, unit: "quarter" }),
    requireHorizon: true,
  });
  assert.equal(defined.status, "defined");
  assert.equal(defined.scenario?.kind, "do-nothing");
  assert.equal(defined.scenario?.name, "Do Nothing");

  const evaluated = evaluateNexoraExecutiveScenario({
    scenario: defined.scenario!,
    baseline: baseline(),
    goalSubjectId: "obj-revenue",
  });
  assert.ok(
    evaluated.status === "evaluated" || evaluated.status === "partial",
  );
  assert.equal(evaluated.evaluation?.baselinePreserved, true);
  assert.equal(
    evaluated.trace.baselineFingerprintBefore,
    evaluated.trace.baselineFingerprintAfter,
  );
});

test("3: percentage intervention Capacity +15%", () => {
  const result = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    relatedSubjectIds: Object.freeze(["obj-revenue", "obj-delivery"]),
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.ok(result.status === "partial" || result.status === "evaluated");
  assert.equal(result.scenario?.name, "Capacity +15%");
  const capacity = result.evaluation?.impacts.find(
    (i) => i.subjectId === "obj-capacity",
  );
  assert.equal(capacity?.direction, "decrease");
  // No invented revenue magnitude
  const revenue = result.evaluation?.impacts.find(
    (i) => i.subjectId === "obj-revenue",
  );
  if (revenue) {
    assert.equal(revenue.magnitude, undefined);
    assert.equal(revenue.direction, "unknown");
  }
});

test("4: unsupported variable", () => {
  const result = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx(),
    operation: "define-intervention",
    primarySubjectId: "unmodeled:advertising",
    interventions: [
      Object.freeze({
        subjectId: "unmodeled:advertising",
        actionKind: "increase-by",
        value: 100,
        unit: "%",
      }),
    ],
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(result.status, "unsupported");
  assert.match(result.summary, /supported impact model/i);
});

test("5–7: modify scenario revision identity", () => {
  const first = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 10,
        unit: "%",
      }),
    ],
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const second = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    operation: "modify",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    session: first.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(second.scenario?.revision, (first.scenario?.revision ?? 0) + 1);
  assert.notEqual(second.scenario?.scenarioId, first.scenario?.scenarioId);
  assert.equal(second.scenario?.name, "Capacity +15%");
  assert.ok(
    second.trace.reasons.includes(EXECUTIVE_SCENARIO_REASON.REVISION_ADVANCED),
  );
});

test("6: add second assumption", () => {
  const first = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const second = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-demand" }),
    operation: "add-assumption",
    primarySubjectId: "obj-demand",
    assumptions: [
      Object.freeze({
        key: "demand-drop",
        subjectId: "obj-demand",
        operator: "decrease-by" as const,
        value: 5,
        unit: "%",
      }),
    ],
    session: first.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(second.scenario?.interventions.length, 1);
  assert.equal(second.scenario?.assumptions.length, 1);
  assert.equal(second.scenario?.assumptions[0]?.subjectId, "obj-demand");
});

test("8–9: compare and explain preference", () => {
  const a = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    operation: "define-do-nothing",
    primarySubjectId: "obj-capacity",
    horizon: Object.freeze({ amount: 1, unit: "quarter" }),
    requireHorizon: true,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const b = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    session: a.nextSession,
    relatedSubjectIds: Object.freeze(["obj-revenue"]),
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const compared = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    operation: "compare",
    session: b.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(compared.status, "compared");
  assert.ok(compared.comparison);
  assert.equal(compared.comparison?.requiresDecisionCommitment, false);
  assert.ok(compared.comparison?.preferredScenarioId);

  const why = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ goalId: "obj-revenue" }),
    operation: "explain",
    session: compared.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(why.status, "compared");
  assert.ok(why.summary.length > 0);
});

test("10: downside query", () => {
  const b = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const down = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    operation: "downside",
    session: b.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.ok(down.summary.length > 0);
  assert.ok(
    down.evaluation?.tradeoffs.length || down.evaluation?.uncertainties.length,
  );
});

test("11: missing horizon clarification", () => {
  const result = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    operation: "define-do-nothing",
    primarySubjectId: "obj-capacity",
    requireHorizon: true,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(result.status, "clarification-required");
  assert.equal(result.clarificationPrompt, "For what time horizon?");
});

test("12: partial evaluation", () => {
  const result = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    relatedSubjectIds: Object.freeze(["obj-revenue"]),
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(result.status, "partial");
  assert.ok(
    result.evaluation?.uncertainties.some((u) =>
      /cost|unmodeled|not numerically/i.test(u.description),
    ),
  );
});

test("13: insufficient data compare", () => {
  const compared = compareNexoraExecutiveScenarios({
    scenarios: [],
    evaluations: [],
  });
  assert.equal(compared.status, "insufficient-data");
});

test("14: baseline preservation across evaluations", () => {
  const base = baseline();
  const fingerprint = base.fingerprint;
  for (const value of [10, 15, 20]) {
    const result = resolveNexoraExecutiveScenarioConversation({
      executiveContext: ctx({ subjectId: "obj-capacity" }),
      operation: "define-intervention",
      primarySubjectId: "obj-capacity",
      interventions: [
        Object.freeze({
          subjectId: "obj-capacity",
          actionKind: "increase-by",
          value,
          unit: "%",
        }),
      ],
      baselineAttentionBySubject: base.attentionBySubject,
    });
    assert.equal(result.evaluation?.baseline.fingerprint, fingerprint);
    assert.equal(result.evaluation?.baselinePreserved, true);
  }
  assert.equal(base.fingerprint, fingerprint);
});

test("15–17: integration — explicit subject, context, click pronoun", () => {
  assert.equal(
    resolveNexoraConversationalIntent({
      utterance: "What if Capacity increases 15%?",
    }).intent.kind,
    "explore-scenario",
  );

  const focused = run("Focus on Capacity", { seed: "cc9-focus" });
  const whatIf = run("What if we increase this 10%?", {
    state: focused.nextRuntimeState,
    executiveContext: focused.nextExecutiveContext,
    seed: "cc9-this",
  });
  assert.equal(whatIf.status, "applied");
  assert.equal(
    whatIf.scenarioResult?.scenario?.interventions[0]?.subjectId,
    "obj-capacity",
  );
  assert.equal(whatIf.shouldCommitRuntime, false);
});

test("18–20: workspace isolation + presented set + ordinal", () => {
  const a = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({
      subjectId: "obj-capacity",
      workspaceId: "decision",
    }),
    operation: "define-do-nothing",
    horizon: Object.freeze({ amount: 1, unit: "quarter" }),
    requireHorizon: true,
    primarySubjectId: "obj-capacity",
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const b = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({
      subjectId: "obj-capacity",
      workspaceId: "decision",
    }),
    operation: "define-intervention",
    primarySubjectId: "obj-capacity",
    interventions: [
      Object.freeze({
        subjectId: "obj-capacity",
        actionKind: "increase-by",
        value: 15,
        unit: "%",
      }),
    ],
    session: a.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.ok(b.nextSession.candidateScenarioIds.length >= 2);

  const open = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ workspaceId: "decision" }),
    operation: "open-candidate",
    candidateOrdinal: 1,
    session: b.nextSession,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(open.status, "defined");
  assert.equal(
    open.nextSession.activeScenarioId,
    b.nextSession.candidateScenarioIds[1],
  );

  // Different workspace session starts empty — ordinals do not leak.
  const other = createEmptyNexoraExecutiveScenarioSession({
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  const leak = resolveNexoraExecutiveScenarioConversation({
    executiveContext: ctx({ workspaceId: "overview" }),
    operation: "open-candidate",
    candidateOrdinal: 0,
    session: other,
    baselineAttentionBySubject: baseline().attentionBySubject,
  });
  assert.equal(leak.status, "insufficient-data");
});

test("21: failed turn preserves scenario session", () => {
  const first = run("What if Capacity increases 15%?", { seed: "fail-a" });
  const session = first.nextScenarioSession;
  const failed = run("asdf qwer zxcv", {
    state: first.nextRuntimeState,
    executiveContext: first.nextExecutiveContext,
    scenarioSession: session,
    seed: "fail-b",
  });
  assert.notEqual(failed.status, "applied");
  assert.deepEqual(failed.nextRuntimeState, first.nextRuntimeState);
});

test("22–24: no decision/execution/stage mutation on scenario", () => {
  const before = run("Focus on Capacity", { seed: "mut-a" });
  const scen = run("What if Capacity increases 15%?", {
    state: before.nextRuntimeState,
    executiveContext: before.nextExecutiveContext,
    seed: "mut-b",
  });
  assert.equal(scen.shouldCommitRuntime, false);
  assert.deepEqual(scen.nextRuntimeState, before.nextRuntimeState);
  assert.equal(scen.nextExecutiveContext.currentDecision, null);
  assert.equal(scen.nextExecutiveContext.currentExecution, null);
});

test("25: CC:1–8 regression boundaries", () => {
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(
    CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.usesLlmOrExternalProvider,
    false,
  );
  assert.equal(EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(EXECUTIVE_REASONING_BOUNDARY.usesLlmOrExternalProvider, false);
});

test("26–27: Stage + navigation regression", () => {
  const a = run("Focus on Revenue", { seed: "nav-a" });
  const b = run("Focus on Capacity", {
    state: a.nextRuntimeState,
    executiveContext: a.nextExecutiveContext,
    seed: "nav-b",
  });
  const back = run("Go back", {
    state: b.nextRuntimeState,
    executiveContext: b.nextExecutiveContext,
    seed: "nav-c",
  });
  assert.equal(back.status, "applied");
  assert.equal(back.shouldCommitRuntime, true);
});

test("Case C integration: unsupported advertising", () => {
  const result = run("What if we double advertising?", { seed: "adv" });
  assert.equal(result.status, "applied");
  assert.equal(result.scenarioResult?.status, "unsupported");
});

test("Case I integration: do nothing without horizon remains qualitative", () => {
  const result = run("What if we do nothing?", {
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    seed: "horizon",
  });
  assert.equal(result.status, "applied");
  assert.equal(result.scenarioResult?.scenario?.kind, "do-nothing");
  assert.doesNotMatch(result.response, /time horizon/i);
  assert.match(result.response, /scenario rather than a prediction/i);
});

test("Case L: Choose Scenario B routes to CC:10 Decision Commitment", () => {
  const result = run("Choose Scenario B", {
    executiveContext: ctx({ subjectId: "obj-capacity" }),
    seed: "commit",
  });
  // Without a presented scenario session, CC:10 asks for clarification —
  // it no longer stops at the CC:9 commitment stub.
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.scenarioResult, null);
  assert.ok(result.decisionCommitmentResult);
  assert.equal(
    result.decisionCommitmentResult?.status,
    "clarification-required",
  );
  assert.match(result.response, /which option|commit/i);
});

test("Case A integration: do nothing with horizon", () => {
  const result = run("What if we do nothing for the next 1 quarter?", {
    executiveContext: ctx({ subjectId: "obj-capacity", goalId: "obj-revenue" }),
    seed: "donothing",
  });
  assert.equal(result.status, "applied");
  assert.ok(
    result.scenarioResult?.status === "evaluated" ||
      result.scenarioResult?.status === "partial",
  );
  assert.equal(result.scenarioResult?.scenario?.kind, "do-nothing");
});

test("modify make it 15% via conversation", () => {
  const first = run("What if Capacity increases 10%?", { seed: "mod1" });
  const second = run("Make it 15%.", {
    state: first.nextRuntimeState,
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
    seed: "mod2",
  });
  assert.equal(second.scenarioResult?.scenario?.name, "Capacity +15%");
  assert.ok(
    (second.scenarioResult?.scenario?.revision ?? 0) >
      (first.scenarioResult?.scenario?.revision ?? 0),
  );
});
