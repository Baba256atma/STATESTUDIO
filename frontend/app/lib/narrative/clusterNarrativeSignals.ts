import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import {
  normalizeExecutiveNarrativeText,
  strongerTone,
  toneFromSeverity,
  toneRank,
} from "./executiveNarrativeLanguage.ts";
import type {
  ExecutiveNarrativeTone,
  NarrativeSignalCluster,
  NarrativeSignalSource,
} from "./narrativeSynthesisTypes.ts";

type NarrativeSignal = {
  id: string;
  focus: string;
  relatedObjectIds: string[];
  scenarioIds?: string[];
  domainId?: string;
  confidence?: number;
  tone: ExecutiveNarrativeTone;
  sourceType: NarrativeSignalSource;
};

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

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

function clampConfidence(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
}

function averageConfidence(values: Array<number | undefined>): number | undefined {
  const usable = values.filter((value): value is number => typeof value === "number");
  if (!usable.length) return undefined;
  return Math.round((usable.reduce((sum, value) => sum + value, 0) / usable.length) * 100) / 100;
}

function toneFromTimeline(item: TimelineIntelligence): ExecutiveNarrativeTone {
  if (item.trend === "critical") return "urgent";
  if (item.trend === "degrading" || item.trend === "volatile") return "cautionary";
  if (item.trend === "improving") return "stabilizing";
  return "informational";
}

function toneFromMonitoring(signal: ExecutiveMonitoringSignal): ExecutiveNarrativeTone {
  if (signal.monitoringStatus === "critical") return "urgent";
  if (signal.monitoringStatus === "elevated" || signal.trend === "degrading" || signal.trend === "volatile") return "cautionary";
  if (signal.trend === "improving") return "stabilizing";
  if (signal.monitoringStatus === "watch") return "strategic";
  return "informational";
}

function toneFromRecommendation(recommendation: DecisionRecommendation): ExecutiveNarrativeTone {
  if (recommendation.priority === "critical") return "urgent";
  if (recommendation.priority === "high") return "cautionary";
  if (recommendation.priority === "medium") return "strategic";
  return "informational";
}

function toneFromAlert(alert: ExecutiveAlert): ExecutiveNarrativeTone {
  if (alert.level === "critical" || alert.level === "urgent") return "urgent";
  if (alert.level === "attention") return "cautionary";
  return "informational";
}

function toneFromCompressed(insight: StrategicCompressedInsight): ExecutiveNarrativeTone {
  if (insight.priority === "critical") return "urgent";
  if (insight.priority === "high") return "cautionary";
  if (insight.priority === "medium") return "strategic";
  return "informational";
}

function confidenceFromLevel(level: DecisionConfidence["confidenceLevel"] | undefined): number | undefined {
  if (level === "very_high") return 0.92;
  if (level === "high") return 0.78;
  if (level === "moderate") return 0.58;
  if (level === "low") return 0.32;
  return undefined;
}

function signalKey(signal: NarrativeSignal): string {
  const objectPart = signal.relatedObjectIds.slice(0, 2).sort().join("_");
  const focusPart = normalizeIdPart(signal.focus).split("_").slice(0, 3).join("_");
  return `${signal.domainId ?? "general"}|${objectPart || focusPart || "global"}`;
}

