import {
  TimelinePanelDataSchema,
  WarRoomPanelDataSchema,
  type CanonicalTimelinePanelData,
  type CanonicalWarRoomPanelData,
} from "./panelDataContract";

type LooseRecord = Record<string, unknown>;

type TimelineOptions = {
  fallbackHeadline?: string | null;
  fallbackSummary?: string | null;
  fallbackRelatedObjectIds?: string[];
};

type WarRoomOptions = {
  fallbackSummary?: string | null;
  fallbackRecommendation?: string | null;
  fallbackExecutiveSummary?: string | null;
  fallbackAdviceSummary?: string | null;
  fallbackCompareSummary?: string | null;
  fallbackRelatedObjectIds?: string[];
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

function getStringArray(value: unknown, limit = 6): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((entry) => getString(entry)).filter((entry): entry is string => Boolean(entry)))
  ).slice(0, limit);
}

export function normalizeCanonicalTimelinePanelData(
  input: unknown,
  options: TimelineOptions = {}
): CanonicalTimelinePanelData | null {
  const record = asRecord(input);
  if (!record) return null;

  const fallbackRelatedObjectIds = getStringArray(options.fallbackRelatedObjectIds ?? [], 8);
  const events = (Array.isArray(record.events) ? record.events : [])
    .map((event, index) => {
      const item = asRecord(event);
      if (!item) return null;
      return {
        id: getString(item.id) ?? `timeline_event_${index + 1}`,
        label: getString(item.label) ?? "Timeline event",
        type: getString(item.type) ?? "signal",
        order: getNumber(item.order) ?? index + 1,
        confidence: getNumber(item.confidence),
        related_object_ids: (() => {
          const direct = getStringArray(item.related_object_ids, 6);
          return direct.length > 0 ? direct : fallbackRelatedObjectIds;
        })(),
      };
    })
    .filter((event): event is NonNullable<typeof event> => Boolean(event))
    .sort((left, right) => left.order - right.order);

  return TimelinePanelDataSchema.parse({
    headline: getString(record.headline) ?? getString(options.fallbackHeadline) ?? null,
    summary:
      getString(record.summary) ??
      getString(options.fallbackSummary) ??
      (events.length > 0 ? `Tracking ${events.length} timeline events.` : null),
    events,
    related_object_ids: (() => {
      const direct = getStringArray(record.related_object_ids, 8);
      return direct.length > 0 ? direct : fallbackRelatedObjectIds;
    })(),
    steps: Array.isArray(record.steps) ? record.steps : events,
    stages: Array.isArray(record.stages) ? record.stages : [],
    timeline: Array.isArray(record.timeline) ? record.timeline : events,
  });
}

export function normalizeCanonicalWarRoomPanelData(
  input: unknown,
  options: WarRoomOptions = {}
): CanonicalWarRoomPanelData | null {
  const record = asRecord(input);
  if (!record) return null;

  return WarRoomPanelDataSchema.parse({
    headline: getString(record.headline) ?? "War Room",
    posture: getString(record.posture) ?? null,
    priorities: getStringArray(record.priorities, 5),
    risks: getStringArray(record.risks, 5),
    related_object_ids: (() => {
      const direct = getStringArray(record.related_object_ids, 8);
      return direct.length > 0 ? direct : getStringArray(options.fallbackRelatedObjectIds ?? [], 8);
    })(),
    summary: getString(record.summary) ?? getString(options.fallbackSummary) ?? null,
    recommendation: getString(record.recommendation) ?? getString(options.fallbackRecommendation) ?? null,
    executive_summary:
      getString(record.executive_summary) ?? getString(options.fallbackExecutiveSummary) ?? null,
    advice_summary: getString(record.advice_summary) ?? getString(options.fallbackAdviceSummary) ?? null,
    compare_summary: getString(record.compare_summary) ?? getString(options.fallbackCompareSummary) ?? null,
    simulation_summary: getString(record.simulation_summary) ?? null,
  });
}
