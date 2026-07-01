import type { ExecutiveCoachingInput, ExecutiveAssumptionChallenge } from "./executiveCoachingTypes.ts";

export function buildExecutiveAssumptionChallenges(input: ExecutiveCoachingInput): readonly ExecutiveAssumptionChallenge[] {
  return Object.freeze(
    input.reasoning.components.assumptions
      .map((assumption) =>
        Object.freeze({
          challengeId: `challenge:${assumption.id}`,
          challengedAssumptionId: assumption.id,
          reasonForChallenge: `Assumption '${assumption.statement}' influences judgment confidence and plan structure.`,
          relatedEvidence: input.reasoning.chain.nodes.find((node) => node.evidenceReference.includes(assumption.id))?.evidenceReference ?? assumption.id,
          relatedRisk: input.judgment.judgment.risks.find((risk) => risk.sourceId === assumption.id)?.id ?? `risk:${assumption.id}`,
          coachingIntent: "Pressure-test a judgment-shaping assumption.",
        })
      )
      .sort((left, right) => left.challengeId.localeCompare(right.challengeId))
  );
}
