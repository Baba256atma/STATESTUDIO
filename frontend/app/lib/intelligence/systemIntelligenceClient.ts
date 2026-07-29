"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type { SystemIntelligenceInput, SystemIntelligenceResult, SystemIntelligenceMode } from "./systemIntelligenceTypes";

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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function normalizeResult(payload: unknown): SystemIntelligenceResult | null {
  const raw = asRecord(payload);
  const intelligence = raw?.intelligence;
  const result = asRecord(intelligence) ?? raw;
  if (!result) return null;

  const object_insights = Array.isArray(result.object_insights)
    ? result.object_insights
        .map((item) => {
          const record = asRecord(item);
          const objectId = normalizeId(record?.object_id);
          if (!objectId) return null;
          return {
            object_id: objectId,
            role: record?.role ?? "context",
            strategic_priority: clamp01(record?.strategic_priority),
            pressure_score: clamp01(record?.pressure_score),
            leverage_score: clamp01(record?.leverage_score),
            fragility_score:
              record?.fragility_score === null || record?.fragility_score === undefined
                ? null
                : clamp01(record.fragility_score),
            rationale: typeof record?.rationale === "string" ? record.rationale : null,
          };
        })
        .filter(Boolean)
    : [];

  const path_insights = Array.isArray(result.path_insights)
    ? result.path_insights
        .map((item) => {
          const record = asRecord(item);
          const pathId = normalizeId(record?.path_id);
          if (!pathId) return null;
          return {
            path_id: pathId,
            source_object_id: normalizeId(record?.source_object_id),
            target_object_id: normalizeId(record?.target_object_id),
            path_strength: clamp01(record?.path_strength),
            path_role: record?.path_role ?? "secondary",
            significance_score: clamp01(record?.significance_score),
            rationale: typeof record?.rationale === "string" ? record.rationale : null,
          };
        })
        .filter(Boolean)
    : [];

  const summaryRecord = asRecord(result.summary);
  const summary = summaryRecord
    ? {
        headline: typeof summaryRecord.headline === "string" ? summaryRecord.headline : "System intelligence ready.",
        summary: typeof summaryRecord.summary === "string" ? summaryRecord.summary : "",
        key_signal: typeof summaryRecord.key_signal === "string" ? summaryRecord.key_signal : null,
        suggested_focus_object_id: normalizeId(summaryRecord.suggested_focus_object_id),
        suggested_mode:
          summaryRecord.suggested_mode === "analysis" ||
          summaryRecord.suggested_mode === "simulation" ||
          summaryRecord.suggested_mode === "decision"
            ? (summaryRecord.suggested_mode as SystemIntelligenceMode)
            : null,
      }
    : {
        headline: "System intelligence ready.",
        summary: "",
        key_signal: null,
        suggested_focus_object_id: null,
        suggested_mode: null as SystemIntelligenceResult["summary"]["suggested_mode"],
      };

  const advice = Array.isArray(result.advice)
    ? result.advice
        .map((item) => {
          const record = asRecord(item);
          const adviceId = normalizeId(record?.advice_id);
          if (!adviceId) return null;
          return {
            advice_id: adviceId,
            kind: record?.kind ?? "investigate",
            target_object_id: normalizeId(record?.target_object_id),
            title: typeof record?.title === "string" ? record.title : "Advice",
            body: typeof record?.body === "string" ? record.body : "",
            confidence: clamp01(record?.confidence),
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
    meta: asRecord(result.meta) ?? {},
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
