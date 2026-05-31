/** E2:55 — Temporary overlay lifecycle: appear, serve purpose, expire, remove. */

import { isTemporarySceneOverlay, type SceneOverlayId } from "./sceneOverlayPriority";

export type SceneOverlayLifecycleState = "hidden" | "active" | "expired";

export type SceneOverlayLifecycleContext = {
  overlayId: SceneOverlayId;
  elapsedSeconds: number;
  dismissed: boolean;
  purposeServed: boolean;
};

const TEMPORARY_TTL_SECONDS: Partial<Record<SceneOverlayId, number>> = {
  executiveOrientationPanel: 35,
  executiveOrientationWelcome: 120,
  analysisHandoffBanner: 12,
  centerHelperCopy: 45,
  gettingStartedHelper: 45,
  objectInfoEmptyPlaceholder: 0,
};

export function resolveOverlayLifecycleState(context: SceneOverlayLifecycleContext): SceneOverlayLifecycleState {
  if (!isTemporarySceneOverlay(context.overlayId)) return context.dismissed ? "hidden" : "active";
  if (context.dismissed || context.purposeServed) return "expired";
  const ttl = TEMPORARY_TTL_SECONDS[context.overlayId];
  if (typeof ttl === "number" && ttl > 0 && context.elapsedSeconds >= ttl) return "expired";
  if (context.overlayId === "objectInfoEmptyPlaceholder") return "hidden";
  return "active";
}

export function shouldExpireTemporaryOverlay(context: SceneOverlayLifecycleContext): boolean {
  return resolveOverlayLifecycleState(context) === "expired";
}

export function logOverlayLifecycle(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][OverlayLifecycle]", payload);
}
