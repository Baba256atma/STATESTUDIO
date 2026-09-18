/**
 * NPA-T RMS:4 — Manager Agent & real Nexora conversation tests.
 * Does not start RMS:5. Does not give Manager Ground Truth.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { CONVERSATIONAL_EXPERIENCE_BOUNDARY } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { RMS_4_BOUNDARY, RMS_ARCHITECTURE_TERMS } from "./rmsManagerContract.ts";
import { RMS_STANDARD_MANAGER, RMS_IMPATIENT_MANAGER, RMS_DATA_DRIVEN_MANAGER } from "./rmsManagerProfiles.ts";
import {
  RMS_NORTHSTAR_AGENDA,
  RMS_WAREHOUSE_AGENDA,
  RMS_DEICTIC_AGENDA_UTTERANCES,
  RMS_IMPERFECT_UTTERANCES,
  answerRmsClarification,
  generateRmsManagerTurn,
} from "./rmsManagerTurnGeneration.ts";
import { RMS_REAL_CONVERSATION_ENTRY, RMS_REAL_CONVERSATION_ENTRY_NAME } from "./rmsManagerCc5Adapter.ts";
import { emptyRmsManagerKnowledge, verifyRmsManagerConversation } from "./rmsManagerRuntime.ts";
import {
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  inspectRmsManagerConversation,
  inspectRmsOperatorLedger,
  prepareRmsManagerConversation,
  readRmsOperatorOperationalView,
  runRmsManagerConversationTurn,
} from "./rmsSession.ts";
import { createNorthstarManufacturingWorld, createWarehouseExpansionWorld } from "./rmsWorldFixtures.ts";
import type { RmsActorIdentity } from "./rmsActorContracts.ts";
import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";
import type { RmsManagerObjective } from "./rmsManagerContract.ts";

const ACTORS = Object.freeze([
  Object.freeze({ actorId: "mgr-agent-1", kind: "MANAGER_AGENT" }),
  Object.freeze({ actorId: "ops-agent-1", kind: "OPERATOR_AGENT" }),
  Object.freeze({ actorId: "nexora-1", kind: "NEXORA" }),
  Object.freeze({ actorId: "observer-1", kind: "OBSERVER" }),
  Object.freeze({ actorId: "real-mgr-1", kind: "REAL_MANAGER" }),
]) satisfies readonly RmsActorIdentity[];

const manager = ACTORS.find((actor) => actor.kind === "MANAGER_AGENT")!;
const observer = ACTORS.find((actor) => actor.kind === "OBSERVER")!;

function sessionOf(world: RmsStructuredGroundTruth, runId: string) {
  return createRmsFoundationSession({
    simulationId: "rms-4-sim",
    simulationType: "manager-conversation",
    sessionId: `rms-4-${runId}`,
    runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: ACTORS,
    groundTruth: world,
  });
}

const NORTHSTAR_OBJECTIVE: RmsManagerObjective = Object.freeze({
  objectiveId: "obj-delivery",
  statement: "Understand the emerging delivery/capacity situation.",
  hostKind: "BUSINESS",
  agenda: RMS_NORTHSTAR_AGENDA,
});

const WAREHOUSE_OBJECTIVE: RmsManagerObjective = Object.freeze({
  objectiveId: "obj-progress",
  statement: "Understand why actual progress is behind planned progress.",
  hostKind: "PROJECT",
  agenda: RMS_WAREHOUSE_AGENDA,
});

test("RMS:4 verifies without starting RMS:5 or parallel conversation intelligence", () => {
  assert.equal(verifyRmsManagerConversation().ok, true);
  assert.equal(RMS_4_BOUNDARY.startsRms5, false);
  assert.equal(RMS_4_BOUNDARY.parallelConversationEngine, false);
  assert.equal(RMS_4_BOUNDARY.conversationEntry, "executeNexoraConversationalExperience");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY, executeNexoraConversationalExperience);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.createsParallelStageController, false);
  assert.equal(RMS_STANDARD_MANAGER.groundTruthAccess, false);
  assert.equal(RMS_IMPATIENT_MANAGER.groundTruthAccess, false);
  assert.equal(RMS_DATA_DRIVEN_MANAGER.groundTruthAccess, false);
});

test("1–6 Manager uses CC:5, cannot inspect Ground Truth/Observer, intents stay RMS-side", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "firewall");
  prepareRmsManagerConversation(created, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I manage Northstar operations.", "Delivery performance is a concern."]),
  });
  assert.throws(() => inspectRmsGroundTruth(created, manager));
  assert.throws(() => inspectRmsOperatorLedger(created, manager));
  assert.throws(() => inspectRmsManagerConversation(created, manager));
  assert.throws(() => readRmsOperatorOperationalView(created, manager));
  const spoken = runRmsManagerConversationTurn(created, manager);
  assert.equal(spoken.utterance, "What is happening?");
  assert.equal(spoken.intent, "UNDERSTAND");
  assert.equal(spoken.replacesNexoraIntent, false);
  assert.notEqual(spoken.nexoraIntentKind, spoken.intent);
  assert.equal(spoken.rewritten, false);
  assert.equal(spoken.nexoraResponse, spoken.result.response);
  const view = inspectRmsManagerConversation(created, observer);
  assert.doesNotMatch(JSON.stringify(view.knowledge), /availableCapacity|machineAvailability|confirmedCausal/);
  assert.equal(view.knowledge?.sealedGroundTruth, false);
  assert.equal(view.fedGroundTruthToManager, false);
});

test("7–12 natural language, deictic/imperfect, clarification without Ground Truth", () => {
  const knowledge = emptyRmsManagerKnowledge(["Delivery is a concern."]);
  const generated = generateRmsManagerTurn({
    intent: "FOLLOW_UP",
    profile: RMS_IMPATIENT_MANAGER,
    knowledge,
  });
  assert.equal(generated.utterance, "Tell me more about that.");
  for (const term of RMS_ARCHITECTURE_TERMS) assert.equal(generated.utterance.includes(term), false);
  assert.equal(RMS_IMPERFECT_UTTERANCES.typo, "look at capcity");
  assert.equal(answerRmsClarification(knowledge, "CAP_AV"), "I don't know");
  const informed = emptyRmsManagerKnowledge([], { CAP_AV: "a production reading our plant reports" });
  assert.equal(answerRmsClarification(informed, "CAP_AV"), "a production reading our plant reports");
  const created = sessionOf(createNorthstarManufacturingWorld(), "clarify");
  const truth = inspectRmsGroundTruth(created, observer);
  assert.ok(truth.variables.some((item) => item.key === "availableCapacity"));
  assert.equal(answerRmsClarification(knowledge, "CAP_AV"), "I don't know");
  prepareRmsManagerConversation(created, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge,
  });
  const imperfect = runRmsManagerConversationTurn(created, manager, { imperfect: "incomplete" });
  assert.equal(imperfect.utterance, "show me problem");
  const deictic = runRmsManagerConversationTurn(created, manager, { imperfect: "deicticExplain" });
  assert.equal(deictic.utterance, "Explain it.");
});

test("13–17 confirmation/Decision boundary, Observer read-only, classification without repair", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "safety");
  prepareRmsManagerConversation(created, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
  });
  const yes = runRmsManagerConversationTurn(created, manager, { forcedUtterance: "yes" });
  assert.equal(yes.autoConfirm, false);
  assert.equal(yes.autoApproveDecision, false);
  assert.equal(yes.autoStartExecution, false);
  assert.equal(RMS_4_BOUNDARY.confirmationBypass, false);
  assert.notEqual(yes.result.status, "applied-by-rms");
  assert.throws(() => runRmsManagerConversationTurn(created, observer));
  const ledger = inspectRmsManagerConversation(created, observer);
  assert.equal(ledger.writeAttempted, false);
  assert.ok(ledger.turns.length >= 1);
  assert.equal(ledger.classifications.every((item) => item.repaired === false), true);
});

test("18–20 BUSINESS journey, PROJECT parity, deterministic Manager choice", () => {
  const business = sessionOf(createNorthstarManufacturingWorld(), "northstar");
  prepareRmsManagerConversation(business, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I manage Northstar operations."]),
  });
  const first = runRmsManagerConversationTurn(business, manager);
  const second = runRmsManagerConversationTurn(business, manager);
  const third = runRmsManagerConversationTurn(business, manager);
  const fourth = runRmsManagerConversationTurn(business, manager);
  const fifth = runRmsManagerConversationTurn(business, manager);
  const sixth = runRmsManagerConversationTurn(business, manager);
  assert.deepEqual(
    [first, second, third, fourth, fifth, sixth].map((item) => item.utterance),
    [
      "What is happening?",
      "Show me the problems.",
      "Explain Capacity Gap.",
      "What data supports this?",
      "Why is delivery getting worse?",
      "What can I change?",
    ],
  );
  assert.equal([first, second, third, fourth, fifth, sixth].every((item) => item.rewritten === false), true);
  const replay = sessionOf(createNorthstarManufacturingWorld(), "replay");
  prepareRmsManagerConversation(replay, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I manage Northstar operations."]),
  });
  const again = [
    runRmsManagerConversationTurn(replay, manager),
    runRmsManagerConversationTurn(replay, manager),
  ];
  assert.deepEqual(
    again.map((item) => ({ intent: item.intent, utterance: item.utterance })),
    [
      { intent: first.intent, utterance: first.utterance },
      { intent: second.intent, utterance: second.utterance },
    ],
  );
  const project = sessionOf(createWarehouseExpansionWorld(), "warehouse");
  prepareRmsManagerConversation(project, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: WAREHOUSE_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I sponsor Warehouse Expansion."]),
  });
  const p1 = runRmsManagerConversationTurn(project, manager);
  const p2 = runRmsManagerConversationTurn(project, manager);
  assert.equal(p1.utterance, "How is the project doing?");
  assert.equal(p2.utterance, "Are we behind?");
  assert.throws(() => inspectRmsGroundTruth(project, manager));
});

test("deictic stress records referent behavior without RMS repair", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "deictic");
  prepareRmsManagerConversation(created, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
  });
  for (const utterance of RMS_DEICTIC_AGENDA_UTTERANCES) {
    runRmsManagerConversationTurn(created, manager, { forcedUtterance: utterance });
  }
  const ledger = inspectRmsManagerConversation(created, observer);
  assert.equal(ledger.turns.length, RMS_DEICTIC_AGENDA_UTTERANCES.length);
  assert.equal(ledger.classifications.every((item) => item.repaired === false), true);
});
