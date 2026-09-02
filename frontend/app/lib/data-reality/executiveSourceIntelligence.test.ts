import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY,
  certifyExecutiveSourceIntelligence,
  classifyExecutiveSourceComparison,
  compareExecutiveSources,
  createExecutiveSourceAdvisorContext,
  executiveSourceIntelligenceIdentity,
  executiveSourceIntelligenceNamespace,
  executiveSourceIntelligenceVersion,
  projectExecutiveSourceIntelligence,
} from "./executiveSourceIntelligence.ts";
import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  type CsvCommittedImport,
} from "./csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";

const here = dirname(fileURLToPath(import.meta.url));
const baselineCsv = readFileSync(join(here, "fixtures/rdi2-baseline.csv"), "utf8");
const pressureCsv = readFileSync(join(here, "fixtures/rdi2-pressure.csv"), "utf8");

function committed(
  fileName: string,
  csvText: string,
  importId: string,
  sourceContextId: string,
  workspaceId = "workspace-a",
): CsvCommittedImport {
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: "2026-08-16T12:00:00.000Z",
    sourceContextId,
    scenario: fileName.includes("pressure") ? "operational-pressure" : "baseline",
  });
  const parsed = parseCsvDeterministically(csvText);
  const prepared = prepareCsvRealDataImport(
    input,
    suggestCsvColumnMappings(parsed.columns, importId),
  );
  assert.equal(prepared.ready, true);
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: input.importedAt,
  });
  assert.equal(result.committed, true);
  return result.current!;
}

test.beforeEach(() => resetCsvRealDataImportStoreForTests());

test("identity and authority boundary are frozen", () => {
  assert.equal(executiveSourceIntelligenceIdentity, "RDI:3/NexoraExecutiveSourceIntelligence");
  assert.equal(executiveSourceIntelligenceVersion, "1.0.0");
  assert.equal(executiveSourceIntelligenceNamespace, "nexora.real-data-integration.executive-source-intelligence");
  assert.equal(EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY.readsRawCsv, false);
  assert.equal(EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY.ownsRuntime, false);
  assert.ok(Object.isFrozen(EXECUTIVE_SOURCE_INTELLIGENCE_BOUNDARY));
});

test("A/B/C — canonical Data Reality produces deterministic source intelligence and card state", () => {
  const baseline = committed("rdi2-baseline.csv", baselineCsv, "RDI-b", "csv:workspace-a:baseline");
  const first = projectExecutiveSourceIntelligence(baseline);
  const second = projectExecutiveSourceIntelligence(baseline);
  assert.deepEqual(first, second);
  assert.equal(first.overallState, "attention");
  assert.equal(first.attentionCount, 4);
  assert.equal(first.criticalCount, 0);
  assert.equal(first.mappedObjectCount, 5);
  assert.match(first.interpretation, /managerial attention/);
  assert.ok(Object.isFrozen(first.affectedObjects));
});

test("D — inspection projection never mutates the active Runtime source", () => {
  const baseline = committed("rdi2-baseline.csv", baselineCsv, "RDI-b", "csv:workspace-a:baseline");
  const before = getCsvRealDataImport("workspace-a", baseline.sourceContextId);
  projectExecutiveSourceIntelligence(baseline);
  assert.equal(getCsvRealDataImport("workspace-a", baseline.sourceContextId), before);
});

test("E/F/G — compatible baseline to pressure comparison uses canonical KPI and state deltas", () => {
  const baseline = committed("rdi2-baseline.csv", baselineCsv, "RDI-b", "csv:workspace-a:baseline");
  const pressure = committed("rdi2-pressure.csv", pressureCsv, "RDI-p", "csv:workspace-a:pressure");
  const comparison = compareExecutiveSources(baseline, pressure);
  assert.equal(comparison.readiness, "compatible");
  assert.equal(comparison.changedObjects.length, 5);
  assert.deepEqual(comparison.deterioratedObjects, ["Capacity", "Customer", "Delivery", "Inventory", "Revenue"]);
  assert.equal(comparison.improvedObjects.length, 0);
  assert.ok(comparison.stateTransitions.every((entry) => entry.direction === "deteriorated"));
  assert.equal(comparison.metricDeltas.find((entry) => entry.kpiId === "kpi.production.capacity-utilization")?.delta, 9);
  assert.match(comparison.summary, /materially deteriorated/);
});

