import {
  DecisionDirection,
  JudgmentState,
  JudgmentStatus,
  JudgmentType,
  EXECUTIVE_JUDGMENT_API_VERSION,
  EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
  type ExecutiveJudgmentMetadata,
} from "./index.ts";
import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import type { ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffEngine.ts";
import type { ExecutiveJudgmentRiskOpportunityAssessmentCollection } from "./executiveJudgmentRiskOpportunityEngine.ts";

export type ExecutiveJudgmentAlternativeState = "viable" | "blocked" | "uncertain" | "unsupported";

export type ExecutiveJudgmentAlternativeBasis = Readonly<{
  alternativeId: string;
  label: string;
  references: readonly string[];
  evidenceIds: readonly string[];
  constraintIds: readonly string[];
  tradeoffIds: readonly string[];
  balanceIds: readonly string[];
  state: ExecutiveJudgmentAlternativeState;
  metadataOnly: true;
}>;

export type NormalizedExecutiveJudgment = Readonly<{
  judgmentId: string;
  judgmentType: typeof JudgmentType.Strategic;
  state: typeof JudgmentState.Proposed;
  status: typeof JudgmentStatus.Candidate;
  contextId: string;
  workspaceId: string;
  evidenceIds: readonly string[];
  constraintIds: readonly string[];
  tradeoffIds: readonly string[];
  balanceIds: readonly string[];
  alternatives: readonly ExecutiveJudgmentAlternativeBasis[];
  assumptionIds: readonly string[];
  knownGaps: readonly string[];
  metadata: ExecutiveJudgmentMetadata;
  deterministic: true;
  metadataOnly: true;
}>;

function metadata(): ExecutiveJudgmentMetadata {
  return Object.freeze({
    source: "APP-JUDGE-7",
    description: "Canonical Executive Judgment Output metadata.",
    tags: Object.freeze(["executive-judgment", "canonical-output", "metadata-only"]),
    apiVersion: EXECUTIVE_JUDGMENT_API_VERSION,
    platformVersion: EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
    metadataOnly: true,
  });
}

function intersection(references: readonly string[], values: readonly string[]): readonly string[] {
  return Object.freeze(references.filter((reference) => values.includes(reference)).sort());
}

function alternativeState(evidenceIds: readonly string[], constraintIds: readonly string[]): ExecutiveJudgmentAlternativeState {
  if (constraintIds.length > 0) return "blocked";
  if (evidenceIds.length > 0) return "viable";
  return "uncertain";
}

export function normalizeExecutiveJudgment(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection,
  constraints: ExecutiveJudgmentConstraintAssessmentCollection,
  tradeoffs: ExecutiveJudgmentTradeoffAssessmentCollection,
  balances: ExecutiveJudgmentRiskOpportunityAssessmentCollection
): NormalizedExecutiveJudgment {
  const evidenceIds = Object.freeze(evidence.assessments.map((assessment) => assessment.evidenceId).sort());
  const constraintIds = Object.freeze(constraints.assessments.map((assessment) => assessment.constraintId).sort());
  const tradeoffIds = Object.freeze(tradeoffs.assessments.map((assessment) => assessment.tradeoffId).sort());
  const balanceIds = Object.freeze(balances.assessments.map((assessment) => assessment.balanceId).sort());
  const alternatives = Object.freeze(
    context.availableAlternatives.map((alternative) => {
      const references = Object.freeze([...new Set(alternative.references.map((reference) => reference.trim()).filter(Boolean))].sort());
      const alternativeEvidenceIds = intersection(references, evidenceIds);
      const alternativeConstraintIds = intersection(references, constraintIds);
      const alternativeTradeoffIds = intersection(references, tradeoffIds);
      const alternativeBalanceIds = intersection(references, balanceIds);
      return Object.freeze({
        alternativeId: alternative.id,
        label: alternative.label,
        references,
        evidenceIds: alternativeEvidenceIds,
        constraintIds: alternativeConstraintIds,
        tradeoffIds: alternativeTradeoffIds,
        balanceIds: alternativeBalanceIds,
        state: alternativeState(alternativeEvidenceIds, alternativeConstraintIds),
        metadataOnly: true as const,
      });
    }).sort((left, right) => left.alternativeId.localeCompare(right.alternativeId))
  );
  const knownGaps = Object.freeze([
    ...(evidenceIds.length === 0 ? ["missing-evidence-basis"] : []),
    ...(constraintIds.length === 0 ? ["missing-constraint-basis"] : []),
    ...(tradeoffIds.length === 0 ? ["missing-tradeoff-basis"] : []),
    ...(balanceIds.length === 0 ? ["missing-risk-opportunity-basis"] : []),
    ...(alternatives.length === 0 ? ["missing-alternatives"] : []),
  ].sort());

  return Object.freeze({
    judgmentId: `judgment.${context.baseContext.contextId}`,
    judgmentType: JudgmentType.Strategic,
    state: JudgmentState.Proposed,
    status: JudgmentStatus.Candidate,
    contextId: context.baseContext.contextId,
    workspaceId: context.baseContext.workspaceId,
    evidenceIds,
    constraintIds,
    tradeoffIds,
    balanceIds,
    alternatives,
    assumptionIds: Object.freeze(context.knownAssumptions.map((assumption) => assumption.id).sort()),
    knownGaps,
    metadata: metadata(),
    deterministic: true,
    metadataOnly: true,
  });
}
