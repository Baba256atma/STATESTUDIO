import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveJudgmentCore, ExecutiveRationale } from "./executiveJudgmentTypes.ts";

export function buildExecutiveRationale(
  sessionId: string,
  reasoning: ExecutiveReasoningResult,
  judgment: ExecutiveJudgmentCore
): ExecutiveRationale {
  const whyThisJudgment = Object.freeze([
    `Why this judgment? ${judgment.alternativeEvaluations.length} alternatives and ${judgment.tradeoffJudgments.length} trade-offs were evaluated from structured reasoning.`,
  ]);
  const evidence = Object.freeze(reasoning.chain.nodes.map((node) => `${node.id}: ${node.evidenceReference}`));
  const assumptions = Object.freeze(reasoning.components.assumptions.map((assumption) => `${assumption.id}: ${assumption.impact}`));
  const constraints = Object.freeze(reasoning.components.constraints.map((constraint) => `${constraint.id}: ${constraint.consequence}`));

  return Object.freeze({
    rationaleId: `rationale:${sessionId}`,
    whyThisJudgment,
    evidence,
    assumptions,
    constraints,
    narrative: [...whyThisJudgment, ...evidence, ...assumptions, ...constraints].join(" "),
  });
}
