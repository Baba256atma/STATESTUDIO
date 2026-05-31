/**
 * E2 — Executive orientation welcome visibility (hydration-safe lifecycle).
 *
 * SSR → hidden
 * Client first render → hidden
 * useEffect → read storage → show if first visit
 */

import { SSR_EXECUTIVE_ORIENTATION_SNAPSHOT } from "./executiveHydrationContract";
import type { ExecutiveOrientationSnapshot } from "./orientation/executiveOrientationTypes";

export type ExecutiveOrientationWelcomeVisibilityInput = {
  hydrated: boolean;
  surfaceEnabled: boolean;
  welcomeShowWelcome: boolean;
  centerComponentActive: boolean;
};

const identityLogKeys = new Set<string>();

export function getExecutiveOrientationHydrationSnapshot(): ExecutiveOrientationSnapshot {
  return SSR_EXECUTIVE_ORIENTATION_SNAPSHOT;
}

export function resolveExecutiveOrientationWelcomeVisible(
  input: ExecutiveOrientationWelcomeVisibilityInput
): boolean {
  if (!input.hydrated) return false;
  if (!input.surfaceEnabled) return false;
  if (input.centerComponentActive) return false;
  return input.welcomeShowWelcome;
}

export function resolveExecutiveOrientationPanelVisible(input: {
  hydrated: boolean;
  surfaceEnabled: boolean;
  tier: ExecutiveOrientationSnapshot["tier"];
  overlayAllowed: boolean;
}): boolean {
  if (!input.hydrated) return false;
  if (!input.surfaceEnabled) return false;
  if (input.tier === "experiencedUser") return false;
  return input.overlayAllowed;
}

export function resolveOrientationWelcomeFromStorage(snapshot: ExecutiveOrientationSnapshot): boolean {
  return snapshot.isFirstVisit && !snapshot.welcomeDismissed;
}

function logOrientationDiagnostic(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (identityLogKeys.has(key)) return;
  identityLogKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function traceExecutiveOrientationHydration(payload: {
  hydrated: boolean;
  source: string;
}): void {
  logOrientationDiagnostic("[Nexora][OrientationHydration]", payload);
}

export function traceExecutiveOrientationVisibility(payload: {
  serverVisible: boolean;
  clientVisible: boolean;
  storageVisible: boolean;
  hydrated: boolean;
}): void {
  logOrientationDiagnostic("[Nexora][OrientationVisibility]", payload);
  if (payload.hydrated && payload.clientVisible !== payload.serverVisible) {
    logOrientationDiagnostic("[Nexora][OrientationSSR]", {
      serverVisible: payload.serverVisible,
      clientVisible: payload.clientVisible,
      storageVisible: payload.storageVisible,
      note: "post_hydration_reveal",
    });
  }
}

export function resetExecutiveOrientationVisibilityLogsForTests(): void {
  identityLogKeys.clear();
}
