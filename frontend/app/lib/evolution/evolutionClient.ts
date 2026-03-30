"use client";

import { apiBase } from "../apiBase";
import { fetchJson } from "../api/fetchJson";
import type { RecentMemoryState, EvolutionState, ScenarioMemoryRecord } from "./evolutionTypes";

function clamp01(value: unknown): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  if (numeric <= 0) return 0;
  if (numeric >= 1) return 1;
  return numeric;
}

function normalizeRecentMemory(payload: unknown): RecentMemoryState {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, any>) : null;
  const memory = raw?.memory && typeof raw.memory === "object" ? raw.memory : raw;
  return {
    scenario_records: Array.isArray(memory?.scenario_records) ? memory.scenario_records : [],
    strategy_records: Array.isArray(memory?.strategy_records) ? memory.strategy_records : [],
    comparison_records: Array.isArray(memory?.comparison_records) ? memory.comparison_records : [],
  };
}

function normalizeEvolutionState(payload: unknown): EvolutionState | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, any>) : null;
  const evo = raw?.evolution && typeof raw.evolution === "object" ? raw.evolution : raw;
  if (!evo || typeof evo !== "object") return null;
  return {
    active: evo.active !== false,
    learning_signals: Array.isArray(evo.learning_signals) ? evo.learning_signals : [],
    policy_adjustments: Array.isArray(evo.policy_adjustments) ? evo.policy_adjustments : [],
    summary: {
      headline: typeof evo?.summary?.headline === "string" ? evo.summary.headline : "Evolution state ready.",
      explanation: typeof evo?.summary?.explanation === "string" ? evo.summary.explanation : "",
    },
  };
}

export async function saveMemoryRecord(body: Record<string, unknown>): Promise<boolean> {
  try {
    await fetchJson(`${apiBase()}/system/memory/save`, {
      method: "POST",
      body,
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function updateObservedOutcome(args: {
  recordId: string;
  outcomeStatus: "unknown" | "positive" | "negative" | "mixed";
  observedImpact?: number | null;
  observedRisk?: number | null;
  note?: string | null;
}): Promise<ScenarioMemoryRecord | null> {
  try {
    const response = await fetchJson(`${apiBase()}/system/outcome/update`, {
      method: "POST",
      body: {
        record_id: args.recordId,
        observed_outcome: {
          outcome_status: args.outcomeStatus,
          observed_impact: args.observedImpact ?? null,
          observed_risk: args.observedRisk ?? null,
          note: args.note ?? null,
        },
      },
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    const outcome = response && typeof response === "object" ? (response as any).outcome : null;
    return outcome ?? null;
  } catch {
    return null;
  }
}

export async function requestRecentMemory(limit = 12): Promise<RecentMemoryState> {
  try {
    const response = await fetchJson(`${apiBase()}/system/memory/recent?limit=${limit}`, {
      method: "GET",
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    return normalizeRecentMemory(response);
  } catch {
    return { scenario_records: [], strategy_records: [], comparison_records: [] };
  }
}

export async function requestEvolutionState(): Promise<EvolutionState | null> {
  try {
    const response = await fetchJson(`${apiBase()}/system/evolution/state`, {
      method: "GET",
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    return normalizeEvolutionState(response);
  } catch {
    return null;
  }
}

export async function runEvolutionPass(): Promise<EvolutionState | null> {
  try {
    const response = await fetchJson(`${apiBase()}/system/evolution/run`, {
      method: "POST",
      body: {},
      timeoutMs: 9000,
      retryNetworkErrors: true,
    });
    return normalizeEvolutionState(response);
  } catch {
    return null;
  }
}
