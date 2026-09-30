import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import test from "node:test";

import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { executeRmsScenario, RMS_SCENARIO_OBSERVER_ACTOR } from "../rms/rmsScenarioRunner.ts";
import { inspectRmsOperatorLedger } from "../rms/rmsSession.ts";
import { SIM_TEST_1_BOUNDARY } from "./nexoraSimulationTestContract.ts";
import {
  SIM_TEST_2_BOUNDARY,
  SIM_TEST_INGESTION_TRACE_KINDS,
  SIM_TEST_SCENARIO_CSV_SOURCES,
  ingestSimulationCsvFile,
  projectRmsOperatorRecordsToCsv,
} from "./nexoraSimulationCsvIngestion.ts";
import {
  SIM_TEST_2_INGESTION_JOURNEYS,
  SIM_TEST_2_MANUFACTURING_INGESTION,
} from "./nexoraSimulationIngestionJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import { SIM_TEST_MANUFACTURING_BASELINE } from "./nexoraSimulationTestJourneys.ts";

const here = dirname(fileURLToPath(import.meta.url));
const watchSource = readFileSync(join(here, "../../executive/watch/RmsWatchExperience.tsx"), "utf8");
let cachedReports: ReturnType<typeof runNexoraSimulationTestJourney>[] | null = null;

function reports() {
  if (!cachedReports) {
    resetCsvRealDataImportStoreForTests();
    cachedReports = SIM_TEST_2_INGESTION_JOURNEYS.map((journey, index) =>
      runNexoraSimulationTestJourney({ journey, runId: `sim-test-2-focused-${index}` }),
    );
  }
  return cachedReports;
}

function manufacturingRecords() {
  const executed = executeRmsScenario({ scenarioId: "manufacturing-capacity-pressure", version: "1.0", runId: "sim-test-2-fixture" });
  return inspectRmsOperatorLedger(executed.session, RMS_SCENARIO_OBSERVER_ACTOR).observations;
}

test("1–5 — SIM-TEST:1/FAST remain operational; INGESTION activates the existing Operator without a CSV Agent", () => {
  assert.equal(SIM_TEST_1_BOUNDARY.identity, "NPA-T SIM-TEST:1/NexoraSimulationTestHarness");
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_MANUFACTURING_BASELINE, runId: "sim-test-2-fast" });
  assert.equal(fast.harnessStatus, "PASS");
  assert.equal(fast.ingestionActivated, false);
  assert.ok(reports().every((item) => item.ingestionActivated && item.ingestion));
  assert.equal(SIM_TEST_2_BOUNDARY.csvOwner, "NPA-T RMS:3/OperatorObservableData");
  assert.equal(SIM_TEST_2_BOUNDARY.createsCsvAgent, false);
});

test("6–10 — sealed Ground Truth is excluded and the real RDI:2/RDI:1 Gate is the only Data Reality path", () => {
  assert.equal(SIM_TEST_2_BOUNDARY.exposesGroundTruth, false);
  assert.equal(SIM_TEST_2_BOUNDARY.parserAndGate, "RDI:2/NexoraCsvRealDataVerticalSlice");
  assert.equal(SIM_TEST_2_BOUNDARY.handoff, "RDI:1/NexoraRealDataIntegrationFoundation");
  assert.equal(SIM_TEST_2_BOUNDARY.createsGate, false);
  assert.equal(SIM_TEST_2_BOUNDARY.writesDataRealityDirectly, false);
  for (const report of reports()) {
    for (const file of report.ingestion!.files) {
      assert.equal(file.provenance.sealedGroundTruthIncluded, false);
      assert.doesNotMatch(file.csvText, /bearing_damage|machineFailure|failureCause|Ground Truth/i);
    }
    assert.ok(report.ingestion!.states.every((item) => item.gateIdentity === "RDI:2/NexoraCsvRealDataVerticalSlice"));
  }
});

