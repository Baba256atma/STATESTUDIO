/**
 * NEX-MVP:5 — pure Workspace Dial & Scene State tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import {
  applyNexoraMVPWorkspaceChangeToInteraction,
  deriveNexoraMVPSceneEnvironmentVisualState,
  deriveNexoraMVPWorkspaceDialState,
  deriveNexoraMVPWorkspacePresentation,
  getNexoraMVPWorkspaceDialSceneStateIdentity,
  getNexoraMVPWorkspaceIndex,
  getNexoraMVPWorkspacePrimaryContextKinds,
  resolveNexoraMVPContextRelevanceTier,
  resolveNexoraMVPNextWorkspace,
  resolveNexoraMVPPreviousWorkspace,
  resolveNexoraMVPWorkspaceChange,
  verifyNexoraMVPWorkspaceDialSceneState,
} from "./nexoraMVPWorkspacePresentation.ts";
import { getNexoraMVPWorkspaceOrder } from "./nexoraMVPApplicationFoundation.ts";

function initialInteraction() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

describe("NEX-MVP:5 Workspace Dial & Scene State", () => {
  it("1. canonical workspace order", () => {
    assert.deepEqual([...getNexoraMVPWorkspaceOrder()], [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]);
  });

  it("2. workspace → environment mapping", () => {
    const scenario = resolveNexoraMVPWorkspaceChange({
      targetWorkspace: "scenario",
      currentWorkspace: "overview",
      presentationState: "minimum",
    });
    assert.equal(scenario.ok, true);
    if (scenario.ok) assert.equal(scenario.environmentIntent, "simulate");

    const problem = resolveNexoraMVPWorkspaceChange({
      targetWorkspace: "problem",
      currentWorkspace: "overview",
      presentationState: "report",
    });
    assert.equal(problem.ok, true);
    if (problem.ok) {
      assert.equal(problem.environmentIntent, "investigate");
      assert.equal(problem.presentationState, "report");
    }
  });

  it("3. previous workspace resolution", () => {
    assert.equal(resolveNexoraMVPPreviousWorkspace("scenario"), "problem");
    assert.equal(resolveNexoraMVPPreviousWorkspace("overview"), null);
  });

  it("4. next workspace resolution", () => {
    assert.equal(resolveNexoraMVPNextWorkspace("scenario"), "decision");
    assert.equal(resolveNexoraMVPNextWorkspace("execution"), null);
  });

  it("5. start boundary behavior", () => {
    const dial = deriveNexoraMVPWorkspaceDialState({
      activeWorkspace: "overview",
    });
    assert.equal(dial.canGoPrevious, false);
    assert.equal(dial.previousWorkspace, null);
    assert.equal(dial.canGoNext, true);
  });

  it("6. end boundary behavior", () => {
    const dial = deriveNexoraMVPWorkspaceDialState({
      activeWorkspace: "execution",
    });
    assert.equal(dial.canGoNext, false);
    assert.equal(dial.nextWorkspace, null);
    assert.equal(dial.canGoPrevious, true);
  });

  it("7. workspace index derivation", () => {
    assert.equal(getNexoraMVPWorkspaceIndex("overview"), 0);
    assert.equal(getNexoraMVPWorkspaceIndex("decision"), 3);
  });

  it("8. Dial state derived from application snapshot", () => {
    const dial = deriveNexoraMVPWorkspaceDialState({
      activeWorkspace: "decision",
    });
    assert.equal(dial.activeWorkspace, "decision");
    assert.equal(dial.label, "Decision");
    assert.equal(dial.activeIndex, 3);
    assert.equal(dial.workspaces.length, 5);
  });

  it("9. focus preservation policy", () => {
    const focused = selectNexoraMVPInteractionSubject(
      initialInteraction(),
      "obj-capacity",
    );
    const scenario = applyNexoraMVPWorkspaceChangeToInteraction(
      focused,
      "scenario",
    );
    assert.equal(scenario.focusedSubject?.id, "obj-capacity");
    assert.equal(scenario.workspace, "scenario");
    assert.equal(scenario.environmentIntent, "simulate");
  });

  it("10. presentation-state preservation", () => {
    const report = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    const next = applyNexoraMVPWorkspaceChangeToInteraction(report, "problem");
    assert.equal(next.presentationState, "report");
  });

  it("11. workspace presentation relevance", () => {
    assert.deepEqual([...getNexoraMVPWorkspacePrimaryContextKinds("scenario")], [
      "scenario",
    ]);
    assert.equal(
      resolveNexoraMVPContextRelevanceTier("scenario", "scenario"),
      "primary",
    );
    assert.equal(
      resolveNexoraMVPContextRelevanceTier("scenario", "problem"),
      "supporting",
    );

    const focused = selectNexoraMVPInteractionSubject(
      initialInteraction(),
      "obj-revenue",
    );
    const scenario = applyNexoraMVPWorkspaceChangeToInteraction(
      focused,
      "scenario",
    );
    const base = deriveNexoraMVPStageInteractionPresentation(scenario);
    const presented = deriveNexoraMVPWorkspacePresentation(base, "scenario");
    const scenarioNode = presented.contextNodes.find(
      (node) => node.kind === "scenario",
    );
    const problemNode = presented.contextNodes.find(
      (node) => node.kind === "problem",
    );
    assert.ok(scenarioNode && problemNode);
    assert.ok(scenarioNode.opacity >= problemNode.opacity);
  });

  it("12. deterministic scene environment mapping", () => {
    const a = deriveNexoraMVPSceneEnvironmentVisualState("commit");
    const b = deriveNexoraMVPSceneEnvironmentVisualState("commit");
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    assert.equal(a.objectSurfaceTreatment, "committal");
  });

  it("13. invalid workspace rejection", () => {
    const rejected = resolveNexoraMVPWorkspaceChange({
      targetWorkspace: "planning-mode",
      currentWorkspace: "overview",
      presentationState: "minimum",
    });
    assert.equal(rejected.ok, false);
    const state = applyNexoraMVPWorkspaceChangeToInteraction(
      initialInteraction(),
      "not-a-workspace",
    );
    assert.equal(state.workspace, "overview");
  });

  it("14. repeated resolution stability", () => {
    const a = deriveNexoraMVPWorkspaceDialState({ activeWorkspace: "problem" });
    const b = deriveNexoraMVPWorkspaceDialState({ activeWorkspace: "problem" });
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    assert.equal(verifyNexoraMVPWorkspaceDialSceneState().ok, true);
    const identity = getNexoraMVPWorkspaceDialSceneStateIdentity();
    assert.equal(identity.id, "NEX-MVP:5/NexoraWorkspaceDialSceneState");
    assert.equal(identity.version, "1.5.0");
  });

  it("clears unsupported contextual depth on workspace change", () => {
    let state = selectNexoraMVPInteractionSubject(
      initialInteraction(),
      "obj-revenue",
    );
    state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-pricing");
    assert.equal(state.mode, "context-focused");
    const problem = applyNexoraMVPWorkspaceChangeToInteraction(state, "problem");
    assert.equal(problem.focusedSubject?.id, "obj-revenue");
    assert.equal(problem.mode, "object-focused");
    assert.equal(problem.workspace, "problem");
  });

  it("theme is independent of environment tokens", () => {
    const nightScenario = deriveNexoraMVPSceneEnvironmentVisualState("simulate");
    assert.equal(nightScenario.intent, "simulate");
    assert.ok(nightScenario.background.startsWith("#"));
  });
});
