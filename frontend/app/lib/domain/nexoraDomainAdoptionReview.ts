/**
 * B.42 — Domain adoption review / improvement gate (deterministic; no runtime side effects in builder).
 */

import { evaluateAllDomainPackRollouts, type NexoraDomainPackRolloutStatus } from "./nexoraDomainPackRollout.ts";
import { evaluateAllDomainPacksQA, type NexoraDomainPackQAStatus } from "./nexoraDomainPackQA.ts";
import { listNexoraLocaleDomainPacks } from "./nexoraDomainPackRegistry.ts";
import { buildDomainUsageSummary, loadDomainUsage, type NexoraDomainUsageSummary } from "./nexoraDomainUsage.ts";

export type NexoraDomainAdoptionStatus =
  | "healthy"
  | "underused"
  | "fallback_heavy"
  | "unstable"
  | "experimental";

export type NexoraDomainAdoptionReview = {
  domainId: string;
  status: NexoraDomainAdoptionStatus;
  summary: string;
  issues: string[];
  recommendations: string[];
};

const STATUS_RANK: Record<NexoraDomainAdoptionStatus, number> = {
  experimental: 0,
  unstable: 1,
  fallback_heavy: 2,
  underused: 3,
  healthy: 4,
};

let lastB42LogSig: string | null = null;

export function emitDomainAdoptionReviewReadyDevOnce(reviews: readonly NexoraDomainAdoptionReview[]): void {
  if (process.env.NODE_ENV === "production") return;
  const sig = reviews.map((r) => `${r.domainId}:${r.status}`).join("|");
  if (sig === lastB42LogSig) return;
  lastB42LogSig = sig;
  globalThis.console?.debug?.("[Nexora][B42] domain_adoption_review_ready", { count: reviews.length });
}

export function syncNexoraDebugDomainAdoptionReview(reviews: readonly NexoraDomainAdoptionReview[]): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.domainAdoptionReview = [...reviews];
}

function recommendationsFor(status: NexoraDomainAdoptionStatus): string[] {
  switch (status) {
    case "fallback_heavy":
      return ["Improve domain mapping", "Review vocabulary coverage"];
    case "underused":
      return ["Increase domain visibility", "Encourage usage via prompts"];
    case "unstable":
      return ["Fix domain QA coverage", "Complete insight/review mappings"];
    case "experimental":
      return ["Keep in dev testing", "Do not expose to pilot yet"];
    case "healthy":
    default:
      return ["No immediate action"];
  }
}

function buildIssues(args: {
  status: NexoraDomainAdoptionStatus;
  qaStatus: NexoraDomainPackQAStatus;
  qaScore: number;
  totalRequests: number;
  fallbackRate: number;
}): string[] {
  const out: string[] = [];
  if (args.status === "experimental") {
    out.push("Domain not yet rolled out");
  } else if (args.status === "unstable") {
    if (args.qaStatus !== "ready") out.push("QA coverage incomplete");
    if (args.qaScore < 0.75) out.push("Low QA score");
    if (out.length === 0) out.push("QA coverage incomplete");
  } else if (args.status === "fallback_heavy") {
    out.push("High fallback rate");
    if (args.fallbackRate > 0) out.push("Low effective usage");
  } else if (args.status === "underused") {
    out.push("Low usage");
  }
  return out.slice(0, 2);
}

function oneLineSummary(domainLabel: string, status: NexoraDomainAdoptionStatus): string {
  switch (status) {
    case "experimental":
      return `${domainLabel} is experimental (dev-only rollout).`;
    case "unstable":
      return `${domainLabel} is unstable (QA gate not satisfied).`;
    case "fallback_heavy":
      return `${domainLabel} is fallback-heavy at runtime.`;
    case "underused":
      return `${domainLabel} has low recorded usage.`;
    case "healthy":
    default:
      return `${domainLabel} looks healthy for current signals.`;
  }
}

/**
 * Deterministic rule stack (first match wins): experimental → unstable → fallback_heavy → underused → healthy.
 * Exported for focused unit tests.
 */
export function buildDomainAdoptionReviewFromSignals(input: {
  domainId: string;
  domainLabel: string;
  rolloutStatus: NexoraDomainPackRolloutStatus;
  qaStatus: NexoraDomainPackQAStatus;
  qaScore: number;
  totalRequests: number;
  fallbackRate: number;
}): NexoraDomainAdoptionReview {
  const { domainId, domainLabel, rolloutStatus, qaStatus, qaScore, totalRequests, fallbackRate } = input;

  let status: NexoraDomainAdoptionStatus;
  if (rolloutStatus === "dev_only") {
    status = "experimental";
  } else if (qaStatus !== "ready" || qaScore < 0.75) {
    status = "unstable";
  } else if (totalRequests >= 3 && fallbackRate > 0.5) {
    status = "fallback_heavy";
  } else if (totalRequests < 3) {
    status = "underused";
  } else {
    status = "healthy";
  }

  const issues = buildIssues({ status, qaStatus, qaScore, totalRequests, fallbackRate });
  const recommendations = recommendationsFor(status);

  return {
    domainId,
    status,
    summary: oneLineSummary(domainLabel, status),
    issues,
    recommendations,
  };
}

/**
 * Joins B.38 QA, B.39 rollout, and B.41 usage summaries per registry pack. Worst → best sort.
 */
export function buildDomainAdoptionReviews(): NexoraDomainAdoptionReview[] {
  const qaList = evaluateAllDomainPacksQA();
  const rolloutList = evaluateAllDomainPackRollouts();
  const usageList = buildDomainUsageSummary(loadDomainUsage());
  const qaBy = new Map(qaList.map((r) => [r.domainId, r] as const));
  const roBy = new Map(rolloutList.map((r) => [r.domainId, r] as const));
  const usageBy = new Map(usageList.map((u) => [u.domainId, u] as const));

  const packs = listNexoraLocaleDomainPacks();
  const reviews = packs.map((pack) => {
    const qr = qaBy.get(pack.id);
    const rr = roBy.get(pack.id);
    const ur: NexoraDomainUsageSummary | undefined = usageBy.get(pack.id);
    return buildDomainAdoptionReviewFromSignals({
      domainId: pack.id,
      domainLabel: pack.label,
      rolloutStatus: rr?.status ?? "dev_only",
      qaStatus: qr?.status ?? "invalid",
      qaScore: qr?.score ?? 0,
      totalRequests: ur?.totalRequests ?? 0,
      fallbackRate: ur?.fallbackRate ?? 0,
    });
  });

  reviews.sort((a, b) => {
    const ra = STATUS_RANK[a.status];
    const rb = STATUS_RANK[b.status];
    if (ra !== rb) return ra - rb;
    return a.domainId.localeCompare(b.domainId);
  });

  return reviews;
}

export function describeDomainAdoptionHealth(reviews: readonly NexoraDomainAdoptionReview[]): string {
  if (reviews.length === 0) return "No domain reviews available.";
  const fb = reviews.filter((r) => r.status === "fallback_heavy").length;
  if (fb >= 1) return "Fallback issues detected in key domains.";

  const low = reviews.filter((r) => r.status === "underused").length;
  if (low >= 2) return "Several domains are underused.";

  const healthy = reviews.filter((r) => r.status === "healthy").length;
  if (healthy === reviews.length) return "Most domains are healthy.";
  if (healthy >= Math.ceil(reviews.length * 0.6)) return "Most domains are healthy.";

  return "Mixed domain health — review worst-ranked packs.";
}
