import type {
  ExecutiveGoal,
  ExecutiveMilestone,
  ExecutivePhase,
  ExecutivePlanExplanation,
  ExecutivePlanningSession,
} from "./executivePlanningTypes.ts";

export function buildExecutivePlanExplanation(
  session: ExecutivePlanningSession,
  goals: readonly ExecutiveGoal[],
  milestones: readonly ExecutiveMilestone[],
  phases: readonly ExecutivePhase[]
): ExecutivePlanExplanation {
  const whyThisPlan = Object.freeze([
    `Why this plan? Judgment ${session.judgmentSessionId} produced ${goals.length} traceable planning goals.`,
  ]);
  const whyTheseMilestones = Object.freeze(
    milestones.map((milestone) => `Why milestone ${milestone.milestoneId}? It supports ${milestone.goalId}.`)
  );
  const whyThisSequence = Object.freeze(
    phases.map((phase) => `Why phase ${phase.phaseId}? It follows logical order ${phase.logicalOrder}.`)
  );
  const judgmentTrace = Object.freeze(goals.map((goal) => `${goal.goalId} <- ${goal.sourceJudgmentId}`));

  return Object.freeze({
    explanationId: `plan-explanation:${session.sessionId}`,
    whyThisPlan,
    whyTheseMilestones,
    whyThisSequence,
    judgmentTrace,
    narrative: [...whyThisPlan, ...whyTheseMilestones, ...whyThisSequence, ...judgmentTrace].join(" "),
  });
}
