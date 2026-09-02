import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { commitPreparedCsvRealDataImport, resetCsvRealDataImportStoreForTests } from "../../../lib/data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import { projectExecutiveSourceIntelligence } from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import { describeCsvImportValidationError, matchesCsvReplacementIdentity } from "./NexoraCsvRealDataImportFlow.tsx";
import { projectCsvDataRailSource, projectNexoraDataRailLibrary } from "./nexoraDataRailPresentation.ts";
import { createNexoraLiveConnection, transitionNexoraLiveConnection } from "../../../lib/data-reality/liveDataConnectorFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));

function source() {
  resetCsvRealDataImportStoreForTests();
  const csv = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
  const prepared = prepareCsvRealDataImport({ workspaceId: "overview", fileName: "delivery.csv", fileSize: csv.length, csvText: csv, importId: "rail-1", importedAt: "2026-08-30T12:00:00.000Z" });
  const result = commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "overview", mode: "new", committedAt: "2026-08-30T12:01:00.000Z" });
  assert.ok(result.current);
  return result.current;
}

test("maps canonical source truth to manager language without a second status machine", () => {
  const committed = source();
  const view = projectCsvDataRailSource({ committed, intelligence: projectExecutiveSourceIntelligence(committed), active: true });
  assert.equal(view.label, "delivery.csv");
  assert.equal(view.sourceTypeLabel, "CSV");
  assert.equal(view.validationState, "valid");
  assert.equal(view.understandingState, "validated-mapping");
  assert.equal(view.dataObjectId.startsWith("data-source:"), true);
  assert.equal(view.active, true);
  assert.doesNotMatch(JSON.stringify(view), /confidence|causal|evidence/i);
});

test("update source preserves canonical source identity", () => {
  const committed = source();
  assert.equal(matchesCsvReplacementIdentity(committed, "delivery.csv"), true);
  assert.equal(matchesCsvReplacementIdentity(committed, "data-ux3-update.csv"), true);
  assert.equal(matchesCsvReplacementIdentity(committed, "not-a-csv.json"), false);
  const flowSource = readFileSync(join(here, "NexoraCsvRealDataImportFlow.tsx"), "utf8");
  assert.match(flowSource, /sourceContextId:\s*props\.replacementSource\.sourceContextId/);
});

test("library empty CSV copy is independent of connected source count", () => {
  resetCsvRealDataImportStoreForTests();
  const live = transitionNexoraLiveConnection(createNexoraLiveConnection({
    connectionId: "github:overview:vercel/next.js",
    workspaceId: "overview",
    providerId: "github",
    providerType: "source-control",
    displayName: "Engineering Source",
    capabilities: Object.freeze(["manual-fetch", "refresh", "health-check"]),
    createdAt: "2026-08-31T12:00:00.000Z",
    configurationReference: "github:vercel/next.js",
  }), "connected", "2026-08-31T12:00:00.000Z");
  const emptyCsv = projectNexoraDataRailLibrary({
    csvImports: [],
    liveConnections: [live],
    latestObservationByConnectionId: {},
    activeCsvSourceId: null,
    activeLiveSourceContextId: null,
  });
  assert.equal(emptyCsv.csvEmpty, true);
  assert.equal(emptyCsv.csvCount, 0);
  assert.equal(emptyCsv.connectedCount, 1);
  assert.equal(emptyCsv.totalCount, 1);
  assert.equal(emptyCsv.connectedRows[0]?.label, "Engineering Source");
  assert.equal(emptyCsv.connectedRows[0]?.typeLabel, "Connected");

  const committed = source();
  const withCsv = projectNexoraDataRailLibrary({
    csvImports: [committed],
    liveConnections: [live],
    latestObservationByConnectionId: {},
    activeCsvSourceId: committed.sourceContextId,
    activeLiveSourceContextId: null,
  });
  assert.equal(withCsv.csvEmpty, false);
  assert.equal(withCsv.csvCount, 1);
  assert.equal(withCsv.totalCount, 2);
  assert.equal(withCsv.csvRows[0]?.label, "delivery.csv");
  assert.equal(withCsv.csvRows[0]?.active, true);
});

test("manager validation copy explains the relevant missing field while raw diagnostics remain available", () => {
  const diagnostic = 'KPI "kpi.revenue.growth" is missing required metric "revenue.previousRevenue".';
  assert.equal(
    describeCsvImportValidationError(diagnostic),
    "Nexora needs Previous Revenue before this data can be used for Revenue.",
  );
  assert.match(diagnostic, /kpi\.revenue\.growth/);
});
