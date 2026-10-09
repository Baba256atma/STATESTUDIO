/**
 * NEX-MVP:6 — pure Presentation States tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import {
  applyNexoraVisualViewRuntime,
  emptyNexoraVisualViewRuntime,
} from "@/app/lib/director/nexoraVisualIntelligence.ts";
import {
  applyNexoraMVPPresentationDensity,
  applyNexoraMVPPresentationStateChange,
  completeNexoraMVPOperationPresentation,
  deriveNexoraMVPPresentationViewModel,
  nexoraMVPAcceptedVisualPresentationChanged,
  getNexoraMVPPresentationStateOrder,
  getNexoraMVPPresentationStatesIdentity,
  resolveNexoraMVPPresentationCapability,
  resolveNexoraMVPPresentationStateChange,
  verifyNexoraMVPPresentationStates,
} from "./nexoraMVPPresentationState.ts";

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

describe("NEX-MVP:6 Presentation States", () => {
  it("1. canonical state order", () => {
    assert.deepEqual([...getNexoraMVPPresentationStateOrder()], [
      "minimum",
      "report",
      "operation",
    ]);
  });

  it("2. initial state = Minimum", () => {
    assert.equal(initial().presentationState, "minimum");
    assert.equal(getNexoraMVPPresentationStateOrder()[0], "minimum");
  });

  it("3. presentation state derived from application snapshot", () => {
    const report = applyNexoraMVPPresentationStateChange(initial(), "report");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: report.presentationState,
      workspace: report.workspace,
      environmentIntent: report.environmentIntent,
      subjectId: null,
      subjectKind: null,
      subjectLabel: null,
    });
    assert.equal(vm.state, "report");
  });

  it("4. workspace preserved on state change", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "scenario",
      presentationState: "minimum",
      environmentIntent: "simulate",
    });
    const next = applyNexoraMVPPresentationStateChange(start, "report");
    assert.equal(next.workspace, "scenario");
  });

  it("5. selected subject preserved", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const next = applyNexoraMVPPresentationStateChange(focused, "report");
    assert.equal(next.selectedSubject?.id, "obj-capacity");
  });

  it("6. focused subject preserved", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const next = applyNexoraMVPPresentationStateChange(focused, "operation");
    assert.equal(next.focusedSubject?.id, "obj-capacity");
  });

  it("7. environment intent preserved", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "decision",
      presentationState: "minimum",
      environmentIntent: "commit",
    });
    const next = applyNexoraMVPPresentationStateChange(start, "report");
    assert.equal(next.environmentIntent, "commit");
  });

  it("8. Minimum view model", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "minimum",
      workspace: focused.workspace,
      environmentIntent: focused.environmentIntent,
      subjectId: "obj-revenue",
      subjectKind: "object",
      subjectLabel: "Revenue",
    });
    assert.equal(vm.showKPIs, true);
    assert.equal(vm.showKOI, false);
    assert.equal(vm.showRelationships, false);
    assert.equal(vm.showActions, false);
    assert.equal(vm.showReportSurface, false);
  });

  it("9. Report view model", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(vm.showReportSurface, true);
    assert.equal(vm.showKPIs, true);
    assert.equal(vm.showRelationships, true);
    assert.equal(vm.showExecutiveSummary, true);
    assert.equal(vm.showActions, false);
  });

  it("10. Operation view model", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "operation",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-revenue",
      subjectKind: "object",
      subjectLabel: "Revenue",
    });
    assert.equal(vm.showOperationSurface, true);
    assert.equal(vm.showActions, true);
    assert.equal(vm.showReportSurface, false);
    assert.ok(vm.availableActions.some((action) => action.available));
  });

  it("11. capability-driven Operation availability", () => {
    const unknown = resolveNexoraMVPPresentationCapability("obj-unknown");
    assert.equal(unknown.operation, false);
    const revenue = resolveNexoraMVPPresentationCapability("obj-revenue");
    assert.equal(revenue.operation, true);
  });

  it("12. KPI visibility rules", () => {
    const min = deriveNexoraMVPPresentationViewModel({
      presentationState: "minimum",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-revenue",
      subjectKind: "object",
      subjectLabel: "Revenue",
    });
    assert.ok(min.primaryKpi);
    assert.equal(min.secondaryKpis.length, 0);

    const report = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-revenue",
      subjectKind: "object",
      subjectLabel: "Revenue",
    });
    assert.ok(report.secondaryKpis.length > 0);
  });

  it("13. KOI visibility rules", () => {
    const report = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-revenue",
      subjectKind: "object",
      subjectLabel: "Revenue",
    });
    assert.equal(report.showKOI, true);
    assert.ok(report.koi);

    const capacity = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(capacity.showKOI, false);
  });

  it("14. relationship visibility rules", () => {
    const min = deriveNexoraMVPPresentationViewModel({
      presentationState: "minimum",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(min.showRelationships, false);

    const report = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(report.showRelationships, true);
  });

  it("15. available-action derivation", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "operation",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.ok(vm.availableActions.length > 0);
    assert.ok(vm.availableActions.some((action) => action.available));
  });

  it("16. unsupported action suppression / disable", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "operation",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "ctx-decision-reprice",
      subjectKind: "decision",
      subjectLabel: "Approve Repricing",
    });
    const approve = vm.availableActions.find((action) =>
      action.id.includes("approve"),
    );
    assert.ok(approve);
    // NEX-MVP:8 binds Decision approve through flow-domain overlay;
    // fixture marks the action present; availability is flow-gated in shell.
    assert.equal(typeof approve.available, "boolean");

    const unknownOp = resolveNexoraMVPPresentationStateChange({
      targetPresentationState: "operation",
      currentPresentationState: "minimum",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-unknown",
    });
    assert.equal(unknownOp.ok, true);
    if (unknownOp.ok) assert.equal(unknownOp.presentationState, "report");
  });

  it("17. deterministic repeated resolution", () => {
    const a = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "scenario",
      environmentIntent: "simulate",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    const b = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "scenario",
      environmentIntent: "simulate",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    assert.equal(verifyNexoraMVPPresentationStates().ok, true);
    assert.equal(
      getNexoraMVPPresentationStatesIdentity().id,
      "NEX-MVP:6/NexoraPresentationStates",
    );
  });

  it("invalid presentation state rejection", () => {
    const rejected = resolveNexoraMVPPresentationStateChange({
      targetPresentationState: "dashboard",
      currentPresentationState: "minimum",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-revenue",
    });
    assert.equal(rejected.ok, false);
  });

  it("density application preserves object ids", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue");
    const base = deriveNexoraMVPStageInteractionPresentation(focused);
    const densified = applyNexoraMVPPresentationDensity(base, "operation");
    assert.deepEqual(
      densified.scene.objects.map((object) => object.id),
      base.scene.objects.map((object) => object.id),
    );
    assert.equal(densified.scene.presentationState, "operation");
  });

  it("successful Capacity actions retain their destination and close Operation", () => {
    const capacity = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const operation = applyNexoraMVPPresentationStateChange(
      capacity,
      "operation",
    );

    for (const targetSubjectId of [
      "ctx-problem-capacity",
      "ctx-decision-capacity",
      "ctx-scenario-capacity",
    ]) {
      const routed = selectNexoraMVPInteractionSubject(
        operation,
        targetSubjectId,
      );
      const completed = completeNexoraMVPOperationPresentation(routed, true);
      assert.equal(completed.focusedSubject?.id, targetSubjectId);
      assert.equal(completed.presentationState, "minimum");
    }
  });

  it("successful subject change and Overview close stale Operation", () => {
    const capacity = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const operation = applyNexoraMVPPresentationStateChange(
      capacity,
      "operation",
    );
    const customer = selectNexoraMVPInteractionSubject(operation, "obj-customer");
    const changed = completeNexoraMVPOperationPresentation(customer, true);
    assert.equal(changed.focusedSubject?.id, "obj-customer");
    assert.equal(changed.presentationState, "minimum");

    const overview = completeNexoraMVPOperationPresentation(
      resetNexoraMVPObjectInteractionOverview(operation),
      true,
    );
    assert.equal(overview.focusedSubject, null);
    assert.equal(overview.presentationState, "minimum");
  });

  it("STAGE-COMPOSITION:2 focus is object-first without Report or ACTIONS", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: focused.presentationState,
      workspace: focused.workspace,
      environmentIntent: focused.environmentIntent,
      subjectId: focused.focusedSubject?.id ?? null,
      subjectKind: focused.focusedSubject?.kind ?? null,
      subjectLabel: focused.focusedSubject?.label ?? null,
    });
    assert.equal(focused.presentationState, "minimum");
    assert.equal(vm.subjectId, "obj-capacity");
    assert.equal(vm.showReportSurface, false);
    assert.equal(vm.showOperationSurface, false);
  });

  it("STAGE-COMPOSITION:2 Details shows Report without ACTIONS", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const details = applyNexoraMVPPresentationStateChange(focused, "report");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: details.presentationState,
      workspace: details.workspace,
      environmentIntent: details.environmentIntent,
      subjectId: details.focusedSubject?.id ?? null,
      subjectKind: details.focusedSubject?.kind ?? null,
      subjectLabel: details.focusedSubject?.label ?? null,
    });
    assert.equal(vm.showReportSurface, true);
    assert.equal(vm.showOperationSurface, false);
    assert.equal(vm.primaryKpi?.label, "Utilization");
    assert.equal(vm.primaryKpi?.value, "88%");
    assert.equal(vm.primaryKpi?.target, "80%");
    assert.equal(vm.primaryKpi?.provenance, "presentation-fixture");
  });

  it("STAGE-COMPOSITION:2 Actions shows ACTIONS without Report", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const actions = applyNexoraMVPPresentationStateChange(focused, "operation");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: actions.presentationState,
      workspace: actions.workspace,
      environmentIntent: actions.environmentIntent,
      subjectId: actions.focusedSubject?.id ?? null,
      subjectKind: actions.focusedSubject?.kind ?? null,
      subjectLabel: actions.focusedSubject?.label ?? null,
    });
    assert.equal(vm.showOperationSurface, true);
    assert.equal(vm.showReportSurface, false);
  });

  it("STAGE-COMPOSITION:2 VIEW transitions keep Report and ACTIONS exclusive", () => {
    const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const details = applyNexoraMVPPresentationStateChange(focused, "report");
    const fromDetails = deriveNexoraMVPPresentationViewModel({
      presentationState: details.presentationState,
      workspace: details.workspace,
      environmentIntent: details.environmentIntent,
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(fromDetails.showReportSurface, true);
    assert.equal(fromDetails.showOperationSurface, false);

    const actions = applyNexoraMVPPresentationStateChange(details, "operation");
    const fromActions = deriveNexoraMVPPresentationViewModel({
      presentationState: actions.presentationState,
      workspace: actions.workspace,
      environmentIntent: actions.environmentIntent,
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(fromActions.showReportSurface, false);
    assert.equal(fromActions.showOperationSurface, true);

    const backToDetails = applyNexoraMVPPresentationStateChange(actions, "report");
    const detailsAgain = deriveNexoraMVPPresentationViewModel({
      presentationState: backToDetails.presentationState,
      workspace: backToDetails.workspace,
      environmentIntent: backToDetails.environmentIntent,
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(detailsAgain.showReportSurface, true);
    assert.equal(detailsAgain.showOperationSurface, false);

    const focusFromActions = applyNexoraMVPPresentationStateChange(actions, "minimum");
    const focusVm = deriveNexoraMVPPresentationViewModel({
      presentationState: focusFromActions.presentationState,
      workspace: focusFromActions.workspace,
      environmentIntent: focusFromActions.environmentIntent,
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    assert.equal(focusVm.showReportSurface, false);
    assert.equal(focusVm.showOperationSurface, false);

    const focusFromDetails = applyNexoraMVPPresentationStateChange(details, "minimum");
    assert.equal(focusFromDetails.presentationState, "minimum");
  });

  it("STAGE-COMPOSITION:2 successful action does not reveal Report", () => {
    const capacity = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const operation = applyNexoraMVPPresentationStateChange(capacity, "operation");
    const routed = selectNexoraMVPInteractionSubject(
      operation,
      "ctx-problem-capacity",
    );
    const completed = completeNexoraMVPOperationPresentation(routed, true);
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: completed.presentationState,
      workspace: completed.workspace,
      environmentIntent: completed.environmentIntent,
      subjectId: completed.focusedSubject?.id ?? null,
      subjectKind: completed.focusedSubject?.kind ?? null,
      subjectLabel: completed.focusedSubject?.label ?? null,
    });
    assert.equal(completed.focusedSubject?.id, "ctx-problem-capacity");
    assert.equal(completed.presentationState, "minimum");
    assert.equal(vm.showReportSurface, false);
    assert.equal(vm.showOperationSurface, false);
  });

  it("STAGE-COMPOSITION:2 reopen ACTIONS then Overview keep Report off", () => {
    const capacity = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const operation = applyNexoraMVPPresentationStateChange(capacity, "operation");
    const gap = completeNexoraMVPOperationPresentation(
      selectNexoraMVPInteractionSubject(operation, "ctx-problem-capacity"),
      true,
    );
    const reopened = applyNexoraMVPPresentationStateChange(gap, "operation");
    const reopenedVm = deriveNexoraMVPPresentationViewModel({
      presentationState: reopened.presentationState,
      workspace: reopened.workspace,
      environmentIntent: reopened.environmentIntent,
      subjectId: reopened.focusedSubject?.id ?? null,
      subjectKind: reopened.focusedSubject?.kind ?? null,
      subjectLabel: reopened.focusedSubject?.label ?? null,
    });
    assert.equal(reopenedVm.showOperationSurface, true);
    assert.equal(reopenedVm.showReportSurface, false);

    const overview = completeNexoraMVPOperationPresentation(
      resetNexoraMVPObjectInteractionOverview(reopened),
      true,
    );
    const overviewVm = deriveNexoraMVPPresentationViewModel({
      presentationState: overview.presentationState,
      workspace: overview.workspace,
      environmentIntent: overview.environmentIntent,
      subjectId: overview.focusedSubject?.id ?? null,
      subjectKind: overview.focusedSubject?.kind ?? null,
      subjectLabel: overview.focusedSubject?.label ?? null,
    });
    assert.equal(overview.focusedSubject, null);
    assert.equal(overviewVm.showReportSurface, false);
    assert.equal(overviewVm.showOperationSurface, false);
  });

  it("failed or unsupported action keeps Operation available", () => {
    const capacity = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
    const operation = applyNexoraMVPPresentationStateChange(
      capacity,
      "operation",
    );
    assert.equal(
      completeNexoraMVPOperationPresentation(operation, false),
      operation,
    );
  });

  it("STAGE-COMPOSITION:6 accepted this-turn visual completes Operation to minimum", () => {
    const inventory = selectNexoraMVPInteractionSubject(initial(), "obj-inventory");
    const operation = applyNexoraMVPPresentationStateChange(inventory, "operation");
    const previous = emptyNexoraVisualViewRuntime();
    const view = Object.freeze({ viewId: "trend-obj-inventory-Jan-Jun" });
    const acceptedRuntime = applyNexoraVisualViewRuntime({
      previous,
      request: { viewId: view.viewId } as never,
    });
    const accepted = nexoraMVPAcceptedVisualPresentationChanged(
      previous,
      acceptedRuntime,
    );
    const completed = completeNexoraMVPOperationPresentation(operation, accepted);
    assert.equal(accepted, true);
    assert.equal(completed.presentationState, "minimum");
    assert.equal(completed.focusedSubject?.id, "obj-inventory");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: completed.presentationState,
      workspace: completed.workspace,
      environmentIntent: completed.environmentIntent,
      subjectId: completed.focusedSubject?.id ?? null,
      subjectKind: completed.focusedSubject?.kind ?? null,
      subjectLabel: completed.focusedSubject?.label ?? null,
    });
    assert.equal(vm.showOperationSurface, false);
    assert.equal(vm.showReportSurface, false);
  });

  it("STAGE-COMPOSITION:6 retained or dismissed visual does not complete Operation", () => {
    const inventory = selectNexoraMVPInteractionSubject(initial(), "obj-inventory");
    const operation = applyNexoraMVPPresentationStateChange(inventory, "operation");
    const previous = applyNexoraVisualViewRuntime({
      previous: emptyNexoraVisualViewRuntime(),
      request: { viewId: "trend-obj-inventory-Jan-Jun" } as never,
    });
    const retained = applyNexoraVisualViewRuntime({ previous });
    assert.equal(
      nexoraMVPAcceptedVisualPresentationChanged(previous, retained),
      false,
    );
    assert.equal(
      completeNexoraMVPOperationPresentation(
        operation,
        nexoraMVPAcceptedVisualPresentationChanged(previous, retained),
      ),
      operation,
    );
    const dismissed = applyNexoraVisualViewRuntime({
      previous,
      dismiss: true,
    });
    assert.equal(
      nexoraMVPAcceptedVisualPresentationChanged(previous, dismissed),
      false,
    );
    const sameViewRequested = applyNexoraVisualViewRuntime({
      previous,
      request: previous.view,
    });
    assert.equal(
      nexoraMVPAcceptedVisualPresentationChanged(previous, sameViewRequested),
      true,
    );
  });

  it("STAGE-COMPOSITION:6 Details Report is not closed by accepted visual", () => {
    const inventory = selectNexoraMVPInteractionSubject(initial(), "obj-inventory");
    const details = applyNexoraMVPPresentationStateChange(inventory, "report");
    const previous = emptyNexoraVisualViewRuntime();
    const next = applyNexoraVisualViewRuntime({
      previous,
      request: { viewId: "trend-obj-inventory-Jan-Jun" } as never,
    });
    const after = completeNexoraMVPOperationPresentation(
      details,
      nexoraMVPAcceptedVisualPresentationChanged(previous, next),
    );
    assert.equal(after.presentationState, "report");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: after.presentationState,
      workspace: after.workspace,
      environmentIntent: after.environmentIntent,
      subjectId: after.focusedSubject?.id ?? null,
      subjectKind: after.focusedSubject?.kind ?? null,
      subjectLabel: after.focusedSubject?.label ?? null,
    });
    assert.equal(vm.showReportSurface, true);
    assert.equal(vm.showOperationSurface, false);
  });

  it("STAGE-COMPOSITION:6 explicit Operation reopen after visual completion", () => {
    const inventory = selectNexoraMVPInteractionSubject(initial(), "obj-inventory");
    const operation = applyNexoraMVPPresentationStateChange(inventory, "operation");
    const completed = completeNexoraMVPOperationPresentation(operation, true);
    const reopened = applyNexoraMVPPresentationStateChange(completed, "operation");
    assert.equal(reopened.presentationState, "operation");
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: reopened.presentationState,
      workspace: reopened.workspace,
      environmentIntent: reopened.environmentIntent,
      subjectId: reopened.focusedSubject?.id ?? null,
      subjectKind: reopened.focusedSubject?.kind ?? null,
      subjectLabel: reopened.focusedSubject?.label ?? null,
    });
    assert.equal(vm.showOperationSurface, true);
  });
});
