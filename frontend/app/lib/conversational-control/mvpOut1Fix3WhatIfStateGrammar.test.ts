/**
 * MVP-OUT:1-FIX3 — Generalized What-If state-change grammar.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { parseNexoraWhatIfUtterance } from "./conversationalWhatIfStateGrammar.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
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
    messageIdSeed: `fix3-${utterance}`,
    scenarioSession: (options?.scenarioSession as never) ?? undefined,
  });
}

const LATE_VARIANTS = [
  "what if delivery is late",
  "what if delivery be late",
  "what if delivery be too late",
  "what if delivery gets delayed",
  "what if delivery becomes very late",
] as const;

test("grammar converges late/delayed variants onto delay without magnitude", () => {
  for (const utterance of LATE_VARIANTS) {
    const parsed = parseNexoraWhatIfUtterance(utterance);
    assert.ok(parsed, utterance);
    assert.equal(parsed?.subjectRaw, "delivery");
    assert.equal(parsed?.actionKind, "delay");
    assert.equal(parsed?.direction, "delay");
    assert.equal(parsed?.magnitude, null);
    const intent = resolveNexoraConversationalIntent({ utterance });
    assert.equal(intent.intent.kind, "explore-scenario");
    assert.equal(intent.intent.scenarioPayload?.actionKind, "delay");
    assert.equal(intent.intent.scenarioPayload?.value, undefined);
  }
  assert.equal(
    parseNexoraWhatIfUtterance("what if delivery be too late")?.intensity,
    "too",
  );
  assert.equal(
    parseNexoraWhatIfUtterance("what if delivery becomes very late")?.intensity,
    "very",
  );
});

test("show delivery then what if delivery be too late is recognized unsupported", () => {
  const focus = run("show delivery");
  assert.match(focus.response, /Focused on Delivery/i);
  const result = run("what if delivery be too late", {
    state: focus.nextRuntimeState,
    executiveContext: focus.nextExecutiveContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "obj-delivery",
  );
  assert.equal(result.intentResult.intent.scenarioPayload?.state, "late");
  assert.equal(result.intentResult.intent.scenarioPayload?.intensity, "too");
  assert.equal(result.intentResult.intent.scenarioPayload?.value, undefined);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
  assert.match(result.response, /severe Delivery delay/i);
  assert.match(result.response, /On-time|projection/i);
  assert.doesNotMatch(result.response, /Customer|Revenue/i);
  assert.doesNotMatch(result.response, /\b2 days\b|\b20%/);
});

test("what if it be too late resolves Delivery from current subject", () => {
  const focus = run("show delivery");
  const late = run("what if delivery be too late", {
    state: focus.nextRuntimeState,
    executiveContext: focus.nextExecutiveContext,
    scenarioSession: focus.nextScenarioSession,
  });
  const result = run("what if it be too late", {
    state: late.nextRuntimeState,
    executiveContext: late.nextExecutiveContext,
    scenarioSession: late.nextScenarioSession,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "obj-delivery",
  );
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
  assert.match(result.response, /Delivery/i);
});

test("explicit subject beats current Delivery context", () => {
  const focus = run("show delivery");
  const result = run("what if inventory becomes too high", {
    state: focus.nextRuntimeState,
    executiveContext: focus.nextExecutiveContext,
  });
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "obj-inventory",
  );
  assert.equal(result.intentResult.intent.scenarioPayload?.actionKind, "increase-by");
  assert.equal(result.intentResult.intent.scenarioPayload?.intensity, "too");
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("capacity too low is understood and may evaluate the modeled subject", () => {
  const result = run("what if capacity gets too low");
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "obj-capacity",
  );
  assert.equal(result.intentResult.intent.scenarioPayload?.actionKind, "decrease-by");
  assert.ok(result.scenarioResult);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("revenue / margin / risk state changes are recognized", () => {
  const revenue = run("what if revenue falls");
  assert.equal(revenue.intentResult.intent.kind, "explore-scenario");
  assert.equal(
    revenue.contextResult.context.primarySubject?.subjectId,
    "obj-revenue",
  );
  assert.equal(revenue.intentResult.intent.scenarioPayload?.actionKind, "decrease-by");
  assert.doesNotMatch(revenue.response, GENERIC_FALLBACK);

  const margin = run("what if margin gets worse");
  assert.equal(margin.intentResult.intent.kind, "explore-scenario");
  assert.doesNotMatch(margin.response, GENERIC_FALLBACK);

  const risk = run("what if risk gets higher");
  assert.equal(risk.intentResult.intent.kind, "explore-scenario");
  assert.equal(risk.contextResult.context.primarySubject?.subjectId, "obj-risk");
  assert.equal(risk.intentResult.intent.scenarioPayload?.actionKind, "increase-by");
  assert.doesNotMatch(risk.response, GENERIC_FALLBACK);
});

test("unknown adjective is genuine fallback, not unsupported-model", () => {
  const result = run("what if delivery be sparkly");
  assert.notEqual(result.intentResult.intent.kind, "explore-scenario");
  assert.match(result.response, GENERIC_FALLBACK);
  assert.doesNotMatch(result.response, /supported impact model/i);
});

test("deictic too late without context does not invent Delivery", () => {
  const result = run("what if it be too late");
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.contextResult.context.primarySubject, null);
  assert.doesNotMatch(result.response, /Delivery delay/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("numeric magnitude is preserved; qualitative intensity is not numeric", () => {
  const numeric = run("what if capacity increases 10%");
  assert.equal(numeric.intentResult.intent.scenarioPayload?.value, 10);
  assert.equal(numeric.intentResult.intent.scenarioPayload?.unit, "%");
  const qualitative = run("what if delivery be too late");
  assert.equal(qualitative.intentResult.intent.scenarioPayload?.value, undefined);
  assert.equal(qualitative.intentResult.intent.scenarioPayload?.intensity, "too");
});

test("FIX3 architecture is not a Delivery sentence whitelist", () => {
  const sources = [
    "./conversationalWhatIfStateGrammar.ts",
    "./conversationalIntentResolver.ts",
    "./executiveScenarioResolver.ts",
  ];
  for (const relative of sources) {
    const text = readFileSync(new URL(relative, import.meta.url), {
      encoding: "utf8",
    });
    assert.doesNotMatch(text, /delivery be too late/i);
    assert.doesNotMatch(text, /if \(.*delivery.*too late/i);
  }
});
