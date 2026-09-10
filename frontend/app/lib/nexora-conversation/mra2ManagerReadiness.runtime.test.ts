import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  commitPreparedCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  prepareCsvRealDataImport,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { classifyAdvisorDataConversation } from "../manager-object/nexoraAdvisorDataInquiry.ts";
import { interpretExecutiveCollectionQuery } from "../manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { classifyNexoraSemanticScope } from "../manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import { projectAuthoritativeStageContext } from "../manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-09T21:00:00.000Z";
const READY_CSV = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    decisionRuntime: previous ? previous.decisionRuntime : undefined,
    executionRuntime: previous ? previous.executionRuntime : undefined,
    messageIdSeed: `mra-2-${utterance}`,
  });
}

describe("MRA:2 systemic manager-readiness", () => {
  it("C3 unknown member does not empty the Problems collection", () => {
    const turn = run("show me Completely Invented Problem");
    assert.match(turn.response, /I don't see that Problem/i);
    assert.match(turn.response, /Capacity Gap/i);
    assert.match(turn.response, /Margin Pressure/i);
    assert.doesNotMatch(turn.response, /I don't see any Problems/i);
  });

  it("C3 count grammar and C2 Stage-meta SHOW share typed owners", () => {
    const count = run("how many problem we have");
    assert.match(count.response, /There are 2 Problems|Current Problems/i);
    const focused = run("Focus on Risk.");
    const stage = run("show me what is on Stage", focused);
    assert.equal(classifyNexoraSemanticScope("show me what is on Stage"), "CURRENT_WORKSPACE");
    assert.match(stage.response, /on Stage|visible|Risk|Watch/i);
    assert.doesNotMatch(stage.response, /Do you mean the Margin Pressure problem or the Risk/i);
  });

  it("C8 delete never degrades into add", () => {
    const turn = run("delete Margin Pressure");
    assert.equal(turn.ecaWorkingContext?.mutationProposal?.operation, "REMOVE");
    assert.match(turn.response, /won’t delete|remove/i);
    assert.doesNotMatch(turn.response, /I can add “Margin”/i);
  });

  it("C1 ordinal binds collection members, not Stage watches", () => {
    const listed = run("show me scenarios");
    assert.match(listed.response, /Demand Surge/i);
    const second = run("explain the second scenario", listed);
    assert.doesNotMatch(second.response, /Watch/i);
    assert.equal(interpretExecutiveCollectionQuery("show me scenarios")?.collectionKind, "SCENARIO");
  });

  it("C1 knowledge follow-up stays on the confirmed object", () => {
    const first = run("What is Capacity Gap?");
    const follow = run("explain it", first);
    assert.match(follow.response, /Capacity Gap/i);
  });

  it("C1 contrastive other binds the sibling Problem, not Outcome clarification", () => {
    const named = run("Capacity Gap");
    const why = run("why", named);
    const other = run("and the other one?", why);
    assert.match(other.response, /Margin Pressure/i);
    assert.doesNotMatch(other.response, /which business outcome/i);
  });

  it("C1 first-problem ordinal binds collection membership, not unknown member", () => {
    const listed = run("show me all problems");
    const demand = run("now tell me about Demand Surge", listed);
    const first = run("what about the first problem?", demand);
    assert.match(first.response, /Capacity Gap/i);
    assert.doesNotMatch(first.response, /I don't see that Problem/i);
  });

  it("C6 data support questions stay on DATA-ADV", () => {
    assert.equal(
      classifyAdvisorDataConversation("Can this CSV support Capacity Gap?"),
      "evidence-relevance",
    );
    assert.equal(
      classifyAdvisorDataConversation("tell me about my data"),
      "source-semantics",
    );
    resetCsvRealDataImportStoreForTests();
    const prepared = prepareCsvRealDataImport({
      workspaceId: "overview",
      fileName: "capacity-ready.csv",
      fileSize: READY_CSV.length,
      csvText: READY_CSV,
      importId: "mra-2:ready",
      importedAt: T0,
    });
    assert.equal(prepared.ready, true);
    if (!prepared.ready) return;
    commitPreparedCsvRealDataImport({
      prepared,
      expectedWorkspaceId: "overview",
      mode: "new",
      committedAt: T0,
    });
    const inventory = run("What CSV do you have?");
    const explain = run("Explain the CSV file you currently have and tell me what you understand from it.", inventory);
    assert.match(explain.response, /capacity-ready|Confirmed fields|unresolved|pending/i);
    assert.doesNotMatch(explain.response, /which business outcome/i);
    const support = run("does this source tell us anything about the capacity issue?", explain);
    assert.match(support.response, /capacity-ready|evidence|cannot treat|causality|relationship/i);
    resetCsvRealDataImportStoreForTests();
  });

  it("C7 sequential Approve and start share one Decision runtime", () => {
    const approved = run("Approve Demand Surge");
    assert.equal(approved.decisionCommitmentResult?.status, "applied");
    const ready = run("are we ready to execute?", approved);
    assert.doesNotMatch(ready.response, /There is no committed Decision yet/i);
    assert.doesNotMatch(ready.response, /no committed Decision/i);
    const started = run("start it", ready);
    assert.match(started.response, /Execution has started|already has an active Execution|approved/i);
    assert.ok((started.decisionRuntime?.listDecisions() ?? []).some((item) => item.status === "Approved"));
  });

  it("C5 SHOW does not re-attach leftover recommendation language", () => {
    const rec = run("What should I do?");
    const show = run("show me problems", rec);
    assert.doesNotMatch(show.response, /My recommendation remains/i);
  });

  it("C4 manager copy does not leak internal requirement codes", () => {
    const turn = run("what should I do?");
    assert.doesNotMatch(turn.response, /MANAGER AUTHORITY REQUIREMENT|DECISION REQUIREMENT/i);
  });

  it("generalization: collection query variants share the same interpreter", () => {
    assert.equal(interpretExecutiveCollectionQuery("list our problems")?.collectionKind, "PROBLEM");
    assert.equal(interpretExecutiveCollectionQuery("now risks")?.collectionKind, "RISK");
    assert.equal(interpretExecutiveCollectionQuery("how many problems are on stage")?.stageScoped, true);
  });

  it("MRA:3-FIX1 C1 second-one after compare binds the listed Scenario", () => {
    const listed = run("show me scenarios");
    const compared = run("compare them", listed);
    const second = run("explain the second one", compared);
    assert.match(second.response, /Demand Surge/i);
    assert.doesNotMatch(second.response, /Capacity Expansion Plan is currently visible/i);
  });

  it("MRA:3-FIX1 C1 first problem then it stays on that Problem", () => {
    const listed = run("show me problems");
    const first = run("go back to the first problem", listed);
    const explained = run("explain it", first);
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /^Margin Pressure is the primary/i);
    const interrupted = run("What are the main problems?");
    const typo = run("look at capcity", interrupted);
    assert.match(typo.response, /Capacity Gap/i);
    assert.doesNotMatch(typo.response, /^Focused on Capacity\./i);
    const evidence = run("what evidence do we have?", typo);
    const nowMargin = run("now margin", evidence);
    const firstAfter = run("go back to the first problem", nowMargin);
    const explainedAfter = run("explain it", firstAfter);
    assert.match(explainedAfter.response, /Capacity Gap/i);
    assert.doesNotMatch(explainedAfter.response, /^Margin Pressure is the primary/i);
    const thatProblem = run("explain that problem", firstAfter);
    assert.match(thatProblem.response, /Capacity Gap/i);
    const clicked = selectNexoraMVPInteractionSubject(firstAfter.nextRuntimeState, "ctx-problem-margin");
    const afterClick = executeNexoraConversationalExperience({
      utterance: "explain it",
      conversationContext: firstAfter.nextConversationContext,
      executiveContext: firstAfter.nextExecutiveContext,
      executiveSubjects: subjects,
      runtimeState: clicked,
      catalog,
      previousManagerObjectSession: firstAfter.managerObjectTurn.session ?? null,
      scenarioSession: firstAfter.nextScenarioSession ?? null,
      decisionSession: firstAfter.nextDecisionSession ?? null,
      decisionRuntime: firstAfter.decisionRuntime,
      executionRuntime: firstAfter.executionRuntime,
      messageIdSeed: "mra-2-stage-click-explain",
    });
    assert.match(afterClick.response, /Margin Pressure/i);
  });

  it("MRA:3-FIX1 knowledge mention then investigate it", () => {
    const listed = run("show me all problems");
    const focused = run("focus on Capacity Gap", listed);
    const mentioned = run("now tell me about Demand Surge", focused);
    const investigate = run("investigate it", mentioned);
    assert.doesNotMatch(investigate.response, /Which item do you mean/i);
    assert.match(investigate.response, /Demand Surge/i);
  });

  it("MRA:3-FIX1 mutation topic change does not confirm an unnamed add", () => {
    const proposed = run("Add this as a Risk.");
    assert.match(proposed.response, /Which item/i);
    const forgot = run("forget that for now", proposed);
    const listed = run("show me problems", forgot);
    const yes = run("yes", listed);
    assert.doesNotMatch(yes.response, /has been added as a Risk/i);
  });

  it("MRA:3-FIX1 Overview collection Stage lifecycle stays internally consistent", () => {
    const listed = run("show me problems");
    const listedStage = projectAuthoritativeStageContext({
      runtimeState: listed.nextRuntimeState,
      catalog,
    });
    assert.ok(listedStage.snapshot);
    assert.equal(listedStage.snapshot.mode, "collection");
    assert.ok(listedStage.collection);
    assert.ok(listedStage.visibleMembers.every((member) => !/watch$/i.test(member.label)));
    assert.ok(listedStage.visibleMembers.some((member) => /Capacity Gap/i.test(member.label)));
    const membership = run("whats on stage", listed);
    assert.match(membership.response, /Capacity Gap/i);
    assert.doesNotMatch(membership.response, /Capacity Watch|Customer Watch/i);
    const restored = run("Go back to overview", listed);
    const overviewStage = projectAuthoritativeStageContext({
      runtimeState: restored.nextRuntimeState,
      catalog,
    });
    assert.ok(overviewStage.snapshot);
    assert.notEqual(overviewStage.snapshot.mode, "collection");
    assert.equal(overviewStage.collection, null);
    const again = run("whats on stage", restored);
    assert.match(again.response, /Watch|Overview/i);
    assert.doesNotMatch(again.response, /Capacity Gap, Margin Pressure/i);
  });

  it("MRA:3-FIX1 manager copy does not leak implementation ids", () => {
    const approved = run("Approve Demand Surge");
    const started = run("start it", approved);
    const plan = run("Should we change the plan?", started);
    assert.doesNotMatch(plan.response, /ECA:10|cc9:scenario|INSUFFICIENT_REALITY/i);
    const weather = run("what about weather in Paris", started);
    assert.doesNotMatch(weather.response, /INSUFFICIENT_REALITY/i);
  });
});
