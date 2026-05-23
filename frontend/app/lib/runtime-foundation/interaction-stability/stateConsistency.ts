import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  InteractionIntegrityIssue,
  RuntimeStateConsistencyInput,
} from "./interactionStabilityTypes.ts";

function consistencyIssue(
  cause: string,
  source: string,
  component: InteractionIntegrityIssue["affectedComponent"],
  correction: string,
  severity: InteractionIntegrityIssue["severity"] = "warning"
): InteractionIntegrityIssue {
  return {
    issueId: stableSignature(["d10-state-consistency", component, cause]).slice(0, 56),
    issueType: "orphaned_runtime_state",
    cause,
    source,
    affectedComponent: component,
    severity,
    recommendedCorrection: correction,
    relatedEventIds: Object.freeze([]),
  };
}

export function validateRuntimeStateConsistency(input: RuntimeStateConsistencyInput): readonly InteractionIntegrityIssue[] {
  const issues: InteractionIntegrityIssue[] = [];
  const validObjectIds = new Set(input.validObjectIds ?? []);
  const contextObject = input.context.focusedObjectId ?? input.context.selectedObjectId;

  if (contextObject && validObjectIds.size > 0 && !validObjectIds.has(contextObject)) {
    issues.push(consistencyIssue(
      "Executive context points to an object that is not present in the valid object set.",
      "object_state",
      "object_selection",
      "Clear or remap object context before rendering object-specific UI.",
      "critical"
    ));
  }
  if (input.panelState?.activePanel === "object_focus" && !contextObject && !input.panelState.ownerObjectId) {
    issues.push(consistencyIssue(
      "Object focus panel is active without object ownership.",
      "panel_state",
      "panel_routing",
      "Route away from object focus or restore object ownership.",
      "critical"
    ));
  }
  if (input.objectState && input.objectState.focusedObjectId !== input.sceneState?.focusedObjectId && input.sceneState?.synchronized === true) {
    issues.push(consistencyIssue(
      "Object focus and synchronized scene focus disagree.",
      "scene_state",
      "scene_focus",
      "Reconcile scene focus with object selection before applying updates."
    ));
  }
  if (input.workflowState?.activeWorkflow && input.context.activeWorkflow && input.workflowState.activeWorkflow !== input.context.activeWorkflow) {
    issues.push(consistencyIssue(
      "Workflow state disagrees with preserved executive context.",
      "workflow_state",
      "workflow_transition",
      "Use the latest authoritative workflow before dispatching transition."
    ));
  }
  if (input.simulationState?.stale) {
    issues.push(consistencyIssue(
      "Simulation state is stale while still attached to executive context.",
      "simulation_state",
      "simulation_execution",
      "Refresh simulation context or detach stale simulation state."
    ));
  }

  return Object.freeze(issues);
}

