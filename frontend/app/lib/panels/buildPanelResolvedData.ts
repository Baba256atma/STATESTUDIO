import type { NexoraAuditRecord } from "../audit/nexoraAuditContract.ts";
import type { PanelResolvedData, PanelSharedData, ResolvedPanelName } from "./panelDataResolverTypes";
import { getPanelSafeStatus } from "./getPanelSafeStatus";
import { buildPanelFallbackState } from "./buildPanelFallbackState";
import {
  buildCompareAnchorSummary,
  buildSimulationStubSummary,
  extractNexoraB8FromSharedData,
  traceNexoraB9PanelMeaningEnriched,
} from "./nexoraPanelMeaning";
import { isNexoraAuditRecordLike, normalizeFragilityToken, type NexoraPipelineTrustSnapshot } from "../scenario/nexoraScenarioBuilder.ts";
import { fingerprintScenarioMemory, loadScenarioMemory, resolveNexoraB18WithMemory } from "../scenario/nexoraScenarioMemory.ts";
import { loadExecutionOutcomes } from "../execution/nexoraExecutionStore.ts";
import type { NexoraBiasLayerContext } from "../quality/nexoraBiasGovernance.ts";
import { evaluateDecisionQuality } from "../quality/nexoraDecisionQuality.ts";
import type { NexoraMode } from "../product/nexoraMode.ts";

type LooseRecord = Record<string, unknown>;
type SelectedSource = { family: string; value: unknown } | null;
const EMPTY_RECOMMENDATIONS: unknown[] = [];
const EMPTY_RELATED_OBJECT_IDS: string[] = [];
const EMPTY_SUPPORTING_DRIVER_LABELS: string[] = [];
const EMPTY_TIMELINE_EVENTS: unknown[] = [];
const ADVICE_EMPTY_DATA = Object.freeze({
  title: "Strategic Advice",
  summary: "No advice available yet.",
  why: null,
  recommendation: null,
  risk_summary: null,
  recommendations: EMPTY_RECOMMENDATIONS,
  related_object_ids: EMPTY_RELATED_OBJECT_IDS,
  supporting_driver_labels: EMPTY_SUPPORTING_DRIVER_LABELS,
  recommended_actions: EMPTY_RECOMMENDATIONS,
  primary_recommendation: null,
  confidence: null,
});
const TIMELINE_EMPTY_DATA = Object.freeze({
  headline: "Decision Timeline",
  events: EMPTY_TIMELINE_EVENTS,
  related_object_ids: EMPTY_RELATED_OBJECT_IDS,
  steps: EMPTY_TIMELINE_EVENTS,
  stages: EMPTY_TIMELINE_EVENTS,
  timeline: EMPTY_TIMELINE_EVENTS,
  summary: "No timeline data available yet.",
});
const WAR_ROOM_EMPTY_DATA = Object.freeze({
  headline: "War Room",
  posture: null,
  priorities: EMPTY_RECOMMENDATIONS,
  risks: EMPTY_RECOMMENDATIONS,
  related_object_ids: EMPTY_RELATED_OBJECT_IDS,
  summary: "War Room data not available yet.",
  recommendation: null,
  simulation_summary: null,
  compare_summary: null,
  executive_summary: null,
  advice_summary: null,
});
const tracePanelResolutionSignatures = new Set<string>();
const traceWeakPartialAcceptedSignatures = new Set<string>();
const b18ScenarioBuiltLogged = new Set<string>();
const b18CompareRecommendedLogged = new Set<string>();
const b19MemoryAnalyzedLogged = new Set<string>();

const resolvedPanelCache = new WeakMap<object, Map<ResolvedPanelName, PanelResolvedData>>();
const resolvedPanelNullInputCache = new Map<ResolvedPanelName, PanelResolvedData>();

function readCachedResolvedPanelResult(
  sourceData: PanelSharedData | null | undefined,
  panel: ResolvedPanelName
): PanelResolvedData | null {
  if (!sourceData || typeof sourceData !== "object") {
    return resolvedPanelNullInputCache.get(panel) ?? null;
  }
  const byPanel = resolvedPanelCache.get(sourceData as object);
  return byPanel?.get(panel) ?? null;
}

function cacheResolvedPanelResult(
  sourceData: PanelSharedData | null | undefined,
  panel: ResolvedPanelName,
  result: PanelResolvedData
): PanelResolvedData {
  if (!sourceData || typeof sourceData !== "object") {
    resolvedPanelNullInputCache.set(panel, result);
    return result;
  }
  let byPanel = resolvedPanelCache.get(sourceData as object);
  if (!byPanel) {
    byPanel = new Map<ResolvedPanelName, PanelResolvedData>();
    resolvedPanelCache.set(sourceData as object, byPanel);
  }
  byPanel.set(panel, result);
  return result;
}

function emitB18ScenarioBuilt(sig: string) {
  if (process.env.NODE_ENV === "production") return;
  if (b18ScenarioBuiltLogged.has(sig)) return;
  b18ScenarioBuiltLogged.add(sig);
  globalThis.console?.debug?.("[Nexora][B18] scenario_variants_built", { sig });
}

function emitB18CompareRecommended(runId: string, confidenceTier: string, recommendedOptionId: string | null) {
  if (process.env.NODE_ENV === "production") return;
  const key = `${runId}|${confidenceTier}|${recommendedOptionId ?? "none"}`;
  if (b18CompareRecommendedLogged.has(key)) return;
  b18CompareRecommendedLogged.add(key);
  globalThis.console?.debug?.("[Nexora][B18] compare_recommended_option", { runId, confidenceTier, recommendedOptionId });
}

function emitB19MemoryAnalyzedOnce(runId: string, digest: string) {
  if (process.env.NODE_ENV === "production") return;
  const key = `${runId}|${digest}`;
  if (b19MemoryAnalyzedLogged.has(key)) return;
  b19MemoryAnalyzedLogged.add(key);
  globalThis.console?.debug?.("[Nexora][B19] memory_analyzed", { runId, digest });
}

function readPipelineTrustSnapshot(safeData: PanelSharedData): NexoraPipelineTrustSnapshot | null {
  const raw = (safeData as { nexoraPipelineTrust?: unknown }).nexoraPipelineTrust;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const tier = o.confidenceTier;
  const confOk = tier === "low" || tier === "medium" || tier === "high";
  return {
    confidenceTier: confOk ? tier : undefined,
    trustSummaryLine: typeof o.trustSummaryLine === "string" ? o.trustSummaryLine : null,
    fragilityLevel: typeof o.fragilityLevel === "string" ? o.fragilityLevel : null,
  };
}

function resolveNexoraB18DecisionContext(
  safeData: PanelSharedData,
  audit: NexoraAuditRecord
): { posture?: string; tradeoff?: string; nextMove?: string } | undefined {
  const b8 = safeData.nexoraB8PanelContext;
  if (
    b8 &&
    (Boolean(b8.posture?.trim()) || Boolean(b8.tradeoff?.trim()) || Boolean(b8.nextMove?.trim()))
  ) {
    return {
      posture: b8.posture?.trim() || undefined,
      tradeoff: b8.tradeoff?.trim() || undefined,
      nextMove: b8.nextMove?.trim() || undefined,
    };
  }
  const d = audit.decision;
  if (d && (d.posture || d.tradeoff || d.nextMove)) return d;
  return undefined;
}

function readNexoraBiasLayerContext(safeData: PanelSharedData): NexoraBiasLayerContext | null {
  const raw = (safeData as { nexoraBiasLayerContext?: unknown }).nexoraBiasLayerContext;
  if (!raw || typeof raw !== "object") return null;
  return raw as NexoraBiasLayerContext;
}

