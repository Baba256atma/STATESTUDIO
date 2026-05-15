import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import { clusterNarrativeSignals } from "./clusterNarrativeSignals.ts";
import { deriveStrategicMeaning } from "./deriveStrategicMeaning.ts";
import {
  buildExecutiveNarrativeHeadline,
  buildExecutiveNarrativeSummary,
  toneRank,
} from "./executiveNarrativeLanguage.ts";
import type {
  ExecutiveNarrative,
  ExecutiveNarrativeOverlayState,
} from "./narrativeSynthesisTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_EXECUTIVE_NARRATIVES = 3;

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function logNarratives(narratives: ExecutiveNarrative[], debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  const top = narratives[0] ?? null;
  console.debug("[Nexora][ExecutiveNarrative]", {
    headline: top?.headline ?? null,
    tone: top?.tone ?? "informational",
    confidence: top?.confidence ?? null,
    clusteredSignals: narratives.reduce((sum, narrative) => sum + narrative.relatedInsightIds.length, 0),
    executiveFocus: top?.executiveFocus ?? null,
  });
}

export function deriveExecutiveNarratives(params: {
  executiveInsights?: ExecutiveInsight[];
  compressedInsights?: StrategicCompressedInsight[];
  timelineIntelligence?: TimelineIntelligence[];
  recommendations?: DecisionRecommendation[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  crossDomainInsights?: CrossDomainInsight[];
  alerts?: ExecutiveAlert[];
  confidenceSignals?: DecisionConfidence[];
  debug?: boolean;
}): ExecutiveNarrative[] {
  const clusters = clusterNarrativeSignals(params);
  const narratives = clusters.map((cluster): ExecutiveNarrative => ({
    id: `executive_narrative_${cluster.id}`,
    headline: buildExecutiveNarrativeHeadline({
      focus: cluster.focus,
      tone: cluster.tone,
    }),
    summary: buildExecutiveNarrativeSummary({
      focus: cluster.focus,
      tone: cluster.tone,
      objectCount: cluster.relatedObjectIds.length,
      signalCount: cluster.signalIds.length,
    }),
    strategicMeaning: deriveStrategicMeaning({
      focus: cluster.focus,
      tone: cluster.tone,
      relatedObjectIds: cluster.relatedObjectIds,
      domainId: cluster.domainId,
    }),
    relatedInsightIds: cluster.signalIds,
    ...(cluster.scenarioIds.length ? { relatedScenarioIds: cluster.scenarioIds } : {}),
    relatedObjectIds: cluster.relatedObjectIds,
    tone: cluster.tone,
    ...(typeof cluster.confidence === "number" ? { confidence: cluster.confidence } : {}),
    executiveFocus: cluster.focus,
    ...(cluster.domainId ? { domainId: cluster.domainId } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  })).sort((left, right) => {
    if (toneRank(right.tone) !== toneRank(left.tone)) return toneRank(right.tone) - toneRank(left.tone);
    if (right.relatedInsightIds.length !== left.relatedInsightIds.length) return right.relatedInsightIds.length - left.relatedInsightIds.length;
    if ((right.confidence ?? 0) !== (left.confidence ?? 0)) return (right.confidence ?? 0) - (left.confidence ?? 0);
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_EXECUTIVE_NARRATIVES);

  logNarratives(narratives, params.debug);
  return narratives;
}

export function buildExecutiveNarrativeOverlayState(params: {
  narratives: ExecutiveNarrative[];
}): ExecutiveNarrativeOverlayState {
  const narratives = Array.isArray(params.narratives) ? params.narratives : [];
  const top = narratives[0] ?? null;
  return {
    ...(top ? { topNarrativeId: top.id } : {}),
    headline: top?.headline ?? "No executive narrative is available yet.",
    tone: top?.tone ?? "informational",
    executiveFocus: top?.executiveFocus ?? "Maintain the current strategic operating view.",
    relatedObjectIds: unique(narratives.flatMap((narrative) => narrative.relatedObjectIds)),
  };
}
