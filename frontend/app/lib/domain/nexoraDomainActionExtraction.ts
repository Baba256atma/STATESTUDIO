/**
 * B.44 — Ticket / action extraction from B.42 reviews (deterministic; does not change B.42 rules).
 */

import type { NexoraDomainAdoptionReview, NexoraDomainAdoptionStatus } from "./nexoraDomainAdoptionReview.ts";

export type NexoraDomainActionPriority = "critical" | "high" | "medium" | "low";

export type NexoraDomainActionItem = {
  domainId: string;
  title: string;
  description: string;
  priority: NexoraDomainActionPriority;
};

const SEVERITY_ORDER: Record<Exclude<NexoraDomainAdoptionStatus, "healthy">, number> = {
  unstable: 0,
  fallback_heavy: 1,
  underused: 2,
  experimental: 3,
};

const STATUS_TO_PRIORITY: Record<Exclude<NexoraDomainAdoptionStatus, "healthy">, NexoraDomainActionPriority> = {
  unstable: "critical",
  fallback_heavy: "high",
  underused: "medium",
  experimental: "low",
};

const GENERIC_REC = "Review domain pack configuration.";

function reasonForReview(r: NexoraDomainAdoptionReview): string {
  const first = r.issues[0]?.trim();
  if (first) return first.endsWith(".") ? first : `${first}.`;
  switch (r.status) {
    case "unstable":
      return "Domain unstable.";
    case "fallback_heavy":
      return "High fallback rate detected.";
    case "underused":
      return "Low usage.";
    case "experimental":
      return "Domain not yet rolled out for pilot/product.";
    default:
      return "Review domain status.";
  }
}

function recommendationLine(r: NexoraDomainAdoptionReview): string {
  const rec = r.recommendations[0]?.trim();
  return rec && rec !== "No immediate action" ? rec : GENERIC_REC;
}

/**
 * Filters healthy, sorts unstable → fallback_heavy → underused → experimental, keeps top 3.
 */
export function extractDomainActionItems(reviews: readonly NexoraDomainAdoptionReview[]): NexoraDomainActionItem[] {
  const filtered = reviews.filter((x) => x.status !== "healthy");
  filtered.sort((a, b) => {
    const sa = a.status as Exclude<NexoraDomainAdoptionStatus, "healthy">;
    const sb = b.status as Exclude<NexoraDomainAdoptionStatus, "healthy">;
    const ra = SEVERITY_ORDER[sa] ?? 99;
    const rb = SEVERITY_ORDER[sb] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.domainId.localeCompare(b.domainId);
  });
  const top = filtered.slice(0, 3);
  return top.map((r) => {
    const st = r.status as Exclude<NexoraDomainAdoptionStatus, "healthy">;
    return {
      domainId: r.domainId,
      title: recommendationLine(r),
      description: reasonForReview(r),
      priority: STATUS_TO_PRIORITY[st] ?? "medium",
    };
  });
}

function priorityLabel(p: NexoraDomainActionPriority): string {
  return p.toUpperCase();
}

export function formatDomainActionsAsTickets(actions: readonly NexoraDomainActionItem[]): string {
  const lines: string[] = ["Nexora Action Items", ""];
  if (actions.length === 0) {
    lines.push("(no action items — all domains healthy or no data.)", "");
    return lines.join("\n");
  }
  actions.forEach((a, i) => {
    lines.push(`${i + 1}. [${priorityLabel(a.priority)}] ${a.domainId} — ${a.title}`);
    lines.push(`   Reason: ${a.description}`);
    lines.push("");
  });
  return lines.join("\n").replace(/\n+$/, "\n");
}

export function summarizeTopDomainActions(actions: readonly NexoraDomainActionItem[]): string {
  if (actions.length === 0) return "No prioritized actions; domains look healthy.";
  const critical = actions.filter((a) => a.priority === "critical");
  if (critical.length >= 2) {
    const ids = [...new Set(critical.map((c) => c.domainId))].sort().join(" and ");
    return `Critical fixes needed for ${ids} domains.`;
  }
  if (critical.length === 1) {
    return `Critical fix needed for ${critical[0]!.domainId} domain.`;
  }
  const high = actions.filter((a) => a.priority === "high");
  if (high.length === 1) {
    return `Main focus: reduce fallback in ${high[0]!.domainId} domain.`;
  }
  const ids = [...new Set(actions.map((a) => a.domainId))].sort().join(", ");
  return `Top actions: ${ids}.`;
}

export function logDomainActionsGeneratedDev(actions: readonly NexoraDomainActionItem[]): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][B44] domain_actions_generated", { count: actions.length });
}

export function syncDomainActionsDebug(actions: readonly NexoraDomainActionItem[]): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.domainActions = [...actions];
}
