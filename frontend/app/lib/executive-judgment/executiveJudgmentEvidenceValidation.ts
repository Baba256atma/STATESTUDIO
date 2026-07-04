import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEvaluator.ts";

export type ExecutiveJudgmentEvidenceValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    evidenceId: string | null;
    message: string;
  }>[];
}>;

function issue(code: string, evidenceId: string | null, message: string) {
  return Object.freeze({ code, evidenceId, message });
}

export function validateExecutiveJudgmentEvidence(collection: ExecutiveJudgmentEvidenceAssessmentCollection): ExecutiveJudgmentEvidenceValidation {
  const issues = [];
  const ids = collection.assessments.map((assessment) => assessment.evidenceId);
  if (collection.assessments.length === 0) {
    issues.push(issue("empty_evidence_collection", null, "Evidence collection must contain at least one evidence assessment."));
  }
  if (new Set(ids).size !== ids.length) {
    issues.push(issue("duplicate_evidence_identifier", null, "Evidence assessments must not contain duplicate identifiers."));
  }
  for (const assessment of collection.assessments) {
    if (!assessment.evidenceId) issues.push(issue("missing_evidence_identifier", null, "Evidence identifier is required."));
    if (!assessment.normalizedRecord.metadataOnly || !assessment.metadataOnly) {
      issues.push(issue("invalid_metadata", assessment.evidenceId, "Evidence assessment must be metadata-only."));
    }
    if (assessment.normalizedRecord.references.some((reference) => !reference)) {
      issues.push(issue("invalid_reference", assessment.evidenceId, "Evidence references must be non-empty identifiers."));
    }
    if (assessment.status === "invalid") {
      issues.push(issue("invalid_evidence_status", assessment.evidenceId, "Evidence status cannot be invalid."));
    }
  }
  if (!Object.isFrozen(collection) || !Object.isFrozen(collection.assessments)) {
    issues.push(issue("mutable_evidence_output", null, "Evidence assessment collection must be immutable."));
  }
  if (!collection.deterministic || !collection.metadataOnly) {
    issues.push(issue("invalid_collection_flags", null, "Evidence assessment collection must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
