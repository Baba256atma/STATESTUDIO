/**
 * Phase 4:1 — Executive Summary Surface logging.
 */

import type { ExecutiveAttentionLevel, ExecutiveSummarySurfaceModel } from "./executiveSummaryContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportExecutiveSummary(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `summary:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveSummary]", detail);
}

export function reportSummaryAggregation(
  sources: readonly string[],
  dashboardContext: string
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `agg:${dashboardContext}:${sources.join(",")}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][SummaryAggregation]", { dashboardContext, sources });
}

export function reportExecutiveAttention(
  attention: ExecutiveAttentionLevel,
  headline: string
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveAttention]", { attention, headline });
}

export function reportExecutiveSummarySurface(model: ExecutiveSummarySurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveSummarySurface]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    attention: model.attention,
    systemStatus: model.systemStatus,
    cardCount: model.cards.length,
    aggregationSources: model.aggregationSources,
    investigateNext: model.investigateNext,
  });
}

export function resetExecutiveSummaryLoggingForTests(): void {
  loggedKeys.clear();
}
