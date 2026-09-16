/**
 * NPA-T RMS:1 — Real Management Simulation foundation tests.
 * Contract and authority boundaries only. Does not start RMS:2 or VAI.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { MANAGER_OBJECT_AUTHORITY } from "@/app/lib/manager-object/managerObjectInteractionFoundation.ts";
import { RMS_AUTHORITY_BOUNDARY } from "./rmsAuthorityBoundary.ts";
import {
  actorActionsAreDistinguishable,
  RMS_MANAGER_AGENT_CONTRACT,
  RMS_NEXORA_PARTICIPANT_CONTRACT,
  RMS_OBSERVER_CONTRACT,
  tagRmsAction,
} from "./rmsActorContracts.ts";
import { RMS_FOUNDATION_CONTRACT } from "./rmsFoundationContract.ts";
import { nexoraKnowledgeExposesGroundTruth } from "./rmsGroundTruth.ts";
import {
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  observeRmsSession,
  readRmsNexoraKnowledge,
  verifyRmsFoundation,
} from "./rmsFoundation.ts";
import type { RmsActorIdentity } from "./rmsActorContracts.ts";

const ACTORS = Object.freeze([
  Object.freeze({ actorId: "mgr-agent-1", kind: "MANAGER_AGENT" }),
  Object.freeze({ actorId: "ops-agent-1", kind: "OPERATOR_AGENT" }),
  Object.freeze({ actorId: "nexora-1", kind: "NEXORA" }),
  Object.freeze({ actorId: "observer-1", kind: "OBSERVER" }),
  Object.freeze({ actorId: "real-mgr-1", kind: "REAL_MANAGER" }),
]) satisfies readonly RmsActorIdentity[];

function session() {
  return createRmsFoundationSession({
    simulationId: "rms-1-sim",
    simulationType: "generic-business-or-project",
    sessionId: "rms-1-session",
    runId: "rms-1-run",
    host: { hostKind: "BUSINESS", hostId: "host-demo-not-unified-company" },
    actors: ACTORS,
    groundTruth: {
      worldId: "world-1",
      facts: [
        { factId: "f-capacity", key: "machine.capacity", value: 80 },
        { factId: "f-demand", key: "demand", value: 105 },
        { factId: "f-failure", key: "machine.failure.exists", value: true },
      ],
    },
  });
}

test("RMS:1 foundation verifies without parallel authorities", () => {
  const verified = verifyRmsFoundation();
  assert.equal(verified.ok, true);
  assert.equal(RMS_AUTHORITY_BOUNDARY.parallelStage, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.parallelAdvisor, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.parallelObjectStore, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.parallelDecisionRuntime, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.parallelExecutionRuntime, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.parallelConversationalRuntime, false);
  assert.equal(MANAGER_OBJECT_AUTHORITY.conversation, "CC:1–CC:7");
  assert.equal(RMS_AUTHORITY_BOUNDARY.conversationRuntime.includes("CC:5"), true);
});

test("RMS:1 binds Nexora to the existing CC:5 runtime entry, not a simulation copy", () => {
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.runtimeEntry, "executeNexoraConversationalExperience");
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.privilegedSimulationRuntime, false);
  assert.equal(typeof executeNexoraConversationalExperience, "function");
  assert.equal(RMS_FOUNDATION_CONTRACT.privilegedSimulationNexora, false);
});

test("RMS:1 Manager Agent actions remain distinguishable from real-manager actions", () => {
  const agent = tagRmsAction({
    actionId: "a1",
    actorId: "mgr-agent-1",
    actorKind: "MANAGER_AGENT",
    managerChannelSource: "MANAGER_AGENT",
    kind: "ASK",
  });
  const real = tagRmsAction({
    actionId: "a2",
    actorId: "real-mgr-1",
    actorKind: "REAL_MANAGER",
    managerChannelSource: "REAL_MANAGER",
    kind: "ASK",
  });
  assert.equal(actorActionsAreDistinguishable(agent, real), true);
  assert.equal(RMS_MANAGER_AGENT_CONTRACT.distinguishableFromRealManager, true);
  assert.notEqual(agent.managerChannelSource, real.managerChannelSource);
});

test("RMS:1 Observer cannot mutate simulation or Nexora", () => {
  const created = session();
  const observer = ACTORS.find((actor) => actor.kind === "OBSERVER");
  assert.ok(observer);
  const before = JSON.stringify(created);
  const observation = observeRmsSession(
    created,
    observer,
    "RUNTIME_SYSTEM_ERROR",
    "read-only inspection",
  );
  assert.equal(observation.writeAttempted, false);
  assert.equal(observation.observerContract.mayMutateSimulation, false);
  assert.equal(observation.observerContract.mayMutateNexora, false);
  assert.equal(RMS_OBSERVER_CONTRACT.readOnly, true);
  assert.equal(JSON.stringify(created), before);
  assert.throws(() => {
    (created as { lifecycle: string }).lifecycle = "running";
  });
});

test("RMS:1 Ground Truth is not automatically exposed to Nexora", () => {
  const created = session();
  const knowledge = readRmsNexoraKnowledge(created);
  assert.equal(nexoraKnowledgeExposesGroundTruth(knowledge), false);
  assert.equal(knowledge.worldId, null);
  assert.equal(knowledge.facts.length, 0);
  const observer = ACTORS.find((actor) => actor.kind === "OBSERVER");
  assert.ok(observer);
  const truth = inspectRmsGroundTruth(created, observer);
  assert.equal(truth.facts.some((fact) => fact.key === "machine.capacity" && fact.value === 80), true);
  const nexora = ACTORS.find((actor) => actor.kind === "NEXORA");
  assert.ok(nexora);
  assert.throws(() => inspectRmsGroundTruth(created, nexora));
  assert.doesNotMatch(JSON.stringify(created), /machine\.capacity/);
  assert.doesNotMatch(JSON.stringify(knowledge), /world-1/);
});

test("RMS:1 reserves WATCH / TAKE_CONTROL / EXPERIMENT without implementing them", () => {
  assert.deepEqual(RMS_FOUNDATION_CONTRACT.interactionModesReserved, [
    "WATCH",
    "TAKE_CONTROL",
    "EXPERIMENT",
  ]);
  const created = session();
  assert.equal(created.interactionMode, "WATCH");
  assert.equal(RMS_FOUNDATION_CONTRACT.unifiedCompanyModel, false);
  assert.equal(RMS_FOUNDATION_CONTRACT.deferred.includes("RMS_2"), true);
  assert.equal(RMS_FOUNDATION_CONTRACT.deferred.includes("VAI"), true);
});
