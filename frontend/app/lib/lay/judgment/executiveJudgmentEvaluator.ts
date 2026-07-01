import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import { buildExecutiveConfidence } from "./executiveConfidenceBuilder.ts";
import { evaluateExecutivePriorities } from "./executivePriorityEvaluator.ts";
import type {
  ExecutiveAlternativeEvaluation,
  ExecutiveJudgmentCore,
  ExecutiveJudgmentLevel,
  ExecutiveOpportunityAwareness,
  ExecutiveRiskAwareness,
  ExecutiveTradeoffJudgment,
} from "./executiveJudgmentTypes.ts";

function levelFromCounts(evidenceCount: number, assumptionCount: number, constraintCount: number): ExecutiveJudgmentLevel {
  const total = evidenceCount + assumptionCount + constraintCount;
  if (total >= 4) return "high";
  if (total >= 2) return "moderate";
  return "low";
}

function tradeoffLevel(evidenceCount: number): ExecutiveJudgmentLevel {
  if (evidenceCount >= 2) return "high";
  if (evidenceCount === 1) return "moderate";
  return "low";
}

function buildAlternativeEvaluations(reasoning: ExecutiveReasoningResult): readonly ExecutiveAlternativeEvaluation[] {
  return Object.freeze(
    reasoning.components.alternatives.map((alternative) => {
      const evidenceCount = alternative.basedOnNodeIds.length;
      const assumptionCount = reasoning.components.assumptions.length;
      const constraintCount = reasoning.components.constraints.length;
      const tradeoffCount = reasoning.components.tradeoffs.length;
      const judgment = levelFromCounts(evidenceCount, assumptionCount, constraintCount);
      return Object.freeze({
        alternativeId: alternative.id,
        pathLabel: alternative.pathLabel,
        evidenceCount,
        assumptionCount,
        constraintCount,
        tradeoffCount,
        judgment,
        justification: `Alternative ${alternative.id} has ${judgment} judgment support from ${evidenceCount} evidence references, ${assumptionCount} assumptions, and ${constraintCount} constraints.`,
      });
    })
  );
}

function buildTradeoffJudgments(reasoning: ExecutiveReasoningResult): readonly ExecutiveTradeoffJudgment[] {
  return Object.freeze(
    reasoning.components.tradeoffs.map((tradeoff) => {
      const judgment = tradeoffLevel(tradeoff.evidenceReferences.length);
      return Object.freeze({
        tradeoffId: tradeoff.id,
        left: tradeoff.left,
        right: tradeoff.right,
        tension: tradeoff.tension,
        judgment,
        justification: `Trade-off ${tradeoff.id} has ${judgment} support from ${tradeoff.evidenceReferences.length} evidence references.`,
      });
    })
  );
}

function buildRisks(reasoning: ExecutiveReasoningResult): readonly ExecutiveRiskAwareness[] {
  const risks = [
    ...reasoning.components.assumptions.map((assumption) =>
      Object.freeze({
        id: `risk:${assumption.id}`,
        sourceId: assumption.id,
        description: `Assumption risk: ${assumption.impact}`,
        evidenceReference: assumption.id,
      })
    ),
    ...reasoning.components.constraints.map((constraint) =>
      Object.freeze({
        id: `risk:${constraint.id}`,
        sourceId: constraint.id,
        description: `Constraint risk: ${constraint.consequence}`,
        evidenceReference: constraint.id,
      })
    ),
  ];
  return Object.freeze(risks.sort((left, right) => left.id.localeCompare(right.id)));
}

function buildOpportunities(reasoning: ExecutiveReasoningResult): readonly ExecutiveOpportunityAwareness[] {
  const opportunities = reasoning.components.alternatives.map((alternative) =>
    Object.freeze({
      id: `opportunity:${alternative.id}`,
      sourceId: alternative.id,
      description: `Opportunity awareness from ${alternative.pathLabel}.`,
      evidenceReference: alternative.basedOnNodeIds.join("|"),
    })
  );
  return Object.freeze(opportunities.sort((left, right) => left.id.localeCompare(right.id)));
}

export function evaluateExecutiveJudgment(reasoning: ExecutiveReasoningResult): ExecutiveJudgmentCore {
  const alternativeEvaluations = buildAlternativeEvaluations(reasoning);
  const tradeoffJudgments = buildTradeoffJudgments(reasoning);
  const priorities = evaluateExecutivePriorities(alternativeEvaluations, tradeoffJudgments);

  return Object.freeze({
    alternativeEvaluations,
    tradeoffJudgments,
    priorities,
    risks: buildRisks(reasoning),
    opportunities: buildOpportunities(reasoning),
    confidence: buildExecutiveConfidence(reasoning),
  });
}
