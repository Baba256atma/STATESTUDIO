import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function meaning(utterance: string) {
  return interpretCanonicalManagerMeaning({ utterance, subjects });
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
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
    messageIdSeed: `fix14-r5-${utterance}`,
  });
}

test("R5: adjacent kind tokens preserve every materially plausible canonical candidate", () => {
  const result = meaning("Show the risk problem.");

  assert.equal(result.requestedOperation, "FOCUS");
  assert.equal(result.objectReference, null);
  assert.equal(result.ambiguity.unresolved, true);
  assert.equal(result.ambiguity.reason, "multiple-objects");
  assert.deepEqual(
    result.ambiguity.candidates.map((candidate) => candidate.subjectId).sort(),
    ["ctx-problem-capacity", "ctx-problem-margin", "obj-risk"],
  );
});

test("R5: genuine ambiguity clarifies and explicit canonical names still resolve", () => {
  const compound = run("Show the risk problem.");
  assert.equal(compound.clarificationTurn.action, "clarify");
  assert.equal(compound.naturalLanguageUnderstanding.objectReference, null);

  const activeRisk = run("Show Risk.");
  const compoundAfterRisk = run("Show the risk problem.", activeRisk);
  assert.equal(compoundAfterRisk.clarificationTurn.action, "clarify");
  assert.equal(compoundAfterRisk.naturalLanguageUnderstanding.objectReference, null);
  assert.equal(compoundAfterRisk.naturalLanguageUnderstanding.ambiguity.candidates.length, 3);

  const genericProblem = meaning("Show the problem.");
  assert.equal(genericProblem.ambiguity.unresolved, true);
  assert.deepEqual(
    genericProblem.ambiguity.candidates.map((candidate) => candidate.subjectId).sort(),
    ["ctx-problem-capacity", "ctx-problem-margin"],
  );

  const risk = meaning("Show Risk.");
  assert.equal(risk.objectReference?.subjectId, "obj-risk");
  assert.equal(risk.ambiguity.unresolved, false);

  const problem = meaning("Show Margin Pressure.");
  assert.equal(problem.objectReference?.subjectId, "ctx-problem-margin");
  assert.equal(problem.ambiguity.unresolved, false);
});

test("R5: bare kind references keep their established deictic behavior", () => {
  const risk = meaning("Show the risk.");
  assert.equal(risk.objectReference?.subjectId, "obj-risk");
  assert.equal(risk.ambiguity.unresolved, false);

  const problem = meaning("Show the problem.");
  assert.equal(problem.objectReference, null);
  assert.equal(problem.ambiguity.unresolved, true);
});