function readNexoraOperatorMode(safeData: PanelSharedData): NexoraMode {
  const m = (safeData as { nexoraOperatorMode?: NexoraMode | null }).nexoraOperatorMode;
  return m === "pure" ? "pure" : "adaptive";
}

function maybeInjectNexoraB18ScenarioData(options: {
  safeData: PanelSharedData;
  target: LooseRecord;
  mode: "compare" | "simulate";
}): void {
  const auditRaw = (options.safeData as { nexoraAuditRecord?: unknown }).nexoraAuditRecord;
  if (!isNexoraAuditRecordLike(auditRaw)) return;
  const audit = auditRaw;
  const pipelineTrust = readPipelineTrustSnapshot(options.safeData);
  const trustInput = {
    confidenceTier: pipelineTrust?.confidenceTier ?? audit.trust.confidenceTier ?? undefined,
    summary: pipelineTrust?.trustSummaryLine ?? audit.trust.summary ?? null,
  };
  const decision = resolveNexoraB18DecisionContext(options.safeData, audit);
  const memory = loadScenarioMemory();
  const biasCtx = readNexoraBiasLayerContext(options.safeData);
  const operatorMode = readNexoraOperatorMode(options.safeData);
  const resolved = resolveNexoraB18WithMemory({
    audit,
    trust: trustInput,
    decision,
    memory,
    adaptiveBias: biasCtx?.governedBiasForPick ?? null,
    biasGovernance: biasCtx?.governance ?? null,
    adaptiveBiasStrengthBand: biasCtx?.biasStrengthBand ?? "soft",
    nexoraOperatorMode: operatorMode,
  });
  const { variants, recommendedOptionId, signature: sig, insights: memoryInsights } = resolved;
  const tier = String(trustInput.confidenceTier ?? audit.trust.confidenceTier ?? "none");
  emitB19MemoryAnalyzedOnce(
    audit.runId,
    `${fingerprintScenarioMemory(memory)}|${memoryInsights.similarRuns}|${memoryInsights.repeatedDecision ? 1 : 0}|${memoryInsights.dominantRecommendedOption ?? ""}|${memoryInsights.stabilityTrend ?? ""}|${memoryInsights.historicalPatternLabel}`
  );
  emitB18ScenarioBuilt(sig);
  if (options.mode === "compare") {
    emitB18CompareRecommended(audit.runId, tier, recommendedOptionId);
    const currentFrag = normalizeFragilityToken(
      String(pipelineTrust?.fragilityLevel ?? audit.scanner.fragilityLevel ?? "medium")
    );
    const quality = evaluateDecisionQuality({ outcomes: loadExecutionOutcomes(), memory });
    const qualityHintRaw =
      quality.totalRatedRuns === 0
        ? undefined
        : quality.bestPosture
          ? `Historically strongest posture: ${quality.bestPosture}. ${quality.trend === "declining" ? "Recent outcomes weak." : quality.trend === "improving" ? "Recent outcomes improving." : "Recent outcomes mixed."}`
          : quality.trend === "declining"
            ? "Recent outcomes weak."
            : quality.trend === "improving"
              ? "Recent outcomes improving."
              : "Recent outcomes mixed.";
    const qualityHint =
      typeof qualityHintRaw === "string" && qualityHintRaw.length > 220 ? `${qualityHintRaw.slice(0, 220)}…` : qualityHintRaw;
    options.target.nexoraB18Compare = {
      current: {
        id: "current",
        label: "Current assessment",
        fragilityLevel: currentFrag,
        confidenceTier: pipelineTrust?.confidenceTier ?? audit.trust.confidenceTier,
        drivers: [...(audit.scanner.drivers ?? [])].map(String),
        summary:
          typeof trustInput.summary === "string" && trustInput.summary.trim()
            ? trustInput.summary.trim().slice(0, 280)
            : "Live Nexora assessment snapshot.",
        recommendationTone: "Evidence-backed baseline",
      },
      variants,
      recommendedOptionId,
      signature: sig,
      memoryInsights,
      qualityHint,
      adaptiveBias: biasCtx?.rawBias ?? null,
      biasGovernance: biasCtx?.governance ?? null,
      nexoraOperatorMode: operatorMode,
    };
  } else {
    options.target.nexoraB18Simulate = {
      variants,
      recommendedOptionId,
      signature: sig,
      decisionContext: {
        posture: decision?.posture,
        tradeoff: decision?.tradeoff,
        nextMove: decision?.nextMove,
      },
      memoryInsights,
      adaptiveBias: biasCtx?.rawBias ?? null,
      biasGovernance: biasCtx?.governance ?? null,
      nexoraOperatorMode: operatorMode,
    };
  }
}

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" ? (value as LooseRecord) : null;
}

