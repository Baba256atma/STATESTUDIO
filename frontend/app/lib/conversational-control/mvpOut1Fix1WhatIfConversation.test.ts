/**
 * MVP-OUT:1-FIX1 — Natural-language What-If / Scenario conversation routing.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { normalizeNexoraConversationalUtterance } from "./conversationalIntentNormalization.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
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
    readonly context?: {
      readonly currentSubjectId?: string | null;
      readonly previousSubjectIds?: readonly string[];
      readonly presentedSubjectIds?: readonly string[];
    };
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: options?.context?.currentSubjectId ?? null,
      previousSubjectIds: Object.freeze(
        options?.context?.previousSubjectIds ?? [],
      ),
      presentedSubjectIds: Object.freeze(
        options?.context?.presentedSubjectIds ?? [],
      ),
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: options?.state ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    messageIdSeed: `fix1-${utterance}`,
  });
}

function focused(labelUtterance: string) {
  return run(labelUtterance);
}

test("FIX1 reproduce: misspelled inventory what-if is not unknown", () => {
  assert.equal(
    normalizeNexoraConversationalUtterance("what happend if increase inventory"),
    "what happened if increase inventory",
  );
  const inventory = focused("Focus on Inventory");
  const result = run("what happend if increase inventory", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.intentResult.intent.scenarioPayload?.operation, "intervention");
  assert.equal(result.intentResult.intent.scenarioPayload?.actionKind, "increase-by");
  assert.equal(result.intentResult.intent.scenarioPayload?.value, undefined);
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-inventory");
  assert.equal(result.commandResult?.command?.kind, "evaluate-scenario");
  assert.ok(result.scenarioResult);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("A — Inventory increase what-if is Scenario intent", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What happens if I increase inventory?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-inventory");
  assert.ok(result.scenarioResult);
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("B — Inventory increases phrasing", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What if inventory increases?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.intentResult.intent.scenarioPayload?.actionKind, "increase-by");
});

test("C — increase it resolves Inventory from unique context", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What happens if I increase it?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-inventory");
});

test("D — Capacity decrease is not Inventory-specialized", () => {
  const capacity = focused("Focus on Capacity");
  const result = run("What happens if I decrease capacity?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.equal(result.intentResult.intent.scenarioPayload?.actionKind, "decrease-by");
  assert.ok(result.scenarioResult);
  assert.notEqual(result.scenarioResult?.status, "unsupported");
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("E — Margin improves routes as What-If where supported", () => {
  const margin = focused("Focus on Margin Pressure");
  const result = run("What if margin improves?", {
    state: margin.nextRuntimeState,
    context: margin.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.intentResult.intent.scenarioPayload?.actionKind, "increase-by");
  assert.equal(
    result.contextResult.context.primarySubject?.subjectId,
    "ctx-problem-margin",
  );
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
});

test("F — missing magnitude does not invent a numeric change", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What happens if I increase inventory?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.scenarioPayload?.value, undefined);
  assert.doesNotMatch(result.response, /\+?\s*10\s*%/);
  assert.doesNotMatch(result.response, /\+?\s*20\s*%/);
  assert.doesNotMatch(result.response, /\$100k/i);
  const intervention = result.scenarioResult?.scenario?.interventions[0];
  assert.equal(intervention?.value, undefined);
});

test("G — supplied 10% is preserved", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What happens if Inventory increases 10%?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.intentResult.intent.scenarioPayload?.value, 10);
  assert.equal(result.intentResult.intent.scenarioPayload?.unit, "%");
  assert.equal(result.scenarioResult?.scenario?.interventions[0]?.value, 10);
});

test("H — unsupported subject/change is honest, not generic fallback", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What happens if I increase advertising?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.doesNotMatch(result.response, GENERIC_FALLBACK);
  assert.match(
    result.response,
    /couldn't find|supported impact model|don't currently have/i,
  );
});

test("I — ambiguous context does not guess a subject", () => {
  const result = run("What happens if I increase it?", {
    context: {
      currentSubjectId: null,
      previousSubjectIds: Object.freeze(["obj-inventory", "obj-capacity"]),
      presentedSubjectIds: Object.freeze(["obj-inventory", "obj-capacity"]),
    },
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.equal(result.contextResult.context.primarySubject, null);
  assert.notEqual(result.contextResult.context.resolutionStatus, "resolved");
});

test("J — Explain Inventory remains explanation", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("Explain Inventory", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explain");
  assert.notEqual(result.intentResult.intent.kind, "explore-scenario");
});

test("K — decision question is not Scenario intent", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("Do I need to make a decision?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "decision-status");
});

test("L — execution question is not Scenario intent", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What is being executed?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "execution-status");
});

test("M — current KPI question is not Scenario simulation", () => {
  const inventory = focused("Focus on Inventory");
  const result = run("What is Inventory?", {
    state: inventory.nextRuntimeState,
    context: inventory.nextConversationContext,
  });
  assert.notEqual(result.intentResult.intent.kind, "explore-scenario");
});

test("N — scenario result does not invent causal proof", () => {
  const capacity = focused("Focus on Capacity");
  const result = run("What happens if I increase capacity?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.ok(result.scenarioResult);
  assert.doesNotMatch(result.response, /\b(?:caused|causes|proven cause)\b/i);
});

test("O — scenario prediction is not Reality / Actual Outcome / Learning", () => {
  const capacity = focused("Focus on Capacity");
  const result = run("What happens if I increase capacity?", {
    state: capacity.nextRuntimeState,
    context: capacity.nextConversationContext,
  });
  assert.equal(result.intentResult.intent.kind, "explore-scenario");
  assert.doesNotMatch(result.response, /actual outcome/i);
  assert.doesNotMatch(result.response, /\breality\b/i);
  assert.doesNotMatch(result.response, /\blearning candidate\b/i);
  assert.doesNotMatch(result.response, /\bwe observed\b/i);
});

test("FIX1 architecture: no Inventory-only hardcoding in production routing", () => {
  const files = [
    "./conversationalIntentResolver.ts",
    "./conversationalIntentNormalization.ts",
    "./conversationalExperienceResponse.ts",
    "./executiveScenarioResolver.ts",
  ];
  for (const relative of files) {
    const text = readFileSync(new URL(relative, import.meta.url), {
      encoding: "utf8",
    });
    assert.doesNotMatch(text, /increase inventory/i);
    assert.doesNotMatch(text, /includes\(["']inventory["']\)/);
  }
});
