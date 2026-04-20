/**
 * B.20 — Execution outcome: decision vs reality (frontend-only; feeds B.19 / B.12).
 */

export const NEXORA_EXECUTION_OUTCOME_RECORDED = "nexora:execution_outcome_recorded" as const;

export type NexoraExecutionOutcome = {
  runId: string;

  expectedFragilityLevel?: string;

  actualFragilityLevel?: string;

  metrics?: Record<string, number>;

  outcomeScore: number;
  outcomeLabel: "worse" | "same" | "better";

  recordedAt: number;
};

function rankFragility(f: string): number {
  const L = String(f ?? "")
    .trim()
    .toLowerCase();
  switch (L) {
    case "low":
      return 0;
    case "medium":
    case "moderate":
      return 1;
    case "high":
      return 2;
    case "critical":
      return 3;
    default:
      return 1;
  }
}

export function evaluateExecutionOutcome(
  expected: string,
  actual: string
): { score: number; label: NexoraExecutionOutcome["outcomeLabel"] } {
  const diff = rankFragility(expected) - rankFragility(actual);

  if (diff > 0) return { score: 1, label: "better" };
  if (diff === 0) return { score: 0, label: "same" };
  return { score: -1, label: "worse" };
}

/** Normalize user / pipeline tokens to evaluation vocabulary. */
export function normalizeOutcomeFragilityInput(raw: string): "low" | "medium" | "high" | "critical" | null {
  const L = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (L === "moderate") return "medium";
  if (L === "low" || L === "medium" || L === "high" || L === "critical") return L;
  return null;
}
