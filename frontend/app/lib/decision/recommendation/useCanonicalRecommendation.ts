import { buildCanonicalRecommendation } from "./buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "./recommendationTypes";

export function useCanonicalRecommendation(data: Record<string, unknown> | null | undefined): CanonicalRecommendation | null {
  return (data?.canonical_recommendation as CanonicalRecommendation | undefined) ?? buildCanonicalRecommendation(data ?? null);
}
