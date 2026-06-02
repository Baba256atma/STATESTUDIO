/**
 * E2:72 — Stable business-input signature for executive dashboard decision trace.
 */

import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";

export type ExecutiveDecisionTraceSignatureInput = {
  scenarioId?: string | null;
  decisionId?: string | null;
  selectedObjectId?: string | null;
  riskLevel?: string | null;
  frsi?: number | string | null;
  visibleObjectIds?: readonly string[];
  activeRecommendationId?: string | null;
  timelineVersion?: string | null;
  activeMode?: string | null;
  memoryEntryIds?: readonly string[];
};

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value * 1000) / 1000;
}

function readTimelineVersion(responseData: Record<string, unknown> | null | undefined): string | null {
  if (!responseData) return null;
  const timelineImpact = responseData.timeline_impact;
  if (!timelineImpact || typeof timelineImpact !== "object" || Array.isArray(timelineImpact)) return null;
  const events = (timelineImpact as Record<string, unknown>).events;
  if (!Array.isArray(events)) return null;
  return events
    .slice(0, 12)
    .map((event) => {
      if (!event || typeof event !== "object") return "unknown";
      const row = event as Record<string, unknown>;
      return `${asString(row.id) ?? asString(row.type) ?? "event"}:${asString(row.type) ?? ""}`;
    })
    .join("|");
}

export function buildExecutiveDecisionTraceInputSignature(
  input: ExecutiveDecisionTraceSignatureInput
): string {
  const visibleObjectIds = [...(input.visibleObjectIds ?? [])].sort();
  const memoryEntryIds = [...(input.memoryEntryIds ?? [])].sort();

  return JSON.stringify({
    scenarioId: input.scenarioId ?? null,
    decisionId: input.decisionId ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    riskLevel: input.riskLevel ?? null,
    frsi: input.frsi ?? null,
    visibleObjectIds,
    activeRecommendationId: input.activeRecommendationId ?? null,
    timelineVersion: input.timelineVersion ?? null,
    activeMode: input.activeMode ?? null,
    memoryEntryIds,
  });
}

export function extractExecutiveDecisionTraceSignatureInput(input: {
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
  sceneJson?: { scene?: { objects?: Array<{ id?: string | null }>; fragility?: { level?: unknown; score?: unknown } } } | null;
  objectSelection?: { selected_object_id?: string | null; highlighted_objects?: string[] | null } | null;
  activeMode?: string | null;
  scenarioId?: string | null;
  decisionId?: string | null;
}): ExecutiveDecisionTraceSignatureInput {
  const responseData = input.responseData ?? null;
  const canonicalRecommendation =
    input.canonicalRecommendation ??
    ((responseData?.canonical_recommendation as CanonicalRecommendation | null | undefined) ?? null);
  const memoryEntries = input.memoryEntries ?? [];
  const latestMemory = memoryEntries[0] ?? null;
  const fragility =
    input.sceneJson?.scene?.fragility ??
    (responseData?.fragility as { level?: unknown; score?: unknown } | undefined) ??
    null;

  const visibleObjectIds = Array.isArray(input.sceneJson?.scene?.objects)
    ? input.sceneJson.scene.objects
        .map((object) => asString(object?.id))
        .filter((id): id is string => Boolean(id))
    : [];

  const selectedFromSelection =
    asString(input.objectSelection?.selected_object_id) ??
    (Array.isArray(input.objectSelection?.highlighted_objects)
      ? asString(input.objectSelection.highlighted_objects[0])
      : null);

  const simulation = responseData?.decision_simulation;
  const simulationScenarioId =
    simulation && typeof simulation === "object" && !Array.isArray(simulation)
      ? asString((simulation as Record<string, unknown>).scenario_id) ??
        asString(
          ((simulation as Record<string, unknown>).scenario as Record<string, unknown> | undefined)?.id
        )
      : null;

  return {
    scenarioId:
      input.scenarioId ??
      simulationScenarioId ??
      asString(responseData?.scenario_id) ??
      asString(responseData?.active_scenario_id),
    decisionId:
      input.decisionId ??
      asString(latestMemory?.id) ??
      asString((responseData?.decision_result as Record<string, unknown> | undefined)?.decision_id),
    selectedObjectId: selectedFromSelection,
    riskLevel: asString(fragility?.level) ?? asString(responseData?.risk_level),
    frsi:
      asNumber(fragility?.score) ??
      asNumber(responseData?.frsi) ??
      asNumber((responseData?.fragility_scan as Record<string, unknown> | undefined)?.score),
    visibleObjectIds,
    activeRecommendationId: asString(canonicalRecommendation?.id),
    timelineVersion: readTimelineVersion(responseData),
    activeMode: asString(input.activeMode),
    memoryEntryIds: memoryEntries
      .slice(0, 8)
      .map((entry) => asString(entry.id))
      .filter((id): id is string => Boolean(id)),
  };
}

export function buildDecisionTracePanelWriteSignature(input: {
  headline?: string | null;
  recommendation?: string | null;
  confidence?: number | null;
  risk?: string | null;
  actions?: readonly string[];
  selectedObjectId?: string | null;
  scenarioId?: string | null;
}): string {
  return JSON.stringify({
    headline: input.headline ?? null,
    recommendation: input.recommendation ?? null,
    confidence: input.confidence ?? null,
    risk: input.risk ?? null,
    actions: [...(input.actions ?? [])].sort(),
    selectedObjectId: input.selectedObjectId ?? null,
    scenarioId: input.scenarioId ?? null,
  });
}

export function extractDecisionTracePanelWriteSignature(input: {
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  selectedObjectId?: string | null;
  scenarioId?: string | null;
}): string {
  const responseData = input.responseData ?? null;
  const recommendation =
    input.canonicalRecommendation ??
    ((responseData?.canonical_recommendation as CanonicalRecommendation | null | undefined) ?? null);
  const executiveSummary = responseData?.executive_summary_surface;
  const headline =
    executiveSummary && typeof executiveSummary === "object" && !Array.isArray(executiveSummary)
      ? asString((executiveSummary as Record<string, unknown>).happened)
      : null;

  return buildDecisionTracePanelWriteSignature({
    headline,
    recommendation: asString(recommendation?.primary?.action),
    confidence: asNumber(recommendation?.confidence?.score),
    risk: asString(recommendation?.reasoning?.risk_summary) ?? asString(responseData?.risk_level),
    actions: recommendation?.alternatives?.map((alt) => asString(alt.action)).filter(Boolean) as string[],
    selectedObjectId: input.selectedObjectId ?? null,
    scenarioId: input.scenarioId ?? null,
  });
}
