"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type { SystemIntelligenceResult } from "../intelligence/systemIntelligenceTypes";
import type { ScenarioActionIntent } from "../simulation/scenarioActionTypes";
import type {
  EvaluatedStrategy,
  GeneratedStrategy,
  StrategyGenerationInput,
  StrategyGenerationResult,
} from "./strategyGenerationTypes";

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

function normalizeAction(value: any, idx: number, strategyId: string): ScenarioActionIntent | null {
  const actionKind = String(value?.action_kind ?? "").trim();
  const sourceId = normalizeId(value?.source_object_id);
  if (!actionKind || !sourceId) return null;
  return {
    action_id: normalizeId(value?.action_id) ?? `${strategyId}:action:${idx}`,
    action_kind: actionKind as ScenarioActionIntent["action_kind"],
    source_object_id: sourceId,
    target_object_ids: Array.isArray(value?.target_object_ids) ? value.target_object_ids.map(String).filter(Boolean) : [],
    label: typeof value?.label === "string" ? value.label : undefined,
    description: typeof value?.description === "string" ? value.description : undefined,
    parameters: value?.parameters && typeof value.parameters === "object" ? value.parameters : {},
    mode:
      value?.mode === "what_if" || value?.mode === "decision_path" || value?.mode === "compare" || value?.mode === "preview"
        ? value.mode
        : "what_if",
    requested_outputs: Array.isArray(value?.requested_outputs)
      ? (value.requested_outputs.map(String) as ScenarioActionIntent["requested_outputs"])
      : ["propagation"],
    created_at: Number.isFinite(Number(value?.created_at)) ? Number(value.created_at) : undefined,
    priority: Number.isFinite(Number(value?.priority)) ? Number(value.priority) : undefined,
  };
}

function normalizeResult(payload: unknown): StrategyGenerationResult | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, any>) : null;
  const result = raw?.strategy_generation && typeof raw.strategy_generation === "object" ? raw.strategy_generation : raw;
  if (!result || typeof result !== "object") return null;

  const strategies: EvaluatedStrategy[] = Array.isArray(result.strategies)
    ? result.strategies
        .map((item: any) => {
          const strategyId = normalizeId(item?.strategy?.strategy_id);
          if (!strategyId) return null;
          const actions = Array.isArray(item?.strategy?.actions)
            ? item.strategy.actions
                .map((action: any, idx: number) => normalizeAction(action, idx, strategyId))
                .filter(Boolean)
            : [];
          const strategy: GeneratedStrategy = {
            strategy_id: strategyId,
            title: typeof item?.strategy?.title === "string" ? item.strategy.title : strategyId,
            description: typeof item?.strategy?.description === "string" ? item.strategy.description : "",
            actions: actions as ScenarioActionIntent[],
            expected_focus: normalizeId(item?.strategy?.expected_focus),
            rationale: typeof item?.strategy?.rationale === "string" ? item.strategy.rationale : "",
          };
          return {
            strategy,
            intelligence: (item?.intelligence ?? null) as SystemIntelligenceResult,
            score: clamp01(item?.score),
            ranking: Math.max(1, Number(item?.ranking ?? 1)),
            tradeoffs: Array.isArray(item?.tradeoffs) ? item.tradeoffs.map(String).filter(Boolean) : [],
            risk_level: clamp01(item?.risk_level),
            expected_impact: clamp01(item?.expected_impact),
          };
        })
        .filter(Boolean)
    : [];

  return {
    strategies,
    recommended_strategy_id: normalizeId(result.recommended_strategy_id),
    summary: {
      headline: typeof result?.summary?.headline === "string" ? result.summary.headline : "Strategy generation ready.",
      explanation: typeof result?.summary?.explanation === "string" ? result.summary.explanation : "",
      confidence: clamp01(result?.summary?.confidence),
    },
  };
}

export async function requestStrategyGeneration(input: StrategyGenerationInput): Promise<StrategyGenerationResult | null> {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][StrategyGeneration][request]", {
        mode: input.mode,
        preferredFocus: input.constraints?.preferredFocus ?? "risk",
      });
    }
    const response = await fetchJson(`${apiBase()}/system/strategy/generate`, {
      method: "POST",
      body: input,
      timeoutMs: 12000,
      retryNetworkErrors: true,
    });
    const normalized = normalizeResult(response);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][StrategyGeneration][response]", {
        strategyCount: normalized?.strategies.length ?? 0,
        recommended: normalized?.recommended_strategy_id ?? null,
      });
    }
    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][StrategyGeneration][fallback]", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}
