/**
 * NPA-T RMS:5 — Observer Intelligence tests.
 * Does not start RMS:6. Observer remains read-only.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { RMS_5_BOUNDARY } from "./rmsObserverContract.ts";
import { measureRmsPerspectives, normalizeRmsObserverReport, verifyRmsObserverIntelligence } from "./rmsObserverMeasurement.ts";
import {
  RMS_OBSERVER_FIXTURE_BOUNDED_UNCERTAINTY,
  RMS_OBSERVER_FIXTURE_CAUSAL_OVERCLAIM,
  RMS_OBSERVER_FIXTURE_GROUND_TRUTH_LEAK,
  RMS_OBSERVER_FIXTURE_MANAGER_LEAK_TURN,
  RMS_OBSERVER_FIXTURE_OPERATOR_GAP,
  RMS_OBSERVER_FIXTURE_REFERENT_MISMATCH,
} from "./rmsObserverFixtures.ts";
import { RMS_STANDARD_MANAGER } from "./rmsManagerProfiles.ts";
import { RMS_NORTHSTAR_AGENDA, RMS_WAREHOUSE_AGENDA } from "./rmsManagerTurnGeneration.ts";
import { emptyRmsManagerKnowledge } from "./rmsManagerRuntime.ts";
import type { RmsManagerRecordedTurn } from "./rmsManagerRuntime.ts";
import {
  applyRmsGroundTruthEvents,
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  inspectRmsObserverReport,
  measureRmsObserverIntelligence,
  prepareRmsManagerConversation,
  publishRmsOperatorObservableData,
  readRmsNexoraKnowledge,
  runRmsManagerConversationTurn,
  runRmsOperatorObservation,
} from "./rmsSession.ts";
import {
  createNorthstarManufacturingWorld,
  createWarehouseExpansionWorld,
  NORTHSTAR_CAPACITY_EVENT,
  NORTHSTAR_DEMAND_EVENT,
  WAREHOUSE_PROGRESS_EVENT,
} from "./rmsWorldFixtures.ts";
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
    simulationId: "rms-5-sim",
    simulationType: "observer-intelligence",
    sessionId: `rms-5-${runId}`,
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

function fakeTurn(input: Partial<RmsManagerRecordedTurn> & Pick<RmsManagerRecordedTurn, "utterance" | "nexoraResponse">): RmsManagerRecordedTurn {
  return Object.freeze({
    turnIndex: input.turnIndex ?? 1,
    intent: input.intent ?? "UNDERSTAND",
    utterance: input.utterance,
    nexoraResponse: input.nexoraResponse,
    nexoraIntentKind: input.nexoraIntentKind ?? "ask",
    focusedSubjectId: input.focusedSubjectId ?? "ctx-problem-capacity",
    focusedSubjectLabel: input.focusedSubjectLabel ?? "Capacity Gap",
    confirmationRequired: false,
    rewritten: false,
  });
}

function primedNorthstar(runId: string) {
  const created = sessionOf(createNorthstarManufacturingWorld(), runId);
  applyRmsGroundTruthEvents(created, operator, [NORTHSTAR_DEMAND_EVENT, NORTHSTAR_CAPACITY_EVENT]);
  const records = runRmsOperatorObservation(created, operator);
  publishRmsOperatorObservableData(created, operator, records);
  return created;
}

test("RMS:5 verifies without starting RMS:6 or parallel authorities", () => {
  assert.equal(verifyRmsObserverIntelligence().ok, true);
  assert.equal(RMS_5_BOUNDARY.startsRms6, false);
  assert.equal(RMS_5_BOUNDARY.ownsRepair, false);
  assert.equal(RMS_5_BOUNDARY.parallelEvidence, false);
  assert.equal(RMS_5_BOUNDARY.parallelDataReality, false);
  assert.equal(RMS_5_BOUNDARY.parallelVai, false);
  assert.equal(RMS_5_BOUNDARY.parallelNmi, false);
  assert.equal(RMS_5_BOUNDARY.hiddenTruthIsNexoraDuty, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.dataRealityAuthority, "P0:1/NexoraDataRealityFoundation");
});

test("1–3 Observer is read-only, Ground Truth stays sealed, A/B/C/D stay distinct", () => {
  const created = primedNorthstar("layers");
  assert.throws(() => measureRmsObserverIntelligence(created, manager));
  assert.throws(() => measureRmsObserverIntelligence(created, nexora));
  const report = measureRmsObserverIntelligence(created, observer);
  assert.equal(report.writeAttempted, false);
  assert.equal(report.repaired, false);
  assert.deepEqual(report.layers.map((item) => item.layer), ["GROUND_TRUTH", "OBSERVABLE", "NEXORA", "MANAGER"]);
  assert.throws(() => inspectRmsGroundTruth(created, manager));
  assert.equal(readRmsNexoraKnowledge(created).worldId, null);
  assert.doesNotMatch(JSON.stringify(created), /availableCapacity/);
  assert.throws(() => inspectRmsObserverReport(created, manager));
});

test("4–7 A→B gap, B→C gap, information-bounded Nexora, hidden truth not required", () => {
  const created = primedNorthstar("gaps");
  const gap = measureRmsObserverIntelligence(created, observer, {
    omitObservableFields: RMS_OBSERVER_FIXTURE_OPERATOR_GAP.omitFields,
  });
  assert.ok(gap.measurements.some((item) => item.subtype === "OBSERVATION_GAP" && item.taxonomy === "OPERATOR_ERROR"));
  const publicationGap = measureRmsObserverIntelligence(created, observer, { publishedMetricKeys: [] });
  assert.ok(publicationGap.measurements.some((item) => item.subtype === "PUBLICATION_GAP" && item.taxonomy === "DATA_ERROR"));
  const world = inspectRmsGroundTruth(created, observer);
  const bounded = measureRmsPerspectives({
    simulationId: "s",
    runId: "bounded",
    world,
    observations: [],
    publications: [],
    publishedMetricKeys: ["CAP_AV"],
    managerTurns: [fakeTurn({ utterance: "Why?", nexoraResponse: RMS_OBSERVER_FIXTURE_BOUNDED_UNCERTAINTY })],
    managerKnowledge: emptyRmsManagerKnowledge(["Delivery is a concern."]),
    nexoraKnowledge: readRmsNexoraKnowledge(created),
    unauthorizedMutation: false,
    runtimeException: null,
  });
  assert.ok(bounded.measurements.some((item) => item.classification === "INFORMATION_BOUNDED_UNCERTAINTY" && item.taxonomy === "NO_ERROR"));
  assert.ok(bounded.measurements.some((item) => item.classification === "INFORMATION_BOUNDED_HIDDEN_TRUTH"));
  assert.equal(bounded.measurements.some((item) => item.subtype === "CAUSAL_OVERCLAIM"), false);
});

test("8–16 causal overclaim, referent, manager leak, ownership, evidence, no repair, leak critical", () => {
  const created = primedNorthstar("fixtures");
  const world = inspectRmsGroundTruth(created, observer);
  const knowledge = emptyRmsManagerKnowledge(["Delivery is a concern."]);
  const causal = measureRmsPerspectives({
    simulationId: "s",
    runId: "causal",
    world,
    observations: [],
    publications: [],
    publishedMetricKeys: ["CAP_AV"],
    managerTurns: [fakeTurn({ utterance: "Why?", nexoraResponse: RMS_OBSERVER_FIXTURE_CAUSAL_OVERCLAIM })],
    managerKnowledge: knowledge,
    nexoraKnowledge: readRmsNexoraKnowledge(created),
    unauthorizedMutation: false,
    runtimeException: null,
  });
  assert.ok(causal.measurements.some((item) => item.subtype === "CAUSAL_OVERCLAIM" && item.taxonomy === "NEXORA_ERROR"));
  const referent = measureRmsObserverIntelligence(created, observer, { fixtureReferent: RMS_OBSERVER_FIXTURE_REFERENT_MISMATCH });
  assert.ok(referent.measurements.some((item) => item.subtype === "REFERENT_ERROR" && item.taxonomy === "CONVERSATION_ERROR"));
  const leakMgr = measureRmsPerspectives({
    simulationId: "s",
    runId: "mgr-leak",
    world,
    observations: [],
    publications: [],
    publishedMetricKeys: [],
    managerTurns: [fakeTurn({ utterance: RMS_OBSERVER_FIXTURE_MANAGER_LEAK_TURN, nexoraResponse: "I need more data." })],
    managerKnowledge: knowledge,
    nexoraKnowledge: readRmsNexoraKnowledge(created),
    unauthorizedMutation: false,
    runtimeException: null,
  });
  assert.ok(leakMgr.measurements.some((item) => item.subtype === "KNOWLEDGE_LEAK" && item.taxonomy === "MANAGER_ERROR"));
  const sim = measureRmsObserverIntelligence(created, observer, { unauthorizedMutation: true });
  assert.ok(sim.measurements.some((item) => item.taxonomy === "SIMULATION_ERROR" && item.subtype === "UNAUTHORIZED_MUTATION"));
  assert.equal(sim.findings.find((item) => item.subtype === "UNAUTHORIZED_MUTATION")?.taxonomy, "SIMULATION_ERROR");
  const runtime = measureRmsObserverIntelligence(created, observer, { runtimeException: "adapter threw" });
  assert.ok(runtime.measurements.some((item) => item.taxonomy === "RUNTIME_ERROR"));
  const owned = measureRmsObserverIntelligence(created, observer, {
    omitObservableFields: RMS_OBSERVER_FIXTURE_OPERATOR_GAP.omitFields,
    fixtureReferent: RMS_OBSERVER_FIXTURE_REFERENT_MISMATCH,
  });
  const operatorFinding = owned.findings.find((item) => item.taxonomy === "OPERATOR_ERROR");
  const conversationFinding = owned.findings.find((item) => item.taxonomy === "CONVERSATION_ERROR");
  assert.equal(operatorFinding?.primaryOwnership, "OPERATOR_ERROR");
  assert.equal(conversationFinding?.primaryOwnership, "OPERATOR_ERROR");
  assert.ok((conversationFinding?.downstreamEffects.length ?? 0) >= 1);
  assert.ok(owned.findings.every((item) => item.measurementIds.length > 0));
  assert.ok(owned.findings.every((item) => item.repaired === false));
  const leak = measureRmsObserverIntelligence(created, observer, { fixtureLeak: RMS_OBSERVER_FIXTURE_GROUND_TRUTH_LEAK });
  assert.equal(leak.findings.find((item) => item.subtype === "FIREWALL_VIOLATION")?.severity, "CRITICAL_CONTRACT_FAILURE");
});

test("17–20 Northstar trace, uncertainty not failure, PROJECT parity, determinism", () => {
  const first = primedNorthstar("e2e-a");
  prepareRmsManagerConversation(first, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I manage Northstar operations."]),
  });
  runRmsManagerConversationTurn(first, manager);
  runRmsManagerConversationTurn(first, manager);
  const reportA = measureRmsObserverIntelligence(first, observer);
  assert.ok(reportA.traces.some((item) => item.groundTruthRef && item.observationRef && item.publicationRef));
  assert.ok(reportA.measurements.some((item) => item.classification === "INFORMATION_BOUNDED_HIDDEN_TRUTH" && item.taxonomy === "NO_ERROR"));
  const second = primedNorthstar("e2e-b");
  prepareRmsManagerConversation(second, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: NORTHSTAR_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I manage Northstar operations."]),
  });
  runRmsManagerConversationTurn(second, manager);
  runRmsManagerConversationTurn(second, manager);
  const reportB = measureRmsObserverIntelligence(second, observer);
  assert.deepEqual(normalizeRmsObserverReport(reportA), normalizeRmsObserverReport(reportB));
  const project = sessionOf(createWarehouseExpansionWorld(), "warehouse");
  applyRmsGroundTruthEvents(project, operator, [WAREHOUSE_PROGRESS_EVENT]);
  const records = runRmsOperatorObservation(project, operator);
  publishRmsOperatorObservableData(project, operator, records);
  prepareRmsManagerConversation(project, manager, {
    profile: RMS_STANDARD_MANAGER,
    objective: WAREHOUSE_OBJECTIVE,
    knowledge: emptyRmsManagerKnowledge(["I sponsor Warehouse Expansion."]),
  });
  runRmsManagerConversationTurn(project, manager);
  const projectReport = measureRmsObserverIntelligence(project, observer);
  assert.equal(projectReport.identity, RMS_5_BOUNDARY.identity);
  assert.deepEqual(projectReport.layers.map((item) => item.layer), ["GROUND_TRUTH", "OBSERVABLE", "NEXORA", "MANAGER"]);
  assert.equal(projectReport.repaired, false);
});
