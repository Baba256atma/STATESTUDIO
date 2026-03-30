import {
  AdvicePanelDataSchema,
  type AdviceAction,
  type CanonicalAdvicePanelData,
} from "./panelDataContract.ts";

type LooseRecord = Record<string, unknown>;

type NormalizeCanonicalAdviceOptions = {
  defaultTitle?: string | null;
  fallbackSummary?: string | null;
  fallbackWhy?: string | null;
  fallbackRecommendation?: string | null;
  fallbackRiskSummary?: string | null;
  fallbackRecommendations?: string[];
  fallbackRelatedObjectIds?: string[];
  fallbackSupportingDriverLabels?: string[];
  fallbackRecommendedActions?: AdviceAction[];
  fallbackPrimaryRecommendation?: CanonicalAdvicePanelData["primary_recommendation"];
  fallbackConfidence?: unknown;
};

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((entry) => getString(entry)).filter((entry): entry is string => Boolean(entry)))
  );
}

function normalizeAdviceAction(value: unknown): AdviceAction | null {
  const record = asRecord(value);
  if (!record) return null;
  return {
    action: getString(record.action),
    impact_summary: getString(record.impact_summary),
    tradeoff: getString(record.tradeoff),
  };
}

function normalizeAdviceActions(value: unknown): AdviceAction[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => normalizeAdviceAction(entry))
    .filter((entry): entry is AdviceAction => Boolean(entry));
}

function normalizePrimaryRecommendation(
  value: unknown
): CanonicalAdvicePanelData["primary_recommendation"] {
  const record = asRecord(value);
  if (!record) return null;
  const action = getString(record.action);
  return action ? { action } : null;
}

export function normalizeAdviceConfidence(value: unknown): CanonicalAdvicePanelData["confidence"] {
  const numericValue = getNumber(value);
  if (numericValue !== undefined) {
    return {
      score: numericValue,
    };
  }

  const record = asRecord(value);
  if (!record) return null;
  const level = getNumber(record.level);
  const score = getNumber(record.score);
  if (level === undefined && score === undefined) return null;
  return {
    level,
    score,
  };
}

function uniqueAdviceActions(actions: AdviceAction[]): AdviceAction[] {
  const seen = new Set<string>();
  return actions.filter((action) => {
    const key = `${action.action ?? ""}|${action.impact_summary ?? ""}|${action.tradeoff ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeCanonicalAdvicePanelData(
  input: unknown,
  options: NormalizeCanonicalAdviceOptions = {}
): CanonicalAdvicePanelData | null {
  const record = asRecord(input);
  if (!record) return null;

  const rawRecommendedActions = normalizeAdviceActions(record.recommended_actions);
  const recommendedActions =
    rawRecommendedActions.length > 0
      ? rawRecommendedActions
      : uniqueAdviceActions(options.fallbackRecommendedActions ?? []);

  const rawPrimaryRecommendation = normalizePrimaryRecommendation(record.primary_recommendation);
  const primaryRecommendation = rawPrimaryRecommendation ?? options.fallbackPrimaryRecommendation ?? null;

  const explicitRecommendations = getStringArray(record.recommendations);
  const fallbackRecommendations = getStringArray(options.fallbackRecommendations ?? []);
  const actionRecommendations = recommendedActions
    .map((action) => getString(action.action))
    .filter((action): action is string => Boolean(action));
  const derivedRecommendation =
    getString(record.recommendation) ??
    getString(primaryRecommendation?.action) ??
    getString(options.fallbackRecommendation) ??
    null;

  const recommendations = Array.from(
    new Set(
      [
        ...explicitRecommendations,
        ...fallbackRecommendations,
        ...actionRecommendations,
        ...(derivedRecommendation ? [derivedRecommendation] : []),
      ].filter((entry): entry is string => Boolean(entry))
    )
  );

  const summary = getString(record.summary) ?? getString(options.fallbackSummary) ?? null;
  const advice: CanonicalAdvicePanelData = AdvicePanelDataSchema.parse({
    title: getString(record.title) ?? getString(options.defaultTitle) ?? null,
    summary,
    why: getString(record.why) ?? getString(options.fallbackWhy) ?? null,
    recommendation: derivedRecommendation,
    risk_summary: getString(record.risk_summary) ?? getString(options.fallbackRiskSummary) ?? null,
    recommendations,
    related_object_ids: (() => {
      const fromInput = getStringArray(record.related_object_ids);
      return fromInput.length > 0 ? fromInput : getStringArray(options.fallbackRelatedObjectIds ?? []);
    })(),
    supporting_driver_labels: (() => {
      const fromInput = getStringArray(record.supporting_driver_labels);
      return fromInput.length > 0 ? fromInput : getStringArray(options.fallbackSupportingDriverLabels ?? []);
    })(),
    recommended_actions:
      recommendedActions.length > 0
        ? recommendedActions
        : recommendations.map((action) => ({
            action,
            impact_summary: summary,
            tradeoff: null,
          })),
    primary_recommendation:
      primaryRecommendation ??
      (derivedRecommendation
        ? {
            action: derivedRecommendation,
          }
        : null),
    confidence:
      normalizeAdviceConfidence(record.confidence) ??
      normalizeAdviceConfidence(options.fallbackConfidence) ??
      null,
  });

  return advice;
}