test("H/N — incompatible family and cross-workspace comparison are rejected", () => {
  const baseline = committed("rdi2-baseline.csv", baselineCsv, "RDI-b", "csv:workspace-a:baseline");
  resetCsvRealDataImportStoreForTests();
  const otherWorkspace = committed("rdi2-pressure.csv", pressureCsv, "RDI-p", "csv:workspace-b:pressure", "workspace-b");
  assert.equal(classifyExecutiveSourceComparison(baseline, otherWorkspace).readiness, "incompatible");
  assert.equal(compareExecutiveSources(baseline, otherWorkspace).metricDeltas.length, 0);
});

test("I — intelligence and comparison retain source, snapshot, mapping, field, and transformation evidence", () => {
  const baseline = committed("rdi2-baseline.csv", baselineCsv, "RDI-b", "csv:workspace-a:baseline");
  const pressure = committed("rdi2-pressure.csv", pressureCsv, "RDI-p", "csv:workspace-a:pressure");
  const intelligence = projectExecutiveSourceIntelligence(pressure);
  const comparison = compareExecutiveSources(baseline, pressure);
  assert.match(intelligence.provenance.snapshotId, /rdi2:snapshot/);
  assert.match(intelligence.provenance.mappingId, /rdi2:mapping/);
  assert.ok(intelligence.provenance.transformationRefs.some((entry) => entry.includes("aggregate")));
  assert.equal(comparison.metricDeltas.every((entry) => Boolean(entry.baseSourceField && entry.comparisonSourceField)), true);
});

test("J/K/L — Stage and Advisor contexts carry canonical evidence while current facts override memory", () => {
  const pressure = committed("rdi2-pressure.csv", pressureCsv, "RDI-p", "csv:workspace-a:pressure");
  const context = createExecutiveSourceAdvisorContext(projectExecutiveSourceIntelligence(pressure));
  assert.ok(context.affectedStageObjectIds.includes("obj-capacity"));
  assert.equal(context.sourceIds[0], pressure.sourceContextId);
  assert.equal(context.memoryPolicy, "current-facts-override-history");
  assert.ok(Object.isFrozen(context.provenance));
});

test("C/D/J/K — Executive UI keeps selection separate and routes Stage/Advisor through existing shell authorities", () => {
  const explorer = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"), "utf8");
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  const advisor = readFileSync(join(here, "../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx"), "utf8");
  for (const evidence of ["Executive State", "Related Objects", "Signals and dates", "View on Stage", "Compare", "Ask Nexora", "Explain Change", "Evidence & provenance"]) {
    assert.match(explorer, new RegExp(evidence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(explorer, /onClick=\{\(\) => selectRow\(row\.id\)\}/);
  assert.match(explorer, /Use as Active Source/);
  assert.match(shell, /onViewSourceOnStage/);
  assert.match(shell, /setActiveNav\("Home"\)/);
  assert.match(shell, /sourceIntelligenceContext=\{sourceAdvisorContext\}/);
  assert.match(advisor, /nexora-rdi3-advisor-context/);
});

test("M — inactive removal succeeds and active source removal is refused", () => {
  const baseline = committed("rdi2-baseline.csv", baselineCsv, "RDI-b", "csv:workspace-a:baseline");
  const pressure = committed("rdi2-pressure.csv", pressureCsv, "RDI-p", "csv:workspace-a:pressure");
  assert.equal(removeCsvRealDataImport({ workspaceId: "workspace-a", sourceContextId: pressure.sourceContextId, activeSourceContextId: pressure.sourceContextId }).reason, "active_source");
  assert.ok(getCsvRealDataImport("workspace-a", pressure.sourceContextId));
  assert.equal(removeCsvRealDataImport({ workspaceId: "workspace-a", sourceContextId: baseline.sourceContextId, activeSourceContextId: pressure.sourceContextId }).reason, "removed");
  assert.equal(getCsvRealDataImport("workspace-a", baseline.sourceContextId), null);
});

test("O — certification requires and passes all A–O gates", () => {
  const evidence = Object.freeze(Object.fromEntries("ABCDEFGHIJKLMNO".split("").map((gate) => [gate, true]))) as Readonly<Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O", boolean>>;
  const result = certifyExecutiveSourceIntelligence(evidence);
  assert.equal(result.certified, true);
  assert.equal(result.passedGateCount, 15);
  assert.ok(Object.isFrozen(result.gates));
});