function hasKeys(value: unknown) {
  const record = asRecord(value);
  return Boolean(record && Object.keys(record).length > 0);
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function hasNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function hasAnyRenderableFamilyRecord(value: unknown) {
  const record = asRecord(value);
  return Boolean(record && Object.keys(record).length > 0);
}

function hasAnyRenderableArray(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function hasWeakObject(value: unknown) {
  return hasAnyRenderableFamilyRecord(value);
}

function pickFirst<T>(values: T[]): T | null {
  for (const value of values) {
    if (value == null) continue;
    if (hasText(value) || hasItems(value) || hasKeys(value)) {
      return value;
    }
  }
  return null;
}

function hasSummaryLike(record: LooseRecord | null, fields: string[] = ["title", "headline", "summary"]) {
  return fields.some((field) => hasText(record?.[field]));
}

function hasRecommendationLike(value: unknown) {
  const record = asRecord(value);
  const primaryRecommendation = asRecord(record?.primary_recommendation);
  return (
    hasItems(record?.recommendations) ||
    hasItems(record?.recommended_actions) ||
    hasText(record?.recommendation) ||
    hasText(record?.action) ||
    hasText(primaryRecommendation?.action)
  );
}

function hasAdvicePrimary(value: unknown) {
  const record = asRecord(value);
  return hasRecommendationLike(value) || hasText(record?.summary);
}

function hasAdvicePartial(value: unknown) {
  const record = asRecord(value);
  const primaryRecommendation = asRecord(record?.primary_recommendation);
  return (
    hasSummaryLike(record) ||
    hasText(record?.why) ||
    hasText(record?.risk_summary) ||
    hasText(record?.recommendation) ||
    hasText(record?.action) ||
    hasText(record?.title) ||
    hasText(primaryRecommendation?.summary) ||
    hasText(primaryRecommendation?.action) ||
    hasItems(record?.recommended_actions) ||
    hasItems(record?.recommendations)
  );
}

function hasExecutivePrimary(value: unknown) {
  const record = asRecord(value);
  const executive = asRecord(record?.executive);
  return (
    hasText(record?.summary) ||
    (hasText(record?.summary) &&
      (hasText(record?.what_to_do) || hasText(record?.why_it_matters) || hasText(record?.happened))) ||
    (hasText(record?.what_to_do) && hasText(record?.happened)) ||
    (hasText(record?.recommendation) && hasText(record?.summary)) ||
    (hasText(executive?.summary) &&
      (hasText(executive?.what_to_do) || hasText(executive?.why_it_matters) || hasText(executive?.happened)))
  );
}

function hasWarRoomPrimary(value: unknown) {
  const record = asRecord(value);
  return (
    hasItems(record?.priorities) ||
    hasItems(record?.risks) ||
    hasText(record?.summary) ||
    hasText(record?.headline) ||
    (hasText(record?.recommendation) &&
      (hasText(record?.summary) || hasText(record?.headline) || hasText(record?.posture))) ||
    hasItems(record?.related_object_ids)
  );
}

function hasWarRoomPartial(value: unknown) {
  const record = asRecord(value);
  return (
    hasText(record?.headline) ||
    hasText(record?.posture) ||
    hasText(record?.summary) ||
    hasText(record?.recommendation) ||
    hasText(record?.simulation_summary) ||
    hasText(record?.compare_summary) ||
    hasText(record?.advice_summary) ||
    hasText(record?.executive_summary)
  );
}

function hasComparePrimary(value: unknown) {
  const record = asRecord(value);
  return (
    hasItems(record?.options) ||
    hasItems(record?.comparison) ||
    (hasText(record?.recommendation) && hasText(record?.summary))
  );
}

function hasComparePartial(value: unknown) {
  const record = asRecord(value);
  return (
    hasSummaryLike(record) ||
    hasText(record?.recommendation) ||
    hasItems(record?.options) ||
    hasItems(record?.comparison) ||
    hasAnyRenderableFamilyRecord(value)
  );
}

function hasTimelinePrimary(value: unknown) {
  if (hasItems(value)) return true;
  const record = asRecord(value);
  return (
    hasItems(record?.events) ||
    hasItems(record?.stages) ||
    hasItems(record?.timeline) ||
    hasItems(record?.steps) ||
    hasItems(record?.propagation)
  );
}

function hasTimelinePartial(value: unknown) {
  if (hasAnyRenderableArray(value)) return true;
  const record = asRecord(value);
  return (
    hasText(record?.headline) ||
    hasText(record?.summary) ||
    hasText(record?.immediate) ||
    hasText(record?.near_term) ||
    hasText(record?.label) ||
    hasText(record?.type) ||
    hasNumber(record?.order) ||
    hasItems(record?.events) ||
    hasItems(record?.timeline) ||
    hasItems(record?.stages) ||
    hasItems(record?.steps)
  );
}

function hasRiskPrimary(value: unknown) {
  const record = asRecord(value);
  return (
    hasItems(record?.edges) ||
    hasItems(record?.drivers) ||
    hasItems(record?.sources) ||
    hasItems(record?.changed_drivers) ||
    hasItems(record?.affected_dimensions)
  );
}

function hasConflictPrimary(value: unknown) {
  if (hasItems(value)) return true;
  const record = asRecord(value);
  return (
    hasItems(record?.conflicts) ||
    hasItems(record?.tradeoffs) ||
    hasItems(record?.tensions) ||
    hasItems(record?.conflict_points)
  );
}

function hasConflictPartial(value: unknown) {
  if (hasAnyRenderableArray(value)) return true;
  const record = asRecord(value);
  return (
    hasSummaryLike(record, ["headline", "summary", "posture"]) ||
    hasText(record?.level) ||
    hasText(record?.risk_level) ||
    hasItems(record?.conflicts) ||
    hasItems(record?.tradeoffs) ||
    hasItems(record?.tensions) ||
    hasItems(record?.conflict_points) ||
    ((hasItems(record?.conflicts) ||
      hasItems(record?.tradeoffs) ||
      hasItems(record?.tensions) ||
      hasItems(record?.conflict_points) ||
      hasText(record?.summary) ||
      hasText(record?.headline) ||
      hasText(record?.posture)) &&
      hasAnyRenderableFamilyRecord(value))
  );
}

function hasFragilityPrimary(value: unknown) {
  const record = asRecord(value);
  return (
    hasItems(record?.drivers) ||
    hasItems(record?.sources) ||
    hasItems(record?.edges) ||
    hasItems(record?.changed_drivers) ||
    hasItems(record?.affected_dimensions) ||
    hasKeys(record?.object_impacts) ||
    hasNumber(record?.fragility_score)
  );
}

function hasSimulationPrimary(value: unknown) {
  const record = asRecord(value);
  return (
    hasItems(record?.propagation) ||
    hasItems(record?.impacted_nodes) ||
    hasItems(record?.affected_objects) ||
    hasItems(record?.kpi_effects) ||
    hasNumber(record?.risk_delta)
  );
}

function hasSimulationPartial(value: unknown) {
  const record = asRecord(value);
  return (
    hasText(record?.summary) ||
    hasText(record?.what_to_do) ||
    hasNumber(record?.risk_delta) ||
    hasText(record?.headline) ||
    hasText(record?.recommendation) ||
    hasItems(record?.impacted_nodes) ||
    hasItems(record?.affected_objects) ||
    hasAnyRenderableFamilyRecord(value)
  );
}

function hasWarRoomSupportPartial(value: unknown) {
  const record = asRecord(value);
  return Boolean(
    hasText(record?.summary) ||
      hasText(record?.recommendation) ||
      hasText(record?.simulation_summary) ||
      hasText(record?.compare_summary) ||
      hasText(record?.advice_summary) ||
      hasText(record?.executive_summary) ||
      hasWarRoomPartial(value)
  );
}

function firstByGuard(
  candidates: Array<{ family: string; value: unknown }>,
  guard: (value: unknown) => boolean
) {
  for (const candidate of candidates) {
    if (candidate.value == null) continue;
    if (guard(candidate.value)) return candidate;
  }
  return null;
}

function firstPresent(candidates: Array<{ family: string; value: unknown }>): SelectedSource {
  for (const candidate of candidates) {
    if (candidate.value == null) continue;
    if (hasText(candidate.value) || hasItems(candidate.value) || hasKeys(candidate.value)) {
      return candidate;
    }
  }
  return null;
}

function mergeRecords(values: unknown[]) {
  const merged: LooseRecord = {};
  let hasAny = false;
  for (const value of values) {
    const record = asRecord(value);
    if (!record) continue;
    Object.assign(merged, record);
    hasAny = true;
  }
  return hasAny ? merged : null;
}

function getTimelineLikeSource(value: unknown) {
  if (hasTimelinePrimary(value)) return value;
  const record = asRecord(value);
  if (record && hasTimelinePrimary(record.timeline)) return record.timeline;
  return null;
}

function getConflictRenderable(value: unknown): unknown[] | null {
  if (Array.isArray(value) && value.length > 0) return value;
  const record = asRecord(value);
  if (!record) return null;
  if (Array.isArray(record.conflicts) && record.conflicts.length > 0) return record.conflicts;
  if (Array.isArray(record.tradeoffs) && record.tradeoffs.length > 0) return record.tradeoffs;
  if (Array.isArray(record.tensions) && record.tensions.length > 0) return record.tensions;
  if (Array.isArray(record.conflict_points) && record.conflict_points.length > 0) return record.conflict_points;
  return null;
}

function pickResolverFallback(safeData: PanelSharedData) {
  return pickFirst([safeData, safeData.responseData, safeData.raw]);
}

const warnedPanelDataLeakSignatures = new Set<string>();

function warnPanelDataLeakPrevented(
  panel: ResolvedPanelName,
  detail?: {
    reason?: string;
    missingFields?: string[];
    candidateShapes?: Record<string, string>;
  }
) {
  if (process.env.NODE_ENV === "production") return;
  const signature = JSON.stringify({
    panel,
    reason: detail?.reason ?? "fallback_blocked",
    missingFields: detail?.missingFields ?? [],
    candidateShapes: detail?.candidateShapes ?? {},
  });
  if (warnedPanelDataLeakSignatures.has(signature)) {
    return;
  }
  warnedPanelDataLeakSignatures.add(signature);
  console.warn("[Nexora][PanelDataLeakPrevented]", {
    panel,
    reason: detail?.reason ?? "fallback_blocked",
    missingFields: detail?.missingFields ?? [],
    candidateShapes: detail?.candidateShapes ?? {},
  });
}

function buildConcretePanelEmptyState(
  panel: "advice" | "timeline" | "war_room",
  missingFields: string[]
): PanelResolvedData {
  // For advice/timeline/war_room, thin or missing data must stay in the same panel family via empty-state, not generic fallback.
  if (panel === "advice") {
    return buildResult(panel, {
      data: ADVICE_EMPTY_DATA,
      hasPrimaryData: false,
      hasPartialData: true,
      hasFallbackData: false,
      missingFields,
    });
  }

  if (panel === "timeline") {
    return buildResult(panel, {
      data: TIMELINE_EMPTY_DATA,
      hasPrimaryData: false,
      hasPartialData: true,
      hasFallbackData: false,
      missingFields,
    });
  }

  return buildResult(panel, {
    data: WAR_ROOM_EMPTY_DATA,
    hasPrimaryData: false,
    hasPartialData: true,
    hasFallbackData: false,
    missingFields,
  });
}

function describeResolvedShape(value: unknown) {
  if (Array.isArray(value)) return `array(${value.length})`;
  const record = asRecord(value);
  if (record) return `object(${Object.keys(record).length})`;
  if (value == null) return "null";
  return typeof value;
}

function tracePanelResolution(
  panel: "dashboard" | "advice" | "war_room" | "compare" | "decision_policy" | "executive_approval" | "conflict" | "timeline" | "simulate" | "risk" | "fragility",
  sourceFamily: string | null,
  resolved: unknown,
  hasPrimaryData: boolean,
  hasPartialData: boolean,
  missingFields: string[]
) {
  if (process.env.NODE_ENV === "production") return;
  if (panel === "advice" || panel === "timeline" || panel === "war_room") return;
  const signature = JSON.stringify({
    panel,
    sourceFamily,
    hasPrimaryData,
    hasPartialData,
    missingFields,
    dataShape: describeResolvedShape(resolved),
  });
  if (tracePanelResolutionSignatures.has(signature)) {
    return;
  }
  tracePanelResolutionSignatures.add(signature);
  const record = asRecord(resolved);
  const status = getPanelSafeStatus({
    hasPrimaryData,
    hasPartialData,
    hasFallbackData: Boolean(resolved),
  });
  console.log("[Nexora][Trace][Resolver]", {
    panel,
    chosenSourceFamily: sourceFamily,
    status,
    hasPrimaryData,
    hasPartialData,
    missingFields,
  });
  console.log("[Nexora][PanelResolveTrace]", {
    panel,
    sourceFamily,
    hasPrimaryData,
    hasPartialData,
    missingFields,
    sourceKeys: record ? Object.keys(record).slice(0, 8) : Array.isArray(resolved) ? ["array"] : [],
  });
  console.log("[Nexora][Trace][Resolver][FINAL]", {
    panel,
    hasData: Boolean(resolved),
    isNull: resolved === null,
    keys: record ? Object.keys(record) : Array.isArray(resolved) ? ["array"] : [],
  });
  console.log("[Nexora][Trace][ResolverSummary]", {
    panel,
    chosenSourceFamily: sourceFamily,
    status,
    hasPrimaryData,
    hasPartialData,
    missingFields,
    dataShape: describeResolvedShape(resolved),
  });
}

function traceWeakPartialAccepted(
  panel: "advice" | "timeline" | "simulate" | "war_room" | "compare" | "conflict",
  sourceFamily: string | null,
  resolved: unknown,
  missingFields: string[]
) {
  if (process.env.NODE_ENV === "production") return;
  if (panel === "advice" || panel === "timeline" || panel === "war_room") return;
  const signature = JSON.stringify({
    panel,
    sourceFamily,
    missingFields,
    dataShape: describeResolvedShape(resolved),
  });
  if (traceWeakPartialAcceptedSignatures.has(signature)) {
    return;
  }
  traceWeakPartialAcceptedSignatures.add(signature);
  console.log("[Nexora][ResolverWeakPartialAccepted]", {
    panel,
    sourceFamily,
    dataShape: describeResolvedShape(resolved),
    missingFields,
  });
}

function selectAdviceSource(args: {
  advice: unknown;
  strategicAdvice: unknown;
  promptAdvice: unknown;
  canonicalRecommendation: unknown;
  cockpitAdvice: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "advice", value: args.advice },
    { family: "strategic_advice", value: args.strategicAdvice },
    { family: "prompt_feedback_advice", value: args.promptAdvice },
    { family: "canonical_recommendation", value: args.canonicalRecommendation },
    { family: "cockpit_advice", value: args.cockpitAdvice },
  ];
  return {
    primary: firstByGuard(candidates, hasAdvicePrimary),
    partial: firstByGuard(candidates, hasAdvicePartial) ?? firstPresent(candidates),
  };
}

function selectDashboardSource(args: {
  dashboard: unknown;
  decisionCockpit: unknown;
  cockpitExecutive: unknown;
  executiveSummary: unknown;
  canonicalRecommendation: unknown;
  decisionResult: unknown;
}): { primary: SelectedSource; partial: SelectedSource; support: SelectedSource } {
  const executiveCandidates = [
    { family: "dashboard", value: args.dashboard },
    { family: "decision_cockpit", value: args.decisionCockpit },
    { family: "cockpit_executive", value: args.cockpitExecutive },
    { family: "executive_summary", value: args.executiveSummary },
  ];
  return {
    primary: firstByGuard(executiveCandidates, hasExecutivePrimary),
    partial:
      firstByGuard(executiveCandidates, (value) =>
        hasSummaryLike(asRecord(value), ["summary", "happened", "why_it_matters", "what_to_do"])
      ) ?? firstPresent(executiveCandidates),
    support:
      firstPresent([
        { family: "canonical_recommendation", value: args.canonicalRecommendation },
        { family: "decision_result", value: args.decisionResult },
      ]) ?? null,
  };
}

function selectTimelineSource(args: {
  timeline: unknown;
  promptTimeline: unknown;
  simulationTimeline: unknown;
  simulation: unknown;
  cockpitComparison: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "timeline", value: args.timeline },
    { family: "prompt_feedback_timeline", value: args.promptTimeline },
    { family: "simulation_timeline", value: args.simulationTimeline },
    { family: "simulation", value: args.simulation },
    { family: "cockpit_comparison", value: args.cockpitComparison },
  ];
  return {
    primary: firstByGuard(candidates, hasTimelinePrimary),
    partial: firstByGuard(candidates, hasTimelinePartial) ?? firstPresent(candidates),
  };
}

