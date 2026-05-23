import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  analyzeInteractionIntegrity,
  analyzeInteractionLoops,
  buildExecutiveInteractionStabilitySnapshot,
  createExecutiveInteractionContext,
  evaluateRuntimeGuardrails,
  preserveExecutiveInteractionContext,
  validateExecutiveInteractionStabilityRuntimeSnapshot,
  validateRuntimeStateConsistency,
} from "./index.ts";
import type { ExecutiveInteractionEvent } from "./index.ts";

function event(overrides: Partial<ExecutiveInteractionEvent> = {}): ExecutiveInteractionEvent {
  return {
    eventId: "event-1",
    component: "panel_routing",
    source: "user_click",
    action: "open_panel",
    actionSignature: "open:object_focus:obj-1",
    generatedAt: 1_000,
    targetPanel: "object_focus",
    objectId: "obj-1",
    ...overrides,
  };
}

describe("D10 executive interaction stability runtime", () => {
  it("preserves executive context across non-destructive panel changes", () => {
    const previous = createExecutiveInteractionContext({
      selectedObjectId: "obj-1",
      focusedObjectId: "obj-1",
      activePanel: "risk",
      activeWorkflow: "decision",
      simulationContextId: "sim-1",
      decisionContextId: "dec-1",
      executiveInvestigationId: "inv-1",
      updatedAt: 900,
    });

    const preserved = preserveExecutiveInteractionContext({
      previous,
      next: { activePanel: "fragility", updatedAt: 1_000 },
      now: 1_000,
    });

    assert.equal(preserved.context.selectedObjectId, "obj-1");
    assert.equal(preserved.context.focusedObjectId, "obj-1");
    assert.equal(preserved.context.activePanel, "fragility");
    assert.equal(preserved.context.activeWorkflow, "decision");
    assert.equal(preserved.preserved, true);
  });

  it("detects duplicate actions and conflicting component ownership", () => {
    const context = createExecutiveInteractionContext({ selectedObjectId: "obj-1", focusedObjectId: "obj-1", updatedAt: 1_000 });
    const issues = analyzeInteractionIntegrity({
      nextContext: context,
      events: [
        event({ eventId: "a", actionSignature: "same", generatedAt: 1_000, action: "open_panel" }),
        event({ eventId: "b", actionSignature: "same", generatedAt: 1_100, action: "open_panel" }),
        event({ eventId: "c", actionSignature: "different", generatedAt: 1_000, action: "close_panel" }),
      ],
    });

    assert.equal(issues.some((issue) => issue.issueType === "duplicated_user_action"), true);
    assert.equal(issues.some((issue) => issue.issueType === "conflicting_interaction"), true);
  });

  it("prevents panel scene panel loops", () => {
    const loop = analyzeInteractionLoops([
      event({ eventId: "p1", component: "panel_routing", generatedAt: 1_000 }),
      event({ eventId: "s1", component: "scene_focus", generatedAt: 1_001, actionSignature: "scene" }),
      event({ eventId: "p2", component: "panel_routing", generatedAt: 1_002, actionSignature: "panel2" }),
    ]);

    assert.equal(loop.loopDetected, true);
    assert.equal(loop.prevented, true);
    assert.equal(loop.issues[0]?.issueType, "interaction_loop");
  });

  it("blocks invalid object-focus panel transition without object context", () => {
    const previous = createExecutiveInteractionContext({ updatedAt: 900 });
    const decision = evaluateRuntimeGuardrails({
      organizationId: "d10-ui",
      previousContext: previous,
      nextContext: { activePanel: "object_focus", updatedAt: 1_000 },
      events: [event({ eventId: "focus-panel", objectId: null, actionSignature: "open:object_focus" })],
      now: 1_000,
    });

    assert.equal(decision.allowed, false);
    assert.equal(decision.stabilityState, "unstable");
    assert.equal(decision.preventedIssue?.issueType, "invalid_panel_transition");
  });

  it("validates object, scene, workflow, and simulation consistency", () => {
    const context = createExecutiveInteractionContext({
      selectedObjectId: "missing",
      focusedObjectId: "missing",
      activePanel: "object_focus",
      activeWorkflow: "decision",
      updatedAt: 1_000,
    });
    const issues = validateRuntimeStateConsistency({
      context,
      validObjectIds: ["obj-1"],
      panelState: { activePanel: "object_focus" },
      objectState: { selectedObjectId: "missing", focusedObjectId: "missing" },
      sceneState: { focusedObjectId: "obj-1", synchronized: true },
      workflowState: { activeWorkflow: "simulation" },
      simulationState: { activeSimulationId: "sim-1", stale: true },
    });

    assert.equal(issues.some((issue) => issue.affectedComponent === "object_selection"), true);
    assert.equal(issues.some((issue) => issue.affectedComponent === "scene_focus"), true);
    assert.equal(issues.some((issue) => issue.affectedComponent === "workflow_transition"), true);
    assert.equal(issues.some((issue) => issue.affectedComponent === "simulation_execution"), true);
  });

  it("builds degraded and recovering executive stability summaries deterministically", () => {
    const previous = createExecutiveInteractionContext({
      selectedObjectId: "obj-1",
      focusedObjectId: "obj-1",
      activePanel: "risk",
      activeWorkflow: "decision",
      updatedAt: 900,
    });
    const input = {
      organizationId: "d10-snapshot",
      previousContext: previous,
      nextContext: { activePanel: "fragility", updatedAt: 1_200 },
      events: [
        event({ eventId: "a", actionSignature: "same", generatedAt: 1_200 }),
        event({ eventId: "b", actionSignature: "same", generatedAt: 1_300 }),
      ],
      now: 1_200,
    };
    const first = buildExecutiveInteractionStabilitySnapshot(input);
    const second = buildExecutiveInteractionStabilitySnapshot(input);

    assert.equal(validateExecutiveInteractionStabilityRuntimeSnapshot(first), true);
    assert.equal(first.stabilityState, "recovering");
    assert.equal(first.summary.contextPreserved, true);
    assert.equal(first.summary.interfaceStable, true);
    assert.equal(first.signature, second.signature);
  });
});

