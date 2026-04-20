/**
 * HomeScreen-adjacent panel intent + dev tracing helpers.
 * Keeps RightPanelHost / panelController as the authority; no alternate routing.
 */

import { resolveSafeRightPanelView } from "../lib/ui/right-panel/rightPanelRouter";
import type { RightPanelView } from "../lib/ui/right-panel/rightPanelTypes";

function isPanelDevTraceEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

/** Map intent router preferred panel string → safe canonical family view. */
export function resolvePreferredPanelFamilyFromIntent(
  preferredPanel: unknown,
  safeViewReason: "direct_open" | "legacy_alias" | "action_intent" | "unknown" = "action_intent"
): { requestedView: string | null; expectedFamily: RightPanelView | null } {
  const requestedView =
    typeof preferredPanel === "string" && preferredPanel.trim().length > 0 ? preferredPanel : null;
  const expectedFamily = requestedView ? resolveSafeRightPanelView(requestedView, safeViewReason) : null;
  return { requestedView, expectedFamily };
}

/** Merge execution payloads for a single family-audit read (backend wins when present). */
export function panelFamilyDataFromExecutionPayloads(
  backendPayload: unknown,
  localPayload: unknown
): Record<string, unknown> | null {
  const merged = backendPayload ?? localPayload;
  if (merged == null || typeof merged !== "object" || Array.isArray(merged)) return null;
  return merged as Record<string, unknown>;
}

export function logPanelOpen(detail: Record<string, unknown>): void {
  if (!isPanelDevTraceEnabled()) return;
  console.log("[Nexora][Panel][Open]", detail);
}

export function logPanelRejected(detail: Record<string, unknown>): void {
  if (!isPanelDevTraceEnabled()) return;
  console.log("[Nexora][Panel][Rejected]", detail);
}

export function logPanelContinuityPreserved(detail: Record<string, unknown>): void {
  if (!isPanelDevTraceEnabled()) return;
  console.log("[Nexora][Panel][ContinuityPreserved]", detail);
}

export function logPanelGuidedPromptWarn(detail: Record<string, unknown>): void {
  if (!isPanelDevTraceEnabled()) return;
  console.warn("[Nexora][Panel][GuidedPrompt]", detail);
}

export function logPanelClose(detail: Record<string, unknown>): void {
  if (!isPanelDevTraceEnabled()) return;
  console.log("[Nexora][Panel][Close]", detail);
}

/** Controller / adoption trace (panel decision path, not host render). */
export function logPanelDecision(detail: Record<string, unknown>): void {
  if (!isPanelDevTraceEnabled()) return;
  console.log("[Nexora][Panel][Decision]", detail);
}
