import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { TimelineIntelligence, TimelineMemorySnapshot } from "../timeline/timelineIntelligenceTypes.ts";
import { buildStrategicMemoryTitle, describeStrategicMemoryRecord } from "./strategicMemoryNarratives.ts";
import { scoreStrategicRecurrence } from "./scoreStrategicRecurrence.ts";
import type {
  StrategicMemoryCategory,
  StrategicMemoryOverlayState,
  StrategicMemoryRecord,
  StrategicMemorySeverity,
} from "./strategicMemoryTypes.ts";

const DETERMINISTIC_OBSERVED_AT = 0;
const MAX_MEMORY_RECORDS = 8;

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

function severityFromInsight(value: ExecutiveInsight["severity"]): StrategicMemorySeverity {
  return value;
}

function severityFromRecommendation(value: DecisionRecommendation["priority"]): StrategicMemorySeverity {
  return value;
}

function categoryFromInsight(insight: ExecutiveInsight): StrategicMemoryCategory {
  if (insight.category === "fragility" || insight.category === "stability") return "fragility";
  if (insight.category === "dependency") return "dependency";
  if (insight.sourceType === "propagation") return "propagation";
  if (insight.sourceType === "scenario") return "scenario";
  return "monitoring";
}

function categoryFromRecommendation(recommendation: DecisionRecommendation): StrategicMemoryCategory {
  if (recommendation.category === "monitor" || recommendation.category === "investigate") return "monitoring";
  if (recommendation.category === "diversify" || recommendation.category === "rebalance") return "dependency";
  if (recommendation.category === "reduce_risk" || recommendation.category === "protect") return "recommendation";
  return "recommendation";
}

function record(params: {
  category: StrategicMemoryCategory;
  focus: string;
  summary?: string;
  relatedObjectIds?: string[];
  severity?: StrategicMemorySeverity;
  confidence?: number;
  recurrenceCount?: number;
  observedAt: number;
  domainId?: string;
  relatedScenarioIds?: string[];
}): StrategicMemoryRecord {
  const title = buildStrategicMemoryTitle({ category: params.category, focus: params.focus });
  const next: StrategicMemoryRecord = {
    id: `strategic_memory_${normalizeIdPart(params.domainId ?? "general")}_${normalizeIdPart(params.category)}_${normalizeIdPart(params.focus)}`,
    category: params.category,
    title,
    summary: params.summary || title,
    relatedObjectIds: unique(params.relatedObjectIds ?? []),
    ...(params.severity ? { severity: params.severity } : {}),
    ...(typeof params.confidence === "number" ? { confidence: Math.min(1, Math.max(0, params.confidence)) } : {}),
    recurrenceCount: Math.max(1, Math.round(Number(params.recurrenceCount ?? 1))),
    lastObservedAt: params.observedAt,
    firstObservedAt: params.observedAt,
    ...(params.domainId ? { domainId: params.domainId } : {}),
    ...(params.relatedScenarioIds?.length ? { relatedScenarioIds: unique(params.relatedScenarioIds) } : {}),
  };
  return {
    ...next,
    summary: params.summary || describeStrategicMemoryRecord(next),
  };
}

function recordsFromPropagation(params: {
  propagationHints: DomainPropagationHint[];
  observedAt: number;
  domainId?: string;
}): StrategicMemoryRecord[] {
  const counts = new Map<string, { count: number; ids: Set<string>; strength: number }>();
  for (const hint of params.propagationHints) {
    const key = hint.sourceObjectId;
    const current = counts.get(key) ?? { count: 0, ids: new Set<string>(), strength: 0 };
    current.count += 1;
    current.ids.add(hint.sourceObjectId);
    current.ids.add(hint.targetObjectId);
    current.strength += hint.propagationStrength;
    counts.set(key, current);
  }
  return Array.from(counts.entries())
    .filter(([, value]) => value.count >= 2 || value.strength >= 1.2)
    .map(([key, value]) => {
      const confidence = Math.min(0.95, 0.42 + value.strength / 4);
      return record({
        category: "propagation",
        focus: `${key} propagation`,
        summary: `Propagation exposure continues to reappear from ${key}.`,
        relatedObjectIds: Array.from(value.ids),
        severity: value.strength >= 1.6 ? "high" : "medium",
        confidence,
        recurrenceCount: value.count,
        observedAt: params.observedAt,
        domainId: params.domainId,
      });
    });
}

