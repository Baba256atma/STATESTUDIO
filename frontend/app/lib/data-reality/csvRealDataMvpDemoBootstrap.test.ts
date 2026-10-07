import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  CSV_MVP_DEMO_BOOTSTRAP_BOUNDARY,
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_INVENTORY_TEXT,
  CSV_MVP_DEMO_INVENTORY_VALUES,
  CSV_MVP_DEMO_PENDING_FILE,
  csvRealDataMvpDemoBootstrapIdentity,
  ensureCsvMvpDemoBootstrap,
} from "./csvRealDataMvpDemoBootstrap.ts";
import {
  csvImportCandidateId,
  getCsvImportCandidate,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "./csvRealDataImportStore.ts";
import { projectAdvisorAcceptedVisualEvidence } from "../manager-object/nexoraAdvisorVisualEvidence.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

test("CEI:3 live-data A — bootstrap identity is not a parallel authority", () => {
  assert.equal(csvRealDataMvpDemoBootstrapIdentity, "RDI:2/CsvMvpDemoBootstrap");
  assert.equal(CSV_MVP_DEMO_BOOTSTRAP_BOUNDARY.ownsCsvStore, false);
  assert.equal(CSV_MVP_DEMO_BOOTSTRAP_BOUNDARY.ownsChartRenderer, false);
  assert.equal(CSV_MVP_DEMO_BOOTSTRAP_BOUNDARY.seedsRenderer, false);
  assert.equal(CSV_MVP_DEMO_BOOTSTRAP_BOUNDARY.demoDataOnly, true);
});

test("CEI:3 live-data B — demo CSV matches the governed fixture and is not renderer-owned", () => {
  const fixture = readFileSync(
    join(HERE, "fixtures/cei3-mvp-demo-inventory.csv"),
    "utf8",
  );
  assert.equal(CSV_MVP_DEMO_INVENTORY_TEXT, fixture);
  const renderer = readFileSync(
    join(HERE, "../../executive/nex-mvp/stage/NexoraEvidenceVisualView.tsx"),
    "utf8",
  );
  assert.doesNotMatch(renderer, /2026-01-01,80/);
  assert.doesNotMatch(renderer, /Inventory On Hand\n2026-01-01/);
});

test("CEI:3 live-data C — prepare+commit yields accepted Inventory observations", () => {
  resetCsvRealDataImportStoreForTests();
  const report = ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  assert.equal(report.inventorySeeded, true);
  assert.equal(report.inventoryAlreadyPresent, false);
  const imports = listCsvRealDataImports("overview");
  assert.equal(imports.length, 1);
  assert.equal(imports[0]?.prepared.fileName, CSV_MVP_DEMO_INVENTORY_FILE);
  assert.equal(
    imports[0]?.prepared.mapping.mappings.some(
      (mapping) => mapping.targetId === "inventory.on-hand" && mapping.confirmed,
    ),
    true,
  );
  const projected = projectAdvisorAcceptedVisualEvidence({
    workspaceId: "overview",
    subjectId: "obj-inventory",
    subjectLabel: "Inventory",
  });
  assert.equal(projected.bundle.acceptedIntoDataReality, true);
  assert.equal(projected.bundle.series[0]?.id, "obj-inventory");
  assert.equal(projected.bundle.series[0]?.points.length, 6);
  assert.deepEqual(
    projected.bundle.series[0]?.points.map((point) => ({
      periodLabel: point.periodLabel,
      value: point.value,
    })),
    [...CSV_MVP_DEMO_INVENTORY_VALUES],
  );
  resetCsvRealDataImportStoreForTests();
});

test("CEI:3 live-data D — existing accepted Inventory is not replaced", () => {
  resetCsvRealDataImportStoreForTests();
  assert.equal(ensureCsvMvpDemoBootstrap({ workspaceId: "overview" }).inventorySeeded, true);
  const second = ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  assert.equal(second.inventorySeeded, false);
  assert.equal(second.inventoryAlreadyPresent, true);
  assert.equal(listCsvRealDataImports("overview").length, 1);
  resetCsvRealDataImportStoreForTests();
});

test("CEI:3 live-data E — pending ambiguous CSV stays unaccepted", () => {
  resetCsvRealDataImportStoreForTests();
  const report = ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  assert.equal(report.pendingSeeded, true);
  const pending = getCsvImportCandidate(
    "overview",
    csvImportCandidateId("overview", CSV_MVP_DEMO_PENDING_FILE),
  );
  assert.equal(pending?.status, "preview");
  const capacity = projectAdvisorAcceptedVisualEvidence({
    workspaceId: "overview",
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
  });
  assert.equal(capacity.bundle.series.length, 0);
  resetCsvRealDataImportStoreForTests();
});
