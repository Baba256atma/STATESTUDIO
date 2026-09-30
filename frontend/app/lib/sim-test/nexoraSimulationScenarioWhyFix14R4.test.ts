import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(
  utterance: string,
  previous?: Turn,
  options?: { readonly preserveRuntime?: boolean },
): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: previous?.nextExecutiveContext ?? null,
    conversationContext: Object.freeze({
      currentSubjectId: previous?.nextExecutiveContext.currentSubject?.subjectId ?? null,
      previousSubjectIds: Object.freeze(
        previous?.nextExecutiveContext.previousSubjects.map((item) => item.subjectId) ?? [],
      ),
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState:
      options?.preserveRuntime === false
        ? initialState()
        : previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    scenarioSession: previous?.nextScenarioSession ?? undefined,
    messageIdSeed: `fix14-r4-${utterance}`,
  });
}

test("R4: Scenario why retains subject but replaces describe with impact reasoning", () => {
  const described = run("Explain Demand Surge");
  assert.equal(described.intentResult.intent.scenarioPayload?.operation, "describe");
  assert.equal(described.shouldCommitRuntime, false);
  assert.ok(described.directorPlan);
  assert.equal(described.directorPlan.intent, "NO_CHANGE");

  const why = run("Why?", described);
  assert.equal(why.nextExecutiveContext.currentScenario?.subjectId, "ctx-scenario-demand");
  assert.equal(why.intentResult.intent.kind, "explain-scenario");
  assert.equal(why.intentResult.intent.scenarioPayload?.operation, "impact-why");
  assert.equal(why.shouldCommitRuntime, false);
  assert.match(why.response, /associates|modeled relationship|not a proven causal/i);
  assert.doesNotMatch(why.response, /causes Delivery delays|proven cause/i);
});

test("R4: evaluated Scenario why communicates the modeled basis without causal promotion", () => {
  const delivery = run("Show Delivery");
  const late = run("What if Delivery is too late?", delivery);
  const why = run("Why?", late, { preserveRuntime: false });

  assert.equal(why.intentResult.intent.kind, "explain-scenario");
  assert.equal(why.intentResult.intent.scenarioPayload?.operation, "impact-why");
  assert.match(why.response, /modeled relationship/i);
  assert.doesNotMatch(why.response, /caused the observed|proven cause/i);
  assert.equal(why.shouldCommitRuntime, false);
});

test("R4: subjectless why does not invent a Scenario or causal explanation", () => {
  const why = run("Why?");

  assert.equal(why.nextExecutiveContext.currentScenario, null);
  assert.equal(why.scenarioResult, null);
  assert.doesNotMatch(why.response, /Demand Surge|Delivery is a scenario|proven cause/i);
});
