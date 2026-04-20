import { normalizeCanonicalWarRoomPanelData } from "../../../lib/panels/panelSliceNormalizer";

const DEFAULT_WAR_ROOM_HEADLINE = "War Room";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function normalizeWarRoomIntelligence(
  input: unknown
): ReturnType<typeof normalizeCanonicalWarRoomPanelData> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const intelligence = input as Record<string, unknown>;
  const summary = asRecord(intelligence.summary);
  const advice = Array.isArray(intelligence.advice) ? intelligence.advice : [];
  const objectInsights = Array.isArray(intelligence.object_insights) ? intelligence.object_insights : [];

  const priorities = advice
    .map((entry) => asRecord(entry)?.title)
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .slice(0, 5);
  const risks = objectInsights
    .map((entry) => asRecord(entry)?.rationale)
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .slice(0, 5);
  const relatedObjectIds = objectInsights
    .map((entry) => asRecord(entry)?.object_id)
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .slice(0, 8);
  const summaryText = typeof summary?.summary === "string" ? summary.summary : null;
  const firstPriority = priorities[0] ?? null;
  const headline = typeof summary?.headline === "string" ? summary.headline : DEFAULT_WAR_ROOM_HEADLINE;

  return normalizeCanonicalWarRoomPanelData(
    {
      headline,
      posture: typeof summary?.key_signal === "string" ? summary.key_signal : null,
      priorities,
      risks,
      related_object_ids: relatedObjectIds,
      summary: summaryText,
      recommendation: firstPriority,
      executive_summary: summaryText,
      advice_summary: firstPriority,
    },
    {
      fallbackSummary: summaryText,
      fallbackRecommendation: firstPriority,
      fallbackExecutiveSummary: summaryText,
      fallbackAdviceSummary: firstPriority,
      fallbackRelatedObjectIds: relatedObjectIds,
    }
  );
}
