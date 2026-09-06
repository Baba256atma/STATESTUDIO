/**
 * NEX-ENT:4 — Advisor & Guided Conversation education.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { objectEducationOf } from "./nexoraObjectEducationExperience.ts";
import { acknowledgeNexoraObjectEducationInteraction } from "./nexoraObjectEducationExperience.ts";
import {
  NEXORA_CONVERSATION_EDUCATION_BOUNDARY,
  conversationEducationOf,
  isNexoraConversationEducationActive,
  shouldNexoraConversationEducationOwnUtterance,
  verifyNexoraConversationEducation,
} from "./nexoraConversationEducationExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function guidedSession() {
  return withActiveNexoraGuidedEntrance(
    createNexoraEntranceSession({ workspaceResolution: "first-time" }),
  );
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = previous?.nextEntranceSession ?? guidedSession();
  const catalog = isNexoraEntranceRestrained(session)
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    messageIdSeed: `nex-ent4-${utterance}`,
  });
}

function afterStage() {
  return run("Show me how focus works", run("Show me"));
}

function atGoal() {
  return run("Show me the next one", afterStage());
}

function advance(steps: number, from = atGoal()) {
  let current = from;
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atObjectReview() {
  return advance(7);
}

function atConversationAsk() {
  return run("Show me the next one", atObjectReview());
}

function assertNoBusinessTruth(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.realityDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.scenarioDiscovery, null);
  assert.equal(session?.scenarioComparison, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

describe("NEX-ENT:4 Advisor & Guided Conversation", () => {
  it("identity and boundary preserve the real conversation path", () => {
    assert.equal(verifyNexoraConversationEducation().ok, true);
    assert.equal(NEXORA_CONVERSATION_EDUCATION_BOUNDARY.secondConversationEngine, false);
    assert.equal(NEXORA_CONVERSATION_EDUCATION_BOUNDARY.onboardingNluEngine, false);
    assert.equal(NEXORA_CONVERSATION_EDUCATION_BOUNDARY.tutorialKeywordRouter, false);
    assert.equal(NEXORA_CONVERSATION_EDUCATION_BOUNDARY.implementsGuidedAttention, false);
    assert.equal(NEXORA_CONVERSATION_EDUCATION_BOUNDARY.implementsDataEducation, false);
    assert.equal(NEXORA_CONVERSATION_EDUCATION_BOUNDARY.advisorDirectStageDom, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
  });

  it("Proof handoff — Object review continues into conversation education", () => {
    const asked = atConversationAsk();
    assert.equal(objectEducationOf(asked.nextEntranceSession).state, "COMPLETED");
    assert.equal(conversationEducationOf(asked.nextEntranceSession).state, "ASK");
    assert.equal(isNexoraConversationEducationActive(asked.nextEntranceSession), true);
    assert.match(asked.nexoraMessage.text, /need commands/i);
    assert.equal(
      asked.nexoraMessage.suggestedActions?.some((action) => action.kind === "question"),
      true,
    );
    assert.equal(
      asked.nexoraMessage.suggestedActions?.some((action) => action.kind === "answer"),
      true,
    );
    assertNoBusinessTruth(asked);
  });

  it("Proof A — Show me the problems uses canonical meaning, not commands", () => {
    const show = atConversationAsk();
    assert.equal(
      shouldNexoraConversationEducationOwnUtterance(
        show.nextEntranceSession,
        "Show me the problems",
      ),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(show.nextEntranceSession, "Show me the problems"),
      false,
    );
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Show me the problems",
      subjects: projectManagerObjectConversationalSubjects(
        projectNexoraEntranceCatalog(show.nextEntranceSession!),
      ),
    });
    assert.notEqual(meaning.requestedOperation, "UNKNOWN");
    const result = run("Show me the problems", show);
    assert.doesNotMatch(result.nexoraMessage.text, /SHOW\(PROBLEM\)|\/investigate/i);
    assertNoBusinessTruth(result);
  });

  it("Proof B — paraphrase Let me see the issues is not phrase-routed by ENT:4", () => {
    const asked = atConversationAsk();
    assert.equal(
      shouldNexoraConversationEducationOwnUtterance(
        asked.nextEntranceSession,
        "Let me see the issues",
      ),
      false,
    );
    const result = run("Let me see the issues", asked);
    assert.doesNotMatch(result.nexoraMessage.text, /SHOW\(/);
    assertNoBusinessTruth(result);
  });

  it("Proof C — Explain this stays on the selected educational Problem", () => {
    const explainLesson = run("Show me the next one", run("Show me the next one", atConversationAsk()));
    assert.equal(conversationEducationOf(explainLesson.nextEntranceSession).state, "EXPLAIN");
    const ack = acknowledgeNexoraObjectEducationInteraction({
      session: explainLesson.nextEntranceSession!,
      runtimeState: explainLesson.nextRuntimeState,
      subjectId: "obj-nex-ent3-problem",
    });
    const explained = run("Explain this", {
      ...explainLesson,
      nextEntranceSession: ack!.session,
    });
    assert.match(explained.nexoraMessage.text, /problem/i);
    assertNoBusinessTruth(explained);
  });

  it("Proof D — Why? does not reset to the workspace-location answer", () => {
    const explainLesson = run("Show me the next one", run("Show me the next one", atConversationAsk()));
    const explained = run("Explain this", explainLesson);
    const why = run("Why?", explained);
    assert.doesNotMatch(why.nexoraMessage.text, /already inside the nexora executive workspace/i);
    assert.equal(conversationEducationOf(why.nextEntranceSession).state, "EXPLAIN");
    assertNoBusinessTruth(why);
  });

  it("Proof E — Investigate this does not fabricate a cause", () => {
    const investigate = run(
      "Show me the next one",
      run("Show me the next one", run("Show me the next one", atConversationAsk())),
    );
    assert.equal(conversationEducationOf(investigate.nextEntranceSession).state, "INVESTIGATE");
    const result = run("Investigate this", investigate);
    assert.match(result.nexoraMessage.text, /evidence|cause/i);
    assert.doesNotMatch(result.nexoraMessage.text, /the cause is|caused by late trucks/i);
    assertNoBusinessTruth(result);
  });

  it("Proof F — Compare these does not fabricate a winner", () => {
    const compare = advanceConversation(4);
    assert.equal(conversationEducationOf(compare.nextEntranceSession).state, "COMPARE");
    const catalog = projectNexoraEntranceCatalog(compare.nextEntranceSession!);
    assert.equal(catalog.objects.some((object) => object.id === "obj-nex-ent3-scenario"), true);
    assert.equal(catalog.objects.some((object) => object.id === "obj-nex-ent3-scenario-b"), true);
    const result = run("Compare these", compare);
    assert.match(result.nexoraMessage.text, /difference/i);
    assert.doesNotMatch(result.nexoraMessage.text, /winner|objectively better|lower cost|higher probability/i);
    assertNoBusinessTruth(result);
  });

  it("Proof G — Which one should I choose? does not commit", () => {
    const compare = advanceConversation(4);
    const result = run("Which one should I choose?", compare);
    assert.match(result.nexoraMessage.text, /evidence|yours|commit/i);
    assert.equal(result.nextEntranceSession?.decisionExperience, null);
    assertNoBusinessTruth(result);
  });

  it("Proof H — correction is not treated as an error and writes no truth", () => {
    const compare = advanceConversation(4);
    assert.equal(
      shouldNexoraConversationEducationOwnUtterance(
        compare.nextEntranceSession,
        "No, I meant the other Scenario",
      ),
      false,
    );
    const result = run("No, I meant the other Scenario", compare);
    assert.doesNotMatch(result.nexoraMessage.text, /error|invalid command/i);
    assertNoBusinessTruth(result);
  });

  it("Proof I — Show me that one is not guessed by ENT:4", () => {
    const compare = advanceConversation(4);
    assert.equal(
      shouldNexoraConversationEducationOwnUtterance(
        compare.nextEntranceSession,
        "Show me that one",
      ),
      false,
    );
    const result = run("Show me that one", compare);
    assert.doesNotMatch(result.nexoraMessage.text, /SHOW\(/);
    assertNoBusinessTruth(result);
  });

  it("Proof J — unknown request does not invent meaning or mutate business state", () => {
    const asked = atConversationAsk();
    const before = projectNexoraEntranceCatalog(asked.nextEntranceSession!).objects.map(
      (object) => object.id,
    );
    const result = run("please frobnicate the quantiles", asked);
    assert.equal(conversationEducationOf(result.nextEntranceSession).state, "ASK");
    const after = projectNexoraEntranceCatalog(result.nextEntranceSession!).objects.map(
      (object) => object.id,
    );
    assert.deepEqual(after, before);
    assertNoBusinessTruth(result);
  });

  it("Proof K — existing typo recovery is not replaced by an ENT dictionary", () => {
    const asked = atConversationAsk();
    assert.equal(
      shouldNexoraConversationEducationOwnUtterance(
        asked.nextEntranceSession,
        "show me the problms",
      ),
      false,
    );
    const result = run("show me the problms", asked);
    assert.doesNotMatch(result.nexoraMessage.text, /SHOW\(/);
    assertNoBusinessTruth(result);
  });

  it("Proof L — I don't know continues without fabricated manager truth", () => {
    const asked = atConversationAsk();
    const result = run("I don't know", asked);
    assert.match(result.nexoraMessage.text, /have to decide|That/i);
    assertNoBusinessTruth(result);
  });

  it("Proof M — How do I add my data? stays high-level", () => {
    const asked = atConversationAsk();
    const result = run("How do I add my data?", asked);
    assert.match(result.nexoraMessage.text, /use data|shortly/i);
    assert.doesNotMatch(result.nexoraMessage.text, /csv picker|data rail|upload a file/i);
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
    assertNoBusinessTruth(result);
  });

  it("Proof N — Show problems is not hijacked", () => {
    const asked = atConversationAsk();
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(asked.nextEntranceSession, "Show problems"),
      false,
    );
    const result = run("Show problems", asked);
    assert.equal(conversationEducationOf(result.nextEntranceSession).state, "ASK");
    assertNoBusinessTruth(result);
  });

  it("Proof O — Skip this exits safely", () => {
    const skipped = run("Skip this", atConversationAsk());
    assert.equal(skipped.nextEntranceSession?.workspaceResolution, "existing-workspace");
    assert.equal(conversationEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.equal(objectEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.equal(isNexoraEntranceRestrained(skipped.nextEntranceSession), false);
    assertNoBusinessTruth(skipped);
  });

  it("suggested questions versus answers keep kind", () => {
    const asked = atConversationAsk();
    const questions = asked.nexoraMessage.suggestedActions?.filter(
      (action) => action.kind === "question",
    );
    const answers = asked.nexoraMessage.suggestedActions?.filter(
      (action) => action.kind === "answer",
    );
    assert.ok((questions?.length ?? 0) >= 1);
    assert.ok((answers?.length ?? 0) >= 1);
    assert.equal(
      answers?.some((action) => /use scenario a/i.test(action.label)),
      false,
    );
  });

  it("Manager ↔ Advisor ↔ Stage loop does not write business truth", () => {
    const showLesson = run("Show me the next one", atConversationAsk());
    const shown = run("Show me the problems", showLesson);
    const catalog = projectNexoraEntranceCatalog(shown.nextEntranceSession!);
    assert.equal(catalog.objects.some((object) => object.id === "obj-nex-ent3-problem"), true);
    const ack = acknowledgeNexoraObjectEducationInteraction({
      session: shown.nextEntranceSession!,
      runtimeState: shown.nextRuntimeState,
      subjectId: "obj-nex-ent3-problem",
    });
    const explained = run("Explain this", {
      ...shown,
      nextEntranceSession: ack!.session,
    });
    assert.match(explained.nexoraMessage.text, /problem/i);
    const compare = advanceConversation(4, atConversationAsk());
    const compared = run("Compare these", compare);
    assert.match(compared.nexoraMessage.text, /difference|alternatives/i);
    assertNoBusinessTruth(compared);
  });

  it("completing conversation education creates zero canonical writes", () => {
    const recap = advanceConversation(5);
    assert.equal(conversationEducationOf(recap.nextEntranceSession).state, "REVIEW");
    assert.match(recap.nexoraMessage.text, /ask naturally/i);
    assertNoBusinessTruth(recap);
  });
});

function advanceConversation(
  steps: number,
  from = atConversationAsk(),
) {
  let current = from;
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}
