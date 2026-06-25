/**
 * INT-3 — Executive Summary Response Builder.
 * Transforms normalized intelligence into executive dashboard format — no calculations.
 */

import type { DashboardIntelligenceNormalizedPayload } from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import type { IntelligenceGatewayResult } from "../dashboardIntelligence/singleIntelligenceSourceContract.ts";
import {
  EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
  EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
  EXECUTIVE_SUMMARY_SECTION_TITLES,
  EXECUTIVE_SUMMARY_SECTIONS,
  type ExecutiveSummaryIntelligenceRequest,
  type ExecutiveSummaryIntelligenceResponse,
  type ExecutiveSummarySection,
  type ExecutiveSummarySectionId,
} from "./executiveSummaryIntelligenceContract.ts";

function timeStateHeadline(timeState: ExecutiveSummaryIntelligenceResponse["timeState"]): string {
  if (timeState === "past") return "Historical Executive Summary";
  if (timeState === "future") return "Hypothetical Executive Summary";
  return "Executive Summary";
}

function metricHighlights(
  normalized: DashboardIntelligenceNormalizedPayload,
  filter: (metricId: string) => boolean
): readonly string[] {
  return Object.freeze(
    normalized.metrics
      .filter((entry) => filter(entry.metricId))
      .map((entry) => `${entry.label}: ${String(entry.value ?? "n/a")}${entry.unit ? ` ${entry.unit}` : ""}`)
  );
}

function buildSection(
  sectionId: ExecutiveSummarySectionId,
  content: string,
  highlights: readonly string[] = Object.freeze([])
): ExecutiveSummarySection {
  return Object.freeze({
    sectionId,
    title: EXECUTIVE_SUMMARY_SECTION_TITLES[sectionId],
    content,
    highlights: Object.freeze([...highlights]),
  });
}

function buildSections(input: {
  normalized: DashboardIntelligenceNormalizedPayload | null;
  timeState: ExecutiveSummaryIntelligenceResponse["timeState"];
  lastUpdated: string;
  confidence: number | null;
  warnings: readonly string[];
  recommendations: readonly string[];
  summary: string;
}): readonly ExecutiveSummarySection[] {
  const normalized = input.normalized;
  const kpiHighlights = normalized ? metricHighlights(normalized, (id) => id.startsWith("kpi")) : Object.freeze([]);
  const riskHighlights = normalized ? metricHighlights(normalized, (id) => id.startsWith("risk")) : Object.freeze([]);
  const healthHighlights = normalized
    ? metricHighlights(normalized, (id) => id.includes("health") || id.includes("score"))
    : Object.freeze([]);

  const opportunityHighlights = Object.freeze(
    input.recommendations.filter((entry) => /scenario|opportunity|review/i.test(entry))
  );

  return Object.freeze(
    EXECUTIVE_SUMMARY_SECTIONS.map((sectionId) => {
      switch (sectionId) {
        case "business_health":
          return buildSection(
            sectionId,
            normalized?.status === "ready"
              ? "Overall business condition derived from certified executive intelligence."
              : "Business health signals are not yet available.",
            healthHighlights
          );
        case "executive_overview":
          return buildSection(sectionId, input.summary, Object.freeze([]));
        case "key_kpis":
          return buildSection(
            sectionId,
            kpiHighlights.length > 0 ? "Key KPI signals from normalized executive intelligence." : "No KPI highlights available.",
            kpiHighlights
          );
        case "key_risks":
          return buildSection(
            sectionId,
            riskHighlights.length > 0 ? "Key risk signals from normalized executive intelligence." : "No risk highlights available.",
            riskHighlights
          );
        case "top_opportunities":
          return buildSection(
            sectionId,
            opportunityHighlights.length > 0
              ? "Top opportunities identified in normalized recommendations."
              : "No opportunity highlights available.",
            opportunityHighlights
          );
        case "critical_warnings":
          return buildSection(
            sectionId,
            input.warnings.length > 0 ? "Critical warnings from normalized intelligence." : "No critical warnings reported.",
            input.warnings
          );
        case "strategic_recommendations":
          return buildSection(
            sectionId,
            input.recommendations.length > 0
              ? "Strategic recommendations from normalized intelligence."
              : "No strategic recommendations available.",
            input.recommendations
          );
        case "confidence":
          return buildSection(
            sectionId,
            input.confidence == null
              ? "Confidence metadata reserved — normalized intelligence returned null confidence."
              : `Confidence score: ${input.confidence}.`,
            Object.freeze([])
          );
        case "last_updated":
          return buildSection(
            sectionId,
            `Last updated at ${input.lastUpdated} for ${input.timeState ?? "now"} time context.`,
            Object.freeze([])
          );
        default:
          return buildSection(sectionId, "Reserved section.", Object.freeze([]));
      }
    })
  );
}

