/**
 * INT-4 — Object Panel Response Builder.
 * Transforms normalized executive intelligence into Object Panel presentation — no calculations.
 */

import type { DashboardIntelligenceNormalizedPayload } from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import type { IntelligenceGatewayResult } from "../dashboardIntelligence/singleIntelligenceSourceContract.ts";
import {
  OBJECT_PANEL_INTELLIGENCE_SOURCE,
  OBJECT_PANEL_INTELLIGENCE_VERSION,
  OBJECT_PANEL_SECTION_TITLES,
  OBJECT_PANEL_SECTIONS,
  type ObjectPanelIntelligenceRequest,
  type ObjectPanelIntelligenceResponse,
  type ObjectPanelSection,
  type ObjectPanelSectionId,
} from "./objectPanelIntelligenceContract.ts";

function objectHeadline(
  objectId: string | null,
  timeState: ObjectPanelIntelligenceResponse["timeState"]
): string {
  const objectLabel = objectId ?? "Selected Object";
  if (timeState === "past") return `Historical View — ${objectLabel}`;
  if (timeState === "future") return `Hypothetical View — ${objectLabel}`;
  return `Executive Object View — ${objectLabel}`;
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
  sectionId: ObjectPanelSectionId,
  content: string,
  highlights: readonly string[] = Object.freeze([])
): ObjectPanelSection {
  return Object.freeze({
    sectionId,
    title: OBJECT_PANEL_SECTION_TITLES[sectionId],
    content,
    highlights: Object.freeze([...highlights]),
  });
}

