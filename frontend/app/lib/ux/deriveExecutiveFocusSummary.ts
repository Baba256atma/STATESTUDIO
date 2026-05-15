import { dedupeByStableKey, stableSignalKey } from "../intelligence/shared/dedupe.ts";
import {
  avoidFalseCertainty,
  conciseExecutiveSentence,
  stableExecutiveHeadline,
} from "../intelligence/shared/executiveLanguage.ts";
import { confidenceLevelFromScore, uniqueStrings } from "../intelligence/shared/normalization.ts";
import {
  countCompressedSignals,
  rankExecutiveUxSignals,
  type ExecutiveUxHierarchyItem,
  type ExecutiveUxSignal,
  type ExecutiveUxSignalLevel,
} from "./executiveSignalHierarchy.ts";
import { recommendPanelForSignal, type ExecutivePanelResponsibilityId } from "./executivePanelResponsibilities.ts";
import { getExecutiveVisualTreatment, type ExecutiveVisualTreatment } from "./executiveVisualLanguage.ts";

export type ExecutiveFocusSummary = {
  id: string;
  headline: string;
  summary: string;
  level: ExecutiveUxSignalLevel;
  primarySignalId?: string;
  supportingSignalIds: string[];
  relatedObjectIds: string[];
  recommendedPanel: ExecutivePanelResponsibilityId;
  recommendedFocus?: string;
  confidenceLevel?: "low" | "moderate" | "high" | "very_high";
  visualTreatment: ExecutiveVisualTreatment;
  noiseReductionCount: number;
  panelAttentionWeights: Record<ExecutivePanelResponsibilityId, number>;
};

function fallbackSummary(): ExecutiveFocusSummary {
  return {
    id: "executive_focus:steady_state",
    headline: "Executive focus is steady",
    summary: "No immediate executive pressure requires elevated attention.",
    level: "supporting_intelligence",
    supportingSignalIds: [],
    relatedObjectIds: [],
    recommendedPanel: "executive_dashboard",
    visualTreatment: getExecutiveVisualTreatment({ severity: "low", level: "supporting_intelligence" }),
    noiseReductionCount: 0,
    panelAttentionWeights: {
      executive_dashboard: 1,
      war_room: 0,
      monitoring: 0,
      risk_flow: 0,
      timeline: 0,
      advice: 0,
      compare: 0,
      decision_strip: 0,
      scene_overlay: 0,
      object_overlay: 0,
    },
  };
}

function titleForSignal(signal: ExecutiveUxHierarchyItem): string {
  return stableExecutiveHeadline({
    preferred: signal.title ?? signal.recommendedFocus,
    fallback: "Executive focus requires review",
  });
}

function summaryForSignal(signal: ExecutiveUxHierarchyItem): string {
  return avoidFalseCertainty(
    conciseExecutiveSentence(
      signal.summary ?? signal.recommendedFocus,
      "Executive attention should remain focused on the highest-priority operational signal."
    )
  );
}

function buildAttentionWeights(signals: ExecutiveUxHierarchyItem[]): Record<ExecutivePanelResponsibilityId, number> {
  const weights = fallbackSummary().panelAttentionWeights;
  for (const signal of signals) {
    const panel = recommendPanelForSignal({ sourceType: signal.sourceType, level: signal.level });
    weights[panel.id] = Math.round((weights[panel.id] + signal.rankScore) * 100) / 100;
  }
  return weights;
}

export function deriveExecutiveFocusSummary(params: {
  signals?: ExecutiveUxSignal[] | null;
}): ExecutiveFocusSummary {
  const rawSignals = params.signals ?? [];
  const dedupedSignals = dedupeByStableKey(rawSignals, (signal) =>
    stableSignalKey({
      type: `${signal.sourceType}:${signal.severity ?? signal.priority ?? ""}`,
      sourceId: signal.id,
      relatedObjectIds: signal.relatedObjectIds,
    })
  );
  const ranked = rankExecutiveUxSignals(dedupedSignals);
  const primary = ranked[0] ?? null;

  if (!primary) return fallbackSummary();

  const recommendedPanel = recommendPanelForSignal({
    sourceType: primary.sourceType,
    level: primary.level,
  });
  const supportingSignals = ranked.slice(1, primary.level === "immediate_focus" ? 4 : 3);
  const relatedObjectIds = uniqueStrings([
    ...(primary.relatedObjectIds ?? []),
    ...supportingSignals.flatMap((signal) => signal.relatedObjectIds ?? []),
  ]);

  return {
    id: `executive_focus:${primary.id}`,
    headline: titleForSignal(primary),
    summary: summaryForSignal(primary),
    level: primary.level,
    primarySignalId: primary.id,
    supportingSignalIds: supportingSignals.map((signal) => signal.id),
    relatedObjectIds,
    recommendedPanel: recommendedPanel.id,
    recommendedFocus: primary.recommendedFocus,
    confidenceLevel: confidenceLevelFromScore(primary.confidence),
    visualTreatment: getExecutiveVisualTreatment({
      severity: primary.severity ?? primary.priority,
      level: primary.level,
      active: primary.level === "immediate_focus",
    }),
    noiseReductionCount: countCompressedSignals(rawSignals, ranked),
    panelAttentionWeights: buildAttentionWeights(ranked.slice(0, 5)),
  };
}
