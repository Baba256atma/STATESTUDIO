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

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const scenarioIds = Object.freeze([
  "ctx-scenario-capacity",
  "ctx-scenario-demand",
  "ctx-scenario-pricing",
]);

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
    messageIdSeed: `nxa5-fix3a-${utterance}`,
  });
}

function path(utterance: string, result: Turn) {
  return projectConversationPathTrace({ utterance, inheritedSubjectId: null, result });
}

function assertReadOnlyExplainOverScenarios(utterance: string) {
  const collection = run("show scenarios");
  const explained = run(utterance, collection);
  const trace = path(utterance, explained);
  assert.equal(explained.intentResult.intent.kind, "explain-scenario");
  assert.equal(trace.canonicalReference, "ctx-scenario-demand");
  assert.equal(explained.commandResult?.command?.kind, "explain-scenario");
  assert.equal(trace.readWrite, "read");
  assert.equal(trace.dirInstruction, "NO_CHANGE");
  assert.equal(trace.stageMode, "collection");
  assert.equal(trace.focusId, null);
  assert.deepEqual(trace.collectionMemberIds, scenarioIds);
  assert.equal(explained.shouldCommitRuntime, false);
  assert.match(explained.response, /^Scenario:\s*Demand Surge\./i);
  assert.doesNotMatch(explained.response, /^Focused on Demand Surge\./i);
  return explained;
}

describe("NXA:5-FIX3A knowledge-verb recovery and Focus protection", () => {
  it("A1/A2 — typo and correct spelling converge on read-only Explain", () => {
    const typo = assertReadOnlyExplainOverScenarios("exlpain Demand Surge");
    const control = assertReadOnlyExplainOverScenarios("explain Demand Surge");
    assert.equal(typo.response, control.response);
    assert.equal(
      resolveNexoraConversationalIntent({ utterance: "exlpain Demand Surge" }).intent
        .normalizedUtterance,
      "explain demand surge",
    );
  });

  it("A3 — recovered deictic Explain preserves Stage when the reference is ambiguous", () => {
    const explained = assertReadOnlyExplainOverScenarios("explain Demand Surge");
    const deictic = run("exlpain it", explained);
    const trace = path("exlpain it", deictic);
    assert.equal(deictic.intentResult.intent.kind, "explain-scenario");
    assert.equal(trace.canonicalReference, null);
    assert.equal(trace.readWrite, "read");
    assert.equal(trace.dirInstruction, "NO_CHANGE");
    assert.equal(trace.stageMode, "collection");
    assert.deepEqual(trace.collectionMemberIds, scenarioIds);
    assert.doesNotMatch(deictic.response, /^Focused on /i);
  });

  it("A4/A6 — explicit and entity-only navigation retain their certified behavior", () => {
    for (const utterance of ["show Demand Surge", "Demand Surge"]) {
      const collection = run("show scenarios");
      const focused = run(utterance, collection);
      const trace = path(utterance, focused);
      assert.equal(trace.resolvedIntent, "focus");
      assert.equal(trace.focusId, "ctx-scenario-demand");
      assert.equal(trace.stageMode, "focus");
      assert.equal(trace.readWrite, "write");
    }
  });

  it("A5/A8 — unknown actions with a resolved entity neither Focus nor write", () => {
    for (const utterance of ["frobnicate Demand Surge", "complain Demand Surge"]) {
      const collection = run("show scenarios");
      const unknown = run(utterance, collection);
      const trace = path(utterance, unknown);
      assert.equal(resolveNexoraConversationalIntent({ utterance }).intent.kind, "unknown");
      assert.equal(unknown.naturalLanguageUnderstanding.objectReference?.canonicalName, "Demand Surge");
      assert.notEqual(trace.resolvedIntent, "focus");
      assert.equal(trace.dirInstruction, "NO_CHANGE");
      assert.equal(trace.stageMode, "collection");
      assert.equal(trace.focusId, null);
      assert.deepEqual(trace.collectionMemberIds, scenarioIds);
      assert.equal(unknown.shouldCommitRuntime, false);
      assert.doesNotMatch(unknown.response, /^Focused on /i);
    }
  });

  it("A7 — recovered Explain is generic for the registered Capacity Gap Problem", () => {
    const result = run("exlpain Capacity Gap");
    const trace = path("exlpain Capacity Gap", result);
    assert.equal(result.intentResult.intent.kind, "explain");
    assert.equal(trace.canonicalReference, "ctx-problem-capacity");
    assert.equal(result.commandResult?.command?.kind, "request-explanation");
    assert.equal(result.managerObjectTurn.intent, "EXPLAIN");
    assert.equal(trace.readWrite, "read");
    assert.equal(trace.dirInstruction, "NO_CHANGE");
    assert.equal(result.shouldCommitRuntime, false);
    assert.doesNotMatch(result.response, /^Focused on /i);
  });
});
