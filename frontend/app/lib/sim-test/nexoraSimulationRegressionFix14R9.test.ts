import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { SIM_TEST_2_MANUFACTURING_INGESTION } from "./nexoraSimulationIngestionJourneys.ts";
import { SIM_TEST_6_FAST_PARITY } from "./nexoraSimulationLongSessionJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

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
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix14-r9-${utterance}`,
  });
}

test("R9 B1: the ingestion evidence follow-up answers about the subject the prior turn established", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_2_MANUFACTURING_INGESTION,
    runId: "fix14-r9-b1",
  });
  const established = report.journeyObservations.find((row) => row.turn === 2);
  assert.equal(established?.advisorReferentId, "ctx-problem-margin");
  const evidence = report.checkpoints.find(
    (checkpoint) => checkpoint.managerTurn === 3 && checkpoint.kind === "NEXORA_TURN_COMPLETED",
  );
  assert.doesNotMatch(evidence?.nexoraResponse ?? "", /Which item do you mean/i);
  assert.match(evidence?.nexoraResponse ?? "", /Margin Pressure/);
  assert.match(evidence?.nexoraResponse ?? "", /not a confirmed cause/i);
  assert.match(evidence?.nexoraResponse ?? "", /not enough evidence/i);
});

test("R9 B2: one authoritative referent lets an evidence follow-up proceed", () => {
  const afterPressure = run("What evidence supports that?", run("What pressure deserves my attention?"));
  assert.equal(afterPressure.clarificationTurn.action, "proceed");
  assert.equal(afterPressure.contextualManagerMeaning.objectReference?.subjectId, "ctx-problem-margin");
  assert.match(afterPressure.response, /not a confirmed cause/i);

  const afterShow = run("What evidence supports that?", run("Show Capacity."));
  assert.equal(afterShow.clarificationTurn.action, "proceed");
  assert.equal(afterShow.contextualManagerMeaning.objectReference?.subjectId, "obj-capacity");
});

test("R9 B3: two competing recent referents still clarify", () => {
  const competing = run("Explain that.", run("Show Capacity.", run("Show Delivery.")));
  assert.equal(competing.clarificationTurn.action, "clarify");
  assert.ok(competing.managerObjectTurn.session.pendingClarification);
});

test("R9 B4: FIX8 What supports that claim? keeps its certified referent", () => {
  const claim = run("What supports that claim?", run("Switch to inventory.", run("Show Capacity.")));
  assert.equal(claim.clarificationTurn.action, "proceed");
  assert.equal(claim.contextualManagerMeaning.objectReference?.subjectId, "obj-inventory");
});

test("R9 B5/B6: Explain that clarifies when unresolved and proceeds when resolved", () => {
  const unresolved = run("Explain that.");
  assert.equal(unresolved.clarificationTurn.action, "clarify");
  assert.equal(unresolved.contextualManagerMeaning.objectReference, null);

  const resolved = run("Explain that.", run("Show Delivery."));
  assert.equal(resolved.clarificationTurn.action, "proceed");
  assert.equal(resolved.contextualManagerMeaning.objectReference?.subjectId, "obj-delivery");
});

test("R9 6.1: a compound canonical name's head noun resolves; modifiers and alias heads do not", () => {
  const head = interpretCanonicalManagerMeaning({
    utterance: "What pressure deserves my attention?",
    subjects,
  });
  assert.equal(head.objectReference?.subjectId, "ctx-problem-margin");

  const modifier = interpretCanonicalManagerMeaning({
    utterance: "What does the production data show?",
    subjects,
  });
  assert.notEqual(modifier.objectReference?.subjectId, "obj-capacity");

  const aliasHead = interpretCanonicalManagerMeaning({ utterance: "What about performance?", subjects });
  assert.equal(aliasHead.objectReference, null);
});

test("R9 6.1: a head noun shared by two canonical names does not silently pick one", () => {
  const margin = subjects.find((subject) => subject.subjectId === "ctx-problem-margin")!;
  const withCost = [
    ...subjects,
    { ...margin, subjectId: "ctx-problem-cost", canonicalName: "Cost Pressure", aliases: ["Cost Pressure"] },
  ];
  const meaning = interpretCanonicalManagerMeaning({
    utterance: "What pressure deserves my attention?",
    subjects: withCost,
  });
  assert.equal(meaning.objectReference, null);
});

test("R9 FAST: FIX11 named return keeps canonical, Advisor, and Stage on the visited Object", () => {
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix14-r9-fast" });
  const byTurn = new Map(fast.journeyObservations.map((row) => [row.turn, row]));
  assert.equal(byTurn.get(16)?.utterance, "Go back to the capacity issue.");
  for (const turn of [16, 17, 20, 21, 30]) {
    const row = byTurn.get(turn)!;
    assert.equal(row.canonicalSubjectId, "obj-capacity", `T${turn} canonical`);
    assert.equal(row.advisorReferentId, row.canonicalSubjectId, `T${turn} Advisor follows canonical`);
    assert.equal(row.stageActiveSubjectId, row.canonicalSubjectId, `T${turn} Stage follows canonical`);
  }
  assert.equal(fast.findingCounts.S0, 0);
  assert.equal(fast.findingCounts.S1, 0);
});
