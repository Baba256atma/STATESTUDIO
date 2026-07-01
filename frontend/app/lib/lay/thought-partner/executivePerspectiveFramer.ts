import type {
  ExecutivePerspectiveFrame,
  ExecutiveThoughtPartnerContext,
  ExecutiveThoughtPartnerInput,
} from "./executiveThoughtPartnerTypes.ts";

const PERSPECTIVES = Object.freeze([
  Object.freeze({ id: "operator", name: "Operator Perspective", basis: "Operational throughput, capacity, and execution friction." }),
  Object.freeze({ id: "financial", name: "Financial Perspective", basis: "Resource stewardship and cost-quality implications." }),
  Object.freeze({ id: "risk", name: "Risk Perspective", basis: "Surfaced risks, constraints, and unresolved assumptions." }),
  Object.freeze({ id: "stakeholder", name: "Stakeholder Perspective", basis: "Stakeholder visibility and blind spots." }),
  Object.freeze({ id: "timing", name: "Timing Perspective", basis: "Logical sequence, phase dependency, and timing tension." }),
  Object.freeze({ id: "execution", name: "Execution Perspective", basis: "Plan goals, milestones, and dependencies." }),
] as const);

export function buildExecutivePerspectiveFrames(
  input: ExecutiveThoughtPartnerInput,
  context: ExecutiveThoughtPartnerContext
): readonly ExecutivePerspectiveFrame[] {
  const evidence = Object.freeze(input.reasoning.chain.nodes.map((node) => node.evidenceReference).filter((reference) => reference.trim().length > 0).sort());
  const planningReferences = Object.freeze([...context.goalIds, ...context.milestoneIds].sort());

  return Object.freeze(
    PERSPECTIVES.map((perspective) =>
      Object.freeze({
        perspectiveId: `perspective:${perspective.id}`,
        perspectiveName: perspective.name,
        basis: perspective.basis,
        linkedEvidence: evidence,
        linkedReferences: Object.freeze([
          context.session.reasoningSessionId,
          context.session.judgmentSessionId,
          context.session.planningSessionId,
          context.session.coachingSessionId,
          ...planningReferences,
        ].sort()),
      })
    ).sort((left, right) => left.perspectiveId.localeCompare(right.perspectiveId))
  );
}
