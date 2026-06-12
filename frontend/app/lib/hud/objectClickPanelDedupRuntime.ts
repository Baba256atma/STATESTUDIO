/**
 * MRP_HUD:10:5A — Object click panel authority deduplication runtime.
 * Ref-based signature guard scoped to interaction frame (clickEventId).
 */

import {
  buildObjectClickPanelIntent,
  buildObjectClickPanelIntentSignature,
  OBJECT_CLICK_PANEL_DEDUP_FRAME_MS,
  type ObjectClickPanelDedupDecision,
  type ObjectClickPanelDedupFrame,
  type ObjectSelectionPanelIntent,
} from "./objectClickPanelDedupContract.ts";
import {
  traceObjectClickLegacyRedirectAbsorbed,
  traceObjectClickPanelWriteApplied,
  traceObjectClickPanelWriteSkipped,
} from "./objectClickPanelDedupDiagnostics.ts";

let lastAppliedFrame: ObjectClickPanelDedupFrame | null = null;
let lastAppliedSignature: string | null = null;
let lastAppliedObjectId: string | null = null;
let legacyRedirectAbsorbedForFrame: string | null = null;

export function evaluateObjectClickPanelIntent(input: {
  objectId: string;
  clickEventId: string;
  previousObjectId?: string | null;
  now?: number;
}): { intent: ObjectSelectionPanelIntent; decision: ObjectClickPanelDedupDecision } {
  const intent = buildObjectClickPanelIntent(input.objectId);
  const signature = buildObjectClickPanelIntentSignature(intent);
  const now = input.now ?? Date.now();
  const previousObjectId = input.previousObjectId?.trim() || null;

  if (
    lastAppliedFrame &&
    lastAppliedFrame.signature === signature &&
    lastAppliedFrame.clickEventId === input.clickEventId &&
    now - lastAppliedFrame.appliedAt < OBJECT_CLICK_PANEL_DEDUP_FRAME_MS
  ) {
    return { intent, decision: { action: "skip", reason: "duplicate_signature" } };
  }

  if (
    previousObjectId === intent.objectId &&
    lastAppliedSignature === signature &&
    lastAppliedObjectId === intent.objectId &&
    lastAppliedFrame &&
    now - lastAppliedFrame.appliedAt < OBJECT_CLICK_PANEL_DEDUP_FRAME_MS
  ) {
    return { intent, decision: { action: "skip", reason: "same_object_reclick" } };
  }

  const reason =
    previousObjectId == null || previousObjectId !== intent.objectId
      ? "changed_object"
      : "changed_mode";

  return { intent, decision: { action: "apply", reason: reason === "changed_object" ? "changed_object" : "changed_mode" } };
}

export function markObjectClickPanelIntentApplied(input: {
  intent: ObjectSelectionPanelIntent;
  clickEventId: string;
  reason: "changed_object" | "changed_mode" | "first_apply";
  now?: number;
}): void {
  const signature = buildObjectClickPanelIntentSignature(input.intent);
  const now = input.now ?? Date.now();
  lastAppliedFrame = Object.freeze({
    clickEventId: input.clickEventId,
    signature,
    appliedAt: now,
  });
  lastAppliedSignature = signature;
  lastAppliedObjectId = input.intent.objectId;
  traceObjectClickPanelWriteApplied({ intent: input.intent, reason: input.reason });
}

export function skipObjectClickPanelIntent(input: {
  intent: ObjectSelectionPanelIntent;
  reason: "duplicate_signature" | "same_object_reclick";
}): void {
  traceObjectClickPanelWriteSkipped({ intent: input.intent, reason: input.reason });
}

export function absorbObjectClickLegacyRedirect(input: {
  objectId: string;
  clickEventId: string;
  from?: string;
  to?: string;
}): void {
  const frameKey = `${input.clickEventId}::legacy_redirect`;
  if (legacyRedirectAbsorbedForFrame === frameKey) return;
  legacyRedirectAbsorbedForFrame = frameKey;
  traceObjectClickLegacyRedirectAbsorbed({
    objectId: input.objectId,
    from: input.from ?? "object",
    to: input.to ?? "dashboard",
  });
}

export function isObjectClickPanelIntentApplied(input: {
  objectId: string;
  clickEventId: string;
  now?: number;
}): boolean {
  const intent = buildObjectClickPanelIntent(input.objectId);
  const signature = buildObjectClickPanelIntentSignature(intent);
  const now = input.now ?? Date.now();
  return (
    lastAppliedFrame != null &&
    lastAppliedFrame.clickEventId === input.clickEventId &&
    lastAppliedFrame.signature === signature &&
    now - lastAppliedFrame.appliedAt < OBJECT_CLICK_PANEL_DEDUP_FRAME_MS
  );
}

export function resetObjectClickPanelDedupForTests(): void {
  lastAppliedFrame = null;
  lastAppliedSignature = null;
  lastAppliedObjectId = null;
  legacyRedirectAbsorbedForFrame = null;
}
