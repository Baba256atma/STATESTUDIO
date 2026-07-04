import {
  normalizeExecutiveJudgmentEvidence,
  type ExecutiveJudgmentEvidenceCollection,
  type ExecutiveJudgmentEvidenceLevel,
  type NormalizedExecutiveJudgmentEvidenceRecord,
} from "./executiveJudgmentEvidenceNormalizer.ts";
import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";

export type ExecutiveJudgmentEvidenceAssessment = Readonly<{
  evidenceId: string;
  evidenceType: NormalizedExecutiveJudgmentEvidenceRecord["evidenceType"];
  evidenceSource: string;
  evidenceCategory: string;
  freshness: "undated" | "referenced";
  coverage: ExecutiveJudgmentEvidenceLevel;
  completeness: ExecutiveJudgmentEvidenceLevel;
  consistency: "consistent" | "incomplete";
  reliability: "source-present" | "source-missing";
  traceability: ExecutiveJudgmentEvidenceLevel;
  independence: "single-source" | "multi-reference";
  relevance: "context-linked" | "unlinked";
  scope: readonly string[];
  status: NormalizedExecutiveJudgmentEvidenceRecord["status"];
  normalizedRecord: NormalizedExecutiveJudgmentEvidenceRecord;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentEvidenceAssessmentCollection = Readonly<{
  contextId: string;
  normalizedEvidence: ExecutiveJudgmentEvidenceCollection;
  assessments: readonly ExecutiveJudgmentEvidenceAssessment[];
  deterministic: true;
  metadataOnly: true;
}>;

function completeness(record: NormalizedExecutiveJudgmentEvidenceRecord): ExecutiveJudgmentEvidenceLevel {
  return record.evidenceId && record.label && record.description && record.source ? "complete" : "partial";
}

function coverage(record: NormalizedExecutiveJudgmentEvidenceRecord): ExecutiveJudgmentEvidenceLevel {
  if (record.references.length > 1) return "complete";
  if (record.references.length === 1) return "partial";
  return "none";
}

function assess(record: NormalizedExecutiveJudgmentEvidenceRecord): ExecutiveJudgmentEvidenceAssessment {
  const referenceCoverage = coverage(record);
  return Object.freeze({
    evidenceId: record.evidenceId,
    evidenceType: record.evidenceType,
    evidenceSource: record.source,
    evidenceCategory: record.category,
    freshness: record.references.length > 0 ? "referenced" : "undated",
    coverage: referenceCoverage,
    completeness: completeness(record),
    consistency: record.status === "available" ? "consistent" : "incomplete",
    reliability: record.source ? "source-present" : "source-missing",
    traceability: referenceCoverage,
    independence: record.references.length > 1 ? "multi-reference" : "single-source",
    relevance: record.references.length > 0 ? "context-linked" : "unlinked",
    scope: record.scope,
    status: record.status,
    normalizedRecord: record,
    metadataOnly: true,
  });
}

export function evaluateExecutiveJudgmentEvidence(context: NormalizedExecutiveJudgmentContext): ExecutiveJudgmentEvidenceAssessmentCollection {
  const normalizedEvidence = normalizeExecutiveJudgmentEvidence(context);
  return Object.freeze({
    contextId: context.baseContext.contextId,
    normalizedEvidence,
    assessments: Object.freeze(normalizedEvidence.records.map(assess)),
    deterministic: true,
    metadataOnly: true,
  });
}