function buildFragilitySimulationAnchor(scannerFragility: LooseRecord | null | undefined): Record<string, unknown> | null {
  if (!scannerFragility) return null;
  const summary =
    typeof scannerFragility.summary === "string" && String(scannerFragility.summary).trim().length > 0
      ? String(scannerFragility.summary).trim()
      : "";
  if (!summary) return null;
  const drivers = Array.isArray(scannerFragility.drivers) ? (scannerFragility.drivers as unknown[]) : [];
  const top = drivers[0] ? asRecord(drivers[0]) : null;
  const rec =
    top && typeof top.label === "string" && String(top.label).trim()
      ? String(top.label).trim()
      : "Stress-test outcomes against the surfaced fragility drivers.";
  return {
    summary,
    recommendation: rec,
    headline: "Anchored to latest fragility scan",
  };
}

function buildFragilityCompareAnchor(scannerFragility: LooseRecord | null | undefined): Record<string, unknown> | null {
  if (!scannerFragility) return null;
  const summary =
    typeof scannerFragility.summary === "string" && String(scannerFragility.summary).trim().length > 0
      ? String(scannerFragility.summary).trim()
      : "";
  if (!summary) return null;
  const drivers = Array.isArray(scannerFragility.drivers) ? (scannerFragility.drivers as unknown[]) : [];
  const options = drivers.slice(0, 4).map((d, i) => {
    const r = asRecord(d);
    return {
      id: String(r?.id ?? `driver_${i}`),
      label: String(r?.label ?? `Driver ${i + 1}`),
      score: typeof r?.score === "number" ? r.score : 0.5,
    };
  });
  if (options.length >= 2) {
    return {
      summary,
      recommendation: "Contrast emphasis across top drivers for the next cycle.",
      options,
    };
  }
  return {
    summary,
    recommendation: "Contrast stabilization vs lean posture under current fragility.",
    options: [
      { id: "stabilize", label: "Stabilize (buffers, redundancy)", score: 0.55 },
      { id: "lean", label: "Lean run (defer spend, accept risk)", score: 0.45 },
    ],
  };
}

