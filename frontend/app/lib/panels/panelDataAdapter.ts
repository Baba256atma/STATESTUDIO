import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { PanelSharedData } from "./panelDataResolverTypes";
import type {
  AdvicePanelData,
  CanonicalPanelData,
  CanonicalWarRoomPanelData,
  ConflictPanelData,
  CouncilPanelData,
  TimelinePanelData,
  WarRoomPanelData,
} from "./panelDataContract";
import { normalizeCanonicalAdvicePanelData } from "./adviceAdapter";
import {
  normalizeCanonicalTimelinePanelData,
  normalizeCanonicalWarRoomPanelData,
} from "./panelSliceNormalizer";

type LooseRecord = Record<string, unknown>;

export type BuildMergedPanelDataInput = {
  panelData: PanelSharedData;
  responseData?: any;
  sceneJson?: any;
  strategicAdvice?: any;
  riskPropagation?: any;
  conflicts?: any[] | null;
  decisionResult?: any;
  memoryInsights?: any;
  warRoomIntelligence?: any;
  strategicCouncil?: any;
  decisionCockpit?: any;
  decisionMemoryEntries?: DecisionMemoryEntry[];
  canonicalRecommendation?: unknown;
  normalizedWarRoomPanelData?: CanonicalWarRoomPanelData | null;
  normalizedStrategicCouncil?: CouncilPanelData | null;
};

export type BuildCanonicalPanelPayloadInput = {
  panelData: PanelSharedData;
  responseData?: any;
  sceneJson?: any;
  strategicAdvice?: any;
  canonicalRecommendation?: unknown;
};

const EMPTY_CANONICAL_PANEL_DATA: CanonicalPanelData = Object.freeze({
  advice: null,
  timeline: null,
  warRoom: null,
});
const EMPTY_MEMORY_ENTRIES: DecisionMemoryEntry[] = [];
const canonicalPanelDataCache = new WeakMap<object, CanonicalPanelData>();
const mergedPanelDataCache = new WeakMap<
  object,
  {
    deps: unknown[];
    signature: string;
    result: PanelSharedData;
  }
>();
const canonicalPanelPayloadCache = new WeakMap<
  object,
  {
    deps: unknown[];
    signature: string;
    result: Record<string, unknown>;
  }
>();
let lastPanelDataAdapterSignature: string | null = null;
let lastComposerTraceSignature: string | null = null;
let lastComposerFamiliesSignature: string | null = null;

function areDepsEqual(left: unknown[], right: unknown[]) {
  return left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
}

function shallowEqualRecord(
  left: Record<string, unknown> | null | undefined,
  right: Record<string, unknown> | null | undefined
) {
  if (left === right) return true;
  if (!left || !right) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every((key) => Object.is(left[key], right[key]));
}

function stableSerialize(value: unknown): string {
  try {
    return JSON.stringify(value, (_key, current) => {
      if (current && typeof current === "object" && !Array.isArray(current)) {
        const record = current as Record<string, unknown>;
        return Object.keys(record)
          .sort()
          .reduce<Record<string, unknown>>((acc, key) => {
            acc[key] = record[key];
            return acc;
          }, {});
      }
      return current;
    }) ?? "null";
  } catch {
    return "[unserializable]";
  }
}

function buildMergedPanelDataSignature(value: PanelSharedData): string {
  return stableSerialize({
    dashboard: value.dashboard ?? null,
    advice: value.advice ?? null,
    strategicAdvice: value.strategicAdvice ?? null,
    decisionCockpit: value.decisionCockpit ?? null,
    executiveSummary: value.executiveSummary ?? null,
    simulation: value.simulation ?? null,
    timeline: value.timeline ?? null,
    risk: value.risk ?? null,
    fragility: value.fragility ?? null,
    conflict: value.conflict ?? null,
    memory: value.memory ?? null,
    canonicalRecommendation: value.canonicalRecommendation ?? null,
    decisionResult: value.decisionResult ?? null,
    warRoom: value.warRoom ?? null,
    compare: value.compare ?? null,
    governance: value.governance ?? null,
    approval: value.approval ?? null,
    policy: value.policy ?? null,
    strategicCouncil: value.strategicCouncil ?? null,
    memoryEntries: Array.isArray(value.memoryEntries)
      ? value.memoryEntries.map((entry) => ({
          id: (entry as Record<string, unknown>)?.id ?? null,
          decision_id: (entry as Record<string, unknown>)?.decision_id ?? null,
          timestamp: (entry as Record<string, unknown>)?.timestamp ?? null,
        }))
      : [],
  });
}

