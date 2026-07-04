import type { CanonicalExecutiveJudgmentOutput } from "./executiveJudgmentEngine.ts";
import type { ExecutiveJudgmentExplanationSectionType } from "./executiveJudgmentExplanationRegistry.ts";

export type ExecutiveJudgmentExplanationSection = Readonly<{
  sectionId: string;
  sectionType: ExecutiveJudgmentExplanationSectionType;
  parentSectionId: string | null;
  order: number;
  summaryType: "count-summary" | "state-summary" | "reference-summary";
  references: readonly string[];
  metrics: Readonly<Record<string, number>>;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentTraceabilityEntry = Readonly<{
  sourceType: string;
  sourceId: string;
  targetSectionId: string;
  metadataOnly: true;
}>;

export type NormalizedExecutiveJudgmentExplanation = Readonly<{
  explanationId: string;
  judgmentId: string;
  explanationType: "structured-judgment-explanation";
  sections: readonly ExecutiveJudgmentExplanationSection[];
  traceabilityMap: readonly ExecutiveJudgmentTraceabilityEntry[];
  referencedObjects: readonly string[];
  referencedAssessments: readonly string[];
  metadata: Readonly<{
    source: "APP-JUDGE-8";
    judgmentPosture: string;
    judgmentReadiness: string;
    metadataOnly: true;
  }>;
  deterministic: true;
  metadataOnly: true;
}>;

function section(
  sectionType: ExecutiveJudgmentExplanationSectionType,
  order: number,
  references: readonly string[],
  metrics: Readonly<Record<string, number>>,
  summaryType: ExecutiveJudgmentExplanationSection["summaryType"] = "reference-summary"
): ExecutiveJudgmentExplanationSection {
  return Object.freeze({
    sectionId: `section.${sectionType}`,
    sectionType,
    parentSectionId: null,
    order,
    summaryType,
    references: Object.freeze([...references].sort()),
    metrics: Object.freeze({ ...metrics }),
    metadataOnly: true,
  });
}

function trace(sourceType: string, sourceId: string, targetSectionId: string): ExecutiveJudgmentTraceabilityEntry {
  return Object.freeze({ sourceType, sourceId, targetSectionId, metadataOnly: true });
}

export function normalizeExecutiveJudgmentExplanation(judgment: CanonicalExecutiveJudgmentOutput): NormalizedExecutiveJudgmentExplanation {
  const alternativeIds = Object.freeze([
    ...judgment.supportedAlternatives.map((alternative) => alternative.alternativeId),
    ...judgment.blockedAlternatives.map((alternative) => alternative.alternativeId),
    ...judgment.uncertainAlternatives.map((alternative) => alternative.alternativeId),
  ].sort());
  const sections = Object.freeze([
    section("executive-summary", 1, Object.freeze([judgment.judgmentId]), Object.freeze({ readiness: judgment.judgmentReadiness === "ready" ? 1 : 0 }), "state-summary"),
    section("evidence-basis", 2, judgment.evidenceBasis, Object.freeze({ evidenceCount: judgment.evidenceBasis.length })),
    section("constraint-basis", 3, judgment.constraintBasis, Object.freeze({ constraintCount: judgment.constraintBasis.length })),
    section("tradeoff-basis", 4, judgment.tradeoffBasis, Object.freeze({ tradeoffCount: judgment.tradeoffBasis.length })),
    section("risk-opportunity-basis", 5, judgment.riskOpportunityBasis, Object.freeze({ balanceCount: judgment.riskOpportunityBasis.length })),
    section("alternative-analysis", 6, alternativeIds, Object.freeze({
      supportedCount: judgment.supportedAlternatives.length,
      blockedCount: judgment.blockedAlternatives.length,
      uncertainCount: judgment.uncertainAlternatives.length,
    })),
    section("blocking-factors", 7, judgment.blockingFactors, Object.freeze({ blockingFactorCount: judgment.blockingFactors.length })),
    section("decision-boundaries", 8, judgment.decisionBoundaries, Object.freeze({ boundaryCount: judgment.decisionBoundaries.length })),
    section("known-gaps", 9, judgment.knownGaps, Object.freeze({ gapCount: judgment.knownGaps.length })),
    section("supporting-metadata", 10, Object.freeze([judgment.judgmentPosture, judgment.judgmentReadiness, judgment.judgmentDirection]), Object.freeze({ metadataCount: 3 }), "state-summary"),
    section("validation-summary", 11, Object.freeze([judgment.judgmentStatus, judgment.judgmentState]), Object.freeze({ validationInputCount: 2 }), "state-summary"),
  ]);
  const sectionByType = new Map(sections.map((entry) => [entry.sectionType, entry.sectionId]));
  const traceabilityMap = Object.freeze([
    ...judgment.evidenceBasis.map((id) => trace("evidence", id, sectionByType.get("evidence-basis") ?? "section.evidence-basis")),
    ...judgment.constraintBasis.map((id) => trace("constraint", id, sectionByType.get("constraint-basis") ?? "section.constraint-basis")),
    ...judgment.tradeoffBasis.map((id) => trace("tradeoff", id, sectionByType.get("tradeoff-basis") ?? "section.tradeoff-basis")),
    ...judgment.riskOpportunityBasis.map((id) => trace("risk-opportunity", id, sectionByType.get("risk-opportunity-basis") ?? "section.risk-opportunity-basis")),
    ...alternativeIds.map((id) => trace("alternative", id, sectionByType.get("alternative-analysis") ?? "section.alternative-analysis")),
  ].sort((left, right) => `${left.sourceType}:${left.sourceId}`.localeCompare(`${right.sourceType}:${right.sourceId}`)));
  const referencedAssessments = Object.freeze([...new Set([
    ...judgment.evidenceBasis,
    ...judgment.constraintBasis,
    ...judgment.tradeoffBasis,
    ...judgment.riskOpportunityBasis,
  ])].sort());

  return Object.freeze({
    explanationId: `explanation.${judgment.judgmentId}`,
    judgmentId: judgment.judgmentId,
    explanationType: "structured-judgment-explanation",
    sections,
    traceabilityMap,
    referencedObjects: alternativeIds,
    referencedAssessments,
    metadata: Object.freeze({
      source: "APP-JUDGE-8",
      judgmentPosture: judgment.judgmentPosture,
      judgmentReadiness: judgment.judgmentReadiness,
      metadataOnly: true,
    }),
    deterministic: true,
    metadataOnly: true,
  });
}