export function deriveStrategicMemory(params: {
  domainId?: string;
  existingRecords?: StrategicMemoryRecord[];
  insights?: ExecutiveInsight[];
  recommendations?: DecisionRecommendation[];
  timelineIntelligence?: TimelineIntelligence[];
  scenarios?: DomainScenario[];
  propagationHints?: DomainPropagationHint[];
  now?: number;
  debug?: boolean;
}): StrategicMemoryRecord[] {
  const observedAt = typeof params.now === "number" ? params.now : DETERMINISTIC_OBSERVED_AT;
  const existing = Array.isArray(params.existingRecords) ? params.existingRecords : [];
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations : [];
  const timelineIntelligence = Array.isArray(params.timelineIntelligence) ? params.timelineIntelligence : [];
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  const propagationHints = Array.isArray(params.propagationHints) ? params.propagationHints : [];
  const records: StrategicMemoryRecord[] = [];

  for (const insight of insights.slice(0, 4)) {
    records.push(record({
      category: categoryFromInsight(insight),
      focus: insight.recommendedFocus ?? insight.title,
      summary: insight.summary,
      relatedObjectIds: insight.affectedObjectIds,
      severity: severityFromInsight(insight.severity),
      confidence: insight.confidence,
      recurrenceCount: 1,
      observedAt,
      domainId: insight.domainId ?? params.domainId,
      relatedScenarioIds: insight.sourceType === "scenario" ? [insight.id.replace(/^exec_insight_scenario_/, "")] : [],
    }));
  }

  for (const recommendation of recommendations.slice(0, 4)) {
    records.push(record({
      category: categoryFromRecommendation(recommendation),
      focus: recommendation.recommendedFocus ?? recommendation.title,
      summary: recommendation.rationale || recommendation.summary,
      relatedObjectIds: recommendation.affectedObjectIds,
      severity: severityFromRecommendation(recommendation.priority),
      confidence: recommendation.confidence,
      recurrenceCount: 1,
      observedAt,
      domainId: recommendation.domainId ?? params.domainId,
      relatedScenarioIds: recommendation.relatedScenarioIds,
    }));
  }

  for (const item of timelineIntelligence.slice(0, 3)) {
    records.push(record({
      category: "timeline",
      focus: item.recommendedAttention ?? item.title,
      summary: item.summary,
      relatedObjectIds: item.relatedObjectIds,
      severity: item.trend === "critical" ? "critical" : item.trend === "degrading" ? "high" : item.trend === "volatile" ? "medium" : "low",
      confidence: item.confidence,
      recurrenceCount: item.trend === "degrading" || item.trend === "critical" ? 2 : 1,
      observedAt,
      domainId: item.domainId ?? params.domainId,
    }));
  }

  for (const scenario of scenarios.slice(0, 3)) {
    records.push(record({
      category: "scenario",
      focus: scenario.recommendedFocus ?? scenario.title,
      summary: scenario.executiveSummary,
      relatedObjectIds: unique([...(scenario.affectedObjectIds ?? []), ...scenario.relatedObjectIds]),
      severity: scenario.severity,
      confidence: scenario.confidence,
      recurrenceCount: 1,
      observedAt,
      domainId: scenario.domainId ?? params.domainId,
      relatedScenarioIds: [scenario.id],
    }));
  }

  records.push(...recordsFromPropagation({ propagationHints, observedAt, domainId: params.domainId }));

  const merged = mergeStrategicRecords(existing, records).slice(0, MAX_MEMORY_RECORDS);
  if (params.debug) {
    for (const item of merged.slice(0, 3)) logStrategicMemory(item);
  }
  return merged;
}

export function mergeStrategicRecords(existing: StrategicMemoryRecord[], incoming: StrategicMemoryRecord[]): StrategicMemoryRecord[] {
  const byId = new Map<string, StrategicMemoryRecord>();
  for (const item of existing) byId.set(item.id, { ...item, relatedObjectIds: item.relatedObjectIds.slice(), relatedScenarioIds: item.relatedScenarioIds?.slice() });
  for (const item of incoming) {
    const current = byId.get(item.id);
    if (!current) {
      byId.set(item.id, { ...item, relatedObjectIds: item.relatedObjectIds.slice(), relatedScenarioIds: item.relatedScenarioIds?.slice() });
      continue;
    }
    byId.set(item.id, {
      ...current,
      summary: item.summary || current.summary,
      severity: item.severity ?? current.severity,
      confidence: Math.max(current.confidence ?? 0, item.confidence ?? 0),
      recurrenceCount: Math.max(1, (current.recurrenceCount ?? 1) + (item.recurrenceCount ?? 1)),
      firstObservedAt: Math.min(current.firstObservedAt, item.firstObservedAt),
      lastObservedAt: Math.max(current.lastObservedAt, item.lastObservedAt),
      relatedObjectIds: unique([...current.relatedObjectIds, ...item.relatedObjectIds]),
      relatedScenarioIds: unique([...(current.relatedScenarioIds ?? []), ...(item.relatedScenarioIds ?? [])]),
    });
  }
  return Array.from(byId.values()).sort((left, right) => {
    const leftScore = scoreStrategicRecurrence(left).recurrenceScore;
    const rightScore = scoreStrategicRecurrence(right).recurrenceScore;
    if (rightScore !== leftScore) return rightScore - leftScore;
    return left.id.localeCompare(right.id);
  });
}

export function buildStrategicMemoryOverlayState(params: {
  records: StrategicMemoryRecord[];
}): StrategicMemoryOverlayState {
  const records = Array.isArray(params.records) ? params.records : [];
  const top = records[0] ?? null;
  const score = top ? scoreStrategicRecurrence(top) : null;
  return {
    ...(top ? { topMemoryId: top.id } : {}),
    memoryState: score?.memoryState ?? "monitoring",
    executiveSummary: top ? describeStrategicMemoryRecord(top) : "No strategic memory pattern is available yet.",
    relatedObjectIds: unique(records.flatMap((record) => record.relatedObjectIds)),
    recurringCategories: unique(records.map((record) => record.category)) as StrategicMemoryCategory[],
  };
}

export function buildTimelineMemoryFromStrategicMemory(records: StrategicMemoryRecord[]): TimelineMemorySnapshot {
  const top = records[0] ?? null;
  if (!top) return {};
  const score = scoreStrategicRecurrence(top);
  return {
    previousTrend: score.memoryState === "persistent" ? "degrading" : score.memoryState === "stabilizing" ? "improving" : "stable",
    previousSeverity: top.severity,
    previousRecommendationPriority: top.severity,
    previousPropagationIntensity: score.recurrenceScore,
  };
}

function logStrategicMemory(record: StrategicMemoryRecord): void {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  const score = scoreStrategicRecurrence(record);
  console.debug("[Nexora][StrategicMemory]", {
    category: record.category,
    recurrenceCount: record.recurrenceCount ?? 1,
    memoryState: score.memoryState,
    relatedObjects: record.relatedObjectIds,
    persistenceDuration: score.persistenceDuration,
  });
}