function buildCanonicalPayloadSignature(value: Record<string, unknown>): string {
  return stableSerialize(value);
}

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function asNonArrayRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function pickFirstDefined<T>(...values: Array<T | null | undefined>): T | null {
  for (const value of values) {
    if (value != null) return value;
  }
  return null;
}

function describeFamilyShape(value: unknown) {
  if (Array.isArray(value)) {
    return { present: value.length > 0, shape: "array", size: value.length };
  }
  const record = asNonArrayRecord(value);
  if (record) {
    const size = Object.keys(record).length;
    return { present: size > 0, shape: "object", size };
  }
  return { present: Boolean(value), shape: value == null ? "null" : typeof value, size: 0 };
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length ? value.trim() : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getStringArray(value: unknown, limit = 6): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((entry) => getString(entry)).filter((entry): entry is string => Boolean(entry)))
  ).slice(0, limit);
}

function pickFragilityScan(input: unknown): LooseRecord | null {
  const record = asRecord(input);
  if (!record) return null;
  const nested = asRecord(record.fragility_scan);
  if (nested) return nested;
  if (record.advice_slice || record.timeline_slice || record.war_room_slice) return record;
  return null;
}

function collectObjectIds(scanner: LooseRecord | null): string[] {
  const impactSet = asRecord(scanner?.object_impacts);
  if (!impactSet) return [];
  return Array.from(
    new Set(
      ["primary", "affected", "context"].flatMap((role) => {
        const entries = Array.isArray(impactSet[role]) ? impactSet[role] : [];
        return entries
          .map((entry) => asRecord(entry)?.object_id)
          .map((entry) => getString(entry))
          .filter((entry): entry is string => Boolean(entry));
      })
    )
  );
}

function collectDriverLabels(scanner: LooseRecord | null): string[] {
  const drivers = Array.isArray(scanner?.drivers) ? scanner.drivers : [];
  return Array.from(
    new Set(
      drivers
        .map((driver) => getString(asRecord(driver)?.label) ?? getString(asRecord(driver)?.id))
        .filter((label): label is string => Boolean(label))
    )
  ).slice(0, 5);
}

function buildAdviceSlice(scanner: LooseRecord | null): AdvicePanelData | null {
  if (!scanner) return null;
  const adviceSlice = asRecord(scanner.advice_slice);
  if (!adviceSlice) return null;

  const summary =
    getString(adviceSlice.summary) ??
    getString(asRecord(scanner.summary_detail)?.text) ??
    getString(scanner.summary);
  const recommendations = getStringArray(adviceSlice.recommendations, 4);
  const relatedObjectIds = collectObjectIds(scanner).slice(0, 4);
  const supportingDriverLabels = collectDriverLabels(scanner);
  const primaryRecommendation = recommendations[0] ?? null;

  return normalizeCanonicalAdvicePanelData(adviceSlice, {
    defaultTitle: "Advice",
    fallbackSummary: summary,
    fallbackWhy: getString(scanner.summary),
    fallbackRecommendation: primaryRecommendation,
    fallbackRiskSummary: supportingDriverLabels.length
      ? `Primary drivers: ${supportingDriverLabels.slice(0, 3).join(", ")}.`
      : getString(scanner.fragility_level),
    fallbackRecommendations: recommendations,
    fallbackRelatedObjectIds: relatedObjectIds,
    fallbackSupportingDriverLabels: supportingDriverLabels,
    fallbackRecommendedActions: recommendations.map((action) => ({
      action,
      impact_summary: summary,
      tradeoff: null,
    })),
    fallbackPrimaryRecommendation: primaryRecommendation ? { action: primaryRecommendation } : null,
    fallbackConfidence: {
      level: getNumber(asRecord(scanner.summary_detail)?.confidence) ?? undefined,
      score: getNumber(scanner.fragility_score) ?? undefined,
    },
  });
}

