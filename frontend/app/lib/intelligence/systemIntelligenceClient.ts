"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type { SystemIntelligenceInput, SystemIntelligenceResult } from "./systemIntelligenceTypes";

function normalizeId(value: unknown): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function clamp01(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric <= 0) return 0;
  if (numeric >= 1) return 1;
  return numeric;
}

function normalizeResult(payload: unknown): SystemIntelligenceResult | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, any>) : null;
  const result = raw?.intelligence && typeof raw.intelligence === "object" ? raw.intelligence : raw;
  if (!result || typeof result !== "object") return null;

  const object_insights = Array.isArray(result.object_insights)
    ? result.object_insights
        .map((item: any) => {
          const objectId = normalizeId(item?.object_id);
          if (!objectId) return null;
          return {
            object_id: objectId,
            role: item?.role ?? "context",
            strategic_priority: clamp01(item?.strategic_priority),
            pressure_score: clamp01(item?.pressure_score),
            leverage_score: clamp01(item?.leverage_score),
            fragility_score: item?.fragility_score === null || item?.fragility_score === undefined ? null : clamp01(item?.fragility_score),
            rationale: typeof item?.rationale === "string" ? item.rationale : null,
          };
        })
        .filter(Boolean)
    : [];

  const path_insights = Array.isArray(result.path_insights)
    ? result.path_insights
        .map((item: any) => {
          const pathId = normalizeId(item?.path_id);
          if (!pathId) return null;
          return {
            path_id: pathId,
            source_object_id: normalizeId(item?.source_object_id),
            target_object_id: normalizeId(item?.target_object_id),
            path_strength: clamp01(item?.path_strength),
            path_role: item?.path_role ?? "secondary",
            significance_score: clamp01(item?.significance_score),
            rationale: typeof item?.rationale === "string" ? item.rationale : null,
          };
        })
        .filter(Boolean)
    : [];

  const summary = result.summary && typeof result.summary === "object"
    ? {
        headline: typeof result.summary.headline === "string" ? result.summary.headline : "System intelligence ready.",
        summary: typeof result.summary.summary === "string" ? result.summary.summary : "",
        key_signal: typeof result.summary.key_signal === "string" ? result.summary.key_signal : null,
        suggested_focus_object_id: normalizeId(result.summary.suggested_focus_object_id),
        suggested_mode:
          result.summary.suggested_mode === "analysis" ||
          result.summary.suggested_mode === "simulation" ||
          result.summary.suggested_mode === "decision"
            ? result.summary.suggested_mode
            : null,
      }
    : {
        headline: "System intelligence ready.",
        summary: "",
        key_signal: null,
        suggested_focus_object_id: null,
        suggested_mode: null,
      };

  const advice = Array.isArray(result.advice)
    ? result.advice
        .map((item: any) => {
          const adviceId = normalizeId(item?.advice_id);
          if (!adviceId) return null;
          return {
            advice_id: adviceId,
            kind: item?.kind ?? "investigate",
            target_object_id: normalizeId(item?.target_object_id),
            title: typeof item?.title === "string" ? item.title : "Advice",
            body: typeof item?.body === "string" ? item.body : "",
            confidence: clamp01(item?.confidence),
          };
        })
        .filter(Boolean)
    : [];

  return {
    active: result.active !== false,
    object_insights: object_insights as SystemIntelligenceResult["object_insights"],
    path_insights: path_insights as SystemIntelligenceResult["path_insights"],
    summary,
    advice: advice as SystemIntelligenceResult["advice"],
    meta: result.meta && typeof result.meta === "object" ? result.meta : {},
  };
}

export async function requestSystemIntelligence(
  input: SystemIntelligenceInput
): Promise<SystemIntelligenceResult | null> {
  try {
    const response = await fetchJson(`${apiBase()}/system/intelligence/run`, {
      method: "POST",
      body: input,
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    return normalizeResult(response);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][SystemIntelligence][fallback]", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}
