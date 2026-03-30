import { buildCanonicalRecommendation } from "./buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "./recommendationTypes";

export function useCanonicalRecommendation(data: any): CanonicalRecommendation | null {
  return data?.canonical_recommendation ?? buildCanonicalRecommendation(data);
}
