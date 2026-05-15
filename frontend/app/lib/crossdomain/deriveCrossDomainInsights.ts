import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import { CROSS_DOMAIN_INFLUENCE_RULES } from "./crossDomainRules.ts";
import {
  buildCrossDomainExecutiveImpact,
  buildCrossDomainSummary,
  buildCrossDomainTitle,
} from "./crossDomainNarratives.ts";
import {
  crossDomainSeverityFromScore,
  scoreCrossDomainImpact,
} from "./scoreCrossDomainImpact.ts";
import type {
  CrossDomainInsight,
  CrossDomainOverlayState,
} from "./crossDomainTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_CROSS_DOMAIN_INSIGHTS = 5;

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

function sourceDomains(params: {
  domainId?: string;
  executiveInsights: ExecutiveInsight[];
  monitoringSignals: ExecutiveMonitoringSignal[];
  compressedInsights: StrategicCompressedInsight[];
  alerts: ExecutiveAlert[];
  strategicMemory: StrategicMemoryRecord[];
}): string[] {
  return unique([
    params.domainId,
    ...params.executiveInsights.map((item) => item.domainId),
    ...params.monitoringSignals.map((item) => item.domainId),
    ...params.compressedInsights.map((item) => item.domainId),
    ...params.alerts.map((item) => item.domainId),
    ...params.strategicMemory.map((item) => item.domainId),
  ]);
}

function focus(params: {
  compressedInsights: StrategicCompressedInsight[];
  monitoringSignals: ExecutiveMonitoringSignal[];
  alerts: ExecutiveAlert[];
  executiveInsights: ExecutiveInsight[];
}): string {
  return params.compressedInsights[0]?.executiveFocus ??
    params.alerts[0]?.recommendedAttention ??
    params.monitoringSignals[0]?.recommendedAttention ??
    params.executiveInsights[0]?.recommendedFocus ??
    params.executiveInsights[0]?.title ??
    "";
}

function logCrossDomain(insight: CrossDomainInsight, systemicImpactScore: number, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][CrossDomainInsight]", {
    sourceDomain: insight.sourceDomainId,
    targetDomain: insight.targetDomainId,
    relationshipType: insight.relationshipType,
    systemicImpact: systemicImpactScore,
    relatedObjects: insight.relatedObjectIds,
  });
}

export function deriveCrossDomainInsights(params: {
  domainId?: string;
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  compressedInsights?: StrategicCompressedInsight[];
  alerts?: ExecutiveAlert[];
  strategicMemory?: StrategicMemoryRecord[];
  debug?: boolean;
}): CrossDomainInsight[] {
  const executiveInsights = Array.isArray(params.executiveInsights) ? params.executiveInsights.slice() : [];
  const monitoringSignals = Array.isArray(params.monitoringSignals) ? params.monitoringSignals.slice() : [];
  const compressedInsights = Array.isArray(params.compressedInsights) ? params.compressedInsights.slice() : [];
  const alerts = Array.isArray(params.alerts) ? params.alerts.slice() : [];
  const strategicMemory = Array.isArray(params.strategicMemory) ? params.strategicMemory.slice() : [];
  const domains = sourceDomains({ domainId: params.domainId, executiveInsights, monitoringSignals, compressedInsights, alerts, strategicMemory });

  if (!domains.length || (!executiveInsights.length && !monitoringSignals.length && !compressedInsights.length && !alerts.length && !strategicMemory.length)) {
    return [];
  }

  const relatedObjectIds = unique([
    ...executiveInsights.flatMap((item) => item.affectedObjectIds),
    ...monitoringSignals.flatMap((item) => item.relatedObjectIds),
    ...compressedInsights.flatMap((item) => item.relatedObjectIds),
    ...alerts.flatMap((item) => item.relatedObjectIds),
    ...strategicMemory.flatMap((item) => item.relatedObjectIds),
  ]);
  const focusText = focus({ compressedInsights, monitoringSignals, alerts, executiveInsights });

  const insights: CrossDomainInsight[] = [];
  for (const sourceDomainId of domains) {
    const rules = CROSS_DOMAIN_INFLUENCE_RULES.filter((rule) => rule.sourceDomainId === sourceDomainId);
    for (const rule of rules) {
      const score = scoreCrossDomainImpact({
        relatedObjectCount: relatedObjectIds.length,
        executiveInsights,
        monitoringSignals,
        compressedInsights,
        alerts,
        ruleConfidence: rule.baseConfidence,
      });
      const severity = crossDomainSeverityFromScore(score);
      const insight: CrossDomainInsight = {
        id: `cross_domain_${normalizeIdPart(rule.sourceDomainId)}_${normalizeIdPart(rule.targetDomainId)}_${normalizeIdPart(rule.relationshipType)}`,
        sourceDomainId: rule.sourceDomainId,
        targetDomainId: rule.targetDomainId,
        relationshipType: rule.relationshipType,
        title: buildCrossDomainTitle({
          sourceDomainId: rule.sourceDomainId,
          targetDomainId: rule.targetDomainId,
          relationshipType: rule.relationshipType,
        }),
        summary: buildCrossDomainSummary({
          sourceDomainId: rule.sourceDomainId,
          targetDomainId: rule.targetDomainId,
          relationshipType: rule.relationshipType,
          focus: focusText,
        }),
        relatedObjectIds,
        severity,
        confidence: Math.round(Math.min(0.96, Math.max(0.2, rule.baseConfidence * 0.45 + score * 0.55)) * 100) / 100,
        executiveImpact: buildCrossDomainExecutiveImpact({
          severity,
          sourceDomainId: rule.sourceDomainId,
          targetDomainId: rule.targetDomainId,
        }),
        createdAt: DETERMINISTIC_CREATED_AT,
      };
      insights.push(insight);
      logCrossDomain(insight, score, params.debug);
    }
  }

  return insights.sort((left, right) => {
    const severityRank = { critical: 4, high: 3, medium: 2, low: 1 };
    if (severityRank[right.severity] !== severityRank[left.severity]) return severityRank[right.severity] - severityRank[left.severity];
    if (right.confidence !== left.confidence) return right.confidence - left.confidence;
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_CROSS_DOMAIN_INSIGHTS);
}

export function buildCrossDomainOverlayState(params: {
  insights: CrossDomainInsight[];
}): CrossDomainOverlayState {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const top = insights[0] ?? null;
  return {
    ...(top ? { topInsightId: top.id } : {}),
    systemicImpactScore: top?.confidence ?? 0,
    relatedDomainIds: unique(insights.flatMap((insight) => [insight.sourceDomainId, insight.targetDomainId])),
    relatedObjectIds: unique(insights.flatMap((insight) => insight.relatedObjectIds)),
    executiveSummary: top?.summary ?? "No cross-domain executive pressure is visible yet.",
  };
}
