import type {
  DecisionAssistantOutput,
  DecisionContext,
  DecisionExecutiveBrief,
  DecisionRecommendation,
  EvaluatedScenario,
} from "./decisionAssistantTypes.ts";

export function buildDecisionPanelData(params: {
  context: DecisionContext;
  scenarios: EvaluatedScenario[];
  recommendation: DecisionRecommendation;
  executiveBrief: DecisionExecutiveBrief;
}): DecisionAssistantOutput["panelData"] {
  const { context, scenarios, recommendation, executiveBrief } = params;
  const top = scenarios[0];
  const second = scenarios[1];
  const third = scenarios[2];

  const advice: Record<string, unknown> = {
    title: executiveBrief.headline,
    summary: executiveBrief.summary,
    why: top ? top.rationale.join(" ") : null,
    recommendation: recommendation.primaryAction,
    risk_summary: recommendation.watchouts.length ? recommendation.watchouts.join(" · ") : null,
    recommendations: recommendation.watchouts,
    related_object_ids: top?.affectedObjectIds ?? context.fragileObjectIds.slice(0, 6),
    supporting_driver_labels: context.highlightedDriverIds.slice(0, 8),
    recommended_actions: [
      {
        action: recommendation.primaryAction,
        impact_summary: top ? `Scenario ${top.id}` : null,
        tradeoff: top?.tradeoffs[0] ?? null,
      },
    ],
    primary_recommendation: { action: recommendation.primaryAction },
    confidence: {
      score: recommendation.confidence,
      level: Math.round(recommendation.confidence * 100) / 100,
    },
  };

  const compareOptions = [top, second, third].filter(Boolean).map((s) => ({
    id: s!.id,
    label: s!.title,
    score: s!.score,
    tradeoffs: s!.tradeoffs,
    projected: s!.projectedEffects,
  }));

  const compare: Record<string, unknown> = {
    options: compareOptions,
    recommendation: top ? `${top.title} — ${recommendation.reasonSummary}` : recommendation.reasonSummary,
    summary: recommendation.alternatives.length
      ? `Alternatives considered: ${recommendation.alternatives.map((a) => a.scenarioId).join(", ")}.`
      : null,
  };

  const timeline: Record<string, unknown> = {
    headline: "Decision cadence",
    summary: `Now: align on ${recommendation.posture}. Next: execute ${top?.title ?? "top scenario"}. Monitor: watchouts and fragile objects.`,
    related_object_ids: top?.affectedObjectIds ?? [],
    events: [
      {
        id: "assistant_now",
        label: "Align & decide",
        type: "decision",
        order: 0,
        related_object_ids: context.selectedObjectId ? [context.selectedObjectId] : [],
      },
      {
        id: "assistant_next",
        label: top ? `Execute: ${top.title}` : "Execute plan",
        type: "action",
        order: 1,
        related_object_ids: top?.affectedObjectIds.slice(0, 2) ?? [],
      },
      {
        id: "assistant_monitor",
        label: "Monitor watchouts",
        type: "signal",
        order: 2,
        related_object_ids: context.fragileObjectIds.slice(0, 3),
      },
    ],
  };

  const warRoom: Record<string, unknown> = {
    headline: executiveBrief.headline,
    posture: recommendation.posture,
    priorities: [recommendation.primaryAction, top?.intent ?? ""].filter(Boolean),
    risks: recommendation.watchouts,
    related_object_ids: Array.from(
      new Set([...(top?.affectedObjectIds ?? []), ...context.fragileObjectIds.slice(0, 6)])
    ),
    summary: executiveBrief.summary,
    recommendation: recommendation.primaryAction,
    executive_summary: recommendation.reasonSummary,
    advice_summary: top?.rationale[0] ?? null,
  };

  return { advice, compare, timeline, warRoom };
}

function isNonEmptyString(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function shallowMergeRecord(base: Record<string, unknown>, enrich: Record<string, unknown>): Record<string, unknown> {
  const out = { ...base };
  for (const [k, v] of Object.entries(enrich)) {
    if (v === null || v === undefined) continue;
    const cur = out[k];
    if (cur === null || cur === undefined || (typeof cur === "string" && !cur.trim())) {
      out[k] = v;
      continue;
    }
    if (Array.isArray(cur) && Array.isArray(v) && cur.length === 0 && v.length > 0) {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Non-destructive enrichment: fill gaps in backend-built slices with assistant payloads.
 * Does not replace substantive backend strings.
 */
export function mergeAssistantPanelEnrichment(params: {
  assistant: DecisionAssistantOutput["panelData"] | null;
  mappedAdvice: unknown;
  mappedCompare: unknown;
  mappedTimeline: unknown;
  mappedWarRoom: unknown;
}): {
  advice: unknown;
  compare: unknown;
  timeline: unknown;
  warRoom: unknown;
} {
  const { assistant, mappedAdvice, mappedCompare, mappedTimeline, mappedWarRoom } = params;
  if (!assistant) {
    return {
      advice: mappedAdvice,
      compare: mappedCompare,
      timeline: mappedTimeline,
      warRoom: mappedWarRoom,
    };
  }

  const baseAdvice =
    mappedAdvice && typeof mappedAdvice === "object" && !Array.isArray(mappedAdvice)
      ? (mappedAdvice as Record<string, unknown>)
      : {};
  const baseCompare =
    mappedCompare && typeof mappedCompare === "object" && !Array.isArray(mappedCompare)
      ? (mappedCompare as Record<string, unknown>)
      : {};
  const baseTimeline =
    mappedTimeline && typeof mappedTimeline === "object" && !Array.isArray(mappedTimeline)
      ? (mappedTimeline as Record<string, unknown>)
      : {};
  const baseWarRoom =
    mappedWarRoom && typeof mappedWarRoom === "object" && !Array.isArray(mappedWarRoom)
      ? (mappedWarRoom as Record<string, unknown>)
      : {};

  const adviceHasBody =
    isNonEmptyString(baseAdvice.summary) ||
    isNonEmptyString(baseAdvice.recommendation) ||
    (Array.isArray(baseAdvice.recommendations) && baseAdvice.recommendations.length > 0);

  const adviceOut = adviceHasBody
    ? shallowMergeRecord(baseAdvice, assistant.advice as Record<string, unknown>)
    : { ...assistant.advice, ...baseAdvice };

  const compareHasBody =
    (Array.isArray(baseCompare.options) && (baseCompare.options as unknown[]).length > 0) ||
    isNonEmptyString(baseCompare.summary);

  const compareOut = compareHasBody
    ? shallowMergeRecord(baseCompare, assistant.compare as Record<string, unknown>)
    : { ...assistant.compare, ...baseCompare };

  const timelineHasBody =
    (Array.isArray(baseTimeline.events) && (baseTimeline.events as unknown[]).length > 0) ||
    isNonEmptyString(baseTimeline.summary);

  const timelineOut = timelineHasBody
    ? shallowMergeRecord(baseTimeline, assistant.timeline as Record<string, unknown>)
    : { ...assistant.timeline, ...baseTimeline };

  const warHasBody =
    isNonEmptyString(baseWarRoom.summary) ||
    isNonEmptyString(baseWarRoom.headline) ||
    (Array.isArray(baseWarRoom.priorities) && (baseWarRoom.priorities as unknown[]).length > 0);

  const warRoomOut = warHasBody
    ? shallowMergeRecord(baseWarRoom, assistant.warRoom as Record<string, unknown>)
    : { ...assistant.warRoom, ...baseWarRoom };

  return {
    advice: adviceOut,
    compare: compareOut,
    timeline: timelineOut,
    warRoom: warRoomOut,
  };
}
