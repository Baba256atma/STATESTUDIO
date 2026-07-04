import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintAnalyzer.ts";
import { getExecutiveJudgmentConstraintRegistry } from "./executiveJudgmentConstraintRegistry.ts";

export type ExecutiveJudgmentConstraintValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    constraintId: string | null;
    message: string;
  }>[];
}>;

function issue(code: string, constraintId: string | null, message: string) {
  return Object.freeze({ code, constraintId, message });
}

export function validateExecutiveJudgmentConstraints(collection: ExecutiveJudgmentConstraintAssessmentCollection): ExecutiveJudgmentConstraintValidation {
  const issues = [];
  const registry = getExecutiveJudgmentConstraintRegistry();
  const ids = collection.assessments.map((assessment) => assessment.constraintId);
  if (collection.assessments.length === 0) {
    issues.push(issue("empty_constraint_collection", null, "Constraint collection must contain at least one constraint assessment."));
  }
  if (new Set(ids).size !== ids.length) {
    issues.push(issue("duplicate_constraint_identifier", null, "Constraint assessments must not contain duplicate identifiers."));
  }
  if (registry.dimensions.length !== 9 || registry.phaseId !== "APP-JUDGE-4") {
    issues.push(issue("registry_inconsistent", null, "Constraint registry is inconsistent."));
  }
  for (const assessment of collection.assessments) {
    if (!assessment.constraintId) issues.push(issue("missing_constraint_identifier", null, "Constraint identifier is required."));
    if (!assessment.normalizedRecord.metadataOnly || !assessment.metadataOnly) {
      issues.push(issue("invalid_metadata", assessment.constraintId, "Constraint assessment must be metadata-only."));
    }
    if (assessment.normalizedRecord.references.some((reference) => !reference)) {
      issues.push(issue("invalid_reference", assessment.constraintId, "Constraint references must be non-empty identifiers."));
    }
    if (assessment.status === "invalid") {
      issues.push(issue("invalid_constraint_status", assessment.constraintId, "Constraint status cannot be invalid."));
    }
  }
  if (!Object.isFrozen(collection) || !Object.isFrozen(collection.assessments)) {
    issues.push(issue("mutable_constraint_output", null, "Constraint assessment collection must be immutable."));
  }
  if (!collection.deterministic || !collection.metadataOnly) {
    issues.push(issue("invalid_collection_flags", null, "Constraint assessment collection must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
