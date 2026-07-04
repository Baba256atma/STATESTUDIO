import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import type { ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffEngine.ts";
import {
  normalizeExecutiveJudgmentRiskOpportunity,
  type ExecutiveJudgmentRiskOpportunityCollection,
  type ExecutiveJudgmentRiskOpportunityLevel,
  type NormalizedExecutiveJudgmentRiskOpportunityRecord,
} from "./executiveJudgmentRiskOpportunityNormalizer.ts";

export type ExecutiveJudgmentRiskOpportunityAssessment = Readonly<{
  balanceId: string;
  balanceType: NormalizedExecutiveJudgmentRiskOpportunityRecord["balanceType"];
  riskId: string;
  opportunityId: string;
  category: string;
  scope: readonly string[];
  relationship: string;
  dependency: ExecutiveJudgmentRiskOpportunityLevel;
  direction: NormalizedExecutiveJudgmentRiskOpportunityRecord["direction"];
  applicability: "contextual";
  exposure: ExecutiveJudgmentRiskOpportunityLevel;
  upside: ExecutiveJudgmentRiskOpportunityLevel;
  downside: ExecutiveJudgmentRiskOpportunityLevel;
  asymmetry: NormalizedExecutiveJudgmentRiskOpportunityRecord["asymmetry"];
  reversibility: "unknown";
  timeHorizon: NormalizedExecutiveJudgmentRiskOpportunityRecord["timeHorizon"];
  traceability: ExecutiveJudgmentRiskOpportunityLevel;
  coverage: ExecutiveJudgmentRiskOpportunityLevel;
  consistency: "consistent" | "incomplete";
  status: NormalizedExecutiveJudgmentRiskOpportunityRecord["status"];
  normalizedRecord: NormalizedExecutiveJudgmentRiskOpportunityRecord;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentRiskOpportunityAssessmentCollection = Readonly<{
  contextId: string;
  normalizedBalance: ExecutiveJudgmentRiskOpportunityCollection;
  assessments: readonly ExecutiveJudgmentRiskOpportunityAssessment[];
  deterministic: true;
  metadataOnly: true;
}>;

function levelFromCount(count: number): ExecutiveJudgmentRiskOpportunityLevel {
  if (count > 1) return "complete";
  if (count === 1) return "partial";
  return "none";
}

function assess(record: NormalizedExecutiveJudgmentRiskOpportunityRecord): ExecutiveJudgmentRiskOpportunityAssessment {
  const dependency = levelFromCount(record.dependencies.length);
  return Object.freeze({
    balanceId: record.balanceId,
    balanceType: record.balanceType,
    riskId: record.riskId,
    opportunityId: record.opportunityId,
    category: record.category,
    scope: record.scope,
    relationship: record.relationship,
    dependency,
    direction: record.direction,
    applicability: "contextual",
    exposure: record.exposure,
    upside: record.upside,
    downside: record.downside,
    asymmetry: record.asymmetry,
    reversibility: record.reversibility,
    timeHorizon: record.timeHorizon,
    traceability: dependency,
    coverage: levelFromCount(record.relatedEvidenceIds.length + record.relatedConstraintIds.length + record.relatedTradeoffIds.length),
    consistency: record.status === "available" ? "consistent" : "incomplete",
    status: record.status,
    normalizedRecord: record,
    metadataOnly: true,
  });
}

export function balanceExecutiveJudgmentRiskOpportunity(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection,
  constraints: ExecutiveJudgmentConstraintAssessmentCollection,
  tradeoffs: ExecutiveJudgmentTradeoffAssessmentCollection
): ExecutiveJudgmentRiskOpportunityAssessmentCollection {
  const normalizedBalance = normalizeExecutiveJudgmentRiskOpportunity(context, evidence, constraints, tradeoffs);
  return Object.freeze({
    contextId: context.baseContext.contextId,
    normalizedBalance,
    assessments: Object.freeze(normalizedBalance.records.map(assess)),
    deterministic: true,
    metadataOnly: true,
  });
}
