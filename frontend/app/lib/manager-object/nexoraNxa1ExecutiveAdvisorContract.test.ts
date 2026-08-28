import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import {
  NEXORA_ADVISOR_ROLE,
  NEXORA_NXA1_BOUNDARY,
  inspectNxaManagerLanguage,
  verifyNexoraNxa1,
} from "./nexoraNxa1ExecutiveAdvisorContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function run(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({
      workspace: "overview", presentationState: "minimum", environmentIntent: "neutral",
    }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa1-${utterance}`,
  });
}

function safe(result: ReturnType<typeof run>) {
  const language = inspectNxaManagerLanguage(result.response);
  assert.equal(language.architectureLeak, false, result.response);
  assert.equal(language.unsupportedCausalCertainty, false, result.response);
}

describe("NXA:1 Executive Decision Advisor contract", () => {
  it("declares one policy identity over existing authorities", () => {
    assert.equal(NEXORA_ADVISOR_ROLE, "Executive Decision Advisor");
    assert.equal(NEXORA_NXA1_BOUNDARY.createsSecondIntentArchitecture, false);
    assert.equal(NEXORA_NXA1_BOUNDARY.createsSecondComposer, false);
    assert.equal(NEXORA_NXA1_BOUNDARY.createsSecondReferentStore, false);
    assert.equal(verifyNexoraNxa1().ok, true);
  });

  it("knowledge need outranks recognized object and does not navigate", () => {
    const result = run("What is Capacity Gap?");
    assert.equal(result.nxaAdvisorContract?.need, "KNOW");
    assert.equal(result.nxaAdvisorContract?.navigationAllowed, false);
    assert.equal(result.shouldCommitRuntime, false);
    assert.doesNotMatch(result.response, /^(?:Focused|Showing)\b/i);
    assert.match(result.response, /Capacity Gap/i);
    assert.doesNotMatch(result.response, /recommendation remains|recommend investigating/i);
    safe(result);
  });

  it("explicit navigation remains authorized", () => {
    const result = run("Show Capacity Gap.");
    assert.equal(result.nxaAdvisorContract?.need, "NAVIGATE");
    assert.equal(result.nxaAdvisorContract?.navigationAllowed, true);
    assert.match(result.nextRuntimeState.focusedSubject?.id ?? "", /capacity/i);
  });

  it("pronoun follow-up preserves Delivery", () => {
    const shown = run("Show Delivery.");
    const explained = run("Explain it.", shown);
    assert.equal(explained.nxaAdvisorContract?.need, "UNDERSTAND");
    assert.match(explained.nxaAdvisorContract?.referentName ?? "", /Delivery/i);
    assert.match(explained.response, /Delivery/i);
    safe(explained);
  });

  it("investigation and advice preserve evidence limits", () => {
    const shown = run("Show Delivery.");
    const why = run("Why is Delivery below target?", shown);
    assert.equal(why.nxaAdvisorContract?.need, "INVESTIGATE");
    assert.equal(why.nxaAdvisorContract?.evidenceRequired, true);
    safe(why);
    const advice = run("What should I do about it?", why);
    assert.equal(advice.nxaAdvisorContract?.need, "ADVISE");
    assert.ok(advice.response.length > 12);
    safe(advice);
  });

  it("rejects unsupported causal certainty", () => {
    const shown = run("Show Delivery.");
    const result = run("Is Capacity definitely causing the Delivery problem?", shown);
    assert.equal(result.shouldCommitRuntime, false);
    assert.equal(result.nextRuntimeState.focusedSubject?.id, shown.nextRuntimeState.focusedSubject?.id);
    assert.notEqual(inspectNxaManagerLanguage(result.response).unsupportedCausalCertainty, true);
    assert.match(result.response, /evidence|confirm|associated|connected|not enough/i);
  });

  it("teaches how Nexora helps without architecture leakage", () => {
    const shown = run("Show Delivery.");
    const result = run("How can you help me with this?", shown);
    assert.equal(result.nxaAdvisorContract?.need, "LEARN_NEXORA");
    assert.match(result.response, /explain|evidence|recommend|investigat|goal|outcome/i);
    safe(result);
  });

  it("keeps the active Problem collection for prioritization", () => {
    const collection = run("Show all problems.");
    const result = run("Which one should I investigate first?", collection);
    assert.equal(result.nxaAdvisorContract?.referentSource, "NCA2_ACTIVE_COLLECTION");
    assert.ok((result.nxaAdvisorContract?.collectionMemberIds.length ?? 0) >= 2);
    assert.match(result.response, /Capacity Gap|Margin Pressure/i);
    safe(result);
  });

  it("is generic across registered executive objects", () => {
    for (const name of ["Delivery", "Capacity", "Risk", "Goal"]) {
      const result = run(`Explain ${name}.`);
      assert.equal(result.nxaAdvisorContract?.need, "UNDERSTAND");
      assert.equal(result.nxaAdvisorContract?.navigationAllowed, false);
      safe(result);
    }
  });
});
