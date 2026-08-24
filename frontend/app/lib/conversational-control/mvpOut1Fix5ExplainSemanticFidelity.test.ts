/**
 * MVP-OUT:1-FIX5 — Explain intent semantic fidelity & Scenario explanation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const GENERIC_FALLBACK =
  /I’m not sure how that relates to the current executive context/;
const INVESTIGATE = /Investigate Demand Surge/i;
const SCENARIO_FIRST = /Scenario:\s*Demand Surge/i;
const ACTION_LEAD =
  /^(?:Investigate|Consider|Prioritize|Take action|Review)\b/i;

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  options?: {
    readonly state?: ReturnType<typeof initialState>;
    readonly executiveContext?: ReturnType<
      typeof createEmptyNexoraExecutiveContextSnapshot
    >;
    readonly scenarioSession?: unknown;
    readonly advisorGrounding?: {
      readonly experienceAnswers?: Readonly<Record<string, string>>;
    };
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: options?.executiveContext ?? null,
    conversationContext: Object.freeze({
      currentSubjectId:
        options?.executiveContext?.currentSubject?.subjectId ?? null,
      previousSubjectIds: Object.freeze(
        (options?.executiveContext?.previousSubjects ?? []).map(
          (item) => item.subjectId,
        ),
      ),
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: options?.state ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    messageIdSeed: `fix5-${utterance}`,
    scenarioSession: (options?.scenarioSession as never) ?? undefined,
    advisorGrounding: options?.advisorGrounding as never,
  });
}

function assertScenarioExplanation(result: ReturnType<typeof run>) {
  assert.equal(result.intentResult.intent.kind, "explain-scenario");
  assert.equal(
    result.intentResult.intent.scenarioPayload?.operation,
    "describe",
  );
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "ctx-scenario-demand",
  );
  assert.match(result.response, SCENARIO_FIRST);
  assert.doesNotMatch(result.response, INVESTIGATE);
  assert.doesNotMatch(result.response, ACTION_LEAD);
  assert.match(result.response, /not an observed outcome/i);
  assert.doesNotMatch(result.response, /causes Delivery delays/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
}

test("A — explain Demand Surge is Scenario explanation first", () => {
  const result = run("explain DEMAND SURGE");
  assertScenarioExplanation(result);
  assert.equal(
    result.nextExecutiveContext.currentScenario?.subjectId,
    "ctx-scenario-demand",
  );
});

test("B — what is Demand Surge is Scenario explanation", () => {
  assertScenarioExplanation(run("what is Demand Surge?"));
});

test("C — describe Demand Surge is Scenario explanation", () => {
  assertScenarioExplanation(run("describe Demand Surge"));
});

test("D — tell me about Demand Surge is Scenario explanation", () => {
  assertScenarioExplanation(run("tell me about Demand Surge"));
});

test("E — show Delivery then explain Demand Surge keeps explicit Scenario", () => {
  const delivery = run("show me delivery");
  assert.match(delivery.response, /Focused on Delivery/i);
  const result = run("explain DEMAND SURGE", {
    state: delivery.nextRuntimeState,
    executiveContext: delivery.nextExecutiveContext,
    scenarioSession: delivery.nextScenarioSession,
  });
  assertScenarioExplanation(result);
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "ctx-scenario-demand",
  );
  assert.notEqual(
    result.contextResult.context.primarySubject?.subjectId,
    "obj-delivery",
  );
});

test("F — what could be affected? continues the Scenario", () => {
  const first = run("explain DEMAND SURGE");
  const second = run("what could be affected?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.equal(second.intentResult.intent.kind, "explain-scenario");
  assert.equal(
    second.intentResult.intent.scenarioPayload?.operation,
    "affected",
  );
  assert.equal(
    second.nextExecutiveContext.currentScenario?.subjectId,
    "ctx-scenario-demand",
  );
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
  assert.match(second.response, /associates|affected|projection/i);
});

test("G — what risks? uses existing Risk/Scenario authority", () => {
  const first = run("explain DEMAND SURGE");
  const second = run("what risks?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.equal(second.intentResult.intent.kind, "explain-scenario");
  assert.equal(
    second.intentResult.intent.scenarioPayload?.operation,
    "downside",
  );
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
  assert.match(second.response, /Risk/i);
});

test("H — how sure are you? stays epistemic", () => {
  const first = run("explain DEMAND SURGE");
  const second = run("how sure are you?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
    advisorGrounding: {
      experienceAnswers: {
        confidence:
          "Nexora does not currently have validated evidence for that claim.",
      },
    },
  });
  assert.doesNotMatch(second.response, /did the decision work/i);
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
  assert.match(second.response, /scenario|projection|confidence|model/i);
});

test("I — why? is grounded explanation without causal invention", () => {
  const first = run("explain DEMAND SURGE");
  const second = run("why?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.equal(second.intentResult.intent.kind, "explain-scenario");
  assert.notEqual(
    second.intentResult.intent.scenarioPayload?.operation,
    "describe",
  );
  assert.doesNotMatch(second.response, /causes Delivery delays/i);
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
  assert.match(second.response, /associates|modeled|not a proven causal/i);
});

test("J — what do you recommend? after explain uses recommendation authority", () => {
  const first = run("explain DEMAND SURGE");
  const second = run("what do you recommend?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.equal(second.intentResult.intent.kind, "recommend");
  assert.match(second.response, /Recommend|Investigate|consider/i);
});

test("K — what do you recommend about Demand Surge is recommendation-first", () => {
  const result = run("what do you recommend about Demand Surge?");
  assert.equal(result.intentResult.intent.kind, "recommend");
  assert.notEqual(
    result.intentResult.intent.scenarioPayload?.operation,
    "describe",
  );
  assert.doesNotMatch(result.response, /^Scenario:\s*Demand Surge/i);
  assert.match(result.response, /Recommend|Investigate/i);
});

test("L — should we prioritize Demand Surge is CORE-INT:4 priority path", () => {
  const result = run("should we prioritize Demand Surge?");
  assert.equal(result.intentResult.intent.kind, "prioritize");
  assert.notEqual(result.intentResult.intent.kind, "explain-scenario");
});

test("M — trade-offs of Demand Surge is not Scenario describe", () => {
  const result = run("what are the trade-offs of Demand Surge?");
  assert.notEqual(
    result.intentResult.intent.scenarioPayload?.operation,
    "describe",
  );
  assert.equal(result.intentResult.intent.kind, "explain");
});

test("N — what happened with Demand Surge is not Scenario explain", () => {
  const result = run("what happened with Demand Surge?");
  assert.equal(result.intentResult.intent.kind, "execution-status");
  assert.notEqual(
    result.intentResult.intent.scenarioPayload?.operation,
    "describe",
  );
  assert.doesNotMatch(result.response, /^Scenario:\s*Demand Surge/i);
});

test("O — what happens if demand increases remains What-If", () => {
  const result = run("what happens if demand increases?");
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
});

test("P — FIX4 delivery too late remains green", () => {
  const delivery = run("show me delivery");
  const result = run("what if delivery be too late", {
    state: delivery.nextRuntimeState,
    executiveContext: delivery.nextExecutiveContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.match(result.response, /On-time|projection/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("Q — explain Purple Dragon is honest not-found", () => {
  const result = run("explain Purple Dragon");
  assert.equal(result.contextResult.context.resolutionStatus, "not-found");
  assert.match(result.response, /couldn'?t find|Purple Dragon/i);
  assert.doesNotMatch(result.response, /is a scenario/i);
});

test("R — weak-evidence Scenario explanation preserves uncertainty", () => {
  const result = run("explain DEMAND SURGE");
  assert.match(result.response, /not a proven causal finding|uncertain/i);
});

test("S — Scenario explanation does not claim causal proof", () => {
  const result = run("explain DEMAND SURGE");
  assert.doesNotMatch(result.response, /causes Delivery/i);
  assert.match(result.response, /associates|projection/i);
});

test("T — Scenario explanation does not mutate Decision/Execution/Runtime", () => {
  const first = run("explain DEMAND SURGE");
  assert.equal(first.shouldCommitRuntime, false);
  assert.equal(first.decisionCommitmentResult, null);
  const sources = [
    "./conversationalIntentResolver.ts",
    "./executiveScenarioResolver.ts",
    "./conversationalExperienceOrchestrator.ts",
  ];
  for (const relative of sources) {
    const text = readFileSync(new URL(relative, import.meta.url), {
      encoding: "utf8",
    });
    assert.doesNotMatch(text, /if \(.*demand surge/i);
    assert.doesNotMatch(text, /scenario\.name === ["']Demand Surge["']/);
    assert.doesNotMatch(text, /text === ["']explain demand surge["']/i);
  }
});

test("invariants — explain ≠ recommend/prioritize at the resolver", () => {
  assert.equal(
    resolveNexoraConversationalIntent({ utterance: "explain DEMAND SURGE" })
      .intent.kind,
    "explain",
  );
  assert.equal(
    resolveNexoraConversationalIntent({
      utterance: "what do you recommend about Demand Surge?",
    }).intent.kind,
    "recommend",
  );
  assert.equal(
    resolveNexoraConversationalIntent({
      utterance: "should we prioritize Demand Surge?",
    }).intent.kind,
    "prioritize",
  );
});
