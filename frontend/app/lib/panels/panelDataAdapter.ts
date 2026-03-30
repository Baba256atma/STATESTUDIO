import type {
  AdvicePanelData,
  CanonicalPanelData,
  TimelinePanelData,
  WarRoomPanelData,
} from "./panelDataContract";
import { normalizeCanonicalAdvicePanelData } from "./adviceAdapter";
import {
  normalizeCanonicalTimelinePanelData,
  normalizeCanonicalWarRoomPanelData,
} from "./panelSliceNormalizer";

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
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

  const summary = getString(adviceSlice.summary) ?? getString(asRecord(scanner.summary_detail)?.text) ?? getString(scanner.summary);
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

export function buildCanonicalPanelData(input: unknown): CanonicalPanelData {
  const scanner = pickFragilityScan(input);
  const advice = buildAdviceSlice(scanner);
  const timeline = buildTimelineSlice(scanner);
  const warRoom = buildWarRoomSlice(scanner, advice);

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelDataAdapter]", {
      source: scanner ? "scanner_truth" : "none",
      hasAdvice: Boolean(advice),
      hasTimeline: Boolean(timeline?.events?.length),
      hasWarRoom: Boolean(warRoom),
    });
  }

  return {
    advice,
    timeline,
    warRoom,
  };
}
