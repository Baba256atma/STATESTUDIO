/**
 * MVP-OUT:1-FIX4 — Grounded Scenario Impact Intelligence.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { assessGroundedScenarioImpact } from "./groundedScenarioImpactAssessment.ts";
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
    messageIdSeed: `fix4-${utterance}`,
    scenarioSession: (options?.scenarioSession as never) ?? undefined,
  });
}

test("A/B — Delivery severe delay reaches grounded impact", () => {
  const focus = run("show delivery");
  const result = run("what if delivery be too late", {
    state: focus.nextRuntimeState,
    executiveContext: focus.nextExecutiveContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.ok(result.scenarioResult);
  assert.notEqual(result.scenarioResult?.status, "unsupported");
  assert.match(result.response, /On-time/i);
  assert.match(result.response, /projection/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("C/D — only canonical own-KPI is returned; Customer/Revenue omitted", () => {
  const result = run("what if delivery is late");
  assert.match(result.response, /On-time/i);
  assert.doesNotMatch(result.response, /Customer/i);
  assert.doesNotMatch(result.response, /Revenue/i);
});

test("E/F — no fabricated magnitude; too remains qualitative", () => {
  const result = run("what if delivery be too late");
  assert.equal(result.intentResult.intent.scenarioPayload?.intensity, "too");
  assert.equal(result.intentResult.intent.scenarioPayload?.value, undefined);
  assert.doesNotMatch(result.response, /\b14 days\b|\b17%|\b\$100K\b|\b20%/);
});

test("O/P — Inventory increase uses the same architecture and stays unsupported", () => {
  const focus = run("show inventory");
  const result = run("what if inventory increases", {
    state: focus.nextRuntimeState,
    executiveContext: focus.nextExecutiveContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.match(result.response, /supported impact model/i);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
  assert.doesNotMatch(result.response, /holding cost|cash|availability/i);
});

test("Q — Capacity intervention still evaluates", () => {
  const capacity = run("Focus on Capacity");
  const result = run("What happens if I increase capacity?", {
    state: capacity.nextRuntimeState,
    executiveContext: capacity.nextExecutiveContext,
  });
  assert.notEqual(result.scenarioResult?.status, "unsupported");
});

test("V-Z — follow-ups preserve Scenario impact context", () => {
  const focus = run("show delivery");
  const late = run("what if delivery be too late", {
    state: focus.nextRuntimeState,
    executiveContext: focus.nextExecutiveContext,
    scenarioSession: focus.nextScenarioSession,
  });
  const affected = run("what could be affected?", {
    executiveContext: late.nextExecutiveContext,
    scenarioSession: late.nextScenarioSession,
  });
  assert.match(affected.response, /On-time/i);
  const kpi = run("which KPI?", {
    executiveContext: late.nextExecutiveContext,
    scenarioSession: late.nextScenarioSession,
  });
  assert.match(kpi.response, /On-time/i);
  const risks = run("what risks?", {
    executiveContext: late.nextExecutiveContext,
    scenarioSession: late.nextScenarioSession,
  });
  assert.match(risks.response, /Risk impact/i);
  const sure = run("how sure are you?", {
    executiveContext: late.nextExecutiveContext,
    scenarioSession: late.nextScenarioSession,
  });
  assert.match(sure.response, /projection|causal proof/i);
  const why = run("why?", {
    executiveContext: late.nextExecutiveContext,
    scenarioSession: late.nextScenarioSession,
  });
  assert.equal(why.intentResult.intent.kind, "explain-scenario");
  assert.match(why.response, /modeled relationship/i);
  assert.doesNotMatch(why.response, /caused the observed/i);
});

test("AA — same input is deterministic", () => {
  const a = run("what if delivery be too late");
  const b = run("what if delivery be too late");
  assert.equal(a.response, b.response);
});

test("AB/AC — no subject-specific hardcoded branches", () => {
  const sources = [
    "./groundedScenarioImpactAssessment.ts",
    "./executiveScenarioEvaluation.ts",
    "./executiveScenarioResolver.ts",
  ];
  for (const relative of sources) {
    const text = readFileSync(new URL(relative, import.meta.url), {
      encoding: "utf8",
    });
    assert.doesNotMatch(text, /if \(.*obj-delivery/i);
    assert.doesNotMatch(text, /if \(.*obj-inventory/i);
    assert.doesNotMatch(text, /delivery be too late/i);
  }
});

test("AD — unknown adjective remains genuine fallback", () => {
  const result = run("what if delivery be sparkly");
  assert.match(result.response, GENERIC_FALLBACK);
});

test("assessment delay without presentation KPI is unsupported", () => {
  const assessment = assessGroundedScenarioImpact({
    interventions: Object.freeze([
      Object.freeze({
        subjectId: "obj-unknown-subject",
        actionKind: "delay",
      }),
    ]),
  });
  assert.equal(assessment.supportState, "unsupported");
  assert.equal(assessment.affectedTargets.length, 0);
});
