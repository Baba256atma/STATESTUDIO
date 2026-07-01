import type {
  ExecutiveAlternativeEvaluation,
  ExecutivePriority,
  ExecutiveTradeoffJudgment,
} from "./executiveJudgmentTypes.ts";

function judgmentWeight(value: "low" | "moderate" | "high"): number {
  if (value === "high") return 3;
  if (value === "moderate") return 2;
  return 1;
}

export function evaluateExecutivePriorities(
  alternatives: readonly ExecutiveAlternativeEvaluation[],
  tradeoffs: readonly ExecutiveTradeoffJudgment[]
): readonly ExecutivePriority[] {
  const subjects = [
    ...alternatives.map((alternative) =>
      Object.freeze({
        id: `priority:${alternative.alternativeId}`,
        subjectId: alternative.alternativeId,
        basis: `alternative:${alternative.judgment}`,
        weight: judgmentWeight(alternative.judgment),
        justification: alternative.justification,
      })
    ),
    ...tradeoffs.map((tradeoff) =>
      Object.freeze({
        id: `priority:${tradeoff.tradeoffId}`,
        subjectId: tradeoff.tradeoffId,
        basis: `tradeoff:${tradeoff.judgment}`,
        weight: judgmentWeight(tradeoff.judgment),
        justification: tradeoff.justification,
      })
    ),
  ].sort((left, right) => right.weight - left.weight || left.id.localeCompare(right.id));

  return Object.freeze(
    subjects.map((subject, index) =>
      Object.freeze({
        id: subject.id,
        subjectId: subject.subjectId,
        order: index + 1,
        basis: subject.basis,
        justification: subject.justification,
      })
    )
  );
}
