/**
 * MRP_HUD:10:5A — Object click panel dedup diagnostics.
 */

import type { ObjectSelectionPanelIntent } from "./objectClickPanelDedupContract.ts";
import { buildObjectClickPanelIntentSignature } from "./objectClickPanelDedupContract.ts";

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceObjectClickPanelWriteApplied(input: {
  intent: ObjectSelectionPanelIntent;
  reason: "changed_object" | "changed_mode" | "first_apply";
}): void {
  if (!isDev()) return;
  const signature = buildObjectClickPanelIntentSignature(input.intent);
  globalThis.console?.log?.(
    `[NexoraObjectClickDedup]\naction=write_applied\nreason=${input.reason}\nobjectId=${input.intent.objectId}\nsignature=${signature}`
  );
}

export function traceObjectClickPanelWriteSkipped(input: {
  intent: ObjectSelectionPanelIntent;
  reason: "duplicate_signature" | "same_object_reclick";
}): void {
  if (!isDev()) return;
  const signature = buildObjectClickPanelIntentSignature(input.intent);
  globalThis.console?.log?.(
    `[NexoraObjectClickDedup]\naction=write_skipped\nreason=${input.reason}\nobjectId=${input.intent.objectId}\nsignature=${signature}`
  );
}

export function traceObjectClickLegacyRedirectAbsorbed(input: {
  objectId: string;
  from: string;
  to: string;
}): void {
  if (!isDev()) return;
  globalThis.console?.log?.(
    `[NexoraObjectClickDedup]\naction=legacy_redirect_absorbed\nfrom=${input.from}\nto=${input.to}\nobjectId=${input.objectId}`
  );
}
