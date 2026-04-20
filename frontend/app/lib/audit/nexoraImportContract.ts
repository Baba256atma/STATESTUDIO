/**
 * B.17.a/b — Validate and normalize pasted Nexora export bundle JSON (no execution, structural only).
 */

import type { NexoraAuditRecord, NexoraAuditDecision, NexoraAuditSourceEntry } from "./nexoraAuditContract.ts";
import type { NexoraExportBundle } from "./nexoraExportContract.ts";
import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

export type NexoraImportResult = {
  ok: boolean;
  bundle: NexoraExportBundle | null;
  error: string | null;
  /** True when parse succeeded and `replaySnapshot` is null (audit-only). */
  auditOnly?: boolean;
};

function asRecord(x: unknown): Record<string, unknown> | null {
  if (x !== null && typeof x === "object" && !Array.isArray(x)) return x as Record<string, unknown>;
  return null;
}

export function isNexoraExportBundleLike(value: unknown): boolean {
  const o = asRecord(value);
  if (!o) return false;
  if (o.version !== "1") return false;
  if (!asRecord(o.record)) return false;
  return true;
}

function normalizeSources(raw: unknown): NexoraAuditSourceEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s, i) => {
    const sr = asRecord(s);
    const connectorId =
      sr && typeof sr.connectorId === "string" && sr.connectorId.trim()
        ? sr.connectorId.trim()
        : `unknown:${i}`;
    const success = sr && typeof sr.success === "boolean" ? sr.success : false;
    const trustScore = sr && typeof sr.trustScore === "number" && Number.isFinite(sr.trustScore) ? sr.trustScore : undefined;
    return { connectorId, success, ...(trustScore !== undefined ? { trustScore } : {}) };
  });
}

