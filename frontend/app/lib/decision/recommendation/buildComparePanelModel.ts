import type { DecisionExecutionResult } from "../../executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "./recommendationTypes";

export type CompareOption = {
  id: string;
  title: string;
  summary?: string | null;
  impact_summary?: string | null;
  tradeoff?: string | null;
  confidence_level?: "low" | "medium" | "high";
  target_ids?: string[];
  isRecommended?: boolean;
};

export type ComparePanelModel = {
  recommendedOption: CompareOption | null;
  alternatives: CompareOption[];
  reasoningWhy?: string | null;
  riskSummary?: string | null;
  compareSummary?: string | null;
  tradeoffs: string[];
  whyRecommended: string[];
  whyNotOthers: string[];
};

type BuildComparePanelModelInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  strategicAdvice?: any | null;
  responseData?: any | null;
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function buildComparePanelModel(input: BuildComparePanelModelInput): ComparePanelModel {
  const rec = input.canonicalRecommendation ?? null;
  const safeAlternatives = Array.isArray(rec?.alternatives) ? rec.alternatives : [];
  const strategicAdvice = input.strategicAdvice ?? input.responseData?.strategic_advice ?? null;
  const compareItems = Array.isArray(input.decisionResult?.comparison) ? input.decisionResult?.comparison : [];
  const fallbackActions = Array.isArray(strategicAdvice?.recommended_actions)
    ? strategicAdvice.recommended_actions
    : [];

  if (process.env.NODE_ENV !== "production" && rec && !Array.isArray(rec?.alternatives)) {
    console.warn("[Nexora] buildComparePanelModel received recommendation without alternatives", rec);
  }

  const recommendedOption: CompareOption | null = rec
    ? {
        id: rec.id,
        title: rec?.primary?.action ?? "Recommended option",
        summary: rec?.reasoning?.why ?? null,
        impact_summary: rec?.primary?.impact_summary ?? rec?.simulation?.summary ?? null,
        tradeoff: safeAlternatives[0]?.tradeoff ?? null,
        confidence_level: rec?.confidence?.level ?? "medium",
        target_ids: Array.isArray(rec?.primary?.target_ids) ? rec.primary.target_ids : [],
        isRecommended: true,
      }
    : fallbackActions[0]
    ? {
        id: text(fallbackActions[0]?.id) || "fallback_primary",
        title: text(fallbackActions[0]?.action) || "Recommended option",
        summary: text(strategicAdvice?.why) || null,
        impact_summary: text(fallbackActions[0]?.impact) || null,
        tradeoff: null,
        confidence_level: "medium",
        target_ids: Array.isArray(fallbackActions[0]?.targets) ? fallbackActions[0].targets : [],
        isRecommended: true,
      }
    : null;

  const alternativesFromRec = safeAlternatives.map((alternative, index) => ({
    id: `alternative:${index}:${alternative.action}`,
    title: text(alternative.action) || `Alternative ${index + 1}`,
    summary: alternative.tradeoff ?? null,
    impact_summary: alternative.impact_summary ?? null,
    tradeoff: alternative.tradeoff ?? null,
    confidence_level: rec?.confidence?.level ?? "medium",
    target_ids: [],
    isRecommended: false,
  }));

  const alternativesFromDecision = compareItems
    .filter((item) => text(item?.option) && text(item?.option) !== recommendedOption?.title)
    .slice(0, 2)
    .map((item, index) => ({
      id: `decision:${index}:${item.option}`,
      title: text(item.option),
      summary: `Comparison score ${(Number(item.score) || 0).toFixed(2)}`,
      impact_summary: `Relative option score ${(Number(item.score) || 0).toFixed(2)}`,
      tradeoff: null,
      confidence_level:
        Number(item.score) >= 0.75 ? "high" : Number(item.score) >= 0.5 ? "medium" : "low",
      target_ids: [],
      isRecommended: false,
    }));

  const alternatives =
    alternativesFromRec.length > 0
      ? alternativesFromRec.slice(0, 2)
      : alternativesFromDecision.length > 0
      ? alternativesFromDecision
      : fallbackActions
          .slice(recommendedOption ? 1 : 0, 3)
          .map((action: any, index: number) => ({
            id: text(action?.id) || `fallback_alt:${index}`,
            title: text(action?.action) || `Alternative ${index + 1}`,
            summary: text(action?.impact) || null,
            impact_summary: text(action?.impact) || null,
            tradeoff: null,
            confidence_level: "medium" as const,
            target_ids: Array.isArray(action?.targets) ? action.targets : [],
            isRecommended: false,
          }));

  const tradeoffs = [
    ...(safeAlternatives
      .map((alternative: CanonicalRecommendation["alternatives"][number]) => text(alternative.tradeoff))
      .filter(Boolean) as string[]),
    ...((Array.isArray(input.responseData?.comparison?.notes) ? input.responseData.comparison.notes : []) as string[]),
    ...(text(rec?.reasoning?.risk_summary) ? [text(rec?.reasoning?.risk_summary)] : []),
  ].slice(0, 4);

  const whyRecommended = [
    text(rec?.reasoning?.why),
    ...((rec?.reasoning?.key_drivers ?? []).map((driver) => `Aligned with ${titleCase(driver)}.`) as string[]),
    text(rec?.primary?.impact_summary) ? `${text(rec?.primary?.impact_summary)}` : "",
  ].filter(Boolean).slice(0, 3);

  const whyNotOthers = alternatives
    .map((alternative: CompareOption) => {
      const reason = alternative.tradeoff || alternative.summary || alternative.impact_summary || "Provides a weaker or narrower outcome.";
      return `${alternative.title}: ${reason}`;
    })
    .slice(0, 2);

  return {
    recommendedOption,
    alternatives,
    reasoningWhy: rec?.reasoning?.why ?? (text(strategicAdvice?.why) || null),
    riskSummary: rec?.reasoning?.risk_summary ?? (text(input.responseData?.risk_propagation?.summary) || null),
    compareSummary:
      (text(input.responseData?.analysis_summary) ||
      text(rec?.simulation?.summary) ||
      (recommendedOption
        ? `${recommendedOption.title} is currently the strongest visible move.`
        : null)),
    tradeoffs,
    whyRecommended,
    whyNotOthers,
  };
}
