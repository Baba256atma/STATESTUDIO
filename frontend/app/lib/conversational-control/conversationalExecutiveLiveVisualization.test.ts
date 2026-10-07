/**
 * NPA-T CEI:3 — live accepted data, Stage projection, and evidence-guard seams.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  CSV_MVP_DEMO_INVENTORY_VALUES,
  ensureCsvMvpDemoBootstrap,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

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
    messageIdSeed: `cei3-${utterance}`,
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

test("CEI:3 F — live demo data reaches CEI:2 Stage route with six Inventory points", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  assert.equal(subjectId(focused), "obj-inventory");
  const chart = run("Show me a chart.", focused);
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  assert.equal(chart.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(chart.visualizationRoute?.nexoFamily, "NexoTime");
  assert.equal(chart.visualizationRoute?.recipeFamily, "NEXO_TIME");
  assert.equal(chart.visualizationRoute?.stageProjection.status, "renderable");
  assert.deepEqual(
    chart.visualView?.view?.series[0]?.points.map((point) => ({
      periodLabel: point.periodLabel,
      value: point.value,
    })),
    [...CSV_MVP_DEMO_INVENTORY_VALUES],
  );
  resetCsvRealDataImportStoreForTests();
});

test("CEI:3 G — Bar chart refines the same six accepted observations", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused);
  const bars = run("Bar chart.", chart);
  assert.equal(subjectId(bars), "obj-inventory");
  assert.equal(bars.visualView?.view?.representation, "COMPARISON_BARS");
  assert.equal(bars.visualizationRoute?.nexoFamily, "NexoBars");
  assert.deepEqual(
    [...(bars.visualizationRoute?.observationIds ?? [])].sort(),
    [...(chart.visualizationRoute?.observationIds ?? [])].sort(),
  );
  resetCsvRealDataImportStoreForTests();
});

test("CEI:3 I — Inventory evidence inquiry uses the accepted demo source", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused);
  const evidence = run("Show me its evidence.", chart);
  assert.equal(subjectId(evidence), "obj-inventory");
  assert.match(evidence.response, /inventory-observations\.csv/i);
  assert.doesNotMatch(evidence.response, /don't have supported observations for Inventory/i);
  resetCsvRealDataImportStoreForTests();
});

test("CEI:3 H — Capacity without accepted observations dismisses Inventory chart", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const inventory = run("Show me Inventory.");
  const inventoryChart = run("Show me a chart.", inventory);
  assert.equal(inventoryChart.visualView?.view?.series[0]?.id, "obj-inventory");
  const capacity = run("What about Capacity?", inventoryChart);
  assert.equal(subjectId(capacity), "obj-capacity");
  const capacityChart = run("Show me a chart.", capacity);
  assert.equal(subjectId(capacityChart), "obj-capacity");
  assert.equal(capacityChart.visualView?.view ?? null, null);
  assert.equal(capacityChart.visualizationRoute ?? null, null);
  assert.match(capacityChart.response, /can't create a Capacity visualization|under review|no accepted/i);
  assert.doesNotMatch(capacityChart.response, /80|95|Inventory On Hand/i);
  resetCsvRealDataImportStoreForTests();
});
