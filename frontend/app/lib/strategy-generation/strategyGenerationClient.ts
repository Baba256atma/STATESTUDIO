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

function normalizeAction(value: unknown, idx: number, strategyId: string): ScenarioActionIntent | null {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  if (!record) return null;
  const actionKind = String(record.action_kind ?? "").trim();
  const sourceId = normalizeId(record.source_object_id);
  if (!actionKind || !sourceId) return null;
  return {
    action_id: normalizeId(record.action_id) ?? `${strategyId}:action:${idx}`,
    action_kind: actionKind as ScenarioActionIntent["action_kind"],
    source_object_id: sourceId,
    target_object_ids: Array.isArray(record.target_object_ids) ? record.target_object_ids.map(String).filter(Boolean) : [],
    label: typeof record.label === "string" ? record.label : undefined,
    description: typeof record.description === "string" ? record.description : undefined,
    parameters: record.parameters && typeof record.parameters === "object" ? (record.parameters as Record<string, unknown>) : {},
    mode:
      record.mode === "what_if" || record.mode === "decision_path" || record.mode === "compare" || record.mode === "preview"
        ? record.mode
        : "what_if",
    requested_outputs: Array.isArray(record.requested_outputs)
      ? (record.requested_outputs.map(String) as ScenarioActionIntent["requested_outputs"])
      : ["propagation"],
    created_at: Number.isFinite(Number(record.created_at)) ? Number(record.created_at) : undefined,
    priority: Number.isFinite(Number(record.priority)) ? Number(record.priority) : undefined,
  };
}

function normalizeResult(payload: unknown): StrategyGenerationResult | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  const strategyGeneration = raw?.strategy_generation;
  const result =
    strategyGeneration && typeof strategyGeneration === "object" ? strategyGeneration : raw;
  if (!result || typeof result !== "object") return null;
  const resultRecord = result as Record<string, unknown>;

  const strategies: EvaluatedStrategy[] = Array.isArray(resultRecord.strategies)
    ? resultRecord.strategies
        .map((item) => {
          const itemRecord = item && typeof item === "object" ? (item as Record<string, unknown>) : null;
          const strategyRaw = itemRecord?.strategy;
          const strategyRecord =
            strategyRaw && typeof strategyRaw === "object" ? (strategyRaw as Record<string, unknown>) : null;
          const strategyId = normalizeId(strategyRecord?.strategy_id);
          if (!strategyId || !itemRecord) return null;
          const actions = Array.isArray(strategyRecord?.actions)
            ? strategyRecord.actions
                .map((action, idx) => normalizeAction(action, idx, strategyId))
                .filter(Boolean)
            : [];
          const strategy: GeneratedStrategy = {
            strategy_id: strategyId,
            title: typeof strategyRecord?.title === "string" ? strategyRecord.title : strategyId,
            description: typeof strategyRecord?.description === "string" ? strategyRecord.description : "",
            actions: actions as ScenarioActionIntent[],
            expected_focus: normalizeId(strategyRecord?.expected_focus),
            rationale: typeof strategyRecord?.rationale === "string" ? strategyRecord.rationale : "",
          };
          return {
            strategy,
            intelligence: (itemRecord.intelligence ?? null) as SystemIntelligenceResult,
            score: clamp01(itemRecord.score),
            ranking: Math.max(1, Number(itemRecord.ranking ?? 1)),
            tradeoffs: Array.isArray(itemRecord.tradeoffs) ? itemRecord.tradeoffs.map(String).filter(Boolean) : [],
            risk_level: clamp01(itemRecord.risk_level),
            expected_impact: clamp01(itemRecord.expected_impact),
          };
        })
        .filter((item): item is EvaluatedStrategy => item !== null)
    : [];

  const summaryRecord =
    resultRecord.summary && typeof resultRecord.summary === "object"
      ? (resultRecord.summary as Record<string, unknown>)
      : null;

  return {
    strategies: strategies as EvaluatedStrategy[],
    recommended_strategy_id: normalizeId(resultRecord.recommended_strategy_id),
    summary: {
      headline: typeof summaryRecord?.headline === "string" ? summaryRecord.headline : "Strategy generation ready.",
      explanation: typeof summaryRecord?.explanation === "string" ? summaryRecord.explanation : "",
      confidence: clamp01(summaryRecord?.confidence),
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