function collectSignals(params: {
  executiveInsights?: ExecutiveInsight[];
  compressedInsights?: StrategicCompressedInsight[];
  timelineIntelligence?: TimelineIntelligence[];
  recommendations?: DecisionRecommendation[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  crossDomainInsights?: CrossDomainInsight[];
  alerts?: ExecutiveAlert[];
  confidenceSignals?: DecisionConfidence[];
}): NarrativeSignal[] {
  const signals: NarrativeSignal[] = [];
  for (const insight of params.executiveInsights ?? []) {
    signals.push({
      id: insight.id,
      focus: insight.recommendedFocus ?? insight.title,
      relatedObjectIds: insight.affectedObjectIds,
      domainId: insight.domainId,
      confidence: clampConfidence(insight.confidence),
      tone: toneFromSeverity(insight.severity),
      sourceType: "executive_insight",
    });
  }
  for (const insight of params.compressedInsights ?? []) {
    signals.push({
      id: insight.id,
      focus: insight.executiveFocus ?? insight.title,
      relatedObjectIds: insight.relatedObjectIds,
      scenarioIds: insight.supportingScenarioIds,
      domainId: insight.domainId,
      confidence: confidenceFromLevel(insight.confidenceLevel),
      tone: toneFromCompressed(insight),
      sourceType: "compressed_insight",
    });
  }
  for (const item of params.timelineIntelligence ?? []) {
    signals.push({
      id: item.id,
      focus: item.recommendedAttention ?? item.title,
      relatedObjectIds: item.relatedObjectIds,
      domainId: item.domainId,
      confidence: clampConfidence(item.confidence),
      tone: toneFromTimeline(item),
      sourceType: "timeline",
    });
  }
  for (const recommendation of params.recommendations ?? []) {
    signals.push({
      id: recommendation.id,
      focus: recommendation.recommendedFocus ?? recommendation.title,
      relatedObjectIds: recommendation.affectedObjectIds,
      scenarioIds: recommendation.relatedScenarioIds,
      domainId: recommendation.domainId,
      confidence: clampConfidence(recommendation.confidence),
      tone: toneFromRecommendation(recommendation),
      sourceType: "recommendation",
    });
  }
  for (const signal of params.monitoringSignals ?? []) {
    signals.push({
      id: signal.id,
      focus: signal.recommendedAttention ?? signal.title,
      relatedObjectIds: signal.relatedObjectIds,
      domainId: signal.domainId,
      confidence: clampConfidence(signal.confidence),
      tone: toneFromMonitoring(signal),
      sourceType: "monitoring",
    });
  }
  for (const insight of params.crossDomainInsights ?? []) {
    signals.push({
      id: insight.id,
      focus: insight.executiveImpact ?? insight.title,
      relatedObjectIds: insight.relatedObjectIds,
      domainId: insight.sourceDomainId,
      confidence: clampConfidence(insight.confidence),
      tone: toneFromSeverity(insight.severity),
      sourceType: "cross_domain",
    });
  }
  for (const alert of params.alerts ?? []) {
    signals.push({
      id: alert.id,
      focus: alert.recommendedAttention ?? alert.title,
      relatedObjectIds: alert.relatedObjectIds,
      scenarioIds: alert.relatedScenarioIds,
      domainId: alert.domainId,
      confidence: clampConfidence(alert.confidence),
      tone: toneFromAlert(alert),
      sourceType: "alert",
    });
  }
  for (const confidence of params.confidenceSignals ?? []) {
    signals.push({
      id: confidence.id,
      focus: confidence.relatedRecommendationId ?? "Decision confidence",
      relatedObjectIds: [],
      domainId: confidence.domainId,
      confidence: clampConfidence(confidence.confidenceScore),
      tone: confidence.confidenceLevel === "low" ? "cautionary" : "informational",
      sourceType: "confidence",
    });
  }
  return signals.filter((signal) => normalizeExecutiveNarrativeText(signal.focus));
}

export function clusterNarrativeSignals(params: {
  executiveInsights?: ExecutiveInsight[];
  compressedInsights?: StrategicCompressedInsight[];
  timelineIntelligence?: TimelineIntelligence[];
  recommendations?: DecisionRecommendation[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  crossDomainInsights?: CrossDomainInsight[];
  alerts?: ExecutiveAlert[];
  confidenceSignals?: DecisionConfidence[];
}): NarrativeSignalCluster[] {
  const clusters = new Map<string, NarrativeSignalCluster & { confidenceValues: Array<number | undefined> }>();

  for (const signal of collectSignals(params)) {
    const key = signalKey(signal);
    const current = clusters.get(key);
    const signalIds = unique([...(current?.signalIds ?? []), signal.id]);
    const scenarioIds = unique([...(current?.scenarioIds ?? []), ...(signal.scenarioIds ?? [])]);
    const relatedObjectIds = unique([...(current?.relatedObjectIds ?? []), ...signal.relatedObjectIds]);
    const sourceTypes = unique([...(current?.sourceTypes ?? []), signal.sourceType]) as NarrativeSignalSource[];
    const confidenceValues = [...(current?.confidenceValues ?? []), signal.confidence];
    clusters.set(key, {
      id: `narrative_cluster_${normalizeIdPart(key)}`,
      signalIds,
      scenarioIds,
      relatedObjectIds,
      focus: current?.focus ?? normalizeExecutiveNarrativeText(signal.focus),
      tone: strongerTone(current?.tone ?? "informational", signal.tone),
      confidence: averageConfidence(confidenceValues),
      ...(current?.domainId || signal.domainId ? { domainId: current?.domainId ?? signal.domainId } : {}),
      sourceTypes,
      confidenceValues,
    });
  }

  return Array.from(clusters.values())
    .sort((left, right) => {
      if (toneRank(right.tone) !== toneRank(left.tone)) return toneRank(right.tone) - toneRank(left.tone);
      if (right.signalIds.length !== left.signalIds.length) return right.signalIds.length - left.signalIds.length;
      return left.id.localeCompare(right.id);
    })
    .map(({ confidenceValues, ...cluster }) => cluster);
}
