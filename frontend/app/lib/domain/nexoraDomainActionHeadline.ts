/**
 * B.45 — Single execution-focus line from B.44 action items (deterministic; no AI).
 */

import type { NexoraDomainActionItem, NexoraDomainActionPriority } from "./nexoraDomainActionExtraction.ts";

export type NexoraActionHeadline = {
  headline: string;
  hint?: string;
};

function trimTitleForHeadline(title: string): string {
  return String(title ?? "").replace(/\.+$/, "").trim() || "this workstream";
}

function hintForPriority(p: NexoraDomainActionPriority): string | undefined {
  switch (p) {
    case "critical":
      return "Complete QA coverage.";
    case "high":
      return "Start with mapping or vocabulary fixes.";
    case "medium":
      return "Encourage usage through prompts.";
    case "low":
      return "Keep validating in dev before pilot.";
    default:
      return undefined;
  }
}

/**
 * Builds one calm focus line (+ optional hint) from the same `NexoraDomainActionItem[]` as B.44.
 */
export function buildDomainActionHeadline(actions: readonly NexoraDomainActionItem[]): NexoraActionHeadline {
  if (actions.length === 0) {
    return { headline: "No immediate action required." };
  }

  if (actions.length === 1) {
    const a = actions[0]!;
    const t = trimTitleForHeadline(a.title);
    const headline = `Focus: ${t} in ${a.domainId}.`;
    const hint = hintForPriority(a.priority);
    return hint ? { headline, hint } : { headline };
  }

  const top = actions[0]!;
  let headline: string;
  switch (top.priority) {
    case "critical":
      headline = `Critical: fix ${top.domainId} domain issues.`;
      break;
    case "high":
      headline = `Focus: reduce fallback in ${top.domainId}.`;
      break;
    case "medium":
      headline = `Improve usage of ${top.domainId} domain.`;
      break;
    case "low":
    default:
      headline = `Continue improving ${top.domainId} domain.`;
      break;
  }
  const hint = hintForPriority(top.priority);
  return hint ? { headline, hint } : { headline };
}

let lastB45LogSig: string | null = null;

export function emitDomainActionHeadlineReadyDevOnce(headline: NexoraActionHeadline): void {
  if (process.env.NODE_ENV === "production") return;
  const sig = `${headline.headline}|${headline.hint ?? ""}`;
  if (sig === lastB45LogSig) return;
  lastB45LogSig = sig;
  globalThis.console?.debug?.("[Nexora][B45] action_headline_ready", {
    hasHint: Boolean(headline.hint),
  });
}

export function syncDomainActionHeadlineDebug(headline: NexoraActionHeadline): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.domainActionHeadline = { ...headline };
}
