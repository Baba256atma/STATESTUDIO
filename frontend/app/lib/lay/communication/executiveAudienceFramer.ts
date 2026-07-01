import type { ExecutiveAudienceFrame, ExecutiveCommunicationAudience, ExecutiveCommunicationContext } from "./executiveCommunicationTypes.ts";

const AUDIENCE_FOCUS: Readonly<Record<ExecutiveCommunicationAudience, string>> = Object.freeze({
  CEO: "Enterprise-level situation, judgment, and strategic path.",
  board: "Governance-level rationale, risk posture, and plan clarity.",
  operationsLeader: "Execution dependencies, milestones, and operational trade-offs.",
  financeLeader: "Resource implications, cost-quality tension, and priority basis.",
  riskComplianceLeader: "Risk, constraints, blind spots, and confidence limitations.",
  teamLead: "Goal clarity, milestone sequence, and immediate communication context.",
});

export function buildExecutiveAudienceFrame(context: ExecutiveCommunicationContext): readonly ExecutiveAudienceFrame[] {
  return Object.freeze(
    context.audienceIds.map((audience) =>
      Object.freeze({
        audience,
        frameId: `audience-frame:${audience}`,
        focus: AUDIENCE_FOCUS[audience],
        emphasis: Object.freeze([
          ...context.priorityIds.slice(0, 2),
          ...context.goalIds.slice(0, 2),
          ...context.riskIds.slice(0, 1),
          ...context.visualMapIds.slice(0, 1),
        ].sort()),
        sourceReferences: Object.freeze([
          context.session.reasoningSessionId,
          context.session.judgmentSessionId,
          context.session.planningSessionId,
          context.session.visualReasoningSessionId,
        ].sort()),
        explanation: `Audience frame ${audience} exists so consumers can tailor communication metadata without rendering or sending messages.`,
      })
    ).sort((left, right) => left.frameId.localeCompare(right.frameId))
  );
}
