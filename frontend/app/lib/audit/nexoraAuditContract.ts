/**
 * B.14 — Canonical audit record for governance / export (structured, not raw logs).
 */

export type NexoraAuditSourceEntry = {
  connectorId: string;
  trustScore?: number;
  success: boolean;
};

export type NexoraAuditMerge = {
  sourceCount: number;
  successfulSourceCount: number;
  mergedSignalCount: number;
  sourceTrustSummary?: string;
};

export type NexoraAuditSignals = {
  count: number;
  topTypes: string[];
};

export type NexoraAuditScanner = {
  fragilityLevel?: string;
  drivers?: string[];
};

export type NexoraAuditTrust = {
  confidenceTier?: "low" | "medium" | "high";
  summary?: string;
  warnings?: string[];
};

export type NexoraAuditDecision = {
  posture?: string;
  nextMove?: string;
  tradeoff?: string;
};

/** Compact, JSON-safe audit snapshot for one Nexora assessment outcome. */
export type NexoraAuditRecord = {
  runId: string;
  timestamp: number;
  domain?: string;
  sources: NexoraAuditSourceEntry[];
  merge: NexoraAuditMerge;
  signals: NexoraAuditSignals;
  scanner: NexoraAuditScanner;
  trust: NexoraAuditTrust;
  decision?: NexoraAuditDecision;
};

/** Recursive key sort for deterministic JSON (B.14 / B.15). */
export function sortJsonDeterministic(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortJsonDeterministic);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj).sort()) {
    out[k] = sortJsonDeterministic(obj[k]);
  }
  return out;
}

/** Deterministic JSON for export / replay / enterprise sinks (stable key order). */
export function serializeAudit(record: NexoraAuditRecord): string {
  return JSON.stringify(sortJsonDeterministic(record) as NexoraAuditRecord);
}
