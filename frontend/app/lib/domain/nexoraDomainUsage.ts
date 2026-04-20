/**
 * B.41 — Domain usage / adoption (local, deterministic; no backend).
 */

import { getNexoraLocalePack, listNexoraLocaleDomainPacks } from "./nexoraDomainPackRegistry.ts";

export type NexoraDomainUsageRecord = {
  domainRequested: string | null;
  domainResolved: string;
  domainEffective: string;
  timestamp: number;
};

export type NexoraDomainUsageSummary = {
  domainId: string;
  totalRequests: number;
  effectiveUses: number;
  fallbackCount: number;
  /** 0–1 */
  fallbackRate: number;
};

export const NEXORA_DOMAIN_USAGE_STORAGE_KEY = "nexora.domainUsage.v1";
export const NEXORA_DOMAIN_USAGE_MAX_RECORDS = 200;

export const NEXORA_DOMAIN_USAGE_CHANGED_EVENT = "nexora:domain-usage-changed";

const lastB41DevLogRunIds = new Set<string>();

function parseStored(raw: string | null): NexoraDomainUsageRecord[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: NexoraDomainUsageRecord[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const ts = typeof o.timestamp === "number" ? o.timestamp : Number(o.timestamp);
      const domainResolved = typeof o.domainResolved === "string" ? o.domainResolved.trim() : "";
      const domainEffective = typeof o.domainEffective === "string" ? o.domainEffective.trim() : "";
      if (!Number.isFinite(ts) || !domainResolved || !domainEffective) continue;
      let domainRequested: string | null = null;
      if (o.domainRequested == null) domainRequested = null;
      else if (typeof o.domainRequested === "string") {
        const t = o.domainRequested.trim();
        domainRequested = t.length ? t : null;
      } else continue;
      out.push({ domainRequested, domainResolved, domainEffective, timestamp: ts });
    }
    return out;
  } catch {
    return [];
  }
}

export function loadDomainUsage(): NexoraDomainUsageRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStored(window.localStorage.getItem(NEXORA_DOMAIN_USAGE_STORAGE_KEY));
  } catch {
    return [];
  }
}

function persistRecords(next: NexoraDomainUsageRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed =
      next.length > NEXORA_DOMAIN_USAGE_MAX_RECORDS
        ? next.slice(next.length - NEXORA_DOMAIN_USAGE_MAX_RECORDS)
        : next;
    window.localStorage.setItem(NEXORA_DOMAIN_USAGE_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore quota / privacy mode */
  }
}

export function syncNexoraDebugDomainUsage(): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const records = loadDomainUsage();
  const summary = buildDomainUsageSummary(records);
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.domainUsage = { records, summary };
}

export function emitDomainUsageLoggedDevOnce(runId: string): void {
  if (process.env.NODE_ENV === "production") return;
  const id = runId.trim() || "unknown";
  if (lastB41DevLogRunIds.has(id)) return;
  if (lastB41DevLogRunIds.size > 400) lastB41DevLogRunIds.clear();
  lastB41DevLogRunIds.add(id);
  globalThis.console?.debug?.("[Nexora][B41] domain_usage_logged", { runId: id });
}

export function logDomainUsage(record: NexoraDomainUsageRecord): void {
  if (typeof window === "undefined") return;
  const prev = loadDomainUsage();
  persistRecords([...prev, record]);
  syncNexoraDebugDomainUsage();
  try {
    window.dispatchEvent(new CustomEvent(NEXORA_DOMAIN_USAGE_CHANGED_EVENT));
  } catch {
    /* ignore */
  }
}

export function clearDomainUsage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(NEXORA_DOMAIN_USAGE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  syncNexoraDebugDomainUsage();
  try {
    window.dispatchEvent(new CustomEvent(NEXORA_DOMAIN_USAGE_CHANGED_EVENT));
  } catch {
    /* ignore */
  }
}

/**
 * Group by **resolved** domain (registry id after B.37).
 * effectiveUses = count where effective === resolved; fallback otherwise.
 */
