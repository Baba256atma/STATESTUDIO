/**
 * NPA-T RMS:6 — Events, Disturbances & Problem Injection tests.
 * Does not start RMS:7. Does not inject Nexora Problem/Risk objects.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_6_BOUNDARY } from "./rmsEventContract.ts";
import { compileRmsDisturbance } from "./rmsEventCompile.ts";
import { createRmsEventRuntime, runRmsEventScheduleUntil, verifyRmsEventsDisturbances } from "./rmsEventRuntime.ts";
import {
  RMS_CAPACITY_PROBLEM_INJECTION,
  RMS_COMBINED_DISTURBANCE_SCHEDULE,
  RMS_INSUFFICIENT_SIGNAL_SCHEDULE,
  RMS_MACHINE_FAILURE_SCHEDULE,
  RMS_NORTHSTAR_DEMAND_SURGE,
  RMS_NORTHSTAR_MACHINE_FAILURE,
  RMS_PROJECT_DISTURBANCE_SCHEDULE,
  RMS_RISK_EXPOSURE_SCHEDULE,
} from "./rmsEventFixtures.ts";
import { RMS_STANDARD_MANAGER } from "./rmsManagerProfiles.ts";
import { RMS_NORTHSTAR_AGENDA, RMS_WAREHOUSE_AGENDA } from "./rmsManagerTurnGeneration.ts";
import { emptyRmsManagerKnowledge } from "./rmsManagerRuntime.ts";
import { applyRmsWorldEventsOnCurrentTick } from "./rmsWorldEngine.ts";
import {
  createRmsFoundationSession,
  inspectRmsEventSchedule,
  inspectRmsGroundTruth,
  loadRmsEventSchedule,
  measureRmsObserverIntelligence,
  prepareRmsManagerConversation,
  publishRmsOperatorObservableData,
  readRmsNexoraKnowledge,
  runRmsManagerConversationTurn,
  runRmsOperatorObservation,
  stepRmsEventSchedule,
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
const operator = ACTORS.find((actor) => actor.kind === "OPERATOR_AGENT")!;
const nexora = ACTORS.find((actor) => actor.kind === "NEXORA")!;

function sessionOf(world: RmsStructuredGroundTruth, runId: string) {
  return createRmsFoundationSession({
    simulationId: "rms-6-sim",
    simulationType: "events-disturbances",
    sessionId: `rms-6-${runId}`,
    runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: ACTORS,
    groundTruth: world,
  });
}

function value(world: RmsStructuredGroundTruth, key: string) {
  return world.variables.find((item) => item.key === key)?.value;
}

const NORTHSTAR_OBJECTIVE: RmsManagerObjective = Object.freeze({
  objectiveId: "obj-delivery",
  statement: "Understand the emerging delivery/capacity situation.",
  hostKind: "BUSINESS",
  agenda: RMS_NORTHSTAR_AGENDA,
});

test("RMS:6 verifies Event ≠ Problem/Risk and uses RMS:2 transitions", () => {
  assert.equal(verifyRmsEventsDisturbances().ok, true);
  assert.equal(RMS_6_BOUNDARY.startsRms7, false);
  assert.equal(RMS_6_BOUNDARY.injectsProblemObjects, false);
  assert.equal(RMS_6_BOUNDARY.injectsRiskObjects, false);
  assert.equal(RMS_6_BOUNDARY.bypassesOperatorRdi, false);
  assert.equal(RMS_6_BOUNDARY.d7IsGroundTruth, false);
  assert.equal(RMS_CAPACITY_PROBLEM_INJECTION.createsNexoraProblemObject, false);
  assert.equal(RMS_CAPACITY_PROBLEM_INJECTION.createsNexoraRiskObject, false);
  const compiled = compileRmsDisturbance(RMS_NORTHSTAR_DEMAND_SURGE);
  assert.equal(compiled[0]?.worldEvent.type, "DEMAND_CHANGE");
  const world = applyRmsWorldEventsOnCurrentTick(createNorthstarManufacturingWorld(), compiled.map((item) => item.worldEvent));
  assert.equal(value(world, "demand"), 125);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
});

test("5–10 instant, duration, recovery, schedule, coexistence, direct/secondary", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "lifecycle");
  loadRmsEventSchedule(created, operator, RMS_MACHINE_FAILURE_SCHEDULE);
  stepRmsEventSchedule(created, operator, 20);
  let world = inspectRmsGroundTruth(created, observer);
  assert.equal(world.clock.tick, 20);
  assert.equal(value(world, "machineAvailability"), 0);
  assert.equal(value(world, "availableCapacity"), 85);
  const ledger = inspectRmsEventSchedule(created, observer);
  assert.ok(ledger.runtime?.lastCompiledEffects.some((item) => item.effect === "DIRECT"));
  assert.ok(ledger.runtime?.lastCompiledEffects.some((item) => item.effect === "SECONDARY"));
  assert.ok(ledger.runtime?.active.includes("evt:machine-failure"));
  stepRmsEventSchedule(created, operator, 29);
  world = inspectRmsGroundTruth(created, observer);
  assert.equal(value(world, "machineAvailability"), 1);
  assert.equal(value(world, "availableCapacity"), 110);
  assert.equal(ledger.hiddenFromNexora, true);
  assert.throws(() => inspectRmsEventSchedule(created, manager));
  assert.throws(() => loadRmsEventSchedule(created, nexora, RMS_MACHINE_FAILURE_SCHEDULE));
  const combined = runRmsEventScheduleUntil(
    createNorthstarManufacturingWorld(),
    createRmsEventRuntime(RMS_COMBINED_DISTURBANCE_SCHEDULE),
    20,
  );
  assert.equal(value(combined.world, "demand"), 125);
  assert.equal(value(combined.world, "availableCapacity"), 85);
  const replay = runRmsEventScheduleUntil(
    createNorthstarManufacturingWorld(),
    createRmsEventRuntime(RMS_COMBINED_DISTURBANCE_SCHEDULE),
    20,
  );
  assert.deepEqual(
    combined.world.variables.map((item) => item.value),
    replay.world.variables.map((item) => item.value),
  );
});

test("11–18 firewall, Operator/RDI path, delay, Observer information-bounded", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "firewall");
  loadRmsEventSchedule(created, operator, [RMS_NORTHSTAR_MACHINE_FAILURE]);
  stepRmsEventSchedule(created, operator, 20);
  const atEvent = runRmsOperatorObservation(created, operator);
  const status = atEvent.find((item) => item.field === "machine_status");
  assert.equal(status?.value, "stopped");
  stepRmsEventSchedule(created, operator, 21);
  const delayed = runRmsOperatorObservation(created, operator);
  assert.equal(delayed.find((item) => item.field === "inventory_quantity")?.status, "AVAILABLE");
  publishRmsOperatorObservableData(created, operator, delayed);
  prepareRmsManagerConversation(created, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["Delivery performance is a concern."]),
  });
  const spoken = runRmsManagerConversationTurn(created, manager);
  assert.doesNotMatch(spoken.utterance, /Machine A failed|evt:machine-failure/);
  assert.doesNotMatch(spoken.nexoraResponse, /evt:machine-failure|confirmedCausal/);
  const knowledge = readRmsNexoraKnowledge(created);
  assert.equal(knowledge.worldId, null);
  const report = measureRmsObserverIntelligence(created, observer);
  assert.ok(report.measurements.some((item) => item.classification === "EVENT_JOURNEY"));
  assert.ok(report.measurements.some((item) => item.classification === "INFORMATION_BOUNDED_HIDDEN_TRUTH" && item.taxonomy === "NO_ERROR"));
  assert.doesNotMatch(JSON.stringify(created), /evt:machine-failure/);
});

test("19–25 Northstar A/B/C, project, risk, insufficient signal, replay", () => {
  const surge = sessionOf(createNorthstarManufacturingWorld(), "surge");
  loadRmsEventSchedule(surge, operator, [RMS_NORTHSTAR_DEMAND_SURGE]);
  stepRmsEventSchedule(surge, operator, 10);
  const afterSurge = inspectRmsGroundTruth(surge, observer);
  assert.equal(value(afterSurge, "demand"), 125);
  assert.equal(value(afterSurge, "availableCapacity"), 110);
  const records = runRmsOperatorObservation(surge, operator);
  assert.equal(records.find((item) => item.field === "orders_received")?.value, 125);
  publishRmsOperatorObservableData(surge, operator, records);
  prepareRmsManagerConversation(surge, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I manage Northstar operations."]),
  });
  runRmsManagerConversationTurn(surge, manager);
  const surgeReport = measureRmsObserverIntelligence(surge, observer);
  assert.equal(surgeReport.measurements.some((item) => /Capacity Gap Problem/.test(item.notes)), false);

  const fail = sessionOf(createNorthstarManufacturingWorld(), "fail");
  loadRmsEventSchedule(fail, operator, RMS_MACHINE_FAILURE_SCHEDULE);
  stepRmsEventSchedule(fail, operator, 20);
  assert.equal(value(inspectRmsGroundTruth(fail, observer), "machineAvailability"), 0);
  const failObs = runRmsOperatorObservation(fail, operator);
  publishRmsOperatorObservableData(fail, operator, failObs);
  prepareRmsManagerConversation(fail, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["Delivery performance is a concern."]),
  });
  const failTurn = runRmsManagerConversationTurn(fail, manager);
  assert.doesNotMatch(failTurn.nexoraResponse, /definitely caused/);

  const combined = sessionOf(createNorthstarManufacturingWorld(), "combo");
  loadRmsEventSchedule(combined, operator, RMS_COMBINED_DISTURBANCE_SCHEDULE);
  stepRmsEventSchedule(combined, operator, 20);
  const comboWorld = inspectRmsGroundTruth(combined, observer);
  assert.equal(value(comboWorld, "demand"), 125);
  assert.equal(value(comboWorld, "availableCapacity"), 85);

  const project = sessionOf(createWarehouseExpansionWorld(), "project");
  loadRmsEventSchedule(project, operator, RMS_PROJECT_DISTURBANCE_SCHEDULE);
  stepRmsEventSchedule(project, operator, 5);
  const projectWorld = inspectRmsGroundTruth(project, observer);
  assert.equal(value(projectWorld, "staffAvailable"), 8);
  assert.equal(value(projectWorld, "scheduleVarianceDays"), 6);
  const projectRecords = runRmsOperatorObservation(project, operator);
  publishRmsOperatorObservableData(project, operator, projectRecords);
  prepareRmsManagerConversation(project, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: Object.freeze({
      objectiveId: "obj-progress",
      statement: "Understand why actual progress is behind planned progress.",
      hostKind: "PROJECT",
      agenda: RMS_WAREHOUSE_AGENDA,
    }),
    knowledge: emptyRmsManagerKnowledge(["I sponsor Warehouse Expansion."]),
  });
  const projectAsk = runRmsManagerConversationTurn(project, manager);
  assert.equal(projectAsk.utterance, "How is the project doing?");

  const risk = runRmsEventScheduleUntil(createNorthstarManufacturingWorld(), createRmsEventRuntime(RMS_RISK_EXPOSURE_SCHEDULE), 4);
  assert.equal(value(risk.world, "inventory"), 300);
  assert.equal(value(risk.world, "demand"), 100);
  assert.equal(risk.world.facts.some((item) => item.key === "deliveryFailed" && item.value === true), false);

  const minor = runRmsEventScheduleUntil(createNorthstarManufacturingWorld(), createRmsEventRuntime(RMS_INSUFFICIENT_SIGNAL_SCHEDULE), 3);
  assert.equal(value(minor.world, "availableCapacity"), 108);
  const minorSession = sessionOf(minor.world, "minor");
  const minorReport = measureRmsObserverIntelligence(minorSession, observer);
  assert.equal(minorReport.findings.some((item) => item.severity === "FAILURE" && item.explanation.includes("must escalate")), false);

  const a = runRmsEventScheduleUntil(createNorthstarManufacturingWorld(), createRmsEventRuntime(RMS_COMBINED_DISTURBANCE_SCHEDULE), 20);
  const b = runRmsEventScheduleUntil(createNorthstarManufacturingWorld(), createRmsEventRuntime(RMS_COMBINED_DISTURBANCE_SCHEDULE), 20);
  assert.deepEqual(a.runtime.traces.map((item) => ({ eventId: item.eventId, tick: item.tick })), b.runtime.traces.map((item) => ({ eventId: item.eventId, tick: item.tick })));
});
