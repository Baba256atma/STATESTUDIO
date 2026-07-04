import type {
  ExecutiveJudgmentContextItem,
  NormalizedExecutiveJudgmentContext,
} from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import type { ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffEngine.ts";
import type { ExecutiveJudgmentRiskOpportunityDomain } from "./executiveJudgmentRiskOpportunityRegistry.ts";

export type ExecutiveJudgmentRiskOpportunityStatus = "available" | "incomplete" | "invalid";
export type ExecutiveJudgmentRiskOpportunityLevel = "none" | "partial" | "complete";
export type ExecutiveJudgmentRiskOpportunityDirection = "risk-to-opportunity" | "opportunity-to-risk" | "bidirectional";
export type ExecutiveJudgmentRiskOpportunityHorizon = "unspecified" | "short-term" | "long-term";

export type NormalizedExecutiveJudgmentRiskRecord = Readonly<{
  riskId: string;
  label: string;
  source: string;
  references: readonly string[];
  metadataOnly: true;
}>;

export type NormalizedExecutiveJudgmentOpportunityRecord = Readonly<{
  opportunityId: string;
  label: string;
  source: string;
  references: readonly string[];
  metadataOnly: true;
}>;

export type NormalizedExecutiveJudgmentRiskOpportunityRecord = Readonly<{
  balanceId: string;
  balanceType: ExecutiveJudgmentRiskOpportunityDomain;
  riskId: string;
  opportunityId: string;
  relatedAlternativeIds: readonly string[];
  relatedScenarioIds: readonly string[];
  relatedConstraintIds: readonly string[];
  relatedEvidenceIds: readonly string[];
  relatedTradeoffIds: readonly string[];
  category: ExecutiveJudgmentRiskOpportunityDomain;
  scope: readonly string[];
  relationship: string;
  dependencies: readonly string[];
  direction: ExecutiveJudgmentRiskOpportunityDirection;
  applicability: "contextual";
  exposure: ExecutiveJudgmentRiskOpportunityLevel;
  upside: ExecutiveJudgmentRiskOpportunityLevel;
  downside: ExecutiveJudgmentRiskOpportunityLevel;
  asymmetry: "paired" | "unpaired";
  reversibility: "unknown";
  timeHorizon: ExecutiveJudgmentRiskOpportunityHorizon;
  status: ExecutiveJudgmentRiskOpportunityStatus;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentRiskOpportunityCollection = Readonly<{
  contextId: string;
  evidenceContextId: string;
  constraintContextId: string;
  tradeoffContextId: string;
  risks: readonly NormalizedExecutiveJudgmentRiskRecord[];
  opportunities: readonly NormalizedExecutiveJudgmentOpportunityRecord[];
  records: readonly NormalizedExecutiveJudgmentRiskOpportunityRecord[];
  duplicateIdsRemoved: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

function normalizeRisk(item: ExecutiveJudgmentContextItem): NormalizedExecutiveJudgmentRiskRecord {
  return Object.freeze({
    riskId: item.id.trim(),
    label: item.label.trim(),
    source: item.source.trim(),
    references: Object.freeze([...new Set(item.references.map((reference) => reference.trim()).filter(Boolean))].sort()),
    metadataOnly: true,
  });
}

function normalizeOpportunity(item: ExecutiveJudgmentContextItem): NormalizedExecutiveJudgmentOpportunityRecord {
  return Object.freeze({
    opportunityId: item.id.trim(),
    label: item.label.trim(),
    source: item.source.trim(),
    references: Object.freeze([...new Set(item.references.map((reference) => reference.trim()).filter(Boolean))].sort()),
    metadataOnly: true,
  });
}

function isOpportunityItem(item: ExecutiveJudgmentContextItem): boolean {
  const text = `${item.id} ${item.label} ${item.source}`.toLowerCase();
  return text.includes("opportunity");
}

function domainFor(risk: NormalizedExecutiveJudgmentRiskRecord, opportunity: NormalizedExecutiveJudgmentOpportunityRecord): ExecutiveJudgmentRiskOpportunityDomain {
  const text = `${risk.riskId} ${risk.label} ${opportunity.opportunityId} ${opportunity.label}`.toLowerCase();
  if (text.includes("execution") || text.includes("strategic")) return "execution-risk-strategic-gain";
  if (text.includes("resource") || text.includes("impact")) return "resource-risk-impact-opportunity";
  if (text.includes("market") || text.includes("growth")) return "market-risk-growth-opportunity";
  if (text.includes("operational") || text.includes("efficiency")) return "operational-risk-efficiency-opportunity";
  if (text.includes("short") || text.includes("long")) return "short-term-risk-long-term-opportunity";
  if (text.includes("downside") || text.includes("upside")) return "downside-protection-upside-capture";
  if (risk.references.length > 0 || opportunity.references.length > 0) return "high-risk-high-opportunity";
  return "low-risk-low-opportunity";
}

function horizonFor(risk: NormalizedExecutiveJudgmentRiskRecord, opportunity: NormalizedExecutiveJudgmentOpportunityRecord): ExecutiveJudgmentRiskOpportunityHorizon {
  const text = `${risk.label} ${opportunity.label}`.toLowerCase();
  if (text.includes("short")) return "short-term";
  if (text.includes("long") || text.includes("strategic")) return "long-term";
  return "unspecified";
}

function levelFromCount(count: number): ExecutiveJudgmentRiskOpportunityLevel {
  if (count > 1) return "complete";
  if (count === 1) return "partial";
  return "none";
}

export function normalizeExecutiveJudgmentRiskOpportunity(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection,
  constraints: ExecutiveJudgmentConstraintAssessmentCollection,
  tradeoffs: ExecutiveJudgmentTradeoffAssessmentCollection
): ExecutiveJudgmentRiskOpportunityCollection {
  const risks = Object.freeze(context.risks.map(normalizeRisk).filter((risk) => risk.riskId).sort((left, right) => left.riskId.localeCompare(right.riskId)));
  const opportunities = Object.freeze(context.availableAlternatives.filter(isOpportunityItem).map(normalizeOpportunity).filter((opportunity) => opportunity.opportunityId).sort((left, right) => left.opportunityId.localeCompare(right.opportunityId)));
  const evidenceIds = evidence.assessments.map((assessment) => assessment.evidenceId);
  const constraintIds = constraints.assessments.map((assessment) => assessment.constraintId);
  const tradeoffIds = tradeoffs.assessments.map((assessment) => assessment.tradeoffId);
  const alternativeIds = context.availableAlternatives.map((item) => item.id);
  const scenarioIds = context.scenarios.map((item) => item.id);
  const byId = new Map<string, NormalizedExecutiveJudgmentRiskOpportunityRecord>();
  const duplicateIds: string[] = [];

  for (const risk of risks) {
    for (const opportunity of opportunities) {
      const balanceId = `balance.${risk.riskId}.${opportunity.opportunityId}`;
      const references = Object.freeze([...new Set([...risk.references, ...opportunity.references])].sort());
      const relatedEvidenceIds = Object.freeze(references.filter((reference) => evidenceIds.includes(reference)).sort());
      const relatedConstraintIds = Object.freeze(references.filter((reference) => constraintIds.includes(reference)).sort());
      const relatedTradeoffIds = Object.freeze(references.filter((reference) => tradeoffIds.includes(reference)).sort());
      const relatedAlternativeIds = Object.freeze(references.filter((reference) => alternativeIds.includes(reference)).sort());
      const relatedScenarioIds = Object.freeze(references.filter((reference) => scenarioIds.includes(reference)).sort());
      const dependencies = Object.freeze([...new Set([...relatedEvidenceIds, ...relatedConstraintIds, ...relatedTradeoffIds, ...relatedAlternativeIds, ...relatedScenarioIds])].sort());
      const category = domainFor(risk, opportunity);
      const record = Object.freeze({
        balanceId,
        balanceType: category,
        riskId: risk.riskId,
        opportunityId: opportunity.opportunityId,
        relatedAlternativeIds,
        relatedScenarioIds,
        relatedConstraintIds,
        relatedEvidenceIds,
        relatedTradeoffIds,
        category,
        scope: Object.freeze(["executive-judgment"]),
        relationship: dependencies.length > 0 ? "linked" : "unlinked",
        dependencies,
        direction: "bidirectional" as const,
        applicability: "contextual" as const,
        exposure: levelFromCount(risk.references.length),
        upside: levelFromCount(opportunity.references.length),
        downside: levelFromCount(relatedConstraintIds.length),
        asymmetry: dependencies.length > 0 ? "paired" as const : "unpaired" as const,
        reversibility: "unknown" as const,
        timeHorizon: horizonFor(risk, opportunity),
        status: risk.riskId && opportunity.opportunityId ? "available" as const : "incomplete" as const,
        metadataOnly: true as const,
      });
      if (byId.has(balanceId)) {
        duplicateIds.push(balanceId);
        continue;
      }
      byId.set(balanceId, record);
    }
  }

  return Object.freeze({
    contextId: context.baseContext.contextId,
    evidenceContextId: evidence.contextId,
    constraintContextId: constraints.contextId,
    tradeoffContextId: tradeoffs.contextId,
    risks,
    opportunities,
    records: Object.freeze([...byId.values()].sort((left, right) => left.balanceId.localeCompare(right.balanceId))),
    duplicateIdsRemoved: Object.freeze([...new Set(duplicateIds)].sort()),
    deterministic: true,
    metadataOnly: true,
  });
}
