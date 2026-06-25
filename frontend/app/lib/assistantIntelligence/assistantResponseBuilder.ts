/**
 * INT-2 — Assistant Response Builder.
 * Transforms normalized executive intelligence into assistant language — no calculations.
 */

import type { DashboardIntelligenceNormalizedPayload } from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import type { IntelligenceGatewayResult } from "../dashboardIntelligence/singleIntelligenceSourceContract.ts";
import {
  ASSISTANT_INTELLIGENCE_SOURCE,
  ASSISTANT_INTELLIGENCE_VERSION,
  type AssistantExecutiveRequestType,
  type AssistantIntelligenceRequest,
  type AssistantIntelligenceResponse,
  type AssistantIntelligenceSourceRef,
} from "./assistantIntelligenceContract.ts";

const REQUEST_TYPE_TITLES: Readonly<Record<AssistantExecutiveRequestType, string>> = Object.freeze({
  explain_object: "Object",
  explain_relationship: "Relationship",
  explain_kpi: "KPI",
  explain_risk: "Risk",
  explain_workspace: "Workspace",
  explain_scenario: "Scenario",
  explain_executive_summary: "Executive Summary",
  explain_data_source: "Data Source",
  general_executive_question: "Executive Question",
});

function timeStateLabel(timeState: AssistantIntelligenceResponse["timeState"]): string {
  if (timeState === "past") return "historical";
  if (timeState === "future") return "hypothetical";
  return "current";
}

function buildSources(
  normalized: DashboardIntelligenceNormalizedPayload | null,
  engineId: string | null
): readonly AssistantIntelligenceSourceRef[] {
  if (!normalized) return Object.freeze([]);
  return Object.freeze([
    Object.freeze({
      source: normalized.source,
      engineId,
      panel: normalized.panel,
    }),
  ]);
}

function buildExplanation(input: {
  requestType: AssistantExecutiveRequestType;
  normalized: DashboardIntelligenceNormalizedPayload | null;
  timeState: AssistantIntelligenceResponse["timeState"];
  managerPhrase: string | null;
}): string {
  const subject = REQUEST_TYPE_TITLES[input.requestType];
  const timeLabel = timeStateLabel(input.timeState);
  if (!input.normalized) {
    return `No normalized ${subject.toLowerCase()} intelligence is available for this ${timeLabel} request.`;
  }

  const metricLines = input.normalized.metrics
    .slice(0, 6)
    .map((entry) => `${entry.label}: ${String(entry.value ?? "n/a")}${entry.unit ? ` ${entry.unit}` : ""}`)
    .join("; ");

  const phraseLead = input.managerPhrase ? `Regarding "${input.managerPhrase}", ` : "";
  return `${phraseLead}this ${timeLabel} ${subject.toLowerCase()} view reports: ${input.normalized.summary}${
    metricLines ? ` Key signals: ${metricLines}.` : ""
  }`;
}

export function buildAssistantIntelligenceResponse(input: {
  request: AssistantIntelligenceRequest;
  gateway: IntelligenceGatewayResult | null;
}): AssistantIntelligenceResponse {
  const generatedAt = new Date().toISOString();
  const timeState = input.request.executiveTimeContext?.timeState ?? null;

  if (!input.gateway || !("runtimeResponse" in input.gateway)) {
    const reason =
      input.gateway && "reason" in input.gateway ? input.gateway.reason : "gateway_unavailable";
    const message =
      input.gateway && "message" in input.gateway
        ? input.gateway.message
        : "Assistant could not reach the intelligence gateway.";
    return Object.freeze({
      contractVersion: ASSISTANT_INTELLIGENCE_VERSION,
      assistantRequestId: input.request.assistantRequestId,
      requestType: input.request.requestType,
      success: false,
      summary: "Executive intelligence is unavailable for this assistant request.",
      explanation: message,
      recommendations: Object.freeze([]),
      warnings: Object.freeze([message]),
      confidence: null,
      sources: Object.freeze([]),
      timeState,
      normalized: null,
      reason,
      message,
      generatedAt,
      source: ASSISTANT_INTELLIGENCE_SOURCE,
    });
  }

  const runtimeResponse = input.gateway.runtimeResponse;
  const normalized = runtimeResponse.snapshot?.payload ?? null;
  const engineId = runtimeResponse.engineId ?? null;

  return Object.freeze({
    contractVersion: ASSISTANT_INTELLIGENCE_VERSION,
    assistantRequestId: input.request.assistantRequestId,
    requestType: input.request.requestType,
    success: runtimeResponse.success,
    summary: normalized?.summary ?? "Executive intelligence returned without a summary.",
    explanation: buildExplanation({
      requestType: input.request.requestType,
      normalized,
      timeState,
      managerPhrase: input.request.managerPhrase,
    }),
    recommendations: Object.freeze([...(normalized?.recommendations ?? [])]),
    warnings: Object.freeze([...(normalized?.warnings ?? [])]),
    confidence: normalized?.confidence ?? null,
    sources: buildSources(normalized, engineId),
    timeState,
    normalized,
    reason: runtimeResponse.success ? "completed" : "runtime_error",
    message: runtimeResponse.error.message ?? "Assistant response built from normalized intelligence.",
    generatedAt,
    source: ASSISTANT_INTELLIGENCE_SOURCE,
  });
}

export const AssistantResponseBuilder = Object.freeze({
  buildAssistantIntelligenceResponse,
});
