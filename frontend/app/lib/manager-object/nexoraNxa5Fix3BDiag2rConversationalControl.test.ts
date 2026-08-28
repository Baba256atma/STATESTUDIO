import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { projectConversationPathTrace } from "../nexora-certification/nxaConversationPathTrace.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { interpretExecutiveCollectionQuery } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa5-fix3b-diag2r-${utterance}`,
  });
}

function path(utterance: string, result: Turn) {
  return projectConversationPathTrace({ utterance, inheritedSubjectId: null, result });
}

describe("NXA:5-FIX3B-DIAG2R conversational control", () => {
  it("recovers natural collection language without selecting a member", () => {
    const variants: readonly [string, string][] = [
      ["show problems", "show-problems"],
      ["show me problems", "show-problems"],
      ["show all problems", "show-problems"],
      ["show problem", "show-problems"],
      ["show the problems", "show-problems"],
      ["what problems do we have?", "show-problems"],
      ["how many problems do we have?", "show-problems"],
      ["what scenarios do we have?", "show-scenarios"],
      ["show scenarios", "show-scenarios"],
      ["show me scenario", "show-scenarios"],
      ["show all scenario", "show-scenarios"],
      ["show executions", "show-execution"],
      ["show me executions", "show-execution"],
      ["show prolems", "show-problems"],
      ["show scenaros", "show-scenarios"],
    ];
    for (const [utterance, kind] of variants) {
      assert.equal(resolveNexoraConversationalIntent({ utterance }).intent.kind, kind, utterance);
      const query = interpretExecutiveCollectionQuery(utterance);
      assert.ok(query && !query.ambiguousIssueNoun, utterance);
      const result = run(utterance);
      assert.equal(result.intentResult.intent.kind, kind, utterance);
      assert.equal(result.nextRuntimeState.focusedSubject, null, utterance);
      assert.match(result.response, /Current (?:Problems|Scenarios|Executions):/i, `${utterance} → ${result.response}`);
    }
    const goals = resolveNexoraConversationalIntent({ utterance: "show goals" });
    assert.equal(goals.intent.kind, "show-goals");
    assert.equal(interpretExecutiveCollectionQuery("how many goals do we have?")?.collectionKind, "GOAL");
    const goalTurn = run("show goals");
    assert.equal(goalTurn.intentResult.intent.kind, "show-goals");
    assert.equal(goalTurn.nextRuntimeState.focusedSubject, null);
    assert.match(goalTurn.response, /Goal/i);
  });

  it("keeps a named member distinct from a collection request", () => {
    const surge = run("show Demand Surge");
    assert.equal(surge.intentResult.intent.kind, "focus");
    assert.equal(surge.nextRuntimeState.focusedSubject?.label, "Demand Surge");
  });

  it("answers how many from the active collection without inventing focus", () => {
    const scenarios = run("show scenarios");
    const count = run("how many are there?", scenarios);
    assert.equal(count.intentResult.intent.kind, "show-scenarios");
    assert.equal(count.nextRuntimeState.focusedSubject, null);
    assert.equal(count.nextRuntimeState.collectionContext?.category, "scenario");
    assert.match(count.response, /Scenario/i);
  });

  it("lets an explicit collection command escape an incompatible pending question", () => {
    const problems = run("show me problems");
    const pending = run("which one of prolems is important?", problems);
    assert.equal(pending.ncaConversationState?.pendingQuestion?.status, "ACTIVE");
    const executions = run("show executions", pending);
    assert.notEqual(executions.ncaDialogueMove, "ANSWER_NEXORA");
    assert.equal(executions.intentResult.intent.kind, "show-execution");
    assert.match(executions.response, /Current Executions:/i);
    assert.doesNotMatch(executions.response, /capacity-pressure hypothesis/i);
    assert.equal(executions.nextRuntimeState.collectionContext?.category, "execution");
    const trace = path("show executions", executions);
    assert.equal(trace.dirInstruction, "SHOW_COLLECTION");
  });

  it("still completes a genuine pending criterion answer", () => {
    const problems = run("show me problems");
    const pending = run("which one of prolems is important?", problems);
    const urgency = run("urgency", pending);
    assert.equal(urgency.ncaDialogueMove, "ANSWER_NEXORA");
    assert.equal(urgency.ncaPost4Comparison?.criterion, "URGENCY");
    assert.equal(urgency.executiveJudgment?.preferredCandidateId, null);
  });

  it("treats meta-corrections as conversational repair, not evidence", () => {
    const problems = run("show me problems");
    const pending = run("which one of prolems is important?", problems);
    const correction = run("I am asking of Executions", pending);
    assert.notEqual(correction.ncaDialogueMove, "ANSWER_NEXORA");
    assert.doesNotMatch(correction.response, /capacity-pressure hypothesis/i);
    assert.equal(correction.intentResult.intent.kind, "show-execution");
    assert.match(correction.response, /Current Executions:/i);
    assert.equal((correction.managerObjectTurn.session.managerObservations ?? []).length, 0);
    assert.equal(correction.shouldCommitRuntime, true);
  });

  it("resolves them against the active collection", () => {
    const scenarios = run("show scenarios");
    const them = run("show them", scenarios);
    assert.equal(them.intentResult.intent.kind, "show-scenarios");
    assert.equal(them.nextRuntimeState.collectionContext?.category, "scenario");
    assert.equal(them.nextRuntimeState.focusedSubject, null);
  });

  it("resolves it to the focused object for Explain", () => {
    const surge = run("show Demand Surge");
    const explained = run("explain it", surge);
    const trace = path("explain it", explained);
    assert.match(explained.response, /Demand Surge/i);
    assert.equal(trace.readWrite, "read");
    assert.equal(explained.nextRuntimeState.focusedSubject?.label, "Demand Surge");
  });

  it("does not mutate Stage on a knowledge-style count when the collection is already presented", () => {
    const problems = run("show problems");
    const members = problems.nextRuntimeState.collectionContext?.objectIds ?? [];
    const count = run("how many problems do we have?", problems);
    assert.deepEqual(count.nextRuntimeState.collectionContext?.objectIds, members);
    assert.equal(count.nextRuntimeState.focusedSubject, null);
    assert.match(count.response, /Problem/i);
  });

  it("lets explain of a named object escape pending clarification", () => {
    const pending = run("which one of prolems is important?", run("show me problems"));
    const explained = run("explain Delivery", pending);
    assert.match(explained.response, /Delivery/i);
    assert.notEqual(explained.ncaDialogueMove, "ANSWER_NEXORA");
    assert.doesNotMatch(explained.response, /Do you mean/i);
  });

  it("lets a count question escape pending clarification", () => {
    const pending = run("which one of prolems is important?", run("show me problems"));
    const count = run("how many scenarios do we have?", pending);
    assert.equal(count.intentResult.intent.kind, "show-scenarios");
    assert.match(count.response, /Scenario/i);
    assert.equal(count.nextRuntimeState.focusedSubject, null);
  });

  it("compares the active collection for which-one importance", () => {
    const problems = run("show problems");
    const compared = run("which one is more important?", problems);
    assert.ok(compared.ncaPost4Comparison || /important|compar/i.test(compared.response));
    assert.equal(compared.nextRuntimeState.collectionContext?.category, "problem");
    assert.equal(compared.nextRuntimeState.focusedSubject, null);
  });

  it("resolves them for comparison against the active Scenario collection", () => {
    const scenarios = run("show scenarios");
    const compared = run("compare them", scenarios);
    assert.equal(compared.nextRuntimeState.collectionContext?.category, "scenario");
    assert.match(compared.response, /Scenario/i);
    assert.doesNotMatch(compared.response, /Investigate Margin Pressure/i);
  });

  it("does not treat a rejection of the last answer as Stage focus", () => {
    const problems = run("show problems");
    const focused = problems.nextRuntimeState.focusedSubject;
    const correction = run("that's not what I asked", problems);
    assert.equal(correction.nextRuntimeState.focusedSubject, focused);
    assert.equal((correction.managerObjectTurn.session.managerObservations ?? []).length, 0);
  });

  it("does not treat collection or knowledge turns as manager observations", () => {
    const scenarios = run("show scenarios");
    const count = run("how many scenarios do we have?", scenarios);
    const them = run("show them", count);
    assert.equal((scenarios.managerObjectTurn.session.managerObservations ?? []).length, 0);
    assert.equal((count.managerObjectTurn.session.managerObservations ?? []).length, 0);
    assert.equal((them.managerObjectTurn.session.managerObservations ?? []).length, 0);
  });

  it("does not invent an investigation pair when comparing the presented Scenario collection", () => {
    const surge = run("show Demand Surge");
    const scenarios = run("show scenarios", surge);
    const compared = run("compare them", scenarios);
    assert.doesNotMatch(compared.response, /Investigate Margin Pressure/i);
    assert.equal(compared.nextRuntimeState.collectionContext?.category, "scenario");
  });

  it("does not inflect a valid singular collection noun inside object reference", () => {
    const simulated = resolveNexoraConversationalIntent({ utterance: "Simulate this scenario" });
    assert.equal(simulated.intent.kind, "simulate");
    assert.equal(simulated.intent.requiresContext, true);
    const required = resolveNexoraConversationalIntent({ utterance: "What decision is required?" });
    assert.equal(required.intent.kind, "decision-status");
  });
});