export function buildExecutiveSummaryIntelligenceResponse(input: {
  request: ExecutiveSummaryIntelligenceRequest;
  gateway: IntelligenceGatewayResult | null;
}): ExecutiveSummaryIntelligenceResponse {
  const generatedAt = new Date().toISOString();
  const timeState = input.request.executiveTimeContext?.timeState ?? null;

  if (!input.gateway || !("runtimeResponse" in input.gateway)) {
    const reason =
      input.gateway && "reason" in input.gateway ? input.gateway.reason : "gateway_unavailable";
    const message =
      input.gateway && "message" in input.gateway
        ? input.gateway.message
        : "Executive Summary could not reach the intelligence gateway.";
    return Object.freeze({
      contractVersion: EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
      summaryRequestId: input.request.summaryRequestId,
      success: false,
      headline: timeStateHeadline(timeState),
      status: "error",
      summary: "Executive intelligence is unavailable for this summary request.",
      confidence: null,
      warnings: Object.freeze([message]),
      recommendations: Object.freeze([]),
      highlights: Object.freeze([]),
      sections: buildSections({
        normalized: null,
        timeState,
        lastUpdated: generatedAt,
        confidence: null,
        warnings: Object.freeze([message]),
        recommendations: Object.freeze([]),
        summary: "Executive intelligence is unavailable for this summary request.",
      }),
      timeState,
      lastUpdated: generatedAt,
      normalized: null,
      reason,
      message,
      generatedAt,
      source: EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
    });
  }

  const runtimeResponse = input.gateway.runtimeResponse;
  const normalized = runtimeResponse.snapshot?.payload ?? null;
  const summary = normalized?.summary ?? "Executive intelligence returned without a summary.";
  const warnings = Object.freeze([...(normalized?.warnings ?? [])]);
  const recommendations = Object.freeze([...(normalized?.recommendations ?? [])]);
  const confidence = normalized?.confidence ?? null;
  const highlights = normalized
    ? metricHighlights(normalized, () => true).slice(0, 8)
    : Object.freeze([]);

  return Object.freeze({
    contractVersion: EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
    summaryRequestId: input.request.summaryRequestId,
    success: runtimeResponse.success,
    headline: timeStateHeadline(timeState),
    status: normalized?.status ?? "empty",
    summary,
    confidence,
    warnings,
    recommendations,
    highlights,
    sections: buildSections({
      normalized,
      timeState,
      lastUpdated: normalized?.timestamp ?? generatedAt,
      confidence,
      warnings,
      recommendations,
      summary,
    }),
    timeState,
    lastUpdated: normalized?.timestamp ?? generatedAt,
    normalized,
    reason: runtimeResponse.success ? "completed" : "runtime_error",
    message: runtimeResponse.error.message ?? "Executive Summary built from normalized intelligence.",
    generatedAt,
    source: EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
  });
}

export const ExecutiveSummaryResponseBuilder = Object.freeze({
  buildExecutiveSummaryIntelligenceResponse,
});
