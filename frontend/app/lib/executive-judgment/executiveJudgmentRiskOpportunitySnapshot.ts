import type { ExecutiveJudgmentRiskOpportunityAssessmentCollection } from "./executiveJudgmentRiskOpportunityBalancer.ts";
import { validateExecutiveJudgmentRiskOpportunity, type ExecutiveJudgmentRiskOpportunityValidation } from "./executiveJudgmentRiskOpportunityValidation.ts";

export type ExecutiveJudgmentRiskOpportunitySnapshotEntry = Readonly<{
  balanceId: string;
  balanceType: string;
  riskId: string;
  opportunityId: string;
  timeHorizon: string;
  dependencyCount: number;
  coverage: string;
  status: string;
}>;

export type ExecutiveJudgmentRiskOpportunitySnapshot = Readonly<{
  contextId: string;
  balanceCount: number;
  riskCount: number;
  opportunityCount: number;
  entries: readonly ExecutiveJudgmentRiskOpportunitySnapshotEntry[];
  validation: ExecutiveJudgmentRiskOpportunityValidation;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function buildExecutiveJudgmentRiskOpportunitySnapshot(collection: ExecutiveJudgmentRiskOpportunityAssessmentCollection): ExecutiveJudgmentRiskOpportunitySnapshot {
  const entries = Object.freeze(
    collection.assessments.map((assessment) =>
      Object.freeze({
        balanceId: assessment.balanceId,
        balanceType: assessment.balanceType,
        riskId: assessment.riskId,
        opportunityId: assessment.opportunityId,
        timeHorizon: assessment.timeHorizon,
        dependencyCount: assessment.normalizedRecord.dependencies.length,
        coverage: assessment.coverage,
        status: assessment.status,
      })
    )
  );
  const validation = validateExecutiveJudgmentRiskOpportunity(collection);
  const base = Object.freeze({
    contextId: collection.contextId,
    balanceCount: entries.length,
    riskCount: collection.normalizedBalance.risks.length,
    opportunityCount: collection.normalizedBalance.opportunities.length,
    entries,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.contextId,
    base.entries.map((entry) => `${entry.balanceId}:${entry.balanceType}:${entry.riskId}:${entry.opportunityId}:${entry.dependencyCount}`).join("|"),
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