function buildTimelineSlice(scanner: LooseRecord | null): TimelinePanelData | null {
  if (!scanner) return null;
  const timelineSlice = asRecord(scanner.timeline_slice);
  if (!timelineSlice) return null;
  return normalizeCanonicalTimelinePanelData(timelineSlice, {
    fallbackHeadline: "Timeline",
    fallbackSummary: "No risk progression timeline available yet.",
    fallbackRelatedObjectIds: collectObjectIds(scanner).slice(0, 5),
  });
}

function buildWarRoomSlice(scanner: LooseRecord | null, advice: AdvicePanelData | null): WarRoomPanelData | null {
  if (!scanner) return null;
  const warRoomSlice = asRecord(scanner.war_room_slice);
  if (!warRoomSlice) return null;

  const executiveSummary = getString(scanner.summary);
  const normalized = normalizeCanonicalWarRoomPanelData(warRoomSlice, {
    fallbackSummary: executiveSummary,
    fallbackRecommendation: advice?.recommendation ?? null,
    fallbackExecutiveSummary: executiveSummary,
    fallbackAdviceSummary: advice?.summary ?? null,
    fallbackCompareSummary: null,
    fallbackRelatedObjectIds: collectObjectIds(scanner).slice(0, 5),
  });
  if (!normalized) return null;

  return {
    ...normalized,
    strategic_advice: advice,
    executive_summary_surface: {
      summary: executiveSummary,
      happened: normalized.risks?.[0] ?? executiveSummary,
      why_it_matters: normalized.posture,
      what_to_do: advice?.recommendation ?? advice?.recommendations?.[0] ?? null,
    },
    fragility: {
      score: getNumber(scanner.fragility_score) ?? 0,
      level: getString(scanner.fragility_level) ?? "low",
      drivers: collectDriverLabels(scanner),
    },
  };
}

function coerceConflictFamilyInput(...values: unknown[]): ConflictPanelData | null {
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) {
      return {
        summary: null,
        level: null,
        headline: null,
        posture: null,
        drivers: [],
        sources: [],
        edges: [],
        conflicts: value,
      };
    }
    const record = asNonArrayRecord(value);
    if (record) {
      return {
        summary: typeof record.summary === "string" ? record.summary : null,
        level:
          typeof record.level === "string"
            ? record.level
            : typeof record.risk_level === "string"
              ? record.risk_level
              : null,
        headline: typeof record.headline === "string" ? record.headline : null,
        posture: typeof record.posture === "string" ? record.posture : null,
        drivers: Array.isArray(record.drivers) ? record.drivers : [],
        sources: Array.isArray(record.sources) ? record.sources.map(String) : [],
        edges: Array.isArray(record.edges) ? record.edges : [],
        ...record,
      };
    }
  }
  return null;
}

function pickDashboardFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.dashboard,
    input.panelData.decisionCockpit,
    input.panelData.executiveSummary,
    input.decisionCockpit,
    input.responseData?.decision_cockpit,
    input.responseData?.executive_summary_surface,
    input.responseData?.executive_insight,
    input.sceneJson?.decision_cockpit,
    input.sceneJson?.executive_summary_surface,
    asNonArrayRecord(input.decisionResult),
    asNonArrayRecord(input.canonicalRecommendation)
  );
}

function pickTimelineFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.timeline,
    input.responseData?.timeline_impact,
    input.responseData?.timeline,
    input.responseData?.decision_timeline,
    input.responseData?.timeline_slice,
    input.responseData?.decision_result?.timeline,
    input.responseData?.decision_result?.timeline_slice,
    input.responseData?.decision_simulation?.timeline,
    input.responseData?.simulation?.timeline,
    input.responseData?.multi_agent_decision?.timeline,
    input.sceneJson?.timeline,
    input.sceneJson?.scene?.timeline,
    input.sceneJson?.timeline_impact,
    input.decisionResult?.timeline_slice
  );
}

function pickSimulationFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.simulation,
    input.responseData?.decision_simulation,
    input.responseData?.decision_simulation?.result,
    input.responseData?.simulation,
    input.responseData?.simulation_result,
    input.responseData?.scenario_simulation,
    input.responseData?.multi_agent_decision?.simulation,
    input.responseData?.decision_result?.simulation_result,
    input.sceneJson?.simulation,
    input.sceneJson?.scene?.simulation,
    input.decisionResult?.simulation_result
  );
}

function pickAdviceFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.advice,
    input.panelData.strategicAdvice,
    input.strategicAdvice,
    input.responseData?.advice_slice,
    input.responseData?.strategic_advice,
    input.responseData?.prompt_feedback?.advice_feedback,
    input.responseData?.canonical_recommendation,
    input.sceneJson?.strategic_advice
  );
}

function pickWarRoomFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.warRoom,
    input.normalizedWarRoomPanelData,
    input.responseData?.war_room,
    input.responseData?.war_room_slice,
    input.responseData?.multi_agent_decision,
    input.warRoomIntelligence,
    input.sceneJson?.war_room,
    input.sceneJson?.multi_agent_decision
  );
}

function pickRiskFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.risk,
    input.riskPropagation,
    input.responseData?.risk_propagation,
    input.responseData?.context?.risk_propagation,
    input.sceneJson?.risk_propagation,
    input.sceneJson?.scene?.risk_propagation
  );
}

function pickFragilityFamilyInput(input: BuildMergedPanelDataInput) {
  return pickFirstDefined(
    input.panelData.fragility,
    input.responseData?.fragility,
    input.responseData?.fragility_scan,
    input.sceneJson?.scene?.fragility,
    input.sceneJson?.fragility
  );
}

export function buildCanonicalPanelData(input: unknown): CanonicalPanelData {
  if (input && typeof input === "object") {
    const cached = canonicalPanelDataCache.get(input as object);
    if (cached) {
      return cached;
    }
  }
  const scanner = pickFragilityScan(input);
  const advice = buildAdviceSlice(scanner);
  const timeline = buildTimelineSlice(scanner);
  const warRoom = buildWarRoomSlice(scanner, advice);

  if (process.env.NODE_ENV !== "production") {
    const signature = JSON.stringify({
      source: scanner ? "scanner_truth" : "none",
      hasAdvice: Boolean(advice),
      hasTimeline: Boolean(timeline?.events?.length),
      hasWarRoom: Boolean(warRoom),
    });
    if (lastPanelDataAdapterSignature !== signature) {
      lastPanelDataAdapterSignature = signature;
      console.log("[Nexora][PanelDataAdapter]", JSON.parse(signature));
    }
  }

  const result =
    advice || timeline || warRoom
      ? {
          advice,
          timeline,
          warRoom,
        }
      : EMPTY_CANONICAL_PANEL_DATA;

  if (input && typeof input === "object") {
    canonicalPanelDataCache.set(input as object, result);
  }

  return result;
}

