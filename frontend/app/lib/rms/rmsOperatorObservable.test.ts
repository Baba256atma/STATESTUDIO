/**
 * NPA-T RMS:3 — Operator Agent & Observable Data tests.
 * Does not start RMS:4. Does not give Nexora Ground Truth.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { RMS_3_BOUNDARY } from "./rmsOperatorContract.ts";
import { RMS_OPERATOR_AGENT_CONTRACT, tagRmsAction } from "./rmsActorContracts.ts";
import {
  applyRmsGroundTruthEvents,
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  inspectRmsOperatorLedger,
  publishRmsOperatorObservableData,
  readRmsNexoraKnowledge,
  readRmsOperatorOperationalView,
  runRmsOperatorObservation,
} from "./rmsSession.ts";
import { verifyRmsOperatorObservable } from "./rmsOperatorRuntime.ts";
import {
  createNorthstarManufacturingWorld,
  createWarehouseExpansionWorld,
  NORTHSTAR_CAPACITY_EVENT,
  NORTHSTAR_DEMAND_EVENT,
  WAREHOUSE_PROGRESS_EVENT,
} from "./rmsWorldFixtures.ts";
import type { RmsActorIdentity } from "./rmsActorContracts.ts";
import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";

const ACTORS = Object.freeze([
  Object.freeze({ actorId: "mgr-agent-1", kind: "MANAGER_AGENT" }),
  Object.freeze({ actorId: "ops-agent-1", kind: "OPERATOR_AGENT" }),
  Object.freeze({ actorId: "nexora-1", kind: "NEXORA" }),
  Object.freeze({ actorId: "observer-1", kind: "OBSERVER" }),
  Object.freeze({ actorId: "real-mgr-1", kind: "REAL_MANAGER" }),
]) satisfies readonly RmsActorIdentity[];

const operator = ACTORS.find((actor) => actor.kind === "OPERATOR_AGENT")!;
const observer = ACTORS.find((actor) => actor.kind === "OBSERVER")!;
const manager = ACTORS.find((actor) => actor.kind === "MANAGER_AGENT")!;
const nexora = ACTORS.find((actor) => actor.kind === "NEXORA")!;

function sessionOf(world: RmsStructuredGroundTruth, runId: string) {
  return createRmsFoundationSession({
    simulationId: "rms-3-sim",
    simulationType: "operator-observable-data",
    sessionId: `rms-3-${runId}`,
    runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: ACTORS,
    groundTruth: world,
  });
}

function field(records: readonly { field: string; value: string | number | boolean | null; status: string; confirmedMeaning?: null }[], name: string) {
  return records.find((item) => item.field === name);
}

test("RMS:3 verifies without starting RMS:4 or parallel authorities", () => {
  assert.equal(verifyRmsOperatorObservable().ok, true);
  assert.equal(RMS_3_BOUNDARY.startsRms4, false);
  assert.equal(RMS_3_BOUNDARY.parallelDataReality, false);
  assert.equal(RMS_3_BOUNDARY.gateApi, "RDI:1/NexoraRealDataIntegrationFoundation");
  assert.equal(RMS_3_BOUNDARY.dataRealityAuthority, REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.dataRealityAuthority);
  assert.equal(RMS_OPERATOR_AGENT_CONTRACT.mayWriteGroundTruthDirectlyToNexora, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(VAI_AUTHORITY_BOUNDARY.dataReality.includes("Data Reality"), true);
});

test("1–2 Operator inspects only permitted Ground Truth and remains tagged", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "permit");
  const view = readRmsOperatorOperationalView(created, operator);
  assert.equal(view.actorKind, "OPERATOR_AGENT");
  assert.equal(view.hiddenCausalRelationships, false);
  assert.equal(view.values.demand, 100);
  assert.equal("unitCost" in view.values, false);
  assert.equal("confirmedCausalForNexora" in view, false);
  const projectView = readRmsOperatorOperationalView(sessionOf(createWarehouseExpansionWorld(), "permit-project"), operator);
  assert.equal("unitCost" in projectView.values, false);
  assert.equal("plannedProgress" in projectView.values, true);
  assert.throws(() => readRmsOperatorOperationalView(created, manager));
  assert.throws(() => readRmsOperatorOperationalView(created, nexora));
  const tagged = tagRmsAction({
    actionId: "op-1",
    actorId: operator.actorId,
    actorKind: "OPERATOR_AGENT",
    managerChannelSource: null,
    kind: "OPERATIONAL_OBSERVATION",
  });
  assert.equal(tagged.actorKind, "OPERATOR_AGENT");
  assert.equal(tagged.managerChannelSource, null);
});

test("3–13 BUSINESS Operator journey, firewall, semantics, provenance, and delay", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "northstar");
  const beforeEvents = runRmsOperatorObservation(created, operator);
  assert.equal(field(beforeEvents, "inventory_quantity")?.status, "DELAYED");
  applyRmsGroundTruthEvents(created, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  const records = runRmsOperatorObservation(created, operator);
  const orders = field(records, "orders_received");
  const capAv = field(records, "CAP_AV");
  const produced = field(records, "produced_quantity");
  const inventory = field(records, "inventory_quantity");
  const status = field(records, "machine_status");
  const missing = field(records, "downtime_unreported");
  const stale = field(records, "last_cycle_count");
  assert.equal(orders?.status, "AVAILABLE");
  assert.equal(orders?.value, 125);
  assert.equal(capAv?.value, 85);
  assert.equal(capAv?.confirmedMeaning, null);
  assert.equal(produced?.value, 85);
  assert.equal(inventory?.status, "AVAILABLE");
  assert.equal(status?.value, "running");
  assert.equal(missing?.status, "MISSING");
  assert.equal(stale?.status, "STALE");
  const leaked = JSON.stringify(records);
  assert.doesNotMatch(leaked, /availableCapacity/);
  assert.doesNotMatch(leaked, /caused/);
  assert.doesNotMatch(leaked, /Ground Truth/);
  assert.equal(records.every((item) => item.causalClaim === false), true);
  const published = publishRmsOperatorObservableData(created, operator, records);
  assert.equal(published.adapterOk, true);
  assert.equal(published.handoff.ready, true);
  assert.equal(published.handoff.handoff?.destinationAuthority, REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.dataRealityAuthority);
  assert.equal(RMS_3_BOUNDARY.ownsDataReality, false);
  assert.equal(RMS_3_BOUNDARY.ownsEvidence, false);
  assert.ok(published.handoff.handoff?.dataset.records.some((item) => item.metricKey === "CAP_AV" && item.value === 85));
  assert.ok(!published.handoff.handoff?.dataset.records.some((item) => item.metricKey === "availableCapacity"));
  assert.ok(!published.handoff.handoff?.dataset.records.some((item) => item.metricKey === "last_cycle_count"));
  assert.equal(published.semanticCapAv.requiresConfirmation, true);
  assert.notEqual(published.semanticCapAv.state, "AUTHORITATIVE");
  assert.notEqual(published.semanticCapAv.state, "MANAGER_CONFIRMED");
  const provenance = published.handoff.handoff?.factProvenance.find((item) => item.metricKey === "CAP_AV");
  assert.equal(provenance?.provenance.sourceId.startsWith("source:rms-operator:"), true);
  assert.doesNotMatch(JSON.stringify(provenance), /availableCapacity/);
  assert.equal(created.observableData.length, 0);
  const knowledge = readRmsNexoraKnowledge(created);
  assert.equal(knowledge.worldId, null);
  assert.equal(knowledge.facts.length, 0);
  assert.doesNotMatch(JSON.stringify(created), /CAP_AV/);
  assert.equal(inspectRmsGroundTruth(created, observer).clock.tick, 2);
});

test("14–17 PROJECT parity, Observer read-only, deterministic replay", () => {
  const project = sessionOf(createWarehouseExpansionWorld(), "warehouse");
  applyRmsGroundTruthEvents(project, operator, [WAREHOUSE_PROGRESS_EVENT]);
  const records = runRmsOperatorObservation(project, operator);
  assert.equal(field(records, "planned_progress")?.value, 0.71);
  assert.equal(field(records, "actual_progress")?.value, 0.65);
  assert.equal(field(records, "resource_usage")?.value, 12);
  const published = publishRmsOperatorObservableData(project, operator, records);
  assert.equal(published.handoff.ready, true);
  assert.throws(() => runRmsOperatorObservation(project, observer));
  const ledger = inspectRmsOperatorLedger(project, observer);
  assert.equal(ledger.writeAttempted, false);
  assert.ok(ledger.publications.length >= 1);
  assert.equal(ledger.publications[0]?.destinationAuthority, "P0:1/NexoraDataRealityFoundation");
  assert.ok(ledger.actions.some((item) => item.kind === "OPERATIONAL_OBSERVATION"));
  assert.ok(ledger.actions.some((item) => item.kind === "PUBLISH_OBSERVABLE_DATA"));
  assert.ok(ledger.actions.every((item) => item.actorKind === "OPERATOR_AGENT"));
  assert.throws(() => inspectRmsOperatorLedger(project, manager));
  const first = sessionOf(createNorthstarManufacturingWorld(), "replay-a");
  const second = sessionOf(createNorthstarManufacturingWorld(), "replay-b");
  applyRmsGroundTruthEvents(first, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  applyRmsGroundTruthEvents(second, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  const a = runRmsOperatorObservation(first, operator);
  const b = runRmsOperatorObservation(second, operator);
  assert.deepEqual(
    a.map((item) => ({ field: item.field, value: item.value, status: item.status, tick: item.tick })),
    b.map((item) => ({ field: item.field, value: item.value, status: item.status, tick: item.tick })),
  );
});
