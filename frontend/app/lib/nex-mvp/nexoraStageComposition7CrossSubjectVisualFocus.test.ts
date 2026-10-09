/** NPA-T STAGE-COMPOSITION:7 — cross-subject visual focus / presentation. */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import {
  CSV_MVP_DEMO_INVENTORY_VALUES,
  ensureCsvMvpDemoBootstrap,
} from "@/app/lib/data-reality/csvRealDataMvpDemoBootstrap.ts";
import { resetCsvRealDataImportStoreForTests } from "@/app/lib/data-reality/csvRealDataImportStore.ts";
import { emptyNexoraVisualViewRuntime } from "@/app/lib/director/nexoraVisualIntelligence.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyNexoraMVPPresentationStateChange,
  completeNexoraMVPOperationPresentation,
  nexoraMVPAcceptedVisualPresentationChanged,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { stageProdRequestedVisualRemainsValid } from "@/app/lib/stage-prod/stageProdPublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(
  utterance: string,
  previous?: Turn,
  runtimeState = previous?.nextRuntimeState,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      runtimeState ??
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
    previousVisualView: previous?.visualView ?? emptyNexoraVisualViewRuntime(),
    messageIdSeed: `sc7-${utterance}`,
  });
}

function withPresentation(
  previous: Turn,
  subjectId: string,
  presentationState: "minimum" | "report" | "operation",
) {
  return applyNexoraMVPPresentationStateChange(
    selectNexoraMVPInteractionSubject(previous.nextRuntimeState, subjectId, catalog),
    presentationState,
  );
}

test("SC7 pre-repair shape: Show Inventory already selects canonical Inventory", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const capacity = run("Show me Capacity.");
  assert.equal(capacity.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  const inventory = run("Show me Inventory.", capacity);
  assert.equal(inventory.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(inventory.shouldCommitRuntime, true);
  resetCsvRealDataImportStoreForTests();
});

test("SC7 same-subject Show chart stays Inventory and mounts TREND_LINE", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const inventory = run("Show me Inventory.");
  const chart = run("Show me a chart.", inventory);
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(chart.shouldCommitRuntime, false);
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  assert.equal(chart.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(chart.visualizationRoute?.stageProjection.status, "renderable");
  assert.equal(
    stageProdRequestedVisualRemainsValid({
      view: chart.visualView!.view!,
      focalSubjectId: chart.nextRuntimeState.focusedSubject?.id,
    }),
    true,
  );
  resetCsvRealDataImportStoreForTests();
});

test("SC7 cross-subject Show Inventory chart selects Inventory and is mount-eligible", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const capacity = run("Show me Capacity.");
  assert.equal(capacity.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  const chart = run("Show Inventory chart.", capacity);
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(chart.nextExecutiveContext.currentSubject?.subjectId, "obj-inventory");
  assert.equal(chart.shouldCommitRuntime, true);
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  assert.equal(chart.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(chart.visualizationRoute?.stageProjection.status, "renderable");
  assert.deepEqual(
    chart.visualView?.view?.series[0]?.points.map((point) => ({
      periodLabel: point.periodLabel,
      value: point.value,
    })),
    [...CSV_MVP_DEMO_INVENTORY_VALUES],
  );
  assert.equal(
    stageProdRequestedVisualRemainsValid({
      view: chart.visualView!.view!,
      focalSubjectId: chart.nextRuntimeState.focusedSubject?.id,
    }),
    true,
  );
  resetCsvRealDataImportStoreForTests();
});

test("SC7 unsupported Show Capacity chart does not steal Inventory focus", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const inventory = run("Show me Inventory.");
  const failed = run("Show Capacity chart.", inventory);
  assert.equal(failed.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(failed.shouldCommitRuntime, false);
  assert.equal(failed.visualView?.view ?? null, null);
  assert.equal(failed.visualizationRoute ?? null, null);
  resetCsvRealDataImportStoreForTests();
});

test("SC7 inherited Show its chart is not cross-subject navigation", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const inventory = run("Show me Inventory.");
  const chart = run("Show its chart.", inventory);
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(chart.shouldCommitRuntime, false);
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  resetCsvRealDataImportStoreForTests();
});

test("SC7 Bar chart refinement does not re-navigate", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const inventory = run("Show me Inventory.");
  const chart = run("Show me a chart.", inventory);
  const beforeTrail = chart.nextRuntimeState.stage2dNavigationTrail;
  const bars = run("Bar chart.", chart);
  assert.equal(bars.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(bars.shouldCommitRuntime, false);
  assert.equal(bars.visualView?.view?.representation, "COMPARISON_BARS");
  assert.deepEqual(
    bars.nextRuntimeState.stage2dNavigationTrail.objectIds,
    beforeTrail.objectIds,
  );
  resetCsvRealDataImportStoreForTests();
});

test("SC7 stale Inventory visual is invalid under Capacity focus", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const inventory = run("Show me Inventory.");
  const chart = run("Show me a chart.", inventory);
  const capacity = run("Show me Capacity.", chart);
  assert.equal(capacity.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(
    stageProdRequestedVisualRemainsValid({
      view: chart.visualView!.view!,
      focalSubjectId: capacity.nextRuntimeState.focusedSubject?.id,
    }),
    false,
  );
  resetCsvRealDataImportStoreForTests();
});

test("SC7 ACTIONS + cross-subject visual completes Operation on Inventory", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const capacity = run("Show me Capacity.");
  const operation = withPresentation(capacity, "obj-capacity", "operation");
  const chart = run("Show Inventory chart.", capacity, operation);
  const accepted = nexoraMVPAcceptedVisualPresentationChanged(
    capacity.visualView,
    chart.visualView,
  );
  const next = completeNexoraMVPOperationPresentation(
    chart.nextRuntimeState,
    accepted,
  );
  assert.equal(accepted, true);
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(next.presentationState, "minimum");
  assert.equal(next.focusedSubject?.id, "obj-inventory");
  resetCsvRealDataImportStoreForTests();
});

test("SC7 Details + cross-subject visual keeps Report on the new subject", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const capacity = run("Show me Capacity.");
  const details = withPresentation(capacity, "obj-capacity", "report");
  const chart = run("Show Inventory chart.", capacity, details);
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(chart.nextRuntimeState.presentationState, "report");
  resetCsvRealDataImportStoreForTests();
});

test("SC7 cross-subject history can step back to Capacity", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const capacity = run("Show me Capacity.");
  const chart = run("Show Inventory chart.", capacity);
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  const ids = chart.nextRuntimeState.stage2dNavigationTrail.objectIds;
  assert.ok(ids.includes("obj-capacity"));
  assert.equal(ids[ids.length - 1], "obj-inventory");
  resetCsvRealDataImportStoreForTests();
});