export function buildMergedPanelData(input: BuildMergedPanelDataInput): PanelSharedData {
  const DEBUG_PANEL_TRACE = process.env.NODE_ENV !== "production";
  const cacheKey = input.panelData as object;
  const deps = [
    input.responseData,
    input.sceneJson,
    input.strategicAdvice,
    input.riskPropagation,
    input.conflicts,
    input.decisionResult,
    input.memoryInsights,
    input.warRoomIntelligence,
    input.strategicCouncil,
    input.decisionCockpit,
    input.decisionMemoryEntries,
    input.canonicalRecommendation,
    input.normalizedWarRoomPanelData,
    input.normalizedStrategicCouncil,
  ];
  const cached = mergedPanelDataCache.get(cacheKey);
  if (cached && areDepsEqual(cached.deps, deps)) {
    return cached.result;
  }

  const panelData = input.panelData;
  const dashboardFamily = pickDashboardFamilyInput(input);
  const adviceFamily = pickAdviceFamilyInput(input);
  const strategicAdviceFamily = pickFirstDefined(
    panelData.strategicAdvice,
    input.strategicAdvice,
    input.responseData?.advice_slice,
    input.responseData?.strategic_advice,
    input.responseData?.prompt_feedback?.advice_feedback,
    input.responseData?.canonical_recommendation,
    input.sceneJson?.strategic_advice
  );
  const decisionCockpitFamily = pickFirstDefined(
    panelData.decisionCockpit,
    input.decisionCockpit,
    input.responseData?.decision_cockpit
  );
  const executiveSummaryFamily = pickFirstDefined(
    panelData.executiveSummary,
    input.responseData?.executive_summary_surface,
    input.responseData?.executive_insight
  );
  const simulationFamily = pickSimulationFamilyInput(input);
  const timelineFamily = pickTimelineFamilyInput(input);
  const warRoomFamily = pickWarRoomFamilyInput(input);
  const riskFamily = pickRiskFamilyInput(input);
  const fragilityFamily = pickFragilityFamilyInput(input);
  const conflictFamily = coerceConflictFamilyInput(
    panelData.conflict,
    input.responseData?.conflict,
    input.responseData?.conflicts,
    input.responseData?.multi_agent_decision?.conflicts,
    input.sceneJson?.scene?.conflicts,
    input.conflicts
  );

  const merged: PanelSharedData = {
    ...panelData,
    dashboard: dashboardFamily,
    advice: adviceFamily,
    strategicAdvice: strategicAdviceFamily,
    decisionCockpit: decisionCockpitFamily,
    executiveSummary: executiveSummaryFamily,
    simulation: simulationFamily,
    timeline: timelineFamily,
    risk: riskFamily,
    fragility: fragilityFamily,
    conflict: conflictFamily,
    memory: panelData.memory ?? input.memoryInsights ?? null,
    canonicalRecommendation: panelData.canonicalRecommendation ?? input.canonicalRecommendation ?? null,
    decisionResult: panelData.decisionResult ?? input.decisionResult ?? null,
    warRoom: warRoomFamily,
    compare:
      panelData.compare ??
      input.responseData?.decision_comparison ??
      input.responseData?.comparison ??
      input.decisionResult?.comparison_result ??
      null,
    governance: panelData.governance ?? input.responseData?.decision_governance ?? null,
    approval: panelData.approval ?? input.responseData?.approval_workflow ?? null,
    policy: panelData.policy ?? input.responseData?.decision_policy ?? null,
    strategicCouncil: panelData.strategicCouncil ?? input.normalizedStrategicCouncil ?? null,
    memoryEntries: panelData.memoryEntries ?? input.decisionMemoryEntries ?? EMPTY_MEMORY_ENTRIES,
  };

  if (DEBUG_PANEL_TRACE) {
    const tracePayload = {
      dashboard: Boolean(dashboardFamily),
      advice: Boolean(adviceFamily || strategicAdviceFamily),
      timeline: Boolean(timelineFamily),
      simulation: Boolean(simulationFamily),
      risk: Boolean(riskFamily),
      fragility: Boolean(fragilityFamily),
      conflict: Boolean(conflictFamily),
      warRoom: Boolean(warRoomFamily),
      conflictWrappedArray: Array.isArray(input.responseData?.conflicts) || Array.isArray(input.conflicts),
      conflictSource:
        panelData.conflict ? "panelData" :
        input.responseData?.conflict ? "responseData.conflict" :
        Array.isArray(input.responseData?.conflicts) ? "responseData.conflicts" :
        Array.isArray(input.responseData?.multi_agent_decision?.conflicts) ? "responseData.multi_agent_decision.conflicts" :
        Array.isArray(input.conflicts) ? "props.conflicts" :
        "none",
    };
    const traceSignature = JSON.stringify(tracePayload);
    if (lastComposerTraceSignature !== traceSignature) {
      lastComposerTraceSignature = traceSignature;
      console.log("[Nexora][Trace][PanelComposer]", tracePayload);
    }
    const familiesPayload = {
      dashboard: describeFamilyShape(merged.dashboard),
      advice: describeFamilyShape(merged.advice),
      strategicAdvice: describeFamilyShape(merged.strategicAdvice),
      timeline: describeFamilyShape(merged.timeline),
      simulation: describeFamilyShape(merged.simulation),
      warRoom: describeFamilyShape(merged.warRoom),
      compare: describeFamilyShape(merged.compare),
      conflict: describeFamilyShape(merged.conflict),
      risk: describeFamilyShape(merged.risk),
      fragility: describeFamilyShape(merged.fragility),
      governance: describeFamilyShape(merged.governance),
      approval: describeFamilyShape(merged.approval),
      policy: describeFamilyShape(merged.policy),
    };
    const familiesSignature = JSON.stringify(familiesPayload);
    if (lastComposerFamiliesSignature !== familiesSignature) {
      lastComposerFamiliesSignature = familiesSignature;
      console.log("[Nexora][Trace][PanelComposerFamilies]", familiesPayload);
    }
  }

  const result =
    cached && (cached.signature === buildMergedPanelDataSignature(merged) || shallowEqualRecord(cached.result as Record<string, unknown>, merged as Record<string, unknown>))
      ? cached.result
      : merged;

  const mergedSignature = buildMergedPanelDataSignature(merged);
  mergedPanelDataCache.set(cacheKey, {
    deps,
    signature: mergedSignature,
    result,
  });
  return result;
}

