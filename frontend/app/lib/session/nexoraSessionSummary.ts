/**
 * B.48 — Pilot session end-of-run brief (deterministic, copy-ready; no persistence, no LLM).
 */

import type { NexoraActionHeadline } from "../domain/nexoraDomainActionHeadline.ts";
import type { NexoraDomainActionItem } from "../domain/nexoraDomainActionExtraction.ts";

export type NexoraSessionSummary = {
  focus: string;
  outcome?: string;
  insight: string;
  nextAction: string;
};

const HIGH_CONFUSION = 0.2;
const STRONG_HELPFUL = 0.55;
const LOW_CONFUSION_FOR_USEFUL = 0.15;

function pickOutcome(
  feedback: { helpfulRate: number; confusionRate: number } | null | undefined,
): string | undefined {
  if (!feedback) return undefined;
  const { helpfulRate: h, confusionRate: c } = feedback;
  if (c >= HIGH_CONFUSION) return "Results were unclear.";
  if (h >= STRONG_HELPFUL && c < LOW_CONFUSION_FOR_USEFUL) return "Results were useful.";
  return undefined;
}

function pickInsight(quality: { tier: string; trend: string } | null | undefined): string {
  const tier = quality?.tier?.trim().toLowerCase();
  const trend = quality?.trend?.trim().toLowerCase();
  if (tier === "low") return "Decision quality needs improvement.";
  if (trend === "improving") return "System is improving.";
  return "Analysis completed successfully.";
}

function pickNextAction(actions: readonly NexoraDomainActionItem[]): string {
  const a = actions[0];
  const t = a?.title?.trim();
  return t && t.length > 0 ? t : "No immediate action required.";
}

export function buildSessionSummary(input: {
  headline: NexoraActionHeadline;
  actions: readonly NexoraDomainActionItem[];
  feedbackSummary?: { helpfulRate: number; confusionRate: number } | null;
  quality?: { tier: string; trend: string } | null;
}): NexoraSessionSummary {
  const focus = input.headline.headline.trim();
  const outcome = pickOutcome(input.feedbackSummary ?? undefined);
  const insight = pickInsight(input.quality ?? undefined);
  const nextAction = pickNextAction(input.actions);
  const out: NexoraSessionSummary = { focus, insight, nextAction };
  if (outcome) out.outcome = outcome;
  return out;
}

export function formatSessionSummary(summary: NexoraSessionSummary): string {
  const lines: string[] = ["Nexora Session Summary", ""];
  lines.push("Focus:", summary.focus, "");
  if (summary.outcome?.trim()) {
    lines.push("Outcome:", summary.outcome.trim(), "");
  }
  lines.push("Insight:", summary.insight, "");
  lines.push("Next:", summary.nextAction, "");
  return lines.join("\n").replace(/\n+$/, "\n");
}

export function emitSessionSummaryGeneratedDev(summary: NexoraSessionSummary): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][B48] session_summary_generated", {
    hasOutcome: Boolean(summary.outcome),
  });
}

export function syncSessionSummaryDebug(summary: NexoraSessionSummary): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.sessionSummary = { ...summary };
}
