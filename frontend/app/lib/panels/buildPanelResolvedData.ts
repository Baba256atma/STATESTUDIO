import type { PanelResolvedData, PanelSharedData, ResolvedPanelName } from "./panelDataResolverTypes";
import { getPanelSafeStatus } from "./getPanelSafeStatus";
import { buildPanelFallbackState } from "./buildPanelFallbackState";

type LooseRecord = Record<string, unknown>;

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

function pickFirst<T>(values: T[]): T | null {
  for (const value of values) {
    if (value == null) continue;
    if (hasText(value) || hasItems(value) || hasKeys(value)) {
      return value;
    }
  }
  return null;
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
  const safeData = data ?? {};
  const promptFeedback = asRecord(safeData.promptFeedback);
  const decisionCockpit = asRecord(safeData.decisionCockpit);
  const executiveSummary = asRecord(safeData.executiveSummary);
  const simulation = asRecord(safeData.simulation);

  switch (panel) {
    case "advice": {
      const resolved = pickFirst([
        safeData.advice,
        safeData.strategicAdvice,
        promptFeedback?.advice_feedback,
        safeData.canonicalRecommendation,
        decisionCockpit?.advice,
        executiveSummary,
      ]);
      const adviceRecord = asRecord(resolved);
      const hasPrimaryData =
        hasItems(adviceRecord?.recommendations) ||
        hasItems(adviceRecord?.recommended_actions) ||
        hasKeys(adviceRecord?.primary_recommendation) ||
        hasText(adviceRecord?.recommendation);
      const hasPartialData =
        hasText(adviceRecord?.title) ||
        hasText(adviceRecord?.summary) ||
        hasText(adviceRecord?.why);
      const hasFallbackData = Boolean(resolved);
      return buildResult(panel, {
        data: resolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData,
        missingFields: [
          ...(hasPrimaryData ? [] : ["recommended_actions"]),
          ...(hasPartialData ? [] : ["summary"]),
        ],
      });
    }
    case "risk": {
      const resolved = pickFirst([
        safeData.risk,
        promptFeedback?.risk_feedback,
        simulation?.risk,
        decisionCockpit?.risk,
        executiveSummary,
      ]);
      const record = asRecord(resolved);
      const hasPrimaryData =
        hasItems(record?.edges) ||
        hasItems(record?.drivers) ||
        hasItems(record?.sources);
      const hasPartialData =
        hasText(record?.summary) ||
        hasText(record?.level) ||
        hasText(record?.risk_level);
      return buildResult(panel, {
        data: resolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: [
          ...(hasPrimaryData ? [] : ["risk_context"]),
          ...(hasPartialData ? [] : ["summary"]),
        ],
      });
    }
    case "timeline": {
      const resolved = pickFirst([
        safeData.timeline,
        safeData.simulation,
        simulation?.timeline,
        decisionCockpit?.comparison,
        promptFeedback?.timeline_feedback,
      ]);
      const record = asRecord(resolved);
      const hasPrimaryData =
        hasItems(record?.events) ||
        hasItems(record?.stages) ||
        hasItems(record?.timeline) ||
        hasItems(record?.steps) ||
        hasItems(record?.propagation) ||
        hasItems(record?.impacted_nodes);
      const hasPartialData =
        hasText(record?.headline) ||
        hasText(record?.summary) ||
        hasText(record?.immediate) ||
        hasText(record?.near_term);
      return buildResult(panel, {
        data: resolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: [
          ...(hasPrimaryData ? [] : ["timeline"]),
          ...(hasPartialData ? [] : ["summary"]),
        ],
      });
    }
    case "simulate": {
      const resolved = pickFirst([
        safeData.simulation,
        decisionCockpit?.simulation,
        safeData.executiveSummary,
        safeData.canonicalRecommendation,
      ]);
      const record = asRecord(resolved);
      const hasPrimaryData =
        hasItems(record?.propagation) ||
        hasItems(record?.impacted_nodes) ||
        hasItems(record?.affected_objects);
      const hasPartialData =
        hasText(record?.summary) ||
        hasText(record?.what_to_do) ||
        typeof record?.risk_delta === "number";
      return buildResult(panel, {
        data: resolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: [
          ...(hasPrimaryData ? [] : ["simulation"]),
          ...(hasPartialData ? [] : ["summary"]),
        ],
      });
    }
    case "dashboard":
    case "strategic_command":
    case "decision_governance":
    case "executive_approval":
    case "decision_policy":
    case "decision_council":
    case "compare":
    case "war_room": {
      const resolved = pickFirst([
        panel === "war_room" ? safeData.warRoom : null,
        panel === "compare" ? safeData.compare : null,
        panel === "decision_governance" ? safeData.governance : null,
        panel === "executive_approval" ? safeData.approval : null,
        panel === "decision_policy" ? safeData.policy : null,
        panel === "decision_council" ? safeData.strategicCouncil : null,
        panel === "war_room" ? safeData.strategicCouncil : null,
        panel === "war_room" ? safeData.canonicalRecommendation : null,
        panel === "war_room" ? safeData.simulation : null,
        panel === "war_room" ? safeData.compare : null,
        panel === "war_room" ? safeData.advice : null,
        panel === "war_room" ? safeData.strategicAdvice : null,
        decisionCockpit,
        executiveSummary,
        safeData.advice,
        safeData.strategicAdvice,
        safeData.canonicalRecommendation,
        safeData.decisionResult,
        safeData.simulation,
        safeData.risk,
      ]);
      const record = asRecord(resolved);
      const hasPrimaryData =
        hasItems(record?.priorities) ||
        hasItems(record?.risks) ||
        hasKeys(record) ||
        hasItems(safeData.memoryEntries) ||
        hasKeys(safeData.canonicalRecommendation);
      const hasPartialData =
        hasText(record?.headline) ||
        hasText(record?.posture) ||
        hasText(record?.summary) ||
        hasText(record?.what_to_do) ||
        hasText(record?.action);
      return buildResult(panel, {
        data: resolved,
        hasPrimaryData,
        hasPartialData,
        hasFallbackData: Boolean(resolved),
        missingFields: [
          ...(hasPrimaryData ? [] : ["decision_context"]),
          ...(hasPartialData ? [] : ["summary"]),
        ],
      });
    }
    default:
      return buildPanelFallbackState(panel, "fallback", ["unsupported_panel"]);
  }
}