export function buildCanonicalPanelPayload(
  input: BuildCanonicalPanelPayloadInput
): Record<string, unknown> {
  const cacheKey = input.panelData as object;
  const deps = [input.responseData, input.sceneJson, input.strategicAdvice, input.canonicalRecommendation];
  const cached = canonicalPanelPayloadCache.get(cacheKey);
  if (cached && areDepsEqual(cached.deps, deps)) {
    return cached.result;
  }

  const panelData = input.panelData;
  const payload = {
    ...panelData,
    responseData: panelData.responseData ?? input.responseData ?? input.sceneJson ?? null,
    strategic_advice:
      panelData.advice ??
      panelData.strategicAdvice ??
      input.responseData?.advice_slice ??
      input.strategicAdvice ??
      input.responseData?.prompt_feedback?.advice_feedback ??
      input.sceneJson?.strategic_advice ??
      null,
    canonical_recommendation: panelData.canonicalRecommendation ?? input.canonicalRecommendation ?? null,
    decision_simulation:
      panelData.simulation ??
      input.responseData?.decision_simulation ??
      input.responseData?.simulation_result ??
      input.responseData?.scenario_simulation ??
      input.responseData?.simulation ??
      input.sceneJson?.simulation ??
      null,
    timeline_impact:
      panelData.timeline ??
      input.responseData?.timeline_impact ??
      input.responseData?.decision_timeline ??
      input.responseData?.timeline_slice ??
      input.responseData?.decision_simulation?.timeline ??
      input.responseData?.timeline ??
      input.sceneJson?.timeline_impact ??
      input.sceneJson?.timeline ??
      null,
    decision_policy: panelData.policy ?? input.responseData?.decision_policy ?? null,
    decision_governance: panelData.governance ?? input.responseData?.decision_governance ?? null,
    approval_workflow: panelData.approval ?? input.responseData?.approval_workflow ?? null,
    multi_agent_decision:
      panelData.warRoom ??
      input.responseData?.multi_agent_decision ??
      input.sceneJson?.multi_agent_decision ??
      null,
  };

  const result =
    cached && (cached.signature === buildCanonicalPayloadSignature(payload) || shallowEqualRecord(cached.result, payload))
      ? cached.result
      : payload;
  const payloadSignature = buildCanonicalPayloadSignature(payload);
  canonicalPanelPayloadCache.set(cacheKey, {
    deps,
    signature: payloadSignature,
    result,
  });
  return result;
}
