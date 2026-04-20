/**
 * B.43 — Domain adoption export / handoff (JSON + compact text; reuses B.42 builder only).
 */

import {
  buildDomainAdoptionReviews,
  type NexoraDomainAdoptionReview,
} from "./nexoraDomainAdoptionReview.ts";

export type NexoraDomainAdoptionExportBundle = {
  exportedAt: number;
  reviews: NexoraDomainAdoptionReview[];
};

function sortReviewsForExport(reviews: readonly NexoraDomainAdoptionReview[]): NexoraDomainAdoptionReview[] {
  return [...reviews].sort((a, b) => a.domainId.localeCompare(b.domainId));
}

/** Reuses `buildDomainAdoptionReviews()`; reviews sorted by `domainId` for stable JSON. */
export function buildDomainAdoptionExportBundle(): NexoraDomainAdoptionExportBundle {
  const reviews = sortReviewsForExport(buildDomainAdoptionReviews());
  return {
    exportedAt: Date.now(),
    reviews,
  };
}

export function serializeDomainAdoptionExportBundle(bundle: NexoraDomainAdoptionExportBundle): string {
  const stable: NexoraDomainAdoptionExportBundle = {
    exportedAt: bundle.exportedAt,
    reviews: sortReviewsForExport(bundle.reviews),
  };
  return `${JSON.stringify(stable, null, 2)}\n`;
}

function statusLabel(status: NexoraDomainAdoptionReview["status"]): string {
  return status.replace(/_/g, " ");
}

/** Compact, deterministic text for tickets / runbooks (no markdown tables). */
export function formatDomainAdoptionReviewForHandoff(reviews: readonly NexoraDomainAdoptionReview[]): string {
  const lines: string[] = ["Domain Review Summary", ""];
  const sorted = sortReviewsForExport(reviews);
  if (sorted.length === 0) {
    lines.push("(no domains reviewed)", "");
    return lines.join("\n");
  }
  for (const r of sorted) {
    const issue = r.issues[0]?.trim() || "none";
    const next = r.recommendations[0]?.trim() || "none";
    lines.push(`- ${r.domainId} — ${statusLabel(r.status)}`);
    lines.push(`  issue: ${issue}`);
    lines.push(`  next: ${next}`);
    lines.push("");
  }
  return lines.join("\n").replace(/\n+$/, "\n");
}

export async function copyAdoptionExportText(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function logDomainAdoptionExportCopiedDev(kind: "json" | "text"): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][B43] domain_adoption_export_copied", { kind });
}

/** Optional: refresh debug snapshot (call from copy actions, not on render). */
export function syncDomainAdoptionExportDebug(bundle: NexoraDomainAdoptionExportBundle): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.domainAdoptionExport = bundle;
}
