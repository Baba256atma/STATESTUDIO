/** MRA:3-RECERT-FIX5 — explicit manager intent and answer composition. */
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

function createJourney(
  decisionRuntime = createNexoraCanonicalDecisionRuntime(),
) {
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
      messageIdSeed: `fix5-${utterance}`,
    });
    return previous;
  };
  return { decisionRuntime, executionRuntime, run };
}

describe("MRA:3-RECERT-FIX5 explicit intent and composition", () => {
  it("lets an explicit Goal request outrank stale Scenario context", () => {
    const journey = createJourney();
    journey.run("My goal is to improve delivery reliability.");
    journey.run("Demand Surge");
    const result = journey.run(
      "Forget the scenario for a moment. What is our main goal?",
    );

    assert.equal(result.intentResult.intent.kind, "situation");
    assert.equal(result.trace.experienceLane, "goal");
    assert.match(result.response, /main goal is (?:to )?improve delivery reliability/i);
    assert.doesNotMatch(result.response, /scenario impact|scenario projection|caus/i);
  });

  it("answers Execution existence/current/progress directly before start", () => {
    const journey = createJourney();
    journey.run("Demand Surge");
    const existence = journey.run("Has execution started yet?");
    const current = journey.run("What is currently being executed?");
    const progress = journey.run("Is the execution going according to plan?");

    assert.equal(existence.intentResult.intent.kind, "execution-status");
    assert.match(existence.response, /execution has not started/i);
    assert.match(current.response, /no execution is currently active/i);
    assert.match(progress.response, /has not started.*cannot be evaluated/i);
    for (const result of [existence, current, progress]) {
      assert.doesNotMatch(
        result.response,
        /scenario impact|scenario projection|capacity expansion|capacity needs attention/i,
      );
    }
  });

  it("answers active Execution identity and progress from canonical evidence", () => {
    const journey = createJourney();
    journey.run("Demand Surge");
    journey.run("Approve Demand Surge.");
    journey.run("Start it.");
    const current = journey.run("What is currently being executed?");
    const progress = journey.run("Is the execution going according to plan?");

    assert.equal(journey.executionRuntime.listExecutions().length, 1);
    assert.equal(journey.executionRuntime.listExecutions()[0]?.status, "in-progress");
    assert.match(current.response, /approved Demand Surge decision is now being executed/i);
    assert.match(progress.response, /no authoritative progress observation/i);
    assert.doesNotMatch(progress.response, /scenario impact|scenario projection/i);
  });

  it("clarifies a Decision-relative change when canonical Decisions are ambiguous", () => {
    const decisions = createNexoraCanonicalDecisionRuntime();
    for (const [decisionId, title, scenarioId] of [
      ["decision-demand", "Demand Surge", "scenario-demand"],
      ["decision-capacity", "Capacity Expansion", "scenario-capacity"],
    ] as const) {
      decisions.adapter.transitionDecision({
        decisionId,
        action: "approve",
        title,
        scenarioId,
      });
    }
    const journey = createJourney(decisions);
    const result = journey.run("What changed since we made the decision?");

    assert.equal(result.intentResult.intent.kind, "change");
    assert.equal(decisions.adapter.listDecisions().length, 2);
    assert.match(result.response, /2 relevant Decisions.*Which one do you mean/i);
    assert.doesNotMatch(result.response, /Demand Surge|Capacity Expansion/);
  });

  it("composes one clean next action without placeholders or duplicate advice", () => {
    const journey = createJourney();
    journey.run("Demand Surge");
    const result = journey.run("What should I do next?");

    assert.equal(result.intentResult.intent.kind, "recommend");
    assert.equal(result.trace.experienceLane, "next-action");
    assert.doesNotMatch(result.response, /UNSPECIFIED|UNKNOWN|NCA|NXA|ECA|CC:\d/i);
    const sentences = result.response
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim().toLowerCase())
      .filter(Boolean);
    assert.equal(new Set(sentences).size, sentences.length);
    assert.ok(result.response.trim().length > 0);
    assert.doesNotMatch(
      result.response,
      /I don’t have enough evidence to recommend one option yet.*continue the investigation/i,
    );
  });

  it("preserves deictic fidelity and the CC:10/CC:11 boundary", () => {
    const more = createJourney();
    more.run("Demand Surge");
    const moreResult = more.run("tell me more about it");
    assert.equal(moreResult.nextExecutiveContext.currentSubject?.canonicalName, "Demand Surge");

    const investigate = createJourney();
    investigate.run("Demand Surge");
    const investigateResult = investigate.run("investigate it");
    assert.equal(
      investigateResult.nextExecutiveContext.currentSubject?.canonicalName,
      "Demand Surge",
    );

    const boundary = createJourney();
    boundary.run("Demand Surge");
    boundary.run("Approve Demand Surge.");
    assert.equal(boundary.decisionRuntime.adapter.listDecisions().length, 1);
    assert.equal(boundary.executionRuntime.listExecutions().length, 0);
    boundary.run("Start it.");
    assert.equal(boundary.executionRuntime.listExecutions().length, 1);
  });
});
