import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCExecutionState } from "./typeCExecutionState.ts";

export type TypeCMemoryEntry = {
  id: string;
  scenarioId: string;
  decisionSummary: string;
  riskLevel: "low" | "medium" | "high";
  outcome: "stable" | "unstable" | "unknown";
  signalsObserved: string[];
  timestamp: number;
};

export type TypeCMemoryState = {
  entries: TypeCMemoryEntry[];
};

export type TypeCLearningSignals = {
  repeatedRisks: string[];
  stablePatterns: string[];
  unstablePatterns: string[];
};

const MAX_MEMORY_ENTRIES = 20;

function sanitizeId(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function titleCaseSignal(signal: string): string {
  const cleaned = signal.trim();
  if (!cleaned) return "System signal";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function outcomeFromRisk(riskLevel: TypeCMemoryEntry["riskLevel"]): TypeCMemoryEntry["outcome"] {
  if (riskLevel === "low") return "stable";
  if (riskLevel === "high") return "unstable";
  return "unknown";
}

function memoryEntryId(input: {
  scenarioId: string;
  startedAt: number | null;
  riskLevel: TypeCMemoryEntry["riskLevel"];
  signalsObserved: string[];
}): string {
  const signalKey = input.signalsObserved.map(sanitizeId).join("_").slice(0, 80) || "no_signals";
  return [
    "typec_memory",
    sanitizeId(input.scenarioId) || "scenario",
    input.startedAt ?? "manual",
    input.riskLevel,
    signalKey,
  ].join("_");
}

export function createEmptyTypeCMemoryState(): TypeCMemoryState {
  return { entries: [] };
}

export function buildTypeCMemoryEntry(input: {
  executionState: TypeCExecutionState;
  decisionRecommendation?: TypeCDecisionRecommendation | null;
  timestamp?: number;
}): TypeCMemoryEntry | null {
  try {
    const scenarioId = String(input.executionState?.scenarioId ?? "").trim();
    if (!scenarioId) return null;
    const signalsObserved = unique(input.executionState.monitoredSignals ?? []).slice(0, 8);
    const riskLevel = input.executionState.riskLevel ?? "low";
    const decisionSummary =
      input.decisionRecommendation?.reasoning?.trim() ||
      input.decisionRecommendation?.nextAction?.trim() ||
      "Execution monitored from local Type-C state.";

    return {
      id: memoryEntryId({
        scenarioId,
        startedAt: input.executionState.startedAt,
        riskLevel,
        signalsObserved,
      }),
      scenarioId,
      decisionSummary,
      riskLevel,
      outcome: outcomeFromRisk(riskLevel),
      signalsObserved,
      timestamp: input.timestamp ?? Date.now(),
    };
  } catch {
    return null;
  }
}

export function addTypeCMemoryEntry(
  state: TypeCMemoryState,
  entry: TypeCMemoryEntry
): TypeCMemoryState {
  const entries = Array.isArray(state?.entries) ? state.entries : [];
  if (!entry?.id) return { entries: [...entries] };
  if (entries.some((candidate) => candidate.id === entry.id)) {
    return { entries: [...entries] };
  }
  return {
    entries: [entry, ...entries].slice(0, MAX_MEMORY_ENTRIES),
  };
}

export function clearTypeCMemory(): TypeCMemoryState {
  return { entries: [] };
}

export function deriveTypeCLearningSignals(state: TypeCMemoryState): TypeCLearningSignals {
  const entries = Array.isArray(state?.entries) ? state.entries : [];
  const signalCounts = new Map<string, number>();

  for (const entry of entries) {
    for (const signal of unique(entry.signalsObserved ?? [])) {
      signalCounts.set(signal, (signalCounts.get(signal) ?? 0) + 1);
    }
  }

  const repeatedRisks = [...signalCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 4)
    .map(([signal]) => `Recurring ${titleCaseSignal(signal)} detected`);

  const stableCount = entries.filter((entry) => entry.outcome === "stable").length;
  const unstableCount = entries.filter((entry) => entry.outcome === "unstable").length;
  const knownCount = stableCount + unstableCount;

  const stablePatterns =
    stableCount >= 2 && stableCount >= unstableCount
      ? ["Pattern shows consistent stability under similar conditions"]
      : [];

  const unstablePatterns =
    unstableCount >= 2 && unstableCount >= stableCount
      ? ["System shows fragility under repeated execution"]
      : knownCount >= 3 && unstableCount > stableCount
        ? ["Unstable outcomes are becoming more frequent than stable outcomes"]
        : [];

  return {
    repeatedRisks,
    stablePatterns,
    unstablePatterns,
  };
}
