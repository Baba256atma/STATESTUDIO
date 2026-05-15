import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import type {
  MonitoringLifecycle,
  MonitoringStatus,
  MonitoringTrend,
} from "./executiveMonitoringTypes.ts";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function priorityWeight(priority: DecisionRecommendation["priority"] | undefined): number {
  if (priority === "critical") return 1;
  if (priority === "high") return 0.78;
  if (priority === "medium") return 0.5;
  if (priority === "low") return 0.22;
  return 0;
}

function memoryWeight(record: StrategicMemoryRecord): number {
  const recurrence = Math.min(1, Math.max(0, (record.recurrenceCount ?? 1) / 4));
  const severity =
    record.severity === "critical" ? 1 :
    record.severity === "high" ? 0.78 :
    record.severity === "medium" ? 0.5 :
    record.severity === "low" ? 0.22 :
    0.35;
  return clamp01(recurrence * 0.55 + severity * 0.45);
}

function timelineWeight(item: TimelineIntelligence): number {
  const trend =
    item.trend === "critical" ? 1 :
    item.trend === "degrading" ? 0.82 :
    item.trend === "volatile" ? 0.68 :
    item.trend === "stable" ? 0.28 :
    0.12;
  return clamp01(trend * 0.48 + item.momentumScore * 0.52);
}

function fragilityWeight(score: DomainFragilityScore): number {
  return clamp01(score.score / 100);
}

export function monitoringStatusFromUrgency(urgencyScore: number): MonitoringStatus {
  if (urgencyScore >= 0.74) return "critical";
  if (urgencyScore >= 0.56) return "elevated";
  if (urgencyScore >= 0.28) return "watch";
  return "stable";
}

export function monitoringTrendFromInputs(params: {
  timeline?: TimelineIntelligence | null;
  memory?: StrategicMemoryRecord | null;
  recommendation?: DecisionRecommendation | null;
  fragility?: DomainFragilityScore | null;
}): MonitoringTrend {
  if (params.timeline?.trend === "critical" || params.timeline?.trend === "degrading") return "degrading";
  if (params.timeline?.trend === "volatile") return "volatile";
  if (params.timeline?.trend === "improving") return "improving";
  if ((params.memory?.recurrenceCount ?? 0) >= 3 && params.memory?.severity !== "low") return "degrading";
  if (params.recommendation?.priority === "critical" || params.fragility?.level === "critical") return "degrading";
  return "stable";
}

export function lifecycleFromMonitoring(params: {
  status: MonitoringStatus;
  trend?: MonitoringTrend;
  recurrenceCount?: number;
}): MonitoringLifecycle {
  if (params.status === "stable" && params.trend === "improving") return "recovering";
  if (params.status === "stable") return "resolved";
  if ((params.recurrenceCount ?? 0) >= 3) return "persistent";
  if (params.status === "critical" || params.status === "elevated") return "active";
  return "emerging";
}

export function scoreMonitoringUrgency(params: {
  timeline?: TimelineIntelligence | null;
  memory?: StrategicMemoryRecord | null;
  recommendation?: DecisionRecommendation | null;
  propagationHints?: DomainPropagationHint[];
  fragility?: DomainFragilityScore | null;
}): number {
  const hints = Array.isArray(params.propagationHints) ? params.propagationHints : [];
  const propagationWeight = hints.length
    ? clamp01((hints.reduce((sum, hint) => sum + hint.propagationStrength, 0) / hints.length) * 0.72 + Math.min(0.28, hints.length * 0.04))
    : 0;
  const values = [
    params.timeline ? timelineWeight(params.timeline) : 0,
    params.memory ? memoryWeight(params.memory) : 0,
    params.recommendation ? priorityWeight(params.recommendation.priority) : 0,
    params.fragility ? fragilityWeight(params.fragility) : 0,
    propagationWeight,
  ];
  const strongest = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(clamp01(strongest * 0.68 + average * 0.32) * 100) / 100;
}
