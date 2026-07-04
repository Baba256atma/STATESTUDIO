import type { ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffAnalyzer.ts";
import { getExecutiveJudgmentTradeoffRegistry } from "./executiveJudgmentTradeoffRegistry.ts";

export type ExecutiveJudgmentTradeoffValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    tradeoffId: string | null;
    message: string;
  }>[];
}>;

function issue(code: string, tradeoffId: string | null, message: string) {
  return Object.freeze({ code, tradeoffId, message });
}

export function validateExecutiveJudgmentTradeoffs(collection: ExecutiveJudgmentTradeoffAssessmentCollection): ExecutiveJudgmentTradeoffValidation {
  const issues = [];
  const registry = getExecutiveJudgmentTradeoffRegistry();
  const ids = collection.assessments.map((assessment) => assessment.tradeoffId);
  if (collection.assessments.length === 0) {
    issues.push(issue("empty_tradeoff_collection", null, "Trade-off collection must contain at least one trade-off assessment."));
  }
  if (new Set(ids).size !== ids.length) {
    issues.push(issue("duplicate_tradeoff_identifier", null, "Trade-off assessments must not contain duplicate identifiers."));
  }
  if (registry.domains.length !== 10 || registry.phaseId !== "APP-JUDGE-5") {
    issues.push(issue("registry_inconsistent", null, "Trade-off registry is inconsistent."));
  }
  for (const assessment of collection.assessments) {
    if (!assessment.tradeoffId) issues.push(issue("missing_tradeoff_identifier", null, "Trade-off identifier is required."));
    if (!assessment.normalizedRecord.metadataOnly || !assessment.metadataOnly) {
      issues.push(issue("invalid_metadata", assessment.tradeoffId, "Trade-off assessment must be metadata-only."));
    }
    if (assessment.normalizedRecord.participants.some((participant) => !participant)) {
      issues.push(issue("invalid_reference", assessment.tradeoffId, "Trade-off participants must be non-empty identifiers."));
    }
    if (assessment.status === "invalid") {
      issues.push(issue("invalid_tradeoff_status", assessment.tradeoffId, "Trade-off status cannot be invalid."));
    }
  }
  if (!Object.isFrozen(collection) || !Object.isFrozen(collection.assessments)) {
    issues.push(issue("mutable_tradeoff_output", null, "Trade-off assessment collection must be immutable."));
  }
  if (!collection.deterministic || !collection.metadataOnly) {
    issues.push(issue("invalid_collection_flags", null, "Trade-off assessment collection must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
