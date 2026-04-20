/**
 * B.20 — Persist execution outcomes (localStorage).
 */

import type { NexoraExecutionOutcome } from "./nexoraExecutionOutcome.ts";

const STORAGE_KEY = "nexora.execution.v1";
const MAX_ENTRIES = 30;

function isValidOutcome(x: unknown): x is NexoraExecutionOutcome {
  if (!x || typeof x !== "object") return false;
  const o = x as NexoraExecutionOutcome;
  return (
    typeof o.runId === "string" &&
    Boolean(o.runId.trim()) &&
    typeof o.recordedAt === "number" &&
    Number.isFinite(o.recordedAt) &&
    typeof o.outcomeScore === "number" &&
    Number.isFinite(o.outcomeScore) &&
    (o.outcomeLabel === "worse" || o.outcomeLabel === "same" || o.outcomeLabel === "better")
  );
}

export function loadExecutionOutcomes(): NexoraExecutionOutcome[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(isValidOutcome);
  } catch {
    return [];
  }
}

export function saveExecutionOutcome(outcome: NexoraExecutionOutcome): void {
  if (typeof window === "undefined") return;
  const prev = loadExecutionOutcomes().filter((e) => e.runId !== outcome.runId);
  prev.unshift(outcome);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prev.slice(0, MAX_ENTRIES)));
}

export function loadExecutionOutcomeForRun(runId?: string | null): NexoraExecutionOutcome | null {
  const id = String(runId ?? "").trim();
  if (!id) return null;
  return loadExecutionOutcomes().find((e) => e.runId === id) ?? null;
}

const b20OutcomeLogDedupe = new Set<string>();

export function emitExecutionOutcomeRecordedDev(outcome: NexoraExecutionOutcome): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${outcome.runId}|${outcome.outcomeLabel}`;
  if (b20OutcomeLogDedupe.has(key)) return;
  b20OutcomeLogDedupe.add(key);
  globalThis.console?.debug?.("[Nexora][B20] execution_outcome_recorded", {
    runId: outcome.runId,
    outcomeLabel: outcome.outcomeLabel,
  });
}
