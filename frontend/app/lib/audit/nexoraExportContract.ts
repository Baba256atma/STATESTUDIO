/**
 * B.15.a — Canonical export bundle for a Nexora run (audit + replay snapshot).
 */

import type { NexoraAuditRecord } from "./nexoraAuditContract.ts";
import { sortJsonDeterministic } from "./nexoraAuditContract.ts";
import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

export type NexoraExportBundle = {
  version: "1";
  exportedAt: number;
  record: NexoraAuditRecord;
  replaySnapshot: NexoraReplaySnapshot | null;
};

export function buildNexoraExportBundle(params: {
  record: NexoraAuditRecord;
  replaySnapshot: NexoraReplaySnapshot | null;
  exportedAt?: number;
}): NexoraExportBundle {
  return {
    version: "1",
    exportedAt: typeof params.exportedAt === "number" ? params.exportedAt : Date.now(),
    record: params.record,
    replaySnapshot: params.replaySnapshot,
  };
}

/** Full bundle JSON (includes exportedAt). */
export function serializeExportBundle(bundle: NexoraExportBundle): string {
  return JSON.stringify(sortJsonDeterministic(bundle) as NexoraExportBundle);
}

/** Stable fingerprint ignoring exportedAt (dedupe / logging). */
export function exportBundleStableSignature(bundle: NexoraExportBundle): string {
  return JSON.stringify(
    sortJsonDeterministic({
      version: bundle.version,
      record: bundle.record,
      replaySnapshot: bundle.replaySnapshot,
      exportedAt: 0,
    })
  );
}
