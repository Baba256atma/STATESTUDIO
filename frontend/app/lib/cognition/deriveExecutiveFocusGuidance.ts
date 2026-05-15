import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ExecutiveNarrative } from "../narrative/narrativeSynthesisTypes.ts";

function normalize(value: unknown): string {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function deriveExecutiveFocusGuidance(params: {
  alerts?: ExecutiveAlert[];
  compressedInsights?: StrategicCompressedInsight[];
  recommendations?: DecisionRecommendation[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  narratives?: ExecutiveNarrative[];
  decisionGraph?: StrategicDecisionGraph | null;
}): string {
  const alertFocus = normalize((params.alerts ?? [])[0]?.recommendedAttention);
  if (alertFocus) return alertFocus;

  const compressedFocus = normalize((params.compressedInsights ?? [])[0]?.executiveFocus);
  if (compressedFocus) return compressedFocus;

  const recommendationFocus = normalize((params.recommendations ?? [])[0]?.recommendedFocus ?? (params.recommendations ?? [])[0]?.title);
  if (recommendationFocus) return recommendationFocus;

  const narrativeFocus = normalize((params.narratives ?? [])[0]?.executiveFocus);
  if (narrativeFocus) return narrativeFocus;

  const monitoringFocus = normalize((params.monitoringSignals ?? [])[0]?.recommendedAttention ?? (params.monitoringSignals ?? [])[0]?.title);
  if (monitoringFocus) return monitoringFocus;

  const graphHeadline = normalize(params.decisionGraph?.headline);
  if (graphHeadline) return graphHeadline;

  return "Maintain executive awareness of current strategic signals.";
}
