/**
 * NPA-T RMS:2 — Business/Project Ground Truth tests.
 * Does not start RMS:3. Does not publish Operator data or Nexora knowledge.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NMI_AUTHORITY_BOUNDARY } from "@/app/lib/nmi/nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { RMS_AUTHORITY_BOUNDARY } from "./rmsAuthorityBoundary.ts";
import { RMS_2_BOUNDARY } from "./rmsWorldContract.ts";
import {
  applyRmsGroundTruthEvents,
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  pauseRmsGroundTruth,
  readRmsNexoraKnowledge,
} from "./rmsSession.ts";
import { instantiateRmsGroundTruth, verifyRmsGroundTruthWorld } from "./rmsWorldEngine.ts";
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
    simulationId: "rms-2-sim",
    simulationType: "business-project-ground-truth",
    sessionId: `rms-2-${runId}`,
    runId,
    host: { hostKind: world.worldKind === "HYBRID" ? "HYBRID" : world.worldKind, hostId: world.worldId },
    actors: ACTORS,
    groundTruth: world,
  });
}

function valueOf(world: RmsStructuredGroundTruth, variableId: string) {
  return world.variables.find((item) => item.variableId === variableId)?.value;
}

test("RMS:2 verifies without starting RMS:3 or parallel authorities", () => {
  assert.equal(verifyRmsGroundTruthWorld().ok, true);
  assert.equal(RMS_2_BOUNDARY.startsRms3, false);
  assert.equal(RMS_2_BOUNDARY.ownsNmiSemantics, false);
  assert.equal(RMS_2_BOUNDARY.ownsVaiRoles, false);
  assert.equal(RMS_2_BOUNDARY.ownsStage, false);
  assert.equal(RMS_2_BOUNDARY.ownsAdvisor, false);
  assert.equal(RMS_2_BOUNDARY.ownsManagerObject, false);
  assert.equal(RMS_2_BOUNDARY.ownsDataReality, false);
  assert.equal(RMS_2_BOUNDARY.ownsDecision, false);
  assert.equal(RMS_2_BOUNDARY.ownsExecution, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.nmi, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.vai, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.startsRms2, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.rms, "RMS:1 Ground Truth (simulation; not NMI)");
  assert.equal(VAI_AUTHORITY_BOUNDARY.scenario, "CC:9");
  assert.equal(realDataIntegrationFoundationIdentity.includes("RealDataIntegration"), true);
});

test("1–2 BUSINESS and PROJECT Ground Truth instantiate on the same foundation", () => {
  const business = createNorthstarManufacturingWorld();
  const project = createWarehouseExpansionWorld();
  assert.equal(business.worldKind, "BUSINESS");
  assert.equal(business.nmiContextKind, "BUSINESS");
  assert.equal(business.nmiStructureAuthority, "NMI:1");
  assert.equal(project.worldKind, "PROJECT");
  assert.equal(business.identity, project.identity);
  assert.equal(valueOf(business, "var:demand"), 100);
  assert.equal(valueOf(business, "var:capacity"), 110);
  assert.equal(valueOf(project, "var:planned"), 0.71);
  assert.equal(valueOf(project, "var:actual"), 0.63);
  const hybrid = instantiateRmsGroundTruth({
    worldId: "world:hybrid",
    worldKind: "HYBRID",
    nmiContextKind: "HYBRID",
    label: "Hybrid reserved",
    facts: [{ factId: "f-1", key: "demand", value: 1 }],
  });
  assert.equal(hybrid.worldKind, "HYBRID");
});

test("3–5 clock, events, and history are deterministic", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "northstar-a");
  const before = inspectRmsGroundTruth(created, observer);
  assert.equal(before.clock.tick, 0);
  applyRmsGroundTruthEvents(created, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  const after = inspectRmsGroundTruth(created, observer);
  assert.equal(after.clock.tick, 2);
  assert.equal(valueOf(after, "var:demand"), 125);
  assert.equal(valueOf(after, "var:capacity"), 85);
  assert.equal(after.history.length, 2);
  assert.equal(after.history[0]?.beforeValue, 100);
  assert.equal(after.history[0]?.afterValue, 125);
  assert.equal(after.history[0]?.nexoraEvidence, false);
  assert.equal(after.paused, false);
});

test("6 Observer inspects and cannot mutate Ground Truth", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "observer");
  const world = inspectRmsGroundTruth(created, observer);
  assert.equal(world.worldId, "world:northstar");
  assert.throws(() => applyRmsGroundTruthEvents(created, observer, [NORTHSTAR_DEMAND_EVENT]));
  assert.equal(valueOf(inspectRmsGroundTruth(created, observer), "var:demand"), 100);
});

test("7–8 Manager Agent and Nexora cannot inspect sealed Ground Truth", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "firewall-actors");
  assert.throws(() => inspectRmsGroundTruth(created, manager));
  assert.throws(() => inspectRmsGroundTruth(created, nexora));
  assert.throws(() => applyRmsGroundTruthEvents(created, manager, [NORTHSTAR_DEMAND_EVENT]));
  assert.throws(() => applyRmsGroundTruthEvents(created, nexora, [NORTHSTAR_DEMAND_EVENT]));
});

test("9–10 Ground Truth does not enter Data Reality or Nexora knowledge", () => {
  const created = sessionOf(createNorthstarManufacturingWorld(), "firewall-planes");
  applyRmsGroundTruthEvents(created, operator, [NORTHSTAR_DEMAND_EVENT]);
  assert.equal(created.observableData.length, 0);
  const knowledge = readRmsNexoraKnowledge(created);
  assert.equal(knowledge.worldId, null);
  assert.equal(knowledge.facts.length, 0);
  assert.doesNotMatch(JSON.stringify(created), /var:demand/);
  assert.equal(inspectRmsGroundTruth(created, observer).publishedToObservableData, false);
  assert.equal(inspectRmsGroundTruth(created, observer).publishedToNexoraKnowledge, false);
});

test("11–13 PROJECT transition and deterministic replay share one RMS foundation", () => {
  const projectSession = sessionOf(createWarehouseExpansionWorld(), "warehouse-a");
  applyRmsGroundTruthEvents(projectSession, operator, [WAREHOUSE_PROGRESS_EVENT]);
  assert.equal(valueOf(inspectRmsGroundTruth(projectSession, observer), "var:actual"), 0.65);
  const first = sessionOf(createNorthstarManufacturingWorld(), "replay-a");
  const second = sessionOf(createNorthstarManufacturingWorld(), "replay-b");
  applyRmsGroundTruthEvents(first, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  applyRmsGroundTruthEvents(second, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  const a = inspectRmsGroundTruth(first, observer);
  const b = inspectRmsGroundTruth(second, observer);
  assert.equal(a.identity, b.identity);
  assert.deepEqual(a.facts, b.facts);
  assert.deepEqual(a.clock, b.clock);
  assert.equal(a.history.length, b.history.length);
  pauseRmsGroundTruth(first, operator, true);
  assert.throws(() => applyRmsGroundTruthEvents(first, operator, [NORTHSTAR_DEMAND_EVENT]));
});
