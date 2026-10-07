/**
 * NPA-T CEI:2 — accepted observations → DTH Nexo → STAGE-PROD routing.
 * Reuses CEI:1, DATA-ADV, DIR:VI, DTH-EXP recipes, and STAGE-PROD.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { resolveNexoraVisualGuidanceIntent } from "../manager-object/nexoraVisualGuidanceIntent.ts";
import { projectAdvisorAcceptedVisualEvidence } from "../manager-object/nexoraAdvisorVisualEvidence.ts";
import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  getCsvImportCandidate,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-02T20:00:00.000Z";
const inventoryCsv = "Date,Inventory On Hand\n2026-01-01,80\n2026-02-01,95";
const capacityCsv =
  "Date,Production Used Capacity,Production Total Capacity\n2026-01-01,70,100\n2026-02-01,88,100";
const pendingCsv = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    previousVisualView: previous?.visualView ?? null,
    messageIdSeed: `cei2-${utterance}`,
  });
}

function subjectId(turn: ReturnType<typeof executeNexoraConversationalExperience>): string | null {
  return (
    turn.nextExecutiveContext.currentSubject?.subjectId ??
    turn.contextResult.context.primarySubject?.subjectId ??
    turn.nextRuntimeState.focusedSubject?.id ??
    turn.visualizationRoute?.subjectId ??
    null
  );
}

function commitAccepted(fileName: string, csvText: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `cei2:${fileName}`,
    importedAt: T0,
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const committed = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: "new",
    committedAt: T0,
  });
  assert.equal(committed.committed, true);
}

function seedPendingAmbiguous() {
  const fileName = "data-ux3-ambiguous.csv";
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: pendingCsv.length,
    csvText: pendingCsv,
    importId: `cei2:${fileName}`,
    importedAt: T0,
  });
  const parse = parseCsvDeterministically(pendingCsv);
  saveCsvImportCandidate(
    Object.freeze({
      workspaceId: "overview",
      candidateId: csvImportCandidateId("overview", fileName),
      fileName,
      status: "preview",
      input,
      parse,
      mapping: interpretCsvSemantics({
        input,
        parse,
        structural: suggestCsvColumnMappings(parse.columns, input.importId),
      }),
      prepared: null,
      error: null,
      replacementSourceContextId: null,
    }),
  );
}

test("CEI:2 A — bar chart of Inventory reaches NexoBars and Stage", () => {
  resetCsvRealDataImportStoreForTests();
  commitAccepted("inventory-observations.csv", inventoryCsv);
  const turn = run("Show me a bar chart of Inventory.");
  assert.equal(turn.visualView?.view?.representation, "COMPARISON_BARS");
  assert.equal(turn.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(turn.visualizationRoute?.nexoFamily, "NexoBars");
  assert.equal(turn.visualizationRoute?.recipeFamily, "NEXO_BARS");
  assert.notEqual(turn.visualizationRoute?.recipeResolutionStatus, "failed");
  assert.equal(turn.visualizationRoute?.stageProjection.status, "renderable");
  assert.equal(turn.visualizationRoute?.stageProjection.specs[0]?.family, "TREND");
  assert.ok((turn.visualizationRoute?.observationIds.length ?? 0) >= 2);
  assert.equal(
    turn.visualView?.view?.series.every((series) => series.example === false),
    true,
  );
  resetCsvRealDataImportStoreForTests();
});

test("CEI:2 B — current-subject chart retains Inventory", () => {
  resetCsvRealDataImportStoreForTests();
  commitAccepted("inventory-observations.csv", inventoryCsv);
  const focused = run("Show me Inventory.");
  assert.equal(subjectId(focused), "obj-inventory");
  const chart = run("Show me a chart.", focused);
  assert.equal(subjectId(chart), "obj-inventory");
  assert.equal(chart.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  assert.equal(chart.visualizationRoute?.nexoFamily, "NexoTime");
  resetCsvRealDataImportStoreForTests();
});

test("CEI:2 C — Bar chart refines the same Inventory evidence", () => {
  resetCsvRealDataImportStoreForTests();
  commitAccepted("inventory-observations.csv", inventoryCsv);
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused);
  const bars = run("Bar chart.", chart);
  assert.equal(bars.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(bars.visualView?.view?.representation, "COMPARISON_BARS");
  assert.equal(bars.visualizationRoute?.nexoFamily, "NexoBars");
  const firstIds = chart.visualizationRoute?.observationIds ?? [];
  const refinedIds = bars.visualizationRoute?.observationIds ?? [];
  assert.deepEqual([...refinedIds].sort(), [...firstIds].sort());
  resetCsvRealDataImportStoreForTests();
});

test("CEI:2 D — Inventory over time routes to NexoTime", () => {
  resetCsvRealDataImportStoreForTests();
  commitAccepted("inventory-observations.csv", inventoryCsv);
  const turn = run("Show Inventory over time.");
  assert.equal(turn.visualView?.view?.representation, "TREND_LINE");
  assert.equal(turn.visualizationRoute?.nexoFamily, "NexoTime");
  assert.equal(turn.visualizationRoute?.recipeFamily, "NEXO_TIME");
  assert.equal(turn.visualizationRoute?.stageProjection.status, "renderable");
  assert.equal(turn.visualView?.view?.series[0]?.points.length, 2);
  assert.equal(turn.visualView?.view?.series[0]?.points[0]?.periodLabel, "2026-01-01");
  resetCsvRealDataImportStoreForTests();
});

test("CEI:2 E — pending CSV cannot create a business chart", () => {
  resetCsvRealDataImportStoreForTests();
  seedPendingAmbiguous();
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused);
  assert.equal(chart.visualView?.view ?? null, null);
  assert.equal(chart.visualizationRoute ?? null, null);
  assert.match(chart.response, /no accepted|under review|chartable|visualization/i);
  assert.doesNotMatch(chart.response, /couldn't find a clear match for “(?:a )?chart”/i);
  const pending = getCsvImportCandidate(
    "overview",
    csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
  );
  assert.equal(pending?.status, "preview");
  const projected = projectAdvisorAcceptedVisualEvidence({
    workspaceId: "overview",
    subjectId: "obj-inventory",
    subjectLabel: "Inventory",
  });
  assert.equal(projected.bundle.series.length, 0);
  resetCsvRealDataImportStoreForTests();
});

test("CEI:2 F — rendered observations are traceable to accepted sources", () => {
  resetCsvRealDataImportStoreForTests();
  commitAccepted("inventory-observations.csv", inventoryCsv);
  const turn = run("Show me a bar chart of Inventory.");
  const projected = projectAdvisorAcceptedVisualEvidence({
    workspaceId: "overview",
    subjectId: "obj-inventory",
    subjectLabel: "Inventory",
  });
  assert.equal(projected.bundle.acceptedIntoDataReality, true);
  for (const id of turn.visualizationRoute?.observationIds ?? []) {
    assert.equal(
      projected.observationProvenance.some((item) => item.observationId === id),
      true,
    );
    assert.equal(
      projected.observationProvenance.find((item) => item.observationId === id)
        ?.acceptedIntoDataReality,
      true,
    );
  }
  resetCsvRealDataImportStoreForTests();
});

test("CEI:2 G — visualization language is not an entity search", () => {
  for (const utterance of ["Bar chart.", "Line chart.", "Show me a chart.", "Show this over time."]) {
    const intent = resolveNexoraConversationalIntent({ utterance }).intent;
    assert.notEqual(intent.kind, "focus");
    const visual = resolveNexoraVisualGuidanceIntent({ utterance });
    assert.equal(visual.kind, "RESOLVE");
  }
});

test("CEI:2 H — chart after Capacity switch uses Capacity", () => {
  resetCsvRealDataImportStoreForTests();
  commitAccepted("inventory-observations.csv", inventoryCsv);
  commitAccepted("capacity-observations.csv", capacityCsv);
  const inventory = run("Show me Inventory.");
  const inventoryChart = run("Show me a chart.", inventory);
  assert.equal(inventoryChart.visualizationRoute?.subjectId, "obj-inventory");
  const capacity = run("What about Capacity?", inventoryChart);
  assert.equal(subjectId(capacity), "obj-capacity");
  const capacityChart = run("Show me a chart.", capacity);
  assert.equal(capacityChart.visualizationRoute?.subjectId, "obj-capacity");
  assert.notEqual(capacityChart.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(capacityChart.visualizationRoute?.nexoFamily, "NexoTime");
  resetCsvRealDataImportStoreForTests();
});
