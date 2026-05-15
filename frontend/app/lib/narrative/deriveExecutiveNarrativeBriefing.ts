import type {
  ExecutiveNarrative,
  ExecutiveNarrativeBriefing,
} from "./narrativeSynthesisTypes.ts";

function averageConfidence(narratives: ExecutiveNarrative[]): number {
  const values = narratives
    .map((narrative) => narrative.confidence)
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

export function deriveExecutiveNarrativeBriefing(params: {
  narratives: ExecutiveNarrative[];
}): ExecutiveNarrativeBriefing {
  const narratives = Array.isArray(params.narratives) ? params.narratives : [];
  const top = narratives[0] ?? null;
  return {
    headline: top?.headline ?? "No executive narrative is available yet.",
    strategicMeaning: top?.strategicMeaning ?? "Nexora is waiting for enough intelligence to form a coherent strategic story.",
    executiveFocus: top?.executiveFocus ?? "Maintain current visibility.",
    tone: top?.tone ?? "informational",
    confidence: averageConfidence(narratives),
    relatedNarrativeIds: narratives.map((narrative) => narrative.id),
  };
}
