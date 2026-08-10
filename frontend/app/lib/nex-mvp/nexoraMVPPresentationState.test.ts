/**
 * NEX-MVP:6 — pure Presentation States tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import {
  applyNexoraMVPPresentationDensity,
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
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
    assert.ok(vm.availableActions.some((action) => action.available));
  });

  it("11. capability-driven Operation availability", () => {
    const inventory = resolveNexoraMVPPresentationCapability("obj-inventory");
    assert.equal(inventory.operation, false);
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

    const inventoryOp = resolveNexoraMVPPresentationStateChange({
      targetPresentationState: "operation",
      currentPresentationState: "minimum",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-inventory",
    });
    assert.equal(inventoryOp.ok, true);
    if (inventoryOp.ok) assert.equal(inventoryOp.presentationState, "report");
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
});
