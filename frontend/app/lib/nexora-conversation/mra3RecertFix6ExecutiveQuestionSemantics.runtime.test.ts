/** MRA:3-RECERT-FIX6 — executive question semantics and advisory purpose. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function createJourney() {
  const decisionRuntime = createNexoraCanonicalDecisionRuntime();
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
  });
  let previous: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
  const run = (utterance: string) => {
    previous = executeNexoraConversationalExperience({
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
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      allowActiveStageContext: false,
      messageIdSeed: `fix6-${utterance}`,
    });
    return previous;
  };
  return { decisionRuntime, executionRuntime, run };
}

describe("MRA:3-RECERT-FIX6 executive advisory purpose", () => {
  it("A routes a constrained readiness question without starting Execution", () => {
    const journey = createJourney();
    journey.run("Demand Surge");
    journey.run("Approve Demand Surge.");
    const result = journey.run("Don't start anything yet. Are we ready to execute?");

    assert.equal(result.intentResult.intent.kind, "execution-status");
    assert.match(result.response, /Decision is committed|readiness|ready|not ready/i);
    assert.doesNotMatch(result.response, /unsupported|scenario projection/i);
    assert.equal(journey.executionRuntime.listExecutions().length, 0);
    assert.equal(result.ecaExecutionReadinessJudgment?.implicitStart, false);
  });

  it("B answers monitoring purpose without stale Scenario or fabricated data", () => {
    const journey = createJourney();
    journey.run("Capacity Expansion");
    const result = journey.run("What data would you want to see while execution is running?");

    assert.equal(result.intentResult.intent.kind, "evidence");
    assert.match(result.response, /Available now:|Useful to collect|Unknown or unconfirmed/i);
    assert.match(result.response, /progress|blockers|Outcome observations/i);
    assert.doesNotMatch(result.response, /scenario projection|investigat(?:e|ion) Capacity Expansion/i);
  });

  it("C explains Outcome success criteria without claiming causality", () => {
    const journey = createJourney();
    journey.run("Demand Surge");
    journey.run("Approve Demand Surge.");
    const result = journey.run("How would you know the decision is working?");

    assert.match(result.response, /post-start observations|baseline|target/i);
    assert.match(result.response, /not by itself prove|does not by itself prove/i);
    assert.doesNotMatch(result.response, /scenario projection|investigation response/i);
  });

  it("D preserves causal safety and avoids a CSV calculation detour", () => {
    const journey = createJourney();
    journey.run("Demand Surge");
    journey.run("Approve Demand Surge.");
    const result = journey.run("If the KPI improves, does that prove our decision caused it?");

    assert.equal(result.intentResult.intent.kind, "evidence");
    assert.match(result.response, /doesn.t establish|does not by itself prove|not.*causality/i);
    assert.match(result.response, /other factors|alternative explanations|temporal sequence/i);
    assert.doesNotMatch(result.response, /calculate|average|CSV field/i);
  });

  it("E recovers the uniquely defensible earlier Problem", () => {
    const journey = createJourney();
    journey.run("Margin Pressure");
    journey.run("Demand Surge");
    const result = journey.run("Go back to the issue we discussed at the beginning. Has your view changed?");

    assert.equal(result.contextualManagerMeaning.objectReference?.canonicalName, "Margin Pressure");
    assert.equal(result.nextExecutiveContext.currentSubject?.canonicalName, "Margin Pressure");
    assert.match(result.response, /Returning to Margin Pressure/i);
  });

  it("F asks the smallest useful clarification for ambiguous earlier Problems", () => {
    const journey = createJourney();
    journey.run("Margin Pressure");
    journey.run("Capacity Gap");
    journey.run("Demand Surge");
    const result = journey.run("Go back to the issue we discussed earlier. Has your view changed?");

    assert.match(result.response, /Which earlier issue do you mean:.*Margin Pressure.*Capacity Gap/i);
    assert.doesNotMatch(result.response, /Decision.*Execution.*which/i);
  });

  it("G produces at most three current-state executive points", () => {
    const journey = createJourney();
    journey.run("Capacity Expansion");
    const result = journey.run("What are the three things I should know before I leave this screen?");

    assert.match(result.response, /1\. .*2\. .*3\./);
    assert.equal((result.response.match(/(?:^|\s)[1-9]\./g) ?? []).length, 3);
    assert.doesNotMatch(result.response, /UNSPECIFIED|scenario projection|investigat(?:e|ion) Capacity Expansion/i);
  });

  it("H distinguishes listed/planned Execution objects from active canonical Execution", () => {
    const journey = createJourney();
    const result = journey.run("Show me current Executions.");

    assert.match(result.response, /planned or catalog records|no canonical Execution is active/i);
    assert.doesNotMatch(result.response, /Current Executions:.*Execution is not live yet/i);
    assert.equal(journey.executionRuntime.listExecutions().length, 0);
  });

  it("I preserves FIX5, referent fidelity, CC:10, and CC:11 boundaries", () => {
    const journey = createJourney();
    journey.run("My goal is to improve delivery reliability.");
    const goal = journey.run("What is our main goal?");
    assert.match(goal.response, /main goal.*improve delivery reliability/i);

    journey.run("Demand Surge");
    const more = journey.run("tell me more about it");
    assert.equal(more.nextExecutiveContext.currentSubject?.canonicalName, "Demand Surge");
    const investigate = journey.run("investigate it");
    assert.equal(investigate.nextExecutiveContext.currentSubject?.canonicalName, "Demand Surge");

    journey.run("Approve Demand Surge.");
    assert.equal(journey.decisionRuntime.adapter.listDecisions().length, 1);
    assert.equal(journey.executionRuntime.listExecutions().length, 0);
    journey.run("Don't start anything yet. Are we ready to execute?");
    assert.equal(journey.executionRuntime.listExecutions().length, 0);
  });
});
