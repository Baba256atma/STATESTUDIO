import type { ExecutiveJudgmentRiskOpportunityAssessmentCollection } from "./executiveJudgmentRiskOpportunityBalancer.ts";
import { getExecutiveJudgmentRiskOpportunityRegistry } from "./executiveJudgmentRiskOpportunityRegistry.ts";

export type ExecutiveJudgmentRiskOpportunityValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    balanceId: string | null;
    message: string;
  }>[];
}>;

function issue(code: string, balanceId: string | null, message: string) {
  return Object.freeze({ code, balanceId, message });
}

export function validateExecutiveJudgmentRiskOpportunity(collection: ExecutiveJudgmentRiskOpportunityAssessmentCollection): ExecutiveJudgmentRiskOpportunityValidation {
  const issues = [];
  const registry = getExecutiveJudgmentRiskOpportunityRegistry();
  const ids = collection.assessments.map((assessment) => assessment.balanceId);
  if (collection.normalizedBalance.risks.length === 0) {
    issues.push(issue("empty_risk_collection", null, "Risk collection must contain at least one risk record."));
  }
  if (collection.normalizedBalance.opportunities.length === 0) {
    issues.push(issue("empty_opportunity_collection", null, "Opportunity collection must contain at least one opportunity record."));
  }
  if (collection.assessments.length === 0) {
    issues.push(issue("empty_balance_collection", null, "Balance collection must contain at least one balance assessment."));
  }
  if (new Set(ids).size !== ids.length) {
    issues.push(issue("duplicate_balance_identifier", null, "Balance assessments must not contain duplicate identifiers."));
  }
  if (registry.domains.length !== 8 || registry.phaseId !== "APP-JUDGE-6") {
    issues.push(issue("registry_inconsistent", null, "Risk opportunity registry is inconsistent."));
  }
  for (const assessment of collection.assessments) {
    if (!assessment.balanceId) issues.push(issue("missing_balance_identifier", null, "Balance identifier is required."));
    if (!assessment.riskId) issues.push(issue("missing_risk_identifier", assessment.balanceId, "Risk identifier is required."));
    if (!assessment.opportunityId) issues.push(issue("missing_opportunity_identifier", assessment.balanceId, "Opportunity identifier is required."));
    if (!assessment.normalizedRecord.metadataOnly || !assessment.metadataOnly) {
      issues.push(issue("invalid_metadata", assessment.balanceId, "Balance assessment must be metadata-only."));
    }
    if (assessment.normalizedRecord.dependencies.some((dependency) => !dependency)) {
      issues.push(issue("invalid_reference", assessment.balanceId, "Balance dependencies must be non-empty identifiers."));
    }
    if (assessment.status === "invalid") {
      issues.push(issue("invalid_balance_status", assessment.balanceId, "Balance status cannot be invalid."));
    }
  }
  if (!Object.isFrozen(collection) || !Object.isFrozen(collection.assessments)) {
    issues.push(issue("mutable_balance_output", null, "Balance assessment collection must be immutable."));
  }
  if (!collection.deterministic || !collection.metadataOnly) {
    issues.push(issue("invalid_collection_flags", null, "Balance assessment collection must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
