import {
  buildExecutiveBriefingFocus,
  buildExecutiveBriefingHeadline,
} from "./compressionNarratives.ts";
import type {
  ExecutiveBriefing,
  StrategicCompressedInsight,
} from "./strategicCompressionTypes.ts";

export function deriveExecutiveBriefing(params: {
  insights: StrategicCompressedInsight[];
}): ExecutiveBriefing {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const top = insights[0] ?? null;
  return {
    headline: buildExecutiveBriefingHeadline({
      topTitle: top?.title ?? "No dominant executive pressure is visible",
      priority: top?.priority ?? "low",
    }),
    strategicFocus: buildExecutiveBriefingFocus({
      focus: top?.executiveFocus ?? "current operating state",
      confidence: top?.confidenceLevel ?? "low",
    }),
    confidence: top?.confidenceLevel ?? "low",
    priority: top?.priority ?? "low",
    supportingInsightIds: top?.supportingInsightIds ?? [],
  };
}
