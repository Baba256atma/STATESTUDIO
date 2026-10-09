/** NPA-T STAGE-COMPOSITION:6 — governed chart vs transient Operation lifecycle. */

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
  deriveNexoraMVPPresentationViewModel,
  nexoraMVPAcceptedVisualPresentationChanged,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function vmOf(state: Turn["nextRuntimeState"]) {
  return deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? null,
    subjectKind: state.focusedSubject?.kind ?? null,
    subjectLabel: state.focusedSubject?.label ?? null,
  });
}

function reconcile(previous: Turn | null, turn: Turn) {
  const accepted = nexoraMVPAcceptedVisualPresentationChanged(
    previous?.visualView ?? emptyNexoraVisualViewRuntime(),
    turn.visualView,
  );
  const next = completeNexoraMVPOperationPresentation(
    turn.nextRuntimeState,
    accepted,
  );
  return { accepted, next, vm: vmOf(next) };
}

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
    messageIdSeed: `sc6-${utterance}`,
  });
}

function inventoryOperation(previous: Turn) {
  const focused = selectNexoraMVPInteractionSubject(
    previous.nextRuntimeState,
    "obj-inventory",
    catalog,
  );
  return applyNexoraMVPPresentationStateChange(focused, "operation");
}

function capacityOperation(previous: Turn) {
  const focused = selectNexoraMVPInteractionSubject(
    previous.nextRuntimeState,
    "obj-capacity",
    catalog,
  );
  return applyNexoraMVPPresentationStateChange(focused, "operation");
}

test("SC6 pre-repair CEI leaves Operation while accepting Inventory TREND_LINE", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const operation = inventoryOperation(focused);
  assert.equal(operation.presentationState, "operation");
  const chart = run("Show me a chart.", focused, operation);
  assert.equal(chart.nextRuntimeState.presentationState, "operation");
  assert.equal(chart.shouldCommitRuntime, false);
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  assert.equal(chart.visualizationRoute?.stageProjection.status, "renderable");
  assert.equal(chart.visualizationRoute?.nexoFamily, "NexoTime");
  assert.deepEqual(
    chart.visualView?.view?.series[0]?.points.map((point) => ({
      periodLabel: point.periodLabel,
      value: point.value,
    })),
    [...CSV_MVP_DEMO_INVENTORY_VALUES],
  );
  resetCsvRealDataImportStoreForTests();
});

test("SC6 same-subject successful chart completes Operation without Report", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused, inventoryOperation(focused));
  const { accepted, next, vm } = reconcile(focused, chart);
  assert.equal(accepted, true);
  assert.equal(next.presentationState, "minimum");
  assert.equal(next.focusedSubject?.id, "obj-inventory");
  assert.equal(vm.showOperationSurface, false);
  assert.equal(vm.showReportSurface, false);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 same-subject Bar chart completes Operation to COMPARISON_BARS", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const bars = run("Bar chart.", focused, inventoryOperation(focused));
  const { accepted, next, vm } = reconcile(focused, bars);
  assert.equal(bars.visualView?.view?.representation, "COMPARISON_BARS");
  assert.equal(bars.visualizationRoute?.nexoFamily, "NexoBars");
  assert.equal(accepted, true);
  assert.equal(next.presentationState, "minimum");
  assert.equal(vm.showOperationSurface, false);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 failed Capacity chart keeps Operation", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Capacity.");
  const chart = run("Show me a chart.", focused, capacityOperation(focused));
  const { accepted, next, vm } = reconcile(focused, chart);
  assert.equal(chart.visualView?.view ?? null, null);
  assert.equal(chart.visualizationRoute ?? null, null);
  assert.equal(accepted, false);
  assert.equal(next.presentationState, "operation");
  assert.equal(vm.showOperationSurface, true);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 clarification-only visual keeps Operation", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const clarify = run(
    "Compare these values.",
    focused,
    inventoryOperation(focused),
  );
  const { accepted, next, vm } = reconcile(focused, clarify);
  assert.equal(clarify.visualView?.view ?? null, null);
  assert.equal(accepted, false);
  assert.equal(next.presentationState, "operation");
  assert.equal(vm.showOperationSurface, true);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 inspect/Why does not complete Operation", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused);
  const reconciled = reconcile(focused, chart);
  const reopened = applyNexoraMVPPresentationStateChange(
    reconciled.next,
    "operation",
  );
  const why = run("Why this visual?", chart, reopened);
  const after = reconcile(chart, why);
  assert.equal(after.accepted, false);
  assert.equal(after.next.presentationState, "operation");
  assert.equal(after.vm.showOperationSurface, true);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 explicit Operation reopen after successful chart", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused, inventoryOperation(focused));
  const { next } = reconcile(focused, chart);
  const reopened = applyNexoraMVPPresentationStateChange(next, "operation");
  assert.equal(reopened.presentationState, "operation");
  assert.equal(vmOf(reopened).showOperationSurface, true);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 successful Bar refinement after explicit reopen completes Operation", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused, inventoryOperation(focused));
  const afterChart = reconcile(focused, chart);
  const reopened = applyNexoraMVPPresentationStateChange(
    afterChart.next,
    "operation",
  );
  const bars = run("Bar chart.", chart, reopened);
  const afterBars = reconcile(chart, bars);
  assert.equal(bars.visualView?.view?.representation, "COMPARISON_BARS");
  assert.equal(afterBars.accepted, true);
  assert.equal(afterBars.next.presentationState, "minimum");
  assert.equal(afterBars.vm.showOperationSurface, false);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 failed refinement after explicit reopen keeps Operation", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const chart = run("Show me a chart.", focused, inventoryOperation(focused));
  const afterChart = reconcile(focused, chart);
  const reopened = applyNexoraMVPPresentationStateChange(
    afterChart.next,
    "operation",
  );
  const failed = run("Show Capacity chart.", chart, reopened);
  const afterFail = reconcile(chart, failed);
  assert.equal(afterFail.accepted, false);
  assert.equal(afterFail.next.presentationState, "operation");
  assert.equal(afterFail.vm.showOperationSurface, true);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 cross-subject Inventory chart from Capacity Operation is visual-owned", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Capacity.");
  const chart = run(
    "Show Inventory chart.",
    focused,
    capacityOperation(focused),
  );
  assert.equal(chart.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(chart.shouldCommitRuntime, true);
  const { accepted, next, vm } = reconcile(focused, chart);
  assert.equal(chart.visualView?.view?.representation, "TREND_LINE");
  assert.equal(chart.visualizationRoute?.subjectId, "obj-inventory");
  assert.equal(accepted, true);
  assert.equal(next.presentationState, "minimum");
  assert.equal(next.focusedSubject?.id, "obj-inventory");
  assert.equal(vm.showOperationSurface, false);
  resetCsvRealDataImportStoreForTests();
});

test("SC6 Details plus successful chart keeps Report", () => {
  resetCsvRealDataImportStoreForTests();
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const focused = run("Show me Inventory.");
  const details = applyNexoraMVPPresentationStateChange(
    selectNexoraMVPInteractionSubject(
      focused.nextRuntimeState,
      "obj-inventory",
      catalog,
    ),
    "report",
  );
  const chart = run("Show me a chart.", focused, details);
  const { accepted, next, vm } = reconcile(focused, chart);
  assert.equal(accepted, true);
  assert.equal(next.presentationState, "report");
  assert.equal(vm.showReportSurface, true);
  assert.equal(vm.showOperationSurface, false);
  resetCsvRealDataImportStoreForTests();
});
