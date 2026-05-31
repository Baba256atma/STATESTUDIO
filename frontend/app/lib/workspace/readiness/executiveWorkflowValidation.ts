import type { E2WorkspaceReadinessContext, ExecutiveWorkflowValidationReport } from "./e2ReadinessTypes";
import { logExecutiveFlowValidation } from "./e2ReadinessInstrumentation";

/** E2:50 Part 5 — executive decision flow validation. */
export function validateExecutiveWorkflow(context: E2WorkspaceReadinessContext): ExecutiveWorkflowValidationReport {
  const frictionPoints: string[] = [];

  const steps = [
    {
      id: "open_workspace",
      label: "Open workspace",
      passed: context.commandBarVisible && context.workspaceReadiness.hudReady,
      friction: context.commandBarVisible ? undefined : "Executive command bar not visible on entry",
    },
    {
      id: "understand_situation",
      label: "Understand situation",
      passed:
        Boolean(context.orientationExperience?.situationalAwareness.entryHeadline) ||
        context.workspaceReadiness.sceneReady,
      friction: context.sceneJsonPresent ? undefined : "No operational scene to orient against",
    },
    {
      id: "select_object",
      label: "Select object",
      passed: context.sceneJsonPresent,
      friction: context.objectCount === 0 ? "No objects available to select" : undefined,
    },
    {
      id: "understand_object",
      label: "Understand object",
      passed: Boolean(context.selectedObjectId) ? context.objectInfoVisible : context.objectCount > 0,
      friction: context.selectedObjectId && !context.objectInfoVisible ? "Object selected but Object Info HUD hidden" : undefined,
    },
    {
      id: "review_timeline",
      label: "Review timeline",
      passed: context.timelineVisible,
      friction: context.timelineVisible ? undefined : "Timeline surface not visible",
    },
    {
      id: "open_scenario",
      label: "Open scenario workspace",
      passed: context.hasScenarioWorkspace || context.workspaceReadiness.scenarioReady,
      friction: context.hasScenarioWorkspace ? undefined : "Scenario workspace not initialized",
    },
    {
      id: "understand_recommendation",
      label: "Understand recommendation",
      passed:
        Boolean(context.orientationExperience?.quickStart.length) ||
        context.hasAnalysis ||
        context.assistantVisible,
      friction: !context.assistantVisible ? "Assistant not available for recommendation context" : undefined,
    },
    {
      id: "continue_working",
      label: "Continue working",
      passed: context.workspaceReadiness.ready || context.workspaceReadiness.score >= 70,
      friction: context.workspaceReadiness.score < 70 ? "Workspace readiness below continuation threshold" : undefined,
    },
  ];

  for (const step of steps) {
    if (!step.passed && step.friction) frictionPoints.push(step.friction);
  }

  const passed = steps.filter((s) => s.passed).length >= 6;
  const report: ExecutiveWorkflowValidationReport = {
    passed,
    steps: steps.map(({ friction: _f, ...rest }) => rest),
    frictionPoints,
  };

  logExecutiveFlowValidation("completed", { passed, frictionCount: frictionPoints.length });
  return report;
}