test("11–15 — required source families generate and manufacturing files evolve across ticks", () => {
  assert.deepEqual(SIM_TEST_SCENARIO_CSV_SOURCES["manufacturing-capacity-pressure"], ["ERP", "PRODUCTION", "INVENTORY", "MAINTENANCE"]);
  assert.deepEqual(SIM_TEST_SCENARIO_CSV_SOURCES["project-delivery-pressure"], ["PMO", "PROJECT_CONTROL"]);
  assert.deepEqual(SIM_TEST_SCENARIO_CSV_SOURCES["logistics-delivery-pressure"], ["ERP", "INVENTORY"]);
  assert.deepEqual(SIM_TEST_SCENARIO_CSV_SOURCES["service-capacity-pressure"], ["CRM", "HR"]);
  const manufacturing = reports()[0]!;
  const production = manufacturing.ingestion!.files.filter((item) => item.sourceType === "PRODUCTION");
  assert.deepEqual(production.map((item) => item.generatedAtTick), [0, 7, 21]);
  assert.notEqual(production[0]!.csvText, production.at(-1)!.csvText);
});

test("16 — provenance survives the real Gate handoff", () => {
  const completed = reports()[0]!.ingestion!.states.find((item) => item.committed)!;
  assert.ok(completed.publicationRef);
  assert.equal(completed.file.provenance.schemaVersion, "sim-test.csv.v1");
  assert.ok(completed.file.provenance.simulationRunId.includes("sim-test-2-focused"));
  const provenance = completed.prepared!.handoff!.factProvenance[0]!.provenance;
  assert.equal(provenance.sourceId, completed.file.provenance.sourceContextId);
  assert.equal(provenance.observedAt, completed.file.generatedAt);
  assert.match(provenance.transformationRef ?? "", /rdi2:mapping/);
});

test("17 — ambiguous capacity remains unconfirmed and cannot update Data Reality", () => {
  const [production] = projectRmsOperatorRecordsToCsv({
    scenarioId: "manufacturing-capacity-pressure",
    simulationRunId: "ambiguity",
    tick: 21,
    records: manufacturingRecords().filter((item) => item.sourceFamily === "PRODUCTION"),
    policy: { headerOverrides: { CAP_AV: "capacity" } },
  }).filter((item) => item.sourceType === "PRODUCTION");
  const state = ingestSimulationCsvFile(production!);
  assert.equal(state.state, "MAPPING_REQUIRED");
  assert.equal(state.committed, false);
  assert.equal(state.semanticConfirmationBySimulator, false);
  assert.ok(state.prepared!.mapping.mappings.some((item) => item.sourceColumn === "capacity" && !item.confirmed));
});

test("18 — missing operational fields remain absent", () => {
  const production = projectRmsOperatorRecordsToCsv({
    scenarioId: "manufacturing-capacity-pressure",
    simulationRunId: "missing",
    tick: 21,
    records: manufacturingRecords(),
    policy: { omitFields: ["CAP_AV"] },
  }).find((item) => item.sourceType === "PRODUCTION")!;
  assert.doesNotMatch(production.csvText, /availableCapacity|CAP_AV/);
  const state = ingestSimulationCsvFile(production);
  assert.equal(
    state.prepared?.handoff?.dataset.records.some(
      (item) => item.metricKey === "totalCapacity",
    ) ?? false,
    false,
  );
});

test("19 — a stale source retains its earlier version and is labeled stale", () => {
  const records = manufacturingRecords();
  const initial = projectRmsOperatorRecordsToCsv({ scenarioId: "manufacturing-capacity-pressure", simulationRunId: "stale", tick: 12, records });
  const later = projectRmsOperatorRecordsToCsv({
    scenarioId: "manufacturing-capacity-pressure",
    simulationRunId: "stale",
    tick: 20,
    records,
    previous: initial,
    policy: { staleSourceAfterTick: { MAINTENANCE: 12 } },
  });
  const before = initial.find((item) => item.sourceType === "MAINTENANCE")!;
  const after = later.find((item) => item.sourceType === "MAINTENANCE")!;
  assert.equal(after.generatedAtTick, before.generatedAtTick);
  assert.equal(after.csvText, before.csvText);
  assert.equal(after.stale, true);
});

