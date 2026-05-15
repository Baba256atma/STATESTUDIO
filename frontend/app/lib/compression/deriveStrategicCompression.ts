import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import { clusterStrategicInsights } from "./clusterStrategicInsights.ts";
import {
  buildCompressedInsightSummary,
  buildCompressedInsightTitle,
} from "./compressionNarratives.ts";
import type {
  StrategicCompressedInsight,
  StrategicCompressionOverlayState,
  StrategicCompressionPriority,
} from "./strategicCompressionTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_COMPRESSED_INSIGHTS = 3;

function rank(priority: StrategicCompressionPriority): number {
  if (priority === "critical") return 4;
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

function logCompression(insights: StrategicCompressedInsight[], debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][StrategicCompression]", {
    compressedInsightCount: insights.length,
    clusteredSignals: insights.reduce((sum, insight) => sum + insight.supportingInsightIds.length, 0),
    priority: insights[0]?.priority ?? "low",
    executiveFocus: insights[0]?.executiveFocus ?? null,
    compressionStability: insights.map((insight) => insight.id).join("|"),
  });
}

export function deriveStrategicCompression(params: {
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  recommendations?: DecisionRecommendation[];
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  confidenceSignals?: DecisionConfidence[];
  debug?: boolean;
}): StrategicCompressedInsight[] {
  const clusters = clusterStrategicInsights(params);
  const compressed = clusters.map((cluster): StrategicCompressedInsight => ({
    id: `compressed_${cluster.id}`,
    title: buildCompressedInsightTitle({
      focus: cluster.focus,
      priority: cluster.priority,
    }),
    summary: buildCompressedInsightSummary({
      focus: cluster.focus,
      objectCount: cluster.relatedObjectIds.length,
      signalCount: cluster.signalIds.length,
      priority: cluster.priority,
    }),
    supportingInsightIds: cluster.signalIds,
    ...(cluster.scenarioIds.length ? { supportingScenarioIds: cluster.scenarioIds } : {}),
    relatedObjectIds: cluster.relatedObjectIds,
    priority: cluster.priority,
    ...(cluster.confidenceLevel ? { confidenceLevel: cluster.confidenceLevel } : {}),
    executiveFocus: cluster.focus,
    ...(cluster.domainId ? { domainId: cluster.domainId } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  })).sort((left, right) => {
    if (rank(right.priority) !== rank(left.priority)) return rank(right.priority) - rank(left.priority);
    if (right.supportingInsightIds.length !== left.supportingInsightIds.length) return right.supportingInsightIds.length - left.supportingInsightIds.length;
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_COMPRESSED_INSIGHTS);

  logCompression(compressed, params.debug);
  return compressed;
}

export function buildStrategicCompressionOverlayState(params: {
  insights: StrategicCompressedInsight[];
}): StrategicCompressionOverlayState {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const top = insights[0] ?? null;
  return {
    ...(top ? { topInsightId: top.id } : {}),
    headline: top?.title ?? "No compressed executive insight is available yet.",
    strategicFocus: top?.executiveFocus ?? "Maintain current executive visibility.",
    priority: top?.priority ?? "low",
    confidenceLevel: top?.confidenceLevel ?? "low",
    relatedObjectIds: Array.from(new Set(insights.flatMap((insight) => insight.relatedObjectIds))),
  };
}
