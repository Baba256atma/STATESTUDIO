/**
 * MVP-OUT:1-FIX2 — Scenario follow-up context and What-If continuity.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import { freezeExecutiveContextReference } from "./executiveContextSnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const GENERIC_FALLBACK =
  /I’m not sure how that relates to the current executive context/;

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
    messageIdSeed: `fix2-${utterance}`,
    scenarioSession:
      (options?.scenarioSession as never) ??
      undefined,
    advisorGrounding: options?.advisorGrounding as never,
  });
}

function demandSurgeContext() {
  const ref = freezeExecutiveContextReference({
    subjectId: "ctx-scenario-demand",
    subjectKind: "scenario",
    canonicalName: "Demand Surge",
    source: "conversation",
    turnIndex: 1,
  });
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: ref,
    currentScenario: ref,
  });
}

test("A — What is Demand Surge Scenario is named Scenario explanation", () => {
  const result = run("what is DEMAND SURGE SCENARIO ?");
  assert.equal(result.intentResult.intent.kind, "explain-scenario");
  assert.equal(result.intentResult.intent.scenarioPayload?.operation, "describe");
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "ctx-scenario-demand",
  );
  assert.match(result.response, /Scenario:\s*Demand Surge/i);
  assert.doesNotMatch(result.response, /Investigate Demand Surge/i);
  assert.match(result.response, /not an observed outcome/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("B — follow-up What-If preserves Demand Surge", () => {
  const first = run("What is Demand Surge Scenario?");
  const second = run("What if Delivery is late?", {
    state: first.nextRuntimeState,
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.equal(second.intentResult.intent.kind, "explore-scenario");
  assert.equal(second.intentResult.intent.scenarioPayload?.actionKind, "delay");
  assert.equal(
    first.nextExecutiveContext.currentScenario?.subjectId,
    "ctx-scenario-demand",
  );
  assert.equal(
    second.nextExecutiveContext.currentScenario?.subjectId,
    "ctx-scenario-demand",
  );
  assert.ok(second.scenarioResult);
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
  assert.match(second.response, /Demand Surge/i);
});

test("C — misspelling delivery be late is recognized", () => {
  const first = run("What is Demand Surge Scenario?");
  const second = run("what if delivery be late ?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
    state: first.nextRuntimeState,
  });
  assert.equal(second.intentResult.intent.kind, "explore-scenario");
  assert.equal(second.intentResult.intent.scenarioPayload?.actionKind, "delay");
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
});

test("D — Stage/conversation Scenario context then delayed Delivery", () => {
  const result = run("What if Delivery is delayed?", {
    executiveContext: demandSurgeContext(),
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
  assert.match(result.response, /Demand Surge|supported impact model/i);
});

test("E — conversational name only, no Stage click", () => {
  const first = run("What is Demand Surge Scenario?");
  assert.equal(first.shouldCommitRuntime, false);
  const second = run("What if Delivery is late?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
    state: initialState(),
  });
  assert.equal(
    first.nextExecutiveContext.currentScenario?.subjectId,
    "ctx-scenario-demand",
  );
  assert.equal(second.intentResult.intent.kind, "explore-scenario");
});

test("F — no Scenario context does not invent Demand Surge", () => {
  const result = run("What if Delivery is late?");
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.doesNotMatch(result.response, /Demand Surge/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("G — ambiguous previous Scenarios are not guessed", () => {
  const ctx = createEmptyNexoraExecutiveContextSnapshot({
    previousSubjects: Object.freeze([
      freezeExecutiveContextReference({
        subjectId: "ctx-scenario-demand",
        subjectKind: "scenario",
        canonicalName: "Demand Surge",
        source: "conversation",
        turnIndex: 1,
      }),
      freezeExecutiveContextReference({
        subjectId: "ctx-scenario-pricing",
        subjectKind: "scenario",
        canonicalName: "Pricing Response",
        source: "conversation",
        turnIndex: 0,
      }),
    ]),
  });
  const result = run("What if it is delayed?", { executiveContext: ctx });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.contextResult.context.primarySubject, null);
});

test("H — What happened remains Outcome path", () => {
  const result = run("What happened?");
  assert.notEqual(result.intentResult.intent.kind, "explore-scenario");
});

test("I — What happened if Delivery is late is Scenario", () => {
  const result = run("What happened if Delivery is late?");
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
});

test("J — unsupported Delivery delay is honest", () => {
  const first = run("What is Demand Surge Scenario?");
  const second = run("What if Delivery is late?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.match(second.response, /On-time|projection/i);
  assert.doesNotMatch(second.response, GENERIC_FALLBACK);
  assert.doesNotMatch(second.response, /\b2 days\b|\b5 days\b|\b20%/);
});

test("K — supported modifier still evaluates CC:9", () => {
  const capacity = run("Focus on Capacity");
  const result = run("What happens if I increase capacity?", {
    state: capacity.nextRuntimeState,
    executiveContext: capacity.nextExecutiveContext,
  });
  assert.ok(result.scenarioResult);
  assert.notEqual(result.scenarioResult?.status, "unsupported");
});

test("L/M — no invented delay magnitude; 2 days does not become Demand Surge", () => {
  const first = run("What is Demand Surge Scenario?");
  const second = run("What if Delivery is late?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.equal(second.intentResult.intent.scenarioPayload?.value, undefined);
  const third = run("2 days", {
    executiveContext: second.nextExecutiveContext,
    scenarioSession: second.nextScenarioSession,
  });
  assert.doesNotMatch(third.response, /Demand Surge explores/i);
});

test("N — What risk does that create stays on Scenario", () => {
  const first = run("What is Demand Surge Scenario?");
  const second = run("What if Delivery is late?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  const third = run("What risk does that create?", {
    executiveContext: second.nextExecutiveContext,
    scenarioSession: second.nextScenarioSession,
  });
  assert.equal(third.intentResult.intent.kind, "explain-scenario");
  assert.doesNotMatch(third.response, GENERIC_FALLBACK);
});

test("O — How sure are you uses Scenario confidence, not Outcome", () => {
  const first = run("What is Demand Surge Scenario?");
  const second = run("What if Delivery is late?", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  const third = run("How sure are you?", {
    executiveContext: second.nextExecutiveContext,
    scenarioSession: second.nextScenarioSession,
    advisorGrounding: {
      experienceAnswers: {
        confidence:
          "Nexora does not currently have validated evidence for that claim.",
      },
    },
  });
  assert.doesNotMatch(third.response, /did the decision work/i);
  assert.doesNotMatch(third.response, GENERIC_FALLBACK);
  assert.doesNotMatch(
    third.response,
    /^Nexora does not currently have validated evidence for that claim\.?$/,
  );
  assert.match(third.response, /scenario|projection|confidence|model/i);
});

test("P — Compare it with Pricing Response uses Scenario comparison", () => {
  const first = run("What is Demand Surge Scenario?");
  const result = run("Compare it with Pricing Response", {
    executiveContext: first.nextExecutiveContext,
    scenarioSession: first.nextScenarioSession,
  });
  assert.ok(
    result.intentResult.intent.kind === "compare" ||
      result.intentResult.intent.kind === "compare-scenarios",
  );
});

test("Q-W — explanation is not Reality; no mutations", () => {
  const first = run("What is Demand Surge Scenario?");
  assert.doesNotMatch(first.response, /\bReality\b/);
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
    assert.doesNotMatch(text, /if \(.*delivery be late/i);
    assert.doesNotMatch(text, /includes\(["']delivery be late["']\)/);
  }
});
