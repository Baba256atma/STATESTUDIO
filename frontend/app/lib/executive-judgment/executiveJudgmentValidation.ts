import type { CanonicalExecutiveJudgmentOutput } from "./executiveJudgmentSynthesizer.ts";
import { getExecutiveJudgmentRegistry } from "./executiveJudgmentRegistry.ts";

export type ExecutiveJudgmentValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    field: string;
    message: string;
  }>[];
}>;

function issue(code: string, field: string, message: string) {
  return Object.freeze({ code, field, message });
}

export function validateExecutiveJudgment(judgment: CanonicalExecutiveJudgmentOutput): ExecutiveJudgmentValidation {
  const issues = [];
  const registry = getExecutiveJudgmentRegistry();
  const alternativeIds = judgment.normalizedJudgment.alternatives.map((alternative) => alternative.alternativeId);
  if (!judgment.judgmentId) issues.push(issue("missing_judgment_identifier", "judgmentId", "Judgment identifier is required."));
  if (!registry.postures.includes(judgment.judgmentPosture)) issues.push(issue("invalid_judgment_posture", "judgmentPosture", "Judgment posture is not registered."));
  if (new Set(alternativeIds).size !== alternativeIds.length) {
    issues.push(issue("duplicate_alternative_identifier", "alternatives", "Judgment alternatives must not contain duplicate identifiers."));
  }
  if (judgment.evidenceBasis.length === 0) issues.push(issue("missing_evidence_basis", "evidenceBasis", "Judgment requires evidence basis metadata."));
  if (judgment.constraintBasis.length === 0) issues.push(issue("missing_constraint_basis", "constraintBasis", "Judgment requires constraint basis metadata."));
  if (judgment.tradeoffBasis.length === 0) issues.push(issue("missing_tradeoff_basis", "tradeoffBasis", "Judgment requires trade-off basis metadata."));
  if (judgment.riskOpportunityBasis.length === 0) issues.push(issue("missing_risk_opportunity_basis", "riskOpportunityBasis", "Judgment requires risk opportunity basis metadata."));
  if (!Object.isFrozen(judgment) || !Object.isFrozen(judgment.normalizedJudgment)) {
    issues.push(issue("mutable_judgment_output", "judgment", "Executive Judgment output must be immutable."));
  }
  if (!judgment.deterministic || !judgment.metadataOnly) {
    issues.push(issue("invalid_judgment_flags", "judgment", "Executive Judgment output must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
