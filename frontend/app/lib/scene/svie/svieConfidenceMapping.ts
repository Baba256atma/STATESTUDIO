/**
 * SVIE:3:4 — Map advisory recommendation confidence to visual tiers (read-only).
 */

import type { SvieAdvisoryFindingInput, SvieAdvisoryVisualLink } from "./svieAdvisoryLinkFoundationContract.ts";
import type {
  SvieConfidenceMappedRecommendation,
  SvieConfidenceTier,
} from "./svieConfidenceVisualizationContract.ts";

function normalizeConfidence(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = value <= 1 ? value : value / 100;
    return Math.round(Math.min(1, Math.max(0, normalized)) * 1000) / 1000;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return normalizeConfidence(parsed, fallback);
  }
  return fallback;
}

export function mapRecommendationConfidence(confidence: number): SvieConfidenceTier {
  const normalized = normalizeConfidence(confidence);
  if (normalized >= 0.9) return "executive_high";
  if (normalized >= 0.7) return "high";
  if (normalized >= 0.5) return "moderate";
  return "low";
}

export function mapRecommendationConfidenceEntry(input: {
  link: SvieAdvisoryVisualLink;
  finding?: SvieAdvisoryFindingInput | null;
}): SvieConfidenceMappedRecommendation {
  const confidence = normalizeConfidence(input.finding?.confidence, input.link.confidence);
  const tier = mapRecommendationConfidence(confidence);
  const label =
    typeof input.finding?.title === "string" && input.finding.title.trim().length > 0
      ? input.finding.title.trim()
      : input.link.recommendationId;

  return Object.freeze({
    recommendationId: input.link.recommendationId,
    confidence,
    tier,
    label,
  });
}

export function mapRecommendationConfidences(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
}): readonly SvieConfidenceMappedRecommendation[] {
  const findingById = new Map(
    (input.findings ?? [])
      .map((finding) => {
        const id = typeof finding.recommendationId === "string" ? finding.recommendationId.trim() : "";
        return id ? ([id, finding] as const) : null;
      })
      .filter((entry): entry is [string, SvieAdvisoryFindingInput] => Boolean(entry))
  );

  return Object.freeze(
    input.links
      .map((link) =>
        mapRecommendationConfidenceEntry({
          link,
          finding: findingById.get(link.recommendationId) ?? null,
        })
      )
      .sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );
}

export function buildSvieConfidenceVisualizationSignature(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
}): string {
  const mapped = mapRecommendationConfidences(input);
  return `svie:confidence:${JSON.stringify(mapped)}`;
}
