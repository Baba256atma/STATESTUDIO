/**
 * B.15.b — Replay-friendly run snapshot from existing state only (no heavy recompute).
 */

import type { NexoraAuditRecord } from "../lib/audit/nexoraAuditContract.ts";
import type { NexoraPipelineStatusUi } from "./nexoraPipelineStatus.ts";

export type NexoraReplaySnapshot = {
  runId: string;
  timestamp: number;
  domain?: string;
  scene: {
    focusedObjectId?: string | null;
    highlightedObjectIds: string[];
    fragilityLevel?: string | null;
  };
  trust: {
    confidenceTier?: "low" | "medium" | "high";
    summary?: string | null;
  };
  decision?: {
    posture?: string;
    tradeoff?: string;
    nextMove?: string;
  };
  sources: {
    total: number;
    successful: number;
  };
};

export type NexoraReplaySnapshotInput = {
  audit: NexoraAuditRecord;
  pipelineStatus: NexoraPipelineStatusUi;
  focusedObjectId?: string | null;
  highlightedObjectIds?: readonly string[] | null;
};

export function buildNexoraReplaySnapshot(input: NexoraReplaySnapshotInput): NexoraReplaySnapshot {
  const { audit, pipelineStatus: p, focusedObjectId, highlightedObjectIds } = input;
  const ids = [...(highlightedObjectIds ?? [])].map((x) => String(x).trim()).filter(Boolean);
  const uniq = Array.from(new Set(ids));

  const decision =
    audit.decision && (audit.decision.posture || audit.decision.tradeoff || audit.decision.nextMove)
      ? {
          posture: audit.decision.posture,
          tradeoff: audit.decision.tradeoff,
          nextMove: audit.decision.nextMove,
        }
      : undefined;

  return {
    runId: audit.runId,
    timestamp: audit.timestamp,
    domain: audit.domain,
    scene: {
      focusedObjectId: focusedObjectId?.trim() || null,
      highlightedObjectIds: uniq,
      fragilityLevel: p.fragilityLevel ?? audit.scanner.fragilityLevel ?? null,
    },
    trust: {
      confidenceTier: audit.trust.confidenceTier ?? p.confidenceTier ?? undefined,
      summary: audit.trust.summary ?? p.trustSummaryLine ?? null,
    },
    decision,
    sources: {
      total: audit.merge.sourceCount,
      successful: audit.merge.successfulSourceCount,
    },
  };
}
