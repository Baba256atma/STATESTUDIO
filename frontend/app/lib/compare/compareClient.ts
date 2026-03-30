"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type {
  CompareAdvice,
  CompareInput,
  CompareObjectDelta,
  ComparePathDelta,
  CompareResult,
  CompareSummary,
  CompareTradeoff,
} from "./compareTypes";

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

function clampSigned(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric <= -1) return -1;
  if (numeric >= 1) return 1;
  return numeric;
}

function normalizeResult(payload: unknown): CompareResult | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, any>) : null;
  const result = raw?.comparison && typeof raw.comparison === "object" ? raw.comparison : raw;
  if (!result || typeof result !== "object") return null;

  const object_deltas: CompareObjectDelta[] = Array.isArray(result.object_deltas)
    ? result.object_deltas
        .map((item: any) => {
          const objectId = normalizeId(item?.object_id);
          if (!objectId) return null;
          return {
            object_id: objectId,
            impactA: clamp01(item?.impactA),
            impactB: clamp01(item?.impactB),
            delta: clampSigned(item?.delta),
            interpretation:
              item?.interpretation === "improved" || item?.interpretation === "worse" || item?.interpretation === "neutral"
                ? item.interpretation
                : "neutral",
            rationale: typeof item?.rationale === "string" ? item.rationale : "",
          };
        })
        .filter(Boolean)
    : [];

  const path_deltas: ComparePathDelta[] = Array.isArray(result.path_deltas)
    ? result.path_deltas
        .map((item: any) => {
          const pathId = normalizeId(item?.path_id);
          if (!pathId) return null;
          return {
            path_id: pathId,
            strengthA: clamp01(item?.strengthA),
            strengthB: clamp01(item?.strengthB),
            delta: clampSigned(item?.delta),
            interpretation:
              item?.interpretation === "stronger" || item?.interpretation === "weaker" || item?.interpretation === "equal"
                ? item.interpretation
                : "equal",
            strategicRole:
              item?.strategicRole === "critical" || item?.strategicRole === "supporting" || item?.strategicRole === "secondary"
                ? item.strategicRole
                : "secondary",
            rationale: typeof item?.rationale === "string" ? item.rationale : "",
          };
        })
        .filter(Boolean)
    : [];

  const tradeoffs: CompareTradeoff[] = Array.isArray(result.tradeoffs)
    ? result.tradeoffs
        .map((item: any) => {
          const dimension = item?.dimension;
          if (
            dimension !== "risk" &&
            dimension !== "efficiency" &&
            dimension !== "stability" &&
            dimension !== "growth"
          ) {
            return null;
          }
          return {
            dimension,
            winner: item?.winner === "A" || item?.winner === "B" || item?.winner === "tie" ? item.winner : "tie",
            confidence: clamp01(item?.confidence),
            explanation: typeof item?.explanation === "string" ? item.explanation : "",
          };
        })
        .filter(Boolean)
    : [];

  const summaryRaw = result.summary && typeof result.summary === "object" ? result.summary : null;
  const summary: CompareSummary = {
    headline: typeof summaryRaw?.headline === "string" ? summaryRaw.headline : "Comparison ready.",
    winner: summaryRaw?.winner === "A" || summaryRaw?.winner === "B" || summaryRaw?.winner === "tie" ? summaryRaw.winner : "tie",
    confidence: clamp01(summaryRaw?.confidence),
    reasoning: typeof summaryRaw?.reasoning === "string" ? summaryRaw.reasoning : "",
    keyTradeoffs: Array.isArray(summaryRaw?.keyTradeoffs) ? summaryRaw.keyTradeoffs.map(String).filter(Boolean) : [],
  };

  const advice: CompareAdvice[] = Array.isArray(result.advice)
    ? result.advice
        .map((item: any) => {
          const adviceId = normalizeId(item?.advice_id);
          if (!adviceId) return null;
          return {
            advice_id: adviceId,
            recommendation:
              item?.recommendation === "choose_A" ||
              item?.recommendation === "choose_B" ||
              item?.recommendation === "investigate_more" ||
              item?.recommendation === "hybrid"
                ? item.recommendation
                : "investigate_more",
            title: typeof item?.title === "string" ? item.title : "Recommendation",
            explanation: typeof item?.explanation === "string" ? item.explanation : "",
            confidence: clamp01(item?.confidence),
          };
        })
        .filter(Boolean)
    : [];

  return {
    object_deltas,
    path_deltas,
    tradeoffs,
    summary,
    advice,
    meta: result.meta && typeof result.meta === "object" ? result.meta : {},
  };
}

export async function requestComparison(input: CompareInput): Promise<CompareResult | null> {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][CompareMode][request]", {
        scenarioA: input.scenarioA.scenario.id,
        scenarioB: input.scenarioB.scenario.id,
        focusDimension: input.focusDimension ?? "balanced",
      });
    }
    const response = await fetchJson(`${apiBase()}/system/compare/run`, {
      method: "POST",
      body: input,
      timeoutMs: 10000,
      retryNetworkErrors: true,
    });
    const normalized = normalizeResult(response);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][CompareMode][response]", {
        winner: normalized?.summary.winner ?? "none",
        tradeoffs: normalized?.tradeoffs.length ?? 0,
      });
    }
    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][CompareMode][fallback]", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}
