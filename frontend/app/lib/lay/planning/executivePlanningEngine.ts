export type {
  ExecutiveDependency,
  ExecutiveGoal,
  ExecutiveMilestone,
  ExecutivePhase,
  ExecutivePlanExplanation,
  ExecutivePlanningInput,
  ExecutivePlanningResult,
  ExecutivePlanningSession,
  ExecutivePlanningValidationIssue,
  ExecutivePlanningValidationResult,
  ExecutiveResource,
  ExecutiveTimeline,
} from "./executivePlanningTypes.ts";
export { EXECUTIVE_PLANNING_CAPABILITY_REGISTRY, listExecutivePlanningCapabilities } from "./executivePlanningRegistry.ts";
export { EXECUTIVE_PLANNING_CONTRACTS } from "./executivePlanningContracts.ts";
export { buildExecutiveGoals, buildExecutivePhases, buildExecutiveResources } from "./executiveGoalPlanner.ts";
export { buildExecutiveMilestones } from "./executiveMilestonePlanner.ts";
export { buildExecutiveDependencies } from "./executiveDependencyPlanner.ts";
export { buildExecutiveTimeline } from "./executiveTimelinePlanner.ts";
export { buildExecutivePlanExplanation } from "./executivePlanExplanation.ts";
export { validateExecutivePlanning } from "./executivePlanningValidation.ts";

import { buildExecutiveDependencies } from "./executiveDependencyPlanner.ts";
import { buildExecutiveGoals, buildExecutivePhases, buildExecutiveResources } from "./executiveGoalPlanner.ts";
import { buildExecutiveMilestones } from "./executiveMilestonePlanner.ts";
import { buildExecutivePlanExplanation } from "./executivePlanExplanation.ts";
import { buildExecutiveTimeline } from "./executiveTimelinePlanner.ts";
import { validateExecutivePlanning } from "./executivePlanningValidation.ts";
import type { ExecutivePlanningInput, ExecutivePlanningResult } from "./executivePlanningTypes.ts";

export function buildExecutivePlan(input: ExecutivePlanningInput): ExecutivePlanningResult {
  const session = Object.freeze({
    sessionId: input.sessionId.trim(),
    phase: "LAY-4" as const,
    judgmentSessionId: input.judgment.session.sessionId,
  });
  const goals = buildExecutiveGoals(input.judgment);
  const milestones = buildExecutiveMilestones(goals);
  const phases = buildExecutivePhases(goals);
  const dependencies = buildExecutiveDependencies(goals, milestones, phases);
  const resources = buildExecutiveResources(goals);
  const timeline = buildExecutiveTimeline(session.sessionId, phases, milestones);
  const explanation = buildExecutivePlanExplanation(session, goals, milestones, phases);
  const withoutValidation = Object.freeze({
    session,
    input,
    goals,
    milestones,
    dependencies,
    phases,
    resources,
    timeline,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutivePlanning(withoutValidation);

  return Object.freeze({
    session,
    input,
    goals,
    milestones,
    dependencies,
    phases,
    resources,
    timeline,
    explanation,
    validation,
  });
}

export const ExecutivePlanningEngine = Object.freeze({
  buildExecutivePlan,
  buildExecutiveGoals,
  buildExecutiveTimeline,
  buildExecutivePlanExplanation,
  validateExecutivePlanning,
});