export function buildDomainUsageSummary(records: NexoraDomainUsageRecord[]): NexoraDomainUsageSummary[] {
  const byResolved = new Map<string, NexoraDomainUsageRecord[]>();
  for (const r of records) {
    const id = r.domainResolved.trim() || "generic";
    const list = byResolved.get(id) ?? [];
    list.push(r);
    byResolved.set(id, list);
  }
  const out: NexoraDomainUsageSummary[] = [];
  for (const [domainId, list] of byResolved) {
    const totalRequests = list.length;
    let effectiveUses = 0;
    let fallbackCount = 0;
    for (const row of list) {
      if (row.domainEffective === row.domainResolved) effectiveUses += 1;
      else fallbackCount += 1;
    }
    out.push({
      domainId,
      totalRequests,
      effectiveUses,
      fallbackCount,
      fallbackRate: totalRequests === 0 ? 0 : fallbackCount / totalRequests,
    });
  }
  out.sort((a, b) => {
    if (b.totalRequests !== a.totalRequests) return b.totalRequests - a.totalRequests;
    return a.domainId.localeCompare(b.domainId);
  });
  return out;
}

export function describeDomainAdoption(summary: NexoraDomainUsageSummary[]): string {
  if (summary.length === 0) return "No domain usage recorded yet.";
  const totalAll = summary.reduce((n, s) => n + s.totalRequests, 0);
  if (totalAll === 0) return "No domain usage recorded yet.";

  const totalFallback = summary.reduce((n, s) => n + s.fallbackCount, 0);
  if (totalFallback / totalAll > 0.45) {
    return "Most usage falls back to generic domain.";
  }

  const nonGeneric = summary.filter((s) => s.domainId !== "generic");
  const sortedNg = [...nonGeneric].sort((a, b) => b.totalRequests - a.totalRequests);
  const star = sortedNg.find((s) => s.totalRequests >= 3 && s.fallbackRate <= 0.25);
  if (star) {
    const label = getNexoraLocalePack(star.domainId).label;
    return `${label} domain is actively used with low fallback.`;
  }

  const low = [...nonGeneric]
    .filter((s) => s.totalRequests > 0 && s.totalRequests < 3)
    .sort((a, b) => a.totalRequests - b.totalRequests || a.domainId.localeCompare(b.domainId))[0];
  if (low) {
    const label = getNexoraLocalePack(low.domainId).label;
    return `${label} domain has low adoption.`;
  }

  const top = [...summary].sort((a, b) => b.totalRequests - a.totalRequests || a.domainId.localeCompare(b.domainId))[0];
  const label = getNexoraLocalePack(top.domainId).label;
  return `${label} sees the most recorded sessions (${top.totalRequests}).`;
}

export function adoptionStatusHint(s: NexoraDomainUsageSummary): "High fallback" | "Low usage" | "Healthy" {
  if (s.fallbackRate > 0.5) return "High fallback";
  if (s.totalRequests < 3) return "Low usage";
  return "Healthy";
}

/** Merge registry packs with summary for dev UI (zeros for unseen domains). */
export function buildDomainUsageAdoptionRows(
  records: NexoraDomainUsageRecord[],
): Array<NexoraDomainUsageSummary & { label: string }> {
  const summary = buildDomainUsageSummary(records);
  const byId = new Map(summary.map((x) => [x.domainId, x]));
  const packs = listNexoraLocaleDomainPacks();
  const rows: Array<NexoraDomainUsageSummary & { label: string }> = packs.map((p) => {
    const s = byId.get(p.id);
    if (s) return { ...s, label: p.label };
    return {
      domainId: p.id,
      label: p.label,
      totalRequests: 0,
      effectiveUses: 0,
      fallbackCount: 0,
      fallbackRate: 0,
    };
  });
  rows.sort((a, b) => {
    if (b.totalRequests !== a.totalRequests) return b.totalRequests - a.totalRequests;
    return a.domainId.localeCompare(b.domainId);
  });
  return rows;
}