function selectSimulationSource(args: {
  simulation: unknown;
  cockpitSimulation: unknown;
  canonicalRecommendation: unknown;
  fragilityAnchor?: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "simulation", value: args.simulation },
    { family: "cockpit_simulation", value: args.cockpitSimulation },
    { family: "canonical_recommendation", value: args.canonicalRecommendation },
  ];
  const frag = { family: "fragility_anchor", value: args.fragilityAnchor ?? null };
  const primary = firstByGuard(candidates, hasSimulationPrimary);
  const partial =
    firstByGuard(candidates, hasSimulationPartial) ??
    firstByGuard([frag], hasSimulationPartial) ??
    firstPresent([...candidates, frag]);
  return { primary, partial };
}

function selectWarRoomSource(args: {
  warRoom: unknown;
  strategicCouncil: unknown;
  canonicalRecommendation: unknown;
  compare: unknown;
  simulation: unknown;
}): { primary: SelectedSource; partial: SelectedSource; support: SelectedSource } {
  const primaryCandidates = [
    { family: "war_room", value: args.warRoom },
    { family: "strategic_council", value: args.strategicCouncil },
  ];
  return {
    primary: firstByGuard(primaryCandidates, hasWarRoomPrimary),
    partial: firstByGuard(primaryCandidates, hasWarRoomPartial) ?? firstPresent(primaryCandidates),
    support:
      firstPresent([
        { family: "canonical_recommendation", value: args.canonicalRecommendation },
        { family: "compare", value: hasComparePrimary(args.compare) ? args.compare : null },
        { family: "simulation", value: hasSimulationPrimary(args.simulation) ? args.simulation : null },
      ]) ?? null,
  };
}

function selectCompareSource(args: {
  compare: unknown;
  cockpitComparison: unknown;
  canonicalRecommendation: unknown;
  fragilityAnchor?: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "compare", value: args.compare },
    { family: "cockpit_comparison", value: args.cockpitComparison },
  ];
  const frag = { family: "fragility_compare_anchor", value: args.fragilityAnchor ?? null };
  const primary = firstByGuard(candidates, hasComparePrimary);
  const partial =
    firstByGuard(candidates, hasComparePartial) ??
    firstByGuard([frag], hasComparePartial) ??
    firstPresent([...candidates, frag]);
  return { primary, partial };
}

function selectPolicySource(args: {
  policy: unknown;
  governance: unknown;
  canonicalRecommendation: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "policy", value: args.policy },
    { family: "governance", value: args.governance },
    { family: "canonical_recommendation", value: args.canonicalRecommendation },
  ];
  return {
    primary: firstByGuard(candidates, (value) => {
      const record = asRecord(value);
      return Boolean(hasText(record?.status) && (hasText(record?.summary) || hasText(record?.what_to_do)));
    }),
    partial:
      firstByGuard(candidates, (value) => {
        const record = asRecord(value);
        return Boolean(
          hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]) || hasText(record?.status)
        );
      }) ?? firstPresent(candidates),
  };
}

function selectApprovalSource(args: {
  approval: unknown;
  governance: unknown;
  canonicalRecommendation: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "approval", value: args.approval },
    { family: "governance", value: args.governance },
    { family: "canonical_recommendation", value: args.canonicalRecommendation },
  ];
  return {
    primary: firstByGuard(candidates, (value) => {
      const record = asRecord(value);
      return Boolean(hasText(record?.status) && (hasText(record?.summary) || hasText(record?.recommendation)));
    }),
    partial:
      firstByGuard(candidates, (value) => {
        const record = asRecord(value);
        return Boolean(
          hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]) || hasText(record?.status)
        );
      }) ?? firstPresent(candidates),
  };
}

function selectConflictSource(args: {
  conflictSlice: unknown;
  responseConflicts: unknown;
  sceneConflicts: unknown;
  responseSceneConflicts: unknown;
  multiAgentConflicts: unknown;
  promptFeedbackConflicts: unknown;
  responseConflictObject: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const renderableCandidates = [
    { family: "conflict_slice", value: getConflictRenderable(args.conflictSlice) },
    { family: "response_conflicts", value: getConflictRenderable(args.responseConflicts) },
    { family: "scene_conflicts", value: getConflictRenderable(args.sceneConflicts) },
    { family: "response_scene_conflicts", value: getConflictRenderable(args.responseSceneConflicts) },
    { family: "multi_agent_conflicts", value: getConflictRenderable(args.multiAgentConflicts) },
    { family: "prompt_feedback_conflicts", value: getConflictRenderable(args.promptFeedbackConflicts) },
  ];
  const objectCandidates = [
    { family: "raw_conflict", value: args.conflictSlice },
    { family: "conflict_slice_object", value: args.conflictSlice },
    { family: "response_conflict_object", value: args.responseConflictObject },
  ];
  return {
    primary: firstByGuard(renderableCandidates, hasConflictPrimary),
    partial:
      firstPresent(renderableCandidates) ??
      firstByGuard(objectCandidates, hasConflictPartial) ??
      firstPresent(objectCandidates),
  };
}

function selectRiskSource(args: {
  risk: unknown;
  promptRisk: unknown;
  simulationRisk: unknown;
  cockpitRisk: unknown;
  executiveSummary: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "risk", value: args.risk },
    { family: "prompt_feedback_risk", value: args.promptRisk },
    { family: "simulation_risk", value: args.simulationRisk },
    { family: "cockpit_risk", value: args.cockpitRisk },
    { family: "executive_summary", value: args.executiveSummary },
  ];
  return {
    primary: firstByGuard(candidates, hasRiskPrimary),
    partial:
      firstByGuard(candidates, (value) => {
        const record = asRecord(value);
        return Boolean(hasText(record?.summary) || hasText(record?.level) || hasText(record?.risk_level));
      }) ?? firstPresent(candidates),
  };
}

function selectFragilitySource(args: {
  scannerFragility: unknown;
  risk: unknown;
  promptRisk: unknown;
  responseFragility: unknown;
  sceneFragility: unknown;
  cockpitRisk: unknown;
}): { primary: SelectedSource; partial: SelectedSource } {
  const candidates = [
    { family: "scanner_fragility", value: args.scannerFragility },
    { family: "risk", value: args.risk },
    { family: "prompt_feedback_risk", value: args.promptRisk },
    { family: "response_fragility", value: args.responseFragility },
    { family: "scene_fragility", value: args.sceneFragility },
    { family: "cockpit_risk", value: args.cockpitRisk },
  ];
  return {
    primary: firstByGuard(candidates, hasFragilityPrimary),
    partial:
      firstByGuard(candidates, (value) => {
        const record = asRecord(value);
        return Boolean(
          hasSummaryLike(record) || hasText(record?.level) || hasText(record?.risk_level) || hasText(record?.fragility_level)
        );
      }) ?? firstPresent(candidates),
  };
}

