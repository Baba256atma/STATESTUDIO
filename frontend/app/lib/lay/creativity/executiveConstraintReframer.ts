import type { ExecutiveConstraintReframe, ExecutiveCreativityContext } from "./executiveCreativityTypes.ts";

export function reframeExecutiveConstraints(context: ExecutiveCreativityContext): readonly ExecutiveConstraintReframe[] {
  return Object.freeze(
    context.constraintIds.map((constraintId) =>
      Object.freeze({
        constraintReframeId: `constraint-reframe:${constraintId}`,
        constraintId,
        designInput: `${constraintId} becomes an input for option design.`,
        blockerState: "reframed-as-input" as const,
        explanation: "Constraint is reframed as a design input, not a blocker.",
      })
    ).sort((left, right) => left.constraintReframeId.localeCompare(right.constraintReframeId))
  );
}
