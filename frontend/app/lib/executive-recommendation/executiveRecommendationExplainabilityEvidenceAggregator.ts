/**
 * APP-12:4 — Executive Recommendation Explainability evidence aggregator.
 */

import type {
  ExplanationEvidence,
  ExplanationSection,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { RecommendationEvaluation } from "./executiveRecommendationEvaluationEngineTypes.ts";

export function aggregateExplanationEvidence(
  evaluation: RecommendationEvaluation,
  sections: readonly ExplanationSection[]
): readonly ExplanationEvidence[] {
  const platforms = evaluation.provenance.originatingPlatforms;
  const defaultPlatform = platforms[0] ?? "unknown-platform";

  const evidence: ExplanationEvidence[] = sections.map((section) =>
    Object.freeze({
      evidenceId: `explanation-evidence-${section.sectionKey}-${evaluation.recommendationId}`,
      sectionKey: section.sectionKey,
      signal: `section_${section.sectionKey}`,
      rationale: section.content.slice(0, 256),
      sourcePlatform: defaultPlatform,
      readOnly: true as const,
    })
  );

  for (const platform of platforms) {
    evidence.push(
      Object.freeze({
        evidenceId: `explanation-evidence-platform-${platform}-${evaluation.recommendationId}`,
        sectionKey: "provenance_summary" as const,
        signal: "source_platform",
        rationale: `Platform ${platform} contributed to this recommendation explanation.`,
        sourcePlatform: platform,
        readOnly: true as const,
      })
    );
  }

  for (const entry of evaluation.supportingEvidence.slice(0, 3)) {
    evidence.push(
      Object.freeze({
        evidenceId: `explanation-evidence-eval-${entry.evidenceId}`,
        sectionKey: "supporting_evidence" as const,
        signal: entry.signal,
        rationale: entry.rationale,
        sourcePlatform: defaultPlatform,
        readOnly: true as const,
      })
    );
  }

  return Object.freeze(evidence);
}

export const ExecutiveRecommendationExplainabilityEvidenceAggregator = Object.freeze({
  aggregateExplanationEvidence,
});
