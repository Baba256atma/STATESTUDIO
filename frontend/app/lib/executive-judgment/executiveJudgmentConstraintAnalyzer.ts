import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import {
  normalizeExecutiveJudgmentConstraints,
  type ExecutiveJudgmentConstraintCollection,
  type ExecutiveJudgmentConstraintLevel,
  type NormalizedExecutiveJudgmentConstraintRecord,
} from "./executiveJudgmentConstraintNormalizer.ts";

export type ExecutiveJudgmentConstraintAssessment = Readonly<{
  constraintId: string;
  constraintType: NormalizedExecutiveJudgmentConstraintRecord["constraintType"];
  constraintCategory: string;
  constraintSource: string;
  severity: "informational" | "bounded";
  criticality: "unlinked" | "linked";
  applicability: "contextual";
  dependency: ExecutiveJudgmentConstraintLevel;
  coverage: ExecutiveJudgmentConstraintLevel;
  completeness: ExecutiveJudgmentConstraintLevel;
  consistency: "consistent" | "incomplete";
  traceability: ExecutiveJudgmentConstraintLevel;
  scope: readonly string[];
  status: NormalizedExecutiveJudgmentConstraintRecord["status"];
  normalizedRecord: NormalizedExecutiveJudgmentConstraintRecord;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentConstraintAssessmentCollection = Readonly<{
  contextId: string;
  normalizedConstraints: ExecutiveJudgmentConstraintCollection;
  assessments: readonly ExecutiveJudgmentConstraintAssessment[];
  deterministic: true;
  metadataOnly: true;
}>;

function levelFromCount(count: number): ExecutiveJudgmentConstraintLevel {
  if (count > 1) return "complete";
  if (count === 1) return "partial";
  return "none";
}

function completeness(record: NormalizedExecutiveJudgmentConstraintRecord): ExecutiveJudgmentConstraintLevel {
  return record.constraintId && record.label && record.description && record.source ? "complete" : "partial";
}

function assess(record: NormalizedExecutiveJudgmentConstraintRecord): ExecutiveJudgmentConstraintAssessment {
  const dependency = levelFromCount(record.dependencies.length);
  const coverage = levelFromCount(record.references.length);
  return Object.freeze({
    constraintId: record.constraintId,
    constraintType: record.constraintType,
    constraintCategory: record.category,
    constraintSource: record.source,
    severity: record.references.length > 0 ? "bounded" : "informational",
    criticality: record.dependencies.length > 0 ? "linked" : "unlinked",
    applicability: "contextual",
    dependency,
    coverage,
    completeness: completeness(record),
    consistency: record.status === "available" ? "consistent" : "incomplete",
    traceability: coverage,
    scope: record.scope,
    status: record.status,
    normalizedRecord: record,
    metadataOnly: true,
  });
}

export function analyzeExecutiveJudgmentConstraints(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection
): ExecutiveJudgmentConstraintAssessmentCollection {
  const normalizedConstraints = normalizeExecutiveJudgmentConstraints(context, evidence);
  return Object.freeze({
    contextId: context.baseContext.contextId,
    normalizedConstraints,
    assessments: Object.freeze(normalizedConstraints.records.map(assess)),
    deterministic: true,
    metadataOnly: true,
  });
}