function buildResult(
  panel: ResolvedPanelName,
  args: {
    data: unknown;
    hasPrimaryData: boolean;
    hasPartialData: boolean;
    hasFallbackData: boolean;
    missingFields: string[];
  }
): PanelResolvedData {
  const status = getPanelSafeStatus({
    hasPrimaryData: args.hasPrimaryData,
    hasPartialData: args.hasPartialData,
    hasFallbackData: args.hasFallbackData,
  });

  if (status === "empty_but_guided") {
    return {
      ...buildPanelFallbackState(panel, status, args.missingFields),
      data: null,
    };
  }

  if (status === "fallback") {
    return buildPanelFallbackState(panel, status, args.missingFields);
  }

  return {
    status,
    data: args.data ?? null,
    missingFields: args.missingFields,
  };
}

export function buildPanelResolvedData(
  panel: ResolvedPanelName,
  data: PanelSharedData | null | undefined
): PanelResolvedData {
  const safeData: PanelSharedData = data ?? ({} as PanelSharedData);
  const cached = readCachedResolvedPanelResult(data, panel);
  if (cached) {
    return cached;
  }
  const promptFeedback = asRecord(safeData.promptFeedback);
  const decisionCockpit = asRecord(safeData.decisionCockpit);
  const executiveSummary = asRecord(safeData.executiveSummary);
  const dashboard = asRecord(safeData.dashboard);
  const simulation = asRecord(safeData.simulation);
  const responseData = asRecord(safeData.responseData);
  const raw = asRecord(safeData.raw);
  const sceneJson = asRecord(safeData.sceneJson);
  const responseScene = asRecord(asRecord(responseData?.scene_json)?.scene);
  const sceneState = asRecord(sceneJson?.scene);
  const scannerFragility = asRecord(responseData?.fragility_scan) ?? asRecord(raw?.fragility_scan);
  const responseFragility = asRecord(responseData?.fragility);
  const sceneFragility = asRecord(sceneState?.fragility) ?? asRecord(responseScene?.fragility);
  const responseConflicts = Array.isArray(responseData?.conflicts) ? responseData?.conflicts : null;
  const responseSceneConflicts = Array.isArray(responseScene?.conflicts) ? responseScene.conflicts : null;
  const sceneConflicts = Array.isArray(sceneState?.conflicts) ? sceneState.conflicts : null;
  const multiAgentDecision = asRecord(responseData?.multi_agent_decision);
  const multiAgentConflicts = Array.isArray(multiAgentDecision?.conflicts)
    ? multiAgentDecision.conflicts
    : null;
  const promptFeedbackMultiAgent = asRecord(promptFeedback?.multi_agent);
  const promptFeedbackConflicts = Array.isArray(promptFeedbackMultiAgent?.conflicts)
    ? promptFeedbackMultiAgent.conflicts
    : null;

  switch (panel) {
    case "advice": {
      const selected = selectAdviceSource({
        advice: safeData.advice,
        strategicAdvice: safeData.strategicAdvice,
        promptAdvice: promptFeedback?.advice_feedback,
        canonicalRecommendation: safeData.canonicalRecommendation,
        cockpitAdvice: decisionCockpit?.advice,
      });
      const selectedSource = selected.primary ?? selected.partial ?? null;
      const resolved = selectedSource?.value ?? null;
      if (!selectedSource) {
        tracePanelResolution("advice", null, null, false, false, ["recommendation", "recommended_actions", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildConcretePanelEmptyState(panel, ["recommendation", "recommended_actions", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const hasPrimaryData = hasAdvicePrimary(safeResolved);
      const hasPartialData = hasAdvicePartial(safeResolved);
      const effectiveHasPartialData = hasPartialData;
      const missingFields = [
        ...(hasPrimaryData || hasText(asRecord(safeResolved)?.recommendation) ? [] : ["recommendation"]),
        ...(hasPrimaryData ? [] : ["recommended_actions"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      if (!hasPrimaryData && !effectiveHasPartialData) {
        return cacheResolvedPanelResult(data, panel, buildConcretePanelEmptyState(panel, missingFields));
      }
      tracePanelResolution(
        "advice",
        selectedSource?.family ?? null,
        safeResolved,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "dashboard": {
      const cockpitExecutive = asRecord(decisionCockpit?.executive);
      const selected = selectDashboardSource({
        dashboard,
        decisionCockpit,
        cockpitExecutive,
        executiveSummary,
        canonicalRecommendation: safeData.canonicalRecommendation,
        decisionResult: safeData.decisionResult,
      });
      const resolved = mergeRecords([
        selected.primary?.value,
        selected.partial?.value,
        selected.support?.value,
        cockpitExecutive ? { executive: cockpitExecutive } : null,
        safeData.canonicalRecommendation ? { canonicalRecommendation: safeData.canonicalRecommendation } : null,
        safeData.decisionResult ? { decisionResult: safeData.decisionResult } : null,
        safeData.simulation ? { simulation: safeData.simulation } : null,
        safeData.compare ? { compare: safeData.compare } : null,
        Array.isArray(safeData.memoryEntries) && safeData.memoryEntries.length > 0
          ? { memoryEntries: safeData.memoryEntries }
          : null,
      ]);
      const supportBackedPartial = !selected.primary && !selected.partial && hasAnyRenderableFamilyRecord(resolved);
      if (!selected.primary && !selected.partial && !supportBackedPartial) {
        warnPanelDataLeakPrevented(panel, {
          reason: "no_dashboard_family_source",
          missingFields: ["executive_context", "summary"],
          candidateShapes: {
            dashboard: describeResolvedShape(dashboard),
            decisionCockpit: describeResolvedShape(decisionCockpit),
            cockpitExecutive: describeResolvedShape(cockpitExecutive),
            executiveSummary: describeResolvedShape(executiveSummary),
            canonicalRecommendation: describeResolvedShape(safeData.canonicalRecommendation),
            decisionResult: describeResolvedShape(safeData.decisionResult),
          },
        });
        tracePanelResolution("dashboard", selected.support?.family ?? null, null, false, false, ["executive_context", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildPanelFallbackState(panel, "empty_but_guided", ["executive_context", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData = hasExecutivePrimary(safeResolved);
      const hasPartialData =
        hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]) ||
        hasText(record?.recommendation) ||
        hasText(record?.action) ||
        hasText(asRecord(asRecord(record?.canonicalRecommendation)?.primary)?.action);
      const weakPartialAccepted =
        !hasPrimaryData &&
        !hasPartialData &&
        hasAnyRenderableFamilyRecord(safeResolved);
      const effectiveHasPartialData = hasPartialData || weakPartialAccepted || supportBackedPartial;
      const missingFields = [
        ...(hasPrimaryData ? [] : ["executive_context"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      tracePanelResolution(
        "dashboard",
        selected.primary?.family ?? selected.partial?.family ?? selected.support?.family ?? null,
        safeResolved,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "risk": {
      const selected = selectRiskSource({
        risk: safeData.risk,
        promptRisk: promptFeedback?.risk_feedback,
        simulationRisk: simulation?.risk,
        cockpitRisk: decisionCockpit?.risk,
        executiveSummary,
      });
      const resolved =
        selected.primary?.value ?? selected.partial?.value ?? pickResolverFallback(safeData);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData = hasRiskPrimary(safeResolved);
      const hasPartialData = Boolean(hasText(record?.summary) || hasText(record?.level) || hasText(record?.risk_level));
      const missingFields = [
        ...(hasPrimaryData ? [] : ["risk_context"]),
        ...(hasPartialData ? [] : ["summary"]),
      ];
      tracePanelResolution(
        "risk",
        selected.primary?.family ?? selected.partial?.family ?? null,
        safeResolved,
        hasPrimaryData,
        hasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "fragility": {
      const selected = selectFragilitySource({
        scannerFragility,
        risk: safeData.risk,
        promptRisk: promptFeedback?.risk_feedback,
        responseFragility,
        sceneFragility,
        cockpitRisk: decisionCockpit?.risk,
      });
      const resolved =
        selected.primary?.value ?? selected.partial?.value ?? pickResolverFallback(safeData);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData = hasFragilityPrimary(safeResolved);
      const hasPartialData =
        hasSummaryLike(record) ||
        hasText(record?.level) ||
        hasText(record?.risk_level) ||
        hasText(record?.fragility_level);
      const missingFields = [
        ...(hasPrimaryData ? [] : ["fragility_drivers"]),
        ...(hasPartialData ? [] : ["summary"]),
      ];
      tracePanelResolution(
        "fragility",
        selected.primary?.family ?? selected.partial?.family ?? null,
        safeResolved,
        hasPrimaryData,
        hasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "timeline": {
      const selected = selectTimelineSource({
        timeline: safeData.timeline,
        promptTimeline: promptFeedback?.timeline_feedback,
        simulationTimeline: getTimelineLikeSource(simulation?.timeline ?? simulation),
        simulation: getTimelineLikeSource(safeData.simulation),
        cockpitComparison: getTimelineLikeSource(decisionCockpit?.comparison),
      });
      const selectedSource = selected.primary ?? selected.partial ?? null;
      const resolved = selectedSource?.value ?? null;
      if (!selectedSource) {
        tracePanelResolution("timeline", null, null, false, false, ["timeline", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildConcretePanelEmptyState(panel, ["timeline", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const hasPrimaryData = hasTimelinePrimary(safeResolved);
      const hasPartialData = hasTimelinePartial(safeResolved);
      const effectiveHasPartialData = hasPartialData;
      const missingFields = [
        ...(hasPrimaryData ? [] : ["timeline"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      if (!hasPrimaryData && !effectiveHasPartialData) {
        return cacheResolvedPanelResult(data, panel, buildConcretePanelEmptyState(panel, missingFields));
      }
      tracePanelResolution(
        "timeline",
        selectedSource?.family ?? null,
        safeResolved,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "simulate": {
      const fragilitySimAnchor = buildFragilitySimulationAnchor(scannerFragility);
      const selected = selectSimulationSource({
        simulation: safeData.simulation,
        cockpitSimulation: decisionCockpit?.simulation,
        canonicalRecommendation: safeData.canonicalRecommendation,
        fragilityAnchor: fragilitySimAnchor,
      });
      const selectedSource = selected.primary ?? selected.partial ?? null;
      const resolved = selectedSource?.value ?? null;
      if (!selectedSource) {
        warnPanelDataLeakPrevented(panel, {
          reason: "no_simulation_family_source",
          missingFields: ["simulation", "summary"],
          candidateShapes: {
            simulation: describeResolvedShape(safeData.simulation),
            cockpitSimulation: describeResolvedShape(decisionCockpit?.simulation),
            canonicalRecommendation: describeResolvedShape(safeData.canonicalRecommendation),
          },
        });
        tracePanelResolution("simulate", null, null, false, false, ["simulation", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildPanelFallbackState(panel, "empty_but_guided", ["simulation", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const b8Sim = extractNexoraB8FromSharedData(safeData);
      const mergedSim: LooseRecord = { ...(asRecord(safeResolved) ?? {}) };
      if (b8Sim) {
        if (!hasText(mergedSim.summary)) {
          const stub = buildSimulationStubSummary(b8Sim);
          if (stub) mergedSim.summary = stub;
        }
        traceNexoraB9PanelMeaningEnriched("simulate", b8Sim);
      }
      maybeInjectNexoraB18ScenarioData({ safeData, target: mergedSim, mode: "simulate" });
      const b18SimRec = asRecord(mergedSim.nexoraB18Simulate);
      const b18SimHasVariants = Boolean(
        b18SimRec && Array.isArray(b18SimRec.variants) && (b18SimRec.variants as unknown[]).length > 0
      );
      const hasPrimaryData = hasSimulationPrimary(mergedSim);
      const hasPartialData = hasSimulationPartial(mergedSim);
      const weakPartialAccepted =
        !hasPrimaryData &&
        !hasPartialData &&
        hasAnyRenderableFamilyRecord(mergedSim);
      const effectiveHasPartialData = hasPartialData || weakPartialAccepted || b18SimHasVariants;
      const missingFields = [
        ...(hasPrimaryData ? [] : ["simulation"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      if (!hasPrimaryData && (hasPartialData || weakPartialAccepted)) {
        traceWeakPartialAccepted("simulate", selectedSource?.family ?? null, mergedSim, missingFields);
      }
      tracePanelResolution(
        "simulate",
        selectedSource?.family ?? null,
        mergedSim,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: mergedSim,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "war_room": {
      const selected = selectWarRoomSource({
        warRoom: safeData.warRoom,
        strategicCouncil: safeData.strategicCouncil,
        canonicalRecommendation: safeData.canonicalRecommendation,
        compare: safeData.compare,
        simulation: safeData.simulation,
      });
      const resolved = mergeRecords([
        selected.primary?.value,
        selected.partial?.value,
        selected.support?.value,
        safeData.canonicalRecommendation ? { canonicalRecommendation: safeData.canonicalRecommendation } : null,
        safeData.compare ? { compare: safeData.compare } : null,
        safeData.simulation ? { simulation: safeData.simulation } : null,
      ]);
      if (!selected.primary && !selected.partial) {
        tracePanelResolution("war_room", selected.support?.family ?? null, null, false, false, ["war_room_context", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildConcretePanelEmptyState(panel, ["war_room_context", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const hasPrimaryData = hasWarRoomPrimary(safeResolved);
      const hasPartialData = hasWarRoomPartial(safeResolved);
      const effectiveHasPartialData = hasPartialData;
      const missingFields = [
        ...(hasPrimaryData ? [] : ["war_room_context"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      if (!hasPrimaryData && !effectiveHasPartialData) {
        return cacheResolvedPanelResult(data, panel, buildConcretePanelEmptyState(panel, missingFields));
      }
      tracePanelResolution(
        "war_room",
        selected.primary?.family ?? selected.partial?.family ?? selected.support?.family ?? null,
        safeResolved,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "compare": {
      const fragilityCompareAnchor = buildFragilityCompareAnchor(scannerFragility);
      const selected = selectCompareSource({
        compare: safeData.compare,
        cockpitComparison: decisionCockpit?.comparison,
        canonicalRecommendation: safeData.canonicalRecommendation,
        fragilityAnchor: fragilityCompareAnchor,
      });
      const selectedSource = selected.primary ?? selected.partial ?? null;
      const resolved = selectedSource?.value ?? null;
      if (!selectedSource) {
        warnPanelDataLeakPrevented(panel, {
          reason: "no_compare_family_source",
          missingFields: ["options", "summary"],
          candidateShapes: {
            compare: describeResolvedShape(safeData.compare),
            cockpitComparison: describeResolvedShape(decisionCockpit?.comparison),
          },
        });
        tracePanelResolution("compare", null, null, false, false, ["options", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildPanelFallbackState(panel, "empty_but_guided", ["options", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const b8Cmp = extractNexoraB8FromSharedData(safeData);
      const mergedCmp: LooseRecord = { ...(asRecord(safeResolved) ?? {}) };
      if (b8Cmp) {
        if (!hasText(mergedCmp.summary)) {
          const stub = buildCompareAnchorSummary(b8Cmp);
          if (stub) mergedCmp.summary = stub;
        }
        traceNexoraB9PanelMeaningEnriched("compare", b8Cmp);
      }
      maybeInjectNexoraB18ScenarioData({ safeData, target: mergedCmp, mode: "compare" });
      const b18CmpRec = asRecord(mergedCmp.nexoraB18Compare);
      const b18CmpHasVariants = Boolean(
        b18CmpRec && Array.isArray(b18CmpRec.variants) && (b18CmpRec.variants as unknown[]).length > 0
      );
      const hasPrimaryData = hasComparePrimary(mergedCmp);
      const hasPartialData = hasComparePartial(mergedCmp);
      const weakPartialAccepted =
        !hasPrimaryData &&
        !hasPartialData &&
        hasAnyRenderableFamilyRecord(mergedCmp);
      const effectiveHasPartialData = hasPartialData || weakPartialAccepted || b18CmpHasVariants;
      const missingFields = [
        ...(hasPrimaryData ? [] : ["options"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      if (!hasPrimaryData && (hasPartialData || weakPartialAccepted)) {
        traceWeakPartialAccepted("compare", selectedSource?.family ?? null, mergedCmp, missingFields);
      }
      tracePanelResolution(
        "compare",
        selectedSource?.family ?? null,
        mergedCmp,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: mergedCmp,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "decision_policy": {
      const selected = selectPolicySource({
        policy: safeData.policy,
        governance: safeData.governance,
        canonicalRecommendation: safeData.canonicalRecommendation,
      });
      const resolved =
        selected.primary?.value ?? selected.partial?.value ?? pickResolverFallback(safeData);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData = Boolean(hasText(record?.status) && (hasText(record?.summary) || hasText(record?.what_to_do)));
      const hasPartialData = Boolean(
        hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]) || hasText(record?.status)
      );
      const missingFields = [
        ...(hasPrimaryData ? [] : ["policy_status"]),
        ...(hasPartialData ? [] : ["summary"]),
      ];
      tracePanelResolution(
        "decision_policy",
        selected.primary?.family ?? selected.partial?.family ?? null,
        safeResolved,
        hasPrimaryData,
        hasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "executive_approval": {
      const selected = selectApprovalSource({
        approval: safeData.approval,
        governance: safeData.governance,
        canonicalRecommendation: safeData.canonicalRecommendation,
      });
      const resolved =
        selected.primary?.value ?? selected.partial?.value ?? pickResolverFallback(safeData);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData = Boolean(hasText(record?.status) && (hasText(record?.summary) || hasText(record?.recommendation)));
      const hasPartialData = Boolean(
        hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]) || hasText(record?.status)
      );
      const missingFields = [
        ...(hasPrimaryData ? [] : ["approval_status"]),
        ...(hasPartialData ? [] : ["summary"]),
      ];
      tracePanelResolution(
        "executive_approval",
        selected.primary?.family ?? selected.partial?.family ?? null,
        safeResolved,
        hasPrimaryData,
        hasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "conflict": {
      const selected = selectConflictSource({
        conflictSlice: safeData.conflict,
        responseConflicts,
        sceneConflicts,
        responseSceneConflicts,
        multiAgentConflicts,
        promptFeedbackConflicts,
        responseConflictObject: responseData?.conflict,
      });
      const selectedSource = selected.primary ?? selected.partial ?? null;
      const resolved = selectedSource?.value ?? null;
      if (!selectedSource) {
        warnPanelDataLeakPrevented(panel, {
          reason: "no_conflict_family_source",
          missingFields: ["conflict_context", "summary"],
          candidateShapes: {
            conflictSlice: describeResolvedShape(safeData.conflict),
            responseConflicts: describeResolvedShape(responseConflicts),
            sceneConflicts: describeResolvedShape(sceneConflicts),
            responseSceneConflicts: describeResolvedShape(responseSceneConflicts),
            multiAgentConflicts: describeResolvedShape(multiAgentConflicts),
            promptFeedbackConflicts: describeResolvedShape(promptFeedbackConflicts),
            responseConflictObject: describeResolvedShape(responseData?.conflict),
          },
        });
        tracePanelResolution("conflict", null, null, false, false, ["conflict_context", "summary"]);
        return cacheResolvedPanelResult(data, panel, buildPanelFallbackState(panel, "empty_but_guided", ["conflict_context", "summary"]));
      }
      const safeResolved = resolved ?? {};
      const hasPrimaryData = hasConflictPrimary(safeResolved);
      const hasPartialData = hasConflictPartial(safeResolved);
      const weakPartialAccepted =
        !hasPrimaryData &&
        !hasPartialData &&
        (hasAnyRenderableArray(safeResolved) || hasConflictPartial(safeResolved));
      const effectiveHasPartialData = hasPartialData || weakPartialAccepted;
      const missingFields = [
        ...(hasPrimaryData ? [] : ["conflict_context"]),
        ...(effectiveHasPartialData ? [] : ["summary"]),
      ];
      if (!hasPrimaryData && (hasPartialData || weakPartialAccepted)) {
        traceWeakPartialAccepted("conflict", selectedSource?.family ?? null, safeResolved, missingFields);
      }
      tracePanelResolution(
        "conflict",
        selectedSource?.family ?? null,
        safeResolved,
        hasPrimaryData,
        effectiveHasPartialData,
        missingFields
      );
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields,
      }));
    }
    case "strategic_command": {
      const resolved = pickFirst([
        safeData.strategicCommand,
        decisionCockpit?.executive,
        safeData.canonicalRecommendation,
        executiveSummary,
      ]);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData = hasExecutivePrimary(safeResolved);
      const hasPartialData = hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]);
      const effectiveHasPartialData =
        hasPartialData || (!hasPrimaryData && !hasPartialData && hasAnyRenderableFamilyRecord(safeResolved));
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: ["summary"],
      }));
    }
    case "decision_governance": {
      const resolved = pickFirst([
        safeData.governance,
        safeData.canonicalRecommendation,
        executiveSummary,
      ]);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData =
        hasText(record?.summary) && (hasText(record?.what_to_do) || hasText(record?.why_it_matters));
      const hasPartialData = hasSummaryLike(record, ["summary", "happened", "why_it_matters", "what_to_do"]);
      const effectiveHasPartialData =
        hasPartialData || (!hasPrimaryData && !hasPartialData && hasAnyRenderableFamilyRecord(safeResolved));
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: ["governance_context"],
      }));
    }
    case "decision_council": {
      const resolved = pickFirst([
        safeData.strategicCouncil,
        safeData.canonicalRecommendation,
        safeData.compare,
      ]);
      const safeResolved = resolved ?? {};
      const record = asRecord(safeResolved);
      const hasPrimaryData =
        hasText(record?.recommendation) && (hasText(record?.summary) || hasItems(record?.options));
      const hasPartialData = hasSummaryLike(record) || hasText(record?.recommendation);
      const effectiveHasPartialData =
        hasPartialData || (!hasPrimaryData && !hasPartialData && hasAnyRenderableFamilyRecord(safeResolved));
      return cacheResolvedPanelResult(data, panel, buildResult(panel, {
        data: safeResolved,
        hasPrimaryData,
        hasPartialData: effectiveHasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: ["council_guidance"],
      }));
    }
    case "input": {
      return cacheResolvedPanelResult(
        data,
        panel,
        buildResult(panel, {
          data: { entry: "source_control" },
          hasPrimaryData: true,
          hasPartialData: true,
          hasFallbackData: true,
          missingFields: [],
        })
      );
    }
    default:
      return cacheResolvedPanelResult(data, panel, buildPanelFallbackState(panel, "fallback", ["unsupported_panel"]));
  }
}
