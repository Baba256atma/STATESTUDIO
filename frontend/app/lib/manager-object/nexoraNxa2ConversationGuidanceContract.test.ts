import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { NEXORA_NXA2_BOUNDARY, verifyNexoraNxa2 } from "./nexoraNxa2ConversationGuidanceContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
function run(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: previous?.nextExecutiveContext,
    conversationContext: previous?.nextConversationContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa2-${utterance}`,
  });
}

describe("NXA:2 Executive Conversation Guidance", () => {
  it("is a policy projection over existing authorities", () => {
    assert.equal(NEXORA_NXA2_BOUNDARY.createsDialogueEngine, false);
    assert.equal(NEXORA_NXA2_BOUNDARY.createsQuestionEngine, false);
    assert.equal(NEXORA_NXA2_BOUNDARY.createsRecommendationEngine, false);
    assert.equal(verifyNexoraNxa2().ok, true);
  });

  it("A direct knowledge question selects ANSWER without a question", () => {
    const result = run("What is Capacity Gap?");
    assert.equal(result.nxaGuidanceContract?.behavior, "ANSWER");
    assert.equal((result.response.match(/\?/g) ?? []).length, 0);
    assert.match(result.response, /Capacity Gap/i);
  });

  it("B vague performance goal asks one high-value goal question", () => {
    const result = run("I want to improve performance.");
    assert.equal(result.nxaGuidanceContract?.behavior, "ASK");
    assert.equal((result.response.match(/\?/g) ?? []).length, 1);
    assert.match(result.response, /result|outcome|delivery|margin|quality|goal/i);
  });

  it("C existing Delivery target is used and not requested again", () => {
    const shown = run("Show Delivery.");
    const result = run("Delivery is below target. What should I do?", shown);
    assert.match(result.response, /96%|temporary capacity|delivery goal/i);
    assert.doesNotMatch(result.response, /what is (?:the |your )?delivery target/i);
  });

  it("D advice is contextual and actionable", () => {
    const shown = run("Show Delivery.");
    const result = run("What should I do about it?", shown);
    assert.ok(["RECOMMEND", "ASK", "GUIDE"].includes(result.nxaGuidanceContract?.behavior ?? ""));
    assert.doesNotMatch(result.response, /how can i help|what would you like/i);
    assert.match(result.response, /capacity|investigat|delivery|evidence/i);
  });

  it("E unsupported certainty selects CHALLENGE and preserves authority", () => {
    const shown = run("Show Delivery.");
    const result = run("Capacity is definitely causing Delivery. Let's add staff.", shown);
    assert.equal(result.nxaGuidanceContract?.behavior, "CHALLENGE");
    assert.match(result.response, /not.*confirm|evidence|uncertain|possible contributor/i);
    assert.equal(result.shouldCommitRuntime, false);
  });

  it("F explicit manager override is respected", () => {
    const advised = run("What should I do about Capacity Gap?");
    const result = run("No. Show Margin Pressure.", advised);
    assert.match(result.nextRuntimeState.focusedSubject?.id ?? "", /margin/i);
    assert.match(result.response, /Margin Pressure/i);
    assert.doesNotMatch(result.response, /before that|must complete/i);
  });

  it("G Why deepens advice without resetting the recommendation", () => {
    const shown = run("Show Delivery.");
    const advised = run("What should I do?", shown);
    const why = run("Why?", advised);
    assert.match(why.response, /because|goal|trade-off|evidence|reason|fit/i);
    assert.notEqual(why.response, advised.response);
  });

  it("H manager uncertainty selects contextual GUIDE", () => {
    const shown = run("Show Delivery.");
    const result = run("I'm not sure where to start.", shown);
    assert.equal(result.nxaGuidanceContract?.behavior, "GUIDE");
    assert.match(result.response, /Delivery|Capacity Gap/i);
    assert.match(result.response, /investigat|evidence|uncertainty/i);
  });

  it("I contextual education teaches through the active object", () => {
    const shown = run("Show Risk.");
    const result = run("How do I use this object?", shown);
    assert.match(result.response, /Risk/i);
    assert.match(result.response, /explain|evidence|affect|investigat|ask/i);
    assert.doesNotMatch(result.response, /canonical|resolver|runtime|NCA:/i);
  });

  it("J closure selects WAIT without workflow pressure", () => {
    const shown = run("Show Delivery.");
    const result = run("Okay, I understand now.", shown);
    assert.equal(result.nxaGuidanceContract?.behavior, "WAIT");
    assert.equal(result.response, "Understood.");
    assert.doesNotMatch(result.response, /would you like|next|investigate/i);
  });

  it("K readiness stays behind existing commitment authority", () => {
    const shown = run("Show Delivery.");
    const advised = run("What should I do?", shown);
    const result = run("Let's do that.", advised);
    assert.notEqual(result.decisionCommitmentResult?.status, "applied");
    assert.doesNotMatch(result.response, /decision (?:is |was )?approved|execution started/i);
    assert.equal(result.nxaGuidanceContract?.managerAuthorityPreserved, true);
  });

  it("L guidance remains object-generic", () => {
    for (const name of ["Delivery", "Capacity Gap", "Risk", "Capacity Expansion Plan", "Close Capacity Gap"]) {
      const result = run(`Explain ${name}.`);
      assert.equal(result.nxaGuidanceContract?.identity, "NXA:2/ExecutiveConversationGuidanceProductiveDialogue");
    }
  });
});
