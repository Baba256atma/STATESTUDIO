import { buildCanonicalRecommendation } from "../decision/recommendation/buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { AdviceAction, AdvicePanelData } from "./panelDataContract";
import { buildPanelResolvedData } from "./buildPanelResolvedData";
import type { PanelSharedData } from "./panelDataResolverTypes";

export type PanelReadiness = "empty" | "loading" | "ready";

function riskRecord(risk: unknown): Record<string, unknown> | null {
  return risk && typeof risk === "object" ? (risk as Record<string, unknown>) : null;
}

/** Unified contract: no “thin” UX — partial payloads count as ready. */
export function resolveRiskReadiness(risk: unknown): PanelReadiness {
  if (risk == null) return "loading";
  const rec = riskRecord(risk);
  if (!rec) return "loading";

  const hasEdges = Array.isArray(rec.edges) && rec.edges.length > 0;
  const hasDrivers = Array.isArray(rec.drivers) && rec.drivers.length > 0;
  const hasSources = Array.isArray(rec.sources) && rec.sources.length > 0;
  const hasSummary = typeof rec.summary === "string" && rec.summary.trim().length > 0;
  const hasLevel =
    (typeof rec.level === "string" && rec.level.trim().length > 0) ||
    (typeof rec.risk_level === "string" && rec.risk_level.trim().length > 0);

  if (!hasEdges && !hasDrivers && !hasSummary && !hasLevel && !hasSources) {
    return "empty";
  }
  return "ready";
}

function conflictSummaryFromUnknown(conflicts: unknown): string | null {
  const rec = conflicts && typeof conflicts === "object" && !Array.isArray(conflicts) ? (conflicts as Record<string, unknown>) : null;
  if (!rec) return null;
  for (const k of ["summary", "headline", "posture"] as const) {
    const v = rec[k];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

function conflictItemCount(conflicts: unknown): number {
  if (Array.isArray(conflicts)) return conflicts.length;
  const rec = conflicts && typeof conflicts === "object" && !Array.isArray(conflicts) ? (conflicts as Record<string, unknown>) : null;
  if (!rec) return 0;
  for (const k of ["conflicts", "edges", "tradeoffs", "tensions", "conflict_points"] as const) {
    const v = rec[k];
    if (Array.isArray(v)) return v.length;
  }
  return 0;
}

export function resolveConflictReadiness(conflicts: unknown): PanelReadiness {
  if (conflicts === undefined) return "loading";
  const summary = conflictSummaryFromUnknown(conflicts);
  const n = conflictItemCount(conflicts);
  if (n === 0 && !summary) return "empty";
  return "ready";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function gString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length ? value.trim() : null;
}

function pickCompatibilityAdvice(value: AdvicePanelData | Record<string, unknown> | null | undefined) {
  const record = asRecord(value);
  if (!record) return null;
  const nestedAdvice = asRecord(record.strategic_advice);
  return nestedAdvice ?? record;
}

/** Mirrors `StrategicAdvicePanel` contract: partial/ready always paint as ready; resolver fallbacks without signals are empty. */
export function resolveAdviceReadiness(
  panelData: PanelSharedData | null | undefined,
  advice: unknown,
  canonicalRecommendation?: CanonicalRecommendation | null
): PanelReadiness {
  if (panelData === undefined && advice === undefined) return "loading";

  const resolved = buildPanelResolvedData("advice", panelData ?? null);
  const resolvedAdvice = asRecord(resolved.data as AdvicePanelData | null | undefined);
  const compatibilityAdvice = pickCompatibilityAdvice(advice as AdvicePanelData | Record<string, unknown> | null | undefined);
  const normalizedAdvice = resolvedAdvice ?? compatibilityAdvice ?? {};
  const recommendation =
    canonicalRecommendation ??
    buildCanonicalRecommendation({
      strategicAdvice: normalizedAdvice,
    });
  const normalizedPrimaryRecommendation = asRecord(normalizedAdvice.primary_recommendation);
  const actions: AdviceAction[] = Array.isArray(normalizedAdvice.recommended_actions)
    ? (normalizedAdvice.recommended_actions as AdviceAction[])
    : Array.isArray(recommendation?.alternatives)
      ? (recommendation.alternatives as AdviceAction[])
      : [];
  const primaryRecommendation =
    gString(normalizedPrimaryRecommendation?.action) ??
    gString(normalizedAdvice.recommendation) ??
    recommendation?.primary?.action ??
    null;
  const summary =
    gString(normalizedAdvice.summary) ??
    recommendation?.primary?.impact_summary ??
    "No strategic advice available yet.";
  const why = gString(normalizedAdvice.why) ?? recommendation?.reasoning?.why ?? null;
  const executiveSummary = gString(normalizedAdvice.risk_summary) ?? recommendation?.reasoning?.risk_summary ?? null;

  const hasRenderableAdvice = Boolean(
    summary || primaryRecommendation || actions.length || why || executiveSummary
  );
  const adviceResolverBlank =
    (resolved.status === "fallback" || resolved.status === "empty_but_guided") && !hasRenderableAdvice;

  if (resolved.status === "partial" || resolved.status === "ready") return "ready";
  if (adviceResolverBlank) return "empty";
  if (!hasRenderableAdvice) return "empty";
  return "ready";
}

export function resolveDecisionTimelineReadiness(input: {
  stageCount: number;
  decisionLoading?: boolean;
  decisionStatus?: string | null;
}): PanelReadiness {
  if (input.decisionLoading || input.decisionStatus === "loading") return "loading";
  if (input.stageCount === 0) return "empty";
  return "ready";
}

export function resolveWarRoomReadiness(input: {
  intelligence: Record<string, unknown> | null | undefined;
  decisionLoading?: boolean;
  decisionStatus?: string | null;
}): PanelReadiness {
  if (input.decisionLoading || input.decisionStatus === "loading") return "loading";
  const intel = input.intelligence;
  if (intel == null) return "empty";
  if (typeof intel === "object" && !Array.isArray(intel) && Object.keys(intel).length === 0) return "empty";
  return "ready";
}