function normalizeAuditRecord(input: unknown): { ok: true; record: NexoraAuditRecord } | { ok: false; error: string } {
  const o = asRecord(input);
  if (!o) return { ok: false, error: "audit: record must be an object" };
  if (typeof o.runId !== "string" || !o.runId.trim()) return { ok: false, error: "audit: runId is required" };
  if (typeof o.timestamp !== "number" || !Number.isFinite(o.timestamp)) {
    return { ok: false, error: "audit: timestamp must be a finite number" };
  }

  const mergeRaw = asRecord(o.merge);
  if (!mergeRaw) return { ok: false, error: "audit: merge is required" };
  const sourceCount = Number(mergeRaw.sourceCount);
  const successfulSourceCount = Number(mergeRaw.successfulSourceCount);
  if (!Number.isFinite(sourceCount) || !Number.isFinite(successfulSourceCount)) {
    return { ok: false, error: "audit: merge.sourceCount and merge.successfulSourceCount must be numbers" };
  }
  const mergedSignalCountRaw = mergeRaw.mergedSignalCount;
  const mergedSignalCount =
    mergedSignalCountRaw !== undefined && mergedSignalCountRaw !== null && Number.isFinite(Number(mergedSignalCountRaw))
      ? Number(mergedSignalCountRaw)
      : 0;

  const signalsRaw = asRecord(o.signals);
  const signalsCount =
    signalsRaw && typeof signalsRaw.count === "number" && Number.isFinite(signalsRaw.count) ? signalsRaw.count : 0;
  const topTypes = Array.isArray(signalsRaw?.topTypes)
    ? (signalsRaw!.topTypes as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  const scannerRaw = asRecord(o.scanner) ?? {};
  const fragilityLevel =
    typeof scannerRaw.fragilityLevel === "string" && scannerRaw.fragilityLevel.trim()
      ? scannerRaw.fragilityLevel.trim()
      : undefined;
  const drivers = Array.isArray(scannerRaw.drivers)
    ? (scannerRaw.drivers as unknown[]).filter((x): x is string => typeof x === "string")
    : undefined;

  const trustRaw = asRecord(o.trust) ?? {};
  const confidenceTier =
    trustRaw.confidenceTier === "low" || trustRaw.confidenceTier === "medium" || trustRaw.confidenceTier === "high"
      ? trustRaw.confidenceTier
      : undefined;
  const summary = typeof trustRaw.summary === "string" ? trustRaw.summary : undefined;
  const warnings = Array.isArray(trustRaw.warnings)
    ? (trustRaw.warnings as unknown[]).filter((x): x is string => typeof x === "string")
    : undefined;

  const decisionRaw = asRecord(o.decision);
  let decision: NexoraAuditDecision | undefined;
  if (decisionRaw) {
    const posture = typeof decisionRaw.posture === "string" ? decisionRaw.posture : undefined;
    const tradeoff = typeof decisionRaw.tradeoff === "string" ? decisionRaw.tradeoff : undefined;
    const nextMove = typeof decisionRaw.nextMove === "string" ? decisionRaw.nextMove : undefined;
    if (posture || tradeoff || nextMove) {
      decision = { posture, tradeoff, nextMove };
    }
  }

  const record: NexoraAuditRecord = {
    runId: o.runId.trim(),
    timestamp: o.timestamp,
    ...(typeof o.domain === "string" && o.domain.trim() ? { domain: o.domain.trim() } : {}),
    sources: normalizeSources(o.sources),
    merge: {
      sourceCount,
      successfulSourceCount,
      mergedSignalCount,
      ...(typeof mergeRaw.sourceTrustSummary === "string" ? { sourceTrustSummary: mergeRaw.sourceTrustSummary } : {}),
    },
    signals: { count: signalsCount, topTypes },
    scanner: {
      ...(fragilityLevel ? { fragilityLevel } : {}),
      ...(drivers && drivers.length > 0 ? { drivers } : {}),
    },
    trust: {
      ...(confidenceTier ? { confidenceTier } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(warnings && warnings.length > 0 ? { warnings } : {}),
    },
    ...(decision ? { decision } : {}),
  };

  return { ok: true, record };
}

function normalizeReplaySnapshot(
  raw: unknown,
  record: NexoraAuditRecord
): { ok: true; snapshot: NexoraReplaySnapshot } | { ok: false; error: string } {
  const o = asRecord(raw);
  if (!o) return { ok: false, error: "replaySnapshot: must be an object" };

  const runId = typeof o.runId === "string" && o.runId.trim() ? o.runId.trim() : record.runId;
  const timestamp =
    typeof o.timestamp === "number" && Number.isFinite(o.timestamp) ? o.timestamp : record.timestamp;

  const sceneRaw = asRecord(o.scene);
  if (!sceneRaw) return { ok: false, error: "replaySnapshot.scene is required" };

  const highlightedObjectIds = Array.isArray(sceneRaw.highlightedObjectIds)
    ? (sceneRaw.highlightedObjectIds as unknown[]).map((x) => String(x).trim()).filter(Boolean)
    : [];

  let focusedObjectId: string | null = null;
  if (sceneRaw.focusedObjectId === null || sceneRaw.focusedObjectId === undefined) {
    focusedObjectId = null;
  } else if (typeof sceneRaw.focusedObjectId === "string") {
    const t = sceneRaw.focusedObjectId.trim();
    focusedObjectId = t.length > 0 ? t : null;
  } else {
    return { ok: false, error: "replaySnapshot.scene.focusedObjectId invalid" };
  }

  let fragilityLevel: string | null = null;
  if (sceneRaw.fragilityLevel === null || sceneRaw.fragilityLevel === undefined) {
    fragilityLevel = null;
  } else if (typeof sceneRaw.fragilityLevel === "string") {
    fragilityLevel = sceneRaw.fragilityLevel.trim() || null;
  } else {
    return { ok: false, error: "replaySnapshot.scene.fragilityLevel invalid" };
  }

  const trustRaw = asRecord(o.trust) ?? {};
  const confidenceTier =
    trustRaw.confidenceTier === "low" || trustRaw.confidenceTier === "medium" || trustRaw.confidenceTier === "high"
      ? trustRaw.confidenceTier
      : undefined;
  let summary: string | null = null;
  if (trustRaw.summary === null) summary = null;
  else if (typeof trustRaw.summary === "string") summary = trustRaw.summary;
  else if (trustRaw.summary !== undefined) return { ok: false, error: "replaySnapshot.trust.summary invalid" };

  const sourcesRaw = asRecord(o.sources);
  const total =
    sourcesRaw && typeof sourcesRaw.total === "number" && Number.isFinite(sourcesRaw.total)
      ? sourcesRaw.total
      : record.merge.sourceCount;
  const successful =
    sourcesRaw && typeof sourcesRaw.successful === "number" && Number.isFinite(sourcesRaw.successful)
      ? sourcesRaw.successful
      : record.merge.successfulSourceCount;

  const decisionRaw = asRecord(o.decision);
  let decision: NexoraReplaySnapshot["decision"];
  if (decisionRaw) {
    const posture = typeof decisionRaw.posture === "string" ? decisionRaw.posture : undefined;
    const tradeoff = typeof decisionRaw.tradeoff === "string" ? decisionRaw.tradeoff : undefined;
    const nextMove = typeof decisionRaw.nextMove === "string" ? decisionRaw.nextMove : undefined;
    if (posture || tradeoff || nextMove) {
      decision = { posture, tradeoff, nextMove };
    }
  }

  const snapshot: NexoraReplaySnapshot = {
    runId,
    timestamp,
    ...(typeof o.domain === "string" && o.domain.trim() ? { domain: o.domain.trim() } : {}),
    scene: {
      focusedObjectId,
      highlightedObjectIds,
      fragilityLevel,
    },
    trust: {
      ...(confidenceTier ? { confidenceTier } : {}),
      summary,
    },
    ...(decision ? { decision } : {}),
    sources: { total, successful },
  };

  return { ok: true, snapshot };
}

/**
 * Parse pasted JSON into a canonical {@link NexoraExportBundle}, or return a stable error string.
 * Extra top-level keys are ignored. Does not execute bundle contents.
 */
export function parseNexoraImportBundle(raw: string): NexoraImportResult {
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (!trimmed) {
    return { ok: false, bundle: null, error: "Paste export bundle JSON first." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed) as unknown;
  } catch {
    return { ok: false, bundle: null, error: "Invalid JSON." };
  }

  if (!isNexoraExportBundleLike(parsed)) {
    return {
      ok: false,
      bundle: null,
      error: 'Not a Nexora export bundle (need version "1" and a record object).',
    };
  }

  const root = asRecord(parsed)!;
  const auditRes = normalizeAuditRecord(root.record);
  if (!auditRes.ok) {
    return { ok: false, bundle: null, error: auditRes.error };
  }

  const exportedAt =
    typeof root.exportedAt === "number" && Number.isFinite(root.exportedAt) ? root.exportedAt : Date.now();

  const replayRaw = root.replaySnapshot;
  let replaySnapshot: NexoraReplaySnapshot | null = null;

  if (replayRaw === null || replayRaw === undefined) {
    replaySnapshot = null;
  } else if (typeof replayRaw === "object" && replayRaw !== null && !Array.isArray(replayRaw)) {
    const snapRes = normalizeReplaySnapshot(replayRaw, auditRes.record);
    if (!snapRes.ok) {
      return { ok: false, bundle: null, error: snapRes.error };
    }
    replaySnapshot = snapRes.snapshot;
  } else {
    return { ok: false, bundle: null, error: "replaySnapshot must be an object or null." };
  }

  const bundle: NexoraExportBundle = {
    version: "1",
    exportedAt,
    record: auditRes.record,
    replaySnapshot,
  };

  return {
    ok: true,
    bundle,
    error: null,
    auditOnly: replaySnapshot === null,
  };
}
