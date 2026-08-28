import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectConversationPathTrace } from "../nexora-certification/nxaConversationPathTrace.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  classifyRequestStageRelationship,
  composeStageSceneExplanation,
  isCollectionConfirmation,
  isExplicitPresentationRequest,
  isStageMetaUtterance,
  projectAuthoritativeStageContext,
  verifyNexoraNxa5Fix4,
} from "./nexoraNxa5Fix4StageContextIntelligence.ts";

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
    messageIdSeed: `nxa5-fix4-${utterance}`,
  });
}

function path(utterance: string, result: Turn) {
  return projectConversationPathTrace({ utterance, inheritedSubjectId: null, result });
}

describe("NXA:5-FIX4 Advisor↔Stage context intelligence", () => {
  it("owns a read-model boundary without a Stage store", () => {
    assert.equal(verifyNexoraNxa5Fix4().ok, true);
    assert.equal(isStageMetaUtterance("what is on stage?"), true);
    assert.equal(isExplicitPresentationRequest("show Capacity", "focus"), true);
    assert.equal(isExplicitPresentationRequest("what is Capacity?", "focus"), false);
    assert.equal(isCollectionConfirmation("I am talking about Scenarios"), true);
  });

  it("projects authoritative Stage context from runtime collection state", () => {
    const shown = run("show me scenarios");
    const stage = projectAuthoritativeStageContext({
      runtimeState: shown.nextRuntimeState,
      catalog,
    });
    assert.equal(stage.presentationType, "COLLECTION");
    assert.equal(stage.collection?.kind, "scenario");
    assert.deepEqual(stage.collection?.members.map((item) => item.label).sort(), [
      "Capacity Expansion Plan",
      "Demand Surge",
      "Pricing Response",
    ].sort());
    assert.match(composeStageSceneExplanation(stage), /Demand Surge/);
  });

  it("keeps Scenario comparison on Stage and asks a criterion instead of generic business-outcome advice", () => {
    const shown = run("show me scenarios");
    const asked = run("which one is more important for business?", shown);
    assert.equal(asked.nextRuntimeState.collectionContext?.category, "scenario");
    assert.equal(asked.nextRuntimeState.focusedSubject, null);
    assert.doesNotMatch(asked.response, /which business outcome/i);
    assert.doesNotMatch(asked.response, /temporary capacity/i);
    assert.match(asked.response, /Important in which sense/i);
    assert.equal(path("which one is more important for business?", asked).dirInstruction, "NO_CHANGE");
  });

  it("treats talking about the presented collection as confirmation, not a missing outcome", () => {
    const shown = run("show me scenarios");
    const asked = run("which one is more important for business?", shown);
    const confirmed = run("I am talking about Scenarios", asked);
    assert.equal(confirmed.nextRuntimeState.collectionContext?.category, "scenario");
    assert.doesNotMatch(confirmed.response, /which business outcome/i);
    assert.match(confirmed.response, /Scenario/i);
    assert.equal((confirmed.managerObjectTurn.session.managerObservations ?? []).length, 0);
  });

  it("completes a pending criterion instead of navigating to Capacity", () => {
    const shown = run("show me scenarios");
    const asked = run("which one is more important?", shown);
    const confirmed = run("I am talking about Scenarios", asked);
    const risk = run("risk", confirmed);
    assert.notEqual(risk.nextRuntimeState.focusedSubject?.label, "Capacity");
    assert.notEqual(risk.nextRuntimeState.focusedSubject?.label, "Risk");
    assert.equal(risk.nextRuntimeState.collectionContext?.category, "scenario");
    assert.doesNotMatch(risk.response, /^Focused on /i);
    assert.equal(risk.ncaPost4Comparison?.criterion, "RISK");
    const capacity = run("capacity", confirmed);
    assert.notEqual(capacity.nextRuntimeState.focusedSubject?.label, "Capacity");
    assert.equal(capacity.nextRuntimeState.collectionContext?.category, "scenario");
  });

  it("resolves compare them against the presented collection without mutating Stage", () => {
    const shown = run("show scenarios");
    const members = shown.nextRuntimeState.collectionContext?.objectIds ?? [];
    const compared = run("compare them", shown);
    assert.deepEqual(compared.nextRuntimeState.collectionContext?.objectIds, members);
    assert.match(compared.response, /Capacity Expansion Plan|Demand Surge|Pricing Response/i);
  });

  it("describes the Stage scene without mutating it", () => {
    const shown = run("show problems");
    const members = shown.nextRuntimeState.collectionContext?.objectIds ?? [];
    const described = run("what am I looking at?", shown);
    assert.deepEqual(described.nextRuntimeState.collectionContext?.objectIds, members);
    assert.match(described.response, /Problem/i);
    assert.equal(described.shouldCommitRuntime, false);
    assert.equal((described.managerObjectTurn.session.managerObservations ?? []).length, 0);
  });

  it("explains why visible members are present without causal invention", () => {
    const shown = run("show executions");
    const why = run("why are these here?", shown);
    assert.equal(why.nextRuntimeState.collectionContext?.category, "execution");
    assert.match(why.response, /Execution|presented|collection/i);
    assert.doesNotMatch(why.response, /\bcauses the\b/i);
  });

  it("can discuss an off-stage object without replacing the Scenario Stage", () => {
    const shown = run("show scenarios");
    const asked = run("what is Capacity?", shown);
    assert.equal(asked.nextRuntimeState.collectionContext?.category, "scenario");
    assert.equal(asked.nextRuntimeState.focusedSubject, null);
    assert.match(asked.response, /Capacity/i);
    assert.match(asked.response, /Stage if you want/i);
  });

  it("updates Stage on explicit presentation and honors consent yes/no", () => {
    const shown = run("show scenarios");
    const asked = run("what is Capacity?", shown);
    const declined = run("no", asked);
    assert.equal(declined.nextRuntimeState.collectionContext?.category, "scenario");
    const askedAgain = run("what is Capacity?", shown);
    const accepted = run("yes", askedAgain);
    assert.equal(accepted.nextRuntimeState.focusedSubject?.label, "Capacity");
    const explicit = run("show Capacity", shown);
    assert.equal(explicit.nextRuntimeState.focusedSubject?.label, "Capacity");
    const focusedScene = run("what is on stage now?", explicit);
    assert.doesNotMatch(focusedScene.response, /resolved-object|already-focused/i);
    assert.match(focusedScene.response, /Capacity/);
    const restored = run("go back to scenarios", explicit);
    assert.equal(restored.nextRuntimeState.collectionContext?.category, "scenario");
    assert.equal(restored.nextRuntimeState.focusedSubject, null);
  });

  it("still lets a named visible member be focused and lets a new collection command escape", () => {
    const shown = run("show scenarios");
    const surge = run("Demand Surge", shown);
    assert.equal(surge.nextRuntimeState.focusedSubject?.label, "Demand Surge");
    const pending = run("which one is more important?", shown);
    const problems = run("show problems", pending);
    assert.equal(problems.nextRuntimeState.collectionContext?.category, "problem");
  });

  it("classifies Stage-meta separately from explicit presentation", () => {
    const shown = run("show decisions");
    const stage = projectAuthoritativeStageContext({ runtimeState: shown.nextRuntimeState, catalog });
    assert.equal(
      classifyRequestStageRelationship({
        utterance: "explain the stage",
        intentKind: "unknown",
        stage,
        pendingCriterion: false,
        pendingConsent: null,
      }),
      "STAGE_META",
    );
    assert.equal(
      classifyRequestStageRelationship({
        utterance: "show Capacity",
        intentKind: "focus",
        stage,
        pendingCriterion: false,
        pendingConsent: null,
      }),
      "EXPLICIT_PRESENTATION",
    );
  });
});
