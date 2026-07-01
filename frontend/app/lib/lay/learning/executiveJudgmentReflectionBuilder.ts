import type { ExecutiveJudgmentReflection, ExecutiveLearningInput } from "./executiveLearningTypes.ts";

export function buildExecutiveJudgmentReflection(input: ExecutiveLearningInput): ExecutiveJudgmentReflection {
  return Object.freeze({
    reflectionId: `judgment-reflection:${input.judgment.session.sessionId}`,
    confidenceLevel: input.judgment.judgment.confidence.level,
    priorityCount: input.judgment.judgment.priorities.length,
    riskCount: input.judgment.judgment.risks.length,
    opportunityCount: input.judgment.judgment.opportunities.length,
    sourceReferences: Object.freeze([
      input.judgment.session.sessionId,
      ...input.judgment.judgment.priorities.map((priority) => priority.id),
      ...input.judgment.judgment.risks.map((risk) => risk.id),
      ...input.judgment.judgment.opportunities.map((opportunity) => opportunity.id),
    ].sort()),
    explanation: "Judgment reflection summarizes quality signals as metadata only.",
  });
}