function buildSections(input: {
  normalized: DashboardIntelligenceNormalizedPayload | null;
  selectedObjectId: string | null;
  timeState: ObjectPanelIntelligenceResponse["timeState"];
  lastUpdated: string;
  confidence: number | null;
  warnings: readonly string[];
  recommendations: readonly string[];
  summary: string;
  status: ObjectPanelIntelligenceResponse["status"];
}): readonly ObjectPanelSection[] {
  const normalized = input.normalized;
  const relationshipHighlights = normalized
    ? metricHighlights(normalized, (id) => id.includes("relationship"))
    : Object.freeze([]);
  const dependencyHighlights = normalized
    ? metricHighlights(normalized, (id) => id.includes("depend"))
    : Object.freeze([]);
  const kpiHighlights = normalized
    ? metricHighlights(normalized, (id) => id.startsWith("kpi"))
    : Object.freeze([]);
  const riskHighlights = normalized
    ? metricHighlights(normalized, (id) => id.startsWith("risk"))
    : Object.freeze([]);
  const scenarioHighlights = normalized
    ? metricHighlights(normalized, (id) => id.startsWith("scenario"))
    : Object.freeze([]);

  return Object.freeze(
    OBJECT_PANEL_SECTIONS.map((sectionId) => {
      switch (sectionId) {
        case "executive_overview":
          return buildSection(
            sectionId,
            input.summary,
            normalized ? metricHighlights(normalized, () => true).slice(0, 4) : Object.freeze([])
          );
        case "object_status":
          return buildSection(
            sectionId,
            `Object "${input.selectedObjectId ?? "unknown"}" status: ${input.status}.`,
            Object.freeze([`Status: ${input.status}`])
          );
        case "business_purpose":
          return buildSection(
            sectionId,
            normalized?.summary ?? "Business purpose derived from normalized object intelligence.",
            Object.freeze([])
          );
        case "relationships":
          return buildSection(
            sectionId,
            relationshipHighlights.length > 0
              ? "Relationship signals from normalized executive intelligence."
              : "No relationship highlights available for this object.",
            relationshipHighlights
          );
        case "dependencies":
          return buildSection(
            sectionId,
            dependencyHighlights.length > 0
              ? "Dependency signals from normalized executive intelligence."
              : "No dependency highlights available for this object.",
            dependencyHighlights
          );
        case "kpis":
          return buildSection(
            sectionId,
            kpiHighlights.length > 0 ? "KPI signals from normalized executive intelligence." : "No KPI highlights available.",
            kpiHighlights
          );
        case "risks":
          return buildSection(
            sectionId,
            riskHighlights.length > 0 ? "Risk signals from normalized executive intelligence." : "No risk highlights available.",
            riskHighlights
          );
        case "scenarios":
          return buildSection(
            sectionId,
            scenarioHighlights.length > 0
              ? "Scenario signals from normalized executive intelligence."
              : "No scenario highlights available for this object.",
            scenarioHighlights
          );
        case "recommendations":
          return buildSection(
            sectionId,
            input.recommendations.length > 0
              ? "Recommendations from normalized executive intelligence."
              : "No recommendations available for this object.",
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

export function buildObjectPanelIntelligenceResponse(input: {
  request: ObjectPanelIntelligenceRequest;
  gateway: IntelligenceGatewayResult | null;
}): ObjectPanelIntelligenceResponse {
  const generatedAt = new Date().toISOString();
  const timeState = input.request.executiveTimeContext?.timeState ?? null;
  const selectedObjectId = input.request.selectedObjectId;

  if (!input.gateway || !("runtimeResponse" in input.gateway)) {
    const reason =
      input.gateway && "reason" in input.gateway ? input.gateway.reason : "gateway_unavailable";
    const message =
      input.gateway && "message" in input.gateway
        ? input.gateway.message
        : "Object Panel could not reach the intelligence gateway.";
    return Object.freeze({
      contractVersion: OBJECT_PANEL_INTELLIGENCE_VERSION,
      objectPanelRequestId: input.request.objectPanelRequestId,
      selectedObjectId,
      success: false,
      headline: objectHeadline(selectedObjectId, timeState),
      status: "error",
      summary: "Executive object intelligence is unavailable for this selection.",
      confidence: null,
      warnings: Object.freeze([message]),
      recommendations: Object.freeze([]),
      highlights: Object.freeze([]),
      sections: buildSections({
        normalized: null,
        selectedObjectId,
        timeState,
        lastUpdated: generatedAt,
        confidence: null,
        warnings: Object.freeze([message]),
        recommendations: Object.freeze([]),
        summary: "Executive object intelligence is unavailable for this selection.",
        status: "error",
      }),
      timeState,
      lastUpdated: generatedAt,
      normalized: null,
      reason,
      message,
      generatedAt,
      source: OBJECT_PANEL_INTELLIGENCE_SOURCE,
    });
  }

  const runtimeResponse = input.gateway.runtimeResponse;
  const normalized = runtimeResponse.snapshot?.payload ?? null;
  const summary = normalized?.summary ?? "Executive object intelligence returned without a summary.";
  const warnings = Object.freeze([...(normalized?.warnings ?? [])]);
  const recommendations = Object.freeze([...(normalized?.recommendations ?? [])]);
  const confidence = normalized?.confidence ?? null;
  const status = normalized?.status ?? "empty";
  const highlights = normalized ? metricHighlights(normalized, () => true).slice(0, 8) : Object.freeze([]);

  return Object.freeze({
    contractVersion: OBJECT_PANEL_INTELLIGENCE_VERSION,
    objectPanelRequestId: input.request.objectPanelRequestId,
    selectedObjectId,
    success: runtimeResponse.success,
    headline: objectHeadline(selectedObjectId, timeState),
    status,
    summary,
    confidence,
    warnings,
    recommendations,
    highlights,
    sections: buildSections({
      normalized,
      selectedObjectId,
      timeState,
      lastUpdated: normalized?.timestamp ?? generatedAt,
      confidence,
      warnings,
      recommendations,
      summary,
      status,
    }),
    timeState,
    lastUpdated: normalized?.timestamp ?? generatedAt,
    normalized,
    reason: runtimeResponse.success ? "completed" : "runtime_error",
    message: runtimeResponse.error.message ?? "Object Panel response built from normalized intelligence.",
    generatedAt,
    source: OBJECT_PANEL_INTELLIGENCE_SOURCE,
  });
}

export const ObjectPanelResponseBuilder = Object.freeze({
  buildObjectPanelIntelligenceResponse,
});
