import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import {
  normalizeExecutiveJudgmentTradeoffs,
  type ExecutiveJudgmentTradeoffCollection,
  type ExecutiveJudgmentTradeoffLevel,
  type NormalizedExecutiveJudgmentTradeoffRecord,
} from "./executiveJudgmentTradeoffNormalizer.ts";

export type ExecutiveJudgmentTradeoffAssessment = Readonly<{
  tradeoffId: string;
  tradeoffType: NormalizedExecutiveJudgmentTradeoffRecord["tradeoffType"];
  tradeoffCategory: string;
  tradeoffDimension: string;
  tradeoffScope: readonly string[];
  participants: readonly string[];
  relationship: string;
  dependency: ExecutiveJudgmentTradeoffLevel;
  direction: NormalizedExecutiveJudgmentTradeoffRecord["direction"];
  applicability: "contextual";
  severity: "informational" | "bounded";
  criticality: "unlinked" | "linked";
  traceability: ExecutiveJudgmentTradeoffLevel;
  coverage: ExecutiveJudgmentTradeoffLevel;
  consistency: "consistent" | "incomplete";
  status: NormalizedExecutiveJudgmentTradeoffRecord["status"];
  normalizedRecord: NormalizedExecutiveJudgmentTradeoffRecord;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentTradeoffAssessmentCollection = Readonly<{
  contextId: string;
  normalizedTradeoffs: ExecutiveJudgmentTradeoffCollection;
  assessments: readonly ExecutiveJudgmentTradeoffAssessment[];
  deterministic: true;
  metadataOnly: true;
}>;

function levelFromCount(count: number): ExecutiveJudgmentTradeoffLevel {
  if (count > 1) return "complete";
  if (count === 1) return "partial";
  return "none";
}

function assess(record: NormalizedExecutiveJudgmentTradeoffRecord): ExecutiveJudgmentTradeoffAssessment {
  const dependency = levelFromCount(record.dependencies.length);
  const coverage = levelFromCount(record.participants.length);
  return Object.freeze({
    tradeoffId: record.tradeoffId,
    tradeoffType: record.tradeoffType,
    tradeoffCategory: record.category,
    tradeoffDimension: record.dimension,
    tradeoffScope: record.scope,
    participants: record.participants,
    relationship: record.relationship,
    dependency,
    direction: record.direction,
    applicability: "contextual",
    severity: record.participants.length > 0 ? "bounded" : "informational",
    criticality: record.dependencies.length > 0 ? "linked" : "unlinked",
    traceability: coverage,
    coverage,
    consistency: record.status === "available" ? "consistent" : "incomplete",
    status: record.status,
    normalizedRecord: record,
    metadataOnly: true,
  });
}

export function analyzeExecutiveJudgmentTradeoffs(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection,
  constraints: ExecutiveJudgmentConstraintAssessmentCollection
): ExecutiveJudgmentTradeoffAssessmentCollection {
  const normalizedTradeoffs = normalizeExecutiveJudgmentTradeoffs(context, evidence, constraints);
  return Object.freeze({
    contextId: context.baseContext.contextId,
    normalizedTradeoffs,
    assessments: Object.freeze(normalizedTradeoffs.records.map(assess)),
    deterministic: true,
    metadataOnly: true,
  });
}