test("20 — conflicting sources preserve both values and SIM-TEST chooses no winner", () => {
  const files = projectRmsOperatorRecordsToCsv({
    scenarioId: "manufacturing-capacity-pressure",
    simulationRunId: "conflict",
    tick: 21,
    records: manufacturingRecords(),
    policy: { conflicts: [{ sourceType: "ERP", field: "CAP_AV", value: 82 }] },
  });
  const erp = files.find((item) => item.sourceType === "ERP")!;
  const production = files.find((item) => item.sourceType === "PRODUCTION")!;
  assert.match(erp.csvText, /82/);
  assert.match(production.csvText, /85/);
  assert.equal(SIM_TEST_2_BOUNDARY.confirmsAmbiguousSemantics, false);
});

test("21 — delayed data cannot enter CSV or Data Reality before release tick", () => {
  const records = manufacturingRecords();
  const before = projectRmsOperatorRecordsToCsv({
    scenarioId: "manufacturing-capacity-pressure", simulationRunId: "delay", tick: 20, records,
    policy: { delayedFieldsUntilTick: { CAP_AV: 24 } },
  }).find((item) => item.sourceType === "PRODUCTION")!;
  const after = projectRmsOperatorRecordsToCsv({
    scenarioId: "manufacturing-capacity-pressure", simulationRunId: "delay", tick: 24, records,
    policy: { delayedFieldsUntilTick: { CAP_AV: 24 } },
  }).find((item) => item.sourceType === "PRODUCTION")!;
  assert.doesNotMatch(before.csvText, /Production Total Capacity/);
  assert.match(after.csvText, /Production Total Capacity/);
});

test("22–24 — Observer traces every boundary while Manager remains information-bounded", () => {
  const manufacturing = reports()[0]!;
  const kinds = new Set(manufacturing.ingestion!.traces.map((item) => item.kind));
  for (const kind of SIM_TEST_INGESTION_TRACE_KINDS) assert.ok(kinds.has(kind), `missing ${kind}`);
  assert.ok(manufacturing.ingestion!.traces.every((item) => item.observerOnly && !item.writeAttempted));
  assert.equal(SIM_TEST_1_BOUNDARY.ownsGroundTruth, false);
  for (const checkpoint of manufacturing.checkpoints) {
    assert.doesNotMatch(checkpoint.managerUtterance ?? "", /Ground Truth|Observer|SIM-TEST/);
    assert.doesNotMatch(checkpoint.nexoraResponse ?? "", /Ground Truth|Observer diagnostics/);
  }
});

test("25–30 — WATCH cards, start action, Data/Files inspector, history, and Stage separation are wired", () => {
  assert.match(watchSource, /data-testid={`rms-watch-card-\$\{card\.scenarioId\}`}/);
  assert.match(watchSource, /onClick=\{\(\) => setSelected\(card\)\}/);
  assert.match(watchSource, /data-testid="rms-watch-begin"/);
  assert.match(watchSource, /startRmsWatchSession/);
  assert.match(watchSource, /data-testid="rms-watch-data-files"/);
  assert.match(watchSource, /data-testid="rms-watch-csv-inspector"/);
  assert.match(watchSource, /data-testid="rms-watch-file-history"/);
  assert.match(watchSource, /data-testid="rms-watch-stage"/);
  assert.equal(SIM_TEST_2_BOUNDARY.dataReality, "P0:1/NexoraDataRealityFoundation");
});

test("31–33 — manufacturing/project INGESTION and logistics/service parity execute on one architecture", () => {
  const all = reports();
  assert.equal(all.length, 4);
  assert.ok(all.every((item) => item.harnessStatus === "PASS" && item.ingestionActivated));
  assert.ok(all[0]!.ingestion!.states.some((item) => item.committed));
  assert.ok(all[1]!.ingestion!.states.every((item) => item.committed));
  assert.ok(all[2]!.ingestion!.states.some((item) => item.committed));
  assert.ok(all[3]!.ingestion!.states.some((item) => item.committed));
  assert.equal(SIM_TEST_2_MANUFACTURING_INGESTION.mode, "INGESTION");
});

test("34–35 — regression gates are owned by the final certification commands", () => {
  assert.equal(SIM_TEST_2_BOUNDARY.createsParser, false);
  assert.equal(SIM_TEST_2_BOUNDARY.createsMapper, false);
  assert.equal(SIM_TEST_1_BOUNDARY.createsRms11, false);
});
