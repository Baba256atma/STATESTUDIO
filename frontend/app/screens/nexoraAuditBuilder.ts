/**
 * B.14.b — Build audit record from existing pipeline outputs only (no heavy recompute).
 */

import type { MultiSourceIngestionResponse } from "../lib/api/ingestionApi";
import type { NexoraAuditRecord } from "../lib/audit/nexoraAuditContract.ts";
import { serializeAudit, sortJsonDeterministic } from "../lib/audit/nexoraAuditContract.ts";
import { buildPipelineStatusSignature, type NexoraPipelineStatusUi } from "./nexoraPipelineStatus.ts";

export type NexoraAuditBuilderInput = {
  multiSourceResult?: MultiSourceIngestionResponse | null;
  pipelineStatus: NexoraPipelineStatusUi;
  /** From `pipelineB7ActionContextRef` — posture / trail + driver labels */
  decisionContext?: {
    posture: string | null;
    tradeoff: string | null;
    nextMove: string | null;
    driverLabels?: string[];
  } | null;
  domain?: string | null;
};

function shortRunFingerprint(pipeline: NexoraPipelineStatusUi): string {
  const sig = buildPipelineStatusSignature(pipeline);
  let h = 0;
  for (let i = 0; i < sig.length; i++) h = (Math.imul(31, h) + sig.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 10);
}

function topSignalTypes(multi: MultiSourceIngestionResponse | null | undefined): string[] {
  const signals = multi?.bundle?.signals;
  if (!signals?.length) return [];
  const types = signals.map((s) => String(s.type ?? "").trim()).filter(Boolean);
  const freq = new Map<string, number>();
  for (const t of types) freq.set(t, (freq.get(t) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([t]) => t);
}

export function buildNexoraAuditRecord(input: NexoraAuditBuilderInput): NexoraAuditRecord {
  const { pipelineStatus: p, multiSourceResult: multi, decisionContext: ctx, domain } = input;
  const ts = typeof p.updatedAt === "number" ? p.updatedAt : Date.now();
  const meta = multi?.bundle?.merge_meta ?? {};
  const hasMultiHud = p.multiSourceSourceCount != null && p.multiSourceSourceCount > 0;
  const srcCount = Number(meta.source_count ?? (hasMultiHud ? (p.multiSourceSourceCount ?? 0) : 0)) || 0;
  const okCount = Number(meta.successful_source_count ?? (hasMultiHud ? (p.multiSourceSuccessfulCount ?? 0) : 0)) || 0;
  const mergedCount = Number(meta.merged_signal_count ?? p.multiSourceMergedSignalCount ?? p.signalsCount ?? 0);
  const trustSummary = typeof meta.source_trust_summary === "string" ? meta.source_trust_summary : undefined;

  const weightsRaw = meta.source_weights;
  const weights =
    weightsRaw && typeof weightsRaw === "object" && !Array.isArray(weightsRaw)
      ? (weightsRaw as Record<string, unknown>)
      : null;

  const sources =
    multi?.bundle?.sources?.map((s) => {
      const cid = String(s.connector_id ?? "").trim() || "unknown";
      let trustScore: number | undefined;
      if (weights && typeof weights[cid] === "number" && Number.isFinite(weights[cid] as number)) {
        trustScore = weights[cid] as number;
      }
      return { connectorId: cid, trustScore, success: Boolean(s.ok) };
    }) ?? [];

  const decision: NexoraAuditRecord["decision"] | undefined =
    ctx && (ctx.posture || ctx.tradeoff || ctx.nextMove)
      ? {
          posture: ctx.posture ?? undefined,
          tradeoff: ctx.tradeoff ?? undefined,
          nextMove: ctx.nextMove ?? undefined,
        }
      : undefined;

  const driverLabels = ctx?.driverLabels?.map((x) => String(x).trim()).filter(Boolean).slice(0, 12);

  const record: NexoraAuditRecord = {
    runId: `nr_${ts}_${shortRunFingerprint(p)}`,
    timestamp: ts,
    domain: domain?.trim() || undefined,
    sources,
    merge: {
      sourceCount: hasMultiHud
        ? Math.max(srcCount, sources.length, p.multiSourceSourceCount ?? 0)
        : mergedCount > 0
          ? 1
          : 0,
      successfulSourceCount: hasMultiHud
        ? Math.max(okCount, sources.filter((s) => s.success).length, p.multiSourceSuccessfulCount ?? 0)
        : mergedCount > 0
          ? 1
          : 0,
      mergedSignalCount: mergedCount,
      sourceTrustSummary: trustSummary,
    },
    signals: {
      count: p.signalsCount,
      topTypes: topSignalTypes(multi),
    },
    scanner: {
      fragilityLevel: p.fragilityLevel ?? undefined,
      drivers: driverLabels && driverLabels.length > 0 ? driverLabels : undefined,
    },
    trust: {
      confidenceTier: p.confidenceTier ?? undefined,
      summary: p.trustSummaryLine ?? undefined,
      warnings: p.validationWarnings.length > 0 ? [...p.validationWarnings] : undefined,
    },
    decision,
  };

  return record;
}

export function buildNexoraAuditSignature(record: NexoraAuditRecord): string {
  return serializeAudit(record);
}

/** Stable signature for deduping panel resolver / memory writes (excludes volatile ids and timestamps). */
export function buildNexoraAuditSemanticSignature(record: NexoraAuditRecord): string {
  const subset = {
    domain: record.domain,
    sources: record.sources,
    merge: record.merge,
    signals: record.signals,
    scanner: record.scanner,
    trust: record.trust,
    decision: record.decision,
  };
  return JSON.stringify(sortJsonDeterministic(subset));
}
