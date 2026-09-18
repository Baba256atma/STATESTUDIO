/**
 * NPA-T RMS:7 — Scenario Library tests.
 * Does not start RMS:8. Scenario = world + conditions, not a Nexora answer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { NMI_FOUNDATION_CONTRACT } from "@/app/lib/nmi/nmiContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { RMS_2_BOUNDARY } from "./rmsWorldContract.ts";
import { RMS_3_BOUNDARY } from "./rmsOperatorContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_5_BOUNDARY } from "./rmsObserverContract.ts";
import { RMS_6_BOUNDARY } from "./rmsEventContract.ts";
import { RMS_7_BOUNDARY, RMS_SCENARIO_FORBIDDEN_KEYS } from "./rmsScenarioContract.ts";
import type { RmsScenarioDefinition } from "./rmsScenarioContract.ts";
import { listRmsScenarios, getRmsScenario, filterRmsScenarios, inspectRmsScenarioCapabilities } from "./rmsScenarioRegistry.ts";
import { validateRmsScenarioDefinition, verifyRmsScenarioLibrary } from "./rmsScenarioValidation.ts";
import { executeRmsScenario, runRmsScenario } from "./rmsScenarioRunner.ts";
import {
  RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
  RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
  RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE,
  RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
} from "./rmsScenarioLibrary.ts";
import { instantiateHybridTemplate, worldKindForTemplate } from "./rmsWorldTemplates.ts";
import {
  inspectRmsEventSchedule,
  inspectRmsGroundTruth,
  inspectRmsManagerConversation,
  inspectRmsObserverReport,
  inspectRmsOperatorLedger,
  readRmsNexoraKnowledge,
} from "./rmsSession.ts";
import { RMS_SCENARIO_OBSERVER_ACTOR } from "./rmsScenarioRunner.ts";

const observer = RMS_SCENARIO_OBSERVER_ACTOR;
const here = dirname(fileURLToPath(import.meta.url));

test("1–4 canonical definition, composition, identity, no scenario engines", () => {
  assert.equal(verifyRmsScenarioLibrary().ok, true);
  assert.equal(RMS_7_BOUNDARY.ownsScenarioDefinition, true);
  assert.equal(RMS_7_BOUNDARY.ownsGroundTruthEngine, false);
  assert.equal(RMS_7_BOUNDARY.ownsOperatorEngine, false);
  assert.equal(RMS_7_BOUNDARY.ownsManagerEngine, false);
  assert.equal(RMS_7_BOUNDARY.ownsObserverEngine, false);
  assert.equal(RMS_7_BOUNDARY.ownsEventEngine, false);
  assert.equal(RMS_7_BOUNDARY.startsRms8, false);
  assert.equal(RMS_7_BOUNDARY.encodesExpectedNexoraAnswer, false);
  const manufacturing = getRmsScenario("manufacturing-capacity-pressure", "1.0");
  assert.equal(manufacturing.scenarioId, "manufacturing-capacity-pressure");
  assert.equal(manufacturing.version, "1.0");
  validateRmsScenarioDefinition(manufacturing);
  const files = readdirSync(here).filter((name) => name.startsWith("rms") && name.endsWith("Engine.ts"));
  assert.deepEqual(
    files.sort(),
    ["rmsWorldEngine.ts"],
  );
  assert.equal(RMS_6_BOUNDARY.transitionAuthority.includes("applyRmsWorldEventsOnCurrentTick"), true);
});

test("5–11 instantiate BUSINESS/PROJECT/HYBRID, sources, events, manager firewall", () => {
  const business = RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.instantiateWorld();
  assert.equal(business.worldKind, "BUSINESS");
  assert.equal(business.variables.find((item) => item.key === "demand")?.value, 100);
  assert.equal(business.variables.find((item) => item.key === "availableCapacity")?.value, 110);
  const project = RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE.instantiateWorld();
  assert.equal(project.worldKind, "PROJECT");
  assert.equal(project.variables.find((item) => item.key === "plannedProgress")?.value, 0.71);
  const hybridWorld = instantiateHybridTemplate();
  assert.equal(hybridWorld.worldKind, "HYBRID");
  assert.equal(worldKindForTemplate("project-delivery"), "PROJECT");
  assert.equal(worldKindForTemplate("hybrid-reserved"), "HYBRID");
  const hybrid: RmsScenarioDefinition = {
    ...RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
    scenarioId: "hybrid-reserved-parity",
    worldKind: "HYBRID",
    instantiateWorld: instantiateHybridTemplate,
    eventSchedule: Object.freeze([]),
    durationTicks: 0,
    managerTurns: 0,
  };
  validateRmsScenarioDefinition(hybrid);
  const hybridRun = executeRmsScenario({ scenario: hybrid, runId: "hybrid-parity" });
  assert.equal(hybridRun.result.lifecycle, "completed");
  assert.ok(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.enabledSources.includes("PRODUCTION"));
  assert.ok(RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE.enabledSources.includes("PMO"));
  assert.equal(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.eventSchedule[0]?.scheduledTick, 10);
  assert.equal(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.managerProfileId, "DATA_DRIVEN_MANAGER");
  assert.equal(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.managerObjective.hostKind, "BUSINESS");
  assert.doesNotMatch(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.managerVisibleContext.join(" "), /availableCapacity|evt:/);
});

test("12–16 metadata, taxonomy, registry, validation fail-early, forbidden answers", () => {
  assert.equal(listRmsScenarios().length, 4);
  assert.equal(filterRmsScenarios({ worldKind: "PROJECT" }).length, 1);
  assert.equal(filterRmsScenarios({ category: "LOGISTICS" })[0]?.scenarioId, "logistics-delivery-pressure");
  assert.equal(inspectRmsScenarioCapabilities("service-capacity-pressure").category, "SERVICE");
  assert.equal(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.customer.disclosesHiddenEvents, false);
  assert.ok(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.customer.managementTopics.includes("capacity management"));
  for (const key of RMS_SCENARIO_FORBIDDEN_KEYS) {
    assert.equal(Object.prototype.hasOwnProperty.call(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE, key), false);
  }
  assert.throws(() => getRmsScenario("missing", "1.0"));
  assert.throws(() =>
    validateRmsScenarioDefinition({
      ...RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
      scenarioId: "Bad Id",
    }),
  );
  assert.throws(() =>
    validateRmsScenarioDefinition({
      ...RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
      enabledSources: ["ERP", "NOT_A_SOURCE" as never],
    }),
  );
  assert.throws(() =>
    validateRmsScenarioDefinition({
      ...RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
      managerVisibleContext: Object.freeze(["availableCapacity is 110"]),
    }),
  );
  assert.throws(() =>
    validateRmsScenarioDefinition({
      ...RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
      eventSchedule: Object.freeze([
        RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE.eventSchedule[0]!,
        RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE.eventSchedule[0]!,
      ]),
    }),
  );
  const encoded = {
    ...RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
    expectedProblem: "Capacity Gap",
  } as RmsScenarioDefinition & { expectedProblem: string };
  assert.throws(() => validateRmsScenarioDefinition(encoded));
});

test("17–22 four library runs, imperfect data, Observer attached", () => {
  const manufacturing = executeRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0", runId: "mfg-a" });
  const project = executeRmsScenario({ scenarioId: "project-delivery-pressure", version: "1.0", runId: "prj-a" });
  const logistics = executeRmsScenario({ scenarioId: "logistics-delivery-pressure", version: "1.0", runId: "log-a" });
  const service = executeRmsScenario({ scenarioId: "service-capacity-pressure", version: "1.0", runId: "svc-a" });
  assert.equal(manufacturing.result.lifecycle, "completed");
  assert.equal(project.result.lifecycle, "completed");
  assert.equal(logistics.result.lifecycle, "completed");
  assert.equal(service.result.lifecycle, "completed");
  assert.ok(manufacturing.result.eventTraceIds.includes("evt:demand-surge"));
  assert.ok(manufacturing.result.eventTraceIds.includes("evt:machine-failure"));
  assert.ok(project.result.eventTraceIds.includes("evt:resource-shortage"));
  const mfgWorld = inspectRmsGroundTruth(manufacturing.session, observer);
  assert.equal(mfgWorld.variables.find((item) => item.key === "demand")?.value, 125);
  assert.equal(mfgWorld.variables.find((item) => item.key === "machineAvailability")?.value, 0);
  const mfgObs = inspectRmsOperatorLedger(manufacturing.session, observer).observations;
  assert.ok(mfgObs.some((item) => item.field === "CAP_AV" && item.semanticConfirmation === false));
  assert.ok(mfgObs.some((item) => item.field === "downtime_unreported" && item.status === "MISSING"));
  assert.ok(mfgObs.some((item) => item.field === "inventory_quantity"));
  const logObs = inspectRmsOperatorLedger(logistics.session, observer).observations;
  assert.equal(logObs.some((item) => item.sourceFamily === "PRODUCTION"), false);
  assert.ok(logObs.some((item) => item.sourceFamily === "INVENTORY"));
  for (const run of [manufacturing, project, logistics, service]) {
    const report = inspectRmsObserverReport(run.session, observer).report;
    assert.ok(report);
    assert.ok(report.measurements.length > 0);
    assert.equal(run.result.observerMeasurementCount, report.measurements.length);
  }
});

test("23–26 run result seal, isolation, replay, fork compatibility", () => {
  const first = executeRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0", runId: "iso-mfg" });
  const second = executeRmsScenario({ scenarioId: "project-delivery-pressure", version: "1.0", runId: "iso-prj" });
  assert.notEqual(first.result.runId, second.result.runId);
  assert.notEqual(inspectRmsGroundTruth(first.session, observer).worldId, inspectRmsGroundTruth(second.session, observer).worldId);
  assert.equal(inspectRmsManagerConversation(first.session, observer).objective?.objectiveId, "obj-delivery-pressure");
  assert.equal(inspectRmsManagerConversation(second.session, observer).objective?.objectiveId, "obj-progress");
  const publicJson = JSON.stringify(first.result);
  assert.doesNotMatch(publicJson, /machineAvailability|availableCapacity|Ground Truth/);
  assert.equal(first.result.sealedGroundTruthExposed, false);
  assert.equal(readRmsNexoraKnowledge(first.session).groundTruthExposed, false);
  const replayA = executeRmsScenario({ scenarioId: "logistics-delivery-pressure", version: "1.0", runId: "replay-1" });
  const replayB = executeRmsScenario({ scenarioId: "logistics-delivery-pressure", version: "1.0", runId: "replay-2" });
  assert.deepEqual(replayA.result.eventTraceIds, replayB.result.eventTraceIds);
  assert.deepEqual(
    inspectRmsGroundTruth(replayA.session, observer).variables.map((item) => item.value),
    inspectRmsGroundTruth(replayB.session, observer).variables.map((item) => item.value),
  );
  assert.deepEqual(
    inspectRmsManagerConversation(replayA.session, observer).turns.map((item) => item.utterance),
    inspectRmsManagerConversation(replayB.session, observer).turns.map((item) => item.utterance),
  );
  assert.equal(first.result.forkCompatible, true);
  assert.equal(RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE.forkCompatible, true);
  assert.equal(inspectRmsEventSchedule(first.session, observer).hiddenFromManager, true);
});

test("27–29 extensibility, no parallel authorities, RMS:1–6 boundaries remain", () => {
  const added: RmsScenarioDefinition = {
    ...RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
    scenarioId: "retail-inventory-pressure",
    title: "Retail Inventory Pressure",
  };
  const run = runRmsScenario({ scenario: added, runId: "retail-ext" });
  assert.equal(run.scenarioId, "retail-inventory-pressure");
  assert.equal(readdirSync(here).includes("rmsRetailEngine.ts"), false);
  assert.equal(RMS_7_BOUNDARY.ownsNmi, false);
  assert.equal(RMS_7_BOUNDARY.ownsVai, false);
  assert.equal(RMS_7_BOUNDARY.ownsDataReality, false);
  assert.equal(RMS_7_BOUNDARY.ownsAdvisor, false);
  assert.equal(RMS_7_BOUNDARY.ownsProblems, false);
  assert.equal(RMS_7_BOUNDARY.ownsDecisions, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.copiesCanonicalEntities, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsDataRealityInterpretation, false);
  assert.equal(RMS_2_BOUNDARY.ownsNmiSemantics, false);
  assert.equal(RMS_3_BOUNDARY.parallelDataReality, false);
  assert.equal(RMS_4_BOUNDARY.managerReadsGroundTruth, false);
  assert.equal(RMS_5_BOUNDARY.silentlyRepairs, false);
  assert.equal(RMS_6_BOUNDARY.injectsProblemObjects, false);
});
